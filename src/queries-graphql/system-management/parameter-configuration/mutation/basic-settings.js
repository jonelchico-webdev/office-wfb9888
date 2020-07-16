import gql from 'graphql-tag'

export const FRONT_DESK_MAINTENANCE_MANAGEMENT_MUTATION = gql`
mutation FrontDeskMaintenanceManagementMutation($websiteMaintain: Boolean, $websiteMaintainTime: String) {
	configuration(input: {
		websiteMaintain: $websiteMaintain
		websiteMaintainTime: $websiteMaintainTime
	}) {
		configuration {
			websiteMaintain
			websiteMaintainTime
		}
	}
}`

export const PLATFORM_CONFIGURATION_MUTATION = gql`
mutation PlatformConfigurationMutation($websiteTitle: String, $websiteKeywords: String, $websiteDescription: String) {
	configuration(input: {
		websiteTitle: $websiteTitle
		websiteKeywords: $websiteKeywords
		websiteDescription: $websiteDescription
	}) {
		configuration {
			websiteMaintain
			websiteMaintainTime
			websiteDescription
		}
	}
}`