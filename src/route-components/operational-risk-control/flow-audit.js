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
} from '@material-ui/core';
import { makeStyles} from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { FLOW_AUDIT } from '../../paths';
import { FLOW_AUDIT_QUERY } from '../../queries/operational-risk-control';
import { Query } from 'react-apollo';
import Title from '../../components/title';
import { SimpleTable } from '../../components/';
import { GrowItem } from '../../components';
import { CreateOutlined } from '@material-ui/icons';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
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
	textBottom: {
		paddingTop: theme.spacing(2)
	}
	
}));


export default function FlowAudit(props) {
	const classes = useStyles();
	const strings = useLanguages(FLOW_AUDIT);
	const [filterValues, setFilterValues] = React.useState({		
		accountNumber: '',
	});

	const pagination = usePagination()

	function handleFilterChange(event) {
		event.persist();

			setFilterValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));		
	}

	// const [setFocusedInput] = useState(null);	
	// function onFocusChange(f) {
	// 	setFocusedInput(f);
	// }

	/* Edit Button Pencil */
	const [editButton, setEdit] = React.useState(false)

	const [editColor, setColor] = React.useState({
		color: "inherit"
	})

	function editClick() {
		if (editButton === true && editColor.color === "inherit") {
		  setEdit(false)
		  setColor({ color: "primary" })
		} else {
			setEdit(true)
			setColor({ color: "inherit"})
		}
	}
	/* END */
	
	return <Query query={FLOW_AUDIT_QUERY} client={mockClient}>
		{({loading, data}) => {
			if(loading) return <div/>;
			const {flowAudit} = data;
			const count = flowAudit.length
			var totalAdministrativeFeeDeduction = 0
			var totalDiscountDeduction = 0
			
			flowAudit.map((o) => {
				totalAdministrativeFeeDeduction += o.administrativeFeeDeduction
				totalDiscountDeduction += o.discountDeduction
			})
			
			const total = totalAdministrativeFeeDeduction + totalDiscountDeduction

			return <Fragment>
				<Paper elevation={1}>
						<Title pageTitle={strings.flowAudit} />
						<Grid container direction="row" justify="space-between" alignItems="center">							
							<Typography className={classes.paper} variant="h6">{strings.flowAudit}</Typography>			
						</Grid>
						<Divider light={true} />
						<Grid container className={classes.paper} alignItems="center" spacing={1}>
							<Grid item>
								<Typography>{strings.currentAccount}:</Typography>
							</Grid>
							<Grid item>
								<Typography color="primary">{filterValues.accountNumber}</Typography>
							</Grid>					
							<GrowItem />
							<Grid item>
								<Typography>{strings.accountNumber}:</Typography>
							</Grid>
							<Grid item>
								<TextField
									style={{width: 280}}
									className={classes.textfield}
									variant="outlined"
									margin="dense"
									name="accountNumber"
									placeholder={strings.pleaseEnter}
									onChange={handleFilterChange}
									value={filterValues.accountNumber}
									/>
							</Grid>
							<Grid item justify="flex-end">
								<Button color="primary" variant="contained" style={{fontSize: 15, minWidth: 90}}>{strings.searchFor}</Button>
							</Grid>
						</Grid>
						<Grid item className={classes.paper} style={{paddingTop: 0}}>
							<SimpleTable
								tableProps={{size: "small"}}
								hasPagination={false}
								pagination={pagination}
								pageInfo={false}
								count={count}
								columns={
									<TableRow>
										<TableCell style={{minWidth: 210}}>{strings.depositTime}</TableCell>
										<TableCell>{strings.depositIntoTheWater}</TableCell>
										<TableCell>{strings.depositAmount}</TableCell>
										<TableCell>{strings.completedAmount}</TableCell>
										<TableCell>{strings.depositNeedsToBeAudited}</TableCell>
										<TableCell>{strings.administrativeFeeDeduction}</TableCell>
										<TableCell style={{minWidth: 150}}>{strings.discountedPrice}</TableCell>
										<TableCell>{strings.offerNeedsToBeAudited}</TableCell>
										<TableCell>{strings.discountDeduction}</TableCell>
										<TableCell style={{minWidth: 180, textAlign: "center"}}>{strings.operating}</TableCell>
									</TableRow>
								}
								rows={
									flowAudit.length === 0 ? 
									<TableRow>
										<TableCell align="center" colSpan={10}>没有可用数据</TableCell>
									</TableRow>
									:
									flowAudit.map((o, index) => {
										return <TableRow>
											<TableCell>{o.depositTime}</TableCell>
											<TableCell align="right">&#165;{o.depositIntoTheWater}.00</TableCell>
											<TableCell align="right">&#165;{o.depositAmount}.00</TableCell>
											<TableCell align="right">&#165;{o.completedAmount}.00</TableCell>
											<TableCell align="right">&#165;{o.depositNeedsToBeAudited}.00</TableCell>
											<TableCell align="right">&#165;{o.administrativeFeeDeduction}.00</TableCell>
											<TableCell align="right">
												<Grid container alignItems="center">
													<Grid Item>
														{/* <IconButton color="primary" aria-label="add" className={classes.iconButton} size="small">
															<Edit fontSize='inherit'/>
														</IconButton>													 */}

														{
															(editButton) ? 
															<Grid container>
															<Button onClick={editClick}>
																<CheckCircleOutlineIcon style={{ fontSize: 16 }} color="primary"/>
															</Button>
															<Button onClick={editClick}>
																<CloseIcon color="primary" style={{ fontSize: 16 }}/>
															</Button>
															</Grid>
															:
															<Button onClick={editClick}>
																<CreateOutlined color="primary" style={{ fontSize: 16 }}/>
															</Button>
														}	
													</Grid>
													<Grid Item>
														{
															(editButton) ?
															<TextField
															value={`${o.discountedPrice}.00`}
															onChange={handleFilterChange}
															variant="outlined"
															margin="dense"
															width="5rem !important"
															/> 
															:
															<Typography>
																&#165;{o.discountedPrice}.00
															</Typography> 
														}	
													</Grid>
												</Grid>											
											</TableCell>
											<TableCell align="right">&#165;{o.offerNeedsToBeAudited}.00</TableCell>
											<TableCell align="right">
												<Typography style={{ color: '#FF0000'}}>
													&#165;{o.discountDeduction}.00
												</Typography>
											</TableCell>
											<TableCell align="center">
												<Button>
													<Typography color="primary">
														{strings.completeAudit}
													</Typography>
												</Button>
											</TableCell>
										</TableRow>			
									}												
								)}
								/>
						</Grid>					
					</Paper>
					<Grid container className={classes.textBottom}>

					<Typography color="textSecondary">
						自从上次出款后，存入共计 {count} 笔 <br />
						存款需稽核流水：1 笔未通过，共需扣除行政费：{totalAdministrativeFeeDeduction.toLocaleString(undefined, {maximumFractionDigits:2})}.00 元 <br />
						优惠需稽核流水：2 笔未通过，共需扣除优惠：{totalDiscountDeduction.toLocaleString(undefined, {maximumFractionDigits:2})}.00 元 <br />
						行政费 + 优惠扣除，共计：{total.toLocaleString(undefined, {maximumFractionDigits:2})}.00 元
					</Typography>			
					</Grid>
			</Fragment>
		}}
	</Query>
		
	}