-- Insert a test delegate user
INSERT INTO dbo.Users (email, password, full_name, role, phone)
VALUES (
    'test.delegate@example.com',
    'password123', -- In a real application, this should be hashed
    'Test Delegate',
    'delegate',
    '+1234567890'
);

-- Get the user_id of the newly created user
DECLARE @new_user_id INT;
SET @new_user_id = SCOPE_IDENTITY();

-- Insert into Delegates table
INSERT INTO dbo.Delegates (user_id, experience_level, emergency_contact)
VALUES (
    @new_user_id,
    'intermediate',
    'Emergency Contact: +1234567890'
);

PRINT 'Test delegate created successfully with user_id: ' + CAST(@new_user_id AS VARCHAR); 