import ExURL ,{ HTTP_METHODS_T } from './util/exUrl';
import Result from './util/result';
import { getLogger } from './util/logger';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const lg = getLogger("trace");

type API_CONFIG_T =
{
	path: string;
	method: HTTP_METHODS_T;
}


export default class JQuantsAPIHandler
{
	private static readonly baseURL = new ExURL('https://api.jquants.com/v1/');
	private static readonly URLs: {	[key: string]: API_CONFIG_T } =
	{
		refresh_api:
		{
			path: 'token/auth_user',
			method: 'POST'
		},
		id_token_api:
		{
			path: 'token/auth_refresh',
			method: 'POST'
		}
	}

	private static _api_url_maker( url_for: string ): ExURL
	{
		if( ! JQuantsAPIHandler.URLs.hasOwnProperty( url_for ) )
		{
			throw Error(`"${url_for}" is unknown api symbol`);
		}

		let baseURL: ExURL			= JQuantsAPIHandler.baseURL.clone();
		let target: API_CONFIG_T	= JQuantsAPIHandler.URLs[url_for];

		let api_url = baseURL.withPath( target.path );
		api_url.method = target.method as HTTP_METHODS_T;

		return api_url;
	}

	get refresh_api_url()
	{
		return JQuantsAPIHandler._api_url_maker( 'refresh_api' );

	}
	
	// - - - - - - - - - - - - - - - - - - - -
	async request_with_axios( req: AxiosRequestConfig ): Promise<Result>
	{
		let result: Result;
		try
		{
			lg.trace(`request_with_axios: ${req.method} ${req.url}`);
			const res: AxiosResponse = await axios( req );
			
			lg.trace(`status: ${res.status} ${res.statusText}`);
			result = Result.success(res.data);
		}
		catch (e: any)
		{
			result = Result.failure( e.response );
		}

		return result;
	}

	// - - - - - - - - - - - - - - - - - - - -
	async getRefreshToken(
	{
		email,
		password
	}
	:{
		email:		string,
		password:	string
	}): Promise<Result>
	{
		let exurl = this.refresh_api_url;
		const req: AxiosRequestConfig =
		{
			url:	exurl.toString(),
			method: exurl.method,
			data:
			{
				mailaddress: email,
				password: password
			}
		}

		let r = await this.request_with_axios( req )

		return r
	}
}