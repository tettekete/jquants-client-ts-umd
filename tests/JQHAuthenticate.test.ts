import {jest,describe, expect, test} from '@jest/globals';
import axios, { AxiosInstance,AxiosResponse ,InternalAxiosRequestConfig ,AxiosRequestConfig} from 'axios';

import JQH from '../src/j-quants'
import { InMemoryCredsStore } from '../src/j-quants/InMemoryCredsStore';
import { InMemoryTokenStore } from '../src/j-quants/InMemoryTokenStore';

import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

let auth_user_count = 0;
let auth_refresh_count = 0;
mock
	.onPost( /token\/auth_user$/ )
	.reply(() =>
		{
			return [
						200,
						{
        					refreshToken: `<YOUR refreshToken>.${auth_user_count++}`,
      					}
				];
		});

mock
	.onPost( /token\/auth_refresh$/ )
	.reply(() =>
		{
			return [
						200,
						{
        					idToken: `<ID token>.${auth_refresh_count++}`,
      					}
				];
		});


// 一旦 jqh インスタンスを作成します
const credsStore = new InMemoryCredsStore({user: 'foo@example.com' , password: 'password' });
const tokenStore = new InMemoryTokenStore();

const jqh = new JQH({
	creds_store: credsStore,
	token_store: tokenStore
});

// 各有効期限をテスト用に設定
jqh.refresh_token_ttl = 4;
jqh.id_token_ttl = 2


// 期限切れシミュレートのための sleep 関数
const sleep = async (sec:number) => {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}


describe('JQH refreshTokens tests',()=>
{
	describe('First refreshTokens',() =>
	{
		test('init with refreshTokens',async ()=>
		{
			expect( (await jqh.refreshTokens()).ok ).toBeTruthy();
			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.0' );
			expect( jqh.id_token ).toBe( '<ID token>.0' );

			expect( (await jqh.refreshTokens()).ok ).toBeTruthy;
			expect( jqh.id_token ).toBe( '<ID token>.0' );
		});

		test('The first ID token is valid for 2 seconds',async ()=>
		{
			await sleep( 1 );

			// 1 sec passed

			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.0' );
			expect( jqh.id_token ).toBe( '<ID token>.0' );
		});

		// 1.x sec passed

		test('After 2 seconds ID token is invalid.',async ()=>
		{
			await sleep( 2 );

			// 3.x sec passed

			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.0' );
			expect( jqh.id_token ).toBeUndefined();
		});

		// 3.xx sec passed

		test('Refresh token is valid so you can get a new ID token.',async ()=>
		{
			expect( (await jqh.refreshTokens()).ok ).toBeTruthy();

			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.0' );
			expect( jqh.id_token ).toBe( '<ID token>.1' );
		});

		// 3.xxx sec / 0.x sec passed

		test('After 4 seconds Refresh token is invalid.',async ()=>
		{
			await sleep( 1 );

			// 4.x4 sec / 1.xx sec passed
			expect( jqh.refresh_token ).toBeUndefined();
			expect( jqh.id_token ).toBe( '<ID token>.1' );	// It's only been 1.x seconds.
		});

		// 4.x5 sec / 1.xxx sec passed

		test('The Refresh Token will not be updated while the ID token is valid.',async ()=>
		{
			expect( (await jqh.refreshTokens()).ok ).toBeTruthy();

			expect( jqh.refresh_token ).toBeUndefined();
			expect( jqh.id_token ).toBe( '<ID token>.1' );	// It's only been 1.xxx seconds.
		});

		// 4.x6 sec / 1.x4 sec passed

		test('When the ID token expires, the refresh token is also updated.',async ()=>
		{
			await sleep( 1 );

			// 5.x6 sec / 2.x4 sec passed

			expect( (await jqh.refreshTokens()).ok ).toBeTruthy();

			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.1' );
			expect( jqh.id_token ).toBe( '<ID token>.2' );
		});
	});
})