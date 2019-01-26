/*!
 * instagood
 * Copyright(c) 2019 Victor Matias (reidark)
 * MIT Licensed
 */

/**
 * Module dependencies
 */

const request = require('request');

/**
 * Constants
 */

const base = 'https://www.instagram.com';
const patterns = {
	ds: new RegExp(/(ds_user_id)\=(\w+)/),
	mid: new RegExp(/(mid)\=(.+?)\;/),
	mcd: new RegExp(/(mcd)\=(\w+)/),
	csrftoken: new RegExp(/(csrftoken)\=(\w+)/),
	sessionid: new RegExp(/(sessionid)\=(.+?)\;/),
};

/**
 * Instagood
 *
 * @example
 *
 * let instance = new instagood('user', 'password');
 */

class Instagood {

	/**
	 * Constructor
	 *
	 * @param {string} username Instagram username.
	 * @param {string} password Instagram password.
	 */

	constructor(username = '', password = '') {
		this.auth = {
			username,
			password
		};
		this.options = {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
				'Content-Type': 'application/json',
				'Accept-Language': 'en-US',
				'X-Instagram-AJAX': 1,
				'X-Requested-With': 'XMLHttpRequest',
				'Referer': base,
			}
		}
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
	 * Cookienary
	 *
	 * Get infos from response header cookies
	 *
	 * @param {string} item String to find and match.
	 * @param {string} type Pattern type (RegExp) to match the string.
	 *
	 * @returns {string} Info extracted from cookies.
	 */

	cookienary(item, type) {
		let match = item.join('').match(patterns[type]);
		return match ? match[2] : '';
	};

	/**
	 * Cookie Generator
	 *
	 * @param {string} item String to find and match.
	 *
	 * @returns {string} Info extracted from cookies.
	 */

	cookieGenerator(item) {
		let ds = this.cookienary(item, 'ds');
		let mcd = this.cookienary(item, 'mcd');
		let mid = this.cookienary(item, 'mid');
		let sessionid = this.cookienary(item, 'sessionid');
		let csrftoken = this.cookienary(item, 'csrftoken');

		return `mid=${mid}; mcd=${mcd}; csrftoken=${csrftoken}; ds_user_id=${ds}; sessionid=${sessionid}; rur=FTW`;
	};

	/**
	 * Convert to ID
	 *
	 * @param {string} user User.
	 *
	 * @returns {Promise} Promise containing the user id.
	 */

	async convertToId(user) {
		return !/^\d+$/.test(user) ? this.getUserInfo(user).then(user => user.pk) : user;
	};

	/**
	 * Login
	 *
	 * @returns {object} Log-in a user to get cookies and token.
	 */

	async login() {
		// Get CSRFToken to login
		let csrftoken = await new Promise((resolve) => {
			request.get(base, (err, res) => {
				if (res.headers['set-cookie']) {
					resolve(this.cookienary(res.headers['set-cookie'], 'csrftoken'));
				} else {
					throw new Error('No cookie from response');
				}
			});
		});

		this.options.headers['X-CSRFToken'] = csrftoken;

		// Set credentials
		let options = {
			...this.options,
			form: this.auth,
		};

		return new Promise((resolve, reject) => {
			request.post(`${base}/accounts/login/ajax/`, options, (err, res, body) => {
				let response = JSON.parse(body);

				if (response && response.authenticated && res.headers['set-cookie']) {
					// Set the new CSRFToken to newer requests
					this.options.headers['X-CSRFToken'] = this.cookienary(res.headers['set-cookie'], 'csrftoken');
					// Generate cookie to newer requests
					this.options.headers['cookie'] = this.cookieGenerator(res.headers['set-cookie']);

					resolve(response);
				} else {
					reject({ status: 'fail' });
				}
			});
		});
	};

	/**
	 * Get User Info
	 *
	 * @param {string} username Username.
	 *
	 * @returns {object} Object with user infos.
	 */

	getUserInfo(username = this.auth.username) {
		return new Promise((resolve, reject) => {
			request.get(`${base}/web/search/topsearch/?context=user&count=0&query=${username}`, (err, res, body) => {
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
		let id = await this.convertToId(user);
		let options = {
			...this.options,
			json: true,
		};

		return new Promise((resolve, reject) => {
			request.post(`${base}/web/friendships/${id}/${action}/`, options, (err, res, body) => {
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

	/**
	 * Logout
	 */

	logout() {
		return new Promise((resolve, reject) => {
			request.post(`${base}/accounts/logout/ajax/`, this.options, (err, res, body) => {
				if (body && body.status === 'ok') {
					resolve({ status: 'ok' });
				} else {
					reject({ status: 'fail' });
				}
			});
		});
  }

};

module.exports = Instagood;
