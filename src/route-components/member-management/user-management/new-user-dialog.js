import React, { useEffect, useState } from 'react';
import { Box, InputAdornment, Grid, Dialog, DialogContent, DialogTitle, TextField, Button, RadioGroup, Radio, Divider, FormControlLabel, Typography, IconButton } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Close, Refresh } from '@material-ui/icons';
import { GET_CAPTCHA } from '../../../queries-graphql/use-login'
import { Error } from '@material-ui/icons'

import { useMutation } from '@apollo/react-hooks'
import { GrowItem } from '../../../components';
import { ADD_USER_MUTATION } from '../../../queries-graphql/member-management/user-management-mutation'
import swal from 'sweetalert2';
import useLanguages from '../../../hooks/use-languages';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative'
	},
	padding: {
		padding: theme.spacing(2),
		'& div + div': {
			marginTop: theme.spacing(1)
		}
	},
	closeIcon: {
		position: 'absolute',
		top: 8,
		right: 8
	}
}));

export default function NewUserDialog({ show, setShow, open, handleClose, strings }) {
	const classes = useStyles();
	const theme = useTheme();
	const stringsError = useLanguages('error')
	const [captchaMutate] = useMutation(GET_CAPTCHA)
	const [captchaValue, setcaptchaValue] = useState({})
	const [countdown, setCountdown] = useState(30)
	const [message, setMessage] = useState('') 
	const [values, setValues] = React.useState({
		username: '',
		password: '',	
		passwordRepeat: '',
		name: '',
		phone: '',
		qqNumber: '',
		email: '',
		password: '',
		isActive: 'true',
		parentAffiliateUsername: '',
		captcha: '',
		ownedAgent: '',
		errorCaptcha: null,
	});

	function handleChange(event) {
		event.persist();

		let x = event.target.value;
		if (event.target.name === "isActive") {
			x = JSON.parse(x)
		}
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: x
		}));
	};

	async function captchaGet() {
		const res = await captchaMutate()
		setcaptchaValue({
			captchaImg: res.data.GetCaptcha.imagePath,
			captchaKey: res.data.GetCaptcha.captchaKey
		})
		setCountdown(30)
		setValues(oldValues => ({
			...oldValues,
			captcha: '',
		}));
	}

	function btnCaptchaGet() {
		captchaGet()
		setValues({
			...values,
			captcha: '',
			errorCaptcha: null
		})
	}
	useEffect(() => {
		if (open) {
			captchaGet()
		}
	}, [open,])

	useEffect(() => {
		if(open){ 
			if (captchaValue.captchaImg !== "captcha_verify_disbaled") {
				const interval = setInterval(() => {
					if (countdown > 0) {
						setCountdown(countdown - 1)
					} else if (countdown == 0) {
						setCountdown(30)
						captchaGet()
					}
				}, 1000);
				return () => clearInterval(interval);
			}
		}
	}, [open, countdown])


	/** Mutation User **/

	const [addUser] = useMutation(ADD_USER_MUTATION)

	// function submitHandler(event) {
	// 	event.preventDefault();
	// 	mutateAddUser();
	// } 
	
	async function mutateAddUser(event) {
		event.preventDefault(); 
		try {	 
			const res = await addUser({
				variables: {
					captcha: values.captcha ? values.captcha : '',
					captchaKey: captchaValue.captchaKey ? captchaValue.captchaKey : '',
					username: values.username ? values.username : '',
					password: values.password ? values.password : '',  
					passwordRepeat: values.passwordRepeat ? values.passwordRepeat: '',
					name: values.name ? values.name : '',
					phone: values.phone ? values.phone : null,
					qqNumber: values.qqNumber ? values.qqNumber : null,
					email: values.email ? values.email : '',
					isActive:  values.isActive ? values.isActive :  false,
					parentAffiliateUsername: values.ownedAgent ? values.ownedAgent : '',
				}
			}) 
			if (res.data.Register.errors) {

				let error = res.data.Register.errors[1].toString()
				console.log(error)
				if(error == "parent affiliate username is error!") {				
					setMessage(stringsError.affiliateNotExist)
				} 
				if(error == "invalid phone number") {		
					console.log('3')		
					setMessage(stringsError.invalidPhone)
				} 
				if(error == "invalid phone length") {		
					console.log('3')		
					setMessage(stringsError.invalidPhoneLength)
				}
				if(error == "Passwords don't match.") {				
					setMessage(stringsError.passwordsDontMatch)
				} 
				if(error == "username already registered.") {
					setMessage(stringsError.usernameAlreadyRegistered)
				}
				if(error == "Captcha Incorrect") {					
					setMessage(stringsError.captchaIncorrect)
				} 
				if(error == "No Captcha Data,Please Get a Captcha First.") {
					setMessage(stringsError.noCaptchaDataPleaseGetACaptchaFirst)
				}
				setShow(true)
			}
			if (res.data.Register.success === true) {
				handleClose()
				swal.fire({
					position: 'center',
					type: 'success',
					title: strings.userSuccess,
					showConfirmButton: false,
					timer: 1500
				})
			}

		} catch (e) { 
			setMessage(strings.allTheInformationMustBeInputCorrectly)
		}
	}

	return <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		<form onSubmit={mutateAddUser} autoComplete="off"  >
			<Grid container direction="column" style={{ minWidth: "50vh" }}>
				<Grid item container direction="row" alignItems="center">
					<DialogTitle id="form-dialog-title">
						{strings.createANewUser}
					</DialogTitle>
					<GrowItem />
					<IconButton size="small" onClick={handleClose} style={{ marginRight: 20 }}>
						<Close />
					</IconButton>
				</Grid>

				<Grid item>
					<Divider />
				</Grid>

				<Grid item>
					<DialogContent>
						<Grid container direction="column">
							{show ? <Grid item container alignContent="center">
								<Box mx="auto">
									<Typography color="error">
										<Error fontSize="inherit" />
										&nbsp;
									{message}
									</Typography>
								</Box>
							</Grid> : null}

							<Grid item>

								<TextField
									autoFocus
									margin="dense"
									name="username"
									required
									id="username"
									inputProps={
										{
											autocomplete: "new-username",
											// form: {
											// 	autocomplete: "off",
											// }
										}
									}
									placeholder={strings.userName}
									type="text"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>

								<TextField
									margin="dense"
									id="password"
									required
									name="password"
									inputProps={
										{
											autocomplete: "new-password",
											// form: {
											// 	autocomplete: "off",
											// }
										}	
									}
									placeholder={strings.password}
									type="password"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="passwordRepeat"
									required
									name="passwordRepeat"
									inputProps={
										{
											autocomplete: "new-passwordRepeat",
											// form: {
											// 	autocomplete: "off",
											// }
										}
									}
									placeholder={strings.confirmPassword}
									type="password"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="actualName" 
									required
									name="name"
									inputProps={
										{
											autocomplete: "new-passwordRepeat",
											// form: {
											// 	autocomplete: "off",
											// }
										}
									}
									placeholder={strings.actualName}
									type="text"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="cellphoneNumber"
									name="phone"
									placeholder={strings.cellphoneNumber}
									type="number"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="qqNumber"
									name="qqNumber"
									placeholder={strings.QQNumber}
									type="number"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="email"
									name="email"
									placeholder="Email"
									type="text"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							<Grid item>
								<TextField
									margin="dense"
									id="ownedAgent"
									name="ownedAgent"
									placeholder={strings.ownedAgent}
									type="text"
									variant="outlined"
									onChange={handleChange}
									fullWidth
								/>
							</Grid>
							{
								captchaValue.captchaImg == "captcha_verify_disbaled" || captchaValue.captchaImg == "" ? null :
									<Grid item >
										<TextField
											required
											fullWidth={false}
											style={{ width: "35vh" }}
											id="captcha"
											variant="outlined"
											placeholder={strings.captcha}
											margin="dense"
											name="captcha"
											onChange={handleChange}
											InputProps={{
												autoComplete: 'disabled',
												startAdornment: (
													<InputAdornment position="start">
														<IconButton onClick={btnCaptchaGet} size="small" style={{ padding: 0 }}>
															<Refresh htmlColor={theme.palette.text.secondary} />
														</IconButton>
													</ InputAdornment>
												),
											}}
										/>
										<Button size="small" onClick={btnCaptchaGet}>
											<img
												src={`${process.env.REACT_APP_API_URL}/${captchaValue.captchaImg}`}
												style={{ maxHeight: 34, maxWidth: 200 }}
												border={1}
											/>
										</Button>
										<Typography style={{ color: 'blue', display: "inline-block", textAlign: "center" }}>{countdown}</Typography>
									</Grid>
							}
									<Grid item container direction="row" alignItems="center"  justify="space-around" >
										<RadioGroup aria-label="isActive" name="isActive"  defaultValue={values.isActive} onChange={handleChange} row>
											<FormControlLabel
												disabled={values.isEdit}
												value={"true"}
												control={<Radio color="primary" />}
												label={strings.enabled}
												labelPlacement="end"
											/>
											<FormControlLabel 
												value={"false"}
												control={<Radio color="primary" />}
												label={strings.disabled}
												labelPlacement="end"
											/>
										</RadioGroup>
									</Grid>
							{/* {
							values.errorCaptcha ?
								<Fragment>
									<Grid item container direction="row" justify="center" alignContent="center">
										<Grid item>
										<Error fontSize="inherit" />
										</Grid>
										<Grid item>
                                        <Typography>
											{values.errorCaptcha}
										</Typography>

										</Grid>
									</Grid>
								</Fragment> :
								null
						} */}

						</Grid>

					</DialogContent>

				</Grid>

				<Grid item container direction="column"  className={classes.padding}>
					<Grid item>
						<Button type="submit" variant="contained" color="primary" fullWidth>
							{strings.createANewUser}
						</Button>
					</Grid>
					<Grid item>
						<Button onClick={handleClose} fullWidth>
							{strings.cancel}
						</Button>
					</Grid>
				</Grid>

 
			</Grid>
		</form>
	</Dialog>
}