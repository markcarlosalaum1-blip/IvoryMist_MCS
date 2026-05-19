-- 010_add_realistic_stock_quantities.sql
-- Add realistic stock quantities for all products

BEGIN;

-- Update stock quantities for all products
UPDATE products
SET
    stock = CASE
        -- Coffee
        WHEN name = 'Espresso' THEN 45
        WHEN name = 'Cappuccino' THEN 38
        WHEN name = 'Latte' THEN 52
        WHEN name = 'Americano' THEN 40
        
        -- Tea
        WHEN name = 'Green Tea' THEN 35
        WHEN name = 'Black Tea' THEN 28
        WHEN name = 'Milk Tea' THEN 42
        WHEN name = 'Jasmine Tea' THEN 30
        
        -- Pastries
        WHEN name = 'Croissant' THEN 15
        WHEN name = 'Brownies' THEN 8
        WHEN name = 'Choco Ice Cream' THEN 12
        WHEN name = 'Cinnamon' THEN 10
        WHEN name = 'Donut' THEN 18
        WHEN name = 'Muffin' THEN 14
        
        -- Snacks & Food
        WHEN name = 'Burger' THEN 22
        WHEN name = 'Fries' THEN 25
        WHEN name = 'Sandwich' THEN 20
        WHEN name = 'Salad' THEN 16
        
        -- Default: Set to 25 for any other products
        ELSE 25
    END;

-- Ensure all products have valid stock values (no null values)
UPDATE products
SET stock = 20
WHERE stock IS NULL;

-- Update status based on stock levels
UPDATE products
SET status = 'out_of_stock'
WHERE stock = 0;

UPDATE products
SET status = 'available'
WHERE stock > 0;

COMMIT;
