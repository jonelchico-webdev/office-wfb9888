import React from 'react';
import useRecentOperation from './use-recent-operation';
import { Loading, SimpleTable } from '../../../components';
import { Paper, TableCell, TableRow } from '@material-ui/core';
import usePagination from '../../../hooks/use-pagination'

export default function RecentOperationTable({ strings }) {
	const pagination = usePagination()
	const { loading, formattedData } = useRecentOperation({ format: { tabular: true } });
	if (loading) {
		return <Loading />
	}
	console.log(formattedData)
	return <Paper elevation={1}>
		<SimpleTable
			tableProps={{ size: "small" }}
			hasPagination={false}
			pagination={pagination}
			pageInfo={false}
			columns={<TableRow>
				<TableCell align="center">{strings.date}</TableCell>
				<TableCell align="center">{strings.activeToday}</TableCell>
				<TableCell align="center">{strings.newMemberToday}</TableCell>
				<TableCell align="center">{strings.rechargeAmount}</TableCell>
				<TableCell align="center">{strings.withdrawalAmount}</TableCell>
				<TableCell align="center">{strings.betAmount}</TableCell>
				<TableCell align="center">{strings.effectiveBet}</TableCell>
				{/* <TableCell align="center">{strings.prizeAmount}</TableCell> */}
				<TableCell align="center">{strings.profitAndLoss}</TableCell>
			</TableRow>}
			rows={
				formattedData.length === 0 ? 
				<TableRow>
					<TableCell align="center" colSpan={9}>没有可用数据</TableCell>
				</TableRow>
				:
				formattedData.map((o, index) => <TableRow key={index}>
					<TableCell>{o.date}</TableCell>
					<TableCell align="center">{o.activeMember}</TableCell>
					<TableCell align="center">{o.newMember}</TableCell>
					<TableCell align="right">{o.depositAmount.toLocaleString('en', {maximumFractionDigits:2})}</TableCell>
					<TableCell align="right">{o.withdrawalAmount.toLocaleString('en', {maximumFractionDigits:2})}</TableCell>
					<TableCell align="right">{o.betAmount ? o.betAmount.toLocaleString('en', {maximumFractionDigits:2}) : 0}</TableCell>
					<TableCell align="center">{o.betActive}</TableCell>
					{/* <TableCell align="right">{o.prizeAmount}</TableCell> */}
					<TableCell align="right">{parseFloat(o.betProfit - o.betLoss).toLocaleString('en', {maximumFractionDigits:2})}</TableCell>
				</TableRow>
				)
			}
		/>
	</Paper>
}