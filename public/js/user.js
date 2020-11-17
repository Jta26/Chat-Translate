class User {
    Name;
    Email;
    Locale;
    Created_Date;
    _id;
    constructor() {
        this.getUserData();
    }
    async getUserData() {
        const response = await fetch('/user/data');
        const data = await response.json();
        this.Name = data.name;
        this.Email = data.email;
        this.Locale = data.locale;
        this.Created_Date = data.created_date;
        this._id = data._id;
    }
}
