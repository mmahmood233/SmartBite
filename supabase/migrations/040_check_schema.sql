-- Quick schema check to see what columns exist

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'restaurants' 
ORDER BY ordinal_position;
