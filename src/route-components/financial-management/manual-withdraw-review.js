import React, { useState } from 'react';
import {
	Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, TextField, OutlinedInput, Select, MenuItem, Box
} from '@material-ui/core';
import { SimpleTable } from '../../components';
import { GrowItem } from '../../components';
import { makeStyles, withStyles } from '@material-ui/styles';
import {Loading} from '../../components';
import useLanguages from '../../hooks/use-languages';
import { MANUAL_WITHDRAW_REVIEW } from '../../paths';
import { useMutation } from 'react-apollo';
import { AppDateRangePicker } from '../../components/date-picker';
import { withdrawalTypesValues, statusesValues } from '../../values';
import { FormFilterLayout } from '../../components/form-layouts';
import Title from '../../components/title';
import useWithdrawalAccountsQuery from '../../queries-graphql/financial-management/use-withdrawal-accounts'
import usePagination from '../../hooks/use-pagination';
import gql from 'graphql-tag'
import swal from 'sweetalert2';
import moment from 'moment';
import { green, red, blue } from '@material-ui/core/colors';

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

const MANUAL_WITHDRAW_REVIEW_INITIAL_STATE = {
	startDate: null,
	endDate: null,
	status: '',
	orderId: '',
	withdrawalType: '',
	applicant: '',
	operator: ''
}

export default function ManualWithdrawalReview(props) {

	const classes = useStyles();
	const strings = useLanguages(MANUAL_WITHDRAW_REVIEW);
	const [focusedInput, setFocusedInput] = useState(null);
	const [filterValues, setFilterValues] = React.useState(MANUAL_WITHDRAW_REVIEW_INITIAL_STATE);
	const [filter, setFilter] = useState({
		filterValues: [],
		startDate: "2000-01-01",
		endDate: moment().add(1, 'day').format("YYYY-MM-DD").toString()
	})
	function handleFilterChange(event) {
		event.persist()
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
	function clickSearch() {
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

	const WITHDRAWAL_ACCOUNTS_MUTATE = gql` 
	mutation($orderId: String, $status: String, $amount: Float, $withdrawDate: DateTime){
		withdrawalApproval(input:{
		  orderId: $orderId,
		  status: $status,
		  amount: $amount,
		  withdrawDate: $withdrawDate
		}) {
		  clientMutationId
		  errors{
			field
			messages
		  }
		}
	  }`


	const [withdrawalApproval] = useMutation(WITHDRAWAL_ACCOUNTS_MUTATE)
	const [mutate, setMutate] = React.useState(false)

	async function mutateClickConfirm(orderId, amount) {
		 const res = await withdrawalApproval({
				variables: { 
					orderId: orderId, 
					status: "confirmed", 
					amount: amount ,
					withdrawDate: moment()
				}
			})
			if(res.data.withdrawalApproval.errors[0]){
				swal.fire({
					position: 'center',
					type: 'error',
					title: 'Oops...',
					text: "提款需要风险批准",
					showConfirmButton: true
				})
			} else {
				swal.fire({
					position: 'center',
					type: 'success',
					title: '手动提款已确认',
					showConfirmButton: true
				})
			}
			setMutate(!mutate)
		
		
	}

	async function mutateClickCancel(orderId, amount) {
		const res = await withdrawalApproval({
			variables: { 
				orderId: orderId, 
				status: "cancelled", 
				amount: amount ,
				withdrawDate: moment()
			}
		})
		if(res.data.withdrawalApproval.errors[0]){
			swal.fire({
				position: 'center',
				type: 'error',
				title: 'Oops...',
				text:res.data.withdrawalApproval.errors[0].messages[0],
				showConfirmButton: true
			})
		} else {
			swal.fire({
				position: 'center',
				type: 'success',
				title: 'Success',
				text: '手动提款已取消',
				showConfirmButton: true
			})
		}
		setMutate(!mutate)
	}
	
	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { data, loading } = useWithdrawalAccountsQuery({
		withdrawalType: filter.filterValues.withdrawalType,
		user_Username: filter.filterValues.applicant,
		statusChangedBy_Username: filter.filterValues.operator,
		orderId_Icontains: filter.filterValues.orderId,
		startAt: filter.startDate,
		endAt: filter.endDate,
		status: filter.filterValues.status,
		mutation: mutate,
		rowsPerPage,
		before,
		after,
		page
	});

	if (loading) {
		return <Loading />;
	}

	const withdrawalAccounts = data.withdrawals.edges
	const pageInfo = data.withdrawals.pageInfo
	const count = data.withdrawals.totalCount
	// console.log(data)
	// return <Query query={MANUAL_WITHDRAW_REVIEW_QUERY} client={mockClient}>
	// 	{({ loading, error, data }) => {
	// 		if (loading) return <div/>;

	// 		const {manualWithdrawalReview} = data;
	// 		console.log(manualWithdrawalReview, 'gg')
	// 		const count = manualWithdrawalReview.length
	 	return <Paper elevation={1} className={classes.paper}>
		<Title pageTitle={strings.manualWithdrawalReview} />
		<Grid container spacing={2} direction="column">
			<Grid item><Typography variant="h6">{strings.manualWithdrawalReview}</Typography></Grid>
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
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="orderId"
						onChange={handleFilterChange} value={filterValues.orderId} />
				</Grid>
				<Grid item>
					<Typography color="textSecondary">{strings.withdrawalType}:</Typography>
				</Grid>
				<Grid item>
					<Select aria-label="Withdrawal Type"
						margin="dense"
						name="withdrawalType"
						value={filterValues.withdrawalType}
						onChange={handleFilterChange}
						displayEmpty
						input={<OutlinedInput notched={false} name="withdrawalType" />}
					>
						<MenuItem value={""}>{strings.all}</MenuItem>
						<MenuItem value={withdrawalTypesValues.manual}>{strings.manualWithdrawal}</MenuItem>
						<MenuItem value={withdrawalTypesValues.discount}>{strings.discountDeduction}</MenuItem>
						<MenuItem value={withdrawalTypesValues.other}>{strings.otherDeduction}</MenuItem>
					</Select>
				</Grid>
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
					<Button onClick={() => setFilterValues(MANUAL_WITHDRAW_REVIEW_INITIAL_STATE)}>{strings.reset}</Button>
				</Grid>
				<Grid item>
					<Button color="primary" variant="contained" onClick={() => clickSearch()} >{strings.searchFor}</Button>
				</Grid>
			</FormFilterLayout>
			<Grid item style={{ paddingTop: 0 }}>
				<SimpleTable
					tableProps={{ size: "small" }}
					hasPagination={true}
					noBorder={true}
					pagination={pagination}
					pageInfo={pageInfo}
					count={count}
					cols={12}
					columns={
						<TableRow>
							<TableCell align="center">{strings.id}</TableCell>
							<TableCell>{strings.memberAccount}</TableCell>
							<TableCell>{strings.memberLevel}</TableCell>
							<TableCell>{strings.VIPRating}</TableCell>
							<TableCell>{strings.withdrawalApplicant}</TableCell>
							<TableCell>{strings.applicationTime}</TableCell>
							<TableCell>{strings.withdrawalType}</TableCell>
							<TableCell align="right">{strings.deposits}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.actions}</TableCell>
							<TableCell>{strings.operator}</TableCell>
							<TableCell>{strings.operatingTime}</TableCell>
							<TableCell>{strings.remarks}</TableCell>
						</TableRow>
					}
					rows={
						withdrawalAccounts.length === 0 ?
						<TableRow>
							<TableCell align="center" colSpan={14}>没有可用数据</TableCell>
						</TableRow>
						:
						withdrawalAccounts.map((o, index) => {

							return <TableRow key={index}>
								<TableCell>{o.node.orderId}</TableCell>
								<TableCell>{o.node.user ? o.node.user.username : null}</TableCell>
								<TableCell>{o.node.user.memberLevel ? o.node.user.memberLevel.name : null}</TableCell>
								<TableCell>{o.node.user.vipLevel ? o.node.user.vipLevel.name : null}</TableCell>
								<TableCell>{o.node.user ? o.node.user.username : null}</TableCell>
								<TableCell>{moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
								<TableCell>{strings[`${o.node.withdrawalType.toLowerCase()}Deduction`]}</TableCell>
								<TableCell align="right">{o.node.amount ? o.node.amount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
								<TableCell>
								{
										o.node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.confirmed}</ColorButtonGreen> :
										o.node.status.toLowerCase() === "cancelled" ? <ColorButtonRed size="small">{strings.cancelled}</ColorButtonRed> :
										<ColorButtonBlue size="small">{strings.pending}</ColorButtonBlue>
								}
								</TableCell>
								
								<TableCell>
									{o.node.status.toLowerCase() === statusesValues.pending && <Grid container spacing={1} direction="row" justify="center" style={{ width: 160 }}>
										<Grid item><Button size="small" value="cancelled" onClick={() => mutateClickCancel(o.node.orderId, o.node.amount)}>{strings.cancel}</Button></Grid>
										<Grid item><Button size="small" value="confirmed" onClick={() => mutateClickConfirm(o.node.orderId, o.node.amount)} variant="contained" color="primary">{strings.confirm}</Button></Grid>
									</Grid>}
								</TableCell>
								<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : null}</TableCell>
								<TableCell>{moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
								<TableCell>{o.node.internalNote}</TableCell>
							</TableRow>
						})
					}
				/>
			</Grid>
		</Grid>
	</Paper>
	}
// }
// </Query>
// }
