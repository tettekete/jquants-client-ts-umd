import {jest,describe, expect, test} from '@jest/globals';
import axios, { AxiosInstance,AxiosResponse ,InternalAxiosRequestConfig ,AxiosRequestConfig} from 'axios';

import os from 'os';
import path from 'path';
import { pid } from 'node:process';

import { DefaultAPITokenStore } from '../src/j-quants/DefaultAPITokenStore';
import JQH from '../src/j-quants'

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
const jqh = new JQH({
	email:'foo@example.com',
	password:'password'
});

// 各有効期限をテスト用に設定
jqh.refresh_token_ttl = 5;
jqh.id_token_ttl = 2

// DefaultAPITokenStore がシステムテンポラリに yaml ファイルを作るように調整します。
const YAML_FILE = "tokens-db.yaml";
let yaml_temp_dir:string = path.join( os.tmpdir() , `${pid}-${(Math.random() * 1E+10)}` );
let yaml_temp_path:string = path.join( yaml_temp_dir , YAML_FILE );

( jqh.token_store as DefaultAPITokenStore ).yaml_file = yaml_temp_path;

// 期限切れシミュレートのための sleep 関数
const sleep = async (ms:number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


describe('JQH authenticate tests',()=>
{
	describe('First authenticate',() =>
	{
		test('authenticate',async ()=>
		{
			const r1 = await jqh.authenticate();
			
			expect( r1.ok ).toBeTruthy();
			expect( jqh.refresh_token ).toBe( '<YOUR refreshToken>.0' );
			expect( jqh.id_token ).toBe( '<ID token>.0' );
			
		});
	});
})