import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const WITHDRAWAL_ACCOUNTS_QUERY = gql`
query WithdrawalAccountsQuery(
    $user_Username: ID,
    $statusChangedBy_Username: ID,
    $orderId_Icontains: String, 
    $startAt: String, 
    $endAt: String, 
    $withdrawalType: String, 
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String, 
    $status: String) {
    withdrawals(
        user_Username: $user_Username,
        statusChangedBy_Username: $statusChangedBy_Username,
        startAt:$startAt, 
        endAt:$endAt, 
        withdrawalType:$withdrawalType, 
        first: $first, 
        last: $last, 
        after: $after, 
        before: $before, 
        status: $status,
        orderId_Icontains: $orderId_Icontains 
        ) {
        edges {
            node {
                id
                pk
                orderId
                user {
                    id
                    username
                    memberLevel {
                        id
                        name
                    }
                    vipLevel {
                        id
                        name
                    }
                }
                createUser {
                    id
                    username
                }
                createdAt
                withdrawalType
                amount
                status
                updatedAt
                statusChangedBy {
                    id
                    username
                }
                riskApproval {
                    edges {
                    node {
                        id
                        pk
                        balance
                        updatedAt
                        needFirstApprove
                        status
                        firstApproval {
                            edges {
                                node {
                                    id
                                    pk
                                    status
                                }
                            }
                        }
                    }
                    }
                }
                updatedAt
                internalNote
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


export default function useWithdrawalAccountsQuery({ refresh, statusChangedBy_Username, user_Username, withdrawalType, startAt, endAt, rowsPerPage, after, before, status, mutation, orderId_Icontains }) {
    let variables = { refresh, statusChangedBy_Username, user_Username, withdrawalType, startAt, endAt, after, before, status, mutation, orderId_Icontains };
    if (startAt) variables.startAt = startAt;
    if (endAt) variables.endAt = endAt;
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
        query: WITHDRAWAL_ACCOUNTS_QUERY,
        variables,
        defs: [refresh, statusChangedBy_Username, user_Username, orderId_Icontains, startAt, endAt, withdrawalType, rowsPerPage, after, before, status, mutation]
    })
}