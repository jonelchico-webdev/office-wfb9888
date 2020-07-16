import gql from 'graphql-tag'
import useQuery from '../../../../hooks/use-query'

const AGENT_REVIEW_DESCENDANTS_QUERY = gql `
query AgentReviewDescendantsQuery(
    $username_Icontains: String,
    $isActive: Boolean,
    $affiliateProfile_Parent_User_Username: ID,
    $affiliateProfile_Status: ID,
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String,
    ) {
    descendants(
        affiliateProfile_Status: $affiliateProfile_Status,
        username_Icontains: $username_Icontains,
        isActive: $isActive,
        affiliateProfile_Status_In: "pending, confirmed, cancelled"
        affiliateProfile_Parent_User_Username: $affiliateProfile_Parent_User_Username,
        first: $first, 
        last: $last, 
        after: $after, 
        before: $before 
        ) {
        edges {
            node {
                id
                pk
                username
                affiliateProfile {
                    id
                    affiliateUrl
                    status
                }
                isActive
                registeredAt
                lastLoginIp
                lastOnlineAt
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

export function useAgentReviewDescendantsQuery({ affiliateProfile_Status, affiliateProfile_Status_In, affiliateProfile_Parent_User_Username, startAt, endAt, username_Icontains, isActive, balanceMin, balanceMax, rowsPerPage, first, last, after, before}) {
    let variables = {affiliateProfile_Status, affiliateProfile_Status_In, affiliateProfile_Parent_User_Username, startAt, endAt, username_Icontains, isActive, balanceMin, balanceMax, rowsPerPage, first, last, after, before}
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
		query: AGENT_REVIEW_DESCENDANTS_QUERY,
		variables,
		defs: [affiliateProfile_Status, affiliateProfile_Status_In, affiliateProfile_Parent_User_Username, startAt, endAt, username_Icontains, isActive, balanceMin, balanceMax, rowsPerPage, first, last, after, before]
	})
}