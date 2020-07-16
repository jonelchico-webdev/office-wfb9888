import useQuery from '../../../hooks/use-query'
import gql from 'graphql-tag'

const BACKGROUND_USER_RIGHTS_MANAGEMENT_QUERY = gql `query showgroup(
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String,  
){
  systemGroup(
    first: $first, 
    last: $last, 
    after: $after, 
    before: $before, 
  ) {
    edges {
      node {
        id
        name
        pk
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
}`

const BACKGROUND_USER_RIGHTS_MANAGEMENT_ID_QUERY = gql `query ShowGroup(
    $id: ID
  ){
  systemGroup(id: $id) {
    edges {
      node {
        id
        name
        pk
        permissions{
          edges{
            node{
              id
              pk
              name
              codename
              descCn
            }
          }
        }
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
}`

const SYSTEM_PERMISSION_QUERY = gql `query showSystempermission{
  systemPermission {
    edges {
      node {
        pk
        codename
        descCn
      }
    }
  }
}`

export function useBackgroundUserRightsManagement({ refresh, after, rowsPerPage, before, }) {
    let variables = { refresh, after, rowsPerPage, before, }; 

    if (after) {
        variables.first = rowsPerPage;
        variables.after = after;
    }
    if (before) {
        variables.last = rowsPerPage;
        variables.before = before;
    }
    if (!after && !before) {
        variables.first = rowsPerPage;
    }

    return useQuery({
        query: BACKGROUND_USER_RIGHTS_MANAGEMENT_QUERY,
        variables,
        defs: [refresh, after, rowsPerPage, before,]
    })
}

export function useBackgroundUserRightsIDManagement({ id }) {
  let variables = { id }; 

  return useQuery({
      query: BACKGROUND_USER_RIGHTS_MANAGEMENT_ID_QUERY,
      variables,
      defs: [id]
  })
}

export function useSystemPermissionQuery({ refresh }) {
  let variables = { refresh }; 

  return useQuery({
      query: SYSTEM_PERMISSION_QUERY,
      variables,
      defs: [refresh]
  })
}
