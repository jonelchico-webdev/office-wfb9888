import React, {useState} from 'react';
import { TextField, Grid, Paper, Typography, Divider, Select, MenuItem, OutlinedInput, Button, Card, CardContent} from '@material-ui/core';
import {Loading} from '../../components';
import {makeStyles} from '@material-ui/styles';
import {FormRowCenterItems} from '../../components/form-layouts';
import useLanguages from '../../hooks/use-languages';
import {MANUAL_WITHDRAW} from '../../paths';
import {withdrawalTypesValues} from '../../values';
import Title from '../../components/title';
import Select2, {createFilter} from 'react-select'
import swal from 'sweetalert2';
import { useMutation } from '@apollo/react-hooks'
import {useUserWithdrawalQuery} from '../../queries-graphql/member-management/user-management'
import {MANUAL_WITHDRAWAL_MUTATE} from '../../queries-graphql/financial-management/manual-withdraw-mutation'
import Cookies from 'universal-cookie';

const useStyles = makeStyles(theme => ({
	card: {
		minWidth: 225,
	},
	padding: {
		padding: theme.spacing(2)
	},
	radioGroup: {
		...theme.layout.radioGroup
	},
	title: {
		fontSize: 14,
	},
}));
const cookies = new Cookies();

export const MANUAL_WITHDRAWAL_INITIAL_STATE = {
	memberAccount: null,
	withdrawalAmount: '',
	withdrawalType: 'none',
	frontDeskNote: '',
	backgroundNote: '',
	withdrawalsPassword: '',
	// depositBankName: '',
	// depositAccount: '',
	// depositBranch: '',
	// depositUserName: ''
}

export default function ManualWithdraw() {
	const strings = useLanguages(MANUAL_WITHDRAW);
	const classes = useStyles();
	const [values, setValues] = useState(MANUAL_WITHDRAWAL_INITIAL_STATE);
	const [nextStep, setNextStep] = useState(true);
	const [showUser, setShowUser] = useState(false);
	const [error, setError] = useState({});
	const [setHelpText] = useState({});
	const [memberAccountValues, setMemberAccountValues] = useState(null);
	const [manualWithdrawal] = useMutation(MANUAL_WITHDRAWAL_MUTATE)
	const [refresh, setRefresh] = useState(false)
	let arrUsername = []
	const { data, loading } = useUserWithdrawalQuery({refresh: refresh});
    if(loading) { 
        return <Loading />;
	}

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	function numberHandleChange(event) {
		event.persist();
		const re = /^[0-9\b]+$/;
		if (event.target.value === '' || re.test(event.target.value)) {
			setValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));
			setError(oldError => ({
				...oldError,
				[event.target.name]: false
			}))
			setHelpText(oldHelpText => ({
				...oldHelpText,
				[event.target.name]: ''
			}))
		 } else {
			setValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value,
			}));
			setError(oldError => ({
				...oldError,
				[event.target.name]: true
			}))
			setHelpText(oldHelpText => ({
				...oldHelpText,
				[event.target.name]: `${event.target.name} must be a number.`
			}))
		 }
		 
	}

	const handleClick = () => {
		setMemberAccountValues(null);
	}

	function reset() {
		setShowUser(false);
		setNextStep(true);
		handleClick();
		setError(false);
		setHelpText(false);
		setValues(MANUAL_WITHDRAWAL_INITIAL_STATE)
	}
	const memberAccountHandleChange = memberAccountValues => {
		setMemberAccountValues(memberAccountValues);
		setShowUser(true)
	}


	const memberAccounts = data.users.edges;

	function addHandle(event) {
		event.preventDefault();
		submitManualWithdrawal(values);
	}

	async function submitManualWithdrawal(values) {
		try {
			const res = await manualWithdrawal({
					variables: {
						user: memberAccountValues.value,
						amount: values.withdrawalAmount,
						withdrawalType: values.withdrawalType,
						userNote: values.frontDeskNote,
						createUser: cookies.get('ID'),
						internalNote: values.backgroundNote
						// depositBankName: values.depositBankName,
						// depositAccount: values.depositAccount,
						// depositBranch: values.depositBranch,
						// depositUserName: values.depositUserName
					}	
				})
				if(res.data.withdrawal.errors[0]){
					swal.fire({
						position: 'center',
						type: 'error',
						title: strings.error,
						text: res.data.withdrawal.errors[0].messages[0] === "选择一个有效的选项。 none 不在可用的选项中。" ? strings.errorMessage1 : strings.errorMessage2,
						showConfirmButton: true
					})
				} else {
					swal.fire({
						position: 'center',
						type: 'success',
						title: strings.success,
						text: strings.successManualWithdraw,
						showConfirmButton: true
					})
					setRefresh(!refresh)
					reset()
				}
		} catch (e) {
			swal.fire({
				position: 'center',
				type: 'error',
				title: e.graphQLErrors[0].message,
				showConfirmButton: true
			})
		}

	} 
	// let arrLabel = []
	// if(memberAccountValues) {
	// 	memberAccountValues.map(o => {
	// 		arrLabel.push(o.label)
	// 	})
	// }
	// console.log(memberAccountValues, 'memberAccountValues')
	// console.log(arrLabel, 'arrLabel')

		
	if(memberAccounts) {
		memberAccounts.map(o => {
			arrUsername.push({value: o.node.id, label: o.node.username, balance: o.node.balance})
		})
	}
	
	// return <Query query={MANUAL_DEPOSIT_QUERY}>
	// {({ loading, error, data }) => {
	// 	if(loading) return <Loading/>;
		// console.log("MANUAL_DEPOSIT_QUERY", data, error);
		// const {depositLevels, vipRatings} = data;
		return <form onSubmit={addHandle} autoComplete="off">
			<Title pageTitle={strings.manualWithdrawal} />
			<Paper elevation={1}>
				<Typography className={classes.padding} variant="h6">{strings.manualWithdrawal}</Typography>
				<Divider light={true}/>
				<Grid container spacing={1} direction="column" className={classes.padding}>
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.memberAccount}:</Typography>
						}
						rightComponent={
							<Grid container spacing={1} alignItems="center">
								<Grid item style={{flexGrow: 1}}>
									<Select2 
										// isMulti
										placeholder= {strings.select}
										fullWidth={true} 
										variant="outlined" 
										margin="dense" 
										name="memberAccount" 
										isClearable={true}
										onChange={memberAccountHandleChange} 
										value = {memberAccountValues}
										options={
											arrUsername
										}
										filterOption={createFilter({ignoreAccents: false})}
									/>
								</Grid>
								{/* <Grid item>
									<Button onClick={handleClick} disabled={!nextStep} variant="outlined">{strings.reset}</Button>
								</Grid>
								<Grid item>
									<Button variant="contained" disabled={(memberAccountValues) !== null ? !nextStep: nextStep} onClick={nextStepHandleClick} color="primary">{strings.nextStep}</Button>
								</Grid>
								 */}
							</Grid>
						}
					/>
					{<FormRowCenterItems
						leftComponent={null}
						rightComponent={
						showUser &&
							<Grid justify="center" container>
								<Grid item>
									<Card className={classes.card} >
										<CardContent>
											<Typography className={classes.title} color="textSecondary" gutterBottom>
												{strings.memberAccount}:
											</Typography>
											<Typography variant="h5" component="h2">
												{memberAccountValues ? memberAccountValues.label : setShowUser(false)}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
									<Grid item>
										<Card className={classes.card}>
											<CardContent>
												<Typography className={classes.title} color="textSecondary" gutterBottom>
													{strings.currentBalance}:
												</Typography>
												<Typography variant="h5" component="h2">
													{memberAccountValues ? memberAccountValues.balance : setShowUser(false)}
												</Typography>
											</CardContent>
										</Card>
									</Grid>
							</Grid>
							}
						/>
					}
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.withdrawalAmount}:</Typography>
						}
						rightComponent={
							<TextField fullWidth variant="outlined" margin="dense" name="withdrawalAmount" 
								 onChange={numberHandleChange} type="number" inputProps={{ min: "0",  step: ".01"}} value={values.withdrawalAmount} required disabled={memberAccountValues ? !nextStep : nextStep}/>
						}
					/>
					{/* <FormRowCenterItems
						leftComponent={
							<Typography>{strings.depositBankName}:</Typography>
						}
						rightComponent={
							<TextField 
								fullWidth 
								variant="outlined"
								margin="dense" 
								name="depositBankName" 	
								onChange={handleChange} 
								required 
								value={values.depositBankName}
								disabled={memberAccountValues ? !nextStep : nextStep}
							 />
						}
					/>
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.depositUserName}:</Typography>
						}
						rightComponent={
							<TextField 
								fullWidth 
								variant="outlined"
								margin="dense" 
								name="depositUserName" 	
								onChange={handleChange} 
								required 
								value={values.depositUserName}
								disabled={memberAccountValues ? !nextStep : nextStep}
							 />
						}
					/>
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.depositAccount}:</Typography>
						}
						rightComponent={
							<TextField 
								fullWidth 
								variant="outlined"
								margin="dense" 
								name="depositAccount" 	
								onChange={numberHandleChange} 
								required 
								value={values.depositAccount}
								disabled={memberAccountValues ? !nextStep : nextStep}
								error={error.depositAccount}
								helperText={helpText.depositAccount}
							 />
						}
					/>
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.depositBranch}:</Typography>
						}
						rightComponent={
							<TextField 
								fullWidth 
								variant="outlined"
								margin="dense" 
								name="depositBranch" 	
								onChange={handleChange} 
								required 
								value={values.depositBranch}
								disabled={memberAccountValues ? !nextStep : nextStep}
							 />
						}
					/> */}
					
					<FormRowCenterItems	
						leftComponent={
							<Typography>{strings.withdrawalType}:</Typography>
						}
						rightComponent={
							<Select aria-label="Withdrawal Type"
								fullWidth
								margin="dense"
								variant="outlined"
								name="withdrawalType"
								value={values.withdrawalType}
								onChange={handleChange}
								input={<OutlinedInput notched={false} name="withdrawalType"/>}
								disabled={memberAccountValues ? !nextStep : nextStep}
								>
								<MenuItem value="none" disabled>{strings.select}</MenuItem>	
								<MenuItem value={withdrawalTypesValues.manual}>{strings.manualWithdrawal}</MenuItem>
								<MenuItem value={withdrawalTypesValues.discount}>{strings.discountDeduction}</MenuItem>
								<MenuItem value={withdrawalTypesValues.other}>{strings.otherDeduction}</MenuItem>
							</Select>
						}
					/>
					{/* <FormRowCenterItems
						leftComponent={
							<Typography>{strings.enterPassword}:</Typography>
						}
						rightComponent={
							<TextField fullWidth variant="outlined" margin="dense" name="withdrawalsPassword" 
								 onChange={handleChange} type="password" inputProps={{ min: "0"}} value={values.withdrawalsPassword} disabled={nextStep}/>
						}
					/> */}
					<FormRowCenterItems
						containerProps={{
							alignItems: 'flex-start'
						}}
						leftComponent={
							<Typography>{strings.frontDeskNote}:</Typography>
						}
						rightComponent={
							<TextField variant="outlined" multiline fullWidth
								rows={3} name="frontDeskNote"  placeholder={strings.frontDeskNotePlaceholder}
								onChange={handleChange} value={values.frontDeskNote} disabled={memberAccountValues ? !nextStep : nextStep}/>
						}
					/>
					<FormRowCenterItems
						containerProps={{
							alignItems: 'flex-start'
						}}
						leftComponent={
							<Typography>{strings.backgroundNote}:</Typography>
						}
						rightComponent={
							<TextField variant="outlined" multiline fullWidth
								rows={3} name="backgroundNote" placeholder={strings.backgroundNotePlaceholder}
								onChange={handleChange} value={values.backgroundNote} disabled={memberAccountValues ? !nextStep : nextStep}/>
						}
					/> 
					<FormRowCenterItems
						rightComponent={
							<Grid container spacing={1} direction="column">
								<Grid item>
									<Button fullWidth variant="contained" color="primary" type="submit" disabled={error.depositAccount ? true : memberAccountValues ? !nextStep : nextStep }>{strings.save}</Button>
								</Grid>
								<Grid item>
									<Button fullWidth variant="outlined" disabled={memberAccountValues ? !nextStep : nextStep} onClick={reset}>{strings.reset}</Button>
								</Grid>
							</Grid>
						}
					/>
				</Grid>
			</Paper>
		</form>
	}
// }
// 	</Query>
// }