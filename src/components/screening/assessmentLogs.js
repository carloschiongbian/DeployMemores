import { useState } from "react"

const AssessmentLogs = ({additionalInfo}) => {

    const transformAdditionalInfo = (info) => {
        const newInfo = {...info}
        const merged = {}

        newInfo?.LSAS.forEach(item => {
            let normalizedKey = item.number.replaceAll(/\D/g, '')
            if (!merged[normalizedKey]) {
                merged[normalizedKey] = {
                    number: normalizedKey,
                    question: item.question,
                    answers: []
                }
            }
            merged[normalizedKey].answers.push(item.answer)
        })

        newInfo.LSAS = [...new Map(Object.entries(merged)).values()]
        return {...newInfo}
    }
    const [logs] = useState(transformAdditionalInfo(additionalInfo));

    return (

        <div className="accordion mb-4" id="accordion">

            {/* Section 1: Demographic */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button collapsed py-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Section 1: Demographic
                    </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordion">
                    <div className="accordion-body">
                        <table className="table table-bordered border-primary fs-7">
                            <thead>
                                <tr>
                                    <td style={{ "width": "60%" }}>Questions</td>
                                    <td style={{ "width": "40%" }}>Patient's Answers</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs?.demographic.map(info => (
                                        <tr key={info.number}>
                                            <td style={{ "width": "70%" }}>{info?.question}</td>
                                            <td style={{ "width": "30%" }}>{info?.answer}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 2: Emotional Symptoms */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed py-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Section 2: Emotional Symptoms
                    </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordion">
                    <div className="accordion-body">
                        <table className="table table-bordered border-primary fs-7">
                            <thead>
                                <tr>
                                    <td style={{ "width": "60%" }}>Questions</td>
                                    <td style={{ "width": "40%" }}>Patient's Answers</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs?.emotional.map(info => (
                                        <tr key={info.number}>
                                            <td style={{ "width": "70%" }}>{info?.question}</td>
                                            <td style={{ "width": "30%" }}>{info?.answer}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 3: Physical Symptoms */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed py-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Section 3: Physical Symptoms
                    </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordion">
                    <div className="accordion-body">
                        <table className="table table-bordered border-primary fs-7">
                            <thead>
                                <tr>
                                    <td style={{ "width": "60%" }}>Questions</td>
                                    <td style={{ "width": "40%" }}>Patient's Answers</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs?.physical.map(info => (
                                        <tr key={info.number}>
                                            <td style={{ "width": "70%" }}>{info?.question}</td>
                                            <td style={{ "width": "30%" }}>{info?.answer}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 4: LSAS */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingFour">
                    <button className="accordion-button collapsed py-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                        Section 4: Liebowitz Social Anxiety Scale
                    </button>
                </h2>
                <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordion">
                    <div className="accordion-body">
                        <table className="table table-bordered border-primary fs-7">
                            <thead>
                                <tr>
                                    <td valign="middle" rowSpan={2} style={{ "width": "70%" }}>Questions</td>
                                    <td colSpan={3} className="text-center" style={{ "width": "30%" }}>Patient's Answers</td>
                                </tr>
                                <tr>
                                    <td className="text-center" style={{ "width": "15%" }}>Fear</td>
                                    <td className="text-center" style={{ "width": "15%" }}>Avoidance</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs?.LSAS.map(info => (
                                        <tr key={info.number}>
                                            <td style={{ "width": "70%" }}>{info.question}</td>
                                            <td>{info.answers[0]}</td>
                                            <td>{info.answers[1]}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Section 5: SPIN */}
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingFive">
                    <button className="accordion-button collapsed py-2 fs-7" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                        Section 5: Social Phobia Inventory
                    </button>
                </h2>
                <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordion">
                    <div className="accordion-body">
                        <table className="table table-bordered border-primary fs-7">
                            <thead>
                                <tr>
                                    <td style={{ "width": "60%" }}>Questions</td>
                                    <td style={{ "width": "40%" }}>Patient's Answers</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    logs?.SPIN.map(info => (
                                        <tr key={info.number}>
                                            <td style={{ "width": "70%" }}>{info?.question}</td>
                                            <td style={{ "width": "30%" }}>{info?.answer}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssessmentLogs;