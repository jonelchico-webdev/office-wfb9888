import React, { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/styles';
import { SimpleTable, Loading, GrowItem, RiskStatusChangeModal, BatchMutateModal, PaymentReviewModal} from '../../components';
import Title from '../../components/title';
import useLanguages from '../../hooks/use-languages';
import { EVENTS_LIST } from '../../paths';
import { AppDateRangePicker } from '../../components/date-picker';
import { Paper, TableCell, TableRow, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import usePagination from '../../hooks/use-pagination'
import useDeposities, {APPROVE_ONE, COMPANY_DEPOSIT_REVIEW_MUTATE} from '../../queries-graphql/activity-management/activity-review'
import { green, red, blue } from '@material-ui/core/colors';
import { useMutation } from '@apollo/react-hooks'
import swal from 'sweetalert2';
import gql from 'graphql-tag'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
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
	red: {
		color: "#f44336"
	},
	green: {
		color: "#4caf50"
	},
	yellow: {
		color: "#ffeb3b"
	},
	blue: {
		color: "#508FF4"
	}
}));

const ColorButtonRed = withStyles(theme => ({
	root: {
		color: red[500],
		backgroundColor: red[50],
		border: "1px #f44336 solid",
		'&:hover': {
			backgroundColor: red[100],
		},
	},
}))(Button);

const ColorButtonGreen = withStyles(theme => ({
	root: {
		color: green[500],
		backgroundColor: green[50],
		border: "1px #4caf50 solid",
		'&:hover': {
			backgroundColor: green[100],
		},
	},
}))(Button);


const ColorButtonBlue = withStyles(theme => ({
	root: {
		color: blue[500],
		backgroundColor: blue[50],
		border: "1px #508FF4 solid",
		'&:hover': {
			backgroundColor: blue[100],
		},
	},
}))(Button);

let batchMutateDummy = `mutation{
    GetCaptcha {
        success
        imagePath
        requestIp
        captchaKey
    }
}` 

export default function ActivityReview(props) {

    const pagination = usePagination()

    const classes = useStyles();
    const strings = useLanguages(EVENTS_LIST);
    const [mutate, setMutate] = React.useState(false)
    const [passAmount, setPassAmount] = useState(null);

    /* App Calendar */
	const [batchMutateStatus, setBatchMutateStatus] = useState(batchMutateDummy)
	let batchMutateArr = []
	const [batchModifyCommissionPayment] = useMutation(gql`${batchMutateStatus}`)

    const [filterValues, setFilterValues] = React.useState({
        startDate: null,
        endDate: null,
        account: '',
        commissionType: '',
        status: '',
        mainCheckBox: false,
        user: '', 
        gameEvent: '',
        id: '',
        amountMin: null,
        amountMax: null,
        gameEvent_Title_Icontains: '', 
        user_AffiliateUsername_Icontains: '',
        user_Username_Icontains: ''
    });

    const [focusedInput, setFocusedInput] = useState(null);
    function onDatesChange({ startDate, endDate }) {
        setFilterValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }

    function handleFilterChange(event) {
		event.persist();
        setFilterValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
	}

    function onFocusChange(f) {
        setFocusedInput(f);
    }

    // function handleClickOpen() {
    //     setOpenNewUserDialog(true);
    // }
    /* END */

    /* CHECKBOX TABLE */
    // const createSortHandler = property => event => {
    //     onRequestSort(event, property);
    // };

    const [selected, setSelected] = React.useState([]);
    const isSelected = id => selected.indexOf(id) !== -1;
    /* END */

    const [filter, setFilter] = React.useState({
		filterValues: [],
		startDate: "",
		endDate: ""
    })
    
    const [modalOpen, setModalOpen] = useState(false);
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [id, setID] = useState(null);
    const [passStatus, setPassStatus] = useState(null);
	const [passWarning, setPassWarning] = useState(null);
    
    function searchFor() {
		setFilter(filterValues)
		if (filterValues.startDate === null && filterValues.endDate === null) {
			setFilter({
				filterValues: filterValues,
				startDate: "",
				endDate: ""
			})
		} else {
			setFilter({
				filterValues: filterValues,
				startDate: filterValues.startDate.format("YYYY-MM-DD").toString(),
				endDate: filterValues.endDate.format("YYYY-MM-DD").toString()
			})
        }
	}

    const { rowsPerPage, cursor: {before, after} } = pagination;

    const myPageInfo = ({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        __typename: "PageInfo"
    })

    const {data, loading} = useDeposities({mutation: mutate, rowsPerPage, before, after,
        status: filter.filterValues.status,
        startAt: filter.startDate, endAt: filter.endDate,
        amountMin: filter.filterValues.amountMin, amountMax: filter.filterValues.amountMax,
        user_Username_Icontains: filter.filterValues.user_Username_Icontains});
    if(loading) { 
        return <Loading />
    } 
    
    const count = data.deposities === null || data.deposities.totalCount === 0 ? 0 : data.deposities.totalCount

    function handleChangeCheckbox(id) {
		if(!selected.includes(id)) {
			selected.push(id)
		} else {
			let index = selected.indexOf(id)
			if (index > -1) {
				selected.splice(index, 1)
			}
		}
		setMutate(!mutate)
	}

    function handleSelectAllClick(event) {

		if (event.target.checked) {
			let valueArr = []
			data.deposities.edges.map((o) => {
				if(o.node.status === "pending") {
					valueArr.push(o.node.id)
				}
			});
			setSelected(valueArr);
		}
		setSelected([]);
    }
    
    function btnStatusChange(data, stat, warn) {
		setID(data.orderId)
        setModalOpen(!modalOpen);
		setPassStatus(stat);
        setPassWarning(warn);
        setPassAmount(data.amount);
    }
    
    function btnBatchOpenModal(stat, warn) {
        setBatchModalOpen(!batchModalOpen);
		setPassStatus(stat);
        setPassWarning(warn);
    }

    async function modifyBatchStatus(status) {
		const batchMutate = await selected.map((o, idx) => {
			let num = idx +1
			batchMutateArr.push(
				`mutation` + num + `:gameEventParticipateApproval(input: {
                    id:"`+ o + `" ` +
                    `status:"` + status + `" ` +
                    `}) {
                    errors
                    {
                        messages
                    }
                }`
			)
		})
		setBatchMutateStatus(`mutation{${batchMutateArr.join()}}`)

		if(batchMutate.length !== 0) {
			batchModifyCommissionPayment()
			swal.fire({
				position: 'center',
				type: 'success',
				title: status === "confirmed" ? 'Success' : 'Cancelled',
				text: "操作成功",
				showConfirmButton: true
			})
			setMutate(!mutate)
		}
    }

    return <Grid>
        <Title pageTitle={strings.activityReview} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Grid container>
                <Typography variant='h6'>{strings.activityReview}</Typography>

                <GrowItem />

                {/* <Grid item>
                    <Button disabled={selected.length === 0 ? true : false} style={{ width: 120 }} onClick={() => btnBatchOpenModal("confirmed", strings.warning1)} color="secondary" variant="contained">{strings.batchPass}</Button>
                </Grid>

                <Grid item style={{ marginLeft: 10 }}>
                    <Button disabled={selected.length === 0 ? true : false} onClick={() => btnBatchOpenModal("cancelled", strings.warning4)} style={{ width: 120, backgroundColor: "#ff0000", color: "white" }} variant="contained">{strings.batchCancellation}</Button>
                </Grid> */}
            </Grid>

            <Divider light={true} style={{ marginTop: "2em", marginBottom: "1em" }} />
            <Grid container alignItems="center" spacing={1}>
                <Grid item container alignItems="center" style={{ marginBottom: "10px" }}>

                    <Grid item >
                        <Typography color="textSecondary">{strings.accountNumber}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField onChange={handleFilterChange} name="user_Username_Icontains" value={filterValues.user_Username_Icontains} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                    </Grid>

                    <Grid item >
                        <Typography color="textSecondary">{strings.date}:</Typography>
                    </Grid>
                    <Grid item style={{ marginLeft: 10 }}>
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

                    {/* <Grid item style={{ marginLeft: 10 }}>
                        <Typography color="textSecondary">{strings.affiliatedAgent}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField onChange={handleFilterChange} type="text" name="user_AffiliateUsername_Icontains" value={filterValues.user_AffiliateUsername_Icontains} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10 }} />
                    </Grid> */}

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.status}:</Typography>
                    </Grid>
                    <Grid item>
                        <Select
                            displayEmpty
                            onChange={handleFilterChange}
                            margin="dense"
                            className={classes.textfield}
                            name="status"
                            value={filterValues.status}
                            input={<OutlinedInput notched={false} name="selectStatus" />}
                            style={{width: 100}}
                        >
                            <MenuItem value="">{strings.all}</MenuItem>
                            <MenuItem value="pending">{strings.pendingReview}</MenuItem>
                            <MenuItem value="confirmed">{strings.pass}</MenuItem>
                            <MenuItem value="cancelled">{strings.rejected}</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.discountedPrice}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField onChange={handleFilterChange} type="number" name="amountMin" value={filterValues.amountMin} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                    </Grid>

                    <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.to}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField onChange={handleFilterChange} type="number" name="amountMax" value={filterValues.amountMax} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                    </Grid>

                    {/* <Grid item style={{ marginLeft: 10, marginRight: 10 }}>
                        <Typography color="textSecondary">{strings.eventName}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField onChange={handleFilterChange} name="gameEvent_Title_Icontains" value={filterValues.gameEvent_Title_Icontains} variant="outlined" margin="dense" style={{ width: 100, marginLeft: 10, marginRight: 10 }} />
                    </Grid> */}

                    <GrowItem />

                    <Grid item>
                        <Button onClick={() => searchFor()} style={{ width: 100 }} color="primary" variant="contained">{strings.searchFor}</Button>
                    </Grid>

                </Grid>
            </Grid>{console.log(data, 'asd')}
            <Grid item>
                <SimpleTable
                    tableProps={{ size: "small" }}
                    hasPagination={true}
                    pagination={pagination}
                    pageInfo={data.deposities === null || data.deposities.totalCount === 0 ? myPageInfo : data.deposities.pageInfo}
                    count={count}
                    noBorder={true}
                    columns={
                        <TableRow>
                            {/* <TableCell padding="checkbox">
                                <FormControlLabel
                                    // value={filterValues.mainCheckBox}
                                    label={strings.fuzzySearch}
                                    labelPlacement="end"
                                    name="mainCheckBox"
                                    control={<Checkbox color="primary" 
                                    onChange={handleSelectAllClick} 
                                    />}
                                />
                                {strings.selectAll}
                            </TableCell> */}
                            <TableCell align="right">{strings.serialNumber}</TableCell>
                            <TableCell>{strings.eventName}</TableCell>
                            {/* <TableCell>{strings.company}</TableCell> */}
                            <TableCell>{strings.accountNumber}</TableCell>
                            {/* <TableCell>{strings.affiliatedAgent}</TableCell>
                            <TableCell align="right">{strings.rechargeToday}</TableCell> */}
                            <TableCell align="right">{strings.amountToday}</TableCell>
                            <TableCell>{strings.applicationTime}</TableCell>
                            <TableCell align="right">{strings.discountedPrice}</TableCell>
                            <TableCell>{strings.status}</TableCell>
                            <TableCell>{strings.reviewer}</TableCell>
                            <TableCell>{strings.reviewTime}</TableCell>
                            <TableCell colSpan={2}>{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        data.deposities === null || data.deposities.totalCount === 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={14}>没有可用数据</TableCell>
						</TableRow>
                        :
                        data.deposities.edges.map((o, index) => {
                            const isItemSelected = isSelected(o.node.id);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            
                            return <TableRow>
                                {/* <TableCell padding="checkbox">
                                    <FormControlLabel
                                        checked={isItemSelected}
                                        disabled={o.node.status.toLowerCase() === "pending" ? false : true}
                                        labelPlacement="bottom"
                                        name={`checkbox${index}`}
                                        control={
                                            <Checkbox 
                                                disabled={o.node.status.toLowerCase() === "pending" ? false : true}
                                                id={o.node.id} 
                                                color="primary"
                                                onClick={event => handleChangeCheckbox(o.node.id)}
                                            />
                                        }
                                    />
                                </TableCell> */}
                                <TableCell align="right">{o.node.pk ? o.node.pk : '-'}</TableCell>
                                <TableCell>{o.node.internalNote ? o.node.internalNote.split('__')[1] : '-'}</TableCell>
                                {/* <TableCell>{o.node.user.userCompany.edges.length >= 1 ? o.node.user.userCompany.edges[0].node.name : '-'}</TableCell> */}
                                <TableCell>
                                    <Typography color="primary">
                                        {o.node.user ? o.node.user.username : '-'}
                                    </Typography>
                                </TableCell>
                                {/* <TableCell>{o.node.user ? o.node.user.affiliateUsername : '-'}</TableCell>
                                <TableCell align="right">&yen;{o.node.gameEvent ? o.node.gameEvent.rewardAmount : 0}.00</TableCell> */}
                                <TableCell align="right">&yen;{o.node.internalNote ? o.node.internalNote.split('__')[3] : 0}</TableCell>
                                {/* <TableCell>{o.node.gameEvent ? o.node.gameEvent.createdAt : ''}</TableCell> */}
                                <TableCell>{o.node.createdAt ? moment(o.node.createdAt).format("YYYY-MM-DD HH:mm:ss") : '-'}</TableCell>
                                <TableCell align="right">&yen;{o.node.internalNote ? o.node.internalNote.split('__')[4] : 0}</TableCell>
                                <TableCell>
                                    {
                                        o.node.status.toLowerCase() === "confirmed" ? <ColorButtonGreen size="small">{strings.pass}</ColorButtonGreen> :
                                        o.node.status.toLowerCase() === "cancelled" ? <ColorButtonRed size="small">{strings.rejected}</ColorButtonRed> :
                                        <ColorButtonBlue size="small">{strings.pendingReview}</ColorButtonBlue>
                                    }
                                </TableCell>
                                <TableCell>{o.node.statusChangedBy ? o.node.statusChangedBy.username : '-'}</TableCell>
                                <TableCell>{o.node.updatedAt ? moment(o.node.updatedAt).format("YYYY-MM-DD HH:mm:ss") : '-'}</TableCell>
                                <TableCell style={{ paddingLeft: 0, paddingRight: 0, }}> <Button color="primary" disabled={o.node.status.toLowerCase() === "pending" && o.node.amount >= 1 ? false : true} onClick={() => btnStatusChange(o.node, "confirmed", strings.warning3)} className={classes.button}>{strings.by}</Button>   </TableCell>
                                <TableCell style={{ paddingLeft: 0, paddingRight: 0, }}> <Button color="primary" disabled={o.node.status.toLowerCase() === "pending" && o.node.amount >= 1 ? false : true} onClick={() => btnStatusChange(o.node, "cancelled", strings.warning2)} className={classes.button}>{strings.refuse}</Button>  </TableCell>
                            </TableRow>
                        })
                    }
                />
            </Grid>
		{/* <BatchMutateModal batchMutate={modifyBatchStatus} open={batchModalOpen} setSelected={setSelected} selected={selected} setOpen={setBatchModalOpen} passWarning={passWarning} passStatus={passStatus} />	
		<RiskStatusChangeModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={APPROVE_ONE} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passStatus={passStatus} />	 */}
		<PaymentReviewModal mutate={mutate} setMutate={setMutate} idMutate={id} mutateQuery={COMPANY_DEPOSIT_REVIEW_MUTATE} open={modalOpen} setOpen={setModalOpen} passWarning={passWarning} passAmount={passAmount} passStatus={passStatus} />   
    </Paper>
    </Grid>
}