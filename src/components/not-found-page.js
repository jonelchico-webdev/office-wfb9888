import React from 'react';
import { Button, Grid, Typography, Paper } from '@material-ui/core';
import { ReactComponent as Error } from '../icons/sync.svg'
import { makeStyles } from '@material-ui/styles';
import Cookies from 'universal-cookie';
import useLanguages from '../hooks/use-languages';
import { ERROR } from '../paths';


const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(6),
        textAlign: 'center',
        color: "#283f61",
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
    error: {
        color: "#283f61",
    },
    hoverPointer: {
        cursor: 'pointer'
    },
}));

export default function NotFoundPage({ history }) {
    const classes = useStyles();
    const strings = useLanguages(ERROR);

    // cookies.remove("Logged")

    function goBack() {
        cookies.remove("JWT", { path: "/" })
        cookies.remove("Username", { path: "/" })
        cookies.remove("Logged", { path: "/" })
        cookies.remove("ID", { path: "/" })
        history.push('/login')
    }

    return <Paper className={classes.paper} elevation={2}>

        <Grid container direction="column" spacing={2} justify="center" alignItems="center" style={{ minWidth: "50vh" }}>
            {/* <Grid item> */}
            {/* <Typography>PAGE NOT FOUND</Typography> */}
            <Grid item>
                <Error style={{ maxWidth: "30vh", maxHeight: "30vh" }} />

            </Grid>
            <Grid item>
                <Typography variant="h4" style={{ marginBottom: 15 }} className={classes.error}>{strings.subtitle1}</Typography>
                <Typography variant="h5" color="black">{strings.subtitle2}</Typography>
            </Grid>
            <Grid item>
                <Button size="large" color="primary" onClick={goBack} variant="contained">{strings.button}</Button>
            </Grid>
            {/* </Grid> */}
        </Grid>


    </Paper>

}