import React from 'react';
import {Route, Switch } from 'react-router-dom';
import DataAnalysis from './data-analysis';
import AreaAndEquipment from './area-and-equipment';
import { DATA_ANALYSIS, AREA_AND_EQUIPMENT } from '../../paths';

export default function Dashboard() {
	return <Switch>
		<Route path={DATA_ANALYSIS} component={DataAnalysis}/>
		<Route path={AREA_AND_EQUIPMENT} component={AreaAndEquipment}/>
	</Switch>
}