import useQuery from '../../hooks/use-query';
import gql from 'graphql-tag'

const MANUAL_DEPOSIT_REVIEW_QUERY = gql`
    query ManualDepositQuery(
        $depositType: String!, 
        $statusChangedBy_Username: ID,
        $first: Int, $last: Int, 
        $after: String, 
        $before: String, 
        $bank_Beneficiary_Icontains: ID,
        $user_Username: ID, 
        $orderId_Icontains: String,
        $amountMin: Float, 
        $amountMax: Float, 
        $status: String, 
        $startAt: String, 
        $endAt: String 
    ) 
    {
        deposities( 
            statusChangedBy_Username: $statusChangedBy_Username,
            depositType:$depositType, 
            first: $first, 
            last: $last, 
            after: $after, 
            before: $before, 
            bank_Beneficiary_Icontains: $bank_Beneficiary_Icontains, 
            user_Username: $user_Username, 
            orderId_Icontains: $orderId_Icontains,
            amountMin: $amountMin, 
            amountMax: $amountMax, 
            status: $status, 
            startAt: $startAt, 
            endAt: $endAt,
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
                      }
                    createUser {
                        id
                        username
                    }
                    createdAt
                    depositType
                    manualType
                    amount
                    auditAmount
                    status
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
    }
`
        
export default function useManualDepositReviewQuery({statusChangedBy_Username,depositType, rowsPerPage, after, before, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt}) {
    let variables = {statusChangedBy_Username,depositType, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt};
    if (startAt) variables.startAt = startAt;
    if (endAt) variables.endAt = endAt;
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
          query: MANUAL_DEPOSIT_REVIEW_QUERY,
          variables,
          defs: [statusChangedBy_Username,depositType, rowsPerPage, after, before, bank_Beneficiary_Icontains, user_Username, orderId_Icontains, amountMin, amountMax, mutation, status, startAt, endAt],
      })
  }