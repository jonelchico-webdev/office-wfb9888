import React, { useState } from 'react';
import { Paper, TextField, TableCell, TableRow, Grid, Button, Typography, Divider} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { NewLevelModal, SimpleTable, Title, Loading, DeleteWithName, GrowItem } from '../../components';
import useLanguages from '../../hooks/use-languages';
import { MEMBER_VIP_SYSTEM } from '../../paths';
import 'react-dates/lib/css/_datepicker.css';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Signal from '@material-ui/icons/SignalCellularAlt';
import CreateOutlined from '@material-ui/icons/CreateOutlined';
// import Switch from '@material-ui/core/Switch';
import usePagination from '../../hooks/use-pagination'
import useMemberVIPSystem, { ADD_LEVEL, UPDATE_LEVEL, DELETE_LEVEL } from '../../queries-graphql/member-management/member-vip-sytem'

const useStyles = makeStyles(theme => ({
    padding: {
        padding: theme.spacing(2)
    },
    container: {
        flexWrap: "nowrap"
    },
    chip: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    rule: {
        padding: theme.spacing(1),
    },
    radioGroup: {
        maxHeight: 155
    },
    Card: {
        width: 300,
        margin: 'auto'
    },
    Media: {
        height: '100%',
        width: '100%'
    },

    blueHover: {
        '&:hover': {
            color: '#508FF4'
        }
    },
    typography: {
        fontSize: 23,
        marginTop: 3,
        marginRight: 8
    }

}));

// const IOSSwitch = withStyles(theme => ({
//     root: {
//         width: 46,
//         height: 23,
//         padding: 0,
//         margin: theme.spacing(1)
//     },
//     switchBase: {
//         padding: 1,
//         "&$checked": {
//             color: theme.palette.common.white,
//             "& + $track": {
//                 backgroundColor: "#52d869",
//                 opacity: 1,
//                 border: "none",
//             }
//         },
//         "&$focusVisible $thumb": {
//             color: "#52d869",
//             border: "6px solid #fff"
//         }
//     },
//     thumb: {
//         width: 15,
//         height: 16,
//         marginTop: 2,
//         marginLeft: 9
//     },
//     track: {
//         borderRadius: 26 / 2,
//         border: `1px solid ${theme.palette.grey[400]}`,
//         backgroundColor: theme.palette.grey[400],
//         marginLeft: 1,
//         opacity: 1,
//         transition: theme.transitions.create(["background-color", "border"])
//     },
//     checked: {},
//     focusVisible: {}
// }))(({ classes, ...props }) => {
//     return (
//         <Switch
//             focusVisibleClassName={classes.focusVisible}
//             disableRipple
//             classes={{
//                 root: classes.root,
//                 switchBase: classes.switchBase,
//                 thumb: classes.thumb,
//                 track: classes.track,
//                 checked: classes.checked
//             }}
//             {...props}
//         />
//     );
// });

export default function MemberVIPSystem() {
    const classes = useStyles();
    const strings = useLanguages(MEMBER_VIP_SYSTEM);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [mutate, setMutate] = React.useState(false)
    const [isEdit, setIsEdit] = React.useState(false)
    const [levelData, setLevelData] = React.useState([])
    const [mutateID, setMutateID] = useState(null);
    const [mutateName, setMutateName] = useState(null);

    const [value, setValue] = useState("")
    const [filterName, setFilterName] = useState("")

    function changeHandler(event) {
        event.persist()
        setValue(event.target.value)
    } 

    function search() {
        setCursor({
            before: null,
            after: null
        })
        setPage(0)
        setFilterName(value)
    }

    // const [state, setState] = React.useState({
    //     VIPswitch: true
    // });

    // const setValues = useState({
    //     rechargePoints: [],
    //     yuan: '',
    //     integral: '',
    //     effectiveBetPoints: [],
    //     each: '',
    //     day: '',
    //     week: '',
    //     month: ''
    // });

    function newLevelOpen() {
        setModalOpen(true);
    }

    function editHandle(data) {
        setModalOpen(true);
        setIsEdit(true)
        setLevelData(data)
    }

    // const VIPswitchHandle = name => event => {
    //     setState({ ...state, [name]: event.target.checked });
    // };

    // const [chosenDate, setChosenDate] = useState(null);
    // const [focusedInput, setFocusedInput] = useState(null);
    // function onDatesChange(chosenDate) {
    //     setChosenDate(chosenDate);
    // }

    // function onFocusChange(sortOpenCal) {
    //     setFocusedInput(sortOpenCal);
    // }

    function openDelete(value) {
        setMutateID(value.id)
        setMutateName(value.name)
        setModalOpen2(true);
        setMutate(!mutate)
    }

    // function reChargePointsHandle(event) {
    //     event.persist();
    //     setValues(oldValues => {
    //         let rechargePoints = oldValues.rechargePoints;
    //         if (event.target.checked) {
    //             rechargePoints.push(event.target.value);
    //         }
    //         else {
    //             rechargePoints = rechargePoints.filter((o) => o !== event.target.value)
    //         }
    //         return {
    //             ...oldValues,
    //             'rechargePoints': rechargePoints
    //         }
    //     });
    // }

    // function effectiveBetPointsHandle(event) {
    //     event.persist();
    //     setValues(oldValues => {
    //         let effectiveBetPoints = oldValues.effectiveBetPoints;
    //         if (event.target.checked) {
    //             effectiveBetPoints.push(event.target.value);
    //         }
    //         else {
    //             effectiveBetPoints = effectiveBetPoints.filter((o) => o !== event.target.value)
    //         }
    //         return {
    //             ...oldValues,
    //             'effectiveBetPoints': effectiveBetPoints
    //         }
    //     });
    // }

    const pagination = usePagination();
    const { rowsPerPage, cursor: { before, after }, setCursor, setPage } = pagination;
    const { data, loading } = useMemberVIPSystem({
        mutation: mutate,
        name: filterName,
        rowsPerPage, before, after
    });
    if (loading) {
        return <Loading />;
    }
    
    return <Paper elevation={1} className={classes.padding}>
        <Title pageTitle={strings.companyDepositAccountManagement} />
        <Grid container spacing={2} direction="column">
            <Grid container justify="space-between">
                <Typography className={classes.padding} variant="h6">
                    <Grid container>
                        <Grid item>
                            <ErrorOutline className={classes.typography} color="primary" />
                        </Grid>
                        <Grid item>
                            {strings.basicInformation}
                        </Grid>
                    </Grid>
                </Typography>
                <Grid className={classes.padding}>
                    <Button color="primary" style={{ height: 30 }} variant="contained" onClick={newLevelOpen} ><Signal />{strings.newLevel}</Button>
                </Grid>
            </Grid>
            <Divider component='hr' orientation='horizontal' light={true} />
            <Grid item container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                    <Typography>{strings.rankName}:</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        type="text"
                        name="levelName" 
                        variant="outlined"
                        margin="dense"
                        onChange={changeHandler}
                    />
                </Grid>
                <GrowItem/>
                <Grid item>
                    <Button 
                        onClick={search}
                        style={{ width: 100 }} 
                        color="primary" 
                        variant="contained"
                    >
                        {strings.searchFor}
                    </Button>
                </Grid>
            </Grid>
            <Grid item style={{paddingTop: 0}}>
                <SimpleTable
                    noBorder={true}
                    tableProps={{ size: "small" }}
                    hasPagination={true}
                    pagination={pagination}
                    pageInfo={data.vipLevels.pageInfo}
                    count={data.vipLevels.totalCount}
                    columns={
                        <TableRow>
                            <TableCell>{strings.grade}</TableCell>
                            <TableCell>{strings.rankName}</TableCell>
                            {/* <TableCell>{strings.levelIcons}</TableCell> */}
                            <TableCell align="right">{strings.depositAmount}</TableCell>
                            <TableCell align="right">{strings.effectiveAmount}</TableCell>
                            <TableCell align="center">{strings.operating}</TableCell>
                        </TableRow>
                    }
                    rows={
                        // memberVIPSystem
                        //     .sort((a, b) => b.levelIcons - a.levelIcons)
                        //     .map((o, index) => {
                        //         let stat = null;
                        //         if (o.levelIcons == 4) {
                        //             stat = <LEVEL4 width="35px" height="35px" />
                        //         } else if (o.levelIcons == 3) {
                        //             stat = <LEVEL3 width="35px" height="35px" />
                        //         } else if (o.levelIcons == 2) {
                        //             stat = <LEVEL2 width="35px" height="35px" />
                        //         } else {
                        //             stat = <LEVEL1 width="35px" height="35px" />
                        //         }


                        // return (
                        data.vipLevels.edges.length == 0 ? 
						<TableRow>
							<TableCell align="center" colSpan={6}>没有可用数据</TableCell>
						</TableRow>
						:
                        data.vipLevels.edges.map((o, idx) => <TableRow key={idx}>
                            <TableCell>{o.node.pk}</TableCell>
                            <TableCell>{o.node.name}</TableCell>
                            {/* {o.levelIcons == 1 ? <TableCell><LEVEL1 width="30" height="30" /></TableCell>
                                    : o.levelIcons == 2 ? <TableCell><LEVEL2 width="30" height="30" /></TableCell>
                                        : o.levelIcons == 3 ? <TableCell><LEVEL3 width="30" height="30" /></TableCell>
                                            : <TableCell><LEVEL4 width="30" height="30" /></TableCell>} */}
                            {/* <TableCell></TableCell> */}
                            <TableCell align="right">{o.node.upgradeAmount ? o.node.upgradeAmount.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="right">{o.node.requiredPoints ? o.node.requiredPoints.toLocaleString('en', {maximumFractionDigits:2}) : "-"}</TableCell>
                            <TableCell align="center">
                                <Grid container spacing={1} direction="row" justify="center">
                                    <Grid item><Button className={classes.blueHover} onClick={() => editHandle(o.node)} size="small"><CreateOutlined /></Button></Grid>
                                    <Grid item><Button className={classes.blueHover} size="small" onClick={() => openDelete(o.node)}><DeleteOutlinedIcon /></Button></Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                        )
                        // )

                        // })
                    }
                />
            </Grid>
        </Grid>
        <DeleteWithName open={modalOpen2} mutateID={mutateID} mutate={mutate} setMutate={setMutate} setOpen={setModalOpen2} title={strings.warning3} description="" name={mutateName} mutateQuery={DELETE_LEVEL}/>

        <NewLevelModal levelData={levelData} isEdit={isEdit} setIsEdit={setIsEdit} mutate={mutate} setMutate={setMutate} open={modalOpen} setOpen={setModalOpen} query={isEdit ? UPDATE_LEVEL : ADD_LEVEL} dropAndDropFile={strings.dropAndDropFile} levelName={strings.levelName} levelIcons={strings.levelIcons} upload={strings.upload} effectiveAmount={strings.effectiveAmount} depositAmount={strings.depositAmount} />
    </Paper>

    // return <Grid container spacing={4}>
    //     <Title pageTitle={strings.pageTitle} />

    //     <Grid container alignItems="center" justify="flex-end" style={{ paddingLeft: 100 }}>
    //         <Grid item>
    //             <Typography variant="h6">{strings.openCloseVIPSystem}</Typography>
    //         </Grid>
    //         <Grid item>
    //             <FormControlLabel
    //                 control={
    //                     <IOSSwitch
    //                         checked={state.VIPswitch}
    //                         onChange={VIPswitchHandle("VIPswitch")}
    //                         value="VIPswitch"
    //                     />
    //                 }
    //             />
    //         </Grid>
    //     </Grid>
    //     <Grid container xs={12} md={12} justify="space-evenly" spacing={1} style={{ paddingLeft: 15 }}>
    //         <Grid item xs={12} md={4} height="100%" container direction="column" direction="row-reverse">
    //             <Paper elevation={1} >
    //                 <Grid container >
    //                     <Typography className={classes.padding} variant="h6">
    //                         <Grid container>
    //                             <Grid item>
    //                                 <SettingsIcon className={classes.typography} color="primary" />
    //                             </Grid>
    //                             <Grid item>
    //                                 {strings.integralRuleSetting}
    //                             </Grid>
    //                         </Grid>
    //                     </Typography>
    //                 </Grid>
    //                 <Divider light={true} />
    //                 <Grid container spacing={1} direction="column" className={classes.padding} alignItems="center">
    //                     <FormRowCenterItems
    //                         leftComponent={
    //                             <Typography>{strings.integrationStatisticsStartDate}:</Typography>
    //                         }
    //                         rightComponent={
    //                             <SingleDatePicker
    //                                 date={chosenDate}
    //                                 onDateChange={onDatesChange}
    //                                 focused={focusedInput}
    //                                 onFocusChange={onFocusChange}
    //                                 focusedInput={focusedInput}
    //                                 numberOfMonths={1}
    //                                 inputIconPosition="after"
    //                                 placeholderText={strings.startDate}
    //                                 showDefaultInputIcon
    //                                 style={{ borderRadius: 5 }}
    //                                 small
    //                                 isOutsideRange={() => false}
    //                                 showClearDate={true}
    //                             />
    //                         }
    //                     />
    //                     <FormRowCenterItems
    //                         leftComponent={
    //                             <Grid></Grid>
    //                         }
    //                         rightComponent={
    //                             <Grid container>
    //                                 <Grid item container direction="row">
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel value="bankCard" control={<Radio color="primary" />} label={strings.each} />
    //                                     </Grid>
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel control={<TextField variant="outlined" margin="dense" name="day"
    //                                             onChange={handleChange} />} label={strings.day} />
    //                                     </Grid>

    //                                 </Grid>
    //                                 <Grid item container direction="row">
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel value="bankCard" control={<Radio color="primary" />} label={strings.each} />
    //                                     </Grid>
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel control={<TextField variant="outlined" margin="dense" name="week"
    //                                             onChange={handleChange} />} label={strings.week} />
    //                                     </Grid>
    //                                 </Grid>
    //                                 <Grid item container direction="row">
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel value="bankCard" control={<Radio color="primary" />} label={strings.each} />
    //                                     </Grid>
    //                                     <Grid item md={3}>
    //                                         <FormControlLabel control={<TextField variant="outlined" margin="dense" name="month"
    //                                             onChange={handleChange} />} label={strings.month} />
    //                                     </Grid>
    //                                 </Grid>
    //                             </Grid>
    //                         }
    //                     />

    //                     <FormRowCenterItems
    //                         leftComponent={
    //                             <Typography></Typography>
    //                         }
    //                         rightComponent={
    //                             ["充值积分", "元获得", "积分"].map((o, index) =>
    //                                 <Grid key={index} item elevation={1}>
    //                                     {index == 0 ?
    //                                         <Grid item style={{ marginRight: 25 }}>
    //                                             <FormControlLabel
    //                                                 checked={Boolean(values.rechargePoints.find(item => o === item))}
    //                                                 value={o}
    //                                                 label={o}
    //                                                 labelPlacement="end"
    //                                                 control={<Checkbox color="primary" />}
    //                                                 onChange={reChargePointsHandle}
    //                                             />
    //                                         </Grid>
    //                                         :
    //                                         <Grid container>
    //                                             <FormControlLabel control={
    //                                                 <TextField minWidth variant="outlined" style={{ width: 45 }} margin="dense" name={o}
    //                                                     onChange={handleChange} value={values.o} />
    //                                             } label={o} />
    //                                         </Grid>
    //                                     }
    //                                 </Grid>
    //                             )
    //                         }
    //                     />

    //                     <FormRowCenterItems
    //                         leftComponent={
    //                             <Typography></Typography>
    //                         }
    //                         rightComponent={
    //                             ["有效投注积分", "元获得", "积分"].map((o, index) =>
    //                                 <Grid key={index} item elevation={1}>
    //                                     {index == 0 ?
    //                                         <Grid item>
    //                                             <FormControlLabel
    //                                                 checked={Boolean(values.effectiveBetPoints.find(item => o === item))}
    //                                                 value={o}
    //                                                 label={o}
    //                                                 labelPlacement="end"
    //                                                 control={<Checkbox color="primary" />}
    //                                                 onChange={effectiveBetPointsHandle}
    //                                             />
    //                                         </Grid>
    //                                         :
    //                                         <Grid container>
    //                                             <FormControlLabel control={
    //                                                 <TextField minWidth variant="outlined" style={{ width: 43 }} margin="dense" name={o}
    //                                                     onChange={handleChange} value={values.o} />
    //                                             } label={o} />
    //                                         </Grid>
    //                                     }
    //                                 </Grid>
    //                             )
    //                         }
    //                     />
    //                 </Grid>
    //             </Paper>
    //         </Grid>

    //         <Grid item xs={12} md={8} container direction="column" >
    //             <Paper elevation={1}>
    //                 <Grid container justify="space-between">
    //                     <Typography className={classes.padding} variant="h6">
    //                         <Grid container>
    //                             <Grid item>
    //                                 <ErrorOutline className={classes.typography} color="primary" />
    //                             </Grid>
    //                             <Grid item>
    //                                 {strings.basicInformation}
    //                             </Grid>
    //                         </Grid>
    //                     </Typography>
    //                     <Grid className={classes.padding}>
    //                         <Button color="primary" style={{ width: 110, height: 30 }} variant="contained" onClick={newLevelOpen} ><Signal />{strings.newLevel}</Button>
    //                     </Grid>
    //                 </Grid>
    //                 <Divider component='hr' orientation='horizontal' light={true} />
    //                 <Grid container spacing={1} direction="column" className={classes.padding}>
    //                     <SimpleTable
    //                         noBorder={true}
    //                         tableProps={{ size: "small" }}
    //                         hasPagination={true}
    //                         pagination={pagination}
    //                         pageInfo={data.vipLevels.pageInfo}
    //                         count={data.vipLevels.totalCount}
    //                         columns={
    //                             <TableRow>
    //                                 <TableCell width="160px">{strings.grade}</TableCell>
    //                                 <TableCell width="160px">{strings.rankName}</TableCell>
    //                                 <TableCell width="160px">{strings.levelIcons}</TableCell>
    //                                 <TableCell width="160px">{strings.requiredPoints}</TableCell>
    //                                 <TableCell width="160px">{strings.attenuationIntegral}</TableCell>
    //                                 <TableCell style={{ paddingLeft: 70 }}>{strings.operating}</TableCell>
    //                             </TableRow>
    //                         }
    //                         rows={
    //                             // memberVIPSystem
    //                             //     .sort((a, b) => b.levelIcons - a.levelIcons)
    //                             //     .map((o, index) => {
    //                             //         let stat = null;
    //                             //         if (o.levelIcons == 4) {
    //                             //             stat = <LEVEL4 width="35px" height="35px" />
    //                             //         } else if (o.levelIcons == 3) {
    //                             //             stat = <LEVEL3 width="35px" height="35px" />
    //                             //         } else if (o.levelIcons == 2) {
    //                             //             stat = <LEVEL2 width="35px" height="35px" />
    //                             //         } else {
    //                             //             stat = <LEVEL1 width="35px" height="35px" />
    //                             //         }


    //                             // return (
    //                             data.vipLevels.edges.map((o, idx) => <TableRow key={idx}>
    //                                 <TableCell>{o.node.pk}</TableCell>
    //                                 <TableCell>{o.node.name}</TableCell>
    //                                 {/* {o.levelIcons == 1 ? <TableCell><LEVEL1 width="30" height="30" /></TableCell>
    //                                         : o.levelIcons == 2 ? <TableCell><LEVEL2 width="30" height="30" /></TableCell>
    //                                             : o.levelIcons == 3 ? <TableCell><LEVEL3 width="30" height="30" /></TableCell>
    //                                                 : <TableCell><LEVEL4 width="30" height="30" /></TableCell>} */}
    //                                 <TableCell></TableCell>
    //                                 <TableCell>{o.node.requiredPoints}</TableCell>
    //                                 <TableCell>{o.node.retainedPoints}</TableCell>
    //                                 <TableCell justify="center">
    //                                     <Grid container spacing={1} direction="row"><Grid item><Button className={classes.blueHover} onClick={() => editHandle(o.node)} size="small"><CreateOutlined /></Button></Grid>
    //                                         <Grid item><Button className={classes.blueHover} size="small"><DeleteOutlinedIcon /></Button></Grid></Grid>
    //                                 </TableCell>
    //                             </TableRow>
    //                             )
    //                             // )

    //                             // })
    //                         }
    //                     />
    //                 </Grid>
    //             </Paper>
    //         </Grid>
    //     </Grid>
    //     <Grid item xs={12} md={12} spacing={1} style={{ paddingLeft: 15 }}>
    //         <Paper style={{ paddingBottom: 30, backgroundColor: '#F5F5F5' }}>
    //             <Grid container style={{ backgroundColor: '#f1f4f9' }} >
    //                 <Typography className={classes.padding} variant="h6">
    //                     <Grid container>
    //                         <Grid item>
    //                             <MessageIcon className={classes.typography} color="primary" />
    //                         </Grid>
    //                         <Grid item>
    //                             {strings.VIPRuleDescription}
    //                         </Grid>
    //                     </Grid>
    //                 </Typography>
    //             </Grid>
    //             <Divider light={true} />
    //             <EditorContainer />
    //             <Grid style={{ paddingTop: 30, paddingRight: 50, backgroundColor: '#F5F5F5' }} justify="flex-end" container>
    //                 <Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" >{strings.release}</Button>
    //                 <Button style={{ width: 110, height: 30 }} variant="contained" >{strings.save}</Button>
    //             </Grid>
    //         </Paper>
    //     </Grid>

    //     <Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>
    //         <Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" >{strings.save}</Button>
    //     </Grid>

    //     <NewLevelModal levelData={levelData} isEdit={isEdit} setIsEdit={setIsEdit} mutate={mutate} setMutate={setMutate} open={modalOpen} setOpen={setModalOpen} query={isEdit ? UPDATE_LEVEL : ADD_LEVEL} dropAndDropFile={strings.dropAndDropFile} levelName={strings.levelName} levelIcons={strings.levelIcons} upload={strings.upload} requiredPoints={strings.requiredPoints} attenuationIntegral={strings.attenuationIntegral} />
    // </Grid>
}