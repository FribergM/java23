let currentDayIndex = new Date().getDate();
let dayNameIndex = new Date().getDay();

async function fetchWeather(path) {
  const data = await fetch(path)
    .then(response => response.json())

    return data
}

async function renderWeather(dayIndex) {
  const url = "./weather.json";
  const weatherData = await fetchWeather(url);

  console.log(weatherData)

  const todaysDate = new Date();
  const dayName = getDayName(dayNameIndex);
  const currentTime = formatTime(todaysDate);
  const formattedDate = formatDate(todaysDate);
  const currentDay = getCurrentDay(dayIndex);

  const todaysWeather = weatherData['weather_data']
    .filter(elem => {
      const elemDay = elem.date.split('-')[2]; // 2024-09-[12]

      return elemDay === currentDay
    });

  const weatherRange = todaysWeather[0].temperatures.split('-') // [15c]-22c-13c

  const today = document.querySelector('#today');
  const tempratur = document.querySelector('#tempratur');
  
  today.textContent = `${dayName} kl: ${currentTime} (${formattedDate})`;
  
  const currentHour = currentTime.split(':')[0]; // [11]:12

  if (currentHour >= 0 && currentHour <= 10) {
    tempratur.textContent = `Senaste mätning: ${weatherRange[0]}`
  } else if (currentHour >= 10 && currentHour <= 18) {
    tempratur.textContent = `Senaste mätning: ${weatherRange[1]}`
  } else if (currentHour > 18) {
    tempratur.textContent = `Senaste mätning: ${weatherRange[2]}`
  }
}

renderWeather(currentDayIndex, dayNameIndex)

function getCurrentDay(dayIndex) {
  return String(dayIndex).padStart(2, '0')
}

function getDayName(dayIndex) {
  const days = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
  return days[dayIndex];
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDate(date) {
  const month = date.getMonth() + 1; // Months are zero-based
  return `${currentDayIndex}/${month}`;
}

const button = document.querySelector('#button-next')
button.addEventListener('click', handleClick)

function handleClick() {
  currentDayIndex++
  dayNameIndex++
  if (currentDayIndex > 31) currentDayIndex = 1;
  if(dayNameIndex> 6) dayNameIndex = 0;
  renderWeather(currentDayIndex, dayNameIndex);
};
