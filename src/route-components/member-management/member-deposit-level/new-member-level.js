import React from 'react';
import { Radio, FormControl, Box, FormControlLabel, RadioGroup, TextField, Grid, Paper, Typography, Divider, Button } from '@material-ui/core';
import { GrowItem } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { MEMBER_DEPOSIT_LEVEL_ADD_MEMBER, MEMBER_DEPOSIT_LEVEL } from '../../../paths';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import {ADD_MEMBER_LEVEL} from '../../../queries-graphql/member-management/member-deposit-level'
import { useMutation } from '@apollo/react-hooks'
import Swal from 'sweetalert2'
import Title from '../../../components/title';

const useStyles = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2)

	},
	radioGroup: {
		...theme.layout.radioGroup
	},
	margin: {
		marginTop: theme.spacing(1)
	},
	marginLeft: {
		marginLeft: theme.spacing(2)
	},
	bold: {
		fontWeight: "bold"
	}
}));

export default function MemberDepositLevelAddMember(props) {
	const { history } = props;
	const strings = useLanguages(MEMBER_DEPOSIT_LEVEL_ADD_MEMBER);
	const classes = useStyles();
	const [setError] = React.useState(null);

	const [value, setValue] = React.useState({
		name: '',
		totalDepositAmount: null,
		totalDeposits: null,
		totalWithdrawalAmount: null,
		totalWithdrawals: null,
		depositLimit: null,
		bankTransferDepositLimit: null,
		withdrawalLimit: null,
		withdrawalType: '',
		withdrawalHours: null,
		withdrawalHoursTimes: null,
		withdrawalHoursTimesCount: null,
		withdrawalFeeType: '',
		withdrawalFeeFixedAmount: null,
		withdrawalFeeProportionalPercent: null,
		withdrawalFeeProportionalCapAmount: null
	});

	function handleChange(event) {
		event.persist();
		setValue(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		})); 
	}

	const [memberAdd] = useMutation(ADD_MEMBER_LEVEL)

	async function save(){
		try{
			const res = await memberAdd({
				variables: {
					name: value.name,
					totalDepositAmount: value.totalDepositAmount,
					totalDeposits: value.totalDeposits,
					totalWithdrawalAmount: value.totalWithdrawalAmount,
					totalWithdrawals: value.totalWithdrawals,
					depositLimit: value.depositLimit,
					bankTransferDepositLimit: value.bankTransferDepositLimit,
					withdrawalLimit: value.withdrawalLimit,
					withdrawalType: value.withdrawalType,
					withdrawalHours: value.withdrawalType === "free" || value.withdrawalType === "everytime" ? null : value.withdrawalHours,
					withdrawalHoursTimes: value.withdrawalType === "free" || value.withdrawalType === "everytime" ? null : value.withdrawalHoursTimes,
					withdrawalHoursTimesCount: value.withdrawalType === "free" || value.withdrawalType === "everytime" ? null : value.withdrawalHoursTimesCount,
					withdrawalFeeType: value.withdrawalFeeType,
					withdrawalFeeFixedAmount: value.withdrawalFeeType === "proportional" ? null : value.withdrawalFeeFixedAmount,
					withdrawalFeeProportionalPercent: value.withdrawalFeeType === "fixed" ? null : value.withdrawalFeeProportionalPercent,
					withdrawalFeeProportionalCapAmount: value.withdrawalFeeType === "fixed" ? null : value.withdrawalFeeProportionalCapAmount}
			})

			if (res.data) {
				Swal.fire({
					type: 'success',
					title: '新会员存款水平已保存',
					showConfirmButton: false,
					timer: 1500,
					marginTop: '160px !important',
					onClose: history.push(MEMBER_DEPOSIT_LEVEL)
				})
			}
		} catch (e){
			setError(e)
		}
	}

	function addHandle(event) {
		event.preventDefault();
		save();
	}

	return <form className={classes.container} onSubmit={addHandle} autoComplete="off">
	<Title pageTitle={strings.pageTitle} />
		<Grid container spacing={2}>
			<Grid item md={4} xs={12} sm={12} >
				<Paper elevation={1} style={{ minHeight: 373 }}>
					<Grid container >
						<Typography className={classes.padding} variant="h6">
							<Grid container>
								<Grid item>
									<ErrorOutline style={{ marginTop: "3px", paddingRight: "3px" }} color="primary" />
								</Grid>
								<Grid item>
									{strings.basicInformationAndJoiningLevelConditions}
								</Grid>
							</Grid>
						</Typography>
					</Grid>
					<Divider light={true} />
					<Grid container className={classes.padding}>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.levelName}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="name"
								onChange={handleChange} value={value.name} required/>
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalDepositAmount}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalDepositAmount"
								onChange={handleChange} value={value.totalDepositAmount}  type="number" required   />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalNumberOfDeposits}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalDeposits"
								onChange={handleChange} value={value.totalDeposits} type="number" required  />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalWithdrawalAmount}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalWithdrawalAmount"
								onChange={handleChange} value={value.totalWithdrawalAmount} type="number" required  />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalWithdrawals}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalWithdrawals"
								onChange={handleChange} value={value.totalWithdrawals} type="number" required  />
						</Grid>
					</Grid>
				</Paper>
			</Grid>

			<Grid item md={8} xs={12} sm={12}>
				<Paper elevation={1}>
					<Grid container >
						<Typography className={classes.padding} variant="h6">
							<Grid container>
								<Grid item>
									<ErrorOutline style={{ marginTop: "3px", paddingRight: "3px" }} color="primary" />
								</Grid>
								<Grid item>
									{strings.hierarchyDepositAndWithdrawalRestriction}
								</Grid>
							</Grid>
						</Typography>
					</Grid>
					<Divider light={true} />
					<Grid container className={classes.padding} >
						<Grid container>
							<Grid item md={5} xs={12} sm={12} style={{}} >
								{/* style={{paddingLeft:60}} */}
								<Grid container alignItems="center">
									<Typography style={{ minWidth: 150 }} >{strings.companyDepositLimit}	:</Typography>
									<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="depositLimit"
										onChange={handleChange} value={value.depositLimit} type="number" required  />
								</Grid>
								<Grid container alignItems="center">
									<Typography style={{ minWidth: 150 }} >{strings.onlineDepositLimit}	:</Typography>
									<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="bankTransferDepositLimit"
										onChange={handleChange} value={value.bankTransferDepositLimit} type="number" required  />
								</Grid>
								<Grid container alignItems="center">
									<Typography style={{ minWidth: 150 }} >{strings.singleWithdrawalLimit}	:</Typography>
									<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="withdrawalLimit"
										onChange={handleChange} value={value.withdrawalLimit} type="number" required  />
								</Grid>
							</Grid>
							<Grid item md={7} xs={12} sm={12}>
								<Grid container alignItems="center">
									<Typography className={classes.bold}>{strings.collectionFeeMethod}	:</Typography>
								</Grid>
								<Grid container alignItems="center">
									<FormControl component="fieldset" className={classes.formControl}>
										<RadioGroup
											name="withdrawalType"
											className={classes.group}
											value={value.withdrawalType}
											onChange={handleChange}
										>

											<Grid container>
												<FormControlLabel value="free" control={<Radio required color="primary" />} label={strings.feeOfCharge} />
											</Grid>

											<Grid container>
												<FormControlLabel value="hours" control={<Radio required color="primary" />} />
												<FormControlLabel control={<TextField variant="outlined" type="number" required  disabled={value.withdrawalType != "hours"? true : false} value={value.withdrawalHours} margin="dense" name="withdrawalHours"
													onChange={handleChange} style={{ width: 100 }} />} label={strings.withdrawalWithinHours} />

												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalType != "hours"? true : false} type="number" required  value={value.withdrawalHoursTimesCount} margin="dense"
													onChange={handleChange} name="withdrawalHoursTimesCount" style={{ width: 100 }} />} label={strings.exemption} />
											</Grid>

											<Grid container>
												<FormControlLabel value="everytime" control={<Radio required color="primary" />} label={strings.everyTime} />
											</Grid>

										</RadioGroup>
									</FormControl>
								</Grid>

								{/* 2nd */}
								<Grid container alignItems="center">
									<Typography className={classes.bold}>{strings.collectionFeeMethod}	:</Typography>
								</Grid>
								<Grid container alignItems="center">
									<FormControl component="fieldset" className={classes.formControl}>
										<RadioGroup
											name="withdrawalFeeType"
											className={classes.group}
											value={value.withdrawalFeeType}
											onChange={handleChange}
										>
											<Grid container>
												<FormControlLabel value="fixed" control={<Radio required color="primary" />} label={strings.fixedAmount} />
												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType != "fixed"? true : false} margin="dense" type="number" required  name="withdrawalFeeFixedAmount"
													onChange={handleChange} value={value.withdrawalFeeFixedAmount} style={{ width: 100 }} />} label={strings.yuan} />
											</Grid>

											<Grid container>
												<FormControlLabel value="proportional" control={<Radio required color="primary" />} label={strings.proportional} />
												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType != "proportional"? true : false} margin="dense" type="number" required  name="withdrawalFeeProportionalPercent"
													onChange={handleChange} value={value.withdrawalFeeProportionalPercent} style={{ width: 100 }} />} label={strings.capAmount} />

												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType != "proportional"? true : false} margin="dense" type="number" required  name="withdrawalFeeProportionalCapAmount"
													onChange={handleChange} value={value.withdrawalFeeProportionalCapAmount} style={{ width: 100 }} />} label={strings.yuan} />
											</Grid>

										</RadioGroup>
									</FormControl>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
			</Grid>

			<Grid item md={12} xs={12} sm={12} >
				<Grid container >
					<Box mx="auto">
						<Button variant="contained" color="primary" type="submit" className={classes.button} style={{ marginRight: 10 }}>
							{strings.save}
						</Button>
						<Button variant="contained" color="primary" className={classes.button} onClick={() => history.push(MEMBER_DEPOSIT_LEVEL)} >
							{strings.return}
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Grid>
	</form>
}