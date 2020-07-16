import React, { useState, Fragment } from 'react';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, Menu, MenuItem, ListItemText} from '@material-ui/core';
import { SimpleTable, GrowItem, Title, Loading, RiskStatusChangeModal } from '../../../components';
import { makeStyles, withStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { FIRST_PAYMENT_VERIFICATION, USER_MANAGEMENT } from '../../../paths';
import { AppDateRangePicker } from '../../../components/date-picker';
import { MoreVert, Clear} from '@material-ui/icons'
import CallIcon from '@material-ui/icons/Call';
import usePagination from '../../../hooks/use-pagination'
import moment from 'moment'
import useWithdrawalFirsts, {RISK_FIRST_MUTATION} from '../../../queries-graphql/electric-sales/first-payment-verification'
import { green, red, blue } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
	root: {
      padding: theme.spacing(3, 2),
      '& > span': {
        margin: theme.spacing(2),
      },
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
	red: {
		color: "#f44336"
	},
	green: {
		color: "#4caf50"
	},
	yellow: {
		color: "#ffeb3b"
	},
	blue: {
		color: "#508FF4"
	}
}));

const ColorButtonRed = withStyles(theme => ({
	root: {
		color: red[500],
		backgroundColor: red[50],
		border: "1px #f44336 solid",
		'&:hover': {
			backgroundColor: red[100],
		},
	},
}))(Button);

const ColorButtonGreen = withStyles(theme => ({
	root: {
		color: green[500],
		backgroundColor: green[50],
		border: "1px #4caf50 solid",
		'&:hover': {
			backgroundColor: green[100],
		},
	},
}))(Button);


const ColorButtonBlue = withStyles(theme => ({
	root: {
		color: blue[500],
		backgroundColor: blue[50],
		border: "1px #508FF4 solid",
		'&:hover': {
			backgroundColor: blue[100],
		},
	},
}))(Button);

/* Styled Menu */
const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})(props => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
		vertical: 'bottom',
		horizontal: 'center',
		}}
		transformOrigin={{
		vertical: 'top',
		horizontal: 'center',
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		'&:focus': {
		backgroundColor: theme.palette.primary.main,
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
		},
		},
	},
}))(MenuItem);
/* End */ 

export default function FirstPaymentVerification(props) {
    const classes = useStyles();
    const strings = useLanguages(FIRST_PAYMENT_VERIFICATION);
    const {history} = props;

    /* App Calendar */
    const [setOpenNewUserDialog] = React.useState(false);

    const [filterValues, setFilterValues] = React.useState({
		startDate: null,
        endDate: null
    });

    const [focusedInput, setFocusedInput] = useState(null);
	function onDatesChange({ startDate, endDate }) {
		setFilterValues(oldValues => ({
			...oldValues,
			startDate,
			endDate
		}));
	}
	function onFocusChange(f) {
		setFocusedInput(f);
    }
    
    function handleClickOpen() {
        setOpenNewUserDialog(true);
    }

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
        setTableId(event.currentTarget.id)    
    }

    function handleClose() {
        setAnchorEl(null);
        setOpenTab(null)
        setOpen(true)
    }

    const [filter, setFilter] = React.useState({
		// filterValues: [],
		startDate: "2019-11-05",
		endDate: null
    })
    
    function searchFor() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
		setFilter(filterValues)
		if (filterValues.startDate === null && filterValues.endDate === null) {
			setFilter({
				// filterValues: filterValues,
				startDate: "2019-11-05",
				endDate: null
			})
		} else {
			setFilter({
				// filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
		}
	}
    /* END */

    /* Styled Menu */
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tableId, setTableId] = React.useState(null);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setID] = useState(null);
    const [passStatus, setPassStatus] = useState(null);
	const [passWarning, setPassWarning] = useState(null);
 
	const [open, setOpen] = React.useState(true);
	const [openTab, setOpenTab] = React.useState(null);
    const [mutate, setMutate] = React.useState(false)
    
    function btnStatusChange(id, stat, warn) {
		setID(id)
        setModalOpen(!modalOpen);
		setPassStatus(stat);
		setPassWarning(warn);
    }
    
    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, setCursor, setPage } = pagination;

    const {data, loading} = useWithdrawalFirsts({mutation: mutate, rowsPerPage, before, after, startAt: filter.startDate, endAt: filter.endDate});
    if(loading) { 
        return <Loading />
	} 

    const count = data.withdrawals.totalCount
    const pageInfo = data.withdrawals.pageInfo

    return <Paper className={classes.root} style={{ marginTop: "20px" }}>
        <Title pageTitle={strings.firstPaymentVerification} />
        <Grid container>
            <Typography variant='h6'>{strings.firstPaymentVerification}</Typography>
        </Grid>

        <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }}/>
        <Grid container alignItems="center" spacing={1}>
            <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                <Grid item >
                    <Typography color="textSecondary">{strings.date}:</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 10 }}>
                    <AppDateRangePicker
                        focusedInput={focusedInput}
                        onFocusChange={onFocusChange}
                        onDatesChange={onDatesChange}
                        startDate={filterValues.startDate}
                        endDate={filterValues.endDate}
                        startDateId="startDate"
                        endDateId="endDate"
                        startDatePlaceholderText={strings.startDate}
                        endDatePlaceholderText={strings.endDate}
                        inputIconPosition="after"
                        showDefaultInputIcon
                        small
                        isOutsideRange={() => false}
                    />
                </Grid>

                {/* <Grid item style={{ marginLeft: 10 }}>
                    <Typography color="textSecondary">abc:</Typography>
                </Grid>
                <Grid item>
                    <TextField type="number" variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }}/>
                </Grid>

                <Grid item style={{ marginLeft: 10 }}>
                    <Typography color="textSecondary">abc:</Typography>
                </Grid>
                <Grid item>
                    <TextField type="text" variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10 }}/>
                </Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                    <Typography color="textSecondary">{strings.status}:</Typography>
                </Grid>
                <Grid item>
                <Select
                    margin="dense"
                    className={classes.textfield}
                    name="status"
                    value={values.status}
                    input={<OutlinedInput notched={false} name="status" style={{ width: 100 }}/>}
                >
                    <MenuItem value="pending">{strings.toBeProcessed}</MenuItem>
                    <MenuItem value="cancelled">{strings.cancelled}</MenuItem>
                    <MenuItem value="confirmed">{strings.confirmed}</MenuItem>
                </Select>
                </Grid>

                <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                    <Typography color="textSecondary">{strings.to}:</Typography>
                </Grid>
                <Grid item>
                    <TextField type="text" variant="outlined" margin="dense" style={{ width: 70, marginLeft: 10, marginRight: 10 }}/>
                </Grid>                 */}

                {/* <GrowItem/> */}

                <Grid item style={{ padding: 10 }}>
                    {/* <Button color="primary" className={classes.button}>{strings.clearAll}</Button> */}
                    <Button style={{ width: 100 }} color="primary" onClick={() => searchFor()} variant="contained">{strings.searchFor}</Button>
                </Grid>

            </Grid>
        </Grid>
        <Grid item>	
            <SimpleTable
                tableProps={{size: "small"}}
                hasPagination={true}
                pagination={pagination}
                pageInfo={pageInfo}
                noBorder={true}
                count={count}
                columns={
                    <TableRow>
                        <TableCell align="center">{strings.orderNumber}</TableCell>
                        <TableCell>{strings.memberAccount}</TableCell>
                        <TableCell>{strings.hierarchy}</TableCell>
                        <TableCell>{strings.VIPRating}</TableCell>
                        <TableCell>{strings.withdrawalApplicationTime}</TableCell>
                        <TableCell align="right">{strings.numberOfWithdrawals}</TableCell>
                        <TableCell align="right">{strings.applicationForWithdrawalAmount}</TableCell>
                        <TableCell align="right">{strings.accountBalance}</TableCell>
                        <TableCell align="right">{strings.handlingFee}</TableCell>
                        <TableCell align="right">{strings.administrativeFee}</TableCell>
                        <TableCell align="right">{strings.discountDeduction}</TableCell>
                        <TableCell align="right">{strings.amountOfWithdrawal}</TableCell>
                        <TableCell>{strings.dialNumber}</TableCell>
                        <TableCell>{strings.status}</TableCell>
                        <TableCell>{strings.operator}</TableCell>
                        <TableCell>{strings.operatingTime}</TableCell>
                        <TableCell>{strings.operating}</TableCell>
                    </TableRow>
                }
                rows={
                    data.withdrawals.edges.length === 0 ? 
                    <TableRow>
                        <TableCell align="center" colSpan={17}>没有可用数据</TableCell>
                    </TableRow>
                    :
                    data.withdrawals.edges.map((o, index) => 
                        <TableRow>
                            <TableCell align="right">{o.node.orderId ? o.node.orderId : '-'}</TableCell>
                            <TableCell>
                                <Typography style={{ color: "blue", cursor: "pointer" }} 
                                    onClick={ () => history.push(`${USER_MANAGEMENT}/${o.node.user.username}`)}>
                                    {o.node.user ? o.node.user.username.toLowerCase() : '-'}
                                </Typography>
                            </TableCell>
                            <TableCell>{o.node.createUser.name ? o.node.createUser.name : '-'}</TableCell>
                            <TableCell>{o.node.user.vipLevel ? o.node.user.vipLevel.name : '-'}</TableCell>
                            <TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : '-'}</TableCell>
                            <TableCell align="right">{o.node.riskApproval ? o.node.riskApproval.edges[0].node.withdrawalCount : '-'}</TableCell>
                            <TableCell align="right">{o.node.amount ? '¥'+o.node.amount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.balance ? '¥'+o.node.balance.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.handlingFee ? '¥'+o.node.handlingFee.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.riskApproval ? '¥'+o.node.riskApproval.edges[0].node.depositAuditAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.riskApproval ? '¥'+o.node.riskApproval.edges[0].node.preferentialAuditAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.finalAmount ? '¥'+o.node.finalAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell><CallIcon color="primary"/></TableCell>
                            <TableCell>
                                {   o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1 ?
                                    o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.confirmed}</ColorButtonGreen> :
                                    o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.status.toLowerCase() === "cancelled" ? <ColorButtonRed size="small">{strings.cancelled}</ColorButtonRed> :
                                    <ColorButtonBlue size="small">{strings.toBeProcessed}</ColorButtonBlue>
                                    :
                                    null
                                }
                            </TableCell>
                            <TableCell>{o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1 ? o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.statusChangedBy ? o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.statusChangedBy.name : '-' : '-'}</TableCell>
                            <TableCell>{o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1 ? o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.statusChangedAt ? moment(o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.statusChangedAt).format("YYYY-MM-DD HH:mm:ss") : '-' : '-'}</TableCell>
                                <TableCell>
                                    <Grid item>
                                    {	
                                        o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1 ?
                                        o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.status.toLowerCase() === "pending" ?														 
                                        open ? 
                                            <Button
                                                id={index}
                                                aria-controls={index}
                                                aria-haspopup="true"
                                                onClick={handleClick}
                                            >
                                                <MoreVert />
                                            </Button>
                                        : openTab == index ?
                                        <Clear onClick={handleClose} /> : null
                                        : '-' : "-"
                                    }
                                        <StyledMenu
                                            tableId={tableId}
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl && tableId == index)}
                                            onClose={handleClose}
                                        >
                                            {
                                                o.node.riskApproval.edges[0].node.firstApproval.edges.length >= 1 ?
                                                    o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.status.toLowerCase() === "pending" ? 
                                                    <Fragment>
                                                        <StyledMenuItem	onClick={handleClose}>
                                                            <ListItemText onClick={() => btnStatusChange(o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.id, "confirmed", strings.warning1)} primary={strings.confirmVerification} />
                                                        </StyledMenuItem>
                                                        <StyledMenuItem onClick={handleClose}>
                                                            <ListItemText onClick={() => btnStatusChange(o.node.riskApproval.edges[0].node.firstApproval.edges[0].node.id, "cancelled", strings.warning1)} primary={strings.cancelWithdrawal} />
                                                        </StyledMenuItem>
                                                    </Fragment>
                                                    :
                                                    null
                                                    :
                                                null
                                            }
                                            {/* <StyledMenuItem id={index} onClick={handleClickOpen} >
                                                {strings.viewNotes}
                                            </StyledMenuItem> */}
                                        </StyledMenu>                                      
                                    </Grid>			
                                </TableCell>
                        </TableRow>)
                }                  
            />
            </Grid>	
		<RiskStatusChangeModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={RISK_FIRST_MUTATION} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passStatus={passStatus} />	
	</Paper>
}