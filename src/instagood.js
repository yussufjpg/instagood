/*!
 * instagood
 * Copyright(c) 2019 Victor Matias (reidark)
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const API = require('./api.json');
const request = require('request');
const querystring = require('querystring');

/**
 * Instagood
 *
 * @example
 *
 * let instance = new instagood('user', 'csrftoken', 'sessionid');
 */

class Instagood {

	/**
	 * Constructor
	 *
	 * @param {string} username Instagram username.
	 * @param {string} csrftoken csrftoken from instagram api requests (see tutorial).
	 * @param {string} sessionID sessionID from instagram api requests (see tutorial).
	 */

	constructor(username = '', csrftoken = '', sessionID = '') {
		this.username = username;
		this.csrftoken = csrftoken;
		this.sessionID = sessionID;
		this.options = {
			headers: {
				...API.headers,
				cookie: API.headers.cookie
					.replace(/__CSRFTOKEN__/g, this.csrftoken)
					.replace(/__SESSIONID__/g, this.sessionID),
				['x-csrftoken']: this.csrftoken,
			},
		};
	};

	/**
	 * Get
	 *
	 * @param {string} key The class key you want to get.
	 *
	 * @returns {any} The value of key you passed.
	 */

	get(key) {
		return this[key];
	};

	/**
	 * Set
	 *
	 * @param {string} key Class new key.
	 * @param {any} value Key value.
	 *
	 * @returns {this} Method chaining.
	 */

	set(key, value = '') {
		this[key] = value;

		return this;
	};

	/**
	 * Convert to ID
	 *
	 * @param {string} user Username to convert.
	 *
	 * @returns {Promise} Promise containing the user id.
	 */

	async convertToId(user) {
		return !/^\d+$/.test(user) ? this.getUserInfo(user).then(user => user.pk) : user;
	};

	/**
	 * Get User Information
	 *
	 * @param {string} username Username.
	 *
	 * @returns {object} Returns a Promise with status 'ok' or 'fail' with respective infos.
	 */

	getUserInfo(username = this.username) {
		let options = {
			method: 'GET',
			url: `${API.routes.user.info}${username}`,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				let response = JSON.parse(body);

				if (response && response.status === 'ok' && response.users.length) {
					resolve({
						status: 'ok',
						...response.users[0].user,
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Get User Followers
	 *
	 * @param {string} user User name or id to retrieve followers.
	 * @param {number} paginate The number of followers per request.
	 *
	 * @returns {object} Returns a Promise with status 'ok' or 'fail' with respective infos. If 'ok', the object will contain the followers from the specified user.
	 */

	async getUserFollowers(user = this.username, paginate = 25) {
		let id = await this.convertToId(user);
		let options = {
			...this.options,
			method: 'GET',
			url: `${API.routes.followers}{"id":"${id}","include_reel":true,"fetch_mutual":true,"first":${paginate}}`,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				let response = JSON.parse(body);

				if (response && response.status === 'ok') {
					resolve({
						followers: response.data.user.edge_followed_by.edges,
						paginate,
						status: 'ok',
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Friendships
	 *
	 * @param {string} action 'follow', 'unfollow'.
	 * @param {string} user User name or ID to follow.
	 *
	 * @returns {object} Returns a Promise with status 'ok' or 'fail' with respective infos.
	 *
	 * @example
	 *
	 * foo.friendships('follow', 'user').then((response) => console.log(response), (err) => console.log(err));
	 */

	async friendships(action = 'follow', user) {
		if (!this.csrftoken || !this.sessionID) {
			throw new Error('This method requires account csrftoken and sessionid.');
		};

		let id = await this.convertToId(user);
		let options = {
			...this.options,
			method: 'POST',
			url: `${API.routes.friendships}/${id}/${action}/`,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({
						id,
						...body,
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Likes
	 *
	 * @param {string} action 'like', 'unlike'.
	 * @param {string} media Media ID to like/unlike
	 *
	 * @returns {object} Returns a Promise with status 'ok' or 'fail' with respective infos.
	 *
	 * @example
	 *
	 * foo.likes('unlike', '1973268968068413381').then((response) => console.log(response), (err) => console.log(err));
	 */

	likes(action = 'unlike', media) {
		if (!this.csrftoken || !this.sessionID) {
			throw new Error('This method requires account csrftoken and sessionid.');
		};

		let options = {
			...this.options,
			method: 'POST',
			url: `${API.routes.likes}/${media}/${action}/?hl=pt-br`,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({	...body });
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Comments
	 *
	 * @param {string} media Media ID to comment
	 * @param {string} message Message to say
	 *
	 * @returns {object} Returns a Promise with status 'ok' or 'fail' with respective infos.
	 *
	 * @example
	 *
	 * foo.comments('1973450160415933226', 'I liked!').then((response) => console.log(response), (err) => console.log(err));
	 */

	comments(media, message) {
		if (!this.csrftoken || !this.sessionID) {
			throw new Error('This method requires account csrftoken and sessionid.');
		};

		let body = {
			'comment_text': message,
			'replied_to_comment_id': '',
		};
		let options = {
			headers: {
				...this.options.headers,
				['Content-Length']: body.length,
				['Content-Type']: 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			url: `${API.routes.comments}/${media}/add/?hl=pt-br`,
			json: true,
			body: querystring.stringify(body),
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({ ...body });
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};
};

module.exports = Instagood;
