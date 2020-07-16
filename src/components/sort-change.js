import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Typography,
	Modal,
	Button,
	Paper,
	Grid,
	IconButton,
	TextField,
	Divider,
	InputAdornment
} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import CloseIcon from '../icons/close';
import { COMMON } from '../paths';
import { Cancel, Error } from '@material-ui/icons'
import { FormRowCenterItems } from '../components/form-layouts';

const useStyles = makeStyles(theme => ({
	paper: {
		position: 'absolute',
		width: 400,

		padding: theme.spacing(2),
		outline: 'none',
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`
	},
	actions: {
		paddingTop: theme.spacing(2)
	}
}));

export default function SortChangeModal({ title, id, setId, name, setName, weight, setWeight, description, open, setOpen, title2, mutateQuery }) {
	const strings = useLanguages(COMMON);
	const [values, setValues] = useState({});
	const [error, setError] = useState(false)
	const [helperText] = useState('Please input number')

	useEffect(() => {
		setValues(oldValues => ({
			...oldValues,
			currentWeight: weight
		}))
	}, [weight])

	function clearText() {
		setValues(oldValues => ({
			...oldValues,
			currentWeight: ''
		}))
		setError(true)
	}

	function handleChange(event) {
		setValues({ ...values, [event.currentTarget.name]: event.currentTarget.value });
		let value = event.currentTarget.value
		if (value === '') {
			setError(true)
		} else {
			setError(isNaN(event.currentTarget.value))
		}
	};

	const handleClose = () => {
		setError(false)
		setId(null)
		setWeight(null)
		setName(null)
		setOpen(false);
	};

	function mutateQueryBtn() {
		mutateQuery({id: id, weight: values.currentWeight})
		setError(false)
		setId(null)
		setWeight(null)
		setName(null)
		setOpen(false);
	}

	const classes = useStyles();
	return (
		<Modal
			aria-labelledby="modal-title"
			aria-setsize="modal-weight"
			open={open}
			onClose={handleClose}
		>
			<Paper className={classes.paper}>
				<Grid container spacing={1} justify="space-between">
					<Grid item>
						<Grid conatiner>
							<Grid item><Typography>{title}:</Typography></Grid>
							<Grid item><Typography>{name}</Typography></Grid>
						</Grid>
					</Grid>
					<Grid item justify="flex-end">
					<IconButton size="small" onClick={handleClose}>
								<CloseIcon fontSize="inherit"/>
							</IconButton>
						</Grid>
				</Grid>			
				<Grid container spacing={1} alignItems="flex-start">
					<Grid item></Grid>
					<Divider width="100%" />
					<Grid item></Grid>
					<Grid item></Grid>
					<Grid item>
						<Typography variant="subtitle1" id="modal-title">
							<FormRowCenterItems
								leftComponent={
									<Typography >{title2} </Typography>
								}
								rightComponent={
									<Grid item spacing={0}>
										<TextField
											error={error}
											helperText={
												error ?
													<Fragment>
														<Grid container alignItems="center">
															<Error fontSize="small" />
															&nbsp;
														{helperText}
														</Grid>
													</Fragment> :
													null
											}
											variant="outlined"
											id="modal-weight"
											margin="dense"
											name="currentWeight"
											onChange={handleChange}
											value={values.currentWeight}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<IconButton size="small" onClick={clearText}>
															<Cancel fontSize="small"/>
														</IconButton>
													</InputAdornment>
												),
											}}
										/>
										<Typography style={{ color: "#4DB6AC" }}>{description}</Typography>
									</Grid>
								}
							/>
						</Typography>
					</Grid>
				</Grid>
				{/* error ? error : true */}
				<Grid container justify="flex-end" spacing={1} className={classes.actions}>
					<Divider width="100%" />
					<Grid item><Button variant="outlined" onClick={handleClose}>{strings.cancel}</Button></Grid>
					<Grid item><Button disabled={error} onClick={mutateQueryBtn} variant="contained" color="primary">{strings.continue}</Button></Grid>
				</Grid>
			</Paper>
		</Modal>
	);
}
