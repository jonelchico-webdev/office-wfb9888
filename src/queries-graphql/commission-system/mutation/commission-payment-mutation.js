import gql from 'graphql-tag'

export const MODIFY_COMMISSION_PAYMENT = gql` 
mutation ModifyCommissionPayments(
    $id: String!,
    $status: String
    ){
    commissionPayment(input:{
        id: $id
        status: $status
    }) {
        id
        status
        errors{
            field
            messages
        }
    }
}
`

export const MODIFY_REMARK_COMMISSION_PAYMENT = gql` 
mutation ModifyRemarksCommissionPayments(
    $id: String!,
    $remarks: String
    ){
    commissionPayment(input:{
        id: $id
        remarks: $remarks
    }) {
        id
        status
        remarks
        errors{
            field
            messages
        }
    }
}
`