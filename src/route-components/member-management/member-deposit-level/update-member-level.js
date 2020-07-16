import React from 'react';
import { Radio, FormControl, Box, FormControlLabel, RadioGroup, TextField, Grid, Paper, Typography, Divider, Button } from '@material-ui/core';
import { Loading, GrowItem } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { MEMBER_DEPOSIT_LEVEL_ADD_MEMBER, MEMBER_DEPOSIT_LEVEL } from '../../../paths';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import {UPDATE_MEMBER_LEVEL} from '../../../queries-graphql/member-management/member-deposit-level'
import { useMutation } from '@apollo/react-hooks'
import Swal from 'sweetalert2'
import {useMemberDepositLevelID} from '../../../queries-graphql/member-management/member-deposit-level'
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

export default function MemberDepositLevelUpdateMember(props) {
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

	const [memberUpdate] = useMutation(UPDATE_MEMBER_LEVEL)

	const { data, loading } = useMemberDepositLevelID({id: history.location.pathname.split("update/",2)[1]})
    if (loading) {
        return <Loading/>
	}

	function handleChange(event) {
		event.persist();
		setValue(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		})); 
	}

	async function save(){

		try{
			const res = await memberUpdate({
				variables: {
					id: history.location.pathname.split("update/",2)[1],
					name: value.name !== '' ? value.name : data.memberLevel.name,
					totalDepositAmount: value.totalDepositAmount !== null ? value.totalDepositAmount : data.memberLevel.totalDepositAmount,
					totalDeposits: value.totalDeposits !== null ? value.totalDeposits : data.memberLevel.totalDeposits,
					
					totalWithdrawalAmount: value.totalWithdrawalAmount !== null ? value.totalWithdrawalAmount : data.memberLevel.totalWithdrawalAmount,
					totalWithdrawals: value.totalWithdrawals !== null ? value.totalWithdrawals : data.memberLevel.totalWithdrawals,
					depositLimit: value.depositLimit !== null ? value.depositLimit : data.memberLevel.depositLimit,

					bankTransferDepositLimit: value.bankTransferDepositLimit !== null ? value.bankTransferDepositLimit : data.memberLevel.bankTransferDepositLimit,
					withdrawalLimit: value.withdrawalLimit !== null ? value.withdrawalLimit : data.memberLevel.withdrawalLimit,
					withdrawalType: value.withdrawalType !== '' ? value.withdrawalType : data.memberLevel.withdrawalType,

					withdrawalHours: value.withdrawalType ==='free' || value.withdrawalType ==='everytime' ? null : value.withdrawalHours !== null ? value.withdrawalHours : data.memberLevel.withdrawalHours,
					withdrawalHoursTimes: value.withdrawalType ==='free' || value.withdrawalType ==='everytime' ? null : value.withdrawalHoursTimes !== null ? value.withdrawalHoursTimes : data.memberLevel.withdrawalHoursTimes,
					withdrawalHoursTimesCount: value.withdrawalType ==='free' || value.withdrawalType ==='everytime' ? null : value.withdrawalHoursTimesCount !== null ? value.withdrawalHoursTimesCount : data.memberLevel.withdrawalHoursTimesCount,

					withdrawalFeeType: value.withdrawalFeeType !== '' ? value.withdrawalFeeType : data.memberLevel.withdrawalFeeType,
					withdrawalFeeFixedAmount: value.withdrawalFeeType === 'proportional' ? null : value.withdrawalFeeFixedAmount !== null ? value.withdrawalFeeFixedAmount : data.memberLevel.withdrawalFeeFixedAmount,
					withdrawalFeeProportionalPercent: value.withdrawalFeeType === 'fixed' ? null : value.withdrawalFeeProportionalPercent !== null ? value.withdrawalFeeProportionalPercent : data.memberLevel.withdrawalFeeProportionalPercent,
					withdrawalFeeProportionalCapAmount: value.withdrawalFeeType === 'fixed' ? null : value.withdrawalFeeProportionalCapAmount !== null ? value.withdrawalFeeProportionalCapAmount : data.memberLevel.withdrawalFeeProportionalCapAmount}
			})

			if (res.data) {
				Swal.fire({
					type: 'success',
					title: '会员存款水平已更新',
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

	if(value.withdrawalType === ''){
		setValue(oldValues => ({
			...oldValues,
			withdrawalType: data.memberLevel.withdrawalType.toLowerCase()
		})); 
	}

	if(value.withdrawalFeeType === ''){
		setValue(oldValues => ({
			...oldValues,
			withdrawalFeeType: data.memberLevel.withdrawalFeeType.toLowerCase()
		})); 
	}

	function updateHandle(event) {
		event.preventDefault();
		save();
	}

	return <form className={classes.container} onSubmit={updateHandle} autoComplete="off">
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
								onChange={handleChange} defaultValue={data.memberLevel.name} />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalDepositAmount}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalDepositAmount"
								onChange={handleChange} defaultValue={data.memberLevel.totalDepositAmount}  type="number" />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalNumberOfDeposits}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalDeposits"
								onChange={handleChange} defaultValue={data.memberLevel.totalDeposits} type="number" />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalWithdrawalAmount}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalWithdrawalAmount"
								onChange={handleChange} defaultValue={data.memberLevel.totalWithdrawalAmount} type="number" />
						</Grid>

						<Grid container alignItems="center">
							<GrowItem />
							<Typography >{strings.totalWithdrawals}	:</Typography>
							<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="totalWithdrawals"
								onChange={handleChange} defaultValue={data.memberLevel.totalWithdrawals} type="number" />
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
										onChange={handleChange} defaultValue={data.memberLevel.depositLimit} type="number" />
								</Grid>
								<Grid container alignItems="center">
									<Typography style={{ minWidth: 150 }} >{strings.onlineDepositLimit}	:</Typography>
									<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="bankTransferDepositLimit"
										onChange={handleChange} defaultValue={data.memberLevel.bankTransferDepositLimit} type="number" />
								</Grid>
								<Grid container alignItems="center">
									<Typography style={{ minWidth: 150 }} >{strings.singleWithdrawalLimit}	:</Typography>
									<TextField className={classes.marginLeft} variant="outlined" margin="dense" name="withdrawalLimit"
										onChange={handleChange} defaultValue={data.memberLevel.withdrawalLimit} type="number" />
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
											defaultValue={data.memberLevel.withdrawalType.toLowerCase()}
											onChange={handleChange}
										>

											<Grid container>
												<FormControlLabel value="free" control={<Radio color="primary" />} label={strings.feeOfCharge} />
											</Grid>

											<Grid container>
												<FormControlLabel value="hours" control={<Radio color="primary" />} />
												<FormControlLabel control={<TextField variant="outlined" type="number" disabled={value.withdrawalType !== "hours"? true : false} defaultValue={data.memberLevel.withdrawalHours} 
													margin="dense" name="withdrawalHours" onChange={handleChange} style={{ width: 100 }} />} label={strings.withdrawalWithinHours} />

												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalType !== "hours"? true : false} type="number" defaultValue={data.memberLevel.withdrawalHoursTimesCount} margin="dense"
													onChange={handleChange} name="withdrawalHoursTimesCount" style={{ width: 100 }} />} label={strings.exemption} />
											</Grid>

											<Grid container>
												<FormControlLabel value="everytime" control={<Radio color="primary" />} label={strings.everyTime} />
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
											defaultValue={data.memberLevel.withdrawalFeeType.toLowerCase()}
											onChange={handleChange}
										>
											<Grid container>
												<FormControlLabel value="fixed" control={<Radio color="primary" />} label={strings.fixedAmount} />
												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType !== "fixed"? true : false} margin="dense" type="number" name="withdrawalFeeFixedAmount"
													onChange={handleChange} defaultValue={data.memberLevel.withdrawalFeeFixedAmount} style={{ width: 100 }} />} label={strings.yuan} />
											</Grid>

											<Grid container>
												<FormControlLabel value="proportional" control={<Radio color="primary" />} label={strings.proportional} />
												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType !== "proportional"? true : false} margin="dense" type="number" name="withdrawalFeeProportionalPercent"
													onChange={handleChange} defaultValue={data.memberLevel.withdrawalFeeProportionalPercent} style={{ width: 100 }} />} label={strings.capAmount} />

												<FormControlLabel control={<TextField variant="outlined" disabled={value.withdrawalFeeType !== "proportional"? true : false} margin="dense" type="number" name="withdrawalFeeProportionalCapAmount"
													onChange={handleChange} defaultValue={data.memberLevel.withdrawalFeeProportionalCapAmount} style={{ width: 100 }} />} label={strings.yuan} />
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