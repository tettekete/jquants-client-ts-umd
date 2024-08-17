import {describe, expect, test} from '@jest/globals';
import ExURL from '../src/util/exUrl';

const tests = [
	{
		// 基本
		base: 'https://api.example.com/v2/',
		api: 'auth',
		_expect: 'https://api.example.com/v2/auth'
	},
	{
		// ベースURL が `/` で終わっていない
		base: 'https://api.example.com/v2',
		api: 'auth',
		_expect: 'https://api.example.com/v2/auth'
	},
	{
		// 単純に join すると "v2//auth" になるケース
		base: 'https://api.example.com/v2/',
		api: '/auth',
		_expect: 'https://api.example.com/v2/auth'
	},
	{
		// api に '/' が含まれるケースも一応。
		base: 'https://api.example.com/v2/',
		api: 'token/auth',
		_expect: 'https://api.example.com/v2/token/auth'
	}
];

test.each(tests)('Base URL and API path',({base,api,_expect}) =>
{
	const url = new ExURL(base);
	const auth_api = url.withPath(api).toString();
	expect( auth_api ).toMatch(_expect);
});


