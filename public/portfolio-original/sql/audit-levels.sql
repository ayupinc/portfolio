-- git notes - table and field names have been changed to preserve anonymitity. <> represent placeholder text for this purpose

----------------------------------------------------------------------------------------------------------------------
 -- Title:    Audit Level Changes
 -- Desc:     A clean reflection of level changes within the Audit table. Reviews level change and call passing 
 -- 		      anomalies to idenitfy true level changes and tidy naming and presentation for use in reporting. 
 --				    Associated with Audit Level Actions which describes actions and activities linked to each level.
 --				    ** Used in performance reporting ** Amend with caution **
 -- Job Ref:	xxx0000
 -- Used in:	PBI dashboards related to clinical contact centres, performance and activity reports.
 -- Notes:		682,429 records, 33sec run time.
----------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------
-- Start and end dates for the table update process (90 days to capture any changes)
----------------------------------------------------------------------------------------------------------------------

DECLARE @StartDate DATE = DATEADD(DAY, -90, CAST(GETDATE() AS DATE));
DECLARE @EndDate   DATE = CAST(GETDATE() AS DATE);

----------------------------------------------------------------------------------------------------------------------
-- Identify anomalies and fix submission counts / tidy level names
----------------------------------------------------------------------------------------------------------------------

-- Get the Time and SubmittedCount of all Call_Passed or Automatically_Added events
-- To match later with the time and submitted count of the Level Changes above

DROP TABLE IF EXISTS #CallPassingSubmissions;

    SELECT
        a.IncidentID,
        a.TimeOfAction,
        MAX(a.SubmittedCount) AS CallPassingSubmittedCount
    INTO #CallPassingSubmissions
    FROM warehouse.dbo.Audit a WITH (NOLOCK)
    WHERE a.[Action] IN ('Call_Passed', 'Automatically_Added')
    GROUP BY a.IncidentID, a.TimeOfAction;

-- Get the first time the incident is passed/added (queue entry)
-- Used later to ignore pre-queue Level Changes where SubmittedCount = 0

DROP TABLE IF EXISTS #FirstQueueEntry;

    SELECT
        s.IncidentID,
        MIN(s.TimeOfAction) AS FirstQueueEntryTime
    INTO #FirstQueueEntry
    FROM #CallPassingSubmissions s
    GROUP BY s.IncidentID;

-- When calls are automatically removed, either by timeout or ECNS returning an outcome followed by a return to EMS
-- The Audit table includes a level change to remove the call but can use the wrong level (latest Call Submitted, not latest level)
-- Build this Automatically Removed list to match to Level Change and reject the level change later

DROP TABLE IF EXISTS #AutoRemoved;

    SELECT DISTINCT
        a.IncidentID,
        a.TimeOfAction
    INTO #AutoRemoved
    FROM warehouse.dbo.Audit a WITH (NOLOCK)
    WHERE a.[Action] = 'Automatically_Removed'

-- Correct Levels to provide more accurate Submission Counts (and tidy the names of the levels for easier reporting)
-- Using the temp tables above fix the issue with the erroneous Level 0, and change the names of the levels to be more readable
-- Limit the list back to a given incident date (<start date> is when screening and the use of Accepted / In Progress as an Assessment identifier began and is also used in "Time to Remote Clinical Assessment".
-- Exclude TEST calls from the list (keep all other calls as at this stage, unverified calls are applicable as activity at this point).

DROP TABLE IF EXISTS #AuditFixed;

    SELECT
        a.*,
        CASE a.[Action] WHEN 'Call_Passed' THEN 0 WHEN 'Automatically_Added' THEN 0 WHEN 'Level Changed' THEN 1 ELSE 2 END AS ActionOrder,
		CASE WHEN a.[Action] = 'Level Changed' THEN a.UserID END AS LevelChangeUserID,

		-- Calls that land at the same time as the level change have a level number from the "previous" level or 0 if it was the first.
		-- Add 1 to the submission count only for these examples, to match the submission counts for actions in the rest of the level they truly belong to
		-- Transplant the SubmittedCount from the queued event at the same timestamp

        CASE WHEN a.[Action] = 'Level Changed'
              AND a.SubmittedCount = 0
              AND s.CallPassingSubmittedCount IS NOT NULL
              AND s.CallPassingSubmittedCount > 0
             THEN s.CallPassingSubmittedCount
             ELSE a.SubmittedCount
        END AS LevelSubmittedCountFixed,

		-- Many level changes have a NULL level, this can be an error or a deliberate attempt to place for all clinicians. Change to "All Levels" to identify them as such and avoid [NULL] issues later.
		-- Any clinician can see the "All Levels" calls on the queue.
		-- Also tidy up the level names for ease of display and full name reporting (will need updating if new levels are created).

        CASE WHEN a.[Action] = 'Level Changed' AND a.LevelDescription IS NULL THEN 'All Levels'
             WHEN a.levelDescription = '<Clinician type 1>' THEN '<ct1>'
             WHEN a.LevelDescription = '<Clinician Type 2>' THEN '<ct2>'
             WHEN a.LevelDescription = '<Clinician Type 3>' THEN '<ct3>'
             WHEN a.LevelDescription = '<Clinician Type 4>' THEN '<ct4>'
			       WHEN a.LevelDescription = '<Clinician Type 5>' THEN '<ct5>'
			       WHEN a.LevelDescription = '<Clinician Type 6>' THEN '<ct6>'
             ELSE a.LevelDescription
        END AS LevelNameFixed,

        CASE WHEN a.[Action] = 'Level Changed' AND a.LevelDescription IS NULL THEN 'All Levels'
             WHEN a.levelDescription = '<Clinician type 1>' THEN '<ct1-full>'
             WHEN a.LevelDescription = '<Clinician Type 2>' THEN '<ct2-full>'
             WHEN a.LevelDescription = '<Clinician Type 3>' THEN '<ct3-full>'
             WHEN a.LevelDescription = '<Clinician Type 4>' THEN '<ct4-full>'
			       WHEN a.LevelDescription = '<Clinician Type 5>' THEN '<ct5-full>'
			       WHEN a.LevelDescription = '<Clinician Type 6>' THEN '<ct6-full>'
             ELSE a.LevelDescription
        END AS LevelNameFixedFull,
		
		i.IncidentDate,  -- For refining the chosen incidents, by the date they started, rather than any other date time
		-- To support later filtering and understanding of incident counts based on the Level Changes
		CASE WHEN i.VerifiedIncident = 'Y' THEN 'Yes' WHEN i.VerifiedIncident = 'N' THEN 'No' END AS VerifiedIncident, -- For later filtering and comparison to other reports
		i.IncidentStopCodeDescription  -- To identify the reason for unverified only (DUPL, ERROR, etc)

    INTO #AuditFixed
    FROM waarehouse.dbo.Audit a WITH (NOLOCK)
    JOIN warehouse.dbo.Incident i WITH (NOLOCK) ON i.IncidentID = a.IncidentID
    LEFT JOIN #CallPassingSubmissions s ON s.IncidentID = a.IncidentID AND s.TimeOfAction = a.TimeOfAction
    --WHERE i.IncidentDate >= '<start date>'
    WHERE i.IncidentDate BETWEEN @StartDate AND @EndDate  
	  AND ISNULL(i.IncidentStopCode, '') <> 'TEST';

----------------------------------------------------------------------------------------------------------------------
-- Identify legitimate level changes and derive LevelCountInIncident/Submission
----------------------------------------------------------------------------------------------------------------------

-- Review the sequence of actions in the incident to see which actions are in which level now that they are more clearly identified

DROP TABLE IF EXISTS #AuditFixedLevelChangeIndicators;

    SELECT
        CallAuditPKEY,
        IncidentID,
        SubmittedCount,
        LevelSubmittedCountFixed,
        TimeOfAction,
        ActionOrder,
        LevelDescription,
        LevelNameFixed,

		-- Sequence by submission to check for new levels when a call is resubmitted to queue
        ROW_NUMBER() OVER (PARTITION BY IncidentID, LevelSubmittedCountFixed ORDER BY TimeOfAction, ActionOrder, CallAuditPKEY) AS LevelChangeSequenceInSubmission,
    -- Sequence by incident to check for new levels when call first passed
		    ROW_NUMBER() OVER (PARTITION BY IncidentID ORDER BY TimeOfAction, ActionOrder, CallAuditPKEY) AS LevelChangeSequenceInIncident,

		-- Find the previous level change in the incident (any corrected submission) 
        LAG(LevelNameFixed) OVER (PARTITION BY IncidentID ORDER BY TimeOfAction, ActionOrder, CallAuditPKEY) AS PreviousLevelInIncident,
		-- Find the previous corrected submission number (incident-wide) to detect hard re-entry to the queue (Pass) even when level is same
        LAG(LevelSubmittedCountFixed) OVER (PARTITION BY IncidentID ORDER BY TimeOfAction, ActionOrder, CallAuditPKEY) AS PreviousSubmittedCountInIncident

    INTO #AuditFixedLevelChangeIndicators
    FROM #AuditFixed
    WHERE [Action] = 'Level Changed';

-- Add the level change markers to the rows to be able to identify the level change taking place

DROP TABLE IF EXISTS #AuditFixedLevelChangeSequence;

    SELECT
        f.*,
        l.LevelChangeSequenceInSubmission,
        l.LevelChangeSequenceInIncident,
        l.PreviousLevelInIncident,
        l.PreviousSubmittedCountInIncident

    INTO #AuditFixedLevelChangeSequence
    FROM #AuditFixed f
    LEFT JOIN #AuditFixedLevelChangeIndicators l ON l.CallAuditPKEY = f.CallAuditPKEY;

-- Examine the interactions between the levels to find the true level changes and mark the row as such 

DROP TABLE IF EXISTS #AuditFixedLevelChanges;

    SELECT
        f.*,

        CASE
      -- Flag only when this is a Level Change
			      WHEN [Action] <> 'Level Changed' THEN NULL
			-- If there is a NULL even after NULLS in level changes are accounted for then 0 - not a level change
            WHEN LevelNameFixed IS NULL THEN 0
			-- Exclude a level change without the call ever being passed to the queue 
            WHEN SubmittedCount = 0 AND q.FirstQueueEntryTime IS NULL THEN 0  
			-- Exclude those where the level change was much earlier than the first [Call Passed] or [Automatically Added]	
            WHEN f.LevelSubmittedCountFixed = 0 AND q.FirstQueueEntryTime IS NOT NULL AND f.TimeOfAction < q.FirstQueueEntryTime THEN 0  
			-- When the Level Change occurs at the same time as an Automatically Removed it is there just for that so do not count it as a true place to queue for clinicians
			WHEN ar.IncidentID IS NOT NULL THEN 0

			-- Only for the cases where the level was at submission 0 but was changed to 1 because it was immediately before the call passing at submission 1
            WHEN SubmittedCount = 0 AND LevelSubmittedCountFixed = 1 THEN 1
			 -- First level-change after incident is created is always a true level change
            WHEN LevelChangeSequenceInIncident = 1 THEN 1
			-- First level-change after (re)submission is always a new level as the call is being passed (back) into the queue			 
            WHEN LevelChangeSequenceInSubmission = 1 THEN 1
			-- Only count level changes from a different level - ignore in-level level changes.
            WHEN PreviousLevelInIncident <> LevelNameFixed THEN 1
            ELSE 0
        END AS LevelChangeFlagWithinIncident,

        CASE
            WHEN [Action] <> 'Level Changed' THEN NULL
            WHEN LevelNameFixed IS NULL THEN 'Reject: Level Name (Fixed) is NULL'
            WHEN SubmittedCount = 0 AND q.FirstQueueEntryTime IS NULL THEN 'Reject: Level change at submission 0 but no queue entry exists'
            WHEN f.LevelSubmittedCountFixed = 0 AND q.FirstQueueEntryTime IS NOT NULL AND f.TimeOfAction < q.FirstQueueEntryTime THEN 'Reject: Early level change before first queue entry (SubmittedCountFixed=0)'
			      WHEN ar.IncidentID IS NOT NULL THEN 'Reject: Level change for Automatically Removed'
            WHEN SubmittedCount = 0 AND LevelSubmittedCountFixed = 1 THEN 'Include: Submission 0 adjusted to 1 (immediately before queue entry)'
            WHEN LevelChangeSequenceInIncident = 1 THEN 'Include: First level change in incident'
            WHEN LevelChangeSequenceInSubmission = 1 THEN 'Include: First level change in submission'
            WHEN PreviousLevelInIncident <> LevelNameFixed THEN 'Include: Level different to previous'
            ELSE 'Reject: Same level as previous'
        END AS LevelChangeReasonWithinIncident

    INTO #AuditFixedLevelChanges
    FROM #AuditFixedLevelChangeSequence f
    LEFT JOIN #FirstQueueEntry q ON q.IncidentID = f.IncidentID
	  LEFT JOIN #AutoRemoved ar ON ar.IncidentID = f.IncidentID AND ar.TimeOfAction = f.TimeOfAction;

-- Count the true level changes for a running total in each incident and each submission
-- Helps with identifying the reasons that levels changed and see how many times a level changed within a single submission

DROP TABLE IF EXISTS #AuditFixedLevelChangeCount;

    SELECT
        f.*,
        SUM(CASE WHEN f.[Action] = 'Level Changed' THEN ISNULL(f.LevelChangeFlagWithinIncident,0) ELSE 0 END)
            OVER (PARTITION BY f.IncidentID ORDER BY f.TimeOfAction, f.ActionOrder, f.CallAuditPKEY ROWS UNBOUNDED PRECEDING) AS LevelCountInIncident,

        SUM(CASE WHEN f.[Action] = 'Level Changed' THEN ISNULL(f.LevelChangeFlagWithinIncident,0) ELSE 0 END)
            OVER (PARTITION BY f.IncidentID, f.LevelSubmittedCountFixed ORDER BY f.TimeOfAction, f.ActionOrder, f.CallAuditPKEY ROWS UNBOUNDED PRECEDING) AS LevelCountInSubmission

    INTO #AuditFixedLevelChangeCount
    FROM #AuditFixedLevelChanges f;

----------------------------------------------------------------------------------------------------------------------
-- Prepare the output to read all level change data, not just those that are included - enabling links to Audit
----------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS #LevelChangeEvents;

	SELECT
		-- Incident
		CAST(f.IncidentDate AS date) AS IncidentDate,
		f.IncidentID,
		RIGHT(f.IncidentID,7) AS CallNumber,

		-- Level change detail (for included level changes)
		CASE WHEN f.LevelChangeFlagWithinIncident = 1
			 THEN CONCAT(RIGHT(f.IncidentID,7), '-', f.LevelCountInIncident)
			 END AS LevelID, -- will only show for included levels, rejected will be blank
		f.LevelNameFixed AS LevelName,
		f.TimeOfAction AS LevelStartTime,
		NULLIF(CONCAT(f.DespatchCode, f.DespatchCodeSuffix), '') AS LevelStartCode,
		f.DespatchCodeOrgColour AS LevelStartCategory,
		f.LevelChangeUserID,

		-- Interactions and relationships with other levels. Null while we are at 'all level changes' position as would use non-legitimate levels
		-- Overwrite with outcomes only for legitimate level changes later in the UPDATE below (non legitimate chagnes will stay as null)
		CAST(NULL AS varchar(100)) AS PreviousLevelEpisode,
		CAST(NULL AS varchar(3)) AS ScreeningLevelPrior,
		CAST(NULL AS datetime) AS NextLevelStartTime,

		-- Incident information
		f.VerifiedIncident,
		f.IncidentStopCodeDescription,

		-- Level change information
		f.LevelChangeReasonWithinIncident,
		f.LevelChangeFlagWithinIncident,  -- Key field to filter only legitimate level changes in subsequent reports
		f.LevelNameFixedFull,
		f.LevelDescription AS OriginalLevelDescription,
		f.SubmittedCount AS OriginalSubmittedCount,
		f.LevelSubmittedCountFixed AS Submission,
		CASE WHEN f.LevelChangeFlagWithinIncident = 1 THEN f.LevelCountInIncident END AS LevelInIncident,
		CASE WHEN f.LevelChangeFlagWithinIncident = 1 THEN f.LevelCountInSubmission END AS LevelInSubmission,
    
		-- Enable a join back to Audit table in later queries
		f.CallAuditPKEY

	INTO #LevelChangeEvents
	FROM #AuditFixedLevelChangeCount f
	WHERE f.[Action] = 'Level Changed';


-- Get the before and after detail only for level changes that were legitimate only (so we don't use / include non-legitimate levels)

DROP TABLE IF EXISTS #LevelEpisodes_EpisodeFields;

	SELECT
		f.CallAuditPKEY,

		-- Previous "included" level episode (not raw audit level)
		LAG(f.LevelNameFixed) OVER (
			PARTITION BY f.IncidentID
			ORDER BY f.TimeOfAction, f.CallAuditPKEY
			) AS PreviousLevelEpisode,

		-- Next "included" level episode start time (the proxy level end time)
		LEAD(f.TimeOfAction) OVER (
			PARTITION BY f.IncidentID
			ORDER BY f.TimeOfAction, f.CallAuditPKEY
			) AS NextLevelStartTime,

		-- Was screening prior to this "included" episode (within the incident)
		ISNULL(
			MAX(CASE WHEN f.LevelNameFixed = 'Screening' THEN 'Yes' ELSE 'No' END) OVER (
				PARTITION BY f.IncidentID
				ORDER BY f.TimeOfAction, f.CallAuditPKEY
				ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
			), 'No'
		) AS ScreeningLevelPrior

	INTO #LevelEpisodes_EpisodeFields
	FROM #AuditFixedLevelChangeCount f
	WHERE f.[Action] = 'Level Changed'
	  AND f.LevelChangeFlagWithinIncident = 1 -- Only calculate these for the legitimate level changes

	-- Now overwrite the NULLS from the previous temp table with these interaction events, only for each legitimate row
	-- Using UPDATE process as an alternative to creating another temp table
	UPDATE e
	SET
		e.PreviousLevelEpisode = x.PreviousLevelEpisode,
		e.NextLevelStartTime = x.NextLevelStartTime,
		e.ScreeningLevelPrior = x.ScreeningLevelPrior
	FROM #LevelChangeEvents e
	JOIN #LevelEpisodes_EpisodeFields x ON x.CallAuditPKEY = e.CallAuditPKEY;


----------------------------------------------------------------------------------------------------------------------
-- Merge into the table
----------------------------------------------------------------------------------------------------------------------

MERGE warehouse.dbo.Audit_Level_Changes AS target
USING (
    SELECT
        IncidentDate, IncidentID, CallNumber, LevelID,
        LevelName, LevelStartTime, LevelStartCode, LevelStartCategory, LevelChangeUserID,
        PreviousLevelEpisode, ScreeningLevelPrior, NextLevelStartTime,
        LevelChangeReasonWithinIncident, LevelChangeFlagWithinIncident,
        LevelNameFixedFull, VerifiedIncident, IncidentStopCodeDescription,
        OriginalLevelDescription, OriginalSubmittedCount,
        Submission, LevelInIncident, LevelInSubmission, CallAuditPKEY
    FROM #LevelChangeEvents
) AS src
    ON target.CallAuditPKEY = src.CallAuditPKEY

WHEN MATCHED AND (
        ISNULL(target.IncidentDate, '19000101') <> ISNULL(src.IncidentDate, '19000101')
     OR ISNULL(target.IncidentID, '') <> ISNULL(src.IncidentID, '')
     OR ISNULL(target.CallNumber, '') <> ISNULL(src.CallNumber, '')
     OR ISNULL(target.LevelID, '') <> ISNULL(src.LevelID, '')
     OR ISNULL(target.LevelName, '') <> ISNULL(src.LevelName, '')
     OR ISNULL(target.LevelStartTime, '19000101') <> ISNULL(src.LevelStartTime, '19000101')
     OR ISNULL(target.LevelStartCode, '') <> ISNULL(src.LevelStartCode, '')
     OR ISNULL(target.LevelStartCategory, '') <> ISNULL(src.LevelStartCategory, '')
     OR ISNULL(target.LevelChangeUserID, '') <> ISNULL(src.LevelChangeUserID, '')
     OR ISNULL(target.PreviousLevelEpisode, '') <> ISNULL(src.PreviousLevelEpisode, '')
     OR ISNULL(target.ScreeningLevelPrior, '') <> ISNULL(src.ScreeningLevelPrior, '')
     OR ISNULL(target.NextLevelStartTime, '19000101') <> ISNULL(src.NextLevelStartTime, '19000101')
     OR ISNULL(target.LevelChangeReasonWithinIncident, '') <> ISNULL(src.LevelChangeReasonWithinIncident, '')
     OR ISNULL(target.LevelChangeFlagWithinIncident, -1) <> ISNULL(src.LevelChangeFlagWithinIncident, -1)
     OR ISNULL(target.LevelNameFixedFull, '') <> ISNULL(src.LevelNameFixedFull, '')
     OR ISNULL(target.VerifiedIncident, '') <> ISNULL(src.VerifiedIncident, '')
     OR ISNULL(target.IncidentStopCodeDescription, '') <> ISNULL(src.IncidentStopCodeDescription, '')
     OR ISNULL(target.OriginalLevelDescription, '') <> ISNULL(src.OriginalLevelDescription, '')
     OR ISNULL(target.OriginalSubmittedCount, -1) <> ISNULL(src.OriginalSubmittedCount, -1)
     OR ISNULL(target.Submission, -1) <> ISNULL(src.Submission, -1)
     OR ISNULL(target.LevelInIncident, -1) <> ISNULL(src.LevelInIncident, -1)
     OR ISNULL(target.LevelInSubmission, -1) <> ISNULL(src.LevelInSubmission, -1)
)
THEN UPDATE SET
        target.IncidentDate = src.IncidentDate,
        target.IncidentID = src.IncidentID,
        target.CallNumber = src.CallNumber,
        target.LevelID = src.LevelID,
        target.LevelName = src.LevelName,
        target.LevelStartTime = src.LevelStartTime,
        target.LevelStartCode = src.LevelStartCode,
        target.LevelStartCategory = src.LevelStartCategory,
        target.LevelChangeUserID = src.LevelChangeUserID,
        target.PreviousLevelEpisode = src.PreviousLevelEpisode,
        target.ScreeningLevelPrior = src.ScreeningLevelPrior,
        target.NextLevelStartTime = src.NextLevelStartTime,
        target.LevelChangeReasonWithinIncident = src.LevelChangeReasonWithinIncident,
        target.LevelChangeFlagWithinIncident = src.LevelChangeFlagWithinIncident,
        target.LevelNameFixedFull = src.LevelNameFixedFull,
        target.VerifiedIncident = src.VerifiedIncident,
        target.IncidentStopCodeDescription = src.IncidentStopCodeDescription,
        target.OriginalLevelDescription = src.OriginalLevelDescription,
        target.OriginalSubmittedCount = src.OriginalSubmittedCount,
        target.Submission = src.Submission,
        target.LevelInIncident = src.LevelInIncident,
        target.LevelInSubmission = src.LevelInSubmission

WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        IncidentDate, IncidentID, CallNumber, LevelID,
        LevelName, LevelStartTime, LevelStartCode, LevelStartCategory, LevelChangeUserID,
        PreviousLevelEpisode, ScreeningLevelPrior, NextLevelStartTime,
        LevelChangeReasonWithinIncident, LevelChangeFlagWithinIncident,
        LevelNameFixedFull, VerifiedIncident, IncidentStopCodeDescription,
        OriginalLevelDescription, OriginalSubmittedCount,
        Submission, LevelInIncident, LevelInSubmission, CallAuditPKEY
    )
    VALUES (
        src.IncidentDate, src.IncidentID, src.CallNumber, src.LevelID,
        src.LevelName, src.LevelStartTime, src.LevelStartCode, src.LevelStartCategory, src.LevelChangeUserID,
        src.PreviousLevelEpisode, src.ScreeningLevelPrior, src.NextLevelStartTime,
        src.LevelChangeReasonWithinIncident, src.LevelChangeFlagWithinIncident,
        src.LevelNameFixedFull, src.VerifiedIncident, src.IncidentStopCodeDescription,
        src.OriginalLevelDescription, src.OriginalSubmittedCount,
        src.Submission, src.LevelInIncident, src.LevelInSubmission, src.CallAuditPKEY
    );
