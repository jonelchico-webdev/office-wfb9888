import gql from 'graphql-tag'

export const DELETE_COMMISSION = gql` 
mutation DeleteCommission($id: String!) {
    commissionDelete(input:{
      id: $id
    }) {
      id
      errors{
        field
        messages
      }
    }
  }
`