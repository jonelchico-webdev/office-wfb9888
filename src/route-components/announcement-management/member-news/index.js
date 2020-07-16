import React, { Fragment } from "react";
import { makeStyles, withStyles } from '@material-ui/styles';
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import memberNewsInbox from "./inbox"
import memberNewsOutbox from "./outbox"
import sendMessage from "./send-message"
import memberNewsViewInbox from "./view-inbox"
import useLanguages from '../../../hooks/use-languages';
import { MEMBER_NEWS, MEMBER_NEWS_INBOX, MEMBER_NEWS_OUTBOX, MEMBER_NEWS_SEND_MESSAGE, MEMBER_NEWS_INBOX_VIEW, MEMBER_NEWS_OUTBOX_VIEW } from "../../../paths";
import {
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    Divider
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    paper: {
        padding: theme.spacing(2)
    },
    textfield: {
        backgroundColor: '#ffffff',
    },
    buttonGray: {
        backgroundColor: '#9e9e9e',
        color: '#ffffff'
    },
    red: {
        color: "red"
    },
    green: {
        color: "green"
    }
}));

const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);

const AntTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing(4),
        fontSize: 15,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    selected: {},
}))(props => <Tab disableRipple {...props} />);

export default function App() {
    const classes = useStyles();
    const strings = useLanguages(MEMBER_NEWS_INBOX);
    const [value, setValue] = React.useState(0);
    function handleChange(event, newValue) {
        setValue(newValue);
    }
    return (
        <BrowserRouter>
            <Grid className="App">
                <Switch>

                    <Route path={MEMBER_NEWS_INBOX_VIEW} component={memberNewsViewInbox} />
                    <Route path={MEMBER_NEWS_OUTBOX_VIEW} component={memberNewsViewInbox} />
                    <Route path={MEMBER_NEWS_SEND_MESSAGE} component={sendMessage} />

                    <Route
                        path={MEMBER_NEWS}
                        render={() => (
                            <Fragment>
                                <Paper elevation={1}>
                                    <Grid container direction="row" justify="space-between" alignItems="center">
                                        <Typography className={classes.paper} variant="h6">{strings.memberNews}</Typography>
                                    </Grid>
                                    <Divider light={true} />
                                    <Grid className={classes.root}>
                                        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
                                            <AntTab label={strings.inbox} component={Link} to={MEMBER_NEWS_INBOX} />
                                            <AntTab label={strings.outbox} component={Link} to={MEMBER_NEWS_OUTBOX} />
                                        </AntTabs>
                                    </Grid>
                                </Paper>
                                <Switch>
                                    <Route path={MEMBER_NEWS_OUTBOX} component={memberNewsOutbox} />
                                    <Route path={MEMBER_NEWS} component={memberNewsInbox} />
                                </Switch>
                            </Fragment>
                        )}
                    />
                </Switch>
            </Grid>
        </BrowserRouter>
    );

}

