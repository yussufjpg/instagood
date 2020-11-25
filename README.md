# instagood

A simple library with actions that instagram API don't have.

[![NPM](https://nodei.co/npm/instagood.png)](https://nodei.co/npm/instagood/)

[![Maintainability](https://api.codeclimate.com/v1/badges/8800bfa9d98622e8d86e/maintainability)](https://codeclimate.com/github/reidark/instagood/maintainability)
[![Build Status](https://travis-ci.org/reidark/instagood.png)](https://travis-ci.org/reidark/instagood)
[![Dependencies Status](https://david-dm.org/reidark/instagood.svg)](https://david-dm.org/reidark/instagood)

## Install via Package Managers

```sh
$ npm i instagood
```

## Dependencies

- [request](https://github.com/request/request)

## Tests

- [jest](https://github.com/facebook/jest)

## Tutorial

First of all, if you want to use instagood, you need to get some infos manually (at this moment):

1. Login to instagram web
2. Open devtools
3. Enable log requests (network tab)
4. Follow someone
5. In network tab, open 'follow/' request log
6. Get what you need in 'Request Headers' section

![How to get csrftoken and session id](https://raw.githubusercontent.com/reidark/instagood/master/tutorial/img/getting.jpg)

Save `x-csrftoken` and `sessionid` (note that sessionid is inside a parameter string, so copy the code after `=` until `;`).

## Usage

**Import instagood**

```javascript
const instagood = require('instagood');
```

**Instance a new user (for csrftoken and sessionid see Tutorial section)**

**Note:** user must be the logged one (the one who you got csrftoken and sessionid). If you logout, your csrftoken and sessionid will be removed from instagram auth.

```javascript
const user = new instagood('user', 'csrftoken', 'sessionid');
```

**Get user information**

```javascript
user.getUserInfo('reidarking').then((response) => console.log(response), (err) => console.log(err));
```

**Get user posts**

**Note:** 12 is the limit of the posts the code will return, Instagram normally takes 12 posts

```javascript
user.getUserPosts('reidarking', 12).then((response) => console.log(response), (err) => console.log(err));
```

**Get user followers**

```javascript
user.getFriendships('followers', 'reidarking', 20).then((response) => console.log(response.followers), (err) => console.log(err));
```

**Get user following**

```javascript
user.getFriendships('following', 'reidarking', 20).then((response) => console.log(response.followers), (err) => console.log(err));
```

**Follow someone (in this case, me)**

```javascript
user.friendships('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
```

**Unfollow someone**

```javascript
user.friendships('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
```

**Like any media**

```javascript
user.likes('like', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));
```

**Unlike any media**

```javascript
user.likes('unlike', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));
```

**Comment any media**

```javascript
user.comments('1973450160415933226', 'I liked!').then((response) => console.log(response), (err) => console.log(err));
```

## Problems, bugs or questions?

Open a new [issue](https://github.com/reidark/instagood/issues).

## Roadmap

- Improve 'Usage' section
- Implement more methods (list all medias from the user, [sugest](https://github.com/reidark/instagood/issues))
- Write some tests
