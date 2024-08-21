import { loadCredential } from './util/credential-loader';
import { getLogger } from './util/logger';
import JQH from './j-quants';

const lg = getLogger("trace");
// config.yaml を読み込む
const creds = loadCredential('credentials.yaml');

// クレデンシャル情報の使用例
lg.trace(`user: ${creds.user}`);
lg.trace(`password: ${creds.password}`);


async function main()
{
	const jqh = new JQH();
	let r = await jqh.getRefreshToken({
				email: creds.user,
				password: creds.password
			})

	let refresh_token: string;
	if( r.ok )
	{
		refresh_token = r.data.refreshToken;
		lg.trace(`refresh_token: "${refresh_token}"`)
	}
	else
	{
		lg.error(`faild to get refresh token: ${r.data.statusCode} ${r.data.statusText}`)
	}
}

main()
