import { useState } from "react";
import AssessmentLogs from "./assessmentLogs";
import ServerError from "../serverError";
import { getTimeDifference } from "../../lib/getTimeDifference";
import TableResult from "./tableResult";


const ScreeningResult = ({
  hasErrorWhileSubmitting,
  additionalInfo,
  classification,
  classProbability,
  patientSelected,
  dateStarted,
  dateEnded
}) => {
  

  const [showAssessmentLogs, setShowAssessmentLogs] = useState(false);
  const formatTime = () => {
    const elapsedTime = {...getTimeDifference(dateStarted, dateEnded)}

    let text = ''
    if (elapsedTime.h === 0) {
      text += ''
    } else if (elapsedTime.h === 1) {
      text += '1 hour '
    } else {
      text += `${elapsedTime.h} hours `
    }

    if (elapsedTime.m === 0) {
      text += ''
    } else if (elapsedTime.m === 1) {
      text += '1 minute '
    } else {
      text += `${elapsedTime.m} minutes `
    }

    if (elapsedTime.s === 0) {
      text += ''
    } else if (elapsedTime.s === 1) {
      text += '1 second '
    } else {
      text += `${elapsedTime.s} seconds`
    }

    return text
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold">Screening Result</h4>

      {
        (hasErrorWhileSubmitting && <ServerError></ServerError>) || (
          <>
            
            <TableResult classification={classification} classProbability={Number(classProbability) * 100} fullname={patientSelected.fullname}></TableResult>

            {/* Additional Info */}
            <p className="px-4 link-primary pt-3 d-inline-block" role="button" onClick={() => { setShowAssessmentLogs(value => !value) }}><i className={`bi  ${showAssessmentLogs ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} me-2`}></i><span className="text-decoration-underline">{showAssessmentLogs ? 'Hide' : 'Show'} Assessment Logs</span></p>
            <div className={`px-4 ${showAssessmentLogs ? 'd-block' : 'd-none'}`}>
              <p className="fs-7 ms-2"><span className="fw-bold">Elapsed Time:</span> {formatTime()}</p>
              <AssessmentLogs additionalInfo={additionalInfo}></AssessmentLogs>
            </div>
          </>
        )
      }
    </div>
  );
};

export default ScreeningResult;
