import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'



const SYSTEM_NOTIF_QUERY = gql`query SystemNotifQuery($title: String, $weight: Int, $showType: String, $first: Int, $last: Int, $after: String, $before: String, $startat: String, $endat: String  ){
    announcements(title: $title, weight: $weight, showType: $showType, first: $first, last: $last, after: $after, before: $before, startat: $startat, endat: $endat, deletedFlag: false ) {
        edges {
          node {
            id
            pk  
            title 
            content
            showType  
            weight  
            createdAt 
            startAt  
            endAt  
            createdBy {
              id
              username
            }
            updatedBy {
              id
            }
            updatedAt
          }
          cursorNum 
        }
          totalCount 
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
         } 

      }
}`


const SYSTEM_NOTIF_VIEW_QUERY = gql`query SystemNotifViewQuery($id: ID, $startat: String){
  announcements (id: $id, startat: $startat){
    edges{
      node{
        id
        pk
        title
        createdAt
        startAt
        endAt
        showType
        content
        weight 
        picUrlPc
        picUrlMobile
      }
    }
  }
}`

export function useSystemData({id, startat}){
  let variables = {id, startat}

  return useQuery({
    query: SYSTEM_NOTIF_VIEW_QUERY,
    variables,
    defs: [id, startat]
  })
}
export default function useSystemNotif({ title, weight, showType, rowsPerPage, after, before, mutation, startat, endat, mutate}) {

  let variables = { title, weight, showType };

  if (startat) {
    variables.startat = startat;
  } if(endat){ 
    variables.endat = endat;
  } 
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
    query: SYSTEM_NOTIF_QUERY,
    variables,
    defs: [title, weight, showType, rowsPerPage, after, before, mutation, startat, endat, mutate]
  })
}
