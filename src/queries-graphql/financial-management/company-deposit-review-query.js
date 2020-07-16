import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'
 
const COMPANY_DEPOSIT_REVIEW_QUERY = gql`query CompanyDepositReviewQuery( $depositType: String!, $first: Int, $last: Int, 
                                    $after: String, $before: String, $bank_Beneficiary_Icontains: ID, $user_Username: ID, $orderId_Icontains: String
                                    $amountMin: Float, $amountMax: Float, $status: String, $startAt: String, $endAt: String) {
  deposities(depositType:$depositType, first: $first, last: $last, after: $after, before: $before, 
    bank_Beneficiary_Icontains: $bank_Beneficiary_Icontains, user_Username: $user_Username, orderId_Icontains: $orderId_Icontains,
    amountMin: $amountMin, amountMax: $amountMax, status: $status, startAt: $startAt, endAt: $endAt) {
      edges {
        node {
            id
            pk
            amount
            handlingFee
            orderId
            status
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
            bank {
                id
                bankRule {
                    edges {
                        node {
                            id
                            useCompany {
                                id
                                name
                            }
                        }
                    }
                }
                businessType
                businessCode
                payVendor {
                    id
                    name
                }
            }
            createdAt
            statusChangedBy {
                id
                username
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

export default function useCompanyDepositReviewQuery({depositType, rowsPerPage, after, before, mock, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt}) {
  let variables = {depositType, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt, rowsPerPage};

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
		query: COMPANY_DEPOSIT_REVIEW_QUERY,
		variables,
		defs: [depositType, rowsPerPage, after, before, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt],
		mock: mock
	})
}