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
        -- Return empty set with message
        SELECT 0 AS Success, 'Invalid email. Please register first.' AS Message;
        RETURN;
    END

    -- Check if email and password match
    IF EXISTS (SELECT 1 FROM [User] WHERE Email = @Email AND [Password] = @Password)
    BEGIN
        -- Return user data on successful login
        SELECT 
            1 AS Success, 
            'Login successful' AS Message,
            UserId,
            UserName,
            Email,
            FullName,
            PhoneNumber
        FROM [User] 
        WHERE Email = @Email AND [Password] = @Password;
    END
    ELSE
    BEGIN
        -- Return failure message
        SELECT 0 AS Success, 'Incorrect password. Please try again.' AS Message;
    END
END;
GO

exec sp_LoginUser @Email = 'admin1@example.com', @Password = 'password1'

CREATE PROCEDURE sp_GetAllDelegates
AS
BEGIN
    SELECT 
        d.DelegateId,
        u.FullName,
        u.Email,
        c.CountryName,
        b.BlockName,
        STRING_AGG(cm.Name, ', ') AS Committees
    FROM Delegate d
    JOIN [User] u ON d.UserId = u.UserId
    LEFT JOIN Country c ON d.CountryID = c.CountryID
    LEFT JOIN [Block] b ON d.BlockID = b.BlockId
    LEFT JOIN DelegateCommittee dc ON d.DelegateId = dc.DelegateId
    LEFT JOIN Committee cm ON dc.CommitteeId = cm.CommitteeId
    GROUP BY d.DelegateId, u.FullName, u.Email, c.CountryName, b.BlockName;
END;

go;
CREATE PROCEDURE sp_GetDelegateById
    @DelegateId INT
AS
BEGIN
    SELECT 
        d.DelegateId,
        u.FullName,
        u.Email,
        u.PhoneNumber,
        c.CountryName,
        b.BlockName,
        STRING_AGG(cm.Name, ', ') AS Committees
    FROM Delegate d
    JOIN [User] u ON d.UserId = u.UserId
    LEFT JOIN Country c ON d.CountryID = c.CountryID
    LEFT JOIN [Block] b ON d.BlockID = b.BlockId
    LEFT JOIN DelegateCommittee dc ON d.DelegateId = dc.DelegateId
    LEFT JOIN Committee cm ON dc.CommitteeId = cm.CommitteeId
    WHERE d.DelegateId = @DelegateId
    GROUP BY d.DelegateId, u.FullName, u.Email, u.PhoneNumber, c.CountryName, b.BlockName;
END;
go;

CREATE PROCEDURE sp_UpdateDelegate
    @DelegateId INT,
    @CountryId INT,
    @BlockId INT
AS
BEGIN
    UPDATE Delegate
    SET CountryID = @CountryId,
        BlockID = @BlockId
    WHERE DelegateId = @DelegateId;
END;

go;

CREATE PROCEDURE sp_DeleteDelegate
    @DelegateId INT
AS
BEGIN
    DECLARE @UserId INT = (SELECT UserId FROM Delegate WHERE DelegateId = @DelegateId);
    DELETE FROM [User] WHERE UserId = @UserId;
END;

go;

CREATE VIEW vw_DelegateFullInfo AS
SELECT 
    d.DelegateId,
    u.FullName,
    u.Email,
    c.CountryName,
    b.BlockName,
    STRING_AGG(DISTINCT cm.Name, ', ') AS Committees,
    pe.Award,
    pe.ConferenceName,
    pe.[Year]
FROM Delegate d
JOIN [User] u ON d.UserId = u.UserId
LEFT JOIN Country c ON d.CountryID = c.CountryID
LEFT JOIN [Block] b ON d.BlockID = b.BlockId
LEFT JOIN DelegateCommittee dc ON d.DelegateId = dc.DelegateId
LEFT JOIN Committee cm ON dc.CommitteeId = cm.CommitteeId
LEFT JOIN PastExperiences pe ON d.DelegateId = pe.DelegateId
GROUP BY d.DelegateId, u.FullName, u.Email, c.CountryName, b.BlockName, pe.Award, pe.ConferenceName, pe.[Year];


go;

CREATE VIEW vw_DelegatePerformance AS
SELECT 
    d.DelegateId,
    u.FullName,
    COUNT(DISTINCT a.AttendanceId) AS SessionsAttended,
    COUNT(DISTINCT m.MotionId) AS MotionsSubmitted,
    COUNT(DISTINCT v.VoteId) AS VotesCast,
    COUNT(DISTINCT r.ResolutionId) AS ResolutionsInvolved
FROM Delegate d
JOIN [User] u ON d.UserId = u.UserId
LEFT JOIN Attendance a ON d.DelegateId = a.DelegateId
LEFT JOIN Motion m ON d.DelegateId = m.SubmittedBy
LEFT JOIN Vote v ON d.DelegateId = v.DelegateId
LEFT JOIN Resolution r ON r.SubmissionBlockId = d.BlockID
GROUP BY d.DelegateId, u.FullName;


go;







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

drop procedure InsertCountries
go;
CREATE PROCEDURE InsertCountries
AS
BEGIN
    -- Get the total number of delegates
    DECLARE @TotalDelegates INT;
    DECLARE @ExistingCountries INT;
    DECLARE @CountriesToAdd INT;
    DECLARE @Counter INT = 0;
    
    -- Count delegates and existing countries
    SELECT @TotalDelegates = COUNT(*) FROM Delegate;
    SELECT @ExistingCountries = COUNT(*) FROM Country;
    
    -- Calculate how many countries to add
    SET @CountriesToAdd = @TotalDelegates - @ExistingCountries;
    
    -- Only add countries if needed
    IF @CountriesToAdd <= 0
        RETURN;
    
    -- Create a temporary table with the list of predefined countries
    CREATE TABLE #CountryList (
        CountryName VARCHAR(255),
        Importance INT,
        RowNum INT IDENTITY(1,1)
    );
    
    -- Populate the country list
    INSERT INTO #CountryList (CountryName, Importance)
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
    
    -- Remove countries that already exist in the database
    DELETE FROM #CountryList
    WHERE CountryName IN (SELECT CountryName FROM Country);
    
    -- Insert the required number of new countries
    INSERT INTO Country (CountryName, Importance)
    SELECT TOP (@CountriesToAdd) CountryName, Importance
    FROM #CountryList
    ORDER BY Importance;
    
    -- Clean up
    DROP TABLE #CountryList;
END;

exec InsertCountries



select * from Country
select * from Delegate


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

select * from Country
exec AllocateCountriesToDelegates
select * from Delegate
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

go;

EXEC sp_RegisterUser 
    @UserName = 'Omer_Kahn',
    @Password = 'securePass123',
    @Email = 'Omer@example.com',
    @FullName = 'Omer Adnan',
    @PhoneNumber = '03335678910',
    @UserTypeFlag = 1;  -- 1 for Delegate, 2 for Chair

select * from [User]
select * from Delegate


