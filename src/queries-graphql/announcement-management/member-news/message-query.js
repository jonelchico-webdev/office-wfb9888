import useQuery from '../../../hooks/use-query'
import gql from 'graphql-tag'

const MESSAGES_QUERY = gql `query privateMessagesRead(
    $enabled: Boolean,
    $startAt: String,
    $endAt: String,
    $fromUser_Username: ID,
    $toUser_Username: ID,
    $isRead: Boolean,
    $before: String,
    $after: String,
    $first: Int,
    $last: Int,
  ){
    privateMessages(
      enabled: $enabled
      startAt: $startAt,
      endAt: $endAt,
      fromUser_Username: $fromUser_Username,
      toUser_Username: $toUser_Username,
      isRead: $isRead
      before: $before,
      after: $after,
      first: $first,
      last: $last,
    ) {
      edges {
        node {
          id
          title
          message
          messageType{
            key
            value
          }
          fromUser{
            id
            username
          }
          toUser{
            id
            username
          }
          isRead
          enabled
          createdAt
          updatedAt
        }
      }
      totalCount
      edgeCount
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

const MESSAGES_QUERY_ID = gql `query privateMessagesRead(
    $id: ID,
    $startAt: String,
    $endAt: String,
  ){
    privateMessages(
      id: $id,
      startAt: $startAt,
      endAt: $endAt,
    ) {
      edges {
        node {
          id
          title
          message
          messageType{
            key
            value
          }
          fromUser{
            id
            username
          }
          toUser{
            id
            username
          }
          isRead
          enabled
          createdAt
          updatedAt
        }
      }
    }
}`

export function useMessageQuery({ refresh, enabled, startAt, endAt, toUser_Username, fromUser_Username, isRead, rowsPerPage, before, after, page, first }) {
    let variables = { refresh, enabled, startAt, endAt, toUser_Username, fromUser_Username, isRead, rowsPerPage, before, after, page, first }; 

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
        query: MESSAGES_QUERY,
        variables,
        defs: [refresh, enabled, startAt, endAt, toUser_Username, fromUser_Username, isRead, rowsPerPage, before, after, page, first]
    })
}

export function useMessageQueryID({ id, startAt, endAt }) {
  let variables = { id, startAt, endAt }; 

  return useQuery({
      query: MESSAGES_QUERY_ID,
      variables,
      defs: [id, startAt, endAt]
  })
}
