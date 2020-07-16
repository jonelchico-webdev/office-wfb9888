import React, {useState, Fragment, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles';
import {Title, Loading} from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { COMMISSION_MANAGEMENT_ADD, DIVIDEND_MANAGEMENT } from '../../../paths';
import { Radio, RadioGroup, FormControl, 
    FormControlLabel, Paper, Grid, Button, Typography, 
    TextField, MenuItem, Checkbox,

} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
// import FirstModal from './first-modal'
// import SecondModal from './second-modal'
// import ThirdModal from './third-modal'
import FirstModal from '../modal-modify/first-modal'
import SecondModal from '../modal-modify/second-modal'
import ThirdModal from '../modal-modify/third-modal'

import { useMutation } from '@apollo/react-hooks'
import { MODIFY_COMMISSION } from '../../../queries-graphql/commission-system/mutation/commission-add-mutation'
import { useCommissionIdQuery, useCommissionRuleIdQuery } from '../../../queries-graphql/commission-system/commission-management'
import gql from 'graphql-tag'
import swal from 'sweetalert2';

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
    },
    formControl: {
        margin: theme.spacing(3),
    },
    menuSelect: {
        width: 200,
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

function useDataGamesVendorCommission(id, mutate) {
    const {data, loading} = useCommissionRuleIdQuery({ commission: id, mutation: mutate })
    if(loading) {
        return [];
    }

    var commissionRules = data.commissionRules.edges;

    return commissionRules;
}

export default function DividendModify(props) {
    const classes = useStyles();
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);

    const {history} = props
    const id = history.location.pathname.split('/', 5)[4];
    const [mutate, setMutate] = useState(false)
    const commissionRules = useDataGamesVendorCommission(id, mutate)

    const [commissionRuleId, setCommissionRuleId] = useState(null)
    const [modalOpen, setModalOpen] = useState({
        firstModal: false,
        secondModal: false,
        thirdModal: false
    })
    const [commissionAgentsProfile, setCommissionAgentsProfile] = useState([])
    useEffect(() => {
        {
            commissionAgentsProfile.map((o, idx) => (
                agentLine.push(o.node.id.toString())
            ))
        }
    }, [commissionAgentsProfile])

    const [agentLine] = useState([])
    const [commissionGame] = useState([])
    const [commissionGameVendor, setCommissionGameVendor] = useState([])
    const [dataValue, setDataValue] = useState([])
    const [dataRule] = useState([])
    const [disabled, setDisabled] = useState([])
    const [values, setValues] = useState({
        commissionName: "",
        payPeriod: "",
        commissionType: "",
        effectiveBet: null,
        effectiveRecharge: null,
        issuanceMethod: "",
        affiliateProfiles: agentLine,
        commissionGameVendor: commissionGameVendor,
        dataValues: dataValue,
        stopper: ""
    })

    const handleChange = (event) => {
        event.persist();
        // if(values[event.target.name] && event.target.value > 99 ) {
        //     event.target.value = 99
        // }
        if(values[event.target.name] && event.target.value < 0) {
            event.target.value = 0
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }))
    }

    function handleOpenModal(modalValue, modalName, commissionRuleID) {
        setCommissionRuleId(commissionRuleID)
        setModalOpen(oldValues => ({
                ...oldValues,
                [modalName]: !modalValue
            })
        )
        setMutate(!mutate)
    }

    const [batchMutate, setBatchMutate] = useState(batchMutateDummy)
    let batchMutateArr = []
    const [batchMutateRuleRatio, setBatchMutateRuleRatio] = useState(batchMutateDummy)
    let batchMutateRuleArrRatio = []
    const [batchMutateRatio, setBatchMutateRatio] = useState(batchMutateDummy)
    let batchMutateArrRatio = []
    const [commission] = useMutation(MODIFY_COMMISSION)
    const [commissionGameVendors] = useMutation(gql`${batchMutate}`)
    const [commissionRuleUpdate] = useMutation(gql`${batchMutateRuleRatio}`)
    const {data, loading} = useCommissionIdQuery({ id: id, mutation: mutate })
    const [commissionRuleGameVendorRatio] = useMutation(gql`${batchMutateRatio}`)
    if(loading) {
        return <Loading/>
    }

    const commissionId = data.commission
    // const commissionAgentsProfile = data.commission.affiliateProfiles.edges
    const commissionGameTypeVendors = data.commission.gameTypeVendors.edges
    const commissionRulesId = commissionRules

    if(commissionAgentsProfile.length === 0) {
        setCommissionAgentsProfile(data.commission.affiliateProfiles.edges)
    }

    {
		if(commissionGameVendor.length === 0 ) {
			commissionGameTypeVendors.map((o) => (
				commissionGameVendor.push({
                    vendorID: o.node.gameVendor.id.toString(),
                    gameTypeID: o.node.gameType.id.toString(),
                    enabled: o.node.enabled,
                    id: o.node.id
                })
			))
		}
    }

    async function updateCommission() {
        if(
        dataRule.find((o, idx) => {
            if(parseFloat(o.genericRatio) > 9.9) {
                return true;
            }
        })
        ) {
            swal.fire({
                position: 'center',
                type: 'error',
                title: '一般比率的最大值为9.9！!',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }
        // Commission Update Mutate
        let joinAffiliateProfiles = null
        let affiliateProfilesArr = []
        
        values.affiliateProfiles.map((o) => {
            affiliateProfilesArr.push(`'${o}'`)
        })

        if(affiliateProfilesArr.length !==0) {
            joinAffiliateProfiles = affiliateProfilesArr.join()
        }

        let finalValueAffiliate = "["+joinAffiliateProfiles+"]"
        // END

        const res = await commission({
            variables: {
                id: id,
                name: values.commissionName ? values.commissionName : commissionId.name,
                payPeriod: values.payPeriod ? values.payPeriod : commissionId.payPeriod.toLowerCase(),
                commissionType: values.commissionType ? values.commissionType : commissionId.commissionType.toLowerCase(),
                issuanceType: values.issuanceMethod ? values.issuanceMethod : commissionId.issuanceType.toLowerCase(), 
                minHasBetDescendantCount: values.effectiveBet ? values.effectiveBet : commissionId.minHasBetDescendantCount,
                minHasDepositedDescendantCount: values.effectiveRecharge ? values.effectiveRecharge : commissionId.minHasDepositedDescendantCount,
                affiliateProfiles: finalValueAffiliate
            }
        })
        
        if (res.data && dataRule.length > 0) {
            const response = await dataRule.map((o, idx) => {
                let num = idx + 1
                batchMutateRuleArrRatio.push(
                    `mutation` + num + `:commissionRule(input: {
                        commission:"`+ o.commissionId + `" ` +
                        `id:"` + o.id + `" ` +
                        `ratioStrategy:"` + o.ratioStrategy + `" ` +
                        `minDescendantsCount:` + parseFloat(o.minDescendantsCount) + ` ` +
                        `genericRatio:` + parseFloat(o.genericRatio) + ` ` +
                        `minDescendantsSumOfActionsAmount:` +  parseFloat(o.minDescendantsSumOfActionsAmount) +
                        `}) {
                        id
                        commission
                        minDescendantsCount
                        minDescendantsSumOfActionsAmount
                        ratioStrategy
                        errors {
                            field
                            messages
                        }
                    }`
                )
            })
            setBatchMutateRuleRatio(`mutation{${batchMutateRuleArrRatio.join()}}`)
            if(response) {
                commissionRuleUpdate()
                setMutate(!mutate)
            }
        }
        swal.fire({
            position: 'center',
            type: 'success',
            title: '佣金更新!',
            showConfirmButton: false,
            timer: 1500
        })
        history.push(DIVIDEND_MANAGEMENT)
    }

    async function updateCommissionVendors() {
        const res = await values.commissionGameVendor.map((o, idx) => {
            let num = idx + 1
            if(o.id === null) {
                batchMutateArr.push(
                    `mutation` + num + `:commissionGameTypeVendor(input: {
                        commission:"`+ id + `" ` +
                        `gameType:"` + o.gameTypeID + `" ` +
                        `gameVendor:"` + o.vendorID + `" ` +
                        `enabled:` + o.enabled +
                        `}) {
                        id
                        gameType
                        gameVendor
                        enabled
                        clientMutationId
                        errors
                        {
                            field
                            messages
                        }
                    }`
                )
            } else {
                batchMutateArr.push(
                    `mutation` + num + `:commissionGameTypeVendor(input: {
                        commission:"`+ id + `" ` +
                        `gameType:"` + o.gameTypeID + `" ` +
                        `gameVendor:"` + o.vendorID + `" ` +
                        `id:"` + o.id + `" ` +
                        `enabled:` + o.enabled +
                        `}) {
                        id
                        gameType
                        gameVendor
                        enabled
                        clientMutationId
                        errors
                        {
                            field
                            messages
                        }
                    }`
                )
            }
            
        })
        setBatchMutate(`mutation{${batchMutateArr.join()}}`)
        if(res) {
            commissionGameVendors()
            // setMutate(!mutate)
            setModalOpen(oldValues => ({
                ...oldValues,
                secondModal: false
            }))
            swal.fire({
                position: 'center',
                type: 'success',
                title: '增加了佣金规则和供应商比率',
                showConfirmButton: false,
                timer: 2000,
                onClose: () => {
                    setMutate(!mutate)
                }
            })
        }
    }

    async function updateCommissionRatios() {
        const res = await dataValue.map((o, idx) => {
            let num = idx + 1

            if(o.id) {
                batchMutateArrRatio.push(
                    `mutation` + num + `:commissionRuleGameTypeVendorRatio(input: {
                        commissionGameTypeVendor:"`+ o.gameTypeID + `" ` +
                        `commissionRule:"` + commissionRuleId + `" ` +
                        `id:"` + o.id + `" ` +
                        `value:` + parseFloat(o.value) + ` ` +
                        `enabled:` + o.enabled +
                        `}) {
                        id
                        value
                        enabled
                        commissionRule
                        commissionGameTypeVendor
                        errors{
                            field
                            messages
                        }
                    }`
                )
            } else {
                batchMutateArrRatio.push(
                    `mutation` + num + `:commissionRuleGameTypeVendorRatio(input: {
                        commissionGameTypeVendor:"`+ o.gameTypeID + `" ` +
                        `commissionRule:"` + commissionRuleId + `" ` +
                        `value:` + parseFloat(o.value) + ` ` +
                        `enabled:` + o.enabled +
                        `}) {
                        id
                        value
                        enabled
                        commissionRule
                        commissionGameTypeVendor
                        errors{
                            field
                            messages
                        }
                    }`
                )
            }
            
        })
        setBatchMutateRatio(`mutation{${batchMutateArrRatio.join()}}`)
        if(res) {
            commissionRuleGameVendorRatio()
            swal.fire({
                position: 'center',
                type: 'success',
                title: '佣金游戏供应商比率已添加',
                showConfirmButton: false,
                timer: 1500
            })
            setModalOpen(oldValues => ({
                ...oldValues,
                thirdModal: false
            }))
            setDisabled([])
            setDataValue([])
            setMutate(!mutate)
            // window.location.reload()
        }
    }
    
    const commissionRuleValueHandler = (commissionRuleId, strategyRatio, countBet, countPax, genericRatio) => (event) => {
        event.persist()
        let value = event.target.value
        let name = event.target.name
        var genericRatioPercent = 0

        if(genericRatio || genericRatio !== undefined) {
            genericRatioPercent = genericRatio
        }

        if(!dataRule.find(o => o.id === commissionRuleId)) {
            dataRule.push({
                commissionId: id, 
                id: commissionRuleId, 
                minDescendantsCount: name === "minDescendantsCount" ? value : countPax, 
                minDescendantsSumOfActionsAmount: name === "minDescendantsSumOfActionsAmount" ? value : countBet, 
                ratioStrategy: name === "ratioStrategy" ? value : strategyRatio.toLowerCase(),
                genericRatio: name === "genericRatio" ? value : genericRatioPercent
            })
        } else {
            let index = dataRule.findIndex(o => o.id === commissionRuleId)
            dataRule[index][name] = value
        }
        setMutate(!mutate)
        if(strategyRatio !== 'game_type_vendor' || strategyRatio !== "generic") {
            setValues(oldValues => ({
                ...oldValues,
                [strategyRatio]: event.target.value
            }))
        }
    }

    async function addCommissionRule() {
        // const dataRule = await commissionRuleAddDefault({
        //     variables: {
        //         commission: id
        //     }
        // })
        setMutate(!mutate)
    }

    async function deleteCommissionRule(ruleId) {
        // const dataRule = await commissionRuleDelete({
        //     variables: {
        //         id: ruleId
        //     }
        // })
        setMutate(!mutate)
    }
    
    return <Grid>
            <Title pageTitle='modify commission' />
                
            <Paper className={classes.root} style={{ marginTop: "20px" }}>
            
            <Grid container alignItems="center" spacing={1}>
                <InfoIcon color="primary"/>
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.basicInformationConfiguration}</Typography>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.commissionName}:</Typography>
                </Grid>
                <Grid item>
                    <TextField defaultValue={commissionId.name} required type="text" variant="outlined" margin="dense" name="commissionName" onChange={handleChange}/>
                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.statisticalPeriod}:</Typography>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <RadioGroup defaultValue={commissionId.payPeriod.toLowerCase()} aria-label="position" name="position" row style={{ marginLeft: 10, marginRight: 10 }} name="payPeriod" onClick={handleChange}>
                            <FormControlLabel
                            value="instant"
                            control={<Radio color="primary" />}
                            label={strings.instant}
                            />
                            <FormControlLabel
                            value="daily"
                            control={<Radio required color="primary" />}
                            label={strings.day}
                            />
                            <FormControlLabel
                            value="three_days"
                            control={<Radio required color="primary" />}
                            label={strings.threeDays}
                            />
                            <FormControlLabel
                            value="weekly"
                            control={<Radio required color="primary" />}
                            label={strings.week}
                            />
                            <FormControlLabel
                            value="bi_monthly"
                            control={<Radio required color="primary" />}
                            label={strings.halfMonth}
                            />
                            <FormControlLabel
                            value="monthly"
                            control={<Radio color="primary" />}
                            label={strings.month}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.commissionType}:</Typography>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <RadioGroup defaultValue={commissionId.commissionType.toLowerCase()} aria-label="position" name="position" row style={{ marginLeft: 10, marginRight: 10 }} name="commissionType" onClick={handleChange}>
                            <FormControlLabel
                            value="loss"
                            control={<Radio required color="primary" />}
                            label={strings.consumption}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.effectiveNumberOfPeople}:</Typography>
                </Grid>
                    <Grid item>
                        <Typography>{strings.effectiveBet}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField required type="number" variant="outlined" margin="dense" name="effectiveBet" defaultValue={commissionId.minHasBetDescendantCount} onChange={handleChange}/>
                    </Grid>
                    <Grid item>
                        <Typography>{strings.effectiveRecharge}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField required type="number" variant="outlined" margin="dense" name="effectiveRecharge" defaultValue={commissionId.minHasDepositedDescendantCount} onChange={handleChange}/>
                    </Grid>
            </Grid>
            
            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.distributionMethod}:</Typography>
                </Grid>
                <Grid item>
                    <Grid item>
                        <FormControl component="fieldset">
                            <RadioGroup defaultValue={commissionId.issuanceType.toLowerCase()} aria-label="position" name="position" row style={{ marginLeft: 10, marginRight: 10 }} name="issuanceMethod" onClick={handleChange}>
                                <FormControlLabel
                                value="auto"
                                control={<Radio required color="primary" />}
                                label={strings.automaticIssuance}
                                />
                                <FormControlLabel
                                value="manual"
                                control={<Radio required color="primary" />}
                                label={strings.auditRelease}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.agentLineParticipating}:</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={() => handleOpenModal(modalOpen.firstModal, 'firstModal')} variant='contained' color='primary'>{strings.pleaseChoose}</Button>
                </Grid>
            </Grid>

            <Grid container alignItems="center" spacing={1} style={{ marginTop: "3em" }}>
                <InfoIcon color="primary"/>
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.rewardConfiguration}</Typography>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.participationInTheGameOfCommission}:</Typography>   
                </Grid>
                <Grid item>
                    <Button onClick={() => handleOpenModal(modalOpen.secondModal, 'secondModal')} variant='contained' color='primary'>{strings.pleaseChoose}</Button>
                </Grid>
            </Grid>
            
            <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                {
                    (commissionRulesId.length === 0) ? 
                    <Grid item>
                        <Button variant='contained' color='primary' onClick={addCommissionRule}>{strings.increase}</Button>
                    </Grid>
                    :
                    commissionRulesId.map((o, idx) => {
                    return(<Fragment>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <Typography>{strings.teamEffectiveBetting}:</Typography>
                            </Grid>
                            <Grid item>
                                <TextField 
                                    onChange={
                                        commissionRuleValueHandler(
                                            o.node.id, 
                                            o.node.ratioStrategy,
                                            o.node.minDescendantsSumOfActionsAmount,
                                            o.node.minDescendantsCount
                                        )
                                    } 
                                    defaultValue={o.node.minDescendantsSumOfActionsAmount}
                                    name="minDescendantsSumOfActionsAmount"
                                    type="number" variant="outlined" 
                                    margin="dense" 
                                    inputProps={{
                                        min: "1",
                                        step: "1"
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <Typography>{strings.theEffectiveNumberOfTeams}:</Typography>
                            </Grid>
                            <Grid item>
                                <TextField 
                                    onChange={
                                        commissionRuleValueHandler(
                                            o.node.id, 
                                            o.node.ratioStrategy,
                                            o.node.minDescendantsSumOfActionsAmount,
                                            o.node.minDescendantsCount
                                        )
                                    } 
                                    defaultValue={o.node.minDescendantsCount}
                                    name="minDescendantsCount"
                                    type="number" variant="outlined" 
                                    margin="dense" 
                                    inputProps={{
                                        min: "1",
                                        step: "1"
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-select-currency"
                                    // displayEmpty
                                    select
                                    name="ratioStrategy"
                                    label={strings.ratioStrategy}
                                    className={classes.textFieldSelect}
                                    value={values[`ratioStrategy${idx}`] ? values[`ratioStrategy${idx}`] : o.node.ratioStrategy.toLowerCase()}
                                    onChange={
                                        commissionRuleValueHandler(
                                            o.node.id, 
                                            `ratioStrategy${idx}`, 
                                            o.node.minDescendantsSumOfActionsAmount,
                                            o.node.minDescendantsCount
                                        )
                                    }
                                    SelectProps={{
                                    MenuProps: {
                                        className: classes.menuSelect,
                                    },
                                    }}
                                    helperText="Please select your ratio strategy"
                                    margin="normal"
                                >
                                    <MenuItem key={1} value="generic">
                                        {strings.generic}
                                    </MenuItem>
                                    {
                                        values.commissionType === "" ?
                                        commissionId.commissionType === "DEPOSIT" ?
                                        null
                                        :
                                        <MenuItem key={2} value="game_type_vendor">
                                            {strings.gameTypeVendor}
                                        </MenuItem>
                                        :
                                        values.commissionType === "bet" ?
                                        <MenuItem key={2} value="game_type_vendor">
                                            {strings.gameTypeVendor}
                                        </MenuItem>
                                        :
                                        null
                                    }
                                </TextField>
                            </Grid>

                            {
                                values[`ratioStrategy${idx}`] ?
                                values[`ratioStrategy${idx}`] === 'game_type_vendor' ? 
                                <Fragment>
                                <Grid item>
                                    <Typography>{strings.aboveYouCanGetACommission}:</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' color='primary' onClick={() => handleOpenModal(modalOpen.thirdModal, 'thirdModal', o.node.id)}>{strings.pleaseChoose}</Button>
                                </Grid>
                                </Fragment>
                                :
                                <Fragment>
                                    <Grid item>
                                        <Typography>{strings.aboveYouCanGetACommission}:</Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField 
                                            onChange={
                                                commissionRuleValueHandler(
                                                o.node.id, 
                                                o.node.ratioStrategy, 
                                                o.node.minDescendantsSumOfActionsAmount,
                                                o.node.minDescendantsCount,
                                                o.node.genericRatio
                                            )} 
                                            name="genericRatio"
                                            type="number" variant="outlined" 
                                            margin="dense" 
                                            defaultValue={values[`genericRatio${idx}`] ? values[`genericRatio${idx}`] : o.node.genericRatio}
                                            inputProps={{
                                                min: "1",
                                                step: "1"
                                            }}
                                            style={{ width: 100 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        {/* <FormControlLabel
                                            value="end"
                                            control={<Checkbox color="primary" />}
                                            label="% (Max 9.9%)"
                                            labelPlacement="end"
                                        /> */}
                                        <Typography> % (最大值 9.9%)</Typography>
                                    </Grid>
                                </Fragment>
                                :
                                o.node.ratioStrategy.toLowerCase() === 'game_type_vendor' ?
                                <Fragment>
                                <Grid item>
                                    <Typography>{strings.aboveYouCanGetACommission}:</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' color='primary' onClick={() => handleOpenModal(modalOpen.thirdModal, 'thirdModal', o.node.id)}>{strings.pleaseChoose}</Button>
                                </Grid>
                                </Fragment>
                                :
                                <Fragment>
                                    <Grid item>
                                        <Typography>{strings.aboveYouCanGetACommission}:</Typography>
                                    </Grid>
                                    <Grid item>
                                        <TextField 
                                            onChange={
                                                commissionRuleValueHandler(
                                                o.node.id, 
                                                o.node.ratioStrategy, 
                                                o.node.minDescendantsSumOfActionsAmount,
                                                o.node.minDescendantsCount,
                                                o.node.genericRatio
                                            )} 
                                            name="genericRatio"
                                            type="number" variant="outlined" 
                                            margin="dense" 
                                            defaultValue={values[`genericRatio${idx}`] ? values[`genericRatio${idx}`] : o.node.genericRatio}
                                            inputProps={{
                                                min: "1",
                                                step: "1"
                                            }}
                                            style={{ width: 100 }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        {/* <FormControlLabel
                                            value="end"
                                            control={<Checkbox color="primary" />}
                                            label="% (Max 9.9%)"
                                            labelPlacement="end"
                                        /> */}
                                        <Typography> % (最大值 9.9)</Typography>
                                    </Grid>
                                </Fragment>
                            }

                            <Grid item>
                                <Button variant='contained' color='primary' onClick={addCommissionRule}>{strings.increase}</Button>
                            </Grid>
                            {
                                idx === 0 ?
                                null
                                :
                                <Grid item>
                                    <Button variant='contained' onClick={() => deleteCommissionRule(o.node.id)} style={{ backgroundColor: 'red', color: 'white' }}>{strings.delete}</Button>
                                </Grid>
                            }
                        </Grid>
                 </Fragment>)
                })}
            </Grid>

            <Grid style={{paddingTop: 30, paddingRight: 50, marginBottom: 30}} justify="center" container>
                <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={updateCommission}>{strings.save}</Button>
                <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={() => history.goBack()}>{strings.return}</Button>
            </Grid>

        <FirstModal 
            agentLine={agentLine}
            commissionAgentsProfile={commissionAgentsProfile}
            open={modalOpen.firstModal}
            setOpen={setModalOpen}
        />
        <SecondModal 
            commissionGame={commissionGame} 
            commissionGameVendor={commissionGameVendor}
            setCommissionGameVendor={setCommissionGameVendor}
            updateCommissionVendors={updateCommissionVendors}
            open={modalOpen.secondModal} 
            setOpen={setModalOpen}
        />
        {
            (commissionRuleId != null) ?
            <ThirdModal
                id={id}
                mutate={mutate}
                setMutate={setMutate}
                commissionRuleId={commissionRuleId}
                dataValue={dataValue}
                commissionGameTypeVendors={commissionGameTypeVendors}
                disabled={disabled}
                setDisabled={setDisabled}
                updateCommissionRatios={updateCommissionRatios}
                open={modalOpen.thirdModal} 
                setOpen={setModalOpen}
            />
            :
            null
        }
        {/* <ThirdModal
            id={id}
            mutate={mutate}
            commissionRuleId={commissionRuleId}
            dataValue={dataValue}
            updateCommissionRatios={updateCommissionRatios}
            open={modalOpen.thirdModal} 
            setOpen={setModalOpen}
        /> */}
        </Paper>
    </Grid>

}