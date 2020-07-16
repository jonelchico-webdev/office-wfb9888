import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { FIRST_PAYMENT_VERIFICATION, SALES_STATISTICS, DATA_VIEW } from '../../paths';
import FirstPaymentVerification from './first-payment-verification/first-payment-verification';
import SalesStatistics from './sales-statistics'
import DataView from './first-payment-verification/data-view'

export default function ElectricSales() {
	return <Switch>
		    <Route path={FIRST_PAYMENT_VERIFICATION} component={FirstPaymentVerification}/>
		    <Route path={SALES_STATISTICS} component={SalesStatistics}/>
		    <Route path={DATA_VIEW} component={DataView}/>
	    </Switch>
}