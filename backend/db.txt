-- Model United Nations Database for Microsoft SQL Server
-- Fixed version with proper IDENTITY columns and resolved cascading issues
-- Last update: April 26, 2025

-- Create database (uncomment if needed)
CREATE DATABASE Mun_Database_Final;
-- GO
USE Mun_Database_Final;
GO

-- Drop tables if they exist (for clean setup)
PRINT 'Dropping existing tables if any...'

IF OBJECT_ID('dbo.Scores', 'U') IS NOT NULL DROP TABLE dbo.Scores;
IF OBJECT_ID('dbo.Votes', 'U') IS NOT NULL DROP TABLE dbo.Votes;
IF OBJECT_ID('dbo.Documents', 'U') IS NOT NULL DROP TABLE dbo.Documents;
IF OBJECT_ID('dbo.Events', 'U') IS NOT NULL DROP TABLE dbo.Events;
IF OBJECT_ID('dbo.Attendance', 'U') IS NOT NULL DROP TABLE dbo.Attendance;
IF OBJECT_ID('dbo.PastExperiences', 'U') IS NOT NULL DROP TABLE dbo.PastExperiences;
IF OBJECT_ID('dbo.DelegateAssignments', 'U') IS NOT NULL DROP TABLE dbo.DelegateAssignments;
IF OBJECT_ID('dbo.Delegates', 'U') IS NOT NULL DROP TABLE dbo.Delegates;
IF OBJECT_ID('dbo.Blocks', 'U') IS NOT NULL DROP TABLE dbo.Blocks;
IF OBJECT_ID('dbo.Committees', 'U') IS NOT NULL DROP TABLE dbo.Committees;
IF OBJECT_ID('dbo.Countries', 'U') IS NOT NULL DROP TABLE dbo.Countries;
IF OBJECT_ID('dbo.Admins', 'U') IS NOT NULL DROP TABLE dbo.Admins;
IF OBJECT_ID('dbo.Chairs', 'U') IS NOT NULL DROP TABLE dbo.Chairs;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;

-- Create Users table (base table)
PRINT 'Creating Users table...'
CREATE TABLE dbo.Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    [password] VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    [role] VARCHAR(10) NOT NULL CHECK (role IN ('delegate', 'chair', 'admin')),
    phone VARCHAR(20) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    last_login DATETIME NULL
);

-- Create Countries table
PRINT 'Creating Countries table...'
CREATE TABLE dbo.Countries (
    country_id INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(100) NOT NULL,
    flag_url VARCHAR(255) NULL,
    [description] TEXT NULL,
    importance INT NOT NULL DEFAULT 1
);

-- Create Chairs table
PRINT 'Creating Chairs table...'
CREATE TABLE dbo.Chairs (
    user_id INT PRIMARY KEY,
    evaluation_metrics TEXT NULL,
    chairing_experience TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);

-- Create Committees table
PRINT 'Creating Committees table...'
CREATE TABLE dbo.Committees (
    committee_id INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(100) NOT NULL,
    [description] TEXT NULL,
    topic VARCHAR(255) NULL,
    difficulty VARCHAR(15) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    capacity INT NOT NULL,
    [location] VARCHAR(100) NULL,
    [start_date] DATE NULL,
    end_date DATE NULL,
    chair_id INT NOT NULL,
    FOREIGN KEY (chair_id) REFERENCES dbo.Chairs(user_id)
);

-- Create Blocks table
PRINT 'Creating Blocks table...'
CREATE TABLE dbo.Blocks (
    block_id INT IDENTITY(1,1) PRIMARY KEY,
    committee_id INT NOT NULL,
    [name] VARCHAR(100) NULL,
    [stance] TEXT NULL,
    FOREIGN KEY (committee_id) REFERENCES dbo.Committees(committee_id) ON DELETE CASCADE
);

-- Create Delegates table (simplified - personal info only)
PRINT 'Creating Delegates table...'
CREATE TABLE dbo.Delegates (
    user_id INT PRIMARY KEY,
    experience_level VARCHAR(15) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    emergency_contact VARCHAR(100) NULL,
    FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);

-- Create DelegateAssignments table (linking table) - FIXED CASCADE ISSUES
PRINT 'Creating DelegateAssignments table...'
CREATE TABLE dbo.DelegateAssignments (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    delegate_id INT NOT NULL,
    committee_id INT NOT NULL,
    country_id INT NOT NULL,
    block_id INT NULL,
    conference_year INT NOT NULL DEFAULT YEAR(GETDATE()),
    assignment_date DATETIME DEFAULT GETDATE(),
    -- Changed cascade behavior to avoid multiple cascade paths
    FOREIGN KEY (delegate_id) REFERENCES dbo.Delegates(user_id),
    FOREIGN KEY (committee_id) REFERENCES dbo.Committees(committee_id),
    FOREIGN KEY (country_id) REFERENCES dbo.Countries(country_id),
    FOREIGN KEY (block_id) REFERENCES dbo.Blocks(block_id) ON DELETE SET NULL
);

-- Create Admins table
PRINT 'Creating Admins table...'
CREATE TABLE dbo.Admins (
    user_id INT PRIMARY KEY,
    admin_level VARCHAR(15) CHECK (admin_level IN ('basic', 'intermediate', 'advanced')) DEFAULT 'basic',
    contact_number VARCHAR(20) NULL,
    last_activity DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);

-- Create PastExperiences table
PRINT 'Creating PastExperiences table...'
CREATE TABLE dbo.PastExperiences (
    experience_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    conference_name VARCHAR(100) NOT NULL,
    committee VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    [year] INT NULL,
    awards VARCHAR(20) NULL CHECK (awards IN ('BD', 'OD', 'HM') OR awards IS NULL),
    [description] TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE
);

-- Create Attendance table with composite primary key
PRINT 'Creating Attendance table...'
CREATE TABLE dbo.Attendance (
    user_id INT NOT NULL,
    committee_id INT NOT NULL,
    [date] DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('present', 'absent', 'excused', 'late')) NOT NULL,
    check_in_time DATETIME NULL,
    notes TEXT NULL,
    PRIMARY KEY (user_id, committee_id, [date]),
    FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (committee_id) REFERENCES dbo.Committees(committee_id)
);

-- Create Events table
PRINT 'Creating Events table...'
CREATE TABLE dbo.Events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    committee_id INT NOT NULL,
    [type] VARCHAR(10) CHECK (type IN ('motion', 'speech', 'caucus', 'voting', 'break')) NOT NULL,
    proposed_by INT NOT NULL, -- Delegate user_id
    [description] TEXT NULL,
    start_time DATETIME NULL,
    end_time DATETIME NULL,
    [status] VARCHAR(10) CHECK ([status] IN ('pending', 'ongoing', 'completed', 'failed')) DEFAULT 'pending',
    duration_minutes INT NULL,
    topic VARCHAR(255) NULL,
    notes TEXT NULL,
    votes_for INT DEFAULT 0,
    votes_against INT DEFAULT 0,
    votes_abstain INT DEFAULT 0,
    FOREIGN KEY (committee_id) REFERENCES dbo.Committees(committee_id),
    FOREIGN KEY (proposed_by) REFERENCES dbo.Delegates(user_id)
);



-- Create Documents table
PRINT 'Creating Documents table...'
CREATE TABLE dbo.Documents (
    document_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    [type] VARCHAR(20) CHECK (type IN ('position_paper', 'working_paper', 'draft_resolution', 'resolution', 'amendment')) NOT NULL,
    content TEXT NULL,
    file_url VARCHAR(255) NULL,
    delegate_id INT NOT NULL,
    block_id INT NULL,
    requires_voting BIT DEFAULT 1,
    [status] VARCHAR(10) CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'published')) DEFAULT 'draft',
    uploaded_at DATETIME DEFAULT GETDATE(),
    due_date DATETIME NOT NULL,
    updated_at DATETIME NULL,
    votes_for INT DEFAULT 0,
    votes_against INT DEFAULT 0,
    votes_abstain INT DEFAULT 0,
    FOREIGN KEY (delegate_id) REFERENCES dbo.Delegates(user_id),
    FOREIGN KEY (block_id) REFERENCES dbo.Blocks(block_id) ON DELETE SET NULL
);

SELECT name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('dbo.Scores');

ALTER TABLE dbo.Scores
DROP CONSTRAINT CK__Scores__category__2EDAF651;

ALTER TABLE dbo.Scores
ADD CONSTRAINT CK_Scores_category CHECK (category IN (
    'speech', 
    'motion', 
    'resolution', 
    'diplomacy', 
    'overall',
    'position_paper', 
    'working_paper', 
    'draft_resolution', 
    'amendment'
));


-- Create Votes table
PRINT 'Creating Votes table...'
CREATE TABLE dbo.Votes (
    vote_id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NULL,
    document_id INT NULL,
    delegate_id INT NOT NULL,
    vote VARCHAR(10) CHECK (vote IN ('for', 'against', 'abstain')) NOT NULL,
    [timestamp] DATETIME DEFAULT GETDATE(),
    notes TEXT NULL,
    FOREIGN KEY (event_id) REFERENCES dbo.Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES dbo.Documents(document_id) ON DELETE CASCADE,
    FOREIGN KEY (delegate_id) REFERENCES dbo.Delegates(user_id),
    -- Ensure vote is for either event or document, not both or neither
    CONSTRAINT CK_vote_target CHECK ((event_id IS NOT NULL AND document_id IS NULL) OR (event_id IS NULL AND document_id IS NOT NULL))
);

-- Create Scores table
PRINT 'Creating Scores table...'
CREATE TABLE dbo.Scores (
    score_id INT IDENTITY(1,1) PRIMARY KEY,
    delegate_id INT NOT NULL,
    category VARCHAR(20) CHECK (category IN ('speech', 'motion', 'resolution', 'diplomacy', 'overall')) NOT NULL,
    points DECIMAL(5,2) NOT NULL,
    chair_id INT NOT NULL,
    [timestamp] DATETIME DEFAULT GETDATE(),
    event_id INT NULL,
    document_id INT NULL,
    comments TEXT NULL,
    FOREIGN KEY (delegate_id) REFERENCES dbo.Delegates(user_id),
    FOREIGN KEY (chair_id) REFERENCES dbo.Chairs(user_id),
    FOREIGN KEY (event_id) REFERENCES dbo.Events(event_id) ON DELETE SET NULL,
    FOREIGN KEY (document_id) REFERENCES dbo.Documents(document_id) ON DELETE SET NULL
);

-- Create Triggers

-- 1. Validate Attendance User Trigger
PRINT 'Creating data validation triggers...'
go
CREATE OR ALTER TRIGGER trg_ValidateAttendanceUser
ON dbo.Attendance
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE NOT EXISTS (
            -- Check if user is a chair of this committee
            SELECT 1 FROM dbo.Committees c
            WHERE c.committee_id = i.committee_id AND c.chair_id = i.user_id
            UNION
            -- Check if user is a delegate assigned to this committee
            SELECT 1 FROM dbo.DelegateAssignments da
            WHERE da.committee_id = i.committee_id AND da.delegate_id = i.user_id
        )
    )
    BEGIN
        ROLLBACK TRANSACTION
        RAISERROR('User must be either a chair or a delegate for the committee', 16, 1)
    END
END
GO

-- 2. Committee Capacity Check Trigger
CREATE OR ALTER TRIGGER trg_CheckCommitteeCapacity
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @ExceededCapacity TABLE (CommitteeID INT, CurrentCount INT, MaxCapacity INT);
    
    INSERT INTO @ExceededCapacity
    SELECT 
        d.committee_id,
        COUNT(*),
        c.capacity
    FROM 
        dbo.DelegateAssignments d
        JOIN dbo.Committees c ON d.committee_id = c.committee_id
    GROUP BY 
        d.committee_id, c.capacity
    HAVING 
        COUNT(*) > c.capacity;
    
    IF EXISTS (SELECT 1 FROM @ExceededCapacity)
    BEGIN
        DECLARE @ErrorMessage NVARCHAR(1000);
        SELECT @ErrorMessage = 'Committee capacity exceeded for committee ID: ' + 
                               CONVERT(VARCHAR, CommitteeID) + 
                               '. Current count: ' + CONVERT(VARCHAR, CurrentCount) + 
                               ', Maximum capacity: ' + CONVERT(VARCHAR, MaxCapacity)
        FROM @ExceededCapacity;
        
        ROLLBACK TRANSACTION;
        THROW 50000, @ErrorMessage, 1;
    END
END
GO

-- 3. Document Voting Update Trigger
CREATE OR ALTER TRIGGER trg_UpdateDocumentVotes
ON dbo.Votes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Handle deleted votes
    IF EXISTS (SELECT 1 FROM deleted)
    BEGIN
        -- Update document votes for deleted records
        UPDATE d
        SET 
            votes_for = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'for'),
            votes_against = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'against'),
            votes_abstain = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'abstain')
        FROM 
            dbo.Documents d
        WHERE 
            d.document_id IN (SELECT document_id FROM deleted WHERE document_id IS NOT NULL);
            
        -- Update event votes for deleted records
        UPDATE e
        SET 
            votes_for = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'for'),
            votes_against = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'against'),
            votes_abstain = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'abstain')
        FROM 
            dbo.Events e
        WHERE 
            e.event_id IN (SELECT event_id FROM deleted WHERE event_id IS NOT NULL);
    END
    
    -- Handle inserted votes
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        -- Update document votes for inserted records
        UPDATE d
        SET 
            votes_for = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'for'),
            votes_against = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'against'),
            votes_abstain = (SELECT COUNT(*) FROM dbo.Votes WHERE document_id = d.document_id AND vote = 'abstain')
        FROM 
            dbo.Documents d
        WHERE 
            d.document_id IN (SELECT document_id FROM inserted WHERE document_id IS NOT NULL);
            
        -- Update event votes for inserted records
        UPDATE e
        SET 
            votes_for = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'for'),
            votes_against = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'against'),
            votes_abstain = (SELECT COUNT(*) FROM dbo.Votes WHERE event_id = e.event_id AND vote = 'abstain')
        FROM 
            dbo.Events e
        WHERE 
            e.event_id IN (SELECT event_id FROM inserted WHERE event_id IS NOT NULL);
    END
END
GO

-- 4. Enforce Committee-Country Uniqueness Constraint
CREATE or alter TRIGGER trg_EnforceCommitteeCountryUniqueness
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS





BEGIN
    -- Check if there are any duplicate country assignments within the same committee
    IF EXISTS (
        SELECT committee_id, country_id
        FROM dbo.DelegateAssignments
        GROUP BY committee_id, country_id
        HAVING COUNT(*) > 1
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Each country can only be represented by one delegate within the same committee', 16, 1);
    END
END
GO

-- Drop the trigger if it exists
IF OBJECT_ID('dbo.trg_PreventChairDeletion', 'TR') IS NOT NULL
    DROP TRIGGER dbo.trg_PreventChairDeletion;
GO

-- Create a trigger to prevent deletion of chairs assigned to committees
CREATE TRIGGER trg_PreventChairDeletion
ON dbo.Users
INSTEAD OF DELETE
AS
BEGIN
    -- Check if any users being deleted are chairs assigned to committees
    IF EXISTS (
        SELECT 1 
        FROM deleted d
        JOIN dbo.Chairs ch ON d.user_id = ch.user_id
        JOIN dbo.Committees c ON ch.user_id = c.chair_id
    )
    BEGIN
        RAISERROR('Cannot delete user who is assigned as chair to a committee. Reassign committee first.', 16, 1);
        RETURN;
    END
    
    -- Delete users who are not chairs or are chairs not assigned to committees
    DELETE FROM dbo.Users
    WHERE user_id IN (
        SELECT d.user_id 
        FROM deleted d
        WHERE NOT EXISTS (
            SELECT 1 
            FROM dbo.Chairs ch
            JOIN dbo.Committees c ON ch.user_id = c.chair_id
            WHERE ch.user_id = d.user_id
        )
    );
END;

-------------User Stored Procedures
-- User Management Stored Procedures

-- sp_CreateUser - Create new users
go;
CREATE OR ALTER PROCEDURE sp_CreateUser
    @email VARCHAR(255),
    @password VARCHAR(255),
    @full_name VARCHAR(100),
    @role VARCHAR(10),
    @phone VARCHAR(20) = NULL,
    @user_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Users (email, password, full_name, role, phone, created_at)
    VALUES (@email, @password, @full_name, @role, @phone, GETDATE());
    
    SET @user_id = SCOPE_IDENTITY();
    
    -- If the role is 'delegate', 'chair', or 'admin', create the corresponding profile
    IF @role = 'delegate'
    BEGIN
        INSERT INTO dbo.Delegates (user_id)
        VALUES (@user_id);
    END
    ELSE IF @role = 'chair'
    BEGIN
        INSERT INTO dbo.Chairs (user_id)
        VALUES (@user_id);
    END
    ELSE IF @role = 'admin'
    BEGIN
        INSERT INTO dbo.Admins (user_id)
        VALUES (@user_id);
    END
    
    RETURN @user_id;
END;
GO

-- sp_GetUserById - Get user by ID
CREATE OR ALTER PROCEDURE sp_GetUserById
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM dbo.Users WHERE user_id = @user_id;
END;
GO

-- sp_GetUserByEmail - Get user by email
CREATE OR ALTER PROCEDURE sp_GetUserByEmail
    @email VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM dbo.Users WHERE email = @email;
END;
GO

-- sp_UpdateUser - Update user information
CREATE OR ALTER PROCEDURE sp_UpdateUser
    @user_id INT,
    @email VARCHAR(255) = NULL,
    @password VARCHAR(255) = NULL,
    @full_name VARCHAR(100) = NULL,
    @phone VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Users
    SET 
        email = ISNULL(@email, email),
        password = ISNULL(@password, password),
        full_name = ISNULL(@full_name, full_name),
        phone = ISNULL(@phone, phone)
    WHERE user_id = @user_id;
    
    SELECT * FROM dbo.Users WHERE user_id = @user_id;
END;
GO

-- sp_DeleteUser - Delete/deactivate user
CREATE OR ALTER PROCEDURE sp_DeleteUser
    @user_id INT,
    @hard_delete BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Hard delete - removes the user completely
    IF @hard_delete = 1
    BEGIN
        DELETE FROM dbo.Users WHERE user_id = @user_id;
    END
    -- Soft delete - could be implemented by adding an 'active' flag to Users table
    -- This example assumes you'd add such a column if needed
    ELSE
    BEGIN
        -- For now, just do a hard delete since there's no 'active' field
        DELETE FROM dbo.Users WHERE user_id = @user_id;
    END
END;
GO

-- sp_AuthenticateUser - Verify login credentials
CREATE OR ALTER PROCEDURE sp_AuthenticateUser
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- In a real application, you would use proper password hashing
    DECLARE @user_id INT = NULL;
    
    SELECT @user_id = user_id 
    FROM dbo.Users 
    WHERE email = @email AND password = @password;
    
    IF @user_id IS NOT NULL
    BEGIN
        -- Update last login time
        UPDATE dbo.Users
        SET last_login = GETDATE()
        WHERE user_id = @user_id;
        
        -- Return user details
        SELECT * FROM dbo.Users WHERE user_id = @user_id;
        RETURN 1; -- Authentication successful
    END
    ELSE
    BEGIN
        RETURN 0; -- Authentication failed
    END
END;
GO

-- Example EXEC statements
DECLARE @new_user_id INT;
EXEC sp_CreateUser 'omer@example.com', 'panda88', 'Omer Adnan', 'delegate', '555-123-4567', @new_user_id OUTPUT;
EXEC sp_CreateUser 'ali@example.com', 'panda99', 'Ali Adnan', 'delegate', '555-123-4527', @new_user_id OUTPUT;
EXEC sp_CreateUser 'Zayan@example.com', 'panda11', 'Zayan Amjad', 'chair', '555-123-4517', @new_user_id OUTPUT;
DECLARE @new_user_id INT;
EXEC sp_CreateUser 'yaman@example.com', 'panda44', 'Yaman Tariq', 'delegate', '0322-481-4809', @new_user_id OUTPUT;
EXEC sp_CreateUser 'hasnat@example.com', 'panda22', 'Hasnat Omer', 'delegate', '0322-481-4801', @new_user_id OUTPUT;

PRINT 'New user ID: ' + CAST(@new_user_id AS VARCHAR);
GO
EXEC sp_GetUserById 2;
EXEC sp_GetUserByEmail 'john.doe@example.com';
EXEC sp_UpdateUser 1, 'john.updated@example.com', NULL, 'John Updated', '555-987-6543';
EXEC sp_AuthenticateUser 'ali@example.com', 'panda99';
EXEC sp_DeleteUser 1, 0;  -- Soft delete

--------------Delegate Stored procedures
-- Delegate Management Stored Procedures




-- sp_GetDelegateById - Get delegate details by ID
go;
CREATE OR ALTER PROCEDURE sp_GetDelegateById
    @delegate_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT d.*, u.full_name, u.email, u.phone
    FROM dbo.Delegates d
    JOIN dbo.Users u ON d.user_id = u.user_id
    WHERE d.user_id = @delegate_id;
END;
GO

EXEC sp_GetDelegateById 2;
GO

-- sp_UpdateDelegate - Update delegate details
CREATE OR ALTER PROCEDURE sp_UpdateDelegate
    @delegate_id INT,
    @experience_level VARCHAR(15) = NULL,
    @emergency_contact VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Delegates
    SET 
        experience_level = ISNULL(@experience_level, experience_level),
        emergency_contact = ISNULL(@emergency_contact, emergency_contact)
    WHERE user_id = @delegate_id;
    
    SELECT d.*, u.full_name, u.email, u.phone
    FROM dbo.Delegates d
    JOIN dbo.Users u ON d.user_id = u.user_id
    WHERE d.user_id = @delegate_id;
END;
GO
--EXEC sp_UpdateDelegate 1, 'advanced', 'Jane Doe (555-555-5555)';

go;

-- sp_DeleteDelegate - Delete delegate records
CREATE OR ALTER PROCEDURE sp_DeleteDelegate
    @delegate_id INT,
    @delete_user BIT = 1
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Delete delegate profile
        DELETE FROM dbo.Delegates WHERE user_id = @delegate_id;
        
        -- Optionally delete the user as well
        IF @delete_user = 1
        BEGIN
            DELETE FROM dbo.Users WHERE user_id = @delegate_id;
        END
        ELSE
        BEGIN
            -- Update user role if keeping the user
            UPDATE dbo.Users
            SET role = NULL
            WHERE user_id = @delegate_id;
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

select * from Users
select * from Delegates

exec sp_DeleteDelegate 1

GO


-- sp_AddPastExperience - Add past MUN experience
CREATE OR ALTER PROCEDURE sp_AddPastExperience
    @user_id INT,
    @conference_name VARCHAR(100),
    @committee VARCHAR(100) = NULL,
    @country VARCHAR(100) = NULL,
    @year INT = NULL,
    @awards VARCHAR(20) = NULL,
    @description TEXT = NULL,
    @experience_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.PastExperiences (user_id, conference_name, committee, country, year, awards, description)
    VALUES (@user_id, @conference_name, @committee, @country, @year, @awards, @description);
    
    SET @experience_id = SCOPE_IDENTITY();
    
    SELECT * FROM dbo.PastExperiences WHERE experience_id = @experience_id;
END;
GO

DECLARE @experience_id INT;
EXEC sp_AddPastExperience 2, 'Harvard MUN 2024', 'Security Council', 'France', 2024, 'BD', 'Won Best Delegate award', @experience_id OUTPUT;
EXEC sp_AddPastExperience 4, 'Harvard MUN 2024', 'Security Council', 'France', 2023, 'OD', 'Won Best Delegate award', @experience_id OUTPUT;
EXEC sp_AddPastExperience 2, 'Harvard MUN 2024', 'Security Council', 'France', 2022, 'HM', 'Won Best Delegate award', @experience_id OUTPUT;
EXEC sp_AddPastExperience 5, 'Harvard MUN 2024', 'Security Council', 'France', 2025, NULL , 'Won Best Delegate award', @experience_id OUTPUT;

GO

-- sp_GetDelegatePastExperiences - Get delegate's past experiences
CREATE OR ALTER PROCEDURE sp_GetDelegatePastExperiences
    @delegate_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT pe.*, u.full_name
    FROM dbo.PastExperiences pe
    JOIN dbo.Users u ON pe.user_id = u.user_id
    WHERE pe.user_id = @delegate_id
    ORDER BY pe.year DESC;
END;
GO

EXEC sp_GetDelegatePastExperiences 2;

GO

-------------Country Stored Procedures
CREATE OR ALTER PROCEDURE sp_CreateCountry
    @name VARCHAR(100),
    @flag_url VARCHAR(255) = NULL,
    @description TEXT = NULL,
    @importance INT = 1,
    @country_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.Countries (name, flag_url, description, importance)
    VALUES (@name, @flag_url, @description, @importance);
    
    SET @country_id = SCOPE_IDENTITY();
    
    SELECT * FROM dbo.Countries WHERE country_id = @country_id;
END;
GO

DECLARE @new_country_id INT;
EXEC sp_CreateCountry 'Canada', 'https://example.com/flags/ca.png', 'Canada', 4, @new_country_id OUTPUT;
EXEC sp_CreateCountry 'United Kingdom', 'https://example.com/flags/uk.png', 'United Kingdom of Great Britain and Northern Ireland', 5, @new_country_id OUTPUT;
EXEC sp_CreateCountry 'Germany', 'https://example.com/flags/de.png', 'Federal Republic of Germany', 5, @new_country_id OUTPUT;
EXEC sp_CreateCountry 'France', 'https://example.com/flags/fr.png', 'French Republic', 4, @new_country_id OUTPUT;
EXEC sp_CreateCountry 'Japan', 'https://example.com/flags/jp.png', 'Japan', 5, @new_country_id OUTPUT;
EXEC sp_CreateCountry 'Australia', 'https://example.com/flags/au.png', 'Commonwealth of Australia', 4, @new_country_id OUTPUT;


go;

CREATE OR ALTER PROCEDURE sp_GetCountryById
    @country_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM dbo.Countries WHERE country_id = @country_id;
END;
GO

-- sp_UpdateCountry - Update country details
CREATE OR ALTER PROCEDURE sp_UpdateCountry
    @country_id INT,
    @name VARCHAR(100) = NULL,
    @flag_url VARCHAR(255) = NULL,
    @description TEXT = NULL,
    @importance INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Countries
    SET 
        name = ISNULL(@name, name),
        flag_url = ISNULL(@flag_url, flag_url),
        description = ISNULL(@description, description),
        importance = ISNULL(@importance, importance)
    WHERE country_id = @country_id;
    
    SELECT * FROM dbo.Countries WHERE country_id = @country_id;
END;
GO

-- sp_DeleteCountry - Delete country
CREATE OR ALTER PROCEDURE sp_DeleteCountry
    @country_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if country is assigned to any delegates
    IF EXISTS (SELECT 1 FROM dbo.DelegateAssignments WHERE country_id = @country_id)
    BEGIN
        RAISERROR('Cannot delete country that is assigned to delegates', 16, 1);
        RETURN;
    END
    
    DELETE FROM dbo.Countries WHERE country_id = @country_id;
END;
GO

-- sp_GetAllCountries - Get all countries with optional filtering
CREATE OR ALTER PROCEDURE sp_GetAllCountries
    @importance_min INT = NULL,
    @importance_max INT = NULL,
    @search_term VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT *
    FROM dbo.Countries
    WHERE 
        (@importance_min IS NULL OR importance >= @importance_min) AND
        (@importance_max IS NULL OR importance <= @importance_max) AND
        (@search_term IS NULL OR name LIKE '%' + @search_term + '%' OR 
         description LIKE '%' + @search_term + '%')
    ORDER BY name;
END;
GO

-- DECLARE @new_country_id INT;
EXEC sp_GetCountryById 1;
EXEC sp_UpdateCountry 1, 'USA', NULL, 'United States of America - updated description', NULL;
EXEC sp_GetAllCountries 3, 5, 'United';
EXEC sp_DeleteCountry 1;


--======================= Committee SPs
-- Committee Management Stored Procedures

-- sp_CreateCommittee - Create new committee
go;
CREATE OR ALTER PROCEDURE sp_CreateCommittee
    @name VARCHAR(100),
    @description TEXT = NULL,
    @topic VARCHAR(255) = NULL,
    @difficulty VARCHAR(15) = 'intermediate',
    @capacity INT,
    @location VARCHAR(100) = NULL,
    @start_date DATE = NULL,
    @end_date DATE = NULL,
    @chair_id INT,
    @committee_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate chair exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Chairs WHERE user_id = @chair_id)
    BEGIN
        RAISERROR('Chair does not exist', 16, 1);
        RETURN;
    END
    
    INSERT INTO dbo.Committees (
        name, description, topic, difficulty, capacity, 
        location, start_date, end_date, chair_id
    )
    VALUES (
        @name, @description, @topic, @difficulty, @capacity, 
        @location, @start_date, @end_date, @chair_id
    );
    
    SET @committee_id = SCOPE_IDENTITY();
    
    SELECT c.*, u.full_name AS chair_name 
    FROM dbo.Committees c
    JOIN dbo.Chairs ch ON c.chair_id = ch.user_id
    JOIN dbo.Users u ON ch.user_id = u.user_id
    WHERE c.committee_id = @committee_id;
END;
GO

-- sp_GetCommitteeById - Get committee details
CREATE OR ALTER PROCEDURE sp_GetCommitteeById
    @committee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT c.*, u.full_name AS chair_name 
    FROM dbo.Committees c
    JOIN dbo.Chairs ch ON c.chair_id = ch.user_id
    JOIN dbo.Users u ON ch.user_id = u.user_id
    WHERE c.committee_id = @committee_id;
END;
GO

-- sp_UpdateCommittee - Update committee information
CREATE OR ALTER PROCEDURE sp_UpdateCommittee
    @committee_id INT,
    @name VARCHAR(100) = NULL,
    @description TEXT = NULL,
    @topic VARCHAR(255) = NULL,
    @difficulty VARCHAR(15) = NULL,
    @capacity INT = NULL,
    @location VARCHAR(100) = NULL,
    @start_date DATE = NULL,
    @end_date DATE = NULL,
    @chair_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate new chair if provided
    IF @chair_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Chairs WHERE user_id = @chair_id)
    BEGIN
        RAISERROR('Chair does not exist', 16, 1);
        RETURN;
    END
    
    UPDATE dbo.Committees
    SET 
        name = ISNULL(@name, name),
        description = ISNULL(@description, description),
        topic = ISNULL(@topic, topic),
        difficulty = ISNULL(@difficulty, difficulty),
        capacity = ISNULL(@capacity, capacity),
        location = ISNULL(@location, location),
        start_date = ISNULL(@start_date, start_date),
        end_date = ISNULL(@end_date, end_date),
        chair_id = ISNULL(@chair_id, chair_id)
    WHERE committee_id = @committee_id;
    
    SELECT c.*, u.full_name AS chair_name 
    FROM dbo.Committees c
    JOIN dbo.Chairs ch ON c.chair_id = ch.user_id
    JOIN dbo.Users u ON ch.user_id = u.user_id
    WHERE c.committee_id = @committee_id;
END;
GO

-- sp_DeleteCommittee - Delete committee
CREATE OR ALTER PROCEDURE sp_DeleteCommittee
    @committee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Delete all related records first
        DELETE FROM dbo.Attendance WHERE committee_id = @committee_id;
        DELETE FROM dbo.DelegateAssignments WHERE committee_id = @committee_id;
        
        -- Delete committee
        DELETE FROM dbo.Committees WHERE committee_id = @committee_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_GetAllCommittees - Get all committees with optional filtering
CREATE OR ALTER PROCEDURE sp_GetAllCommittees
    @difficulty VARCHAR(15) = NULL,
    @chair_id INT = NULL,
    @search_term VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT c.*, u.full_name AS chair_name 
    FROM dbo.Committees c
    JOIN dbo.Chairs ch ON c.chair_id = ch.user_id
    JOIN dbo.Users u ON ch.user_id = u.user_id
    WHERE 
        (@difficulty IS NULL OR c.difficulty = @difficulty) AND
        (@chair_id IS NULL OR c.chair_id = @chair_id) AND
        (@search_term IS NULL OR c.name LIKE '%' + @search_term + '%' OR 
         c.topic LIKE '%' + @search_term + '%' OR
         c.description LIKE '%' + @search_term + '%')
    ORDER BY c.name;
END;
GO
select * from Users
-- Example EXEC statements
DECLARE @new_committee_id INT;
EXEC sp_CreateCommittee 'Security Council', 'UN Security Council', 'Nuclear Proliferation', 'advanced', 15, 'Room A101', '2025-05-01', '2025-05-03', 3, @new_committee_id OUTPUT;
-- PRINT 'New committee ID: ' + CAST(@new_committee_id AS VARCHAR);
-- 
EXEC sp_GetCommitteeById 1;
EXEC sp_UpdateCommittee 1, 'UNSC', NULL, 'Nuclear Disarmament', NULL, 20, NULL, NULL, NULL, NULL;
EXEC sp_GetAllCommittees 'advanced', NULL, 'Nuclear';
EXEC sp_DeleteCommittee 1;

go;

--==================Block Procedures
-- Block Management Stored Procedures

-- sp_CreateBlock - Create new block
CREATE OR ALTER PROCEDURE sp_CreateBlock
    @committee_id INT,
    @name VARCHAR(100),
    @stance TEXT = NULL,
    @block_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate committee exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @committee_id)
    BEGIN
        RAISERROR('Committee does not exist', 16, 1);
        RETURN;
    END
    
    INSERT INTO dbo.Blocks (committee_id, name, stance)
    VALUES (@committee_id, @name, @stance);
    
    SET @block_id = SCOPE_IDENTITY();
    
    SELECT b.*, c.name AS committee_name 
    FROM dbo.Blocks b
    JOIN dbo.Committees c ON b.committee_id = c.committee_id
    WHERE b.block_id = @block_id;
END;
GO

-- sp_GetBlockById - Get block details
CREATE OR ALTER PROCEDURE sp_GetBlockById
    @block_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT b.*, c.name AS committee_name 
    FROM dbo.Blocks b
    JOIN dbo.Committees c ON b.committee_id = c.committee_id
    WHERE b.block_id = @block_id;
END;
GO

-- sp_UpdateBlock - Update block information
CREATE OR ALTER PROCEDURE sp_UpdateBlock
    @block_id INT,
    @name VARCHAR(100) = NULL,
    @stance TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Blocks
    SET 
        name = ISNULL(@name, name),
        stance = ISNULL(@stance, stance)
    WHERE block_id = @block_id;
    
    SELECT b.*, c.name AS committee_name 
    FROM dbo.Blocks b
    JOIN dbo.Committees c ON b.committee_id = c.committee_id
    WHERE b.block_id = @block_id;
END;
GO

-- sp_DeleteBlock - Delete block
CREATE OR ALTER PROCEDURE sp_DeleteBlock
    @block_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Update delegate assignments to remove block assignment
        UPDATE dbo.DelegateAssignments
        SET block_id = NULL
        WHERE block_id = @block_id;
        
        -- Update documents to remove block association
        UPDATE dbo.Documents
        SET block_id = NULL
        WHERE block_id = @block_id;
        
        -- Delete block
        DELETE FROM dbo.Blocks WHERE block_id = @block_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- sp_GetBlocksByCommittee - Get blocks for a committee
CREATE OR ALTER PROCEDURE sp_GetBlocksByCommittee
    @committee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT b.*, c.name AS committee_name,
           (SELECT COUNT(*) FROM dbo.DelegateAssignments da WHERE da.block_id = b.block_id) AS member_count
    FROM dbo.Blocks b
    JOIN dbo.Committees c ON b.committee_id = c.committee_id
    WHERE b.committee_id = @committee_id
    ORDER BY b.name;
END;
GO

-- Example EXEC statements
DECLARE @new_block_id INT;
EXEC sp_CreateBlock 1, 'Western Bloc', 'Pro-democratic stance focusing on human rights and free markets', @new_block_id OUTPUT;
-- PRINT 'New block ID: ' + CAST(@new_block_id AS VARCHAR);
-- 
EXEC sp_GetBlockById 1;
EXEC sp_UpdateBlock 1, 'NATO Bloc', 'Pro-democratic stance with focus on collective security';
EXEC sp_GetBlocksByCommittee 1;
-- EXEC sp_DeleteBlock 1;


go;


--=================Chair Procedures

CREATE OR ALTER PROCEDURE sp_GetChairById
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT u.*, c.evaluation_metrics, c.chairing_experience
    FROM dbo.Users u
    JOIN dbo.Chairs c ON u.user_id = c.user_id
    WHERE u.user_id = @user_id;
END;
GO

-- Example EXEC for sp_GetChairById
EXEC sp_GetChairById @user_id = 3

go;

CREATE OR ALTER PROCEDURE sp_UpdateChair
    @user_id INT,
    @evaluation_metrics TEXT = NULL,
    @chairing_experience TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if chair exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Chairs WHERE user_id = @user_id)
    BEGIN
        RAISERROR('Chair not found', 16, 1);
        RETURN;
    END
    
    -- Update chair profile
    UPDATE dbo.Chairs
    SET
        evaluation_metrics = ISNULL(@evaluation_metrics, evaluation_metrics),
        chairing_experience = ISNULL(@chairing_experience, chairing_experience)
    WHERE user_id = @user_id;
END;
GO

-- Example EXEC for sp_UpdateChair
EXEC sp_UpdateChair 
    @user_id = 3,
    @evaluation_metrics = 'Updated metrics including leadership and mediation skills',
    @chairing_experience = '4 years of chairing experience in international MUNs'


select * from Chairs

GO

CREATE OR ALTER PROCEDURE sp_DeleteChair
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if chair exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Chairs WHERE user_id = @user_id)
    BEGIN
        RAISERROR('Chair not found', 16, 1);
        RETURN;
    END
    
    -- Check if chair is assigned to any committees
    IF EXISTS (SELECT 1 FROM dbo.Committees WHERE chair_id = @user_id)
    BEGIN
        RAISERROR('Cannot delete chair that is assigned to committees', 16, 1);
        RETURN;
    END
    
    -- Delete chair profile
    DELETE FROM dbo.Chairs WHERE user_id = @user_id;
END;
GO

-- Example EXEC for sp_DeleteChair
-- EXEC sp_DeleteChair @user_id = 1

select * from Users
GO

--====================Admin Stored Procedures

CREATE OR ALTER PROCEDURE sp_GetAdminById
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT u.*, a.admin_level, a.contact_number, a.last_activity
    FROM dbo.Users u
    JOIN dbo.Admins a ON u.user_id = a.user_id
    WHERE u.user_id = @user_id;
END;
GO

EXEC sp_GetAdminById @user_id = 5

GO


CREATE OR ALTER PROCEDURE sp_UpdateAdmin
    @user_id INT,
    @admin_level VARCHAR(15) = NULL,
    @contact_number VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if admin exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Admins WHERE user_id = @user_id)
    BEGIN
        RAISERROR('Admin not found', 16, 1);
        RETURN;
    END
    
    -- Validate admin level if provided
    IF @admin_level IS NOT NULL AND @admin_level NOT IN ('basic', 'intermediate', 'advanced')
    BEGIN
        RAISERROR('Invalid admin level. Must be basic, intermediate, or advanced', 16, 1);
        RETURN;
    END
    
    -- Update admin profile
    UPDATE dbo.Admins
    SET
        admin_level = ISNULL(@admin_level, admin_level),
        contact_number = ISNULL(@contact_number, contact_number),
        last_activity = GETDATE()
    WHERE user_id = @user_id;
END;
GO

-- Example EXEC for sp_UpdateAdmin
EXEC sp_UpdateAdmin 
    @user_id = 5,
    @admin_level = 'intermediate',
    @contact_number = '+1-555-7654321'

go;

CREATE OR ALTER PROCEDURE sp_DeleteAdmin
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if admin exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Admins WHERE user_id = @user_id)
    BEGIN
        RAISERROR('Admin not found', 16, 1);
        RETURN;
    END
    
    -- Delete admin profile
    DELETE FROM dbo.Admins WHERE user_id = @user_id;
END;
GO

-- Example EXEC for sp_DeleteAdmin
-- EXEC sp_DeleteAdmin @user_id = 2

--================ Document Stored Procedures

CREATE OR ALTER PROCEDURE sp_CreateDocument
    @title VARCHAR(255),
    @type VARCHAR(20),
    @content TEXT = NULL,
    @file_url VARCHAR(255) = NULL,
    @delegate_id INT,
    @block_id INT = NULL,
    @requires_voting BIT = 1,
    @status VARCHAR(10) = 'draft',
    @due_date DATETIME,
    @document_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if delegate exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Delegates WHERE user_id = @delegate_id)
    BEGIN
        RAISERROR('Delegate not found', 16, 1);
        RETURN;
    END
    
    -- Check if block exists (if provided)
    IF @block_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Blocks WHERE block_id = @block_id)
    BEGIN
        RAISERROR('Block not found', 16, 1);
        RETURN;
    END
    
    -- Validate document type
    IF @type NOT IN ('position_paper', 'working_paper', 'draft_resolution', 'resolution', 'amendment')
    BEGIN
        RAISERROR('Invalid document type', 16, 1);
        RETURN;
    END
    
    -- Validate status
    IF @status NOT IN ('draft', 'submitted', 'approved', 'rejected', 'published')
    BEGIN
        RAISERROR('Invalid document status', 16, 1);
        RETURN;
    END
    
    -- Insert new document
    INSERT INTO dbo.Documents (
        title, [type], content, file_url, delegate_id, block_id, 
        requires_voting, [status], uploaded_at, due_date, updated_at
    )
    VALUES (
        @title, @type, @content, @file_url, @delegate_id, @block_id, 
        @requires_voting, @status, GETDATE(), @due_date, GETDATE()
    );
    
    -- Get the new document ID
    SET @document_id = SCOPE_IDENTITY();
END;
GO

-- Example EXEC for sp_CreateDocument
DECLARE @document_id INT
EXEC sp_CreateDocument 
    @title = 'Position Paper on DB fucking my Mental Health',
    @type = 'position_paper',
    @content = 'This position paper addresses the urgent need for global action...',
    @delegate_id = 2,
    @due_date = '2025-05-15 23:59:59',
    @document_id = @document_id OUTPUT
SELECT @document_id AS 'New Document ID'

select * from Documents

GO

CREATE OR ALTER PROCEDURE sp_GetDocumentById
    @document_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        d.*,
        u.full_name AS delegate_name,
        b.name AS block_name
    FROM dbo.Documents d
    JOIN dbo.Users u ON d.delegate_id = u.user_id
    LEFT JOIN dbo.Blocks b ON d.block_id = b.block_id
    WHERE d.document_id = @document_id;
END;
GO

-- Example EXEC for sp_GetDocumentById
EXEC sp_GetDocumentById @document_id = 1

go

CREATE OR ALTER PROCEDURE sp_UpdateDocument
    @document_id INT,
    @title VARCHAR(255) = NULL,
    @content TEXT = NULL,
    @file_url VARCHAR(255) = NULL,
    @block_id INT = NULL,
    @requires_voting BIT = NULL,
    @status VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if document exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Documents WHERE document_id = @document_id)
    BEGIN
        RAISERROR('Document not found', 16, 1);
        RETURN;
    END
    
    -- Check if block exists (if provided)
    IF @block_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Blocks WHERE block_id = @block_id)
    BEGIN
        RAISERROR('Block not found', 16, 1);
        RETURN;
    END
    
    -- Validate status if provided
    IF @status IS NOT NULL AND @status NOT IN ('draft', 'submitted', 'approved', 'rejected', 'published')
    BEGIN
        RAISERROR('Invalid document status', 16, 1);
        RETURN;
    END
    
    -- Update document
    UPDATE dbo.Documents
    SET
        title = ISNULL(@title, title),
        content = ISNULL(@content, content),
        file_url = ISNULL(@file_url, file_url),
        block_id = ISNULL(@block_id, block_id),
        requires_voting = ISNULL(@requires_voting, requires_voting),
        [status] = ISNULL(@status, [status]),
        updated_at = GETDATE()
    WHERE document_id = @document_id;
END;
GO

-- Example EXEC for sp_UpdateDocument
EXEC sp_UpdateDocument 
    @document_id = 1,
    @title = 'Updated Position Paper on Climate Change',
    @content = 'This revised position paper addresses the urgent need for global action...',
    @status = 'submitted'

GO


CREATE OR ALTER PROCEDURE sp_DeleteDocument
    @document_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if document exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Documents WHERE document_id = @document_id)
    BEGIN
        RAISERROR('Document not found', 16, 1);
        RETURN;
    END
    
    -- Delete document (cascading will handle related votes)
    DELETE FROM dbo.Documents WHERE document_id = @document_id;
END;
GO

-- Example EXEC for sp_DeleteDocument
EXEC sp_DeleteDocument @document_id = 1

GO


CREATE OR ALTER PROCEDURE sp_GetDocumentsByCommittee
    @committee_id INT,
    @type VARCHAR(20) = NULL,
    @status VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if committee exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @committee_id)
    BEGIN
        RAISERROR('Committee not found', 16, 1);
        RETURN;
    END
    
    SELECT 
        d.*,
        u.full_name AS delegate_name,
        c.name AS country_name,
        b.name AS block_name
    FROM dbo.Documents d
    JOIN dbo.Users u ON d.delegate_id = u.user_id
    JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id
    JOIN dbo.Countries c ON da.country_id = c.country_id
    LEFT JOIN dbo.Blocks b ON d.block_id = b.block_id
    WHERE 
        da.committee_id = @committee_id
        AND (@type IS NULL OR d.type = @type)
        AND (@status IS NULL OR d.status = @status)
    ORDER BY d.updated_at DESC;
END;
GO

select * from Documents

select * from Delegates
select * from Committees
select * from DelegateAssignments

select * from Committees

-- Example EXEC for sp_GetDocumentsByCommittee
EXEC sp_GetDocumentsByCommittee 
    @committee_id = 1,
    @type = 'position_paper',
    @status = 'draft'

GO

CREATE OR ALTER PROCEDURE sp_GetDocumentsByDelegate
    @delegate_id INT,
    @type VARCHAR(20) = NULL,
    @status VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if delegate exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Delegates WHERE user_id = @delegate_id)
    BEGIN
        RAISERROR('Delegate not found', 16, 1);
        RETURN;
    END
    
    SELECT 
        d.*,
        b.name AS block_name,
        comm.name AS committee_name
    FROM dbo.Documents d
    LEFT JOIN dbo.Blocks b ON d.block_id = b.block_id
    LEFT JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id
    LEFT JOIN dbo.Committees comm ON da.committee_id = comm.committee_id
    WHERE 
        d.delegate_id = @delegate_id
        AND (@type IS NULL OR d.type = @type)
        AND (@status IS NULL OR d.status = @status)
    ORDER BY d.updated_at DESC;
END;
GO

-- Example EXEC for sp_GetDocumentsByDelegate
EXEC sp_GetDocumentsByDelegate 
    @delegate_id = 2,
    @type = 'position_paper'


--====================== Event Stored Procedures

GO

CREATE OR ALTER PROCEDURE sp_CreateEvent
    @committee_id INT,
    @type VARCHAR(10),
    @proposed_by INT,
    @description TEXT = NULL,
    @start_time DATETIME = NULL,
    @end_time DATETIME = NULL,
    @status VARCHAR(10) = 'pending',
    @duration_minutes INT = NULL,
    @topic VARCHAR(255) = NULL,
    @notes TEXT = NULL,
    @event_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if committee exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @committee_id)
    BEGIN
        RAISERROR('Committee not found', 16, 1);
        RETURN;
    END
    
    -- Check if delegate exists and is assigned to the committee
    IF NOT EXISTS (
        SELECT 1 
        FROM dbo.Delegates d
        JOIN dbo.DelegateAssignments da ON d.user_id = da.delegate_id
        WHERE d.user_id = @proposed_by AND da.committee_id = @committee_id
    )
    BEGIN
        RAISERROR('Delegate not found or not assigned to this committee', 16, 1);
        RETURN;
    END
    
    -- Validate event type
    IF @type NOT IN ('motion', 'speech', 'caucus', 'voting', 'break')
    BEGIN
        RAISERROR('Invalid event type', 16, 1);
        RETURN;
    END
    
    -- Validate status
    IF @status NOT IN ('pending', 'ongoing', 'completed', 'failed')
    BEGIN
        RAISERROR('Invalid event status', 16, 1);
        RETURN;
    END
    
    -- Insert new event
    INSERT INTO dbo.Events (
        committee_id, [type], proposed_by, [description], 
        start_time, end_time, [status], duration_minutes, 
        topic, notes
    )
    VALUES (
        @committee_id, @type, @proposed_by, @description, 
        @start_time, @end_time, @status, @duration_minutes, 
        @topic, @notes
    );
    
    -- Get the new event ID
    SET @event_id = SCOPE_IDENTITY();
END;
GO

-- Example EXEC for sp_CreateEvent
DECLARE @event_id INT
EXEC sp_CreateEvent 
    @committee_id = 1,
    @type = 'motion',
    @proposed_by = 5,
    @description = 'Motion to open debate on Mental health being fucked by db project',
    @duration_minutes = 5,
    @status = 'pending',
    @event_id = @event_id OUTPUT
SELECT @event_id AS 'New Event ID'

GO

CREATE OR ALTER PROCEDURE sp_GetEventById
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.*,
        u.full_name AS proposed_by_name,
        c.name AS committee_name
    FROM dbo.Events e
    JOIN dbo.Users u ON e.proposed_by = u.user_id
    JOIN dbo.Committees c ON e.committee_id = c.committee_id
    WHERE e.event_id = @event_id;
END;
GO

-- Example EXEC for sp_GetEventById
-- EXEC sp_GetEventById @event_id = 1

CREATE OR ALTER PROCEDURE sp_UpdateEvent
    @event_id INT,
    @description TEXT = NULL,
    @start_time DATETIME = NULL,
    @end_time DATETIME = NULL,
    @status VARCHAR(10) = NULL,
    @duration_minutes INT = NULL,
    @topic VARCHAR(255) = NULL,
    @notes TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if event exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Events WHERE event_id = @event_id)
    BEGIN
        RAISERROR('Event not found', 16, 1);
        RETURN;
    END
    
    -- Validate status if provided
    IF @status IS NOT NULL AND @status NOT IN ('pending', 'ongoing', 'completed', 'failed')
    BEGIN
        RAISERROR('Invalid event status', 16, 1);
        RETURN;
    END
    
    -- Update event
    UPDATE dbo.Events
    SET
        [description] = ISNULL(@description, [description]),
        start_time = ISNULL(@start_time, start_time),
        end_time = ISNULL(@end_time, end_time),
        [status] = ISNULL(@status, [status]),
        duration_minutes = ISNULL(@duration_minutes, duration_minutes),
        topic = ISNULL(@topic, topic),
        notes = ISNULL(@notes, notes)
    WHERE event_id = @event_id;
END;
GO

--Example EXEC for sp_UpdateEvent
EXEC sp_UpdateEvent 
    @event_id = 1,
    @status = 'ongoing',
    @duration_minutes = 45

go;
select * from Events 
go;

CREATE OR ALTER PROCEDURE sp_DeleteEvent
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if event exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Events WHERE event_id = @event_id)
    BEGIN
        RAISERROR('Event not found', 16, 1);
        RETURN;
    END
    
    -- Delete event (cascading will handle related votes)
    DELETE FROM dbo.Events WHERE event_id = @event_id;
END;
GO

-- -- Example EXEC for sp_DeleteEvent
-- EXEC sp_DeleteEvent @event_id = 1

CREATE OR ALTER PROCEDURE sp_GetEventsByCommittee
    @committee_id INT,
    @type VARCHAR(10) = NULL,
    @status VARCHAR(10) = NULL,
    @start_date DATE = NULL,
    @end_date DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if committee exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @committee_id)
    BEGIN
        RAISERROR('Committee not found', 16, 1);
        RETURN;
    END
    
    SELECT 
        e.*,
        u.full_name AS proposed_by_name
    FROM dbo.Events e
    JOIN dbo.Users u ON e.proposed_by = u.user_id
    WHERE 
        e.committee_id = @committee_id
        AND (@type IS NULL OR e.type = @type)
        AND (@status IS NULL OR e.status = @status)
        AND (@start_date IS NULL OR CAST(e.start_time AS DATE) >= @start_date)
        AND (@end_date IS NULL OR CAST(e.start_time AS DATE) <= @end_date)
    ORDER BY 
        CASE 
            WHEN e.status = 'ongoing' THEN 1
            WHEN e.status = 'pending' THEN 2
            WHEN e.status = 'completed' THEN 3
            WHEN e.status = 'failed' THEN 4
        END,
        e.start_time DESC;
END;
GO

-- Example EXEC for sp_GetEventsByCommittee
EXEC sp_GetEventsByCommittee 
    @committee_id = 1,
    @type = 'motion',
    @status = 'pending'

go;

CREATE OR ALTER PROCEDURE sp_GetEventsByDelegate
    @delegate_id INT,
    @type VARCHAR(10) = NULL,
    @status VARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if delegate exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Delegates WHERE user_id = @delegate_id)
    BEGIN
        RAISERROR('Delegate not found', 16, 1);
        RETURN;
    END
    
    SELECT 
        e.*,
        c.name AS committee_name
    FROM dbo.Events e
    JOIN dbo.Committees c ON e.committee_id = c.committee_id
    WHERE 
        e.proposed_by = @delegate_id
        AND (@type IS NULL OR e.type = @type)
        AND (@status IS NULL OR e.status = @status)
    ORDER BY e.start_time DESC;
END;
GO

select * from Events;

-- Example EXEC for sp_GetEventsByDelegate
EXEC sp_GetEventsByDelegate 
    @delegate_id = 5,
    @type = 'motion'

go;


-- ATTENDANCE MANAGEMENT STORED PROCEDURES
exec sp_RecordAttendance 3, 1, '2025-4-27', 'present'  

go;

CREATE OR ALTER PROCEDURE sp_RecordAttendance
    @user_id INT,
    @committee_id INT,
    @date DATE,
    @status VARCHAR(10),
    @check_in_time DATETIME = NULL,
    @notes TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate status value
    IF @status NOT IN ('present', 'absent', 'excused', 'late')
    BEGIN
        RAISERROR('Invalid status value. Must be present, absent, excused, or late.', 16, 1);
        RETURN;
    END
    
    -- Check if record exists
    IF EXISTS (SELECT 1 FROM Attendance WHERE user_id = @user_id AND committee_id = @committee_id AND [date] = @date)
    BEGIN
        -- Update existing record
        UPDATE Attendance
        SET status = @status,
            check_in_time = @check_in_time,
            notes = @notes
        WHERE user_id = @user_id AND committee_id = @committee_id AND [date] = @date;
    END
    ELSE
    BEGIN
        -- Insert new record
        INSERT INTO Attendance (user_id, committee_id, [date], status, check_in_time, notes)
        VALUES (@user_id, @committee_id, @date, @status, @check_in_time, @notes);
    END
END;
GO



CREATE OR ALTER PROCEDURE sp_GetAttendanceByDate
    @committee_id INT,
    @date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT a.*, u.full_name
    FROM Attendance a
    JOIN Users u ON a.user_id = u.user_id
    WHERE a.committee_id = @committee_id AND a.[date] = @date
    ORDER BY u.full_name;
END;
GO

exec sp_GetAttendanceByDate 1, '2025-4-27'

go;

CREATE OR ALTER PROCEDURE sp_UpdateAttendance
    @user_id INT,
    @committee_id INT,
    @date DATE,
    @status VARCHAR(10),
    @check_in_time DATETIME = NULL,
    @notes TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate status value
    IF @status NOT IN ('present', 'absent', 'excused', 'late')
    BEGIN
        RAISERROR('Invalid status value. Must be present, absent, excused, or late.', 16, 1);
        RETURN;
    END
    
    -- Update record
    UPDATE Attendance
    SET status = @status,
        check_in_time = @check_in_time,
        notes = @notes
    WHERE user_id = @user_id AND committee_id = @committee_id AND [date] = @date;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Attendance record not found', 16, 1);
    END
END;
GO

exec sp_UpdateAttendance 2, 1, '2025-4-27', 'present'

go;

select * from Attendance
go;

CREATE OR ALTER PROCEDURE sp_DeleteAttendance
    @user_id INT,
    @committee_id INT,
    @date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Attendance
    WHERE user_id = @user_id AND committee_id = @committee_id AND [date] = @date;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Attendance record not found', 16, 1);
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAttendanceByDelegate
    @delegate_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT a.*, c.name AS committee_name
    FROM Attendance a
    JOIN Committees c ON a.committee_id = c.committee_id
    WHERE a.user_id = @delegate_id
    ORDER BY a.[date] DESC;
END;
GO
exec sp_GetAttendanceByDelegate 2
go;

select * from Events
go;
-- SCORE MANAGEMENT STORED PROCEDURES

CREATE OR ALTER PROCEDURE sp_RecordScore
    @delegate_id INT,
    @category VARCHAR(20),
    @points DECIMAL(5,2),
    @chair_id INT,
    @event_id INT = NULL,
    @document_id INT = NULL,
    @comments TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
   
    -- Validate category
    IF @category NOT IN ('speech', 'motion', 'resolution', 'diplomacy', 'position_paper', 'working_paper', 'draft_resolution', 'amendment')
    BEGIN
        RAISERROR('Invalid category. Must be speech, motion, resolution, diplomacy, or overall.', 16, 1);
        RETURN;
    END
   
    -- Validate points range (assuming a 0-10 scale)
    IF @points < 0 OR @points > 10
    BEGIN
        RAISERROR('Points must be between 0 and 10', 16, 1);
        RETURN;
    END
   
    -- If document_id is provided, validate category is appropriate
    IF @document_id IS NOT NULL
    BEGIN
        -- Verify that the category is appropriate for documents
        IF @category NOT IN ('position_paper', 'working_paper', 'draft_resolution', 'resolution', 'amendment')
        BEGIN
            RAISERROR('When document_id is provided, category must be resolution or overall.', 16, 1);
            RETURN;
        END
       
        -- Verify document exists and belongs to the delegate
        DECLARE @doc_delegate_id INT
        SELECT @doc_delegate_id = delegate_id FROM Documents WHERE document_id = @document_id
       
        IF @doc_delegate_id IS NULL
        BEGIN
            RAISERROR('Document does not exist.', 16, 1);
            RETURN;
        END

    END
   
    -- If event_id is provided, validate category is appropriate
    IF @event_id IS NOT NULL
    BEGIN
        -- Verify that the category is appropriate for events
        IF @category NOT IN ('speech', 'motion', 'diplomacy')
        BEGIN
            RAISERROR('When event_id is provided, category must be speech, motion, or diplomacy.', 16, 1);
            RETURN;
        END
       
        -- Verify event exists and belongs to the delegate
        DECLARE @event_delegate_id INT
        SELECT @event_delegate_id = proposed_by FROM Events WHERE event_id = @event_id
       
        IF @event_delegate_id IS NULL
        BEGIN
            RAISERROR('Event does not exist.', 16, 1);
            RETURN;
        END
       
        IF @event_delegate_id != @delegate_id
        BEGIN
            RAISERROR('This delegate did not propose this event.', 16, 1);
            RETURN;
        END
    END
   
    -- Insert score
    INSERT INTO Scores (delegate_id, category, points, chair_id, event_id, document_id, comments)
    VALUES (@delegate_id, @category, @points, @chair_id, @event_id, @document_id, @comments);
   
    PRINT 'Score recorded successfully.';
END;
select * from DelegateAssignments
select * from Committees



exec sp_RecordScore 2, 'motion', 3.0,  3, 2, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 2, 'resolution', 5.09,  3, @document_id = 1, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 5, 'speech', 5.09,  3, @document_id = 1, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 2, 'motion', 5.0,  3, 2, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 5, 'diplomacy', 10,  3, 2, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 5, 'speech', 9,  3, 2, @comments = 'It was teh friking best had i been a girl i would ...'
exec sp_RecordScore 5, 'speech', 5.09,  3, @document_id = 1, @comments = 'It was teh friking best had i been a girl i would ...'

select * from Scores

go;


CREATE OR ALTER PROCEDURE sp_GetScoreById
    @score_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT s.*, u.full_name AS delegate_name, c.full_name AS chair_name
    FROM Scores s
    JOIN Users u ON s.delegate_id = u.user_id
    JOIN Users c ON s.chair_id = c.user_id
    WHERE s.score_id = @score_id;
END;
GO

exec sp_GetScoreById 1
go;

CREATE OR ALTER PROCEDURE sp_UpdateScore
    @score_id INT,
    @points DECIMAL(5,2),
    @comments TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate points range (assuming a 0-10 scale)
    IF @points < 0 OR @points > 10
    BEGIN
        RAISERROR('Points must be between 0 and 10', 16, 1);
        RETURN;
    END
    
    UPDATE Scores
    SET points = @points,
        comments = @comments,
        [timestamp] = GETDATE()
    WHERE score_id = @score_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Score record not found', 16, 1);
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteScore
    @score_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Scores
    WHERE score_id = @score_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Score record not found', 16, 1);
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_GetScoresByDelegate
    @delegate_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT s.*, e.type AS event_type, e.description AS event_description,
           d.title AS document_title, d.type AS document_type,
           u.full_name AS chair_name
    FROM Scores s
    LEFT JOIN Events e ON s.event_id = e.event_id
    LEFT JOIN Documents d ON s.document_id = d.document_id
    JOIN Users u ON s.chair_id = u.user_id
    WHERE s.delegate_id = @delegate_id
    ORDER BY s.[timestamp] DESC;
END;
GO

exec sp_GetScoresByDelegate 2

go;

CREATE OR ALTER PROCEDURE sp_GetScoresByCommittee
    @committee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT s.*, u.full_name AS delegate_name, c.full_name AS chair_name,
           e.type AS event_type, d.title AS document_title, d.type AS document_type
    FROM Scores s
    JOIN Users u ON s.delegate_id = u.user_id
    JOIN Users c ON s.chair_id = c.user_id
    LEFT JOIN Events e ON s.event_id = e.event_id
    LEFT JOIN Documents d ON s.document_id = d.document_id
    JOIN DelegateAssignments da ON s.delegate_id = da.delegate_id
    WHERE da.committee_id = @committee_id
    ORDER BY s.[timestamp] DESC;
END;
GO

-- VOTE MANAGEMENT STORED PROCEDURES
select * from Documents
exec sp_RecordVote 2, @document_id = 1, @vote =  'for', @notes = 'Me likes this shit and you  :)'

select * from Votes
go;

CREATE OR ALTER PROCEDURE sp_RecordVote
    @delegate_id INT,
    @event_id INT = NULL,
    @document_id INT = NULL,
    @vote VARCHAR(10),
    @notes TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate vote value
    IF @vote NOT IN ('for', 'against', 'abstain')
    BEGIN
        RAISERROR('Invalid vote value. Must be for, against, or abstain.', 16, 1);
        RETURN;
    END
    
    -- Check that exactly one of event_id or document_id is provided
    IF (@event_id IS NULL AND @document_id IS NULL) OR (@event_id IS NOT NULL AND @document_id IS NOT NULL)
    BEGIN
        RAISERROR('Exactly one of event_id or document_id must be provided', 16, 1);
        RETURN;
    END
    
    -- Check if vote already exists
    IF @event_id IS NOT NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM Votes WHERE delegate_id = @delegate_id AND event_id = @event_id)
        BEGIN
            -- Update existing vote
            UPDATE Votes
            SET vote = @vote, 
                [timestamp] = GETDATE(),
                notes = @notes
            WHERE delegate_id = @delegate_id AND event_id = @event_id;
            RETURN;
        END
    END
    ELSE -- @document_id is not NULL
    BEGIN
        IF EXISTS (SELECT 1 FROM Votes WHERE delegate_id = @delegate_id AND document_id = @document_id)
        BEGIN
            -- Update existing vote
            UPDATE Votes
            SET vote = @vote, 
                [timestamp] = GETDATE(),
                notes = @notes
            WHERE delegate_id = @delegate_id AND document_id = @document_id;
            RETURN;
        END
    END
    
    -- Insert new vote
    INSERT INTO Votes (event_id, document_id, delegate_id, vote, notes)
    VALUES (@event_id, @document_id, @delegate_id, @vote, @notes);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetVoteById
    @vote_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT v.*, u.full_name AS delegate_name,
           e.type AS event_type, e.description AS event_description,
           d.title AS document_title, d.type AS document_type
    FROM Votes v
    JOIN Users u ON v.delegate_id = u.user_id
    LEFT JOIN Events e ON v.event_id = e.event_id
    LEFT JOIN Documents d ON v.document_id = d.document_id
    WHERE v.vote_id = @vote_id;
END;
GO

exec sp_GetVoteById 1

go;


CREATE OR ALTER PROCEDURE sp_UpdateVote
    @vote_id INT,
    @vote VARCHAR(10),
    @notes TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate vote value
    IF @vote NOT IN ('for', 'against', 'abstain')
    BEGIN
        RAISERROR('Invalid vote value. Must be for, against, or abstain.', 16, 1);
        RETURN;
    END
    
    UPDATE Votes
    SET vote = @vote,
        [timestamp] = GETDATE(),
        notes = @notes
    WHERE vote_id = @vote_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Vote record not found', 16, 1);
    END
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteVote
    @vote_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM Votes
    WHERE vote_id = @vote_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Vote record not found', 16, 1);
    END
END;
GO
select * from Votes
select * from Documents

go;

CREATE OR ALTER PROCEDURE sp_GetVotesByDocument
    @document_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT v.*, u.full_name AS delegate_name, 
           c.name AS country_name
    FROM Votes v
    JOIN Users u ON v.delegate_id = u.user_id
    JOIN DelegateAssignments da ON v.delegate_id = da.delegate_id
    JOIN Countries c ON da.country_id = c.country_id
    WHERE v.document_id = @document_id
    ORDER BY v.[timestamp];
END;
GO

select * from Documents

exec sp_GetVotesByDocument 1

go;

CREATE OR ALTER PROCEDURE sp_GetVotesByEvent
    @event_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT v.*, u.full_name AS delegate_name, 
           c.name AS country_name
    FROM Votes v
    JOIN Users u ON v.delegate_id = u.user_id
    JOIN DelegateAssignments da ON v.delegate_id = da.delegate_id
    JOIN Countries c ON da.country_id = c.country_id
    WHERE v.event_id = @event_id
    ORDER BY v.[timestamp];
END;
GO



-- COMMITTEE AND COUNTRY ALLOCATION STORED PROCEDURES
-- 1. Assign a single delegate to a committee and country
CREATE OR ALTER PROCEDURE sp_AssignDelegateToCommittee
    @DelegateId INT,
    @CommitteeId INT,
    @CountryId INT,
    @BlockId INT = NULL,
    @ConferenceYear INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate input parameters
    IF NOT EXISTS (SELECT 1 FROM dbo.Delegates WHERE user_id = @DelegateId)
    BEGIN
        RAISERROR('Delegate ID does not exist', 16, 1);
        RETURN;
    END
    
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @CommitteeId)
    BEGIN
        RAISERROR('Committee ID does not exist', 16, 1);
        RETURN;
    END
    
    IF NOT EXISTS (SELECT 1 FROM dbo.Countries WHERE country_id = @CountryId)
    BEGIN
        RAISERROR('Country ID does not exist', 16, 1);
        RETURN;
    END
    
    IF @BlockId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Blocks WHERE block_id = @BlockId AND committee_id = @CommitteeId)
    BEGIN
        RAISERROR('Block ID does not exist or does not belong to the specified committee', 16, 1);
        RETURN;
    END
    
    -- Check if delegate is already assigned to this committee
    IF EXISTS (SELECT 1 FROM dbo.DelegateAssignments 
               WHERE delegate_id = @DelegateId 
               AND committee_id = @CommitteeId
               AND conference_year = ISNULL(@ConferenceYear, YEAR(GETDATE())))
    BEGIN
        RAISERROR('Delegate is already assigned to this committee for the specified year', 16, 1);
        RETURN;
    END
    
    -- Check if country is already assigned in this committee
    IF EXISTS (SELECT 1 FROM dbo.DelegateAssignments 
               WHERE country_id = @CountryId 
               AND committee_id = @CommitteeId
               AND conference_year = ISNULL(@ConferenceYear, YEAR(GETDATE())))
    BEGIN
        RAISERROR('Country is already assigned to another delegate in this committee', 16, 1);
        RETURN;
    END
    
    -- Set default conference year if not provided
    IF @ConferenceYear IS NULL
        SET @ConferenceYear = YEAR(GETDATE());
    
    -- Insert the assignment
    INSERT INTO dbo.DelegateAssignments (
        delegate_id,
        committee_id,
        country_id,
        block_id,
        conference_year,
        assignment_date
    ) VALUES (
        @DelegateId,
        @CommitteeId,
        @CountryId,
        @BlockId,
        @ConferenceYear,
        GETDATE()
    );
    
    SELECT 'Delegate successfully assigned to committee with country.' AS Result;
END;
GO

select * from Countries
select * from Delegates
select * from Committees

-- Test execution of single delegate assignment
EXEC sp_AssignDelegateToCommittee 
    @DelegateId = 2, 
    @CommitteeId = 1, 
    @CountryId = 2;
GO

select * from DelegateAssignments

go

-- 2. Update delegate assignment
CREATE OR ALTER PROCEDURE sp_UpdateDelegateAssignment
    @AssignmentId INT,
    @CommitteeId INT = NULL,
    @CountryId INT = NULL,
    @BlockId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate assignment exists
    IF NOT EXISTS (SELECT 1 FROM dbo.DelegateAssignments WHERE assignment_id = @AssignmentId)
    BEGIN
        RAISERROR('Assignment ID does not exist', 16, 1);
        RETURN;
    END
    
    -- Get current values if new ones are not provided
    DECLARE @CurrentCommitteeId INT, @CurrentCountryId INT;
    
    SELECT 
        @CurrentCommitteeId = committee_id,
        @CurrentCountryId = country_id
    FROM 
        dbo.DelegateAssignments
    WHERE 
        assignment_id = @AssignmentId;
    
    -- Use current values if new ones not provided
    SET @CommitteeId = ISNULL(@CommitteeId, @CurrentCommitteeId);
    SET @CountryId = ISNULL(@CountryId, @CurrentCountryId);
    
    -- Validate committee if changing
    IF @CommitteeId <> @CurrentCommitteeId AND NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @CommitteeId)
    BEGIN
        RAISERROR('New Committee ID does not exist', 16, 1);
        RETURN;
    END
    
    -- Validate country if changing
    IF @CountryId <> @CurrentCountryId AND NOT EXISTS (SELECT 1 FROM dbo.Countries WHERE country_id = @CountryId)
    BEGIN
        RAISERROR('New Country ID does not exist', 16, 1);
        RETURN;
    END
    
    -- Validate block if provided
    IF @BlockId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Blocks WHERE block_id = @BlockId AND committee_id = @CommitteeId)
    BEGIN
        RAISERROR('Block ID does not exist or does not belong to the specified committee', 16, 1);
        RETURN;
    END
    
    -- Check if country is already assigned in this committee (if changing committee or country)
    DECLARE @DelegateId INT, @ConferenceYear INT;
    
    SELECT 
        @DelegateId = delegate_id,
        @ConferenceYear = conference_year
    FROM 
        dbo.DelegateAssignments
    WHERE 
        assignment_id = @AssignmentId;
    
    IF (@CommitteeId <> @CurrentCommitteeId OR @CountryId <> @CurrentCountryId) AND
       EXISTS (SELECT 1 FROM dbo.DelegateAssignments 
               WHERE country_id = @CountryId 
               AND committee_id = @CommitteeId
               AND conference_year = @ConferenceYear
               AND assignment_id <> @AssignmentId)
    BEGIN
        RAISERROR('Country is already assigned to another delegate in this committee', 16, 1);
        RETURN;
    END
    
    -- Update the assignment
    UPDATE dbo.DelegateAssignments
    SET 
        committee_id = @CommitteeId,
        country_id = @CountryId,
        block_id = @BlockId
    WHERE 
        assignment_id = @AssignmentId;
    
    SELECT 'Delegate assignment updated successfully.' AS Result;
END;
GO

-- Test execution of update assignment
EXEC sp_UpdateDelegateAssignment 
    @AssignmentId = 1, 
    @CountryId = 2, 
    @BlockId = 1;
GO


go;

-- 3. Remove delegate assignment
CREATE OR ALTER PROCEDURE sp_RemoveDelegateAssignment
    @AssignmentId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate assignment exists
    IF NOT EXISTS (SELECT 1 FROM dbo.DelegateAssignments WHERE assignment_id = @AssignmentId)
    BEGIN
        RAISERROR('Assignment ID does not exist', 16, 1);
        RETURN;
    END
    
    -- Delete the assignment
    DELETE FROM dbo.DelegateAssignments
    WHERE assignment_id = @AssignmentId;
    
    SELECT 'Delegate assignment removed successfully.' AS Result;
END;
GO
select * from DelegateAssignments da
join  Countries c on c.country_id = da.country_id

-- Test execution of remove assignment
EXEC sp_RemoveDelegateAssignment @AssignmentId = 3;
GO

-- 4. Get delegate assignments
CREATE OR ALTER PROCEDURE sp_GetDelegateAssignments
    @DelegateId INT = NULL,
    @CommitteeId INT = NULL,
    @CountryId INT = NULL,
    @ConferenceYear INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        da.assignment_id,
        da.delegate_id,
        u.full_name AS delegate_name,
        da.committee_id,
        c.name AS committee_name,
        c.topic AS committee_topic,
        da.country_id,
        co.name AS country_name,
        da.block_id,
        b.name AS block_name,
        da.conference_year,
        da.assignment_date
    FROM 
        dbo.DelegateAssignments da
        JOIN dbo.Users u ON da.delegate_id = u.user_id
        JOIN dbo.Committees c ON da.committee_id = c.committee_id
        JOIN dbo.Countries co ON da.country_id = co.country_id
        LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id
    WHERE 
        (@DelegateId IS NULL OR da.delegate_id = @DelegateId)
        AND (@CommitteeId IS NULL OR da.committee_id = @CommitteeId)
        AND (@CountryId IS NULL OR da.country_id = @CountryId)
        AND (@ConferenceYear IS NULL OR da.conference_year = @ConferenceYear)
    ORDER BY 
        da.committee_id, co.name;
END;
GO

-- Test execution of get assignments
EXEC sp_GetDelegateAssignments;
EXEC sp_GetDelegateAssignments @DelegateId = 2;
EXEC sp_GetDelegateAssignments @CommitteeId = 1;
GO

-- 5. Assign delegate to block
CREATE OR ALTER PROCEDURE sp_AssignDelegateToBlock
    @AssignmentId INT,
    @BlockId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate assignment exists
    IF NOT EXISTS (SELECT 1 FROM dbo.DelegateAssignments WHERE assignment_id = @AssignmentId)
    BEGIN
        RAISERROR('Assignment ID does not exist', 16, 1);
        RETURN;
    END
    
    -- Get committee ID for the assignment
    DECLARE @CommitteeId INT;
    SELECT @CommitteeId = committee_id FROM dbo.DelegateAssignments WHERE assignment_id = @AssignmentId;
    
    -- Validate block belongs to the correct committee
    IF NOT EXISTS (SELECT 1 FROM dbo.Blocks WHERE block_id = @BlockId AND committee_id = @CommitteeId)
    BEGIN
        RAISERROR('Block ID does not exist or does not belong to the delegate''s committee', 16, 1);
        RETURN;
    END
    
    -- Update the assignment with the block
    UPDATE dbo.DelegateAssignments
    SET block_id = @BlockId
    WHERE assignment_id = @AssignmentId;
    
    SELECT 'Delegate successfully assigned to block.' AS Result;
END;
GO

select * from DelegateAssignments da
join  Countries c on c.country_id = da.country_id


-- Test execution of assign to block
EXEC sp_AssignDelegateToBlock @AssignmentId = 2, @BlockId = 1;
GO



go;


-- Drop procedures if they exist
IF OBJECT_ID('dbo.PopulateCountries', 'P') IS NOT NULL DROP PROCEDURE dbo.PopulateCountries;
IF OBJECT_ID('dbo.AllocateCountriesByExperience', 'P') IS NOT NULL DROP PROCEDURE dbo.AllocateCountriesByExperience;
GO


exec dbo.PopulateCountries

go;


-- Procedure to populate countries table
CREATE or Alter PROCEDURE dbo.PopulateCountries
AS
BEGIN
    -- Check if countries already exist
    IF (SELECT COUNT(*) FROM dbo.Countries) > 0
    BEGIN
        PRINT 'Countries table already populated. Skipping insertion.';
        RETURN;
    END
    
    -- Insert predefined countries with importance ranking
    INSERT INTO dbo.Countries ([name], importance)
    VALUES
        ('United States', 1), ('China', 2), ('Russia', 3), ('United Kingdom', 4), ('France', 5),
        ('Germany', 6), ('Japan', 7), ('India', 8), ('Brazil', 9), ('South Africa', 10),
        ('Canada', 11), ('Australia', 12), ('Italy', 13), ('Mexico', 14), ('South Korea', 15),
        ('Indonesia', 16), ('Turkey', 17), ('Saudi Arabia', 18), ('Argentina', 19), ('Egypt', 20),
        ('Spain', 21), ('Netherlands', 22), ('Sweden', 23), ('Pakistan', 24), ('Nigeria', 25),
        ('Thailand', 26), ('Malaysia', 27), ('Vietnam', 28), ('Norway', 29), ('Switzerland', 30),
        ('Bangladesh', 31), ('Philippines', 32), ('United Arab Emirates', 33), ('Greece', 34),
        ('Chile', 35), ('Colombia', 36), ('Poland', 37), ('Czech Republic', 38), ('Belgium', 39),
        ('New Zealand', 40), ('Denmark', 41), ('Singapore', 42), ('Finland', 43), ('Portugal', 44),
        ('Israel', 45), ('Ireland', 46), ('Austria', 47), ('Ukraine', 48), ('Qatar', 49),
        ('Hungary', 50), ('Morocco', 51), ('Peru', 52), ('Romania', 53), ('Algeria', 54),
        ('Kazakhstan', 55), ('Luxembourg', 56), ('Croatia', 57), ('Lithuania', 58);
        
    PRINT 'Successfully populated Countries table with 58 countries.';
END;
GO

-- Procedure to allocate countries to delegates based on experience scores
CREATE or alter PROCEDURE dbo.AllocateCountriesByExperience
    @CommitteeId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Create temporary table to hold delegate scores
    CREATE TABLE #DelegateScores (
        delegate_id INT PRIMARY KEY,
        total_points INT DEFAULT 0,
        rank_in_committee INT,
        assigned_country_id INT NULL
    );
    
    -- Calculate experience points for each delegate in the committee
    -- Based on awards: BD (10 points), OD (5 points), HM (3 points), participation (1 point)
    INSERT INTO #DelegateScores (delegate_id, total_points)
    SELECT 
        da.delegate_id,
        COALESCE(SUM(
            CASE 
                WHEN pe.awards = 'BD' THEN 10
                WHEN pe.awards = 'OD' THEN 5
                WHEN pe.awards = 'HM' THEN 3
                ELSE 1 -- 1 point for participation without award
            END
        ), 0) AS total_points
    FROM 
        dbo.DelegateAssignments da
        LEFT JOIN dbo.PastExperiences pe ON da.delegate_id = pe.user_id
    WHERE 
        da.committee_id = @CommitteeId
    GROUP BY 
        da.delegate_id;
    
    -- Rank delegates within the committee based on their scores
    WITH RankedDelegates AS (
        SELECT 
            delegate_id,
            total_points,
            ROW_NUMBER() OVER (ORDER BY total_points DESC, delegate_id) AS rank_in_committee
        FROM 
            #DelegateScores
    )
    UPDATE #DelegateScores
    SET rank_in_committee = rd.rank_in_committee
    FROM #DelegateScores ds
    JOIN RankedDelegates rd ON ds.delegate_id = rd.delegate_id;
    
    -- Get countries ordered by importance (higher = more important)
    -- that are not already assigned to delegates in this committee
    WITH AvailableCountries AS (
        SELECT 
            c.country_id,
            c.importance,
            ROW_NUMBER() OVER (ORDER BY c.importance ASC) AS country_rank
        FROM 
            dbo.Countries c
        WHERE 
            c.country_id NOT IN (
                SELECT DISTINCT da.country_id 
                FROM dbo.DelegateAssignments da 
                WHERE da.committee_id = @CommitteeId AND da.country_id IS NOT NULL
            )
    )
    
    -- Match delegates to countries based on their rank
    -- Higher ranked delegates get more important countries (lower importance number)
    UPDATE ds
    SET assigned_country_id = ac.country_id
    FROM #DelegateScores ds
    INNER JOIN AvailableCountries ac 
        ON ds.rank_in_committee = ac.country_rank;
    
    -- Update DelegateAssignments table with the assigned countries
    UPDATE da
    SET country_id = ds.assigned_country_id
    FROM dbo.DelegateAssignments da
    INNER JOIN #DelegateScores ds ON da.delegate_id = ds.delegate_id
    WHERE da.committee_id = @CommitteeId;
    
    -- Output the assignments for verification
    SELECT 
        u.full_name AS delegate_name,
        c.[name] AS country_name,
        c.importance AS country_importance,
        ds.total_points AS experience_points,
        ds.rank_in_committee AS delegate_rank
    FROM 
        #DelegateScores ds
        INNER JOIN dbo.DelegateAssignments da ON ds.delegate_id = da.delegate_id
        INNER JOIN dbo.Users u ON da.delegate_id = u.user_id
        INNER JOIN dbo.Countries c ON ds.assigned_country_id = c.country_id
    WHERE 
        da.committee_id = @CommitteeId
    ORDER BY 
        ds.rank_in_committee;
    
    -- Clean up
    DROP TABLE #DelegateScores;
    
    PRINT 'Country allocation completed successfully.';
END;
GO

-- Example execution
EXEC dbo.PopulateCountries;

delete from Countries

GO

select * from 

-- Example: Allocate countries for committee #1
EXEC dbo.AllocateCountriesByExperience @CommitteeId = 1;

select * from countries



select * from DelegateAssignments da
join  Countries c on c.country_id = da.country_id




-- Drop procedure if it exists
IF OBJECT_ID('dbo.AllocateCountryToSingleDelegate', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.AllocateCountryToSingleDelegate;
GO

CREATE PROCEDURE dbo.AllocateCountryToSingleDelegate
    @DelegateId INT,
    @CommitteeId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Variables to store delegate scores and tier
    DECLARE @TotalPoints INT = 0;
    DECLARE @ExperienceTier VARCHAR(20);
    DECLARE @AssignedCountry INT = NULL;
    
    -- Calculate experience points for the delegate
    SELECT @TotalPoints = COALESCE(SUM(
        CASE 
            WHEN pe.awards = 'BD' THEN 10
            WHEN pe.awards = 'OD' THEN 5
            WHEN pe.awards = 'HM' THEN 3
            ELSE 1 -- 1 point for participation without award
        END
    ), 0)
    FROM dbo.PastExperiences pe
    WHERE pe.user_id = @DelegateId;
    
    -- Determine experience tier based on absolute point threshold
    SET @ExperienceTier = 
        CASE 
            WHEN @TotalPoints >= 20 THEN 'Elite'         -- Top tier countries (1-5)
            WHEN @TotalPoints >= 10 THEN 'Experienced'   -- Good countries (6-15)
            WHEN @TotalPoints >= 5 THEN 'Intermediate'   -- Medium countries (16-30)
            ELSE 'Beginner'                              -- Lower tier countries (31+)
        END;
    
    -- Find the best available country based on delegate's tier
    IF @ExperienceTier = 'Elite'
    BEGIN
        -- Elite delegates get countries with importance 1-5
        SELECT TOP 1 @AssignedCountry = country_id
        FROM dbo.Countries
        WHERE importance BETWEEN 1 AND 5
        AND country_id NOT IN (
            SELECT country_id 
            FROM dbo.DelegateAssignments 
            WHERE committee_id = @CommitteeId 
            AND country_id IS NOT NULL
        )
        ORDER BY importance ASC;
        
        -- If no top-tier country available, get next best
        IF @AssignedCountry IS NULL
        BEGIN
            SELECT TOP 1 @AssignedCountry = country_id
            FROM dbo.Countries
            WHERE importance BETWEEN 6 AND 15
            AND country_id NOT IN (
                SELECT country_id 
                FROM dbo.DelegateAssignments 
                WHERE committee_id = @CommitteeId 
                AND country_id IS NOT NULL
            )
            ORDER BY importance ASC;
        END;
    END
    ELSE IF @ExperienceTier = 'Experienced'
    BEGIN
        -- Experienced delegates get countries with importance 6-15
        SELECT TOP 1 @AssignedCountry = country_id
        FROM dbo.Countries
        WHERE importance BETWEEN 6 AND 15
        AND country_id NOT IN (
            SELECT country_id 
            FROM dbo.DelegateAssignments 
            WHERE committee_id = @CommitteeId 
            AND country_id IS NOT NULL
        )
        ORDER BY importance ASC;
        
        -- If no suitable country available, try alternative ranges
        IF @AssignedCountry IS NULL
        BEGIN
            SELECT TOP 1 @AssignedCountry = country_id
            FROM dbo.Countries
            WHERE (importance BETWEEN 1 AND 5 OR importance BETWEEN 16 AND 30)
            AND country_id NOT IN (
                SELECT country_id 
                FROM dbo.DelegateAssignments 
                WHERE committee_id = @CommitteeId 
                AND country_id IS NOT NULL
            )
            ORDER BY importance ASC;
        END;
    END
    ELSE IF @ExperienceTier = 'Intermediate'
    BEGIN
        -- Intermediate delegates get countries with importance 16-30
        SELECT TOP 1 @AssignedCountry = country_id
        FROM dbo.Countries
        WHERE importance BETWEEN 16 AND 30
        AND country_id NOT IN (
            SELECT country_id 
            FROM dbo.DelegateAssignments 
            WHERE committee_id = @CommitteeId 
            AND country_id IS NOT NULL
        )
        ORDER BY importance ASC;
        
        -- If no suitable country available, try less important countries
        IF @AssignedCountry IS NULL
        BEGIN
            SELECT TOP 1 @AssignedCountry = country_id
            FROM dbo.Countries
            WHERE importance > 30
            AND country_id NOT IN (
                SELECT country_id 
                FROM dbo.DelegateAssignments 
                WHERE committee_id = @CommitteeId 
                AND country_id IS NOT NULL
            )
            ORDER BY importance ASC;
        END;
    END
    ELSE -- Beginner
    BEGIN
        -- Beginner delegates get countries with importance > 30
        SELECT TOP 1 @AssignedCountry = country_id
        FROM dbo.Countries
        WHERE importance > 30
        AND country_id NOT IN (
            SELECT country_id 
            FROM dbo.DelegateAssignments 
            WHERE committee_id = @CommitteeId 
            AND country_id IS NOT NULL
        )
        ORDER BY importance ASC;
    END;
    
    -- If still no country found, get any available country
    IF @AssignedCountry IS NULL
    BEGIN
        SELECT TOP 1 @AssignedCountry = country_id
        FROM dbo.Countries
        WHERE country_id NOT IN (
            SELECT country_id 
            FROM dbo.DelegateAssignments 
            WHERE committee_id = @CommitteeId 
            AND country_id IS NOT NULL
        )
        ORDER BY importance ASC;
    END;
    
    -- If we found an available country, update or insert the assignment
    IF @AssignedCountry IS NOT NULL
    BEGIN
        -- Check if this delegate already has an assignment in this committee
        IF EXISTS (
            SELECT 1 FROM dbo.DelegateAssignments 
            WHERE delegate_id = @DelegateId AND committee_id = @CommitteeId
        )
        BEGIN
            -- Update existing assignment
            UPDATE dbo.DelegateAssignments
            SET country_id = @AssignedCountry
            WHERE delegate_id = @DelegateId AND committee_id = @CommitteeId;
        END
        ELSE
        BEGIN
            -- Create new assignment
            INSERT INTO dbo.DelegateAssignments (delegate_id, committee_id, country_id, assignment_date)
            VALUES (@DelegateId, @CommitteeId, @AssignedCountry, GETDATE());
        END;
        
        -- Return information about the assignment
        SELECT 
            u.full_name AS delegate_name,
            @TotalPoints AS experience_points,
            @ExperienceTier AS experience_tier,
            c.[name] AS country_name,
            c.importance AS country_importance,
            comm.[name] AS committee_name,
            'Success' AS status
        FROM 
            dbo.Users u
            CROSS JOIN dbo.Countries c
            CROSS JOIN dbo.Committees comm
        WHERE 
            u.user_id = @DelegateId
            AND c.country_id = @AssignedCountry
            AND comm.committee_id = @CommitteeId;
            
        PRINT 'Country allocation successful: Delegate ID ' + CAST(@DelegateId AS VARCHAR) + 
              ' assigned to country ID ' + CAST(@AssignedCountry AS VARCHAR) + 
              ' in committee ID ' + CAST(@CommitteeId AS VARCHAR);
    END
    ELSE
    BEGIN
        -- No country available
        SELECT 
            u.full_name AS delegate_name,
            @TotalPoints AS experience_points,
            @ExperienceTier AS experience_tier,
            'No available countries' AS country_name,
            NULL AS country_importance,
            comm.[name] AS committee_name,
            'Failed - No available countries' AS status
        FROM 
            dbo.Users u
            CROSS JOIN dbo.Committees comm
        WHERE 
            u.user_id = @DelegateId
            AND comm.committee_id = @CommitteeId;
            
        PRINT 'Country allocation failed: No available countries in committee ID ' + 
              CAST(@CommitteeId AS VARCHAR) + ' for delegate ID ' + CAST(@DelegateId AS VARCHAR);
    END;
END;
GO

-- Example usage:

select * from Delegates d
join DelegateAssignments da on d.user_id = da.delegate_id
EXEC dbo.AllocateCountryToSingleDelegate @DelegateId = 5, @CommitteeId = 1;

select * from DelegateAssignments da 
join Countries c on da.country_id = c.country_id
select * from PastExperiences


 GO


-- ================= 
-- Administrative Procedures
-- 1. Assign Chair To Committee
CREATE OR ALTER PROCEDURE sp_AssignChairToCommittee
    @chair_id INT,
    @committee_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate chair exists and is a chair
    IF NOT EXISTS (SELECT 1 FROM dbo.Chairs WHERE user_id = @chair_id)
    BEGIN
        RAISERROR('The specified user is not a chair', 16, 1);
        RETURN;
    END
    
    -- Update committee with new chair
    UPDATE dbo.Committees
    SET chair_id = @chair_id
    WHERE committee_id = @committee_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Committee not found', 16, 1);
        RETURN;
    END
    
    SELECT 'Chair successfully assigned to committee' AS Result;
END
GO



exec sp_CalculateOverallScores 1

select * from Scores

go;


-- 2. Calculate Overall Scores
CREATE OR ALTER PROCEDURE sp_CalculateOverallScores
    @committee_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Create temporary table to store results
    CREATE TABLE #OverallScores (
        delegate_id INT,
        committee_id INT,
        speech_avg DECIMAL(5,2),
        motion_avg DECIMAL(5,2),
        resolution_avg DECIMAL(5,2),
        diplomacy_avg DECIMAL(5,2),
        overall_score DECIMAL(5,2)
    );
    
    -- Insert calculated scores
    INSERT INTO #OverallScores (delegate_id, committee_id, speech_avg, motion_avg, resolution_avg, diplomacy_avg, overall_score)
    SELECT 
        da.delegate_id,
        da.committee_id,
        ISNULL(AVG(CASE WHEN s.category = 'speech' THEN s.points END), 0) AS speech_avg,
        ISNULL(AVG(CASE WHEN s.category = 'motion' THEN s.points END), 0) AS motion_avg,
        ISNULL(AVG(CASE WHEN s.category = 'resolution' THEN s.points END), 0) AS resolution_avg,
        ISNULL(AVG(CASE WHEN s.category = 'diplomacy' THEN s.points END), 0) AS diplomacy_avg,
        ISNULL(AVG(s.points), 0) AS overall_score
    FROM 
        dbo.DelegateAssignments da
        LEFT JOIN dbo.Scores s ON da.delegate_id = s.delegate_id
    WHERE
        (@committee_id IS NULL OR da.committee_id = @committee_id)
    GROUP BY 
        da.delegate_id, da.committee_id;
    
    -- Update overall scores in the Scores table
    MERGE dbo.Scores AS target
    USING (
        SELECT 
            os.delegate_id,
            'overall' AS category,
            os.overall_score AS points,
            c.chair_id,
            GETDATE() AS timestamp,
            NULL AS event_id,
            NULL AS document_id,
            'Automatically calculated overall score' AS comments
        FROM 
            #OverallScores os
            JOIN dbo.DelegateAssignments da ON os.delegate_id = da.delegate_id AND os.committee_id = da.committee_id
            JOIN dbo.Committees c ON da.committee_id = c.committee_id
    ) AS source
    ON (target.delegate_id = source.delegate_id AND target.category = source.category)
    WHEN MATCHED THEN
        UPDATE SET 
            points = source.points,
            timestamp = source.timestamp,
            comments = source.comments
    WHEN NOT MATCHED THEN
        INSERT (delegate_id, category, points, chair_id, timestamp, event_id, document_id, comments)
        VALUES (source.delegate_id, source.category, source.points, source.chair_id, source.timestamp, source.event_id, source.document_id, source.comments);
    
    -- Return the results
    SELECT 
        os.delegate_id,
        u.full_name AS delegate_name,
        c.name AS committee_name,
        co.name AS country_name,
        os.speech_avg,
        os.motion_avg,
        os.resolution_avg,
        os.diplomacy_avg,
        os.overall_score
    FROM 
        #OverallScores os
        JOIN dbo.Users u ON os.delegate_id = u.user_id
        JOIN dbo.DelegateAssignments da ON os.delegate_id = da.delegate_id AND os.committee_id = da.committee_id
        JOIN dbo.Committees c ON da.committee_id = c.committee_id
        JOIN dbo.Countries co ON da.country_id = co.country_id
    ORDER BY 
        c.name, os.overall_score DESC;
    
    -- Clean up
    DROP TABLE #OverallScores;
END
GO

exec sp_GenerateAwards 1

select * from PastExperiences

go;


-- 3. Generate Awards
CREATE OR ALTER PROCEDURE sp_GenerateAwards
    @committee_id INT,
    @top_delegates INT = 3
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate committee exists
    IF NOT EXISTS (SELECT 1 FROM dbo.Committees WHERE committee_id = @committee_id)
    BEGIN
        RAISERROR('Committee not found', 16, 1);
        RETURN;
    END
    
    -- Calculate scores if not already done
    EXEC sp_CalculateOverallScores @committee_id;
    
    -- Generate awards
    WITH RankedDelegates AS (
        SELECT 
            da.delegate_id,
            u.full_name AS delegate_name,
            c.name AS country_name,
            s.points AS overall_score,
            ROW_NUMBER() OVER (ORDER BY s.points DESC) AS rank
        FROM 
            dbo.DelegateAssignments da
            JOIN dbo.Users u ON da.delegate_id = u.user_id
            JOIN dbo.Countries c ON da.country_id = c.country_id
            JOIN dbo.Scores s ON da.delegate_id = s.delegate_id AND s.category = 'overall'
        WHERE 
            da.committee_id = @committee_id
    )
    SELECT 
        delegate_id,
        delegate_name,
        country_name,
        overall_score,
        CASE 
            WHEN rank = 1 THEN 'Best Delegate (BD)'
            WHEN rank = 2 THEN 'Outstanding Delegate (OD)'
            WHEN rank <= @top_delegates THEN 'Honorable Mention (HM)'
            ELSE NULL
        END AS award
    FROM 
        RankedDelegates
    WHERE 
        rank <= @top_delegates
    ORDER BY 
        rank;
END
GO

-- 4. Change Document Status
CREATE OR ALTER PROCEDURE sp_ChangeDocumentStatus
    @document_id INT,
    @new_status VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate status
    IF @new_status NOT IN ('draft', 'submitted', 'approved', 'rejected', 'published')
    BEGIN
        RAISERROR('Invalid status. Valid statuses are: draft, submitted, approved, rejected, published', 16, 1);
        RETURN;
    END
    
    -- Update document status
    UPDATE dbo.Documents
    SET 
        status = @new_status,
        updated_at = GETDATE()
    WHERE 
        document_id = @document_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Document not found', 16, 1);
        RETURN;
    END
    
    SELECT 'Document status successfully updated to ' + @new_status AS Result;
END
GO

-- 5. Change Event Status
CREATE OR ALTER PROCEDURE sp_ChangeEventStatus
    @event_id INT,
    @new_status VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate status
    IF @new_status NOT IN ('pending', 'ongoing', 'completed', 'failed')
    BEGIN
        RAISERROR('Invalid status. Valid statuses are: pending, ongoing, completed, failed', 16, 1);
        RETURN;
    END
    
    -- Update event status
    UPDATE dbo.Events
    SET status = @new_status
    WHERE event_id = @event_id;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Event not found', 16, 1);
        RETURN;
    END
    
    -- If the event is now ongoing, set the start time
    IF @new_status = 'ongoing'
    BEGIN
        UPDATE dbo.Events
        SET start_time = GETDATE()
        WHERE event_id = @event_id AND start_time IS NULL;
    END
    
    -- If the event is now completed or failed, set the end time
    IF @new_status IN ('completed', 'failed')
    BEGIN
        UPDATE dbo.Events
        SET end_time = GETDATE()
        WHERE event_id = @event_id AND end_time IS NULL;
    END
    
    SELECT 'Event status successfully updated to ' + @new_status AS Result;
END
GO

-- Now let's create the Views
-- 1. User Details View
CREATE OR ALTER VIEW vw_UserDetails
AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.role,
    u.phone,
    u.created_at,
    u.last_login,
    CASE 
        WHEN u.role = 'delegate' THEN d.experience_level
        WHEN u.role = 'chair' THEN 'Chair'
        WHEN u.role = 'admin' THEN a.admin_level
        ELSE NULL
    END AS role_level,
    CASE 
        WHEN u.role = 'delegate' THEN d.emergency_contact
        WHEN u.role = 'admin' THEN a.contact_number
        ELSE NULL
    END AS contact_info
FROM 
    dbo.Users u
    LEFT JOIN dbo.Delegates d ON u.user_id = d.user_id
    LEFT JOIN dbo.Chairs ch ON u.user_id = ch.user_id
    LEFT JOIN dbo.Admins a ON u.user_id = a.user_id;
GO

select * from vw_UserDetails
go;

-- 2. Delegate Details View
select * from vw_DelegateDetails
go;

CREATE OR ALTER VIEW vw_DelegateDetails
AS
SELECT 
    d.user_id AS delegate_id,
    u.full_name AS delegate_name,
    u.email,
    d.experience_level,
    d.emergency_contact,
    da.committee_id,
    c.name AS committee_name,
    da.country_id,
    co.name AS country_name,
    co.flag_url,
    da.block_id,
    b.name AS block_name,
    ISNULL(s.points, 0) AS overall_score
FROM 
    dbo.Delegates d
    JOIN dbo.Users u ON d.user_id = u.user_id
    LEFT JOIN dbo.DelegateAssignments da ON d.user_id = da.delegate_id
    LEFT JOIN dbo.Committees c ON da.committee_id = c.committee_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id
    LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id
    LEFT JOIN dbo.Scores s ON d.user_id = s.delegate_id AND s.category = 'overall';
GO

-- 3. Chair Details View
CREATE OR ALTER VIEW vw_ChairDetails
AS
SELECT 
    ch.user_id AS chair_id,
    u.full_name AS chair_name,
    u.email,
    u.phone,
    c.committee_id,
    c.name AS committee_name,
    c.topic,
    ch.chairing_experience,
    ch.evaluation_metrics
FROM 
    dbo.Chairs ch
    JOIN dbo.Users u ON ch.user_id = u.user_id
    LEFT JOIN dbo.Committees c ON ch.user_id = c.chair_id;
GO
select * from vw_ChairDetails

go;

-- 4. Admin Details View
CREATE OR ALTER VIEW vw_AdminDetails
AS
SELECT 
    a.user_id AS admin_id,
    u.full_name AS admin_name,
    u.email,
    a.admin_level,
    a.contact_number,
    a.last_activity
FROM 
    dbo.Admins a
    JOIN dbo.Users u ON a.user_id = u.user_id;
GO

select * from vw_AdminDetails
go;

-- 5. Committee Details View
CREATE OR ALTER VIEW vw_CommitteeDetails
AS
SELECT 
    c.committee_id,
    c.name AS committee_name,
    c.description,
    c.topic,
    c.difficulty,
    c.capacity,
    c.location,
    c.start_date,
    c.end_date,
    c.chair_id,
    u.full_name AS chair_name,
    (SELECT COUNT(*) FROM dbo.DelegateAssignments da WHERE da.committee_id = c.committee_id) AS delegate_count,
    (SELECT COUNT(*) FROM dbo.Events e WHERE e.committee_id = c.committee_id) AS event_count,
    (SELECT COUNT(*) FROM dbo.Documents d 
     JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id 
     WHERE da.committee_id = c.committee_id) AS document_count
FROM 
    dbo.Committees c
    JOIN dbo.Users u ON c.chair_id = u.user_id;
GO
select * from vw_CommitteeDetails
GO

-- 6. Committee Delegates View
CREATE OR ALTER VIEW vw_CommitteeDelegates
AS
SELECT 
    c.committee_id,
    c.name AS committee_name,
    c.topic,
    da.delegate_id,
    u.full_name AS delegate_name,
    da.country_id,
    co.name AS country_name,
    da.block_id,
    b.name AS block_name,
    ISNULL(s.points, 0) AS overall_score
FROM 
    dbo.Committees c
    JOIN dbo.DelegateAssignments da ON c.committee_id = da.committee_id
    JOIN dbo.Users u ON da.delegate_id = u.user_id
    JOIN dbo.Countries co ON da.country_id = co.country_id
    LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id
    LEFT JOIN dbo.Scores s ON da.delegate_id = s.delegate_id AND s.category = 'overall';
GO

select * from vw_CommitteeDelegates
go;

-- 7. Block Details View
CREATE OR ALTER VIEW vw_BlockDetails
AS
SELECT 
    b.block_id,
    b.name AS block_name,
    b.stance,
    b.committee_id,
    c.name AS committee_name,
    da.delegate_id,
    u.full_name AS delegate_name,
    da.country_id,
    co.name AS country_name,
    (SELECT COUNT(*) FROM dbo.Documents d WHERE d.block_id = b.block_id) AS document_count
FROM 
    dbo.Blocks b
    JOIN dbo.Committees c ON b.committee_id = c.committee_id
    LEFT JOIN dbo.DelegateAssignments da ON b.block_id = da.block_id
    LEFT JOIN dbo.Users u ON da.delegate_id = u.user_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

select * from vw_BlockDetails

go;


-- 8. Delegate Attendance View

select * from vw_DelegateAttendance
go;

CREATE OR ALTER VIEW vw_DelegateAttendance
AS
SELECT 
    a.user_id AS delegate_id,
    u.full_name AS delegate_name,
    a.committee_id,
    c.name AS committee_name,
    a.date,
    a.status,
    a.check_in_time,
    a.notes,
    da.country_id,
    co.name AS country_name
FROM 
    dbo.Attendance a
    JOIN dbo.Users u ON a.user_id = u.user_id
    JOIN dbo.Committees c ON a.committee_id = c.committee_id
    LEFT JOIN dbo.DelegateAssignments da ON a.user_id = da.delegate_id AND a.committee_id = da.committee_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO


-- 9. Delegate Scores View
select * from vw_DelegateScores
go;
CREATE OR ALTER VIEW vw_DelegateScores
AS
SELECT 
    s.delegate_id,
    u.full_name AS delegate_name,
    s.category,
    s.points,
    s.chair_id,
    cu.full_name AS chair_name,
    s.timestamp,
    s.event_id,
    e.type AS event_type,
    e.description AS event_description,
    s.document_id,
    d.title AS document_title,
    d.type AS document_type,
    s.comments,
    da.committee_id,
    c.name AS committee_name,
    da.country_id,
    co.name AS country_name
FROM 
    dbo.Scores s
    JOIN dbo.Users u ON s.delegate_id = u.user_id
    JOIN dbo.Users cu ON s.chair_id = cu.user_id
    LEFT JOIN dbo.Events e ON s.event_id = e.event_id
    LEFT JOIN dbo.Documents d ON s.document_id = d.document_id
    LEFT JOIN dbo.DelegateAssignments da ON s.delegate_id = da.delegate_id
    LEFT JOIN dbo.Committees c ON da.committee_id = c.committee_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- 10. Document Status View

select * from vw_DocumentStatus
go;
CREATE OR ALTER VIEW vw_DocumentStatus
AS
SELECT 
    d.document_id,
    d.title,
    d.type,
    d.content,
    d.file_url,
    d.status,
    d.uploaded_at,
    d.updated_at,
    d.due_date,
    d.delegate_id,
    u.full_name AS delegate_name,
    d.block_id,
    b.name AS block_name,
    da.committee_id,
    c.name AS committee_name,
    da.country_id,
    co.name AS country_name,
    d.votes_for,
    d.votes_against,
    d.votes_abstain,
    (d.votes_for * 100.0 / NULLIF(d.votes_for + d.votes_against + d.votes_abstain, 0)) AS approval_percentage
FROM 
    dbo.Documents d
    JOIN dbo.Users u ON d.delegate_id = u.user_id
    LEFT JOIN dbo.Blocks b ON d.block_id = b.block_id
    LEFT JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id
    LEFT JOIN dbo.Committees c ON da.committee_id = c.committee_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- 11. Event Status View
select * from Events
select * from vw_EventStatus
go;

CREATE OR ALTER VIEW vw_EventStatus
AS
SELECT 
    e.event_id,
    e.type,
    e.description,
    e.start_time,
    e.end_time,
    e.status,
    e.duration_minutes,
    e.topic,
    e.committee_id,
    c.name AS committee_name,
    e.proposed_by AS delegate_id,
    u.full_name AS delegate_name,
    da.country_id,
    co.name AS country_name,
    e.votes_for,
    e.votes_against,
    e.votes_abstain,
    (e.votes_for * 100.0 / NULLIF(e.votes_for + e.votes_against + e.votes_abstain, 0)) AS approval_percentage
FROM 
    dbo.Events e
    JOIN dbo.Committees c ON e.committee_id = c.committee_id
    JOIN dbo.Users u ON e.proposed_by = u.user_id
    LEFT JOIN dbo.DelegateAssignments da ON e.proposed_by = da.delegate_id AND e.committee_id = da.committee_id
    LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO



-- 12. Delegate Rankings View

select * from vw_delegateRankings
go;


CREATE OR ALTER VIEW vw_DelegateRankings
AS
SELECT 
    da.committee_id,
    c.name AS committee_name,
    da.delegate_id,
    u.full_name AS delegate_name,
    da.country_id,
    co.name AS country_name,
    s.points AS overall_score,
    RANK() OVER (PARTITION BY da.committee_id ORDER BY s.points DESC) AS committee_rank,
    DENSE_RANK() OVER (ORDER BY s.points DESC) AS overall_rank
FROM 
    dbo.DelegateAssignments da
    JOIN dbo.Users u ON da.delegate_id = u.user_id
    JOIN dbo.Committees c ON da.committee_id = c.committee_id
    JOIN dbo.Countries co ON da.country_id = co.country_id
    LEFT JOIN dbo.Scores s ON da.delegate_id = s.delegate_id AND s.category = 'overall';
GO

-- 13. Committee Activity Summary View

select * from vw_CommitteeActivitySummary
go;

CREATE OR ALTER VIEW vw_CommitteeActivitySummary
AS
SELECT 
    c.committee_id,
    c.name AS committee_name,
    c.topic,
    c.chair_id,
    u.full_name AS chair_name,
    (SELECT COUNT(*) FROM dbo.DelegateAssignments da WHERE da.committee_id = c.committee_id) AS delegate_count,
    (SELECT COUNT(*) FROM dbo.Events e WHERE e.committee_id = c.committee_id) AS total_events,
    (SELECT COUNT(*) FROM dbo.Events e WHERE e.committee_id = c.committee_id AND e.status = 'completed') AS completed_events,
    (SELECT COUNT(*) FROM dbo.Documents d 
     JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id 
     WHERE da.committee_id = c.committee_id) AS total_documents,
    (SELECT COUNT(*) FROM dbo.Documents d 
     JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id 
     WHERE da.committee_id = c.committee_id AND d.status = 'published') AS published_documents,
    (SELECT COUNT(*) FROM dbo.Blocks b WHERE b.committee_id = c.committee_id) AS block_count,
    (SELECT AVG(s.points) FROM dbo.Scores s 
     JOIN dbo.DelegateAssignments da ON s.delegate_id = da.delegate_id 
     WHERE da.committee_id = c.committee_id AND s.category = 'overall') AS average_score
FROM 
    dbo.Committees c
    JOIN dbo.Users u ON c.chair_id = u.user_id;
GO

-- 14. Country Assignments View

select * from vw_CountryAssignments
go;
CREATE OR ALTER VIEW vw_CountryAssignments
AS
SELECT 
    co.country_id,
    co.name AS country_name,
    co.flag_url,
    co.importance,
    c.committee_id,
    c.name AS committee_name,
    da.delegate_id,
    u.full_name AS delegate_name,
    da.block_id,
    b.name AS block_name
FROM 
    dbo.Countries co
    LEFT JOIN dbo.DelegateAssignments da ON co.country_id = da.country_id
    LEFT JOIN dbo.Committees c ON da.committee_id = c.committee_id
    LEFT JOIN dbo.Users u ON da.delegate_id = u.user_id
    LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id;
GO

-- 15. Past Experience Summary View

select * from vw_PastExperienceSummary
go;

CREATE OR ALTER VIEW vw_PastExperienceSummary
AS
SELECT 
    pe.user_id AS delegate_id,
    u.full_name AS delegate_name,
    u.email,
    d.experience_level,
    COUNT(pe.experience_id) AS total_conferences,
    SUM(CASE WHEN pe.awards = 'BD' THEN 1 ELSE 0 END) AS best_delegate_awards,
    SUM(CASE WHEN pe.awards = 'OD' THEN 1 ELSE 0 END) AS outstanding_delegate_awards,
    SUM(CASE WHEN pe.awards = 'HM' THEN 1 ELSE 0 END) AS honorable_mentions,
    MAX(pe.year) AS most_recent_year,
    STRING_AGG(pe.conference_name, ', ') AS conferences_attended
FROM 
    dbo.PastExperiences pe
    JOIN dbo.Users u ON pe.user_id = u.user_id
    JOIN dbo.Delegates d ON pe.user_id = d.user_id
GROUP BY 
    pe.user_id, u.full_name, u.email, d.experience_level;
GO

-- Additional Triggers

-- 1. Update Document Timestamp Trigger
CREATE OR ALTER TRIGGER trg_UpdateDocumentTimestamp
ON dbo.Documents
AFTER UPDATE
AS
BEGIN
    IF UPDATE(title) OR UPDATE(content) OR UPDATE(file_url) OR UPDATE(status)
    BEGIN
        UPDATE d
        SET updated_at = GETDATE()
        FROM dbo.Documents d
        INNER JOIN inserted i ON d.document_id = i.document_id;
    END
END
GO

-- 2. Update Event Timestamp Trigger
CREATE OR ALTER TRIGGER trg_UpdateEventTimestamp
ON dbo.Events
AFTER UPDATE
AS
BEGIN
    IF UPDATE(type) OR UPDATE(description) OR UPDATE(topic) OR UPDATE(status)
    BEGIN
        -- If the event is being marked as completed or failed, set the end time
        IF EXISTS (SELECT 1 FROM inserted WHERE status IN ('completed', 'failed'))
        BEGIN
            UPDATE e
            SET end_time = GETDATE()
            FROM dbo.Events e
            INNER JOIN inserted i ON e.event_id = i.event_id
            WHERE i.status IN ('completed', 'failed') AND e.end_time IS NULL;
        END
        
        -- If the event is being marked as ongoing, set the start time
        IF EXISTS (SELECT 1 FROM inserted WHERE status = 'ongoing')
        BEGIN
            UPDATE e
            SET start_time = GETDATE()
            FROM dbo.Events e
            INNER JOIN inserted i ON e.event_id = i.event_id
            WHERE i.status = 'ongoing' AND e.start_time IS NULL;
        END
    END
END
GO

-- 3. Validate Committee Assignment Trigger
CREATE OR ALTER TRIGGER trg_ValidateCommitteeAssignment
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS
BEGIN
    -- Check if the delegate is already assigned to this committee
    IF EXISTS (
        SELECT 1
        FROM dbo.DelegateAssignments da
        JOIN inserted i ON da.delegate_id = i.delegate_id AND da.committee_id = i.committee_id
        WHERE da.assignment_id <> i.assignment_id
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Delegate is already assigned to this committee', 16, 1);
        RETURN;
    END
    
    -- Check if the country is already assigned in this committee (except this assignment)
    IF EXISTS (
        SELECT 1
        FROM dbo.DelegateAssignments da
        JOIN inserted i ON da.committee_id = i.committee_id AND da.country_id = i.country_id
        WHERE da.assignment_id <> i.assignment_id
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('This country is already represented in this committee', 16, 1);
        RETURN;
    END
END
GO

-- 4. Validate Country Assignment Trigger
CREATE OR ALTER TRIGGER trg_ValidateCountryAssignment
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS
BEGIN
    -- Ensure the country exists
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE NOT EXISTS (SELECT 1 FROM dbo.Countries c WHERE c.country_id = i.country_id)
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Country does not exist', 16, 1);
        RETURN;
    END
    
    -- Ensure the committee exists
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE NOT EXISTS (SELECT 1 FROM dbo.Committees c WHERE c.committee_id = i.committee_id)
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Committee does not exist', 16, 1);
        RETURN;
    END
    
    -- Ensure the delegate exists and is actually a delegate
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE NOT EXISTS (SELECT 1 FROM dbo.Delegates d WHERE d.user_id = i.delegate_id)
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('User is not a delegate', 16, 1);
        RETURN;
    END
END
GO

-- 5. Validate Block Assignment Trigger
CREATE OR ALTER TRIGGER trg_ValidateBlockAssignment
ON dbo.DelegateAssignments
AFTER UPDATE
AS
BEGIN
    IF UPDATE(block_id)
    BEGIN
        -- Ensure the block exists and is part of the same committee
        IF EXISTS (
            SELECT 1 FROM inserted i
            WHERE i.block_id IS NOT NULL AND NOT EXISTS (
                SELECT 1 FROM dbo.Blocks b 
                WHERE b.block_id = i.block_id AND b.committee_id = i.committee_id
            )
        )
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Block does not exist in this committee', 16, 1);
            RETURN;
        END
    END
END
GO


-- Create trg_UpdateDocumentTimestamp trigger
CREATE OR ALTER TRIGGER trg_UpdateDocumentTimestamp
ON dbo.Documents
AFTER UPDATE
AS
BEGIN
    -- Only update the timestamp if other columns were modified
    IF UPDATE(title) OR UPDATE(content) OR UPDATE(file_url) OR UPDATE(status) OR 
       UPDATE(block_id) OR UPDATE(requires_voting)
    BEGIN
        UPDATE d
        SET updated_at = GETDATE()
        FROM dbo.Documents d
        INNER JOIN inserted i ON d.document_id = i.document_id;
    END
END;
GO

-- Create trg_UpdateEventTimestamp trigger
CREATE OR ALTER TRIGGER trg_UpdateEventTimestamp 
ON dbo.Events
AFTER UPDATE
AS
BEGIN
    -- Only update timestamp if relevant fields are modified
    IF UPDATE(type) OR UPDATE(description) OR UPDATE(status) OR 
       UPDATE(duration_minutes) OR UPDATE(topic) OR UPDATE(notes)
    BEGIN
        UPDATE e
        SET start_time = 
            CASE
                -- Only update start_time if status changed to 'ongoing'
                WHEN i.status = 'ongoing' AND d.status <> 'ongoing' THEN GETDATE()
                ELSE e.start_time
            END,
        end_time = 
            CASE 
                -- Only update end_time if status changed to 'completed' or 'failed'
                WHEN (i.status = 'completed' OR i.status = 'failed') AND 
                     (d.status <> 'completed' AND d.status <> 'failed') THEN GETDATE()
                ELSE e.end_time
            END
        FROM dbo.Events e
        INNER JOIN inserted i ON e.event_id = i.event_id
        INNER JOIN deleted d ON e.event_id = d.event_id;
    END
END;
GO

-- Create trg_ValidateCommitteeAssignment trigger

-- Create trg_ValidateCountryAssignment trigger
CREATE OR ALTER TRIGGER trg_ValidateCountryAssignment
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS
BEGIN
    -- Check if country exists
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN dbo.Countries c ON i.country_id = c.country_id
        WHERE c.country_id IS NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Country does not exist', 16, 1);
    END
END;
GO

-- Create trg_ValidateBlockAssignment trigger
CREATE OR ALTER TRIGGER trg_ValidateBlockAssignment
ON dbo.DelegateAssignments
AFTER INSERT, UPDATE
AS
BEGIN
    -- Only run if block_id is not NULL
    IF EXISTS (SELECT 1 FROM inserted WHERE block_id IS NOT NULL)
    BEGIN
        -- Check if block exists
        IF EXISTS (
            SELECT 1 FROM inserted i
            LEFT JOIN dbo.Blocks b ON i.block_id = b.block_id
            WHERE i.block_id IS NOT NULL AND b.block_id IS NULL
        )
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Block does not exist', 16, 1);
        END
        
        -- Check if block belongs to the same committee
        IF EXISTS (
            SELECT 1 FROM inserted i
            JOIN dbo.Blocks b ON i.block_id = b.block_id
            WHERE i.committee_id <> b.committee_id
        )
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Block must belong to the same committee as the delegate assignment', 16, 1);
        END
    END
END;
GO

-- Create trg_AuditScoreChanges trigger
CREATE OR ALTER TRIGGER trg_AuditScoreChanges
ON dbo.Scores
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Use temporary table for logging score changes
    -- In a real implementation, you'd have a proper audit table
    DECLARE @ScoreChanges TABLE (
        change_type VARCHAR(10),
        score_id INT,
        delegate_id INT,
        category VARCHAR(20),
        old_points DECIMAL(5,2),
        new_points DECIMAL(5,2),
        chair_id INT,
        change_time DATETIME DEFAULT GETDATE()
    );
    
    -- Handle inserts
    INSERT INTO @ScoreChanges (change_type, score_id, delegate_id, category, old_points, new_points, chair_id)
    SELECT 'INSERT', i.score_id, i.delegate_id, i.category, NULL, i.points, i.chair_id
    FROM inserted i;
    
    -- Handle updates
    INSERT INTO @ScoreChanges (change_type, score_id, delegate_id, category, old_points, new_points, chair_id)
    SELECT 'UPDATE', i.score_id, i.delegate_id, i.category, d.points, i.points, i.chair_id
    FROM inserted i
    JOIN deleted d ON i.score_id = d.score_id
    WHERE i.points <> d.points; -- Only track point changes
    
    -- Handle deletes
    INSERT INTO @ScoreChanges (change_type, score_id, delegate_id, category, old_points, new_points, chair_id)
    SELECT 'DELETE', d.score_id, d.delegate_id, d.category, d.points, NULL, d.chair_id
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.score_id = d.score_id);
    
    -- In real implementation, insert @ScoreChanges into a permanent audit table
    -- For demonstration, we'll just print a message
    DECLARE @ChangeCount INT = (SELECT COUNT(*) FROM @ScoreChanges);
    IF @ChangeCount > 0
        PRINT CONVERT(VARCHAR, @ChangeCount) + ' score change(s) logged in audit.';
END;
GO

-- Create trg_AuditVoteChanges trigger
CREATE OR ALTER TRIGGER trg_AuditVoteChanges
ON dbo.Votes
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Use temporary table for logging vote changes
    -- In a real implementation, you'd have a proper audit table
    DECLARE @VoteChanges TABLE (
        change_type VARCHAR(10),
        vote_id INT,
        event_id INT,
        document_id INT,
        delegate_id INT,
        old_vote VARCHAR(10),
        new_vote VARCHAR(10),
        change_time DATETIME DEFAULT GETDATE()
    );
    
    -- Handle inserts
    INSERT INTO @VoteChanges (change_type, vote_id, event_id, document_id, delegate_id, old_vote, new_vote)
    SELECT 'INSERT', i.vote_id, i.event_id, i.document_id, i.delegate_id, NULL, i.vote
    FROM inserted i;
    
    -- Handle updates
    INSERT INTO @VoteChanges (change_type, vote_id, event_id, document_id, delegate_id, old_vote, new_vote)
    SELECT 'UPDATE', i.vote_id, i.event_id, i.document_id, i.delegate_id, d.vote, i.vote
    FROM inserted i
    JOIN deleted d ON i.vote_id = d.vote_id
    WHERE i.vote <> d.vote; -- Only track vote changes
    
    -- Handle deletes
    INSERT INTO @VoteChanges (change_type, vote_id, event_id, document_id, delegate_id, old_vote, new_vote)
    SELECT 'DELETE', d.vote_id, d.event_id, d.document_id, d.delegate_id, d.vote, NULL
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.vote_id = d.vote_id);

    -- In real implementation, insert @VoteChanges into a permanent audit table
    -- For demonstration, we'll just print a message
    DECLARE @ChangeCount INT = (SELECT COUNT(*) FROM @VoteChanges);
    IF @ChangeCount > 0
        PRINT CONVERT(VARCHAR, @ChangeCount) + ' vote change(s) logged in audit.';
END;
GO

-- Create trg_ValidateDocumentSubmission trigger
CREATE OR ALTER TRIGGER trg_ValidateDocumentSubmission
ON dbo.Documents
AFTER INSERT, UPDATE
AS
BEGIN
    -- Check if delegate exists
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN dbo.Delegates d ON i.delegate_id = d.user_id
        WHERE d.user_id IS NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('User must be a registered delegate to submit documents', 16, 1);
    END
    
    -- Check if block exists (if block_id is not NULL)
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN dbo.Blocks b ON i.block_id = b.block_id
        WHERE i.block_id IS NOT NULL AND b.block_id IS NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Block does not exist', 16, 1);
    END
    
    -- Check if the delegate is part of the block (if block_id is not NULL)
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE i.block_id IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM dbo.DelegateAssignments da
            WHERE da.delegate_id = i.delegate_id AND da.block_id = i.block_id
        )
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Delegate must be a member of the block to submit documents on its behalf', 16, 1);
    END
    
    -- Validate due date is not in the past for new documents
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE i.due_date < GETDATE() 
        AND NOT EXISTS (SELECT 1 FROM deleted d WHERE d.document_id = i.document_id)
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Due date cannot be in the past for new documents', 16, 1);
    END
END;
GO

-- Create trg_ValidateEventCreation trigger
CREATE OR ALTER TRIGGER trg_ValidateEventCreation
ON dbo.Events
AFTER INSERT, UPDATE
AS
BEGIN
    -- Check if proposed_by user is a delegate
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN dbo.Delegates d ON i.proposed_by = d.user_id
        WHERE d.user_id IS NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Events can only be proposed by registered delegates', 16, 1);
    END
    
    -- Check if committee exists
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN dbo.Committees c ON i.committee_id = c.committee_id
        WHERE c.committee_id IS NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Committee does not exist', 16, 1);
    END
    
    -- Check if delegate is assigned to this committee
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE NOT EXISTS (
            SELECT 1 FROM dbo.DelegateAssignments da
            WHERE da.delegate_id = i.proposed_by AND da.committee_id = i.committee_id
        )
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Delegate must be assigned to this committee to propose events', 16, 1);
    END
    
    -- Validate durations (for caucus, break, etc.)
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE i.type IN ('caucus', 'break') AND (i.duration_minutes IS NULL OR i.duration_minutes <= 0)
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('Duration must be specified and positive for caucus and break events', 16, 1);
    END
    
    -- Validate that end_time is after start_time if both are provided
    IF EXISTS (
        SELECT 1 FROM inserted i
        WHERE i.start_time IS NOT NULL AND i.end_time IS NOT NULL AND i.end_time <= i.start_time
    )
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('End time must be after start time', 16, 1);
    END
END;
GO

-- Create trg_UserAudit trigger (mentioned in your list but not implemented)
CREATE OR ALTER TRIGGER trg_UserAudit
ON dbo.Users
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Use temporary table for logging user changes
    -- In a real implementation, you'd have a proper audit table
    DECLARE @UserChanges TABLE (
        change_type VARCHAR(10),
        user_id INT,
        email VARCHAR(255),
        role VARCHAR(10),
        old_name VARCHAR(100),
        new_name VARCHAR(100),
        change_time DATETIME DEFAULT GETDATE()
    );
    
    -- Handle inserts
    INSERT INTO @UserChanges (change_type, user_id, email, role, old_name, new_name)
    SELECT 'INSERT', i.user_id, i.email, i.role, NULL, i.full_name
    FROM inserted i;
    
    -- Handle updates
    INSERT INTO @UserChanges (change_type, user_id, email, role, old_name, new_name)
    SELECT 'UPDATE', i.user_id, i.email, i.role, d.full_name, i.full_name
    FROM inserted i
    JOIN deleted d ON i.user_id = d.user_id
    WHERE i.full_name <> d.full_name OR i.email <> d.email OR i.role <> d.role;
    
    -- Handle deletes
    INSERT INTO @UserChanges (change_type, user_id, email, role, old_name, new_name)
    SELECT 'DELETE', d.user_id, d.email, d.role, d.full_name, NULL
    FROM deleted d
    WHERE NOT EXISTS (SELECT 1 FROM inserted i WHERE i.user_id = d.user_id);

    -- In real implementation, insert @UserChanges into a permanent audit table
    -- For demonstration, we'll just print a message
    DECLARE @ChangeCount INT = (SELECT COUNT(*) FROM @UserChanges);
    IF @ChangeCount > 0
        PRINT CONVERT(VARCHAR, @ChangeCount) + ' user change(s) logged in audit.';
END;
GO

-- Create views mentioned in your list

-- Create vw_UserDetails view
CREATE OR ALTER VIEW vw_UserDetails
AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.role,
    u.phone,
    u.created_at,
    u.last_login,
    -- Delegate specific fields
    d.experience_level,
    d.emergency_contact,
    -- Chair specific fields
    c.evaluation_metrics,
    c.chairing_experience,
    -- Admin specific fields
    a.admin_level,
    a.contact_number,
    a.last_activity
FROM 
    dbo.Users u
LEFT JOIN dbo.Delegates d ON u.user_id = d.user_id AND u.role = 'delegate'
LEFT JOIN dbo.Chairs c ON u.user_id = c.user_id AND u.role = 'chair'
LEFT JOIN dbo.Admins a ON u.user_id = a.user_id AND u.role = 'admin';
GO

-- Create vw_DelegateDetails view
CREATE OR ALTER VIEW vw_DelegateDetails
AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.phone,
    d.experience_level,
    d.emergency_contact,
    da.assignment_id,
    da.committee_id,
    c.name AS committee_name,
    c.topic AS committee_topic,
    da.country_id,
    co.name AS country_name,
    da.block_id,
    b.name AS block_name,
    da.conference_year,
    da.assignment_date
FROM 
    dbo.Users u
JOIN dbo.Delegates d ON u.user_id = d.user_id
LEFT JOIN dbo.DelegateAssignments da ON d.user_id = da.delegate_id
LEFT JOIN dbo.Committees c ON da.committee_id = c.committee_id
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id
LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id;
GO

-- Create vw_ChairDetails view
CREATE OR ALTER VIEW vw_ChairDetails
AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.phone,
    c.evaluation_metrics,
    c.chairing_experience,
    com.committee_id,
    com.name AS committee_name,
    com.topic AS committee_topic,
    com.difficulty,
    com.capacity,
    com.location,
    com.start_date,
    com.end_date
FROM 
    dbo.Users u
JOIN dbo.Chairs c ON u.user_id = c.user_id
LEFT JOIN dbo.Committees com ON c.user_id = com.chair_id;
GO

-- Create vw_AdminDetails view
CREATE OR ALTER VIEW vw_AdminDetails
AS
SELECT 
    u.user_id,
    u.email,
    u.full_name,
    u.phone,
    a.admin_level,
    a.contact_number,
    a.last_activity
FROM 
    dbo.Users u
JOIN dbo.Admins a ON u.user_id = a.user_id;
GO

-- Create vw_CommitteeDetails view
CREATE OR ALTER VIEW vw_CommitteeDetails
AS
SELECT 
    c.committee_id,
    c.name,
    c.description,
    c.topic,
    c.difficulty,
    c.capacity,
    c.location,
    c.start_date,
    c.end_date,
    c.chair_id,
    u.full_name AS chair_name,
    u.email AS chair_email,
    ch.chairing_experience,
    COUNT(DISTINCT da.delegate_id) AS delegate_count,
    COUNT(DISTINCT da.country_id) AS country_count,
    COUNT(DISTINCT b.block_id) AS block_count
FROM 
    dbo.Committees c
LEFT JOIN dbo.Users u ON c.chair_id = u.user_id
LEFT JOIN dbo.Chairs ch ON c.chair_id = ch.user_id
LEFT JOIN dbo.DelegateAssignments da ON c.committee_id = da.committee_id
LEFT JOIN dbo.Blocks b ON c.committee_id = b.committee_id
GROUP BY 
    c.committee_id, c.name, c.description, c.topic, c.difficulty, c.capacity, 
    c.location, c.start_date, c.end_date, c.chair_id, u.full_name, u.email, ch.chairing_experience;
GO

-- Create vw_CommitteeDelegates view
CREATE OR ALTER VIEW vw_CommitteeDelegates
AS
SELECT 
    c.committee_id,
    c.name AS committee_name,
    c.topic,
    c.difficulty,
    u.user_id AS delegate_id,
    u.full_name AS delegate_name,
    u.email AS delegate_email,
    d.experience_level,
    co.country_id,
    co.name AS country_name,
    da.block_id,
    b.name AS block_name
FROM 
    dbo.Committees c
JOIN dbo.DelegateAssignments da ON c.committee_id = da.committee_id
JOIN dbo.Users u ON da.delegate_id = u.user_id
JOIN dbo.Delegates d ON u.user_id = d.user_id
JOIN dbo.Countries co ON da.country_id = co.country_id
LEFT JOIN dbo.Blocks b ON da.block_id = b.block_id;
GO

-- Create vw_BlockDetails view
CREATE OR ALTER VIEW vw_BlockDetails
AS
SELECT 
    b.block_id,
    b.name AS block_name,
    b.stance,
    c.committee_id,
    c.name AS committee_name,
    c.topic,
    u.user_id AS delegate_id,
    u.full_name AS delegate_name,
    co.country_id,
    co.name AS country_name
FROM 
    dbo.Blocks b
JOIN dbo.Committees c ON b.committee_id = c.committee_id
LEFT JOIN dbo.DelegateAssignments da ON b.block_id = da.block_id
LEFT JOIN dbo.Users u ON da.delegate_id = u.user_id
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- Create vw_DelegateAttendance view
CREATE OR ALTER VIEW vw_DelegateAttendance
AS
SELECT 
    a.user_id AS delegate_id,
    u.full_name AS delegate_name,
    c.committee_id,
    c.name AS committee_name,
    a.date,
    a.status,
    a.check_in_time,
    a.notes,
    co.name AS country_name
FROM 
    dbo.Attendance a
JOIN dbo.Users u ON a.user_id = u.user_id
JOIN dbo.Committees c ON a.committee_id = c.committee_id
LEFT JOIN dbo.DelegateAssignments da ON a.user_id = da.delegate_id AND a.committee_id = da.committee_id
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- Create vw_DelegateScores view
CREATE OR ALTER VIEW vw_DelegateScores
AS
SELECT 
    s.score_id,
    s.delegate_id,
    u.full_name AS delegate_name,
    s.category,
    s.points,
    s.chair_id,
    cu.full_name AS chair_name,
    s.timestamp,
    c.committee_id,
    c.name AS committee_name,
    co.name AS country_name,
    e.event_id,
    e.type AS event_type,
    e.description AS event_description,
    d.document_id,
    d.title AS document_title,
    d.type AS document_type,
    s.comments
FROM 
    dbo.Scores s
JOIN dbo.Users u ON s.delegate_id = u.user_id
JOIN dbo.Users cu ON s.chair_id = cu.user_id
LEFT JOIN dbo.Events e ON s.event_id = e.event_id
LEFT JOIN dbo.Documents d ON s.document_id = d.document_id
LEFT JOIN dbo.Committees c ON (e.committee_id = c.committee_id OR d.delegate_id IN 
    (SELECT delegate_id FROM dbo.DelegateAssignments WHERE committee_id = c.committee_id))
LEFT JOIN dbo.DelegateAssignments da ON s.delegate_id = da.delegate_id AND 
    (c.committee_id = da.committee_id OR c.committee_id IS NULL)
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- Create vw_DocumentStatus view
CREATE OR ALTER VIEW vw_DocumentStatus
AS
SELECT 
    d.document_id,
    d.title,
    d.type,
    d.status,
    d.delegate_id AS author_id,
    u.full_name AS author_name,
    d.block_id,
    b.name AS block_name,
    d.requires_voting,
    d.uploaded_at,
    d.due_date,
    d.updated_at,
    d.votes_for,
    d.votes_against,
    d.votes_abstain,
    d.votes_for + d.votes_against + d.votes_abstain AS total_votes,
    c.committee_id,
    c.name AS committee_name,
    co.name AS country_name
FROM 
    dbo.Documents d
JOIN dbo.Users u ON d.delegate_id = u.user_id
LEFT JOIN dbo.Blocks b ON d.block_id = b.block_id
LEFT JOIN dbo.DelegateAssignments da ON d.delegate_id = da.delegate_id
LEFT JOIN dbo.Committees c ON (b.committee_id = c.committee_id OR da.committee_id = c.committee_id)
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- Create vw_EventStatus view
CREATE OR ALTER VIEW vw_EventStatus
AS
SELECT 
    e.event_id,
    e.type,
    e.proposed_by,
    u.full_name AS proposer_name,
    e.description,
    e.start_time,
    e.end_time,
    e.status,
    e.duration_minutes,
    e.topic,
    e.notes,
    e.votes_for,
    e.votes_against,
    e.votes_abstain,
    e.votes_for + e.votes_against + e.votes_abstain AS total_votes,
    e.committee_id,
    c.name AS committee_name,
    co.name AS proposer_country
FROM 
    dbo.Events e
JOIN dbo.Users u ON e.proposed_by = u.user_id
JOIN dbo.Committees c ON e.committee_id = c.committee_id
LEFT JOIN dbo.DelegateAssignments da ON e.proposed_by = da.delegate_id AND e.committee_id = da.committee_id
LEFT JOIN dbo.Countries co ON da.country_id = co.country_id;
GO

-- Create vw_DelegateRankings view
CREATE OR ALTER VIEW vw_DelegateRankings
AS
WITH DelegateScoreSummary AS (
    SELECT 
        s.delegate_id,
        da.committee_id,
        c.name AS committee_name,
        u.full_name AS delegate_name,
        co.name AS country_name,
        SUM(CASE WHEN s.category = 'speech' THEN s.points ELSE 0 END) AS speech_points,
        SUM(CASE WHEN s.category = 'motion' THEN s.points ELSE 0 END) AS motion_points,
        SUM(CASE WHEN s.category = 'resolution' THEN s.points ELSE 0 END) AS resolution_points,
        SUM(CASE WHEN s.category = 'diplomacy' THEN s.points ELSE 0 END) AS diplomacy_points,
        SUM(CASE WHEN s.category = 'overall' THEN s.points ELSE 0 END) AS overall_points,
        SUM(s.points) AS total_points,
        COUNT(DISTINCT CASE WHEN s.category = 'speech' THEN s.score_id END) AS speech_count,
        COUNT(DISTINCT CASE WHEN s.category = 'motion' THEN s.score_id END) AS motion_count,
        COUNT(DISTINCT CASE WHEN s.category = 'resolution' THEN s.score_id END) AS resolution_count,
        COUNT(DISTINCT CASE WHEN s.category = 'diplomacy' THEN s.score_id END) AS diplomacy_count
    FROM 
        dbo.Scores s
    JOIN dbo.Users u ON s.delegate_id = u.user_id
    JOIN dbo.DelegateAssignments da ON s.delegate_id = da.delegate_id
    JOIN dbo.Committees c ON da.committee_id = c.committee_id
    JOIN dbo.Countries co ON da.country_id = co.country_id
    GROUP BY 
        s.delegate_id, da.committee_id, c.name, u.full_name, co.name
)
SELECT 
    delegate_id,
    committee_id,
    committee_name,
    delegate_name,
    country_name,
    speech_points,
    motion_points,
    resolution_points,
    diplomacy_points,
    overall_points,
    total_points,
    speech_count,
    motion_count,
    resolution_count,
    diplomacy_count,
    RANK() OVER (PARTITION BY committee_id ORDER BY total_points DESC) AS committee_rank,
    RANK() OVER (ORDER BY total_points DESC) AS overall_rank
FROM 
    DelegateScoreSummary;
GO


-- List of Stored Procedures, Views, and Triggers

-- STORED PROCEDURES
-- 1. sp_CreateUser: Creates a new user and assigns a role (delegate, chair, or admin).
-- 2. sp_GetUserById: Retrieves user details by user ID.
-- 3. sp_GetUserByEmail: Retrieves user details by email.
-- 4. sp_UpdateUser: Updates user information.
-- 5. sp_DeleteUser: Deletes or deactivates a user.
-- 6. sp_AuthenticateUser: Authenticates a user by email and password.
-- 7. sp_GetDelegateById: Retrieves delegate details by ID.
-- 8. sp_UpdateDelegate: Updates delegate details.
-- 9. sp_DeleteDelegate: Deletes a delegate record.
-- 10. sp_AddPastExperience: Adds past MUN experience for a delegate.
-- 11. sp_GetDelegatePastExperiences: Retrieves a delegate's past experiences.
-- 12. sp_CreateCountry: Creates a new country.
-- 13. sp_GetCountryById: Retrieves country details by ID.
-- 14. sp_UpdateCountry: Updates country details.
-- 15. sp_DeleteCountry: Deletes a country.
-- 16. sp_GetAllCountries: Retrieves all countries with optional filtering.
-- 17. sp_CreateCommittee: Creates a new committee.
-- 18. sp_GetCommitteeById: Retrieves committee details by ID.
-- 19. sp_UpdateCommittee: Updates committee information.
-- 20. sp_DeleteCommittee: Deletes a committee.
-- 21. sp_GetAllCommittees: Retrieves all committees with optional filtering.
-- 22. sp_CreateBlock: Creates a new block.
-- 23. sp_GetBlockById: Retrieves block details by ID.
-- 24. sp_UpdateBlock: Updates block information.
-- 25. sp_DeleteBlock: Deletes a block.
-- 26. sp_GetBlocksByCommittee: Retrieves blocks for a specific committee.
-- 27. sp_GetChairById: Retrieves chair details by ID.
-- 28. sp_UpdateChair: Updates chair details.
-- 29. sp_DeleteChair: Deletes a chair record.
-- 30. sp_GetAdminById: Retrieves admin details by ID.
-- 31. sp_UpdateAdmin: Updates admin details.
-- 32. sp_DeleteAdmin: Deletes an admin record.
-- 33. sp_CreateDocument: Creates a new document.
-- 34. sp_GetDocumentById: Retrieves document details by ID.
-- 35. sp_UpdateDocument: Updates document details.
-- 36. sp_DeleteDocument: Deletes a document.
-- 37. sp_GetDocumentsByCommittee: Retrieves documents for a specific committee.
-- 38. sp_GetDocumentsByDelegate: Retrieves documents for a specific delegate.
-- 39. sp_CreateEvent: Creates a new event.
-- 40. sp_GetEventById: Retrieves event details by ID.
-- 41. sp_UpdateEvent: Updates event details.
-- 42. sp_DeleteEvent: Deletes an event.
-- 43. sp_GetEventsByCommittee: Retrieves events for a specific committee.
-- 44. sp_GetEventsByDelegate: Retrieves events for a specific delegate.
-- 45. sp_RecordAttendance: Records or updates attendance for a delegate.
-- 46. sp_GetAttendanceByDate: Retrieves attendance for a specific date and committee.
-- 47. sp_UpdateAttendance: Updates attendance details.
-- 48. sp_DeleteAttendance: Deletes an attendance record.
-- 49. sp_GetAttendanceByDelegate: Retrieves attendance records for a delegate.
-- 50. sp_RecordScore: Records a score for a delegate.
-- 51. sp_GetScoreById: Retrieves score details by ID.
-- 52. sp_UpdateScore: Updates a score record.
-- 53. sp_DeleteScore: Deletes a score record.
-- 54. sp_GetScoresByDelegate: Retrieves scores for a specific delegate.
-- 55. sp_GetScoresByCommittee: Retrieves scores for a specific committee.
-- 56. sp_RecordVote: Records or updates a vote for an event or document.
-- 57. sp_GetVoteById: Retrieves vote details by ID.
-- 58. sp_UpdateVote: Updates a vote record.
-- 59. sp_DeleteVote: Deletes a vote record.
-- 60. sp_GetVotesByDocument: Retrieves votes for a specific document.
-- 61. sp_GetVotesByEvent: Retrieves votes for a specific event.
-- 62. sp_AssignDelegateToCommittee: Assigns a delegate to a committee and country.
-- 63. sp_UpdateDelegateAssignment: Updates a delegate's assignment.
-- 64. sp_RemoveDelegateAssignment: Removes a delegate's assignment.
-- 65. sp_GetDelegateAssignments: Retrieves delegate assignments with optional filters.
-- 66. sp_AssignDelegateToBlock: Assigns a delegate to a block.
-- 67. sp_PopulateCountries: Populates the Countries table with predefined data.
-- 68. sp_AllocateCountriesByExperience: Allocates countries to delegates based on experience.
-- 69. sp_AllocateCountryToSingleDelegate: Allocates a country to a single delegate based on experience.
-- 70. sp_AssignChairToCommittee: Assigns a chair to a committee.
-- 71. sp_CalculateOverallScores: Calculates overall scores for delegates.
-- 72. sp_GenerateAwards: Generates awards for top delegates in a committee.
-- 73. sp_ChangeDocumentStatus: Changes the status of a document.
-- 74. sp_ChangeEventStatus: Changes the status of an event.

-- VIEWS
-- 1. vw_UserDetails: Provides detailed information about users.
-- 2. vw_DelegateDetails: Provides detailed information about delegates.
-- 3. vw_ChairDetails: Provides detailed information about chairs.
-- 4. vw_AdminDetails: Provides detailed information about admins.
-- 5. vw_CommitteeDetails: Provides detailed information about committees.
-- 6. vw_CommitteeDelegates: Lists delegates assigned to committees.
-- 7. vw_BlockDetails: Provides detailed information about blocks.
-- 8. vw_DelegateAttendance: Lists attendance records for delegates.
-- 9. vw_DelegateScores: Lists scores for delegates.
-- 10. vw_DocumentStatus: Provides detailed information about documents and their statuses.
-- 11. vw_EventStatus: Provides detailed information about events and their statuses.
-- 12. vw_DelegateRankings: Ranks delegates based on their scores.
-- 13. vw_CommitteeActivitySummary: Summarizes activity within committees.
-- 14. vw_CountryAssignments: Lists country assignments to delegates and committees.
-- 15. vw_PastExperienceSummary: Summarizes past experiences of delegates.

-- TRIGGERS
-- 1. trg_ValidateAttendanceUser: Ensures attendance records are valid for chairs or delegates.
-- 2. trg_CheckCommitteeCapacity: Ensures committee capacity is not exceeded.
-- 3. trg_UpdateDocumentVotes: Updates vote counts for documents after changes.
-- 4. trg_UpdateEventVotes: Updates vote counts for events after changes.
-- 5. trg_EnforceCommitteeCountryUniqueness: Ensures unique country assignments within committees.
-- 6. trg_PreventChairDeletion: Prevents deletion of chairs assigned to committees.
-- 7. trg_UpdateDocumentTimestamp: Updates the timestamp when a document is modified.
-- 8. trg_UpdateEventTimestamp: Updates the timestamp when an event is modified.
-- 9. trg_ValidateCommitteeAssignment: Validates committee assignments for delegates.
-- 10. trg_ValidateCountryAssignment: Validates country assignments for delegates.
-- 11. trg_ValidateBlockAssignment: Validates block assignments for delegates.
-- 12. trg_AuditScoreChanges: Logs changes to scores.
-- 13. trg_AuditVoteChanges: Logs changes to votes.
-- 14. trg_ValidateDocumentSubmission: Validates document submissions.
-- 15. trg_ValidateEventCreation: Validates event creation.
-- 16. trg_UserAudit: Logs changes to user records.

PRINT 'Database setup completed successfully.'