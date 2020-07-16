import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const PROFIT_AND_LOSS_DATE_REPORT_QUERY = gql`query ProfitLossDateReport($startAt: String, $endAt: String, $first: Int, $last: Int, $after: String, $before: String) {
    betDayReport(startAt:$startAt, endAt:$endAt, first: $first, last: $last, after: $after, before: $before, includeDescendants: true) {
        edges {
          node {
            day
            betCount
            betUsers
            betAmount
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

export default function useProfitAndLossDateReport({ startAt, endAt, rowsPerPage, after, before, status,  page }) {
    let variables = { startAt, endAt};
    
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

    console.log(variables)
    return useQuery({ 
        query: PROFIT_AND_LOSS_DATE_REPORT_QUERY,
        variables,
        defs: [rowsPerPage, after, before,  startAt, endAt, page]
    })
}