import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const RECHARGE_REPORT_QUERY = gql`query RechargeReport($userName: String, $first: Int, $last: Int, $after: String, $before: String, $startAt: String, $endAt: String) {
    financeReport (username: $userName, first: $first, last: $last, after: $after, before: $before, startAt: $startAt, endAt: $endAt, includeDescendants: true){
        edges {
          node {
            username
            affiliate
            depositAmount
            depositCount
            userId
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

export default function useRechargeReport({ userName, rowsPerPage, after, before, status, mutation, startAt, endAt }) {
    let variables = {mutation, status, userName, startAt, endAt};

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
        query: RECHARGE_REPORT_QUERY,
        variables,
        defs: [rowsPerPage, after, before, status, mutation, userName, startAt, endAt]
    })
}