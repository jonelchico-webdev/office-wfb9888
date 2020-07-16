import React, { useState } from 'react';
import {
	Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, TextField, OutlinedInput, Select, MenuItem
} from '@material-ui/core';
import { SimpleTable, PaymentReviewModal, Loading} from '../../components';
import { GrowItem } from '../../components';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { COMPANY_DEPOSIT_REVIEW } from '../../paths';
import { AppDateRangePicker } from '../../components/date-picker';
import { statusesValues } from '../../values';
import { FormFilterLayout } from '../../components/form-layouts';
import Title from '../../components/title';
import useCompanyDepositReviewQuery from '../../queries-graphql/financial-management/company-deposit-review-query'
import usePagination from '../../hooks/use-pagination';
import gql from 'graphql-tag'
import { green, red, blue } from '@material-ui/core/colors';
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	red: {
		color: "#f44336"
	},
	green: {
		color: "#4caf50"
	},
	yellow: {
		color: "#ffeb3b"
	},
	blue: {
		color: "#508FF4"
	}
}));

const ColorButtonRed = withStyles(theme => ({
	root: {
		color: red[500],
		backgroundColor: red[50],
		border: "1px #f44336 solid",
		'&:hover': {
			backgroundColor: red[100],
		},
	},
}))(Button);

const ColorButtonGreen = withStyles(theme => ({
	root: {
		color: green[500],
		backgroundColor: green[50],
		border: "1px #4caf50 solid",
		'&:hover': {
			backgroundColor: green[100],
		},
	},
}))(Button);

const ColorButtonBlue = withStyles(theme => ({
	root: {
		color: blue[500],
		backgroundColor: blue[50],
		border: "1px #508FF4 solid",
		'&:hover': {
			backgroundColor: blue[100],
		},
	},
}))(Button);

export default function CompanyDepositReview() {
	const classes = useStyles();
	const strings = useLanguages(COMPANY_DEPOSIT_REVIEW);
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setID] = useState(null);
    const [passAmount, setPassAmount] = useState(null);
    const [passStatus, setPassStatus] = useState(null);
    const [passWarning, setPassWarning] = useState(null);
	const [filterValues, setFilterValues] = React.useState({
		startDate: null,
		endDate: null,
		status: '',
		accountNumber: '',
		orderNumber: '',
		depositor: '',
		despositAmountMin: null,
		depositAmountMax: null,
	});

	const dateToday = new Date()
	const tenDaysBef = moment(dateToday).subtract(10, 'days')

	const [mutate, setMutate] = React.useState(false)

	function handleFilterChange(event) {
		event.persist();
		if(event.target.name === "despositAmountMin" || event.target.name === "depositAmountMax"){
			setFilterValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value < 1 ? 0 : event.target.value,
			}));
		}else{
			setFilterValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));
		}
	}

	const [focusedInput, setFocusedInput] = useState(null);

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

	const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: null,
		endDate: null
	})

	// const [searchText, setSearchText] = React.useState([]);

	function searchFor() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
		setFilter(filterValues)
		if (filterValues.startDate === null && filterValues.endDate === null) {
			setFilter({
				filterValues: filterValues,
				startDate: null,
				endDate: null
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
		}
	}

	const COMPANY_DEPOSIT_REVIEW_MUTATE = gql` 
    mutation($orderId: String, $amount: Float, $status: String){
        depositApproval(input: {orderId: $orderId, amount: $amount, status: $status}) {
			clientMutationId
			errors {
				field
				messages
			}
			deposit {
				id
				pk
				status
			}
		}
    }
	`

	const btnStatusChange = (value, stat, warn) => (e) => {
		setModalOpen(true);
        setID(value.orderId);
        setPassAmount(value.amount);
        setPassStatus(stat);
		setPassWarning(warn);
		setMutate(!mutate);
	}

	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { data, loading } = useCompanyDepositReviewQuery({
		depositType: "company",
		bank_Beneficiary_Icontains: filter.filterValues.depositor,
		user_Username: filter.filterValues.accountNumber, orderId_Icontains: filter.filterValues.orderNumber,
		amountMin: filter.filterValues.despositAmountMin, amountMax: filter.filterValues.depositAmountMax,
		mutation: mutate, status: filter.filterValues.status, startAt: filter.startDate == null ? moment(tenDaysBef).format("YYYY-MM-DD") : filter.startDate, endAt: filter.endDate,
		rowsPerPage, before, after, page
	});
	if (loading) {
		return <Loading />;
	}

	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.companyDepositReview} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.companyDepositReview}</Typography></Grid>
			<Grid item style={{
				paddingTop: 0,
				paddingBottom: 0
			}}><Divider light={true} /></Grid>
			<FormFilterLayout>
				<Grid item>
					<Typography color="textSecondary">{strings.date}:</Typography>
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
					<Typography color="textSecondary">{strings.accountNumber}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber"
						onChange={handleFilterChange} value={filterValues.accountNumber} />
				</Grid>
				{/* <Grid item>
					<Typography color="textSecondary">{strings.orderNumber}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="orderNumber"
						onChange={handleFilterChange} value={filterValues.orderNumber} />
				</Grid> */}
				<Grid item>
					<Typography color="textSecondary">{strings.depositor}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="depositor"
						onChange={handleFilterChange} value={filterValues.depositor} />
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.depositAmount}</Typography>
				</Grid>
				<Grid item>
					<Grid container alignItems="center" spacing={1}>
						<Grid item><TextField style={{ width: 70 }} type="number" variant="outlined" margin="dense" name="despositAmountMin"
							onChange={handleFilterChange} value={filterValues.despositAmountMin} /></Grid>
						<Grid item><Typography color="textSecondary">-</Typography></Grid>
						<Grid item><TextField style={{ width: 70 }} type="number" variant="outlined" margin="dense" name="depositAmountMax"
							onChange={handleFilterChange} value={filterValues.depositAmountMax} /></Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.status}</Typography>
				</Grid>
				<Grid item>
					<Select margin="dense"
						displayEmpty
						name="status"
						value={filterValues.status}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} name="status" />}
					>
						<MenuItem value="">{strings.all}</MenuItem>
						<MenuItem value="confirmed">{strings.confirmed}</MenuItem>
						<MenuItem value="pending">{strings.tobeProcessed}</MenuItem>
						<MenuItem value="cancelled">{strings.cancelled}</MenuItem>
					</Select>
				</Grid>
				<GrowItem />
				<Grid item>
					<Button color="primary" variant="contained" onClick={() => searchFor()}>{strings.searchFor}</Button>
				</Grid>
			</FormFilterLayout>
			<Grid item style={{ paddingTop: 0 }}>
				<SimpleTable
					tableProps={{ size: "small" }}
					hasPagination={true}
					noBorder={true}
					pagination={pagination}
					pageInfo={data.deposities.pageInfo}
					count={data.deposities.totalCount}
					// cols={14}
					columns={
						<TableRow>
							<TableCell align="right">{strings.id}</TableCell>
							<TableCell>{strings.memberAccount}</TableCell>
							<TableCell>{strings.hierarchy}</TableCell>
							<TableCell>{strings.vipRating}</TableCell>
							<TableCell>{strings.depositor}</TableCell>
							<TableCell>{strings.depositTime}</TableCell>
							<TableCell>{strings.companyBankInformation}</TableCell>
							<TableCell align="right">{strings.deposits}</TableCell>
							<TableCell align="right">{strings.depositFee}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.actions}</TableCell>
							<TableCell>{strings.operator}</TableCell>
							<TableCell>{strings.operatingTime}</TableCell>
							<TableCell>{strings.remarks}</TableCell>
						</TableRow>
					}
					rows={
						data.deposities.edges.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={14}>{strings.noData}</TableCell>
						</TableRow>
						: 
						data.deposities.edges.map((o, index) => <TableRow key={index}>
							<TableCell align="right">{o.node.pk ? o.node.pk : "-"}</TableCell>
							<TableCell>{o.node.user ? o.node.user.username : "-"}</TableCell>
							<TableCell>{o.node.bank != null ?
								o.node.bank.bankRule.edges.map((bankData) => bankData.node.useCompany ? bankData.node.useCompany.name : "-")
								:
								null
							}</TableCell>
							<TableCell>{o.node.user != null && o.node.user.vipLevel != null ? o.node.user.vipLevel.name : "-"}</TableCell>
							<TableCell>{o.node.bank ? o.node.bank.beneficiary : "-"}</TableCell>
							<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
							<TableCell>{o.node.bank != null ?
								o.node.bank.bankRule.edges.map((bankData) => bankData.node.useCompany ? bankData.node.useCompany.name : "-")
								:
								null
							}</TableCell>
							<TableCell align="right">{o.node.amount ? o.node.amount.toLocaleString('en', {maximumFractionDigits:2}) : 0.00}</TableCell>
							<TableCell align="right">{o.node.handlingFee ? o.node.handlingFee.toLocaleString('en', {maximumFractionDigits:2}) : 0.00}</TableCell>
							<TableCell>
								{
									o.node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.confirmed}</ColorButtonGreen> :
									o.node.status.toLowerCase() ==="cancelled" ? <ColorButtonRed size="small">{strings.cancelled}</ColorButtonRed> :
									<ColorButtonBlue size="small">{strings.pending}</ColorButtonBlue>
								}
							</TableCell>
							<TableCell>
								{o.node.status.toLowerCase() === statusesValues.pending && <Grid container spacing={1} direction="row" style={{ width: 160 }}>
									<Grid item><Button size="small" value="cancelled" onClick={btnStatusChange(o.node, "cancelled", strings.warning2)}>{strings.cancel}</Button></Grid>
									<Grid item><Button size="small" value="confirmed" onClick={btnStatusChange(o.node, "confirmed", strings.warning1)} variant="contained" color="primary">{strings.confirm}</Button></Grid>
								</Grid>}
							</TableCell>
							<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : "-"}</TableCell>
							<TableCell>{o.node.updatedAt ? moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
							<TableCell>{o.node.internalNote ? o.node.internalNote : "-"}</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Grid>
		<PaymentReviewModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={COMPANY_DEPOSIT_REVIEW_MUTATE} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passAmount={passAmount} passStatus={passStatus} />
	</Paper>
}