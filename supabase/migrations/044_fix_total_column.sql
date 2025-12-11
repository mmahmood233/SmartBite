-- Fix get_available_orders_for_riders function to use correct column names
-- Changes:
-- 1. o.total -> o.total_amount
-- 2. Count items from order_items table instead of o.items column
-- 3. Get delivery_address from user_addresses table

CREATE OR REPLACE FUNCTION get_available_orders_for_riders()
RETURNS TABLE (
    order_id UUID,
    restaurant_name TEXT,
    restaurant_address TEXT,
    delivery_address TEXT,
    distance DECIMAL,
    estimated_earnings DECIMAL,
    items_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id as order_id,
        r.name as restaurant_name,
        r.address as restaurant_address,
        COALESCE(ua.full_address, 'No address') as delivery_address,
        0.0::DECIMAL as distance,
        (o.total_amount * 0.15)::DECIMAL as estimated_earnings,
        (SELECT COUNT(*)::INTEGER FROM public.order_items oi WHERE oi.order_id = o.id) as items_count,
        o.created_at
    FROM public.orders o
    JOIN public.restaurants r ON o.restaurant_id = r.id
    LEFT JOIN public.user_addresses ua ON o.delivery_address_id = ua.id
    WHERE o.rider_id IS NULL
    AND o.delivery_address_id IS NOT NULL
    AND o.status IN ('confirmed', 'preparing')  -- Only after restaurant accepts
    ORDER BY o.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
