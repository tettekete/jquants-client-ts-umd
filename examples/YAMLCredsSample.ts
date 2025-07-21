/*
# YAMLCredentialStore の使い方サンプル

## Ready

このファイルから見て `../credentials.yaml` にファイルを作り以下の様に
ログイン情報を設定してください。

```yaml:credentials.yaml
---
user: <jquants-login-id>
password: <jquants-password>
```

カレントディレクトリに `tokens-db.yaml` がある場合予め削除しておいてください
（リフレッシュトークン等キャッシュを使ってしまうのを避けるため）

## USAGE

```sh
$ cd example
$ ts-node YAMLCredsSample.ts
```

*/

import path from 'path';
import JQC from '../src/j-quants';
import { YAMLCredentialStore } from '../src/extra';
import {isAxiosError} from '../src/type-guard';	// This is a wrapper around axios.isAxiosError().

// if you install `@tettekete/jquants-client` package, you can use it like this:
// import JQC from '@tettekete/jquants-client';
// import { YAMLCredentialStore } from '@tettekete/jquants-client/extra';
// import { isAxiosError } from '@tettekete/jquants-client/type-guard';

import Result from '@tettekete/result';

// set moduleResolution to NodeNext or node16 in tsconfig.json

const creds_store = new YAMLCredentialStore(
	{
		yaml_file: path.resolve( path.join( __dirname , '../credentials.yaml') )
	}
);

const jqc = new JQC(
	{
		credsStore: creds_store,
		logLevel: 'trace'
	}
);

(async ()=>
{

	const r = await jqc.marketsTradingCalendar(
		{
			holidaydivision: 0,
			from: '2023-01-01',
			to: '2023-12-31'
		}
	);

	if( Result.isSuccess( r ) )
	{
		if( typeof r.data === 'object' )
		{
			console.log( JSON.stringify( r.data ,null,2 ) );
		}
		else
		{
			console.log( r.data );
		}
	}
	else
	{
		console.error( r.message );

		if( isAxiosError( r.data ) )
		{
			const error = r.data;
			console.error( `Error: ${error.message}` );
			if( error.response )
			{
				console.error( `status: ${error.response.status} ${error.response.statusText}` );
				console.error( error.response.data?.message );
			}
		}
		else if( r.data instanceof Error )
		{
			console.error( `Error: ${r.data.message}` );
		}
		else
		{
			console.error( `Unknown error.` );
		}
	}
})()
