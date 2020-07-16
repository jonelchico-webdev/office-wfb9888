import {gql} from 'graphql.macro';


export const NOTE_MANAGEMENT_QUERY = gql`query NoteManagement {
	noteManagement {
		orderNumber
		memberAccount
		belongLevel
		gameMaker
		gameName
		threePartyOrderNumber
		betTime
		betAmount
		effectiveBet
		awardTime
		prizeAmount
		handlingFee
		profitAndLoss
	}
}`

export const FLOW_AUDIT_QUERY = gql`query FlowAudit {
	flowAudit {
		depositTime
        depositIntoTheWater
        depositAmount
        completedAmount
        depositNeedsToBeAudited
        administrativeFeeDeduction
        discountedPrice
        offerNeedsToBeAudited
        discountDeduction
	}
}`


export const MONEY_CONTROL_CONDITION_MANAGEMENT_QUERY = gql`query MoneyControlConditionManagement {
	moneyControlConditionManagement {
		no
		condition
		judge
		value
		status
		delete
	}
}`

export const MONEY_CONTROL_AUDIT_QUERY = gql`query MoneyControlConditionManagement {
	moneyControlAudit {
		orderNumber
		memberAccount
		hierarchy
		VIPRating
		withdrawalApplicationTime
		numberOfWithdrawals
		applicationForWithdrawalAmount
		accountBalance
		handlingFee
		administrativeFee
		discountDeduction
		amountOfWithdrawal
		systemAudit
		status
		operator
		operatingTime
		note
		noteDetails
	}
}`



