import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const MEMBER_LEVELS_QUERRY = gql`query MemberLevelQuery {
        memberLevels(first:100) {
          edges {
            node {
              id
              name
              pk
            }
          } 
        } 
}`

export const ADD_BANK_QUERY = gql` 
mutation($bankName: String, $bankAccount: String, $beneficiary: String!, $bankBranch: String!, $payType: ID){
  bank(input:{
    depositType:"company"
    transactionType:"deposit"
    bankName: $bankName
    bankAccount: $bankAccount
    beneficiary: $beneficiary
    bankBranch: $bankBranch
    platformType:"all"
    payType: $payType
  }) {
    clientMutationId
    errors{
      field
      messages
    }
    bank{
      pk
      id
    }
  }
}
`

export const ADD_DEPOSIT_RULE_QUERY = gql` 
mutation($bank: ID!, $singleMinDeposit: Int, $singleMaxDeposit: Int, $perDayMaxDepositAmount: Float, $perDayMaxDepositTimes: Int, $depositPercentageFee: Float, $depositLevels: [ID]){
  depositRule(input:{
    bank: $bank
    singleMinDeposit: $singleMinDeposit
    singleMaxDeposit: $singleMaxDeposit
    perDayMaxDepositAmount: $perDayMaxDepositAmount
    perDayMaxDepositTimes: $perDayMaxDepositTimes
    depositPercentageFee: $depositPercentageFee
    depositLevels: $depositLevels
  }) {
    clientMutationId
    errors{
      field
      messages
    }
    depositRule{
      pk
      id
    }
  }
}
`

export const ADD_DEPOSIT_BONUS_QUERY = gql` 
mutation($bank: ID!, $depositType: String!, $depositAmount: Float, $discountPercentRatio: Float, $maxPromoAmount: Int, $minBetTimesAmount: Int){
  depositBonus(input:{
    bank: $bank
    depositType: $depositType
    depositAmount: $depositAmount
    discountPercentRatio: $discountPercentRatio
    maxPromoAmount: $maxPromoAmount
    minBetTimesAmount: $minBetTimesAmount
  }) {
    clientMutationId
    errors{
      field
      messages
    }
    depositBonus{
      pk
      id
    }
  }
}
`

export default function useMemberLevels({ first, pk, rowsPerPage, after, before, status, mutation }) {
    let variables = {mutation, status, pk, first};
    return useQuery({ 
        query: MEMBER_LEVELS_QUERRY,
        variables,
        defs: [rowsPerPage, after, before, status, mutation, pk, first]
    })
}