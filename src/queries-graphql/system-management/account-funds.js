import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const MY_ACCOUNT_QUERY = gql`
	query MyAccountQuery($username: String) {
		users(username: $username) {
			edges {
				node {
					id
					username
					name
					userCards {
						edges {
							node {
								id
								bankName
								cardNumber
								nameOnCard
								branch
								enabled
								}
							}
						}
					balance
        			withdrawalsPassword
				}
			}
		}
	}
`


const MY_BANKCARD_QUERY = gql`
	query MyBankCardQuery($user_Username: ID ) {
		userCards(user_Username: $user_Username, enabled: true) {
			edges {
				node {
					id
					bankName
					cardNumber
					nameOnCard
					branch
				}
			}
		}
	}
`

const MY_MEMBER_BANK_RECORD = gql`
	query MyMemberBankRecord($startAt: String, $endAt: String, $type: String ) {
		memberBankRecord (
			startAt: $startAt, 
        	endAt: $endAt,
			type: $type 
		) {
			edges {
				node {
					id
					orderId
					createdAt
					updatedAt
					commissionPayments {
						edges {
							node {
								id
								commissionName
							}
						}
					}
					type
					amount
					balance 
					remark
					balanceBefore
				}
			}
			totalCount
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
			}
  		}	

	}
`

export const MY_BANKCARD_MUTATE = gql`
	mutation MyBankCardMutate(
		$bankName: String!
	$nameOnCard: String!
	$cardNumber: String!
	$branch: String!
	$user: ID
	)  {
		userCard(input:{
			bankName: $bankName
			nameOnCard: $nameOnCard
			cardNumber: $cardNumber
			enabled: true
			branch: $branch
			user:$user
		}){
			clientMutationId
			errors{
				field
				messages
			}
		}
	}
`

export const WITHDRAW_MUTATE = gql`
	mutation WithdrawMutate(
		$user: ID
		$amount: Float
		$depositBankName: String,
		$depositAccount: String,
		$depositUserName: String, 
		$withdrawalsPassword: String
	) {
		withdrawal(input: {
			user: $user
			amount: $amount
			withdrawalType: "manual"
			depositBankName: $depositBankName
    		depositAccount: $depositAccount
    		depositUserName: $depositUserName
    		withdrawalsPassword: $withdrawalsPassword
		}) {
			errors {
				field
				messages
			}
		}
	}
`

export const ADD_WITHDRAWALS_PASSWORD_MUTATE = gql`
	mutation AddWithdrawalPasswordMutate(
		$password: String!
		$withdrawalsPassword: String!
		$withdrawalsPasswordRepeat: String!
	) {
		AddWithdrawalsPassword(input: {
			password: $password
			withdrawalsPassword: $withdrawalsPassword
			withdrawalsPasswordRepeat: $withdrawalsPasswordRepeat
		}) {
			success
			errors
		}
	}
`

export const CHANGE_WITHDRAWALS_PASSWORD_MUTATE = gql`
	mutation ChangeWithdrawalsPassword(
		$password: String!
		$withdrawalsPasswordOld: String!
		$withdrawalsPassword: String!
		$withdrawalsPasswordRepeat: String!
	) {
		ChangeWithdrawalsPassword(input:{
			password:$password
			withdrawalsPasswordOld:$withdrawalsPasswordOld
			withdrawalsPassword:$withdrawalsPassword
			withdrawalsPasswordRepeat:$withdrawalsPasswordRepeat
		}) {
			success
			errors
		}
	}
`

export function useMyMemberBankRecord({ rowsPerPage, after, before, memberBankRecordValues, openWithdrawModal, mutate }) {
	let variables = {}

	if (after) {
		variables.first = rowsPerPage;
		variables.after = after;
	}
	if (before) {
		variables.last = rowsPerPage;
		variables.before = before;
	}
	if (!after && !before) {
		variables.first = rowsPerPage;
	}
	return useQuery({
		query: MY_MEMBER_BANK_RECORD,
		variables,
		defs: [rowsPerPage, after, before, memberBankRecordValues, openWithdrawModal, mutate]
	})
}

export function useMyAccountQuery({ username, open, openWithdrawModal, mutate }) {
	let variables = { username, }
	return useQuery({
		query: MY_ACCOUNT_QUERY,
		variables,
		defs: [username, open, openWithdrawModal, mutate]
	})
}

export function useMyBankCardQuery({ user_Username, open }) {
	// console.log(openWithdrawModal)
	let variables = { user_Username, }
	return useQuery({
		query: MY_BANKCARD_QUERY,
		variables,
		defs: [user_Username, open ]
	})
}