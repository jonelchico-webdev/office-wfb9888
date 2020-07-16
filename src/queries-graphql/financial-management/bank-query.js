import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'
 
export const BANK_QUERY = gql`query BankQuery( $depositType: String!, $id: ID, $first: Int, $last: Int, 
                                    $after: String, $before: String, $deletedFlag: Boolean) {
  banks(depositType:$depositType, deletedFlag: $deletedFlag, id: $id, first: $first, last: $last, after: $after, before: $before) {
    edges {
        node {
          id
          pk
          bankName
          beneficiary
          bankAccount
          bankBranch
          platformType
          payType {
            id
            name
            pk
          }
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
          
          totalAmount
          todayAmount
          status
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

export const ADD_BANK_QUERY = gql` 
mutation($id: ID, $bankName: String, $bankAccount: String, $payType: ID, $beneficiary: String!, $bankBranch: String!){
  bank(input:{
    id: $id
    depositType:"company"
    transactionType:"deposit"
    payType: $payType
    bankName: $bankName
    bankAccount: $bankAccount
    beneficiary: $beneficiary
    bankBranch: $bankBranch
    platformType:"all"
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
mutation($id : ID!, $bank: ID!, $singleMinDeposit: Int, $singleMaxDeposit: Int, $perDayMaxDepositAmount: Float, $perDayMaxDepositTimes: Int, $depositPercentageFee: Float, $depositLevels: [ID]){
  depositRule(input:{
    id: $id
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

export const ADD_DEPOSIT_RULE_ID = gql` 
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
mutation($id : ID!, $bank: ID!, $depositType: String!, $depositAmount: Float, $discountPercentRatio: Float, $maxPromoAmount: Int, $minBetTimesAmount: Int){
  depositBonus(input:{
    id : $id
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

export const ADD_DEPOSIT_BONUS_ID = gql` 
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

// export const DELETE_BANKS = gql` 
// mutation($id: ID){
//   bank(input:{
//     id: $id
//     deletedFlag: true
//     depositType:"company"
//     transactionType:"deposit"
//     platformType:"all"
//   }) {
//     clientMutationId
//     errors{
//       field
//       messages
//     }
//     bank{
//       pk
//       id
//     }
//   }
// }

export default function useBankQuery({depositType, deletedFlag, id, rowsPerPage, after, before, mutation}) {
 
  let variables = {depositType, deletedFlag, id, after, before, mutation};
//   if(fromDate) variables.fromDate = fromDate;
//   if(toDate) variables.toDate = toDate;
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
		query: BANK_QUERY,
		variables,
		defs: [ depositType, deletedFlag, id, rowsPerPage, after, before, mutation ],
	})
}