import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const GAME_EVENT_VALUE_QUERY = gql`
query GameEventValues(
    $event: ID
    $deletedFlag: Boolean
){
    gameEventValues(
        event: $event
        deletedFlag: $deletedFlag
    ) {
        edges {
            node {
                id
                event {
                    id
                    title
                }
                minValue
                maxValue
                rewardAmount
                isPercent
                deletedFlag
            }
        }
    }
}
`

export default function useGameEventValueQuery({ mutation, event, deletedFlag }) {
    let variables = {mutation, event, deletedFlag};

    return useQuery({ 
        query:  GAME_EVENT_VALUE_QUERY,
        variables,
        defs: [mutation, event, deletedFlag]
    })
} 