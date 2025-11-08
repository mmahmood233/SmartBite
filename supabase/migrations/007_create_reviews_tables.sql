-- Migration 007: Create Reviews and Ratings Tables

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photo_url TEXT,
  is_visible BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, order_id)
);

-- Review tags
CREATE TABLE review_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_restaurant_rating ON reviews(restaurant_id, rating DESC, created_at DESC);

CREATE INDEX idx_review_tags_review_id ON review_tags(review_id);
CREATE INDEX idx_review_tags_tag ON review_tags(tag);

-- Comments
COMMENT ON TABLE reviews IS 'User reviews for restaurants';
COMMENT ON TABLE review_tags IS 'Quick feedback tags for reviews';

COMMENT ON COLUMN reviews.rating IS 'Star rating from 1 to 5';
COMMENT ON COLUMN reviews.is_visible IS 'Visibility flag (can be hidden by admin)';
COMMENT ON COLUMN review_tags.tag IS 'Tag name: Delicious, Fast Delivery, Hot & Fresh, etc.';
