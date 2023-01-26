/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef } from "react";
import { useState } from "react";
import DemographicSection from "./demographicSection";
import EmotionalSection from "./emotionalSection";
import LSASSection from "./LSASSection";
import PhysicalSection from "./physicalSection";
import SPINSection from "./SPINSection";



const WizardContent = ({ sections, handleOptionChange, totalAnswered }) => {

    const SECTION_ID = {
        1: "demographic",
        2: "emotional",
        3: "physical",
        4: "LSAS",
        5: "SPIN"
    }

    const CHECKS_NEEDED = {
        "demographic": sections['demographic']?.length || 5,
        "emotional": sections['emotional']?.length || 8,
        "physical": sections['physical']?.length || 13,
        "LSAS": sections['LSAS']?.length * 2 || 48,
        "SPIN": sections['SPIN']?.length || 13
    }

    const [activeSection, setActiveSection] = useState("demographic")
    const [activeSectionID, setActiveSectionID] = useState(1)
    const sectionContent = useRef(null)

    const handleNav = (to) => {
        setActiveSection(SECTION_ID[to])
        setActiveSectionID(to)
        sectionContent.current.scrollTo(0, 0)
    }

    const handlePrev = () => {
        if (activeSectionID <= 1)
            return

        setActiveSection(SECTION_ID[activeSectionID - 1])
        setActiveSectionID((active) => active - 1)

        sectionContent.current.scrollTo(0, 0)
    }

    const handleNext = () => {
        if (activeSectionID >= Object.keys(sections).length)
            return

        setActiveSection(SECTION_ID[activeSectionID + 1])
        setActiveSectionID((active) => active + 1)

        sectionContent.current.scrollTo(0, 0)
    }

    return (
        <div className='wizard d-flex flex-column' style={{ "zIndex": "100000" }}>
            <div className="card text-center w-100">

                {/* Navigation Tabs */}
                <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                        {
                            /**
                             *  sections = {
                             *      LSAS: [],
                             *      SPIN: [],
                             *      demographic: [],
                             *      emotional: [],
                             *      physical: []
                             *  }
                             *  running Object.keys() returns ['LSAS', 'SPIN', 'demographic', 'emotional', 'physical']
                             */
                            Object.keys(sections).map((key, index) => (
                                <li className="nav-item flex-grow-1" key={index}>
                                    <a className={`nav-link ${key === activeSection ? 'active' : ''}`} onClick={() => handleNav(index + 1)} role="button">
                                        <div className="row">
                                            <div className="col d-flex px-1 justify-content-center align-items-center position-relative">
                                                <span className={`badge fs-5 ${key === activeSection ? 'bg-primary' : 'bg-outline-primary'}`}>{index + 1}</span>
                                                {
                                                    (totalAnswered[key] >= CHECKS_NEEDED[key] &&
                                                        <span className="position-absolute bottom-0 end-0 text-success"><i className="bi bi-check-circle-fill"></i></span>) || <span className="position-absolute bottom-0 end-0 text-danger"><i className="bi bi-x-circle-fill"></i></span>
                                                }
                                            </div>
                                            <div className="col text-start">
                                                <p className={`fs-6 mb-0 fw-bold ${key === activeSection ? 'text-primary' : ''}`}>Section</p>
                                                <p className={`fs-7 mb-0 ${key === activeSection ? 'fw-bold text-secondary' : 'text-dark'}`}>{key}</p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {/* Content */}
                <div ref={sectionContent} id="section-indicators" className="card-body py-4 wizard-content custom-scroll">

                    <div className={`${'demographic' === activeSection ? 'd-block' : 'd-none'}`} >
                        <DemographicSection section={sections.demographic} handleOptionChange={handleOptionChange}></DemographicSection>
                    </div>

                    <div className={`${'emotional' === activeSection ? 'd-block' : 'd-none'}`}>
                        <EmotionalSection section={sections.emotional} handleOptionChange={handleOptionChange}></EmotionalSection>
                    </div>

                    <div className={`${'physical' === activeSection ? 'd-block' : 'd-none'}`} >
                        <PhysicalSection section={sections.physical} handleOptionChange={handleOptionChange}></PhysicalSection>
                    </div>

                    <div className={`${'LSAS' === activeSection ? 'd-block' : 'd-none'}`}>
                        <LSASSection section={sections.LSAS} handleOptionChange={handleOptionChange}></LSASSection>
                    </div>

                    <div className={`${'SPIN' === activeSection ? 'd-block' : 'd-none'}`}>
                        <SPINSection section={sections.SPIN} handleOptionChange={handleOptionChange}></SPINSection>
                    </div>

                    <div className="d-flex justify-content-around mt-4">
                        <button className={`btn text-primary ${activeSectionID === 1 ? 'disabled' : ''}`} type="button" onClick={handlePrev}>
                            <i className="bi bi-chevron-double-left"></i> Previous Items
                        </button>

                        <button className={`btn text-primary ${activeSectionID === Object.keys(sections).length || totalAnswered < CHECKS_NEEDED[activeSection] ? 'disabled' : ''}`} type="button" onClick={handleNext}>
                            Next Items <i className="bi bi-chevron-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WizardContent;