import React, { useState, Fragment } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider } from '@material-ui/core';
import { SimpleTable, Loading } from '../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { ACCESSION_OVERVIEW } from '../../paths';
import { AppDateRangePicker } from '../../components/date-picker';
import Title from '../../components/title';
import useFinanceOverviewQuery from '../../queries-graphql/financial-management/finance-overview-query'
import usePagination from '../../hooks/use-pagination';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
}));

export default function AccessionOverview(props) {
	const classes = useStyles();
	const strings = useLanguages(ACCESSION_OVERVIEW);

	const [value, setValue] = useState({
		startDate: null,
		endDate: null,
		isClick: false
	})



	const [focusedInput, setFocusedInput] = useState(null);
	function onDatesChange({ startDate, endDate }) {
		setValue(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}
	function onFocusChange(f) {
		setFocusedInput(f);
	}


	const [filter, setFilter] = React.useState({})

	function clickSearch() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
		if (value.startDate !== null && value.startDate !== null) {
			setFilter({
				startDate: value.startDate.format("YYYY-MM-DD").toString(),
				endDate: value.endDate.format("YYYY-MM-DD").toString(),
			})
		} else {
			setFilter({})
		}
	}

	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, setCursor, setPage } = pagination;
	const { data, loading } = useFinanceOverviewQuery({
		startAt: filter.startDate ? filter.startDate : "2018-01-01",
		endAt: filter.endDate ? filter.endDate : moment().format("YYYY-MM-DD").toString(),
		before, after, rowsPerPage
	});

	if (loading) {
		return <Loading />
	}
	const financeOverviewPageInfo = data.financeOverview.pageInfo;
	const count = data.financeOverview.totalCount;

	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.accessionOverview} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.accessionOverview}</Typography></Grid>
			<Grid item style={{
				paddingTop: 0,
				paddingBottom: 0
			}}><Divider light={true} /></Grid>
			<Grid item container alignItems="center" spacing={1} justify="flex-end">
				<Grid item>
					<Typography color="textSecondary">{strings.date}:</Typography>
				</Grid>
				<Grid item>
					<AppDateRangePicker
						focusedInput={focusedInput}
						onFocusChange={onFocusChange}
						onDatesChange={onDatesChange}
						focused={focusedInput}
						startDate={value.startDate}
						endDate={value.endDate}
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
					<Button color="primary" variant="contained" onClick={() => clickSearch()} >{strings.searchFor}</Button>
				</Grid>
			</Grid>
			<Grid item>
				<SimpleTable
					tableProps={{ size: "small" }}
					pageInfo={financeOverviewPageInfo}
					noBorder={true}
					hasPagination={true}
					count={count}
					pagination={pagination}
					columns={
						<Fragment>
							<TableRow className={classes.trow}>
								<TableCell rowSpan={2} style={{ minWidth: "104px" }} align="center">{strings.date}</TableCell>
								<TableCell align="center" colSpan={4}>{strings.companyDeposit}</TableCell>
								<TableCell align="center" colSpan={4}>{strings.onlinePayment}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.manualDeposit}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.totalDepositFee}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.memberWithdrawal}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.manualWithdrawal}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.totalWithdrawalFee}</TableCell>
								<TableCell rowSpan={2} align="center">{strings.charge}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="center">{strings.successfulDepositAmount}</TableCell>
								<TableCell align="center">{strings.numberOfSuccesses}</TableCell>
								<TableCell align="center">{strings.totalNumberOfPen}</TableCell>
								<TableCell align="center">{strings.successRate}</TableCell>
								<TableCell align="center">{strings.successfulDepositAmount}</TableCell>
								<TableCell align="center">{strings.numberOfSuccesses}</TableCell>
								<TableCell align="center">{strings.totalNumberOfPen}</TableCell>
								<TableCell align="center">{strings.successRate}</TableCell>
							</TableRow>
						</Fragment>
					}
					rows={
						data.financeOverview.edges.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={15}>没有可用数据</TableCell>
						</TableRow>
						:
						data.financeOverview.edges.map((o, index) => <TableRow key={index}>
							<TableCell>{o.node.day ? o.node.day : "-"}</TableCell>
							<TableCell align="right">{o.node.companySuccessAmount ? o.node.companySuccessAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.companySuccessCount ? o.node.companySuccessCount : "-"}</TableCell>
							<TableCell align="right">{o.node.companyAllCount ? o.node.companyAllCount : "-"}</TableCell>
							<TableCell align="right">
								{o.node.companySuccessCount && o.node.companyAllCount ?
									(`${((o.node.companySuccessCount / o.node.companyAllCount) * 100).toFixed(2)}%`)
									: "-"}
							</TableCell>
							<TableCell align="right">{o.node.onlineSuccessAmount ? o.node.onlineSuccessAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.onlineSuccessCount ? o.node.onlineSuccessCount : "-"}</TableCell>
							<TableCell align="right">{o.node.onlineAllCount ? o.node.onlineAllCount : "-"}</TableCell>
							<TableCell align="right">
								{o.node.onlineSuccessCount && o.node.onlineAllCount ?
									(`${((o.node.onlineSuccessCount / o.node.onlineAllCount) * 100).toFixed(2)}%`)
									: "-"}
							</TableCell>
							<TableCell align="right">{o.node.manualSuccessAmount ? o.node.manualSuccessAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.depositHandlingFee ? o.node.depositHandlingFee.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.withdrawalMemberAmount ? o.node.withdrawalMemberAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.withdrawalManualAmount ? o.node.withdrawalManualAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.withdrawalHandlingFee ? o.node.withdrawalHandlingFee.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.subtraction ? o.node.subtraction.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Grid>
	</Paper>
}
