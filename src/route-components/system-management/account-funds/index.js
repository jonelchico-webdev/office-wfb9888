import React, { useEffect, Fragment, useState } from 'react';
import { Paper, Divider, Grid, Button, Typography, TextField, TableRow, TableCell } from '@material-ui/core';
import { Title, Loading, BankCard, SimpleTable } from '../../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { ACCOUNT_FUNDS } from '../../../paths';
import { Add, Edit } from '@material-ui/icons'
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import Cookies from 'universal-cookie';
import { useMyBankCardQuery, useMyAccountQuery, MY_BANKCARD_MUTATE, ADD_WITHDRAWALS_PASSWORD_MUTATE, CHANGE_WITHDRAWALS_PASSWORD_MUTATE, useMyMemberBankRecord, WITHDRAW_MUTATE } from "../../../queries-graphql/system-management/account-funds"
import AddBankCardModal from '../../../components/add-bank-card'
import WithdrawModal from '../../../components/withdraw-modal'
import ChangeWithdrawalsPassword from '../../../components/change-withdrawals-password-modal'
import usePagination from '../../../hooks/use-pagination'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2)
	},
	root: {
		padding: theme.spacing(4, 12, 4, 12),
		'& > span': {
			margin: theme.spacing(2),
		},
	},
	padding: {
		padding: theme.spacing(2)
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	dense: {
		marginTop: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
	},
	addCard: {
		borderRadius: 10,
		border: "2px solid #508ff4",
		padding: '20px 50px',
		color: '#ffffff',
		fontStyle: 'bold',
		minHeight: 153,
		maxWidth: 300,
		marginLeft: 12,
		marginRight: 12,
		cursor: 'pointer',
		[theme.breakpoints.up('sm')]: {
			marginBottom: 8,
			marginTop: 8,
		},
	},
	errorMessage: {
		textAlign: "center",
		backgroundColor: "#F5C7C3",
		border: "1px solid #ba2525",
		borderRadius: "10px",
		marginBottom: theme.spacing(2),
		padding: theme.spacing(1)
	},
	successMessage: {
		textAlign: "center",
		backgroundColor: "#AAF4D4",
		border: "1px solid #007070",
		borderRadius: "10px",
		marginBottom: theme.spacing(2),
		padding: theme.spacing(1)
	}
}));

function MyAccountData(username, open, openWithdrawModal, mutate) {
	const { data, loading } = useMyAccountQuery({ user_Username: username, open: open, openWithdrawModal: openWithdrawModal, mutate: mutate })
	if (loading) {
		return null
	}

	return data
	// const myBankCardData = data;

	// if (myBankCardData) {
	// 	if (myBankCardData.userCards) {
	// 		if (myBankCardData.userCards.edges.length > 0) {
	// 			return myBankCardData.userCards.edges
	// 		} else {
	// 			return null
	// 		}
	// 	} else {
	// 		return null
	// 	}
	// } else {
	// 	return null
	// }
}

function MyMemberBankRecordQuery(rowsPerPage, after, before, memberBankRecordValues, openWithdrawModal, mutate) {
	const { data, loading } = useMyMemberBankRecord({ rowsPerPage, after, before, memberBankRecordValues, openWithdrawModal, mutate })
	if (loading) {
		return null
	}

	return data
}

function MyBankCardData(username, open) {
	const { data, loading } = useMyBankCardQuery({ user_Username: username, open: open })
	if (loading) {
		return null
	}
	const myBankCardData = data;

	if (myBankCardData) {
		if (myBankCardData.userCards) {
			if (myBankCardData.userCards.edges.length > 0) {
				return myBankCardData.userCards.edges
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

export default function AccountFunds(props) {
	const classes = useStyles()
	const strings = useLanguages(ACCOUNT_FUNDS);
	const [open, setOpen] = useState(false)
	const [openChangeWithdrawalsPasswordModal, setOpenChangeWithdrawalsPasswordModal] = useState(false)
	const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)
	const [successMessage, setSuccessMessage] = useState(null)
	const [myBankCard, setMyBankCard] = useState(null)
	const [mutate, setMutate] = useState(false)
	const cookies = new Cookies()
	const username = cookies.get('Username')
	const id = cookies.get('ID')
	const [withdrawalsMutate, setWithdrawalsMutate] = useState(false)
	const [withdrawValues, setWithdrawValues] = useState({
		user: id,
		amount: null,
		depositBankName: null,
		depositAccount: null,
		depositUserName: null,
		withdrawalsPassword: null
	})


	const [memberBankRecordValues, setMemberBankRecordValues] = useState({
		startAt: null,
		endAt: null,
		type: null
	})

	const pagination = usePagination()
	const { rowsPerPage, cursor: { before, after }, setCursor, setPage } = pagination;

	const myMemberBankRecord = MyMemberBankRecordQuery(rowsPerPage, after, before, memberBankRecordValues, openWithdrawModal, mutate)
	const myAccountData = MyAccountData(username, open, openWithdrawModal, mutate)

	useEffect(() => {
		if (myAccountData) {
			setMyBankCard(myAccountData.users.edges[0].node.userCards ? myAccountData.users.edges[0].node.userCards.edges : null)
		}
	}, [myAccountData])

	const [addBankCard] = useMutation(MY_BANKCARD_MUTATE)
	const [addWithdrawalsPasswordMutate] = useMutation(ADD_WITHDRAWALS_PASSWORD_MUTATE)
	const [changeWithdrawalsPassword] = useMutation(CHANGE_WITHDRAWALS_PASSWORD_MUTATE)
	const [withdrawMutate] = useMutation(WITHDRAW_MUTATE)

	async function withdrawMutation(withdrawalValues) {
		const res = await withdrawMutate({
			variables: withdrawalValues
		})
		setMutate(!mutate)
	}

	async function changeWithdrawalsPasswordBtn(withdrawalsPasswordValue) {
		if (openChangeWithdrawalsPasswordModal) {
			const resChangeWithdrawalsPassword = await changeWithdrawalsPassword({
				variables: withdrawalsPasswordValue
			})

			if (resChangeWithdrawalsPassword.data.ChangeWithdrawalsPassword.success) {
				setOpenChangeWithdrawalsPasswordModal(false)
				setSuccessMessage(strings.updateSuccessful)
				setMutate(!mutate)
			} else {
				setOpenChangeWithdrawalsPasswordModal(false)
				if (resChangeWithdrawalsPassword.data.ChangeWithdrawalsPassword.errors[1] === "Withdrawals old password is incorrect") {
					setErrorMessage(strings.withdrawalsOldPasswordIsIncorrect)
				} else if (resChangeWithdrawalsPassword.data.ChangeWithdrawalsPassword.errors[1] === "Withdrawals password can't be the same") {
					setErrorMessage(strings.withdrawalsPasswordCantBeTheSame)
				} else {
					setErrorMessage(strings.incorrectCredentials)
				}
			}
		}
	}

	async function addBtn(addBankCardValues, addWithdrawalsPassword) {
		if (open) {
			if (addWithdrawalsPassword.password !== null) {
				const resWithdrawalsPassword = await addWithdrawalsPasswordMutate({
					variables: addWithdrawalsPassword
				})

				if (resWithdrawalsPassword.data.AddWithdrawalsPassword.success) {
					setOpen(false)
					setSuccessMessage(strings.updateSuccessful)
				} else {
					setOpen(false)
					setErrorMessage(strings.incorrectCredentials)
				}
				const res = await addBankCard({
					variables: addBankCardValues
				})
			} else {
				const res = await addBankCard({
					variables: addBankCardValues
				})
				setSuccessMessage(strings.updateSuccessful)
				setOpen(false)
			}
			// console.log(resWithdrawalsPassword.data.AddWithdrawalsPassword.success,'asdasdasd')
			// console.log(res)
			// console.log(addBankCardValues)
		}
		// const res = await addBankCard({
		// 	variables: addBankCardValues
		// })
		// console.log(res)
	}

	function openModal() {
		setErrorMessage(null)
		setSuccessMessage(null)
		setOpen(true)
	}

	function openModalChangeWithdrawalsPassword() {
		setErrorMessage(null)
		setSuccessMessage(null)
		setOpenChangeWithdrawalsPasswordModal(true)
	}

	function openModalWithdraw() {
		setErrorMessage(null)
		setSuccessMessage(null)
		setOpenWithdrawModal(true)
	}

	// console.log(myAccountData)
	// console.log(myBankCard)
	return <Paper elevation={1}>
		<Title pageTitle={strings.accountFunds} />
		<Grid container justify="space-between" alignItems="center">
			<Typography className={classes.paper} variant="h6">{strings.myBankCard}</Typography>
			{
				myAccountData ? myAccountData.users.edges[0].node.withdrawalsPassword ?
					<Grid className={classes.paper}>
						<Button color="primary" size="medium" variant="contained" onClick={openModalChangeWithdrawalsPassword}>
							<Edit style={{ marginRight: 8 }} fontSize="inherit" />
							<Typography>{strings.changeWithdrawalsPassword}</Typography>
						</Button>
					</Grid>
					: null : null
			}
			{
				errorMessage || successMessage ?
					<Grid item xs={12} className={successMessage ? classes.successMessage : classes.errorMessage} alignContent="center" style={{ marginLeft: 24, marginRight: 24 }}>
						<Typography variant="h5" color={successMessage ? "success" : "error"}>{successMessage ? successMessage : errorMessage}</Typography>
					</Grid> : null
			}
		</Grid>
		<Divider />
		<Grid container direction="row"
			alignItems="center" justify="center" className={classes.padding}>
			{
				myBankCard !== null && myBankCard.length > 0 ?
					myBankCard.map((o) => {
						return <BankCard dataContent={o.node} />
					})
					:
					<Grid item>
						<Typography variant="body1">{strings.noBankCard}</Typography>
					</Grid>
			}
			<Grid item container direction="row" justify="space-between" className={classes.addCard} xs={5} onClick={openModal}>
				<Grid item container xs={12} justify="center">
					<Add style={{ color: "#508ff4", fontSize: 80 }} />
					{/* <Typography variant="h4">{dataContent.bankName}</Typography>
					<Typography variant="h6"> {dataContent.cardNumber}</Typography>
					<Typography variant="h6"> {dataContent.nameOnCard}</Typography>
				<Typography variant="subtitle1">{dataContent.branch}</Typography> */}
				</Grid>
				<Grid item container xs={12} justify="center">
					<Typography style={{ color: "#508ff4" }}>{strings.addBankCard}</Typography>
				</Grid>
			</Grid>

		</Grid>
		<Divider />
		<Grid container alignItems="center" spacing={2}>
			<Grid item>
				<Typography className={classes.paper} variant="h6">{strings.accountBalance}:</Typography>
			</Grid>
			<Grid item>
				<Typography className={classes.paper} variant="h6">{myAccountData ? myAccountData.users.edges[0].node.balance.toLocaleString('en', { maximumFractionDigits: 2 }) : "-"}</Typography>
			</Grid>
			{
				myBankCard !== null && myBankCard.length > 0 ?
					<Grid item >
						<Button
							// disabled={ myAccountData ? myAccountData.users.edges[0].node.balance  === 0  ? true : false: false}
							variant="contained" color="primary"
							onClick={openModalWithdraw}
						>
							{strings.withdraw}
						</Button>
					</Grid>
					: null
			}
		</Grid>
		<Divider style={{ marginBottom: 24 }} />
		<Grid container direction="column" className={classes.paper}>
			{
				myMemberBankRecord !== null ?
					<SimpleTable
						tableProps={{ size: "small" }}
						noBorder={true}
						hasPagination={true}
						pagination={pagination}
						pageInfo={myMemberBankRecord.memberBankRecord.pageInfo}
						count={myMemberBankRecord.memberBankRecord.totalCount}
						columns={
							<TableRow>
								<TableCell>{strings.orderNumber}</TableCell>
								<TableCell>{strings.creationTime}</TableCell>
								<TableCell>{strings.processingTime}</TableCell>
								<TableCell>{strings.commissionName}</TableCell>
								{/* <TableCell>{strings.releaseType}</TableCell> */}
								<TableCell>{strings.amount}</TableCell>
								<TableCell>{strings.accountBalance}</TableCell>
								<TableCell style={{ minWidth: 250 }}>{strings.remarks}</TableCell>
							</TableRow>
						}
						rows={
							myMemberBankRecord.memberBankRecord.edges.length === 0 ?
								<TableRow>
									<TableCell align="center" colSpan={8}>{strings.noDataAvailable}</TableCell>
								</TableRow>
								:
								myMemberBankRecord.memberBankRecord.edges.map(o => {


									return <TableRow>
										<TableCell>{o.node.orderId}</TableCell>
										<TableCell>{moment(o.node.createdAt).format("YYYY-MM-DD HH:MM")}</TableCell>
										<TableCell>{moment(o.node.updatedAt).format("YYYY-MM-DD HH:MM")}</TableCell>
										<TableCell>{o.node.commissionPayments.edges.length !== 0 ? o.node.commissionPayments.edges[0].node.commissionName : "-"}</TableCell>
										{/* <TableCell>{o.node.type}</TableCell> */}
										<TableCell>{o.node.amount}</TableCell>
										<TableCell>{o.node.balance}</TableCell>
										<TableCell>{o.node.remark}</TableCell>
									</TableRow>
								})
						}
					/>
					: <Loading />
			}
		</Grid>
		<AddBankCardModal id={id} username={username} name={myAccountData ? myAccountData.users.edges[0].node.name : null} open={open} setOpen={setOpen} strings={strings} mutate={addBtn} withdrawalsPassword={myAccountData ? myAccountData.users.edges[0].node.withdrawalsPassword : null} />
		<WithdrawModal id={id} balance={myAccountData ? myAccountData.users.edges[0].node.balance : 0} bankCards={myBankCard ? myBankCard : null} open={openWithdrawModal} setOpen={setOpenWithdrawModal} strings={strings} mutate={withdrawMutation} withdrawValues={withdrawValues} setWithdrawValues={setWithdrawValues} />
		<ChangeWithdrawalsPassword open={openChangeWithdrawalsPasswordModal} setOpen={setOpenChangeWithdrawalsPasswordModal} mutate={changeWithdrawalsPasswordBtn} strings={strings} />
	</Paper>

}