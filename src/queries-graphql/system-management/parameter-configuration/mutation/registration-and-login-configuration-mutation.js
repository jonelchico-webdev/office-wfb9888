
import gql from 'graphql-tag'

export const REGISTRATION_AND_LOGIN_CONFIGURATION_MUTATION = gql` 
mutation RegistrationAndLoginConfigurationModify(
    $signupWebsite: Boolean,
    $signupMobile: Boolean,
    $captchaVerifyCanceal: Boolean,
    $baseUrlFrontEnd: String,
    $pathAffiliateUrl: String,
    $systemPermission: Boolean
) {
    configuration(input:{
      signupWebsite: $signupWebsite
      signupMobile: $signupMobile
      captchaVerifyCanceal: $captchaVerifyCanceal
      baseUrlFrontEnd: $baseUrlFrontEnd
      pathAffiliateUrl: $pathAffiliateUrl
      systemPermission: $systemPermission
    }){
      configuration {
        signupWebsite
        signupMobile
        captchaVerifyCanceal
        baseUrlFrontEnd
        systemPermission
      }
    }
  }
`

