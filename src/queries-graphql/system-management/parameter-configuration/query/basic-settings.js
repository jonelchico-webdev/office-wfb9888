import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const FRONT_DESK_MAINTENANCE_MANAGEMENT_QUERY = gql`
query FrontDeskMaintenanceManagementQuery {
  configurations {
    websiteMaintain
    websiteMaintainTime
  }
}`

export function useFrontDeskMaintenanceManagementQuery() {
	return useQuery({
		query: FRONT_DESK_MAINTENANCE_MANAGEMENT_QUERY,
		defs: []
	})
}

const PLATFORM_CONFIGURATION_QUERY = gql`
query PlatformConfigurationQuery {
  configurations {
    websiteTitle
    websiteKeywords
	websiteDescription
  }
}`

export function usePlatformConfigurationQuery() {
	return useQuery({
		query: PLATFORM_CONFIGURATION_QUERY,
		defs: []
	})
}