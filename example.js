const instagood = require('instagood');

// Instance

const

	user = new instagood('user', 'csrf', 'sessionid');

// Follow

user.do('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Unfollow

user.do('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
