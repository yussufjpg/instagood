const instagood = require('./src/instagood');

// Instance

const

	user = new instagood('raspandooficial', '982345megloca');

//user.login().then((response) => console.log(response), (err) => console.log(err));

user.login().then(() => {
	user.do('unfollow', 'macrawel_5la').then((response) => console.log(response), (err) => console.log(err));
}, (err) => console.log(err));

// user.logout().then(() => {
// 	user.login().then(() => {
// 		user.do('follow', 'evertonsoaresxavier').then((response) => console.log(response), (err) => console.log(err));
// 	}, (err) => console.log(err));
// }, (err) => {console.log(err)});

// Follow

//user.do('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Unfollow

//user.do('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
