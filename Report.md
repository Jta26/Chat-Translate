<h1 align="center"> Final Project Report: Bridges <br><br> 
Joel Austin, Jose Zindia, Kinori Rosnow </h1>

## Introduction:
Bridges Chat Translator is a project for Pitt MSIS class Network and Web Data Technologies. It is a cross-language live-messaging app that enables users that speak two different languages to have their messages auto translated via the azure translation API. This report describes our backend, frontend and database systems. We conclude the report with our roles in this project.

## Backend:
Our backend is hosted by a server that handles the user and chat data. The server routes requests and provides requested data back to the client. Sessions are managed by the server. The chat rooms are managed using web sockets that were leveraged from Socket.io.    

Here is an example of a route on the server side. This code is used to get messages for a chat room.
```
router.post('/', (req, res) => {
    const currentUser = req.user;
    const roomUser = req.body;
    console.log(req.body.email);
    const roomID = roomUser.email == 'global' ? 'global' : getRoomID([currentUser, roomUser]);

    Message.find(
        {
            "timestamp": {
            $lt: new Date(), 
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
            },
            "room": roomID
        }
    )
    .populate('author', '-password -created_date -_id -email_verified')
    .select('-_id -__v')
    .then((messages) => {
        res.json(messages);
    });
});
```

Add sessions snippet:
```
```
web socket snippet - through Socket.io
```
```
## Accessibility:
### Perceivable
We aimed to make font easily readable for users without having to zoom in. For the visually impaired users, all text on the web app is simple so parsers should have no issues. There is not a gaurantee that the chat messages themselves are easy to parse as we cannot control the language of the messages.
### Operable
Users can interact with the site in multiple ways such as mouse, keyboard, and touch screen. The buttons are made larger allowing users that may lack finer control to still be able to click the buttons. There is no flashing content so user with photosensitivity to flashing such as certain forms of epilepsy, can use the chat service.
### Understandable
Text contrast and font is chosen to be easily visible even for those with colorblindness. Color is not used as an indicator, feedback or information provider. Language is simple and easy to understand. All interactions yield the expected results.
### Robust
We are HTML validated. There are no non-standard interface components.

Add screenshot of HTML validation
### Limitations
There are some limitations of the accisibility of the website. Notable we did not have time to create instructional pages that explain the usage of the website. We aimed to make the UI simple enough that it was self explanatory, but some users may find it convenient to have instructions. Another potential improvement is our chats show text as the server recieve and emit it to the chat websockets. As a result the arrival and displaying of messages is at the mercy of the rate at which they arrive. With a sufficiently large chat room or fast enough users, chats may arrive faster than users can read them. Users can scroll but there may be users that would prefer a "slow mode" that allows them to read the chats at a rate that is more accessible to them. Our current answer is the scroll, but some users may prefer a "slow mode".

Documentation of how authentication was implemented
    passport

Jose:
Documentation of how your database and database access was implemented
Documentation of what you used to implement the front-end, including any technology used for styling of the front-end (e.g. Bootstrap)
Documentation on any access control implemented in your application
    signed in or not signed in


Joel
Full documentation of what framework or external code you used
Documentation of how Error handling is supported in your application
Mobile/responsive design was implemented and what limitation your project has with respect to accessibility requirement and responsive design

### Member Roles:
We defined our roles based on ownership of functionality. We started the project with specific roles, but as the project progressed and we periodically worked together on calls, the lines of our work were blurred. Below we describe our part of the project.
#### Kinori Rosnow: 
My role for this project was handling the language translations and the language data interactions. A core of the site is the translation of language where we leveraged Microsoft's Azure Translation API to translate to every language we support. The translation capabilities are limited by the Azure Translation API capability. The messages are stored in every language supported to maximize speed efficiency with a tradeoff with space. For the message database schema I had the message all stored in the same dictionary so the backend interactions could all be the same. The original message language was stored in the schema separately. To be specific my front end work was the language selection drop down in the top right of the screen. Most of my work; however was on the back end. I routed the requests for the change of language selection to the server which update the user information `Locale` in the database. The client side would then request the messages in the new language. My part of the system does have a possible flaw in that if a user's `Locale` in the database differed from their keyboard language, there may be a way to trick the system into storing the wrong original language of the message in the database. Given more time I would be interested in addressing this to combat potential malicious users. Although I'm not sure the full extent of the possible harm yet as the translation API can detect correct languages and our system doesn't depend on the language except for what it displays to the users. We do not think this is a security issue.