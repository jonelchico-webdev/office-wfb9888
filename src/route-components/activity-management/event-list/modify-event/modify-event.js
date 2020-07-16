import React, { useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/styles';
import { Loading, Title, PreviewImage } from '../../../../components';
import useLanguages from '../../../../hooks/use-languages';
import { EVENTS_LIST } from '../../../../paths';
import { AppDateRangePicker } from '../../../../components/date-picker';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormGroup, Paper, Grid, Button, Typography, Divider, TextField, Select, OutlinedInput, MenuItem, Checkbox } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditorContainer from '../../../member-management/editor';
import { useMutation } from '@apollo/react-hooks'
import { GAME_EVENT_MUTATION_MODIFY, GAME_EVENT_IMAGE_UPLOAD, GAME_EVENT_VALUE_ADD_MUTATION, GAME_EVENT_VALUE_DELETE_MUTATION, GAME_EVENT_MUTATION_MODIFY_NO_EVENT_TYPE } from '../../../../queries-graphql/activity-management/event-list/mutation/add-game-event-mutation'
import swal from 'sweetalert2';
import AgentLineModal from '../modals/agent-modal'
import ParticipatingGamesModal from '../modals/participating-games-modal'
import Select2, {createFilter} from 'react-select'
import { useMemberLevels, useVipLevels } from '../../../../queries-graphql/activity-management/event-list/query/activity-member-levels'
import useGameEventModify from '../../../../queries-graphql/activity-management/event-list/query/event-id-query'
import useGameEventValueQuery from '../../../../queries-graphql/activity-management/event-list/query/event-list-activity-value-query'
import useGameEventTypeQuery from '../../../../queries-graphql/activity-management/event-list/query/event-list-type-query'
import moment from 'moment'
import Cookies from 'universal-cookie';
import gql from 'graphql-tag'

const cookies = new Cookies();

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
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    checkBox: {
        display: 'flex',
        padding: "1rem"
    },
    formControl: {
        margin: theme.spacing(1),
    },
}));

function GameEventTypes(){
	const {data, loading} = useGameEventTypeQuery({ mutation: true });
	if(loading) {  
		return [];
    }

    var gameEventTypes =  data.gameEventTypes.edges; 

    return gameEventTypes;
}

function MemberLevels(){
	const {data, loading} = useMemberLevels({ mutation: true });
	if(loading) {  
		return [];
    }

    var memberLevels =  data.memberLevels.edges; 

    return memberLevels;
}

function VipLevels(){
	const {data, loading} = useVipLevels({ mutation: true });
	if(loading) {  
		return [];
    }

    var vipLevels =  data.vipLevels.edges; 

    return vipLevels;
}

function GameEventValues(gameEventID, refresh){
	const {data, loading} = useGameEventValueQuery({ mutation: refresh, event: gameEventID, deletedFlag: false });
	if(loading) {  
		return [];
    }
    var gameEventValues =  data.gameEventValues.edges; 

    return gameEventValues;
}

let batchMutateDummy = `mutation{
    GetCaptcha {
        success
        imagePath
        requestIp
        captchaKey
    }
}` 

export default function EventList(props) {
    const classes = useStyles();
    const strings = useLanguages(EVENTS_LIST);
    const {history} = props 
    const id = history.location.pathname.split('/', 5)[4]
    
    const [refresh, setRefresh] = useState(false)
    const memberLevels = MemberLevels()
    const vipLevels = VipLevels()
    const gameEventTypes = GameEventTypes()
    const gameEventValues = GameEventValues(id, refresh)

    const [values, setValues] = useState({
        startDate: null,
        endDate: null,
        eventName: "",
        activityMode: "",
        activityType: "",
        issuanceMethod: "",
        participatingCompany: "",
        participatingEquipment: "",
        imagePC: null,
        imageMobile: null,
        imageEvent: null,
        activities: "",
        prizeAmount: "",
        waterDeposit: "",
        statisticalPeriod: "",
        conditionsOfTheEvent: "",
        distributionMethod: "",
        releaseType: "",
        activityWeight: "",
    });
    const [agentLine, setAgentLine] = useState([])
    const [commissionGame, setCommissionGame] = useState([])
    const [commissionGamePk, setCommissionGamePk] = useState([])
    const eventLevelLimitContent = []
    const eventVipLimitContent = []
    const [conditionConfiguration, setConditionConfiguration] = useState({
        registerToday: null,
        ipLimitOncePerday: null,
        depositToday: null,
        bindingMobilePhonenumber: null,
        accountLimitOncePerday: null,
        accountLimitOnceOnly: null,
        eventLevelLimit: null,
        // eventLevelLimitContent: arrParticipation,
        eventVipLimit: false,
        // eventVipLimitContent: [],
        eventGameLimit: false,
        eventGameLimitContent: commissionGamePk,
        eventUplineLimit: false,
        eventUplineLimitContent: agentLine,
    })
    const [modalOpen, setModalOpen] = useState({
        participatingGamesModal: false,
        agentLineModal: false,
    })
    const [content, setContent] = useState('')
    const [activityType, setActivityType] = useState([])
    let arrActivityType = []
    const [participationLevel, setParticipationLevel] = useState([])
    let arrMemberLevel = []
    const [participationVIPLevel, setParticipationVIPLevel] = useState([])
    let arrVIPLevel = []

    const [nextStep, setNextStep] = useState({
        firstStep: false,
        secondStep: true
    })
    const [open, setOpen] = useState(false)
    const [previewImg, setPreviewImg] = useState(values.imagePC)
    const [activityValues] = useState([])

    function handleNextStep() {
        setNextStep(oldValues => ({
            ...oldValues,
            firstStep: true,
            secondStep: false
        }))
    }

    function handlePreviousStep() {
        setNextStep(oldValues => ({
            ...oldValues,
            firstStep: false,
            secondStep: true
        }))
    }

    async function addRow() {
        const res = await gameEventValueAdd({
            variables: {
                event: id,
                minValue: 1,
                maxValue: 1,
                rewardAmount: 1,
                isPercent: true,
            }
        })

        if(res.data) {
            setRefresh(!refresh)
        }
    }

    async function remRow(id){
        const res = await gameEventValueDelete({
            variables: {
                id: id
            }
        })

        if(res.data) {
            setRefresh(!refresh)
        }
    }
    
    function handleValueChange(event) {
        event.persist();
        let value = event.target.value
        if(event.target.name === "waterDeposit" && value > 10) {
            value = 0
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: value
        }))
    }

    function handleConditionChange(event) {
        event.persist()
        setConditionConfiguration(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.checked
        }))
    }

    function handleOpenModal(modalValue, modalName) {
        setModalOpen(oldValues => ({
                ...oldValues,
                [modalName]: !modalValue
            })
        )
    }

    function imageFileHandler(event) {
        event.persist()
        let image = event.target.files[0]

        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: image
        }))
    }

    function previewImage(imageSource) {
        setOpen(true)
        setPreviewImg(imageSource)
    }

    const [focusedInput, setFocusedInput] = useState(null);
    function onDatesChange({ startDate, endDate }) {
        setValues(oldValues => ({
            ...oldValues,
            startDate,
            endDate
        }));
    }
    function onFocusChange(f) {
        setFocusedInput(f);
    }

    const activityTypeHandleChange = activityType => {
        setActivityType(activityType)
    }

    const participationLevelHandleChange = participationLevel => {
        setParticipationLevel(participationLevel)
        // setParticipationLevel(participationLevel => 
        //     [
        //         ...participationLevel,
        //         participationLevel
        //     ]
        // )
    }

    const participationVIPLevelHandleChange = participationVIPLevel => {
        setParticipationVIPLevel(participationVIPLevel)
        // setParticipationVIPLevel(participationVIPLevel => 
        //     [
        //         ...participationVIPLevel,
        //         participationVIPLevel
        //     ]
        // )
    }

    const [gameEvent] = useMutation(GAME_EVENT_MUTATION_MODIFY)
    const [gameEventIdModifyNoEventType] = useMutation(GAME_EVENT_MUTATION_MODIFY_NO_EVENT_TYPE)
    const [gameEventImage] = useMutation(GAME_EVENT_IMAGE_UPLOAD)
    const [batchMutateRatio, setBatchMutateRatio] = useState(batchMutateDummy)
    let batchMutateArrRatio = []
    const [gameEventValueUpdate] = useMutation(gql`${batchMutateRatio}`)
    const [gameEventValueAdd] = useMutation(GAME_EVENT_VALUE_ADD_MUTATION)
    const [gameEventValueDelete] = useMutation(GAME_EVENT_VALUE_DELETE_MUTATION)
    
    async function mutateModify() {
        if(activityType.length === 0){
            const res = await gameEventIdModifyNoEventType({
                variables: {
                    id: id,
                    updatedBy: cookies.get('ID'),
                    title: values.eventName !== "" ? values.eventName : gameEventId.title,
                    startAt: values.startDate ? values.startDate.toISOString() : gameEventId.startAt,
                    endAt: values.endDate ? values.endDate.toISOString() : gameEventId.endAt,
                    content: content !== "" ? content : gameEventId.content,
                    weight: values.activityWeight !== "" ? values.activityWeight : gameEventId.weight,
                    giveTime: values.statisticalPeriod !== "" ? values.statisticalPeriod : gameEventId.giveTime.toLowerCase(),
                    giveCondition: values.conditionsOfTheEvent !== "" ? values.conditionsOfTheEvent : gameEventId.giveCondition.toLowerCase(),
                    eventWay: values.distributionMethod !== "" ? values.distributionMethod : gameEventId.eventWay.toLowerCase(),
                    giveTypes: values.releaseType !== "" ? values.releaseType : gameEventId.giveTypes.toLowerCase(),
                    // eventGameLimitContent: conditionConfiguration.eventGameLimitContent,
                    eventGameVendorLimitContent: commissionGamePk,
                    eventLevelLimitContent: eventLevelLimitContent,
                    eventVipLimitContent: eventVipLimitContent,
                    registerToday: conditionConfiguration.registerToday === null ? gameEventId.registerToday : conditionConfiguration.registerToday ,
                    ipLimitOncePerday: conditionConfiguration.ipLimitOncePerday === null ? gameEventId.ipLimitOncePerday : conditionConfiguration.ipLimitOncePerday,
                    depositToday: conditionConfiguration.depositToday === null ? gameEventId.depositToday : conditionConfiguration.depositToday,
                    bindingMobilePhonenumber: conditionConfiguration.bindingMobilePhonenumber === null ? gameEventId.bindingMobilePhonenumber : conditionConfiguration.bindingMobilePhonenumber,
                    accountLimitOncePerday: conditionConfiguration.accountLimitOncePerday === null ? gameEventId.accountLimitOncePerday : conditionConfiguration.accountLimitOncePerday,
                    accountLimitOnceOnly: conditionConfiguration.accountLimitOnceOnly === null ? gameEventId.accountLimitOnceOnly : conditionConfiguration.accountLimitOnceOnly,
                }
            })

            if(res.data) {
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"pc",
                        file: values.imagePC
                    }
                })
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"mobile",
                        file: values.imageMobile
                    }
                })
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"event",
                        file: values.imageEvent
                    }
                })
            }

            if (res.data && activityValues.length > 0) {
                const response = await activityValues.map((o, idx) => {
                    let num = idx + 1
                    batchMutateArrRatio.push(
                        `mutation` + num + `:gameEventValue(input: {
                            id:"`+ o.id + `" ` +
                            `minValue:` + parseFloat(o.minValue) + ` ` +
                            `maxValue:` + parseFloat(o.maxValue) + ` ` +
                            `rewardAmount:` + parseFloat(o.rewardAmount) + ` ` +
                            `isPercent:` + JSON.parse(o.isPercent) + ` ` +
                            `}) {
                            errors {
                                field
                                messages
                            }
                        }`
                    )
                })
                setBatchMutateRatio(`mutation{${batchMutateArrRatio.join()}}`)
                if(response) {
                    gameEventValueUpdate()
                }
            }

            swal.fire({
                position: 'center',
                type: 'success',
                title: strings.eventEdited,
                showConfirmButton: false,
                timer: 1500
            })
            history.push(EVENTS_LIST)
        } else {
            const res = await gameEvent({
                variables: {
                    id: id,
                    updatedBy: cookies.get('ID'),
                    title: values.eventName !== "" ? values.eventName : gameEventId.title,
                    eventType: activityType.value !== undefined ? activityType.value : gameEventId.eventType.id,
                    startAt: values.startDate ? values.startDate.toISOString() : gameEventId.startAt,
                    endAt: values.endDate ? values.endDate.toISOString() : gameEventId.endAt,
                    content: content !== "" ? content : gameEventId.content,
                    weight: values.activityWeight !== "" ? values.activityWeight : gameEventId.weight,
                    giveTime: values.statisticalPeriod !== "" ? values.statisticalPeriod : gameEventId.giveTime.toLowerCase(),
                    giveCondition: values.conditionsOfTheEvent !== "" ? values.conditionsOfTheEvent : gameEventId.giveCondition.toLowerCase(),
                    eventWay: values.distributionMethod !== "" ? values.distributionMethod : gameEventId.eventWay.toLowerCase(),
                    giveTypes: values.releaseType !== "" ? values.releaseType : gameEventId.giveTypes.toLowerCase(),
                    eventGameVendorLimitContent: commissionGamePk,
                    eventLevelLimitContent: eventLevelLimitContent,
                    eventVipLimitContent: eventVipLimitContent,
                    registerToday: conditionConfiguration.registerToday === null ? gameEventId.registerToday : conditionConfiguration.registerToday ,
                    ipLimitOncePerday: conditionConfiguration.ipLimitOncePerday === null ? gameEventId.ipLimitOncePerday : conditionConfiguration.ipLimitOncePerday,
                    depositToday: conditionConfiguration.depositToday === null ? gameEventId.depositToday : conditionConfiguration.depositToday,
                    bindingMobilePhonenumber: conditionConfiguration.bindingMobilePhonenumber === null ? gameEventId.bindingMobilePhonenumber : conditionConfiguration.bindingMobilePhonenumber,
                    accountLimitOncePerday: conditionConfiguration.accountLimitOncePerday === null ? gameEventId.accountLimitOncePerday : conditionConfiguration.accountLimitOncePerday,
                    accountLimitOnceOnly: conditionConfiguration.accountLimitOnceOnly === null ? gameEventId.accountLimitOnceOnly : conditionConfiguration.accountLimitOnceOnly,
                }
            })

            if(res.data) {
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"pc",
                        file: values.imagePC
                    }
                })
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"mobile",
                        file: values.imageMobile
                    }
                })
                gameEventImage({
                    variables: {
                        id: res.data.gameEvent.gameEvent.id,
                        deviceType:"event",
                        file: values.imageEvent
                    }
                })
            }

            if (res.data && activityValues.length > 0) {
                const response = await activityValues.map((o, idx) => {
                    let num = idx + 1
                    batchMutateArrRatio.push(
                        `mutation` + num + `:gameEventValue(input: {
                            id:"`+ o.id + `" ` +
                            `minValue:` + parseFloat(o.minValue) + ` ` +
                            `maxValue:` + parseFloat(o.maxValue) + ` ` +
                            `rewardAmount:` + parseFloat(o.rewardAmount) + ` ` +
                            `isPercent:` + JSON.parse(o.isPercent) + ` ` +
                            `}) {
                            errors {
                                field
                                messages
                            }
                        }`
                    )
                })
                setBatchMutateRatio(`mutation{${batchMutateArrRatio.join()}}`)
                if(response) {
                    gameEventValueUpdate()
                }
            }

            swal.fire({
                position: 'center',
                type: 'success',
                title: strings.eventEdited,
                showConfirmButton: false,
                timer: 1500
            })
            history.push(EVENTS_LIST)
        }
    }

    const activityValueHandler = (id, minValue, maxValue, rewardAmt, percent) => (event) => {
        event.persist()
        let value = event.target.value
        let name = event.target.name

        if(!activityValues.find(o => o.id === id)) {
            activityValues.push({
                id: id, 
                minValue: name === "minValue" ? value : minValue, 
                maxValue: name === "maxValue" ? value : maxValue, 
                rewardAmount: name === "rewardAmount" ? value : rewardAmt,
                isPercent: name === "isPercent" ? event.target.checked : percent
            })
        } else {
            let index = activityValues.findIndex(o => o.id === id)
            activityValues[index][name] = name === "isPercent" ? event.target.checked : value
        }
    }

    if(gameEventTypes) {
        gameEventTypes.map(o => {
            arrActivityType.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
    }

    if(memberLevels) {
        memberLevels.map(o => {
            arrMemberLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
    }

    if(vipLevels) {
        vipLevels.map(o => {
            arrVIPLevel.push({ value: o.node.id, label: o.node.name, pk: o.node.pk })
        })
    }

    if(participationLevel) {
        participationLevel.map(o => {
            eventLevelLimitContent.push(o.pk)
        })
    }

    if(participationVIPLevel) {
        participationVIPLevel.map(o => {
            eventVipLimitContent.push(o.pk)
        })
    }

    const {data, loading} = useGameEventModify({ id: id })
    if(loading) {
        return <Loading/>
    }

    const gameEventId = data.gameEvent

    if(gameEventId.eventType && activityType.length === 0) {
        setActivityType({
            value: gameEventId.eventType.id, 
            label: gameEventId.eventType.name, 
            pk: gameEventId.eventType.pk
        })
    }

    if(gameEventId.eventLevelLimitContent.edges.length > 0 && participationLevel ? participationLevel.length === 0 ? true : false : false) {
        gameEventId.eventLevelLimitContent.edges.map((o) => {
            setParticipationLevel(participationLevel =>
                [
                    ...participationLevel,
                    {value: o.node.id, label: o.node.name, pk: o.node.pk}
                ]
            )
        })
    }

    if(gameEventId.eventVipLimitContent.edges.length > 0 && participationVIPLevel ? participationVIPLevel.length === 0 ? true : false : false) {
        gameEventId.eventVipLimitContent.edges.map((o) => {
            setParticipationVIPLevel(participationVIPLevel =>
                [
                    ...participationVIPLevel,
                    {value: o.node.id, label: o.node.name, pk: o.node.pk}
                ]
            )
        })
    }

    if(gameEventId.eventGameLimitContent.edges.length > 0 && commissionGame ? commissionGame.length === 0 ? true : false : false) {
        gameEventId.eventGameLimitContent.edges.map((o) => {
            setCommissionGame(commissionGame => 
                [
                    ...commissionGame,
                    o.node.gameType.id
                ]
            )
        })
    }

    if(gameEventId.eventGameVendorLimitContent.edges.length > 0 && commissionGamePk ? commissionGamePk.length === 0 ? true : false : false) {
        gameEventId.eventGameVendorLimitContent.edges.map((o) => {
            setCommissionGamePk(commissionGamePk =>
                [
                    ...commissionGamePk,
                    o.node.pk.toString()
                ]
            )
        })
    }

    if(gameEventId.eventUplineLimitContent.edges.length > 0 && agentLine ? agentLine.length === 0 ? true : false : false) {
        gameEventId.eventUplineLimitContent.edges.map((o) => {
            setAgentLine(agentLine => 
                [
                    ...agentLine,
                    o.node.pk.toString()
                ]
            )
        })
    }

    if(values.imagePC === null && gameEventId.picUrlPc !== "") {
        setValues(oldValues => ({
            ...oldValues,
            ["imagePC"]: process.env.REACT_APP_IMAGE_URL_ONLINE + gameEventId.picUrlPc
        }))
    }

    if(values.imageMobile === null && gameEventId.picUrlMobile !== "") {
        setValues(oldValues => ({
            ...oldValues,
            ["imageMobile"]: process.env.REACT_APP_IMAGE_URL_ONLINE + gameEventId.picUrlMobile
        }))
    }

    if(values.imageEvent === null && gameEventId.picEvent !== "") {
        setValues(oldValues => ({
            ...oldValues,
            ["imageEvent"]: process.env.REACT_APP_IMAGE_URL_ONLINE + gameEventId.picEvent
        }))
    }

    return <Grid>
        <Title pageTitle={strings.modifyEvent} />

        <Paper className={classes.root} style={{ marginTop: "20px" }}>
            <Typography variant='h6'>{strings.modifyEvent}</Typography>
            <Divider light={true} style={{ marginTop: "1em", marginBottom: "2em" }} />
            
            <Grid hidden={nextStep.firstStep}>

                <Grid container alignItems="center" spacing={1}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.basicInformationConfiguration}</Typography>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.eventName}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <TextField 
                                type="text" 
                                name="eventName"
                                variant="outlined" 
                                margin="dense"
                                defaultValue={gameEventId.title}
                                onChange={handleValueChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.typeOfActivity}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item style={{ width: 200 }}>
                            {/* <TextField 
                                type="text" 
                                name="eventName"
                                variant="outlined" 
                                margin="dense"
                                defaultValue={gameEventId.title}
                                onChange={handleValueChange}
                            /> */}
                            <Select2
                                className="standard"
                                placeholder={strings.pleaseChoose}
                                closeMenuOnSelect={false}
                                fullWidth={true} 
                                onChange={activityTypeHandleChange} 
                                value={activityType}
                                options={
                                    arrActivityType
                                }
                                filterOption={createFilter({ignoreAccents: false})}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.activityTime}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <AppDateRangePicker
                                focusedInput={focusedInput}
                                onFocusChange={onFocusChange}
                                onDatesChange={onDatesChange}
                                startDate={values.startDate ? values.startDate : moment(gameEventId.startAt)}
                                endDate={values.endDate ? values.endDate : moment(gameEventId.endAt)}
                                startDateId="startDate"
                                endDateId="endDate"
                                startDatePlaceholderText={strings.startDate}
                                endDatePlaceholderText={strings.endDate}
                                inputIconPosition="after"
                                showDefaultInputIcon
                                small
                                isOutsideRange={() => false}
                                showClearDates={false}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.activityPicturePC}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <input
                                accept="image/*"
                                id="imagePC-button-file"
                                multiple
                                type="file"
                                name="imagePC"
                                onChange={imageFileHandler}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="imagePC-button-file">
                            <Button component="span"  variant="contained" color="default" className={classes.button}>
                                {strings.uploadFiles}
                                <CloudUploadIcon className={classes.rightIcon} />
                            </Button>
                            </label>
                            <Button variant="contained" color="primary" onClick={() => previewImage(values.imagePC)}>
                                {strings.previewImg}
                            </Button>
                            <Typography>{strings.onlyImageFilesAreSupported} .PNG, .JPG, {strings.imageWidth} 1111px, {strings.pictureHeight} 500px, {strings.imageSizeDoesNotExceed} 500k </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.activityPicturemobilePhone}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <input
                                accept="image/*"
                                id="imageMobile-button-file"
                                multiple
                                type="file"
                                name="imageMobile"
                                onChange={imageFileHandler}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="imageMobile-button-file">
                            <Button component="span" variant="contained" color="default" className={classes.button}>
                                {strings.uploadFiles}
                                <CloudUploadIcon className={classes.rightIcon} />
                            </Button>
                            </label>
                            <Button variant="contained" color="primary" onClick={() => previewImage(values.imageMobile)}>
                                {strings.previewImg}
                            </Button>
                            <Typography>{strings.onlyImageFilesAreSupported} .PNG, .JPG, {strings.imageWidth} 1111px, {strings.pictureHeight} 500px, {strings.imageSizeDoesNotExceed} 500k </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.activityPicturePC}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <input
                                accept="image/*"
                                id="imagePCEvent-button-file"
                                multiple
                                type="file"
                                name="imageEvent"
                                onChange={imageFileHandler}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="imagePCEvent-button-file">
                            <Button component="span"  variant="contained" color="default" className={classes.button}>
                                {strings.uploadFiles}
                                <CloudUploadIcon className={classes.rightIcon} />
                            </Button>
                            </label>
                            <Button variant="contained" color="primary" onClick={() => previewImage(values.imageEvent)}>
                                {strings.previewImg}
                            </Button>
                            <Typography>{strings.onlyImageFilesAreSupported} .PNG, .JPG, {strings.imageWidth} 1111px, {strings.pictureHeight} 500px, {strings.imageSizeDoesNotExceed} 500k </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.activities}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <EditorContainer
                                defaultValue={`${gameEventId.content}`}
                                setContent={setContent}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                        <Grid md={1}>
                            <Grid item container direction="column" justify="center">
                                <Typography>{strings.activityWeight}:</Typography>
                            </Grid>
                        </Grid>
                        <Grid md={10} style={{ marginLeft: '1rem' }}>
                            <Grid item>
                                <TextField 
                                    type="number" 
                                    name="activityWeight"
                                    variant="outlined" 
                                    margin="dense"
                                    onChange={handleValueChange}
                                    defaultValue={gameEventId.weight}
                                />
                            </Grid>
                            <Typography style={{ color: "red" }}>{strings.activityWeightDescription}</Typography>
                        </Grid>
                    </Grid>
                
            </Grid>

            <Grid hidden={nextStep.secondStep}>

                <Grid container alignItems="center" spacing={1} style={{ marginTop: "3em" }}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.parameterConfiguration}</Typography>
                </Grid>
                
                <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                <Grid md={1}>
                    <Grid item container direction="column" justify="center">
                        <Typography>{strings.statisticalPeriod}:</Typography>
                    </Grid>
                </Grid>
                <Grid md={10} style={{ marginLeft: '1rem' }}>
                    <Grid item>
                        <FormControl component="fieldset">
                            <RadioGroup name="statisticalPeriod" defaultValue={gameEventId.giveTime ? gameEventId.giveTime.toLowerCase() : null} onChange={handleValueChange} row style={{ marginLeft: 10, marginRight: 10 }}>
                                <FormControlLabel
                                    value="day"
                                    control={<Radio color="primary" />}
                                    label={strings.instant}
                                />
                                <FormControlLabel
                                    value="week"
                                    control={<Radio color="primary" />}
                                    label={strings.weekly}
                                />
                                <FormControlLabel
                                    value="month"
                                    control={<Radio color="primary" />}
                                    label={strings.monthly}
                                />
                                <FormControlLabel
                                    value="auto"
                                    control={<Radio color="primary" />}
                                    label={strings.times}
                                />
                                <FormControlLabel
                                    value="end"
                                    control={<Radio color="primary" />}
                                    label={strings.endOfEventPeriod}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            
                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.conditionsOfTheEvent}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <FormControl component="fieldset">
                                <RadioGroup name="conditionsOfTheEvent" defaultValue={gameEventId.giveCondition ? gameEventId.giveCondition.toLowerCase() : null} onChange={handleValueChange} row style={{ marginLeft: 10, marginRight: 10 }}>
                                    <FormControlLabel
                                        value="bet"
                                        control={<Radio color="primary" />}
                                        label={strings.valid}
                                    />
                                    <FormControlLabel
                                        value="deposit"
                                        control={<Radio color="primary" />}
                                        label={strings.recharge}
                                    />
                                    <FormControlLabel
                                        value="lose"
                                        control={<Radio color="primary" />}
                                        label={strings.loss}
                                    />
                                    <FormControlLabel
                                        value="register"
                                        control={<Radio color="primary" />}
                                        label={strings.registered}
                                    />
                                    <FormControlLabel
                                        value="bindphone"
                                        control={<Radio color="primary" />}
                                        label={strings.bindPhoneNumber}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.distributionMethod}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <FormControl component="fieldset">
                                <RadioGroup name="distributionMethod" defaultValue={gameEventId.eventWay ? gameEventId.eventWay.toLowerCase() : null} onChange={handleValueChange} row style={{ marginLeft: 10, marginRight: 10 }}>
                                    <FormControlLabel
                                        value="autoevent"
                                        control={<Radio color="primary" />}
                                        label={strings.automaticRelease}
                                    />
                                    <FormControlLabel
                                        value="manualevent"
                                        control={<Radio color="primary" />}
                                        label={strings.reviewRelease}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <Grid md={1}>
                        <Grid item container direction="column" justify="center">
                            <Typography>{strings.releaseType}:</Typography>
                        </Grid>
                    </Grid>
                    <Grid md={10} style={{ marginLeft: '1rem' }}>
                        <Grid item>
                            <FormControl component="fieldset">
                                <RadioGroup name="releaseType" defaultValue={gameEventId.giveTypes ? gameEventId.giveTypes.toLowerCase() : null} onChange={handleValueChange} row style={{ marginLeft: 10, marginRight: 10 }}>
                                    <FormControlLabel
                                        value="all"
                                        control={<Radio color="primary" />}
                                        label={strings.overlayAll}
                                    />
                                    <FormControlLabel
                                        value="onlyone"
                                        control={<Radio color="primary" />}
                                        label={strings.only}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container alignItems="center" spacing={1} style={{ marginTop: "3em" }}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.activityValueHeader}</Typography>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                    
                    {
                        gameEventValues.length === 0 ? 
                        <Grid item>
                            <Button variant='contained' color='primary' onClick={addRow}>{strings.increase}</Button>
                        </Grid>
                        :
                        gameEventValues.map((o, idx) => <Fragment>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <TextField
                                    type="number" 
                                    name="minValue"
                                    variant="outlined" 
                                    margin="dense" 
                                    defaultValue={o.node.minValue}
                                    onChange={activityValueHandler(
                                        o.node.id, 
                                        o.node.minValue,
                                        o.node.maxValue,
                                        o.node.rewardAmount,
                                        o.node.isPercent
                                    )}
                                />
                            </Grid>

                            <Grid item>
                                <Typography>{strings.to}</Typography>
                            </Grid>

                            <Grid item>
                                <TextField
                                    type="number" 
                                    name="maxValue"
                                    variant="outlined" 
                                    margin="dense" 
                                    defaultValue={o.node.maxValue}
                                    onChange={activityValueHandler(
                                        o.node.id, 
                                        o.node.minValue,
                                        o.node.maxValue,
                                        o.node.rewardAmount,
                                        o.node.isPercent
                                    )}
                                />
                            </Grid>

                            <Grid item>
                                <Typography>{strings.reward}: </Typography>
                            </Grid>

                            <Grid item>
                                <TextField
                                    type="number" 
                                    name="rewardAmount"
                                    variant="outlined" 
                                    margin="dense" 
                                    defaultValue={o.node.rewardAmount}
                                    onChange={activityValueHandler(
                                        o.node.id, 
                                        o.node.minValue,
                                        o.node.maxValue,
                                        o.node.rewardAmount,
                                        o.node.isPercent
                                    )}
                                />
                            </Grid>

                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={o.node.isPercent} 
                                            color="primary" 
                                        />
                                    }
                                    label="%"
                                    labelPlacement="end"
                                    name="isPercent"
                                    onChange={activityValueHandler(
                                        o.node.id, 
                                        o.node.minValue,
                                        o.node.maxValue,
                                        o.node.rewardAmount,
                                        o.node.isPercent
                                    )}
                                />
                            </Grid>

                            <Grid item>
                                <Button variant='contained' color='primary' onClick={addRow}>{strings.increase}</Button>
                            </Grid>

                            <Grid item>
                                <Button variant='contained' onClick={() => remRow(o.node.id)} style={{ backgroundColor: 'red', color: 'white' }}>{strings.delete}</Button>
                            </Grid>
                        </Grid>
                        </Fragment>)
                    } 
                </Grid>

                <Grid container alignItems="center" spacing={1} style={{ marginTop: "3em" }}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.participationConditionConfiguration}</Typography>
                </Grid>

                <Grid container direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                    <FormControl component="fieldset" className={classes.formControl}>
                        <FormGroup>
                            <Grid container spacing={2} alignItems="center" style={{ padding: "1rem" }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="eventLevelLimit"
                                            onChange={handleConditionChange}
                                        />
                                    }
                                    label={strings.activityParticipationLevel}
                                /> */}

                                <Grid item>
                                    <Typography>{strings.activityParticipationLevel}</Typography>
                                </Grid>

                                <FormControl component="fieldset">
                                    <Grid container spacing={1} alignItems="center">
                                        {/* <Grid item style={{flexGrow: 1}}> */}
                                        <Grid item style={{ minWidth: 200 }}>
                                        <Select2
                                            // isDisabled={conditionConfiguration.eventLevelLimit ? false : true}
                                            className="standard"
                                            placeholder={strings.pleaseChoose}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            fullWidth={true} 
                                            onChange={participationLevelHandleChange} 
                                            defaultValue={participationLevel}
                                            options={
                                                arrMemberLevel
                                            }
                                            filterOption={createFilter({ignoreAccents: false})}
                                        />
                                            
                                        </Grid>
                                        <Grid item>
                                            <Typography>{strings.times} {participationLevel ? participationLevel.length : 0} {strings.people}</Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>

                            <Grid container spacing={2} alignItems="center" style={{ padding: "1rem" }}>

                                <Grid item>
                                    <Typography>{strings.activityParticipationVIPLevel}</Typography>
                                </Grid>

                                <FormControl component="fieldset">
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item style={{ minWidth: 200 }}>
                                            <Select2
                                                // isDisabled={conditionConfiguration.eventVipLimit ? false : true}
                                                placeholder={strings.pleaseChoose}
                                                isMulti
                                                closeMenuOnSelect={false}
                                                fullWidth={true} 
                                                onChange={participationVIPLevelHandleChange} 
                                                defaultValue={participationVIPLevel}
                                                options={
                                                    arrVIPLevel
                                                }
                                                filterOption={createFilter({ignoreAccents: false})}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography>{strings.times} {participationVIPLevel ? participationVIPLevel.length : 0} {strings.people}</Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>

                            </Grid>

                            <Grid container spacing={2} alignItems="center" className={classes.checkBox}>

                                <Grid item>
                                    <Typography>{strings.participatingVendor}</Typography>
                                </Grid>

                                <Grid item>
                                    <Button 
                                        // disabled={conditionConfiguration.eventGameLimit ? false : true} 
                                        style={{ height: 30 }} 
                                        variant="contained" 
                                        color="primary" 
                                        margin="dense"
                                        onClick={() => handleOpenModal(modalOpen.participatingGamesModal, 'participatingGamesModal')}
                                    >
                                        {strings.pleaseChoose}
                                    </Button>
                                </Grid>
                                
                            </Grid>

                        </FormGroup>
                    </FormControl>
                </Grid>
                
                <Grid container alignItems="center" spacing={1} style={{ marginTop: "3em" }}>
                    <InfoIcon color="primary" />
                    <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.activityParticipationConditionConfiguration}</Typography>
                </Grid>

                <Grid container style={{ paddingLeft: "2rem" }}>
                    <Grid container alignItems="center">
                        <Grid className={classes.checkBox}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="registerToday"
                                                defaultChecked={gameEventId.registerToday}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.registerOnSameDay}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="ipLimitOncePerday"
                                                defaultChecked={gameEventId.ipLimitOncePerday}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.sameIpReceived}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="depositToday"
                                                defaultChecked={gameEventId.depositToday}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.rechargeOnDay}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="bindingMobilePhonenumber"
                                                defaultChecked={gameEventId.bindingMobilePhonenumber}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.bindMobileNumber}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="accountLimitOncePerday"
                                                defaultChecked={gameEventId.accountLimitOncePerday}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.theSameAccountReceived}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="accountLimitOnceOnly"
                                                defaultChecked={gameEventId.accountLimitOnceOnly}
                                                onChange={handleConditionChange}
                                            />
                                        }
                                        label={strings.receiveSameAccountOnce}
                                    />

                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                
            </Grid>
          
            <ParticipatingGamesModal 
                commissionGame={commissionGame} 
                commissionGamePk={commissionGamePk}
                open={modalOpen.participatingGamesModal} 
                setOpen={setModalOpen}
                strings={strings}
            />
            <AgentLineModal
                agentLine={agentLine}
                open={modalOpen.agentLineModal}
                setOpen={setModalOpen}
            />
            <PreviewImage
                open={open}
                setOpen={setOpen}
                imgSrc={previewImg}
                setPreviewImg={setPreviewImg}
            />

        </Paper>
        <Grid style={{ paddingTop: 30, paddingRight: 50, marginBottom: 30 }} justify="center" container>
            <Button style={{ width: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" onClick={ nextStep.secondStep ? handleNextStep : mutateModify}>{ nextStep.secondStep ? strings.nextStep : strings.save}</Button>
            <Button style={{ minWidth: 110, marginRight: 20, height: 30 }} color="primary" variant="contained" onClick={ nextStep.secondStep ? () => history.goBack() : handlePreviousStep}>{ nextStep.secondStep ? strings.cancel : strings.previousStep}</Button>
        </Grid>
    </Grid>
}