-- 009_add_contact_number_validation.sql
-- Add validation constraint to contact_number field to ensure exactly 11 digits

-- Drop existing constraint if it exists
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_contact_number_check;

-- Add new constraint to ensure contact_number is exactly 11 digits (or NULL for non-delivery orders)
ALTER TABLE orders ADD CONSTRAINT orders_contact_number_check 
  CHECK (contact_number IS NULL OR (contact_number ~ '^[0-9]{11}$'));
