import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown } from "react-icons/fa";

const DateButtonWithPicker = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const month = date.toLocaleString("default", { month: "long" }); // June
    const weekday = date.toLocaleString("default", { weekday: "short" }); // Tue
    const day = date.getDate();

    const getSuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${weekday} ${day}${getSuffix(day)}`;
  };

  const handleChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // trigger parent callback
  };

  return (
    <div style={{ display: "inline-block" }}>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={new Date()} // ✅ Disable past dates
        customInput={
        <button
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#fff",
      border: "1.5px solid #f97316",
      borderRadius: "25px",
      color: "#f97316",
      cursor: "pointer",
      padding: "8px 14px",
      transition: "all 0.3s ease",
      justifyContent: "flex-start", // align content to left
    }}
    className="date-btn"
  >
    <span style={{ marginLeft: "-4px" }}>{formatDate(selectedDate)}</span>
    {/* Uncomment if you want the icon */}
    {/* <FaChevronDown style={{ fontSize: "10px", marginLeft: "auto" }} /> */}
  </button>
        }
      />
    </div>
  );
};

export default DateButtonWithPicker;
