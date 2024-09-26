document
  .getElementById("commandInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const command = event.target.value.trim();
      processCommand(command);
      event.target.value = ""; // Clear the input field
    }
  });

function processCommand(command) {
  const output = document.getElementById("output");

  // Append the user command to the output
  appendToOutput("> " + command);

  // Split command into parts for processing
  const [baseCommand, ...args] = command.split(" ");

  switch (baseCommand.toLowerCase()) {
    case "time":
      displayTime();
      break;
    case "date":
      displayDate();
      break;
    case "weather":
      displayWeather(args);
      break;
    case "systeminfo":
      displaySystemInfo();
      break;
    case "task":
      handleTaskCommand(args);
      break;
    case "timer":
      handleTimer(args);
      break;
    case "stopwatch":
      handleStopwatch(args);
      break;
    case "countdown":
      handleCountdown(args);
      break;
    case "search":
      handleSearch(args);
      break;
    case "quote":
      displayRandomQuote();
      break;
    case "joke":
      displayRandomJoke();
      break;
    case "help":
      displayHelp(args);
      break;
    case "exit":
      exitApp();
      break;
    default:
      appendToOutput(
        `Command "${command}" not recognized. Type "help" for available commands.`
      );
  }

  // Scroll to the bottom of the output
  output.scrollTop = output.scrollHeight;
}

function appendToOutput(text) {
  const output = document.getElementById("output");
  const newOutput = document.createElement("div");
  newOutput.textContent = text;
  output.appendChild(newOutput);
}

// Placeholder functions for now - we'll implement these step-by-step
function displayTime() {
  const currentTime = new Date().toLocaleTimeString();
  appendToOutput("Current time: " + currentTime);
}

function displayDate() {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  appendToOutput("Current date: " + currentDate);
}

// Example API Key - you will need to replace it with your actual API key from OpenWeatherMap
const API_KEY = "3d0e75b1809f78f44935c36ada7b307f";

// Handle the weather command
function displayWeather(args) {
  if (args.length === 0) {
    getWeatherForLocation(); // Get weather based on user's current location
  } else {
    const city = args.join(" ");
    getWeatherForCity(city); // Get weather for a specific city
  }
}

// Fetch weather for the user's current location using the browser's Geolocation API
function getWeatherForLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherDataByCoordinates(latitude, longitude);
      },
      () => {
        appendToOutput(
          "Unable to access your location. Please provide a city name."
        );
      }
    );
  } else {
    appendToOutput("Geolocation is not supported by your browser.");
  }
}

// Fetch weather for a specific city
function getWeatherForCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  fetchWeatherData(url);
}

// Fetch weather data using latitude and longitude
function fetchWeatherDataByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetchWeatherData(url);
}

// Common function to fetch weather data from the API
function fetchWeatherData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        displayWeatherData(data);
      } else {
        appendToOutput(`Error: ${data.message}`);
      }
    })
    .catch((error) => {
      appendToOutput("Error fetching weather data.");
    });
}

// Display the weather data in the terminal
function displayWeatherData(data) {
  const location = `${data.name}, ${data.sys.country}`;
  const temperature = `${data.main.temp}°C`;
  const humidity = `Humidity: ${data.main.humidity}%`;
  const description = `Weather: ${data.weather[0].description}`;

  const weatherInfo = `Location: ${location}\nTemperature: ${temperature}\n${humidity}\n${description}`;
  appendToOutput(weatherInfo);
}

// Handle the systeminfo command
function displaySystemInfo() {
  const output = document.getElementById("output");

  // Detect OS type
  const os = detectOS();

  // System uptime (in seconds since page load)
  const uptime = (performance.now() / 1000).toFixed(0);

  // Memory information (approximate total RAM in GB)
  const memory = navigator.deviceMemory
    ? `${navigator.deviceMemory} GB`
    : "Unknown";

  // Browser info
  const browser = detectBrowser();

  // Display system info
  const systemInfo = `
  OS: ${os}
  Uptime: ${uptime} seconds since page load
  Memory: ${memory}
  Browser: ${browser}`;
  appendToOutput(systemInfo);
}

function detectOS() {
  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes("win")) return "Windows";
  if (platform.includes("mac")) return "MacOS";
  if (platform.includes("linux")) return "Linux";
  if (/android/.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";

  return "Unknown OS";
}

// Detect Browser
function detectBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("chrome"))
    return `Chrome ${navigator.appVersion.match(/Chrome\/(\d+)/)[1]}`;
  if (userAgent.includes("firefox"))
    return `Firefox ${navigator.appVersion.match(/Firefox\/(\d+)/)[1]}`;
  if (userAgent.includes("safari") && !userAgent.includes("chrome"))
    return `Safari ${navigator.appVersion.match(/Version\/(\d+)/)[1]}`;
  if (userAgent.includes("edge"))
    return `Edge ${navigator.appVersion.match(/Edge\/(\d+)/)[1]}`;

  return "Unknown Browser";
}

function appendToOutput(message) {
  const output = document.getElementById("output");
  const div = document.createElement("div");
  div.textContent = message;
  output.appendChild(div);

  output.scrollTop = output.scrollHeight;
}

let tasks = [];
let taskIdCounter = 1;

// Load tasks from localStorage when the app starts
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    taskIdCounter =
      tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize the tasks on page load
loadTasks();

function handleTaskCommand(args) {
  if (args.length === 0) {
    appendToOutput("Usage: task [add|list|remove|prioritize|due|search]");
    return;
  }

  const subCommand = args[0].toLowerCase();

  switch (subCommand) {
    case "add":
      addTask(args.slice(1).join(" "));
      break;
    case "list":
      listTasks();
      break;
    case "remove":
      removeTask(parseInt(args[1], 10));
      break;
    case "prioritize":
      prioritizeTask(parseInt(args[1], 10), args[2]);
      break;
    case "due":
      setTaskDueDate(parseInt(args[1], 10), args[2]);
      break;
    case "search":
      searchTasks(args.slice(1).join(" "));
      break;
    default:
      appendToOutput(
        "Unknown task sub-command. Available: add, list, remove, prioritize, due, search"
      );
  }
}

function addTask(description) {
  if (!description) {
    appendToOutput("Task description is required.");
    return;
  }

  const newTask = {
    id: taskIdCounter++,
    description: description,
    priority: "low", // Default priority
    dueDate: null,
  };

  tasks.push(newTask);
  saveTasks(); // Save the updated task list to localStorage
  appendToOutput(`Task added: ${newTask.description} (ID: ${newTask.id})`);
}

function listTasks() {
  if (tasks.length === 0) {
    appendToOutput("No tasks available.");
    return;
  }

  appendToOutput("Task List:");
  tasks.forEach((task) => {
    appendToOutput(
      `ID: ${task.id}, Description: ${task.description}, Priority: ${
        task.priority
      }, Due: ${task.dueDate || "None"}`
    );
  });
}

function removeTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    appendToOutput(`Task with ID ${id} not found.`);
    return;
  }

  tasks.splice(taskIndex, 1);
  saveTasks(); // Save the updated task list to localStorage
  appendToOutput(`Task ${id} removed.`);
}

function prioritizeTask(id, priority) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    appendToOutput(`Task with ID ${id} not found.`);
    return;
  }

  const validPriorities = ["high", "medium", "low"];
  if (!validPriorities.includes(priority)) {
    appendToOutput("Invalid priority. Use 'high', 'medium', or 'low'.");
    return;
  }

  task.priority = priority;
  saveTasks(); // Save the updated task list to localStorage
  appendToOutput(`Task ${id} updated to ${priority} priority.`);
}

function setTaskDueDate(id, dueDate) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    appendToOutput(`Task with ID ${id} not found.`);
    return;
  }

  if (isNaN(Date.parse(dueDate))) {
    appendToOutput("Invalid date format. Use YYYY-MM-DD.");
    return;
  }

  task.dueDate = dueDate;
  saveTasks(); // Save the updated task list to localStorage
  appendToOutput(`Task ${id} due date set to ${dueDate}.`);
}

function searchTasks(keyword) {
  if (!keyword) {
    appendToOutput("Keyword is required for search.");
    return;
  }

  const results = tasks.filter((task) =>
    task.description.toLowerCase().includes(keyword.toLowerCase())
  );

  if (results.length === 0) {
    appendToOutput(`No tasks found matching "${keyword}".`);
  } else {
    appendToOutput(`Search results for "${keyword}":`);
    results.forEach((task) => {
      appendToOutput(
        `ID: ${task.id}, Description: ${task.description}, Priority: ${
          task.priority
        }, Due: ${task.dueDate || "None"}`
      );
    });
  }
}

let timerInterval;
let stopwatchInterval;
let stopwatchTime = 0;
let countdownInterval;

// Preload sound for timer/alarm
const alarmSound = new Audio("alarm.mp3");

// Handle the timer command
function handleTimer(args) {
  if (args.length === 0) {
    appendToOutput("Usage: timer [duration]");
    return;
  }

  const duration = parseDuration(args[0]);
  if (duration === null) {
    appendToOutput("Invalid duration. Use formats like 5m, 10s.");
    return;
  }

  setTimer(duration);
}

// Parse a duration string like "5m" or "10s"
function parseDuration(input) {
  const match = input.match(/^(\d+)([smh])$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000; // Seconds to milliseconds
    case "m":
      return value * 60000; // Minutes to milliseconds
    case "h":
      return value * 3600000; // Hours to milliseconds
    default:
      return null;
  }
}

// Set a timer and countdown
function setTimer(duration) {
  if (timerInterval) clearInterval(timerInterval);

  appendToOutput(`Timer set for ${duration / 1000} seconds.`);

  timerInterval = setInterval(() => {
    duration -= 1000;
    appendToOutput(`${duration / 1000} seconds remaining`);

    if (duration <= 0) {
      clearInterval(timerInterval);
      appendToOutput("Time's up!");
      alarmSound.play(); // Play alarm sound
    }
  }, 1000);
}

// Handle the stopwatch command
function handleStopwatch(args) {
  if (args.length === 0) {
    appendToOutput("Usage: stopwatch [start|stop|reset]");
    return;
  }

  const action = args[0].toLowerCase();

  switch (action) {
    case "start":
      startStopwatch();
      break;
    case "stop":
      stopStopwatch();
      break;
    case "reset":
      resetStopwatch();
      break;
    default:
      appendToOutput("Invalid stopwatch command. Use start, stop, or reset.");
  }
}

// Start the stopwatch
function startStopwatch() {
  if (stopwatchInterval) {
    appendToOutput("Stopwatch is already running.");
    return;
  }

  appendToOutput("Stopwatch started.");

  stopwatchInterval = setInterval(() => {
    stopwatchTime += 1000;
    appendToOutput(`Elapsed: ${formatTime(stopwatchTime)}`);
  }, 1000);
}

function stopStopwatch() {
  if (!stopwatchInterval) {
    appendToOutput("Stopwatch is not running.");
    return;
  }

  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  appendToOutput("Stopwatch stopped.");
}

// Reset the stopwatch
function resetStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchTime = 0;
  appendToOutput("Stopwatch reset.");
}

// Format time in HH:MM:SS
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

// Handle the countdown command
function handleCountdown(args) {
  if (args.length === 0) {
    appendToOutput(
      "Usage: countdown [event_name] [YYYY-MM-DD] or countdown stop"
    );
    return;
  }

  const action = args[0].toLowerCase();

  if (action === "stop") {
    stopCountdown();
    return;
  }

  if (args.length < 2) {
    appendToOutput("Usage: countdown [event_name] [YYYY-MM-DD]");
    return;
  }

  const eventName = args[0];
  const eventDate = args[1];

  if (isNaN(Date.parse(eventDate))) {
    appendToOutput("Invalid date format. Use YYYY-MM-DD.");
    return;
  }

  const targetDate = new Date(eventDate).getTime();
  startCountdown(eventName, targetDate);
}

// Start the countdown for an event
function startCountdown(eventName, targetDate) {
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      appendToOutput(`Countdown to ${eventName} is over!`);
      alarmSound.play(); // Play alarm sound
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    appendToOutput(
      `Countdown to ${eventName}: ${days}d ${hours}h ${minutes}m ${seconds}s`
    );
  }, 1000);
}

// Stop the countdown
function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    appendToOutput("Countdown stopped.");
  } else {
    appendToOutput("No countdown is running.");
  }
}

// General output handler
function appendToOutput(message) {
  const output = document.getElementById("output");
  const div = document.createElement("div");
  div.textContent = message;
  output.appendChild(div);

  // Scroll to bottom
  output.scrollTop = output.scrollHeight;
}

function handleSearch(args) {
  // Placeholder for web search
  appendToOutput(`Searching the web for: ${args.join(" ")}`);
}

function displayRandomQuote() {
  // Placeholder for random quotes
  appendToOutput(
    "Here's a random quote: 'The only limit to our realization of tomorrow is our doubts of today.' - Franklin D. Roosevelt"
  );
}

function displayRandomJoke() {
  // Placeholder for random jokes
  appendToOutput(
    "Here's a joke: Why don't programmers like nature? It has too many bugs."
  );
}

function displayHelp(args) {
  if (args.length === 0) {
    appendToOutput(
      "Available commands: time, date, weather, systeminfo, task, timer, stopwatch, countdown, search, quote, joke, help, exit"
    );
  } else {
    appendToOutput("Detailed help for command: " + args.join(" "));
  }
}

function exitApp() {
  appendToOutput("Exiting the app...");
  setTimeout(() => {
    window.close();
  }, 1000);
}
