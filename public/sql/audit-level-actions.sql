-- git notes - warehouse and file names have been changed for anonymity < and > used for alternative text

----------------------------------------------------------------------------------------------------------------------
 -- Title:	Audit Level Actions
 -- Desc:	Gathers actions from Audit and Assessment and Questionnaire tables to provide a full 
 -- 	    picture of activities related to the clinical queue and used in outcome or performance reporting. 
 --			Associated with Audit Level Changes which defines legitimate level changes within a call. 
 --		  	** May be used in performance reporting ** Amend with caution **
 --			Prefer temp tables over outer and inner applys as the large volumes in the tables cause long execution times.
 --			First Date for data is <start date> when screening and the use of Accepted / In Progress for an Assessment
 -- Job ref: xxx0000 
 -- Used in: With Audit Level Change in PBI dashboards, performance and activity reports.
----------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------
-- Set the start and end dates for the table update process
----------------------------------------------------------------------------------------------------------------------

	DECLARE @StartDate DATE = DATEADD(DAY, -7, CAST(GETDATE() AS DATE));  -- For regular daily load 
	--DECLARE @StartDate DATE = '< start date >';  -- For Full Reload ONLY ----
	DECLARE @EndDate DATE = CAST(GETDATE() AS DATE);	-- Same End Date for each ----

----------------------------------------------------------------------------------------------------------------------
-- Incident set
----------------------------------------------------------------------------------------------------------------------
-- Gather the relevant incidents for the dataset. 
-- Exclude TEST calls from the list (keep all other calls as at this stage, unverified calls are applicable as activity at this point).
----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #Incidents;

    SELECT
        i.IncidentID,
        RIGHT(i.IncidentID,7) AS CallNumber,
        i.IncidentDate,
		i.TimeStoppedOrClosed -- neded later to filter out rogue assessments

    INTO #Incidents
    FROM warehouse.dbo.Incident i WITH (NOLOCK)
	
	  WHERE i.IncidentDate BETWEEN @StartDate AND @EndDate 
      AND ISNULL(i.IncidentStopCode,'') <> 'TEST';


----------------------------------------------------------------------------------------------------------------------
-- Level boundaries 
----------------------------------------------------------------------------------------------------------------------
-- Audit Level Changes table is the source of levels for incidents
----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #Levels;
	
	SELECT
	  l.IncidentDate,
      l.IncidentID,
      l.CallNumber,
      l.LevelID,
      l.LevelStartTime,
      l.LevelName,
      l.LevelStartCode,
      l.LevelStartCategory,
      l.Submission, 
      l.LevelInIncident, 
      l.LevelInSubmission,
      l.NextLevelStartTime

    INTO #Levels
    FROM warehouse.dbo.Audit_Level_Changes l WITH (NOLOCK)
    JOIN #Incidents i ON i.IncidentID = l.IncidentID

	WHERE l.LevelChangeFlagWithinIncident =  1  -- Must be in place to filter to only legitimate level changes

----------------------------------------------------------------------------------------------------------------------
-- Internal actions (Audit)
----------------------------------------------------------------------------------------------------------------------
-- Gather actions from Audit Table, summarise as a Type
-- Assign the level they belong to based on the time of action and the corresponding level start time and best effort level end time 
----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #InternalActions;

	SELECT
        CAST(a.CallAuditPKEY AS nvarchar) AS EventPKEY, 
        CAST('Audit' AS varchar(20)) AS Source,
        l.IncidentDate,
        a.IncidentID,
        RIGHT(a.IncidentID,7) AS CallNumber,
        l.LevelID,
        l.LevelStartTime,
        l.LevelName,
        l.LevelStartCode,
        l.LevelStartCategory,
        a.TimeOfAction,

		-- Group the actions into a type 
        CASE WHEN a.[Action] IN ('Accepted', 'In_Progress') THEN 'Assessment'
             WHEN a.[Action] = 'Outcome' THEN 'Outcome'
             ELSE 'Other'
			 END AS ActionType,

		-- Identify the action to provide a similar layout to the Audit table
        CASE WHEN a.[Action] = 'Outcome' THEN 'Outcome' ELSE a.[Action] END AS [Action],
		
		a.OutcomeCode,
    	a.OutcomeDescription,
		a.Outcome AS OutcomeType,

		-- Similar to capture the upgrade or downgrade action
        CASE WHEN [OutcomeDescription] LIKE '%upgrade%' OR [OutcomeDescription] LIKE '%escalation%' THEN 'Upgrade'
	         WHEN [OutcomeDescription] LIKE '%downgrade%' THEN 'Downgrade'
			 ELSE NULL
			 END AS UpOrDownGrade,

		a.UserID,
    	a.UserName

    INTO #InternalActions
    FROM warehouse.dbo.Audit a WITH (NOLOCK)

	-- Level Identification - which level does this belong to?
    JOIN #Levels l ON l.IncidentID = a.IncidentID    -- must be the same incident
		AND a.TimeOfAction >= l.LevelStartTime    -- must have occured at or after the level has started
      	AND (l.NextLevelStartTime IS NULL     -- account for no end time (see level table load for more information)
  		     OR a.TimeOfAction < l.NextLevelStartTime)    -- must have occured before the next level started

    WHERE a.[Action] IN ('Accepted', 'In_Progress', 'Outcome')     -- only need these actions in the output, not other

----------------------------------------------------------------------------------------------------------------------
-- Questionnaires (Outcome)
----------------------------------------------------------------------------------------------------------------------
-- Questionnaires are NOT completed in real time, the actual time a question is marked as answered (TimeResponded) is not 
--     the time the question was asked and asnswered. Use session start for alignment to level.
-- Breakdown of all possible questions and answers that indicate the outcome 
-- Multiple options required as output is widely changable
-- Will need updating if any of these specific questions change
----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #QuestionnaireSession;

	----------------------------------------------------------------------------------------------------------------------
	-- Capturing a positive answer to these questions shows the outcome of the process
	----------------------------------------------------------------------------------------------------------------------
	
    WITH Answers AS (

        SELECT
            s.EpisodeKey,
            MAX(CASE WHEN QuestionText = '<Question Text 1>' AND QuestionResponse = 'Yes' THEN 1 ELSE 0 END) AS Outcome1,
			MAX(CASE WHEN QuestionText = '<Question Text 2>' AND QuestionResponse = 'Yes' THEN 1 ELSE 0 END) AS Outcome2,
			MAX(CASE WHEN QuestionText = '<Question Text 3>' AND QuestionResponse = 'Yes' THEN 1 ELSE 0 END) AS Outcome3,
			MAX(CASE WHEN QuestionText = '<Question Text 4>' AND QuestionResponse = 'Yes' THEN 1 ELSE 0 END) AS Outcome4

        FROM warehouse.dbo.Questionnaires_Cleaned s WITH (NOLOCK)
		WHERE Branch = '<branch 1>'
	    GROUP BY s.EpisodeKey
    ),

	----------------------------------------------------------------------------------------------------------------------
	-- From above, the direction of the call and the reason for that direction can be recorded
	-- Especially useful in the flow reports
	----------------------------------------------------------------------------------------------------------------------
	
    Direction AS (

        SELECT
            a.EpisodeKey,
            CASE
                WHEN a.<Outcome1> = 1 THEN 'Out1'
                WHEN a.<Outcome2> = 1 OR a.<Outcome0> = 1 THEN 'Out2'
                WHEN a.<Outcome3> = 1 THEN 'Out3'
                ELSE 'None'
            END AS Direction,
            CASE
                WHEN a.<outcome1> = 1 THEN 'Out1-Reas'
                WHEN a.<Outcome2> = 1 THEN 'Out2-Reas'
                WHEN a.<Outcome0> = 1 THEN 'Out0-Reas'
                WHEN a.<Outcome4> = 1 THEN 'Out4-Reas'
                ELSE 'None'
            END AS DirectionReason

        FROM Answers a
    )

	----------------------------------------------------------------------------------------------------------------------
	-- Pull the Screening Sessions information together
	----------------------------------------------------------------------------------------------------------------------

    SELECT
        v.IncidentId,
        v.CallNumber,
        v.EpisodeKey,
        v.Branch,
        v.QStartTime,
        v.QEndTime,
        v.UserID,
        v.UserName,
        d.Direction,
        d.DirectionReason

    INTO #QSessionsScreening
    FROM warehouse.dbo.Episodes v WITH (NOLOCK)
	  LEFT JOIN Direction d ON d.EpisodeKey = v.EpisodeKey

    WHERE EXISTS (SELECT 1 FROM #Incidents i WHERE i.IncidentID = v.IncidentId)
	  AND Branch = 'Clinical Screening'

	----------------------------------------------------------------------------------------------------------------------
	-- Use the end time of the Questionnaire session to determine the time the above outcome was reached for the output row. 
	-- The session start time is still used to assign a later the Questionnaire session belongs to. 
	-- Union merge to follow, hence all fields included.
	----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #QActions;

    SELECT
        s.EpisodeKey AS EventPKEY,
        CAST('Q' AS varchar(20)) AS Source,

        l.IncidentDate,
        s.IncidentID,
        s.CallNumber,

        l.LevelID,
        l.LevelStartTime,
        l.LevelName,
        l.LevelStartCode,
        l.LevelStartCategory,

		-- Outcomes are not necessarily the last question but are relevant to when the Questionniare ends
		-- This time isn't used to assign belonging to a level
        s.QEndTime AS TimeOfAction,  

        CAST('Outcome' AS varchar(20)) AS ActionType,
        CAST('Q Outcome' AS varchar(255)) AS [Action],
		s.Direction AS OutcomeCode,
        s.DirectionReason AS OutcomeDescription,
		CAST(NULL AS varchar(50)) AS OutcomeType,
  		CAST(NULL AS varchar(50)) AS UpOrDownGrade,
		s.UserID,
        s.UserName

    INTO #QActions
    FROM #QSessionsScreening s
    JOIN #Levels l ON l.IncidentID = s.IncidentID  -- must be the same incident
       AND s.QStartTime >= l.LevelStartTime  -- session must have started after the level has started (to show belonging)
       AND (l.NextLevelStartTime IS NULL    -- account for no end time (see level table load for more information)
	    	OR s.QStartTime < l.NextLevelStartTime)  -- session must have started before the next level started

    WHERE s.QStartTime IS NOT NULL  -- almost impossible to be NULL if an episode exists but just in case

----------------------------------------------------------------------------------------------------------------------
-- Assessemnt Software actions
----------------------------------------------------------------------------------------------------------------------
-- Assessment starting is a performance indicator. Assessment outcome time is also helpful to know 
-- when an episode of assessment was complete. Many may be aborted so important to capture that. The actual outcome is
-- also helpful, though is presented as "000 - <name of outcome>" so has to be split.
----------------------------------------------------------------------------------------------------------------------

	DROP TABLE IF EXISTS #AssessmentCalls;

    SELECT
        c.CodeID,
        RIGHT(c.CaseNumber,7) AS CallNumber,
        c.Started,
        c.Ended,
		StartedLocal = CAST(c.Started AS datetime2),  -- these are needed so that the date time type in the join is the same (as assessment uses datetimeoffset)
		EndedLocal = CAST(c.Ended AS datetime2),      -- these are needed so that the date time type in the join is the same (as assessment uses datetimeoffset)
        c.UeerID,
        c.UserFirstName,
        c.AbortedAbortTypeText,
        LTRIM(RTRIM(LEFT(c.OutcomeText, CHARINDEX('-', c.OutcomeText) - 1))) AS OutcomeCode,
        LTRIM(RTRIM(SUBSTRING(c.OutcomeText, CHARINDEX('-', c.OutcomeText) + 1, LEN(c.OutcomeText)))) AS OutcomeDescription
    INTO #AssessmentCalls
    FROM warehouse.dbo.Assessments c WITH (NOLOCK)
	  WHERE EXISTS (SELECT 1 FROM #Incidents i
				    WHERE i.CallNumber = RIGHT(c.CaseNumber,7)
					AND CAST(c.Started AS datetime2)  < i.TimeStoppedOrClosed) -- Important. There are some assessment calls which were created before but started after the incident was closed

	----------------------------------------------------------------------------------------------------------------------
	-- Merging the two outcomes here prior to larger merge in results. 
	-- First is for the start of the assessment (Started). Created can occur when the call goes to an assessment queue so not truly a user action.
	-- This is used in the <performance metric> as an critical action (if others are not present)
	-- Second is for the assessment outcome time. Helpful for knowing the duration of the assessment episode and the time an outcome was reached. 
	-- Union merge to follow, hence all fields included.
	-- Assessment software uses <date time format with location code> - confirmed the times here account for DST
	----------------------------------------------------------------------------------------------------------------------
	   	 
	DROP TABLE IF EXISTS #AssessmentActions;

    SELECT
        CAST(lc.AssessID AS nvarchar) AS EventPKEY,   
        CAST('Assessment' AS varchar(20)) AS Source,

        l.IncidentDate,
        l.IncidentID,
        l.CallNumber,

        l.LevelID,
        l.LevelStartTime,
        l.LevelName,
        l.LevelStartCode,
        l.LevelStartCategory,

        CAST(lc.Started AS datetime2) AS TimeOfAction, 

        CAST('Assessment' AS varchar(20)) AS ActionType,
        CAST('Assessment Started' AS varchar(255)) AS [Action],
        CAST(NULL AS varchar(50)) AS OutcomeCode,
        CAST(NULL AS varchar(255)) AS OutcomeDescription,
		CAST(NULL AS varchar(50)) AS OutcomeType,
		CAST(NULL AS varchar(50)) AS UpOrDownGrade,
        lc.UserID AS UserID,
        lc.UserFirstName AS UserName

    INTO #AssessmentActions
    FROM #AssessmentCalls lc
    JOIN #Levels l
        ON l.CallNumber = lc.CallNumber
       AND lc.StartedLocal IS NOT NULL
       AND lc.StartedLocal >= l.LevelStartTime
       AND (l.NextLevelStartTime IS NULL 
			OR lc.StartedLocal < l.NextLevelStartTime)

    UNION ALL

	-- Outcome Action (including aborted if there is no outcome)
    SELECT
        CAST(lc.AssessmentID AS nvarchar) AS EventPKEY,  
        CAST('Assessment' AS varchar(20)) AS Source,

        l.IncidentDate,
		l.IncidentID,
        l.CallNumber,

        l.LevelID,
        l.LevelStartTime,
        l.LevelName,
        l.LevelStartCode,
        l.LevelStartCategory,

        CAST(lc.Ended aS datetime2) AS TimeOfAction,		--Assessment uses date time format with location code - confirmed time accounts for DST

        CAST('Outcome' AS varchar(20)) AS ActionType,
        CAST('Assessment Outcome' AS varchar(255)) AS [Action],

		-- Capture the end of an assessment, even if that assessment was aborted / abandoned during the call
		-- Filtered out later in reporting to ignore Aborted if looking for a patient outcome
        CASE WHEN lc.OutcomeCode IS NULL THEN 'Aborted' ELSE lc.OutcomeCode END AS OutcomeCode,
        CASE WHEN lc.OutcomeDescription IS NULL THEN lc.AbortedAbortTypeText ELSE lc.OutcomeDescription END AS OutcomeDescription,
		CAST(NULL AS varchar(50)) AS OutcomeType,
		CAST(NULL AS varchar(50)) AS UpOrDownGrade,
        lc.UserID AS UserID,
        lc.UserFirstName AS UserName
		
    FROM #AssessmentCalls lc
    JOIN #Levels l
        ON l.CallNumber = lc.CallNumber
		-- Assessment belongs to level it started on including the outcome
       AND lc.StartedLocal IS NOT NULL
       AND lc.StartedLocal >= l.LevelStartTime
       AND (l.NextLevelStartTime IS NULL 
			OR lc.StartedLocal < l.NextLevelStartTime)


----------------------------------------------------------------------------------------------------------------------
-- End of query
----------------------------------------------------------------------------------------------------------------------
-- Merge into the target table
----------------------------------------------------------------------------------------------------------------------

MERGE warehouse.dbo.Audit_Level_Actions AS tgt
USING ( 

	SELECT 
		EventPKEY, [Source], 
		IncidentDate, IncidentID, CallNumber,
		LevelID,  LevelStartTime, LevelName,
		LevelStartCode, LevelStartCategory,
		TimeOfAction, ActionType, [Action],	
		OutcomeCode, OutcomeDescription, OutcomeType,
		UpOrDownGrade, UserID, UserName
  
	FROM (
		SELECT * FROM #InternalActions
		UNION ALL
		SELECT * FROM #QActions
		UNION ALL
		SELECT * FROM #AssessmentActions
	) x

WHERE x.LevelID IS NOT NULL
  AND x.TimeOfAction IS NOT NULL

--ORDER BY CallNumber, LevelID, TimeOfAction   -- only for manual query

) AS SRC

ON  tgt.EventPKEY          = src.EventPKEY
AND tgt.LevelID            = src.LevelID
AND tgt.LevelStartTime     = src.LevelStartTime
AND tgt.[Action]           = src.[Action]

WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        EventPKEY, [Source], 
        IncidentDate, IncidentID, CallNumber,
        LevelID, LevelStartTime, LevelName, 
        LevelStartCode, LevelStartCategory,
        TimeOfAction, ActionType, [Action],	
        OutcomeCode, OutcomeDescription, OutcomeType,
        UpOrDownGrade, UserID, UserName
    )
    VALUES (
        src.EventPKEY, src.[Source], 
        src.IncidentDate, src.IncidentID, src.CallNumber,
        src.LevelID, src.LevelStartTime, src.LevelName, 
        src.LevelStartCode, src.LevelStartCategory,
        src.TimeOfAction, src.ActionType, src.[Action],	
        src.OutcomeCode, src.OutcomeDescription, src.OutcomeType,
        src.UpOrDownGrade, src.UserID, src.UserName
    );
 
 

