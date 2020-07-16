import {gql} from 'graphql.macro'; 

export const ELECTRIC_SALES_QUERY = gql`query ElectricSales {
	firstPaymentVerification {
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
		dialNumber
		status
		operator
		operatingTime
		operating
	}
}`
