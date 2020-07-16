import React, { Fragment } from 'react';
import useHistories from './use-histories';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Loading, SimpleTable } from '../../../components';
import usePagination from '../../../hooks/use-pagination'

const useStyles = makeStyles(theme => ({
	tcellHeader: {
		backgroundColor: '#E9EEF4',
		color: 'rgba(82,87,93, 0.65)'
	},
	tHead: {
		minWidth: 150,
		maxWidth: 151,
		marginRight: 24,
		marginLeft: 24
	}
}));

export default function InformationOverviewTable({ strings }) {
	const classes = useStyles();
	const pagination = usePagination()
	const { data, loading } = useHistories();
	if (loading) {
		return <Loading />
	}
	const { activeMemberHistory, newMemberHistory, newMemberDepositHistory, betValidHistory,
		betProfitHistory, betLossHistory, betTotalHistory, betUserHistory, depositAmountHistory,
		depositTotalHistory, depositUserHistory, withdrawalAmountHistory, withdrawalTotalHistory,
		withdrawalUserHistory, maxSimultaneousMemberHistory
	} = data.dashboard;

	return <SimpleTable
	tableProps={{ size:"small"}}
		hasPagination={false}
		pagination={pagination}
		pageInfo={false}
		count={16}
		columns={<TableRow>
			<TableCell colSpan={2}></TableCell>
			<TableCell className={classes.tHead} align="right">{strings.today}</TableCell>
			<TableCell className={classes.tHead} align="right">{strings.yesterday}</TableCell>
			<TableCell className={classes.tHead} align="right">{strings.thisWeek}</TableCell>
			<TableCell className={classes.tHead} align="right">{strings.lastWeek}</TableCell>
			<TableCell className={classes.tHead} align="right">{strings.thisMonth}</TableCell>
			<TableCell className={classes.tHead} align="right">{strings.lastMonth}</TableCell>
		</TableRow>}
		rows={
			<Fragment>
				<TableRow>
					<TableCell className={classes.tcellHeader} rowSpan={2} ><Typography>{strings.memberOnlineStatus}</Typography></TableCell>
					<TableCell style={{ maxWidth: 300 }}>{strings.activeMembers}</TableCell>
					<TableCell align="right">{activeMemberHistory.today}</TableCell>
					<TableCell align="right">{activeMemberHistory.yesterday}</TableCell>
					<TableCell align="right">{activeMemberHistory.thisWeek}</TableCell>
					<TableCell align="right">{activeMemberHistory.lastWeek}</TableCell>
					<TableCell align="right">{activeMemberHistory.thisMonth}</TableCell>
					<TableCell align="right">{activeMemberHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.maximumSimultaneousOnlineNumber}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.today}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.yesterday}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.thisWeek}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.lastWeek}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.thisMonth}</TableCell>
					<TableCell align="right">{maxSimultaneousMemberHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className={classes.tcellHeader} rowSpan={2}><Typography>{strings.newMemberStatus}</Typography></TableCell>
					<TableCell style={{ maxWidth: 300 }}>{strings.newMembers}</TableCell>
					<TableCell align="right">{newMemberHistory.today}</TableCell>
					<TableCell align="right">{newMemberHistory.yesterday}</TableCell>
					<TableCell align="right">{newMemberHistory.thisWeek}</TableCell>
					<TableCell align="right">{newMemberHistory.lastWeek}</TableCell>
					<TableCell align="right">{newMemberHistory.thisMonth}</TableCell>
					<TableCell align="right">{newMemberHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.newMemberDeposits}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.today}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.yesterday}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.thisWeek}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.lastWeek}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.thisMonth}</TableCell>
					<TableCell align="right">{newMemberDepositHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className={classes.tcellHeader} rowSpan={4}><Typography>{strings.bettingSituation}</Typography></TableCell>
					<TableCell style={{ maxWidth: 300 }}>{strings.effectiveBet}</TableCell>
					<TableCell align="right">{betTotalHistory.today}</TableCell>
					<TableCell align="right">{betTotalHistory.yesterday}</TableCell>
					<TableCell align="right">{betTotalHistory.thisWeek}</TableCell>
					<TableCell align="right">{betTotalHistory.lastWeek}</TableCell>
					<TableCell align="right">{betTotalHistory.thisMonth}</TableCell>
					<TableCell align="right">{betTotalHistory.lastMonth}</TableCell>
				</TableRow>
				{/* <TableRow>
					<TableCell style={{maxWidth: 300}}>{strings.prizeAmount}</TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
					<TableCell align="right" style={{paddingRight: 45}}></TableCell>
				</TableRow> */}
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.profitAndLossAmount}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.today - betLossHistory.today).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.yesterday - betLossHistory.yesterday).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.thisWeek - betLossHistory.thisWeek).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.lastWeek - betLossHistory.lastWeek).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.thisMonth - betLossHistory.thisMonth).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(betProfitHistory.lastMonth - betLossHistory.lastMonth).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalNumberOfBets}</TableCell>
					<TableCell align="right">{betValidHistory.today}</TableCell>
					<TableCell align="right">{betValidHistory.yesterday}</TableCell>
					<TableCell align="right">{betValidHistory.thisWeek}</TableCell>
					<TableCell align="right">{betValidHistory.lastWeek}</TableCell>
					<TableCell align="right">{betValidHistory.thisMonth}</TableCell>
					<TableCell align="right">{betValidHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalUserBets}</TableCell>
					<TableCell align="right">{betUserHistory.today}</TableCell>
					<TableCell align="right">{betUserHistory.yesterday}</TableCell>
					<TableCell align="right">{betUserHistory.thisWeek}</TableCell>
					<TableCell align="right">{betUserHistory.lastWeek}</TableCell>
					<TableCell align="right">{betUserHistory.thisMonth}</TableCell>
					<TableCell align="right">{betUserHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className={classes.tcellHeader} rowSpan={3}><Typography>{strings.depositSituation}</Typography></TableCell>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalAmount}</TableCell>
					<TableCell align="right">{depositAmountHistory.today ? depositAmountHistory.today.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{depositAmountHistory.yesterday ? depositAmountHistory.yesterday.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{depositAmountHistory.thisWeek ? depositAmountHistory.thisWeek.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{depositAmountHistory.lastWeek ? depositAmountHistory.lastWeek.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{depositAmountHistory.thisMonth ? depositAmountHistory.thisMonth.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{depositAmountHistory.lastMonth ? depositAmountHistory.lastMonth.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalNumberOfAmounts}</TableCell>
					<TableCell align="right">{depositTotalHistory.today}</TableCell>
					<TableCell align="right">{depositTotalHistory.yesterday}</TableCell>
					<TableCell align="right">{depositTotalHistory.thisWeek}</TableCell>
					<TableCell align="right">{depositTotalHistory.lastWeek}</TableCell>
					<TableCell align="right">{depositTotalHistory.thisMonth}</TableCell>
					<TableCell align="right">{depositTotalHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalPeople}</TableCell>
					<TableCell align="right">{depositUserHistory.today}</TableCell>
					<TableCell align="right">{depositUserHistory.yesterday}</TableCell>
					<TableCell align="right">{depositUserHistory.thisWeek}</TableCell>
					<TableCell align="right">{depositUserHistory.lastWeek}</TableCell>
					<TableCell align="right">{depositUserHistory.thisMonth}</TableCell>
					<TableCell align="right">{depositUserHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell className={classes.tcellHeader} rowSpan={3}><Typography>{strings.withdrawalSituation}</Typography></TableCell>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalAmount}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.today ? withdrawalAmountHistory.today.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.yesterday ? withdrawalAmountHistory.yesterday.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.thisWeek ? withdrawalAmountHistory.thisWeek.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.lastWeek ? withdrawalAmountHistory.lastWeek.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.thisMonth ? withdrawalAmountHistory.thisMonth.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
					<TableCell align="right">{withdrawalAmountHistory.lastMonth ? withdrawalAmountHistory.lastMonth.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalNumberOfAmounts}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.today}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.yesterday}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.thisWeek}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.lastWeek}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.thisMonth}</TableCell>
					<TableCell align="right">{withdrawalTotalHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ maxWidth: 300 }}>{strings.totalPeople}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.today}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.yesterday}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.thisWeek}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.lastWeek}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.thisMonth}</TableCell>
					<TableCell align="right">{withdrawalUserHistory.lastMonth}</TableCell>
				</TableRow>
				<TableRow>
					<TableCell colSpan={2} className={classes.tcellHeader}>{strings.grossMargin}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.today - withdrawalAmountHistory.today).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.yesterday - withdrawalAmountHistory.yesterday).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.thisWeek - withdrawalAmountHistory.thisWeek).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.lastWeek - withdrawalAmountHistory.lastWeek).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.thisMonth - withdrawalAmountHistory.thisMonth).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
					<TableCell align="right">{parseFloat(depositAmountHistory.lastMonth - withdrawalAmountHistory.lastMonth).toLocaleString('en', { maximumFractionDigits: 2 })}</TableCell>
				</TableRow>
			</Fragment>
		}
	/>
}