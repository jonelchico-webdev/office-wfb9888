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
import { SYSTEM_NOTIFICATION_VIEW, MEMBER_NEWS_INBOX, MEMBER_NEWS_OUTBOX } from '../../../paths';
import { useMessageQueryID } from '../../../queries-graphql/announcement-management/member-news/message-query'
import moment from 'moment'

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

export default function ViewInbox(props) {
    const classes = useStyles();
    const strings = useLanguages(SYSTEM_NOTIFICATION_VIEW);
    const { history } = props
    const id = history.location.pathname.split('/', 6)[5]
    const typeOfMessage = history.location.pathname.split('/', 6)[3]

    function goBack() {
        if (typeOfMessage === "inbox") {
            history.push({pathname: MEMBER_NEWS_INBOX, state: "memberNews"})
        } else if (typeOfMessage === "outbox") {
            history.push({pathname: MEMBER_NEWS_OUTBOX, state: "memberNews"})
        }
    }

    const { data, loading } = useMessageQueryID({
        startAt: '2005-01-01',
        endAt: "2050-05-30",
        id: id
    });

    if (loading) {
        return <Loading />
    }

    const privateMessages = data.privateMessages.edges[0];

    return <Paper elevation={1} >
        <Title pageTitle={strings.systemNotificationView} />
        <Grid container className={classes.paper}>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography  style={{ display: "inline-block" }}>{strings.title}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{privateMessages.node.title ? privateMessages.node.title : "无题"}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography  style={{ display: "inline-block" }}>{strings.recipient}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{privateMessages.node.toUser ? privateMessages.node.toUser.username : "未知"}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="start-end" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography >{strings.announcementContent}:</Typography>
                </Grid>
                <Grid id="editor-scroll" style={{ height: 300, overflowX: "auto", paddingLeft: 12}} item xs={12} md={10}>
                    <EditorShow
                        defaultValue={privateMessages.node.message}
                    />
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1}>
                    <Typography  style={{ display: "inline-block" }}>{strings.sender}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{privateMessages.node.fromUser ? privateMessages.node.fromUser.username : "未知"}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center" className={classes.margin}>
                <Grid item xs={12} md={1} >
                    <Typography  style={{ display: "inline-block" }}>{strings.displayTime}:</Typography>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Typography style={{ fontWeight: "bold", display: "inline-block", marginLeft: '1rem' }}>{moment(privateMessages.node.createdAt).format("YYYY-MM-DD HH:MM:SS")}</Typography>
                </Grid>
            </Grid>
            <Grid item container justify="center" className={classes.margin}>
                <Grid item >
                    <Button variant="contained" size="big" onClick={goBack} color="primary">{strings.return}</Button>
                </Grid>
            </Grid>

        </Grid>
    </Paper>
}