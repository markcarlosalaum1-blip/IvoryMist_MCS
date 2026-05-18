-- 008_add_delivery_and_dine_in_columns.sql
-- Comprehensively add ALL missing columns to orders table

-- First, check if orders table exists. If not, create it.
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now add all the missing columns one by one
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'Pickup';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT;

-- Add CHECK constraints for order_type
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_type_check 
  CHECK (order_type IN ('Pickup', 'Dine-in', 'Delivery'));

-- Add CHECK constraint for status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('Pending', 'Preparing', 'Ready for Pickup', 'Served', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled'));

-- Add CHECK constraint for payment_status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('Pending Verification', 'Paid', 'Rejected') OR payment_status IS NULL);

-- Add delivery tracking timestamp columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_rider UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders (order_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON orders (table_number);
CREATE INDEX IF NOT EXISTS idx_orders_contact_number ON orders (contact_number);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_fee ON orders (delivery_fee);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);

-- End of migration
