/*
# 上場銘柄一覧(/listed/info) API Sample

フリープラン以上

- [“上場銘柄一覧(/listed/info) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/listed_info)

## Ready

カレントディレクトリに `.env` ファイルを作成し JQ_USER,JQ_PASSWORD に
ログインユーザ(email)・パスワードを記述しておいてください

```text:.env
JQ_USER="<jquants-login-id>"
JQ_PASSWORD="<jquants-password>"
```

## USAGE

```sh
$ cd example
$ ts-node api-listedInfo.ts
```

## Examples with `jq`

`jq` を使って銘柄コードと銘柄名を抽出する例:

```sh
# 全銘柄
$ ts-node api-listedInfo.ts | jq -r '.info[] | "\(.Code): \(.CompanyName)"'

# プライム銘柄のみ
$ ts-node api-listedInfo.ts | jq -r '.info[] | select(.MarketCode == "0111") | "\(.Code): \(.CompanyName)"'

# あるいは TSV 形式にするなら
$ ts-node api-listedInfo.ts | jq -r '.info[] | [.Code, .CompanyName] | @tsv'
```

*/

import JQC from '../src';
import { DotEnvCredentialStore, YAMLAPITokenStore } from '../src/extra';
import {isAxiosError} from '../src/type-guard';	// This is a wrapper around axios.isAxiosError().

// if you install `@tettekete/jquants-api-client` package, you can use it like this:
// import JQC from '@tettekete/jquants-api-client';
// import { DotEnvCredentialStore, YAMLAPITokenStore } from '@tettekete/jquants-api-client/extra';
// import { isAxiosResponse } from '@tettekete/jquants-api-client/type-guard';

const jqc = new JQC({
	credsStore: new DotEnvCredentialStore(),
	tokenStore: new YAMLAPITokenStore(),
	logLevel: 'trace'
});

(async ()=>{

	const r = await jqc.listedInfo(
		{
			// code: '7203',
			// date: '2024-07-31'
		}
	);

	if( r.ok )
	{
		// r.data is inferred as ListedInfoResponse,
		// so you can access properties like r.data.info[0].Code
		
		console.log( JSON.stringify( r.data ,null,2 ) );

		// If you'd prefer not to import the Result module, you can
		// also write it like this:
		//
		// import {isListedInfoResponse} from '../src/type-guard';
		// if( r.ok && r.data && isListedInfoResponse( r.data ) )
		// {
		// 	console.log( JSON.stringify( r.data ,null,2 ) );
		// }
	}
	else
	{
		// r.data is of type AxiosError | unknown.
		// If it's unknown, it might actually be an Error object or undefined.
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
