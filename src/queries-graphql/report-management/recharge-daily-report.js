import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const RECHARGE_DAILY_REPORT_QUERY = gql`query RechargeDailyReport($userName: String, $startAt: String, $endAt: String, $first: Int, $last: Int, $after: String, $before: String) {
    financeDayReport (username: $userName, startAt:$startAt, endAt:$endAt, first: $first, last: $last, after: $after, before: $before, includeDescendants: true){
        edges {
          node {
            day
            depositAmount
            depositCount
            depositUsers
            depositAuditAmount
            depositHandlingFee
            withdrawalCount
            withdrawalUsers
            withdrawalAmount
            withdrawalHandlingFee
            subtraction
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

export default function useRechargeDailyReport({ userName, first, startAt, endAt, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, userName, status, first, startAt, endAt};

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
        query: RECHARGE_DAILY_REPORT_QUERY,
        variables,
        defs: [rowsPerPage, after, before, userName, status, mutation, first, startAt, endAt]
    })
}