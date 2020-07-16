import React, {useState} from 'react';
import { MEMBER_NEWS_SEND_MESSAGE, MEMBER_NEWS } from '../../../paths';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../../hooks/use-languages';
import Select2, {createFilter} from 'react-select'
import { Title, GrowItem, Loading } from '../../../components';
// import {FormRowCenterItems, FormLayoutSingleColumn} from '../../../components/form-layouts';
import {useUserDepositQuery, SEND_MESSAGE} from '../../../queries-graphql/member-management/user-management'
import Swal from 'sweetalert2'
import swal from 'sweetalert2';
import {
    Paper,
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
} from '@material-ui/core';
import EditorContainer from '../../member-management/editor';
import Cookies from 'universal-cookie';
import { useMutation } from '@apollo/react-hooks'

const cookies = new Cookies();

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
}));

export default function SendMessage(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState({
        title:''
    });

    const [content, setContent] = useState('')

	const [send] = useMutation(SEND_MESSAGE)

    const strings = useLanguages(MEMBER_NEWS_SEND_MESSAGE);
	const [memberAccountValues, setMemberAccountValues] = useState();
    const { history } = props

    function handleChange(event) {
        setValue({title: event.target.value});
    }

	let arrUsername = []

	const {data, loading} = useUserDepositQuery();
    if(loading) { 
        return <Loading />;
    }
    
	const memberAccountHandleChange = memberAccountValues => {
		setMemberAccountValues(memberAccountValues);
    }

	if(data.users.edges) {
		data.users.edges.map(o => arrUsername.push({value: o.node.id, label: o.node.username}))
    }
    
    async function sendMessage() {
        const res = await send({
            variables: {
                fromUser: cookies.get('ID'),
                toUser: memberAccountValues.value,
                title: value.title,
                message: content
            }
        })
        
        if(res.data.privateMessage.errors.length >= 1){
			let timerInterval
            swal.fire({
                title: '消息未发送',
                html: '有问题',
                timer: 3000,
                onBeforeOpen: () => {
                    swal.showLoading()
                    timerInterval = setInterval(() => {
                        swal.getContent().querySelector('b')
                        .textContent = swal.getTimerLeft()
                    }, 100)
                },
                onClose: () => {
                    clearInterval(timerInterval)
                }
            })
        }else{
            setContent('')
            setValue({title: ''})
            setMemberAccountValues('')
            Swal.fire({
                type: 'success',
                title: '讯息已发送',
                showConfirmButton: false,
                timer: 1500,
                marginTop: '160px !important',
                onClose: history.push(MEMBER_NEWS)
            })
        }
    }

    return <Paper elevation={1}>
        <Title pageTitle={strings.sendMessageTitle} />
        <Grid container direction="row" justify="space-between" alignItems="center">
            <Typography className={classes.paper} variant="h6">{strings.sendMessage}</Typography>
        </Grid>
        <Divider light={true} />
        <Grid container className={classes.paper} alignItems="center" spacing={1}>
            <Grid style={{width: 100}} item>
                <Typography>{strings.recipient}: </Typography>
            </Grid>
            <Grid item>
            <Grid container spacing={1} alignItems="center">
                <Grid item style={{width: 300, flexGrow: 2}}>
                    <Select2 
                        placeholder="选择用户"
                        closeMenuOnSelect={false}
                        fullWidth={true} 
                        isClearable={true}
                        onChange={memberAccountHandleChange} 
                        value = {memberAccountValues}
                        options={
                            arrUsername
                        }
                        filterOption={createFilter({ignoreAccents: false})}
                    />
                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid container className={classes.paper} style={{ paddingTop: 0 }} alignItems="center" spacing={1}>
            <Grid item style={{width: 100}}>
                <Typography>{strings.headline}: </Typography>
            </Grid>
            <Grid item style={{ width: 300 }}>
                <TextField
                    fullWidth
                    className={classes.textfield}
                    variant="outlined"
                    margin="dense"
                    placeholder={strings.pleaseEnter}
                    name="title"
                    onChange={handleChange}
                    value={value.title}
                />
            </Grid>
        </Grid>
        <Grid item style={{height: 500, overflowX: 'auto'}}>
            <EditorContainer
                setContent={setContent}
            />
        </Grid>
        <Grid container className={classes.paper} alignItems="center" spacing={1}>
            <GrowItem />
                <Grid item>
                    <Button disabled={memberAccountValues === undefined ? true : false} color="primary" onClick={() => sendMessage()} variant="contained" >{strings.send}</Button>
                </Grid>
                <Grid item>
                    <Button className={classes.buttonGray} onClick={() => history.push(MEMBER_NEWS)} variant="contained">{strings.return}</Button>
                </Grid>
        </Grid>
    </Paper>
}