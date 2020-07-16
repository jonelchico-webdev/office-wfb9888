import React, { useState, Fragment, useEffect } from 'react';
import { IconButton, Badge, Menu, ListItem, Divider, ListItemText, Typography, Button, Grid
} from '@material-ui/core';
import useLanguages from '../hooks/use-languages';
import { makeStyles, useTheme } from '@material-ui/styles';
import { SYSTEM_NOTIFICATION_VIEW, MEMBER_NEWS_INBOX_VIEW } from '../paths';
import { useMessageQuery } from '../queries-graphql/announcement-management/member-news/message-query'
import { READ_MESSAGE_MUTATION } from '../queries-graphql/announcement-management/member-news/message-mutation'
import { useMutation } from '@apollo/react-hooks'
import NotificationsIcon from '@material-ui/icons/Notifications';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(2)
    },
}));

export default function NotificationBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const strings = useLanguages(SYSTEM_NOTIFICATION_VIEW);
    const { history } = props

    const [refresh, setRefresh] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    
    function handleClose() {
        setAnchorEl(null)
    }

    const [messageRead] = useMutation(READ_MESSAGE_MUTATION)

    async function goToMessage(id) {
        const res = await messageRead({
            variables: {
                id: id,
                isRead: true
            }
        })

        if(res) {
            setAnchorEl(null)
            history.push(`${MEMBER_NEWS_INBOX_VIEW}/${id}`)
        }
    }

    const [timer, setTimer] = useState(100)

	useEffect(() => {
		if (history.location.pathname === '/login') {

		} else {
			const interval = setInterval(() => {
				if(timer > 0) {
                    setTimer(timer - 100)
				} else if (timer === 0) {
                    setTimer(100)
                    setRefresh(!refresh)
				}
			}, 100);
			return () => clearInterval(interval);
		}
    }, [history.location.pathname]);
    

    const { data, loading } = useMessageQuery({
        refresh: refresh,
        startAt: '2005-01-01', 
        endAt: "2050-05-30",
        enabled: true,
        isRead: false,
        toUser_Username: cookies.get("Username"),
        first: 5
    });

    if(loading) {
        return null
    }
    
    var privateMessages = []
    if(data.privateMessages) {
        privateMessages = data.privateMessages.edges;
    }
    
    const messagesNotification = (
        <Menu 
            id="messages-notification" 
            anchorEl={anchorEl} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            keepMounted 
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(anchorEl)} 
            onClose={handleClose}
            style={{marginTop: '3rem'}}
        >
            
            {
                privateMessages.length !== 0 ? <div>

                <Divider/>
                {
                    privateMessages.map((o, idx) => 
                    <Fragment>
                        <Button 
                            style={{ textTransform: "none", width: 300 }}
                            onClick={() => goToMessage(o.node.id)}
                            >
                            <ListItem>
                                {/* <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar> */}
                                <ListItemText
                                    primary={o.node.title}
                                    secondary={
                                        <Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {/* {o.node.fromUser.username} */}
                                        </Typography>
                                        {" — Send at:" + o.node.createdAt}
                                        </Fragment>
                                    }
                                    />
                            </ListItem>
                        </Button>
                        <Divider/>
                    </Fragment>
                    )
                }
                </div>
                :
                <Grid container justify="center" style={{ width: 300 }}>
                    <Typography variant="h5">{strings.noNewMessage}</Typography>
                </Grid>
            }
        </Menu>
    )

    return <Fragment>
        <IconButton
            aria-label="Show new notifications" 
            aria-controls="messages-notification"
            aria-haspopup="true"
            size="small" 
            color="inherit"
            onClick={(event) => {setAnchorEl(event.currentTarget)}}
            style={{marginRight: privateMessages.length !== 0 ? 12 : 0}}
        >
            <Badge badgeContent={privateMessages.length} color="secondary">
                <NotificationsIcon htmlColor={ privateMessages.length !== 0 ? theme.palette.text.primary : theme.palette.text.secondary} fontSize="large" />
            </Badge>
        </IconButton> 
        {messagesNotification}
    </Fragment>
}