
import React, { useState } from 'react';
import {
  Paper, TableCell, TableRow, Grid, Button, Typography,
  TextField, OutlinedInput, Select, MenuItem, Collapse
} from '@material-ui/core';
import { SimpleTable, Loading } from '../../components';
import { GrowItem } from '../../components';
import { makeStyles } from '@material-ui/styles';
import useLanguages from '../../hooks/use-languages';
import { USER_BANK_CARD_MANAGEMENT } from '../../paths';
import useUserBankCard, { UNTIED_MUTATION } from '../../queries-graphql/member-management/user-bankcard-management'
import { ContinueCancelModal, SortChangeModal, UserCard } from '../../components';
import usePagination from '../../hooks/use-pagination'
import { useMutation } from 'react-apollo'
import Title from '../../components/title';

// import Divider  from 'muicss/lib/react/divider';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2)
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

export default function UserBankCardManagement() {
  const classes = useStyles();
  const strings = useLanguages(USER_BANK_CARD_MANAGEMENT);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [initialWeight] = useState(false);
  const [mutateID, setMutateID] = useState(null);
  const [userBankName, setUserBankName] = useState(null);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState(null);
  const [title2, setTitle2] = useState(null);
  const [untied] = useMutation(UNTIED_MUTATION)
  const [mutate, setMutate] = useState(false)
  const [searchText, setSearchText] = useState([]);

  // function btnApproved() {
  //   setModalOpen(true);
  // }

  function btnUnbundling(value, enabled, title, title2) {
    setMutateID(value.id)
    console.log(title)
    setUserBankName(value.bankName)
    setStatus(enabled)
    setModalOpen1(true);
    setTitle(title)
    setMutate(!mutate)
    if(enabled==='confirmed'){
      setTitle2(title2)
    } else{
      setTitle2(null)
    }
  }

  function mutateStatusQuery(variables) {
    untied({
      variables: variables,
    })
    setMutate(!mutate)
  }

  const pagination = usePagination()
  const { rowsPerPage, cursor: { before, after }, page, setCursor, setPage } = pagination;

  const [sortOpenModal, setSortModalOpen] = useState(false);
  // function sortChange(initialWeight) {
  //   setSortModalOpen(true);
  //   setInitialWeight(initialWeight);
  // }

  const [filterValues, setFilterValues] = React.useState({
    startDate: null,
    endDate: null,
    status: '',
    cardNumber_Icontains: '',
    id: '',
    bank: '',
    orderNumber: '',
    depositor: '',
    despositAmountMin: '',
    depositAmountMax: '',
    cardHolder: '',
    user_Username_Icontains: ''
  });

  function clear() {
    setFilterValues({
      startDate: null,
      endDate: null,
      status: '',
      cardNumber_Icontains: '',
      id: '',
      bank: '',
      orderNumber: '',
      depositor: '',
      despositAmountMin: '',
      depositAmountMax: '',
      cardHolder: '',
      user_Username_Icontains: ''
    })
  }

  function handleFilterChange(event) {
    event.persist();
    setFilterValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }));

  }
  // const [focusedInput, setFocusedInput] = useState(null);
  // function onDatesChange({ startDate, endDate }) {
  //   setFilterValues(oldValues => ({
  //     ...oldValues,
  //     startDate,
  //     endDate
  //   }));
  // }
  // function onFocusChange(f) {
  //   setFocusedInput(f);
  // }

  const [open] = React.useState(true);

  // function handleClick() {
  //   setOpen(!open);
  // }
  function searchHandle() {
    setCursor({
      before: null,
      after: null
    })
    setPage(0)
    setSearchText(filterValues)
  }
 
  const { data, loading } = useUserBankCard({
    mutation: mutate, bankName_Istartswith: searchText.bank, user_Username_Icontains: searchText.user_Username_Icontains,
    nameOnCard_Icontains: searchText.cardHolder, status: searchText.status, cardNumber: searchText.cardNumber_Icontains,
    rowsPerPage,
    before,
    after,
    page,
  })
  if (loading) {
    return <Loading />
  }
  
  return <Paper elevation={1} className={classes.paper}>
    <Title pageTitle={strings.pageTitle} />
    <Grid container spacing={2} direction="column">
      {/* <Grid item><Typography variant="h6">{strings.companyDepositReview}</Typography></Grid> */}
      <Grid item style={{
        paddingTop: 0,
        paddingBottom: 0
      }}>
        {/* <Divider light={true} orientation="vertical"/> */}
      </Grid>
      <Grid item container alignItems="center" spacing={1}>
        <Grid item>
          <Typography color="textSecondary">{strings.accountNumber}:</Typography>
        </Grid>

        <Grid item style={{ width: 140 }}>
          <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="user_Username_Icontains"
            onChange={handleFilterChange} value={filterValues.user_Username_Icontains} />
        </Grid>

        <Grid item>
          <Typography color="textSecondary">{strings.cardNumber}:</Typography>
        </Grid>
        <Grid item style={{ width: 140 }}>
          <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="cardNumber_Icontains"
            onChange={handleFilterChange} value={filterValues.cardNumber_Icontains} />
        </Grid>

        {/* <Grid item>
          <Typography color="textSecondary">{strings.bank}:</Typography>
        </Grid>
        <Grid item style={{ width: 140 }}>
          <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="bank"
            onChange={handleFilterChange} value={filterValues.bank} />
        </Grid> */}

        <Grid item >
          <Typography color="textSecondary">{strings.cardHolder}:</Typography>
        </Grid>
        <Grid item style={{ width: 140 }}>
          <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="cardHolder"
            onChange={handleFilterChange} value={filterValues.cardHolder} />
        </Grid>

        <Grid item>
          <Typography color="textSecondary">{strings.status}</Typography>
        </Grid>
        <Grid item>
          <Select margin="dense"
            // style={{border: 'solid 1px #B3B8BD', borderRadius: '4px'}}
            style={{ width: 100 }}
            displayEmpty
            name="status"
            value={filterValues.status}
            onChange={handleFilterChange}
            input={<OutlinedInput notched={false} labelWidth={130} name="status" />}
          >
            <MenuItem value={''}>{strings.all}</MenuItem>
            <MenuItem value={"pending"}>{strings.pendingReview}</MenuItem>
            <MenuItem value={"confirmed"}>{strings.beUsable}</MenuItem>
            <MenuItem value={"cancelled"}>{strings.untied1}</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Button color="primary" onClick={clear} className={classes.button} >{strings.clearFilter}</Button>
        </Grid>
        {/* <Grid item>
          <Button color="primary" onClick={handleClick} className={classes.button}> 

            {open ? strings.more : strings.less}
            {open ? <ExpandMore />  : <ExpandLess />}  */}

        {/* {open ? strings.more && <ExpandMore />  :  strings.less && <ExpandLess />} */}
        {/* </Button>
        </Grid> */}
        <GrowItem />
        <Grid item>
          <Button color="primary" variant="contained" onClick={() => searchHandle()} >{strings.searchFor}</Button>
        </Grid>
      </Grid>

      {/* <Divider light={true} /> */}

      <Grid item container alignItems="center" spacing={1}>
        <Collapse in={!open} timeout="auto" unmountOnExit>

          <Grid item container alignItems="center" spacing={1}>
            <Grid item style={{ marginLeft: 5 }}>
              <Typography color="textSecondary">{strings.cardNumber}:</Typography>
            </Grid>
            <Grid item style={{ width: 140 }}>
              <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="cardNumber"
                onChange={handleFilterChange} value={filterValues.cardNumber} />
            </Grid>
            {/* <Grid item >
            <Typography color="textSecondary">{strings.cardHolder}:</Typography>
          </Grid>
          <Grid item style={{width: 140}}>
            <TextField variant="outlined" margin="dense" placeholder={strings.pleaseEnter} name="cardHolder" 
              onChange={handleFilterChange} value={filterValues.cardHolder}/>
          </Grid> */}

          </Grid>
        </Collapse>

      </Grid>

      {/* <Divider light={true} style={{marginBottom:15}}/> */}
      <Grid item style={{ paddingTop: 0 }}>
        <SimpleTable
          tableProps={{ size: "small" }}
          noBorder={true}
          hasPagination={true}
          pagination={pagination}
          pageInfo={data.userCards.pageInfo}
          count={data.userCards.totalCount}
          columns={
            <TableRow>
              <TableCell align="right" style={{ width: 3 }} >ID</TableCell>
              <TableCell>{strings.accountNumber}</TableCell>
              <TableCell>{strings.bank}</TableCell>
              <TableCell style={{ width: 12 }}>{strings.cardNumber}</TableCell>
              <TableCell>{strings.cardHolder}</TableCell>
              {/* <TableCell>{strings.province}</TableCell>
              <TableCell>{strings.city}</TableCell> */}
              <TableCell>{strings.branch}</TableCell>
              <TableCell>{strings.status}</TableCell>
              <TableCell>{strings.addTime}</TableCell>
              {/* <TableCell>{strings.addAPerson}</TableCell> */}
              <TableCell align="center">{strings.operating}</TableCell>
            </TableRow>
          }
          rows={
            data.userCards.edges.length === 0 ?
              <TableRow>
                <TableCell align="center" colSpan={9}>没有可用数据</TableCell>
              </TableRow>
              :
              data.userCards.edges.map((o, index) => <TableRow key={index}>
                <TableCell align="right">{o.node.id ? o.node.pk : null}</TableCell>
                <TableCell>{o.node.user ? o.node.user.username : null}</TableCell>
                <TableCell>{o.node.bankName ? o.node.bankName : null}</TableCell>
                <TableCell align="right">{o.node.cardNumber ? o.node.cardNumber : null}</TableCell>
                <TableCell>{o.node.nameOnCard ? o.node.nameOnCard : null}</TableCell>
                {/* <TableCell>not available</TableCell>
              <TableCell>{o.node.city ? o.node.city : null}</TableCell>   */}
                <TableCell>{o.node.branch ? o.node.branch : null}</TableCell>
                {/* <TableCell style={{ width: 150 }}><StatusIcon status={o.node.status} />&nbsp;&nbsp;{o.node.status === "confirmed" ? strings.confirmed : o.node.status === "pending" ? strings.pending : strings.cancelled}</TableCell> */}
                {/* <TableCell style={{width:150}}><StatusIcon status={o.node.enabled}/>&nbsp;&nbsp;{o.node.enabled}</TableCell>  */}

                {/* <TableCell>
                  {
                    o.node.enabled ? <Typography color="primary"  >{strings.bind}</Typography> :
                      <Typography color="error">{strings.untied1}</Typography>
                  }
                </TableCell> */}
                <TableCell>
                  {
                    o.node.status === "confirmed" ? 
                    <Typography color="primary">{strings.beUsable}</Typography> 
                    :
                    o.node.status === "pending" ?
                    <Typography color="secondary">{strings.pendingReview}</Typography>
                    :
                    <Typography color="error">{strings.untied1}</Typography>
                  }
                </TableCell>
                <TableCell>{o.node.createdAt ? o.node.createdAt.split("T", 2)[0] : null}</TableCell>
                {/* <TableCell>not available</TableCell>  */}
                <TableCell>
                  <Grid container justify="center" spacing={1} direction="row">
                    { /* <Grid item><Button color="secondary" variant="outlined"  className={classes.button} onClick={btnApproved} >{strings.approved}</Button></Grid> */}{
                      // o.node.enabled ? 
                      // <Grid item><Button disabled={o.node.enabled ? false : true} color="default" style={{ width: 100 }} variant="outlined" className={classes.button} onClick={() => btnUnbundling(o.node, "confirmed", strings.warning3)}>{o.node.enabled ? strings.untied1 : strings.untied2}</Button></Grid>
                      // :
                      // <Grid item><Button color="default" style={{width: 100}} variant="outlined" className={classes.button} onClick={() => btnUnbundling(o.node, true, strings.warning4)}>{strings.untied2}</Button></Grid>
                    }
                    <Grid item><Button color="secondary" variant="contained"  className={classes.button} onClick={() => btnUnbundling(o.node, "confirmed", strings.warning4, strings.warning45)} >{strings.approved}</Button></Grid>
                    <Grid item><Button color="default" style={{width: 100}} variant="outlined" className={classes.button} onClick={() => btnUnbundling(o.node, "cancelled", strings.warning5)}>{strings.untied1}</Button></Grid>
                  </Grid>
                </TableCell>
              </TableRow>)
          }
        />
      </Grid>
    </Grid>
    <ContinueCancelModal open={modalOpen} setOpen={setModalOpen} title={strings.warning1} description={strings.warning2} />

    <UserCard x={title2}  open={modalOpen1} mutate={mutate} setMutate={setMutate} setOpen={setModalOpen1} id={mutateID} setId={setMutateID} name={userBankName} setName={setUserBankName} status={status} setStatus={setStatus} title={title} mutateQuery={mutateStatusQuery} />
    <SortChangeModal open={sortOpenModal} setOpen={setSortModalOpen} title={strings.currentManufacturer} weight={initialWeight} title2={strings.pleaseEnterTheSortWeight} description={strings.warning3} />
  </Paper>
}