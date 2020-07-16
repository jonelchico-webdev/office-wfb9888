import gql from 'graphql-tag'

export const DELETE_MESSAGE_MUTATION = gql` 
mutation privateMessageUpdate(
    $id: String,
    $enabled: Boolean
){
    privateMessage(input:{
      id: $id
      enabled: $enabled
    }) {
      id
      enabled
      errors{
        field
        messages
      }
    }
  }
`

export const READ_MESSAGE_MUTATION = gql` 
mutation privateMessageUpdate(
    $id: String,
    $isRead: Boolean
){
    privateMessage(input:{
      id: $id
      isRead: $isRead
    }) {
      id
      isRead
      errors{
        field
        messages
      }
    }
  }
`