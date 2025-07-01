import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown } from 'react-icons/fa';

const DateButtonWithPicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const month = date.toLocaleString("default", { month: "long" }); // June
    const weekday = date.toLocaleString("default", { weekday: "short" }); // Tue
    const day = date.getDate();

    const getSuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${month} ${weekday} ${day}${getSuffix(day)}`;
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // trigger parent callback
  };

  return (
    <div>
      <DatePicker style={{marginLeft:"10px"}}
        selected={selectedDate}
        onChange={handleChange}
        minDate={new Date()} // ✅ Disable past dates
        customInput={
          <button
            style={{
              padding: "10px 16px",
              fontSize: "16px",
              backgroundColor: "#effafa",
              border: "1px solid  #1e90ff",
              borderRadius: "20px",
              color: "#1e90ff",
              cursor: "pointer",
            }}
          >
            {formatDate(selectedDate)}
            <FaChevronDown style={{marginLeft:"5px"}} />
          </button>
        }
      />
    </div>
  );
};

export default DateButtonWithPicker;
