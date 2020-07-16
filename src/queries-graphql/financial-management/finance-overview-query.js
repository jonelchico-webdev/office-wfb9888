import useQuery from '../../hooks/use-query'
import gql from 'graphql-tag'

 
const FINANCE_OVERVIEW_QUERY = gql`query FinanceOverviewQuery($endAt: String, $startAt: String, $first: Int, $last: Int, $after: String, $before: String){
    financeOverview(startAt: $startAt, endAt: $endAt, first: $first, last: $last, after: $after, before: $before) {
        edges {
            node {
                day
                companySuccessAmount
                companySuccessCount
                companyAllCount
                onlineSuccessAmount
                onlineSuccessCount
                onlineAllCount
                manualSuccessAmount
                depositHandlingFee
                withdrawalMemberAmount
                withdrawalManualAmount
                withdrawalHandlingFee
                subtraction
            }
          cursorNum
          
        }
      	totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
	}
}`

export default function useFinanceOverviewQuery({startAt, endAt, rowsPerPage, before, after}) {
  let variables = {startAt, endAt, after, before};
	// if(fromDate) variables.fromDate = fromDate;
	// if(toDate) variables.toDate = toDate;
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
		query: FINANCE_OVERVIEW_QUERY,
		variables,
		defs: [startAt, endAt, rowsPerPage, after, before],
	})
}