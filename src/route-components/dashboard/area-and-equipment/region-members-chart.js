import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Loading} from '../../../components';
import {useTheme} from '@material-ui/styles';
import {getTop10RegionMembers} from './data-transformer';
import useRegionMembers from './use-region-members';

export default function RegionMembersChart({fromDate, toDate}) {
	const theme = useTheme();
	let {data, loading} = useRegionMembers({fromDate, toDate});
	if(loading) {
		return <Loading/>
	}
	let top10RegionMemberHistory = getTop10RegionMembers(data.dashboard);
	if(!top10RegionMemberHistory.find(o => o.count > 0)) {
		return null;
	}
	let doughnutData = {
		labels: top10RegionMemberHistory.map(o => o.regionCode),
		datasets: [
			{
				label: '',
				data: top10RegionMemberHistory.map(o => o.count),
			},
		]
	}
	return <Doughnut
		data={{
			labels: doughnutData.labels,
			datasets: doughnutData.datasets.map((ds, index) => {
				return {
					label: ds.label,
					data: ds.data,
					backgroundColor: theme.charts.doughnut.backgroundColors,
				}
			}),
		}}
		legend={{
			display: false
		}}
		options= {{
			responsive: true,
			layout: {
				padding: 0
			},
			animation: {
				animateScale: true,
				animateRotate: true
			},
			cutoutPercentage: 70
		}}
	/>
}