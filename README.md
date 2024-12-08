# BECodingExerciseNodeJSMySQL

## Initial thoughts on developming journey

### How to set up MySQL on a local machine and use it? 

I watched some videos and installed MySQL terminal and MySQL Workbench.

### Which technology to use? 

I chose Node.js and MySQL as Database.

### Which Node modules to use? 

I chose express to set up routes (app.get('/'...)) and handle requests; mysql2 for db connection; config for storing secrets.

I was contemplating wheater to use config or .env to store password and other required database connection related variables. At the moment using config, though .env can be more secure.

### If to make seperate js file for initializing db or to do it through the MySQL terminal?

I chose terminal as initilization file gave some errors.

### First things needed next

1. Finish setting up git and adding some rules to it such as Branch protection rules (Done)

2. Serving temporarly json file from the backend not from db to ensure other developers understand this project better and can actually clone it and test it without having to set up MySQL