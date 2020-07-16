import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'
// import { useQuery } from 'react-apollo-hooks';

const ONLINE_PAYMENTS_PLATFORM_QUERY = gql`query BankAccountQuery($id: ID, $deletedFlag: Boolean, $depositType: String, $first: Int, $last: Int, $after: String, $before: String) {
    banks(deletedFlag: $deletedFlag, id: $id, depositType: $depositType, first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            id
            pk
            merchantDomainName
            businessType
            businessCode
            bankName
            beneficiary
            bankAccount
            payType{
              id
              name
            }
            payVendor{
              id
              name
            }
            bankBranch
            paymentType
            platformType
            deletedFlag
            bankRule {
              edges {
                node {
                  id
                  perDayMaxDepositAmount
                  singleMinDeposit
                  singleMaxDeposit
                  perDayMaxDepositTimes
                  depositPercentageFee
                  useCompany {
                    id
                    name
                  }
                  depositLevels {
                    edges {
                      node {
                        id
                        name
                        pk
                      }
                    }
                  }
                }
              }
            }
            bankBonus {
              edges {
                node {
                  id
                  bank {
                    id
                  }
                  depositType
                  depositAmount
                  discountPercentRatio
                  maxPromoAmount
                  minBetTimesAmount
                }
              }
            }
            maxDepositAmount
            totalAmount
            todayAmount
            status
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

export default function useOnlinePaymentPlatform({ deletedFlag, id, depositType, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, depositType, status, id, deletedFlag};
    // if(fromDate) variables.fromDate = fromDate;
    // if(toDate) variables.toDate = toDate;
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
        query: ONLINE_PAYMENTS_PLATFORM_QUERY,
        variables,
        defs: [depositType, rowsPerPage, after, before, status, mutation, id, deletedFlag]
    })
}