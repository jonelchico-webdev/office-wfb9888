import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const USER_MANAGEMENT_QUERY = gql`query UserManagementQuery($username_Icontains: String, $startAt: String, $endAt: String, $username: String, $isActive: Boolean, $balanceMin: Float, $balanceMax: Float, $first: Int, $last: Int, $after: String, $before: String, $memberLevel_Name: ID, $vipLevel_Name: ID, $pk : Int){
    users(username_Icontains: $username_Icontains, startAt: $startAt, endAt: $endAt, username: $username, isActive: $isActive, balanceMin: $balanceMin, balanceMax: $balanceMax, first: $first, last: $last, after: $after, before: $before, memberLevel_Name: $memberLevel_Name, vipLevel_Name: $vipLevel_Name, pk : $pk) {
        edges {
            node {
                id     
                pk  
                username
                name
                notes
                vipLevel {
                    name
                }       
                memberLevel {
                    name 
                }
                affiliateProfile {
                    id
                    parent {
                      id
                      user {
                        id
                        username
                      }
                    }
                    
                  }

                
                userTransaction{
                    edges {
                    node {   
                        depositCount
                        depositTotal
                        withdrawalCount
                        withdrawalTotal
                        }
                    }
                }  
                registeredAt 
                isActive
                balance
                lastLoginIp
                lastLogin 
                name
                birthDate
                phone
                wechat
                qqNumber
                email  
                isStaff
            }
            cursorNum
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

// const ONLINE_DEPOSIT_ACCOUNTS_MUTATE = gql`
//     mutation{
//         depositApproval(input:{
//         pk: 10094
//         status:"confirmed"
//         }) {
//         clientMutationId
//         errors{
//             field
//             messages
//         }
//         deposit {
//             id
//             pk
//             amount
//             status
//             orderId
//         }
//         }
//     }
// `
const USER_TRANSACTION_STATUS_QUERY = gql`query UserTransactionStatusQuery($userId: ID, $userName: String){
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

export const UPDATE_USER_MUTATE = gql`
    mutation updateUser($id: ID, $name: String!, $username: String!, $birthDate: Date, $phone: String, $wechat: String, $qqNumber: Int, $email: String, $isActive: Boolean, $userNotes: String){
        user(input:{
            id: $id
            name: $name
            username: $username
            birthDate: $birthDate
            phone: $phone
            wechat: $wechat
            qqNumber: $qqNumber
            email:$email
            isActive: $isActive
            userNotes: $userNotes
        })
        {
            errors{
                messages
                field
            }
        }
    }
`

export const UPDATE_MEMBER_LEVEL = gql`
    mutation updateMemberLevel($id: ID, $name: String!, $username: String!, $memberLevel: ID ) {
        user(input:{ 
            id: $id
            name: $name
            username: $username
            memberLevel: $memberLevel
        }) {
            errors {
            field
            messages
            }
        }
    }
`

export const UPDATE_REMARKS = gql`
    mutation updateMemberLevel($id: ID, $name: String!, $username: String!, $userNotes: String ) {
        user(input:{ 
            id: $id
            name: $name
            username: $username
            userNotes: $userNotes
        }) {
            errors {
            field
            messages
            }
        }
    }
`

const USER_BANKCARD_QUERY = gql`query UserCards($user_Username: ID, $enabled: Boolean ) {
    userCards(user_Username: $user_Username, enabled: $enabled) {
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
}`


const MEMBER_LEVEL_QUERY = gql`
    query memberLevel { 
        memberLevels{
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`

const MEMBER_LEVEL_NAME_QUERY = gql`
    query memberLevel($memberLevel: ID){ 
        memberLevels(id: $memberLevel) {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`

const USER_WITHDRAWAL_QUERY = gql`query {
    users {
        edges {
            node {
                id     
                username
                balance
            }           
          }
    }
}`

const USER_DEPOSIT_QUERY = gql`query {
    users {
        edges {
            node {
                id     
                username
            }           
          }
    }
}`

export const SEND_MESSAGE = gql`
    mutation privateMessage($fromUser: String, $toUser: String,  $title: String, $message : String){
        privateMessage(input:{
            fromUser: $fromUser
            toUser: $toUser
            title: $title
            message: $message
        }) {
            errors{
              messages
            }
        }
    }
`

const USER_DESCENDENTS_QUERY = gql`query Descendants($username_Icontains: String, $first: Int, $last: Int, $after: String, $before: String) {
    descendants(username_Icontains:$username_Icontains, first: $first, last: $last, before: $before, after: $after){
      edges{
        node{
            id
            pk
            username
            isActive
            vipLevel{
                id
                name
            }
            memberLevel{
                id
                name
            }
            registeredAt
            lastLoginIp
            lastOnlineAt
            ancestors{
                edges{
                node{
                    id
                    username
                }
                }
            }
            userCards{
                edges{
                node{
                    id
                    status
                    bankName
                }
                }
            }
            memberLevel{
                id
                
            }
            affiliateProfile{
                id
                status
                statusChangedAt
                pk
                affiliateUrl
            }
            children{
                edges{
                node{
                    id
                    username
                    affiliateProfile{
                    id
                    level
                    }
                }
                }
            }
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

export default function useUserManagement({ startAt, endAt, username, fromDate, toDate, rowsPerPage, after, before, amountMin, amountMax, status, mutation, isActive, balanceMax, balanceMin, fuzzySearch, vipLevel_Name, memberLevel_Name, pk }) {

    let variables = { startAt, endAt, mutation, fromDate, toDate, amountMax, amountMin, vipLevel_Name, memberLevel_Name };

    if (pk !== '') {
        variables = { ...variables, pk };
    }
    if (fuzzySearch) {
        variables = { ...variables, username_Icontains: username }
    } else {
        variables = { ...variables, username: username }
    }
    if (isActive !== '') {
        variables = { ...variables, isActive };
    }
    if (balanceMin !== '') {
        variables = { ...variables, balanceMin };
    }
    if (balanceMax !== '') {
        variables = { ...variables, balanceMax };
    }

    if (status == "enable") {
        variables = { ...variables, isActive: true }
    } else if (status == "disable") {
        variables = { ...variables, isActive: false }
    }

    if (fromDate) variables.fromDate = fromDate;
    if (toDate) variables.toDate = toDate;
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
        query: USER_MANAGEMENT_QUERY,
        variables,
        defs: [startAt, endAt, fromDate, toDate, rowsPerPage, after, before, amountMax, amountMin, status, mutation, username, isActive, balanceMax, balanceMin, fuzzySearch, vipLevel_Name, memberLevel_Name, pk]
    })
}


export function useUserTransactionStatses({ userId, userName }) {
    let variables = { userId, userName };
    return useQuery({
        query: USER_TRANSACTION_STATUS_QUERY,
        variables,
        defs: [userId, userName]
    })
}

export function useMemberLevel({ memberLevel }) {

    return useQuery({
        query: MEMBER_LEVEL_QUERY,
        defs: [memberLevel]
    })
}

export function useMemberLevelName({ memberLevel }) {
    let variables = { memberLevel }
    return useQuery({
        query: MEMBER_LEVEL_NAME_QUERY,
        variables,
        defs: [memberLevel]
    })
}

export function useUserBankCardQuery({ user_Username, enabled }) {
    let variables = { user_Username, enabled }
    return useQuery({
        query: USER_BANKCARD_QUERY,
        variables,
        defs: [user_Username, enabled]
    })
}

export function useUserWithdrawalQuery({ refresh }) {
    return useQuery({
        query: USER_WITHDRAWAL_QUERY,
        defs: [refresh]
    })
}

export function useUserDepositQuery() {
    return useQuery({
        query: USER_DEPOSIT_QUERY,
        defs: []
    })
}

const USER_DETAILS_QUERY = gql`
query UserDetailsQuery($username: String) {
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
                userNotes
			}
		}
	}           
}`

export function useUserDetailsQuery({ username }) {
    let variables = { username }
    return useQuery({
        query: USER_DETAILS_QUERY,
        variables,
        defs: [username]
    })
}

export function useUserDescendentsQuery({ username_Icontains, rowsPerPage, after, before, }) {
    let variables = { username_Icontains, rowsPerPage, after, before, };

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
        query: USER_DESCENDENTS_QUERY,
        variables,
        defs: [username_Icontains, rowsPerPage, after, before,]
    })
}