/**
 * 
 *  section = [
 *       {
 *         "acronym": "HR",
 *          "id": 6,
 *         "options": {
 *            "Yes": 1,
 *            "No": 0
 *         },
 *         "section": "physical",
 *         "text_option": "the question?"
 *       }
 *   ]
**/

const PhysicalSection = ({ section, handleOptionChange }) => {

    // console.log(section)
    return (
        <div>
            {
                section.map((question, ndx) => (
                    <div className="my-0 py-2" key={question.id}>
                        <p className="card-text w-100 text-start" style={{ "maxWidth": "100%" }}>
                            <span className="me-4">{ndx + 1}.</span>
                            {question.text_option}
                        </p>

                        {
                            Object.keys(question.options).map((key, index) => (
                                <div className="ms-4" key={index}>
                                    <div className="form-check text-start ms-4">
                                        <input id={`question${question.id}-option${index}`} type="radio" className="form-check-input physical" value={question.options[key]} name={question.acronym} onChange={(e) => {handleOptionChange(e, 'physical', `${ndx + 1}`, question.text_option, key, null)}} required />
                                        <label htmlFor={`question${question.id}-option${index}`} className="form-check-label">{key}</label>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default PhysicalSection;