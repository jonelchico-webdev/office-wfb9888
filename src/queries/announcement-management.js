import {gql} from 'graphql.macro';

export const SYSTEM_NOTIFICATION_QUERY = gql `query SystemNotification {
    systemNotification {
        serialNumber
        announcementTitle
        displayForm
        announcementStartDate
        announcementStartTime
        announcementEndDate
        announcementEndTime
        sortWeight
        addAPerson
        withdrawalAmount
    }
}
`
export const APP_PUSH_QUERY = gql `query appPush {
    appPush {
        serialNumber
        pushContent
        pushStartDate
        pushStartTime
        creationTime
    }
}
`
export const COPYWRITING_MANAGEMENT_QUERY = gql `query copywritingManagement {
    copywritingManagement {
        serialNumber
        copyName
        displayPosition
        sortWeight
        founder
        modifier
        withdrawalAmount
    }
}
`
export const HOME_CAROUSEL_MANAGEMENT_QUERY = gql `query homeCarouselManagement {
    homeCarouselManagement {
        serialNumber
		name
		displayForm
		link
		sortWeight
		addAPerson
		modifier
		lastModified
    }
}
`
export const MEMBER_NEWS_INBOX_QUERY = gql `query memberNewsInbox {
    memberNewsInbox {
		serialNumber
		messageTitle
		messageCategory
		recipient
		sendingTime
		sender
		status
    }
}
`

export const MEMBER_NEWS_OUTBOX_QUERY = gql `query memberNewsOutbox {
    memberNewsOutbox {
		serialNumber
		messageTitle
		messageCategory
		recipient
		sendingTime
		sender
		status
    }
}
`
