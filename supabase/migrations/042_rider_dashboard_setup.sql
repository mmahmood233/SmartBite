-- =====================================================
-- RIDER DASHBOARD DATABASE SETUP
-- Wajba Food Delivery App
-- =====================================================

-- =====================================================
-- 1. CREATE RIDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motorcycle', 'car')),
    vehicle_number TEXT,
    license_number TEXT,
    status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 5.0,
    total_deliveries INTEGER DEFAULT 0,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id),
    UNIQUE(phone)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_riders_user_id ON public.riders(user_id);
CREATE INDEX IF NOT EXISTS idx_riders_status ON public.riders(status);
CREATE INDEX IF NOT EXISTS idx_riders_location ON public.riders(current_location_lat, current_location_lng);

-- Enable RLS
ALTER TABLE public.riders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for riders
CREATE POLICY "Riders can view their own profile"
    ON public.riders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Riders can update their own profile"
    ON public.riders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all riders"
    ON public.riders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- =====================================================
-- 2. CREATE DELIVERIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    rider_id UUID NOT NULL REFERENCES public.riders(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN (
        'assigned',
        'heading_to_restaurant',
        'arrived_at_restaurant',
        'picked_up',
        'heading_to_customer',
        'arrived_at_customer',
        'delivered',
        'cancelled'
    )),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pickup_time TIMESTAMP WITH TIME ZONE,
    delivery_time TIMESTAMP WITH TIME ZONE,
    distance DECIMAL(10, 2),
    earnings DECIMAL(10, 2) NOT NULL,
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(order_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_rider_id ON public.deliveries(rider_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON public.deliveries(created_at DESC);

-- Enable RLS
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deliveries
CREATE POLICY "Riders can view their own deliveries"
    ON public.deliveries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.riders
            WHERE riders.id = deliveries.rider_id
            AND riders.user_id = auth.uid()
        )
    );

CREATE POLICY "Riders can update their own deliveries"
    ON public.deliveries FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.riders
            WHERE riders.id = deliveries.rider_id
            AND riders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their order deliveries"
    ON public.deliveries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = deliveries.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admin can view all deliveries"
    ON public.deliveries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- =====================================================
-- 3. CREATE RIDER_LOCATIONS TABLE (For GPS Tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rider_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES public.riders(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rider_locations_rider_id ON public.rider_locations(rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_locations_order_id ON public.rider_locations(order_id);
CREATE INDEX IF NOT EXISTS idx_rider_locations_timestamp ON public.rider_locations(timestamp DESC);

-- Enable RLS
ALTER TABLE public.rider_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rider_locations
CREATE POLICY "Riders can insert their own locations"
    ON public.rider_locations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.riders
            WHERE riders.id = rider_locations.rider_id
            AND riders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their order rider locations"
    ON public.rider_locations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = rider_locations.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Riders can view their own locations"
    ON public.rider_locations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.riders
            WHERE riders.id = rider_locations.rider_id
            AND riders.user_id = auth.uid()
        )
    );

-- =====================================================
-- 4. CREATE RIDER_EARNINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rider_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID NOT NULL REFERENCES public.riders(id) ON DELETE CASCADE,
    delivery_id UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
    payout_date DATE,
    payout_method TEXT,
    payout_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rider_earnings_rider_id ON public.rider_earnings(rider_id);
CREATE INDEX IF NOT EXISTS idx_rider_earnings_delivery_id ON public.rider_earnings(delivery_id);
CREATE INDEX IF NOT EXISTS idx_rider_earnings_date ON public.rider_earnings(date DESC);
CREATE INDEX IF NOT EXISTS idx_rider_earnings_payment_status ON public.rider_earnings(payment_status);

-- Enable RLS
ALTER TABLE public.rider_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rider_earnings
CREATE POLICY "Riders can view their own earnings"
    ON public.rider_earnings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.riders
            WHERE riders.id = rider_earnings.rider_id
            AND riders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admin can view all earnings"
    ON public.rider_earnings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin can update earnings"
    ON public.rider_earnings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- =====================================================
-- 5. MODIFY ORDERS TABLE (Add Rider Columns)
-- =====================================================
-- Add rider-related columns to orders table
ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS rider_id UUID REFERENCES public.riders(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS rider_assigned_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS pickup_time TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS delivery_time TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS rider_earnings DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS delivery_status TEXT CHECK (delivery_status IN (
        'pending_rider',
        'rider_assigned',
        'picked_up',
        'in_transit',
        'delivered'
    ));

-- Create index for rider_id
CREATE INDEX IF NOT EXISTS idx_orders_rider_id ON public.orders(rider_id);

-- =====================================================
-- 6. CREATE TRIGGERS FOR AUTO-UPDATES
-- =====================================================

-- Trigger to update riders.updated_at
CREATE OR REPLACE FUNCTION update_riders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_riders_updated_at
    BEFORE UPDATE ON public.riders
    FOR EACH ROW
    EXECUTE FUNCTION update_riders_updated_at();

-- Trigger to update deliveries.updated_at
CREATE OR REPLACE FUNCTION update_deliveries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deliveries_updated_at
    BEFORE UPDATE ON public.deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_deliveries_updated_at();

-- Trigger to update rider stats when delivery is completed
CREATE OR REPLACE FUNCTION update_rider_stats_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE public.riders
        SET 
            total_deliveries = total_deliveries + 1,
            total_earnings = total_earnings + NEW.earnings,
            rating = (
                SELECT AVG(customer_rating)::DECIMAL(3,2)
                FROM public.deliveries
                WHERE rider_id = NEW.rider_id
                AND customer_rating IS NOT NULL
            )
        WHERE id = NEW.rider_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rider_stats
    AFTER UPDATE ON public.deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_rider_stats_on_delivery();

-- Trigger to create earning record when delivery is completed
CREATE OR REPLACE FUNCTION create_earning_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        INSERT INTO public.rider_earnings (rider_id, delivery_id, amount, date)
        VALUES (NEW.rider_id, NEW.id, NEW.earnings, CURRENT_DATE);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_earning
    AFTER UPDATE ON public.deliveries
    FOR EACH ROW
    EXECUTE FUNCTION create_earning_on_delivery();

-- =====================================================
-- 7. CREATE FUNCTIONS FOR COMMON QUERIES
-- =====================================================

-- Function to get available orders for riders
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
        o.delivery_address,
        0.0::DECIMAL as distance, -- Calculate based on location
        (o.total * 0.15)::DECIMAL as estimated_earnings, -- 15% of order total
        (SELECT COUNT(*) FROM jsonb_array_elements(o.items))::INTEGER as items_count,
        o.created_at
    FROM public.orders o
    JOIN public.restaurants r ON o.restaurant_id = r.id
    WHERE o.rider_id IS NULL
    AND o.delivery_address IS NOT NULL
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get rider statistics
CREATE OR REPLACE FUNCTION get_rider_statistics(p_rider_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'today_earnings', COALESCE((
            SELECT SUM(amount)
            FROM public.rider_earnings
            WHERE rider_id = p_rider_id
            AND date = CURRENT_DATE
        ), 0),
        'week_earnings', COALESCE((
            SELECT SUM(amount)
            FROM public.rider_earnings
            WHERE rider_id = p_rider_id
            AND date >= CURRENT_DATE - INTERVAL '7 days'
        ), 0),
        'month_earnings', COALESCE((
            SELECT SUM(amount)
            FROM public.rider_earnings
            WHERE rider_id = p_rider_id
            AND date >= DATE_TRUNC('month', CURRENT_DATE)
        ), 0),
        'today_deliveries', COALESCE((
            SELECT COUNT(*)
            FROM public.deliveries
            WHERE rider_id = p_rider_id
            AND DATE(delivery_time) = CURRENT_DATE
        ), 0),
        'week_deliveries', COALESCE((
            SELECT COUNT(*)
            FROM public.deliveries
            WHERE rider_id = p_rider_id
            AND delivery_time >= CURRENT_DATE - INTERVAL '7 days'
        ), 0),
        'month_deliveries', COALESCE((
            SELECT COUNT(*)
            FROM public.deliveries
            WHERE rider_id = p_rider_id
            AND delivery_time >= DATE_TRUNC('month', CURRENT_DATE)
        ), 0),
        'avg_rating', COALESCE((
            SELECT AVG(customer_rating)::DECIMAL(3,2)
            FROM public.deliveries
            WHERE rider_id = p_rider_id
            AND customer_rating IS NOT NULL
        ), 5.0)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. INSERT SAMPLE RIDER DATA (FOR TESTING)
-- =====================================================

-- Note: You'll need to create a user first, then insert rider
-- Example:
-- INSERT INTO public.riders (user_id, full_name, phone, vehicle_type, vehicle_number, license_number)
-- VALUES (
--     'USER_UUID_HERE',
--     'Mohammed Ali',
--     '+973 3333 4444',
--     'bike',
--     'ABC-123',
--     'DL-12345'
-- );

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- All tables, indexes, RLS policies, triggers, and functions created successfully
-- Next steps:
-- 1. Create rider services in TypeScript
-- 2. Integrate with authentication
-- 3. Test rider dashboard functionality
