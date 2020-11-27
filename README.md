# Bridges Chat Translator

## Description
Bridges Chat Translator is a project for Pitt MSIS class Network and Web Data Technologies. It is a cross-language live-messaging app that enables users that speak two different languages to have their messages auto translated via the azure translation API. 

## Getting Started
To start Bridges Chat Translator, follow the steps below

1. Clone the git repo
    
    `git clone https://github.com/jta26/Chat-Translate`
    
2. Navigate to cloned directory

    `cd [YOUR-LOCATION]/Chat-Translate`

3. Create `.env` file.

    `touch .env`

4. Fill `.env` file.
    ```
    SECRET=[MAKE A SECRET]

    DBUSER=[MONGODB USERNAME]
    DBPASSWORD=[MONGODB PASSWORD]
    DBHOST=[MONGODB HOST]
    DATABASE=[MONGODB DB NAME]
    PORT=3000
    TRANSLATION_KEY=[TRANSLATION API KEY]

    ```
    Note that if you are the instructor/TA your zip will come with this with our Database and Azure API key.

5. From the cloned Directory run the following command to install the node_modules required.

    `npm install`

6. Then to start the application run

    `npm start`

7. Navigate to the following url in a browser
    
    `localhost:3000/`

## Technologies Used
---
### Back End:

- MongoDb
- Mongoose
- Node.js
- express.js
- passport.js
- socket.io

### Front End:
- Vanilla JS/HTML/CSS
