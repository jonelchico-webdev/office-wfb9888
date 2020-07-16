import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

export const WITHDRAWALS = gql`query WithdrawalFirsts($startAt: String, $first: Int, $last: Int, 
  $after: String, $before: String){
  withdrawals (startAt: $startAt, first: $first, 
    last: $last, after: $after, before: $before){
    edges {
      node {
        id
        pk
        user {
          id
          username
          memberLevel {
            id
            name
          }
          vipLevel {
            id
            name
          }
        }
        orderId
        createdAt
        amount
        balance
        finalAmount
        handlingFee
        createUser {
          id
          name
        }
        depositBankName
        riskApproval {
          edges {
            node {
              depositAuditAmount
              preferentialAuditAmount
              withdrawalCount
              id
              pk
              balance
              updatedAt
              needFirstApprove
              status
              firstApproval {
                edges {
                  node {
                    id
                    pk
                    status
                    statusChangedAt
                    statusChangedBy {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
        createdAt
        status
        updatedAt
        internalNote
        statusChangedAt
        statusChangedBy {
          id
          name
        }
      }
    }
    totalCount
    startCursorNum
    endCursorNum
    pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
    }
  }
}`
 
export const WITHDRAWAL_FIRST = gql`query WithdrawalFirsts($risk: ID, $id: ID, $first: Int, $last: Int, 
    $after: String, $before: String){
    withdrawalFirsts(risk: $risk, id: $id, first: $first, last: $last, after: $after, before: $before) {
        edges {
            node {
                id
                risk{
                    id
                    withdrawal {
                        id
                        pk
                        orderId
                        depositUserName
                        depositAccount
                        depositBranch
                        createUser {
                            id
                            name
                        }
                        user {
                            id
                            name
                            birthDate
                            username
                            qqNumber
                            email
                            pk
                            phone
                            registeredAt
                            lastLoginIp
                            lastLogin
                            announcementCreateUser {
                              edges {
                                node {
                                  id
                                  url
    
                                }
                              }
                            }
                            memberLevel {
                                id
                                name
                            }
                            vipLevel {
                                id
                                name
                            }
                        }
                        createdAt
                    }
                    amount
                    balance
                    handlingFee
                    depositAuditAmount
                    preferentialAuditAmount
                    finalAmount
                    withdrawalCount
                    createdAt
                }
              	createdAt
                status
                statusChangedBy {
                    id
                    username
                }
                statusChangedAt
            }
        }
        totalCount
        startCursorNum
        endCursorNum
      	pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}`

export const RISK_FIRST_MUTATION = gql`
  mutation ($id: ID, $status: String){
    withdrawalFirstApproval(input:{
      id: $id
      status: $status
    }) {
      clientMutationId
      errors{
        field
        messages
      }
      withdrawalFirst{
        id
        status
        statusChangedAt
        statusChangedBy {
          id
          username
        }
      }
    }
  }
`

export default function useWithdrawalFirsts({rowsPerPage, after, before, mutation, id, startAt, endAt}) {
 
  let variables = {rowsPerPage, after, before, mutation, id, startAt, endAt};
//   if(fromDate) variables.fromDate = fromDate;
//   if(toDate) variables.toDate = toDate;
console.log(startAt)
console.log(endAt)
  if(after) {
      variables.first = rowsPerPage;
      variables.after = after;
  }
  if(before) {
      variables.last = rowsPerPage;
      variables.before = before;
  }
  if(!after && !before) {
      variables.first = rowsPerPage;
  }
	return useQuery({
		query: WITHDRAWALS,
		variables,
		defs: [ rowsPerPage, after, before, mutation, id, startAt, endAt ],
	})
}