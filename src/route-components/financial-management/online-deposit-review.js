import React, {useState} from 'react';
import {Paper, TableCell, TableRow, Grid, Button, Typography,
	Divider, TextField, OutlinedInput, Select, MenuItem
} from '@material-ui/core';
import {SimpleTable, PaymentReviewModal, Loading} from '../../components';
import {GrowItem} from '../../components';
import {makeStyles} from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import {ONLINE_DEPOSIT_REVIEW} from '../../paths';
import StatusIcon from '../shared-components/status';
import { statusesValues } from '../../values';
import { AppDateRangePicker } from '../../components/date-picker';
import Title from '../../components/title';
import useOnlineDepositReview from '../../queries-graphql/financial-management/online-deposit-review';
import usePagination from '../../hooks/use-pagination';
import gql from 'graphql-tag'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
}));

export default function CompanyDepositReview() {
	const classes = useStyles();
	const strings = useLanguages(ONLINE_DEPOSIT_REVIEW);
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
		depositAmountMin: 0,
		depositAmountMax: 0,
		pkID: null
	});

	const dateToday = new Date()
	const tenDaysBef = moment(dateToday).subtract(10, 'days')

	function handleFilterChange(event) {
		event.persist()
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
	function onFocusChange(f) {
		setFocusedInput(f);
	}

	const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: null,
		endDate: null
	})

	function clickSearch() {
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

		// useEffect(() => {
		// 	const {data} = useOnlineDepositReview({ depositType: "online", user_Username_Icontains: filter.depositor });
		// }

	}

	/* MUTATION */
	const ONLINE_DEPOSIT_ACCOUNTS_MUTATE = gql` 
    mutation($orderId: String, $status: String, $amount: Float){
        depositApproval(input:{
		orderId: $orderId
		status:$status
		amount: $amount
        }) {
        clientMutationId
        errors{
            field
            messages
        }
        deposit {
            id
            pk
            amount
            status
            orderId
        }
        }
    }
	`
	const [mutate, setMutate] = React.useState(false)

	// function mutateClick(node) {
	// 	depositApproval({
	// 		variables: {
	// 			orderId: node.orderId, 
	// 			status:"confirmed",
	// 			amount: node.amount
	// 		}	
	// 	})
	// 	setMutate(
	// 		(mutate) ? false : true
	// 	)
	// }

	// function mutateClickCancel(node) {
	// 	depositApproval({
	// 		variables: {
	// 			orderId: node.orderId, 
	// 			status:"cancelled",
	// 			amount: node.amount
	// 		}	
	// 	})
	// 	setMutate(!mutate)
	// }

	const btnStatusChange = (value, stat, warn) => (e) => {
		setModalOpen(true);
        setID(value.orderId);
        setPassAmount(value.amount);
        setPassStatus(stat);
        setPassWarning(warn);
	}
	/* END */

	const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, page, setCursor, setPage } = pagination;
    const {data, loading} = useOnlineDepositReview({ 
		depositType: "online", 
		user_Username_Icontains: filter.filterValues.accountNumber, 
		orderId_Icontains: filter.filterValues.orderNumber,
		startAt: filter.startDate == null ? moment(tenDaysBef).format("YYYY-MM-DD") : filter.startDate, 
		endAt: filter.endDate,
		amountMax: filter.filterValues.depositAmountMax,
		amountMin: filter.filterValues.depositAmountMin,
		status: filter.filterValues.status,
		bank_Beneficiary_Icontains: filter.filterValues.depositor,
		mutation: mutate,
		deletedFlag: false,
		rowsPerPage, 
		before,
		after,
		page,
	});

    if(loading) {
		// console.log( loading, 'asdasdas')
        return <Loading />;
    }
    
    // const depositAccounts = data.deposities.edges;
	// const pageInfo = data.deposities.pageInfo;
	// const count = data.deposities.totalCount;
	// console.log(data)
	// console.log(depositAccounts)
	
			return <Paper elevation={1} className={classes.paper}>
				<Title pageTitle={strings.onlineDepositReview} />
				<Grid container spacing={2} direction="column">
					<Grid item><Typography variant="h6">{strings.onlineDepositReview}</Typography></Grid>
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
						{/* <Grid item>
							<Typography color="textSecondary">{strings.orderNumber}:</Typography>
						</Grid>
						<Grid item style={{width: 140}}>
							<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="orderNumber"
								onChange={handleFilterChange} value={filterValues.orderNumber}
							/>
						</Grid> */}
						<Grid item>
							<Typography color="textSecondary">{strings.depositor}:</Typography>
						</Grid>
						<Grid item style={{width: 140}}>
							<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="depositor"
								onChange={handleFilterChange} value={filterValues.depositor}
							/>
						</Grid>
						<Grid item>
							<Typography color="textSecondary">{strings.depositAmount}</Typography>
						</Grid>
						<Grid item>
							<Grid container alignItems="center" spacing={1}>
								<Grid item style={{width: 82}}><TextField type="number"  variant="outlined" margin="dense" name="depositAmountMin"
									onChange={handleFilterChange} value={filterValues.depositAmountMin}
								/></Grid>
								<Grid item><Typography color="textSecondary">-</Typography></Grid>
								<Grid item style={{width: 82}}><TextField type="number"  variant="outlined" margin="dense" name="depositAmountMax" 
									onChange={handleFilterChange} value={filterValues.depositAmountMax}
								/></Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Typography color="textSecondary">{strings.status}</Typography>
						</Grid>
						<Grid item>
							<Select margin="dense"
								style = {{ minWidth: 80 }}
								name="status"
								value={filterValues.status}
								onChange={handleFilterChange}
								displayEmpty
								input={<OutlinedInput notched={false} labelWidth={88} name="status"/>}
							>
							<MenuItem value={""}>{strings.all}</MenuItem>
							<MenuItem value={statusesValues.confirmed}>{strings.confirmed}</MenuItem>
							<MenuItem value={statusesValues.pending}>{strings.toBeProcessed}</MenuItem>
							<MenuItem value={statusesValues.cancelled}>{strings.cancelled}</MenuItem>
							</Select>
						</Grid>
						<GrowItem/>
						<Grid item>
							<Button color="primary" variant="contained" onClick={() => clickSearch()} >{strings.searchFor}</Button>
						</Grid>
					</Grid>
					<Grid item>
						<SimpleTable
							tableProps={{ size: "small" }}
							hasPagination={true}
							noBorder={true}
							pagination={pagination}
							pageInfo={data.deposities.pageInfo}
							count={data.deposities.totalCount}
							columns={
								<TableRow>
									<TableCell align="right">{strings.id}</TableCell>
									<TableCell>{strings.memberAccount}</TableCell>
									<TableCell>{strings.hierarchy}</TableCell>
									<TableCell>{strings.vipRating}</TableCell>
									<TableCell>{strings.depositTime}</TableCell>
									<TableCell>{strings.tripartiteChannelInformation}</TableCell>
									<TableCell align="right">{strings.deposits}</TableCell>
									<TableCell align="right">{strings.depositFee}</TableCell>
									<TableCell>{strings.status}</TableCell>
									<TableCell colSpan={2}>{strings.actions}</TableCell>
									<TableCell>{strings.operator}</TableCell>
									<TableCell>{strings.operatingTime}</TableCell>
									<TableCell>{strings.remarks}</TableCell>
								</TableRow>
							}
							rows={
								data.deposities.edges.length === 0 ? 
								<TableRow>
									<TableCell align="center" colSpan={14}>没有可用数据</TableCell>
								</TableRow>
								: 
								data.deposities.edges.map((o, index) => <TableRow key={index}>
									<TableCell align="right">{o.node.pk}</TableCell>
									<TableCell>{o.node.user.username}</TableCell>
									<TableCell>{ (o.node.bank) ? o.node.bank.payVendor.name : "-" }</TableCell>
									<TableCell>{o.node.user.vipLevel ? o.node.user.vipLevel.name : "-"}</TableCell>
									<TableCell>{o.node.depositDate ? moment(o.node.depositeDate).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
									<TableCell>{"-"}</TableCell>
									<TableCell align="right">{o.node.amount ? o.node.amount : "-"}</TableCell>
									<TableCell align="right">{o.node.handlingFee ? o.node.handlingFee : "-"}</TableCell>
									<TableCell><StatusIcon status={o.node.status.toLowerCase()}/></TableCell>
									<TableCell colSpan={2}>
										{o.node.status.toLowerCase() === statusesValues.pending && <Grid container spacing={1} direction="row" style={{width: 160}}>
											<Grid item><Button size="small" onClick={btnStatusChange(o.node, "cancelled", strings.warning1)}>{strings.cancel}</Button></Grid>
											<Grid item><Button size="small" variant="contained" color="primary" onClick={btnStatusChange(o.node, "confirmed", strings.warning1)}>{strings.confirm}</Button></Grid>
										</Grid>}
									</TableCell>
									<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : "-"}</TableCell>
									<TableCell>{o.node.updatedAt ? moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
									<TableCell>{o.node.internalNote}</TableCell>
								</TableRow>)
							}
						/>
					</Grid>
				</Grid>
		<PaymentReviewModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={ONLINE_DEPOSIT_ACCOUNTS_MUTATE} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passAmount={passAmount} passStatus={passStatus} />
			</Paper> 
}
