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
	OutlinedInput,
	Input,
	Select,
	Menu,
	MenuItem,
	FormControlLabel,
	Checkbox,
	NativeSelect,
	ListItemText,
} from '@material-ui/core';
import { SimpleTable } from '../../components/';
import { GrowItem } from '../../components';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { TRIAL_REVIEW } from '../../paths';
import { TRIAL_REVIEW_QUERY } from '../../queries/member-management';
import { Query } from 'react-apollo';
import { AppDateRangePicker } from '../../components/date-picker';
import { statusFilter } from '../../values';
import Title from '../../components/title';
import { AddCircle, MoreVert, Clear} from '@material-ui/icons'
import {mockClient} from '../../App'
import usePagination from '../../hooks/use-pagination'


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

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	fuzzy: {
		paddingLeft: theme.spacing(1)
	},
	textfield: {
		backgroundColor: '#ffffff',
	},
	fontColor: {
		color: 'textSecondary'
	},
	green: {
		backgroundColor: '#4caf50',
		minWidth: "10em",
		color: 'white',
		fontSize: 15,
		borderRadius: "0.3em",
		padding: theme.spacing(.5),
		"& option": {
			color: '#000'
		  }
	},
	red: {
		backgroundColor: '#f44336',
		minWidth: "10em",
		color: 'white',
		fontSize: 15,
		borderRadius: "0.3em",
		padding: theme.spacing(.5),
		"& option": {
			color: '#000'
		  }
	},
	yellow: {
		backgroundColor: '#FFEB3B',
		minWidth: "10em",
		color: 'white',
		fontSize: 15,
		borderRadius: "0.3em",
		padding: theme.spacing(.5),
		"& option": {
			color: '#000'
		  }
	},
	color: {
		color: 'black'
	},
}));



export default function TrialReview() {
	const classes = useStyles();
	const strings = useLanguages(TRIAL_REVIEW);
	const [filterValues, setFilterValues] = React.useState({
		accountNumber: '',
		startDate: null,
		endDate: null,
		accountBalanceMin: '',
		accountBalanceMax: '',
		status: 'all',
		affiliatedAgent: '',
		fuzzySearch: false,
	});	

	const pagination = usePagination()
	
	// const pageSplit = history.location.pathname.split("=", 3);

	// const pageValue = pageSplit === TRIAL_REVIEW  ? 1 : parseInt(pageSplit[1].charAt(0))

	// const page =  pageValue === 1 ? 0 : pageValue - 1

	// const rowsPerPageSplit = history.location.pathname.split("=", 3);
	
	// const rowsPerPage = rowsPerPageSplit  === TRIAL_REVIEW ? 15 : parseInt(rowsPerPageSplit[2] )

	// const rowsPerPagePosition = rowsPerPage === 15 ? 0 : rowsPerPage === 25 ? 1 : rowsPerPage === 35 ? 2 : 3 

	function handleFilterChange(event) {
		event.persist();

		if (event.target.name === "fuzzySearch") {
			if (filterValues.fuzzySearch === false) {				
				setFilterValues(oldValues => ({
					...oldValues,
					[event.target.name]: event.target.value,
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

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [tableId, setTableId] = React.useState(null);
 
	const [open, setOpen] = React.useState(true);
	const [openTab, setOpenTab] = React.useState(null);

	return <Query query={TRIAL_REVIEW_QUERY} client={mockClient}>
		{({ loading, error, data }) => {
			if (loading) return <div/>;
			const {trialReview} = data;
			const onStatusReviewChange = key => event => {
				event.persist();
				if (event.target.value === "confirm") {
					trialReview[key].statusReview = 1
					setFilterValues(oldValues => ({
						...oldValues,
					}));
				} else if (event.target.value === "reject"){
					trialReview[key].statusReview = 2
					setFilterValues(oldValues => ({
						...oldValues,
					}));
				} else {
					trialReview[key].statusReview = 3
					setFilterValues(oldValues => ({
						...oldValues,
					}));
				}
			}

			function onChangeClear() {	  			
				setFilterValues(oldValues => ({
					...oldValues,
					accountNumber: '',
					startDate: null,
					endDate: null,
					accountBalanceMin: '',
					accountBalanceMax: '',
					status: 'all',
					affiliatedAgent: ''
				}));
			}

			function handleClick(event) {
				setAnchorEl(event.currentTarget);
				setTableId(event.currentTarget.id)				
			}
		
			function handleClose() {
				setAnchorEl(null);
				setOpenTab(null)
				setOpen(true)
			}

			function handleClickOpen(event) {
				setOpenTab(event.currentTarget.id)
				setAnchorEl(null);	
				setOpen(!open);
			}
			// function refresher() {
			// 	setFilterValues(oldValues => ({
			// 		...oldValues,
			// 	}))
			// }

			return <Paper elevation={1}>
						<Title pageTitle={strings.trialReview} />
						<Grid container direction="row" justify="space-between" alignItems="center">							
							<Typography className={classes.paper} variant="h6">{strings.trialReview}</Typography>
							<Grid className={classes.paper}>
								<Button color="primary" variant="contained" style={{fontSize: 15}}><AddCircle style={{marginRight: 5}} />  {strings.addNewDemo}</Button>
							</Grid>
						</Grid>
						<Divider light={true} />
						<Grid container className={classes.paper} alignItems="center" spacing={1}>
							<Grid item>
								<Typography>{strings.accountNumber}:</Typography>
							</Grid>
							<Grid item> 
								<TextField
									style={{width: 130}}
									className={classes.textfield}
									variant="outlined"
									margin="dense"
									placeholder={strings.pleaseEnter}
									name="accountNumber"
									onChange={handleFilterChange}
									value={filterValues.accountNumber}
								/>
							</Grid>
							<Grid item>
								<Typography>{strings.registrationTime}:</Typography>
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
								<Typography>{strings.accountBalance}:</Typography>
							</Grid>
							<Grid item>
								<Grid container alignItems="center" spacing={1}>
									<Grid item>
										<TextField
											className={classes.textfield}
											style={{width: 80}}
											type="number" 
											variant="outlined"
											margin="dense"
											name="accountBalanceMin" 
											onChange={handleFilterChange}
											value={filterValues.accountBalanceMin}
										/>
										</Grid>
									<Grid item><Typography>-</Typography></Grid>
									<Grid item>
										<TextField
											className={classes.textfield}
											style={{width: 80}}
											type="number"
											variant="outlined"
											margin="dense"
											name="accountBalanceMax" 
											onChange={handleFilterChange}
											value={filterValues.accountBalanceMax}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item>
								<Typography>{strings.status}:</Typography>
							</Grid>
							<Grid item>
								<Select margin="dense"
									className={classes.textfield}
									name="status"
									value={filterValues.status}
									onChange={handleFilterChange}
									input={<OutlinedInput notched={false} name="status"/>}									
								>
								<MenuItem  value={statusFilter.all}>{strings.all}</MenuItem>
								<MenuItem value={statusFilter.confirm}>{strings.confirm}</MenuItem>
								<MenuItem value={statusFilter.reject}>{strings.reject}</MenuItem>
								<MenuItem value={statusFilter.pendingReview}>{strings.pendingReview}</MenuItem>
								</Select>
							</Grid>
							<Grid item>
								<Typography>{strings.affiliatedAgent}:</Typography>
							</Grid>						
							<Grid item>
								<TextField
									style={{width: 100}}
									className={classes.textfield}
									variant="outlined"
									margin="dense"
									name="affiliatedAgent"
									placeholder={strings.pleaseEnter}
									onChange={handleFilterChange}
									value={filterValues.affiliatedAgent}
								/>
							</Grid>
							<Grid item>
								<Button color="primary" variant="text" onClick={onChangeClear}>{strings.clearAll}</Button>
							</Grid>
							<GrowItem />
							<Grid item>
								<Button color="primary" variant="text">+ {strings.moreQueryConditions}</Button>
							</Grid>	
							<Grid item justify="flex-end">
								<Button color="primary" variant="contained" style={{fontSize: 15}}>{strings.searchFor}</Button>
							</Grid>
							<Grid container className={classes.fuzzy} alignItems="center" spacing={1}>
								<FormControlLabel
									value={true}
									label={<Typography color="textSecondary">{strings.fuzzySearch}</Typography>}
									labelPlacement="end"
									name="fuzzySearch"
									control={<Checkbox color="primary"/>}
									onChange={handleFilterChange}
								/>
							</Grid>						
						</Grid>
						<Grid  className={classes.paper}  item style={{paddingTop: 0}}>
							<SimpleTable								
								tableProps={{size: "small"}}
								hasPagination={false}
								pagination={pagination}
								pageInfo={false}
								count={trialReview.length}
								columns={
									<TableRow>
										<TableCell>{strings.numbering}</TableCell>
										<TableCell>{strings.phoneNumber}</TableCell>
										<TableCell>{strings.registrationTime}</TableCell>
										<TableCell>{strings.registeredIP}</TableCell>
										<TableCell>{strings.status}</TableCell>
										<TableCell>{strings.review}</TableCell>
									</TableRow>
								}
								rows={
									trialReview.length === 0 ? 
									<TableRow>
										<TableCell align="center" colSpan={6}>没有可用数据</TableCell>
									</TableRow>
									:
									trialReview.map((o, index) => {
										
									// trialReview.slice(pageSimple * rowsPerPageSimple, pageSimple * rowsPerPageSimple + rowsPerPageSimple).map((o, index) => {
										let statusText = o.statusReview === 1 ? statusFilter.confirm : o.statusReview === 2 ? statusFilter.reject : statusFilter.pendingReview 
										return (
										<Fragment>	
											<TableRow key={index}>
												<TableCell>{o.numbering}</TableCell>
												<TableCell>{o.phoneNumber}</TableCell>
												<TableCell>{o.registrationDate} {o.registrationTime}</TableCell>
												<TableCell>{o.registeredIp}</TableCell>
												<TableCell>
													<Grid item>
														<NativeSelect
															margin="dense"
															className={ o.statusReview === 1 ? classes.green : o.statusReview === 2 ? classes.red : classes.yellow }
															name="statusReview"
															defaultValue={statusText}
															onChange={onStatusReviewChange(index)}
															disableUnderline
															input={<Input  notched={false} name="statusReview"/>}														
														>
															<option value={statusFilter.confirm}>{strings.confirm}</option>
															<option value={statusFilter.reject}>{strings.reject}</option>
															<option value={statusFilter.pendingReview}>{strings.pendingReview}</option>
														</NativeSelect>
													</Grid>												
												</TableCell>

												<TableCell>
													<Grid item>
														{															 
															open ? 
																<Button
																	id={index}
																	aria-controls={index}
																	aria-haspopup="true"
																	onClick={handleClick}
																>
																	<MoreVert />
																</Button>
															: openTab === index ?
															<Clear onClick={handleClose} /> : null
														}
														<StyledMenu
															tableId={tableId}
															anchorEl={anchorEl}
															keepMounted
															open={Boolean(anchorEl && tableId === index)}
															onClose={handleClose}
														>
															<StyledMenuItem	onClick={handleClose}>
																<ListItemText primary={strings.review} />
															</StyledMenuItem>
															<StyledMenuItem onClick={handleClose}>
																<ListItemText primary={strings.refuse} />
															</StyledMenuItem>
															<StyledMenuItem id={index} onClick={handleClickOpen} >
																{strings.pendingReview}
															</StyledMenuItem>
														</StyledMenu>
																											
													</Grid>														
												</TableCell>												
											</TableRow>

											

											{
												openTab === index ?
													<TableRow key={index}>
														<TableCell colSpan={6} style={{paddingLeft: 0}}>
															<Paper className={classes.paper}>	
																<Grid  item  > 
																	<SimpleTable 
																		tableProps={{size: "second table"}}
																		hasPagination={false}
																		pageInfo={false}
																		columns={
																			<TableRow>
																				<TableCell>{strings.demoAccount}</TableCell>
																				<TableCell>{strings.tryPassword}</TableCell>
																				<TableCell>{strings.reviewer}</TableCell>
																				<TableCell>{strings.reviewTime}</TableCell>
																			</TableRow>
																		}
																		rows={
																			<TableRow>
																				<TableCell>{o.demoAccount}</TableCell>
																				<TableCell>{o.tryPassword}</TableCell>
																				<TableCell>{o.reviewer}</TableCell>
																				<TableCell>{o.reviewDate} {o.reviewTime}</TableCell>
																			</TableRow>
																		}
																	/>
																</Grid>
															</Paper>	
														</TableCell>
													</TableRow>
												: null												
											}												
										</Fragment>										
										)
									})
								}
							/>
						</Grid>									
					</Paper>
		}}
	</Query>
}