
import fs from 'fs-extra';
import path from 'path';

import { JQCredentialStore } from '../../types';

export class DotEnvCredentialStore extends JQCredentialStore
{
	private _env_file: string;
	private _user:	string | undefined	= undefined;
	private _pw:	string | undefined	= undefined;

	constructor(
		{
			env_file = '.env',
			env_dir = process.cwd()
		}:
		{
			env_file?: string;
			env_dir?: string;
		} = {}
	)
	{
		super();
		this._env_file = path.resolve( path.join( env_dir , env_file ) );
	}

	loadCreds()
	{
		const content = fs.readFileSync( this._env_file , 'utf8');	// 敢えて try catch しない

		const subsExpRegex = /^\s*(\w+)=["']?(.+?)["']?$/gm;
		
		let match;
		while( ( match = subsExpRegex.exec(content)) !== null )
		{
			switch( match[1].toLowerCase() )
			{
				case 'jq_user':
					this._user = match[2];

					break;

				case 'jq_password':
					this._pw = match[2];
					break;
			}

			if( this._user && this._pw )
			{
				break;
			}
		}
	}

	async user(): Promise<string>
	{
		if( ! this._user ){ this.loadCreds() }

		return this._user ?? '';
	}

	async password(): Promise<string>
	{
		if( ! this._pw ){ this.loadCreds() }
		return this._pw ?? '';
	}
}