import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const ADMIN_LOG_QUERY = gql `
query AdminLogQuery(
        $startAt: String, 
        $endAt: String, 
        $before: String,
        $after: String,
        $first: Int,
        $last: Int,
        $logType: String,
        $user_Username: ID,
        $user_Username_Icontains: ID,
        $user_Username_Istartswith: ID
    ) {
        logAdmins(
            startAt: $startAt,
            endAt: $endAt,
            before: $before,
            after: $after,
            first: $first,
            last: $last,
            logType: $logType,
            user_Username: $user_Username,
            user_Username_Icontains: $user_Username_Icontains,
            user_Username_Istartswith: $user_Username_Istartswith
        ) {
            edges {
                node {
                    id
                    pk
                    note
                    saveType
                    logType
                    ip
                    createdAt
                    updatedAt
                    user {
                        id
                        registeredAt
                        username
                        lastLogin
                        notes
                        affiliateProfile {
                            id
                            parent {
                                user {
                                    id
                                    username
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
    }
`

export function useAdminLogQuery({rowsPerPage,startAt, endAt, before, after, first, last, logType, user_Username, user_Username_Icontains, user_Username_Istartswith}) {
    
    let variables = {rowsPerPage, startAt, endAt, before, after, first, last, logType, user_Username, user_Username_Icontains, user_Username_Istartswith}
    if (after) {
		variables.first = rowsPerPage;
		variables.after = after;
	}
	if (before) {
		variables.last = rowsPerPage;
		variables.before = before;
	}
	if (!after && !before) {
		variables.first = rowsPerPage;
	}
	return useQuery({
		query: ADMIN_LOG_QUERY,
		variables,
		defs: [rowsPerPage, startAt, endAt, before, after, first, last, logType, user_Username, user_Username_Icontains, user_Username_Istartswith]
	})
}