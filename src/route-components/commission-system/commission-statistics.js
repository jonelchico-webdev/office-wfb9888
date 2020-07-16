import React, { useState, Fragment } from 'react';
import { Paper,TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem, FormControlLabel, Checkbox, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {GrowItem} from '../../components';
import Title from '../../components/title';
import useLanguages from '../../hooks/use-languages';
import  { COMMISSION_STATISTICS } from '../../paths';
import { SimpleTable } from '../../components';
import { AppDateRangePicker } from '../../components/date-picker';
import usePagination from '../../hooks/use-pagination'
import useCommissionPaymentsQuery from '../../queries-graphql/commission-system/commission-payment'
import { MODIFY_COMMISSION_PAYMENT, MODIFY_REMARK_COMMISSION_PAYMENT } from '../../queries-graphql/commission-system/mutation/commission-payment-mutation'
import gql from 'graphql-tag'
import swal from 'sweetalert2';
import { useMutation } from '@apollo/react-hooks'
import { CheckCircle, Cancel } from '@material-ui/icons';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	textField: {
		width: 150,
	},
}));

let batchMutateDummy = `mutation{
    GetCaptcha {
        success
        imagePath
        requestIp
        captchaKey
    }
}` 

export default function CommissionStatistics(props) {
	const classes = useStyles();
	const strings = useLanguages(COMMISSION_STATISTICS);

	const [filterValues, setFilterValues] = React.useState({
		startDate: null,
		endDate: null,
		account: '',
		commissionType: '',
		status: '',
		checkbox: false
	}); 
	const [remarks, setRemarks] = useState([])
	const [disableRemarks, setDisableRemarks] = useState([])
	const [mutate, setMutate] = useState(false)
	const [selected, setSelected] = React.useState([]);
	const isSelected = id => selected.indexOf(id) !== -1;
	
	function handleFilterChange(event) { 
		event.persist();
		setFilterValues(oldValues => ({
		...oldValues,
		[event.target.name]: event.target.value
		}));
	}

	function remarkHandleChange(event) {
		event.persist()
		setRemarks(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}))
	}

	function editRemarksHandler(event) {
		event.persist()
		setDisableRemarks(oldValues => ({
			...oldValues,
			[event.target.name]: false
		}))
	}

	function cancelEditRemarks(event) {
		event.persist()
		setDisableRemarks(oldValues => ({
			...oldValues,
			[event.target.name]: true
		}))
		setRemarks(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}))
	}

	function onFocusChange(f) {
		setFocusedInput(f);
    }

	const [focusedInput, setFocusedInput] = useState(null);
	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}

	const [filter, setFilter] = useState({
		filterValues: [],
		startDate: moment('01/01/2000').toISOString(true),
		endDate: moment().toISOString(true)
	})

	function clickSearch() {
		if (filterValues.startDate == null && filterValues.endDate == null) {
			setFilter({
				filterValues: filterValues,
				startDate: moment('01/01/2000').toISOString(true),
				endDate: moment().toISOString(true)
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.toISOString(true),
				endDate: filterValues.endDate.toISOString(true)
			})
		}
	}

	const [modifyCommissionPayment] = useMutation(MODIFY_COMMISSION_PAYMENT)
	const [batchMutateStatus, setBatchMutateStatus] = useState(batchMutateDummy)
	let batchMutateArr = []
	const [batchModifyCommissionPayment] = useMutation(gql`${batchMutateStatus}`)
	const [modifyRemarks] = useMutation(MODIFY_REMARK_COMMISSION_PAYMENT)

	async function modifyStatus(id, status) {
		const res = await modifyCommissionPayment({
			variables: {
				id: id, 
				status: status
			}	
		})
		
		if(res.data.commissionPayment.errors[0]){
			swal.fire({
				position: 'center',
				type: 'error',
				title: 'Error',
				text: res.data.commissionPayment.errors[0].messages[0],
				showConfirmButton: true
			})
		} else {
			swal.fire({
				position: 'center',
				type: 'success',
				title: 'Success',
				
				text: strings.commissionPayment + status,
				showConfirmButton: true
			})
		}
		setMutate(!mutate)
	}

	async function modifyBatchStatus(status) {
		const batchMutate = await selected.map((o, idx) => {
			let num = idx +1
			batchMutateArr.push(
				`mutation` + num + `:commissionPayment(input: {
                    id:"`+ o + `" ` +
                    `status:"` + status + `" ` +
                    `}) {
                    id
                    status
                    errors
                    {
                        field
                        messages
                    }
                }`
			)
		})
		setBatchMutateStatus(`mutation{${batchMutateArr.join()}}`)

		if(batchMutate.length !== 0) {
			batchModifyCommissionPayment()
			swal.fire({
				position: 'center',
				type: 'success',
				title: status === "confirmed" ? 'Success' : 'Cancelled',
				text: strings.commissionPayment + status,
				showConfirmButton: true
			})
			setMutate(!mutate)
			setSelected([])
		}
	}
	
	const modifyRemarkUser = (userId) => (event) => {
		event.persist()
		let name = event.currentTarget.name
		modifyRemarks({
			variables: {
				id: userId,
				remarks: remarks[name]
			}
		})
		setDisableRemarks(oldValues => ({
			...oldValues,
			[name]: true
		}))
		setMutate(!mutate)
		swal.fire({
			position: 'center',
			type: 'success',
			title: 'Success',
			text: strings.updatedRemarks,
			showConfirmButton: false
		})
	}

	const pagination = usePagination()
	const { rowsPerPage, cursor: {before, after} } = pagination;
	const {data, loading} = useCommissionPaymentsQuery({
		mutation: mutate,
		commissionableAction_CommissionType_In: "deposit, bet",
		createdAt_Gt: filter.startDate,
		createdAt_Lt: filter.endDate,
		status: filter.filterValues.status,
		recipient_Username: filter.filterValues.account,
		before,
		after,
		rowsPerPage
	})

	if(loading) {
		return null
	}

	const commissionPayments = data.commissionPayments.edges
	const commissionPaymentsPageInfo = data.commissionPayments.pageInfo
	const count = data.commissionPayments.totalCount

	function handleChangeCheckbox(event, id) {
		if(!selected.includes(id)) {
			selected.push(id)
		} else {
			let index = selected.indexOf(id)
			if (index > -1) {
				selected.splice(index, 1)
			}
		}
		setMutate(!mutate)
	}
	
	function handleSelectAllClick(event) {
		event.persist()
		if (event.target.checked) {
			let valueArr = []
			commissionPayments.map((o, idx) => {
				if(o.node.status === "pending") {
					valueArr.push(o.node.id)
				}
			});
			setSelected(valueArr);
			return;
		}
		setSelected([]);
	}

	return <Paper elevation={1}>
			<Title pageTitle={strings.commissionStatistics} />
			<Grid container className={classes.paper} justify="space-between">
				<Typography variant="h6">{strings.commissionStatistics}</Typography>
				<Grid>
					<Button disabled={selected.length === 0 ? true : false} variant="contained" onClick={() => modifyBatchStatus("confirmed")} style={{backgroundColor: '#388e3c', color: '#fff', width: 110, height: 30, marginRight: 10}}>{strings.approvedBy}</Button>
					<Button disabled={selected.length === 0 ? true : false} variant="contained" onClick={() => modifyBatchStatus("cancelled")} style={{backgroundColor: 'rgb(255, 0, 0)', color: '#fff', width: 110, height: 30}}>{strings.batchCanceled}</Button>
				</Grid>
			</Grid>
			<Divider light={true}/>
			<Grid item className={classes.paper} container alignItems="center" spacing={1}> 

				<Grid item>
					<Typography color="textSecondary">{strings.accountNumber}:</Typography>
				</Grid>
				<Grid item style={{width: 140}}>
					<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="account" 
					onChange={handleFilterChange} value={filterValues.accountNumber}/>
				</Grid> 

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
					<Typography color="textSecondary">{strings.commissionType}:</Typography>
				</Grid>
				<Grid item>
					<Select margin="dense"
						displayEmpty
						name="commissionType"
						value={filterValues.commissionType}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} labelWidth={88} name="commissionType"/>}
						style={{ width: 120 }}
					>
						<MenuItem value={""}>{strings.all}</MenuItem>
						<MenuItem value={"PENDING"}>{strings.pendingReview}</MenuItem>
						<MenuItem value={"CONFIRMED"}>{strings.pass}</MenuItem>
						<MenuItem value={"CANCELLED"}>{strings.rejected}</MenuItem>
					</Select>
				</Grid>

				<Grid item>
					<Typography color="textSecondary">{strings.status}:</Typography>
				</Grid>
				<Grid item>
					<Select 
						displayEmpty
						margin="dense"
						name="status"
						value={filterValues.status}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} labelWidth={88} name="status"/>}
						style={{ width: 100 }}
					>
						<MenuItem value={""}>{strings.all}</MenuItem>
						<MenuItem value={"pending"}>{strings.pendingReview}</MenuItem>
						<MenuItem value={"confirmed"}>{strings.pass}</MenuItem>
						<MenuItem value={"cancelled"}>{strings.rejected}</MenuItem>
					</Select>
				</Grid>

			
				<GrowItem/>
				<Grid item>
				<Button onClick={clickSearch} color="primary" variant="contained" style={{width: 110, height: 30}}>{strings.searchFor}</Button>
				</Grid>
			</Grid>
	
			<Grid className={classes.paper}>
				<SimpleTable 
					tableProps={{size: "small"}}
					pageInfo={commissionPaymentsPageInfo}
					hasPagination={true}
					count={count} 
					pagination={pagination}
					noBorder={true}
					columns={
						<TableRow>
							<TableCell style={{width: 10}} align="center">
								<FormControlLabel
									label={<Typography>{strings.all}</Typography>}
									labelPlacement="bottom"
									name="checkbox"
									control={
										<Checkbox 
											color="primary"
											onChange={handleSelectAllClick}
										/>
									}
								/>
							</TableCell>
							<TableCell>{strings.date}</TableCell>
							<TableCell>{strings.userName}</TableCell>
							<TableCell>{strings.totalGeneration}</TableCell>
							<TableCell>{strings.commissionType}</TableCell>
							<TableCell align="right">{strings.amount}</TableCell>
							<TableCell>{strings.status}</TableCell>
							<TableCell>{strings.operating}</TableCell>
							<TableCell>{strings.operator}</TableCell>
							<TableCell>{strings.operatingTime}</TableCell>
							<TableCell>{strings.remarks}</TableCell>
						</TableRow>
					}
					rows={
						commissionPayments.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={11}>没有可用数据</TableCell>
						</TableRow>
						:
						commissionPayments.map((o, idx) =>  {
							const isItemSelected = isSelected(o.node.id);
							return (
								<TableRow>
									<TableCell style={{ width: 10 }} align="center">
										<FormControlLabel
											checked={isItemSelected}
											disabled={Boolean(o.node.status !== "pending" ? true : false)}
											labelPlacement="bottom"
											name={`checkbox${idx}`}
											control={
												<Checkbox 
													id={o.node.id} 
													color="primary"
													onClick={event => handleChangeCheckbox(event, o.node.id)}
												/>
											}
											// onChange={handleBatchStatus}	
										/>
									</TableCell>
									<TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</TableCell>
									<TableCell>{o.node.recipient.username ? o.node.recipient.username : "-"}</TableCell>
									{/* <TableCell>{o.node.commissionableAction ? o.node.commissionableAction.rootAffiliate ? o.node.commissionableAction.rootAffiliate.name : "-" : "-"}</TableCell>
									<TableCell>{o.node.commissionableAction ? o.node.commissionableAction.commissionType : "-"}</TableCell> */}
									<TableCell>{o.node.memberBankRecord ? o.node.memberBankRecord.balance : "-"}</TableCell>
									<TableCell>{o.node.commission ? o.node.commission.commissionType : "-"}</TableCell>
									<TableCell align="right">{o.node.amount}</TableCell>
									<TableCell>
										{
											o.node.status === "confirmed" ?
											strings.issued
											:
											o.node.status === "pending" ?
											strings.pendingReview 
											:
											o.node.status === "cancelled" ?
											strings.rejected
											:
											"-"
										}
									</TableCell>
									<TableCell>
										<Grid container spacing={1} direction="row">
											{
												o.node.status === "pending" ?
												<Fragment>
													<Grid item><Button onClick={() => modifyStatus(o.node.id, "confirmed")} size="small"><Typography color="primary">{strings.determine}</Typography></Button></Grid>
													<Grid item><Button onClick={() => modifyStatus(o.node.id, "cancelled")} size="small"><Typography color="primary">{strings.cancel}</Typography></Button></Grid>
												</Fragment>
												:
												"-"
											}
											
										</Grid>
									</TableCell>
									<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.name : null}</TableCell>
									<TableCell>{moment(o.node.statusChangedAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
									<TableCell >
										<TextField
											InputProps={{
												disableUnderline:true
											}}
											id="standard-multiline-flexible"
											type="text"
											disabled={disableRemarks[`remarkEnable${idx}`] !== undefined ? disableRemarks[`remarkEnable${idx}`] : true}
											multiline
											rows={ disableRemarks[`remarkEnable${idx}`] !== undefined ? !disableRemarks[`remarkEnable${idx}`] ? 10 : 2 : 2 }
											value={ remarks[`remarkEnable${idx}`] ? remarks[`remarkEnable${idx}`] : o.node.remarks }
											onChange={remarkHandleChange}
											margin="normal"
											style={{ 
												width: !disableRemarks[`remarkEnable${idx}`] !== undefined ? 150 : 250 
											}}
											InputLabelProps={{
												shrink: true
											}}
											name={`remarkEnable${idx}`}
											onClick={editRemarksHandler}
										/>

										<Grid container>
										<GrowItem/>
									{
										disableRemarks[`remarkEnable${idx}`] !== undefined ?
										!disableRemarks[`remarkEnable${idx}`] ?
										<Fragment>
											<IconButton onClick={modifyRemarkUser(o.node.id)} name={`remarkEnable${idx}`} variant="outlined" size="small">
												<CheckCircle fontSize="inherit" color="primary" />
											</IconButton>
											<IconButton onClick={cancelEditRemarks} name={`remarkEnable${idx}`} variant="outlined" size="small">
												<Cancel fontSize="inherit" color="primary"/>
											</IconButton>
										</Fragment>
										:
										null
										:
										null
									}
										</Grid>
									</TableCell>
								</TableRow>
							)
						})
					}
				/>
			</Grid>
		</Paper>
}