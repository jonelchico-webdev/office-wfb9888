import React, { Fragment } from 'react';
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
	Checkbox,
	Switch
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { MONEY_CONTROL_CONDITION_MANAGEMENT } from '../../paths';
import { MONEY_CONTROL_CONDITION_MANAGEMENT_QUERY } from '../../queries/operational-risk-control';
import { Query } from 'react-apollo';
import Title from '../../components/title';
import { SimpleTable } from '../../components/';
import { Edit, CheckCircle, Cancel } from '@material-ui/icons';
import {mockClient} from '../../App'
import usePagination from '../../hooks/use-pagination'

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

const editRows = [];

const IOSSwitch = withStyles(theme => ({
	root: {
	  width: 30,
	  height: 15,
	  padding: 0,
	  margin: theme.spacing(1)
	},
	switchBase: {
	  padding: 1,
	  "&$checked": {
		color: theme.palette.common.white,
		"& + $track": {
		  backgroundColor: "#689f38",
		  opacity: 1,
		  border: "none",
		}
	  },
	  "&$focusVisible $thumb": {
		color: "#689f38",
		border: "6px solid #fff"
	  }
	},
	thumb: {
	  width: 11,
	  height: 10,
	  marginTop:1,
	  marginLeft:5
	},
	track: {
	  borderRadius: 26 / 2,
	  border: `1px solid #d84315`,
	  backgroundColor: '#d84315',
	  marginLeft:1,
	  opacity: 1,
	  transition: theme.transitions.create(["background-color", "border"])
	},
	checked: {},
	focusVisible: {}
  }))(({ classes, ...props }) => {
	return (
	  <Switch
		focusVisibleClassName={classes.focusVisible}
		disableRipple
		classes={{
		  root: classes.root,
		  switchBase: classes.switchBase,
		  thumb: classes.thumb,
		  track: classes.track,
		  checked: classes.checked
		}}
		{...props}
	  />
	);
});


export default function MoneyControlConditionManagement(props) {
	const { history } = props
	const classes = useStyles();
	const strings = useLanguages(MONEY_CONTROL_CONDITION_MANAGEMENT);
	const [filterValues, setFilterValues] = React.useState({
		condition: strings.pleaseChoose,
		judge: strings.pleaseChoose
	});

	const pagination = usePagination()

	const pageSplit = history.location.pathname.split("=", 3);

	const pageValue = pageSplit === MONEY_CONTROL_CONDITION_MANAGEMENT ? 1 : parseInt(pageSplit[1].charAt(0))

	const page = pageValue === 1 ? 0 : pageValue - 1

	const rowsPerPageSplit = history.location.pathname.split("=", 3);

	const rowsPerPage = rowsPerPageSplit === MONEY_CONTROL_CONDITION_MANAGEMENT ? 15 : parseInt(rowsPerPageSplit[2])

	// const rowsPerPagePosition = rowsPerPage === 15 ? 0 : rowsPerPage === 25 ? 1 : rowsPerPage === 35 ? 2 : 3
	const [selected, setSelected] = React.useState([]);

	function handleChangeCheckbox(index) {
		const selectedIndex = selected.indexOf(index);

		let newSelected = [];
		//Paglagay
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, index);
		}
		// Pagtanggal
		else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		}
		// Pagtanggal ng dulo
		else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} //Pagtanggal kung anong row
		else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			);
		}
		setSelected(newSelected);

	}

	const isSelected = index => selected.indexOf(index) != -1;

	return <Query query={MONEY_CONTROL_CONDITION_MANAGEMENT_QUERY} client={mockClient}>
		{({ loading, data }) => {
			if (loading) return <div />;
			const { moneyControlConditionManagement } = data;
			const count = moneyControlConditionManagement.length

			// var checkBox = {}

			// for(let i = 0; i <= count; i++) {
			// 	// setCheckBox({...checkBox, [i]: false})

			// 	Object.assign(checkBox,{[i]:false})
			// }		

			function handleSelectAllClick(event) {

				if (event.target.checked) {
					let valueArr = []
					moneyControlConditionManagement.map((o, index) => {
						valueArr.push(index)
					});
					setSelected(valueArr);
					return;
				}
				setSelected([]);
			}

			const condition = [
				strings.sameRegisteredIp,
				strings.sameLoginIp,
				strings.betAmount,
				strings.profitAndLoss,
				strings.singleBetAmount,
				strings.continuousProfit,
			]

			const judge = [
				">=",
				"<=",
				"=",
				">",
				"<",
			]

			function handleClickEdit(event) {
				editRows.push(parseInt(event.currentTarget.id))
				// editRows.push(parseInt(event.currentTarget.id))
				setFilterValues(oldValues => ({
					...oldValues,
				}));
			}

			function handleCloseEdit(event) {
				for( var i = 0; i < editRows.length; i++){ 
					if ( editRows[i] === event.currentTarget.id) {
					  editRows.splice(i, 1); 
					}
				}
				setFilterValues({
					condition: strings.pleaseChoose
				});
			}


			function handleFilterChange(event) {
				event.persist();
				let name = event.target.name+event.currentTarget.id
				setFilterValues(oldValues => ({
					...oldValues,
					[name]: event.target.value,
					[event.target.name]: event.target.value,
				}));
			}

			const statusSwitchHandle = index => event => {
				moneyControlConditionManagement[index].status = event.target.checked 				
				setFilterValues(oldValues => ({
					...oldValues,
				}));
			};

			return <Paper elevation={1}>
				<Title pageTitle={strings.moneyControlConditionManagement} />
				<Grid container direction="row" justify="space-between" alignItems="center">
					<Typography className={classes.paper} variant="h6">{strings.moneyControlConditionManagement}</Typography>
					<Grid className={classes.paper}>
						<Button color="primary" variant="contained" style={{ fontSize: 15 }}>{strings.newWarningCondition}</Button>
					</Grid>
				</Grid>
				<Divider light={true} />
				<Grid className={classes.paper} item style={{ paddingTop: 0 }}>
					<SimpleTable
						tableProps={{size: "small"}}
						hasPagination={false}
						pagination={pagination}
						pageInfo={false}
						count={count}
						columns={
							<TableRow>
								<TableCell>
									<Checkbox
										onChange={handleSelectAllClick}
										inputProps={{
											'aria-label': 'primary checkbox',
										}}
									/>
								</TableCell>
								<TableCell style={{ minWidth: 100 }}>{strings.no}</TableCell>
								<TableCell style={{ minWidth: 300 }}>{strings.moneyControlWarningCondition}</TableCell>
								<TableCell style={{ textAlign: "center" }}>{strings.status}</TableCell>
								<TableCell style={{ textAlign: "center" }}>{strings.operating}</TableCell>
							</TableRow>
						}
						rows={
							moneyControlConditionManagement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((o, index) => {
								const isItemSelected = isSelected(index);

								let tableIndex = editRows.find(function(element) {
									return element === index
								})

								return <Fragment> {
									o.delete === 0 ?
										<TableRow>
											<TableCell >
												<Checkbox
													checked={isItemSelected}
													onClick={event => handleChangeCheckbox(index)}
													value={index}
													inputProps={{
														'aria-label': 'primary checkbox',
													}}
												/>
											</TableCell>
											<TableCell style={{ minWidth: 100 }}>{o.no}{index}</TableCell>
											<TableCell style={{ minWidth: 300 }}>
												<Grid container alignItems="center" spacing={1}>
														{
															tableIndex === index ? 
															<Fragment>
																<Grid Item style={{minWidth: "25px"}}>
																</Grid>
																<Grid item>
																	<Typography>{strings.condition}:</Typography>
																</Grid>
																<Grid item>
																	<Select margin="dense"
																		id={index}
																		variant="outlined"
																		name="condition"
																		value={filterValues.condition}
																		onChange={handleFilterChange}
																		input={<OutlinedInput notched={false} name="status"/>}									
																	>
																		<StyledMenuItem id={index} value={filterValues.condition}>{strings.pleaseChoose}</StyledMenuItem>
																		<StyledMenuItem id={index} value={0}>{strings.sameRegisteredIp}</StyledMenuItem>
																		<StyledMenuItem id={index} value={1}>{strings.sameLoginIp}</StyledMenuItem>
																		<StyledMenuItem id={index} value={2}>{strings.betAmount}</StyledMenuItem>
																		<StyledMenuItem id={index} value={3}>{strings.profitAndLoss}</StyledMenuItem>
																		<StyledMenuItem id={index} value={4}>{strings.singleBetAmount}</StyledMenuItem>
																		<StyledMenuItem id={index} value={5}>{strings.continuousProfit}</StyledMenuItem>
																	</Select>
																</Grid>
																<Grid item>
																	<Typography>{strings.judge}:</Typography>
																</Grid>
																<Grid item>
																	<Select margin="dense"
																		id={index}
																		variant="outlined"
																		name="judge"
																		value={filterValues.judge}
																		onChange={handleFilterChange}
																		input={<OutlinedInput notched={false} name="status"/>}									
																	>
																		<StyledMenuItem id={index} value={filterValues.judge}>{strings.pleaseChoose}</StyledMenuItem>
																		<StyledMenuItem id={index} value={0}>{judge[0]}</StyledMenuItem>
																		<StyledMenuItem id={index} value={1}>{judge[1]}</StyledMenuItem>
																		<StyledMenuItem id={index} value={2}>{judge[2]}</StyledMenuItem>
																		<StyledMenuItem id={index} value={3}>{judge[3]}</StyledMenuItem>
																		<StyledMenuItem id={index} value={4}>{judge[40]}</StyledMenuItem>
																	</Select>
																</Grid> 
																<Grid item>
																	<Typography>{strings.value}:</Typography>
																</Grid>
																<Grid item>
																	<TextField
																		id={index}
																		style={{width: 80}}
																		className={classes.textfield}
																		variant="outlined"
																		margin="dense"
																		name="value"
																		onChange={handleFilterChange}
																		value={filterValues.value}
																	/> 
																</Grid>
																<Grid item>
																	<IconButton id={index} color="primary" aria-label="add" className={classes.iconButton} size="small" onClick={handleCloseEdit}>
																		<CheckCircle fontSize="inherit"/>
																	</IconButton>
																	<IconButton id={index} color="textSecondary" aria-label="add" className={classes.iconButton} size="small" onClick={handleCloseEdit}>
																		<Cancel fontSize="inherit"/>
																	</IconButton>	
																</Grid>
															</Fragment>
															:
															<Fragment>
																<Grid Item style={{minWidth: "25px"}}>
																	<IconButton id={index} color="primary" aria-label="add" className={classes.iconButton} size="small" onClick={handleClickEdit}>
																		<Edit fontSize="inherit"/>
																	</IconButton>													
																</Grid>
																<Grid Item>
																	{condition[o.condition]} {judge[o.judge]} {o.value}
																</Grid>
															</Fragment>
														}
												</Grid>													
											</TableCell>
											<TableCell style={{ textAlign: "center" }}>
												{/* {o.status} */}
												<Grid container justify="center">
                                                    <Grid item style={{paddingTop:10}}>
                                                        {o.status === 1 ? <Typography style={{color: '#689f38'}}>{strings.enable}</Typography> : <Typography color="textSecondary">{strings.enable}</Typography>}
                                                    </Grid>
                                                    <Grid item>
                                                        <IOSSwitch
                                                            checked={o.status}
                                                            onChange={statusSwitchHandle(index)}
                                                            value={o.status}
                                                            name={o.accountNumber}
                                                        />
                                                    </Grid>    
                                                    <Grid item style={{paddingTop:10}}>
                                                        { 
                                                            o.status === 0 ? 
                                                            <Typography style={{color: '#d84315'}}>{strings.disable}</Typography> 
                                                            : <Typography color="textSecondary">{strings.disable}</Typography>
                                                        }
                                                    </Grid>
                                                </Grid>

											</TableCell>
											<TableCell style={{ textAlign: "center" }}>
												<Button color="primary" style={{fontSize: 15, minWidth: 90}}>
													{strings.delete}
												</Button>
											</TableCell>
										</TableRow> :
										null
								}
								</Fragment>
							})
						}

					/>
				</Grid>
			</Paper>
		}}
	</Query>
}