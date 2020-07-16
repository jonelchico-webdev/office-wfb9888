import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import {
	REGISTRATION_AND_LOGIN_CONFIGURATION, PARAMETER_CONFIGURATION, ACCESS_RESTRICTION_CONFIGURATION, MOBILE_PHONE_BAR_CONFIGURATION,
	SMS_PLATFORM_CONFIGURATION, FINANCIAL_CONFIGURATION, CUSTOMER_SERVICE_CONFIGURATION, HOME_FLOATING_WINDOW_CONFIGURATION,
	DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION, GAME_RECOMMENDATION_CONFIGURATION, BASIC_SETTINGS
} from '../../../paths';
// import { FormLayoutSingleColumn } from '../../../components/form-layouts';
// import { ErrorOutline, Help } from '@material-ui/icons';
// import Switch from '@material-ui/core/Switch';
import { Route, Switch as SwitchRouter } from 'react-router-dom';
import BasicSettings from './basic-settings'
import RegistrationAndLoginConfiguration from './registration-and-login-configuration';
import AccessRestrictionConfiguration from './access-restriction-configuration';
import MobilePhoneBarConfiguration from './mobile-phone-bar-configuration';
import HomeFloatingWindowConfiguration from './home-floating-window-configuration';
import FinancialConfiguration from './financial-configuration';
import CustomerServiceConfiguration from './customer-service-configuration';
import SMSPlatformConfiguration from './sms-platform-configuration';
import DownloadMobilePhoneQRCodeConfiguration from './download-mobile-phone-qr-code-configuration';
import GameRecommendationConfiguration from './game-recommended-configuration';

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},

	main: {
		paddingTop: theme.spacing(10),
		paddingLeft: theme.spacing(40),
		paddingRight: theme.spacing(40),
		paddingBottom: theme.spacing(10)
	}
}));

export default function ParameterConfiguration(props) {
	const { history } = props;
	const classes = useStyles();
	const strings = useLanguages(PARAMETER_CONFIGURATION);

	const [selectedButton, setSelectedButton] = useState(history.location.pathname)

	function selectBtn(URL, state) {
		setSelectedButton(URL)
		history.push({pathname: URL, state: state})
	}
	return <Grid className={classes.paper} container direction="column" spacing={2}>
		
		<Grid item xs={12} container direction="row" spacing={2}>
			<Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == BASIC_SETTINGS || history.location.pathname == PARAMETER_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(BASIC_SETTINGS, "basicSetting")}>{strings.basicSetting}</Button></Grid>
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == FINANCIAL_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(FINANCIAL_CONFIGURATION, "financialConfiguration")}>{strings.financialConfiguration}</Button></Grid> */}
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == CUSTOMER_SERVICE_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(CUSTOMER_SERVICE_CONFIGURATION, "customerServiceConfiguraion")}>{strings.customerServiceConfiguraion}</Button></Grid> */}
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION, "downloadMobilePhoneQRCodeConfiguration")}>{strings.downloadMobilePhoneQRCodeConfiguration}</Button></Grid> */}
			<Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == REGISTRATION_AND_LOGIN_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(REGISTRATION_AND_LOGIN_CONFIGURATION, "registrationAndLoginConfiguration")}>{strings.registrationAndLoginConfiguration}</Button></Grid>
			<Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == ACCESS_RESTRICTION_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(ACCESS_RESTRICTION_CONFIGURATION, 'accessRestrictionConfiguration')}>{strings.accessRestrictionConfiguration}</Button></Grid>
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == SMS_PLATFORM_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(SMS_PLATFORM_CONFIGURATION, "SMSPlatformConfiguration")}>{strings.SMSPlatformConfiguration}</Button></Grid> */}
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == GAME_RECOMMENDATION_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(GAME_RECOMMENDATION_CONFIGURATION, "gameRecommendationConfiguration")}>{strings.gameRecommendationConfiguration}</Button></Grid> */}
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == HOME_FLOATING_WINDOW_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(HOME_FLOATING_WINDOW_CONFIGURATION, "homeFloating")}>{strings.homeFloating}</Button></Grid> */}
			{/* <Grid item style={{ paddingLeft: 0 }}><Button variant="contained" style={{ backgroundColor: history.location.pathname == MOBILE_PHONE_BAR_CONFIGURATION ? '#651fff' : '#508FF4', color: '#fff' }} onClick={() => selectBtn(MOBILE_PHONE_BAR_CONFIGURATION, "mobilePhoneConfig")}>{strings.mobilePhoneConfig}</Button></Grid> */}
		</Grid>

		<SwitchRouter>
			<Route path={BASIC_SETTINGS} component={BasicSettings} />
			<Route path={REGISTRATION_AND_LOGIN_CONFIGURATION} component={RegistrationAndLoginConfiguration} />
			<Route path={FINANCIAL_CONFIGURATION} component={FinancialConfiguration} />
			<Route path={CUSTOMER_SERVICE_CONFIGURATION} component={CustomerServiceConfiguration} />
			<Route path={DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION} component={DownloadMobilePhoneQRCodeConfiguration} />
			<Route path={ACCESS_RESTRICTION_CONFIGURATION} component={AccessRestrictionConfiguration} />
			<Route path={SMS_PLATFORM_CONFIGURATION} component={SMSPlatformConfiguration} />
			<Route path={GAME_RECOMMENDATION_CONFIGURATION} component={GameRecommendationConfiguration} />
			<Route path={HOME_FLOATING_WINDOW_CONFIGURATION} component={HomeFloatingWindowConfiguration} />
			<Route path={MOBILE_PHONE_BAR_CONFIGURATION} component={MobilePhoneBarConfiguration} />
			<Route path={PARAMETER_CONFIGURATION} component={BasicSettings} />
		</SwitchRouter>

	</Grid >
}