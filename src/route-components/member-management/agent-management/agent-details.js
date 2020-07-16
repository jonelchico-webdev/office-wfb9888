import React, { Fragment, useEffect } from 'react';
import { Grid, Paper, Divider, Typography, Button, TextField, RadioGroup, Radio, FormControlLabel } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { AGENT_MANAGEMENT } from '../../../paths';
import {
	ErrorOutline, AttachMoney, CreditCard, Security, Message, PersonPinCircle, VpnKey, Edit, PlayArrow
} from '@material-ui/icons';
import { BankCard, Loading } from '../../../components';
import Title from '../../../components/title';
import { useAgentDetailsQuery, useAgentTransactionStatusQuery, UPDATE_AGENT_MUTATE, useAgentBankCardQuery, CHANGE_PASSWORD_MUTATE } from '../../../queries-graphql/member-management/agent-management'
import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import swal from 'sweetalert2';


const useStyle = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2),

	},

	userData: {
		'&:hover $editText': {
			color: '#508FF4',
		}
	},

	conData: {
		'&:hover $editText': {
			color: '#508FF4',
		}
	},

	profileIcon: {
		fontSize: 96
	},

	bigAvatar: {
		width: 94,
		height: 94,
	},

	editText: {
		color: theme.palette.background.paper
	},

	editDelete: {
		'&:hover': {
			backgroundColor: '#E3E9F0',
			color: '#508FF4'
		}
	},
	bankCardCointainer: {
		backgroundColor: '#FFFFFF',
		// backgroundColor: '#E3E9F0',		
		padding: '30px',
		marginLeft: '20px'
	},
	img: {
		maxWidth: 250,
		height: 50,
		objectFit: "cover"
	},
	mainTextfield: {
		fontSize: 26,
		color: "#2196f3"
	}
}));



function AgentDetailsQuery(username) {
	const { data, loading } = useAgentDetailsQuery({ username: username })
	if (loading) {
		return null
	}
	return data.users.edges[0]
}

function AgentTransactionStatusQuery(username) {
	const { data, loading } = useAgentTransactionStatusQuery({ userName: username })
	if (loading) {
		return null
	}
	const statusData = data;

	if (statusData) {
		if (statusData.userTransactionStatses) {
			if (statusData.userTransactionStatses.edges.length > 0) {
				return statusData.userTransactionStatses.edges[0].node
			} else {
				return null
			}
		} else {
			return null
		}
	} else {
		return null
	}
}

function AgentBankCardData(username) {
	const { data, loading } = useAgentBankCardQuery({ user_Username: username });
	if (loading) {
		return null
	}
	const agentBankCardData = data;

	if (agentBankCardData) {
		if (agentBankCardData.userCards) {
			if (agentBankCardData.userCards.edges.length > 0) {
				return agentBankCardData.userCards.edges
			} else {
				return null
			}
		} else {
			return null
		}
	} else {
		return null
	}
}

export default function AgentDetails(props) {
	const classes = useStyle();
	const { history } = props;
	const [newStatus, setNewState] = React.useState();
	const strings = useLanguages(AGENT_MANAGEMENT);
	const [openPersonInfo, setOpenPersonInfo] = React.useState(true);
	const [openBasicInfo, setOpenBasicInfo] = React.useState(true);
	const [openConInfo, setOpenConInfo] = React.useState(true);
	const [editLoginPassword, setEditLoginPassword] = React.useState(false);
	const [editWithdrawPassword, setEditWithdrawPassword] = React.useState(false);
	const [editSecurity, setEditSecurity] = React.useState(false);

	const [filterValues, setFilterValues] = React.useState({
		id: null,
		name: null,
		birthDate: null,
		phone: null,
		wechat: null,
		qqNumber: null,
		email: null,
		isActive: null
	});

	const splitHistory = history.location.pathname.split('/', 4)
	const username = splitHistory[3]

	const [newPassword, setNewPassword] = React.useState({
		username: username,
		password: '',
		confirmPassword: '',
	})

	const agentDetail = AgentDetailsQuery(username)
	const agentTansaction = AgentTransactionStatusQuery(username)
	const agentBankCardData = AgentBankCardData(username)

	const [setRadioValue] = React.useState(true);
	console.log(agentDetail)
	console.log(filterValues)
	useEffect(() => {
		if (agentDetail) {
			setFilterValues({
				...filterValues,
				id: agentDetail.node.id,
				name: agentDetail.node.name,
				username: agentDetail.node.username,
				birthDate: agentDetail.node.birthDate,
				phone: agentDetail.node.phone,
				wechat: agentDetail.node.wechat,
				qqNumber: agentDetail.node.qqNumber,
				email: agentDetail.node.email,
				isActive: agentDetail.node.isActive
			})
		}
	}, [agentDetail])

	// function handleRadioChange(event) {
	// 	setRadioValue(event.target.value);
	// }

	const [updateAgent] = useMutation(UPDATE_AGENT_MUTATE)
	const [mutatePassword] = useMutation(CHANGE_PASSWORD_MUTATE)

	async function saveBtn() {
		let validPassword = true
		if (newPassword.password !== newPassword.confirmPassword) {
			validPassword = false
		}
		if (validPassword) {
			let noInputPassword = false
			if (newPassword.password !== '' || newPassword.confirmPassword !== '') {
				var resPass = await mutatePassword({
					variables: newPassword
				})
				if (resPass.data.AdminResetPassword.success) {
					noInputPassword = true
				} else if (!resPass.data.AdminResetPassword.success) {
					noInputPassword = false
				}
			} else {
				noInputPassword = true
			}
			const res = await updateAgent({
				variables: filterValues
			})
			// if (resPass.data.user.errors.length > 1 ) {
			// 	swal.fire({
			// 		position: 'center',
			// 		type: 'error',
			// 		title: res.data.user.errors[0].messages[0],
			// 		showConfirmButton: false,
			// 		timer: 1500
			// 	})
			// } else 
			if (res.data.user.errors.length === 0 && noInputPassword) {
				swal.fire({
					position: 'center',
					type: 'success',
					title: strings.successUpdate,
					showConfirmButton: false,
					timer: 1500
				})
			} else if (resPass.data.AdminResetPassword.success === false) {
				if (resPass.data.AdminResetPassword.errors[1] === "can only change the non staff account") {
					swal.fire({
						position: 'center',
						type: 'error',
						title: strings.errorUpdate1,
						showConfirmButton: false,
						timer: 1500
					})
				}

			} else {
				swal.fire({
					position: 'center',
					type: 'error',
					title: res.data.user.errors[0].messages[0],
					showConfirmButton: false,
					timer: 1500
				})
			}
			setOpenPersonInfo(true)
			setOpenBasicInfo(true)
			setOpenConInfo(true)
			setEditLoginPassword(false)
		} else {
			swal.fire({
				position: 'center',
				type: 'error',
				title: strings.errorNewPassword,
				showConfirmButton: false,
				timer: 1500
			})
		}
	}

	function handleFilterChange(event) {
		event.persist()
		let value = event.target.value
		if (event.target.name === "isActive") {
			value = JSON.parse(value)
		}
		setFilterValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
	}

	function handleNewPasswordChange(event) {
		event.persist()
		setNewPassword(oldNewPassword => ({
			...oldNewPassword,
			[event.target.name]: event.target.value
		}))
	}
	function editPersonalHandle(button) {
		if (button === 'editPersonButton') {
			setOpenPersonInfo(!openPersonInfo);
		} else if (button === 'editBasicButton') {
			setOpenBasicInfo(!openBasicInfo);
		} else {
			setOpenConInfo(!openConInfo);
		}
	}



	function editPassHandle(editPassButtonPar) {
		if (editPassButtonPar === 'editLoginPassButton') {
			setEditLoginPassword(!editLoginPassword);
			setNewPassword({
				username: username,
				password: '',
				confirmPassword: '',
			})
		} else if (editPassButtonPar === 'editWithdrawPassButton') {
			setEditWithdrawPassword(!editWithdrawPassword);
		} else {
			setEditSecurity(!editSecurity);
		}
	}


	// const statusSwitchHandle = agentId => event => {
	// 	agentManagement[agentId].status = event.target.checked
	// 	setNewState(event.target.checked);
	// };

	return <Grid container spacing={2}>
		<Title pageTitle={strings.agentDetails} />
		{agentDetail !== null
			? <Fragment>
				<Grid container className={classes.userData} item md={4} xs={12} sm={12}>
					<Paper elevation={1} style={{ width: "100%" }}>
						<Grid container direction="column">
							<Grid item className={classes.padding} container direction="row" >
								<Grid item xs={11} container direction="row" alignItems="center" spacing={2}>
									<Grid item lg={3}>
										<Avatar
											className={classes.bigAvatar}
											alt="Profile Picture"
											src="/profile2.png"
										/>
									</Grid>
									<Grid item lg={9}>
										<Typography color="textSecondary">{strings.realName}</Typography>
										<TextField
											className={classes.textField}
											value={filterValues.name}
											required
											type="text"
											name="name"
											onChange={handleFilterChange}
											disabled={openPersonInfo}
											margin="dense"
											InputProps={{
												classes: {
													input: classes.mainTextfield,
												},
											}}
										/>
										{/* {openPersonInfo === true ?
											<Typography variant="h4" style={{ fontWeight: 'bold' }} color="primary">{agentDetail.node.name}</Typography>
											:
											<TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={strings.realName} name="realName" onChange={handleFilterChange} value={agentDetail.node.username} />
										} */}
									</Grid>
								</Grid>
								<Grid item xs={1}>
									<Button size="small" onClick={() => editPersonalHandle('editPersonButton')} ><Typography color="primary"><Edit /></Typography></Button>
								</Grid>
							</Grid>
							<Grid item>
								<Divider light={true} />
							</Grid>

							<Grid item container className={classes.padding} spacing={1}>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.birthday}</Typography>
									<TextField disabled={openPersonInfo} className={classes.textfield} variant="outlined" type="date" margin="dense" fullWidth={true} name="birthDate" onChange={handleFilterChange} value={filterValues.birthDate} />
								</Grid>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.phoneNumber}</Typography>
									<TextField disabled={openPersonInfo} className={classes.textfield} type="number" variant="outlined" margin="dense" fullWidth={true} name="phone" onChange={handleFilterChange} value={filterValues.phone} />
								</Grid>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.microChannelNumber}</Typography>
									<TextField disabled={openPersonInfo} className={classes.textfield} variant="outlined" margin="dense" fullWidth={true} name="wechat" onChange={handleFilterChange} value={filterValues.wechat} />
								</Grid>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.qqNumber}</Typography>
									<TextField disabled={openPersonInfo} className={classes.textfield} type="number" variant="outlined" margin="dense" fullWidth={true} name="qqNumber" onChange={handleFilterChange} value={filterValues.qqNumber} />
								</Grid>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.email}</Typography>
									<TextField disabled={openPersonInfo} className={classes.textfield} variant="outlined" margin="dense" fullWidth={true} name="email" onChange={handleFilterChange} value={filterValues.email} />
								</Grid>
								<Grid item style={{ marginBottom: 13 }} lg={6} xs={12}>
									<Typography color="textSecondary">{strings.status}</Typography>
									<RadioGroup defaultValue={agentDetail.node.isActive.toString()} onChange={handleFilterChange} name="isActive" row >
										<FormControlLabel
											disabled={openPersonInfo}
											value={"true"}
											control={<Radio color="primary" size="small" />}
											label={strings.enable}
											labelPlacement="end"
										/>
										<FormControlLabel
											disabled={openPersonInfo}
											value={"false"}
											control={<Radio color="primary" size="small" />}
											label={strings.disable}
											labelPlacement="end"
										/>
									</RadioGroup>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item md={8} xs={12} className={classes.userData} sm={12} container >
					<Paper elevation={1} style={{ width: "100%" }}>
						<Grid container className={classes.padding} justify="space-between" >
							<Typography variant="h6">
								<Grid container>
									<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
										<ErrorOutline className={classes.typography} color="primary" />
									</Grid>
									<Grid item>
										{strings.basicInformation}
									</Grid>
								</Grid>
							</Typography>
						</Grid>
						<Divider light={true} />
						<Grid container className={classes.padding} spacing={2} alignItems="center">
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.agentLineSituation}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" > management <PlayArrow style={{ fontSize: 12 }} /> {agentDetail.node.username} {agentDetail.node.vipLevel ? <Fragment> <PlayArrow style={{ fontSize: 12 }} /> {agentDetail.node.vipLevel.name}</Fragment> : null}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.membershipNumber}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.pk}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.account}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.username}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.accountBalance}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.balance}</Typography>
								</Grid>
							</Grid>

							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.memberLevel}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.memberLevel ? agentDetail.node.memberLevel.name : "-"}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.VIPRating}:</Typography>
								</Grid>
								<Grid md={9} sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.vipLevel ? agentDetail.node.vipLevel.name : "-"}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.registered}:</Typography>
								</Grid>
								<Grid sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.registeredAt ? moment(agentDetail.node.registeredAt).format("YYYY-MM-DD HH:MM") : "-"}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.registrationURL}:</Typography>
								</Grid>
								<Grid sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.affiliateProfile ? agentDetail.node.affiliateProfile.affiliateUrl : "-"}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.lastLoginIP}:</Typography>
								</Grid>
								<Grid sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.lastLoginIp ? agentDetail.node.lastLoginIp : "-"}</Typography>
								</Grid>
							</Grid>
							<Grid lg={6} xs={12} item container direction="row" alignItems="center">
								<Grid sm={3} xs={12}>
									<Typography>{strings.lastLoginTime}:</Typography>
								</Grid>
								<Grid sm={9} xs={12}>
									<Typography variant="body1" >{agentDetail.node.lastLogin ? moment(agentDetail.node.lastLogin).format("YYYY-MM-DD HH:MM") : "-"}</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>

				<Grid item md={4} xs={12}>
					<Paper elevation={1}>
						<Grid container >
							<Typography className={classes.padding} variant="h6">
								<Grid container>
									<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
										<Message className={classes.typography} color="primary" />
									</Grid>
									<Grid item>
										{strings.remarksInformation}
									</Grid>
								</Grid>
							</Typography>
						</Grid>
						<Divider light={true} />
						<Grid className={classes.padding}>
							<Grid container justify="space-between">
								<Typography>
									<Grid container>
										<Grid item style={{ marginRight: 3 }}>
											<PersonPinCircle className={classes.typography} style={{ color: 'green' }} />
										</Grid>
										<Grid item>
											<Typography color="textSecondary">{agentDetail.node.notes}</Typography>
										</Grid>
									</Grid>
								</Typography>
							</Grid>
						</Grid>

					</Paper>
				</Grid>

				<Grid item md={8} xs={12} >
					<Grid container direction="column" spacing={2}>
						<Grid item xs={12} style={{marginBottom: 12}}>
							<Paper>
								<Grid container className={classes.padding} justify="space-between">
									<Typography variant="h6">
										<Grid container>
											<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
												<AttachMoney className={classes.typography} color="primary" />
											</Grid>
											<Grid item>
												{strings.consumerInformation}
											</Grid>
										</Grid>
									</Typography>

									{/* <Grid>
										<Button onClick={() => editPersonalHandle('editConButton')} ><Typography className={classes.editText}><Edit /></Typography></Button>
									</Grid> */}
								</Grid>
								<Divider light={true} />
								<Grid container className={classes.padding} spacing={2} >
									<Grid lg={6} xs={12} item container direction="row" alignItems="center">
										<Grid sm={6} xs={12}>
											<Typography>{strings.totalDepositAmount}:</Typography>
										</Grid>
										<Grid sm={6} xs={12}>
											<Typography variant="body1" >{agentTansaction ? agentTansaction.depositTotal : 0}</Typography>
										</Grid>
									</Grid>
									<Grid lg={6} xs={12} item container direction="row" alignItems="center">
										<Grid sm={6} xs={12}>
											<Typography>{strings.totalDepositsNumber}:</Typography>
										</Grid>
										<Grid sm={6} xs={12}>
											<Typography variant="body1" >{agentTansaction ? agentTansaction.depositCount : 0}</Typography>
										</Grid>
									</Grid>
									<Grid lg={6} xs={12} item container direction="row" alignItems="center">
										<Grid sm={6} xs={12}>
											<Typography>{strings.totalWithdrawalAmount}:</Typography>
										</Grid>
										<Grid sm={6} xs={12}>
											<Typography variant="body1" >{agentTansaction ? agentTansaction.withdrawalTotal : 0}</Typography>
										</Grid>
									</Grid>
									<Grid lg={6} xs={12} item container direction="row" alignItems="center">
										<Grid sm={6} xs={12}>
											<Typography>{strings.totalWithdrawalsNumber}:</Typography>
										</Grid>
										<Grid sm={6} xs={12}>
											<Typography variant="body1" >{agentTansaction ? agentTansaction.withdrawalCount : 0}</Typography>
										</Grid>
									</Grid>

								</Grid>
							</Paper>
						</Grid>


						<Grid item xs={12}>
							<Paper>
								<Grid container className={classes.padding}>
									<Typography variant="h6">
										<Grid container>
											<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
												<CreditCard className={classes.typography} color="primary" />
											</Grid>
											<Grid item>
												{strings.bankCardInformation}
											</Grid>
										</Grid>
									</Typography>
								</Grid>
								<Divider light={true} />
								<Grid container direction="row" justify="space-around"
									alignItems="center" className={classes.padding}>
									{
										agentBankCardData !== null ?
											agentBankCardData.map((o) => {
												return <BankCard dataContent={o.node} />
											})
											:
											<Grid item>
												<Typography variant="body1">{strings.noBankData}</Typography>
											</Grid>
									}
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} >
							<Paper>
								<Grid container className={classes.padding}>
									<Typography variant="h6">
										<Grid container>
											<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
												<Security className={classes.typography} color="primary" />
											</Grid>
											<Grid item>
												{strings.basicInformation}
											</Grid>
										</Grid>
									</Typography>
								</Grid>
								<Divider light={true} />
								<Grid container className={classes.padding} >
									<Grid container justify="space-between">
										<Typography color={editLoginPassword === true ? '' : "textSecondary"}>
											<Grid container style={{ marginLeft: '2em' }}>
												<VpnKey className={classes.typography} style={{ marginRight: 10 }} />
												{strings.loginPassword}
											</Grid>
										</Typography>
										<Button onClick={() => editPassHandle('editLoginPassButton')} style={{ width: 100, marginRight: 20, height: 27, backgroundColor: '#E3E9F0' }} variant="outlined" >
											<Typography color="textSecondary">
												{strings.edit}
											</Typography>
										</Button>
									</Grid>
									{
										editLoginPassword ? <Fragment>
											<Grid container direction="row" justify="space-between">
												<Grid item md={5} container direction="column" justify="center" alignItems="flex-end">
													<Typography>{strings.password}</Typography>
												</Grid>
												<Grid item md={6}>
													<TextField className={classes.textfield} type="password" variant="outlined" margin="dense" placeholder={strings.password} name="password" onChange={handleNewPasswordChange} value={newPassword.password} />
												</Grid>
											</Grid>
											<Grid container direction="row" justify="space-between">
												<Grid item md={5} container direction="column" justify="center" alignItems="flex-end">
													<Typography>{strings.confirmPassword}</Typography>
												</Grid>
												<Grid item md={6}>
													<TextField className={classes.textfield} type="password" variant="outlined" margin="dense" placeholder={strings.confirmPassword} name="confirmPassword" onChange={handleNewPasswordChange} value={newPassword.confirmPassword} />
												</Grid>
											</Grid>
										</Fragment>
											:
											null
									}
								</Grid>
								{/* <Divider light={true} />
								<Grid container>
								<Grid container className={classes.padding} justify="space-between">
								<Typography color={editWithdrawPassword === true ? '' : "textSecondary"}>
								<Grid container style={{ marginLeft: '2em' }}>
								<Money className={classes.typography} style={{ marginRight: 10 }} />
								{strings.withdrawPassword}
								</Grid>
								</Typography>
								<Button onClick={() => editPassHandle('editWithdrawPassButton')} style={{ width: 100, marginRight: 20, height: 27, backgroundColor: '#E3E9F0' }} variant="outlined" >
											<Typography color="textSecondary">
											{strings.edit}
											</Typography>
											</Button>
											</Grid>
											{
												editWithdrawPassword === true ?
												['newPassword', 're-type', 'oldPassword'].map(value =>
													<Grid container direction="row" justify="space-between">
													<Grid item md={5} container direction="column" justify="center" alignItems="flex-end">
													<Typography>{value}</Typography>
													</Grid>
													<Grid item md={6}>
													<TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={value} name={value} onChange={handleFilterChange} value={filterValues.loginPassword} />
													</Grid>
													</Grid>
													)
													:
											null
										}
										</Grid>
										<Divider light={true} />
										<Grid container>
										<Grid container className={classes.padding} justify="space-between">
										<Typography color={editSecurity === true ? '' : "textSecondary"}>
										<Grid container style={{ marginLeft: '2em' }}>
												<LockSharp className={classes.typography} style={{ marginRight: 10 }} />
												{strings.securityQuestion}
												</Grid>
												</Typography>
												<Button onClick={() => editPassHandle()} style={{ width: 100, marginRight: 20, height: 27, backgroundColor: '#E3E9F0' }} variant="outlined" >
												<Typography color="textSecondary">
												{strings.edit}
												</Typography>
												</Button>
												</Grid>
												{
													editSecurity === true ?
													['Question1', 'Question2', 'Question3'].map(value =>
														<Grid container direction="row" justify="space-between">
														<Grid item md={5} container direction="column" justify="center" alignItems="flex-end">
														<Typography>{value}</Typography>
														</Grid>
														<Grid item md={6}>
														<TextField className={classes.textfield} variant="outlined" margin="dense" placeholder={value} name={value} onChange={handleFilterChange} value={filterValues.loginPassword} />
														</Grid>
														</Grid>
														)
														:
														null
													}
								</Grid> */}
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			
				<Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>
					<Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" onClick={saveBtn} >{strings.save}</Button>
					<Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" onClick={() => history.goBack()}>{strings.cancel}</Button>
				</Grid>
			</Fragment> : <Loading />}
	</Grid>

}