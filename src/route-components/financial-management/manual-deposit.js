import React, {useState} from 'react';
import { TextField, Grid, Paper, Typography, Divider, FormControlLabel, 
	RadioGroup, Radio, Select, MenuItem, OutlinedInput, Button } from '@material-ui/core';
import Select2, {createFilter} from 'react-select'
import {Loading} from '../../components';
import {makeStyles} from '@material-ui/styles';
import {FormRowCenterItems} from '../../components/form-layouts';
import useLanguages from '../../hooks/use-languages';
import {MANUAL_DEPOSIT} from '../../paths';
import {depositSystemsValues, auditMethodsValues, depositTypesValues} from '../../values';
import Title from '../../components/title';
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import {useDeposit} from '../../queries-graphql/financial-management/manual-deposit-mutation'
import {useUserDepositQuery} from '../../queries-graphql/member-management/user-management'

const useStyles = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2)
	},
	radioGroup: {
		...theme.layout.radioGroup
	}
}));

export const MANUAL_DEPOSIT_INITIAL_STATE = {
	depositSystem: depositSystemsValues.member,
	memberAccount: '',
	depositAmount: '',
	auditMethod: '',
	auditAmount: '',
	depositType: 'none',
	frontDeskNote: '',
	backgroundNote: '',
	depositLevels: [],
	vipRatings: []
}

export default function ManualDeposit(props) {
	let arrUserId = [];
	const strings = useLanguages(MANUAL_DEPOSIT);
	const classes = useStyles();
	const [values, setValues] = useState(MANUAL_DEPOSIT_INITIAL_STATE);
	const [memberAccountValues, setMemberAccountValues] = useState([]);
	const [error, setError] = useState(false);
	const [errorName, setErrorName] = useState(null);

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	const { MANUAL_DEPOSIT_MUTATE } = useDeposit(arrUserId)

	const [manualDeposit] = useMutation(MANUAL_DEPOSIT_MUTATE)

	const numberHandleChange = (event) => {
		event.persist(event.target.name);
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
		if (event.target.value.length === 0) {
			setError (true)
		} else {
			setError(isNaN(event.currentTarget.value))
			setErrorName(event.target.name)
		}
	}

	function addHandle(event) {
		event.preventDefault();
		submitManualDeposit(values);

	}
	
	async function submitManualDeposit(values) {
		try {
			if(memberAccountValues === null || memberAccountValues.length === 0 ) {
				swal.fire({
					position: 'center',
					type: 'error',
					title: 'Error',
					text: strings.required,
					showConfirmButton: true
				})
			} else {
				const res = await manualDeposit({
					variables: {
						amount: values.depositAmount,
						auditType: values.auditMethod, 
						auditAmount: values.auditAmount,
						depositType: values.depositType,
						manualType: values.depositType,
						userNote: values.frontDeskNote,
						internalNote: values.backgroundNote
					}
				})
				
				if(res.data.mutation1.errors[0]){
					swal.fire({
						position: 'center',
						type: 'error',
						title: strings.errorPrompt,
						text: strings.required,
						showConfirmButton: true
					})
				} else {
					swal.fire({
						position: 'center',
						type: 'success',
						title: strings.successPrompt,
						text: strings.success,
						showConfirmButton: true,
						onClose: reset()
					})
					
				}
			}
			
		} catch(e) {
			if(memberAccountValues === null || memberAccountValues.length === 0 ) {
				swal.fire({
					position: 'center',
					type: 'error',
					title: 'Error',
					text: strings.required,
					showConfirmButton: true
				})
			}else if(e){
				if(e.graphQLErrors[0].message === "选择一个有效的选项。 none 不在可用的选项中。"){
					swal.fire({
						position: 'center',
						type: 'error',
						title: 'Error',
						text: strings.required,
						showConfirmButton: true
					})
					
				}
				
				
			} else if (e.networkError.result.errors[0]) {
				swal.fire({
					position: 'center',
					type: 'error',
					title: 'Error',
					text: strings.required,
					showConfirmButton: true
				})
			}
		}

	}

	let arrUsername = []
	const {data, loading} = useUserDepositQuery();
    if(loading) { 
        return <Loading />;
	}
	const memberAccountHandleChange = memberAccountValues => {
		setMemberAccountValues(memberAccountValues);
	}

	const handleClick = () => {
		setMemberAccountValues(null);
	};
	
	const memberAccounts = data.users.edges;

	if(memberAccounts) {
		memberAccounts.map(o => {
			arrUsername.push({value: o.node.id, label: o.node.username})
		})
	}

	if(memberAccountValues) {
		memberAccountValues.map(o => {
			arrUserId.push(o.value)
		})


	}
	
	function reset() {
		handleClick();
		setValues(MANUAL_DEPOSIT_INITIAL_STATE);
	}


	// END
	// return <Query query={MANUAL_DEPOSIT_QUERY} client={mockClient}>
	// {({ loading, error, data }) => {
	// 	if(loading) return <Loading/>;
	// 	console.log("MANUAL_DEPOSIT_QUERY", data, error);
	// 	const {depositLevels, vipRatings} = data;
	
		return <form onSubmit={addHandle} autoComplete="off" >
			<Title pageTitle={strings.manualDeposit} />			
			<Paper elevation={1}>
				<Typography className={classes.padding} variant="h6">{strings.manualDeposit}</Typography>
				<Divider light={true}/>
				<Grid container spacing={1} direction="column" className={classes.padding}>
					<FormRowCenterItems
						isFormGroup
						leftComponent={
							<Typography>{strings.depositSystem}:</Typography>
						}
						rightComponent={
							<RadioGroup aria-label="Deposit System"
								name="depositSystem"
								value={values.depositSystem}
								onChange={handleChange}
								className={classes.radioGroup}>
								<FormControlLabel value={depositSystemsValues.member} control={<Radio color="primary"/>} label={strings.memberAccount}/>
								{/* <FormControlLabel value={depositSystemsValues.entry} onClick={handleClick} control={<Radio color="primary"/>} label={strings.entryLevel}/>
								<FormControlLabel value={depositSystemsValues.vip} onClick={handleClick} control={<Radio color="primary"/>} label={strings.vipRating}/> */}
							</RadioGroup>
						}
					/>
					{values.depositSystem === depositSystemsValues.member &&
						<FormRowCenterItems
							leftComponent={
								<Typography>{strings.memberAccount}:</Typography>
							}
							rightComponent={
								<Grid container spacing={1} alignItems="center">
									<Grid item style={{flexGrow: 1}}>
									<Select2 
										placeholder={strings.select}
										isMulti
										closeMenuOnSelect={false}
										fullWidth={true} 
										onChange={memberAccountHandleChange} 
										value = {memberAccountValues}
										options={
											arrUsername
										}
										filterOption={createFilter({ignoreAccents: false})}
									/>
										
									</Grid>
									<Grid item>
										<Typography>{strings.total} {memberAccountValues ? memberAccountValues.length : 0} {strings.people}</Typography>
									</Grid>
								</Grid>
							}
						/>
					}
					{values.depositSystem === depositSystemsValues.entry &&
						<FormRowCenterItems
							leftComponent={
								<Typography>{strings.entryLevel}:</Typography>
							}
							rightComponent={
								<Select
									fullWidth
									multiple
									value={values.depositLevels}
									margin="dense"
									onChange={handleChange}
									input={<OutlinedInput notched={false} name="depositLevels"/>}
									// renderValue={selected => {
									// 	return selected.map(o => depositLevels.find(d => d.id === o).name).join(', ')
									// }}
									>
									{/* {depositLevels.map(o => (
										<MenuItem key={o.id} value={o.id}>
											<Checkbox color="primary" checked={values.depositLevels.indexOf(o.id) > -1} />
											<ListItemText primary={o.name} />
										</MenuItem>
									))} */}
								</Select>
							}
						/>
					}
					{values.depositSystem === depositSystemsValues.vip &&
						<FormRowCenterItems
						leftComponent={
							<Typography>{strings.vipRating}:</Typography>
						}
						rightComponent={
							<Select
								fullWidth
								multiple
								value={values.vipRatings}
								margin="dense"
								onChange={handleChange}
								input={<OutlinedInput notched={false} name="vipRatings"/>}
								// renderValue={selected => {
								// 	return selected.map(o => vipRatings.find(d => d.id === o).name).join(', ')
								// }}
								>
								{/* {vipRatings.map(o => (
									<MenuItem key={o.id} value={o.id}>
										<Checkbox color="primary" checked={values.vipRatings.indexOf(o.id) > -1} />
										<ListItemText primary={o.name} />
									</MenuItem>
								))} */}
							</Select>
						}
						/>
					}
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.depositAmount}:</Typography>
						}
						rightComponent={
							<TextField fullWidth variant="outlined" type="number" inputProps={{ min: "0", step: ".01"}} margin="dense" name="depositAmount" 
							error={errorName === "depositAmount" && error ? true : false} onChange={numberHandleChange} value={values.depositAmount} required/>
						}
					/>
					<FormRowCenterItems 
						isFormGroup
						leftComponent={
							<Typography>{strings.auditMethod}:</Typography>
						}
						rightComponent={
							<RadioGroup aria-label="Audit Method"
								name="auditMethod"
								value={values.auditMethod}
								onChange={handleChange}
								className={classes.radioGroup}
								required
							>
								<FormControlLabel value={auditMethodsValues.deposit} control={<Radio required color="primary"/>} label={strings.depositAmount}/>
								{/* <FormControlLabel value={auditMethodsValues.preferential} control={<Radio required color="primary"/>} label={strings.preferentialAudit}/>
								<FormControlLabel value={auditMethodsValues.none} control={<Radio required color="primary"/>} label={strings.noAuditRequired}/> */}
							</RadioGroup>
						}
					/>
					<FormRowCenterItems
						leftComponent={
							<Typography>{strings.auditAmount}:</Typography>
						}
						rightComponent={
							<TextField fullWidth variant="outlined" type="number" inputProps={{ min: "0", step: ".01"}} margin="dense" name="auditAmount" 
								onChange={numberHandleChange} value={values.auditAmount} 
								// error={errorName === "auditAmount" && error ? true : false} 
								required/>
						}
					/>
					<FormRowCenterItems 
						leftComponent={
							<Typography>{strings.depositType}:</Typography>
						}
						rightComponent={
							<Select aria-label="Deposit Type"
								required
								fullWidth
								variant="outlined"
								margin="dense"
								name="depositType"
								onChange={handleChange}
								input={<OutlinedInput notched={false} name="depositType"/>}
								value={values.depositType}		
								error={errorName === "depositType" && error ? true : false}			
							>
								<MenuItem value="none" disabled>{strings.select}</MenuItem>
								<MenuItem value={depositTypesValues.manual} >{strings.manualDeposit}</MenuItem>
								{/* <MenuItem value={depositTypesValues.discount} >{strings.discountDeposit}</MenuItem>
								<MenuItem value={depositTypesValues.commission} >{strings.commissionDeposit}</MenuItem>
								<MenuItem value={depositTypesValues.dividends} >{strings.dividendDeposit}</MenuItem>
								<MenuItem value={depositTypesValues.cashback} >{strings.cashback}</MenuItem>
								<MenuItem value={depositTypesValues.replenish} >{strings.replenish}</MenuItem>
								<MenuItem value={depositTypesValues.other} >{strings.other}</MenuItem> */}
							</Select>
						}
					/>
					<FormRowCenterItems
						containerProps={{
							alignItems: 'flex-start'
						}}
						leftComponent={
							<Typography>{strings.frontDeskNote}:</Typography>
						}
						rightComponent={
							<TextField variant="outlined" multiline fullWidth
								rows={3} name="frontDeskNote"  placeholder={strings.placeHolder1}
								onChange={handleChange} value={values.frontDeskNote}/>
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
								rows={3} name="backgroundNote" placeholder={strings.placeHolder2}
								onChange={handleChange} value={values.backgroundNote}/>
						}
					/>
					<FormRowCenterItems
						rightComponent={
							<Grid container spacing={1} direction="column">
								<Grid item>
									<Button fullWidth variant="contained" color="primary" disabled={error ? true : false}  type="submit">{strings.save}</Button>
								</Grid>
								<Grid item>
									<Button fullWidth variant="outlined" onClick={reset} >{strings.reset}</Button>
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