import React, {useState, Fragment} from 'react';
import {COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT} from '../../../paths';
import useLanguages from '../../../hooks/use-languages';
import { TextField, Grid, Paper, Typography, Divider, Radio, RadioGroup, FormControlLabel, Checkbox, 
	Button, IconButton, FormControl, InputLabel, Select, ListItemText,
	Input, MenuItem
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FormRowCenterItems} from '../../../components/form-layouts';
import Title from '../../../components/title';
import {EditOutlined, DeleteOutline, SaveOutlined, Error} from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks'
import Swal from 'sweetalert2'
import Select2, {createFilter, components} from 'react-select'
import {Loading} from '../../../components';
import useBankQuery, { ADD_BANK_QUERY, ADD_DEPOSIT_BONUS_QUERY, ADD_DEPOSIT_RULE_QUERY, ADD_DEPOSIT_RULE_ID, ADD_DEPOSIT_BONUS_ID } from '../../../queries-graphql/financial-management/bank-query'
import useMemberLevelQuery from '../../../queries-graphql/financial-management/member-levels'
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


const customStylesReactSelect = {
    control: (base, state) => ({
      ...base,
      height: '34px',
      'min-height': '34px',
    }),
};

export const USER_RULE_FORM_INITIAL_STATE = {
	singleMinimumDeposit: '',
	singleMaxDeposit: '',
	perDayMaxDepositAmount: '',
	perDayMaxDepositTimes: '',
	depositPercentageFee: '',
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

function useMemberLevels() {
	const {data, loading} = useMemberLevelQuery({mutation: true});
	if(loading ) {
		return null;
	}
	return data.memberLevels.edges;
}

export default function CompanyDepositAccountManagementForm(props) {
    const strings = useLanguages(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD);
	const classes = useStyles();
	const {history} = props;

	const memberLevels = useMemberLevels()

	// const {handleChange, values, setValues, valuesList, setValuesList} = props;
	const bankID = history.location.pathname.split("/", 5)[4];
	const [valuesList, setValuesList] = useState([]);
	const [depositTypeBonus, setdepositTypeBonus] = useState([]);
	const payTypes = usePayType()
	const [membershipLevel, setMembershipLevel] = useState([])
	let arrMembershipLevel = []
	const membershipLevelArr = []

	const [values, setValues] = useState({
		payType: '',
		bankName: '',
		bankAccount: '',
		beneficiary: '',
		bankBranch: '',
		quickSelectionAmount: '',
		availableMembershipLevels: [],
		quickSelectionAmounts: [],
		paymentTypes: [],
		singleMinimumDeposit: null,
		singleMaxDeposit: null,
		perDayMaxDepositAmount: null,
		perDayMaxDepositTimes: null,
		depositPercentageFee: null,
		depositType: '',
		depositAmount: null,
		discountPercentRatio: null,
		maxPromoAmount: null,
		minBetTimesAmount: null,
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

	const handleChange = (event) => {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
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
	// 	singleMaxDeposit: '',
	// 	perDayMaxDepositAmount: '',
	// 	perDayMaxDepositTimes: '',
	// 	depositPercentageFee: '',
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

	// const [setdepositTypeSettingsValues] = useState({
	// 	depositType: 'noDiscount',
	// 	depositAmount: '',
	// 	discountPercentRatio: '',
	// 	maxPromoAmount: '',
	// 	minBetTimesAmount: '',
	// 	selectedSettings: ''
	// });

	const [depositTypeSettingsList, setdepositTypeSettingsList] = useState([]);
	
	// const handleDespositSettingsChange = (event) => {
	// 	event.persist();
	// 	setdepositTypeSettingsValues(oldValues => ({
	// 		...oldValues,
	// 		[event.target.name]: event.target.value,
	// 	}));
	// }

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
	
	// function handleAddSettings() {
	// 	setdepositTypeBonus(olddepositTypeBonus => [...olddepositTypeBonus, values]);
	// 	setdepositTypeSettingsList({
	// 		depositType: 'noDiscount',
	// 		depositAmount: '',
	// 		discountPercentRatio: '',
	// 		maxPromoAmount: '',
	// 		minBetTimesAmount: '',
	// 	})
	// }

	function handleDeleteSettings(index) {
		return () => setdepositTypeBonus(olddepositTypeBonus => olddepositTypeBonus.filter((o, i) => i !== index));
	}

	function handleUpdateSettings(index) {
		return () => setdepositTypeSettingsList({...depositTypeBonus[index], selectedSettings: index});
	}

	function handleSaveSettings(index) {
		return () => setdepositTypeBonus(olddepositTypeBonus => olddepositTypeBonus.map((o, i) => {
			if(i === index) {
				return values;
			}
			return o;
		}))
	}

	const [bank] = useMutation(ADD_BANK_QUERY)
	const [depositRule] = useMutation(ADD_DEPOSIT_RULE_QUERY)
	const [depositRuleId] = useMutation(ADD_DEPOSIT_RULE_ID)
	const [depositBonus] = useMutation(ADD_DEPOSIT_BONUS_QUERY)
	const [depositBonusId] = useMutation(ADD_DEPOSIT_BONUS_ID)
	console.log(membershipLevel, 'test')
	function mutateUpdate(allData) {
		let memberLevel = [];
		membershipLevel.map((item, idx) => (
			memberLevel.push(item.pk)
		))
		console.log(memberLevel, 'memberLevelll')
		let payType = allData.payType === '' ? data.banks.edges[0].node.payType.id : allData.payType 
		let bankName = allData.bankName === '' ? data.banks.edges[0].node.bankName : allData.bankName 
		let bankAccount = allData.bankAccount === '' ? data.banks.edges[0].node.bankAccount : allData.bankAccount 
		let beneficiary = allData.beneficiary === '' ? data.banks.edges[0].node.beneficiary : allData.beneficiary 
		let bankBranch = allData.bankBranch === '' ? data.banks.edges[0].node.bankBranch : allData.bankBranch 

		let singleMinDeposit = allData.singleMinimumDeposit === null ? data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit : allData.singleMinimumDeposit
		let singleMaxDeposit = allData.singleMaxDeposit === null ? data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit : allData.singleMaxDeposit
		let perDayMaxDepositAmount = allData.perDayMaxDepositAmount === null ? data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit : allData.perDayMaxDepositAmount
		let perDayMaxDepositTimes = allData.perDayMaxDepositTimes === null ? data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit : allData.perDayMaxDepositTimes
		let depositPercentageFee = allData.depositPercentageFee === null ? data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit : allData.depositPercentageFee

		let depositType = allData.depositType === '' ? data.banks.edges[0].node.bankBonus.edges[0].node.depositType.toLowerCase() : allData.depositType
		let depositAmount = allData.depositAmount === null ? data.banks.edges[0].node.bankBonus.edges[0].node.depositAmount : allData.depositAmount
		let discountPercentRatio = allData.discountPercentRatio === null ? data.banks.edges[0].node.bankBonus.edges[0].node.discountPercentRatio : allData.discountPercentRatio
		let maxPromoAmount = allData.maxPromoAmount === null ? data.banks.edges[0].node.bankBonus.edges[0].node.maxPromoAmount : allData.maxPromoAmount
		let minBetTimesAmount = allData.minBetTimesAmount === null ? data.banks.edges[0].node.bankBonus.edges[0].node.minBetTimesAmount : allData.minBetTimesAmount
		
		bank({
			variables: {id: bankID, bankName: bankName, 
				bankAccount: bankAccount, payType: payType,
				beneficiary: beneficiary, bankBranch: bankBranch}
		})

		if(data.banks.edges[0].node.bankRule.edges != 0){
			depositRule({
				variables: {id: data.banks.edges[0].node.bankRule.edges[0].node.id , bank: bankID, singleMinDeposit: singleMinDeposit, 
					singleMaxDeposit: singleMaxDeposit, perDayMaxDepositAmount: perDayMaxDepositAmount, 
					perDayMaxDepositTimes: perDayMaxDepositTimes, depositPercentageFee: depositPercentageFee, depositLevels: memberLevel}
			})
		} else {
			depositRuleId({
				variables: {bank: bankID, singleMinDeposit: singleMinDeposit, 
					singleMaxDeposit: singleMaxDeposit, perDayMaxDepositAmount: perDayMaxDepositAmount, 
					perDayMaxDepositTimes: perDayMaxDepositTimes, depositPercentageFee: depositPercentageFee, depositLevels: memberLevel}
			})
		}

		if(data.banks.edges[0].node.bankBonus.edges != 0){
			depositBonus({
				variables: {id: data.banks.edges[0].node.bankBonus.edges[0].node.id, bank: bankID, 
					depositType: depositType , depositAmount: depositAmount, 
					discountPercentRatio: discountPercentRatio, maxPromoAmount: maxPromoAmount, 
					minBetTimesAmount: minBetTimesAmount}
			})
		} else {
			depositBonusId({
				variables: {bank: bankID, 
					depositType: depositType , depositAmount: depositAmount, 
					discountPercentRatio: discountPercentRatio, maxPromoAmount: maxPromoAmount, 
					minBetTimesAmount: minBetTimesAmount}
			})
		}
		
	}



	const membershipLevelHandleChange = membershipLevel => {
		setMembershipLevel(membershipLevel)
	}

	const {data, loading} = useBankQuery({depositType: "company", id: bankID});
	if (loading) {
		return null
	}

	if(memberLevels) {
        memberLevels.map(o => {
            arrMembershipLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
	}
	
	if(membershipLevel) {
		if(memberLevels) {
			memberLevels.map(o => {
				membershipLevelArr.push(o.pk)
			})
		}
	}
	// if(data.banks.edges[0].node.bankRule.edges){
	// 	if(data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges && membershipLevel.length === 0) {
	// 		data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.map((o)=> {
	// 			setMembershipLevel(membershipLevel=>[
	// 				...membershipLevel,
	// 				{value: o.node.pk, label: o.node.name}
	// 			])
	// 		})
	// 	}
	// }

	// {
	// 	if(values.availableMembershipLevels.length === 0){
	// 		if(data.banks.edges[0].node.bankRule.edges.length != 0){
	// 			{data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.map((value, idx) => (
	// 				values.availableMembershipLevels.push(value.node.pk.toString())
	// 			))}
	// 		}
	// 	}
	// }

	function saveHandle(event) {
		event.preventDefault();
		mutateUpdate(values);

		Swal.fire({
			type: 'success',
			title: strings.successPrompt,
			showConfirmButton: false,
			timer: 1500,
			marginTop: '160px !important',
			onClose: history.push(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT)
		})
	}

    return <form className={classes.container} onSubmit={saveHandle} autoComplete="off">
			<Grid item container spacing={2}>
				<Grid item md={4}>
					<Paper elevation={1}  style={{height: 650}}>
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
										defaultValue={data.banks.edges[0].node.payType.id}
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
										onChange={handleChange} defaultValue={data.banks.edges[0].node.bankName} required />
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.bankAccount}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="bankAccount" 
										onChange={handleChange} defaultValue={data.banks.edges[0].node.bankAccount} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.payee}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="beneficiary" 
										onChange={handleChange} defaultValue={data.banks.edges[0].node.beneficiary} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.bankBranch}:</Typography>
								}
								rightComponent={
									<TextField style={{width: "100%"}} variant="outlined" margin="dense" name="bankBranch"
										onChange={handleChange} defaultValue={data.banks.edges[0].node.bankBranch} required/>
								}
							/>
						</Grid>
					</Paper>
				</Grid>
				<Grid item md={4}>
					<Paper elevation={1}  style={{height: 650}}>
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
										onChange={numberHandleChange} 
										defaultValue={
											data.banks.edges[0].node.bankRule.edges.length != 0 ?
											data.banks.edges[0].node.bankRule.edges[0].node.singleMinDeposit 
											: ''
										} 
										required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.singleMaximumDeposit}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "singleMaxDeposit" && error ? true : false}
										helperText={errorName === "singleMaxDeposit" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="singleMaxDeposit" 
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankRule.edges.length != 0 ?
											data.banks.edges[0].node.bankRule.edges[0].node.singleMaxDeposit
											: ''
										} 
										required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.amountPerDaySuspended}:</Typography>
								}
								rightComponent={
									<TextField 
									style={{width: "100%"}}
										error={errorName === "perDayMaxDepositAmount" && error ? true : false}
										helperText={errorName === "perDayMaxDepositAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="perDayMaxDepositAmount" 
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankRule.edges.length != 0 ? 
											data.banks.edges[0].node.bankRule.edges[0].node.perDayMaxDepositAmount
											: ''
										} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.noOfTransactionPerDay}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "perDayMaxDepositTimes" && error ? true : false}
										helperText={errorName === "perDayMaxDepositTimes" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="perDayMaxDepositTimes" 
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankRule.edges.length != 0 ? 
											data.banks.edges[0].node.bankRule.edges[0].node.perDayMaxDepositTimes
											: ''
										} required/>
								}
							/>
							<FormRowCenterItems
								leftComponent={
									<Typography>{strings.proportionOfDepositFee}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "depositPercentageFee" && error ? true : false}
										helperText={errorName === "depositPercentageFee" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="depositPercentageFee"
										onChange={depoFeeHandle} defaultValue={
											data.banks.edges[0].node.bankRule.edges.length != 0 ?
											data.banks.edges[0].node.bankRule.edges[0].node.depositPercentageFee
											: ''
										} required/>
								}
							/>
							{/* <FormRowCenterItems
								leftComponent={
									<Typography>{strings.quickSelectionAmounts}:</Typography>
								}
								rightComponent={
									<TextField type="number" variant="outlined" margin="dense" name="quickSelectionAmount"
										onChange={handleChange} defaultValue={data.banks.edges[0].node.quickSelectionAmount} onKeyUp={handleQuickAmountSelections}
									/>
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
										className={classes.radioGroup}
									>
										{
											["奥亚", "电子", "前台一", "前台二"].map((o, index) => <FormControlLabel key={index} defaultValue={o} control={<Radio color="primary"/>} label={o}/>)
										}
									</RadioGroup>
								}
							/> */}
							
							<FormRowCenterItems
								// isFormGroup
								leftComponent={
									<Typography style={{marginTop:10}}>{strings.availableMembershipLevel}:</Typography>
								}
								rightComponent={
									// <FormGroup className={classes.checkBoxGroup}>
									// 	{memberLevels.map((o ,index) => (
									// 		<FormControlLabel 
									// 			key={index}
									// 			checked={Boolean(values.availableMembershipLevels.find(
									// 				item =>{return o.node.pk === item ? true : false}))}
									// 			value={o.node.pk}
									// 			label={o.node.name}
									// 			labelPlacement="end"
									// 			control={<Checkbox color="primary"/>}
									// 			onChange={handleChangeMembershipLevels}
									// 		/>
									// 	))}
									// </FormGroup>
									<FormControl className={classes.checkBoxGroup} style={{width: "100%"}}>
											{/* <InputLabel htmlFor="select-multiple-checkbox"></InputLabel> */}
											
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
													// defaultValue={{
													// 	label: data.banks.edges[0].node.bankRule.edges.length != 0 ?
													// 	data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.length !== 0 ?
													// 	data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.map((o)=> {
													// 		return o.node.name;
													// 	}) : '' : '',  
													// 	value: data.banks.edges[0].node.bankRule.edges.length != 0 ?
													// 	data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.length !== 0 ?
													// 	data.banks.edges[0].node.bankRule.edges[0].node.depositLevels.edges.map((o)=> {
													// 		return o.node.pk;
													// 	}) : '' : ''
													// }}
													options={
														arrMembershipLevel
													}
													filterOption={createFilter({ignoreAccents: false})}
													style={customStylesReactSelect}
													name={'availableMembershipLevels'}
												/>
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
												memberLevels.map((o, index) => {
												return <MenuItem key={index} value={o.node.pk.toString()}>
													<Checkbox checked={Boolean(values.availableMembershipLevels.find((level) => { return level === o.node.pk ? true : false }))} />
													<ListItemText primary={o.node.name} />
												</MenuItem>
											})}
											</Select> */}
											
									</FormControl>
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
					<Paper elevation={1}  style={{height: 650}}>
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
										name="depositType"
										defaultValue={
											data.banks.edges[0].node.bankBonus.edges.length != 0 ? 
											data.banks.edges[0].node.bankBonus.edges[0].node.depositType.toLowerCase()
											: ''
										}
										onChange={handleChange}
									>
										<Grid container direction="column">
											<FormControlLabel value="none" control={<Radio required color="primary"/>} label={strings.noDiscount} />
											<FormControlLabel value="first"  control={<Radio required color="primary"/>} label={strings.firstDeposit} />
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
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankBonus.edges.length != 0 ? 
											data.banks.edges[0].node.bankBonus.edges[0].node.depositAmount
											: ''
										} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.promotionRatio}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "discountPercentRatio" && error ? true : false}
										helperText={errorName === "discountPercentRatio" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="discountPercentRatio"
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankBonus.edges.length != 0 ? 
											data.banks.edges[0].node.bankBonus.edges[0].node.discountPercentRatio
											: ''
										} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.offerLimitAmount}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "maxPromoAmount" && error ? true : false}
										helperText={errorName === "maxPromoAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="maxPromoAmount"
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankBonus.edges.length != 0 ? 
											data.banks.edges[0].node.bankBonus.edges[0].node.maxPromoAmount
											: ''
										} required/>
								}
							/>
							<FormRowCenterItems 
								leftComponent={
									<Typography>{strings.preferentialAuditMultiple}:</Typography>
								}
								rightComponent={
									<TextField 
										style={{width: "100%"}}
										error={errorName === "minBetTimesAmount" && error ? true : false}
										helperText={errorName === "minBetTimesAmount" ? ErrorHandle(error) : null}
										type="number" variant="outlined" margin="dense" name="minBetTimesAmount"
										onChange={numberHandleChange} defaultValue={
											data.banks.edges[0].node.bankBonus.edges.length != 0 ? 
											data.banks.edges[0].node.bankBonus.edges[0].node.minBetTimesAmount
											: ''
										} required/>
								}
							/>
							{depositTypeBonus.length > 0 && <FormRowCenterItems
								rightComponent={
									depositTypeBonus.map((o, index) => <Grid item key={index} className={classes.rule}>
											<Grid container alignItems="center" spacing={1}>
												<Grid item><Typography variant="body2">{strings.offer} {index+1}</Typography></Grid>
												<Grid item>
													{depositTypeSettingsList.selectedSettings === index &&<IconButton size="small" onClick={handleSaveSettings(index)}><SaveOutlined color="primary"/></IconButton>}
													{depositTypeSettingsList.selectedSettings !== index &&<IconButton size="small" onClick={handleUpdateSettings(index)}><EditOutlined color="primary"/></IconButton>}
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
					<Button variant="contained" disabled={error ? true : false} color="primary" style={{marginRight: 10, width: 150, marginTop: 24}} type="submit">{strings.save}</Button>
					<Button variant="outlined" onClick={() => history.goBack()} style={{width: 150, marginTop: 24}}>{strings.return}</Button>
				</Grid>
			</Grid>
	</form>
}