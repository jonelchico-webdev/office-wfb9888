import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const ACCOUNT_CHANGE_REPORT_QUERY = gql`query memberBankRecord(
    $startAt: String!,
    $endAt: String!,
    $user_Username_Icontains: ID,
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String
){
    memberBankRecord(
        startAt:$startAt, 
        endAt:$endAt, 
        user_Username_Icontains:$user_Username_Icontains,
        first: $first, 
        last: $last, 
        after: $after, 
        before: $before
        ) {
      edges {
        node {
          id
          orderId
          username
          parentUsername
          updatedAt
          type
          balanceBefore
          amount
          balance
          remark
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

export default function useAccountChangeReport({ first, startAt, endAt, user_Username_Icontains, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, status, first, startAt, endAt, user_Username_Icontains};

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
        query: ACCOUNT_CHANGE_REPORT_QUERY,
        variables,
        defs: [rowsPerPage, after, before, status, mutation, first, startAt, endAt, user_Username_Icontains]
    })
}