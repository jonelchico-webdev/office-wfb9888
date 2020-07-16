import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal, Button, Paper, Grid, IconButton, Divider, TextField, Select, OutlinedInput, MenuItem, Menu, } from '@material-ui/core';
import CloseIcon from '../icons/close';

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

export default function ChangeWithdrawalsPassword({ open, setOpen, strings, mutate}) {
	const classes = useStyles()

	const [withdrawalsPasswordValue, setWithdrawalsPasswordValue] = useState({
		password: null,
		withdrawalsPasswordOld: null,
		withdrawalsPassword: null,
		withdrawalsPasswordRepeat: null
	})

	const handleClose = () => {
		setWithdrawalsPasswordValue({
			password: null,
			withdrawalsPasswordOld: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null,
		})
		setOpen(false)
	}

	const withdrawalsPasswordError = withdrawalsPasswordValue.withdrawalsPassword !== null && withdrawalsPasswordValue.withdrawalsPassword.length > 12 ? true : withdrawalsPasswordValue.withdrawalsPassword !== null && withdrawalsPasswordValue.withdrawalsPassword.length < 6 ? true : false
	const confirmWithdrawalsPasswordError = withdrawalsPasswordValue.withdrawalsPassword !== null && withdrawalsPasswordValue.withdrawalsPasswordRepeat !== null && withdrawalsPasswordValue.withdrawalsPassword !== withdrawalsPasswordValue.withdrawalsPasswordRepeat ? true : false


	function handleWithdrawalPasswordValuesChange(event) {
		event.persist()
		setWithdrawalsPasswordValue(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}))
	}

	function doMutate() {
		mutate(withdrawalsPasswordValue)
		setWithdrawalsPasswordValue({
			password: null,
			withdrawalsPasswordOld: null,
			withdrawalsPassword: null,
			withdrawalsPasswordRepeat: null,
		})
	}

	return <Modal
		aria-labelledby="modal-title"
		aria-describedby="modal-description"
		open={open}
	>
		<Paper className={classes.paper}>
			<Grid className={classes.padding} container justify="space-between" alignItems="center">
				<Grid item>
					<Typography variant="h5" style={{ fontWeight: "bold" }}>{strings.changeWithdrawalsPassword}</Typography>
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
						<Grid item xs={4}><Typography>{strings.accountPassword}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={withdrawalsPasswordValue.password}
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
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography>{strings.withdrawalsPasswordOld}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={withdrawalsPasswordValue.withdrawalsPasswordOld}
								onChange={handleWithdrawalPasswordValuesChange}
								variant="outlined"
								margin="dense"
								type="password"
								placeholder={strings.enterWithdrawalsPasswordOld}
								name="withdrawalsPasswordOld"
								className={classes.textfield}
								fullWidth={true}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="flex-start" style={{ marginBottom: withdrawalsPasswordError ? -12 : confirmWithdrawalsPasswordError ? -12 : 0 }}>
						<Grid item xs={4} style={{marginTop: 12}}><Typography>{strings.withdrawalsPassword}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={withdrawalsPasswordValue.withdrawalsPassword}
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
								withdrawalsPasswordError && withdrawalsPasswordValue.withdrawalsPassword !== "" ?
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
				</Grid>
				<Grid item>
					<Grid container direction="row" alignItems="center">
						<Grid item xs={4}><Typography>{strings.confirmWithdrawalsPassword}:</Typography></Grid>
						<Grid item xs={8}>
							<TextField
								defaultValue={withdrawalsPasswordValue.withdrawalsPasswordRepeat}
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
								withdrawalsPasswordError || confirmWithdrawalsPasswordError ||
								withdrawalsPasswordValue.password == null ||
								withdrawalsPasswordValue.withdrawalsPassword == null ||
								withdrawalsPasswordValue.withdrawalsPasswordRepeat == null ||
								withdrawalsPasswordValue.password == "" ||
								withdrawalsPasswordValue.withdrawalsPassword == "" ||
								withdrawalsPasswordValue.withdrawalsPasswordRepeat == ""
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