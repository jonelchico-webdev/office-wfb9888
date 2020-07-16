import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Grid } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {
	GamesOutlined, PeopleOutlineOutlined, AccountBalanceOutlined, AssignmentLateOutlined, AttachMoneyOutlined, VolumeUpOutlined,
	SettingsOutlined, HorizontalSplitOutlined, OutlinedFlagOutlined, TimelineOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined
} from '@material-ui/icons';
import DashboardOutlined from '../icons/dashboard';
import CommissionOutlined from '../icons/commission';
import {
	getLastPathName,
	ROOT,
	DASHBOARD,
	GAME_MANAGEMENT,
	MEMBER_MANAGEMENT,
	FINANCIAL_MANAGEMENT,
	OPERATIONAL_RISK_CONTROL,
	ELECTRIC_SALES,
	REPORT_MANAGEMENT,
	ANNOUNCEMENT_MANAGEMENT,
	ACTIVITY_MANAGEMENT,
	COMMISSION_SYSTEM,
	LOG_MANAGEMENT,
	SYSTEM_MANAGEMENT,
	DATA_ANALYSIS,
	AREA_AND_EQUIPMENT,
	ELECTRONIC_GAMES,
	ESPORT_GAMES,
	LIVE_VIDEO,
	CHESS_GAME,
	SPORTS_COMPETITION,
	LOTTERY_GAME,
	USER_MANAGEMENT,
	USER_BANK_CARD_MANAGEMENT,
	MEMBER_DEPOSIT_LEVEL,
	MEMBER_VIP_SYSTEM,
	TRIAL_REVIEW,
	VIP_WELFARE_CONFIGURATION,
	AGENT_MANAGEMENT,
	AGENT_REVIEW,
	ACCESSION_OVERVIEW,
	COMPANY_DEPOSIT_REVIEW,
	ONLINE_DEPOSIT_REVIEW,
	PAYMENT_REVIEW,
	COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT,
	ONLINE_PAYMENT_PLATFORM_MANAGEMENT,
	MANUAL_DEPOSIT,
	MANUAL_DEPOSIT_REVIEW,
	MEMBER_GAME_RECORD,
	FLOW_AUDIT,
	FIRST_PAYMENT_VERIFICATION,
	SALES_STATISTICS,
	OPERATIONAL_GENERAL_REPORT,
	PROFIT_AND_LOSS_STATEMENT,
	PROFIT_AND_LOSS_DATE_REPORT,
	RECHARGE_REPORT,
	SYSTEM_NOTIFICATION,
	MONEY_CONTROL_AUDIT,
	MONEY_CONTROL_CONDITION_MANAGEMENT,
	ACCOUNT_CHANGE_REPORT,
	USER_REPORT,
	APP_PUSH,
	COPYWRITING_MANAGEMENT,
	HOME_CAROUSEL_MANAGEMENT,
	MEMBER_NEWS,
	EVENTS_LIST,
	ACTIVITY_REVIEW,
	COMMISSION_MANAGEMENT,
	COMMISSION_STATISTICS,
	PARAMETER_CONFIGURATION,
	PERSONAL_INFORMATION,
	ACCOUNT_FUNDS,
	BACKGROUND_USER_MANAGEMENT,
	BACKGROUND_USER_RIGHTS_MANAGEMENT,
	USER_LOGIN_LOG,
	USER_REGISTRATION_LOG,
	ADMINISTRATOR_OPERATION_LOG,
	DIVIDEND_MANAGEMENT,
	DIVIDEND_STATISTICS,
	RECHARGE_DAILY_REPORT,
	MANUAL_WITHDRAW,
	MANUAL_WITHDRAW_REVIEW,
	WALLET_MANAGEMENT,
	COMMISSION_REVIEW,
	COMPANY_MANAGEMENT,
	COMPANY_MANAGEMENT_SUB,
	COMPANY_VIEW,
	ACTIVITY_TYPE_MANAGEMENT
} from '../paths';
import useLanguages from '../hooks/use-languages';
import { LayoutContext, drawerWidth } from '../layout-context';
import { AppFooterDrawer } from './app-footer'
import Cookies from 'universal-cookie';

const useStyles = makeStyles(theme => ({
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},

	},
	toolbar: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		...theme.mixins.toolbar
	},
	drawerPaper: {
		borderRight: '1px solid rgba(0, 0, 0, 0.12)',
		width: drawerWidth,
		top: 64,
		zIndex: 1
	},
	title: {
		flexGrow: 1
	},
	appName: {
		fontWeight: 'bold'
	},
	listItemText: {
		color: theme.palette.text.primaryOpacity65
	},
	menuItemSelected: {
		backgroundColor: theme.palette.background.selectedPrimary,
	},
	subMenuItemSelected: {
		backgroundColor: theme.palette.background.selectedSecondary,
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	}

}));

export default withRouter(function ResponsiveDrawer(props) {
	const { container, history, location, title, setTest } = props;
	const classes = useStyles();
	const theme = useTheme();
	const strings = useLanguages(ROOT);
	const cookies = new Cookies()
	const { handleMobileDrawerToggle, isDrawerMolibeOpen, isDrawerDesktopOpen } = useContext(LayoutContext);
	const mainMenuPath = `/${location.pathname.split('/')[1]}`;
	const subMenuPath = location.pathname.split('/')[2];
	const [selectedMainMenuItem, setSelectedMainMenuItem] = useState(`${mainMenuPath}`);
	const handleSelectedMainMenuItem = (path) => () => {
		setSelectedMainMenuItem(path === selectedMainMenuItem ? '/' : path);
	}
	/* TETST */

	if (selectedMainMenuItem) {
		setTest(selectedMainMenuItem)
	}

	/* END */

	useEffect(() => {
		if (location.pathname === '/') {
			setSelectedMainMenuItem(mainMenuPath)
		}
		// if (selectedMainMenuItem !== mainMenuPath) {
		// 	setSelectedMainMenuItem(mainMenuPath)
		// }
	}, [location.pathname, mainMenuPath, selectedMainMenuItem])

	const MyListItem = ({ hidden, text, action, listItemIcon, selected, sub, classes }) => {
		let className = selected ? (sub ? classes.subMenuItemSelected : classes.menuItemSelected) : '';
		return <Grid hidden={hidden}>
			<ListItem className={className} button divider={false} onClick={action}>
				{listItemIcon || <div style={{ minWidth: 56 }}></div>}
				<ListItemText className={classes.listItemText} primary={text}
					primaryTypographyProps={{ color: selected ? 'primary' : 'initial' }} />
				{(() => {
					if (!sub) {
						return selected ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined htmlColor={theme.palette.text.secondary} />
					}
				})()}
			</ListItem>
		</Grid>
	}
	console.log(props.testArr, 'asd')
	function pushHistory(url, state) {
		history.push({ pathname: url, state: state })
		if (props.testArr.find(o => (o.url === history.location.pathname))) {
			let element = document.getElementById(state)
			element.scrollIntoView({ behavior: "auto" })
		}
		// let element = document.getElementById("dataAnalysis") return  pushHistory( DATA_ANALYSIS, 'dataAnalysis'}) .scrollIntoView({behavior: "smooh"})}
	}

	const drawer = (<Fragment>
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
		}}>
			<List disablePadding={true}>
				<MyListItem
					selected={selectedMainMenuItem === DASHBOARD} 
					classes={classes} 
					text={strings.dashboard}
					listItemIcon={
						<ListItemIcon>
							<DashboardOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(DASHBOARD)} />
				{selectedMainMenuItem === DASHBOARD && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(DATA_ANALYSIS)} classes={classes}
						text={strings.dataAnalysis} action={() => pushHistory(DATA_ANALYSIS, "dataAnalysis")} />
					<MyListItem sub selected={subMenuPath === getLastPathName(AREA_AND_EQUIPMENT)} classes={classes}
						text={strings.areaAndEquipment} action={() => pushHistory(AREA_AND_EQUIPMENT, "areaAndEquipment")} />
				</List>}
				{/* <MyListItem hidden={ cookies.get("userType") === "staff" ? false : true } selected={selectedMainMenuItem === COMPANY_MANAGEMENT} text={strings.companyManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<GamesOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(COMPANY_MANAGEMENT)}
				/>
				{selectedMainMenuItem === COMPANY_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(COMPANY_MANAGEMENT_SUB)} classes={classes}
						text={strings.companyManagement} action={() => pushHistory(COMPANY_MANAGEMENT_SUB, 'companyManagement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(COMPANY_VIEW)} classes={classes}
						text={strings.companyView} action={() => pushHistory(COMPANY_VIEW, 'companyView')} />
				</List>} */}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === GAME_MANAGEMENT} text={strings.gameManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<GamesOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(GAME_MANAGEMENT)}
				/>
				{selectedMainMenuItem === GAME_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(ELECTRONIC_GAMES)} classes={classes}
						text={strings.electronicGames} action={() => pushHistory(ELECTRONIC_GAMES, 'electronicGames')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ESPORT_GAMES)} classes={classes}
						text={strings.eSportGames} action={() => pushHistory(ESPORT_GAMES, 'eSportGames')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(LIVE_VIDEO)} classes={classes}
						text={strings.liveVideo} action={() => pushHistory(LIVE_VIDEO, 'liveVideo')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(CHESS_GAME)} classes={classes}
						text={strings.chessGame} action={() => pushHistory(CHESS_GAME, 'chessGame')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(SPORTS_COMPETITION)} classes={classes}
						text={strings.sportsCompetition} action={() => pushHistory(SPORTS_COMPETITION, 'sportsCompetition')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(LOTTERY_GAME)} classes={classes}
						text={strings.lotteryGame} action={() => pushHistory(LOTTERY_GAME, 'lotteryGame')} />
				</List>}
				<MyListItem selected={selectedMainMenuItem === MEMBER_MANAGEMENT} text={strings.memberManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<PeopleOutlineOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(MEMBER_MANAGEMENT)} />
				{selectedMainMenuItem === MEMBER_MANAGEMENT && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(USER_MANAGEMENT)} classes={classes}
						text={strings.userManagement} action={() => pushHistory(USER_MANAGEMENT, 'userManagement')} />
					{
						cookies.get("userType") === "staff" ? <MyListItem sub selected={subMenuPath === getLastPathName(USER_BANK_CARD_MANAGEMENT)} classes={classes}
							text={strings.userBankCardManagement} action={() => pushHistory(USER_BANK_CARD_MANAGEMENT, 'userBankCardManagement')} /> : null
					}

					{/* <MyListItem sub selected={subMenuPath === getLastPathName(MEMBER_DEPOSIT_LEVEL)} classes={classes}
						text={strings.memberDepositLevel} action={() => pushHistory( MEMBER_DEPOSIT_LEVEL, 'memberDepositLevel')} /> */}

					<MyListItem sub selected={subMenuPath === getLastPathName(MEMBER_VIP_SYSTEM)} classes={classes}
						text={strings.memberVIPSystem} action={() => pushHistory(MEMBER_VIP_SYSTEM, 'memberVIPSystem')} />

					{/* <MyListItem sub selected={subMenuPath === getLastPathName(VIP_WELFARE_CONFIGURATION)} classes={classes}
						text={strings.vipWelfareConfiguration} action={() => pushHistory( VIP_WELFARE_CONFIGURATION, 'vipWelfareConfiguration')} /> */}

					<MyListItem sub selected={subMenuPath === getLastPathName(AGENT_MANAGEMENT)} classes={classes}
						text={strings.agentManagement} action={() => pushHistory(AGENT_MANAGEMENT, 'agentManagement')} />

					<MyListItem sub selected={subMenuPath === getLastPathName(AGENT_REVIEW)} classes={classes}
						text={strings.agentReview} action={() => pushHistory(AGENT_REVIEW, 'agentReview')} />

					{/* <MyListItem sub selected={subMenuPath === getLastPathName(TRIAL_REVIEW)} classes={classes}
						text={strings.trialReview} action={() => pushHistory( TRIAL_REVIEW, 'trialReview')} /> */}
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === FINANCIAL_MANAGEMENT} text={strings.financialManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<AccountBalanceOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(FINANCIAL_MANAGEMENT)} />
				{selectedMainMenuItem === FINANCIAL_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(ACCESSION_OVERVIEW)} classes={classes}
						text={strings.accessionOverview} action={() => pushHistory(ACCESSION_OVERVIEW, 'accessionOverview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(COMPANY_DEPOSIT_REVIEW)} classes={classes}
						text={strings.companyDepositReview} action={() => pushHistory(COMPANY_DEPOSIT_REVIEW, 'companyDepositReview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ONLINE_DEPOSIT_REVIEW)} classes={classes}
						text={strings.onlineDepositReview} action={() => pushHistory(ONLINE_DEPOSIT_REVIEW, 'onlineDepositReview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(PAYMENT_REVIEW)} classes={classes}
						text={strings.paymentReview} action={() => pushHistory(PAYMENT_REVIEW, 'paymentReview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT)} classes={classes}
						text={strings.companyDepositAccountManagement} action={() => pushHistory(COMPANY_DEPOSIT_ACCOUNT_MANAGEMENT, 'companyDepositAccountManagement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ONLINE_PAYMENT_PLATFORM_MANAGEMENT)} classes={classes}
						text={strings.onlinePaymentPlatformManagement} action={() => pushHistory(ONLINE_PAYMENT_PLATFORM_MANAGEMENT, 'onlinePaymentPlatformManagement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MANUAL_DEPOSIT)} classes={classes}
						text={strings.manualDeposit} action={() => pushHistory(MANUAL_DEPOSIT, 'manualDeposit')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MANUAL_DEPOSIT_REVIEW)} classes={classes}
						text={strings.manualDepositReview} action={() => pushHistory(MANUAL_DEPOSIT_REVIEW, 'manualDepositReview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MANUAL_WITHDRAW)} classes={classes}
						text={strings.manualWithdrawal} action={() => pushHistory(MANUAL_WITHDRAW, 'manualWithdrawal')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MANUAL_WITHDRAW_REVIEW)} classes={classes}
						text={strings.manualWithdrawalReview} action={() => pushHistory(MANUAL_WITHDRAW_REVIEW, 'manualWithdrawalReview')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(WALLET_MANAGEMENT)} classes={classes}
						text={strings.walletManagement} action={() => pushHistory(WALLET_MANAGEMENT, 'walletManagement')} />
				</List>}
				<MyListItem selected={selectedMainMenuItem === OPERATIONAL_RISK_CONTROL} text={strings.operationalRiskControl} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<AssignmentLateOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(OPERATIONAL_RISK_CONTROL)} />
				{selectedMainMenuItem === OPERATIONAL_RISK_CONTROL && <List disablePadding={true}>
					{
						cookies.get('userType') === "staff" ? <MyListItem sub selected={subMenuPath === getLastPathName(MONEY_CONTROL_AUDIT)} classes={classes}
							text={strings.moneyControlAudit} action={() => pushHistory(MONEY_CONTROL_AUDIT, 'moneyControlAudit')} /> : null
					}

					<MyListItem sub selected={subMenuPath === getLastPathName(MEMBER_GAME_RECORD)} classes={classes}
						text={strings.noteManagement} action={() => pushHistory(MEMBER_GAME_RECORD, 'noteManagement')} />
					{/* <MyListItem sub selected={subMenuPath === getLastPathName(FLOW_AUDIT)} classes={classes}
						text={strings.flowAudit} action={() => pushHistory( FLOW_AUDIT, 'flowAudit')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MONEY_CONTROL_CONDITION_MANAGEMENT)} classes={classes}
						text={strings.moneyControlConditionManagement} action={() => pushHistory( MONEY_CONTROL_CONDITION_MANAGEMENT, 'moneyControlConditionManagement')} /> */}
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === ELECTRIC_SALES} text={strings.electricSales} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<AttachMoneyOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(ELECTRIC_SALES)} />
				{selectedMainMenuItem === ELECTRIC_SALES && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(FIRST_PAYMENT_VERIFICATION)} classes={classes}
						text={strings.firstPaymentVerification} action={() => pushHistory(FIRST_PAYMENT_VERIFICATION, 'firstPaymentVerification')} />
					{/* <MyListItem sub selected={subMenuPath === getLastPathName(SALES_STATISTICS)} classes={classes}
						text={strings.salesStatistics} action={() => pushHistory( SALES_STATISTICS, 'salesStatistics')} /> */}
				</List>}
				<MyListItem selected={selectedMainMenuItem === REPORT_MANAGEMENT} text={strings.reportManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<TimelineOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(REPORT_MANAGEMENT)} />
				{selectedMainMenuItem === REPORT_MANAGEMENT && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(OPERATIONAL_GENERAL_REPORT)} classes={classes}
						text={strings.operationalGeneralReport} action={() => pushHistory(OPERATIONAL_GENERAL_REPORT, 'operationalGeneralReport')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(PROFIT_AND_LOSS_STATEMENT)} classes={classes}
						text={strings.profitAndLossDateStatement} action={() => pushHistory(PROFIT_AND_LOSS_STATEMENT, 'profitAndLossDateStatement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(PROFIT_AND_LOSS_DATE_REPORT)} classes={classes}
						text={strings.profitAndLossDateReport} action={() => pushHistory(PROFIT_AND_LOSS_DATE_REPORT, 'profitAndLossDateReport')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(RECHARGE_REPORT)} classes={classes}
						text={strings.rechargeReport} action={() => pushHistory(RECHARGE_REPORT, 'rechargeReport')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(RECHARGE_DAILY_REPORT)} classes={classes}
						text={strings.rechargeDailyReport} action={() => pushHistory(RECHARGE_DAILY_REPORT, 'rechargeDailyReport')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ACCOUNT_CHANGE_REPORT)} classes={classes}
						text={strings.accountChangeReport} action={() => pushHistory(ACCOUNT_CHANGE_REPORT, 'accountChangeReport')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(USER_REPORT)} classes={classes}
						text={strings.userReport} action={() => pushHistory(USER_REPORT, 'userReport')} />
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === ANNOUNCEMENT_MANAGEMENT} text={strings.announcementManagement} classes={classes}
					listItemIcon={

						<ListItemIcon>
							<VolumeUpOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(ANNOUNCEMENT_MANAGEMENT)} />
				{selectedMainMenuItem === ANNOUNCEMENT_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(SYSTEM_NOTIFICATION)} classes={classes}
						text={strings.systemNotification} action={() => pushHistory(SYSTEM_NOTIFICATION, 'systemNotification')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(MEMBER_NEWS)} classes={classes}
						text={strings.memberNews} action={() => pushHistory(MEMBER_NEWS, 'memberNews')} />
					{/* <MyListItem sub selected={subMenuPath === getLastPathName(APP_PUSH)} classes={classes}
						text={strings.appPush} action={() => pushHistory( APP_PUSH, 'appPush')} /> */}
					{/* <MyListItem sub selected={subMenuPath === getLastPathName(COPYWRITING_MANAGEMENT)} classes={classes}
						text={strings.copywritingManagement} action={() => pushHistory( COPYWRITING_MANAGEMENT, 'copywritingManagement')} /> */}
					{/* <MyListItem sub selected={subMenuPath === getLastPathName(HOME_CAROUSEL_MANAGEMENT)} classes={classes}
						text={strings.homeCarouselManagement} action={() => pushHistory( HOME_CAROUSEL_MANAGEMENT, 'homeCarouselManagement')} /> */}
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === ACTIVITY_MANAGEMENT} text={strings.activityManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<OutlinedFlagOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(ACTIVITY_MANAGEMENT)} />
				{selectedMainMenuItem === ACTIVITY_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(ACTIVITY_TYPE_MANAGEMENT)} classes={classes}
						text={strings.activityType} action={() => pushHistory(ACTIVITY_TYPE_MANAGEMENT, 'activityType')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(EVENTS_LIST)} classes={classes}
						text={strings.eventList} action={() => pushHistory(EVENTS_LIST, 'eventList')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ACTIVITY_REVIEW)} classes={classes}
						text={strings.activityReview} action={() => pushHistory(ACTIVITY_REVIEW, 'activityReview')} />
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === COMMISSION_SYSTEM} text={strings.commissionSystem} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<CommissionOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(COMMISSION_SYSTEM)} />
				{selectedMainMenuItem === COMMISSION_SYSTEM && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(COMMISSION_MANAGEMENT)} classes={classes}
						text={strings.commissionManagement} action={() => pushHistory(COMMISSION_MANAGEMENT, 'commissionManagement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(COMMISSION_STATISTICS)} classes={classes}
						text={strings.commissionStatistics} action={() => pushHistory(COMMISSION_STATISTICS, 'commissionStatistics')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(DIVIDEND_MANAGEMENT)} classes={classes}
						text={strings.dividendManagement} action={() => pushHistory(DIVIDEND_MANAGEMENT, 'dividendManagement')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(DIVIDEND_STATISTICS)} classes={classes}
						text={strings.dividendStatistics} action={() => pushHistory(DIVIDEND_STATISTICS, 'dividendStatistics')} />
				</List>}
				<MyListItem selected={selectedMainMenuItem === SYSTEM_MANAGEMENT} text={strings.systemManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<SettingsOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(SYSTEM_MANAGEMENT)} />
				{selectedMainMenuItem === SYSTEM_MANAGEMENT && <List disablePadding={true}>
					{
						cookies.get('userType') === "staff" ?
							<MyListItem sub selected={subMenuPath === getLastPathName(PARAMETER_CONFIGURATION)} classes={classes}
								text={strings.parameterConfiguration} action={() => pushHistory(PARAMETER_CONFIGURATION, 'parameterConfiguration')} />
							: null
					}
					<MyListItem sub selected={subMenuPath === getLastPathName(PERSONAL_INFORMATION)} classes={classes}
						text={strings.personalInformation} action={() => pushHistory(`${PERSONAL_INFORMATION}/${cookies.get('Username')}`, 'personalInformation')} />
					{
						cookies.get('userType') === "staff" ?
							<Fragment>
								<MyListItem sub selected={subMenuPath === getLastPathName(BACKGROUND_USER_MANAGEMENT)} classes={classes}
									text={strings.backgroundUserManagement} action={() => pushHistory(BACKGROUND_USER_MANAGEMENT, 'backgroundUserManagement')} />
								<MyListItem sub selected={subMenuPath === getLastPathName(BACKGROUND_USER_RIGHTS_MANAGEMENT)} classes={classes}
									text={strings.backgroundUserRightsManagement} action={() => pushHistory(BACKGROUND_USER_RIGHTS_MANAGEMENT, 'backgroundUserRightsManagement')} />
							</Fragment>
							:
							<Fragment>
								<MyListItem sub selected={subMenuPath === getLastPathName(ACCOUNT_FUNDS)} classes={classes}
									text={strings.accountFunds} action={() => pushHistory(ACCOUNT_FUNDS, 'accountFunds')} />
								<MyListItem sub selected={subMenuPath === getLastPathName(COMMISSION_REVIEW)} classes={classes}
									text={strings.commissionReview} action={() => pushHistory(COMMISSION_REVIEW, 'commissionReview')} />
							</Fragment>
					}
				</List>}
				<MyListItem hidden={cookies.get("userType") === "staff" ? false : true} selected={selectedMainMenuItem === LOG_MANAGEMENT} text={strings.logManagement} classes={classes}
					listItemIcon={
						<ListItemIcon>
							<HorizontalSplitOutlined fontSize="large" color="primary" />
						</ListItemIcon>
					}
					action={handleSelectedMainMenuItem(LOG_MANAGEMENT)} />
				{selectedMainMenuItem === LOG_MANAGEMENT && cookies.get("userType") === "staff" && <List disablePadding={true}>
					<MyListItem sub selected={subMenuPath === getLastPathName(USER_LOGIN_LOG)} classes={classes}
						text={strings.userLoginLog} action={() => pushHistory(USER_LOGIN_LOG, 'userLoginLog')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(USER_REGISTRATION_LOG)} classes={classes}
						text={strings.userRegistrationLog} action={() => pushHistory(USER_REGISTRATION_LOG, 'userRegistrationLog')} />
					<MyListItem sub selected={subMenuPath === getLastPathName(ADMINISTRATOR_OPERATION_LOG)} classes={classes}
						text={strings.administratorOperationLog} action={() => pushHistory(ADMINISTRATOR_OPERATION_LOG, 'administratorOperationLog')} />
				</List>}
			</List>

			<AppFooterDrawer />
		</div>
	</Fragment>
	);
	return (
		<nav className={classes.drawer} aria-label="App navigations" id="noScrollBar">

			<Hidden smUp>
				<Drawer
					container={container}
					variant="temporary"
					anchor={theme.direction === 'rtl' ? 'right' : 'left'}
					open={isDrawerMolibeOpen}
					onClose={handleMobileDrawerToggle}
					classes={{
						paper: classes.drawerPaper,
					}}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					{drawer}
					{/* <AppFooter /> */}
				</Drawer>
			</Hidden>
			<Hidden xsDown>
				<Drawer
					classes={{
						paper: classes.drawerPaper
					}}
					variant="persistent"
					open={isDrawerDesktopOpen}
				>
					{drawer}
				</Drawer>
			</Hidden>
		</nav>
	);
});