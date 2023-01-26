import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useContext } from "react";
import { AnswerContext } from "./AnswerContext";
import { getTimeDifference } from "../../lib/getTimeDifference";

const StopWatch = ({ dateStarted, hasSubmitted }) => {

    const { hasStarted } = useContext(AnswerContext)
    const [time, setTime] = useState({ s: 0, m: 0, h: 0 });
    const [customInterval, setCustomInterval] = useState();
    // eslint-disable-next-line no-unused-vars
    const [_, setStatus] = useState('Not Started');

    const calculateElapsedTime = () => {
        const now = dayjs()
        setTime({...getTimeDifference(dateStarted, now)})
    }

    const start = () => {
        calculateElapsedTime()
        setStatus('Started')
        setCustomInterval(setInterval(calculateElapsedTime, 10))
    }

    const stop = () => {
        clearInterval(customInterval)
        setStatus('Stopped')
    }

    useEffect(() => {
        if (hasSubmitted) {
            stop()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasSubmitted])


    useEffect(() => {
        if (hasStarted) {
            start()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasStarted])

    return (
        <div className="text-white">
            <span><i className="bi bi-stopwatch me-2"></i></span>
            <span>{(time.h >= 10) ? time.h : "0" + time.h} : </span>
            <span>{(time.m >= 10) ? time.m : "0" + time?.m} : </span>
            <span>{(time.s >= 10) ? time.s : "0" + time.s} </span>
        </div>
    );
}

export default StopWatch;