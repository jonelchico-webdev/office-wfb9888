import React, {useState, Fragment} from 'react';
import {ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD} from '../../../paths';
import useLanguages from '../../../hooks/use-languages';
import {Loading} from '../../../components';
import { TextField, Grid, Paper, Typography, Divider,
     Radio, RadioGroup, FormControlLabel, 
	 Checkbox, Button, Chip, IconButton,
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
import useMemberLevels from '../../../queries-graphql/financial-management/member-levels';
import swal from 'sweetalert2';
import usePayTypeQuery from '../../../queries-graphql/financial-management/pay-type-query'
import usePayVendorQuery from '../../../queries-graphql/financial-management/pay-vendor'
import Select2, {createFilter, components} from 'react-select'

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
		flexWrap: "nowrap"
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
		maxWidth: 200,
		maxHeight: 10
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

function usePayType() {
	const {data, loading} = usePayTypeQuery({mutation: true});
	if(loading ) {
		return <Loading/>;
	}
	return data.payType.edges;
}

function usePayVendor() {
	const {data, loading} = usePayVendorQuery({mutation: true});
	if(loading ) {
		return <Loading/>;
	}
	return data.payVendor.edges;
}

export default function OnlineCompanyDepositAccountManagement(props) {
	const {history} = props;
	const strings = useLanguages(ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD);
	const payTypes = usePayType()
	const payVendors = usePayVendor()

    /* ONLINE DEPOSIT */
	const classes = useStyles();
	
	const [memberLevels, setMemberLevel] = useState([])
	let arrMemberLevel = []
	const memberLevelArr = []

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
		availableMembershipLevels: memberLevelArr,
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

	function handleQuickAmountSelections(event) {
		event.persist();
		if(event.keyCode === 13) {
			setValues(oldValues => ({
				...oldValues,
				'quickSelectionAmount': '',
				'quickSelectionAmounts': [...oldValues.quickSelectionAmounts, event.target.value]
			}));
		}
	}
	function handleDeleteQuickAmountSelection(index) {
		setValues(oldValues => ({
			...oldValues,
			'quickSelectionAmounts': oldValues.quickSelectionAmounts.filter((o, i) => i !== index)
		}));
	}

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

	const ADD_BANK_QUERY = gql` 
    mutation($payVendor: ID, 
		$bankAccount: String, 
		$beneficiary: String, 
		$bankBranch: String,
		$payType: ID,
		$businessCode: String,
		$merchantDomainName: String,
		$platformType: String!,
		){
        bank(input:{
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
			merchantDomainName: $merchantDomainName,
			deletedFlag: false
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
			}
        }
    }
	`

	const ADD_DEPOSIT_RULE_QUERY = gql` 
		mutation($bank: ID!, 
			$singleMinDeposit: Int, 
			$singleMaxDeposit: Int, 
			$perDayMaxDepositAmount: Float, 
			$perDayMaxDepositTimes: Int, 
			$depositPercentageFee: Float,
			$depositLevels: [ID],
			){
			depositRule(input:{
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
	const ADD_DEPOSIT_BONUS_QUERY = gql` 
		mutation($bank: ID!, $depositType: String!, $depositAmount: Float, $discountPercentRatio: Float, $maxPromoAmount: Int, $minBetTimesAmount: Int){
			depositBonus(input:{
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

	const [bank] = useMutation(ADD_BANK_QUERY)
	const [depositRule] = useMutation(ADD_DEPOSIT_RULE_QUERY)
	const [depositBonus] = useMutation(ADD_DEPOSIT_BONUS_QUERY)
	const [dataMutate, setData] = useState(null)
		
	async function mutateAdd(allData) {
		let memberLevel = [];
		memberLevels.map((item, idx) => (
			memberLevel.push(item.pk)
		))

		try{
			const res = await bank({
				variables: {
					payVendor: allData.bankName, 
					bankAccount: allData.bankAccount, 
					beneficiary: allData.payee, 
					bankBranch: allData.bankBranch,
					payType: allData.paymentType,
					platformType: allData.usingTerminal,
					businessCode: allData.businessNumber,
					merchantDomainName: allData.businessDomain,
				}
			})
			if (res.data) {
				setData(res.data);
				// console.log(res.data)

				await depositRule({
					variables: {
						bank: res.data.bank.bank.id,
						singleMinDeposit: allData.singleMinimumDeposit,
						singleMaxDeposit: allData.singleMaximumDeposit,
						perDayMaxDepositAmount: allData.amountPerDaySuspended,
						perDayMaxDepositTimes: allData.noOfTransactionPerDay,
						depositPercentageFee: allData.proportionOfDepositFee,
						depositLevels: memberLevel,
					}
				})

				await depositBonus({
					variables: {
						bank: res.data.bank.bank.id,
						depositType: allData.depositOffer,
						depositAmount: allData.depositAmount,
						discountPercentRatio: allData.promotionRatio,
						maxPromoAmount: allData.offerLimitAmount,
						minBetTimesAmount: allData.preferentialAuditMultiple,
					}
				})

			} else {
			// setError(JSON.stringify(res.errors, Object.getOwnPropertyNames(res.errors))))
				// console.log(res)
			}
			swal.fire({
				position: 'center',
				type: 'success',
				title: '添加了新的支付平台',
				showConfirmButton: false,
				timer: 1500
			})
		} catch (e){
			// setError(e)
		}
		history.push(ONLINE_PAYMENT_PLATFORM_MANAGEMENT)			
	}

	function submitHandler(event) {
		event.preventDefault();
		mutateAdd(values);
	}

	const {data, loading} = useMemberLevels({ first: 100 });
	if(loading) {  
		return <Loading/>;
	}
	const memberLevel = data.memberLevels.edges; 
	
	if(memberLevel) {
        memberLevel.map(o => {
            arrMemberLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
	}
	
	if(memberLevels) {
		memberLevels.map(o => {
			memberLevelArr.push(o.pk)
		})
	}

	return <Fragment>
        <Grid container spacing={2} className={classes.container}>
                <form onSubmit={submitHandler} style={{width:"100%"}} autoComplete="off">
                    <Title pageTitle={strings.addDepositAccount} />
                    <Grid container direction="row" spacing={2} className={classes.container}>
                       
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
												value={values.bankname}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{/* {
													["微笑支付", "环迅支付", "熊猫支付"].map((o, index) => <FormControlLabel key={index} value={o} control={<Radio required color="primary"/>} label={o} />)
												} */}
												{
													payVendors.length !== undefined ?
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
												value={values.bankname}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{/* {
													["ALIPAY", "微信"].map((o, index) => <FormControlLabel key={index} value={o.toLowerCase()} control={<Radio required color="primary"/>} label={o} />)
												} */}
												{
													payTypes.length !== undefined ?
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
												value={values.usingTerminal}
												onChange={handleChange}
												className={classes.radioGroup}
											>
												{
													["ALL", "MOBILE"].map((o, index) => <FormControlLabel key={index} value={o.toLowerCase()} control={<Radio required color="primary"/>} label={o} />)
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
												onChange={handleChange} error={error.businessNumber} value={values.businessNumber} required/>
										}
									/>
									{/* <FormRowCenterItems 
										leftComponent={
											<Typography>{strings.merchantCertificate}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="merchantCertificate" 
												onChange={handleChange} error={error.merchantCertificate} helperText={helpText.merchantCertificate} value={values.merchantCertificate} required/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.merchantKey}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="merchantKey" 
												onChange={handleChange} error={error.merchantKey} helperText={helpText.merchantKey} value={values.merchantKey} required/>
										}
									/> */}
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.businessDomain}:</Typography>
										}
										rightComponent={
											<TextField variant="outlined" margin="dense" name="businessDomain" 
												onChange={handleChange} error={error.businessDomain} value={values.businessDomain} required/>
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
											<TextField type="number" variant="outlined" margin="dense" name="singleMinimumDeposit" 
												onChange={handleChange} error={error.singleMinimumDeposit} value={values.singleMinimumDeposit} required/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.singleMaximumDeposit}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="singleMaximumDeposit" 
												onChange={handleChange} error={error.singleMaximumDeposit} value={values.singleMaximumDeposit} required/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.amountPerDaySuspended}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="amountPerDaySuspended" 
												onChange={handleChange} error={error.amountPerDaySuspended} value={values.amountPerDaySuspended} required/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.noOfTransactionPerDay}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="noOfTransactionPerDay" 
												onChange={handleChange} error={error.noOfTransactionPerDay} value={values.noOfTransactionPerDay} required/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.proportionOfDepositFee}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="proportionOfDepositFee"
												onChange={handleChange} error={error.proportionOfDepositFee} helperText={helpText.proportionOfDepositFee} value={values.proportionOfDepositFee} required/>
										}
									/>
									<FormRowCenterItems
										leftComponent={
											<Typography>{strings.quickSelectionAmounts}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="quickSelectionAmount"
												onChange={handleChange} error={error.quickSelectionAmount} value={values.quickSelectionAmount} onKeyUp={handleQuickAmountSelections}
											/>
										}
									/>
									{values.quickSelectionAmountsArray.length > 0 && <FormRowCenterItems
										rightContainerProps={{
											style: {
												paddingTop: 0
											}
										}}
										rightComponent={
											values.quickSelectionAmounts.map((o, index) => <Chip className={classes.chip} key={index} label={o} 
													onDelete={() => handleDeleteQuickAmountSelection(index)} variant="outlined"/>)
										}
									/>}
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
											<Typography style={{ marginTop: "1.2rem" }}>{strings.availableMembershipLevel}:</Typography>
										}
										rightComponent={
											<div className={classes.root}>
												<FormControl className={classes.formControl}>
													<InputLabel htmlFor="select-multiple-checkbox">
														<em>{strings.availableMembershipLevels}</em>
													</InputLabel>
													{/* <Select
														multiple
														value={values.availableMembershipLevels}
														onChange={handleChange}
														input={<Input id="select-multiple-checkbox"/>}
														renderValue={selected => selected.join(', ')}
														MenuProps={MenuProps}
														name={'availableMembershipLevels'}
													>
													{
														memberLevel.map((o, index) => {
														return <MenuItem key={index} value={o.node.pk.toString()}>
															<Checkbox checked={Boolean(values.availableMembershipLevels.find((level) => { return level == o.node.pk ? true : false }))} />
															<ListItemText primary={o.node.name} />
														</MenuItem>
													})}
													</Select> */}
													{/* <Select2
														components={{
															ValueContainer
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
												value={values.depositOffer}
												onChange={handleChange}
												error={error} helperText={helpText}
											>
												<Grid container direction="column">
													<FormControlLabel value="none" control={<Radio color="primary"/>} label={strings.noDiscount} />
													<FormControlLabel value="first" control={<Radio color="primary"/>} label={strings.firstDeposit} />
													<FormControlLabel value="every" control={<Radio color="primary"/>} label={strings.everyDeposit} />
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
												onChange={handleChange} error={error.depositAmount} value={values.depositAmount} required/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.promotionRatio}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="promotionRatio"
												onChange={handleChange} value={values.promotionRatio} error={error.promotionRatio} helperText={helpText.promotionRatio} required/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.offerLimitAmount}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="offerLimitAmount"
												onChange={handleChange} value={values.offerLimitAmount} required/>
										}
									/>
									<FormRowCenterItems 
										leftComponent={
											<Typography>{strings.preferentialAuditMultiple}:</Typography>
										}
										rightComponent={
											<TextField type="number" variant="outlined" margin="dense" name="preferentialAuditMultiple"
												onChange={handleChange} value={values.preferentialAuditMultiple} required/>
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
						<Button variant="contained" color="primary" style={{marginRight: 10, width: 150, marginTop: 24}} type="submit" >{strings.save}</Button>
						<Button variant="outlined" style={{width: 150, marginTop: 24}} onClick={() => history.goBack()}>{strings.return}</Button>
					</Grid>

                </form>

        </Grid>
    </Fragment>
}