import React from 'react';
import {getLastNthDayRange} from '../../../helpers/dates';
import moment from 'moment';
import { Loading, AppBarChart  } from '../../../components';
import useDeviceMembers from './use-device-members';

export default function DeviceMembersBarChart() {
	let dateRange = getLastNthDayRange(7);
	let {loading, formattedData} = useDeviceMembers({
		fromDate: dateRange.startDate.format("YYYY-MM-DD"),
		toDate: dateRange.endDate.format("YYYY-MM-DD"),
		format: {
			tabular: true
		}
	});
	if(loading) {
		return <Loading/>
	}
	const tabularData = formattedData;
	
	let chartData = {
		labels: tabularData.map(o => moment(o.date).format('MM/DD').toString()),
		datasets: [
			{
				label: 'PC',
				data: tabularData.map(o => o.pc),
			},
			{
				label: 'Android', 
				data: tabularData.map(o => o.android),
			},
			{
				label: 'iOS',
				data: tabularData.map(o => o.ios),
			},
		]
	}
	return <AppBarChart chartData={chartData} hideTitle={true}/>;
}