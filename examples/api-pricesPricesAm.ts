/*
# 前場四本値(/prices/prices_am) API Sample

プレミアムプラン以上

> 前場終了時に、前場の株価データを取得することができます。
> 当日のデータは翌日6:00頃まで取得可能

以下の期間はデータが取得できず unknown エラーとなる

- 平日: 06:00 - 11:30
- 土曜: 06:00 以降
- 日曜: 終日
- 前日が開場日ではない祝祭日等休場日: 終日

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

import JQC from '../src';
import { DotEnvCredentialStore, YAMLAPITokenStore } from '../src/extra';
import {isAxiosError} from '../src/type-guard';	// This is a wrapper around axios.isAxiosError().

// if you install `@tettekete/jquants-api-client` package, you can use it like this:
// import JQC from '@tettekete/jquants-api-client';
// import { DotEnvCredentialStore, YAMLAPITokenStore } from '@tettekete/jquants-api-client/extra';
// import { isAxiosError } from '@tettekete/jquants-api-client/type-guard';

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