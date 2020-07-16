import React, {useState, Fragment} from 'react';
import {COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT} from '../../../paths';
import useLanguages from '../../../hooks/use-languages';
import { TextField, Grid, Paper, Typography, Divider, Radio, RadioGroup, FormControlLabel, Checkbox, Button, IconButton, FormControl, InputLabel, Select, ListItemText,
	Input, MenuItem
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FormRowCenterItems} from '../../../components/form-layouts';
import Title from '../../../components/title';
import {Loading} from '../../../components';
import {EditOutlined, DeleteOutline, SaveOutlined, Error} from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks'
import Swal from 'sweetalert2'
import Select2, {createFilter, components} from 'react-select'
import useMemberQuery, {ADD_BANK_QUERY, ADD_DEPOSIT_RULE_QUERY, ADD_DEPOSIT_BONUS_QUERY} from '../../../queries-graphql/financial-management/member-levels'
import usePayTypeQuery from '../../../queries-graphql/financial-management/pay-type-query'

const ValueContainer = ({ children, getValue, ...props }) => {
	var values = getValue();
	var valueLabel = "";
  
	if (values.length > 0) valueLabel += props.selectProps.getOptionLabel(values[0]);
	if (values.length > 1) valueLabel += ` & ${values.length - 1} more`;
  
	// Keep standard placeholder and input from react-select
	var childsToRender = React.Children.toArray(children).filter((child) => ['Input', 'DummyInput', 'Placeholder'].indexOf(child.type.name) >= 0);
  
	return (
	  <components.ValueContainer {...props}>
		{!props.selectProps.inputValue && valueLabel }
		{ childsToRender }
	  </components.ValueContainer>
	);
  };

  const customStylesReactSelect = {
    control: (base, state) => ({
      ...base,
      height: '34px',
      'min-height': '34px',
    }),
};

const useStyles = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2)
	},

	chip: {
		padding: theme.spacing(1),
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1)
	},
	rule: {
		padding: theme.spacing(1),
	},
	radioGroup: {
		...theme.layout.radioGroup
	},

	checkBoxGroup: {
		...theme.layout.checkBoxGroup
	},

	swalTop: {
		marginTop: theme.spacing(2),
	},

	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},

	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
}));

const MenuProps = {
	PaperProps: {
	  style: {
		maxHeight: 200,
		width: 250,
	  },
	},
  };

export const USER_RULE_FORM_INITIAL_STATE = {
	singleMinimumDeposit: '',
	singleMaximumDeposit: '',
	amountPerDaySuspended: '',
	noOfTransactionPerDay: '',
	proportionOfDepositFee: '',
	quickSelectionAmount: '',
	quickSelectionAmounts: [],
	useCompany: '',
	availableMembershipLevels: []
}

function usePayType() {
	const {data, loading} = usePayTypeQuery({mutation: true});
	if(loading ) {
		return <Loading/>;
	}
	return data.payType.edges;
}

export default function CompanyDepositAccountManagementForm(props) {
    const strings = useLanguages(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD);
	const classes = useStyles();
	const {history} = props;
	// const {handleChange, values, setValues, valuesList, setValuesList} = props;
	const [valuesList, setValuesList] = useState([]);
	const [depositOfferBonus, setDepositOfferBonus] = useState([]);
	const payTypes = usePayType()
	const [membershipLevel, setMembershipLevel] = useState([])
	let arrMembershipLevel = []
	const membershipLevelArr = []
	
	const [values, setValues] = useState({
		payType: '',
		bankName: '',
		bankAccount: '',
		payee: '',
		bankBranch: '',
		quickSelectionAmount: '',
		availableMembershipLevels: [],
		quickSelectionAmounts: [],
		paymentTypes: [],
		singleMinimumDeposit: null,
		singleMaximumDeposit: null,
		amountPerDaySuspended: null,
		noOfTransactionPerDay: null,
		proportionOfDepositFee: null,
		depositOffer: '',
		depositAmount: null,
		promotionRatio: null,
		offerLimitAmount: null,
		preferentialAuditMultiple: null
	});
	 
	const [error, setError] = React.useState(null);
	const [errorName, setErrorName] = React.useState(null);

	const ErrorHandle = (condi) => {
		return condi ?
			<Fragment>
				<Grid container alignItems="center">
					<Error fontSize="small" />
					&nbsp;
					{strings.numberOnlyField}
				</Grid>
			</Fragment> 
		:
		null
	}

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	const depoFeeHandle = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value >= 100 ? 0 : event.target.value,
		}));

		if (event.target.value.length === 0) {
			setError(true)
		} else {
			setError(isNaN(event.currentTarget.value))
			setErrorName(event.target.name)
		}
	}

	const numberHandleChange = (event) => {
		event.persist(event.target.name);
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
		if (event.target.value.length === 0) {
			setError(true)
		} else {
			setError(isNaN(event.currentTarget.value))
			setErrorName(event.target.name)
		}
	}

	// function handleQuickAmountSelections(event) {
	// 	event.persist();
	// 	if(event.keyCode === 13) {
	// 		setValues(oldValues => ({
	// 			...oldValues,
	// 			'quickSelectionAmount': '',
	// 			'quickSelectionAmounts': [...oldValues.quickSelectionAmounts, event.target.value]
	// 		}));
	// 	}
	// }

	// function handleDeleteQuickAmountSelection(index) {
	// 	setValues(oldValues => ({
	// 		...oldValues,
	// 		'quickSelectionAmounts': oldValues.quickSelectionAmounts.filter((o, i) => i !== index)
	// 	}));
	// }
	
	// function handleChangeMembershipLevels(event) {
	// 	event.persist();
	// 	setValues(oldValues => {
	// 		let availableMembershipLevels = oldValues.availableMembershipLevels;
	// 		if(event.target.checked) {
	// 			availableMembershipLevels.push(event.target.value);
	// 		}
	// 		else {
	// 			availableMembershipLevels = availableMembershipLevels.filter((o) => o !== event.target.value)
	// 		}
	// 		return {
	// 			...oldValues,
	// 			'availableMembershipLevels': availableMembershipLevels
	// 		}
	// 	});
	// }

	// function handleAddRule() {
	// 	setValuesList(oldValuesList => [...oldValuesList, values]);
	// 	setValues(USER_RULE_FORM_INITIAL_STATE);
	// }
	
	function handleDeleteRule(index) {
		return () => setValuesList(oldValuesList => oldValuesList.filter((o, i) => i !== index));
	}

	function handleUpdateRule(index) {
		return () => setValues({...valuesList[index], selectedUserRule: index});
	}

	function handleSaveRule(index) {
		return () => setValuesList(oldValuesList => oldValuesList.map((o, i) => {
			if(i === index) {
				return values;
			}
			return o;
		}))
	}

	// const [setUserRuleValues] = useState({
	// 	singleMinimumDeposit: '',
	// 	singleMaximumDeposit: '',
	// 	amountPerDaySuspended: '',
	// 	noOfTransactionPerDay: '',
	// 	proportionOfDepositFee: '',
	// 	quickSelectionAmounts: [],
	// 	availableMembershipLevels: [],
	// 	quickSelectionAmount: '',
	// 	selectedUserRule: ''
	// });
	
	// const handleUserRuleChange = (event) => {
	// 	event.persist();
	// 	setUserRuleValues(oldValues => ({
	// 		...oldValues,
	// 		[event.target.name]: event.target.value,
	// 	}));
	// }

	// const [setDepositOfferSettingsValues] = useState({
	// 	depositOffer: 'noDiscount',
	// 	depositAmount: '',
	// 	promotionRatio: '',
	// 	offerLimitAmount: '',
	// 	preferentialAuditMultiple: '',
	// 	selectedSettings: ''
	// });

	const [depositOfferSettingsList, setDepositOfferSettingsList] = useState([]);
	
	// const handleDespositSettingsChange = (event) => {
	// 	event.persist();
	// 	setDepositOfferSettingsValues(oldValues => ({
	// 		...oldValues,
	// 		[event.target.name]: event.target.value,
	// 	}));
	// }
	
	// function handleAddSettings() {
	// 	setDepositOfferBonus(oldDepositOfferBonus => [...oldDepositOfferBonus, values]);
	// 	setDepositOfferSettingsList({
	// 		depositOffer: 'noDiscount',
	// 		depositAmount: '',
	// 		promotionRatio: '',
	// 		offerLimitAmount: '',
	// 		preferentialAuditMultiple: '',
	// 	})
	// }

	function handleDeleteSettings(index) {
		return () => setDepositOfferBonus(oldDepositOfferBonus => oldDepositOfferBonus.filter((o, i) => i !== index));
	}

	function handleUpdateSettings(index) {
		return () => setDepositOfferSettingsList({...depositOfferBonus[index], selectedSettings: index});
	}

	function handleSaveSettings(index) {
		return () => setDepositOfferBonus(oldDepositOfferBonus => oldDepositOfferBonus.map((o, i) => {
			if(i === index) {
				return values;
			}
			return o;
		}))
	}

	const [bank] = useMutation(ADD_BANK_QUERY)
	const [depositRule] = useMutation(ADD_DEPOSIT_RULE_QUERY)
	const [depositBonus] = useMutation(ADD_DEPOSIT_BONUS_QUERY)
	console.log(membershipLevel, 'mlevel')
	async function mutateAdd(allData) {
		let memberLevel = [];
		// console.log(allData, "allDataaaaaaaaaaaaa")
		
		membershipLevel.map((item, idx) => (
			memberLevel.push(item.pk)
			
		))
		try{
			const res = await bank({
				variables: {bankName: allData.bankName, 
					bankAccount: allData.bankAccount,  payType: allData.payType,
					beneficiary: allData.payee, bankBranch: allData.bankBranch}
			})
			if (res.data) {
				depositRule({
					variables: {bank: res.data.bank.bank.id, singleMinDeposit: allData.singleMinimumDeposit, 
						singleMaxDeposit: allData.singleMaximumDeposit, perDayMaxDepositAmount: allData.amountPerDaySuspended, 
						perDayMaxDepositTimes: allData.noOfTransactionPerDay, depositPercentageFee: allData.proportionOfDepositFee, depositLevels: memberLevel}
				})

				depositBonus({
					variables: {bank: res.data.bank.bank.id, depositType: allData.depositOffer , depositAmount: allData.depositAmount, 
						discountPercentRatio: allData.promotionRatio, maxPromoAmount: allData.offerLimitAmount, 
						minBetTimesAmount: allData.preferentialAuditMultiple}
				})
			} else {
			// setError(JSON.stringify(res.errors, Object.getOwnPropertyNames(res.errors))))
				// console.log(res)
			}
			Swal.fire({
				type: 'success',
				title: '新银行已保存',
				showConfirmButton: false,
				timer: 1500,
				marginTop: '160px !important',
			})

		} catch (e){
			setError(e)
		}
		history.push(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT)
	}

	function addHandle(event) {
		event.preventDefault();
		mutateAdd(values);

		
	}

	const membershipLevelHandleChange = membershipLevel => {
		setMembershipLevel(membershipLevel)
	}

	const {data, loading} = useMemberQuery({first: 5});
	if (loading) {
		return null
	}

	if(data.memberLevels) {
        data.memberLevels.edges.map(o => {
            arrMembershipLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
	}
	
	if(membershipLevel) {
		if(data.memberLevels) {
			data.memberLevels.edges.map(o => {
				membershipLevelArr.push(o.pk)
			})
		}
	}




    return <form className={classes.container} onSubmit={addHandle} autoComplete="off">
			<Grid item container spacing={2}>
				<Grid item md={4}>
					<Paper elevation={1} style={{height: 500}}>
						<Title pageTitle={strings.headerTitle} />
						<Typography className={classes.padding} variant="h6">{strings.depositAccountInformation}</Typography>
						<Divider light={true}/>
						<Grid container spacing={1} direction="column" className={classes.padding} alignItems="center">
							<FormRowCenterItems
								isFormGroup={true}
								leftComponent={
									<Typography>{strings.depositAccountInformation}:</Typography>
								}
								rightComponent={
									<RadioGroup
										aria-label="Account Type"
										name="payType"
										value={values.payType}
										onChange={handleChange}
										className={classes.radioGroup}
									>
										{
											payTypes.map((item, idx) => (
												<FormControlLabel value={item.node.id} control={<Radio required color="primary"/>} label={item.node.name} />
											))
										}
									</RadioGroup>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.bankName}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="bankName" 
										onChange={handleChange} value={values.bankName} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.bankAccount}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="bankAccount" 
										onChange={handleChange} value={values.bankAccount} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.payee}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="payee" 
										onChange={handleChange} value={values.payee} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.bankBranch}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="bankBranch"
										onChange={handleChange} value={values.bankBranch} required/>
								}
							/>
						</Grid>
					</Paper>
				</Grid>
				<Grid item md={4}>
					<Paper elevation={1} style={{height: 500}}>
						<Typography className={classes.padding} variant="h6">{strings.useRuleConfiguration}</Typography>
						<Divider light={true}/>
						<Grid container spacing={2} direction="column" className={classes.padding}>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.singleMinimumDeposit}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "singleMinimumDeposit" && error ? true : false}
										helperText={errorName === "singleMinimumDeposit" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="singleMinimumDeposit" 
										onChange={numberHandleChange} value={values.singleMinimumDeposit} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.singleMaximumDeposit}:</Typography>
								}
								rightComponent={
									<TextField type="number" variant="outlined" 
									style={{width: "100%"}}
									error={errorName === "singleMaximumDeposit" && error ? true : false}
									helperText={errorName === "singleMaximumDeposit" ? ErrorHandle(error) : null}
									margin="dense" name="singleMaximumDeposit" 
									onChange={numberHandleChange} value={values.singleMaximumDeposit} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.amountPerDaySuspended}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "amountPerDaySuspended" && error ? true : false}
										helperText={errorName === "amountPerDaySuspended" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="amountPerDaySuspended" 
										onChange={numberHandleChange} value={values.amountPerDaySuspended} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.noOfTransactionPerDay}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "noOfTransactionPerDay" && error ? true : false}
										helperText={errorName === "noOfTransactionPerDay" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="noOfTransactionPerDay" 
										onChange={numberHandleChange} value={values.noOfTransactionPerDay} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.proportionOfDepositFee}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "proportionOfDepositFee" && error ? true : false}
										helperText={errorName === "proportionOfDepositFee" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="proportionOfDepositFee"
										onChange={depoFeeHandle} value={values.proportionOfDepositFee} required/>
								}
							/>
							{/* 
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.quickSelectionAmounts}:</Typography>
								}
								rightComponent={
									<TextField 
										error={errorName === "quickSelectionAmount" && error ? true : false}
										helperText={errorName === "quickSelectionAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="quickSelectionAmount"
										onChange={numberHandleChange} value={values.quickSelectionAmount} onKeyUp={handleQuickAmountSelections}
										required/>
								}
							/>
							{values.quickSelectionAmounts.length > 0 && <FormRowCenterItems
								rightContainerProps={{
									style: {
										paddingTop: 0
									}
								}}
								rightComponent={
									values.quickSelectionAmounts.map((o, index) => <Chip className={classes.chip} key={index} label={o} 
											onDelete={() => handleDeleteQuickAmountSelection(index)} variant="outlined"/>)
								}
							/>}<FormRowCenterItems
								isFormGroup={true}
								leftComponent={
									<Typography>{strings.useCompany}:</Typography>
								}
								rightComponent={
									<RadioGroup
										aria-label="Use Company"
										name="useCompany"
										value={values.useCompany}
										onChange={handleChange}
										className={classes.radioGroup}
									>
										{
											["奥亚", "电子", "前台一", "前台二"].map((o, index) => <FormControlLabel key={index} value={o} control={<Radio color="primary"/>} label={o}/>)
										}
									</RadioGroup>
								}
							/> */}
							
							<FormRowCenterItems
								isFormGroup
								leftComponent={
									<Typography style={{marginTop:10}}>{strings.availableMembershipLevel}:</Typography>
								}
								rightComponent={
									// <FormGroup className={classes.checkBoxGroup}>
									// 	{data.memberLevels.edges.map((o ,index) => (
									// 		<FormControlLabel 
									// 			key={index}
									// 			checked={Boolean(values.availableMembershipLevels.find(item => o.node.pk === item))}
									// 			value={o.node.pk}
									// 			label={o.node.name}
									// 			labelPlacement="end"
									// 			control={<Checkbox color="primary"/>}
									// 			onChange={handleChangeMembershipLevels}
									// 			required
									// 		/>
									// 	))}
									// </FormGroup>

									// <div className={classes.root}>
										<FormControl className={classes.checkBoxGroup} style={{width: "100%"}}>
											<InputLabel htmlFor="select-multiple-checkbox"></InputLabel>
											<Select2
													components={{
														ValueContainer
													}}
													hideSelectedOptions={false}
													className="standard"
													placeholder={strings.availableMembershipLevels}
													isMulti
													closeMenuOnSelect={false}
													fullWidth={true} 
													onChange={membershipLevelHandleChange} 
													value={membershipLevel}
													options={
														arrMembershipLevel
													}
													filterOption={createFilter({ignoreAccents: false})}
													style={customStylesReactSelect}
													name={'availableMembershipLevels'}
												/>
										</FormControl>
									// </div>
								}
							/>

							{valuesList.length > 0 && <FormRowCenterItems
								rightComponent={
									valuesList.map((o, index) => <Grid item key={index} className={classes.rule}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item><Typography variant="body2">{strings.rule} {index+1}</Typography></Grid>
												<Grid item>
													{values.selectedUserRule === index &&<IconButton size="small" onClick={handleSaveRule(index)}><SaveOutlined color="primary"/></IconButton>}
													{values.selectedUserRule !== index &&<IconButton size="small" onClick={handleUpdateRule(index)}><EditOutlined color="primary"/></IconButton>}
												</Grid>
												<Grid item><IconButton size="small" onClick={handleDeleteRule(index)}><DeleteOutline color="primary"/></IconButton></Grid>
											</Grid>
									</Grid>)
								}
							/>}
							{/* <FormRowCenterItems
								rightComponent={
									<Button color="primary" variant="contained" onClick={handleAddRule}>{strings.newRule}</Button>
								}
							/> */}
						</Grid>
					</Paper>
				</Grid>
				<Grid item md={4}>
					<Paper elevation={1} style={{height: 500}}>
						<Typography className={classes.padding} variant="h6">{strings.depositOfferSettings}</Typography>
						<Divider light={true}/>
						<Grid container spacing={2} direction="column" className={classes.padding}>
							<FormRowCenterItems
								isFormGroup
								leftComponent={
									<Typography>{strings.depositOffer}:</Typography>
								}
								rightComponent={
									<RadioGroup
										aria-label="Deposit Offer Options"
										name="depositOffer"
										value={values.depositOffer}
										onChange={handleChange}
									>
										<Grid container direction="column">
											<FormControlLabel value="none" control={<Radio required color="primary"/>} label={strings.noDiscount} />
											<FormControlLabel value="first" control={<Radio required color="primary"/>} label={strings.firstDeposit} />
											<FormControlLabel value="every" control={<Radio required color="primary"/>} label={strings.everyDeposit} />
										</Grid>
									</RadioGroup>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.depositAmount}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "depositAmount" && error ? true : false}
										helperText={errorName === "depositAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="depositAmount"
										onChange={numberHandleChange} value={values.depositAmount} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.promotionRatio}:</Typography>
								}
								rightComponent={
									<TextField
										style={{width: "100%"}}
										error={errorName === "promotionRatio" && error ? true : false}
										helperText={errorName === "promotionRatio" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="promotionRatio"
										onChange={numberHandleChange} value={values.promotionRatio} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.offerLimitAmount}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "offerLimitAmount" && error ? true : false}
										helperText={errorName === "offerLimitAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="offerLimitAmount"
										onChange={numberHandleChange} value={values.offerLimitAmount} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.preferentialAuditMultiple}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} type="number" variant="outlined" margin="dense" name="preferentialAuditMultiple"
										onChange={numberHandleChange} value={values.preferentialAuditMultiple} required/>
								}
							/>
							{depositOfferBonus.length > 0 && <FormRowCenterItems
								rightComponent={
									depositOfferBonus.map((o, index) => <Grid item key={index} className={classes.rule}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item><Typography variant="body2">{strings.offer} {index+1}</Typography></Grid>
												<Grid item>
													{depositOfferSettingsList.selectedSettings === index &&<IconButton size="small" onClick={handleSaveSettings(index)}><SaveOutlined color="primary"/></IconButton>}
													{depositOfferSettingsList.selectedSettings !== index &&<IconButton size="small" onClick={handleUpdateSettings(index)}><EditOutlined color="primary"/></IconButton>}
												</Grid>
												<Grid item><IconButton size="small" onClick={handleDeleteSettings(index)}><DeleteOutline color="primary"/></IconButton></Grid>
											</Grid>
									</Grid>)
								}
							/>}
							{/* <FormRowCenterItems
								rightComponent={
									<Button color="primary" variant="contained" onClick={handleAddSettings}>{strings.addOffer}</Button>
								}
							/> */}
						</Grid>
					</Paper>
				</Grid>
				<Grid container justify="center" item spacing={1}>
					<Button variant="contained" disabled={error ? true : false} color="primary" style={{marginRight: 10, width: 150, marginTop: 24}}  type="submit" >{strings.save}</Button>
					<Button variant="outlined" onClick={() => history.goBack()} style={{width: 150, marginTop: 24}}>{strings.return}</Button>
				</Grid>
			</Grid>
	</form>
}