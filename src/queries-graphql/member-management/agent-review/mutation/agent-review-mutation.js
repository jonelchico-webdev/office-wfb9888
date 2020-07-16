import gql from 'graphql-tag'

export const AGENT_REVIEW_STATUS_MUTATION = gql` 
mutation agentReview(
    $id: String!,
    $status: String
) {
    affiliateProfile(input:{
        id: $id
        status: $status
    }) {
        clientMutationId
        errors{
            field
            messages
        }
    }
}
`