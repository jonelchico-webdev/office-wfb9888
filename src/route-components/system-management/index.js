import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import {
// 	REGISTRATION_AND_LOGIN_CONFIGURATION, PARAMETER_CONFIGURATION, BASIC_SETTINGS, ACCESS_RESTRICTION_CONFIGURATION, MOBILE_PHONE_BAR_CONFIGURATION,
// 	SMS_PLATFORM_CONFIGURATION, FINANCIAL_CONFIGURATION, CUSTOMER_SERVICE_CONFIGURATION,
// 	PERSONAL_INFORMATION, BACKGROUND_USER_MANAGEMENT, BACKGROUND_USER_RIGHTS_MANAGEMENT, HOME_FLOATING_WINDOW_CONFIGURATION,
// 	DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION, GAME_RECOMMENDATION_CONFIGURATION
// } from '../../paths';
import {
	PARAMETER_CONFIGURATION,
	PERSONAL_INFORMATION, BACKGROUND_USER_MANAGEMENT, BACKGROUND_USER_RIGHTS_MANAGEMENT, ACCOUNT_FUNDS, COMMISSION_REVIEW
} from '../../paths';
import ParameterConfiguration from './parameter-configuration';
import CommissionReview from './commission-review'
import AccountFunds from './account-funds';
import PersonalInformation from './personal-information'
import BackGroundUserManagement from './background-user-management'
import BackGroundUserRightsManagement from './background-user-rights-management'
// import BasicSettings from './parameter-configuration';
// import RegistrationAndLoginConfiguration from './parameter-configuration/registration-and-login-configuration';
// import AccessRestrictionConfiguration from './parameter-configuration/access-restriction-configuration';
// import MobilePhoneBarConfiguration from './parameter-configuration/mobile-phone-bar-configuration';
// import HomeFloatingWindowConfiguration from './parameter-configuration/home-floating-window-configuration';
// import FinancialConfiguration from './parameter-configuration/financial-configuration';
// import CustomerServiceConfiguration from './parameter-configuration/customer-service-configuration';
// import SMSPlatformConfiguration from './parameter-configuration/sms-platform-configuration';
// import DownloadMobilePhoneQRCodeConfiguration from './parameter-configuration/download-mobile-phone-qr-code-configuration';
// import GameRecommendationConfiguration from './parameter-configuration/game-recommended-configuration';

export default function SystemManagement() {

	
	return <Switch>
		<Route path={BACKGROUND_USER_RIGHTS_MANAGEMENT} component={BackGroundUserRightsManagement} />
		<Route path={BACKGROUND_USER_MANAGEMENT} component={BackGroundUserManagement} />
		<Route path={COMMISSION_REVIEW} component={CommissionReview} />
		<Route path={PERSONAL_INFORMATION} component={PersonalInformation} />
		<Route path={ACCOUNT_FUNDS} component={AccountFunds} />
		{/* <Route path={MOBILE_PHONE_BAR_CONFIGURATION} component={MobilePhoneBarConfiguration} /> */}
		{/* <Route path={HOME_FLOATING_WINDOW_CONFIGURATION} component={HomeFloatingWindowConfiguration} /> */}
		{/* <Route path={GAME_RECOMMENDATION_CONFIGURATION} component={GameRecommendationConfiguration} /> */}
		{/* <Route path={SMS_PLATFORM_CONFIGURATION} component={SMSPlatformConfiguration} /> */}
		{/* <Route path={ACCESS_RESTRICTION_CONFIGURATION} component={AccessRestrictionConfiguration} /> */}
		{/* <Route path={DOWNLOAD_MOBILE_PHONE_QR_CODE_CONFIGURATION} component={DownloadMobilePhoneQRCodeConfiguration} /> */}
		{/* <Route path={CUSTOMER_SERVICE_CONFIGURATION} component={CustomerServiceConfiguration} /> */}
		{/* <Route path={FINANCIAL_CONFIGURATION} component={FinancialConfiguration} /> */}
		{/* <Route path={REGISTRATION_AND_LOGIN_CONFIGURATION} component={RegistrationAndLoginConfiguration} /> */}
		{/* <Route path={BASIC_SETTINGS} component={BasicSettings} /> */}
		<Route path={PARAMETER_CONFIGURATION} component={ParameterConfiguration} />
	</Switch>
}