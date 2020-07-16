import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { COMPANY_MANAGEMENT_SUB, COMPANY_VIEW } from '../../paths';
import CompanyManagementSub from './company-management-sub/company-management'
import CompanyView from './company-view/company-view'

export default function CompanyManagement() {
	return <Switch>
		    <Route path={COMPANY_MANAGEMENT_SUB} component={CompanyManagementSub}/>
		    <Route path={COMPANY_VIEW} component={CompanyView}/>
	    </Switch>
}