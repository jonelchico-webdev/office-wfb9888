import gql from 'graphql-tag';
import useQuery from '../../../hooks/use-query';
import Cookies from 'universal-cookie';


const HISTORY_QUERY = gql`query HistoryQuery($strategy: String) {
	dashboard(strategy: $strategy) {
		activeMemberHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		newMemberHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		newMemberDepositHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betTotalHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betValidHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betProfitHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betLossHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betTotalHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		betUserHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		depositAmountHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		depositTotalHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		depositUserHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		withdrawalAmountHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		withdrawalTotalHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		withdrawalUserHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		},
		maxSimultaneousMemberHistory {
			today
			yesterday
			thisWeek
			lastWeek
			thisMonth
			lastMonth
		}
	}
}
`

export default function useHistories() {

const cookies = new Cookies();
const strategy = cookies.get('userType') === 'staff' ? "backoffice" : "affiliate"
	return useQuery({
		query: HISTORY_QUERY,
		variables: {
			strategy
		},
		defs: []
	});
}