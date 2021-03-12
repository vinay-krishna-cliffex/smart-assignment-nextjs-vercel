export const HandleScheduleDate = (date) => {
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let smonth = date.toLocaleString('en-GB', { month: 'short' });
    let sday = weekday[date.getDay()]
    let sdate = date.getDate();

    return { date: `${sday}, ${smonth} ${sdate}`, timezone: date };
}


export const handleDateFormat = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    //var day2 = date.slice(-2);
    const newDate = `${month}-${day}-${year}`;
    return newDate;
}

export const handleTimeFormat = (time) => {
    const hour = time.slice(0, 2);
    const min = time.slice(2, 4);
    const finalHours = time.slice(0, 2) > 12 ? time.slice(0, 2) - 12 : time.slice(0, 2);
    const ts = hour > 11 ? 'PM' : 'AM';
    const complete_time = `${String(finalHours).padStart(2, '0')}:${min} ${ts}`;
    return complete_time;

}
