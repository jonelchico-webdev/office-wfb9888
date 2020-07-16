import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

const OPERATIONAL_GENERAL_REPORT_QUERY = gql`query OperationalGeneralReportQuery($userName: String, $startAt: String, $endAt: String, $isAgent: Boolean) {
    generalMemberReport(username: $userName, startAt: $startAt, endAt: $endAt, includeDescendants: $isAgent) {
        edges {
          node {
            activeMemberCount
            depositAmount
            depositCount
            depositUsers
            withdrawalAmount
            withdrawalCount
            withdrawalUsers
            betAmount
            betValidAmount
            betPayout
            betCount
            betUsers
            subtraction
          }
        }
      }
}`

const OPERATIONAL_AGENT_REPORT_QUERY = gql`
query OperationalAgentReportQuery($userName: String, $startAt: String, $endAt: String, $first: Int, $last: Int, $after: String, $before: String, $isAgent: Boolean) {
  agentMemberReport(username: $userName, startAt: $startAt, endAt: $endAt, first: $first, last: $last, after: $after, before: $before, includeDescendants: $isAgent) {
    edges {
      node {
        username
        activeMemberCount
        depositAmount
        depositCount
        depositUsers
        withdrawalAmount
        withdrawalCount
        withdrawalUsers
        betAmount
        betValidAmount
        betCount
        betUsers
        subtraction
      }
    }
    totalCount
  	pageInfo {
  	  startCursor
  	  endCursor
      hasNextPage
      hasPreviousPage
  	}
    }
}`

export function useOperationalGeneralReports({ rowsPerPage, after, before, filter }) {
  let variables = filter;

  return useQuery({
    query: OPERATIONAL_GENERAL_REPORT_QUERY,
    variables,
    defs: [rowsPerPage, after, before, filter.userName, filter.startDate, filter.endDate, filter.isAgent]
  })
}

export function useOperationalAgentReports({ rowsPerPage, after, before, userName, startAt, endAt, filter, isAgent}) {
  
  let variables = {userName, startAt, endAt, isAgent};
  if (after) {
		variables.first = rowsPerPage;
		variables.after = after;
	}
	if (before) {
		variables.last = rowsPerPage;
		variables.before = before;
	}
	if (!after && !before) {
		variables.first = rowsPerPage;
  }
  
  return useQuery({
    query: OPERATIONAL_AGENT_REPORT_QUERY,
    variables,
    defs: [rowsPerPage, after, before, isAgent, userName, startAt, endAt, filter]
  })
}