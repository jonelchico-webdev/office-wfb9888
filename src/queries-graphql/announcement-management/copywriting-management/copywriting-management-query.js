import useQuery from '../../../hooks/use-query'
import gql from 'graphql-tag'

const COPYWRITING_MANAGEMENT_QUERY = gql `query CopywritingManagement(
    $title_Icontains: String
){
    systemDocs(title_Icontains: $title_Icontains, enabled: true) {
      edges {
        node {
          id
          pk
          title
          position
          weight
          createUser {
            username
          }
          statusChangedBy {
            username
          }
          statusChangedAt
          message
          enabled
        }
      }
    }
}`

const COPYWRITING_MANAGEMENT_ID_QUERY = gql `query CopywritingManagement(
    $id: ID
){
    systemDocs(id: $id) {
      edges {
        node {
          id
          pk
          title
          position
          weight
          createUser {
            username
          }
          statusChangedBy {
            username
          }
          statusChangedAt
          message
          enabled
        }
      }
    }
}`

export function useCopywritingManagement({ refresh, enabled, title_Icontains }) {
    let variables = { refresh, enabled, title_Icontains }; 

    // if (after) {
    //     variables.first = rowsPerPage;
    //     variables.after = after;
    // }
    // if (before) {
    //     variables.last = rowsPerPage;
    //     variables.before = before;
    // }
    // if (!after && !before) {
    //     variables.first = rowsPerPage;
    // }

    return useQuery({
        query: COPYWRITING_MANAGEMENT_QUERY,
        variables,
        defs: [refresh, enabled, title_Icontains]
    })
}

export function useCopywritingManagementID({ id }) {
  let variables = { id }; 

  return useQuery({
      query: COPYWRITING_MANAGEMENT_ID_QUERY,
      variables,
      defs: [id]
  })
}
