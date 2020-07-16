import useQuery from '../../../../hooks/use-query'
import gql from 'graphql-tag'

const GAME_EVENT_LIST_QUERY = gql`query GameEventList(
    $title: String,
    $startAt: String,
    $endAt: String,
    $eventType: ID,
    $enabled: Boolean,
    $devicesTypes: String,
    $deletedFlag: Boolean,
    $first: Int, 
    $last: Int, 
    $after: String, 
    $before: String, 
) {
    gameEvents(
        title: $title,
        startAt: $startAt,
        endAt: $endAt,
        eventType: $eventType,
        enabled: $enabled,
        devicesTypes: $devicesTypes,
        deletedFlag: $deletedFlag,
        first: $first, 
        last: $last, 
        after: $after, 
        before: $before, 
    ) {
        edges {
            node {
                id
                pk
                title
                content
                eventType{
                    name
                    id
                    pk
                    enabled
                }
                startAt
                endAt
                createdAt
                createdBy {
                    id
                    username
                }
                updatedAt
                updatedBy {
                    id
                    username
                }
                enabled
                deletedFlag
                picUrlPc
                picUrlMobile
            }
        }
        totalCount
        startCursorNum
        endCursorNum
        pageInfo{
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
  }
`

export default function useGameEventListQuery({ deletedFlag, after, before, rowsPerPage, mutation, title, startAt, endAt, eventType, enabled, devicesTypes }) {
    let variables = {mutation, deletedFlag, after, rowsPerPage, before, title, startAt, endAt, eventType, devicesTypes};

    if(enabled !== "") {
        variables = {
            ...variables,
            enabled
        }   
    }

    if(after) {
        variables.first = rowsPerPage;
        variables.after = after;
    }
    if(before) {
        variables.last = rowsPerPage;
        variables.before = before;
    }
    if(!after && !before) {
        variables.first = rowsPerPage;
    }
    return useQuery({ 
        query:  GAME_EVENT_LIST_QUERY,
        variables,
        defs: [mutation, deletedFlag, rowsPerPage, after, before, title, startAt, endAt, eventType, enabled, devicesTypes]
    })
} 