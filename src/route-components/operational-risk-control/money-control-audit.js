import React, { useState, Fragment } from 'react';
import {
	Paper,
	TableCell,
	TableRow,
	Grid,
	Button,
	Typography,
	Divider,
	TextField,
	IconButton,
	OutlinedInput,
	Select,
	Menu,
	MenuItem,
	ListItemText,
	Box,
	Tab,
} from '@material-ui/core';
import { makeStyles, withStyles} from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { MONEY_CONTROL_AUDIT } from '../../paths';
import Title from '../../components/title';
import { SimpleTable, RiskStatusChangeModal, Loading } from '../../components/';
import { GrowItem } from '../../components';
import { AppDateRangePicker } from '../../components/date-picker';
import { MoreVert, FiberManualRecord, Clear, ExpandLess, ExpandMore} from '@material-ui/icons';
import { green, red, blue } from '@material-ui/core/colors';
import {ReactComponent as PaperPin} from '../../icons/paper-pin.svg'
import usePagination from '../../hooks/use-pagination';
import moment from 'moment'
import useMoneyControlAuditQuery, {RISK_STATUS_MUTATION} from '../../queries-graphql/operational-risk-control/money-control-audit-query'


const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	textfield: {
		backgroundColor: '#ffffff',
	},
	iconButton: {
		marginRight: theme.spacing(1),
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
	},
	paperPin: {
		color: "#4caf50",
		maxWidth: "15px",
		maxHeight: "15px",
		marginRight: theme.spacing(1)
	},
	noteField: {
		minWidth: '100em',
		backgroundColor: '#ffffff',
	},	
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

const ButtonRow = withStyles(theme => ({
	root: {
		minWidth: '100em',
		marginBottom: '0.5em'
	},
}))(Button);

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})(props => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'center',
		}}
		transformOrigin={{
		vertical: 'top',
		horizontal: 'center',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		'&:focus': {
		backgroundColor: theme.palette.primary.main,
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
		},
		},
	},
}))(MenuItem);

const openTabs = [];

export default function MoneyControlAudit() {
	const classes = useStyles();
	const strings = useLanguages(MONEY_CONTROL_AUDIT);
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setID] = useState(null);
    const [passStatus, setPassStatus] = useState(null);
	const [passWarning, setPassWarning] = useState(null);
	const [firstApprove, setFirstApprove] = useState(null)

	const [mutate, setMutate] = React.useState(false)

	const [filterValues, setFilterValues] = React.useState({		
		startDate: null,
		endDate: null,
		orderNumber: '',
		memberAccount: '',
		status: '',
		operator: '',
		addNote: '',
	});

	const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: null,
		endDate: ""
	})

	function handleFilterChange(event) {
		event.persist();

		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));		
	}

	const [focusedInput, setFocusedInput] = useState(null);	
	function onFocusChange(f) {
		setFocusedInput(f);
	}

	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}

	function onChangeClear() {	  			
		setFilterValues(oldValues => ({
			...oldValues,
			startDate: null,
			endDate: null,
			orderNumber: '',
			memberAccount: '',
			status: '',
			operator: '',
		}));
		setMutate(!mutate)

		setFilter({
			filterValues: [],
			startDate: null,
			endDate: ""
		})
	}
	
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [tableId, setTableId] = React.useState(null);
 
	const [setOpen] = React.useState(true);

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
		setTableId(event.currentTarget.id);		
	}

	function handleClose(event) {
		setAnchorEl(null);
		for( var i = 0; i < openTabs.length; i++){ 
			if ( openTabs[i] ==  event.currentTarget.id) {
				openTabs.splice(i, 1); 
			}
		}
		setFilterValues(oldValues => ({
			...oldValues,
		}));
	}

	function handleClickOpen(event) {
		setAnchorEl(null);	
		setOpen(false);
		openTabs.push(parseInt(event.currentTarget.id))	
	}

	function searchFor(){
		if (filterValues.startDate ==  null && filterValues.endDate ==  null) {
			setFilter({
				filterValues: filterValues,
				startDate: "2015-10-10",
				endDate: ""
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})                                             
		}
		setCursor({
            before: null,
            after: null
        })
        setPage(0)
		setMutate(!mutate)
	}

	const pagination = usePagination();
	const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;
	const { data, loading } = useMoneyControlAuditQuery({
		rowsPerPage, before, after, page, startAt: filter.startDate ==  null ? "2018-10-13" : filter.startDate, endAt: filter.endDate,
		orderId_Icontains: filter.filterValues.orderNumber, user_Username_Icontains: filter.filterValues.memberAccount,
		status: filter.filterValues.status, statusChangedBy_Username: filter.filterValues.operator,
		mutation: mutate
	});
	if (loading) {
		return <Loading/>;
	}
	const pageInfo = data.withdrawals ? data.withdrawals.pageInfo : ''
	const count = data.withdrawals ? data.withdrawals.totalCount : 0

	function addNote(event) {
		let key = event.currentTarget.id

		data.withdrawals.edges[key].noteDetails = filterValues.addNote

		setFilterValues(oldValues => ({
			...oldValues,
			'addNote': '',
		}));

	}

	const handleExpand = key => event => {
		data.withdrawals.edges[key].note ==  0 ? 
		data.withdrawals.edges[key].note = 1
		: data.withdrawals.edges[key].note = 0
		setFilterValues(
			oldValues => ({
			...oldValues,
		}));
	} 

	const btnStatusChange = (value, stat, warn, firstApproved) => (e) => {
		setID(value.riskApproval ? value.riskApproval.edges[0].node.id : '')
		setModalOpen(true);
		setPassStatus(stat);
		setPassWarning(warn);
		setFirstApprove(firstApproved)
	}

	return <Paper elevation={1}>
		<Title pageTitle={strings.moneyControlAudit} />
		<Grid container direction="row" justify="space-between" alignItems="center">							
			<Typography className={classes.paper} variant="h6">{strings.moneyControlAudit}</Typography>			
		</Grid>
		<Divider light={true} />
		<Grid container className={classes.paper} alignItems="center" spacing={1}>
			<Grid item>
				<Typography color="textSecondary">{strings.date}:</Typography>
			</Grid>
			<Grid item style={{marginRight: 10}}>
				<AppDateRangePicker
					focusedInput={focusedInput}
					onFocusChange={onFocusChange}
					onDatesChange={onDatesChange}
					startDate={filterValues.startDate}
					endDate={filterValues.endDate}
					startDateId={strings.startDate}
					endDateId={strings.endDate}
					startDatePlaceholderText={strings.startDate}
					endDatePlaceholderText={strings.endDate}
					inputIconPosition="after"
					showDefaultInputIcon
					small
					isOutsideRange={() => false}
				/>							 
			</Grid>
			<Grid item>
				<Typography color="textSecondary">{strings.orderNumber}:</Typography>
			</Grid>	
			<Grid item>
				<TextField
					style={{marginRight: 10}}
					className={classes.textfield}
					variant="outlined"
					margin="dense"
					name="orderNumber"
					placeholder={strings.pleaseEnter}
					onChange={handleFilterChange}
					value={filterValues.orderNumber}
				/>
			</Grid>	
			<Grid item>
				<Typography color="textSecondary">{strings.memberAccount}:</Typography>
			</Grid>	
			<Grid item>
				<TextField
					style={{marginRight: 10}}
					className={classes.textfield}
					variant="outlined"
					margin="dense"
					name="memberAccount"
					placeholder={strings.pleaseEnter}
					onChange={handleFilterChange}
					value={filterValues.memberAccount}
				/>
			</Grid>	
			<Grid item>
				<Typography color="textSecondary">{strings.status}:</Typography>
			</Grid>
			<Grid item style={{marginRight: 10}}>
				<Box border={1} borderColor="#B3B8BD" borderRadius={5}>
					<Select margin="dense"
						style={{color: "#B3B8BD", width: 100}}
						// className={classes.textfield}
						variant="outlined"
						name="status"
						displayEmpty
						value={filterValues.status}
						onChange={handleFilterChange}
						input={<OutlinedInput notched={false} name="status"/>}									
						>
						<MenuItem  value="">{strings.all}</MenuItem>
						<MenuItem value="confirmed">{strings.confirmed}</MenuItem>
						<MenuItem value="cancelled">{strings.cancelled}</MenuItem>
						<MenuItem value="pending">{strings.toBeProcessed}</MenuItem>
					</Select>
				</Box>
			</Grid>
			<Grid item>
				<Typography color="textSecondary">{strings.operator}:</Typography>
			</Grid>
			<Grid item>
				<TextField
					style={{marginRight: 10}}
					className={classes.textfield}
					variant="outlined"
					margin="dense"
					name="operator"
					placeholder={strings.pleaseEnter}
					onChange={handleFilterChange}
					value={filterValues.operator}
				/>
			</Grid>
			<GrowItem />
			<Grid item>
				<Button color="primary" variant="text" onClick={onChangeClear}>
					<Typography>
						{strings.clearAll}
					</Typography>
				</Button>
			</Grid>	
			<Grid item justify="flex-end">
				<Button color="primary" variant="contained" onClick={() => searchFor()} style={{fontSize: 15, minWidth: 90}}>{strings.searchFor}</Button>
			</Grid>
		</Grid>
		<Grid  className={classes.paper}  item style={{paddingTop: 0}}>
			<SimpleTable
				tableProps={{ size: "small" }}
				hasPagination={true}
				pagination={pagination}
				pageInfo={pageInfo}
				noBorder={true}
				count={count}
				columns={
					<TableRow align="center">
						<TableCell align="right">{strings.orderNumber}</TableCell>
						<TableCell style={{minWidth: 110}}>{strings.memberAccount}</TableCell>
						<TableCell style={{minWidth: 110}}>{strings.hierarchy}</TableCell>
						<TableCell style={{minWidth: 110}}>{strings.VIPRating}</TableCell>
						<TableCell style={{minWidth: 140}}>{strings.withdrawalApplicationTime}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.numberOfWithdrawals}</TableCell>
						<TableCell style={{minWidth: 130}} align="right">{strings.applicationForWithdrawalAmount}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.accountBalance}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.handlingFee}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.administrativeFee}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.discountDeduction}</TableCell>
						<TableCell style={{minWidth: 110}} align="right">{strings.amountOfWithdrawal}</TableCell>
						<TableCell>{strings.systemAudit}</TableCell>
						<TableCell style={{minWidth: 80}}>{strings.status}</TableCell>
						<TableCell>{strings.operator}</TableCell>
						<TableCell style={{minWidth: 130}}>{strings.operatingTime}</TableCell>
						<TableCell style={{minWidth: 60}}>{strings.remarks}</TableCell>
					</TableRow>
				}
				rows={
					data.withdrawals ==  null || count ==  0? 
						<TableRow>
							<TableCell colSpan={17} align="center">没有可用数据</TableCell>
						</TableRow>
					:
					data.withdrawals.edges.map((o, index) => {
														
						let tableIndex = openTabs.find(function(element) {
							return element ==  index
						})

						let riskAppStat = '';
						let riskAppStatChAt = "";
						let riskAppStatChBy = '';
						let needFirstApprove = false;

						if(o.node.riskApproval.edges.length !=  0){
							riskAppStat = o.node.riskApproval.edges[0].node.status
							riskAppStatChAt = o.node.riskApproval.edges[0].node.statusChangedAt !=  null ? o.node.riskApproval.edges[0].node.statusChangedAt : ""
							riskAppStatChBy = o.node.riskApproval.edges[0].node.statusChangedBy !=  null ? o.node.riskApproval.edges[0].node.statusChangedBy.username : ""
						}

						if(o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1){
							needFirstApprove =  o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.status ==  "confirmed" ? false : true
						}else{
							needFirstApprove = false
						}

						return <Fragment>									
							<TableRow>
								<TableCell align="right">{o.node.orderId ? o.node.orderId : ''}</TableCell>
								<TableCell>{o.node.user ? o.node.user.username: ''}</TableCell>
								<TableCell>{o.node.user.memberLevel? o.node.user.memberLevel.name: ''}</TableCell>
								<TableCell>{o.node.user.vipLevel? o.node.user.vipLevel.name: ''}</TableCell>
								<TableCell>{o.node.createdAt? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : ''}</TableCell>
								<TableCell align="right">{o.node.withdrawalCount ? o.node.user.withdrawalCount: ''}</TableCell>
								<TableCell align="right">&#165;{o.node.amount ? o.node.amount : ''}.00</TableCell>
								<TableCell align="right">&#165;{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((item) =>(
												item.node.balance
											)) : null
								}.00</TableCell>
								<TableCell align="right">&#165;{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((item) =>(
												item.node.handlingFee
											)) : null
								}.00</TableCell>
								<TableCell align="right">&#165;{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((item) =>(
												item.node.depositAuditAmount
											)) : null
								}.00</TableCell>
								<TableCell align="right">&#165;{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((item) =>(
												item.node.preferentialAuditAmount
											)) : null
								}.00</TableCell>
								<TableCell align="right">&#165;{o.node.riskApproval ? 
											o.node.riskApproval.edges.map((item) =>(
												item.node.finalAmount
											)) : null
								}.00</TableCell>
								<TableCell>
									{
										riskAppStat.toLowerCase() ==  "confirmed" ? <ColorButtonGreen size="small">{strings.pass}</ColorButtonGreen> :
										riskAppStat.toLowerCase() ==  "cancelled" ? <ColorButtonRed size="small">{strings.fail}</ColorButtonRed> :
										<ColorButtonBlue size="small">{strings.toBeProcessed}</ColorButtonBlue>
									}
								</TableCell>
								<TableCell>
									<FiberManualRecord className={
										riskAppStat.toLowerCase() ==  "confirmed" ?
										classes.green :
										riskAppStat.toLowerCase() ==  "cancelled" ?
										classes.red :
										classes.blue
									} />
								</TableCell>
								{/* <TableCell>{riskAppStatChBy}</TableCell> */}
								<TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : "-"}</TableCell>
								<TableCell>{riskAppStatChAt ? moment(riskAppStatChAt).format("YYYY-MM-DD HH:mm:ss") : null}</TableCell>
								<TableCell>
									{
										tableIndex == index ?
											<IconButton														
												id={index}
												onClick={handleClose}
												size="small"
											>
												<Clear id={index}  />
											</IconButton>
										:  
											<IconButton																											
											id={index}
											size="small"
											onClick={handleClick}
											>
												<MoreVert  />
											</IconButton>
									}
									{
											<StyledMenu
												tableId={tableId}
												anchorEl={anchorEl}
												keepMounted
												open={Boolean(anchorEl && tableId == index)}
												onClose={handleClose}
											>
												<StyledMenuItem disabled={riskAppStat.toLowerCase() !=  "pending"? true : false} onClick={handleClose}>
													<ListItemText  onClick={btnStatusChange(o.node, "confirmed", strings.warning3, needFirstApprove)} 
													primary={strings.initiateVerification} />
												</StyledMenuItem>
												<StyledMenuItem disabled={riskAppStat.toLowerCase() !=  "pending"? true : false} onClick={handleClose}>
													<ListItemText  onClick={btnStatusChange(o.node, "cancelled", strings.warning2, needFirstApprove)} primary={strings.cancelWithdrawal} />
												</StyledMenuItem>
												{/* <StyledMenuItem id={index} onClick={handleClickOpen} >
													<ListItemText primary={strings.viewNotes} />
												</StyledMenuItem> */}
											</StyledMenu>
									}
				
								</TableCell>
							</TableRow>	
							{
								tableIndex == index ?
								
								<Fragment>
									<TableRow key={index}>
										<TableCell colSpan={17} style={{paddingLeft: 0}}>
											<Grid container>
												<Box mx="auto" py={3}>
													{
														o.noteDetails ==  '' ? 
														<Fragment>																	
															<Grid container style={{marginBottom: 15}}>
																<Typography>
																	{ strings.addNote }
																</Typography>
															</Grid>
															<Grid container style={{marginBottom: 15}}>
																<TextField
																	className={classes.noteField}
																	variant="outlined"
																	margin="dense"
																	multiline
																	rows="8"
																	name="addNote"
																	placeholder={strings.pleaseEnter}
																	onChange={handleFilterChange}
																	value={filterValues.addNote}
																/>
															</Grid>
															<Grid container direction="row" justify="flex-end">																
																<Button																															
																	id={index}
																	variant="outlined"
																	style={{minWidth: 90, marginRight: 15}}
																	onClick={handleClose}
																	size="small"
																>
																	{strings.cancel}
																</Button>
																<Button																												
																	id={index}
																	color="primary"
																	variant="contained"
																	style={{minWidth: 90}}
																	onClick={addNote}
																	size="small"
																>
																	{strings.confirm}
																</Button>
															</Grid>
														</Fragment>
														: 
														<Fragment>
															<Grid container style={{maxWidth: '87em' }} >
																<ButtonRow >
																	<Grid container  justify="space-between" onClick={handleExpand(index)} alignItems="center">
																	<PaperPin className={classes.paperPin}/>
																	{strings.fixedComment}
																	<GrowItem />
																	{
																		o.note ==  0 ? <ExpandLess /> : <ExpandMore />
																	}
																	</Grid>
																</ButtonRow>
																{
																	o.note ==  0 ? null :
																	<Box mx="1em">
																		<Typography style={{paddingLeft: "1px"}} align="justify">
																			{o.noteDetails}
																		</Typography>
																	</Box> 
																}
															</Grid>														
														</Fragment>
													}
												</Box>															
											</Grid>
										</TableCell>
									</TableRow> 
								</Fragment>
								: null
							}			
						</Fragment>
					})								
				}
			/>
		</Grid>		
		<RiskStatusChangeModal mutate={mutate} setMutate={setMutate} idMutate={firstApprove ==  true ? null : id} mutateQuery={RISK_STATUS_MUTATION} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passStatus={passStatus} />	
	</Paper>	
}