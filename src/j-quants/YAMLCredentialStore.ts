import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import { JQCredentialStore } from './Types';

export class YAMLCredentialStore extends JQCredentialStore
{
	private _yaml_file: string;
	private _user:	string | undefined	= undefined;
	private _pw:	string | undefined	= undefined;

	constructor(
		{
			yaml_file = path.join(  process.cwd() , 'credentials.yaml' )
		}:
		{
			yaml_file?: string;
		} = {}
	)
	{
		super();
		this._yaml_file = path.resolve( yaml_file );
	}

	loadCreds()
	{
		const file = fs.readFileSync( this._yaml_file , 'utf8');
  		const { user , password } = yaml.parse(file);
		this._user	= user;
		this._pw	= password;
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