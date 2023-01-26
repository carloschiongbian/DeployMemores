import dayjs from "dayjs"

export const getTimeDifference = (dateStarted, now) => {
    let seconds = dayjs(now).diff(dateStarted, 'second')
                                             // Given: 43320 seconds
    // from seconds, convert to hours
    // min = seconds / 60 (there are 60 seconds in 1 min)
    // hours = min / 60 (there are 60 minutes in 1 hour)
    let h = Math.floor(seconds / 60 / 60)   // 12 hours

    // from seconds, convert to minutes
    // and then get the remaining minutes from hours
    // minutes = seconds / 60 (there are 60 seconds in 1 minute) 
    // remainder = minutes % 60 (there are 60 mins in 1 hour)
    let m = seconds / 60                    // 722 minutes or 12 hours 2 minutes
        m = Math.floor(m % 60)              // 2 minutes

    // from seconds, get the remaining seconds from hours
    // remainder = seconds % 3600 (there are 3600 seconds in 1 hour)
    let s = seconds                         // 43320 seconds or 12 hours 2 minutes or 722 minutes
        s = s % 3600                        // 120 seconds

    // get the actual seconds
    // actual seconds = remaining seconds - (number of seconds in the calculated min)
    if (s >= 60) {
        s = (s - (60 * m))
    }

    return { 'h': h, 'm': m, 's': s }
}