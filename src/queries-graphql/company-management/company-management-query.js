import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const COMPANIES_QUERY = gql`query Companies {
    companies{
      edges{
        node{
          id
          pk
          name
          systemCode
          admin {
            id
            name
            username
            lastLoginIp
            lastOnlineAt
          }
          createdAt
          updatedAt
          status
          statusChangedAt
          statusChangedBy{
            id
            name
            username
          }
          bankRuleCompany{
            edges{
              node{
                id
                bank{
                  id
                  bankName
                }
                singleMinDeposit
                singleMaxDeposit
                perDayMaxDepositTimes
                perDayMaxDepositAmount
                depositPercentageFee
                transactionTimeout
                quickPayValues
                useCompany{
                  id
                  name
                }
              }
            }
          }
        }
      }
      totalCount
      startCursorNum
      endCursorNum
      pageInfo{
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
}
`

export default function useCompaniesQuery({ deletedFlag, after, before, rowsPerPage, mutation, title, startAt, endAt, eventType, enabled, devicesTypes }) {
    let variables = {mutation, deletedFlag, after, rowsPerPage, before, title, startAt, endAt, eventType, devicesTypes};

    if(enabled !== "") {
        variables = {
            ...variables,
            enabled
        }   
    }

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
        query:  COMPANIES_QUERY,
        variables,
        defs: [mutation, deletedFlag, rowsPerPage, after, before, title, startAt, endAt, eventType, enabled, devicesTypes]
    })
} 