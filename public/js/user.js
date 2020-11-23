class User {
    Name;
    Email;
    Locale;
    Created_Date;
    _id;

    constructor(data) {
        this.Name = data.name;
        this.Email = data.email;
        this.Locale = data.locale;
        this.Created_Date = data.created_date;
        this._id = data._id;
    }

    static async getUserData() {
        const response = await fetch('/user/data');
        const data = await response.json();
        return data;
    }

    static build() {
        return this.getUserData()
        .then(function(data) {
            return new User(data);
        })
    }
}
var user;
User.build().then((userObj) => {
    // birthed post user creation;
    user = userObj;
    const webSocketScript = document.createElement('script');
    webSocketScript.src = '/js/websockets.js';
    // let there be websockets.js
    document.body.appendChild(webSocketScript);
})