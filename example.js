const instagood = require('./src/instagood');

// Instance

const user = new instagood('reidarking', 'csrftoken', 'sessionid');

// Get user information

user.getUserInfo('reidarking').then((response) => console.log(response), (err) => console.log(err));

// Get user followers

user.getUserFollowers('reidarking', 20).then((response) => console.log(response.followers), (err) => console.log(err));

// Follow

user.do('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Unfollow

user.do('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Like

user.likes('like', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));

// Unlike

user.likes('unlike', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));

// Comment

user.say('1973450160415933226', 'I liked!').then((response) => console.log(response), (err) => console.log(err));