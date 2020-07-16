import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

 
export const MEMBER_GAME_RECORD_QUERY = gql`query memberGameRecords($startAt: String, $first: Int, $last: Int, 
    $after: String, $before: String, $orderId: String,
    $user_Username: ID,
    $gameVendor: String,
    $remark: String, 
    $endAt: String
    ){
    memberGameRecords(startAt: $startAt, first: $first, 
    last: $last, after: $after, before: $before, orderId: $orderId,
    user_Username: $user_Username,
    gameVendor: $gameVendor,
    remark: $remark, endAt: $endAt) {
        edges {
            node {
            id
            orderId
            user{
                username
                memberLevel{
                    name
                }
            }
            gameVendor
            gameName
            remark
            gameServerTimestamp
            bet
            payoff
            subtraction
            }
        }
        totalCount
        startCursorNum
        endCursorNum
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        } 
    }
}`

export function useMemberGameRecordQuery({rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt}) {
 
  let variables = {rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt};
//   if(fromDate) variables.fromDate = fromDate;
//   if(toDate) variables.toDate = toDate;
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
		query: MEMBER_GAME_RECORD_QUERY,
		variables,
		defs: [ rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt],
	})
}



 
export const MEMBER_GAME_RECORD_DECENDANTS_QUERY = gql`query memberGameRecordsDecendants(
    $startAt: DateTime, 
    $first: Int, $last: Int, 
    $after: String, $before: String, 
    $orderId: String,
    $user_Username: ID,
    $gameVendor: String,
    $remark: String, 
    $endAt: DateTime
    ){
        
    descendantsMemberRecords(
        createdAt_Gt: $startAt, 
        first: $first, 
    last: $last, after: $after, before: $before, 
    orderId: $orderId,
    user_Username: $user_Username,
    gameVendor: $gameVendor,
    remark: $remark, 
    createdAt_Lt: $endAt
    ) {
        edges {
            node {
            id
            orderId
            user{
                username
                memberLevel{
                    name
                }
            }
            gameVendor
            gameName
            remark
            gameServerTimestamp
            bet
            payoff
            subtraction
            }
        }
        totalCount
        startCursorNum
        endCursorNum
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        } 
    }
}`

export function useMemberGameRecordDecendantsQuery({rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt}) {
 
  let variables = {rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt};
//   if(fromDate) variables.fromDate = fromDate;
//   if(toDate) variables.toDate = toDate;
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
		query: MEMBER_GAME_RECORD_DECENDANTS_QUERY,
		variables,
		defs: [ rowsPerPage, after, before, mutation, startAt, orderId, user_Username, gameVendor, remark, endAt],
	})
}