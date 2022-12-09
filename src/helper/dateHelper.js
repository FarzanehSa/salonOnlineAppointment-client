const today = new Date();

// ✅ Reset a Date's time to midnight
today.setHours(0, 0, 0, 0);

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getTodayNum = function(date) {
  const dayName = date.toString().split(' ')[0];
  return (week.indexOf(dayName) + 1);
}

const getWeekNum = function(date) {
  const diff = (date.getTime()  - today.getTime()) / (1000*60*60*24);
  const weekNum = Math.floor(Math.abs(diff + getTodayNum(today) - 1) / 7);
  return weekNum;
}

function calDate(dayNum, date, weekNum) {
  date.setHours(0, 0, 0, 0);
  // const weekNum = getWeekNum(date);
  // console.log(weekNum);
  const myDate = new Date(today);
  const num = (myDate.getDate());
  const todayNum = getTodayNum(myDate);
  myDate.setDate(num + (dayNum - todayNum) + (7 * weekNum));
  // console.log(date,'num',num, 'dayNum', dayNum, 'todayNum', todayNum , 'weekNum', weekNum);
  // console.log(myDate);
  return myDate;
}

// ✅ Format a date to YYYY-MM-DD (or any other format)
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

function getMonthName(date) {
  return (months[date.getMonth()]);
}

// 👇️ 2022-01-18 (yyyy-mm-dd)
// console.log(formatDate(new Date()));

//  👇️️ 2025-05-09 (yyyy-mm-dd)
// console.log(formatDate(new Date(2025, 4, 9)));

module.exports = {getWeekNum, calDate, formatDate, getMonthName};