import React from 'react';
import {Route, Switch } from 'react-router-dom';
import {COMMISSION_MANAGEMENT, COMMISSION_MANAGEMENT_ADD, COMMISSION_MANAGEMENT_MODIFY, COMMISSION_STATISTICS, DIVIDEND_MANAGEMENT, DIVIDEND_MANAGEMENT_ADD, DIVIDEND_MANAGEMENT_MODIFY, DIVIDEND_STATISTICS} from '../../paths';
import CommissionManagement from './commission-management';
import CommissionManagementAdd from './commission-management-add/commission-management-add';
import CommissionManagementModify from './commission-management-modify/commission-management-modify';
import DividendManagement from './dividend-management';
import DividendManagementAdd from './dividend-management-add/dividend-management-add';
import DividendManagementModify from './dividend-management-modify/dividend-management-modify';
import CommissionStatistics from './commission-statistics';
import DividendStatistics from './dividend-statistics';

export default function CommissionSystem() {
	return <Switch>
		<Route path={DIVIDEND_MANAGEMENT_ADD} component={DividendManagementAdd}/>
		<Route path={DIVIDEND_MANAGEMENT_MODIFY} component={DividendManagementModify}/>
		<Route path={COMMISSION_MANAGEMENT_ADD} component={CommissionManagementAdd}/>
		<Route path={COMMISSION_MANAGEMENT_MODIFY} component={CommissionManagementModify}/>
		<Route path={DIVIDEND_STATISTICS} component={DividendStatistics}/>
		<Route path={DIVIDEND_MANAGEMENT} component={DividendManagement}/>
		<Route path={COMMISSION_STATISTICS} component={CommissionStatistics}/>
		<Route path={COMMISSION_MANAGEMENT} component={CommissionManagement}/>
	</Switch>
}