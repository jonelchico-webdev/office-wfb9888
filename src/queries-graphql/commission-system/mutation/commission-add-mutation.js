import gql from 'graphql-tag'

export const ADD_COMMISSION = gql` 
mutation AddCommission(
    $name: String!, 
    $payPeriod: String, 
    $commissionType: String
    $issuanceType: String
    $minHasBetDescendantCount: Int,
    $minHasDepositedDescendantCount: Int
    $affiliateProfiles: String
    ) {
        commission (input:{
        name:$name
        payPeriod:$payPeriod
        commissionType:$commissionType
        issuanceType:$issuanceType
        minHasBetDescendantCount:$minHasBetDescendantCount
        minHasDepositedDescendantCount:$minHasDepositedDescendantCount
        affiliateProfiles:$affiliateProfiles
    }){
        id
        createdAt
        updatedAt
        name
        payPeriod
        commissionType
        issuanceType
        affiliateProfiles
        errors{
            field
            messages
        }
    }
}
`

export const MODIFY_COMMISSION = gql` 
mutation AddCommission(
    $id: String,
    $name: String!, 
    $payPeriod: String, 
    $commissionType: String
    $issuanceType: String
    $minHasBetDescendantCount: Int,
    $minHasDepositedDescendantCount: Int
    $affiliateProfiles: String
    ) {
        commission (input:{
        id: $id
        name:$name
        payPeriod:$payPeriod
        commissionType:$commissionType
        issuanceType:$issuanceType
        minHasBetDescendantCount:$minHasBetDescendantCount
        minHasDepositedDescendantCount:$minHasDepositedDescendantCount
        affiliateProfiles:$affiliateProfiles
    }){
        id
        createdAt
        updatedAt
        name
        payPeriod
        commissionType
        issuanceType
        affiliateProfiles
        errors{
            field
            messages
        }
    }
}
`

export const ADD_COMMISSION_RULE = gql` 
mutation AddCommissionRules(
    $commission: String!,
    $ratioStrategy: String,
    $minDescendantsCount: Int,
    $minDescendantsSumOfActionsAmount: Float
    ) {
        commissionRule(input:{
            commission: $commission
            ratioStrategy: $ratioStrategy
            minDescendantsCount: $minDescendantsCount
            minDescendantsSumOfActionsAmount: $minDescendantsSumOfActionsAmount
    }){
        id
        commission
        ratioStrategy
        minDescendantsCount
        minDescendantsSumOfActionsAmount
        errors{
            field
            messages
        }
    }
}
`

export const ADD_COMMISSION_RULE_DEFAULT = gql` 
mutation AddCommissionRules(
    $commission: String!
    ) {
        commissionRule(input:{
            commission: $commission
    }){
        id
        commission
        ratioStrategy
        minDescendantsCount
        minDescendantsSumOfActionsAmount
        errors{
            field
            messages
        }
    }
}
`

export const DELETE_COMMISSION_RULE = gql` 
mutation DeleteCommissionRules(
    $id: String!
    ) {
    commissionRuleDelete(input: {
      id: $id
    }) {
      id
      errors{
        field
        messages
      }
    }
  }
`

export const ADD_COMMISSION_RULE_VENDOR_RATIO = gql`
mutation AddCommissionRatio(
    $commissionGameTypeVendor: String!,
    $commissionRule: String!,
    $value: Float,
    $enabled: Boolean
    ) {
    commissionRuleGameTypeVendorRatio(input: {
        commissionGameTypeVendor: $commissionGameTypeVendor
        commissionRule: $commissionRule
        value: $value
        enabled: $enabled
    }) {
        id
        value
        enabled
        commissionRule
        commissionGameTypeVendor
        errors{
            field
            messages
        }
    }
  }
`