import React from 'react';
import {Route, Switch } from 'react-router-dom';  
import {
    ACCOUNT_CHANGE_REPORT,
    USER_REPORT,PROFIT_AND_LOSS_DATE_REPORT,
    PROFIT_AND_LOSS_STATEMENT,
    RECHARGE_REPORT,
    RECHARGE_DAILY_REPORT,
    OPERATIONAL_GENERAL_REPORT
} from '../../paths';
import AccountChangeReport from './account-change-report';
import UserReport from './user-report';
import ProfitAndLossDateReport from './profit-and-loss-date-report';
import ProfitAndLossStatement from './profit-and-loss-statement';
import RechargeReport from './recharge-report'; 
import RechargeDailyReport from './recharge-daily-report';
import OperationalGeneralReport from './operational-general-report';

 

export default function ReportManagement() {
	return <Switch>
		 <Route path={ACCOUNT_CHANGE_REPORT} component={AccountChangeReport}/>
		 <Route path={USER_REPORT} component={UserReport}/>
         <Route path={PROFIT_AND_LOSS_DATE_REPORT} component={ProfitAndLossDateReport}/>
         <Route path={PROFIT_AND_LOSS_STATEMENT} component={ProfitAndLossStatement}/>
         <Route path={RECHARGE_REPORT} component={RechargeReport}/>
         <Route path={RECHARGE_DAILY_REPORT} component={RechargeDailyReport}/>
         <Route path={OPERATIONAL_GENERAL_REPORT} component={OperationalGeneralReport}/>
         <Route path={OPERATIONAL_GENERAL_REPORT} component={OperationalGeneralReport}/>
		
	</Switch>
}