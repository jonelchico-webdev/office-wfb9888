import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const GAME_EVENT_TYPE_QUERY = gql`
query GameEventType{
    gameEventTypes{
      edges{
        node{
          id
          name
          pk
        }
      }
    }
  }
`

export default function useGameEventTypeQuery({ mutation }) {
    let variables = {mutation};

    return useQuery({ 
        query:  GAME_EVENT_TYPE_QUERY,
        variables,
        defs: [mutation]
    })
} 