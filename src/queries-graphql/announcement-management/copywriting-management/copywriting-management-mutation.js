import gql from 'graphql-tag'

export const COPYWRITING_ADD_MUTATION = gql` 
mutation CopywritingManagementAdd(
    $title: String,
    $position: String,
    $message: String,
    $weight: Int,
    $createUser: String,
){
    systemDoc(input:{
      title: $title
      position: $position
      message: $message
      weight: $weight
      createUser: $createUser
    }) {
      id
    }
  }
`

export const COPYWRITING_MODIFY_MUTATION = gql` 
mutation CopywritingManagementModify(
    $id: String,
    $title: String,
    $position: String,
    $message: String,
    $weight: Int,
    $statusChangedBy: String,
){
    systemDoc(input:{
      id: $id
      title: $title
      position: $position
      message: $message
      weight: $weight
      statusChangedBy: $statusChangedBy
    }) {
      id
      errors{
          field
          messages
      }
    }
  }
`

export const COPYWRITING_DELETE = gql` 
mutation CopywritingManagementAdd(
    $id: String,
    $enabled: Boolean
){
    systemDoc(input:{
      id: $id,
      enabled: $enabled
    }) {
      id
    }
  }
`