import React, { useState, Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal, Button, Paper, Grid, IconButton, Divider, TextField, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import QuestionIcon from '../icons/question';
import { Loading } from './'
import swal from 'sweetalert2';

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
	}
}));


export default function WithdrawModal({ id, open, setOpen, strings, bankCards, balance, mutate }) {
	const classes = useStyles()


	// console.log(bankCards)

	const [bankCardIndex, setBankCardIndex] = useState(0)

	const [inputValues, setInputValues] = useState({
		user: id,
		amount: null,
		depositBankName: null,
		depositAccount: null,
		depositUserName: null,
		withdrawalsPassword: null,
		withdrawalsPasswordRepeat: null,
	})

	
	useEffect(() => {
		setInputValues(oldValues => ({
			...oldValues,
			depositAccount: bankCards ? bankCards[bankCardIndex].node.cardNumber : null,
			depositUserName: bankCards ? bankCards[bankCardIndex].node.nameOnCard : null,
			depositBankName: bankCards ? bankCards[bankCardIndex].node.bankName : null,
		}))
	}, [bankCardIndex, bankCards])

	function handleInputValuesChange(event) {
		event.persist()
		if(event.target.name == "amount") {
			setInputValues(oldValues => ({
				...oldValues,
				[event.target.name]: parseFloat(event.target.value)
			}))
		} else {
			setInputValues(oldValues => ({
				...oldValues,
				[event.target.name]: event.target.value
			}))
		}
	}

	const handleClose = () => {
		setInputValues({
			user: id,
			amount: null,
			depositBankName: null,
			depositAccount: null,
			depositUserName: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null,
		})
		setBankCardIndex(0)
		setOpen(false)
	};

	const confirmWithdrawalsPasswordError = inputValues.withdrawalsPassword !== null && inputValues.withdrawalsPasswordRepeat !== null && inputValues.withdrawalsPassword !== inputValues.withdrawalsPasswordRepeat ? true : false
	const amountError = inputValues.amount !== null && inputValues.amount < 100 || inputValues.amount > 10000 ? true : false
	function handleBankCardIndex(event) {
		event.persist()
		setBankCardIndex(event.target.value)
	}

	function doMutate() {
		mutate(inputValues)

			swal.fire({
				position: 'center',
				type: 'success',
				title: strings.withdrawalSuccessful,
				showConfirmButton: false,
				timer: 2000
			})
		setInputValues({
			user: id,
			amount: null,
			depositBankName: null,
			depositAccount: null,
			depositUserName: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null,
		})
		setBankCardIndex(0)
		setOpen(false)
	}

	return <Modal
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
		open={open}
	// onClose={handleClose}
	>
		<Paper className={classes.paper}  >
			<Grid className={classes.padding} container justify="space-between" alignItems="center">
				<Grid item>
					<Typography variant="h5" style={{ fontWeight: "bold" }}>{strings.withdraw}</Typography>
				</Grid>
				<Grid item>
					<IconButton size="small" onClick={handleClose}>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				</Grid>
			</Grid>
			<Divider />
			<Grid className={classes.padding} direction="column" container spacing={2} >
				<Grid item>
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography>{strings.selectBankCard}:</Typography></Grid>
						<Grid item xs={8}>
							{
								bankCards ?
									<Select
										fullWidth={true}
										margin="dense"
										className={classes.select}
										name="bankName"
										value={bankCardIndex}
										onChange={handleBankCardIndex}
										displayEmpty
										input={<OutlinedInput notched={false} name="selectStatus" />}
									>
										{
											bankCards.map((o, i) =>
												<MenuItem value={i}>{o.node.bankName + " " + o.node.cardNumber}</MenuItem>)
										}
										{/* <MenuItem value={statusFilter.enable}>{strings.enable}</MenuItem>
								<MenuItem value={statusFilter.disable}>{strings.disable}</MenuItem> */}
									</Select> : <Loading />
							}
						</Grid>
					</Grid>
				</Grid>
				<Grid item alignItems="center">
					<Grid container direction="row" alignItems="center" style={{marginTop: 12, marginBottom: -12}} >
						<Grid item xs={4}><Typography>{strings.accountBalance}:</Typography></Grid>
						<Grid item xs={8}>
							<Typography variant="subtitle2" style={{ fontSize: 15}}>{balance}</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="flex-start"
					style={{ marginBottom: amountError ? -12 : 0 }}					>
						<Grid item xs={4} style={{ marginTop: 12 }}><Typography>{strings.amount}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={inputValues.amount}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								type="number"
								placeholder="100.00 - 10,000.00"
								name="amount"
								className={classes.textfield}
								fullWidth={true}
							/>
							{
								amountError ? <Typography color="error">{strings.amountError}</Typography> : null
							}
							{/* {
								withdrawalsPasswordError && inputValues.withdrawalsPassword !== "" ?
									<Typography color="error">{strings.withdrawalsPasswordWarning1}</Typography>
									: null
							} */}
							{/* {
								confirmWithdrawalsPasswordError ?
									<Typography color="error">{strings.withdrawalsPasswordWarning2}</Typography>
									: null
							} */}
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="flex-start"
					style={{ marginBottom: confirmWithdrawalsPasswordError ? -12 : 0 }}					>
						<Grid item xs={4} style={{ marginTop: 12 }}><Typography>{strings.withdrawalsPassword}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={inputValues.withdrawalsPassword}
								onChange={handleInputValuesChange}
								variant="outlined"
								margin="dense"
								type="password"
								placeholder={strings.withdrawalPasswordPlaceholder2}
								name="withdrawalsPassword"
								className={classes.textfield}
								fullWidth={true}
							/>
							{/* {
								withdrawalsPasswordError && inputValues.withdrawalsPassword !== "" ?
									<Typography color="error">{strings.withdrawalsPasswordWarning1}</Typography>
									: null
							} */}
							{
								confirmWithdrawalsPasswordError ?
									<Typography color="error">{strings.withdrawalsPasswordWarning2}</Typography>
									: null
							}
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography>{strings.confirmWithdrawalsPassword}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={inputValues.withdrawalsPasswordRepeat}
								onChange={handleInputValuesChange}
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
							<Grid item>
								<Button
									disabled={										
										inputValues.amount === null ||
										inputValues.amount === "" ||
										inputValues.depositBankName === null ||
										inputValues.depositBankName === "" ||
										inputValues.depositAccount === null ||
										inputValues.depositAccount === "" ||
										inputValues.depositUserName === null ||
										inputValues.depositUserName === "" ||
										inputValues.withdrawalsPassword === null ||
										inputValues.withdrawalsPassword === "" ||
										inputValues.withdrawalsPasswordRepeat === null ||
										inputValues.withdrawalsPasswordRepeat === "" ||
										confirmWithdrawalsPasswordError || amountError
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
		</Paper>
	</Modal>
}	