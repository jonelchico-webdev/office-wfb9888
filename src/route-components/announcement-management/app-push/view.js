import React, { useState } from 'react';
import { Title } from '../../../components';
import {
    Paper,
    Grid,
    Typography,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Checkbox,
    TextField
} from '@material-ui/core';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import { APP_PUSH_VIEW, APP_PUSH } from '../../../paths';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
    },
}));

export default function View(props) {
    const classes = useStyles();
    const strings = useLanguages(APP_PUSH_VIEW);
    const [value, setValue] = useState('none')
    const [device, setDevice] = useState('none')
    const { history } = props

    function handleChange(event) {
        setValue(event.target.value);
        
    }

    function handleChangeDevice(event) {
        setDevice(event.target.value);    
    }

    console.log(value, 'value')
    console.log(device, 'device')

    return <Paper elevation={1} style={{ height: "88vh", padding: 20 }}>
        <Title pageTitle={strings.appPushView} />
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography className={classes.padding} variant="h6">{strings.appPushView}</Typography>
        </Grid>
        <Divider light={true} />
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <Typography>{strings.recipient} : </Typography>
            </Grid>
            <Grid item>
                <FormControl component="fieldset" >
                    <RadioGroup aria-label="allMembers" name="allMembers" value={value} onChange={handleChange}>
                        <FormControlLabel
                            value={strings.allMembers}
                            control={<Radio color="primary" />}
                            label={strings.allMembers}
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl component="fieldset" >
                    <RadioGroup aria-label="hierarchicalSelection" name="hierarchicalSelection" value={value} onChange={handleChange}>
                        <FormControlLabel
                            value={strings.hierarchicalSelection}
                            control={<Radio color="primary" />}
                            label={strings.hierarchicalSelection}
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl component="fieldset" >
                    <RadioGroup aria-label="designatedMember" name="designatedMember" value={value} onChange={handleChange}>
                        <FormControlLabel
                            value={strings.designatedMember}
                            control={<Radio color="primary" />}
                            label={strings.designatedMember}
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl component="fieldset" >
                    <RadioGroup aria-label="designatedDevice" name="designatedDevice" value={value} onChange={handleChange}>
                        <FormControlLabel
                            value={strings.designatedDevice}
                            control={<Radio color="primary" />}
                            label={strings.designatedDevice}
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
        </Grid>
        {
                value === strings.hierarchicalSelection ?
                <Grid container className={classes.paper} style={{paddingTop: 0, marginLeft: "5vh"}} alignItems="center">
                    <FormControl component="fieldset">
                        <FormControlLabel
                            value={strings.unlayered}
                            control={<Checkbox color="primary" />}
                            label={strings.unlayered}
                            labelPlacement="end"
                        />
                    </FormControl>
                
                    <FormControl component="fieldset">
                        <FormControlLabel
                            value={strings.layerOne}
                            control={<Checkbox color="primary" />}
                            label={strings.layerOne}
                            labelPlacement="end"
                        />
                    </FormControl>
                
                    <FormControl component="fieldset">
                        <FormControlLabel
                            value={strings.layerTwo}
                            control={<Checkbox color="primary" />}
                            label={strings.layerTwo}
                            labelPlacement="end"
                        />
                    </FormControl>
                
                </Grid>
                : value === strings.designatedMember ? 
                <Grid container className={classes.paper} style={{paddingTop: 0, marginLeft: "5vh"}} alignItems="center">
                    <TextField
                        id="outlined-basic"
                        className={classes.textField}
                        label="Outlined"
                        margin="dense"
                        variant="outlined"
                        stlye={{height: 10}}
                    />
                </Grid>
                : value === strings.designatedDevice ?
                <Grid container className={classes.paper} style={{paddingTop: 0, marginLeft: "5vh"}} alignItems="center">
                    <Grid item>
                        <FormControl component="fieldset" >
                            <RadioGroup aria-label="android" name="android" value={device} onChange={handleChangeDevice}>
                                <FormControlLabel
                                    value="android"
                                    control={<Radio color="primary" />}
                                    label="Android"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl component="fieldset" >
                            <RadioGroup aria-label="iOS" name="iOS" value={device} onChange={handleChangeDevice}>
                                <FormControlLabel
                                    value="iOS"
                                    control={<Radio color="primary" />}
                                    label="iOS"
                                    labelPlacement="end"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                : null

        }
        <Grid container>
            <Grid item style={{ marginBottom: 10 }}>
                <Typography>{strings.pushContent}: testliu,您已出款100.00元，账户余额206264.2295元 祝您游戏愉快！</Typography>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item style={{ marginBottom: 10 }}>
                <Typography>{strings.pushTime}: 2019-05-01 18:00:00 {strings.to} 2019-05-03 18:00:00</Typography>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item style={{ marginBottom: 10 }}>
                <Typography>{strings.founder}: test2</Typography>
            </Grid>
        </Grid>
        <Grid container>
            <Grid item style={{ marginBottom: 10 }}>
                <Typography>{strings.creationTime}: 2019-05-01 19:52:00</Typography>
            </Grid>
            <Grid container>
                <Grid item style={{ marginTop: "5vh"}}>
                    <Button variant="contained" onClick={() => history.push(APP_PUSH)} color="primary">{strings.return}</Button>
                </Grid>
            </Grid>
        </Grid>

    </Paper>
}