import gql from 'graphql-tag'
import useQuery from '../hooks/use-query'

// export const LOGIN_MUTATE = gql`
// mutation loginMutate($username: String! $password: String!) {
// 	login(
// 		username: $username
// 		password: $password
// 	) {
// 		token
// 	}
// }`



export const LOGIN_MUTATE_BASIC = gql`
mutation($username: String!, $password: String!, $appAutoLogin: Boolean!) {
	Login(input: {
		username: $username,
		password: $password,
		appAutoLogin: $appAutoLogin
	}) {
		token
		success
		verified
		clientMutationId
		errors{
			field
			messages
		}
	}
}
`

export const LOGIN_MUTATE = gql`
mutation($username: String!, $password: String!, $appAutoLogin: Boolean!) {
	loginBackend(input: {
		username: $username,
		password: $password,
		appAutoLogin: $appAutoLogin
	}) {
		token
		clientMutationId
		errors{
			field
			messages
		}
		profile{
			id
			username
			userType
		}
	}
}
`


export const LOGIN_VALIDATE = gql`
mutation($username: String!, $password: String!, $captcha: String!, $captchaKey: String!) {
	LoginGetValidate(input: {
		username: $username
		   password: $password
		   captcha: $captcha
		   captchaKey: $captchaKey
	}) {
		success
		isOtpEnabled
		isSmsEnabled
		username
		errors
	}
}
`


export const GET_CAPTCHA = gql`
mutation{
	 GetCaptcha {
		success
		imagePath
		requestIp
		captchaKey
	 }
}
`

const USER_QUERY = gql`
query UserQuery($username: String ) {
	users (username: $username) {
		edges {
			node {
				id
			}
		}
	}
}
`


export function useUserQuery({ username }) {
	let variables = { username }

	return useQuery({
		query: USER_QUERY,
		variables,
		defs: []
	})
}