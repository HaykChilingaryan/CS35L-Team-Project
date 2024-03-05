import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./CalendarView.css";

const CalendarView = () => {
  useEffect(() => {
    const daysTag = document.querySelector(".calendar-dates");
    const currentDate = document.querySelector(".calendar-current-date");
    const prevNextIcon = document.querySelectorAll(".calendar-navigation span");

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const manipulate = () => {
      let dayone = new Date(year, month, 1).getDay();
      let lastdate = new Date(year, month + 1, 0).getDate();
      let dayend = new Date(year, month, lastdate).getDay();
      let monthlastdate = new Date(year, month, 0).getDate();
      let lit = "";
      // adds dates of last month
      for (let i = dayone; i > 0; i--) {
        lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
      }
      // add current month dates
      for (let i = 1; i <= lastdate; i++) {
        let isToday =
          i === date.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
            ? "active"
            : "";
        lit += `<li class="${isToday}" id="date-${i}">${i}</li>`;
      }
      // add first dates of the next month
      for (let i = dayend; i < 6; i++) {
        lit += `<li class="inactive">${i - dayend + 1}</li>`;
      }
      currentDate.innerText = `${months[month]} ${year}`;
      daysTag.innerHTML = lit;

      // add click event listeners to each date
      const dateElements = document.querySelectorAll(".calendar-dates li");
      dateElements.forEach((dateElement) => {
        dateElement.addEventListener("click", () => {
          const date = dateElement.innerText;
          alert(`Popup for date ${months[month]} ${date}`);
        });
      });
    };

    manipulate();

    // click event listener for each icon
    prevNextIcon.forEach((icon) => {
      // when click
      icon.addEventListener("click", () => {
        // check if "calendar-prev" or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;
        // check for going to diff year
        if (month < 0 || month > 11) {
          // set new date to first day of next year
          date = new Date(year, month, new Date().getDate());
          // set new year
          year = date.getFullYear();
          // set new month
          month = date.getMonth();
        } else {
          // set curr date
          date = new Date();
        }
        // update calendar display
        manipulate();
      });
    });
  }, []);

  return (
    <body>
      <div
        className="card bg-white text-black"
        style={{
          background: "#fff",
          width: "90vw",
          height: "90vh",
          boxShadow: "0 15px 40px rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "30px",
        }}
      >
        <header
          className="calendar-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "25px 30px 10px",
            justifyContent: "space-between",
          }}
        >
          <p className="calendar-current-date"></p>
          <div className="calendar-navigation">
            <span id="calendar-prev" className="material-symbols-rounded">
              &lt;
            </span>
            <span id="calendar-next" className="material-symbols-rounded">
              &gt;
            </span>
          </div>
        </header>
        <div className="calendar-body">
          <ul className="calendar-weekdays">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="calendar-dates"></ul>
        </div>
      </div>
    </body>
  );
};

export default CalendarView;
