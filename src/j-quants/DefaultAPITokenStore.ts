import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import dayjs from 'dayjs';

import {APITokenStore ,TOKEN_RECORD } from './Types';


export class DefaultAPITokenStore extends APITokenStore
{
	private _YAML_FILE =  path.join( process.cwd(), "tokens-db.yaml" );

	set yaml_file( file_path:string )
	{
		this._YAML_FILE = file_path;
	}

	constructor(
		{
			yaml_file
		}
		:{
			yaml_file?: string
		} = {}
	)
	{
		super();
		if( yaml_file )
		{
			this._YAML_FILE = yaml_file;
		};
	}

	private _read_token_store(): string | undefined
	{
		let content: string | undefined;
		let has_err = false;
		const file_path = this._YAML_FILE;

		try
		{
			content = fs.readFileSync( file_path , 'utf8');
		}
		catch(e:unknown )
		{
			has_err = true;
			if (e instanceof Error )
			{
				const errorWithCode = e as { code?: string };
				if( errorWithCode.code !== 'ENOENT' )
				{
					// 「ファイルが存在しない」以外の時エラー出力
					console.error( e.message );
				}
			}
		}

		if( has_err ){ return undefined }

		return content;
	}

	private _write_token_store( content: string ): boolean
	{
		let has_err = false;
		const file_path = this._YAML_FILE;
		const dir_path = path.dirname( file_path );
		try
		{
			fs.ensureDirSync( dir_path );
			fs.writeFileSync( file_path , content );
		}
		catch( e: unknown )
		{
			has_err = true;
			if (e instanceof Error )
			{
				const errorWithCode = e as { code?: string };
				if( errorWithCode.code !== 'ENOENT' )
				{
					// 「ファイルが存在しない」以外の時エラー出力
					console.error( e.message );
				}
			}
		}

		if( has_err ){ return false }
		return true;
	}

	
	get_refresh_token_info()
	{
		const content = this._read_token_store();
		
		if( content === undefined ){ return undefined };

		const yaml_data = yaml.parse( content );
		const result:TOKEN_RECORD = {
			token: yaml_data.refresh_token,
			expiration: dayjs(yaml_data.refresh_token_expiration)
		};

		return result;
	}


	set_refresh_token_info({token,expiration}:TOKEN_RECORD):boolean
	{
		const content = this._read_token_store();
		let yaml_data = content === undefined ? {} : yaml.parse( content );
		const refresh_token_record =
		{
			refresh_token: token,
			refresh_token_expiration: expiration.toISOString()
		};

		yaml_data = {...yaml_data , ...refresh_token_record };
		const success = this._write_token_store(
												yaml.stringify( yaml_data )
											);
		
		return success;
	}


	get_id_token_info():TOKEN_RECORD | undefined
	{
		const content = this._read_token_store();
		
		if( content === undefined ){ return undefined };

		const yaml_data = yaml.parse( content );
		const result:TOKEN_RECORD = {
			token: yaml_data.id_token,
			expiration: dayjs(yaml_data.id_token_expiration)
		};

		return result;
	}


	set_id_token_info({token,expiration}:TOKEN_RECORD):void
	{
		const content = this._read_token_store();
		let yaml_data = content === undefined ? {} : yaml.parse( content );
		const id_token_record =
		{
			id_token: token,
			id_token_expiration: expiration.toISOString()
		};

		yaml_data = {...yaml_data , ...id_token_record };
		this._write_token_store( yaml.stringify( yaml_data ) );
	}
}

