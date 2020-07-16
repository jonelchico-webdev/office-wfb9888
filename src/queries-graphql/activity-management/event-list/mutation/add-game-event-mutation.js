
import gql from 'graphql-tag'

export const GAME_EVENT_ADD_MUTATION = gql` 
mutation GameEventAdd(
    $updatedBy: ID!,
    $createdBy: ID,
    $title: String,
    $eventWay: String,
    $eventType: ID,
    $giveawayTypes: String,
    $devicesTypes: String,
    $devices: String,
    $startAt: DateTime,
    $endAt: DateTime,
    $content: String,
    $rewardAmount: Float,
    $rewardAmountPercentRatio: Float,
    $registerToday: Boolean,
    $ipLimitOncePerday: Boolean,
    $depositToday: Boolean,
    $bindingMobilePhonenumber: Boolean,
    $accountLimitOncePerday: Boolean,
    $accountLimitOnceOnly: Boolean,
    $eventLevelLimit: Boolean,
    $eventLevelLimitContent: [ID],
    $eventVipLimit: Boolean,
    $eventVipLimitContent: [ID],
    $eventGameLimit: Boolean,
    $eventGameLimitContent: [ID],
    $eventUplineLimit: Boolean,
    $eventUplineLimitContent: [ID],
) {
    gameEvent(input:{
        updatedBy: $updatedBy
        createdBy: $createdBy
        title: $title
        eventWay: $eventWay
        eventType: $eventType
        giveawayTypes: $giveawayTypes
        devicesTypes: $devicesTypes
        devices: $devices
        startAt: $startAt
        endAt: $endAt
        content: $content
        rewardAmount: $rewardAmount
        rewardAmountPercentRatio: $rewardAmountPercentRatio
        registerToday: $registerToday
        ipLimitOncePerday: $ipLimitOncePerday
        depositToday: $depositToday
        bindingMobilePhonenumber: $bindingMobilePhonenumber
        accountLimitOncePerday: $accountLimitOncePerday
        accountLimitOnceOnly: $accountLimitOnceOnly
        eventLevelLimit: $eventLevelLimit
        eventLevelLimitContent: $eventLevelLimitContent
        eventVipLimit: $eventVipLimit
        eventVipLimitContent: $eventVipLimitContent
        eventGameLimit: $eventGameLimit 
        eventGameLimitContent: $eventGameLimitContent
        eventUplineLimit: $eventUplineLimit 
        eventUplineLimitContent: $eventUplineLimitContent
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEvent{
            id
            title
        }
    }
}
`

export const GAME_EVENT_MUTATION_ADD = gql`
    mutation GameEventAdd(
        $updatedBy: ID!,
        $createdBy: ID,
        $title: String,
        $eventType: ID,
        $giveTime: String,
        $giveCondition: String,
        $eventWay: String,
        $giveTypes: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $content: String,
        $weight: Int,
        $eventLevelLimitContent: [ID],
        $eventVipLimitContent: [ID],
        $eventGameVendorLimitContent: [ID],
        $registerToday: Boolean,
        $ipLimitOncePerday: Boolean,
        $depositToday: Boolean,
        $bindingMobilePhonenumber: Boolean,
        $accountLimitOncePerday: Boolean,
        $accountLimitOnceOnly: Boolean,
    ){
        gameEvent(input:{
            updatedBy: $updatedBy
            createdBy: $createdBy
            title: $title
            eventType: $eventType
            startAt: $startAt
            endAt: $endAt
            content: $content
            weight: $weight
            giveTime: $giveTime
            giveCondition: $giveCondition
            eventWay: $eventWay
            giveTypes: $giveTypes
            eventGameVendorLimitContent: $eventGameVendorLimitContent
            eventLevelLimitContent: $eventLevelLimitContent
            eventVipLimitContent: $eventVipLimitContent
            registerToday: $registerToday
            depositToday: $depositToday
            bindingMobilePhonenumber: $bindingMobilePhonenumber
            accountLimitOnceOnly: $accountLimitOnceOnly
            ipLimitOncePerday: $ipLimitOncePerday
            accountLimitOncePerday: $accountLimitOncePerday
            eventHot: "newest"
        }) {
            clientMutationId
            errors {
                field
                messages
            }
            gameEvent{
                id
                title
            }
        }
    }
`

export const GAME_EVENT_MUTATION_ADD_NO_EVENT_TYPE = gql`
    mutation GameEventAdd(
        $updatedBy: ID!,
        $createdBy: ID,
        $title: String,
        $giveTime: String,
        $giveCondition: String,
        $eventWay: String,
        $giveTypes: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $content: String,
        $weight: Int,
        $eventLevelLimitContent: [ID],
        $eventVipLimitContent: [ID],
        $eventGameVendorLimitContent: [ID],
        $registerToday: Boolean,
        $ipLimitOncePerday: Boolean,
        $depositToday: Boolean,
        $bindingMobilePhonenumber: Boolean,
        $accountLimitOncePerday: Boolean,
        $accountLimitOnceOnly: Boolean,
    ){
        gameEvent(input:{
            updatedBy: $updatedBy
            createdBy: $createdBy
            title: $title
            startAt: $startAt
            endAt: $endAt
            content: $content
            weight: $weight
            giveTime: $giveTime
            giveCondition: $giveCondition
            eventWay: $eventWay
            giveTypes: $giveTypes
            eventGameVendorLimitContent: $eventGameVendorLimitContent
            eventLevelLimitContent: $eventLevelLimitContent
            eventVipLimitContent: $eventVipLimitContent
            registerToday: $registerToday
            depositToday: $depositToday
            bindingMobilePhonenumber: $bindingMobilePhonenumber
            accountLimitOnceOnly: $accountLimitOnceOnly
            ipLimitOncePerday: $ipLimitOncePerday
            accountLimitOncePerday: $accountLimitOncePerday
            eventHot: "newest"
        }) {
            clientMutationId
            errors {
                field
                messages
            }
            gameEvent{
                id
                title
            }
        }
    }
`

export const GAME_EVENT_MODIFY_MUTATION = gql` 
mutation GameEventAdd(
    $id: ID,
    $updatedBy: ID!,
    $title: String,
    $eventWay: String,
    $eventType: String,
    $giveawayTypes: String,
    $devicesTypes: String,
    $devices: String,
    $startAt: DateTime,
    $endAt: DateTime,
    $content: String,
    $rewardAmount: Float,
    $rewardAmountPercentRatio: Float,
    $registerToday: Boolean,
    $ipLimitOncePerday: Boolean,
    $depositToday: Boolean,
    $bindingMobilePhonenumber: Boolean,
    $accountLimitOncePerday: Boolean,
    $accountLimitOnceOnly: Boolean,
    $eventLevelLimit: Boolean,
    $eventLevelLimitContent: [ID],
    $eventVipLimit: Boolean,
    $eventVipLimitContent: [ID],
    $eventGameLimit: Boolean,
    $eventGameLimitContent: [ID],
    $eventUplineLimit: Boolean,
    $eventUplineLimitContent: [ID],
) {
    gameEvent(input:{
        updatedBy: $updatedBy
        id: $id
        title: $title
        eventWay: $eventWay
        eventType: $eventType
        giveawayTypes: $giveawayTypes
        devicesTypes: $devicesTypes
        devices: $devices
        startAt: $startAt
        endAt: $endAt
        content: $content
        rewardAmount: $rewardAmount
        rewardAmountPercentRatio: $rewardAmountPercentRatio
        registerToday: $registerToday
        ipLimitOncePerday: $ipLimitOncePerday
        depositToday: $depositToday
        bindingMobilePhonenumber: $bindingMobilePhonenumber
        accountLimitOncePerday: $accountLimitOncePerday
        accountLimitOnceOnly: $accountLimitOnceOnly
        eventLevelLimit: $eventLevelLimit
        eventLevelLimitContent: $eventLevelLimitContent
        eventVipLimit: $eventVipLimit
        eventVipLimitContent: $eventVipLimitContent
        eventGameLimit: $eventGameLimit 
        eventGameLimitContent: $eventGameLimitContent
        eventUplineLimit: $eventUplineLimit 
        eventUplineLimitContent: $eventUplineLimitContent
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEvent{
            id
            title
        }
    }
}
`

export const GAME_EVENT_MUTATION_MODIFY = gql`
    mutation GameEventAdd(
        $id: ID,
        $updatedBy: ID!,
        $title: String,
        $eventType: ID,
        $giveTime: String,
        $giveCondition: String,
        $eventWay: String,
        $giveTypes: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $content: String,
        $weight: Int,
        $eventLevelLimitContent: [ID],
        $eventVipLimitContent: [ID],
        $eventGameVendorLimitContent: [ID],
        $registerToday: Boolean,
        $ipLimitOncePerday: Boolean,
        $depositToday: Boolean,
        $bindingMobilePhonenumber: Boolean,
        $accountLimitOncePerday: Boolean,
        $accountLimitOnceOnly: Boolean,
    ){
        gameEvent(input:{
            id: $id,
            updatedBy: $updatedBy
            title: $title
            eventType: $eventType
            startAt: $startAt
            endAt: $endAt
            content: $content
            weight: $weight
            giveTime: $giveTime
            giveCondition: $giveCondition
            eventWay: $eventWay
            giveTypes: $giveTypes
            eventGameVendorLimitContent: $eventGameVendorLimitContent
            eventLevelLimitContent: $eventLevelLimitContent
            eventVipLimitContent: $eventVipLimitContent
            registerToday: $registerToday
            depositToday: $depositToday
            bindingMobilePhonenumber: $bindingMobilePhonenumber
            accountLimitOnceOnly: $accountLimitOnceOnly
            ipLimitOncePerday: $ipLimitOncePerday
            accountLimitOncePerday: $accountLimitOncePerday
            eventHot: "newest"
        }) {
            clientMutationId
            errors {
                field
                messages
            }
            gameEvent{
                id
                title
            }
        }
    }
`

export const GAME_EVENT_MUTATION_MODIFY_NO_EVENT_TYPE = gql`
    mutation GameEventAdd(
        $id: ID,
        $updatedBy: ID!,
        $title: String,
        $giveTime: String,
        $giveCondition: String,
        $eventWay: String,
        $giveTypes: String,
        $startAt: DateTime,
        $endAt: DateTime,
        $content: String,
        $weight: Int,
        $eventLevelLimitContent: [ID],
        $eventVipLimitContent: [ID],
        $eventGameVendorLimitContent: [ID],
        $registerToday: Boolean,
        $ipLimitOncePerday: Boolean,
        $depositToday: Boolean,
        $bindingMobilePhonenumber: Boolean,
        $accountLimitOncePerday: Boolean,
        $accountLimitOnceOnly: Boolean,
    ){
        gameEvent(input:{
            id: $id,
            updatedBy: $updatedBy
            title: $title
            startAt: $startAt
            endAt: $endAt
            content: $content
            weight: $weight
            giveTime: $giveTime
            giveCondition: $giveCondition
            eventWay: $eventWay
            giveTypes: $giveTypes
            eventGameVendorLimitContent: $eventGameVendorLimitContent
            eventLevelLimitContent: $eventLevelLimitContent
            eventVipLimitContent: $eventVipLimitContent
            registerToday: $registerToday
            depositToday: $depositToday
            bindingMobilePhonenumber: $bindingMobilePhonenumber
            accountLimitOnceOnly: $accountLimitOnceOnly
            ipLimitOncePerday: $ipLimitOncePerday
            accountLimitOncePerday: $accountLimitOncePerday
            eventHot: "newest"
        }) {
            clientMutationId
            errors {
                field
                messages
            }
            gameEvent{
                id
                title
            }
        }
    }
`

export const GAME_EVENT_VALUE_ADD_MUTATION = gql` 
mutation GameEventValueAdd(
    $event: ID,
    $minValue: Int,
    $maxValue: Int,
    $rewardAmount: Float,
    $isPercent: Boolean,
) {
    gameEventValue(input:{
      event: $event
      minValue: $minValue
      maxValue: $maxValue
      rewardAmount: $rewardAmount
      isPercent: $isPercent
      deletedFlag: false
    }) {
      clientMutationId
      gameEventValue{
        id
      }
    }
}
`

export const GAME_EVENT_VALUE_DELETE_MUTATION = gql` 
mutation GameEventValueAdd(
    $id: ID
) {
    gameEventValue(input:{
      id: $id
      deletedFlag: true
    }) {
      clientMutationId
      gameEventValue{
        id
      }
    }
}
`

export const GAME_EVENT_STATUS_MUTATION = gql` 
mutation GameEventAdd(
    $id: ID,
    $updatedBy: ID!,
    $enabled: Boolean
) {
    gameEvent(input:{
        updatedBy: $updatedBy
        id: $id
        enabled: $enabled
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEvent{
            id
            title
        }
    }
}
`

export const GAME_EVENT_DELETE_MUTATION = gql` 
mutation GameEventAdd(
    $id: ID,
    $updatedBy: ID!,
    $deletedFlag: Boolean
) {
    gameEvent(input:{
        updatedBy: $updatedBy
        id: $id
        deletedFlag: $deletedFlag
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEvent{
            id
            title
        }
    }
}
`

export const GAME_EVENT_IMAGE_UPLOAD = gql`
    mutation gameEventImg(
        $file: Upload!,
        $id: String!,
        $deviceType: String!
        ){
        gameEventImg(
            id: $id
            deviceType: $deviceType
            file:$file
        ) {
            success
        }
    }
    `

export const GAME_EVENT_ADD_MUTATION_BACKUP = gql` 
mutation GameEventAdd(
    $title: String,
    $content: String,
) {
    gameEvent(input:{
        updatedBy: "VXNlck5vZGU6MTg0OQ=="
        title: $title
        content: $content
    }) {
        clientMutationId
        errors{
            field
            messages
        }
        gameEvent{
            id
            title
        }
    }
}
`