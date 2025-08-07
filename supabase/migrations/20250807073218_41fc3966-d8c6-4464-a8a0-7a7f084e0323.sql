-- Fix NULL token values that are causing auth scan errors
UPDATE auth.users 
SET 
    confirmation_token = '',
    email_change_token_new = '',
    recovery_token = '',
    email_change_token_current = ''
WHERE 
    confirmation_token IS NULL 
    OR email_change_token_new IS NULL 
    OR recovery_token IS NULL 
    OR email_change_token_current IS NULL;