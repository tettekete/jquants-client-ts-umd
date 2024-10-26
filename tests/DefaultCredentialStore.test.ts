import {jest,describe, expect, test ,beforeAll ,afterAll} from '@jest/globals';

import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { pid } from 'node:process';

import { DefaultCredsStore } from '../src/j-quants/DefaultCredentialStore'

const env_file = "creds.env";
let env_temp_dir:string = path.join( os.tmpdir() , `${pid}-${(Math.random() * 1E+10)}` );
let env_temp_path:string = path.join( env_temp_dir , env_file );
const env_content = `
# this is comment line

# with double quoted
JQ_USER="foo-bar"

# indent and single quote
	JQ_PASSWORD='hoge-moge'

`;

fs.ensureDirSync( env_temp_dir );
fs.writeFileSync( env_temp_path , env_content );

afterAll(()=>
{
	console.log("Remove YAML file and dir.");
	try{
		fs.removeSync( env_temp_path );
		fs.rmdirSync( env_temp_dir );
	}
	catch (e)
	{
		console.error( e instanceof Error ? e.message : e );
	}
});

describe('Basic test',()=>
{
	test("Read env file.",()=>
	{
		const store = new DefaultCredsStore(
			{
				env_file: env_temp_path
			}
		)

		expect( store.user() ).toBe( 'foo-bar' );
		expect( store.password() ).toBe( 'hoge-moge' );
	})
});
