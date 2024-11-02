
import fs from 'fs-extra';
import path from 'path';

import { JQCredentialStore } from './Types';

export class DefaultCredsStore extends JQCredentialStore
{
	private _env_file: string;
	private _user:	string | undefined	= undefined;
	private _pw:	string | undefined	= undefined;

	constructor(
		{
			env_file = path.join(  process.cwd() , '.env' )
		}:
		{
			env_file?: string;
		} = {}
	)
	{
		super();
		this._env_file = env_file;
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

	user(): string
	{
		if( ! this._user ){ this.loadCreds() }

		return this._user ?? '';
	}

	password(): string
	{
		if( ! this._pw ){ this.loadCreds() }
		return this._pw ?? '';
	}
}