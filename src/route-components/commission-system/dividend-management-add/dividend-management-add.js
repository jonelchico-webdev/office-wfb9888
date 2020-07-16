import React, {useState, Fragment} from 'react'
import { makeStyles } from '@material-ui/styles';
import {Title} from '../../../components';
import useLanguages from '../../../hooks/use-languages';
import { DIVIDEND_MANAGEMENT, COMMISSION_MANAGEMENT_ADD } from '../../../paths';
import { Radio, RadioGroup, FormControl,  
    FormControlLabel, Paper, Grid, Button, Typography, 
    TextField, MenuItem

} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
// import FirstModal from './first-modal'
// import SecondModal from './second-modal'
// import ThirdModal from './third-modal'
import FirstModal from '../modal-add/first-modal'
import SecondModal from '../modal-add/second-modal'
import ThirdModal from '../modal-add/third-modal'

import { useMutation } from '@apollo/react-hooks'
import { ADD_COMMISSION, ADD_COMMISSION_RULE } from '../../../queries-graphql/commission-system/mutation/commission-add-mutation'
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

export default function DividendAdd(props) {
    const classes = useStyles();
    const {history} = props
    const strings = useLanguages(COMMISSION_MANAGEMENT_ADD);
    const [modalOpen, setModalOpen] = useState({
        firstModal: false,
        secondModal: false,
        thirdModal: false
    })
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [agentLine] = useState([])
    const [commissionGame] = useState([])
    const [commissionGameVendor, setCommissionGameVendor] = useState([])
    const [id, setId] = useState("")
    const [mutate, setMutate] = useState(false)
    const [rows] = useState(["First"])
    const dataValue = []
    const [values, setValues] = useState({
        commissionName: "",
        payPeriod: "",
        commissionType: "",
        effectiveBet: null,
        effectiveRecharge: null,
        issuanceMethod: "",
        affiliateProfiles: agentLine,
        commissionGameVendor: commissionGameVendor,
        dataValues: dataValue
    })

    const handleChange = (event) => {
        event.persist();
        if(values[event.target.name] && event.target.value > 99 ) {
            event.target.value = 99
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }))
    }

    const handleChangeNumber = (event) => {
        event.persist();
        // if(values[event.target.name] && event.target.value > 99 ) {
        //     event.target.value = 99
        // }
        if(values[event.target.name] && event.target.value < 1) {
            event.target.value = 0
        }
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value
        }))
    }

    function handleOpenModal(modalValue, modalName) {
        setModalOpen(oldValues => ({
                ...oldValues,
                [modalName]: !modalValue
            })
        )
    }

    // function addRow(idx) {
    //     setRows([...rows, idx])
    // }

    // function remRow(idx){
    //     const currentRows = [...rows]
    //     currentRows.splice(idx, 1)
    //     setRows(currentRows)
    // }

    const [batchMutate, setBatchMutate] = useState(batchMutateDummy)
    let batchMutateArr = []
    const [batchMutateRatio, setBatchMutateRatio] = useState(batchMutateDummy)
    let batchMutateArrRatio = []
    const [commission] = useMutation(ADD_COMMISSION)
    const [commissionGameVendors] = useMutation(gql`${batchMutate}`)
    const [commissionRule] = useMutation(ADD_COMMISSION_RULE)
    const [commissionRuleGameVendorRatio] = useMutation(gql`${batchMutateRatio}`)
    const [nextStep, setNextStep] = useState({
        stepOne: true,
        stepTwo: true,
        stepThree: true
    })

    async function addCommission(event) {
        event.preventDefault()
        setNextStep(oldValues => ({
            ...oldValues,
            stepOne: false
        }))

        // Commission Mutate

        let joinAffiliateProfiles = null
        let affiliateProfilesArr = []
        
        values.affiliateProfiles.map((o) => {
            affiliateProfilesArr.push(`'${o}'`)
        })

        if(affiliateProfilesArr.length !==0) {
            joinAffiliateProfiles = affiliateProfilesArr.join()
        }

        let finalValueAffiliate = "["+joinAffiliateProfiles+"]"

        // End Commission Mutate

        const res = await commission({
            variables: {
                name: values.commissionName,
                payPeriod: values.payPeriod,
                commissionType: values.commissionType,
                issuanceType: values.issuanceMethod,
                minHasBetDescendantCount: values.effectiveBet,
                minHasDepositedDescendantCount: values.effectiveRecharge,
                affiliateProfiles: finalValueAffiliate
            }
        })

        if(res.data) {
            setId(res.data.commission.id)
            swal.fire({
                position: 'center',
                type: 'success',
                title: '第一步完成!',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    async function addCommissionVendors() {
        setNextStep(oldValues => ({
            ...oldValues,
            stepTwo: false
        }))
        const test = await values.commissionGameVendor.map((o, idx) => {
            let num = idx + 1
            batchMutateArr.push(
                `mutation` + num + `:commissionGameTypeVendor(input: {
                    commission:"`+ id + `" ` +
                    `gameType:"` + o.gameTypeID + `" ` +
                    `gameVendor:"` + o.vendorID + `" ` +
                    `enabled:` + true +
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
        })
        setBatchMutate(`mutation{${batchMutateArr.join()}}`)
        if(test) {
            setModalOpen({secondModal: false})
            await commissionGameVendors()
            swal.fire({
                position: 'center',
                type: 'success',
                title: '第二步完成!',
                showConfirmButton: false,
                timer: 1500,
                onClose: () => {
                    setMutate(!mutate)
                }
            })
            // setMutate(!mutate)
        }  
    }

    async function addCommissionRule() {
        // Commission Rule
        const dataRule = await commissionRule({
            variables: {
                commission: id,
                ratioStrategy: values.ratioStrategy0,
                minDescendantsCount: values.ruleBet0,
                minDescendantsSumOfActionsAmount: values.ruleTeam0
            }
        })
        if(dataRule.data.commissionRule.ratioStrategy !== 'generic') {
            values.dataValues.map((o, idx) => {
                let num = idx + 1
                batchMutateArrRatio.push(
                    `mutation` + num + `:commissionRuleGameTypeVendorRatio(input: {
                        commissionGameTypeVendor:"`+ o.gameTypeID + `" ` +
                        `commissionRule:"` + dataRule.data.commissionRule.id + `" ` +
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
            })
            setBatchMutateRatio(`mutation{${batchMutateArrRatio.join()}}`)

            const dataRatio = await commissionRuleGameVendorRatio()
        }
        // END
        swal.fire({
            position: 'center',
            type: 'success',
            title: '增加了佣金规则和供应商比率',
            showConfirmButton: false,
            timer: 1500
        })
        history.push(DIVIDEND_MANAGEMENT)
    }

    return <Grid>
            <Title pageTitle='add dividend' />
                
            <Paper className={classes.root} style={{ marginTop: "20px" }}>
            {/* <Typography variant='h6'>{strings.addEvent}</Typography> */}
            {/* <Divider light={true} style={{ marginTop: "1em", marginBottom: "2em" }}/> */}
            
            <Grid container alignItems="center" spacing={1}>
                <InfoIcon color="primary"/>
                <Typography variant='h6' style={{ marginLeft: "0.5em" }}>{strings.basicInformationConfiguration}</Typography>
            </Grid>

            <form onSubmit={addCommission}>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.commissionName}:</Typography>
                </Grid>
                <Grid item>
                    <TextField required type="text" variant="outlined" margin="dense" name="commissionName" onChange={handleChange} value={values.commissionName}/>
                </Grid>
            </Grid>

            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.statisticalPeriod}:</Typography>
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <RadioGroup aria-label="position" name="position" value={values.payPeriod}  row style={{ marginLeft: 10, marginRight: 10 }} name="payPeriod" onClick={handleChange}>
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
                        <RadioGroup aria-label="position" name="position" value={values.commissionType}  row style={{ marginLeft: 10, marginRight: 10 }} name="commissionType" onClick={handleChange}>
                            <FormControlLabel
                            value="loss"
                            control={<Radio required color="primary" />}
                            label={strings.loss}
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
                        <TextField required type="number" variant="outlined" margin="dense" name="effectiveBet" value={values.effectiveBet} onChange={handleChangeNumber}/>
                    </Grid>
                    <Grid item>
                        <Typography>{strings.effectiveRecharge}:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField required type="number" variant="outlined" margin="dense" name="effectiveRecharge" value={values.effectiveRecharge} onChange={handleChangeNumber}/>
                    </Grid>
            </Grid>
            
            <Grid container spacing={1} direction="row" alignItems="center" style={{ paddingLeft: "2rem" }}>
                <Grid item>
                    <Typography>{strings.distributionMethod}:</Typography>
                </Grid>
                <Grid item>
                    <Grid item>
                        <FormControl component="fieldset">
                            <RadioGroup required aria-label="position" name="position" value={values.issuanceMethod}  row style={{ marginLeft: 10, marginRight: 10 }} name="issuanceMethod" onClick={handleChange}>
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
            
            {
                nextStep.stepOne ? 
                <Grid style={{paddingTop: 30, paddingRight: 50, marginBottom: 30}} justify="center" container>
                    <Typography helperText={"Required to choose atleast one"}>
                    <Button disabled={buttonDisabled} style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" type="submit">{strings.nextStep}</Button>
                    </Typography>
                </Grid>
                :
                null
            }

            </form>

            <Grid hidden={nextStep.stepOne}>

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

            </Grid>

            <Grid hidden={nextStep.stepTwo}>
            
            <Grid container direction="row" alignItems="center" style={{ paddingTop: "2rem", paddingLeft: "2rem" }}>
                {rows.map((o, idx) => {
                    return(<Fragment>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item>
                                <Typography>{strings.teamEffectiveBetting}:</Typography>
                            </Grid>
                            <Grid item>
                                <TextField 
                                    onChange={handleChangeNumber} 
                                    name={`ruleBet${idx}`} 
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
                                    onChange={handleChangeNumber} 
                                    name={`ruleTeam${idx}`} 
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
                                    displayEmpty
                                    select
                                    name={`ratioStrategy${idx}`}
                                    label={strings.ratioStrategy}
                                    className={classes.textFieldSelect}
                                    value={values[`ratioStrategy${idx}`]}
                                    defaultValue="Ratio Strategy"
                                    onChange={handleChange}
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
                                    <MenuItem key={2} value="game_type_vendor">
                                        {strings.gameTypeVendor}
                                    </MenuItem>
                                </TextField>
                            </Grid>

                            {
                                values[`ratioStrategy${idx}`] === 'game_type_vendor' ? 
                                <Fragment>
                                <Grid item>
                                    <Typography>{strings.aboveYouCanGetACommission}:</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant='contained' color='primary' onClick={() => handleOpenModal(modalOpen.thirdModal, 'thirdModal')}>{strings.pleaseChoose}</Button>
                                </Grid>
                                </Fragment>
                                :
                                null
                            }

                            {/* <Grid item>
                                <Button variant='contained' color='primary' onClick={() => addRow(idx)}>{strings.increase}</Button>
                            </Grid>
                            {
                                idx === 0 ?
                                null
                                :
                                <Grid item>
                                    <Button variant='contained' onClick={() => remRow(idx)} style={{ backgroundColor: 'red', color: 'white' }}>{strings.delete}</Button>
                                </Grid>
                            } */}
                        </Grid>
                 </Fragment>)
                })}
            </Grid>

            <Grid style={{paddingTop: 30, paddingRight: 50, marginBottom: 30}} justify="center" container>
                <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={addCommissionRule}>{strings.save}</Button>
                <Button style={{width: 110, marginRight:20, height: 30}} color="primary" variant="contained" onClick={() => history.goBack()}>{strings.return}</Button>
            </Grid>

            </Grid>

        <FirstModal 
            agentLine={agentLine}
            open={modalOpen.firstModal}
            setOpen={setModalOpen}
            setButtonDisabled={setButtonDisabled}
        />
        <SecondModal 
            commissionGame={commissionGame} 
            commissionGameVendor={commissionGameVendor}
            setCommissionGameVendor={setCommissionGameVendor}
            addCommissionVendors={addCommissionVendors}
            open={modalOpen.secondModal} 
            setOpen={setModalOpen}
        />
        <ThirdModal
            id={id}
            mutate={mutate}
            commissionGame={commissionGame} 
            commissionGameVendor={commissionGameVendor}
            setCommissionGameVendor={setCommissionGameVendor}
            dataValue={dataValue}
            open={modalOpen.thirdModal} 
            setOpen={setModalOpen}
        />
        </Paper>
    </Grid>

}