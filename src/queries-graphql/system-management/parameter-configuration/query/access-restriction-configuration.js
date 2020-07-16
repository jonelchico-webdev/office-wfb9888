import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const ACCESS_RESTRICTRION_CONFIGURATION_QUERY = gql`
query config{
	configurations {
        ipWhitelistFrontend   
        ipBlacklistFrontend    
        ipWhitelistBackend  
        ipBlacklistBackend
	}
  }`



export default function useAccessRestrictionConfigurationQuery({refresh}) {
	let variables = {refresh}
	return useQuery({
        query: ACCESS_RESTRICTRION_CONFIGURATION_QUERY,
        variables,
        defs: [refresh]
    })
}