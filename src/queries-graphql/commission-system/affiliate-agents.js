import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const AGENT_LIST_QUERY = gql`query Agents($level: Int, $first: Int){
    affiliateProfiles(level: $level, first: $first){
      edges{
        node{
          id
          pk
          user{
            id
            username
            pk
          }
        }
      }
    }
}`

export default function useAgentListQuery({ level, first, mutation }) {
    let variables = {level, first, mutation};
    // if(fromDate) variables.fromDate = fromDate;
    // if(toDate) variables.toDate = toDate;
    // if(after) {
    //     variables.first = rowsPerPage;
    //     variables.after = after;
    // }
    // if(before) {
    //     variables.last = rowsPerPage;
    //     variables.before = before;
    // }
    // if(!after && !before) {
    //     variables.first = rowsPerPage;
    // }
    return useQuery({ 
        query: AGENT_LIST_QUERY,
        variables,
        defs: [level, first, mutation]
    })
} 