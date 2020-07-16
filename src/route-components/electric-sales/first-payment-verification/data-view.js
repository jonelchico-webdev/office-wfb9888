import React from 'react'
import { makeStyles } from '@material-ui/styles';
import Title from '../../../components/title';
import {Loading} from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { FIRST_PAYMENT_VERIFICATION } from '../../../paths';
import { Box, Paper, Grid, Button, Typography, Divider, TextField } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import useWithdrawalFirsts from '../../../queries-graphql/electric-sales/first-payment-verification'

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
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    checkBox: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
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
    padding: {
        padding: theme.spacing(2),

    },
}));

export default function DataView(props) {
    const classes = useStyles();
    const strings = useLanguages(FIRST_PAYMENT_VERIFICATION);
    const { history } = props;

    const {data, loading} = useWithdrawalFirsts({id: history.location.pathname.split('/', 4)[3]});
    if(loading) { 
        return <Loading />
    } 
    
    // const { firstPaymentVerification } = data.withdrawalFirsts.edges;
    const userData = data.withdrawalFirsts.edges[0].node;

    console.log(data.withdrawalFirsts.edges)

    return <Grid>
        <Title pageTitle={strings.dataView} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.dataView}</Typography>
            <Divider light={true} style={{ marginTop: "1em", marginBottom: "2em" }} />

            <Grid container alignItems="center" spacing={1}>
                <InfoIcon color="primary" />
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.basicInformation}</Typography>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.agentLineSituation}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.username}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.accountNumber}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.orderId}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.memberNumber}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.pk}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.accountBalance}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.balance}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.userStatus}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.status}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.memberLevel}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.memberLevel ? userData.risk.withdrawal.user.memberLevel.name : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.VIPRating}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.vipLevel ? userData.risk.withdrawal.user.vipLevel.name : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.registrationTime}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.registeredAt ? userData.risk.withdrawal.user.registeredAt.split("T", 2)[0] : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.registeredIP}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.lastLoginIp ? userData.risk.withdrawal.user.lastLoginIp : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.registrationURL}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                {/* <Typography>{userData.risk.withdrawal.user.announcementCreateUser ? userData.risk.withdrawal.user.announcementCreateUser.edges[0].node.url : '(没有数据)'}</Typography> */}
                                <Typography>(没有数据)</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.lastLoginTime}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.lastLogin ? userData.risk.withdrawal.user.lastLogin : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.lastLoginIP}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.lastLoginIp ? userData.risk.withdrawal.user.lastLoginIp : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container alignItems="center" spacing={1} style={{ paddingTop: "2rem" }}>
                <InfoIcon color="primary" />
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.contactInformation}</Typography>
            </Grid>

           <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.actualName}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.name ? userData.risk.withdrawal.user.name : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.bday}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.birthDate ? userData.risk.withdrawal.user.birthDate : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

             <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.cellphoneNumber}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.phone ? userData.risk.withdrawal.user.phone : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.microSignalCode}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>(没有数据)</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.QQNumber}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.qqNumber ? userData.risk.withdrawal.user.qqNumber : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.email}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawal.user.email ? userData.risk.withdrawal.user.email : '(没有数据)'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container alignItems="center" spacing={1} style={{ paddingTop: "2rem" }}>
                <InfoIcon color="primary" />
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.consumptionInformation}</Typography>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.totalDeposits}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>0</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.totalDepositAmount}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>0.00</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.totalWithdrawals}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.withdrawalCount ? userData.risk.withdrawalCount : 0}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.totalWithdrawalAmount}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>{userData.risk.finalAmount ? userData.risk.finalAmount : 0.00}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container>
                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.totalEffectiveBet}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>(没有数据)</Typography>
                                <Typography>{strings.notInquiry}:</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid md={5}>
                    <Grid container direction="row" alignItems="center" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <Grid md={2}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.userProfitLoss}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={8}>
                            <Grid item>
                                <Typography>(没有数据)</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container alignItems="center" spacing={1} style={{ paddingTop: "2rem" }}>
                <InfoIcon color="primary" />
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.remarks}</Typography>
            </Grid>

            <Grid container>
                <TextField
                    id="filled-multiline-static"
                    label="Remarks"
                    multiline
                    rows="10"
                    value="(没有数据)"
                    className={classes.textField}
                    margin="normal"
                    variant="filled"
                    fullWidth
                    disabled
                >

                </TextField>
            </Grid>

            <Grid container alignItems="center" spacing={1} style={{ paddingTop: "2rem" }}>
                <InfoIcon color="primary" />
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.bankCardInformation}</Typography>
            </Grid>

            <Grid item container className={classes.padding}>
                <Grid md={6}>
                    <Box className={classes.bankCardCointainer} border={1} borderRadius={16} alignItems="center">
                        <Box item >
                            {/* <img className={classes.img} src={bankImage2} /> */}
                        </Box>
                        <Box style={{ marginTop: 40 }} item>
                            <Typography style={{ fontWeight: 'bold' }} variant="h6">{userData.risk.withdrawal.user.username}</Typography>
                        </Box>
                        <Box item>
                            <Typography style={{ fontWeight: 'bold' }} variant="h6"> {userData.risk.balance}</Typography>
                        </Box>
                        <Box item>
                            <Typography color="textSecondary" style={{ fontWeight: 'bold' }} variant="subtitle1">{userData.risk.createdAt}</Typography>
                        </Box>
                    </Box>
                </Grid>
                {/* <Grid md={6}>
                    <Box className={classes.bankCardCointainer} border={1} borderRadius={16} alignItems="center">
                        <Box item >
                            <img className={classes.img} src={bankImage1} />
                        </Box>
                        <Box style={{ marginTop: 40 }} item>
                            <Typography style={{ fontWeight: 'bold' }} variant="h6">{data.firstPaymentVerification[userId].memberAccount}</Typography>
                        </Box>
                        <Box item>
                            <Typography style={{ fontWeight: 'bold' }} variant="h6"> {data.firstPaymentVerification[userId].accountBalance}</Typography>
                        </Box>
                        <Box item>
                            <Typography color="textSecondary" style={{ fontWeight: 'bold' }} variant="subtitle1">{data.firstPaymentVerification[userId].withdrawalApplicationTime}</Typography>
                        </Box>
                    </Box>
                </Grid> */}
            </Grid>

        </Paper>

        <Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>
            <Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" onClick={() => history.push(FIRST_PAYMENT_VERIFICATION)}>{strings.return}</Button>
        </Grid>
    </Grid>

}