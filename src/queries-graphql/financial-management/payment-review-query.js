import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

export const PAYMENT_REVIEW_QUERY = gql`query PaymentReviewQuery(
    $startAt: String, $endAt: String, $first: Int, $last: Int, 
    $after: String, $before: String, $user_Username: ID, $status: String, 
    $amountMin: Float, $amountMax: Float, $orderId_Icontains: String, $depositUserName: String, $statusChangedBy_Username: ID) {

    withdrawals(startAt: $startAt, endAt: $endAt, first: $first, 
        last: $last, after: $after, before: $before, user_Username: $user_Username, 
        status: $status, amountMin: $amountMin, amountMax: $amountMax, orderId_Icontains: $orderId_Icontains, depositUserName: $depositUserName, statusChangedBy_Username: $statusChangedBy_Username){
        edges {
                node {
                id
                pk
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
                orderId
                depositAccount
                depositUserName
                createdAt
                amount
                depositBankName
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
                statusChangedBy {
                    id
                    username
                }
                status
                updatedAt
                internalNote
                }
            }
            totalCount
            pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
            }
      }
}`

export default function usePaymentReviewQuery({startAt, endAt, rowsPerPage, after, before, user_Username, status, amountMin, amountMax, orderId_Icontains, depositUserName, statusChangedBy_Username, mutation}) {
    let variables = {startAt, endAt, rowsPerPage, after, before, user_Username, status, amountMin, amountMax, orderId_Icontains, depositUserName, statusChangedBy_Username, mutation};
    
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
        query: PAYMENT_REVIEW_QUERY,
        variables,
        defs: [startAt, endAt, rowsPerPage, after, before, user_Username, status, amountMin, amountMax, orderId_Icontains, depositUserName, statusChangedBy_Username, mutation],
    })
  }