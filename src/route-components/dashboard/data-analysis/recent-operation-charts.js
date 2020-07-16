import React from 'react';
import useRecentOperation from './use-recent-operation';
import {AppBarChart, Loading} from '../../../components';
import moment from 'moment';
import {Grid} from '@material-ui/core';

export default function RecentOperationCharts({strings}) {
	const {loading, formattedData} = useRecentOperation({format: {tabular: true}});
	if(loading) {
		return <Loading/>
	}
	let labels = formattedData.map(o => moment(o.date).format('MM/DD'));
	let activeVSNewMeberChartData = {
		labels,
		datasets: [
			{
				label: strings.activeMember,
				data: formattedData.map(o => o.activeMember)
			},
			{
				label: strings.newMember,
				data: formattedData.map(o => o.newMember)
			}
		]
	}
	let depositVSWithdrawAmountChartData = {
		labels,
		datasets: [
			{
				label: strings.rechargeAmount,
				data: formattedData.map(o => o.depositAmount.toLocaleString('en', {maximumFractionDigits:2}))
			},
			{
				label: strings.withdrawalAmount,
				data: formattedData.map(o => o.withdrawalAmount.toLocaleString('en', {maximumFractionDigits:2}))
			}
		]
	}
	let betActiveChartData = {
		labels,
		datasets: [
			{
				label: strings.effectiveBet,
				data: formattedData.map(o => o.betActive)
			},
		]
	}
	let betProfitLossChartData = {
		labels,
		datasets: [
			{
				label: strings.profitAndLoss,
				data: formattedData.map(o => o.betProfit - o.betLoss.toLocaleString('en', {maximumFractionDigits:2}))
			},
		]
	}
	let barCharts = [activeVSNewMeberChartData, depositVSWithdrawAmountChartData, 
		betActiveChartData, betProfitLossChartData];
	return <Grid container spacing={2}>
		{barCharts.map((o, index) => {
			return <Grid item key={index} xs={12} md={6}>
				<AppBarChart
					chartData={o}
				/>
			</Grid>
		})}
	</Grid>
}