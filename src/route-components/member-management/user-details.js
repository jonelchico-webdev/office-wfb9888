import React, { useState, useEffect, Fragment } from 'react';
import { Grid, Paper, Divider, Typography, Button, FormControlLabel, Radio, Box, TextField, RadioGroup } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { USER_MANAGEMENT } from '../../paths';
import {
	ErrorOutline, AttachMoney, CreditCard, Security, Message, Clear,
	FiberManualRecord, AddCommentOutlined, LockSharp, PersonPinCircle, VpnKey, PermIdentity, Edit, PlayArrow, Comment
} from '@material-ui/icons';
import { USER_MANAGEMENT_QUERY } from '../../queries/member-management';
import Switch from '@material-ui/core/Switch';
import { useUserTransactionStatses, useUserBankCardQuery, CHANGE_PASSWORD_MUTATE, UPDATE_USER_MUTATE, UPDATE_MEMBER_LEVEL, useMemberLevel, useUserDetailsQuery, useMemberLevelName } from '../../queries-graphql/member-management/user-management';
import { useMutation } from '@apollo/react-hooks'
import { Loading, Title, BankCard } from '../../components/'
import swal from 'sweetalert2';
import moment from 'moment'
import AdjustmentMemberLevel from '../../components/adjust-member-level-modal'

const useStyle = makeStyles(theme => ({
	padding: {
		padding: theme.spacing(2)
	},

	container: {
		display: 'flex',
		flexWrap: 'wrap',
		spacing: 2
	},

	// container: {
	// 	flexWrap: "nowrap", 
	// 	spacing: 2
	// }, 
	flexEnd: {
		[theme.breakpoints.up('sm')]: {
			alignItems: "flex-end",
		},

	},
	keyContainer: {
		[theme.breakpoints.only('lg')]: {
			marginLeft: "2em",
		},

	},
	userData: {
		padding: theme.spacing(2),
		position: "relative"

	},
	// avatar: {
	// 	[theme.breakpoints.down('md')]: {
	// 		alignItems: 'center',
	// 		// margin: 'auto'
	// 		// marginLeft: '90px'
	// 	},
	// },
	edit: {
		position: "absolute",
		top: "16px",
		right: "16px"
	},
	profileIcon: {
		fontSize: 96
	},

	bigAvatar: {
		width: 94.46,
		height: 93,
	},
	noteField: {
		backgroundColor: '#ffffff',
	},


	editText: {
		'&:hover': {
			color: '#508FF4'
		},
		color: theme.palette.background.paper
	},

	editDelete: {
		'&:hover': {
			backgroundColor: '#E3E9F0',
			color: '#508FF4'
		}
	},
	img: {
		maxWidth: 250,
		height: 50,
		objectFit: "cover"
	},

	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2)
	},
	dense: {
		marginTop: theme.spacing(2),
	},
	menu: {
		width: 200,
	},
	mainTextfield: {
		fontSize: 26,
		color: "#2196f3"
	},
	subTextfield: {
		fontSize: 15,
	},
	subTextfield1: {
		width: 200,

	}
}));

const IOSSwitch = withStyles(theme => ({
	root: {
		width: 30,
		height: 15,
		padding: 0,
	},
	switchBase: {
		padding: 1,
		"&$checked": {
			color: theme.palette.common.white,
			"& + $track": {
				backgroundColor: "#689f38",
				opacity: 1,
				border: "none",
			}
		},
		"&$focusVisible $thumb": {
			color: "#689f38",
			border: "6px solid #fff"
		}
	},
	thumb: {
		width: 11,
		height: 10,
		marginTop: 1,
		marginLeft: 5
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid #d84315`,
		backgroundColor: '#d84315',
		marginLeft: 1,
		opacity: 1,
		transition: theme.transitions.create(["background-color", "border"])
	},
	checked: {},
	focusVisible: {}
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked
			}}
			{...props}
		/>
	);
});

function UserData(userName) {
	const { data, loading } = useUserDetailsQuery({ username: userName });
	if (loading) {
		return <Loading />
	}
	return data.users.edges[0].node;
}

function UserBankCardData(userName) {
	const { data, loading } = useUserBankCardQuery({ user_Username: userName, enabled: true });
	if (loading) {
		return null
	}
	const userBankCardData = data;

	if (userBankCardData) {
		if (userBankCardData.userCards) {
			if (userBankCardData.userCards.edges.length > 0) {
				return userBankCardData.userCards.edges
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

function TransactionData(userName) {
	const { data, loading } = useUserTransactionStatses({ userName: userName });
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

function MemberLevelQuery(memberLevelsValue) {
	const { data, loading } = useMemberLevel({ memberLevel: memberLevelsValue })
	if (loading) {
		return null
	}
	const memberLevel = data.memberLevels.edges

	return memberLevel
}

function MemberLevelNameQuery(memberLevelsValue) {
	const { data, loading } = useMemberLevelName({ memberLevel: memberLevelsValue })
	if (loading) {
		return null
	}
	const memberLevelName = data.memberLevels.edges

	return memberLevelName
}

export default function UserDetails(props) {
	const { history, match } = props;
	const classes = useStyle();
	const strings = useLanguages(USER_MANAGEMENT);
	const ID = match.params.id
	const [error, setError] = useState(null);
	const [openMemberLevelModal, setOpenMemberLevelModal] = useState(false)
	const [editRemarksNotes, setEditRemarksNotes] = useState(false)
	const [memberLevelsValue, setMemberLevelsValue] = useState("")
	const [memberLevelsNameValue, setMemberLevelsNameValue] = useState("")
	const [controlHandler, setControlHandler] = useState({
		isEditLoginPassword: true,
		isEditUserData: true
	})
	const [editLoginPassword, setEditLoginPassword] = useState(false);


	const splitHistory = history.location.pathname.split('/', 4)
	const username = splitHistory[3]


	const [values, setValues] = useState({
		id: null,
		name: null,
		username: null,
		birthDate: null,
		phone: null,
		wechat: null,
		qqNumber: null,
		email: null,
		isActive: null,
		userNotes: null
	});

	const [newPassword, setNewPassword] = React.useState({
		username: ID,
		password: '',
		confirmPassword: '',
	})

	const Status = [
		{
			value: true,
			label: 'Active',
		},
		{
			value: false,
			label: 'Inactive',
		},
	];

	const [mutateUserPass] = useMutation(CHANGE_PASSWORD_MUTATE)
	const [updateUser] = useMutation(UPDATE_USER_MUTATE)
	const [updateMemberLevel] = useMutation(UPDATE_MEMBER_LEVEL)
	const userAccounts = UserData(username)
	const statusData = TransactionData(ID)
	const userBankCardData = UserBankCardData(ID)
	const memberLevels = MemberLevelQuery(memberLevelsValue)
	const memberLevelsName = MemberLevelNameQuery(memberLevelsValue)
	// console.log(memberLevelsName, 'qweqee')
	useEffect(() => {
		if (userAccounts) {
			setValues({
				...values,
				id: userAccounts.id,
				name: userAccounts.name,
				username: userAccounts.username,
				birthDate: userAccounts.birthDate,
				phone: userAccounts.phone,
				wechat: userAccounts.wechat,
				qqNumber: userAccounts.qqNumber,
				email: userAccounts.email,
				isActive: userAccounts.isActive,
				userNotes: userAccounts.userNotes
			})
			// setRemarksNotes(userAccounts.userNotes)
			if (memberLevelsValue == "") {
				setMemberLevelsNameValue(userAccounts.memberLevel ? userAccounts.memberLevel.name : "-")
			}
		}
	}, [userAccounts])

	console.log(values, 'remarkssss')

	// console.log(userAccounts)

	// useEffect(() => {
	// 	if(memberLevelsValue !== "") {

	// 		if(memberLevelsName) {
	// 			console.log(memberLevelsName)
	// 			setMemberLevelsNameValue(memberLevelsName[0].node.name)
	// 		}
	// 	}
	// }, [memberLevelsValue])

	function handleNewPasswordChange(event) {
		event.persist()
		setNewPassword(oldNewPassword => ({
			...oldNewPassword,
			[event.target.name]: event.target.value
		}))
	}


	function handleValuesChange(event) {
		event.persist();
		let x = event.target.value;
		if (event.target.name === "isActive") {
			x = JSON.parse(x)
		}
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: x,
		}));

	}

	async function mutateAdd(value) {
		if (values.email.includes("@")) {
			let validPassword = true
			if (newPassword.password !== newPassword.confirmPassword) {
				validPassword = false
			}
			if (validPassword) {
				let noInputPassword = false
				if (newPassword.password !== '' || newPassword.confirmPassword !== '') {
					var resPass = await mutateUserPass({
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
				if (memberLevelsValue !== "") {

					const resMemberLevel = await updateMemberLevel({
						variables: {
							id: values.id,
							name: values.name,
							username: values.username,
							memberLevel: memberLevelsValue
						}
					})

				}
				const res = await updateUser({
					variables: values
				})
				if (res.data.user.errors.length == 0 && noInputPassword) {
					swal.fire({
						position: 'center',
						type: 'success',
						title: strings.successUpdate,
						showConfirmButton: false,
						timer: 1500
					})
				} else if (resPass.data.AdminResetPassword.success == false) {
					if (resPass.data.AdminResetPassword.errors[1] == "can only change the non staff account") {
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
				setControlHandler({
					isEditLoginPassword: true,
					isEditUserData: true
				})
				setEditRemarksNotes(false)
			} else {
				swal.fire({
					position: 'center',
					type: 'error',
					title: "New Password not Valid",
					showConfirmButton: false,
					timer: 1500
				})
			}

		} else {
			swal.fire({
				position: 'center',
				type: 'warning',
				title: strings.fillAllFields,
				showConfirmButton: false,
				timer: 1500
			})
		}


	}



	function submitHandler(event) {
		event.preventDefault();
		mutateAdd(values);
	}

	function handleClose() {
		history.push(USER_MANAGEMENT)
	}

	function btnEdit(value) {
		if (value === 'isUserEdit') {
			setControlHandler({ ...controlHandler, isEditUserData: false })
		}
		if (value === 'isNotUserEdit') {
			setControlHandler({ ...controlHandler, isEditUserData: true })
		}
		if (value === 'isEditLoginPassword') {
			setControlHandler({ ...controlHandler, isEditLoginPassword: false })
		}
		if (value === 'isNotEditLoginPassword') {
			setControlHandler({ ...controlHandler, isEditLoginPassword: true })
		}
	}

	return <Fragment>
		<form onSubmit={submitHandler} autoComplete="off">
			{userAccounts !== null
				?
				<Grid container spacing={2}>
					<Title pageTitle={strings.userDetails}> </Title>
					<Grid ></Grid>
					<Title pageTitle={strings.userDetails} />
					<Grid item md={4} >
						<Paper>
							<Grid container className={classes.userData} direction="row" justify="center" alignItems="center" >
								<Grid item lg={3}>
									<Avatar
										className={classes.bigAvatar}
										alt="Profile Picture"
										src="/profile2.png"
									/>
								</Grid>
								<Grid item lg={9}>
									<TextField
										label={strings.realName}
										className={classes.textField}
										value={values.name}
										required
										type="text"
										name="name"
										onChange={handleValuesChange}
										disabled={controlHandler.isEditUserData}
										margin="normal"
										InputLabelProps={{
											shrink: true
										}}
										InputProps={{
											classes: {
												input: classes.mainTextfield,
											},
										}}
									/>
								</Grid>
								<Grid item className={classes.edit}>
									{
										controlHandler.isEditUserData ?
											<Typography onClick={() => { btnEdit('isUserEdit') }} className={classes.editText}><Edit color="primary" /></Typography>
											:
											<Typography onClick={() => { btnEdit('isNotUserEdit') }} className={classes.editText}><Clear color="primary" /></Typography>
									}


								</Grid>
							</Grid>
							<Divider light={true} />
							<Grid container className={classes.padding} spacing={1}>
								<Grid item container spacing={1} >
									<Grid item lg={6} xs={12}>
										<TextField
											id="birthday"
											label={strings.birthday}
											value={values.birthDate}
											type="date"
											name="birthDate"
											onChange={handleValuesChange}
											fullWidth={true}
											disabled={controlHandler.isEditUserData}
											variant="outlined"
											margin="dense"
											InputLabelProps={{
												shrink: true
											}}
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>
									<Grid item lg={6} xs={12}>
										<TextField
											id="phoneNumber"
											label={strings.phoneNumber}
											value={values.phone}
											type="text"
											name="phone"
											onChange={handleValuesChange} fullWidth={true}
											fullWidth={true}
											disabled={controlHandler.isEditUserData}
											variant="outlined"
											margin="dense"
											InputLabelProps={{
												shrink: true
											}}
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>
								</Grid>
								<Grid item container spacing={1} >
									<Grid item lg={6} xs={12}>
										<TextField
											id="microChannelNumber"
											label={strings.microChannelNumber}
											value={values.wechat}
											type="text"
											name="wechat"
											onChange={handleValuesChange}
											fullWidth={true}
											disabled={controlHandler.isEditUserData}
											variant="outlined"
											margin="dense"
											InputLabelProps={{
												shrink: true
											}}
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>
									<Grid item lg={6} xs={12}>
										<TextField
											id="QQNumber"
											disabled={controlHandler.isEditUserData}
											label={strings.QQNumber}
											value={values.qqNumber}
											type="number"
											name="qqNumber"
											onChange={handleValuesChange}
											fullWidth={true}
											variant="outlined"
											margin="dense"
											InputLabelProps={{
												shrink: true
											}}
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>
								</Grid>

								<Grid item container spacing={1} >
									<Grid item lg={6} xs={12}>
										<TextField
											id="email"
											disabled={controlHandler.isEditUserData}
											label={strings.email}
											value={values.email}
											type="text"
											name="email"
											onChange={handleValuesChange}
											fullWidth={true}
											variant="outlined"
											margin="dense"
											InputLabelProps={{
												shrink: true
											}}
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>
									<Grid item container direction="row" alignItems="center" lg={6} xs={12}>
										<RadioGroup aria-label="isActive" name="isActive" value={values.isActive ? values.isActive.toString() : "false"} onChange={handleValuesChange} row>
											<FormControlLabel
												disabled={controlHandler.isEditUserData}
												value={"true"}
												control={<Radio color="primary" />}
												label={strings.enabled}
												labelPlacement="end"
											/>
											<FormControlLabel
												disabled={controlHandler.isEditUserData}
												value={"false"}
												control={<Radio color="primary" />}
												label={strings.disabled}
												labelPlacement="end"
											/>
										</RadioGroup>

									</Grid>
								</Grid>
							</Grid>
						</Paper>
					</Grid>

					<Grid item md={8} >
						<Paper elevation={1} style={{ height: "100%" }}>
							<Grid container >
								<Typography className={classes.padding} variant="h6">
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
							<Grid container className={classes.padding} spacing={2}>
								<Grid item container direction="row" alignItems="center" md={5} >
									<Grid item xs={5}>
										<Typography>{strings.account}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.username}</Typography>
									</Grid>
									{/* <TextField
										id="username"
										value={userAccounts.username}
										type="text"
										disabled
										margin="dense"
										variant="outlined"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>

								<Grid item md={1}> </Grid>

								<Grid item container direction="row" alignItems="center" md={5} >
									<Grid item xs={5}>
										<Typography>{strings.membershipNumber}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.pk}</Typography>
									</Grid>
									{/* <TextField
										id="pk"
										value={userAccounts.pk}
										type="text"
										disabled
										margin="dense"
										variant="outlined"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>

								<Grid item container direction="row" alignItems="center" md={5}>
									<Grid item xs={5}>
										<Typography>{strings.accountBalance}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.balance ? userAccounts.balance.toLocaleString('en', { maximumFractionDigits: 2 }) : 0}</Typography>
									</Grid>
									{/* <TextField
										id="balance"
										value={userAccounts.balance}
										type="text"
										disabled
										variant="outlined"
										margin="dense"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>
								<Grid item md={1}> </Grid>
								<Grid item container direction="row" alignItems="center" md={5}>
									<Grid item xs={5}>
										<Typography>{strings.lastLoginTime}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.lastLogin ? moment(userAccounts.lastLogin).format("YYYY-MM-DD hh-mm-ss") : null}</Typography>
									</Grid>
									{/* <TextField
										id="lastLoginIp"
										value={userAccounts.lastLogin ? moment(userAccounts.lastLogin).format("YYYY-MM-DD hh-mm-ss") : null}
										type="text"
										disabled
										variant="outlined"
										margin="dense"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>

								<Grid item container direction="row" alignItems="center" md={5}>
									<Grid item xs={5}>
										<Typography>{strings.memberLevel}:</Typography>
									</Grid>
									<Grid item xs={7} >
										<Grid container alignItems="center" direction="row" spacing={1}>
											<Grid item>
												<Typography variant="subtitle2">{memberLevelsName ? memberLevelsName.length <= 1 ? memberLevelsName[0].node.name : memberLevelsNameValue : memberLevelsNameValue}</Typography>
											</Grid>
											<Grid item>
												<Button variant="contained" onClick={() => setOpenMemberLevelModal(true)} color="primary" size="small"> <Typography variant="inherit" >{strings.adjustmentLevel}</Typography> </Button>
											</Grid>
										</Grid>
									</Grid>
									{/* <TextField
										id="memberLevel"
										value={userAccounts.memberLevel ? userAccounts.memberLevel.name : null}
										type="text"
										disabled
										variant="outlined"
										margin="dense"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>
								<Grid item md={1}> </Grid>
								<Grid item container direction="row" alignItems="center" md={5}>
									<Grid item xs={5}>
										<Typography>{strings.VIPRating}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.vipLevel ? userAccounts.vipLevel.name : "-"}</Typography>
									</Grid>
									{/* <TextField
										id="vipLevel"
										value={userAccounts.vipLevel ? userAccounts.vipLevel.name : null}
										type="text"
										disabled
										variant="outlined"
										margin="dense"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>

								{/* <Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
							<Typography>{strings.registered}:</Typography>
							<TextField
								id="registeredAt"
								value={userAccounts.registeredAt}
								type="text"
								disabled
								variant="outlined"
								margin="dense"
								InputProps={{
									classes: {
										input: classes.subTextfield,
									},
								}}
							/>
						</Grid>
						<Grid item md={1}> </Grid>
						<Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
							<Typography>{strings.registrationIP}:</Typography>
							<TextField
								id="lastLoginIp"
								value={userAccounts.lastLoginIp}
								type="text"
								disabled
								variant="outlined"
								margin="dense"
								InputProps={{
									classes: {
										input: classes.subTextfield,
									},
								}}
							/>
						</Grid> */}

								<Grid item container direction="row" alignItems="center" md={5}>
									<Grid item xs={5}>
										<Typography>{strings.registrationURL}:</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2">{userAccounts.sourceURL}</Typography>
									</Grid>
									{/* <TextField
										id="sourceURL"
										value={userAccounts.sourceURL}
										type="text"
										disabled
										variant="outlined"
										margin="dense"
										InputProps={{
											classes: {
												input: classes.subTextfield,
											},
										}}
									/> */}
								</Grid>
								<Grid item md={1}> </Grid>
								{/* <Grid item container direction="row" justify="space-between" alignItems="center" md={2}>
							<Typography>{strings.userStatus}:</Typography>


							<TextField
							 
							id="isActive"
							select
							name="isActive"
							className={classes.subTextfield1}
							value={userAccounts.isActive}
							onChange={handleValuesChange}
							SelectProps={{
								MenuProps: {
									className: classes.menu,
								},
							}}
							margin="dense"
							variant="outlined"
						>
							{Status.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>

						</Grid>
						<Grid item container direction="row" alignItems="center" md={4}>
							<RadioGroup aria-label="isActive" name="isActive" value={userAccounts.isActive.toString()} onChange={handleValuesChange} row>
								<FormControlLabel
									disabled
									value={"true"}
									control={<Radio color="primary" />}
									label="Active"
									labelPlacement="end"
								/>
								<FormControlLabel
									disabled
									value={"false"}
									control={<Radio color="primary" />}
									label="Inactive"
									labelPlacement="end"
								/>
							</RadioGroup>
						</Grid>
 */}

							</Grid>
						</Paper>
					</Grid>


					<Grid item md={4} xs={12} sm={12}>
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
									<Grid container>
										<Grid item style={{ marginRight: 12 }}>
											<PersonPinCircle className={classes.typography} style={{ color: 'green' }} />
										</Grid>
										<Grid item>
											<Typography color="textSecondary">{userAccounts.notes}</Typography>
										</Grid>
									</Grid>

								</Grid>
							</Grid>
							<Grid container className={classes.padding} style={{ marginTop: -24}}>
								{
									editRemarksNotes ?
										<TextField
											fullWidth={true}
											className={classes.noteField}
											variant="outlined"
											margin="dense"
											// disabled={editRemarksNotes}
											multiline
											rows="8"
											name="userNotes"
											value={values.userNotes}
											placeholder={strings.pleaseEnter}
											onChange={handleValuesChange}
										// value={filterValues.addNote}
										/> :
										<Fragment>
											{values.userNotes !== "" || values.userNotes ? <Comment   style={{ color: 'green', marginRight: 12 }} /> : null}
											<Typography variant="subtitle2">{values.userNotes}</Typography>
										</Fragment>
								}

							</Grid>
							<Grid style={{ backgroundColor: '#eeeeee', }} container justify="center" className={classes.padding}>
								{
									editRemarksNotes ? <Button style={{ width: 200, marginRight: 20, }} variant="outlined" onClick={() => setEditRemarksNotes(false)} >
										<Typography color="primary" style={{ fontSize: '0.8rem' }}>
											<Grid container>
												<AddCommentOutlined style={{ marginRight: 10 }} />{strings.addNotes}
											</Grid>
										</Typography>
									</Button>
										:
										<Button style={{ width: 200, marginRight: 20, }} variant="outlined" onClick={() => setEditRemarksNotes(true)} >
											<Typography color="primary" style={{ fontSize: '0.8rem' }}>
												<Grid container>
													{
														values.userNotes === "" || values.userNotes === null?
															<Fragment>
																<AddCommentOutlined style={{ marginRight: 10 }} />{strings.addNotes}
															</Fragment>
															:
															<Fragment>
																<Edit style={{ marginRight: 10 }} />{strings.editNotes}
															</Fragment>
													}
												</Grid>
											</Typography>
										</Button>
								}

							</Grid>

						</Paper>
					</Grid>

					<Grid item md={8} xs={12} sm={12}>
						<Grid item md={12}>
							<Paper>
								<Grid container >
									<Typography className={classes.padding} variant="h6">
										<Grid container>
											<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
												<AttachMoney className={classes.typography} color="primary" />
											</Grid>
											<Grid item>
												{strings.consumerInformation}
											</Grid>
										</Grid>
									</Typography>
								</Grid>
								<Divider light={true} />
								<Grid container className={classes.padding} spacing={1} >
									<Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
										<Typography>{strings.totalDepositAmount}:</Typography>
										<TextField
											id="sourceURL"
											value={statusData ? statusData.depositTotal : ''}
											type="text"
											disabled
											margin="dense"
											variant="outlined"
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>

									<Grid item md={1}> </Grid>
									<Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
										<Typography>{strings.totalDepositsNumber}:</Typography>
										<TextField
											id="sourceURL"
											value={statusData ? statusData.depositCount : ''}
											type="text"
											disabled
											margin="dense"
											variant="outlined"
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>

									<Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
										<Typography>{strings.totalWithdrawalAmount}:</Typography>
										<TextField
											id="sourceURL"
											value={statusData ? statusData.withdrawalTotal : ''}
											type="text"
											disabled
											margin="dense"
											variant="outlined"
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>

									<Grid item md={1}> </Grid>
									<Grid item container direction="row" justify="space-between" alignItems="center" md={5}>
										<Typography>{strings.totalWithdrawalsNumber}:</Typography>
										<TextField
											id="sourceURL"
											value={statusData ? statusData.withdrawalTotal : ''}
											type="text"
											disabled
											margin="dense"
											variant="outlined"
											InputProps={{
												classes: {
													input: classes.subTextfield,
												},
											}}
										/>
									</Grid>

								</Grid>
							</Paper>
						</Grid>

						<Grid style={{ marginTop: 24 }} item >
							<Paper>
								<Grid container >
									<Typography className={classes.padding} variant="h6">
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
								<Grid item container direction="row" justify="space-around"
									alignItems="center" className={classes.padding}>
									{
										userBankCardData !== null ?
											userBankCardData.map((o) => {
												return <BankCard dataContent={o.node} />
											})
											:
											<Grid item>
												<Typography variant="h4">{strings.noBankData}</Typography>
											</Grid>
									}
								</Grid>
							</Paper>
						</Grid>

						<Grid style={{ marginTop: 24 }} item md={12} xs={12} sm={12}>
							<Paper>
								<Grid container className={classes.padding}>
									<Typography variant="h6">
										<Grid container>
											<Grid item style={{ paddingTop: 2, marginRight: 3 }}>
												<Security className={classes.typography} color="primary" />
											</Grid>
											<Grid item>
												{strings.advancedModification}
											</Grid>
										</Grid>
									</Typography>
								</Grid>
								<Divider light={true} />
								<Grid container className={classes.padding} >
									<Grid container justify="space-between">

										{/* color={editLoginPassword == true ? '' : "textSecondary"} */}
										<Typography>
											<Grid container className={classes.keyContainer}>
												<VpnKey className={classes.typography} style={{ marginRight: 10 }} />
												{strings.loginPassword}
											</Grid>
										</Typography>
										{
											controlHandler.isEditLoginPassword ?
												<Button onClick={() => btnEdit('isEditLoginPassword')}
													style={{ width: 100, marginRight: 20, height: 27, }} color="primary" variant="outlined" >
													{/* <Typography color="textSecondary"> */}
													{strings.edit}
													{/* </Typography> */}
												</Button>
												:
												<Button onClick={() => btnEdit('isNotEditLoginPassword')}
													style={{ width: 100, marginRight: 20, height: 27, }} color="primary" variant="outlined" >
													{/* <Typography color="textSecondary"> */}
													{strings.cancel}
													{/* </Typography> */}
												</Button>
										}

									</Grid>
									{
										controlHandler.isEditLoginPassword ?
											null
											:
											<Fragment>
												<Grid container direction="row" justify="space-between">
													<Grid item md={5} sm={3} className={classes.flexEnd} container direction="column" justify="center" >
														<Typography>{strings.password}</Typography>
													</Grid>
													<Grid item md={6} sm={8}  >
														<TextField className={classes.textfield} type="password" variant="outlined" margin="dense" placeholder={strings.password} name="password" onChange={handleNewPasswordChange} defaultValue={newPassword.password} />
													</Grid>
												</Grid>
												<Grid container direction="row" justify="space-between">
													<Grid item md={5} sm={3} className={classes.flexEnd} container direction="column" justify="center"  >
														<Typography>{strings.confirmPassword}</Typography>
													</Grid>
													<Grid item md={6} sm={8}  >
														<TextField className={classes.textfield} type="password" variant="outlined" margin="dense" placeholder={strings.confirmPassword} name="confirmPassword" onChange={handleNewPasswordChange} defaultValue={newPassword.confirmPassword} />
													</Grid>
												</Grid>
											</Fragment>
									}
								</Grid>


								{/* <Divider light={true} />
							<Grid container className={classes.padding} justify="space-between">
								<Typography color="textSecondary">
									<Grid container style={{ marginLeft: '2em' }}>
										<Money className={classes.typography} style={{ marginRight: 10 }} />
										{strings.withdrawPassword}
									</Grid>
								</Typography>
								<Button style={{ width: 100, marginRight: 20, height: 27, backgroundColor: '#E3E9F0' }} variant="outlined" >
									<Typography color="textSecondary">
										{strings.edit}
									</Typography>
								</Button>
							</Grid>
							<Divider light={true} />
							<Grid container className={classes.padding} justify="space-between">
								<Typography color="textSecondary">
									<Grid container style={{ marginLeft: '2em' }}>
										<LockSharp className={classes.typography} style={{ marginRight: 10 }} />
										{strings.securityQuestion}
									</Grid>
								</Typography>
								<Button style={{ width: 100, marginRight: 20, height: 27, backgroundColor: '#E3E9F0' }} variant="outlined" >
									<Typography color="textSecondary">
										{strings.edit}
									</Typography>
								</Button>
							</Grid>
							 */}
							</Paper>
						</Grid>
					</Grid>

					<Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>

						<Button style={{ width: 110, marginRight: 20, height: 30 }}
							color="primary" variant="contained" type="submit" >{strings.save}</Button>

						<Button style={{ width: 110, marginRight: 20, height: 30 }}
							color="primary" variant="contained" onClick={() => history.goBack()}>{strings.cancel}</Button>
					</Grid>
				</Grid>
				: <Loading />}

		</form>
		<AdjustmentMemberLevel
			username={username}
			open={openMemberLevelModal}
			setOpen={setOpenMemberLevelModal}
			strings={strings}
			memberLevels={memberLevels}
			setMemberLevelsValue={setMemberLevelsValue}
			memberLevelsValue={memberLevelsValue}

		/>
	</Fragment >

}
