-- gist - some warehouse, file and fieldnames have been amended to protect anonymity <> are used where text is replaced

----------------------------------------------------------------------------------------------------------------------
 -- Title:	Questionnaire Responses Cleaner
 -- Desc:	Questionnaire question and responses cleaning process - Uses Cross Reference Table which contains aliases
 --         for common misspellings or duplicates. To create a cleaner data set for importing into Power BI.
 --         Multiple Response questions (semi-colon separated) are exploded to one row per response, 
 --         *** PRODUCES A SUB-RESPONSE GRANULARITY *** NOT ONE ROW PER QUESTION RESPONSE ***
 --         Replaces need to clean at Power Query / Power BI level.
 -- Job Ref: xxx000000 
 -- Used in: All PBI dashboards related to questionnaire responses
----------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------
-- Table load management
----------------------------------------------------------------------------------------------------------------------

	-- Declare date period for update to table
	DECLARE @StartDate DATE = DATEADD(DAY, -7, CAST(GETDATE() AS DATE));
	DECLARE @EndDate   DATE = CAST(GETDATE() AS DATE);
	-- First date is <first date>

----------------------------------------------------------------------------------------------------------------------
-- Branch
----------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS #EpisodeBranch;

	SELECT
		a.IncidentId,
		a.QuestionnaireSet,
		a.QuestionnaireCount,
		MAX(a.QuestionResponse) AS Branch
	INTO #EpisodeBranch
	FROM warehouse.dbo.<original-table> a WITH (NOLOCK)
	WHERE a.QuestionResponse IS NOT NULL
	  --  Currently only two Questionnare Sets have branches, this is the question that determines the branch
	  AND ((a.QuestionnaireSet = '<Set Name 1>' AND a.QuestionText = '<Set Name Selection>')
		      OR (a.QuestionnaireSet = '<Set Name 2>' AND a.QuestionText = '<Set Name Selection>'))
	GROUP BY
		a.IncidentId,
		a.QuestionnaireSet,
		a.QuestionnaireCount;

----------------------------------------------------------------------------------------------------------------------
-- Base 
----------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS #Base;

SELECT
        -- Main Questionnaire Information
        a.Questionnaire_Call_Data_PKEY,
        a.QuestionnaireSet,
        br.Branch,
        a.QuestionnaireCount,

		-- Episode key is generated the same in the session generator, [Call Number, Questionnaire Count as 2 digits, initials of Questionnaire Set name]
        CONCAT(RIGHT(a.IncidentId, 7),'.',RIGHT('00' + CAST(a.QuestionnaireCount AS varchar(2)), 2),'.',
              (SELECT STRING_AGG(LEFT(value, 1), '') FROM STRING_SPLIT(a.QuestionnaireSet, ' ') WHERE value <> '')) 
			  AS EpisodeKey,
        a.QuestionID,

    -- Take the new question text from the config file as the cleaned version, if it's there, if not keep it as it is
        CASE WHEN qc.TextNew IS NOT NULL AND qc.TextNew <> ''
             THEN qc.TextNew
             ELSE a.QuestionText
			 END AS QuestionTextClean,

        a.TimeResponded,
        a.UserID,
        a.PLID,
        a.IncidentId,
        a.DateCallCommenced,
        a.QuestionnaireCompleted,
        a.IdentityID,

    -- The status of the cleaning, identifies the cleaning to be done on this record (for reference)
		-- TextCurrent is the recorded question text and textnew is the change to be made
        CASE WHEN qm.TextCurrent IS NOT NULL 
			 THEN 1 ELSE 0 END AS Multi,
        CASE WHEN qx.TextCurrent IS NOT NULL 
      		 THEN 1 ELSE 0 END AS Exclude,
        CASE WHEN qc.TextNew IS NOT NULL AND qc.TextNew <> '' AND qc.TextNew <> a.QuestionText 
			 THEN 1 ELSE 0 END AS QuestionTextChanged,

        -- Originals
        a.QuestionText AS QuestionTextOriginal,
        a.QuestionResponse

	INTO #Base
	FROM warehouse.dbo.<original file> a WITH (NOLOCK)

	LEFT JOIN #EpisodeBranch br
	  ON br.IncidentId = a.IncidentId
	  -- All three identifiers (Questionnaire Set, Incident ID, Questionnaire Count) are required to isolate a single episode
	 AND br.QuestionnaireSet = a.QuestionnaireSet
	 AND br.QuestionnaireCount = a.QuestionnaireCount

	-- Question Change
	-- Looks for the trigger to say question id and text requires new text, check on Questionnaire Set as there are multiple and question text. 
	-- Checking if ID is there or not, if not then change all references to the question text
	OUTER APPLY (
		SELECT TOP (1) s.TextNew
		FROM warehouse.dbo.<changes table> s
		WHERE s.Type = 'Question'
		  AND s.Reason = 'Change'
		  AND s.QuestionnaireSet = a.QuestionnaireSet
		  AND s.TextCurrent = a.QuestionText
		  AND (s.QuestionID IS NULL OR s.QuestionID = a.QuestionID)
		ORDER BY CASE WHEN s.QuestionID IS NULL THEN 1 ELSE 0 END
	) qc

	-- Question Multi
	-- Checks for the multi response identifier, to use later to explode the responses
	OUTER APPLY (
		SELECT TOP (1) s.TextCurrent
		FROM warehouse.dbo.<changes table> s
		WHERE s.Type = 'Question'
		  AND s.Reason = 'Multi'
		  AND s.QuestionnaireSet = a.QuestionnaireSet
		  AND s.TextCurrent = a.QuestionText
		  AND (s.QuestionID IS NULL OR s.QuestionID = a.QuestionID)
		ORDER BY CASE WHEN s.QuestionID IS NULL THEN 1 ELSE 0 END
	) qm

	-- Question Exclude
	-- Checks for questions that are not needed in the reporting database to save space. Free text and redundant questions are not reported on
	OUTER APPLY (
		SELECT TOP (1) s.TextCurrent
		FROM warehouse.dbo.<changes table> s
		WHERE s.Type = 'Question'
		  AND s.Reason = 'Exclude'
		  AND s.TextCurrent = a.QuestionText
		  AND (s.QuestionnaireSet = a.QuestionnaireSet OR s.QuestionnaireSet IS NULL)
		  AND (s.QuestionID = a.QuestionID OR s.QuestionID IS NULL)
		ORDER BY -- So that the set or the id can pick up those that are identified first, then if not, the global one
			CASE WHEN s.QuestionnaireSet = a.QuestionnaireSet THEN 0 ELSE 1 END,
			CASE WHEN s.QuestionID = a.QuestionID THEN 0 ELSE 1 END
	) qx

	WHERE a.QuestionnaireSet IN ('Set 1', 'Set 2')
		  -- Some errors in the config for <Set 3> led to odd questions being presented. These are not valid so can be excluded
	  AND NOT (a.QuestionnaireSet = 'Set 3' AND a.QuestionID LIKE 'id%')
	  AND a.DateCallCommenced BETWEEN @StartDate AND @EndDate
	  AND qx.TextCurrent IS NULL  -- From this stage on we don't want any that are excluded - this is the indicator

----------------------------------------------------------------------------------------------------------------------
-- Explode the repsonse parts where the question is a multi response. Some will have 1 response, others will have many
----------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS #Exploded;

	SELECT
			b.*,
			j.[key] AS ResponsePartSeq,
			CASE WHEN b.Multi = 1 
				 THEN LTRIM(j.value)
				 ELSE LTRIM(b.QuestionResponse)
				 END AS ResponsePartOriginal
	INTO #Exploded
	FROM #Base b
	-- Explodes the responses as they are presented (they are later cleaned in the process below)
	-- This takes the resultant table down to "Response Part" Granularity
	OUTER APPLY (
		SELECT [key], value
		FROM OPENJSON(
				CASE WHEN b.Multi = 1
					 THEN '["' + REPLACE(STRING_ESCAPE(ISNULL(b.QuestionResponse,''),'json'),';','","') + '"]'
					 ELSE '["' + STRING_ESCAPE(ISNULL(b.QuestionResponse,''),'json') + '"]'
				END)
	) j;


----------------------------------------------------------------------------------------------------------------------
-- Make the changes to the responses now they have been exploded - checking against cleaning table for wording corrections
-- Final Output before loading to table
----------------------------------------------------------------------------------------------------------------------

DROP TABLE IF EXISTS #Final

	SELECT
        e.Questionnaire_Call_Data_PKEY,
        e.QuestionnaireSet,
        e.Branch,
        e.EpisodeKey,
        e.QuestionID,
        e.QuestionTextClean AS QuestionText,
        e.TimeResponded,

		-- Changing the responses where a change is required in the cleaning table
        CASE WHEN rc.TextNew IS NOT NULL AND rc.TextNew <> ''
             THEN rc.TextNew
             ELSE e.ResponsePartOriginal
			       END AS QuestionResponse,

        e.UserID,
        e.PLID,
        e.IncidentId,
        RIGHT(e.IncidentId,7) AS CallNumber,  -- Call number isn't stored anywhere so create it here
        e.DateCallCommenced,
        e.QuestionnaireCount,
        e.QuestionnaireCompleted,
        e.IdentityID,
        e.Multi AS IsMultiResponse,
        e.Exclude as IsExcluded,
        e.QuestionTextChanged,
        e.ResponsePartSeq,

		-- Identifying a response part change took place
        CASE WHEN rc.TextNew IS NOT NULL
              AND rc.TextNew <> ''
              AND rc.TextNew <> e.ResponsePartOriginal
             THEN 1 
			 ELSE 0 
			 END AS ResponseTextChanged,

		-- keep original file name as used in the existing table (prior to change to cleaning table)
        e.QuestionTextOriginal AS QuestionTextRaw, 
        e.QuestionResponse AS QuestionResponseRaw,  
        e.ResponsePartOriginal AS ResponsePartRaw

	INTO #Final
	FROM #Exploded e

	-- For the changes required to the response text
	OUTER APPLY (
		SELECT TOP (1) s.TextNew
		FROM warehouse.dbo.<changes_table> s
		WHERE s.Type = 'Response'
		  AND s.Reason = 'Change'
		  AND s.TextCurrent = e.ResponsePartOriginal
		  -- To capture "global" changes which aren't specific to a particular set (helpful when the patterns are repeated across sets)
		  AND (s.QuestionnaireSet = e.QuestionnaireSet OR s.QuestionnaireSet IS NULL)
		-- Capture the match first, if not go global
		ORDER BY CASE WHEN s.QuestionnaireSet = e.QuestionnaireSet THEN 0 ELSE 1 END
	) rc

	WHERE e.ResponsePartOriginal IS NOT NULL
	  AND e.ResponsePartOriginal <> '';

	  	   
--------------------------------------------------------------------------------------------------------------------
 --Refresh target table
----------------------------------------------------------------------------------------------------------------------

	MERGE warehouse.dbo.Q_Cleaned AS tgt
	USING (
		SELECT
			Questionnaire_Call_Data_PKEY, QuestionnaireSet, Branch, EpisodeKey, QuestionID, QuestionText, TimeResponded,
			QuestionResponse, UserID, PLID, IncidentId, DateCallCommenced, QuestionnaireCount, QuestionnaireCompleted,
			IdentityID, IsMultiResponse, IsExcluded, QuestionTextChanged, ResponsePartSeq,
			ResponseTextChanged, QuestionTextRaw, QuestionResponseRaw, ResponsePartRaw
		FROM #Final
	) AS src
		-- Table is ResponsePart granularity, there are duplicate Questionnaire_Call_Data_PKEYs
		ON  tgt.Questionnaire_Call_Data_PKEY = src.Questionnaire_Call_Data_PKEY
		AND tgt.ResponsePartSeq = src.ResponsePartSeq

	WHEN MATCHED AND (
		   ISNULL(tgt.QuestionnaireSet, '') <> ISNULL(src.QuestionnaireSet, '')
		OR ISNULL(tgt.Branch, '') <> ISNULL(src.Branch, '')
		OR ISNULL(tgt.EpisodeKey, '') <> ISNULL(src.EpisodeKey, '')
		OR ISNULL(tgt.QuestionID, '') <> ISNULL(src.QuestionID, '')
		OR ISNULL(tgt.QuestionText, '') <> ISNULL(src.QuestionText, '')
		OR ISNULL(tgt.TimeResponded, '19000101') <> ISNULL(src.TimeResponded, '19000101')
		OR ISNULL(tgt.QuestionResponse, '') <> ISNULL(src.QuestionResponse, '')
		OR ISNULL(tgt.UserID, '') <> ISNULL(src.UserID, '')
		OR ISNULL(tgt.PLID, '') <> ISNULL(src.PLID, '')
		OR ISNULL(tgt.IncidentId, -1) <> ISNULL(src.IncidentId, -1)
		OR ISNULL(tgt.DateCallCommenced, '19000101') <> ISNULL(src.DateCallCommenced, '19000101')
		OR ISNULL(tgt.QuestionnaireCount, -1) <> ISNULL(src.QuestionnaireCount, -1)
		OR ISNULL(tgt.QuestionnaireCompleted, '19000101') <> ISNULL(src.QuestionnaireCompleted, '19000101')
		OR ISNULL(tgt.IsMultiResponse, 0) <> ISNULL(src.IsMultiResponse, 0)
		OR ISNULL(tgt.IsExcluded, 0) <> ISNULL(src.IsExcluded, 0)
		OR ISNULL(tgt.QuestionTextChanged, 0) <> ISNULL(src.QuestionTextChanged, 0)
		OR ISNULL(tgt.ResponseTextChanged, 0) <> ISNULL(src.ResponseTextChanged, 0)
		OR ISNULL(tgt.QuestionTextRaw, '') <> ISNULL(src.QuestionTextRaw, '')
		OR ISNULL(tgt.QuestionResponseRaw, '') <> ISNULL(src.QuestionResponseRaw, '')
		OR ISNULL(tgt.ResponsePartRaw, '') <> ISNULL(src.ResponsePartRaw, '')
	)
	THEN UPDATE SET
		  tgt.QuestionnaireSet = src.QuestionnaireSet
		, tgt.Branch = src.Branch
		, tgt.EpisodeKey = src.EpisodeKey
		, tgt.QuestionID = src.QuestionID
		, tgt.QuestionText = src.QuestionText
		, tgt.TimeResponded = src.TimeResponded
		, tgt.QuestionResponse = src.QuestionResponse
		, tgt.UserID = src.UserID
		, tgt.PLID = src.PLID
		, tgt.IncidentId = src.IncidentId
		, tgt.DateCallCommenced = src.DateCallCommenced
		, tgt.QuestionnaireCount = src.QuestionnaireCount
		, tgt.QuestionnaireCompleted = src.QuestionnaireCompleted
		, tgt.IsMultiResponse = src.IsMultiResponse
		, tgt.IsExcluded = src.IsExcluded
		, tgt.QuestionTextChanged = src.QuestionTextChanged
		, tgt.ResponseTextChanged = src.ResponseTextChanged
		, tgt.QuestionTextRaw = src.QuestionTextRaw
		, tgt.QuestionResponseRaw = src.QuestionResponseRaw
		, tgt.ResponsePartRaw = src.ResponsePartRaw

	WHEN NOT MATCHED BY TARGET
	THEN INSERT (
		  Questionnaire_Call_Data_PKEY, QuestionnaireSet, Branch, EpisodeKey, QuestionID, QuestionText, TimeResponded,
		  QuestionResponse, UserID, PLID, IncidentId, DateCallCommenced, QuestionnaireCount, QuestionnaireCompleted,
		  IdentityID, IsMultiResponse, IsExcluded, QuestionTextChanged, ResponsePartSeq,
		  ResponseTextChanged, QuestionTextRaw, QuestionResponseRaw, ResponsePartRaw
	)
	VALUES (
		  src.Questionnaire_Call_Data_PKEY, src.QuestionnaireSet, src.Branch, src.EpisodeKey, src.QuestionID, src.QuestionText, src.TimeResponded,
		  src.QuestionResponse, src.UserID, src.PLID, src.IncidentId, src.DateCallCommenced, src.QuestionnaireCount, src.QuestionnaireCompleted,
		  src.IdentityID, src.IsMultiResponse, src.IsExcluded, src.QuestionTextChanged, src.ResponsePartSeq,
		  src.ResponseTextChanged, src.QuestionTextRaw, src.QuestionResponseRaw, src.ResponsePartRaw
	);




