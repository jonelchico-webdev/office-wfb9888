import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal, Button, Paper, Grid, IconButton, Divider, TextField, Select, OutlinedInput, MenuItem, Menu, } from '@material-ui/core';
import CloseIcon from '../icons/close';
import { bankNames } from '../values'

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 500,

		// padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},
	actions: {
		paddingTop: theme.spacing(2)
	},
	padding: {
		padding: theme.spacing(2)
	},
	textfield: {
		backgroundColor: '#fff'
	},
	select: {
		border: "1px solid #c4c4c4",
		backgroundColor: '#fff',
		borderRadius: 5
	}
}));

export default function AddBankCardModal({ id, username, name, open, setOpen, strings, mutate, withdrawalsPassword }) {
	const classes = useStyles()	
	console.log(name)
	const [addBankCardValues, setAddBankCardValues] = useState({
		user: id,
		bankName: "",
		nameOnCard: null,
		cardNumber: null,
		branch: null
	})

	const [addWithdrawalsPassword, setAddWithdrawalsPassword] = useState({
		password: null,
		withdrawalsPassword: null,
		withdrawalsPasswordRepeat: null
	})

	function doMutate() {
		mutate(addBankCardValues, addWithdrawalsPassword)
		setAddWithdrawalsPassword({
			password: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null
		})
		setAddBankCardValues({
			user: id,
			bankName: "",
			nameOnCard: null,
			cardNumber: null,
			confirmCardNumber: null,
			branch: null
		})

		// setOpen(false)
	}

	const handleClose = () => {
		setAddBankCardValues({
			user: id,
			bankName: "",
			nameOnCard: null,
			cardNumber: null,
			confirmCardNumber: null,
			branch: null
		})	
		setAddWithdrawalsPassword({
			password: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null
		})
		setOpen(false)
	};



	const cardNumberError = addBankCardValues.cardNumber !== null && addBankCardValues.cardNumber.length > 19 ? true : false
	const confirmCardNumberError = addBankCardValues.cardNumber !== null && addBankCardValues.confirmCardNumber !== null && addBankCardValues.cardNumber !== addBankCardValues.confirmCardNumber ? true : false
	const withdrawalsPasswordError = addWithdrawalsPassword.withdrawalsPassword !== null && addWithdrawalsPassword.withdrawalsPassword.length > 12 ? true : addWithdrawalsPassword.withdrawalsPassword !== null && addWithdrawalsPassword.withdrawalsPassword.length < 6 ? true : false
	const confirmWithdrawalsPasswordError = addWithdrawalsPassword.withdrawalsPassword !== null && addWithdrawalsPassword.withdrawalsPasswordRepeat !== null && addWithdrawalsPassword.withdrawalsPassword !== addWithdrawalsPassword.withdrawalsPasswordRepeat ? true : false
	const nameError = addBankCardValues.nameOnCard !== null && addBankCardValues.nameOnCard !== name ? true : false
	function handleInputValuesChange(event) {
		event.persist()
		setAddBankCardValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}))
	}

	function handleWithdrawalPasswordValuesChange(event) {
		event.persist()
		setAddWithdrawalsPassword(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}))
	}
	
	return <Modal
		id={id}
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
		open={open}
	// onClose={handleClose}
	>
		<Paper className={classes.paper}  >
			<Grid className={classes.padding} container justify="space-between" alignItems="center">
				<Grid item>
					<Typography variant="h5" style={{ fontWeight: "bold" }}>{strings.addBankCard}</Typography>
				</Grid>
				<Grid item>
					<IconButton size="small" onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Grid>
			</Grid>
			<Divider />
			<Grid className={classes.padding} direction="column" container spacing={2} >
				
				<Grid item>
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography>{strings.bankName}:</Typography></Grid>
						<Grid item xs={8}>
							{/* <TextField
								defaultValue={addBankCardValues.bankName}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								name="bankName"
								className={classes.textfield}
								fullWidth={true}
							/> */}
							<Select
								fullWidth={true}
								margin="dense"
								className={classes.select}
								name="bankName"
								value={addBankCardValues.bankName}
								onChange={handleInputValuesChange}
								displayEmpty
								input={<OutlinedInput notched={false} name="selectStatus" />}
							>
								<MenuItem value={""}>{strings.selectBank}</MenuItem>
								{
									bankNames.map(o =>
										<MenuItem value={o}>{o}</MenuItem>)
								}
								{/* <MenuItem value={statusFilter.enable}>{strings.enable}</MenuItem>
								<MenuItem value={statusFilter.disable}>{strings.disable}</MenuItem> */}
							</Select>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="start-end" style={{ marginBottom: nameError ? -20 : 0 }}>
						<Grid item xs={4}><Typography style={{ marginTop: 12 }}>{strings.actualName}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={addBankCardValues.nameOnCard}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								// label={strings.nameWarning}
								placeholder={strings.bankCardOwnerName}
								name="nameOnCard"
								className={classes.textfield}
								fullWidth={true}
							/>
							{
								nameError ? <Typography color="error">{strings.nameWarning}</Typography> : null
							}						
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="start-end" style={{ marginBottom: cardNumberError ? -20 :  confirmCardNumberError  ? -20 : 0 }}>
						<Grid item xs={4}><Typography style={{ marginTop: 12 }}>{strings.bankCardNumber}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={addBankCardValues.confirmCardNumber}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								placeholder={strings.upTo19Digits}
								name="cardNumber"
								className={classes.textfield}
								fullWidth={true}
							/>
							{
								cardNumberError && addBankCardValues.cardNumber !== "" ?
									<Typography color="error">{strings.cardNumberWarning1}</Typography>
									: null
							}
							{
								confirmCardNumberError && addBankCardValues.confirmBankCardNumber !== "" ?
									<Typography color="error">{strings.cardNumberWarning2}</Typography>
									: null
							}
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="start-end">
						<Grid item xs={4}><Typography style={{ marginTop: 12 }}>{strings.confirmBankCardNumber}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={addBankCardValues.cardNumber}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								placeholder={strings.upTo19Digits}
								name="confirmCardNumber"
								className={classes.textfield}
								fullWidth={true}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography  style={{ marginTop: -12 }}>{strings.bankBranch}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={addBankCardValues.branch}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								name="branch"
								className={classes.textfield}
								fullWidth={true}
							/>
							<Typography>{strings.exampleBranch}</Typography>
						</Grid>
					</Grid>
				</Grid>
				{
					withdrawalsPassword !== null ?
						<Grid container justify="center" spacing={1} className={classes.actions}>
							<Grid item><Button variant="outlined" onClick={handleClose} >{strings.cancel}</Button></Grid>
							<Grid item>
								<Button
									disabled={
										addBankCardValues.bankName == null ||
										addBankCardValues.bankName == "" ||
										addBankCardValues.nameOnCard == null ||
										addBankCardValues.cardNumber == null ||
										addBankCardValues.branch == null ||
										addBankCardValues.bankName == "" ||
										addBankCardValues.nameOnCard == "" ||
										addBankCardValues.cardNumber == "" ||
										addBankCardValues.branch == "" ||
										cardNumberError || confirmCardNumberError ||
										nameError
									}
									variant="contained"
									onClick={doMutate}
									color="primary"
								>
									{strings.continue}
								</Button>
							</Grid>
						</Grid>
						: null
				}
			</Grid>
			{
				withdrawalsPassword == null ? <Fragment>
					<Grid className={classes.padding} container justify="space-between" alignItems="center">
						<Grid item>
							<Typography variant="h5" style={{ fontWeight: "bold" }}>{strings.setWithdrawalPassword}</Typography>
						</Grid>
					</Grid>
					<Divider />
					<Grid className={classes.padding} direction="column" container spacing={2} >
						<Grid item>
							<Grid container direction="row" alignItems="center">
								<Grid item xs={4}><Typography>{strings.accountPassword}:</Typography></Grid>
								<Grid item xs={8}>
									<TextField
										defaultValue={addWithdrawalsPassword.password}
										onChange={handleWithdrawalPasswordValuesChange}
										variant="outlined"
										margin="dense"
										type="password"
										placeholder={strings.enterAccountPassword}
										name="password"
										className={classes.textfield}
										fullWidth={true}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container direction="row" alignItems="flex-start" style={{ marginBottom: withdrawalsPasswordError ? -12 : confirmWithdrawalsPasswordError ? -12  : 0 }}>
								<Grid item xs={4} style={{marginTop: 12}}><Typography>{strings.withdrawalsPassword}:</Typography></Grid>
								<Grid item xs={8}>
									<TextField
										defaultValue={addWithdrawalsPassword.withdrawalsPassword}
										onChange={handleWithdrawalPasswordValuesChange}
										variant="outlined"
										margin="dense"
										type="password"
										placeholder={strings.withdrawalsPasswordPlaceholder}
										name="withdrawalsPassword"
										className={classes.textfield}
										fullWidth={true}
									/>
									{
										withdrawalsPasswordError && addWithdrawalsPassword.withdrawalsPassword !== "" ?
											<Typography color="error">{strings.withdrawalsPasswordWarning1}</Typography>
											: null
									}
									{
										confirmWithdrawalsPasswordError ?
											<Typography color="error">{strings.withdrawalsPasswordWarning2}</Typography>
											: null
									}
								</Grid>
							</Grid>
						</Grid><Grid item>
							<Grid container direction="row" alignItems="center">
								<Grid item xs={4}><Typography>{strings.confirmWithdrawalsPassword}:</Typography></Grid>
								<Grid item xs={8}>
									<TextField
										defaultValue={addWithdrawalsPassword.withdrawalsPasswordRepeat}
										onChange={handleWithdrawalPasswordValuesChange}
										variant="outlined"
										margin="dense"
										type="password"
										placeholder={strings.confirmationWithdrawalsPassword}
										name="withdrawalsPasswordRepeat"
										className={classes.textfield}
										fullWidth={true}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid container justify="center" spacing={1} className={classes.actions}>
							<Grid item><Button variant="outlined" onClick={handleClose} >{strings.cancel}</Button></Grid>
							<Grid item>
								<Button
									disabled={
										addBankCardValues.bankName == null ||
										addBankCardValues.bankName == "" ||
										addBankCardValues.nameOnCard == null ||
										addBankCardValues.cardNumber == null ||
										addBankCardValues.branch == null ||
										addBankCardValues.bankName == "" ||
										addBankCardValues.nameOnCard == "" ||
										addBankCardValues.cardNumber == "" ||
										addBankCardValues.branch == "" ||
										cardNumberError || confirmCardNumberError ||
										withdrawalsPasswordError || confirmWithdrawalsPasswordError ||
										addWithdrawalsPassword.password == null ||
										addWithdrawalsPassword.withdrawalsPassword == null ||
										addWithdrawalsPassword.withdrawalsPasswordRepeat == null ||
										addWithdrawalsPassword.password == "" ||
										addWithdrawalsPassword.withdrawalsPassword == "" ||
										addWithdrawalsPassword.withdrawalsPasswordRepeat == "" ||
										nameError
									}
									variant="contained"
									onClick={doMutate}
									color="primary"
								>
									{strings.continue}
								</Button>
							</Grid>
						</Grid>
					</Grid>

				</Fragment>
					: null
			}
		</Paper>
	</Modal>
}