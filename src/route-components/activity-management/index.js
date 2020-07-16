import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
	EVENTS_LIST,
	ACTIVITY_REVIEW,
	ADD_EVENT,
	MODIFY_EVENT,
	ACTIVITY_REPORT,
	MODIFY_ACTIVITY_TYPE, ADD_ACTIVITY_TYPE, ACTIVITY_TYPE_MANAGEMENT
} from '../../paths';
import EventList from './event-list/events-list';
import ActivityReview from './activity-review'
import AddEvent from './event-list/add-event'
import ModifyEvent from './event-list/modify-event/modify-event'
import ActivityReport from './event-list/activity-report';
import ActivityType from "./activity-type";
import ModifyActivityType from './activity-type/modify';
import AddType from "./activity-type/add";

export default function ActivityManagement() {
	return <Switch>
			<Route path={MODIFY_ACTIVITY_TYPE} component={ModifyActivityType}/>
			<Route path={ADD_ACTIVITY_TYPE} component={AddType}/>
			<Route path={ACTIVITY_TYPE_MANAGEMENT} component={ActivityType}/>
		    <Route path={MODIFY_EVENT} component={ModifyEvent}/>
		    <Route path={ADD_EVENT} component={AddEvent}/>
		    <Route path={ACTIVITY_REPORT} component={ActivityReport}/>
		    <Route path={EVENTS_LIST} component={EventList}/>
		    <Route path={ACTIVITY_REVIEW} component={ActivityReview}/>
	    </Switch>
}