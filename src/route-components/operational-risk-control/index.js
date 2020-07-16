import React from 'react';
import {Route, Switch } from 'react-router-dom';
import {MEMBER_GAME_RECORD, FLOW_AUDIT, MONEY_CONTROL_CONDITION_MANAGEMENT, MONEY_CONTROL_AUDIT} from '../../paths'
import MemberGameRecord from './member-game-record'
import MemberGameRecordDecendants from './member-game-record-decendants'
import FlowAudit from './flow-audit'
import MoneyControlConditionManagement from './money-control-condition-management'
import MoneyControlAudit from './money-control-audit'


import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function OperationalRiskControl() {

	return <Switch>
		<Route path={MEMBER_GAME_RECORD} component={cookies.get("userType") === "staff" ? MemberGameRecord : MemberGameRecordDecendants} />
		<Route path={FLOW_AUDIT} component={FlowAudit} />
		<Route path={MONEY_CONTROL_CONDITION_MANAGEMENT} component={MoneyControlConditionManagement} />
		<Route path={MONEY_CONTROL_AUDIT} component={MoneyControlAudit} />
	</Switch>
}