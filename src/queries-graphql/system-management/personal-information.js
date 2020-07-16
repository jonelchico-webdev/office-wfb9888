import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const PERSONAL_INFORMATION_QUERY = gql`
query PersonalInformationQuery($username: String) {
	users(username: $username) {
		edges {
			node {
				id
				username
				phone
				email
				name
			}
		}
	}
}`

const PERSONAL_TRANSACTION_STATUS_QUERY = gql`
query PersonalTransactionStatusQuery($userId: Int, $userName: String){
    userTransactionStatses(userId: $userId, userName: $userName) {
        edges {
          node {
            id
            depositCount
            depositTotal
            withdrawalCount
            withdrawalTotal
          }
        }
      } 
}
`

const PERSONAL_BANKCARD_QUERY = gql`
	query PersonalBankcardQuery($user_Username: ID ) {
		userCards(user_Username: $user_Username) {
			edges {
				node {
					id
					bankName
					cardNumber
					nameOnCard
					branch
				}
			}
		}
	}
`

export const UPDATE_PERSONAL_INFORMATION_MUTATE = gql`
    mutation updatePersonalInformationMutate($id: ID, $username: String!, $name: String!, $phone: String,  $email: String){
        user(input:{
			id: $id
			username: $username
            name: $name
            phone: $phone
            email:$email
        })
        {
        errors{
            messages
            field
        }
        }
    }
`
export const CHANGE_PASSWORD_MUTATE = gql`
    mutation ChangePassMutate( $passwordOld: String!, $password: String!, $confirmPassword: String!){
        ChangePassword (input:{
			passwordOld: $passwordOld
            password: $password
            passwordRepeat: $confirmPassword
        }){
            success
            errors
        }
  }
`

export function usePersonalInformationQuery({ username }) {
	let variables = { username }
	return useQuery({
		query: PERSONAL_INFORMATION_QUERY,
		variables,
		defs: [username]
	})
}

export function usePersonalTransactionStatusQuery({ userName }) {
	let variables = { userName };
	
	return useQuery({
		query: PERSONAL_TRANSACTION_STATUS_QUERY,
		variables,
		defs: [userName]
	})
}

export function usePersonalBankCardQuery({user_Username}) {
	let variables = {user_Username}
	return useQuery({
        query: PERSONAL_BANKCARD_QUERY,
        variables,
        defs: [user_Username]
    })
}