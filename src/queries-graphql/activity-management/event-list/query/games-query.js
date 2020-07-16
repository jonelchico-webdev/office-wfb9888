import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'


const GAMES_QUERY = gql`query Games {
    gameVendors(first: 100) {
        edges {
            node {
                id
                name
                pk
                gameType{
                    id
                    name
                }
            }
        }
    }
}`

export function useGameQuery({ mutation }) {
	let variables = {mutation}
	return useQuery({
		query: GAMES_QUERY,
		variables,
		defs: [mutation]
	})
}