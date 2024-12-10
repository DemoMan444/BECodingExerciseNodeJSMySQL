# BECodingExerciseNodeJSMySQL

## Introduction

This is a coding excercise with the focus on Backend. 

The idea was to create sports event calendar that allows events to be added and categorized based on sports. 

## Tech

Node.js and MySql are used.

## How to run

1. Install MySQL

2. Make sure you have node.js installed.

3. Install dependencies

npm install express mysql2 body-parser

4. Clone the project.
   
5. Create config.js to store your MySQL host, user, database: 'sports_calendar', password. Use module.exports = { db: and here another curly brackets and previously named 4 keys with corresponding values };

6. Run in terminal: npm start
   
7. The project should start, you can add manually entries to your db

## Extra. Initial thoughts on developming journey

### How to set up MySQL on a local machine and use it? 

I watched some videos and installed MySQL terminal and MySQL Workbench.

### Which technology to use? 

I chose Node.js and MySQL as Database.

### Which Node modules to use? 

I chose express to set up routes (app.get('/'...)) and handle requests; mysql2 for db connection; config for storing secrets.

I was contemplating wheater to use config or .env to store password and other required database connection related variables. At the moment using config, though .env can be more secure.

### If to make seperate js file for initializing db or to do it through the MySQL terminal?

I chose terminal as initilization file gave some errors.

## Ideas for further development

1. Serving temporarly json file from the backend not from db to ensure other developers understand this project better and can actually clone it and test it without having to set up MySQL, making btn for it
   
2. Display sound onmouseover to make more playful