import React, { useState } from 'react';
import { Paper, TableRow, TableCell, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { SimpleTable, ContinueCancelModal } from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { MEMBER_DEPOSIT_LEVEL, MEMBER_DEPOSIT_LEVEL_ADD_MEMBER } from '../../../paths';
import SignalCellularAltSharpIcon from '@material-ui/icons/SignalCellularAltSharp';
import PaymentMethodConfigurationDialog from './payment-method-configuration-dialog';
import Link from '@material-ui/core/Link';
import Title from '../../../components/title';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import usePagination from '../../../hooks/use-pagination'
import useMemberDepositLevel from '../../../queries-graphql/member-management/member-deposit-level'
import {Loading} from '../../../components';


// import NewUserDialog from './new-user-dialog';

const useStyle = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export default function MemberDepositLevel(props) {
    const classes = useStyle();
    const strings = useLanguages(MEMBER_DEPOSIT_LEVEL);
    const { history } = props;
    // const [checked, setChecked] = React.useState(true);

    const options = ['请选择', strings.modify, strings.delete];
    const [open, setOpen] = React.useState(false);
    const [buttonRow, setButtonRow] = React.useState(false);
    const anchorRef = React.useRef(null);
    const mutate= false
    // const [selectedIndex, setSelectedIndex] = React.useState(1);

    const pagination = usePagination()
    const [modalContinueOpen, setModalContinueOpen] = useState(false);

    /* Start for dialog */
    const [openPaymentMethodConfigurationDialog, setPaymentMethodConfigurationDialog] = React.useState(false);
    // function handleClickOpen() {
    //     setPaymentMethodConfigurationDialog(true);

    // }

    function handleCloseDialog() {
        setPaymentMethodConfigurationDialog(false);
    }
    /* End for Dialog */

    // function handleChange() {
    //     if (checked) {
    //         setChecked(false)
    //     } else {
    //         setChecked(true)
    //     }
    // }

    const { rowsPerPage, cursor: { before, after } } = pagination;
    
    const { data, loading } = useMemberDepositLevel({mutation: mutate, before, after, rowsPerPage})
    if (loading) {
        return <Loading/>
    }

    const memberLevelsPageInfo = data.memberLevels.pageInfo;  
    const memberDepositLevel = data.memberLevels.edges

    function handleClick(memberIndex, memberID) {
        if (memberDepositLevel[memberIndex].operating === 2) {
            setModalContinueOpen(true);
        } 
        // else if (memberDepositLevel[memberIndex].operating == 0) {
        //     handleClickOpen()
        // } 
        else if (memberDepositLevel[memberIndex].operating === 1){
            history.push(`${MEMBER_DEPOSIT_LEVEL}/update/${memberID}`)
        }else{
            handleClose()
        }
    }

    function setPopper(index, memberIndex) {
        memberDepositLevel[memberIndex].operating = index
    }

    function handleMenuItemClick(index, memberIndex){
        setPopper(index, memberIndex)
        handleClose()
    }

    function handleToggle(event) {
        setOpen(prevOpen => !prevOpen);
        setButtonRow(event.currentTarget.id)
    }

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    }

    return <Paper elevation={1} className={classes.paper}>
        <Title pageTitle={strings.pageTitle} />
        <Grid container spacing={2} direction="column">
            <Grid item>
                <Grid container>
                    <Grid item>
                    </Grid>
                    <Grid item>
                        {/* <Button color="primary" variant="contained" onClick={() => history.push(`${USER_MANAGEMENT}/${o.memberNumber}`)}>{strings.seeDetails}</Button> */}
                        <Button variant="contained" color="primary" className={classes.button} onClick={() => history.push(MEMBER_DEPOSIT_LEVEL_ADD_MEMBER)}>
                            <SignalCellularAltSharpIcon className={classes.leftIcon} />
                            {strings.addMemberLevel}
                        </Button>
                    </Grid>
                    {/* <Grid item>
                        <Button variant="contained" className={classes.button} >
                            <RefreshSharpIcon className={classes.leftIcon} />
                            {strings.manualPerformTiering}
                        </Button>
                    </Grid> */}
                    {/* <GrowItem />
                    <Grid item style={{
                        marginTop: "20px",
                        marginRight: '10px'
                    }}>

                        <label>{strings.whetherToEnableAL}</label>
                    </Grid>
                    <Grid item style={{ marginTop: "15px" }}>
                        <Switch
                            onChange={handleChange}
                            checked={checked}
                            uncheckedIcon={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        fontSize: 15,
                                        color: "orange",
                                        paddingRight: 2
                                    }}
                                >
                                    <label style={{
                                        color: "white",
                                        fontSize: "0.75rem",
                                        fontFamily: "Microsoft YaHei",
                                        lineHeight: "1.43"
                                    }} >{strings.close}</label>
                                </div>
                            }
                            checkedIcon={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        fontSize: 15,
                                        color: "green",
                                        paddingRight: 2,
                                        textcolor: "white"
                                    }}
                                >
                                    <label style={{
                                        color: "white",
                                        fontSize: "0.75rem",
                                        fontFamily: "Microsoft YaHei",
                                        lineHeight: "1.43"
                                    }} >{strings.open}</label>
                                </div>
                            }
                            className="react-switch"
                        />

                    </Grid> */}

                </Grid>
            </Grid>
            <Grid item>
            <SimpleTable						
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pagination={pagination}
                    pageInfo={memberLevelsPageInfo}
                    count={data.memberLevels.totalCount}
                    columns={
                        <TableRow>
                            <TableCell>{strings.hierarchicalName}</TableCell>
                            <TableCell>{strings.numberOfMembers}</TableCell>
                            <TableCell align="right">{strings.amountOfDeposit}</TableCell>
                            <TableCell align="right">{strings.numberOfDeposit}</TableCell>
                            <TableCell align="right">{strings.companyDepositLimit}</TableCell>
                            <TableCell align="right">{strings.onlineDepositLimit}</TableCell>
                            <TableCell align="right">{strings.singleWithdrawalLimit}</TableCell>
                            <TableCell>{strings.withdrawalFeeCollectionMethod}</TableCell>
                            <TableCell>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        memberDepositLevel.length === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={9}>没有可用数据</TableCell>
						</TableRow>
						:
                        memberDepositLevel.map((o, memberIndex) => <TableRow key={memberIndex}>
                            <TableCell>{o.node.name ? o.node.name : ''}</TableCell>
                            <TableCell>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={() => {
                                        // history.push(`${USER_MANAGEMENT}/${o.memberNumber}`)
                                        history.push(`${MEMBER_DEPOSIT_LEVEL}/hierarchy-member-details/${o.node.id}`)
                                    }}
                                >
                                    {o.node.pk ? o.node.pk : ''}
                                </Link>
                            </TableCell>
                            <TableCell align="right">{o.node.totalDepositAmount ? o.node.totalDepositAmount : ''}</TableCell>
                            <TableCell align="right">{o.node.totalDeposits ? o.node.totalDeposits : ''}</TableCell>
                            <TableCell align="right">{o.node.depositLimit ? o.node.depositLimit : ''}</TableCell>
                            <TableCell align="right">{o.node.bankTransferDepositLimit ? o.node.bankTransferDepositLimit : ''}</TableCell>
                            <TableCell align="right">{o.node.withdrawalLimit ? o.node.withdrawalLimit : ''}</TableCell>
                            <TableCell>{o.node.withdrawalFeeType ? o.node.withdrawalFeeType : ''}</TableCell>

                            <TableCell>
                                <Grid item>

                                    <ButtonGroup variant="contained" color="primary" aria-label="split button" style={{ minWidth: 300 }}>
                                        <Button style={{ width: "100%" }} onClick={() => handleClick(memberIndex, o.node.id)}>{o.operating === 2 ? options[2] : o.operating === 1 ? options[1] :  options[0]}</Button>
                                        <Button
                                            id={memberIndex}
                                            color="primary"
                                            size="small"
                                            aria-owns={open ? memberIndex : undefined}
                                            aria-haspopup="true"
                                            onClick={handleToggle}
                                        >
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Grid>

                                <Popper buttonRow={buttonRow} open={open && buttonRow === memberIndex} anchorEl={anchorRef.current} transition disablePortal>
                                    {({ TransitionProps, placement }) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{
                                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                            }}
                                        >
                                            <Paper id={memberIndex} style={{ position: "relative", zIndex: 10, minWidth: 250, backgroundColor: "#508FF4" }}>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MenuList>
                                                        {options.map((option, index) => (
                                                            <MenuItem
                                                                id={index}
                                                                key={option}
                                                                onClick={() => handleMenuItemClick(index, memberIndex)}
                                                                style={{ color: "#fff" }}
                                                            >{option}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>

                            </TableCell>
                            {/* <TableCell><Button color="primary" variant="contained" onClick={() => history.push(`${MEMBER_DEPOSIT_LEVEL}/${o.memberNumber}`)}>{strings.seeDetails}</Button></TableCell> */}
                        </TableRow>)
                    }
                />
            </Grid>
            <ContinueCancelModal open={modalContinueOpen} setOpen={setModalContinueOpen} description={strings.warning3} />
            <PaymentMethodConfigurationDialog open={openPaymentMethodConfigurationDialog} handleClose={handleCloseDialog} strings={strings} />
        </Grid>

    </Paper>
}