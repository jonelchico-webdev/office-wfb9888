import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const REGISTRATION_AND_LOGIN_CONFIGURATION_QUERY = gql`
query config{
	configurations {
	  signupWebsite   
	  signupMobile    
	  captchaVerifyCanceal  
	  baseUrlFrontEnd  
	  pathAffiliateUrl      
	  systemPermission 
	}
  }`



export default function useRegistrationAndLoginConfigurationQuery({refresh}) {
	let variables = {refresh}
	return useQuery({
        query: REGISTRATION_AND_LOGIN_CONFIGURATION_QUERY,
        variables,
        defs: [refresh]
    })
}