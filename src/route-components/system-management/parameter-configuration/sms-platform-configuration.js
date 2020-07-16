import React from 'react';
import {  Paper, Grid, Button, Typography, TextField, OutlinedInput, Select, MenuItem} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import { PARAMETER_CONFIGURATION } from '../../../paths';

import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
	root: {
      padding: theme.spacing(12, 12, 12, 12),
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
}));

export default function HomeFloatingWindowConfiguration(props) {
    const classes = useStyles();
    const strings = useLanguages(PARAMETER_CONFIGURATION);

    return <Grid>

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            
            <Grid container direction="column" alignItems="center">
                <Grid md={5} container alignItems="center" spacing={1}>
                    <InfoIcon color="primary"/>
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.SMSPlatformConfigurationInMainlandChina}</Typography>
                </Grid>

                <Grid md={5} alignItems="center" container style={{ marginTop: "1rem" }}>
                    <Grid item md={2}>
                        <Typography>{strings.SMSPlatform}</Typography>
                    </Grid>

                    <Grid item md={8}>
                        <Select
                            margin="dense"
                            className={classes.textfield}
                            name="selectStatus"
                            value={strings.pleaseChoose}
                            input={<OutlinedInput notched={false} name="selectStatus"/>}
                        >
                            <MenuItem value={strings.pleaseChoose}>{strings.pleaseChoose}</MenuItem>
                            <MenuItem value={strings.cloudSMS}>{strings.cloudSMS}</MenuItem>
                            <MenuItem value=".....">.....</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid md={5} alignItems="center" container style={{ marginTop: "1rem" }}>
                    <Grid item md={2}>
                        <Typography>{strings.SMSKey}</Typography>
                    </Grid>

                    <Grid item md={8}>
                        <TextField type="text" variant="outlined" margin="dense" fullWidth/>
                    </Grid>
                </Grid>

            </Grid>

            {/* END */}

            <Grid container direction="column" alignItems="center" style={{ marginTop: "2rem" }}>
                <Grid md={5} container alignItems="center" spacing={1}>
                    <InfoIcon color="primary"/>
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.internationalSMSPlatformConfiguration}</Typography>
                </Grid>

                <Grid md={5} alignItems="center" container style={{ marginTop: "1rem" }}>
                    <Grid item md={2}>
                        <Typography>{strings.SMSPlatform}</Typography>
                    </Grid>

                    <Grid item md={8}>
                        <Select
                            margin="dense"
                            className={classes.textfield}
                            name="selectStatus"
                            value={strings.pleaseChoose}
                            input={<OutlinedInput notched={false} name="selectStatus"/>}
                        >
                            <MenuItem value={strings.pleaseChoose}>{strings.pleaseChoose}</MenuItem>
                            <MenuItem value={strings.cloudSMS}>{strings.cloudSMS}</MenuItem>
                            <MenuItem value=".....">.....</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid md={5} alignItems="center" container style={{ marginTop: "1rem" }}>
                    <Grid item md={2}>
                        <Typography>{strings.SMSKey}</Typography>
                    </Grid>

                    <Grid item md={8}>
                        <TextField type="text" variant="outlined" margin="dense" fullWidth/>
                    </Grid>
                </Grid>

            </Grid>

            <Grid style={{paddingTop: 30, paddingRight: 50, marginBottom: 30}} justify="center" container>
                <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained">{strings.save}</Button>
            </Grid>

        </Paper>
    </Grid>
}