// Module

const instagood = require('../src/instagood');

// Instance

const user = new instagood('reidarking', '000000000', '000000000');

// Tests

describe('tests for instagood', () => {
	test('instance class', () => {
		const expected = {
			username: 'reidarking',
			csrftoken: '000000000',
			sessionID: '000000000'
		};

		expect(user).toMatchObject(expected);
	});

	test('get something', () => {
		expect(user.get('username')).toEqual('reidarking');
	});

	test('set new values', () => {
		user.set('csrftoken', '999999999');
		user.set('foo', 'bar');

		expect(user.get('csrftoken')).toEqual('999999999');
		expect(user.get('foo')).toEqual('bar');
	});

	test('get instagram user info', () => {
		return user.getUserInfo('reidarking').then((response) => {
			expect(response).toHaveProperty('status', 'ok');
			expect(response).toHaveProperty('username', 'reidarking');
		});
	});

	test('get instagram user id', () => {
		return user.convertToId('reidarking').then((response) => {
			expect(response).toMatch(/^\d+$/);
			expect(response).toEqual('257938510');
		});
	});
});
