import gql from 'graphql-tag'


export const ANNOUNCEMENT_ADD_MUTATION = gql`
    mutation AnnouncementUpdate(
        $title: String!,
        $content: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $weight: Int,
        $showType: String!,
        $createdAt: DateTime
    ) {
        announcement(input:{
            title: $title
            content: $content
            startAt: $startAt
            endAt: $endAt
            weight: $weight
            showType: $showType
            createdAt: $createdAt
        }) {
            clientMutationId 
            errors{
                field
                messages
            } 
            announcement{
                id 
            }
        }
    }
`

export const ANNOUNCEMENT_UPDATE_MUTATION = gql`
    mutation AnnouncementUpdate(
        $id: ID,
        $title: String!,
        $content: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $weight: Int,
        $showType: String!,
        $updatedBy: ID!
    ) {
        announcement(input:{
            id: $id
            title: $title
            content: $content
            startAt: $startAt
            endAt: $endAt
            weight: $weight
            showType: $showType
            updatedBy: $updatedBy
        }) {
            clientMutationId 
            errors{
                field
                messages
            }
        }
    }
`


export const DELETE_ANNOUNCE_MUTATE = gql` 
    mutation(
        $id: ID, 
        ){
        announcement(input:{
            id: $id
            deletedFlag: true
        }) {
            clientMutationId 
            errors{
                field
                messages
            }
        }
    }
`
export const ANNOUNCEMENT_IMAGE_UPLOAD = gql`
    mutation announcementImg(
        $file: Upload!,
        $id: String!,
        $deviceType: String!
        ){
        announcementImg(
            id: $id
            deviceType: $deviceType
            file:$file
        ) {
            success
        }
    }
    `
