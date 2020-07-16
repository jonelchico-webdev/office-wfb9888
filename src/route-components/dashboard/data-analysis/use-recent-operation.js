import gql from 'graphql-tag';
import useQuery from '../../../hooks/use-query';
import moment from 'moment';
import Cookies from 'universal-cookie';


const RECENT_OPERATION_QUERY = gql`query RecentOperationQuery($fromDate: String!, $toDate: String!, $strategy: String) {
	dashboard(fromDate:$fromDate, toDate: $toDate, strategy: $strategy) {		
		activeMembers {
			count
			visitDate
		}
		newMembers {
			count
			dateJoined
		}
		depositAmount {
			amount
			depositDate
		}
		withdrawalAmount {
			amount
			withdrawDate
		}
		betAmount {
			amount
			betDate
		}
		betActive {
			count
			betDate
		}
		betProfitLoss {
			profit
			loss
			betDate
		}
	}
}`

function getTabularData(data) {
	const {activeMembers, newMembers, depositAmount, withdrawalAmount, betAmount, betActive, betProfitLoss} = data.dashboard;
	const dates = [6, 5, 4, 3, 2, 1, 0].map(o => moment().subtract(o, 'days').format('YYYY-MM-DD'));
	return dates.map(d => {
		let activeMember = activeMembers.find(o => o.visitDate === d);
		let newMember = newMembers.find(o => o.dateJoined === d);
		let depositAmountItem = depositAmount.find(o => o.depositDate === d);
		let withdrawalAmountItem = withdrawalAmount.find(o => o.withdrawDate === d);
		let betAmountItem = betAmount.find(o => o.betDate === d);
		let betActiveItem = betActive.find(o => o.betDate === d);
		let betProfitLossItem = betProfitLoss.find(o => o.betDate === d);
		return {
			date: d,
			activeMember: activeMember ? activeMember.count : 0,
			newMember: newMember ? newMember.count : 0,
			depositAmount: depositAmountItem ? depositAmountItem.amount : 0,
			withdrawalAmount: withdrawalAmountItem ? withdrawalAmountItem.amount : 0,
			betAmount: betAmountItem ? betAmountItem.count : 0,
			betActive: betActiveItem ? betActiveItem.count : 0,
			betProfit: betProfitLossItem ? betProfitLossItem.profit: 0,
			betLoss: betProfitLossItem ? betProfitLossItem.loss : 0
		}
	});
}

export default function useRecentOperation({format: {tabular}}) {

const cookies = new Cookies();
const strategy = cookies.get('userType') === 'staff' ? "backoffice" : "affiliate"
	const fromDate = moment().subtract(6, "days").format("YYYY-MM-DD");
	const toDate = moment().add(1, "days").format("YYYY-MM-DD");
	let formatter = null;
	if(tabular) {
		formatter = getTabularData;
	}
	let response = useQuery({
		query: RECENT_OPERATION_QUERY,
		variables: {
			fromDate, toDate, strategy
		},
		formatter,
		defs: []
	});
	return response;
}