import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const USER_REPORT_QUERY = gql`query MemberDailyReport(
    $startAt: String,
    $endAt: String,
    $userName: String,
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String,
){
    dailyMemberReport(
        startAt: $startAt,
        endAt: $endAt,
        username: $userName,
        first: $first,
        last: $last,
        after: $after,
        before: $before,
        includeDescendants: true
    ) {
        edges {
        node {
            day
            activeMemberCount
            betUsers
            registerMemberCount
            depositAmount
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

export default function useUserReport({ userName, rowsPerPage, after, before, status, mutation, startAt, endAt }) {
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
        query: USER_REPORT_QUERY,
        variables,
        defs: [rowsPerPage, after, before, status, mutation, userName, startAt, endAt]
    })
}