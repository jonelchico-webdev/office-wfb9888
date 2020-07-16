import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const ONLINE_DEPOSIT_ACCOUNTS_QUERY = gql`query DepositAccountsQuery($status: String, $bank_Beneficiary_Icontains: ID, $user_Username_Icontains: ID, $orderId_Icontains: String, $amountMin: Float, $amountMax: Float, $startAt: String, $endAt: String, $depositType: String!, $first: Int, $last: Int, $after: String, $before: String) {
    deposities(status: $status, orderId_Icontains: $orderId_Icontains, bank_Beneficiary_Icontains: $bank_Beneficiary_Icontains, user_Username_Icontains: $user_Username_Icontains, startAt:$startAt, endAt:$endAt, depositType:$depositType, amountMin: $amountMin, amountMax: $amountMax, first: $first, last: $last, after: $after, before: $before) {
     edges {
          node {
            id
            pk
            amount
            handlingFee
            orderId
            depositDate
            status
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
            bank {
              id
              bankRule {
                edges {
                  node {
                    id
                    useCompany {
                      id
                      name
                    }
                  }
                }
              }
              bankName
              beneficiary
              businessType
              businessCode
              payVendor {
                id
                name
              }
      }
                    
            createdAt
            statusChangedBy {
              id
              username
            }
            updatedAt
            internalNote
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

export default function useOnlineDepositReview({ startAt, endAt, depositType, rowsPerPage, after, before, orderId_Icontains, user_Username_Icontains, amountMin, amountMax, status, bank_Beneficiary_Icontains, mutation }) {
    let variables = {mutation, depositType, user_Username_Icontains, startAt, endAt, orderId_Icontains, amountMax, amountMin, status, bank_Beneficiary_Icontains, rowsPerPage};
    // if(fromDate) variables.fromDate = fromDate;
    // if(toDate) variables.toDate = toDate;
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
        query:  ONLINE_DEPOSIT_ACCOUNTS_QUERY,
        variables,
        defs: [startAt, endAt, depositType, rowsPerPage, after, before, user_Username_Icontains, orderId_Icontains, amountMax, amountMin, status, bank_Beneficiary_Icontains, mutation]
    })
} 