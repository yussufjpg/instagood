const instagood = require('./src/instagood');

// Instance

const user = new instagood('login', 'password');

// Login

user.login().then((response) => console.log(response), (err) => console.log(err));
