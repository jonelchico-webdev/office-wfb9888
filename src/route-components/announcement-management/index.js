import React from 'react';
import { Route, Switch } from 'react-router-dom';
import systemNotification from './system-notification/index';
import systemNotificationView from './system-notification/view';
import systemNotificationUpdate from './system-notification/update';
import systemNotificationAdd from './system-notification/add';
import appPush from './app-push/index';
import appPushView from './app-push/view'
import copywritingManagement from './copywriting-management/index';
import homeCarouselManagement from './home-carousel-management';
import CopywritingForm from './copywriting-management/form';
import CopyView from './copywriting-management/view';
import memberNews from './member-news/index'
import { 
    SYSTEM_NOTIFICATION, 
    SYSTEM_NOTIFICATION_VIEW, 
    SYSTEM_NOTIFICATION_UPDATE, 
    SYSTEM_NOTIFICATION_ADD, 
    APP_PUSH, 
    APP_PUSH_VIEW,
    COPYWRITING_MANAGEMENT, 
    HOME_CAROUSEL_MANAGEMENT,COPYWRITING_MANAGEMENT_VIEW,
    MEMBER_NEWS,COPYWRITING_MANAGEMENT_FORM
} from '../../paths';



export default function AnnouncementManagement() {
    return <Switch>
        
        <Route path={SYSTEM_NOTIFICATION_UPDATE} component={systemNotificationUpdate} />
        <Route path={SYSTEM_NOTIFICATION_ADD} component={systemNotificationAdd} />
        <Route path={SYSTEM_NOTIFICATION_VIEW} component={systemNotificationView} />
        <Route path={SYSTEM_NOTIFICATION} component={systemNotification} />
        <Route path={APP_PUSH_VIEW} component={appPushView} />
        <Route path={APP_PUSH} component={appPush} />
        <Route path={COPYWRITING_MANAGEMENT_VIEW} component={CopyView} />
        <Route path={COPYWRITING_MANAGEMENT_FORM} component={CopywritingForm} />
        <Route path={COPYWRITING_MANAGEMENT} component={copywritingManagement} />
        <Route path={HOME_CAROUSEL_MANAGEMENT} component={homeCarouselManagement} />
        
        <Route path={MEMBER_NEWS} component={memberNews} /> 
        
    </Switch>

}