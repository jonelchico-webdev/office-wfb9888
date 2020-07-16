import gql from 'graphql-tag' 

export const ADD_USER_MUTATION = gql`
mutation($captcha: String!, 
        $captchaKey: String!, 
        $username: String!, 
        $name: String!, 
        $password: String!,
        $passwordRepeat: String!,
        $phone: String,
        $qqNumber: Int,
        $email: String,
        $isActive: Boolean,
        $parentAffiliateUsername: String,
    ){
        Register(input: {
        captcha:$captcha
        captchaKey: $captchaKey
        username:$username
        name:$name
        phone:$phone
        password:$password
        passwordRepeat:$passwordRepeat
        qqNumber:$qqNumber
        email:$email
        isActive:$isActive
        parentAffiliateUsername:$parentAffiliateUsername
	}) {
		success
        errors 
	}
}
`