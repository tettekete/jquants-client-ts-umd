/*

refreshToken の取得を行うサンプルコードです。

本クライアントモジュールを使う場合、API コール時に自動的に refreshToken の取得が行われるため
通常はこのコードを直接実行する必要はありません。


# READY

カレントディレクトリに `.env` ファイルを作成し JQ_USER,JQ_PASSWORD に
ログインユーザ(email)・パスワードを記述しておいてください。

`./.env` file example:

```text:examples/.env
JQ_USER="<jquants-login-id>"
JQ_PASSWORD="<jquants-password>"
```

# USAGE

```
$ cd example
$ ts-node 00-2.getRefreshToken.ts
```
*/


import JQC from '../src/j-quants';
import { DotEnvCredentialStore, YAMLAPITokenStore } from '../src/extra';

// if you install `@tettekete/jquants-client` package, you can use it like this:
// import JQC ,{ isTokenSet } from '@tettekete/jquants-client';
// import { DotEnvCredentialStore, YAMLAPITokenStore } from '@tettekete/jquants-client/extra';

const jqc = new JQC(
	{
		credsStore: new DotEnvCredentialStore(),
			// .env ファイルからログイン情報を取得します。
		tokenStore: new YAMLAPITokenStore(),
			// カレントディレクトリに `tokens-db.yaml` を作成し、トークンを保存します。
			// もし `tokens-db.yaml` が存在する場合は、そこからトークンを読み込みます。
		logLevel: 'trace'
			// ID Token 及び Refresh Token の取得を行ったか、まだ有効な前回のトークンを利用したか、
			// 等の情報をログ出力します。
	}
);

(async()=>
{
	const refreshToken = await jqc.getRefreshToken();
	if( refreshToken )
	{
		console.log(`refresh_token: ${refreshToken}`);
	}
	else
	{
		console.error('refresh_token is not available.');
	}
})()


