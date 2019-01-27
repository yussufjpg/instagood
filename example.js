const instagood = require('./src/instagood');

// Instance

const user = new instagood('user', 'csrftoken', 'sessionid');

// Get user information

user.getUserInfo('reidarking').then((response) => console.log(response), (err) => console.log(err));

// Follow

user.do('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Unfollow

user.do('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
