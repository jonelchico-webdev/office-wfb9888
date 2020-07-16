import React, { useState } from 'react'
import { Paper, Grid, Typography, Divider, TableRow, TableCell, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { Loading, SimpleTable, GrowItem, AppDateRangePicker } from '../../../components'
import { useOperationalGeneralReports } from '../../../queries-graphql/report-management/operational-general-report';
import usePagination from '../../../hooks/use-pagination'
import moment from 'moment'

export default function TotalData({ filter, setFilter, strings, classes }) {

	const [filterValues, setFilterValues] = React.useState({
		isAgent: false,
		startDate: null,
		endDate: null,
		accountNumber: '',
		id: '',
	});

	function clear() {
		setFilterValues({
			startDate: null,
			endDate: null,
			accountNumber: '',
		})
	}

	function handleFilterChange(event) {
		event.persist();
		if (event.target.name == "isAgent") {
			if (filterValues.isAgent == false) {
				setFilterValues(oldValues => ({
					...oldValues,
					[event.target.name]: true,
				}));
			} else {
				setFilterValues(oldValues => ({
					...oldValues,
					[event.target.name]: false,
				}));
			}
		} else {
			setFilterValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));
		}

	}
	const [focusedInput, setFocusedInput] = useState(null);

	const pagination = usePagination();

	const { data, loading } = useOperationalGeneralReports({ filter });
	if (loading) {
		return <Loading />;
	}
	const generalReports = data.generalMemberReport ? data.generalMemberReport.edges : null


	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}
	function onFocusChange(f) {
		setFocusedInput(f);
	}

	function clickSearch() {
		setFilter({
			userName: filterValues.accountNumber,
			startAt: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : moment().format("YYYY-MM-DD").toString(),
			endAt: filterValues.endDate ? filterValues.endDate.format("YYYY-MM-DD").toString() : moment().add(1, "days").format("YYYY-MM-DD").toString(),
			isAgent: filterValues.isAgent
		})
	}

	return <Paper elevation={1} className={classes.paperSplit}>
		<Grid container direction="row" justify="space-between" alignItems="center" className={classes.paper}>
			<Typography variant="h6">{strings.operationalGeneralReport}</Typography>
		</Grid>
		<Divider light={true} orientation="vertical" />
		<Grid container alignItems="center" spacing={2} className={classes.paper}>


			<Grid item>
				<Typography>{strings.accountNumber}:</Typography>
			</Grid>
			<Grid item style={{ width: 140 }}>
				<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber" className={classes.textfield}
					onChange={handleFilterChange} value={filterValues.accountNumber} />
			</Grid>

			<Grid item>
				<Typography>{strings.date}:</Typography>
			</Grid>
			<Grid item>
				<AppDateRangePicker
					focusedInput={focusedInput}
					onFocusChange={onFocusChange}
					onDatesChange={onDatesChange}
					startDate={filterValues.startDate}
					endDate={filterValues.endDate}
					startDateId="startDate"
					endDateId="endDate"
					startDatePlaceholderText={strings.startDate}
					endDatePlaceholderText={strings.endDate}
					inputIconPosition="after"
					showDefaultInputIcon
					small
					isOutsideRange={() => false}
				/>
			</Grid>
			<Grid item>
				<FormControlLabel
					value={true}
					label={strings.containsSubordinateData}
					labelPlacement="end"
					name="isAgent"
					control={<Checkbox color="primary" />}
					onChange={handleFilterChange}
				/>
			</Grid>


			<GrowItem />
			<Grid item>
				<Button color="primary" onClick={clear} className={classes.button} >{strings.clearFilter}</Button>
			</Grid>

			<Grid item>
				<Button color="primary" variant="contained" onClick={() => clickSearch()} >{strings.searchFor}</Button>
			</Grid>

		</Grid>
		<Grid item className={classes.paper}>
			<SimpleTable
				tableProps={{ size: "small" }}
				hasPagination={false}
				pageInfo={false}
				count={1}
				noBorder={true}
				pagination={pagination}
				columns={
					<TableRow>
						<TableCell align="right">{strings.activeMember}</TableCell>
						<TableCell align="right">{strings.rechargeAmount}</TableCell>
						<TableCell align="right">{strings.numberOfRecharges}</TableCell>
						<TableCell align="right">{strings.rechargeNumber}</TableCell>
						<TableCell align="right">{strings.withdrawalAmount}</TableCell>
						<TableCell align="right">{strings.numberOfWithdrawal}</TableCell>
						<TableCell align="right">{strings.numberOfPeopleWithdrawal}</TableCell>
						<TableCell align="right">{strings.betAmount}</TableCell>
						<TableCell align="right">{strings.effectiveBet}</TableCell>
						<TableCell align="right">{strings.payoutBet}</TableCell>
						<TableCell align="right">{strings.numberOfBet}</TableCell>
						<TableCell align="right">{strings.numberOfPeopleBets}</TableCell>
						<TableCell align="right">{strings.profitAndLoss}</TableCell>
					</TableRow>
				}
				rows={
					generalReports.length > 0 ?
						generalReports.map((o, index) => <TableRow key={index}>
							<TableCell align="right">{o.node.activeMemberCount ? o.node.activeMemberCount : '-'}</TableCell>
							<TableCell align="right">{o.node.depositAmount ? o.node.depositAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
							<TableCell align="right">{o.node.depositCount ? o.node.depositCount : '-'}</TableCell>
							<TableCell align="right">{o.node.depositUsers ? o.node.depositUsers : '-'}</TableCell>
							<TableCell align="right">{o.node.withdrawalAmount ? o.node.withdrawalAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
							<TableCell align="right">{o.node.withdrawalCount ? o.node.withdrawalCount : '-'}</TableCell>
							<TableCell align="right">{o.node.withdrawalUsers ? o.node.withdrawalUsers : '-'}</TableCell>
							<TableCell align="right">{o.node.betAmount ? o.node.betAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
							<TableCell align="right">{o.node.betValidAmount ? o.node.betValidAmount.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
							<TableCell align="right">{o.node.betPayout ? o.node.betPayout.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
							<TableCell align="right">{o.node.betCount ? o.node.betCount : '-'}</TableCell>
							<TableCell align="right">{o.node.betUsers ? o.node.betUsers : '-'}</TableCell>
							<TableCell align="right">{o.node.subtraction ? o.node.subtraction.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</TableCell>
						</TableRow>)
						:
						<TableRow>
							<TableCell align="right" colSpan={13}>{strings.noDataAvailable}</TableCell>
						</TableRow>
				}
			/>
		</Grid>
	</Paper>
}