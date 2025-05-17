## DEPI Frontend Tasks - React
A collection of frontend tasks built with React, distributed over the main frontend basics to advanced topics, covering HTML, CSS, JavaScript, TypeScript, React, jQuery, and Bootstrap for DEPI.
Table of Contents

HTML
CSS
JavaScript
React.JS
jQuery
Bootstrap
TypeScript

## Features

HTML: Elements, Attributes, and Semantic Tags
CSS: Styling Properties and Static Website
JavaScript: Problem Solving, Async Operations, and CRUD Functionality
React: Library Basics with Applied Projects, Including API Integration
jQuery: Framework Basics with CRUD Project
TypeScript: OOP Features
Bootstrap: CSS Framework Basics with Simple Project

## Installation
```
Clone the repository:git clone https://github.com/MahmoudElhefnawyy/Freelance-Yard-Project


Navigate to the project directory:cd DEPI-Frontend-Tasks-React


Install dependencies:npm install

oryarn install
```

## Running the Application

```
Start the development server:npm start

oryarn start
```

Open your browser and navigate to http://localhost:3000 to view the application. For the React events listing project, visit http://localhost:3000/events.

React.JS Project: Events Listing
## Overview
The React section includes a fully implemented events listing application, showcasing React library basics with API integration. This project displays a list of events in a responsive grid or list format, with features like real-time search and filtering, as per the DEPI requirements.
Features

Events Display: Events are shown in a responsive grid or list, with each event card/row displaying the name, date, location, price, and a short description.
Search & Filter: Users can filter events by partial name, location, or date range using a text input and optional dropdowns. Results update in real-time.
Responsive Design: The grid layout collapses to fewer columns on smaller screens.
Data Integration: Fetches data from a .NET API (/api/events) if available; otherwise, uses a local array of mock event data.
Routing: Utilizes React Router with a dedicated /events route for the Events component.
Styling: Implements brand design guidelines (if provided) or uses Tailwind CSS for a clean, minimal design.
Error Handling: Displays a "No events found" message when no events match the search or filter criteria.

## Project Structure
```
DEPI-Frontend-Tasks-React/
├── src/
│   ├── components/
│   │   └── Events.js          # Main Events component
│   ├── data/
│   │   └── events.js         # Mock event data
│   ├── config.js             # API configuration
│   ├── App.js                # Main app with React Router
│   ├── index.js              # Entry point
│   └── styles/               # Tailwind CSS or custom styles
├── public/
│   └── index.html            # HTML template
├── package.json              # Project dependencies
└── README.md                 # This file
```

Switching Between Mock Data and API

Mock Data: By default, the events listing uses a local array in src/data/events.js when the .NET API is unavailable.
API Integration:
Ensure the .NET API is running at /api/events.
Update the useEvents hook in src/components/Events.js:const useMockData = false;


Configure the API URL in src/config.js:export const API_URL = 'http://your-api-url/api/events';


The useEffect hook will fetch data when useMockData is false.



## API Data Format
The .NET API is expected to return:
[
  {
    "id": string,
    "name": string,
    "date": string,
    "location": string,
    "price": number,
    "description": string
  },
  ...
]

Testing

Search: Test partial name searches (e.g., "Rock show") to verify real-time updates.
Filters: Test location or date range filters (if implemented) for accuracy.
Empty State: Search for a non-existent term (e.g., "xyz") to confirm the "No events found" message.
Responsive Design: Resize the browser or use developer tools to verify grid layout on mobile devices.

Other Sections

HTML: Includes tasks on elements, attributes, and semantic tags to build accessible static pages.
CSS: Covers styling properties and a static website project with responsive design.
JavaScript: Features problem-solving tasks, async operations (e.g., Promises, async/await), and CRUD functionality.
jQuery: Implements a CRUD project using jQuery framework basics.
TypeScript: Explores OOP features like classes, interfaces, and inheritance.
Bootstrap: Includes a simple project using Bootstrap for rapid CSS styling.

## Dependencies

React
React Router DOM
Axios (for API calls)
Tailwind CSS (for React project styling)
jQuery
Bootstrap
TypeScript
Other dependencies (see package.json)

Contributing

Fork the repository.
Create a new branch:git checkout -b feature/your-feature


Make changes and commit:git commit -m "Add your feature"


Push to the branch:git push origin feature/your-feature


Open a pull request.

## License
This project is licensed under the MIT License.
