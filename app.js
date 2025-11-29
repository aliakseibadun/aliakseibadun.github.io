let current = new Date();
let selectedWeeks = JSON.parse(localStorage.getItem("weeks") || "{}");

function render() {
  document.getElementById("title").innerText =
    current.toLocaleString("ru", { month: "long", year: "numeric" });
  let container = document.getElementById("calendars");
  container.innerHTML = "";
  for (let i = 0; i < 2; i++) {
    let d = new Date(current.getFullYear(), current.getMonth() + i, 1);
    container.innerHTML += makeCalendar(d);
  }
}

function makeCalendar(date) {
  let year = date.getFullYear(), month = date.getMonth();
  let first = new Date(year, month, 1);
  let last = new Date(year, month + 1, 0);

  let html = `<div class='month'><h3>${date.toLocaleString("ru", { month: "long", year: "numeric" })}</h3>`;
  html += "<table><tr><th>№</th><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>";

  // compute start = Monday of the week containing the 1st
  let start = new Date(first);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  // render rows while the week's start is <= last day of month
  let rowStart = new Date(start);
  while (rowStart <= last) {
    let weekNum = getWeekNumber(rowStart);
    let key = year + "-" + month + "-" + weekNum;
    let isSel = selectedWeeks[key];

    html += `<tr class='${isSel ? "selected" : ""}' onclick='toggle("${key}")'>`;
    html += `<td class='weeknum'>${weekNum}</td>`;
    for (let d = 0; d < 7; d++) {
      let day = new Date(rowStart);
      day.setDate(rowStart.getDate() + d);
      let cls = "";
      let today = new Date();
      if (day.toDateString() == today.toDateString()) cls = "today";
      html += `<td class='${cls}'>${day.getMonth() == month ? day.getDate() : ""}</td>`;
    }
    html += "</tr>";
    rowStart.setDate(rowStart.getDate() + 7);
  }

  html += "</table></div>";
  return html;
}

function getWeekNumber(d) {
  let temp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  let dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  let yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  return Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
}

function toggle(k) {
  selectedWeeks[k] = !selectedWeeks[k];
  localStorage.setItem("weeks", JSON.stringify(selectedWeeks));
  render();
}

function prevMonth() { current.setMonth(current.getMonth() - 1); render(); }
function nextMonth() { current.setMonth(current.getMonth() + 1); render(); }

window.onload = () => { render(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js'); };
