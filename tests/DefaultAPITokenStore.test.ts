import {jest,describe, expect, test ,beforeAll ,afterAll} from '@jest/globals';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import dayjs ,{Dayjs} from 'dayjs';
import { pid } from 'node:process';

import { TOKEN_RECORD } from '../src/j-quants/Types';
import { DefaultAPITokenStore } from '../src/j-quants/DefaultAPITokenStore';

const YAML_FILE = "tokens-db.yaml";
let yaml_temp_dir:string = path.join( os.tmpdir() , `${pid}-${(Math.random() * 1E+10)}` );
let yaml_temp_path:string = path.join( yaml_temp_dir , YAML_FILE );

// beforeAll(()=>
// {
// 	yaml_temp_dir = path.join( os.tmpdir() , `${pid}-${(Math.random() * 1E+10)}` );
// 	yaml_temp_path =  path.join( yaml_temp_dir , YAML_FILE );
// });

afterAll(()=>
{
	console.log("Remove YAML file and dir.");
	try{
		fs.removeSync( yaml_temp_path );
		fs.rmdirSync( yaml_temp_dir );
	}
	catch (e)
	{
		//console.log( e );
	}
});

describe('Basic CRUD tests',()=>
{
	const ts = new DefaultAPITokenStore({yaml_file: yaml_temp_path });

	describe('First reads returns undefined.',()=>
	{
		test('First Reads is faild.',()=>
		{
			expect( ts.get_refresh_token_info() )
				.toBeUndefined();
			
			expect( ts.get_id_token_info() )
				.toBeUndefined()
		});
	});

	describe('Set refresh token and get',()=>{

		const refresh_token = 'refresh-1234567890';
		const expiration_date = dayjs().add(10,'day');

		test('set refresh token.',()=>
		{
			const rec:TOKEN_RECORD = {
				token: refresh_token,
				expiration: expiration_date
			}

			expect( ts.set_refresh_token_info( rec ) )
				.toBeTruthy();
		});
		
		test('get refresh token.' ,()=>
		{
			const rec = ts.get_refresh_token_info();
			expect( rec ).toBeDefined();
			expect( 'token' in (rec as TOKEN_RECORD) ).toBeTruthy();
			expect( 'expiration' in (rec as TOKEN_RECORD) ).toBeTruthy();

			expect( rec?.token ).toBe( refresh_token );
			expect( rec?.expiration instanceof dayjs ).toBeTruthy();
			expect( rec?.expiration.isSame( expiration_date ) )
				.toBeTruthy();
		});

		test('Update refresh token.',()=>
		{
			const new_token = 'refresh-abcdefghijklmn';
			const new_expiration = dayjs().add(1,'day');

			expect(
				ts.set_refresh_token_info({
					token: new_token,
					expiration: new_expiration
				})
			).toBeTruthy();

			const rec = ts.get_refresh_token_info();

			expect( rec?.token ).toBe( new_token );
			expect( rec?.expiration instanceof dayjs ).toBeTruthy();
			expect( rec?.expiration.isSame( new_expiration) )
				.toBeTruthy();
		});

	});

	describe('Set ID token and get',()=>{

		const id_token = 'id-1234567890';
		const expiration_date = dayjs().add(10,'day');

		test('set ID token.',()=>
		{
			const rec:TOKEN_RECORD = {
				token: id_token,
				expiration: expiration_date
			}

			expect( ts.set_refresh_token_info( rec ) )
				.toBeTruthy();
		});
		
		test('get ID token.' ,()=>
		{
			const rec = ts.get_refresh_token_info();
			expect( rec ).toBeDefined();
			expect( 'token' in (rec as TOKEN_RECORD) ).toBeTruthy();
			expect( 'expiration' in (rec as TOKEN_RECORD) ).toBeTruthy();

			expect( rec?.token ).toBe( id_token );
			expect( rec?.expiration instanceof dayjs ).toBeTruthy();
			expect( rec?.expiration.isSame( expiration_date ) )
				.toBeTruthy();
		});

		test('Update ID token.',()=>
		{
			const new_token = 'id-abcdefghijklmn';
			const new_expiration = dayjs().add(1,'day');

			expect(
				ts.set_refresh_token_info({
					token: new_token,
					expiration: new_expiration
				})
			).toBeTruthy();

			const rec = ts.get_refresh_token_info();

			expect( rec?.token ).toBe( new_token );
			expect( rec?.expiration instanceof dayjs ).toBeTruthy();
			expect( rec?.expiration .isSame( new_expiration) )
				.toBeTruthy();
		});

	});
		
});