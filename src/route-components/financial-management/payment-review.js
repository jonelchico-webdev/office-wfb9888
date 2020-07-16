import React, {useState} from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, TextField, OutlinedInput, Select, MenuItem
} from '@material-ui/core';
import {SimpleTable, PaymentReviewModal, Loading} from '../../components';
import {GrowItem} from '../../components';
import {makeStyles, withStyles} from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import {PAYMENT_REVIEW} from '../../paths';
import { statusesValues } from '../../values';
import { AppDateRangePicker } from '../../components/date-picker';
import Title from '../../components/title';
import usePaymentReviewQuery from '../../queries-graphql/financial-management/payment-review-query'
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

export default function PaymentReview() {
	const classes = useStyles();
	const strings = useLanguages(PAYMENT_REVIEW);
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
		orderId_Icontains: '',
		depositUserName: '',
		amountMin: null,
		amountMax: null,
		statusChangedBy_Username: ''
	});

	const PAYMENT_REVIEW_MUTATION = gql` 
		mutation ($orderId: String, $amount: Float, $status: String){
			withdrawalApproval(input:{
			orderId: $orderId
			status: $status
			amount: $amount
			}) {
				clientMutationId
				errors{
					field
					messages
				}
				withdrawal{
					id
					pk
					amount
					status
				}
			}
		}
	`

	const [mutate, setMutate] = React.useState(false)

	function handleFilterChange(event) {
		event.persist();
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	const [focusedInput, setFocusedInput] = useState(null);
	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}

	const dateToday = new Date()
	const tenDaysBef = moment(dateToday).subtract(10, 'days')

	const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: null,
		endDate: null
	})

	function onFocusChange(f) {
		setFocusedInput(f);
	}

	function searchFor(){
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

	const pagination = usePagination();
	const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
	console.log(moment(tenDaysBef).format("YYYY-MM-DD"))

	const {data, loading} = usePaymentReviewQuery({startAt: filter.startDate == null ? moment(tenDaysBef).format("YYYY-MM-DD") : filter.startDate, endAt: filter.endDate, rowsPerPage, before, after,
		user_Username: filter.filterValues.accountNumber, status: filter.filterValues.status, 
		amountMin: filter.filterValues.amountMin, amountMax: filter.filterValues.amountMax,
		orderId_Icontains: filter.filterValues.orderId_Icontains, depositUserName: filter.filterValues.depositUserName, 
		statusChangedBy_Username: filter.filterValues.statusChangedBy_Username, mutation: mutate,
		rowsPerPage, 
		before,
		after,
		page
	});

	if(loading){
		return <Loading />
	}

	const btnStatusChange = (value, stat, warn) => (e) => {
        setModalOpen(true);
        setID(value.orderId);
        setPassAmount(value.amount);
        setPassStatus(stat);
        setPassWarning(warn);
	}

	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.paymentReview} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.paymentReview}</Typography></Grid>
			<Grid item style={{
				paddingTop: 0,
				paddingBottom: 0
			}}><Divider light={true}/></Grid>
			<Grid item container alignItems="center" spacing={1}>
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
				<Grid item style={{width: 140}}>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="accountNumber"
						onChange={handleFilterChange} value={filterValues.accountNumber}
					/>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.orderNumber}:</Typography>
				</Grid>
				<Grid item style={{width: 140}}>
					<TextField variant="outlined" onChange={handleFilterChange} name="orderId_Icontains" 
						margin="dense" placeholder={strings.pleaseEnter} value={filterValues.orderId_Icontains}/>
				</Grid>
				{/* <Grid item>
					<Typography color="textSecondary">{strings.depositor}:</Typography>
				</Grid>
				<Grid item style={{width: 140}}>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="depositUserName"
						onChange={handleFilterChange} value={filterValues.depositUserName}
					/>
				</Grid> */}
				<Grid item>
					<Typography color="textSecondary">{strings.depositAmount}</Typography>
				</Grid>
				<Grid item>
					<Grid container alignItems="center" spacing={1}>
						<Grid item style={{width: 100}}><TextField type="number"  variant="outlined" margin="dense" name="amountMin"
							onChange={handleFilterChange} value={filterValues.amountMin}
						/></Grid>
						<Grid item><Typography color="textSecondary">-</Typography></Grid>
						<Grid item style={{width: 100}}><TextField type="number"  variant="outlined" margin="dense" name="amountMax"
							onChange={handleFilterChange} value={filterValues.amountMax}
						/></Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.status}</Typography>
				</Grid>
				<Grid item>
					<Select margin="dense"
						style = {{ minWidth: 80 }}
						displayEmpty
						name="status"
						value={filterValues.status}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} labelWidth={88} name="status"/>}
					>
					<MenuItem value="">{strings.all}</MenuItem>
					<MenuItem value="confirmed">{strings.confirmed}</MenuItem>
					<MenuItem value="pending">{strings.pending}</MenuItem>
					<MenuItem value="cancelled">{strings.cancelled}</MenuItem>
					</Select>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.operator}</Typography>
				</Grid>
				<Grid item style={{width: 140}}>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="statusChangedBy_Username"
						onChange={handleFilterChange} value={filterValues.statusChangedBy_Username}
					/>
				</Grid>
				<GrowItem/>
				<Grid item>
					<Button color="primary" variant="contained" onClick={() => searchFor()} >{strings.searchFor}</Button>
				</Grid>
			</Grid>
			<Grid item>
				<SimpleTable
					tableProps={{ size: "small" }}
					hasPagination={true}
					noBorder={true}
					pagination={pagination}
					pageInfo={data.withdrawals.pageInfo}
					count={data.withdrawals.totalCount}
					columns={
						<TableRow>
							<TableCell align="right">{strings.id}</TableCell>
							<TableCell>{strings.memberAccount}</TableCell>
							<TableCell>{strings.hierarchy}</TableCell>
							<TableCell>{strings.vipRating}</TableCell>
							<TableCell>{strings.withdrawalApplicationTime}</TableCell>
							<TableCell align="right">{strings.amountOfWithdrawal}</TableCell>
							<TableCell>{strings.cashWithdrawalBank}</TableCell>
							<TableCell align="right">{strings.accountBalance}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.actions}</TableCell>
							<TableCell>{strings.operator}</TableCell>
							<TableCell>{strings.bonusControlReviewTime}</TableCell>
							<TableCell>{strings.financialWithdrawTime}</TableCell>
							<TableCell>{strings.remarks}</TableCell>
						</TableRow>
					}
					rows={
						data.withdrawals.edges.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={14}>没有可用数据</TableCell>
						</TableRow>
						:
						data.withdrawals.edges.map((o, index) => <TableRow key={index}>
							<TableCell align="right">{o.node.pk ? o.node.orderId : ''}</TableCell>
							<TableCell>{o.node.user.username ? o.node.user.username : ''}</TableCell>
							<TableCell>{o.node.user.memberLevel ? o.node.user.memberLevel.name : ''}</TableCell>
							<TableCell>{o.node.user.vipLevel? o.node.user.vipLevel.name : null}</TableCell>
							<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : ''}</TableCell>
							<TableCell align="right">{o.node.amount ? o.node.amount.toLocaleString('en', {maximumFractionDigits:2}) : "-" }</TableCell>
							<TableCell>{o.node.depositBankName ? o.node.depositBankName: ''}</TableCell>
							<TableCell align="right">{o.node.riskApproval ? 
								o.node.riskApproval.edges.map((app , idx) => (
									app.node.balance.toLocaleString('en', {maximumFractionDigits:2})
								)) : '-'
							}</TableCell>
							<TableCell>
								{
									o.node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.confirmed}</ColorButtonGreen> :
									o.node.status.toLowerCase() ==="cancelled" ? <ColorButtonRed size="small">{strings.cancelled}</ColorButtonRed> :
									<ColorButtonBlue size="small">{strings.pending}</ColorButtonBlue>
								}
							</TableCell>
							<TableCell>
								{ o.node.status ? o.node.status.toLowerCase() === statusesValues.pending && <Grid container spacing={1} direction="row" style={{width: 160}}>
									<Grid item><Button size="small"  onClick={btnStatusChange(o.node, "cancelled", strings.warning2)}>{strings.cancel}</Button></Grid>
									<Grid item>
										{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((app , idx) => (
												app.node.status.toLowerCase() === "confirmed" ? 
												<Button size="small" variant="contained" color="primary" onClick={btnStatusChange(o.node, "confirmed", strings.warning1)}>{strings.confirm}</Button> 
												: <Typography color="textSecondary">需要风险批准</Typography>
											)) : ''
										}
									</Grid>
								</Grid> : null}
							</TableCell>
							<TableCell></TableCell>
							<TableCell>{o.node.riskApproval ? 
								o.node.riskApproval.edges.map((app , idx) => (
									moment(app.node.updatedAt).format("YYYY-MM-DD HH:mm:ss")
								)) : ''
							}</TableCell>
							<TableCell>{moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
							<TableCell>{o.node.internalNote}</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Grid>
		<PaymentReviewModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={PAYMENT_REVIEW_MUTATION} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passAmount={passAmount} passStatus={passStatus} />
	</Paper> 
}
