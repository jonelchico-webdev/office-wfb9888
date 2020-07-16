import gql from 'graphql-tag'

// $depositBankName: String,
// $depositAccount: String

// depositBankName: $depositBankName
// depositAccount: $depositAccount

export const MANUAL_WITHDRAWAL_MUTATE = gql `
    mutation(
        $user:ID
        $amount: Float,
        $withdrawalType: String,
        $createUser: ID,
        $userNote: String,
        $internalNote: String,

    ) {
    withdrawal(input: {
        user: $user
        amount: $amount
        withdrawalType: $withdrawalType
        userNote: $userNote
        createUser: $createUser
        internalNote: $internalNote

    }) {
        clientMutationId
        errors {
            field
            messages
        }
        withdrawal{
            pk
            id
            orderId
            amount
        }
    }
}`  