import React from 'react';
import { Paper, Grid, Button, Typography, TextField, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import Title from '../../../components/title';
import useLanguages from '../../../hooks/use-languages';
import {
    CUSTOMER_SERVICE_CONFIGURATION
} from '../../../paths';
import { FormLayoutSingleColumn } from '../../../components/form-layouts';
import { ErrorOutline, } from '@material-ui/icons';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2)
    },

    main: {
        paddingTop: theme.spacing(10),
        paddingLeft: theme.spacing(20),
        paddingRight: theme.spacing(20),
        paddingBottom: theme.spacing(10)
    },

    slider: {
        padding: theme.spacing(3),
        border: '1px grey solid',
        borderRadius: 2,
        marginBottom: 50
    },

    gridList: {
        width: 500,
        height: 250,
    },

    scrollableGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 5,
    },


    textField: {
        width: 600
    },
}));

export default function RegistrationAndLoginConfiguration(props) {
    const { handleChange } = props;
    const classes = useStyles();
    const strings = useLanguages(CUSTOMER_SERVICE_CONFIGURATION);
    const [newStatus, setNewState] = React.useState(false);

    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        account: '',
        commissionType: '',
        status: '',
        customerServiceType: ''
    });

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }));
    }

    // function onFocusChange(f) {
    //     setFocusedInput(f);
    // }

    // const [focusedInput, setFocusedInput] = useState(null);
    // function onDatesChange({ startDate, endDate }) {
    //     setFilterValues(oldValues => ({
    //         ...oldValues,
    //         startDate,
    //         endDate
    //     }));
    // }

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

    const statusSwitchHandle = agentId => event => {
        setNewState(event.target.checked);
    };

    return <FormLayoutSingleColumn>
        <Title pageTitle={strings.customerServiceConfiguraion} />

        <Paper className={classes.paper} elevation={1} style={{ marginTop: "20px" }}>
            <Grid container direction="column" alignItems="center">
                <Grid container md={7} style={{ paddingTop: 40, paddingBottom: 40 }}>
                    <Grid container alignItems="center" alignContent="center">
                        <Button variant="contained" color="primary" style={{ height: 30, marginRight: 10 }}>{strings.frontDeskOne}</Button>
                        <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: '#4fc3f7', color: '#fff' }}>{strings.frontDeskTwo}</Button>
                        <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: '#4fc3f7', color: '#fff' }}>{strings.frontDeskThree}</Button>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.onlineCustomerServiceConfiguration} </Typography></Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item md={2} container direction="column" justify="center" alignItems="flex-end" style={{ marginRight: 10 }}>
                            <Typography>{strings.customerServiceType}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <Select margin="dense"
                                name="customerServiceType"
                                value={filterValues.customerServiceType}
                                onChange={handleFilterChange}
                                input={<OutlinedInput notched={false} labelWidth={88} name="customerServiceType" />}
                                style={{ width: 400 }}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value={strings.theNewVersionOfLive800OnlineCustomerService}>{strings.theNewVersionOfLive800OnlineCustomerService}</MenuItem>
                                <MenuItem value={strings.oldLive800OnlineCustomerService}>{strings.oldLive800OnlineCustomerService}</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                        <Grid item md={2} alignItems="flex-end" direction="column" style={{ marginTop: 10, marginRight: 10 }}>
                            <Typography>{strings.customerServiceAddress}:</Typography>
                        </Grid>

                        <Grid item md={9} alignItems="center">
                            <TextField
                                multiline
                                rows="20"
                                className={classes.textField}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item md={2} container direction="column" justify="center" style={{ marginRight: 10 }}>
                            <Typography>{strings.newCustomerKey}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" name="newCustomerKey"
                                onChange={handleChange} placeholder={strings.pleaseEnter} />
                        </Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item md={2} container direction="column" justify="center" style={{ marginRight: 10 }}>
                            <Typography>{strings.whetherToOpen}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={newStatus}
                                onChange={statusSwitchHandle(newStatus)}
                                value={newStatus}
                                name="whetherToOpen"
                            />
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" alignContent="center" style={{ marginTop: 40 }}>
                        <ErrorOutline color="primary" style={{ marginRight: 10 }} />
                        <Grid item><Typography variant="h6">{strings.officialQQConfiguration} </Typography></Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item md={1} container direction="column" justify="center" style={{ marginRight: 10 }}>
                            <Typography>{strings.QQNumber1}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" name="QQNumber1"
                                onChange={handleChange} placeholder={strings.pleaseEnter} />
                            <Button variant="contained" color="primary" style={{ height: 30, marginRight: 10, marginLeft: 10 }}>{strings.addTo}</Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row">
                        <Grid item md={1} container direction="column" justify="center" style={{ marginRight: 10 }}>
                            <Typography>{strings.QQNumber2}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <TextField variant="outlined" margin="dense" name="QQNumber2"
                                onChange={handleChange} placeholder={strings.pleaseEnter} />
                            <Button variant="contained" color="primary" style={{ height: 30, marginRight: 10, marginLeft: 10 }}>{strings.addTo}</Button>
                            <Button variant="contained" style={{ height: 30, marginRight: 10, backgroundColor: 'rgba(228, 31, 43, 1)', color: '#fff' }}>{strings.delete}</Button>
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center">
                        <Grid item md={2} container direction="column" justify="center" style={{ marginRight: 10 }}>
                            <Typography>{strings.whetherToOpen}:</Typography>
                        </Grid>

                        <Grid container md={5} alignItems="center">
                            <IOSSwitch
                                checked={newStatus}
                                onChange={statusSwitchHandle(newStatus)}
                                value={newStatus}
                                name="whetherToOpen"
                            />
                        </Grid>
                    </Grid>

                    <Grid container style={{ marginTop: 10 }}><Button variant="contained" color="primary">{strings.save}</Button></Grid>
                </Grid>
            </Grid>
        </Paper>
    </FormLayoutSingleColumn>
}