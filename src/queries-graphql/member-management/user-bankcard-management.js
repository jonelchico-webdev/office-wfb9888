import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const USER_BANK_CARD = gql`query 
	UserBankCard ($bankName_Istartswith: String, $user_Username_Icontains: ID,
		$nameOnCard_Icontains: String, $status: String, $first: Int, $last: Int, $after: String, $before: String, $cardNumber: String){
		userCards(bankName_Istartswith: $bankName_Istartswith, user_Username_Icontains: $user_Username_Icontains,
			nameOnCard_Icontains: $nameOnCard_Icontains, status: $status, first: $first, last: $last, after: $after, before: $before, cardNumber: $cardNumber) {
			edges {
				node {
					id
					user {
					  id
					  name 
					  username
					}
					cardNumber
					bankName
					nameOnCard
					city {
						id
					}
					branch
					enabled
					user {
						id
					}
					pk
					status
					statusChangedAt
					statusChangedBy {
						id
					}
					createdAt
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

export const UNTIED_MUTATION = gql`
	mutation CardCancelled($id : ID, $status: String){
		userCard(input:{
			id: $id
			status: $status
		}) {
			userCard {
			id
			}
			clientMutationId
		}
	}
`

export default function useUserBankCard({mutation, bankName_Istartswith, 
    nameOnCard_Icontains, status, rowsPerPage, after, before, user_Username_Icontains, cardNumber}){
	let variables = {mutation, bankName_Istartswith, 
		nameOnCard_Icontains, status, rowsPerPage, after, before, user_Username_Icontains, cardNumber};
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
        query: USER_BANK_CARD,
        variables,
        defs: [mutation, bankName_Istartswith, 
			nameOnCard_Icontains, status, rowsPerPage, after, before, user_Username_Icontains, cardNumber]
    })
}