/*
# オプション四本値(/derivatives/options) API Sample

プレミアムプラン以上

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
$ ts-node api-derivativesOptions.ts
```

*/

import dayjs from 'dayjs';

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

	let r = await jqc.derivativesOptions(
		{
			date: dayjs(),
			category: 'NK225E'
		}
	);

	if( r.ok )
	{
		// r.data is inferred as DerivativesOptionsResponse,
		// so you can access properties like r.data.options[0].Code
		
		console.log( JSON.stringify( r.data ,null,2 ) );

		// If you'd prefer not to import the Result module, you can
		// also write it like this:
		//
		// import {isDerivativesOptionsResponse} from '../src/type-guard';
		// if( r.ok && isDerivativesOptionsResponse( r.data ) )
		// {
		// 	console.log( r.data.options[0].Code );
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
