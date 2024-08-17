import url from 'node:url';
import { loadCredential } from './util/credential-loader';
import { getLogger } from './util/logger';
import ExURL from './util/exUrl';

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const lg = getLogger("trace");
// config.yaml を読み込む
const creds = loadCredential('credentials.yaml');

// クレデンシャル情報の使用例
lg.trace(`user: ${creds.user}`);
lg.trace(`password: ${creds.password}`);

//
const api_base_url = new ExURL('https://api.jquants.com/v1/');

const refresh_api = api_base_url.withPath( 'token/auth_user' );
refresh_api.method = "POST";

lg.trace(`api_base_url: ${api_base_url.toString()}`);
lg.trace(`refresh_api: ${refresh_api.toString()}`);

const req: AxiosRequestConfig =
{
	url:	refresh_api.toString(),
	method: refresh_api.method,
	data:
	{
		mailaddress: creds.user,
		password: creds.password
	}
}
