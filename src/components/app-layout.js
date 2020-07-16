import React, { Fragment, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Route, Switch, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import AppBar from './app-bar';
import AppDrawer from './app-drawer';
import AppFooter from './app-footer'
import Dashboad from '../route-components/dashboard';
import CompanyManagement from '../route-components/company-management';
import GameManagement from '../route-components/game-management';
import MemberManagement from '../route-components/member-management';
import FinancialManagement from '../route-components/financial-management';
import ReportManagement from '../route-components/report-management';
import OperationalRiskControl from '../route-components/operational-risk-control';
import CommissionSystem from '../route-components/commission-system';
import ActivityManagement from '../route-components/activity-management';
import ElectricSales from '../route-components/electric-sales';
import SystemManagement from '../route-components/system-management';
import LogManagement from '../route-components/log-management';
import Login from '../route-components/login';
import DataAnalysis from '../route-components/dashboard/data-analysis'
import ViewInbox from '../route-components/announcement-management/member-news/view-inbox'
import NotFoundPage from './not-found-page'
import PersonalInformation from '../route-components/system-management/personal-information'
import { ROOT, LOGIN, MEMBER_NEWS_INBOX_VIEW, ERROR, DASHBOARD, GAME_MANAGEMENT, MEMBER_MANAGEMENT, FINANCIAL_MANAGEMENT, ACTIVITY_MANAGEMENT, ANNOUNCEMENT_MANAGEMENT, COMMISSION_SYSTEM, SYSTEM_MANAGEMENT, OPERATIONAL_RISK_CONTROL, REPORT_MANAGEMENT, ELECTRIC_SALES, LOG_MANAGEMENT, PERSONAL_INFORMATION, COMPANY_MANAGEMENT } from '../paths';
import { LayoutContext, drawerWidth } from '../layout-context';
import AnnouncementManagement from '../route-components/announcement-management';
import Cookies from 'universal-cookie';
import SweetAlert from 'sweetalert2-react';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { withRouter } from 'react-router-dom';
import { useUserQuery } from '../queries-graphql/use-login'

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
		flexGrow: 1,
		padding: theme.spacing(2),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		[theme.breakpoints.down('md')]: {
			marginLeft: -drawerWidth,
		},
		[theme.breakpoints.up('md')]: {
			marginLeft: 0,
		},
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	bottom: {
		marginBottom: theme.spacing(4)
	},
	toolbar: theme.mixins.toolbar,
}));

// const exclusivePaths = [LOGIN, ERROR];
const exclusivePaths = [LOGIN];

export default withRouter(function AppRoutes(props) {
	const { history } = props
	const classes = useStyles();
	const [isDrawerMolibeOpen, setIsDrawerMolibeOpen] = useState(false);
	const [isDrawerDesktopOpen, setIsDrawerDesktopOpen] = useState(true);
	function handleMobileDrawerToggle() {
		setIsDrawerMolibeOpen(!isDrawerMolibeOpen);
	}
	function handleDesktopDrawerToggle() {
		setIsDrawerDesktopOpen(!isDrawerDesktopOpen);
	}

	const [show, setShow] = useState(false)
	var JWT = cookies.get("JWT")

	const REFRESH_TOKEN = gql`
        mutation($token: String){
            LoginRefreshToken(input:{
                token: $token
            }){
                token
                payload
                success
                errors{
                    field
                    messages
                }
            }
        }
    `

	const [refreshJWT] = useMutation(REFRESH_TOKEN)

	async function refreshToken(JWT_TOKEN) {
		const res = await refreshJWT({
			variables: {token: JWT_TOKEN}
		})
		cookies.set('JWT', res.data.LoginRefreshToken.token, { path: '/' })
	}

	// const [timer, setTimer] = useState(100000)
	var timer = Number(cookies.get("timer"))

	useEffect(() => {
		if (history.location.pathname === '/login') {
			// setTimer(100000)
			cookies.set('timer', 100000, { path: '/' })
		} else {
			const interval = setInterval(() => {
				if(timer > 0) {
					timer = timer - 1000
					cookies.set('timer', timer, { path: '/' })
					// setTimer(timer - 1000)
					// console.log(timer, 'TIMER')
				} else if (timer == 0) {
					// console.log('Refreshed Token!')
					timer = 100000
					cookies.set('timer', timer, { path: '/' })
					// setTimer(100000)
					refreshToken(cookies.get("JWT"))
				}
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer, history.location.pathname]);

	let user = cookies.get('Username')
	let id = null

	const User = ({ username }) => {
		const { data, loading } = useUserQuery({ username: username })

		if (loading) {
			return null
		}

		if (cookies.get("ID", { path: "/" }) == null && data !== null && data.users !== null && data.users.edges.node !== null) {
			let id = data.users.edges[0].node.id
			cookies.set("ID", id, { path: '/' })
		}

		return null
	}
	
	const [test, setTest] = useState('')
	const [testArr, setTestArr] = useState([])

	return <LayoutContext.Provider value={{ isDrawerDesktopOpen, isDrawerMolibeOpen, handleMobileDrawerToggle, handleDesktopDrawerToggle }}>
		<div className={classes.root}>
			{
				user && timer === 100000 ? <User username={user} /> : null
			}
			<Route path="/" render={({ location: { pathname } }) => {
				if (exclusivePaths.find(o => o === pathname)) return null;
				if (cookies.get('Logged') == null) {
					return <Redirect to="/login" />
				}

				function goBackLogin() {
					cookies.remove("JWT", { path: "/" })
					cookies.remove("Username", { path: "/" })
					cookies.remove("Logged", { path: "/" })
					cookies.remove("ID", { path: "/" })
					history.push(LOGIN)
					setShow(false)
				}

				return <Fragment>
					<AppDrawer testArr={testArr} setTest={setTest} setTestArr={setTestArr}/>
					<AppBar testArr={testArr} test30={test} setTestArr={setTestArr}/>
					<main className={clsx(classes.content, {
						[classes.contentShift]: isDrawerDesktopOpen,
					})}>
						<div className={classes.toolbar} />
						<div className={classes.bottom}>

							<SweetAlert
								show={show}
								title="Your session has expired"
								text="Relog to Continue your session"
								onConfirm={goBackLogin}
							/>
							
							<ErrorHandler setTestArr={setTestArr}>
								{
									cookies.get("userType") === "staff" ? 
									<Switch>
										<Route exact path={ROOT} component={DataAnalysis} />
										<Route path={MEMBER_NEWS_INBOX_VIEW} component={ViewInbox}/>
										<Route path={DASHBOARD} component={Dashboad} />
										<Route path={COMPANY_MANAGEMENT} component={CompanyManagement} />
										<Route path={GAME_MANAGEMENT} component={GameManagement} />
										<Route path={MEMBER_MANAGEMENT} component={MemberManagement} />
										<Route path={FINANCIAL_MANAGEMENT} component={FinancialManagement} />
										<Route path={REPORT_MANAGEMENT} component={ReportManagement} />
										<Route path={OPERATIONAL_RISK_CONTROL} component={OperationalRiskControl} />
										<Route path={ACTIVITY_MANAGEMENT} component={ActivityManagement} />
										<Route path={ANNOUNCEMENT_MANAGEMENT} component={AnnouncementManagement} />
										<Route path={COMMISSION_SYSTEM} component={CommissionSystem} />
										<Route path={ELECTRIC_SALES} component={ElectricSales} />
										<Route path={SYSTEM_MANAGEMENT} component={SystemManagement} />
										<Route path={LOG_MANAGEMENT} component={LogManagement} />
										<Route component={NotFoundPage} />
									</Switch>
									:
									<Switch>
										<Route path={PERSONAL_INFORMATION} component={PersonalInformation}/>
										<Route exact path={ROOT} component={DataAnalysis} />
										{/* <Route path={MEMBER_NEWS_INBOX_VIEW} component={ViewInbox}/> */}
										<Route path={DASHBOARD} component={Dashboad} />
										{/* <Route path={GAME_MANAGEMENT} component={GameManagement} /> */}
										<Route path={MEMBER_MANAGEMENT} component={MemberManagement} />
										{/* <Route path={FINANCIAL_MANAGEMENT} component={FinancialManagement} /> */}
										<Route path={REPORT_MANAGEMENT} component={ReportManagement} />
										<Route path={OPERATIONAL_RISK_CONTROL} component={OperationalRiskControl} />
										{/* <Route path={ACTIVITY_MANAGEMENT} component={ActivityManagement} /> */}
										{/* <Route path={ANNOUNCEMENT_MANAGEMENT} component={AnnouncementManagement} /> */}
										{/* <Route path={COMMISSION_SYSTEM} component={CommissionSystem} /> */}
										{/* <Route path={ELECTRIC_SALES} component={ElectricSales} /> */}
										<Route path={SYSTEM_MANAGEMENT} component={SystemManagement} />
										{/* <Route path={LOG_MANAGEMENT} component={LogManagement} /> */}
										<Route component={NotFoundPage} />
									</Switch>
								}
							</ErrorHandler>
						</div>
						<AppFooter />
					</main>
				</Fragment>
			}} />
			<Route path={LOGIN} component={Login}/>
			{/* <Route path={ERROR} component={ErrorPage} /> */}
			{/* <Redirect from="*" to={ErrorPage}/> */}
		</div>
	</LayoutContext.Provider>

});

class ErrorHandler extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo
		})
		// You can also log error messages to an error reporting service here
	}

	render() {
		if (this.state.errorInfo) {
			cookies.remove("JWT", { path: "/" })
			cookies.remove("Username", { path: "/" })
			cookies.remove("Logged", { path: "/" })
			cookies.remove("userType", { path: "/" })
			// cookies.set("Logged", false, { path: "/" })
            cookies.remove("ID", { path: "/" })
            this.props.setTestArr([])
			return <Redirect to="/login" />
		}
		// Normally, just render children
		
		return this.props.children;
	}
}