import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const ALL_DATA = gql`
query ShowstaffuserQuery($first: Int, $last: Int, $after: String, $before: String){
    users(isStaff:true, isActive: true first: $first, last: $last, after: $after, before: $before) {
      edges {
        node {
          id
          pk
          username
          name
          groups {
            edges {
              node {
                name
              }
            }
          }
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
}`

export const ADD_MUTATE = gql`
    mutation Addstaffuser($name: String!, $username: String!){
        user(input:{
            name: $name
            username: $username
            isStaff:true
            isActive:true
        }) {
            errors{
                messages
                field
            }
        }
    }
`

export const EDIT_MUTATE = gql`
    mutation Editstaffuser($id: ID, $name: String!, $username: String!){
        user(input:{
            id: $id
            name: $name
            username: $username
            isStaff:true
            isActive:true
        }) {
            errors{
                messages
                field
            }
        }
    }
`

export const DELETE_MUTATE = gql`
    mutation Editstaffuser($id: ID, $name: String!, $username: String!){
        user(input:{
            id: $id
            name: $name
            username: $username
            isActive:false
        }) {
            errors{
                messages
                field
            }
        }
    }
`

export function useShowstaffuserQuery({ isStaff, reload, rowsPerPage, after, before }) {
    let variables = { isStaff, reload, rowsPerPage, after, before }
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
		query: ALL_DATA,
		variables,
		defs: [isStaff, reload, rowsPerPage, after, before]
	})
}