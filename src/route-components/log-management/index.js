import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { USER_LOGIN_LOG, USER_REGISTRATION_LOG, ADMINISTRATOR_OPERATION_LOG } from '../../paths';
import UserLoginLog from './user-login-log';
import UserRegistrationLog from './user-registration-log';
import AdministratorOperationLog from './administrator-operation-log';

export default function LogManagement() {
	return <Switch>
		    <Route path={USER_LOGIN_LOG} component={UserLoginLog}/>
		    <Route path={USER_REGISTRATION_LOG} component={UserRegistrationLog}/>
		    <Route path={ADMINISTRATOR_OPERATION_LOG} component={AdministratorOperationLog}/>
	    </Switch>
}