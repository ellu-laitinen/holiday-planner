import React, { useState } from "react";
import data from "./holidays.json";

const HolidayPlanner = () => {
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });
  const holidays = data.holidays;

  const [daysToUse, setDaysToUse] = useState();
  const [holidaysInRange, setHolidaysInRange] = useState();
  const [weekends, setWeekends] = useState();
  const [dateError, setDateError] = useState();
  const [rangeError, setRangeError] = useState();

  // get chosen dates from inputs, reset errors if there are any
  const changeHandler = (e) => {
    if (dateError) setDateError(false);
    if (rangeError) setRangeError(false);
    setDates({
      ...dates,
      [e.target.name]: e.target.value,
    });
  };

  // calculate total amount of days in time span
  const timeSpan = new Date(dates.endDate) - new Date(dates.startDate);
  const differenceInDays = timeSpan / (1000 * 3600 * 24) + 1;
  console.log("%c difference", "color:green", differenceInDays);

  // turn holiday date strings into dates
  const holidayDates = holidays.map((d) => new Date(d));

  // check if and how many national holidays fall within the chosen time span
  const checkNationalHolidays = () => {
    const newArr = [];
    for (let i = 0; i < holidayDates.length; i++) {
      if (
        holidayDates[i] >= new Date(dates.startDate) &&
        holidayDates[i] <= new Date(dates.endDate)
      ) {
        newArr.push(holidayDates[i]);
      }
    }
    setHolidaysInRange(newArr.length);
  };

  //check how many sundays there are within the chosen time span
  const amountOfWeekends = () => {
    checkRange();
    checkNationalHolidays();
    let sundays = 0;
    if (dates.startDate > dates.endDate) {
      console.log("väärä aloitus/lopetus");
      setDateError(true);
    } else {
      for (
        let i = new Date(dates.startDate);
        i <= new Date(dates.endDate);
        i.setDate(i.getDate() + 1)
      ) {
        if (i.getDay() == 0) sundays++;
      }
    }
    setWeekends(sundays);
  };

  const calculateDays = () => {
    amountOfWeekends();
    setDaysToUse(differenceInDays - holidaysInRange - weekends);
  };

  //check if time span in in the allowed range
  const checkRange = () => {
    const startMonth = new Date(dates.startDate).getMonth() + 1;
    const endMonth = new Date(dates.endDate).getMonth() + 1;
    if (startMonth < 4 && endMonth >= 4) {
      setRangeError(true);
    }
  };

  return (
    <div>
      <h1>Holiday Planner</h1>
      <label>Holiday starts</label>
      <input
        name="startDate"
        type="date"
        onChange={(e) => changeHandler(e)}
      ></input>
      <label>Holiday ends</label>
      <input
        name="endDate"
        type="date"
        onChange={(e) => changeHandler(e)}
      ></input>

      <button onClick={() => calculateDays()}>Calculate days</button>
      <div style={{ color: "red" }}>
        {differenceInDays > 50 && (
          <p>Maximum length of time span is 50 days!</p>
        )}
      </div>
      {daysToUse && !dateError && !rangeError && (
        <div>
          <p>
            This time span will consume <b>{daysToUse}</b> holiday days
          </p>
        </div>
      )}
      {dateError && (
        <div style={{ color: "red" }}>
          <p>End date can't be earlier than start date</p>
        </div>
      )}
      {rangeError && (
        <div style={{ color: "red" }}>
          <p>Time span must be between April 1st and March 31st</p>
        </div>
      )}
    </div>
  );
};

export default HolidayPlanner;
