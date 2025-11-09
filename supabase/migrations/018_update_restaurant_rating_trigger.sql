-- Migration 018: Create trigger to update restaurant rating when reviews are added/updated/deleted

-- Function to recalculate restaurant rating
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the restaurant's rating and total_reviews
  UPDATE restaurants
  SET 
    rating = COALESCE(
      (SELECT AVG(rating)::numeric(3,2) 
       FROM reviews 
       WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id) 
       AND is_visible = true),
      0
    ),
    total_reviews = COALESCE(
      (SELECT COUNT(*) 
       FROM reviews 
       WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id) 
       AND is_visible = true),
      0
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS trigger_update_rating_on_insert ON reviews;
CREATE TRIGGER trigger_update_rating_on_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_rating();

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS trigger_update_rating_on_update ON reviews;
CREATE TRIGGER trigger_update_rating_on_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_rating();

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS trigger_update_rating_on_delete ON reviews;
CREATE TRIGGER trigger_update_rating_on_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_restaurant_rating();
