import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

export const DEPOSITIES = gql`query Deposities($first: Int, $last: Int, $after: String, $before: String, 
    $startAt: String, $endAt:  String, $amountMin: Float, $amountMax: Float, $status: String, $user_Username_Icontains: ID
  ) {
  deposities(depositType:  "manual", first: $first, last: $last, after: $after, before: $before, 
    startAt: $startAt, endAt:  $endAt, amountMin: $amountMin, amountMax: $amountMax, status: $status, user_Username_Icontains: $user_Username_Icontains) {
    edges {
      node {
        id
        pk
        amount
        orderId
        status
        user {
          id
          username
          affiliateprofileStatus {
            edges {
              node {
                id
                parent {
                  id
                  user {
                    username
                  }
                }
              }
            }
          }
        }
        internalNote
        createdAt
        statusChangedBy {
          id
          username
        }
        updatedAt
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

export const COMPANY_DEPOSIT_REVIEW_MUTATE = gql` 
    mutation($orderId: String, $amount: Float, $status: String){
        depositApproval(input: {orderId: $orderId, amount: $amount, status: $status}) {
			clientMutationId
			errors {
				field
				messages
			}
			deposit {
				id
				pk
				status
			}
		}
    }
`

export const APPROVE_ONE = gql`
  mutation ApproveGameEve($id: ID, $status: String){
    gameEventParticipateApproval(input:{
      id: $id
      status: $status
    }){
      errors{
        messages
      }
    }
  }  
`


export default function useDeposities({rowsPerPage, after, before, mutation, startAt, endAt, amountMin, amountMax, status, user_Username_Icontains}) {
  let variables = {after, before, mutation, startAt, endAt, amountMin, amountMax, status, user_Username_Icontains};
 
  // let variables = {after, before, mutation, status, user, startAt, gameEvent, endAt, id, rewardAmountMax, rewardAmountMin, gameEvent_Title_Icontains, user_AffiliateUsername_Icontains, user_Username_Icontains};
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
		query: DEPOSITIES,
		variables,
		defs: [rowsPerPage, after, before, mutation, startAt, endAt, amountMin, amountMax, status, user_Username_Icontains]
	})
}