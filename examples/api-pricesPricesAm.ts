/*
# 前場四本値(/prices/prices_am) API Sample

プレミアムプラン以上

> 当日のデータは翌日6:00頃まで取得可能

つまり、休場の日は取得できないので注意

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
$ ts-node api-pricesPricesAm.ts
```

*/

import JQC from '../src/j-quants';
import { DotEnvCredentialStore, YAMLAPITokenStore } from '../src/extra';
import {isAxiosError} from '../src/type-guard';	// This is a wrapper around axios.isAxiosError().

// if you install `@tettekete/jquants-client` package, you can use it like this:
// import JQC from '@tettekete/jquants-client';
// import { DotEnvCredentialStore, YAMLAPITokenStore } from '@tettekete/jquants-client/extra';
// import { isAxiosError } from '@tettekete/jquants-client/type-guard';

const jqc = new JQC({
	credsStore: new DotEnvCredentialStore(),
	tokenStore: new YAMLAPITokenStore()
});

(async ()=>{

	let r = await jqc.pricesPricesAm(
		{
			code: '7203'
		}
	);

	if( r.ok )
	{
		// r.data is inferred as PricePricesAmResponse,
		// so you can access properties like r.data.daily_quotes[0].Code

		console.log( JSON.stringify( r.data ,null,2 ) );
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