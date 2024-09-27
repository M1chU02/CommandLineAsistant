# Command Line Assistant

**Command Line Assistant (CLA)** is a versatile terminal application that allows you to perform a variety of tasks directly from the browser. It simulates a command-line interface where you can run commands to get system info, check the weather, manage tasks, set timers, perform web searches, and more!

## Features

- **Time & Date**: Get the current time and date.
- **Weather**: Check the weather for your current location or any city.
- **Task Management**: Add, remove, and list tasks to stay organized.
- **Timers & Stopwatches**: Set timers and track time with a stopwatch.
- **Event Countdown**: Create countdowns for specific events.
- **System Info**: Get detailed system information such as OS type, uptime, and memory usage.
- **Web Search**: Search the web directly from the command line.
- **Fun Features**: Get random jokes for some entertainment.
- **Screen Clear**: Clear the terminal screen when needed.

## Demo

You can view the demo directly in your browser by opening the `index.html` file locally.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/command-line-assistant.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd command-line-assistant
   ```
3. **Open the project in your preferred code editor** or simply open the `index.html` file in a web browser.

## Usage

### Available Commands

| Command                           | Description                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `time`                            | Displays the current time.                                   |
| `date`                            | Displays the current date.                                   |
| `weather [city]`                  | Displays the weather for your location or specified city.    |
| `systeminfo`                      | Displays information about your system (OS, uptime, memory). |
| `task add [description]`          | Adds a new task to the task list.                            |
| `task list`                       | Displays all tasks.                                          |
| `task remove [id]`                | Removes a task by its ID.                                    |
| `task prioritize [id] [priority]` | Sets the priority for a task.                                |
| `task due [id] [date]`            | Sets a due date for a task.                                  |
| `countdown [event] [date]`        | Sets a countdown for a specific event.                       |
| `timer [duration]`                | Sets a countdown timer (e.g., `5m` for 5 minutes).           |
| `stopwatch start/stop/reset`      | Start, stop, or reset the stopwatch.                         |
| `search [query]`                  | Performs a web search for the given query.                   |
| `joke`                            | Displays a random joke.                                      |
| `clear`                           | Clears the terminal screen.                                  |
| `help`                            | Displays available commands and descriptions.                |
| `exit`                            | Exits the terminal.                                          |

### Example Commands

```bash

> time
12:34 PM


> date
Tuesday, September 25, 2024


> weather London
Weather in London: Clear, 18°C


> systeminfo
OS: Windows, Uptime: 1 hour 32 minutes, Memory: 4GB free of 8GB


> task add "Finish project"
Task added: Finish project


> task list
1. Finish project (Pending)


> countdown "Birthday" 2024-12-01
Countdown set for Birthday, 65 days remaining


> clear
```

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit pull requests. Any improvements, bug fixes, or new features are welcome!

## License

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for more details.
"""
