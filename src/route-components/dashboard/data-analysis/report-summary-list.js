import React from 'react';
import useHistories from './use-histories';
import ReportSummaryItem from './report-summary-item';
import { Loading } from '../../../components';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Person, GroupAdd, Timeline } from '@material-ui/icons';
import RechargeIcon from '../../../icons/recharge';
import CashMultipleIcon from '../../../icons/cash-multiple';
import GamblingIcon from '../../../icons/gambling';

const useStyles = makeStyles(theme => ({
	icon: {
		fontSize: 40,
	},
}));

function getSummaries(data, strings) {
	const { activeMemberHistory, newMemberHistory, betValidHistory, betTotalHistory,
		betProfitHistory, betLossHistory, depositAmountHistory,
		withdrawalAmountHistory
	} = data.dashboard;
	let summaries = [];
	summaries.push({
		name: "activeMemberToday",
		label: strings.activeMemberToday,
		unit: strings.people,
		number: activeMemberHistory.today
	});
	summaries.push({
		name: "newMemberToday",
		label: strings.newMemberToday,
		unit: strings.people,
		number: newMemberHistory.today
	});
	summaries.push({
		name: "totalDepositToday",
		label: strings.totalRechargeToday,
		unit: strings.yuan,
		number: depositAmountHistory.today
	});
	summaries.push({
		name: "totalWithdrawalToday",
		label: strings.totalWithdrawalToday,
		unit: strings.yuan,
		number: withdrawalAmountHistory.today
	});
	summaries.push({
		name: "effectiveBettingToday",
		label: strings.effectiveBettingToday,
		unit: strings.yuan,
		number: betTotalHistory.today
	});
	summaries.push({
		name: "profitAndLossToday",
		label: strings.profitAndLossToday,
		unit: strings.yuan,
		number: betProfitHistory.today - betLossHistory.today
	});
	return summaries;
}

export default function ReportSummaryList({ strings }) {
	const classes = useStyles();
	const { data, loading } = useHistories();
	if (loading) {
		return <Loading />
	}
	const summaries = getSummaries(data, strings);
	return <Grid container spacing={2}>
		{summaries.map((o, index) => {
			let icon = <div></div>
			if (o.name === 'activeMemberToday') icon = <Person color="primary" className={classes.icon} />
			else if (o.name === 'newMemberToday') icon = <GroupAdd color="secondary" className={classes.icon} />
			else if (o.name === 'totalDepositToday') icon = <RechargeIcon color="primary" className={classes.icon} />
			else if (o.name === 'totalWithdrawalToday') icon = <CashMultipleIcon htmlColor="#FDCB58" className={classes.icon} />
			else if (o.name === 'effectiveBettingToday') icon = <GamblingIcon htmlColor="#33C777" className={classes.icon} />
			else if (o.name === 'profitAndLossToday') icon = <Timeline color="primary" className={classes.icon} />
			return <Grid item key={index} xs={6} sm={6} md={2}>
				<ReportSummaryItem {...o} reverse={Boolean(index % 2)} icon={icon} />
			</Grid>
		})}
	</Grid>
}