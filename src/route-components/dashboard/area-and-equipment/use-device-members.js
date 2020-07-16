import gql from 'graphql-tag';
import useQuery from '../../../hooks/use-query';
import moment from 'moment';
import Cookies from 'universal-cookie';

const DEVICE_MEMBER_QUERY = gql`query DeviceMemberQuery($fromDate: String!, $toDate: String!, $strategy: String) {
	dashboard(fromDate: $fromDate, toDate: $toDate, strategy: $strategy) {
		deviceMembers{
			device
			count
			visitDate
		}
	}
}`

export function getTabularData(data) {
	const { deviceMembers } = data.dashboard;
	const dates = [6, 5, 4, 3, 2, 1, 0].map(o => moment().subtract(o, 'days').format('YYYY-MM-DD'));
	let tabularData =  dates.map(d => {
		let pc = deviceMembers.find(o => o.visitDate === d && (o.device === "PC" || o.device === "Other" ));
		let android = deviceMembers.find(o => o.visitDate === o.d && (o.device === "Android" ||o.device === "Generic Smartphone"));
		let ios = deviceMembers.find(o => o.visitDate === d && (o.device === "iOS-Device" || o.device === "iPhone" || o.device === "iOS" ));
		return {
			date: d,
			pc: pc ? pc.count : 0,
			android: android ? android.count :  0,
			ios: ios ? ios.count : 0
		}
	});
	return tabularData;
}

export default function useDeviceMembers({fromDate, toDate, format: {tabular}}) {

const cookies = new Cookies();
const strategy = cookies.get('userType') == 'staff' ? "backoffice" : "affiliate"

	let formatter = null;
	if(tabular) {
		formatter = getTabularData;
	}
	return useQuery({
		query: DEVICE_MEMBER_QUERY,
		variables: {
			fromDate, toDate, strategy
		},
		defs:[fromDate, toDate],
		formatter
	});
}