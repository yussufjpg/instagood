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
	 * Get User
	 *
	 * @param {string} username Username.
	 *
	 * @returns {object} Object with user infos.
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
	 * Do
	 *
	 * @param {string} action 'follow', 'unfollow'.
	 * @param {string} user User name or ID to follow.
	 *
	 * @returns {Promise} Returns a Promise with status 'ok' or 'fail' with respectives infos.
	 *
	 * @example
	 *
	 * foo.do('follow', 'user').then((response) => console.log(response), (err) => console.log(err));
	 */

	async do(action = 'follow', user) {
		if (!this.csrftoken || !this.sessionID) {
			throw new Error('This method requires account csrftoken and sessionid.');
		};

		let id = await this.convertToId(user);
		let options = {
			...this.options,
			method: 'POST',
			url: `${API.routes.frienships}/${id}/${action}/`,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request(options, (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({
						id,
						...body
					});
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

};

module.exports = Instagood;
