/* eslint-disable jsx-a11y/anchor-is-valid */
import WizardContent from "./wizardContent";
import ScreeningResult from "./screeningResult";
import { useState, useEffect, useContext } from "react";
import Api from "../../services/api";
import { parseQuestions } from "../../lib/parseAssessmentQuestions";
import { AnswerContext } from "./AnswerContext"; // not exported as default
import AuthContext from "../../auth/AuthContext"; // exported as default
import ServerError from "../serverError";
import StopWatch from "./stopWatch";
import dayjs from "dayjs";

const ScreeningWizard = () => {

    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [mustShowResult, setMustShowResult] = useState(false)
    const [totalQuestions, setTotalQuestions] = useState(0)
    const [totalAnswered, setTotalAnswered] = useState({
        'demographic': 0,
        'emotional': 0,
        'physical': 0,
        'LSAS': 0,
        'SPIN': 0
    })
    const [shouldEnableSubmit, setShouldEnableSubmit] = useState(false)
    const [sections, setSections] = useState({})
    const { answers, setAnswers, patientSelected, dateStarted, setShowDialog, setHasStarted } = useContext(AnswerContext)
    const [dateEnded, setDateEnded] = useState('')
    const { user } = useContext(AuthContext)
    const [classification, setClassification] = useState(null)
    const [classProbability, setClassProbability] = useState(null)
    const [hasErrorForAssessmentQuestions, setHasErrorForAssessmentQuestions] = useState(false)
    const [hasErrorWhileSubmitting, setHasErrorWhileSubmitting] = useState(false)
    const [additionalInfo, setAdditionalInfo] = useState({
        'demographic': [],
        'emotional': [],
        'physical': [],
        'LSAS': [],
        'SPIN': []
    })

    useEffect(() => {

        // fetch assessment questions
        Api().get("/get-assessment-questions")
            .then(res => {

                if (res.status === 200) {
                    const parsedQuestions = parseQuestions(res.data)
                    setSections(parsedQuestions)

                    // LSAS has 24 situations but each situation has 2 questions
                    // SPIN has 17 situations
                    // demographic has 5 questions
                    // emotional has 8 questions
                    // physical has 13 questions
                    const total = (parsedQuestions['LSAS'].length * 2) + parsedQuestions['SPIN'].length + parsedQuestions['demographic'].length + parsedQuestions['emotional'].length + parsedQuestions['physical'].length
                    setTotalQuestions(total)
                    setHasErrorForAssessmentQuestions(false)
                } else {
                    setHasErrorForAssessmentQuestions(true)
                }
            })
            .catch(err => {
                console.log('There seems to be an error while fetching the assessment questions')
                console.log(err)
                setHasErrorForAssessmentQuestions(true)
            })
    }, []);

    const saveToAdditionalInfoState = (section, number, question, key, type) => {

        // Add the new change - results to duplication of answers 
        // in a question if the user changes the answer
        const addl = {
            ...additionalInfo,
            [section]: [
                ...additionalInfo[section],
                { number, question, answer: key, type }
            ]
        }

        // Remove the duplicated answers
        const newSection = [
            ...new Map(addl[section].map(item => [item['number'], item])).values()
        ]
        addl[section] = newSection.sort((a, b) => ((a.number > b.number) ? 1 :
            ((b.number > a.number) ? -1 : 0)))
        setAdditionalInfo({ ...addl })
    }

    const handleOptionChange = (e, section, number, question, key, type = null) => {

        const ageInput = document.getElementById('age')
        let currentTotalAnswered = { ...totalAnswered }

        let totalChecks = 0
        if (section === 'demographic') {
            if (ageInput.value !== '') {
                totalChecks += 1
            }
        }

        const radios = document.getElementsByClassName(`form-check-input ${section}`)
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                totalChecks += 1
            }
        }

        currentTotalAnswered = {
            ...currentTotalAnswered,
            [section]: totalChecks
        }

        setTotalAnswered(currentTotalAnswered)
        saveToAdditionalInfoState(section, number, question, key, type)
        setAnswers({ ...answers, [e.target.name]: Number(e.target.value) })

        const total = Object.keys(currentTotalAnswered).reduce((prev, section) => {
            return prev + currentTotalAnswered[section]
        }, 0)
        if (totalQuestions === total)
            setShouldEnableSubmit(true)
        else
            setShouldEnableSubmit(false)
    }

    const handleStartAndEndDate = () => {
        const dateStartedFormatted = dayjs(dateStarted).format('YYYY-MM-DD HH:mm:ss')
        const dateEndedFormatted = dayjs().format('YYYY-MM-DD HH:mm:ss')
        setDateEnded(dateEndedFormatted)

        return { date_started: dateStartedFormatted, date_ended: dateEndedFormatted }
    }

    const handleSubmit = () => {

        setHasSubmitted(true)
        // Allows the stop watch to stop
        setHasStarted(false)
        const { date_started, date_ended } = handleStartAndEndDate()

        // Post the answers for the screening assessment	
        Api().post("/submit-answers", {
            data: answers, patient: patientSelected,
            assessor: user, dateStarted: date_started,
            additionalInfo, dateEnded: date_ended
        }, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                if (res.status === 200) {
                    setClassification(res.data.classification)
                    setClassProbability(res.data.probability)
                    setHasErrorWhileSubmitting(false)
                } else {
                    // show an alert message
                    console.log('Submission failed')
                    setHasErrorWhileSubmitting(true)
                }
            })
            .catch(err => {
                // show an alert message
                console.log('There seems to be an error while sending the answers to the server')
                setHasErrorWhileSubmitting(true)
            })

        setTimeout(() => {
            setHasSubmitted(false)
            setMustShowResult(true)
        }, 2000);

        setShowDialog(false)
        localStorage.removeItem('inProgress')
        window.onbeforeunload = null
    }

    const handleReturn = () => {
        setTimeout(() => {
            setDateEnded('')
            setMustShowResult(false)
            setShouldEnableSubmit(false)
            setTotalAnswered({
                'demographic': 0,
                'emotional': 0,
                'physical': 0,
                'LSAS': 0,
                'SPIN': 0
            })
        }, 1000)
    }

    const scrollToTop = () => {
        const section = document.getElementById('section-indicators')
        section.scrollTo({ top: 0, behavior: 'smooth' })
    }


    return (
        <>
            <div className="modal fade" id="screening-wizard-modal" aria-hidden="true" aria-labelledby="static-screening-wizard-modal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content position-relative">

                        <div className="modal-header bg-primary">
                            <h5 className="text-light mb-0">Assessment</h5>
                            {!dateEnded && <StopWatch dateStarted={dateStarted} hasSubmitted={hasSubmitted}></StopWatch>}
                        </div>
                        <div className="modal-body p-0">
                            {
                                (hasErrorForAssessmentQuestions && <ServerError></ServerError>) || (Object.keys(sections).length !== 0 &&
                                    !mustShowResult && <WizardContent sections={sections} handleOptionChange={handleOptionChange} totalAnswered={totalAnswered}></WizardContent>)
                            }

                            {
                                // Check first if data has been fetched
                                Object.keys(sections).length !== 0 &&
                                mustShowResult && <ScreeningResult hasErrorWhileSubmitting={hasErrorWhileSubmitting} additionalInfo={additionalInfo} classification={classification} classProbability={classProbability} patientSelected={patientSelected} dateStarted={dateStarted} dateEnded={dateEnded}></ScreeningResult>
                            }
                        </div>

                        {/* Scroll: Arrow up */}
                        {mustShowResult === false && (
                            <div className="position-absolute" style={{ 'left': '92%', 'top': '82%' }} onClick={scrollToTop}>
                                <span className="fs-4 text-primary" role="button"><i className="bi bi-arrow-up-circle"></i></span>
                            </div>)}

                        <div className="modal-footer">
                            {!mustShowResult &&
                                <button type="submit" className={`btn btn-primary ${shouldEnableSubmit ? '' : 'disabled'}`} onClick={handleSubmit}>
                                    <span className={`spinner-border spinner-border-sm me-2 ${hasSubmitted ? 'disabled' : 'd-none'}`} role="status" aria-hidden="true"></span>
                                    {!hasSubmitted && 'Submit Answers'}
                                    {hasSubmitted && 'Submitting Answers...'}
                                </button>}

              {mustShowResult && (
                <button
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleReturn}
                >
                  Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreeningWizard;
