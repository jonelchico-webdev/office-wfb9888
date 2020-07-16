import React from 'react';
import {Route, Switch } from 'react-router-dom';
import UserManagement from './user-management';
import MemberDepositLevelAddMember from './member-deposit-level/new-member-level';
import MemberDepositLevelHierarchyMemberDetails from './member-deposit-level/hierarch-member-details';
import MemberDepositLevel from './member-deposit-level';
import UserDetails from './user-details'; 
import UserBankCardManagement from './user-bankcard-management';
import {MEMBER_DEPOSIT_LEVEL_UPDATE,MEMBER_DEPOSIT_LEVEL_HIERARCHY_MEMBER_DETAILS,USER_MANAGEMENT, MEMBER_DEPOSIT_LEVEL_ADD_MEMBER,USER_DETAILS, MEMBER_VIP_SYSTEM, USER_BANK_CARD_MANAGEMENT, MEMBER_DEPOSIT_LEVEL, AGENT_MANAGEMENT, AGENT_DETAILS, TRIAL_REVIEW, AGENT_REVIEW, VIP_WELFARE_CONFIGURATION, CONSUMPTION_BACKWATER, BASIC_GIFT_SETTING, WINNING_PRIZE, TRANSFER_GOLD} from '../../paths';
import MemberVIPSystem from './member-vip-system';
import trialReview from './trial-review'
import AgentManagement from './agent-management';
import AgentManagementDecendants from './agent-management/index-decendant';
import AgentDetails from './agent-management/agent-details'; 
import agentReview from './agent-review'
import BasicGiftSetting from './vip-welfare-configuration/basic-gift-setting';
import ConsumptionBackwater from './vip-welfare-configuration/consumption-backwater';
import WinningPrize from './vip-welfare-configuration/winning-prize';
import TransferGold from './vip-welfare-configuration/transfer-gold';
import VipWelfareConfiguration from './vip-welfare-configuration'
import MemberDepositLevelUpdateMember from './member-deposit-level/update-member-level'
import UserManagementDescendants from './user-management-descendants';
import agentReviewDescendants from './agent-review-descendants';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function MemberManagement() {
	return <Switch>
		<Route path={USER_DETAILS} component={UserDetails}/>

		<Route path={USER_BANK_CARD_MANAGEMENT} component={UserBankCardManagement}/>
		<Route path={USER_MANAGEMENT} component={cookies.get("userType") === "staff" ? UserManagement : UserManagementDescendants}/>
		<Route path={MEMBER_VIP_SYSTEM} component={MemberVIPSystem}/>
		<Route path={TRIAL_REVIEW} component={trialReview}/>
		<Route path={AGENT_DETAILS} component={AgentDetails}/>
		<Route path={AGENT_MANAGEMENT} component={cookies.get("userType") === "staff" ? AgentManagement : AgentManagementDecendants} />
		<Route path={MEMBER_DEPOSIT_LEVEL_ADD_MEMBER} component={MemberDepositLevelAddMember} />
		<Route path={MEMBER_DEPOSIT_LEVEL_HIERARCHY_MEMBER_DETAILS} component={MemberDepositLevelHierarchyMemberDetails} />
		<Route path={MEMBER_DEPOSIT_LEVEL_UPDATE} component={MemberDepositLevelUpdateMember} />
		<Route path={MEMBER_DEPOSIT_LEVEL} component={MemberDepositLevel} />
		<Route path={AGENT_REVIEW} component={cookies.get("userType") === "staff" ? agentReview : agentReviewDescendants}/>
		<Route path={BASIC_GIFT_SETTING} component={BasicGiftSetting}/>
		<Route path={CONSUMPTION_BACKWATER} component={ConsumptionBackwater}/>
		<Route path={WINNING_PRIZE} component={WinningPrize}/>
		<Route path={TRANSFER_GOLD} component={TransferGold}/>
		<Route path={VIP_WELFARE_CONFIGURATION} component={VipWelfareConfiguration}/>
	</Switch>
}