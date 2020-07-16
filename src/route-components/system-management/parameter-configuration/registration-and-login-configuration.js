import React, { useState } from 'react';
import {
	Paper, Grid, Button, Typography, TextField, FormControlLabel, Radio, FormControl, RadioGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Loading } from '../../../components';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import { REGISTRATION_AND_LOGIN_CONFIGURATION} from '../../../paths';
import { FormLayoutSingleColumn } from '../../../components/form-layouts';
import { ErrorOutline } from '@material-ui/icons';
import useRegistrationAndLoginConfigurationQuery from '../../../queries-graphql/system-management/parameter-configuration/query/registration-login-configuration'
import { REGISTRATION_AND_LOGIN_CONFIGURATION_MUTATION } from '../../../queries-graphql/system-management/parameter-configuration/mutation/registration-and-login-configuration-mutation'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},

	main: {
		paddingTop: theme.spacing(10),
		paddingLeft: theme.spacing(20),
		paddingRight: theme.spacing(20),
		paddingBottom: theme.spacing(10)
	},

	slider: {
		padding: theme.spacing(3),
		border: '1px grey solid',
		borderRadius: 2,
		marginBottom: 50
	},

	gridList: {
		width: 500,
		height: 250,
	},

	scrollableGrid: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: '#fff',
		borderRadius: 5,
	},

	cardHeader: {
		padding: theme.spacing(1, 2)
	},

	list: {
		height: 230,
		backgroundColor: "#fff",
		overflow: "auto",
	},

	button: {
		margin: theme.spacing(0.5, 0)
	}
}));

export default function RegistrationAndLoginConfiguration() {
	const classes = useStyles();
	const strings = useLanguages(REGISTRATION_AND_LOGIN_CONFIGURATION);
	const [refresh, setRefresh] = useState(false)

	const [values, setValues] = React.useState({
		whetherToOpenPCRegistration: null,
		whetherToOpenTheMobilePhoneRegistration: null,
		captchaVerifyCancel: null,
		baseUrlFrontEnd: '',
		pathAffiliateUrl: '',
		systemPermission: null,
	});

	function valuesHandler(event) {
		event.persist();
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}));
	}

	const [modifyConfiguration] = useMutation(REGISTRATION_AND_LOGIN_CONFIGURATION_MUTATION)

	async function modifyMutation() {
		const res = await modifyConfiguration({
			variables: {
				signupWebsite: values.whetherToOpenPCRegistration ? JSON.parse(values.whetherToOpenPCRegistration) : registrationAndLoginData.signupWebsite,
				signupMobile: values.whetherToOpenTheMobilePhoneRegistration ? JSON.parse(values.whetherToOpenTheMobilePhoneRegistration) : registrationAndLoginData.signupMobile,
				captchaVerifyCanceal: values.captchaVerifyCancel ? JSON.parse(values.captchaVerifyCancel) : registrationAndLoginData.captchaVerifyCanceal,
				baseUrlFrontEnd: values.baseUrlFrontEnd ? values.baseUrlFrontEnd : registrationAndLoginData.baseUrlFrontEnd,
				pathAffiliateUrl: values.pathAffiliateUrl ? values.pathAffiliateUrl : registrationAndLoginData.pathAffiliateUrl,
				systemPermission: values.systemPermission ? JSON.parse(values.systemPermission) : registrationAndLoginData.systemPermission,
			}
		})

		if(res.data) {
			setRefresh(!refresh)
			swal.fire({
				position: 'center',
				type: 'success',
				title: strings.registrationAndLoginConfigurationModified,
				showConfirmButton: false,
				timer: 1500
			})
		}
	}
	const {data, loading} = useRegistrationAndLoginConfigurationQuery({ refresh: refresh })
	if(loading) {
		return <Loading/>
	}

	const registrationAndLoginData = data.configurations

	return <FormLayoutSingleColumn>
		<Title pageTitle={strings.title} />
		<Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
			<Grid container justify="center" className={classes.main}>
				<Typography style={{ marginRight: 200 }} variant="h6">
					<Grid container alignContent="center">
						<Grid item style={{ marginRight: 5, paddingTop: 4 }}><ErrorOutline color="primary" /></Grid>
						{strings.registrationConfiguration}
					</Grid>
				</Typography>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.whetherToOpenPCRegistration}:</Typography>
					</Grid>

					<Grid container md={5}>
						<FormControl component="fieldset">
							<RadioGroup
								defaultValue={registrationAndLoginData.signupWebsite.toString()}
								name="whetherToOpenPCRegistration" 
								row 
								style={{ marginLeft: 10 }}
								onClick={valuesHandler}
							>
								<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label={strings.yes}
								/>
								<FormControlLabel
								value="false"
								control={<Radio required color="primary" />}
								label={strings.no}
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
				</Grid>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.whetherToOpenTheMobilePhoneRegistration}:</Typography>
					</Grid>

					<Grid container md={5}>
						<FormControl component="fieldset">
							<RadioGroup 
								defaultValue={registrationAndLoginData.signupMobile.toString()}
								name="whetherToOpenTheMobilePhoneRegistration" 
								row 
								style={{ marginLeft: 10 }}
								onClick={valuesHandler}
							>
								<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label={strings.yes}
								/>
								<FormControlLabel
								value="false"
								control={<Radio required color="primary" />}
								label={strings.no}
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
				</Grid>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.captchaVerifyCancel}:</Typography>
					</Grid>

					<Grid container md={5}>
						<FormControl component="fieldset">
							<RadioGroup 
								defaultValue={registrationAndLoginData.captchaVerifyCanceal.toString()}
								name="captchaVerifyCancel" 
								row 
								style={{ marginLeft: 10 }}
								onClick={valuesHandler}
							>
								<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label={strings.yes}
								/>
								<FormControlLabel
								value="false"
								control={<Radio required color="primary" />}
								label={strings.no}
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
				</Grid>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.baseUrlFrontEnd}:</Typography>
					</Grid>

					<Grid container md={5}>
						<Grid container md={5}>
							<TextField 
								variant="outlined" 
								defaultValue={registrationAndLoginData.baseUrlFrontEnd} 
								margin="dense"
								name="baseUrlFrontEnd" 
								onChange={valuesHandler}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.pathAffiliateUrl}:</Typography>
					</Grid>

					<Grid container md={5}>
						<Grid container md={5}>
							<TextField 
								variant="outlined" 
								defaultValue={registrationAndLoginData.pathAffiliateUrl} 
								margin="dense" 
								name="pathAffiliateUrl" 
								onChange={valuesHandler}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid container justify="center" direction="row">
					<Grid item md={5} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.systemPermission}:</Typography>
					</Grid>

					<Grid container md={5}>
						<FormControl component="fieldset">
							<RadioGroup 
								defaultValue={registrationAndLoginData.systemPermission.toString()}
								name="systemPermission" 
								row 
								style={{ marginLeft: 10, marginRight: 10 }}
								onClick={valuesHandler}
							>
								<FormControlLabel
								value="true"
								control={<Radio color="primary" />}
								label={strings.yes}
								/>
								<FormControlLabel
								value="false"
								control={<Radio required color="primary" />}
								label={strings.no}
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
				</Grid>
				

				{/* <Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.registrationContent}:</Typography>
					</Grid>
				</Grid> */}

				{/* <Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.referrer}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.withdrawalPassword}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.actualName}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.cellphoneNumber}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={3}>
						<FormControlLabel
							value={true}
							label={strings.SMSVerification}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.mailbox}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.microsignalCode}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.QQNumber}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>

					<Grid container md={2}>
						<FormControlLabel
							value={true}
							label={strings.requiredOrNot}
							labelPlacement="end"
							name="fuzzySearch"
							control={<Checkbox color="primary" />}
							onChange={handleFilterChange}
						/>
					</Grid>
				</Grid> */}

				{/* <Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.theNumberOfRegisteredUsersPerDayWithIP}:</Typography>
					</Grid>

					<Grid container md={5}>
						<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="theNumberOfRegisteredUsersPerDayWithIP" />
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.sameIPRegistrationInterval}:</Typography>
					</Grid>

					<Grid container md={5}>
						<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="sameIPRegistrationInterval" />
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.whetherToOpenTheMobilePhoneRegistration}:</Typography>
					</Grid>

					<Grid container md={5} alignItems="center">
						<FormControlLabel onChange={handleFilterChange} value={newStatus} control={<Radio color="primary" />} label={strings.typeOfText} />
						<FormControlLabel onChange={handleFilterChange} value={newStatus} control={<Radio color="primary" />} label={strings.calculationFormula} />
						<Typography color="textSecondary"><Help /></Typography>
					</Grid>
				</Grid>

				<Grid container>
					<Typography>{strings.useNationalAndRegionalMobileNumbersWhenRegistering}</Typography>
				</Grid>

				<Grid container className={classes.slider} justify="space-around" alignItems="center">
					{customList(strings.nationalAndRegionalMobilePhones, left)}
					<Grid item>
						<Grid container direction="column" alignItems="center">
							<Button
								variant="outlined"
								size="small"
								className={classes.button}
								onClick={handleCheckedRight}
								disabled={leftChecked.length === 0}
								aria-label="move selected right"
							>
								<ArrowForward />
							</Button>
							<Button
								variant="outlined"
								size="small"
								className={classes.button}
								onClick={handleCheckedLeft}
								disabled={rightChecked.length === 0}
								aria-label="move selected left"
							>
								<ArrowBack />
							</Button>
						</Grid>
					</Grid>
					{customList(strings.prohibitedMobilePhonesInCountriesAndRegions, right)}
					<Grid container className={classes.paper}>
						<Typography color="textSecondary">{strings.instruction}</Typography>
					</Grid>
				</Grid>

				<Typography variant="h6">
					<Grid container alignContent="center">
						<Grid item style={{ marginRight: 5, paddingTop: 4 }}><ErrorOutline color="primary" /></Grid>
						{strings.loginConfiguration}
					</Grid>
				</Typography>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.wrongPassword}:</Typography>
					</Grid>

					<Grid container md={5} alignItems="center">
						<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="sameIPRegistrationInterval" />
						<Typography style={{ marginLeft: 10 }}>{strings.VerificationCode}</Typography>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.wrongPassword}:</Typography>
					</Grid>

					<Grid container md={5} alignItems="center">
						<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="sameIPRegistrationInterval" />
						<Typography style={{ marginLeft: 10 }}>{strings.deactivateAccount}</Typography>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.captchaType}:</Typography>
					</Grid>

					<Grid container md={5} alignItems="center">
						<FormControlLabel onChange={handleFilterChange} value={newStatus} control={<Radio color="primary" />} label={strings.typeOfText} />
						<FormControlLabel onChange={handleFilterChange} value={newStatus} control={<Radio color="primary" />} label={strings.calculationFormula} />
						<Typography color="textSecondary"><Help /></Typography>
					</Grid>
				</Grid>

				<Grid container direction="row">
					<Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
						<Typography>{strings.memberIdleAutomaticLogoutTime}:</Typography>
					</Grid>

					<Grid container md={5} alignItems="center">
						<TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="sameIPRegistrationInterval" />
						<Typography style={{ marginLeft: 10 }}>{strings.minute}</Typography>
						<Typography color="textSecondary"><Help /></Typography>
					</Grid>
				</Grid> */}

				<Grid container justify="center" direction="row" style={{ marginTop: 50 }}>
					<Button variant="contained" color="primary" style={{ height: 30, marginRight: 10 }} onClick={modifyMutation}>{strings.save}</Button>
				</Grid>

			</Grid>
		</Paper>
	</FormLayoutSingleColumn>
}