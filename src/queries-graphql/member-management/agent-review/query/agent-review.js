import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const AGENT_REVIEW_QUERY = gql `
    query AgentReviewQuery(
        $startAt: String,
        $endAt: String,
        $balanceMin: Float,
        $balanceMax: Float,
        $username_Icontains: String,
        $isActive: Boolean,
        $affiliateProfile_Parent_User_Username: ID,
        $affiliateProfile_Status: ID,
        $first: Int, 
        $last: Int, 
        $after: String, 
        $before: String,
        ) {
        users(
            startAt: $startAt,
            endAt: $endAt,
            balanceMin: $balanceMin,
            balanceMax: $balanceMax,
            affiliateProfile_Status: $affiliateProfile_Status,
            username_Icontains: $username_Icontains,
            isActive: $isActive,
            affiliateProfile_Status_In: "pending, confirmed, cancelled"
            affiliateProfile_Parent_User_Username: $affiliateProfile_Parent_User_Username,
            first: $first, 
            last: $last, 
            after: $after, 
            before: $before,
            registeredAtDesc: true
            ) {
            edges {
                node {
                    id
                    pk
                    username
                    name
                    phone
                    email
                    firstName
                    lastName
                    qqNumber
                    affiliateProfile {
                        id
                        affiliateUrl
                        status
                        statusChangedBy {
                            id
                            username
                        }
                    }
                    isActive
                    registeredAt
                    lastLogin
                    lastLoginIp
                    notes
                    userCards (enabled: true){
                        edges {
                            node {
                                id
                                bankName
                                cardNumber
                                nameOnCard
                                branch
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

export function useAgentReviewQuery({refresh, affiliateProfile_Status, affiliateProfile_Status_In, affiliateProfile_Parent_User_Username, startAt, endAt, username_Icontains, isActive, balanceMin, balanceMax, rowsPerPage, first, last, after, before}) {
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
		query: AGENT_REVIEW_QUERY,
		variables,
		defs: [affiliateProfile_Status,refresh, affiliateProfile_Status_In, affiliateProfile_Parent_User_Username, startAt, endAt, username_Icontains, isActive, balanceMin, balanceMax, rowsPerPage, first, last, after, before]
	})
}