import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'
import moment from 'moment'

// const AGENT_MANAGEMENT_QUERY = gql`
// query AgentManagementQuery($startAt: String, $endAt: String, $username_Icontains: String, $username: String, $isActive: Boolean, $balanceMin: Float, $balanceMax: Float, $first: Int, $last: Int, $after: String, $before: String) {
// 	users(startAt: $startAt, endAt: $endAt, username_Icontains: $username_Icontains, username: $username, isActive: $isActive, balanceMin: $balanceMin, balanceMax: $balanceMax, first: $first, last: $last, after: $after, before: $before, affiliateProfile_Status: "confirmed" ) {
// 		edges {
// 			node {
// 				id     
//                 pk  
//                 username
//                 vipLevel {
//                     name
//                 }       
//                 memberLevel {
//                     name 
//                 }
// 				affiliateProfile {
// 					id
// 					affiliateUrl
// 					status
// 					level
// 					parent{
// 						user{
// 							id
// 							username
// 						}
// 					}          
// 					children{
// 						edges{
// 							node{
// 								id
// 								user{
// 									id
// 									username
// 								}
// 							}
// 						}
// 					}
// 				}
// 				registeredAt 
//                 isActive
//                 balance
//                 lastLoginIp
//                 notes
//                 lastLogin 
//                 name
//                 birthDate
//                 phone
//                 wechat
//                 qqNumber
//                 email  
//                 isStaff
//             }
// 			cursorNum
// 		}
// 		totalCount 
// 		pageInfo {
// 			hasNextPage
// 			hasPreviousPage
// 			startCursor
// 			endCursor
// 		}
// 	}
// }`

const AGENT_MANAGEMENT_QUERY = gql`
query AgentManagementQuery($startAt: String, $endAt: String, $username_Icontains: String, $username: String, $isActive: Boolean, $balanceMin: Float, $balanceMax: Float, $first: Int, $last: Int, $after: String, $before: String) {
	users(startAt: $startAt, endAt: $endAt, username_Icontains: $username_Icontains, username: $username, isActive: $isActive, balanceMin: $balanceMin, balanceMax: $balanceMax, first: $first, last: $last, after: $after, before: $before, affiliateProfile_Status: "confirmed" ) {
		edges {
			node {
				id     
                pk  
                username
                vipLevel {
                    name
                }       
                memberLevel {
                    name 
                }		
				affiliateProfile {
					id
					affiliateUrl
					invitationUrlPlayer
					invitationUrlAffiliate
					descendantsCount
				}		
				registeredAt 
                isActive
                balance
                lastLoginIp
                notes
                lastLogin               
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
}`

const AGENT_MANAGEMENT_DECENDANTS_QUERY = gql`
query AgentManagementDecendantsQuery(
	# $startAt: String, $endAt: String,
	 $username_Icontains: String,
	#   $username: String,
	 $isActive: Boolean,
	#   $balanceMin: Float, $balanceMax: Float,
	 $first: Int, $last: Int, $after: String, $before: String) {
	descendants(
		# startAt: $startAt, endAt: $endAt, 
		username_Icontains: $username_Icontains, 
		# username: $username,
		 isActive: $isActive, 
		#  balanceMin: $balanceMin, balanceMax: $balanceMax,
		 first: $first, last: $last, after: $after, before: $before, affiliateProfile_Status: "confirmed" ) {
		edges {
      node {
        id   
		pk  
        username
        affiliateProfile {
			id
		  	affiliateUrl
        }
        isActive
        registeredAt
        lastLoginIp
        lastOnlineAt
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
}`

const AGENT_DETAILS_QUERY = gql`
query AgentDetailsQuery($username: String) {
	users(username: $username) {
		edges {
			node {                                                                                                                                               
				id
				pk
				username
				birthDate
				phone
				wechat
				qqNumber
				email
				name
				balance
				isActive
				memberLevel {
					name
				}
				vipLevel {
					name
				}  
				registeredAt
				affiliateProfile {
					id
					affiliateUrl
				}
				lastLoginIp
				lastLogin
				notes
			}
		}
	}           
}`

const AGENT_TRANSACTION_STATUS_QUERY = gql`query UserTransactionStatusQuery($userId: Int, $userName: String){
    userTransactionStatses(userId: $userId, userName: $userName) {
        edges {
          node {
            id
            depositCount
            depositTotal
            withdrawalCount
            withdrawalTotal
          }
        }
      } 
}`

const AGENT_BANKCARD_QUERY = gql`
	query AgentBankcardQuery($user_Username: ID ) {
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

export const UPDATE_AGENT_MUTATE = gql`
    mutation updateAgentMutate($username: String!, $id: ID, $name: String!, $birthDate: Date, $phone: String, $wechat: String, $qqNumber: Int, $email: String, $isActive: Boolean){
        user(input:{
			id: $id
			username: $username
            name: $name
            birthDate: $birthDate
            phone: $phone
            wechat: $wechat
            qqNumber: $qqNumber
            email:$email
            isActive: $isActive
        })
        {
        errors{
            messages
            field
        }
        }
    }
`
export const CHANGE_PASSWORD_MUTATE = gql`
    mutation ChangePassMutate($username: String!, $password: String!, $confirmPassword: String!){
        AdminResetPassword(input:{
			username: $username
            password: $password
            passwordRepeat: $confirmPassword
        }){
            success
            errors
        }
  }
`

export function useAgentManagementQuery({ rowsPerPage, after, before, values }) {
	// moment(filterValues.startDate._d).format('YYYY-MM-DD')


	let variables = {}
	let test = {}
	if (values) {
		let startAt = values.startDate ? moment(values.startDate._d).format('YYYY-MM-DD') : ""
		let endAt = values.endDate ? moment(values.endDate._d).format('YYYY-MM-DD') : ""
		variables = {
			startAt: startAt,
			endAt: endAt,
		}
		if (values.accountBalanceMin !== '') {
			variables = { ...variables, balanceMin: values.accountBalanceMin, }
		}
		if (values.accountBalanceMax !== '') {
			variables = { ...variables, balanceMax: values.accountBalanceMax, }
		}
		if (values.selectStatus == "enable") {
			variables = { ...variables, isActive: true }
		} else if (values.selectStatus == "disable") {
			variables = { ...variables, isActive: false }
		}
		if (values.fuzzySearch) {
			variables = { ...variables, username_Icontains: values.accountNumber }
		} else {
			variables = { ...variables, username: values.accountNumber }
		}
	}
	console.log(variables, 'teeeeeeeest')
	// console.log(values,'queeeeeeeeeery')

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
		query: AGENT_MANAGEMENT_QUERY,
		variables,
		defs: [rowsPerPage, after, before, values]
	})
}



export function useAgentManagementDecendantsQuery({ rowsPerPage, after, before, values }) {
	// moment(filterValues.startDate._d).format('YYYY-MM-DD')
	console.log(values)

	let variables = {}
	if (values) {
		let startAt = values.startDate ? moment(values.startDate._d).format('YYYY-MM-DD') : ""
		let endAt = values.endDate ? moment(values.endDate._d).format('YYYY-MM-DD') : ""
		variables = {
			startAt: startAt,
			endAt: endAt,
		}
		if (values.accountBalanceMin !== '') {
			variables = { ...variables, balanceMin: values.accountBalanceMin, }
		}
		if (values.accountBalanceMax !== '') {
			variables = { ...variables, balanceMax: values.accountBalanceMax, }
		}
		if (values.selectStatus == "enable") {
			variables = { ...variables, isActive: true }
		} else if (values.selectStatus == "disable") {
			variables = { ...variables, isActive: false }
		}
		if (values.fuzzySearch) {
			variables = { ...variables, username_Icontains: values.accountNumber }
		} else {
			variables = { ...variables, username: values.accountNumber }
		}
	}
	// console.log(values,'queeeeeeeeeery')

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
		query: AGENT_MANAGEMENT_DECENDANTS_QUERY,
		variables,
		defs: [rowsPerPage, after, before, values]
	})
}


export function useAgentDetailsQuery({ username }) {
	let variables = { username }
	return useQuery({
		query: AGENT_DETAILS_QUERY,
		variables,
		defs: [username]
	})
}

export function useAgentTransactionStatusQuery({ userName }) {
	let variables = { userName };

	return useQuery({
		query: AGENT_TRANSACTION_STATUS_QUERY,
		variables,
		defs: [userName]
	})
}

export function useAgentBankCardQuery({ user_Username }) {
	let variables = { user_Username }
	return useQuery({
		query: AGENT_BANKCARD_QUERY,
		variables,
		defs: [user_Username]
	})
}