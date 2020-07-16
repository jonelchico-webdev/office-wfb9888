import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const COMMISSION_QUERY = gql`query Commission($commissionType_In: String, $first: Int, $last: Int, $after: String, $before: String, $commissionType: String) {
    commissions(commissionType_In: $commissionType_In, first: $first, last: $last, after: $after, before: $before, commissionType: $commissionType) {
      edges {
        node {
          id
          createdAt
          updatedAt
          name
          payPeriod
          commissionType
          enabled
          createdBy{
            id
            username
          }
          updatedBy{
            id
            username
          }
          issuanceType
          minHasBetDescendantCount
          minHasDepositedDescendantCount
          lastPaidAt
          affiliateProfiles {
            edges {
              node {
                id
              }
            }
          }
          gameTypeVendors {
            edges {
              node {
                id
                commission {
                  id
                }
                gameType {
                  id
                }
              }
            }
          }
          rules {
            edges {
              node {
                id
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
}`

const COMMISSION_ID_QUERY = gql`query Commission($id: ID!) {
  commission(id: $id) {
        id
        createdAt
        updatedAt
        name
        payPeriod
        commissionType
        issuanceType
        minHasBetDescendantCount
        minHasDepositedDescendantCount
        lastPaidAt
        affiliateProfiles {
          edges {
            node {
              id
              user {
                id
                username
              }
            }
          }
        }
        gameTypeVendors {
          edges {
            node {
              id
              enabled
              commission {
                id
              }
              gameType {
                id
                name
              }
              gameVendor {
                id
                name
              }
            }
          }
        }
        rules {
          edges {
            node {
              id
            }
          }
        }  
  }
}
`

const COMMISSION_VENDOR_QUERY = gql`query CommissionVendors($commission: ID) {
  commissionGameTypeVendors(commission: $commission) {
    edges {
      node {
        id
        commission {
          id
          name
        }
        gameType {
          id
          name
          enabled
        }
        gameVendor {
          id
          name
          enabled
        }
      }
    }
  }
}`

const COMMISSION_RULE_ID_QUERY = gql`query CommissionRuleID($commission: ID) {
  commissionRules(commission: $commission) {
    edges {
      node {
        id
        minDescendantsSumOfActionsAmount
        minDescendantsCount
        ratioStrategy
        genericRatio
        gameTypeVendorRatios{
          edges {
            node {
              gameType {
                id
                name
              }
              commissionGameTypeVendor {
                id
                gameVendor {
                  id
                  name
                }
              }
              value
            }
          }
        }
      }
    }
  }
}`

const COMMISSION_VENDOR_RATIO_ID_QUERY = gql`query CommissionVendorRatio($commissionRule: ID) {
  commissionGameTypeVendorRatios(commissionRule: $commissionRule) {
    edges {
      node {
        id
        createdAt
        updatedAt
        value
        enabled
        commissionGameTypeVendor{
          id
        }
        gameType {
          id
          name
          enabled
        }
        vendor {
          id
          name
        }
      }
    }
  }
}`

export function useCommissionQuery({ mutation, rowsPerPage, before, after, commissionType_In }) {
    let variables = { mutation, rowsPerPage, before, after, commissionType_In };
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
        query:  COMMISSION_QUERY,
        variables,
        defs: [mutation, rowsPerPage, before, after, commissionType_In]
    })
} 

export function useCommissionIdQuery({ mutation, id }) {
  let variables = { mutation, id };
  // if(fromDate) variables.fromDate = fromDate;
  // if(toDate) variables.toDate = toDate;

  return useQuery({ 
      query:  COMMISSION_ID_QUERY,
      variables,
      defs: [mutation, id]
  })
} 

export function useCommissionRuleIdQuery({ mutation, commission }) {
  let variables = { commission, mutation };
  // if(fromDate) variables.fromDate = fromDate;
  // if(toDate) variables.toDate = toDate;

  return useQuery({ 
      query:  COMMISSION_RULE_ID_QUERY,
      variables,
      defs: [commission, mutation]
  })
} 

export function useCommissionVendorRatioIdQuery({ mutation, commissionRule }) {
  let variables = { commissionRule, mutation };
  // if(fromDate) variables.fromDate = fromDate;
  // if(toDate) variables.toDate = toDate;

  return useQuery({ 
      query:  COMMISSION_VENDOR_RATIO_ID_QUERY,
      variables,
      defs: [commissionRule, mutation]
  })
} 

export function useCommissionGameTypeQuery({ mutation, commission, rowsPerPage, before, after }) {
  let variables = { mutation, commission, rowsPerPage, before, after };
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
      query:  COMMISSION_VENDOR_QUERY,
      variables,
      defs: [mutation, commission, rowsPerPage, before, after]
  })
} 