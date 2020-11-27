For all the documentation requirement, please include sample code in your report with description of the code does, just partial code is enough.

Your report should be a PDF document.  The full submission should be a zipfile and only one submission per group

Kinori:
## Backend:
Our backend is hosted by a server that handles the user and chat data. The server routes requests and provides requested data back to the client. Sessions are managed by the server. The chat rooms are managed using web sockets that were leveraged from Socket.io.
    server side routing
    

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

## Authentication
We implemnted authentication using Passport, which was extended with session storage using MongoStore, which is a node module that stores the session data in our mongoDB. In Bridges, there is actually only one function for both signup and login. This is because both are required to verify that a user with the specified email exists, or does not exist. If it does exist and they are trying to signup, the user is sent to an error screen. If the user doesn't exist and they are trying to login, then they are also sent to an error screen. Below is the signup/login service using passport.

```
passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done) => {
        User.findOne({email: email})
        .then(user => {
            if (!user) {
                let name = req.body.name;
                let locale = req.body.locale;
                if (name == null || locale == null) {
                    throw 'One or more values are missing';
                }
                // create new user, hash the password, and save it.
                const newUser = new User({ email, password, name, locale });
                console.log('creating new user');
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => {
                            console.log(user);
                            return done(null, user);
                        })
                        .catch(err => {
                            return done(null, false, {message: err});
                        })
                    })
                })
            }
            else {
                // user exists, compare hashes of passwords, then log user in if correct.
                bcrypt.compare(password, user.password, (err, passwordsMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (passwordsMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, { message: 'Email or Password Incorrect.'});
                    }
                })
            }
        })
    })
);
```

Jose:
Documentation of how your database and database access was implemented
Documentation of what you used to implement the front-end, including any technology used for styling of the front-end (e.g. Bootstrap)
Documentation on any access control implemented in your application
    signed in or not signed in


Joel
Full documentation of what framework or external code you used
Documentation of how Error handling is supported in your application
Mobile/responsive design was implemented and what limitation your project has with respect to accessibility requirement and responsive design

## Error Handling

In general, our application contains most of it's error handling on the server side surrounding the authentication, however there is also client side form-validation for the login and signup pages.

 There are appropriate error catches for when the user is not signed in, for example. Below is a snippet of that code.

```
const requiresAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    else {
        res.redirect('/auth/login');
    }
}

// if the user is authenticated already, then we forward them to the chat/dashboard.
const forwardOnAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/chat');
    }
    else {
        next();
    }
}
```

This snippet contains 2 middleware functions that handle when the user visits a route. If they are not logged in, then they are redirected to the login page. The second function is for if they visit the login page when logged in, then they are forwarded to the chat app.

## Mobile/Responsive Design
Bridges Chat Translator is fully functional on mobile screen formats. Below you can see the difference in mobile vs desktop designs.

<img src="https://imgur.com/9X5DB4k.png"
     alt="Bridges Desktop Design"
     style="float: left; padding-right: 10px; width: 350px"/>

<img src="https://i.imgur.com/qqdrJ1R.png"
     alt="Bridges Desktop Design"
     style=" width: 200px; padding-right: 10px; float:left"/>

<img src="https://i.imgur.com/eXt4HbI.png"
alt="Bridges Desktop Design"
style="width: 215px; clear:both;"/>
<p style='clear: both;'>

As you can see, the mobile format collapses the left side into a hamburger menu that can be toggled.

## External Code and Frameworks:
For this project, we ended up using a somewhat minimal spread of external libraries and packages. Most of the libraries we used were for more complex thing such as user authentication and session storage. These would not have been possible to reliably implement in the time frame of the project.

The following is a list of all the external libraries we used.
- "bcryptjs": "^2.4.3",
- "body-parser": "^1.19.0",
- "connect-mongo": "^3.2.0",
- "cookie-parser": "^1.4.5",
- "dotenv": "^8.2.0",
- "ejs": "^3.1.5",
- "express": "^4.17.1",
- "express-session": "^1.17.1",
- "mongoose": "^5.10.3",
- "node-fetch": "^2.6.1",
- "passport": "^0.4.1",
- "passport-local": "^1.0.0",
- "passport.socketio": "^3.7.0",
- "socket.io": "^3.0.0"


Member Roles:

