-- Check what values are in the order_status enum

SELECT 
    enumlabel as status_value
FROM pg_enum
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'order_status'
)
ORDER BY enumsortorder;
