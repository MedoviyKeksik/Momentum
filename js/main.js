// DOM Elements
const time = document.getElementById('time'),
	greeting = document.getElementById('greeting'),
	name = document.getElementById('name'),
	focus = document.getElementById('focus'),
	quote = document.getElementById('quote'),
	btnBackground = document.getElementById('background-change'),
	btnQuote = document.getElementById('quote-change'),
	temperature = document.getElementById('temperature'),
	city = document.getElementById('city'),
	weatherIcon = document.getElementById('weather-icon'),
	weatherDescription = document.getElementById('description');


function randRange(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function genDayBackgroundList() {
	let result = []
	let dayTime = ['night', 'morning', 'day', 'evening'];
	for (let j = 0; j < 4; j++) {
		for (let i = 0; i < 6; i++) {
			result.push('img/' + dayTime[j] + '/' + addZero(randRange(1, 21)) + '.jpg');
		}
	}
	return result;
}

// Show Time
function showTime() {
	let today = new Date;
	let weekday = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	let month = [
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
		"December"
	];
	let timestring = 
		weekday[today.getDay()] + ' ' + // Weekday
		month[today.getMonth()] + ' ' + // Month
		today.getDate() + ' ' + // Day
		today.getFullYear() + '<br>' + // Year
		today.getHours() + ':' + // Hours
		addZero(today.getMinutes()) + ':' + // Minutes
		addZero(today.getSeconds()); // Secs

	// Output Time
	time.innerHTML = `${timestring}`;

	setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
	return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function UpdateGreet() {
	let today = new Date(),
		hour = today.getHours();
	if (hour < 6) {
		// Night
		greeting.textContent = 'Good Night';
	} else if (hour < 12) {
		// Morning
		greeting.textContent = 'Good Morning';	
	} else if (hour < 18) {
		// Afternoon
		greeting.textContent = 'Good Afternoon';			
	} else {
		// Evening
		greeting.textContent = 'Good Evening';
	}
}

// Set Background and Greeting
function setBgGreet() {
	let today = new Date(),
		hour = today.getHours();
	if (lastHour !== hour) {
		getImage();
		UpdateGreet();
		lastHour = hour;
	}
	setTimeout(setBgGreet, 1000);
}

// Get Name
function getName() {
	if (localStorage.getItem('name') === null) {
		name.textContent = '[Enter Name]';
	} else {
		name.textContent = localStorage.getItem('name');
	}
}

// Set Name
function setName(e) {
	if (e.type === 'focus') {
		e.target.innerText = '';
	} else if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			if (e.target.innerText !== '')
				localStorage.setItem('name', e.target.innerText);
			else
				getName();
			name.blur();	
		}
	} else {
		if (e.target.innerText !== '')
			localStorage.setItem('name', e.target.innerText);
		else
			getName();
	}
}

// Get Focus
function getFocus() {
	if (localStorage.getItem('focus') === null) {
		focus.textContent = '[Enter Focus]';
	} else {
		focus.textContent = localStorage.getItem('focus');
	}
}

// Set Focus
function setFocus(e) {
	if (e.type === 'focus') {
		e.target.innerText = '';
	} else if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			if (e.target.innerText !== '')
				localStorage.setItem('focus', e.target.innerText);
			else 
				getFocus();
			focus.blur();	
		}
	} else {
		if (e.target.innerText !== '')
			localStorage.setItem('focus', e.target.innerText);
		else
			getFocus();
	}
}

function getCity() {
	if (localStorage.getItem('city') === null) {
		city.textContent = '[Enter City]';
	} else {
		city.textContent = localStorage.getItem('city');
	}
}

function setCity(e) {
	if (e.type === 'focus') {
		e.target.innerText = '';
	} else if (e.type === 'keypress') {
		if (e.which == 13 || e.keyCode == 13) {
			if (e.target.innerText !== '') {
				localStorage.setItem('city', e.target.innerText);
				getWeather(e.target.innerText);
			}
			else 
				getCity();
			city.blur();
		}
	} else {
		if (e.target.innerText !== '') {
			localStorage.setItem('city', e.target.innerText);
			getWeather(e.target.innerText);
		}
		else 
			getCity();
	}
}

function viewBgImage(src) {  
	const img = new Image();
	img.src = src;
	img.onload = () => {      
    	document.body.style.backgroundImage = `url(${src})`;
	};
}

function getImage() {
	const index = imageIndex % DayBackgroundList.length;
	const imageSrc = DayBackgroundList[index];
	viewBgImage(imageSrc);
	imageIndex++;
	btnBackground.disabled = true;
	setTimeout(function() { btnBackground.disabled = false }, 1000);
} 

async function getQuote() {  
	const url = `https://api.chucknorris.io/jokes/random`;
	btnQuote.disabled = true;
	const res = await fetch(url);
	const data = await res.json(); 
	quote.textContent = data.value;
	setTimeout(function() { btnQuote.disabled = false }, 1000);
}

var APIKey = '30c15b7a3a24e78c3e199d9d7a6d68d7';

async function getWeather() {
	console.log(city.textContent);
	if (city.textContent !== '' && city.textContent !== '[Enter City]') {
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&appid=${APIKey}&units=metric`;
		const res = await fetch(url);
		const data = await res.json(); 
		if (data.cod !== 200) {
			weatherDescription.textContent = "Weather not found";
		} else {
			weatherIcon.classList.add(`owf-${data.weather[0].id}`);
			temperature.textContent = data.main.temp + '°C'
			weatherDescription.textContent = `${data.weather[0].description}`;	
		}
	}
}

document.addEventListener('DOMContentLoaded', getQuote);
btnQuote.addEventListener('click', getQuote);

var lastHour = -1;
var DayBackgroundList = genDayBackgroundList();
var imageIndex = (new Date()).getHours();
btnBackground.addEventListener('click', getImage);


name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('focus', setName);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('focus', setFocus);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
city.addEventListener('focus', setCity);

// Run
showTime();
setBgGreet();
getName(); 
getFocus(); 
getCity();
document.addEventListener('DOMContentLoaded', getWeather);