import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const USER_BANK_CARD = gql`
    query MemberVIPSystem($name: String, $first: Int, $last: Int, $after: String, $before: String){
        vipLevels(name: $name, first: $first, last: $last, after: $after, before: $before, enabled: true){
            edges {
                node {
                    id
                    name
                    requiredPoints
                    upgradeAmount
                    enabled
                    icon
                    pk
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

export const ADD_LEVEL = gql`
    mutation addVIPLevels($name: String!, $requiredPoints: Int, $upgradeAmount: Int){
        vipLevel(input: {
            name: $name
            requiredPoints: $requiredPoints
            upgradeAmount: $upgradeAmount
            enabled: true
        }){
            errors{
                messages
            }
            vipLevel {
                id
            }
        }
    }
`

export const UPDATE_LEVEL = gql`
    mutation updateVIPLevels($id: ID, $name: String!, $requiredPoints: Int, $upgradeAmount: Int){
        vipLevel(input: {
            id: $id
            name: $name
            requiredPoints: $requiredPoints
            upgradeAmount: $upgradeAmount
            enabled: true
        }){
            errors{
                messages
            }
            vipLevel {
                id
            }
        }
    }
`

export const DELETE_LEVEL = gql`
    mutation deleteVIPLevels($id: ID, $name: String!, $enabled: Boolean){
        vipLevel(input: {
            id: $id
            name: $name
            enabled: $enabled
        }){
            errors{
                messages
            }
            vipLevel {
                id
            }
        }
    }
`

export default function useMemberVIPSystem({mutation, rowsPerPage, after, before, name}){
	let variables = {mutation, rowsPerPage, name, after, before};
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
        defs: [mutation, rowsPerPage, after, before, name]
    })
}