export default class User {
    constructor({ _id = null, username, password = null }) {
        if (!username) {
            throw new Error("Invalid username");
        }

        if (password && !User.checkPassword(password)) {
            throw new Error("Invalid password");
        }

        this._id = _id;
        this.username = username;
        this.password = password;
    }

    static checkPassword(password) {
        return (
            typeof password === 'string' &&
            password.length >= 8 &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) &&
            /[A-Z]/.test(password)
        );
    }

    toJSON({ hidePassword = true } = {}) {
        const json = {
            _id: this._id,
            username: this.username,
        };

        if (!hidePassword) {
            json.password = this.password;
        }

        return json;
    }
}
