import React, { useState } from 'react';
import moment from 'moment';
import {
	Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, TextField, OutlinedInput, Select, MenuItem, Box
} from '@material-ui/core';
import {Loading} from '../../components';
import { SimpleTable } from '../../components';
import { GrowItem } from '../../components';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { MANUAL_DEPOSIT_REVIEW } from '../../paths';
import { statusesValues } from '../../values';
import { FormFilterLayout } from '../../components/form-layouts';
import { AppDateRangePicker } from '../../components/date-picker';
import Title from '../../components/title';
import usePagination from '../../hooks/use-pagination';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import { green, red, blue } from '@material-ui/core/colors';
import useManualDepositReviewQuery from '../../queries-graphql/financial-management/manual-deposit-review';

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
		borderRadius: "5px",
		textAlign: "center",
		padding: 5,
		width: 75,
		border: "1px #f44336 solid",
		'&:hover': {
			backgroundColor: red[100],
		},
	},
}))(Box);

const ColorButtonGreen = withStyles(theme => ({
	root: {
		color: green[500],
		backgroundColor: green[50],
		borderRadius: "5px",
		textAlign: "center",
		padding: 5,
		width: 75,
		border: "1px #4caf50 solid",
		'&:hover': {
			backgroundColor: green[100],
		},
	},
}))(Box);


const ColorButtonBlue = withStyles(theme => ({
	root: {
		color: blue[500],
		backgroundColor: blue[50],
		borderRadius: "5px",
		textAlign: "center",
		padding: 5,
		width: 75,
		border: "1px #508FF4 solid",
		'&:hover': {
			backgroundColor: blue[100],
		},
	},
}))(Box);

export default function ManualDepositReview(props) {
	const classes = useStyles();
	const strings = useLanguages(MANUAL_DEPOSIT_REVIEW);
	const [filterValues, setFilterValues] = useState({
		startDate: null,
		endDate: null,
		status: '',
		orderNumber: '',
		depositSystem: '',
		depositType: '',
		applicant: '',
		operator: ''
	});

	const [focusedInput, setFocusedInput] = useState(null);
	const [filter, setFilter] = useState({
		filterValues: [],
		startDate: "2000-01-01",
		endDate: moment().add(1, 'day').format("YYYY-MM-DD").toString()
	});

	function handleFilterChange(event) {
		event.persist();
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

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
	function searchFor() {
		setCursor({
            before: null,
            after: null
        })
        setPage(0)
		setFilter(filterValues)
		if(filterValues.startDate === '' && filterValues.endDate === '') {
			setFilter ({
				filterValues: filterValues,
				startDate: "",
				endDate: ""
			})
		} else {
			setFilter ({
				filterValues: filterValues,
				startDate: filterValues.startDate ? filterValues.startDate.format("YYYY-MM-DD").toString() : '2000-01-01',
		 		endDate: filterValues.endDate ?  filterValues.endDate.format("YYYY-MM-DD").toString() :  moment().format("YYYY-MM-DD").toString()
			})
		}
	}


	const MANUAL_DEPOSIT_REVIEW_MUTATE = gql` 
    mutation($orderId: String, $status: String, $amount: Float, $depositDate: DateTime){
		depositApproval(input: 
			{
				orderId: $orderId, 
				status: $status, 
				amount: $amount,
				depositDate: $depositDate
			}
		) {
			clientMutationId
			errors {
				field
				messages
			}
			deposit {
				id
				orderId
				status
				amount
			}
		}
    }
	`

	const [depositApproval] = useMutation(MANUAL_DEPOSIT_REVIEW_MUTATE)

	const [mutate, setMutate] = useState(false);
	function onChangeClear() {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate: null,
			endDate: null,
			status: '',
			orderNumber: '',
			depositSystem: '',
			depositType: "manual",
			applicant: '',
			operator: ''
		}));
	}
	
	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { data, loading } = useManualDepositReviewQuery({
		depositType: "manual",
		bank_Beneficiary_Icontains: filterValues.depositor,
		user_Username: filter.filterValues.applicant, 
		statusChangedBy_Username: filter.filterValues.operator,
		orderId_Icontains: filter.filterValues.orderNumber,
		amountMin: filterValues.despositAmountMin, 
		amountMax: filterValues.depositAmountMax,
		status: filter.filterValues.status, 
		startAt: filter.startDate, 
		endAt: filter.endDate,
		rowsPerPage, 
		before, 
		after, 
		page, 
		mutation: mutate
	});
	if (loading) {
		return <Loading />;
	}

	const btnStatusChange =  (orderId, amountNum) => async (e) => {

		let test = ''
		if(e.currentTarget.value == "confirmed") {
			test = "已确认"
		} else if (e.currentTarget.value == "cancelled") {
			test = "取消"
		}
		
		const res = await depositApproval({
			variables: {
				orderId: orderId, 
				status: e.currentTarget.value, 
				amount: amountNum,
				depositDate: moment()
			}	
		})
		
		if(res.data.depositApproval.errors[0]){
			swal.fire({
				position: 'center',
				type: 'error',
				title: 'Oops...',
				text: res.data.depositApproval.errors[0].messages[0],
				showConfirmButton: true,

			})
		} else {
			swal.fire({
				position: 'center',
				type: 'success',
				title: 'Success',
				text: '手动存款 ' + test,
				showConfirmButton: true
			})
		}
		setMutate(!mutate)
	}
	

	// const manualDepositReview = data.deposities.edges;
	const pageInfo = data.deposities.pageInfo
	const count = data.deposities.totalCount

	// console.log(manualDepositReview)
	// return <Query query={MANUAL_DEPOSIT_REVIEW_QUERY}>
	// 	{({ loading, error, data }) => {
	// 		if (loading) return <div/>;
	// 		console.log('MANUAL_DEPOSIT_REVIEW_QUERY', data, error)
	// 		const {manualDepositReview} = data;
	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.manualDepositReview} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.manualDepositReview}</Typography></Grid>
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
					<Typography color="textSecondary">{strings.id}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="orderNumber"
						onChange={handleFilterChange} value={filterValues.orderNumber} />
				</Grid>
				{/* <Grid item>
					<Typography color="textSecondary">{strings.depositSystem}:</Typography>
				</Grid>
				<Grid item>
					<Select aria-label="Deposit System"
						margin="dense"
						name="depositSystem"
						displayEmpty
						value={filterValues.depositSystem}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} name="depositSystem" />}
					>
						<MenuItem value={""}>{strings.all}</MenuItem>
						<MenuItem value={depositSystemsValues.member}>{strings.memberAccount}</MenuItem>
						<MenuItem value={depositSystemsValues.entry}>{strings.entryLevel}</MenuItem>
						<MenuItem value={depositSystemsValues.vip}>{strings.vipRating}</MenuItem>
					</Select>
				</Grid> */}
				<Grid item>
					<Typography color="textSecondary">{strings.status}</Typography>
				</Grid>
				<Grid item>
					<Select margin="dense"
						name="status"
						value={filterValues.status}
						onChange={handleFilterChange}
						displayEmpty
						input={<OutlinedInput notched={false} name="status" />}
					>
						<MenuItem value={""}>{strings.all}</MenuItem>
						<MenuItem value={statusesValues.confirmed}>{strings.confirmed}</MenuItem>
						<MenuItem value={statusesValues.pending}>{strings.toBeProcessed}</MenuItem>
						<MenuItem value={statusesValues.cancelled}>{strings.cancelled}</MenuItem>
					</Select>
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.applicant}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="applicant"
						onChange={handleFilterChange} value={filterValues.applicant} />
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.operator}:</Typography>
				</Grid>
				<Grid item>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="operator"
						onChange={handleFilterChange} value={filterValues.operator} />
				</Grid>
				<GrowItem />
				<Grid item>
					<Button onClick={onChangeClear}>{strings.reset}</Button>
				</Grid>
				<Grid item>
					<Button color="primary" variant="contained" onClick={() => searchFor()}>{strings.searchFor}</Button>
				</Grid>
			</FormFilterLayout>
			<Grid item style={{ paddingTop: 0 }}>
				<SimpleTable
					tableProps={{ size: "small" }}
					hasPagination={true}
					pagination={pagination}
					pageInfo={pageInfo}
					count={count}
					columns={
						<TableRow>
							<TableCell align="center">{strings.id}</TableCell>
							{/* <TableCell>{strings.depositSystem}</TableCell> */}
							<TableCell>{strings.memberAccount}</TableCell>
							{/* <TableCell>{strings.hierarchy}</TableCell>
							<TableCell>{strings.vipRating}</TableCell> */}
							<TableCell>{strings.depositApplicant}</TableCell>
							<TableCell>{strings.applicationTime}</TableCell>
							<TableCell>{strings.depositType}</TableCell>
							<TableCell align="right">{strings.deposits}</TableCell>
							<TableCell align="right">{strings.auditAmount}</TableCell>
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
							<TableCell align="center" colSpan={15}>{strings.noDataAvailable}</TableCell>
						</TableRow>
						:
						data.deposities.edges.map((o, index) => <TableRow key={index}>
							<TableCell>{o.node.orderId ? o.node.orderId : null}</TableCell>
							{/* <TableCell>what is this</TableCell> */}
							<TableCell>{o.node.user ? o.node.user.username : null}</TableCell>
							{/* <TableCell>
								{o.node.bank != null ?
									o.node.bank.bankRule.edges.map((bankData) => bankData.node.useCompany.name)
									:
									"NO BANK"
								}
							</TableCell>
							<TableCell>{o.node.vipLevel ? o.node.user.vipLevel.name : "NO VIP LEVEL"}</TableCell> */}
							<TableCell>{o.node.user ? o.node.user.username : null}</TableCell>
							<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : null}</TableCell>
							<TableCell>{
								o.node.depositType == "MANUAL" ? strings.manualDeposit 
								: strings.other
							}
							</TableCell>
							<TableCell align="right">{o.node.amount ? o.node.amount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell align="right">{o.node.auditAmount ? o.node.auditAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
							<TableCell>
								{
									o.node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.confirmed}</ColorButtonGreen> :
									o.node.status.toLowerCase() === "cancelled" ? <ColorButtonRed size="small">{strings.cancelled}</ColorButtonRed> :
									<ColorButtonBlue size="small">{strings.pending}</ColorButtonBlue>
								}
							</TableCell>
							<TableCell>
								{o.node.status.toLowerCase() === statusesValues.pending && <Grid container spacing={1} direction="row" justify="center" style={{ width: 160 }}>
									<Grid item><Button size="small" value="cancelled" onClick={btnStatusChange(o.node.orderId, o.node.amount)}>{strings.cancel}</Button></Grid>
									<Grid item><Button size="small" value="confirmed" onClick={btnStatusChange(o.node.orderId, o.node.amount)} variant="contained" color="primary">{strings.confirm}</Button></Grid>
								</Grid>}
							</TableCell>
							<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : "-"}</TableCell>
							<TableCell>{o.node.updatedAt ? moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "-" }</TableCell>
							<TableCell>{o.node.internalNote ? o.node.internalNote : null}</TableCell>
						</TableRow>)
					}
				/>
			</Grid>
		</Grid>
	</Paper>
}