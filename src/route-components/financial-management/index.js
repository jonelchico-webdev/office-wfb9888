import React from 'react';
import {Route, Switch } from 'react-router-dom';
import AccessionOverview from './accession-overview';
import CompanyDepositAccountManagement from './company-deposit-account-management';
import CompanyDepositAccountManagementAdd from './company-deposit-account-management/add-company-deposit-account-management';
import CompanyDepositAccountManagementUpate from './company-deposit-account-management/update-company-deposit-account-management';
import PaymentReview from './payment-review';
import CompanyDepositReview from './company-deposit-review';
import OnlineDepositReview from './online-deposit-review';
import OnlineDepositAccountManagementAdd from './online-deposit-account-management/add-online-deposit-account-management';
import OnlineDepositAccountManagementUpate from './online-deposit-account-management/update-online-deposit-account-management';
import OnlineDepositAccountManagement from './online-deposit-account-management/online-deposit-account-management';
import ManualDeposit from './manual-deposit';
import ManualDepositReview from './manual-deposit-review';
import ManualWithdraw from './manual-withdraw';
import ManualWithdrawReview from './manual-withdraw-review';
import WalletManagement from './wallet-management';
import {ACCESSION_OVERVIEW, COMPANY_DEPOSIT_REVIEW, PAYMENT_REVIEW, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT, ONLINE_PAYMENT_PLATFORM_MANAGEMENT, 
	MANUAL_DEPOSIT, MANUAL_DEPOSIT_REVIEW, MANUAL_WITHDRAW, MANUAL_WITHDRAW_REVIEW, ONLINE_DEPOSIT_REVIEW, COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD,
	COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_UPDATE, ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD, ONLINE_PAYMENT_PLATFORM_MANAGEMENT_UPDATE, WALLET_MANAGEMENT
} from '../../paths';

export default function FinancialManagement() {
	return <Switch>
		<Route path={ACCESSION_OVERVIEW} component={AccessionOverview}/>
		<Route path={COMPANY_DEPOSIT_REVIEW} component={CompanyDepositReview}/>
		<Route path={ONLINE_DEPOSIT_REVIEW} component={OnlineDepositReview}/>
		<Route path={WALLET_MANAGEMENT} component={WalletManagement}/>
		<Route path={PAYMENT_REVIEW} component={PaymentReview}/>
		<Route path={COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_ADD} component={CompanyDepositAccountManagementAdd}/>
		<Route path={COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT_UPDATE} component={CompanyDepositAccountManagementUpate}/>
		<Route path={COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT} component={CompanyDepositAccountManagement}/>
		<Route path={ONLINE_PAYMENT_PLATFORM_MANAGEMENT_ADD} component={OnlineDepositAccountManagementAdd}/>
		<Route path={ONLINE_PAYMENT_PLATFORM_MANAGEMENT_UPDATE} component={OnlineDepositAccountManagementUpate}/>
		<Route path={ONLINE_PAYMENT_PLATFORM_MANAGEMENT} component={OnlineDepositAccountManagement}/>
		<Route path={MANUAL_DEPOSIT} component={ManualDeposit}/>
		<Route path={MANUAL_DEPOSIT_REVIEW} component={ManualDepositReview}/>
		<Route path={MANUAL_WITHDRAW} component={ManualWithdraw}/>
		<Route path={MANUAL_WITHDRAW_REVIEW} component={ManualWithdrawReview}/>
	</Switch>
}