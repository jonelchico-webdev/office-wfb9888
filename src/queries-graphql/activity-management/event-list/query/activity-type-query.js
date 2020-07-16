import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const ACTIVITY_TYPE_QUERY = gql`
    query ActivityTypes(
            $name:String,
            $after: String, 
            $before: String, 
            $enabled: Boolean,
            $first: Int, 
            $last: Int, 
    ){
   gameEventTypes(
        name:$name
        after: $after, 
        before: $before, 
        enabled: $enabled,
        first: $first, 
        last: $last, 
        ) {
        edges {
          node {
            id
            name
            description
            weight
            enabled
          }
        }
        totalCount
        startCursorNum
        endCursorNum
        pageInfo{
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
   }
}
`;

export default function useActivityTypeListQuery({  after, before, rowsPerPage, mutation, title, name, enabled }) {
    let variables = {mutation, rowsPerPage,title, name};

    if(enabled !== "") {
        variables = {
            ...variables,
            enabled
        }
    }

    if(!after && !before) {
        variables.first = rowsPerPage;
    }
    return useQuery({
        query:  ACTIVITY_TYPE_QUERY,
        variables,
        defs: [mutation, rowsPerPage, after, before, title, enabled]
    })
}