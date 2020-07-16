import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const COMMISSION_PAYMENTS_QUERY = gql`query CommissionPayments(
  $createdAt_Gt: DateTime,
  $createdAt_Lt: DateTime,
  $status: String
  $recipient_Username: ID,
  $first: Int, 
  $last: Int, 
  $after: String, 
  $before: String, 
  ){
  commissionPayments(
    createdAt_Gt: $createdAt_Gt,
    createdAt_Lt: $createdAt_Lt,
    status: $status,
    recipient_Username: $recipient_Username,
    first: $first, 
    last: $last, 
    after: $after, 
    before: $before, 
    ) {
    edges{
      node{
        id
        createdAt
        updatedAt
        status
        amount
        memberBankRecord{
          balance
        }
        statusChangedAt
        statusChangedBy {
          id
          name
        }
        commissionName
        rootAffiliateUsername
        recipient {
          id
          name
          username
        }
        commission {
          commissionType
        }
        remarks
      }
    }
    totalCount
    startCursorNum
    endCursorNum
    pageInfo{
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`

export default function useCommissionPaymentsQuery({ after, before, rowsPerPage, mutation, commissionableAction_CommissionType_In, status, createdAt_Gt, createdAt_Lt,recipient_Username }) {
    let variables = {mutation, after, rowsPerPage, before, commissionableAction_CommissionType_In, status, createdAt_Gt, createdAt_Lt, recipient_Username};
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
        query:  COMMISSION_PAYMENTS_QUERY,
        variables,
        defs: [mutation, rowsPerPage, after, before, commissionableAction_CommissionType_In, status, createdAt_Gt, createdAt_Lt, recipient_Username]
    })
} 