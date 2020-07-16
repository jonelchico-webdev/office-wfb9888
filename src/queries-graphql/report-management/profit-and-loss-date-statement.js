import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const PROFIT_AND_LOSS_DATE_STATEMENT = gql`query ProfitLossDateStatement($first: Int, $last: Int, $after: String, $before: String, $userName: String, $startAt: String, $endAt: String) {
    betReport(first: $first, last: $last, after: $after, before: $before, startAt:$startAt, endAt:$endAt, username: $userName, includeDescendants: true) {
        edges {
          node {
            userId
            username
            affiliate
            betAmount
            betCount
            betUsers
            betValidAmount
            betPayout
            betSub
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

export default function useProfitAndLossDateStatement({ userName, first, startAt, endAt, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, userName, status, first, startAt, endAt};
    
    if (startAt) variables.startAt = startAt;
    if (endAt) variables.endAt = endAt;
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
        query: PROFIT_AND_LOSS_DATE_STATEMENT,
        variables,
        defs: [rowsPerPage, after, before, userName, status, mutation, first, startAt, endAt]
    })
}