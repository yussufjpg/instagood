const instagood = require('./src/Instagood');

// Instance

const

	user = new instagood('reidarking', 'csrf', 'sessionid');

// Follow

user.follow('github').then((response) => console.log(response), (err) => console.log(err));
