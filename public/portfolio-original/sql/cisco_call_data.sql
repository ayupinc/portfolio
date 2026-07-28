 --=============================================================================================================
 --Description: Replace third party table following new Cisco switchboard
 --Job Ref:		xxx000
 --Version:		2a.4 
 --=============================================================================================================
 --Overview:    Gathers data from cisco native files and processes to provide new call table
 --Notes:		** This view was converted to a step of the ETL process and later to a table creation procedure **
 --Used in:		PBI dashboards, SSRS reports on telephony numbers and agent activity
 --=============================================================================================================

--==============================================================================================================
--  In two halves, inbound routed calls (first segment) takes details of actions on each call from the 
--  	Termination Call Detail table and marries them to the definitive source of routed calls, the 
--      Route Call Detail table using the RouterCallKeyDay and RouterCallKey as the key to each entry.
   
--  Specific actions on Termination Call Detail (TCD) are linked to a Peripheral Call Type (PCT) and a
--      Call Disposition (CD) which are identified on each segment of the call as it is processed and recorded
--      in TCD. While there are several entries for each routed call the ones captured below are relevant to  
--      times and actions to populate this table. Documentation explaining the PCT and CD combinations is available.

--	TCDCallSummary draws the relevant times and durations from each relevant segment in TCD. 

--	Dialled calls (second segment) takes a single line from the Termination Call Detail table per call as this is 
--		how that table is organised. Dialled calls are not part of Route Call Detials table and are tracked only in 
--		Termination Call Detail (TCD).
--==============================================================================================================

----------------------------------------------------------------------------------------------------------------
-- Capture Termination Call Detail data for use in the routed calls segment
----------------------------------------------------------------------------------------------------------------

WITH TCDCallSummary AS (
    SELECT 
		CONCAT(RouterCallKeyDay, RouterCallKey) AS id,  -- set the call key identifier - the combination is unique
		MIN(DATEADD(MINUTE, -TimeZone, StartDateTimeUTC)) AS StartDateTime,
		MAX(DATEADD(MINUTE, -TimeZone, CallTerminatedDateTimeUTC)) AS EndDateTime,
		MIN(CASE WHEN CallDispositionFlag = 1 AND PeripheralCallType = 2 THEN AgentSessionID END) AS AgentSessionID,  -- To tie the session ID to the original answered call - may be worth calling this FirstAgentSessionID
		MIN(CASE WHEN CallDispositionFlag = 1 AND PeripheralCallType = 2 THEN AgentSkillTargetID END) AS AgentSkillTargetID,  -- To tie the session ID to the original answered call - may be worth calling this FirstAgentSkillTargetID
		MIN(CASE WHEN CallDispositionFlag = 1 AND PeripheralCallType = 2 THEN DATEADD(MINUTE, -TimeZone, AnsweredDateTimeUTC) END) AS AnswerDateTime,
		
		-- Sum of delay time
        SUM(CASE 
            WHEN PeripheralCallType = 1 AND CallDisposition = 13 THEN DelayTime
			WHEN PeripheralCallType = 43 AND CallDisposition IN (2, 13) THEN DelayTime
            ELSE 0 
        END) AS DelaySec,

		 -- Sum of queue time
		SUM(CASE 
			WHEN PeripheralCallType = 43 AND CallDisposition IN (2, 13) THEN LocalQTime
            ELSE 0 
        END) AS QueueSec,
		
		-- Sum of ring time to first agent
		SUM(CASE 
            WHEN PeripheralCallType = 2 AND CallDisposition IN (3, 6, 7, 13, 19, 26, 28, 29, 30) THEN RingTime
            ELSE 0 
        END) AS RingSec,

        -- Sum of talk time with first agent
		SUM(CASE 
            WHEN CallDispositionFlag = 1 AND PeripheralCallType = 2 AND AnsweredDateTimeUTC IS NOT NULL THEN TalkTime
            ELSE 0 
        END) AS TalkSec,

		-- Sum of hold time with first agent
		SUM(CASE 
            WHEN CallDispositionFlag = 1 AND PeripheralCallType = 2 AND AnsweredDateTimeUTC IS NOT NULL THEN HoldTime
            ELSE 0 
        END) AS HoldSec


    FROM Cisco.dbo.Termination_Call_Detail with (nolock)
    GROUP BY RouterCallKeyDay, RouterCallKey
)
----------------------------------------------------------------------------------------------------------------
-- Routed Calls from Route Call Detail 
----------------------------------------------------------------------------------------------------------------

 SELECT 

	-- Call Key Identifier
	CONCAT(r.RouterCallKeyDay, r.RouterCallKey) AS id, 

	-- Start Date Time
	t.StartDateTime AS startDateTime,
	CAST(t.StartDateTime AS DATE) AS startDate,   
	CAST(t.StartDateTime AS TIME(0)) AS startTime,  
	DATEPART(HOUR, t.StartDateTime) AS Start_Hour,

	-- End Date Time
	t.EndDateTime AS endDateTime,  
	CAST(t.EndDateTime AS DATE) AS endDate,   
	CAST(t.EndDateTime AS TIME(0)) AS endTime, 

	-- Answered Date Time
	t.AnswerDateTime AS connectedDateTime, 
	CAST(t.AnswerDateTime AS DATE) AS connectedDate,
	CAST(t.AnswerDateTime AS TIME(0)) AS connectedTime,

	-- Time Differences
	DATEDIFF(SECOND, t.StartDateTime, t.EndDateTime) AS Start_End,
	CASE WHEN DATEDIFF(SECOND, t.StartDateTime, t.AnswerDateTime) < 0 THEN 1 ELSE DATEDIFF(SECOND, t.StartDateTime, t.AnswerDateTime) END AS Start_Answer,
	CASE WHEN t.AnswerDateTime IS NULL THEN DATEDIFF(SECOND, t.StartDateTime, t.EndDateTime) END AS Start_Abandon,
	CASE WHEN t.AnswerDateTime IS NOT NULL THEN 
		CASE WHEN DATEDIFF(SECOND, t.StartDateTime, t.AnswerDateTime) < 0 THEN 1 ELSE DATEDIFF(SECOND, t.StartDateTime, t.AnswerDateTime) END
		WHEN t.AnswerDateTime IS NULL THEN 
		DATEDIFF(SECOND, t.StartDateTime, t.EndDateTime)
		END AS Start_Answer_Abandon,
	DATEDIFF(SECOND, t.AnswerDateTime, t.EndDateTime) AS Answer_End,

	-- Calculated Durations
	t.DelaySec AS Message_Time,
	CASE WHEN t.AnswerDateTime IS NOT NULL THEN t.QueueSec + t.RingSec END AS Answer_Wait_Time,
	CASE WHEN t.AnswerDateTime IS NULL AND NOT (t.RingSec = 0 AND t.QueueSec = 0) THEN t.QueueSec + t.RingSec END AS Abandon_Wait_Time,
	t.TalkSec + t.HoldSec AS Handling_Time,
	
	-- Durations
	t.DelaySec AS Delay_Sec,
	t.QueueSec AS Queue_Sec,	
	t.RingSec AS Ring_Sec,
	t.TalkSec AS Talk_Sec,
	t.HoldSec AS Hold_Sec,

	-- Abandon Point
	CASE WHEN t.AnswerDateTime IS NULL AND t.RingSec IS NULL THEN 'Message'   
		 WHEN t.AnswerDateTime IS NULL AND t.RingSec = 0 AND t.QueueSec = 0 THEN 'Message'
		 WHEN t.AnswerDateTime IS NULL AND t.RingSec = 0 AND t.QueueSec > 0 THEN 'Queuing'
		 WHEN t.AnswerDateTime IS NULL AND t.RingSec > 0 THEN 'Ringing'
 		 WHEN t.AnswerDateTime IS NULL THEN 'Unknown' 
		 END AS Abandon_Point,
	   
	-- Call type details (inbound, outbound, internal)
	'inbound' AS event,  
	
	-- Calling number
	r.ANI AS cli,  

	-- Dialled number
	CAST(DialedNumberString AS VarChar(20)) AS dialledNumber,
	dd.DDIName,
	dd.LineType,

	-- Answered Status
	CASE WHEN r.Label IS NOT NULL AND t.AnswerDateTime IS NOT NULL THEN 'Answered' ELSE 'Not Answered' END AS Answer_Status, 

	-- Destination Queue
	r.CallTypeID AS Dest_Queue_ID,
	ct.EnterpriseName AS Dest_Queue_Name,
	r.variable8 AS Dest_Queue_Var8,
	r.variable9 AS Dest_Queue_Var9,
	r.variable10 AS Dest_Queue_Var10,

	-- Answering Agent
	a.SkillTargetID AS Dest_Agent_Skill_Target_ID,
	r.Label AS Dest_Agent_ID,
	a.Name AS Dest_Agent_Name,  
    a.Role AS Dest_Agent_Role,
	a.TeamName AS Dest_Agent_Team_Name,

	--Call Session Identifiers
	t.AgentSkillTargetID AS Call_Agent_Skill_Target_ID,
	t.AgentSessionID AS Call_Agent_Session_ID,

	--Caller (dialled calls)
	NULL AS Source_Agent_Skill_Target_ID,
	NULL AS Source_Agent_ID,
    NULL AS Source_Agent_Name, 
    NULL AS Source_Agent_Role,
	NULL AS Source_Agent_Team_Name,


	--QA
	r.RequestType,  -- 1 Pre Route, 2 Blind Transfer/Network VRU, 3 Announced Transfer, 4 Overflow, 5 Re-Route, 6 Post Route Request
	r.Originator,
	r.OriginatorType,  -- 0 Unknown, 1 Trunk, 2 Teleset, 3 VRU, 4 Trunk Group
	r.TargetLabel,
	r.TargetType,  -- 0 Routing ended badly, 1 Default Route, 14 Aborted Call Disconnected, 15 Release Call Node, 18 DynamicLabel Ended in dynamic label node, 22 SendPQ Ended at Precision Queue
	r.RouterErrorCode,  -- 66 No default label, 435 Unidentified error, 448 Abandoned call (not an error), 499 Max queue time limit 
	r.RouterQueueTime,
	NULL AS PCT,
	NULL AS CD,
	NULL as CDF
	
-- Route Call Details is the definitive list of calls routed and generates a DayKey and a CallKey for each call which is entered on each TCD segment. 
FROM Cisco.dbo.Route_Call_Detail r WITH (NOLOCK)

	-- Join to the CTEs and the EMS Agent table
	INNER JOIN TCDCallSummary t ON CONCAT(r.RouterCallKeyDay, r.RouterCallKey) = t.id -- all relevant time segments from the CTE
	LEFT JOIN Cisco.dbo.Agents a with (nolock) ON r.Label = a.AgentId -- agent name and other details
	LEFT JOIN Cisco.dbo.Call_Type ct with (nolock) ON r.CallTypeID = ct.CallTypeID -- describes that nature of the call
	LEFT JOIN Cisco.dbo.DDILookup dd  WITH (NOLOCK) ON r.DialedNumberString = dd.DDI -- table of extension numbers

-- The switchbaord was live on 11 November 2024... 
WHERE DATEADD(MINUTE, -TimeZone, CallStartDateTimeUTC) >= '18 Nov 2024'


UNION ALL

----------------------------------------------------------------------------------------------------------------
-- Dialled Calls from Termination Call Detail 
----------------------------------------------------------------------------------------------------------------

SELECT   

	-- Call Key Identifier
	CAST(ICRCallKey AS VARCHAR(20)) as id, 

    -- Start Date Time
	DATEADD(MINUTE, -TimeZone, StartDateTimeUTC) AS startDateTime,    
	CAST(DATEADD(MINUTE, -TimeZone, StartDateTimeUTC) AS DATE) startDate,
	CAST(DATEADD(MINUTE, -TimeZone, StartDateTimeUTC) AS TIME(0)) AS startTime,
	DATEPART("HH",DATEADD(MINUTE, -TimeZone, StartDateTimeUTC)) AS Start_Hour, 

	-- End Date Time
    DATEADD(MINUTE, -TimeZone, CallTerminatedDateTimeUTC) as endDateTime,
	CAST(DATEADD(MINUTE, -TimeZone, CallTerminatedDateTimeUTC) AS DATE) AS endDate,   
	CAST(DATEADD(MINUTE, -TimeZone, CallTerminatedDateTimeUTC) AS TIME(0)) AS endTime, 
		
	-- Answered Date Time
	DATEADD(MINUTE, -TimeZone, AnsweredDateTimeUTC) AS connectedDateTime, 
	CAST(DATEADD(MINUTE, -TimeZone, AnsweredDateTimeUTC) AS DATE) AS connectedDate,
	CAST(DATEADD(MINUTE, -TimeZone, AnsweredDateTimeUTC) AS TIME(0)) AS connectedTime,

	-- Time Differences
	DATEDIFF(SECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) AS Start_End, 
	CASE WHEN DATEDIFF(MILLISECOND, StartDateTimeUTC, AnsweredDateTimeUTC) < 1000 THEN 1 
         ELSE CAST(ROUND(DATEDIFF(MILLISECOND, StartDateTimeUTC, AnsweredDateTimeUTC) / 1000.0, 0) AS int) 
		 END AS Start_Answer,
	CASE WHEN AnsweredDateTimeUTC IS NULL THEN 
		 CASE WHEN DATEDIFF(MILLISECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) < 1000 THEN 1 
			  ELSE CAST(ROUND(DATEDIFF(MILLISECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) / 1000.0, 0) AS INT)
			  END 
		 ELSE NULL END AS Start_Aband,
	CASE WHEN AnsweredDateTimeUTC IS NOT NULL THEN
		CASE WHEN DATEDIFF(MILLISECOND, StartDateTimeUTC, AnsweredDateTimeUTC) < 1000 THEN 1 
			 ELSE CAST(ROUND(DATEDIFF(MILLISECOND, StartDateTimeUTC, AnsweredDateTimeUTC) / 1000.0, 0) AS int) 
			 END 
		WHEN AnsweredDateTimeUTC IS NULL THEN
		CASE WHEN DATEDIFF(MILLISECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) < 1000 THEN 1 
			 ELSE CAST(ROUND(DATEDIFF(MILLISECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) / 1000.0, 0) AS INT)
			 END
		END AS Start_Answer_Abandon,
	DATEDIFF(SECOND, AnsweredDateTimeUTC, CallTerminatedDateTimeUTC) AS Answer_End,		
	
	-- Calculated Durations
	NULL AS Message_Time,
	CASE WHEN AnsweredDateTimeUTC IS NOT NULL THEN RingTime + DelayTime END AS Answer_Wait_Time,
	CASE WHEN AnsweredDateTimeUTC IS NULL THEN RingTime + DelayTime END AS Abandon_Wait_Time,
	TalkTime + HoldTime AS Handling_Time,
	
	-- Durations from Switchboard
	DelayTime AS Delay_Sec,	
	NULL AS Queue_Sec,
	RingTime AS Ring_Sec,
	TalkTime AS Talk_Sec,
	HoldTime AS Hold_Sec,

	-- Abandon Point
	CASE WHEN AnsweredDateTimeUTC IS NULL THEN 'Ringing' END AS Abandon_Point,
	
	-- Call type details (inbound, outbound, internal)
	CASE WHEN [PeripheralCallType] IN (8, 9, 13, 15) AND DigitsDialed LIKE '9%' THEN 'outbound' -- out means from the switch not the organisation, 9 clarifies external number dialled
		 WHEN [PeripheralCallType] IN (8, 9, 13, 15) AND DigitsDialed NOT LIKE '9%' THEN 'internal' -- numbers on other internal switches don't start with 9
		 WHEN [PeripheralCallType] IN (1, 4, 6, 10, 12) THEN 'internal'  -- same switch
		 WHEN [PeripheralCallType] = 21 THEN 'monitor' -- special version of internal calls used to monitor other calls
		 END AS event, 

	-- Calling Number
	ANI as cli,  

	--Dialled Number
	CASE WHEN DigitsDialed IS NULL THEN CASE WHEN LEN(DNIS) < 6 THEN DNIS END ELSE DigitsDialed END AS dialledNumber,
	dd.DDIName,
	dd.LineType,
	 
	-- Answered Status
	CASE WHEN AnsweredDateTimeUTC IS NULL THEN 'Not Answered' 
		 WHEN AnsweredDateTimeUTC IS NOT NULL THEN 'Answered'
		 END AS Answer_Status,

	-- Destination Queue
	NULL AS Dest_Queue_ID, 
	NULL AS Dest_Queue_Name,
	NULL AS Dest_Queue_Var8,
	NULL AS Dest_Queue_Var9,
	NULL AS Dest_Queue_Var10,		
	
	--Answering Agent
	aa.SkillTargetID as Dest_Agent_Skill_Target_ID,
	CASE WHEN LEN(COALESCE(DigitsDialed, DNIS)) > 5 THEN NULL ELSE COALESCE(DigitsDialed, DNIS) END AS Dest_Agent_ID,
	aa.Name  AS Dest_Agent_Name,					        
    aa.Role  AS Dest_Agent_Role,
	aa.TeamName AS Dest_Agent_Team_Name,
	
	--Call Session Identifiers
	AgentSkillTargetID AS Call_Agent_Skill_Target_ID,
	AgentSessionID AS Call_Agent_Session_ID,
	
	-- Caller
	sa.SkillTargetID AS Source_Agent_Skill_Target_ID,
	SourceAgentPeripheralNumber AS SourceAgentID,
    sa.Name AS Source_Agent_Name, 
    sa.Role AS Source_Agent_Role,
	sa.TeamName AS Source_Agent_Team_Name,


	--Quality Assurance
	NULL AS RequestType,
	NULL AS Originator,
	NULL AS OriginatorType,
	NULL AS TargetLabel,
	NULL AS TargetType,
	NULL AS Router_Error_Code,
	NULL AS Router_Queue_Time,
	PeripheralCallType AS PCT,
	CallDisposition AS CD,
	CallDispositionFlag as CDF

-- Termination Call Detail is the source of dialled calls. One row per call. 	 
FROM Cisco.dbo.Termination_Call_Detail t with (nolock)
  
	-- Join to the supporting tables including one for troubleshooting CLI
   LEFT JOIN Cisco.dbo.Agents aa with (nolock) ON CASE WHEN LEN(COALESCE(DigitsDialed, DNIS)) > 5 THEN NULL ELSE COALESCE(DigitsDialed, DNIS) END = aa.AgentId
   LEFT JOIN Cisco.dbo.Agents sa with (nolock) ON t.SourceAgentPeripheralNumber = sa.AgentId
   LEFT JOIN Cisco.dbo.DDILookup dd  WITH (NOLOCK) ON (CASE WHEN DigitsDialed IS NULL THEN CASE WHEN LEN(DNIS) < 6 THEN DNIS END ELSE DigitsDialed END) = dd.DDI

WHERE 
	DATEADD(MINUTE, -TimeZone, StartDateTimeUTC)  >= '18 Nov 2024' -- from the correct switchboard use start date
	AND RouterCallKey = 0 -- non-routed calls only
	AND DATEDIFF(SECOND, StartDateTimeUTC, CallTerminatedDateTimeUTC) > 0. -- remove calls that weren't a valid length
	AND NOT (DigitsDialed IS NULL AND DNIS IS NULL) -- not calls that didn't have a number

