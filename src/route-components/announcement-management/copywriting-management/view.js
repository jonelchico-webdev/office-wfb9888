import React from 'react';
import { Title, Loading, EditorShow } from '../../../components';
import {
    Paper,
    Grid,
    Typography,
    Button
} from '@material-ui/core';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles } from '@material-ui/styles';
import { COPYWRITING_MANAGEMENT } from '../../../paths';
import { useCopywritingManagementID } from '../../../queries-graphql/announcement-management/copywriting-management/copywriting-management-query'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
    margin: {
        margin: theme.spacing(1)
    }
}));

export default function CopyView(props) {
    const classes = useStyles();
    const strings = useLanguages(COPYWRITING_MANAGEMENT);
    const { history } = props
    const id = history.location.pathname.split('/', 6)[4]

    function goBack() {
        history.push(COPYWRITING_MANAGEMENT)
    }

    const { data, loading } = useCopywritingManagementID({
        id: id
    });

    if (loading) {
        return <Loading />
    }

    const copywritingManagementID = data.systemDocs.edges[0];

    return <Paper elevation={1} >
        <Title pageTitle={strings.viewCopywrite} />
        <Grid container className={classes.paper}>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography style={{ display: "inline-block" }}>{strings.copyName}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.title}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography style={{ display: "inline-block" }}>{strings.displayPosition}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.position}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="start-end" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography >{strings.copyContent}:</Typography>
                </Grid>
                <Grid id="editor-scroll" style={{ height: 300, overflowX: "auto", paddingLeft: 12 }} item xs={12} md={10}>
                    <EditorShow
                        defaultValue={copywritingManagementID.node.message}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography style={{ display: "inline-block" }}>{strings.sortWeight}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.weight}</Typography>
                </Grid>
            </Grid>
            <Grid item container justify="center" className={classes.margin}>
                <Grid item >
                    <Button variant="contained" size="big" onClick={goBack} color="primary">{strings.return}</Button>
                </Grid>
            </Grid>

        </Grid>

        {/* <Title pageTitle={strings.viewCopywrite} />
        <Grid container className={classes.paper}>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography variant="h5" style={{ display: "inline-block" }}>{strings.copyName}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography variant="h6" style={{ display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.title}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography variant="h5" style={{ display: "inline-block" }}>{strings.displayPosition}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography variant="h6" style={{ display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.position}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="start-end" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography variant="h5">{strings.copyContent}:</Typography>
                </Grid>
                <Grid id="editor-scroll" style={{ height: 300, overflowX: "auto", paddingLeft: 12}} item xs={12} md={10}>
                    <EditorShow defaultValue={copywritingManagementID.node.message}/>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography variant="h5" style={{ display: "inline-block" }}>{strings.sortWeight}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography variant="h6" style={{ display: "inline-block", marginLeft: '1rem' }}>{copywritingManagementID.node.weight}</Typography>
                </Grid>
            </Grid>
            <Grid item container justify="center" className={classes.margin}>
                <Grid item >
                    <Button variant="contained" size="big" onClick={goBack} color="primary">{strings.return}</Button>
                </Grid>
            </Grid>

        </Grid> */}
    </Paper>
}