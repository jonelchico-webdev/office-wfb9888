import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

 
export const MONEY_CONTROL_AUDIT_QUERY = gql`query MoneyControlAuditQuery($startAt: String, $orderId_Icontains: String, $user_Username_Icontains: ID, 
  $status: String, $statusChangedBy_Username: ID, $first: Int, $last: Int, 
  $after: String, $before: String){
    withdrawals(startAt: $startAt, orderId_Icontains: $orderId_Icontains, 
    user_Username_Icontains: $user_Username_Icontains, status: $status, 
    statusChangedBy_Username: $statusChangedBy_Username, first: $first, 
    last: $last, after: $after, before: $before) {
      edges {
        node {
          id
          orderId
          user {
            id
            username
            memberLevel {
              name
            }
            vipLevel {
              name
            }
          }
          statusChangedBy {
            id
            username
          }
          statusChangedAt
          status
          amount
          createdAt
          riskApproval {
            edges {
              node {
                id
                needFirstApprove
                withdrawalCount
                amount
                balance
                handlingFee
                depositAuditAmount
                preferentialAuditAmount
                finalAmount
                status
                statusChangedAt
                statusChangedBy {
                  id
                  username
                }
                firstApproval {
                  edges {
                    node {
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
              }
            }
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

export const RISK_STATUS_MUTATION = gql`
mutation ($id: ID, $status: String){
  withdrawalRiskApproval(input:{
    id: $id
    status: $status
    }) {
    clientMutationId
    errors{
      field
      messages
    }
    }
}
`

export default function useMoneyControlAuditQuery({id, rowsPerPage, after, before, mock, orderId_Icontains, user_Username_Icontains, status, statusChangedBy_Username, mutation, startAt, endAt, page}) {
 
  let variables = {id, after, before, orderId_Icontains, user_Username_Icontains, status, statusChangedBy_Username, mutation, startAt, endAt};
//   if(fromDate) variables.fromDate = fromDate;
//   if(toDate) variables.toDate = toDate;
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
		query: MONEY_CONTROL_AUDIT_QUERY,
		variables,
		defs: [ id, rowsPerPage, after, before, orderId_Icontains, user_Username_Icontains, status, statusChangedBy_Username, mutation, startAt, endAt, page],
	})
}