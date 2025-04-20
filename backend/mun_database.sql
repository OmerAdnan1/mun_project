CREATE DATABASE MUN_Database_4
GO
--Changing Event,Resoultion and Motion
--Join vote to Event
--Procedures will change

USE MUN_Database_4;
GO
go
-- Committee Table
CREATE TABLE Committee (
    CommitteeId INT PRIMARY KEY IDENTITY,
    [Name] VARCHAR(100) NOT NULL,
    Topic VARCHAR(200) NOT NULL
);


-- User Table (No direct CommitteeId dependency)
CREATE TABLE [User] (
    UserId INT PRIMARY KEY IDENTITY,
    UserName VARCHAR(50) NOT NULL UNIQUE,
    [Password] VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    UserType VARCHAR(20) NOT NULL CHECK (UserType IN ('Admin', 'Chair', 'Delegate')),
    FullName VARCHAR(100),
    PhoneNumber VARCHAR(15),
    CreatedDate DATETIME DEFAULT GETDATE()
);


-- Chair Table (Links User to Committee)
CREATE TABLE Chair (
    ChairId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE REFERENCES [User](UserId) ON DELETE CASCADE ON UPDATE CASCADE,
    CommitteeId INT UNIQUE REFERENCES Committee(CommitteeId) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Country Table
CREATE TABLE Country (
    CountryID INT PRIMARY KEY identity(1,1),
    CountryName VARCHAR(255) UNIQUE,
    Importance INT
);



-- Block Table
CREATE TABLE [Block] (
    BlockId INT PRIMARY KEY IDENTITY,
    BlockName VARCHAR(50) NOT NULL UNIQUE,
    Stance VARCHAR(100)
);


-- Delegate Table (No direct Committee dependency)
CREATE TABLE Delegate (
    DelegateId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE REFERENCES [User](UserId) ON DELETE CASCADE ON UPDATE CASCADE,

	CountryID INT REFERENCES Country(CountryId) ON DELETE CASCADE ON UPDATE CASCADE,
    BlockID INT NULL REFERENCES [Block](BlockId) ON DELETE SET NULL
);

-- Junction Table for Many-to-Many Relationship
CREATE TABLE DelegateCommittee (
    DelegateId INT,
    CommitteeId INT,
    PRIMARY KEY (DelegateId, CommitteeId),
    FOREIGN KEY (DelegateId) REFERENCES Delegate(DelegateId) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (CommitteeId) REFERENCES Committee(CommitteeId) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE PastExperiences (
    ExperienceId INT PRIMARY KEY IDENTITY,
    DelegateId INT REFERENCES Delegate(DelegateId) ON DELETE CASCADE ON UPDATE CASCADE,
    Award VARCHAR(2) NOT NULL CHECK (Award IN ('HM', 'BD', 'OD')),
    ConferenceName VARCHAR(150) NOT NULL,
    [Year] INT CHECK (Year BETWEEN 2000 AND YEAR(GETDATE())),
    Notes VARCHAR(MAX) NULL
);




-- Admin Table
CREATE TABLE [Admin] (
    AdminId INT PRIMARY KEY IDENTITY,
    UserId INT UNIQUE REFERENCES [User](UserId) ON DELETE CASCADE ON UPDATE CASCADE,
    Responsibilities VARCHAR(MAX)
);


-- Session Table
CREATE TABLE [Session] (
    SessionId INT PRIMARY KEY IDENTITY,
    CommitteeId INT REFERENCES Committee(CommitteeId) ON DELETE CASCADE ON UPDATE CASCADE,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    DayNumber INT CHECK (DayNumber BETWEEN 1 AND 3) NOT NULL
);


-- Event Table
CREATE TABLE [Event] (
    EventId INT PRIMARY KEY IDENTITY,
    SessionId INT REFERENCES Session(SessionId) ON DELETE CASCADE ON UPDATE CASCADE,
    Agenda VARCHAR(200),
    EventType VARCHAR(50) CHECK (EventType IN ( 'Motion', 'Resolution', 'Attendance', 'Unmoderated Caucus', 'Moderated Caucus', 'Opening Speech'))
);

-- Attendance Table
CREATE TABLE Attendance (
    AttendanceId INT PRIMARY KEY IDENTITY,
    DelegateId INT REFERENCES Delegate(DelegateId) ON DELETE CASCADE ON UPDATE CASCADE,
    SessionId INT REFERENCES Session(SessionId) ON DELETE CASCADE ON UPDATE CASCADE,
    EventId int REFERENCES Event(EventId),
	[Status] VARCHAR(10) CHECK ([Status] IN ('Present', 'Absent', 'Late')) NOT NULL
);

-- Motion Table
CREATE TABLE Motion (
    MotionId INT PRIMARY KEY IDENTITY,
    EventId INT REFERENCES Event(EventId) ON DELETE CASCADE ON UPDATE CASCADE,
    SubmittedBy INT REFERENCES Delegate(DelegateId) ON DELETE SET NULL,
    SubmissionDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    [Status] VARCHAR(20) NOT NULL CHECK ([Status] IN ('Pending', 'Approved', 'Rejected')),
    Content VARCHAR(MAX),
    TotalTime INT NOT NULL,
    IndividualTime INT NOT NULL,
    [Type] VARCHAR(50) NOT NULL,
    VotesFor INT DEFAULT 0,
    VotesAgainst INT DEFAULT 0,
    Abstentions INT DEFAULT 0,
    VotingType VARCHAR(20) CHECK (VotingType IN ('Anonymous', 'Named'))
);


-- Resolution Table
CREATE TABLE Resolution (
    ResolutionId INT PRIMARY KEY IDENTITY,
    EventId INT REFERENCES Event(EventId) ON DELETE CASCADE ON UPDATE CASCADE,
    SubmissionDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    [Status] VARCHAR(20) NOT NULL CHECK ([Status] IN ('Pending', 'Passed', 'Rejected')),
    VotesFor INT DEFAULT 0,
    VotesAgainst INT DEFAULT 0,
    Abstentions INT DEFAULT 0,
    SubmissionBlockId INT REFERENCES Block(BlockId) ON DELETE SET NULL,
    VotingType VARCHAR(20) CHECK (VotingType IN ('Anonymous', 'Named'))
);


-- Position Paper Table
CREATE TABLE PositionPaper (
    PaperId INT PRIMARY KEY IDENTITY,
    DelegateId INT UNIQUE REFERENCES Delegate(DelegateId) ON DELETE CASCADE ON UPDATE CASCADE,
    SubmissionDate DATETIME NOT NULL,
    DueDate DATETIME NOT NULL,
    Feedback VARCHAR(MAX),
    [Status] VARCHAR(20) CHECK ([Status] IN ('Final', 'Draft')) NOT NULL
);


-- Vote Table
CREATE TABLE Vote (
    VoteId INT PRIMARY KEY IDENTITY,
    DelegateId INT REFERENCES Delegate(DelegateId) ON DELETE CASCADE ON UPDATE CASCADE,
    MotionId INT NULL REFERENCES Motion(MotionId) ON DELETE set NULL ON UPDATE no action,
    ResolutionId INT NULL REFERENCES Resolution(ResolutionId),
    VoteType VARCHAR(20) CHECK (VoteType IN ('For', 'Against', 'Abstain')),
    UNIQUE (DelegateId, MotionId),
    UNIQUE (DelegateId, ResolutionId)
);


-- Post Table
CREATE TABLE Post (
    PostId INT PRIMARY KEY IDENTITY,
    CreationDate DATETIME DEFAULT GETDATE(),
    [Description] VARCHAR(MAX),
    AdminId INT REFERENCES Admin(AdminId) ON DELETE CASCADE ON UPDATE CASCADE,
    Recipients VARCHAR(MAX),
    [Status] VARCHAR(20),
    AttachmentURL VARCHAR(255),
    Category VARCHAR(50)
);


-- Notification Table
CREATE TABLE Notification (
    NotificationId INT PRIMARY KEY IDENTITY,
    Title VARCHAR(100) NOT NULL,
    Content VARCHAR(MAX) NOT NULL,
    SentDate DATETIME DEFAULT GETDATE(),
    Category VARCHAR(50) CHECK (Category IN ('System Updates', 'Event Changes', 'Reminders')),
    ScheduledTime DATETIME NULL
);



CREATE TABLE NotificationRecipients (
    NotificationRecipientId INT PRIMARY KEY IDENTITY,
    NotificationId INT REFERENCES Notification(NotificationId) ON DELETE CASCADE ON UPDATE CASCADE,
    UserId INT REFERENCES [User](UserId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample Committees
INSERT INTO Committee (Name, Topic) VALUES 
('UN Security Council', 'International Security'),
('WHO', 'Global Health Policies'),
('UNHRC', 'Human Rights Violations');

-- Insert sample Users
INSERT INTO [User] (UserName, [Password], Email, UserType, FullName, PhoneNumber) VALUES 
('admin1', 'password1', 'admin1@example.com', 'Admin', 'John Doe', '1234567890'),
('chair1', 'password2', 'chair1@example.com', 'Chair', 'Alice Smith', '9876543210'),
('delegate1', 'password3', 'delegate1@example.com', 'Delegate', 'Michael Brown', '5556667777');

-- Insert sample Chairs
INSERT INTO Chair (UserId, CommitteeId) VALUES 
((SELECT UserId FROM [User] WHERE UserName = 'chair1'), 
 (SELECT CommitteeId FROM Committee WHERE Name = 'UN Security Council'));

-- Insert sample Countries
INSERT INTO Country (CountryName) VALUES 
('USA'), 
('UK'), 
('China');

-- Insert sample Blocks
INSERT INTO [Block] (BlockName, Stance) VALUES 
('Western Bloc', 'Supports free trade'),
('Eastern Bloc', 'Opposes sanctions');

-- Insert sample Delegates
INSERT INTO Delegate (UserId, CountryID, BlockID) VALUES 
((SELECT UserId FROM [User] WHERE UserName = 'delegate1'), 
 (SELECT CountryId FROM Country WHERE CountryName = 'USA'),
 (SELECT BlockId FROM [Block] WHERE BlockName = 'Western Bloc'));

-- Insert sample Admins
INSERT INTO [Admin] (UserId, Responsibilities) VALUES 
((SELECT UserId FROM [User] WHERE UserName = 'admin1'), 'System Management');

-- Insert sample Sessions
INSERT INTO [Session] (CommitteeId, StartTime, EndTime, DayNumber) VALUES 
((SELECT CommitteeId FROM Committee WHERE Name = 'UN Security Council'), '2025-04-01 09:00:00', '2025-04-01 12:00:00', 1);

-- Insert sample Attendance
INSERT INTO Attendance (DelegateId, SessionId, [Status]) VALUES 
((SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'delegate1')),
 (SELECT SessionId FROM [Session] WHERE DayNumber = 1),
 'Present');

 INSERT INTO Attendance (DelegateId, SessionId, [Status]) VALUES 
 ((SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'Omer_Kahn')),
 (SELECT SessionId FROM [Session] WHERE DayNumber = 1),
 'Present');

-- Insert sample Events
INSERT INTO [Event] (SessionId, Agenda, EventType) VALUES 
((SELECT SessionId FROM [Session] WHERE DayNumber = 1), 'Discussion on Terrorism', 'Moderated Caucus');

-- Insert sample Motions
INSERT INTO Motion (EventId, SubmittedBy, SubmissionDate, DueDate, [Status], Content, TotalTime, IndividualTime, [Type], VotesFor, VotesAgainst, Abstentions, VotingType) VALUES 
((SELECT EventId FROM [Event] WHERE Agenda = 'Discussion on Terrorism'), 
 (SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'delegate1')),
 '2025-03-25 10:00:00', '2025-03-26 10:00:00', 'Pending', 'Increase counter-terrorism measures', 30, 3, 'General Debate', 0, 0, 0, 'Named');

-- Insert sample Resolutions
INSERT INTO Resolution (EventId, SubmissionDate, DueDate, [Status], VotesFor, VotesAgainst, Abstentions, SubmissionBlockId, VotingType) VALUES 
((SELECT EventId FROM [Event] WHERE Agenda = 'Discussion on Terrorism'), 
 '2025-03-25 12:00:00', '2025-03-26 12:00:00', 'Pending', 0, 0, 0, 
 (SELECT BlockId FROM [Block] WHERE BlockName = 'Western Bloc'), 'Anonymous');

-- Insert sample Position Papers
INSERT INTO PositionPaper (DelegateId, SubmissionDate, DueDate, Feedback, [Status]) VALUES 
((SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'delegate1')),
 '2025-03-24 14:00:00', '2025-03-30 14:00:00', 'Needs more citations', 'Draft');

-- Insert sample Votes
INSERT INTO Vote (DelegateId, MotionId, VoteType) VALUES 
((SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'delegate1')),
 (SELECT MotionId FROM Motion WHERE Content = 'Increase counter-terrorism measures'),
 'For');

-- Insert sample Posts
INSERT INTO Post (CreationDate, Description, AdminId, Recipients, [Status], AttachmentURL, Category) VALUES 
(GETDATE(), 'MUN starts tomorrow!', 
 (SELECT AdminId FROM [Admin] WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'admin1')), 
 'All Participants', 'Active', NULL, 'Announcement');

-- Insert sample Notifications
INSERT INTO Notification (Title, Content, SentDate, Category, ScheduledTime) VALUES 
('Welcome to MUN', 'Please check your schedules and committees.', GETDATE(), 'System Updates', NULL);

-- Insert sample Notification Recipients
INSERT INTO NotificationRecipients (NotificationId, UserId) VALUES 
((SELECT NotificationId FROM Notification WHERE Title = 'Welcome to MUN'),
 (SELECT UserId FROM [User] WHERE UserName = 'delegate1'));

-- Insert sample Past Experiences
INSERT INTO PastExperiences (DelegateId, Award, ConferenceName, Year, Notes) VALUES 
((SELECT DelegateId FROM Delegate WHERE UserId = (SELECT UserId FROM [User] WHERE UserName = 'delegate1')),
 'BD', 'Harvard MUN', 2023, 'Best Delegate in Crisis Committee');


 -- Retrieve all records from each table

SELECT * FROM Committee;
SELECT * FROM [User];
SELECT * FROM Chair;
SELECT * FROM Country;
SELECT * FROM [Block];
SELECT * FROM Delegate;
SELECT * FROM [Admin];
SELECT * FROM [Session];
SELECT * FROM Attendance;
SELECT * FROM [Event];
SELECT * FROM Motion;
SELECT * FROM Resolution;
SELECT * FROM PositionPaper;
SELECT * FROM Vote;
SELECT * FROM PastExperiences;
SELECT * FROM Post;
SELECT * FROM [Notification];
SELECT * FROM NotificationRecipients;

GO
CREATE PROCEDURE sp_ShowTables
as
BEGIN
	Select * from [User]
	select * from Delegate
	select * from Chair
	select * from [Admin]
END
GO
EXEC sp_ShowTables

GO
--1
-- Stored Procedure for User Registration
CREATE PROCEDURE sp_RegisterUser
    @UserName VARCHAR(50),
    @Password VARCHAR(100),
    @Email VARCHAR(100),
    @FullName VARCHAR(100),
    @PhoneNumber VARCHAR(15),
    @UserTypeFlag INT  -- 1 for Delegate, 2 for Chair
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM [User] WHERE Email = @Email)
    BEGIN
        PRINT 'Email already exists. Please use a different email.';
        RETURN;
    END

    -- Insert user into [User] table
    DECLARE @NewUserId INT;
    INSERT INTO [User] (UserName, [Password], Email, UserType, FullName, PhoneNumber, CreatedDate)
    VALUES (@UserName, @Password, @Email, CASE WHEN @UserTypeFlag = 1 THEN 'Delegate' ELSE 'Chair' END, @FullName, @PhoneNumber, GETDATE());

    SET @NewUserId = SCOPE_IDENTITY();

    -- If the user is a Delegate, insert into Delegate table
    IF @UserTypeFlag = 1
    BEGIN
        INSERT INTO Delegate (UserId, CountryID, BlockID)
        VALUES (@NewUserId, NULL, NULL);  -- Country & Block to be assigned later
    END
    -- If the user is a Chair, insert into Chair table
    ELSE IF @UserTypeFlag = 2
    BEGIN
        INSERT INTO Chair (UserId, CommitteeId)
        VALUES (@NewUserId, NULL);  -- Committee to be assigned later
    END

    PRINT 'User registered successfully.';
END;

GO
-- Stored Procedure for User Login
CREATE PROCEDURE sp_LoginUser
    @Email VARCHAR(100),
    @Password VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if email exists
    IF NOT EXISTS (SELECT 1 FROM [User] WHERE Email = @Email)
    BEGIN
        PRINT 'Invalid email. Please register first.';
        RETURN;
    END

    -- Check if email and password match
    IF EXISTS (SELECT 1 FROM [User] WHERE Email = @Email AND [Password] = @Password)
    BEGIN
        PRINT 'You are logged in successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Incorrect password. Please try again.';
    END
END;
GO

EXEC sp_RegisterUser 
    @UserName = 'Omer_Kahn',
    @Password = 'securePass123',
    @Email = 'Omer@example.com',
    @FullName = 'Omer Adnan',
    @PhoneNumber = '03335678910',
    @UserTypeFlag = 1;  -- 1 for Delegate, 2 for Chair
GO
select * from [User]
select * from Delegate

GO

CREATE PROCEDURE sp_DeleteUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM [User] WHERE UserId = @UserId)
    BEGIN
        PRINT 'User does not exist.';
        RETURN;
    END
    
    DELETE FROM [User] WHERE UserId = @UserId;
    
    PRINT 'User deleted successfully.';
END;
GO
EXEC sp_DeleteUser
	@UserId = 5;

GO
CREATE PROCEDURE sp_UpdateUserInfo
    @UserId INT,
    @UserName VARCHAR(50) = NULL,
    @Email VARCHAR(100) = NULL,
    @FullName VARCHAR(100) = NULL,
    @PhoneNumber VARCHAR(15) = NULL,
    @Password VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM [User] WHERE UserId = @UserId)
    BEGIN
        PRINT 'User does not exist.';
        RETURN;
    END
    
    -- Begin building the update statement
    DECLARE @UpdateSQL NVARCHAR(1000) = 'UPDATE [User] SET ';
    DECLARE @UpdateCount INT = 0;
    
    -- Add parameters to update statement if they're not NULL
    IF @UserName IS NOT NULL
    BEGIN
        -- Check if username is already taken
        IF EXISTS (SELECT 1 FROM [User] WHERE UserName = @UserName AND UserId != @UserId)
        BEGIN
            PRINT 'Username already taken.';
            RETURN;
        END
        
        SET @UpdateSQL = @UpdateSQL + 'UserName = ''' + @UserName + '''';
        SET @UpdateCount = @UpdateCount + 1;
    END
    
    IF @Email IS NOT NULL
    BEGIN
        -- Check if email is already taken
        IF EXISTS (SELECT 1 FROM [User] WHERE Email = @Email AND UserId != @UserId)
        BEGIN
            PRINT 'Email already taken.';
            RETURN;
        END
        
        IF @UpdateCount > 0
            SET @UpdateSQL = @UpdateSQL + ', ';
            
        SET @UpdateSQL = @UpdateSQL + 'Email = ''' + @Email + '''';
        SET @UpdateCount = @UpdateCount + 1;
    END
    
    IF @FullName IS NOT NULL
    BEGIN
        IF @UpdateCount > 0
            SET @UpdateSQL = @UpdateSQL + ', ';
            
        SET @UpdateSQL = @UpdateSQL + 'FullName = ''' + @FullName + '''';
        SET @UpdateCount = @UpdateCount + 1;
    END
    
    IF @PhoneNumber IS NOT NULL
    BEGIN
        IF @UpdateCount > 0
            SET @UpdateSQL = @UpdateSQL + ', ';
            
        SET @UpdateSQL = @UpdateSQL + 'PhoneNumber = ''' + @PhoneNumber + '''';
        SET @UpdateCount = @UpdateCount + 1;
    END
    
    IF @Password IS NOT NULL
    BEGIN
        IF @UpdateCount > 0
            SET @UpdateSQL = @UpdateSQL + ', ';
            
        SET @UpdateSQL = @UpdateSQL + 'Password = ''' + @Password + '''';
        SET @UpdateCount = @UpdateCount + 1;
    END
    
    -- If no updates were specified, return
    IF @UpdateCount = 0
    BEGIN
        PRINT 'No updates specified.';
        RETURN;
    END
    
    -- Complete the update statement
    SET @UpdateSQL = @UpdateSQL + ' WHERE UserId = ' + CAST(@UserId AS NVARCHAR(10));
    
    -- Execute the update statement
    EXEC sp_executesql @UpdateSQL;
    
    PRINT 'User information updated successfully.';
END;
GO

-- Case 1: Update just the username
EXEC sp_UpdateUserInfo 
    @UserId = 6, 
    @UserName = 'new_delegate1';

SELECT * from [User]
select * from Delegate

-- Case 2: Update multiple fields
EXEC sp_UpdateUserInfo 
    @UserId = 6, 
    @Email = 'new_Omer@example.com',
    @FullName = 'Omer Adnan Khan',
    @PhoneNumber = '5551234567';
SELECT * from [User]
select * from Delegate

-- Case 3: Update only password
EXEC sp_UpdateUserInfo 
    @UserId = 6, 
    @Password = 'newSecurePassword123';
SELECT * from [User]
select * from Delegate

-- Case 4: Try to update with already taken username
EXEC sp_UpdateUserInfo 
    @UserId = 6, 
    @UserName = 'admin1'; -- This should fail as 'admin1' is already taken
SELECT * from [User]
select * from Delegate

-- Case 5: Try to update with already taken email
EXEC sp_UpdateUserInfo 
    @UserId = 6, 
    @Email = 'admin1@example.com'; -- This should fail as this email is already taken
SELECT * from [User]
select * from Delegate

-- Case 6: Update a non-existent user
EXEC sp_UpdateUserInfo 
    @UserId = 999, 
    @FullName = 'Nobody'; -- This should fail as user 999 doesn't exist
SELECT * from [User]
select * from Delegate

-- Case 7: Call with no parameters to update
EXEC sp_UpdateUserInfo 
    @UserId = 3; -- This should indicate no updates were specified
SELECT * from [User]
select * from Delegate

-- Case 8: Update all fields at once
EXEC sp_UpdateUserInfo 
    @UserId = 6,
    @UserName = 'Omer_updated',
    @Email = 'Omernew@example.com',
    @FullName = 'Omer Adnan Update',
    @PhoneNumber = '5559991111',
    @Password = 'SuperSecurePass2025';
SELECT * from [User]
select * from Delegate


GO
CREATE PROCEDURE sp_DeleteCommittee
    @CommitteeId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if committee exists
    IF NOT EXISTS (SELECT 1 FROM Committee WHERE CommitteeId = @CommitteeId)
    BEGIN
        PRINT 'Committee does not exist.';
        RETURN;
    END
    
    -- Check if there are sessions scheduled for this committee
    IF EXISTS (SELECT 1 FROM [Session] WHERE CommitteeId = @CommitteeId)
    BEGIN
        PRINT 'Cannot delete committee with active sessions. Delete sessions first.';
        RETURN;
    END
    
    -- Delete delegates from committee (junction table)
    DELETE FROM DelegateCommittee WHERE CommitteeId = @CommitteeId;
    
    -- Remove committee assignment from chairs
    UPDATE Chair SET CommitteeId = NULL WHERE CommitteeId = @CommitteeId;
    
    -- Delete the committee
    DELETE FROM Committee WHERE CommitteeId = @CommitteeId;
    
    PRINT 'Committee deleted successfully.';
END;


GO
--4
CREATE PROCEDURE SubmitPositionPaper
    @DelegateId INT,
    @SubmissionDate DATETIME,
    @DueDate DATETIME,
    @Status VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert the position paper submission
    INSERT INTO PositionPaper (DelegateId, SubmissionDate, DueDate, [Status])
    VALUES (@DelegateId, @SubmissionDate, @DueDate, @Status);

    PRINT 'Position paper submitted successfully.';
END;

GO
EXEC SubmitPositionPaper 
    @DelegateId = 3, 
    @SubmissionDate = '2025-03-25 14:00:00', 
    @DueDate = '2025-03-30 14:00:00', 
    @Status = 'Draft';

select * from PositionPaper
GO
--6
CREATE PROCEDURE SubmitResolution
    @EventId INT,
    @SubmissionDate DATETIME,
    @DueDate DATETIME,
    @Status VARCHAR(20),
    @SubmissionBlockId INT,
    @VotingType VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the SubmissionBlockId exists in the Block table
    IF NOT EXISTS (SELECT 1 FROM [Block] WHERE BlockId = @SubmissionBlockId)
    BEGIN
        PRINT 'Invalid Block ID.';
        RETURN;
    END

    -- Insert the resolution into the Resolution table
    INSERT INTO Resolution (EventId, SubmissionDate, DueDate, [Status], VotesFor, VotesAgainst, Abstentions, SubmissionBlockId, VotingType)
    VALUES (@EventId, @SubmissionDate, @DueDate, @Status, 0, 0, 0, @SubmissionBlockId, @VotingType);

    PRINT 'Resolution submitted successfully.';
END;
GO
EXEC SubmitResolution 
    @EventId = 1, 
    @SubmissionDate = '2025-04-01 10:00:00', 
    @DueDate = '2025-04-05 10:00:00', 
    @Status = 'Pending',
    @SubmissionBlockId = 2,
    @VotingType = 'Anonymous';

select * from [Block]
select * from Resolution
select * from Motion

--voting
GO
CREATE PROCEDURE VoteOnMotion
    @DelegateId INT,
    @MotionId INT,
    @VoteType VARCHAR(20)  -- 'For', 'Against', 'Abstain'
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if Motion exists
    IF NOT EXISTS (SELECT 1 FROM Motion WHERE MotionId = @MotionId)
    BEGIN
        PRINT 'Invalid Motion ID.';
        RETURN;
    END

    -- Check if Delegate is present in the session (Attendance table)
    IF NOT EXISTS 
	(
		Select A.DelegateId
		from Attendance A
		INNER JOIN [Event] E ON E.SessionId = A.SessionId
		INNER JOIN Motion M ON M.EventId = E.EventId
		WHERE @DelegateId = A.DelegateId
	)
    BEGIN
        PRINT 'Delegate is not present in the session.';
        RETURN;
    END

    -- Validate VoteType
    IF @VoteType NOT IN ('For', 'Against', 'Abstain')
    BEGIN
        PRINT 'Invalid Vote Type. Allowed values: For, Against, Abstain.';
        RETURN;
    END

    -- Insert the vote
    INSERT INTO Vote (DelegateId, MotionId, VoteType)
    VALUES (@DelegateId, @MotionId, @VoteType);

    -- Update vote count in Motion table
    IF @VoteType = 'For'
        UPDATE Motion SET VotesFor = VotesFor + 1 WHERE MotionId = @MotionId;
    ELSE IF @VoteType = 'Against'
        UPDATE Motion SET VotesAgainst = VotesAgainst + 1 WHERE MotionId = @MotionId;
    ELSE IF @VoteType = 'Abstain'
        UPDATE Motion SET Abstentions = Abstentions + 1 WHERE MotionId = @MotionId;

    PRINT 'Vote recorded and vote count updated for Motion.';
END;
GO
GO
CREATE PROCEDURE VoteOnResolution
    @DelegateId INT,
    @ResolutionId INT,
    @VoteType VARCHAR(20)  -- 'For', 'Against', 'Abstain'
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if Resolution exists
    IF NOT EXISTS (SELECT 1 FROM Resolution WHERE ResolutionId = @ResolutionId)
    BEGIN
        PRINT 'Invalid Resolution ID.';
        RETURN;
    END

    -- Check if Delegate is present in the session (Attendance table)
    IF NOT EXISTS 
    (
        SELECT A.DelegateId
        FROM Attendance A
        INNER JOIN [Event] E ON E.SessionId = A.SessionId
        INNER JOIN Resolution R ON R.EventId = E.EventId
        WHERE @DelegateId = A.DelegateId
    )
    BEGIN
        PRINT 'Delegate is not present in the session.';
        RETURN;
    END

    -- Validate VoteType
    IF @VoteType NOT IN ('For', 'Against', 'Abstain')
    BEGIN
        PRINT 'Invalid Vote Type. Allowed values: For, Against, Abstain.';
        RETURN;
    END

    -- Insert the vote
    INSERT INTO Vote (DelegateId, ResolutionId, VoteType)
    VALUES (@DelegateId, @ResolutionId, @VoteType);

    -- Update vote count in Resolution table
    IF @VoteType = 'For'
        UPDATE Resolution SET VotesFor = VotesFor + 1 WHERE ResolutionId = @ResolutionId;
    ELSE IF @VoteType = 'Against'
        UPDATE Resolution SET VotesAgainst = VotesAgainst + 1 WHERE ResolutionId = @ResolutionId;
    ELSE IF @VoteType = 'Abstain'
        UPDATE Resolution SET Abstentions = Abstentions + 1 WHERE ResolutionId = @ResolutionId;

    PRINT 'Vote recorded and vote count updated for Resolution.';
END;
GO
EXEC VoteOnResolution @DelegateId = 3, @ResolutionId = 1, @VoteType = 'Against';
EXEC VoteOnMotion @DelegateId = 3, @MotionId = 1, @VoteType = 'For';

select * from Motion
select * from Resolution
select * from [Event]
select * from Attendance
select * from Vote

--5
GO
CREATE PROCEDURE SendNotification
    @Title VARCHAR(100),
    @Content VARCHAR(MAX),
    @Category VARCHAR(50), -- Must be 'System Updates', 'Event Changes', or 'Reminders'
    @ScheduledTime DATETIME NULL, -- Optional, can be NULL
    @RecipientIds NVARCHAR(MAX) -- Comma-separated list of User IDs
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate Category
    IF @Category NOT IN ('System Updates', 'Event Changes', 'Reminders')
    BEGIN
        PRINT 'Invalid category. Allowed values: System Updates, Event Changes, Reminders.';
        RETURN;
    END

    -- Insert into Notification table
    DECLARE @NotificationId INT;
    INSERT INTO Notification (Title, Content, SentDate, Category, ScheduledTime)
    VALUES (@Title, @Content, GETDATE(), @Category, @ScheduledTime);

    SET @NotificationId = SCOPE_IDENTITY(); -- Get the new NotificationId

    -- Insert into NotificationRecipients table
    DECLARE @UserId INT;
    DECLARE @Index INT = 1;
    DECLARE @UserIdString NVARCHAR(10);
    
    WHILE CHARINDEX(',', @RecipientIds, @Index) > 0
    BEGIN
        SET @UserIdString = SUBSTRING(@RecipientIds, @Index, CHARINDEX(',', @RecipientIds, @Index) - @Index);
        SET @UserId = CAST(@UserIdString AS INT);

        -- Validate if User Exists
        IF EXISTS (SELECT 1 FROM [User] WHERE UserId = @UserId)
        BEGIN
            INSERT INTO NotificationRecipients (NotificationId, UserId)
            VALUES (@NotificationId, @UserId);
        END
        ELSE
        BEGIN
            PRINT 'Invalid User ID: ' + @UserIdString;
        END

        SET @Index = CHARINDEX(',', @RecipientIds, @Index) + 1;
    END

    -- Last UserId (After last comma)
    SET @UserIdString = SUBSTRING(@RecipientIds, @Index, LEN(@RecipientIds) - @Index + 1);
    IF @UserIdString <> ''
    BEGIN
        SET @UserId = CAST(@UserIdString AS INT);
        IF EXISTS (SELECT 1 FROM [User] WHERE UserId = @UserId)
        BEGIN
            INSERT INTO NotificationRecipients (NotificationId, UserId)
            VALUES (@NotificationId, @UserId);
        END
        ELSE
        BEGIN
            PRINT 'Invalid User ID: ' + @UserIdString;
        END
    END

    PRINT 'Notification sent successfully.';
END;
GO

select * from [Notification]
select * from NotificationRecipients
EXEC SendNotification 
    @Title = 'Reminder: Committee Meeting',
    @Content = 'Your committee session starts in 30 minutes. Please be on time.',
    @Category = 'Reminders',
    @ScheduledTime = NULL,
    @RecipientIds = '3,5';

--Event
GO
CREATE PROCEDURE CreateEvent
    @Title NVARCHAR(255),
    @EventType NVARCHAR(50),  -- Example: 'Committee Session', 'Workshop',
	@Sessionid int
AS
BEGIN
    SET NOCOUNT ON;

	IF NOT EXISTS (Select 1 from [Session] where SessionId = @Sessionid)
	BEGIN 
		PRINT 'No session with this ID'
		RETURN;
	END

    INSERT INTO [Event] (SessionId, Agenda, EventType)
    VALUES (@Sessionid, @Title, @EventType);

    PRINT 'Event created successfully.';
END;
GO

GO
CREATE PROCEDURE SubmitMotion
    @EventId INT,
    @Title NVARCHAR(255),
	@subDate Datetime,
	@dueDate Datetime,
    @Description NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if Event exists
    IF NOT EXISTS (SELECT 1 FROM [Event] WHERE EventId = @EventId)
    BEGIN
        PRINT 'Invalid Event ID.';
        RETURN;
    END

    -- Insert the Motion
    INSERT INTO Motion (EventId,SubmissionDate,DueDate,[Status],Content, VotesFor, VotesAgainst, Abstentions)
    VALUES (@EventId,@subDate,@dueDate,'Pending', @Description, 0, 0, 0);

    PRINT 'Motion submitted successfully.';
END;

EXEC SubmitMotion 
    @EventId = 1,
    @Title = 'Motion to Enhance Cybersecurity',
    @subDate = '2025-03-27 14:00:00',
    @dueDate = '2025-04-05 23:59:59',
    @Description = 'A motion to implement stricter cybersecurity protocols for data protection.';

GO

CREATE PROCEDURE InsertCountries
AS
BEGIN
    DECLARE @DelegateCount INT; --- HOLDS the max number of delegates in any committee
    DECLARE @Counter INT = 0;

    SELECT @DelegateCount = MAX(DelegateCount)
    FROM (
        SELECT CommitteeId, COUNT(DelegateId) AS DelegateCount
        FROM DelegateCommittee
        GROUP BY CommitteeId
    ) AS CommitteeDelegates;

    -- Ensure a valid count
    IF @DelegateCount IS NULL
        SET @DelegateCount = 0;

    -- Truncate the Country table before inserting new data
    TRUNCATE TABLE Country;

    -- Insert only the required number of countries
    WHILE @Counter < @DelegateCount
    BEGIN
        INSERT INTO Country (CountryName, Importance)
        SELECT TOP (1) CountryName, Importance
        FROM (VALUES
            ('United States', 1), ('China', 2), ('Russia', 3), ('United Kingdom', 4), ('France', 5),
            ('Germany', 6), ('Japan', 7), ('India', 8), ('Brazil', 9), ('South Africa', 10),
            ('Canada', 11), ('Australia', 12), ('Italy', 13), ('Mexico', 14), ('South Korea', 15),
            ('Indonesia', 16), ('Turkey', 17), ('Saudi Arabia', 18), ('Argentina', 19), ('Egypt', 20),
            ('Spain', 21), ('Netherlands', 22), ('Sweden', 23), ('Pakistan', 24), ('Nigeria', 25),
            ('Thailand', 26), ('Malaysia', 27), ('Vietnam', 28), ('Norway', 29), ('Switzerland', 30),
            ('Bangladesh', 31), ('Philippines', 32), ('United Arab Emirates', 33), ('Greece', 34),
            ('Chile', 35), ('Colombia', 36), ('Poland', 37), ('Czech Republic', 38), ('Belgium', 39),
            ('New Zealand', 40)
        ) AS CountryList(CountryName, Importance)
        WHERE NOT EXISTS (SELECT 1 FROM Country WHERE CountryName = CountryList.CountryName);

        SET @Counter = @Counter + 1;
    END
END;

GO
CREATE PROCEDURE AllocateCountriesToDelegates
AS
BEGIN
    -- Temporary table to store delegate rankings
    CREATE TABLE #RankedDelegates (
        DelegateId INT PRIMARY KEY,
        UserId INT,
        CommitteeId INT NULL,
        TotalPoints INT DEFAULT 0,
        pos INT DEFAULT 0,
        AssignedCountry VARCHAR(255) NULL
    );
	
    -- Insert delegates and calculate experience points
    INSERT INTO #RankedDelegates (DelegateId, UserId, CommitteeId, TotalPoints)
    SELECT 
        d.DelegateId,
        d.UserId,
        dc.CommitteeId,
        COALESCE(
            (SELECT SUM(
                CASE 
                    WHEN pe.Award = 'BD' THEN 5
                    WHEN pe.Award = 'OD' THEN 3
                    WHEN pe.Award = 'HM' THEN 2
                    ELSE 0 
                END
            ) FROM PastExperiences pe WHERE pe.DelegateId = d.DelegateId), 0
        ) AS TotalPoints
    FROM Delegate d
    LEFT JOIN DelegateCommittee dc ON d.DelegateId = dc.DelegateId;

	
	WITH Ranked AS (
		SELECT 
			DelegateId, 
			CommitteeId, 
			TotalPoints,
			ROW_NUMBER() OVER (PARTITION BY CommitteeId ORDER BY TotalPoints DESC, DelegateId) AS RankInCommittee
		FROM #RankedDelegates
	)
	UPDATE rd
	SET rd.pos = r.RankInCommittee
	FROM #RankedDelegates rd
	JOIN Ranked r ON rd.DelegateId = r.DelegateId;

    -- Allocating countries based on calculated pos
    UPDATE rd
    SET AssignedCountry = c.CountryName
    FROM #RankedDelegates rd
    INNER JOIN (
        SELECT CountryName, Importance AS Rank
        FROM Country
    ) c ON rd.pos = c.Rank;

    
	UPDATE d
    SET d.CountryID = c.CountryID
    FROM Delegate d
    join #RankedDelegates rd ON d.DelegateId = rd.DelegateId
    join Country c ON rd.AssignedCountry = c.CountryName;

    -- Deleting temporary table
    DROP TABLE #RankedDelegates;
END;

GO;

CREATE PROCEDURE GetDelegatesWithoutCountries
AS
BEGIN
    SELECT 
        d.DelegateId,
        u.UserName,
        'No Country Available' AS Issue
    FROM Delegate d
    INNER JOIN [User] u ON d.UserId = u.UserId
    WHERE d.CountryID IS NULL;
END;

go;

CREATE PROCEDURE IdentifyDelegatesWithoutCommittee
AS
BEGIN
    SELECT 
        d.DelegateId,
        u.UserName,
        'No Committee Assigned' AS Issue
    FROM Delegate d
    INNER JOIN [User] u ON d.UserId = u.UserId
    LEFT JOIN DelegateCommittee dc ON d.DelegateId = dc.DelegateId
    WHERE dc.DelegateId IS NULL;
END;



GO

CREATE PROCEDURE GetAvailableCountries
    @CommitteeId INT
AS
BEGIN
    SELECT C.CountryID, C.CountryName
    FROM Country C
    WHERE C.CountryID NOT IN (
        SELECT DISTINCT D.CountryID
        FROM Delegate D
        INNER JOIN DelegateCommittee DC ON D.DelegateId = DC.DelegateId
        WHERE DC.CommitteeId = @CommitteeId
    )
    ORDER BY C.CountryName;
END;

GO
-- for analytical purposes (Leaderboard)
CREATE PROCEDURE GetOverallLeaderboard
AS
BEGIN
    SELECT 
        U.UserName AS DelegateName,
        C.CountryName,
        CO.Name AS CommitteeName,
        COALESCE(SUM(
            CASE 
                WHEN P.Award = 'HM' THEN 3  
                WHEN P.Award = 'BD' THEN 5  
                WHEN P.Award = 'OD' THEN 2  
                ELSE 0
            END
        ), 0) +
        COALESCE(SUM(
            CASE 
                WHEN M.Status = 'Approved' THEN 2
                ELSE 0
            END
        ), 0) +
        COALESCE(SUM(
            CASE 
                WHEN R.Status = 'Passed' THEN 5
                ELSE 0
            END
        ), 0) AS TotalPoints
    FROM Delegate D
    INNER JOIN [User] U ON D.UserId = U.UserId
    INNER JOIN Country C ON D.CountryID = C.CountryID
    INNER JOIN DelegateCommittee DC ON D.DelegateId = DC.DelegateId
    INNER JOIN Committee CO ON DC.CommitteeId = CO.CommitteeId
    LEFT JOIN PastExperiences P ON D.DelegateId = P.DelegateId
    LEFT JOIN Motion M ON D.DelegateId = M.SubmittedBy
    LEFT JOIN Resolution R ON R.SubmissionBlockId = D.BlockID
    GROUP BY U.UserName, C.CountryName, CO.Name
    ORDER BY TotalPoints DESC;
END;

GO;

CREATE PROCEDURE GetCommitteeLeaderboard
    @CommitteeId INT
AS
BEGIN
    SELECT 
        U.UserName AS DelegateName,
        C.CountryName,
        CO.Name AS CommitteeName,
        COALESCE(SUM(
            CASE 
                WHEN P.Award = 'HM' THEN 3  
                WHEN P.Award = 'BD' THEN 5  
                WHEN P.Award = 'OD' THEN 2  
                ELSE 0
            END
        ), 0) +
        COALESCE(SUM(
            CASE 
                WHEN M.Status = 'Approved' THEN 2
                ELSE 0
            END
        ), 0) +
        COALESCE(SUM(
            CASE 
                WHEN R.Status = 'Passed' THEN 5
                ELSE 0
            END
        ), 0) AS TotalPoints
    FROM Delegate D
    INNER JOIN [User] U ON D.UserId = U.UserId
    INNER JOIN Country C ON D.CountryID = C.CountryID
    INNER JOIN DelegateCommittee DC ON D.DelegateId = DC.DelegateId
    INNER JOIN Committee CO ON DC.CommitteeId = CO.CommitteeId
    LEFT JOIN PastExperiences P ON D.DelegateId = P.DelegateId
    LEFT JOIN Motion M ON D.DelegateId = M.SubmittedBy
    LEFT JOIN Resolution R ON R.SubmissionBlockId = D.BlockID
    WHERE CO.CommitteeId = @CommitteeId
    GROUP BY U.UserName, C.CountryName, CO.Name
    ORDER BY TotalPoints DESC;
END;

EXEC GetCommitteeLeaderboard @CommitteeId = 1;  
EXEC GetOverallLeaderboard;


select * from Delegate

select * from [Event]
select * from Resolution
select * from Motion
GO
--CRUD Procedures
CREATE PROCEDURE sp_DeleteMotion --1086 line not working
    @MotionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if motion exists
    IF NOT EXISTS (SELECT 1 FROM Motion WHERE MotionId = @MotionId)
    BEGIN
        PRINT 'Motion does not exist.';
        RETURN;
    END
    
    -- Get the associated EventId
    DECLARE @EventId INT;
    SELECT @EventId = EventId FROM Motion WHERE MotionId = @MotionId;
    
    BEGIN TRANSACTION;
    
    -- Delete votes associated with this motion
    DELETE FROM Vote WHERE MotionId = @MotionId;
    
    -- Delete the motion
    DELETE FROM Motion WHERE MotionId = @MotionId;
    
	IF NOT EXISTS (SELECT 1 FROM Motion WHERE EventId = @EventId) 
        AND NOT EXISTS (SELECT 1 FROM Resolution WHERE EventId = @EventId)
    BEGIN
        -- Get the SessionId from the Event before deleting it
        DECLARE @SessionId INT;
        SELECT @SessionId = SessionId FROM [Event] WHERE EventId = @EventId;
        
        -- Update Attendance records to set EventId to NULL where it matches
        --UPDATE Attendance SET EventId = NULL WHERE EventId = @EventId;
        
        -- Then delete the event
        DELETE FROM [Event] WHERE EventId = @EventId;
        PRINT 'Motion and associated event deleted successfully.';
    END


    COMMIT TRANSACTION;
END;
GO

drop procedure sp_DeleteMotion

select * from [Event]
select * from Motion
select * from Resolution

GO
CREATE PROCEDURE sp_DeleteResolution
    @ResolutionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if resolution exists
    IF NOT EXISTS (SELECT 1 FROM Resolution WHERE ResolutionId = @ResolutionId)
    BEGIN
        PRINT 'Resolution does not exist.';
        RETURN;
    END
    
    -- Get the associated EventId
    DECLARE @EventId INT;
    SELECT @EventId = EventId FROM Resolution WHERE ResolutionId = @ResolutionId;
    
    BEGIN TRANSACTION;
    
    -- Delete votes associated with this resolution
    DELETE FROM Vote WHERE ResolutionId = @ResolutionId;
    
    -- Delete the resolution
    DELETE FROM Resolution WHERE ResolutionId = @ResolutionId;
    
    -- Check if this Event has other motions or resolutions
    IF NOT EXISTS (SELECT 1 FROM Motion WHERE EventId = @EventId) 
        AND NOT EXISTS (SELECT 1 FROM Resolution WHERE EventId = @EventId)
    BEGIN
        -- Update Attendance records to set EventId to NULL where it matches
        --UPDATE Attendance SET EventId = NULL WHERE EventId = @EventId;
        
        -- Then delete the event
        DELETE FROM [Event] WHERE EventId = @EventId;
        PRINT 'Resolution and associated event deleted successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Resolution deleted successfully. Event maintained because other motions/resolutions exist.';
    END
    
    COMMIT TRANSACTION;
END;
GO

GO
CREATE PROCEDURE sp_DeleteBlock
    @BlockId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if block exists
    IF NOT EXISTS (SELECT 1 FROM [Block] WHERE BlockId = @BlockId)
    BEGIN
        PRINT 'Block does not exist.';
        RETURN;
    END
    
    -- Check if there are any resolutions submitted by this block
    IF EXISTS (SELECT 1 FROM Resolution WHERE SubmissionBlockId = @BlockId)
    BEGIN
        PRINT 'Cannot delete block that has submitted resolutions.';
        RETURN;
    END
    
    BEGIN TRANSACTION;
    
    -- Remove block assignment from delegates
    UPDATE Delegate SET BlockID = NULL WHERE BlockID = @BlockId;
    
    -- Delete the block
    DELETE FROM [Block] WHERE BlockId = @BlockId;
    
    COMMIT TRANSACTION;
    
    PRINT 'Block deleted successfully.';
END;
GO

select * from [Block]
select * from Resolution

GO
CREATE PROCEDURE sp_EndSession
    @SessionId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if session exists
    IF NOT EXISTS (SELECT 1 FROM [Session] WHERE SessionId = @SessionId)
    BEGIN
        PRINT 'Session does not exist.';
        RETURN;
    END
    
    -- Update the session end time to current time if it's still running
    IF (SELECT EndTime FROM [Session] WHERE SessionId = @SessionId) > GETDATE()
    BEGIN
        UPDATE [Session] SET EndTime = GETDATE() WHERE SessionId = @SessionId;
        PRINT 'Session ended successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Session was already ended.';
    END
END;
GO

CREATE PROCEDURE sp_CreateNewSession
    @CommitteeId INT,
    @StartTime DATETIME,
    @EndTime DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if committee exists
    IF NOT EXISTS (SELECT 1 FROM Committee WHERE CommitteeId = @CommitteeId)
    BEGIN
        PRINT 'Committee does not exist.';
        RETURN;
    END
    
    -- Validate times
    IF @StartTime >= @EndTime
    BEGIN
        PRINT 'Start time must be before end time.';
        RETURN;
    END
    
    -- Create the new session
    INSERT INTO [Session] (CommitteeId, StartTime, EndTime, DayNumber)
    VALUES (@CommitteeId, @StartTime, @EndTime, 1);
    
    PRINT 'Session created successfully.';
END;
GO

CREATE PROCEDURE sp_UpdateSessionDay
    @SessionId INT,
    @NewDayNumber INT,
    @NewStartTime DATETIME = NULL,
    @NewEndTime DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if session exists
    IF NOT EXISTS (SELECT 1 FROM [Session] WHERE SessionId = @SessionId)
    BEGIN
        PRINT 'Session does not exist.';
        RETURN;
    END
    
    -- Validate day number
    IF @NewDayNumber < 1 OR @NewDayNumber > 3
    BEGIN
        PRINT 'Day number must be between 1 and 3.';
        RETURN;
    END
    
    -- Get current values for any NULL parameters
    DECLARE @StartTime DATETIME, @EndTime DATETIME, @CommitteeId INT;
    SELECT 
        @StartTime = CASE WHEN @NewStartTime IS NULL THEN StartTime ELSE @NewStartTime END,
        @EndTime = CASE WHEN @NewEndTime IS NULL THEN EndTime ELSE @NewEndTime END,
        @CommitteeId = CommitteeId
    FROM [Session]
    WHERE SessionId = @SessionId;
    
    -- Validate times
    IF @StartTime >= @EndTime
    BEGIN
        PRINT 'Start time must be before end time.';
        RETURN;
    END
    
    -- Check for overlapping sessions
    IF EXISTS (
        SELECT 1 
        FROM [Session] 
        WHERE CommitteeId = @CommitteeId 
        AND DayNumber = @NewDayNumber
        AND SessionId != @SessionId
        AND (
            (@StartTime BETWEEN StartTime AND EndTime)
            OR (@EndTime BETWEEN StartTime AND EndTime)
            OR (StartTime BETWEEN @StartTime AND @EndTime)
        )
    )
    BEGIN
        PRINT 'Session would overlap with an existing session.';
        RETURN;
    END
    
    -- Update the session
    UPDATE [Session]
    SET DayNumber = @NewDayNumber,
        StartTime = @StartTime,
        EndTime = @EndTime
    WHERE SessionId = @SessionId;
    
    PRINT 'Session updated successfully.';
END;
GO
