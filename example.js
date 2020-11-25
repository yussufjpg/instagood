const instagood = require('./src/instagood');

// Instance

const user = new instagood('reidarking', 'csrftoken', 'sessionid');

// Get user information

user.getUserInfo('reidarking').then((response) => console.log(response), (err) => console.log(err));

// Get user posts

user.getUserPosts('reidarking').then((response) => console.log(response), (err) => console.log(err));

// Get user followers

user.getFriendships('followers', 'reidarking', 20).then((response) => console.log(response.followers), (err) => console.log(err));

// Get user following

user.getFriendships('following', 'reidarking', 20).then((response) => console.log(response.followers), (err) => console.log(err));

// Follow

user.friendships('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Unfollow

user.friendships('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));

// Like

user.likes('like', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));

// Unlike

user.likes('unlike', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));

// Comment

user.comments('1973450160415933226', 'I liked!').then((response) => console.log(response), (err) => console.log(err));
