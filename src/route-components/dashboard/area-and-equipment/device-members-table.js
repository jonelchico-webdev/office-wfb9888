import React from 'react';
import {getLastNthDayRange} from '../../../helpers/dates';
import {Loading, SimpleTable} from '../../../components';
import {TableRow, TableCell, Typography} from '@material-ui/core';
import {getPercentage} from '../../../helpers/math';
import useDeviceMembers from './use-device-members';
import usePagination from '../../../hooks/use-pagination'

export default function DeviceMembersTable({strings}) {
	let dateRange = getLastNthDayRange(7);
	const pagination = usePagination()
	let {formattedData, loading} = useDeviceMembers({
		fromDate: dateRange.startDate.format("YYYY-MM-DD"),
		toDate: dateRange.endDate.format("YYYY-MM-DD"),
		format: {tabular: true}
	});
	if(loading) {
		return <Loading/>
	}
	const tabularData = formattedData;
	return <SimpleTable
	hasPagination={false}
	pagination={pagination}
	pageInfo={false}
		columns={
			<TableRow>
				<TableCell>{strings.date}</TableCell>
				<TableCell>PC</TableCell>
				<TableCell>Android</TableCell>
				<TableCell>iOS</TableCell>
				<TableCell>{strings.total}</TableCell>
			</TableRow>
		}
		rows={
			tabularData.length === 0 ? 
			<TableRow>
				<TableCell align="center" colSpan={5}>没有可用数据</TableCell>
			</TableRow>
			:
			tabularData.map((o, index) => {
				const total = o.pc + o.android + o.ios;
				return <TableRow key={index}>
					<TableCell>{o.date}</TableCell>
					<TableCell>{o.pc} <Typography component="span" color="secondary">
						({getPercentage(o.pc, total)}%)
					</Typography></TableCell>
					<TableCell>{o.android} <Typography component="span" color="secondary">
						({getPercentage(o.android, total)}%)
					</Typography></TableCell>
					<TableCell>{o.ios} <Typography component="span" color="secondary">
						({getPercentage(o.ios, total)}%)
					</Typography></TableCell>
					<TableCell>{total}</TableCell>
				</TableRow>
			})
		}
	/>
}