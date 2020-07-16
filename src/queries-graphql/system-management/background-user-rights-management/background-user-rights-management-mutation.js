
import gql from 'graphql-tag'

export const ADD_SYSTEM_GROUP_MUTATION = gql` 
mutation createSystemGroup($name: String!){
    systemGroup(input:{
        name: $name
    }) {
        clientMutationId
        errors{
            field
            messages
        }
    }
    }
`

export const UPDATE_SYSTEM_GROUP_MUTATION = gql` 
mutation updateSystemGroup(
    $id: ID
    $name: String!
    $permissions: [ID]
    ){
    systemGroup(input:{
        id: $id
        name: $name
        permissions: $permissions
    }) {
        clientMutationId
        errors{
            field
            messages
        }
    }
    }
`