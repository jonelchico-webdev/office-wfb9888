import useQuery from "../../../../hooks/use-query";
import gql from "graphql-tag";
const ACTIVITY_TYPE_ID_QUERY = gql`
query ActivityTypes($id:ID!){
   gameEventTypes(id:$id) {
        edges {
          node {
            id
            name
            description
            weight
            enabled
          }
        }
   }
}
`;

export default function useActivityTypeQuery({ after, before, rowsPerPage, mutation, id }) {
    let variables = {mutation, after, rowsPerPage, before, id};

    return useQuery({
        query:  ACTIVITY_TYPE_ID_QUERY,
        variables,
        defs: [mutation, rowsPerPage, after, before, id]
    })
}