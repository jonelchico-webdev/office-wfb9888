import React, {useState, Fragment} from 'react';
import {ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD} from '../../../paths';
import useLanguages from '../../../hooks/use-languages';
import { TextField, Grid, Paper, Typography, Divider,
	Radio, RadioGroup, FormControlLabel, 
	Checkbox, Button, IconButton,
	FormControl, InputLabel, Select, ListItemText,
	Input, MenuItem
   } from '@material-ui/core';
import {EditOutlined, DeleteOutline, SaveOutlined} from '@material-ui/icons';
import {makeStyles} from '@material-ui/styles';
import {FormRowCenterItems} from '../../../components/form-layouts';
import Title from '../../../components/title';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import {ONLINE_PAYMENT_PLATFORM_MANAGEMENT} from '../../../paths'
import useOnlinePaymentPlatform from '../../../queries-graphql/financial-management/online-payment-platform';
import useMemberLevels from '../../../queries-graphql/financial-management/member-levels';
import { ADD_DEPOSIT_RULE_ID, ADD_DEPOSIT_BONUS_ID } from '../../../queries-graphql/financial-management/bank-query'
import swal from 'sweetalert2';
import usePayTypeQuery from '../../../queries-graphql/financial-management/pay-type-query'
import {Loading} from '../../../components';
import usePayVendorQuery from '../../../queries-graphql/financial-management/pay-vendor'
import Select2, {createFilter, components} from 'react-select'

const multiValueContainer = ({ selectProps, data }) => {
    const label = data.label;
    const allSelected = selectProps.value;
    const index = allSelected.findIndex(selected => selected.label === label);
    const isLastSelected = index === allSelected.length - 1;
    const labelSuffix = isLastSelected ? ` (${allSelected.length})` : ", ";
    const val = `${label}${labelSuffix}`;
    return val;
};

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

const useStyles = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2)
	},
	container: {
		flexWrap: "nowrap",
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
		maxHeight: 155
	},
	checkBoxGroup: {
		...theme.layout.checkBoxGroup
	},
	paper: {
		padding: theme.spacing(2)
	},
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 170,
		maxWidth: 270,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
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

const customReactSelectStyle = {
	valueContainer: (provided, state) => ({
		...provided,
		textOverflow: "ellipsis",
		maxWidth: "90%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		display: "initial"
	})
}

function usePayType() {
	const {data, loading} = usePayTypeQuery({mutation: true});
	if(loading ) {
		return <Loading/>;
	}
	var payType = data.payType.edges
	return payType;
}

function usePayVendor() {
	const {data, loading} = usePayVendorQuery({mutation: true});
	if(loading ) {
		return <Loading/>;
	}
	var payVendor = data.payVendor.edges
	return payVendor;
}

function useData(){
	const {data, loading} = useMemberLevels({first: 100});
	if(loading) {  
		return null;
	}
	var memberLevel =  data.memberLevels.edges; 
	return memberLevel;
}

export default function UpdateCompanyDepositAccountManagement(props) {
	const {history} = props;
	const strings = useLanguages(ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD);
	const payVendors = usePayVendor()
	const payTypes = usePayType()

	const id = history.location.pathname.split('/', 5)[4];

	const memberLevel = useData();

	const classes = useStyles();
	const bankID = history.location.pathname.split("/", 5)[4];

	const [memberLevels, setMemberLevel] = useState([])
	let arrMemberLevel = []

	const memberLevelHandleChange = memberLevels => {
		setMemberLevel(memberLevels)
	}

	const [values, setValues] = useState({
		accountType: 'bankCard',
		bankName: '',
		bankAccount: '',
		paymentType: '',
		businessNumber: '',
		merchantCertificate: '',
		merchantKey: '',
		businessDomain:'',	
		payee: '',
		bankBranch: '',
		quickSelectionAmount: null,
		quickSelectionAmounts: null,
		availableMembershipLevels: [],
		quickSelectionAmountsArray: [],
		singleMinimumDeposit: null,
		singleMaximumDeposit: null,
		amountPerDaySuspended: null,
		noOfTransactionPerDay: null,
		proportionOfDepositFee: null,
		depositOffer: '',
		depositAmount: null,
		promotionRatio: null,
		offerLimitAmount: null,
		preferentialAuditMultiple: null,
		selectedSettings: '',
		usingTerminal: '',					
		selectedUserRule: '',	
	});
	
	const [error, setError] = useState({})
	const [helpText, setHelpText] = useState({})

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));

		if (event.target.value.length <= 2) {
			setError(oldError => ({
				...oldError,
				[event.target.name]: false
			}))
			setHelpText(oldHelpText => ({
				...oldHelpText,
				[event.target.name]: null
			}))
		} else {
			setError(oldError => ({
				...oldError,
				[event.target.name]: true
			}))
			setHelpText(oldHelpText => ({
				...oldHelpText,
				[event.target.name]: `${event.target.name} must be not more than 99%.`
			}))
		}
	}

	const [valuesList, setValuesList] = useState([]);

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

	function handleDeleteSettings(index) {
		return () => setValuesList(oldValuesList => oldValuesList.filter((o, i) => i !== index));
	}
	function handleUpdateSettings(index) {
		return () => setValues({...valuesList[index], selectedSettings: index});
	}
	function handleSaveSettings(index) {
		return () => setValuesList(oldValuesList => oldValuesList.map((o, i) => {
			if(i === index) {
				return values;
			}
			return o;
		}))
	}

	const UPDATE_BANK_QUERY = gql` 
	mutation(
		$id: ID,
		$payVendor: ID, 
		$bankAccount: String, 
		$beneficiary: String, 
		$bankBranch: String,
		$payType: ID,
		$businessCode: String,
		$merchantDomainName: String,
		$platformType: String!,
		){
		bank(input:{
			id: $id
			depositType:"online"
			transactionType:"deposit"
			accountType: "bank_card"
			payVendor: $payVendor
			bankAccount: $bankAccount
			beneficiary: $beneficiary
			bankBranch: $bankBranch
			platformType: $platformType
			payType: $payType,
			businessCode: $businessCode,
			merchantDomainName: $merchantDomainName
		}) {
			clientMutationId
			errors{
				field
				messages
			}
			bank{
				pk
				id
				bankName
				businessCode
			}
		}
	}
	`

	const UPDATE_DEPOSIT_RULE_QUERY = gql` 
		mutation($id: ID!, $bank: ID!, $singleMinDeposit: Int, $singleMaxDeposit: Int, $perDayMaxDepositAmount: Float, $perDayMaxDepositTimes: Int, $depositPercentageFee: Float, $depositLevels: [ID],){
			depositRule(input:{
				id: $id
				bank: $bank
				singleMinDeposit: $singleMinDeposit
				singleMaxDeposit: $singleMaxDeposit
				perDayMaxDepositAmount: $perDayMaxDepositAmount
				perDayMaxDepositTimes: $perDayMaxDepositTimes
				depositPercentageFee: $depositPercentageFee
				depositLevels: $depositLevels
			}) {
				clientMutationId
				errors{
					field
					messages
				}
				depositRule{
					pk
					id
				}
			}
		}
	`
	const UPDATE_DEPOSIT_BONUS_QUERY = gql` 
		mutation($id: ID!, $bank: ID!, $depositType: String!, $depositAmount: Float, $discountPercentRatio: Float, $maxPromoAmount: Int, $minBetTimesAmount: Int){
			depositBonus(input:{
				id: $id
				bank: $bank
				depositType: $depositType
				depositAmount: $depositAmount
				discountPercentRatio: $discountPercentRatio
				maxPromoAmount: $maxPromoAmount
				minBetTimesAmount: $minBetTimesAmount
			}) {
				clientMutationId
				errors{
					field
					messages
				}
				depositBonus{
					pk
					id
				}
			}
		}
	`

	const [bank] = useMutation(UPDATE_BANK_QUERY)
	const [depositRule] = useMutation(UPDATE_DEPOSIT_RULE_QUERY)
	const [depositRuleId] = useMutation(ADD_DEPOSIT_RULE_ID)
	const [depositBonus] = useMutation(UPDATE_DEPOSIT_BONUS_QUERY)
	const [depositBonusId] = useMutation(ADD_DEPOSIT_BONUS_ID)

	async function mutateAdd(allData) {
		let memberLevel = [];
		memberLevels.map((item, idx) => (
			memberLevel.push(parseInt(item.pk))
		))

		let bankName = allData.bankName == '' ? depositAccounts.node.payVendor.id : allData.bankName
		let paymentType = allData.paymentType == '' ? depositAccounts.node.payType.id : allData.paymentType
		let usingTerminal = allData.usingTerminal == '' ? depositAccounts.node.platformType.toLowerCase() : allData.usingTerminal
		let businessNumber = allData.businessNumber == '' ? depositAccounts.node.businessCode : allData.businessNumber
		// let merchantCertificate = allData.merchantCertificate == '' ? depositAccounts.node.merchantCertificate : allData.merchantCertificate
		// let merchantKey = allData.merchantKey == '' ? depositAccounts.node.merchantKey : allData.merchantKey
		let businessDomain = allData.businessDomain == '' ? depositAccounts.node.merchantDomainName : allData.businessDomain
		
		let singleMinimumDeposit = allData.singleMinimumDeposit == null ? depositAccounts.node.bankRule.edges[0].node.singleMinDeposit : allData.singleMinimumDeposit
		let singleMaximumDeposit = allData.singleMaximumDeposit == null ? depositAccounts.node.bankRule.edges[0].node.singleMaxDeposit : allData.singleMaximumDeposit
		let amountPerDaySuspended = allData.amountPerDaySuspended == null ? depositAccounts.node.bankRule.edges[0].node.perDayMaxDepositAmount : allData.amountPerDaySuspended
		let noOfTransactionPerDay = allData.noOfTransactionPerDay == null ? depositAccounts.node.bankRule.edges[0].node.perDayMaxDepositTimes : allData.noOfTransactionPerDay
		let proportionOfDepositFee = allData.proportionOfDepositFee == null ? depositAccounts.node.bankRule.edges[0].node.depositPercentageFee : allData.proportionOfDepositFee
		
		let depositOffer = allData.depositOffer == '' ? depositAccounts.node.bankBonus.edges[0].node.depositType.toLowerCase() : allData.depositOffer
		let depositAmount = allData.depositAmount == null ? depositAccounts.node.bankBonus.edges[0].node.depositAmount : allData.depositAmount
		let promotionRatio = allData.promotionRatio == null ? depositAccounts.node.bankBonus.edges[0].node.discountPercentRatio : allData.promotionRatio
		let offerLimitAmount = allData.offerLimitAmount == null ? depositAccounts.node.bankBonus.edges[0].node.maxPromoAmount : allData.offerLimitAmount
		let preferentialAuditMultiple = allData.preferentialAuditMultiple == null ? depositAccounts.node.bankBonus.edges[0].node.minBetTimesAmount : allData.preferentialAuditMultiple

		try{
			const res = await bank({
				variables: {
					id: bankID,
					payVendor: bankName, 
					bankAccount: allData.bankAccount, 
					beneficiary: allData.payee, 
					bankBranch: allData.bankBranch,
					payType: paymentType,
					platformType: usingTerminal,
					businessCode: businessNumber,
					merchantDomainName: businessDomain,
				}
			}) 

			if (depositAccounts.node.bankRule.edges.length > 0) {
				depositRule({
					variables: {
						id: depositAccounts.node.bankRule.edges[0].node.id,
						bank: id,
						singleMinDeposit: singleMinimumDeposit,
						singleMaxDeposit: singleMaximumDeposit,
						perDayMaxDepositAmount: amountPerDaySuspended,
						perDayMaxDepositTimes: noOfTransactionPerDay,
						depositPercentageFee: proportionOfDepositFee,
						depositLevels: memberLevel,
					}
				})
			} else {
				depositRuleId({
					variables: {
						bank: id,
						singleMinDeposit: singleMinimumDeposit,
						singleMaxDeposit: singleMaximumDeposit,
						perDayMaxDepositAmount: amountPerDaySuspended,
						perDayMaxDepositTimes: noOfTransactionPerDay,
						depositPercentageFee: proportionOfDepositFee,
						depositLevels: memberLevel,
					}
				})
			}

			if (depositAccounts.node.bankBonus.edges.length > 0) {
				depositBonus({
					variables: {
						id: depositAccounts.node.bankBonus.edges[0].node.id,
						bank: id,
						depositType: depositOffer,
						depositAmount: depositAmount,
						discountPercentRatio: promotionRatio,
						maxPromoAmount: offerLimitAmount,
						minBetTimesAmount: preferentialAuditMultiple,
					}
				})
			} else {
				depositBonusId({
					variables: {
						bank: id,
						depositType: depositOffer,
						depositAmount: depositAmount,
						discountPercentRatio: promotionRatio,
						maxPromoAmount: offerLimitAmount,
						minBetTimesAmount: preferentialAuditMultiple,
					}
				})
			}
			swal.fire({
				position: 'center',
				type: 'success',
				title: strings.successPrompt,
				showConfirmButton: false,
				timer: 1500
			})
		} catch (e){
			// setError(e)
		}
		history.push(ONLINE_PAYMENT_PLATFORM_MANAGEMENT)		
	}

    const {data, loading} = useOnlinePaymentPlatform({depositType: "online", id: id, deletedFlag: false});
    if(loading) {
        return <Loading/>;
	}
    
    const depositAccounts = data.banks.edges[0];

	var CheckBoxArray = []
	
	if(depositAccounts) {
		if(depositAccounts.node.bankRule !== null) {
			depositAccounts.node.bankRule.edges.map((bankData) => 
				CheckBoxArray = bankData.node.depositLevels.edges
			)
			// CheckBoxArray = depositAccounts.node.bankRule.edges[0].node.depositLevels.edges
		}
	}
	
	{
		if(values.availableMembershipLevels.length === 0 ) {
			CheckBoxArray.map((o, idx) => (
				values.availableMembershipLevels.push(o.node.pk.toString())
			))
		}
	}

	function submitHandler(event) {
		event.preventDefault();
		mutateAdd(values);
	}

	if(memberLevel) {
        memberLevel.map(o => {
            arrMemberLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
	}
	
	// if(CheckBoxArray.length > 0 && memberLevels ? memberLevels.length === 0 ? true : false : false) {
	// 	CheckBoxArray.map(o => {
	// 		setMemberLevel(memberLevels =>
    //             [
    //                 ...memberLevels,
    //                 {value: o.node.id, label: o.node.name, pk: o.node.pk}
    //             ]
    //         )
	// 	})
	// }

	return <Fragment>
        <Grid container spacing={2}>
                <form onSubmit={submitHandler} style={{width:"100%"}} autoComplete="off">
                    <Title pageTitle={strings.addDepositAccount} />
                    <Grid container direction="row" spacing={2} >
                       
					    <Grid item md={4}>
							<Paper elevation={1} style={{width: "100%", height: 650}}>
								<Title pageTitle={strings.addDepositAccount} />
								<Typography className={classes.padding} variant="h6">{strings.depositAccountInformation}</Typography>
								<Divider light={true}/>
								<Grid container spacing={1} direction="column" className={classes.padding} alignItems="center">
									<FormRowCenterItems
										containerProps={{
											alignItems: 'flex-start'
										}}
										leftComponent={
											<Typography>{strings.businessName}:</Typography>
										}
										rightContainerProps={{
											style:{
												paddingTop: 0
											}
										}}
										rightComponent={
											<RadioGroup
												aria-label="Business Name"
												name="bankName"
												// defaultValue={depositAccounts.node.bankName}
												defaultValue={depositAccounts.node.payVendor.id}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{
													payVendors !== undefined && payVendors.length > 0 ?
													payVendors.map((item, idx) => (
														<FormControlLabel value={item.node.id} control={<Radio required color="primary"/>} label={item.node.name} />
													))
													:
													null
												}
											</RadioGroup>
										}
									/>
									<FormRowCenterItems
										containerProps={{
											alignItems: 'flex-start'
										}}
										leftComponent={
											<Typography>{strings.paymentTypes}:</Typography>
										}
										rightContainerProps={{
											style:{
												paddingTop: 0
											}
										}}
										rightComponent={
											<RadioGroup
												aria-label="Business Name"
												name="paymentType"
												// defaultValue={depositAccounts.node.paymentType ? depositAccounts.node.paymentType.toLowerCase() : null}
												defaultValue={depositAccounts.node.payType.id}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{/* {
													["ALIPAY", "微信"].map((o, index) => <FormControlLabel required key={index} value={o.toLowerCase()} control={<Radio color="primary"/>} label={o} />)
												} */}

												{
													payTypes !== undefined && payTypes.length > 0 ?
													payTypes.map((item, idx) => (
														<FormControlLabel value={item.node.id} control={<Radio required color="primary"/>} label={item.node.name} />
													))
													:
													null
												}
											</RadioGroup>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.usingTerminal}:</Typography>
										}
										rightComponent={
											<RadioGroup
												aria-label="Using Terminal"
												name="usingTerminal"
												defaultValue={depositAccounts.node.platformType.toLowerCase()}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{
													["ALL", "MOBILE"].map((o, index) => <FormControlLabel required key={index} value={o.toLowerCase()} control={<Radio color="primary"/>} label={o} />)
												}
											</RadioGroup>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.businessNumber}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="businessNumber" 
												onChange={handleChange}  defaultValue={depositAccounts.node.businessCode} required/>
										}
									/>
									{/* <FormRowCenterItems 
										leftComponent={
											<Typography>{strings.merchantCertificate}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="merchantCertificate" 
												onChange={handleChange} defaultValue={depositAccounts.node.merchantCertificate}/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.merchantKey}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="merchantKey" 
												onChange={handleChange} defaultValue={depositAccounts.node.merchantKey}/>
										}
									/> */}
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.businessDomain}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="businessDomain" 
												onChange={handleChange} defaultValue={depositAccounts.node.merchantDomainName} required/>
										}
									/>
								</Grid>
							</Paper>
                        </Grid>

                        <Grid item md={4}>
                            <Paper elevation={1} style={{width: "100%", height: 650}}>
								<Typography className={classes.padding} variant="h6">{strings.userRuleConfiguration}</Typography>
								<Divider light={true}/>
								<Grid container spacing={2} direction="column" className={classes.padding}>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.singleMinimumDeposit}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="singleMinimumDeposit" 
												onChange={handleChange} required defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.bankRule.edges[0].node.singleMinDeposit : ''}/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.singleMaximumDeposit}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="singleMaximumDeposit" 
												onChange={handleChange} required defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.bankRule.edges[0].node.singleMaxDeposit : ''}/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.amountPerDaySuspended}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="amountPerDaySuspended" 
												onChange={handleChange} required defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.bankRule.edges[0].node.perDayMaxDepositAmount : ''}/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.noOfTransactionPerDay}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="noOfTransactionPerDay" 
												onChange={handleChange} required defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.bankRule.edges[0].node.perDayMaxDepositTimes : ''}/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.proportionOfDepositFee}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="proportionOfDepositFee"
												onChange={handleChange} required error={error.proportionOfDepositFee} helperText={helpText.proportionOfDepositFee} defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.bankRule.edges[0].node.depositPercentageFee : ''}/>
										}
									/>
									{/* <FormRowCenterItems
										leftComponent={
											<Typography>{strings.quickSelectionAmounts}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="quickSelectionAmount"
												onChange={handleChange} defaultValue={depositAccounts.node.bankRule.edges.length > 0 ? depositAccounts.node.quickSelectionAmount : ''} onKeyUp={handleQuickAmountSelections}
											/>
										}
									/> */}
									{/* {values.quickSelectionAmounts > 0 && <FormRowCenterItems
										rightContainerProps={{
											style: {
												paddingTop: 0
											}
										}}
										rightComponent={
											values.quickSelectionAmounts.map((o, index) => <Chip className={classes.chip} key={index} label={o} 
													onDelete={() => handleDeleteQuickAmountSelection(index)} variant="outlined"/>)
										}
									/>} */}
									{/* <FormRowCenterItems
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
												className={classes.checkBoxGroup}
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
											<Typography>{strings.availableMembershipLevel}:</Typography>
										}
										// rightComponent={
										// 	<FormGroup className={classes.checkBoxGroup}>
										// 		{memberLevel.map((o ,index) => (
										// 			<FormControlLabel 
										// 				key={index}
										// 				// checked={Boolean(values.availableMembershipLevels.find(item => o.node.pk === item))}
										// 				checked={
										// 					Boolean(values.availableMembershipLevels.find((level) => { return level == o.node.pk ? true : false }))
										// 				}
										// 				value={o.node.pk}
										// 				label={o.node.name}
										// 				labelPlacement="end"
										// 				control={<Checkbox color="primary"/>}
										// 				onChange={handleChangeMembershipLevels}
										// 			/>
										// 		))}
										// 	</FormGroup>
										// }
										rightComponent={
											<div className={classes.root}>
												<FormControl className={classes.formControl}>
													<InputLabel htmlFor="select-multiple-checkbox"><em>{strings.availableMembershipLevels}</em></InputLabel>
													{/* <Select
														multiple
														value={values.availableMembershipLevels}
														onChange={handleChange}
														input={<Input id="select-multiple-checkbox"/>}
														renderValue={selected => selected.join(', ')}
														MenuProps={MenuProps}
														name='availableMembershipLevels'
													>
													{
														memberLevel ?
														memberLevel.map((o, index) => {
															return <MenuItem key={index} value={o.node.pk.toString()}>
																<Checkbox 
																	checked={Boolean(values.availableMembershipLevels.find((level) => { return level == o.node.pk ? true : false }))} />
																<ListItemText primary={o.node.name} />
															</MenuItem>
														})
														:
														null
													}
													</Select> */}
													{/* <Select2
														components={{
															MultiValueContainer: multiValueContainer
														}}
													 	className="standard"
													 	placeholder={strings.availableMembershipLevels}
													 	isMulti
													 	closeMenuOnSelect={false}
													 	fullWidth={true} 
													 	onChange={memberLevelHandleChange} 
													 	value={memberLevels}
													 	options={
													 		arrMemberLevel
													 	}
														filterOption={createFilter({ignoreAccents: false})}
														styles={customReactSelectStyle}
														style={{ width: 250 }}
														isSearchable={false}
														hideSelectedOptions={false}
													/> */}
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
														onChange={memberLevelHandleChange} 
														value={memberLevels}
														options={
															arrMemberLevel
														}
														filterOption={createFilter({ignoreAccents: false})}
														name={'availableMembershipLevels'}
													/>
												</FormControl>
											</div>
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
							<Paper elevation={1} style={{width: "100%", height: 650}}>
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
												defaultValue={depositAccounts.node.bankBonus.edges.length > 0 ? depositAccounts.node.bankBonus.edges[0].node.depositType.toLowerCase() : ''}
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
											<TextField type="number" variant="outlined" margin="dense" name="depositAmount"
												onChange={handleChange} required defaultValue={depositAccounts.node.bankBonus.edges.length > 0 ? depositAccounts.node.bankBonus.edges[0].node.depositAmount : ''}/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.promotionRatio}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="promotionRatio"
												onChange={handleChange} required defaultValue={depositAccounts.node.bankBonus.edges.length > 0 ? depositAccounts.node.bankBonus.edges[0].node.discountPercentRatio : ''} error={error.promotionRatio} helperText={helpText.promotionRatio}/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.offerLimitAmount}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="offerLimitAmount"
												onChange={handleChange} required defaultValue={depositAccounts.node.bankBonus.edges.length > 0 ? depositAccounts.node.bankBonus.edges[0].node.maxPromoAmount : ''}/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.preferentialAuditMultiple}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="preferentialAuditMultiple"
												onChange={handleChange} required defaultValue={depositAccounts.node.bankBonus.edges.length > 0 ? depositAccounts.node.bankBonus.edges[0].node.minBetTimesAmount : ''}/>
										}
									/>
									{valuesList.length > 0 && <FormRowCenterItems
										rightComponent={
											valuesList.map((o, index) => <Grid item key={index} className={classes.rule}>
													<Grid container alignItems="center" spacing={1}>
														<Grid item><Typography variant="body2">{strings.plan} {index+1}</Typography></Grid>
														<Grid item>
															{values.selectedSettings === index &&<IconButton size="small" onClick={handleSaveSettings(index)}><SaveOutlined color="primary"/></IconButton>}
															{values.selectedSettings !== index &&<IconButton size="small" onClick={handleUpdateSettings(index)}><EditOutlined color="primary"/></IconButton>}
														</Grid>
														<Grid item><IconButton size="small" onClick={handleDeleteSettings(index)}><DeleteOutline color="primary"/></IconButton></Grid>
													</Grid>
											</Grid>)
										}
									/>}
									{/* <FormRowCenterItems
										rightComponent={
											<Button color="primary" variant="contained" onClick={handleAddSettings}>{strings.newPlan}</Button>
										}
									/> */}
								</Grid>
							</Paper>
						</Grid>

                    </Grid>

					<Grid container justify="center" item spacing={1}>
					<Button variant="contained" color="primary" style={{marginRight: 10, width: 150, marginTop: 24}} type="submit">{strings.save}</Button>
					<Button variant="outlined" style={{width: 150, marginTop: 24}} onClick={() => history.goBack()}>{strings.return}</Button>
					</Grid>

                </form>
            
				
            {/* <Grid item md={6}>
            	<Grid container direction="column" spacing={1}>
                    <Grid item container justify="flex-end">
                        <Grid item md={4}>
                           
                        </Grid>
                    </Grid>
                    <Grid item container justify="flex-end">
                        <Grid item md={4}>
                            
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    </Fragment>
}