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

**Follow someone (in this case, me)**

```javascript
user.do('follow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
```

**Unfollow someone**

```javascript
user.do('unfollow', 'reidarking').then((response) => console.log(response), (err) => console.log(err));
```

## Problems, bugs or questions?

Open a new [issue](https://github.com/reidark/instagood/issues).

## Roadmap

- Improve 'Usage' section
- Implement more methods (like, comment, [sugest](https://github.com/reidark/instagood/issues))
- Write some tests
