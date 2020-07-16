import React, { useState, Fragment } from 'react';
import useLanguages from '../../../hooks/use-languages';
import { makeStyles  } from '@material-ui/styles';
import { MEMBER_NEWS_INBOX, MEMBER_NEWS_SEND_MESSAGE, MEMBER_NEWS_OUTBOX_VIEW } from '../../../paths';
import { SimpleTable, Loading, Title, GrowItem, AppDateRangePicker } from '../../../components';
import {
    Paper, Grid, Typography, Button, TableRow, TableCell, 
    TextField, Select, OutlinedInput, MenuItem, Checkbox,
    FormControlLabel
} from '@material-ui/core';
import usePagination from '../../../hooks/use-pagination'
import { useMessageQuery } from '../../../queries-graphql/announcement-management/member-news/message-query'
import { DELETE_MESSAGE_MUTATION, READ_MESSAGE_MUTATION } from '../../../queries-graphql/announcement-management/member-news/message-mutation'
import gql from 'graphql-tag'
import swal from 'sweetalert2';
import { useMutation } from '@apollo/react-hooks'
// import moment from 'moment';
import Cookies from 'universal-cookie';
import moment from 'moment'

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
    red: {
        color: "red"
    },
    green: {
        color: "green"
    },
    bold: {
        fontWeight: "bold"
    },
    grey: {
        color: "#9d9fa3"
    },
    tcellUnread: {
		backgroundColor: '#eef1f6 !important',
		color: 'rgba(82,87,93, 0.65) !important'
    },
    tcellRead: {        
		backgroundColor: '#f5f7fa !important',
    },
}));

let batchMutateDummy = `mutation{
    GetCaptcha {
        success
        imagePath
        requestIp
        captchaKey
    }
}` 

export default function Inbox(props) {
    const classes = useStyles();
    const strings = useLanguages(MEMBER_NEWS_INBOX);
    const { history } = props
    const [refresh, setRefresh] = useState(false)

    const [filterValues, setFilterValues] = useState({
        recipient: '',
        sender: '',
        status: null,
        startDate: null,
        endDate: null,
    });
    const [selected, setSelected] = React.useState([]);
	const isSelected = id => selected.indexOf(id) !== -1;

    function handleFilterChange(event) {
        event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    const [focusedInput, setFocusedInput] = useState(null);
    function onFocusChange(f) {
        setFocusedInput(f);
    }
    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }

    function onChangeClear() {
        setFilterValues(oldValues => ({
            ...oldValues,
            recipient: '',
            sender: '',
            status: null,
            startDate: null,
            endDate: null,
        }));
    }

    const [filter, setFilter] = useState({
		filterValues: [],
        startDate: '2005-01-01',
        endDate: "2050-05-30"
    })

    function clickSearch() {
		if (filterValues.startDate == null && filterValues.endDate == null) {
			setFilter({
				filterValues: filterValues,
				startDate: '2005-01-01',
                endDate: "2050-01-01"
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
		}
    }

    const [batchMutateStatus, setBatchMutateStatus] = useState(batchMutateDummy)
    let batchMutateArr = []
    const [batchModifyMessages] = useMutation(gql`${batchMutateStatus}`)
    const [messageDelete] = useMutation(DELETE_MESSAGE_MUTATION)
    const [messageRead] = useMutation(READ_MESSAGE_MUTATION)

    function deleteMessage(id, name) {
        swal.fire({
            position: 'center',
            title: strings.delete,
            text: strings.doDelete + name + '?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: strings.yes,
			cancelButtonText: strings.cancel
        }).then((result) => {
            if(result.value) {
                deleteMessageFunction(id)
                swal.fire(
                    strings.delete,
					name + strings.hasBeenDeleted,
					'success'
                )
            }
        })
    }

    async function deleteMessageFunction(id) {
        const res = messageDelete({
            variables: {
                id: id,
                enabled: false
            }
        })

        if(res) {
            setRefresh(!refresh)
        }
    }

    async function modifyBatchStatus(status) {
        if(status === "delete") {
            const batchMutate = await selected.map((o, idx) => {
                let num = idx +1
                batchMutateArr.push(
                    `mutation` + num + `:privateMessage(input: {
                        id:"`+ o + `" ` +
                        `enabled:` + false  +
                        `}) {
                        id
                        enabled
                        errors
                        {
                            field
                            messages
                        }
                    }`
                )
            })
            setBatchMutateStatus(`mutation{${batchMutateArr.join()}}`)
    
            if(batchMutate.length !== 0) {
                const dataRes =  await batchModifyMessages()
                swal.fire({
                    position: 'center',
                    type: 'success',
                    title: strings.batchDeletion,
                    showConfirmButton: true
                })
                if(dataRes.data) {
                    setRefresh(!refresh)
                    setSelected([])
                    setBatchMutateStatus(batchMutateDummy)
                }
            }
        } else {
            const batchMutate = await selected.map((o, idx) => {
                let num = idx +1
                batchMutateArr.push(
                    `mutation` + num + `:privateMessage(input: {
                        id:"`+ o + `" ` +
                        `isRead:` + status  +
                        `}) {
                        id
                        isRead
                        errors
                        {
                            field
                            messages
                        }
                    }`
                )
            })
            setBatchMutateStatus(`mutation{${batchMutateArr.join()}}`)
    
            if(batchMutate.length !== 0) {
                const dataRes =  await batchModifyMessages()
                swal.fire({
                    position: 'center',
                    type: 'success',
                    title: status ? strings.batchSettingHaveBeenRead : strings.batchSettingUnread,
                    showConfirmButton: true
                })
                if(dataRes.data) {
                    setRefresh(!refresh)
                    setSelected([])
                    setBatchMutateStatus(batchMutateDummy)
                }
            }
        }
    }
    
    async function readMessage(id) {
        const res = await messageRead({
            variables: {
                id: id,
                isRead: true
            }
        })

        if(res) {
            history.push(`${MEMBER_NEWS_OUTBOX_VIEW}/${id}`)
        }
    }

    const pagination = usePagination();
    const { rowsPerPage, cursor: {before, after}, page } = pagination;
    const { data, loading } = useMessageQuery({
        refresh: refresh,
        enabled: true,
        startAt: filter.startDate, 
        endAt: filter.endDate,
        toUser_Username: filter.filterValues.recipient,
        fromUser_Username: cookies.get("Username"),
        isRead: filter.filterValues.status,
        rowsPerPage,
        before,
        after,
        page
    });

    if(loading) {
        return <Loading />
    }
        
    const privateMessages = data.privateMessages.edges;
    const pageInfo = data.privateMessages.pageInfo;
    const count = data.privateMessages.totalCount;

    function handleChangeCheckbox(event, id) {
		if(!selected.includes(id)) {
			selected.push(id)
		} else {
			let index = selected.indexOf(id)
			if (index > -1) {
				selected.splice(index, 1)
			}
		}
		setRefresh(!refresh)
	}
	
	function handleSelectAllClick(event) {
		event.persist()
		if (event.target.checked) {
			let valueArr = []
			privateMessages.map((o, idx) => {
				valueArr.push(o.node.id)
			});
			setSelected(valueArr);
			return;
		} else {
            setSelected([])
        }
		setRefresh(!refresh)
	}

    return <Paper elevation={1} className={classes.paper}>
        <Title pageTitle={strings.memberNewsOutbox} />
        <Grid container direction="row" justify="flex-start" alignItems="center" style={{ paddingBottom: '24px' }}>
            <Grid item style={{ paddingRight: '10px' }}>
                <Button disabled={ selected.length === 0 ? true : false } size="small" variant="contained" className={classes.buttonGray} onClick={() => modifyBatchStatus(false)}>{strings.batchSettingUnread}</Button>
            </Grid>
            <Grid item style={{ padding: '10px' }}>
                <Button disabled={ selected.length === 0 ? true : false } size="small" variant="contained" className={classes.buttonGray} onClick={() => modifyBatchStatus(true)}>{strings.batchSettingHaveBeenRead}</Button>
            </Grid>
            <Grid item style={{ padding: '10px' }}>
                <Button disabled={ selected.length === 0 ? true : false } size="small" variant="contained" className={classes.buttonGray} onClick={() => modifyBatchStatus("delete")}>{strings.batchDeletion}</Button>
            </Grid>
            <Grid item style={{ padding: '10px' }}>
                <Button size="small" variant="contained" color="secondary" onClick={() => history.push(MEMBER_NEWS_SEND_MESSAGE)} >{strings.sendANewMessage}</Button>
            </Grid>
        </Grid>

        <Grid className={classes.root}>
            <Grid container alignItems="center" spacing={1} style={{ paddingBottom: "20px" }} >
                <Grid item>
                    <Typography>{strings.recipient}:</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        style={{ width: 130 }}
                        className={classes.textfield}
                        variant="outlined"
                        margin="dense"
                        placeholder={strings.pleaseEnter}
                        name="recipient"
                        onChange={handleFilterChange}
                        value={filterValues.recipient}
                    />
                </Grid>
                {/* <Grid item>
                    <Typography>{strings.sender}:</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        style={{ width: 130 }}
                        className={classes.textfield}
                        variant="outlined"
                        margin="dense"
                        placeholder={strings.pleaseEnter}
                        name="sender"
                        onChange={handleFilterChange}
                        value={filterValues.sender}
                    />
                </Grid> */}
                <Grid item>
                    <Typography>{strings.status}:</Typography>
                </Grid>
                <Grid item>
                    <Select margin="dense"
                        displayEmpty
                        className={classes.textfield}
                        name="status"
                        value={filterValues.status}
                        onChange={handleFilterChange}
                        input={<OutlinedInput notched={false} name="status" />}
                    >
                        <MenuItem value={null}>{strings.all}</MenuItem>
                        <MenuItem value={true}>{strings.haveRead}</MenuItem>
                        <MenuItem value={false}>{strings.unread}</MenuItem>
                    </Select>
                </Grid>
                <Grid item>
                    <Typography>{strings.date}:</Typography>
                </Grid>
                <Grid item>
                    <AppDateRangePicker
                        focusedInput={focusedInput}
                        onFocusChange={onFocusChange}
                        onDatesChange={onDatesChange}
                        startDate={filterValues.startDate}
                        endDate={filterValues.endDate}
                        startDateId="startDate"
                        endDateId="endDate"
                        startDatePlaceholderText={strings.startDate}
                        endDatePlaceholderText={strings.endDate}
                        inputIconPosition="after"
                        showDefaultInputIcon
                        small
                        isOutsideRange={() => false}
                    />
                </Grid>
                <GrowItem />
                <Grid item>
                    <Button color="primary" variant="text" onClick={onChangeClear}>{strings.clearAll}</Button>
                </Grid>
                <Grid item>
                    <Button color="primary" variant="contained" onClick={clickSearch}>{strings.searchFor}</Button>
                </Grid>
            </Grid>
            <Grid item>
                <SimpleTable
                    tableProps={{size: "small"}}
                    hasPagination={true}
                    pagination={pagination}
                    pageInfo={pageInfo}
                    count={count}
                    columns={
                        <TableRow>
                            <TableCell style={{width: 10}} fontSize="inherit">
                                <FormControlLabel
									label={<Typography>{strings.selectAll}</Typography>}
									labelPlacement="bottom"
									name="checkbox"
									control={
										<Checkbox 
											color="primary"
                                            onChange={handleSelectAllClick}
                                            checked={selected.length ===  privateMessages.length && selected.length > 0 ? true : false}
										/>
									}
								/>
                            </TableCell>
                            <TableCell>{strings.serialNumber}</TableCell>
                            <TableCell>{strings.messageTitle}</TableCell>
                            {/* <TableCell>{strings.messageCategory}</TableCell> */}
                            <TableCell>{strings.recipient}</TableCell>
                            <TableCell>{strings.sendingTime}</TableCell>
                            <TableCell>{strings.sender}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        privateMessages.length === 0 ? 
                        <TableRow>
                            <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
                        </TableRow>
                        :
                        privateMessages.map((o, idx) => {
                            const isItemSelected = isSelected(o.node.id);
                            return (
                                <Fragment>
                                    <TableRow key={idx} className={o.node.isRead ? classes.tcellRead : classes.tcellUnread}>
                                        <TableCell style={{width: 10}} align="center">
                                            <FormControlLabel
                                                checked={isItemSelected}
                                                labelPlacement="bottom"
                                                name={`checkbox${idx}`}
                                                control={
                                                    <Checkbox 
                                                        id={o.node.id} 
                                                        color="primary"
                                                        onClick={event => handleChangeCheckbox(event, o.node.id)}
                                                    />
                                                }
                                                // onChange={handleBatchStatus}	
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={o.node.isRead ?  classes.grey : classes.bold}>{o.node.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={o.node.isRead ?  classes.grey : classes.bold}>{o.node.title}</Typography>
                                        </TableCell>
                                        {/* <TableCell>{o.messageCategory}</TableCell> */}
                                        <TableCell>
                                            <Typography className={o.node.isRead ?  classes.grey : classes.bold}>{o.node.toUser ? o.node.toUser.username : null}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={o.node.isRead ?  classes.grey : classes.bold}>{moment(o.node.createdAt).format("YYYY-MM-DD HH:MM")}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={o.node.isRead ?  classes.grey : classes.bold}>{o.node.fromUser ? o.node.fromUser.username : null}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={o.node.isRead ? classes.green : classes.red}>{o.node.isRead ? strings.haveRead : strings.unread} </Typography>
                                           
                                        </TableCell>
                                        <TableCell>
                                            <Grid container spacing={1} direction="row" >
                                                <Grid item>
                                                    <Button size="small" variant="contained" onClick={() => readMessage(o.node.id)} color="primary">{strings.view}</Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button size="small" onClick={() => deleteMessage(o.node.id, o.node.title)}>{strings.delete}</Button>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            )
                        })
                    }
                />
            </Grid>
        </Grid>
    </Paper>
}