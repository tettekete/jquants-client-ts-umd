import ExURL ,{ HTTP_METHODS_T } from './util/exUrl';
import Result ,{ResultMakerArgsT} from '@tettekete/result';
import { getLogger } from './util/logger';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import dayjs ,{Dayjs} from 'dayjs';
import pino from 'pino';

import { DefaultAPITokenStore } from './j-quants/DefaultAPITokenStore';
import { APITokenStore ,TOKEN_RECORD ,Logger_T} from './j-quants/Types';
export { APITokenStore } from './j-quants/Types';

type API_CONFIG_T =
{
	path: string;
	method: HTTP_METHODS_T;
}

// 投資部門別情報 - 市場名
export type INVESTMENT_CATEGORY_T = 'TSE1st' | 'TSE2nd' | 'TSEMothers' | 'TSEJASDAQ' | 'TSEPrime' | 'TSEStandard' | 'TSEGrowth' | 'TokyoNagoya';

/* 取引カレンダー - 休日区分
|項目|値|
|---|---|
|非営業日				|0|
|営業日					|1|
|東証半日立会日			|2|
|非営業日(祝日取引あり)	|3|
*/
export type HOLIDAY_DIVISION_T = 0 | 1 | 2 | 3;


/* 先物四本値 - 先物商品区分コード

API: /derivatives/futures

|コード|商品区分名称|データ収録期間|
|---|---|---|
|TOPIXF|TOPIX先物|2008/5/7〜|
|TOPIXMF|ミニTOPIX先物|2008/6/16〜|
|MOTF|マザーズ先物|2016/7/19〜|
|NKVIF|日経平均VI先物|2012/2/27〜|
|NKYDF|日経平均・配当指数先物|2010/7/26〜|
|NK225F|日経225先物|2008/5/7〜|
|NK225MF|日経225mini先物|2008/5/7〜|
|JN400F|JPX日経インデックス400先物|2014/11/25〜|
|REITF|東証REIT指数先物|2008/6/16〜|
|DJIAF|NYダウ先物|2012/5/28〜|
|JGBLF|長期国債先物|2008/5/7〜|
|NK225MCF|日経225マイクロ先物|2023/5/29〜|
|TOA3MF|TONA3ヶ月金利先物|2023/5/29〜|
*/
export type DERIVATIVES_FUTURES_CAT_T	= 'TOPIXF'
										| 'TOPIXMF'
										| 'MOTF'
										| 'NKVIF'
										| 'NKYDF'
										| 'NK225F'
										| 'NK225MF'
										| 'JN400F'
										| 'REITF'
										| 'DJIAF'
										| 'JGBLF'
										| 'NK225MCF'
										| 'TOA3MF'
										;


/* オプション四本値 - オプション商品区分コード
API: /derivatives/options

|商品区分コード|商品区分名称|データ収録期間|
|---|---|---|
|TOPIXE|TOPIXオプション|2008/5/7〜|
|NK225E|日経225オプション|2008/5/7〜|
|JGBLFE|長期国債先物オプション|2008/5/7〜|
|EQOP|有価証券オプション|2014/11/17〜|
|NK225MWE|日経225miniオプション|2023/5/29〜|
*/
export type DERIVATIVES_OPTIONS_CAT_T	= 'TOPIXE'
										| 'NK225E'
										| 'JGBLFE'
										| 'EQOP'
										| 'NK225MWE'
										;

const kRefreshTokenTTL	= 7 * 24 * 3600;
const kIdTokenTTL		= 24 * 3600;

export default class JQuantsAPIHandler
{
	logger: Logger_T;
	private _refresh_token	: TOKEN_RECORD | undefined;
	private _id_token		: TOKEN_RECORD | undefined;
	private _auth_email		: string | undefined;
	private _auth_password	: string | undefined;
	private _token_store	: APITokenStore;
	private _last_result	: Result | undefined;

	private _refresh_token_TTL	= kRefreshTokenTTL;
	private _id_token_TTL 		= kIdTokenTTL

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
		},
		listed_info:
		{
			path: 'listed/info',
			method: 'GET'
		},
		prices_daily_quotes:
		{
			path: 'prices/daily_quotes',
			method: 'GET'
		},
		prices_prices_am:
		{
			path: 'prices/prices_am',
			method: 'GET'
		},
		markets_trades_spec:
		{
			path: 'markets/trades_spec',
			method: 'GET'
		},
		markets_weekly_margin_interest:
		{
			path: 'markets/weekly_margin_interest',
			method: 'GET'
		},
		markets_short_selling:
		{
			path: 'markets/short_selling',
			method: 'GET'
		},
		markets_breakdown:
		{
			path: 'markets/breakdown',
			method: 'GET'
		},
		markets_trading_calendar:
		{
			path: 'markets/trading_calendar',
			method: 'GET'
		},
		indices:
		{
			path: 'indices',
			method: 'GET'
		},
		indices_topix:
		{
			path: 'indices/topix',
			method: 'GET'
		},
		fins_statements:
		{
			path: 'fins/statements',
			method: 'GET'
		},
		fins_fs_details:
		{
			path: 'fins/fs_details',
			method: 'GET'
		},
		fins_dividend:
		{
			path: 'fins/dividend',
			method: 'GET'
		},
		fins_announcement:
		{
			path: 'fins/announcement',
			method: 'GET'
		},
		option_index_option:
		{
			path: 'option/index_option',
			method: 'GET'
		},
		derivatives_futures:
		{
			path: 'derivatives/futures',
			method: 'GET'
		},
		derivatives_options:
		{
			path: 'derivatives/options',
			method: 'GET'
		},
	}

	// - - - - - - - - - - - - - - - - - - - -
	// common getter / setter
	// - - - - - - - - - - - - - - - - - - - -
	set refresh_token_ttl( ttl: number )
	{
		this._refresh_token_TTL = ttl
	}

	get refresh_token_ttl(): number
	{
		return this._refresh_token_TTL ?? kRefreshTokenTTL;
	}

	set id_token_ttl( ttl: number )
	{
		this._id_token_TTL = ttl;
	}

	get id_token_ttl(): number
	{
		return this._id_token_TTL ?? kIdTokenTTL;
	}

	set token_store( token_srore: APITokenStore )
	{
		this._token_store = token_srore;
	}

	get token_store(): APITokenStore | undefined
	{
		return this._token_store;
	}

	set refresh_token( token: TOKEN_RECORD | undefined )
	{
		this._refresh_token = token
	}
	
	get refresh_token(): string | undefined
	{
		// レコードが登録されていて期限切れで無ければトークンを返す
		if( this._refresh_token )
		{
			const expiration = dayjs( this._refresh_token.expiration );
			if( dayjs().isBefore( expiration ) )
			{
				return this._refresh_token.token;
			}
		}
		return undefined;
	};

	set id_token( token: TOKEN_RECORD | undefined )
	{
		this._id_token = token
	};

	get id_token(): string | undefined
	{
		// レコードが登録されていて期限切れで無ければトークンを返す
		if( this._id_token )
		{
			const expiration = dayjs( this._id_token.expiration );
			if( dayjs().isBefore( expiration ) )
			{
				return this._id_token.token;
			}
		}
		return undefined;
	};

	get last_result(): Result | undefined
	{
		return this._last_result;
	}

	// alias for accessing logger with a short name
	get lg(): Logger_T
	{
		return this.logger;
	}

	// - - - - - - - - - - - - - - - - - - - -
	// API URLs getter
	// - - - - - - - - - - - - - - - - - - - -

	get refresh_api_url()		{ return JQuantsAPIHandler._api_url_maker( 'refresh_api' ) }
	get id_token_api_url()		{ return JQuantsAPIHandler._api_url_maker( 'id_token_api' ) }
	get listed_info_api_url()	{ return JQuantsAPIHandler._api_url_maker( 'listed_info' ) }
	get prices_daily_quotes_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'prices_daily_quotes' ) }
	get prices_prices_am_api_url()
								{ return  JQuantsAPIHandler._api_url_maker( 'prices_prices_am' ) }
	get markets_trades_spec_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'markets_trades_spec' ) }
	get markets_weekly_margin_interest_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'markets_weekly_margin_interest' ) }
	get markets_short_selling_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'markets_short_selling' ) }
	get markets_breakdown_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'markets_breakdown' ) }
	get markets_trading_calendar_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'markets_trading_calendar' ) }
	get indices_api_url()		{ return JQuantsAPIHandler._api_url_maker( 'indices' ) }
	get indices_topix_api_url()	{ return JQuantsAPIHandler._api_url_maker( 'indices_topix' ) }
	get fins_statements_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'fins_statements' ) }
	get fins_fs_details_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'fins_fs_details' ) }
	get fins_dividend_api_url()	{ return JQuantsAPIHandler._api_url_maker( 'fins_dividend' ) }
	get fins_announcement_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'fins_announcement' ) }
	get optionIndexOption_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'option_index_option' ) }
	get derivatives_futures_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'derivatives_futures' ) }
	get derivatives_options_api_url()
								{ return JQuantsAPIHandler._api_url_maker( 'derivatives_options' ) }


	
	//                       _                   _             
	//    ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
	//   / __/ _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
	//  | (_| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
	//   \___\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
	//                                                         
	constructor({
		email,
		password,
		token_store = new DefaultAPITokenStore(),
		log_level = 'error'
	}:
	{
		email			?: string | undefined;
		password		?: string | undefined;
		token_store		?: APITokenStore
		log_level		?: pino.Level
	} = {})
	{
		this._auth_email	= email;
		this._auth_password	= password;
		this._token_store	= token_store;

		this.logger = getLogger( log_level );
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


	// - - - - - - - - - - - - - - - - - - - -
	// axios utilities
	// - - - - - - - - - - - - - - - - - - - -
	//                                  _              _ _   _                   _           
	//   _ __ ___  __ _ _   _  ___  ___| |_  __      _(_) |_| |__      __ ___  _(_) ___  ___ 
	//  | '__/ _ \/ _` | | | |/ _ \/ __| __| \ \ /\ / / | __| '_ \    / _` \ \/ / |/ _ \/ __|
	//  | | |  __/ (_| | |_| |  __/\__ \ |_   \ V  V /| | |_| | | |  | (_| |>  <| | (_) \__ \
	//  |_|  \___|\__, |\__,_|\___||___/\__|___\_/\_/ |_|\__|_| |_|___\__,_/_/\_\_|\___/|___/
	//               |_|                  |_____|                |_____|                     
	// - - - - - - - - - - - - - - - - - - - -
	async request_with_axios(
		req: AxiosRequestConfig,
		extractor: (res:AxiosResponse) => any = (res) => { res.data }
	): Promise<Result>
	{
		let result: Result;
		try
		{
			this.lg.trace(`request_with_axios: ${req.method} ${req.url}`);
			const res: AxiosResponse = await axios( req );

			this.lg.trace(`request path: ${res.request.path}`);
			this.lg.trace(`status: ${res.status} ${res.statusText}`);

			let data = extractor( res );
			result = Result.success( data );

			this.lg.trace(`data: ${JSON.stringify( res.data ,null ,2)}`.substring(0,80) + ' ...');
		}
		catch (e: unknown )
		{
			if( e instanceof AxiosError )
			{
				result = Result.failure( e.response );
			}
			else
			{
				result = Result.failure( "Unknown error" , [e] );
			}
			
		}

		return this.returnResult( result );
	}
	
	async _request_wiith_auth_header(
		{
			url,
			params
		}:
		{
			url: ExURL;
			params: { [key in string]: string | number }
		}
	): Promise<Result>
	{
		const req: AxiosRequestConfig =
		{
			url:	url.toString(),
			method: url.method,
			headers:
			{
				Authorization: this.id_token
			}
		}

		if( Object.keys(params).length )
		{
			req['params'] = params;
		}

		let r = await this.request_with_axios( req ,(res) => {return res.data });

		return this.returnResult( r );
	}

	//             __               _   _____     _                  
	//   _ __ ___ / _|_ __ ___  ___| |_|_   _|__ | | _____ _ __  ___ 
	//  | '__/ _ \ |_| '__/ _ \/ __| '_ \| |/ _ \| |/ / _ \ '_ \/ __|
	//  | | |  __/  _| | |  __/\__ \ | | | | (_) |   <  __/ | | \__ \
	//  |_|  \___|_| |_|  \___||___/_| |_|_|\___/|_|\_\___|_| |_|___/
	//                                                               
	// - - - - - - - - - - - - - - - - - - - -
	/*
		1. token_store から ID トークンを取得する
			-> 期限が切れていない
			-> 完了
		2. token_store から リフレッシュトークンを取得する
			-> 期限が切れていない
				-> getIDToken で API から ID トークンを取得する
				-> token_store に登録
				-> 完了
		3. getRefreshToken でリフレッシュトークンを取得する
			-> token_store に保存する
			-> getIDToken で API から ID トークンを取得する
			-> token_store に保存する
			-> 完了
	*/
	
	async refreshTokens(
		{
			email,
			password
		}:
		{
			email		?: string | undefined;
			password	?: string | undefined;
		} = {}
	): Promise<Result>
	{
		let _email		= email ?? this._auth_email;
		let _password	= password ?? this._auth_password;

		if( ! _email || ! _password )
		{
			return this.failureResult("Either email or password is not defined.");
		}

		// トークンストアの状態をメンバーへ読み出す
		const stored_refresh_token = this._token_store.get_refresh_token_info();
		if( stored_refresh_token )
		{
			this.refresh_token = stored_refresh_token;
		}
		const stored_id_token = this._token_store.get_id_token_info();
		if( stored_id_token )
		{
			this.id_token = stored_id_token;
		}

		if( ! this.id_token )
		{
			if( ! this.refresh_token )
			{
				this.lg.trace('Update the Refresh and Token ID Token.');

				let r = await this.getRefreshToken({
						email: _email ,
						password: _password
				});

				if( r.ok )
				{
					r = await this.getIDToken();
				}
				else
				{
					return this.failureResult(
							"getRefreshToken faild.",
							r.data
						);
				}
				
				return this.returnResult( r );
			}
			else
			{
				this.lg.trace('Update the ID Token using a valid Refresh Token.');

				const r = await this.getIDToken();
				if( r.ng )
				{
					return this.returnResult( r );
				}
			}
		}
		else
		{
			this.lg.trace('Use the ID Token already received.')
		}

		return this.successResult();
	}

	//              _   ____       __               _   _____     _              
	//    __ _  ___| |_|  _ \ ___ / _|_ __ ___  ___| |_|_   _|__ | | _____ _ __  
	//   / _` |/ _ \ __| |_) / _ \ |_| '__/ _ \/ __| '_ \| |/ _ \| |/ / _ \ '_ \ 
	//  | (_| |  __/ |_|  _ <  __/  _| | |  __/\__ \ | | | | (_) |   <  __/ | | |
	//   \__, |\___|\__|_| \_\___|_| |_|  \___||___/_| |_|_|\___/|_|\_\___|_| |_|
	//   |___/                                                                   
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * Refresh Token 取得 API をコールしリフレッシュトークンを取得する。
	 * 
	 * 取得したトークンは this._token_store を通して保存される、また
	 * 同レコードは this.refresh_token に格納される。
	 * 
	 * @param param0 
	 * @returns 
	 */
	async getRefreshToken(
	{
		email,
		password,
	}
	:{
		email		?: string | undefined,
		password	?: string | undefined,
	} = {}): Promise<Result>
	{
		let exurl = this.refresh_api_url;
		let _email = email ?? this._auth_email;
		let _pw = password ?? this._auth_password;

		if( ! _email || ! _pw )
		{
			return this.failureResult("Either email or password is not defined.");
		}

		const req: AxiosRequestConfig =
		{
			url:	exurl.toString(),
			method: exurl.method,
			data:
			{
				mailaddress: _email,
				password: _pw
			}
		}

		function extractor( res: AxiosResponse )
		{
			return res.data.refreshToken
		}

		let r = await this.request_with_axios( req , extractor )

		if( r.ok )
		{
			const toke_rec:TOKEN_RECORD =
			{
				token: r.data as string,
				expiration: dayjs().add( this.refresh_token_ttl,'second')
			};

			this._token_store.set_refresh_token_info( toke_rec );
			this.refresh_token = toke_rec
		};

		return this.returnResult( r );
	}


	//              _   ___ ____ _____     _              
	//    __ _  ___| |_|_ _|  _ \_   _|__ | | _____ _ __  
	//   / _` |/ _ \ __|| || | | || |/ _ \| |/ / _ \ '_ \ 
	//  | (_| |  __/ |_ | || |_| || | (_) |   <  __/ | | |
	//   \__, |\___|\__|___|____/ |_|\___/|_|\_\___|_| |_|
	//   |___/                                            
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * 
	 * @param {Object} args
	 * @param {string} args.refresh_token - リフレッシュトークン
	 * @returns {Result} r - r.data is ID token when r.ok
	 * 	
	 */
	async getIDToken(
	{
		refresh_token,
	}
	:{
		refresh_token?:		string | undefined;
	} = {}): Promise<Result>
	{
		const exurl = this.id_token_api_url;

		let _refresh_token = refresh_token ?? this.refresh_token;
		if(! _refresh_token )
		{
			return this.failureResult("refresh_token not defined.");
		}

		const req: AxiosRequestConfig =
		{
			url:	exurl.toString(),
			method: exurl.method,
			params:
			{
				refreshtoken: _refresh_token
			}
		}

		function extractor( res: AxiosResponse )
		{
			return res.data.idToken
		}

		let r = await this.request_with_axios( req , extractor );

		if( r.ok )
		{
			const toke_rec:TOKEN_RECORD =
			{
				token: r.data as string,
				expiration: dayjs().add( this.id_token_ttl ,'second')
			};
			
			this._token_store.set_id_token_info( toke_rec );
			this.id_token = toke_rec;
		}

		return this.returnResult( r );
	}

	// API: /lsited/info
	//   _ _     _           _ ___        __       
	//  | (_)___| |_ ___  __| |_ _|_ __  / _| ___  
	//  | | / __| __/ _ \/ _` || || '_ \| |_ / _ \ 
	//  | | \__ \ ||  __/ (_| || || | | |  _| (_) |
	//  |_|_|___/\__\___|\__,_|___|_| |_|_|  \___/ 
	//                                             
	async listedInfo({code , date}:{code?: string, date?: string | Date | Dayjs } = {})
	{
		const params:{code?: string, date?: string } = {};
		if( code ){ params['code'] = code }
		if( date ){ params['date'] = this.toJQDate( date ) }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.listed_info_api_url,
					params: params
				}
			)
		);
	}


	// API: /prices/daily_quotes
	//              _               ____        _ _        ___              _            
	//   _ __  _ __(_) ___ ___  ___|  _ \  __ _(_) |_   _ / _ \ _   _  ___ | |_ ___  ___ 
	//  | '_ \| '__| |/ __/ _ \/ __| | | |/ _` | | | | | | | | | | | |/ _ \| __/ _ \/ __|
	//  | |_) | |  | | (_|  __/\__ \ |_| | (_| | | | |_| | |_| | |_| | (_) | ||  __/\__ \
	//  | .__/|_|  |_|\___\___||___/____/ \__,_|_|_|\__, |\__\_\\__,_|\___/ \__\___||___/
	//  |_|                                         |___/                                
	async pricesDailyQuotes(
		{
			code,
			from,
			to,
			date,
			pagination_key
		}
		:{
			code?:	string;
			from?:	string | Date | Dayjs;
			to?:	string | Date | Dayjs;
			date?:	string | Date | Dayjs;
			pagination_key?:	string
		}
	): Promise<Result>
	{
		// arg pattern validation
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('pricesDailyQuotes() requires either "code" or "date", but not both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('pricesDailyQuotes() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('In pricesDailyQuotes(), if either "from" or "to" is specified, both are required.')
		}

		const params:{ [key in string]: string} = {};
		if( code				){ params['code']			= code }
		if( from				){ params['from']			= this.toJQDate( from ) }
		if( to					){ params['to']				= this.toJQDate( to ) }
		if( date				){ params['date']			= this.toJQDate( date ) }
		if( pagination_key		){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.prices_daily_quotes_api_url,
					params: params
				}
			)
		);
	}


	// API: /prices/prices_am
	//              _               ____       _                  _              
	//   _ __  _ __(_) ___ ___  ___|  _ \ _ __(_) ___ ___  ___   / \   _ __ ___  
	//  | '_ \| '__| |/ __/ _ \/ __| |_) | '__| |/ __/ _ \/ __| / _ \ | '_ ` _ \ 
	//  | |_) | |  | | (_|  __/\__ \  __/| |  | | (_|  __/\__ \/ ___ \| | | | | |
	//  | .__/|_|  |_|\___\___||___/_|   |_|  |_|\___\___||___/_/   \_\_| |_| |_|
	//  |_|                                                                      
	/**
	 * Fetches the prices for the AM session using the JQuants API.
	 * 
	 * pagination_key is an argument for pagination, and if it was included in
	 * the previous search results, it is a parameter for obtaining the continuation.
	 * 
	 * NOTE: To use this feature, you must subscribe to the Premium Plan.
	 *
	 * @async
	 * @function pricesPricesAm
	 * @param {Object} params - The parameters for the request.
	 * @param {string} [params.code] - The stock code to filter the results (optional).
	 * @param {string} [params.pagination_key] - The pagination key for retrieving the next set of results (optional).
	 * @returns {Promise<Result>} A promise that resolves to the result of the API call.
	 */
	async pricesPricesAm({
		code,
		pagination_key
	}
	:{
		code?: string;
		pagination_key?: string
	}): Promise<Result>
	{
		const params:{code?: string, pagination_key?: string } = {};
		if( code )				{ params['code'] = code }
		if( pagination_key )	{ params['pagination_key'] = pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.prices_prices_am_api_url,
					params: params
				}
			)
		);
	}

	// API: /markets/trades_spec
	//                        _        _      _____              _           ____                  
	//   _ __ ___   __ _ _ __| | _____| |_ __|_   _| __ __ _  __| | ___  ___/ ___| _ __   ___  ___ 
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __|| || '__/ _` |/ _` |/ _ \/ __\___ \| '_ \ / _ \/ __|
	//  | | | | | | (_| | |  |   <  __/ |_\__ \| || | | (_| | (_| |  __/\__ \___) | |_) |  __/ (__ 
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/|_||_|  \__,_|\__,_|\___||___/____/| .__/ \___|\___|
	//                                                                            |_|              
	async marketsTradesSpec(
		{
			section,
			from,
			to
		}
		:{
			section?: INVESTMENT_CATEGORY_T;
			from?: string | Date | Dayjs;
			to?: string | Date | Dayjs;
		} = {}
	): Promise<Result>
	{
		const params:{ [key in string]: string} = {};

		if( section	){ params['section']	= section }
		if( from	){ params['from']		= this.toJQDate( from ) }
		if( to		){ params['to']			= this.toJQDate( to ) }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.markets_trades_spec_api_url,
					params: params
				}
			)
		);
	}

	// API: /markets/weekly_margin_interest
	//                        _        _     __        __        _    _       __  __                 _       ___       _                     _   
	//   _ __ ___   __ _ _ __| | _____| |_ __\ \      / /__  ___| | _| |_   _|  \/  | __ _ _ __ __ _(_)_ __ |_ _|_ __ | |_ ___ _ __ ___  ___| |_ 
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __\ \ /\ / / _ \/ _ \ |/ / | | | | |\/| |/ _` | '__/ _` | | '_ \ | || '_ \| __/ _ \ '__/ _ \/ __| __|
	//  | | | | | | (_| | |  |   <  __/ |_\__ \\ V  V /  __/  __/   <| | |_| | |  | | (_| | | | (_| | | | | || || | | | ||  __/ | |  __/\__ \ |_ 
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/ \_/\_/ \___|\___|_|\_\_|\__, |_|  |_|\__,_|_|  \__, |_|_| |_|___|_| |_|\__\___|_|  \___||___/\__|
	//                                                                  |___/                  |___/                                             
	async marketsWeeklyMarginInterest(
		{
			code,
			date,
			from,
			to,
			pagination_key
		}
		:{
			code?:	string;
			date?:	string | Date | Dayjs;
			from?:	string | Date | Dayjs;
			to?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		// arg pattern validation
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('marketsWeeklyMarginInterest() requires either "code" or "date", but not both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('marketsWeeklyMarginInterest() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('If “from” or “to” is used, both must be defined in marketsWeeklyMarginInterest().')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.markets_weekly_margin_interest_api_url,
					params: params
				}
			)
		);
	}


	// API: /markets/short_selling
	//                        _        _       ____  _                _   ____       _ _ _             
	//   _ __ ___   __ _ _ __| | _____| |_ ___/ ___|| |__   ___  _ __| |_/ ___|  ___| | (_)_ __   __ _ 
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __\___ \| '_ \ / _ \| '__| __\___ \ / _ \ | | | '_ \ / _` |
	//  | | | | | | (_| | |  |   <  __/ |_\__ \___) | | | | (_) | |  | |_ ___) |  __/ | | | | | | (_| |
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/____/|_| |_|\___/|_|   \__|____/ \___|_|_|_|_| |_|\__, |
	//                                                                                           |___/ 
	async marketsShortSelling(
		{
			sector33code,
			from,
			to,
			date,
			pagination_key
		}:
		{
			sector33code?: string;
			from?:	string | Date | Dayjs;
			to?:	string | Date | Dayjs;
			date?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! sector33code && ! date ) )
		{
			return this.failureResult('marketsShortSelling() requires either "code" or "date", or both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('marketsShortSelling() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('In marketsShortSelling(), if either "from" or "to" is specified, both are required.')
		}

		const params:{ [key in string]: string} = {};
		if( sector33code		){ params['sector33code']	= sector33code }
		if( from				){ params['from']			= this.toJQDate( from ) }
		if( to					){ params['to']				= this.toJQDate( to ) }
		if( date				){ params['date']			= this.toJQDate( date ) }
		if( pagination_key		){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.markets_short_selling_api_url,
					params: params
				}
			)
		);
	}


	// API: /markets/breakdown
	//                        _        _           _                    _       _                     
	//   _ __ ___   __ _ _ __| | _____| |_ ___    | |__  _ __ ___  __ _| | ____| | _____      ___ __  
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __|   | '_ \| '__/ _ \/ _` | |/ / _` |/ _ \ \ /\ / / '_ \ 
	//  | | | | | | (_| | |  |   <  __/ |_\__ \   | |_) | | |  __/ (_| |   < (_| | (_) \ V  V /| | | |
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/___|_.__/|_|  \___|\__,_|_|\_\__,_|\___/ \_/\_/ |_| |_|
	//                                       |_____|                                                  
	async marketsBreakdown(
		{
			code,
			date,
			from,
			to,
			pagination_key
		}:
		{
			code?:	string;
			date?:	string | Date | Dayjs;
			from?:	string | Date | Dayjs;
			to?: 	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('marketsBreakdown() requires either "code" or "date", but not both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('marketsBreakdown() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('If “from” or “to” is used, both must be defined in marketsBreakdown().')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.markets_breakdown_api_url,
					params: params
				}
			)
		);
	}

	// API: /markets/trading_calendar
	//                        _        _      _____              _ _              ____      _                _            
	//   _ __ ___   __ _ _ __| | _____| |_ __|_   _| __ __ _  __| (_)_ __   __ _ / ___|__ _| | ___ _ __   __| | __ _ _ __ 
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __|| || '__/ _` |/ _` | | '_ \ / _` | |   / _` | |/ _ \ '_ \ / _` |/ _` | '__|
	//  | | | | | | (_| | |  |   <  __/ |_\__ \| || | | (_| | (_| | | | | | (_| | |__| (_| | |  __/ | | | (_| | (_| | |   
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/|_||_|  \__,_|\__,_|_|_| |_|\__, |\____\__,_|_|\___|_| |_|\__,_|\__,_|_|   
	//                                                                     |___/                                          
	async marketsTradingCalendar(
		{
			holidaydivision,
			from,
			to
		}:
		{
			holidaydivision?: HOLIDAY_DIVISION_T;
			from?:	string | Date | Dayjs;
			to?:	string | Date | Dayjs;
		}
	): Promise<Result>
	{
		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('If “from” or “to” is used, both must be defined in marketsTradingCalendar().')
		}

		const params:{
			holidaydivision?: HOLIDAY_DIVISION_T;
			from?:	string;
			to?:	string;
		} = {};

		if( typeof holidaydivision === 'number' ){ params['holidaydivision']	= holidaydivision }
		if( from			){ params['from']				= this.toJQDate( from ) }
		if( to				){ params['to']					= this.toJQDate( to ) }
		
		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.markets_trading_calendar_api_url,
					params: params
				}
			)
		);
	}


	// API: /indices
	//   _           _ _               
	//  (_)_ __   __| (_) ___ ___  ___ 
	//  | | '_ \ / _` | |/ __/ _ \/ __|
	//  | | | | | (_| | | (_|  __/\__ \
	//  |_|_| |_|\__,_|_|\___\___||___/
	//                                 
	async indices(
		{
			code,		// This is an index code, not a stock code. See https://jpx.gitbook.io/j-quants-ja/api-reference/indices/indexcodes
			date,
			from,
			to,
			pagination_key
		}:
		{
			code?:	string;
			date?:	string | Date | Dayjs;
			from?:	string | Date | Dayjs;
			to?: 	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('indices() requires either "code" or "date", but not both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('indices() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('If “from” or “to” is used, both must be defined in indices().')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.indices_api_url,
					params: params
				}
			)
		);
	}

	// API: /indices/topix
	//   _           _ _              _____           _      
	//  (_)_ __   __| (_) ___ ___  __|_   _|__  _ __ (_)_  __
	//  | | '_ \ / _` | |/ __/ _ \/ __|| |/ _ \| '_ \| \ \/ /
	//  | | | | | (_| | | (_|  __/\__ \| | (_) | |_) | |>  < 
	//  |_|_| |_|\__,_|_|\___\___||___/|_|\___/| .__/|_/_/\_\
	//                                         |_|           
	async indicesTopix(
		{
			from,
			to,
			pagination_key
		}:
		{
			from?:	string | Date | Dayjs;
			to?: 	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		const params:{ [key in string]: string} = {};
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.indices_topix_api_url,
					params: params
				}
			)
		);
	}


	// API: /fins/statements
	//    __ _           ____  _        _                            _       
	//   / _(_)_ __  ___/ ___|| |_ __ _| |_ ___ _ __ ___   ___ _ __ | |_ ___ 
	//  | |_| | '_ \/ __\___ \| __/ _` | __/ _ \ '_ ` _ \ / _ \ '_ \| __/ __|
	//  |  _| | | | \__ \___) | || (_| | ||  __/ | | | | |  __/ | | | |_\__ \
	//  |_| |_|_| |_|___/____/ \__\__,_|\__\___|_| |_| |_|\___|_| |_|\__|___/
	//                                                                       
	async finsStatements(
		{
			code,
			date,
			pagination_key
		}:
		{
			code?:	string;
			date?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('finsStatements() requires either "code" or "date", but not both.')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.fins_statements_api_url,
					params: params
				}
			)
		);
	}


	// API: /fins/fs_details
	//    __ _           _____    ____       _        _ _     
	//   / _(_)_ __  ___|  ___|__|  _ \  ___| |_ __ _(_) |___ 
	//  | |_| | '_ \/ __| |_ / __| | | |/ _ \ __/ _` | | / __|
	//  |  _| | | | \__ \  _|\__ \ |_| |  __/ || (_| | | \__ \
	//  |_| |_|_| |_|___/_|  |___/____/ \___|\__\__,_|_|_|___/
	//                                                        
	async finsFsDetails(
		{
			code,
			date,
			pagination_key
		}:
		{
			code?:	string;
			date?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('finsStatements() requires either "code" or "date", but not both.')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.fins_fs_details_api_url,
					params: params
				}
			)
		);
	}


	// API: /fins/dividend
	//    __ _           ____  _       _     _                _ 
	//   / _(_)_ __  ___|  _ \(_)_   _(_) __| | ___ _ __   __| |
	//  | |_| | '_ \/ __| | | | \ \ / / |/ _` |/ _ \ '_ \ / _` |
	//  |  _| | | | \__ \ |_| | |\ V /| | (_| |  __/ | | | (_| |
	//  |_| |_|_| |_|___/____/|_| \_/ |_|\__,_|\___|_| |_|\__,_|
	//                                                          
	async finsDividend(
		{
			code,
			date,
			from,
			to,
			pagination_key
		}:
		{
			code?:	string;
			date?:	string | Date | Dayjs;
			from?:	string | Date | Dayjs;
			to?: 	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<Result>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return this.failureResult('finsDividend() requires either "code" or "date", but not both.')
		}

		if( date && (from || to ) )
		{
			return this.failureResult('finsDividend() does not allow "date" and "from"/"to" to be specified at the same time.')
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return this.failureResult('If “from” or “to” is used, both must be defined in finsDividend().')
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.fins_dividend_api_url,
					params: params
				}
			)
		);
	}


	// API: /fins/announcement
	//    __ _              _                                                                _   
	//   / _(_)_ __  ___   / \   _ __  _ __   ___  _   _ _ __   ___ ___ _ __ ___   ___ _ __ | |_ 
	//  | |_| | '_ \/ __| / _ \ | '_ \| '_ \ / _ \| | | | '_ \ / __/ _ \ '_ ` _ \ / _ \ '_ \| __|
	//  |  _| | | | \__ \/ ___ \| | | | | | | (_) | |_| | | | | (_|  __/ | | | | |  __/ | | | |_ 
	//  |_| |_|_| |_|___/_/   \_\_| |_|_| |_|\___/ \__,_|_| |_|\___\___|_| |_| |_|\___|_| |_|\__|
	//                                                                                           
	async finsAnnouncement(
		{
			pagination_key
		}:
		{
			pagination_key?: string;
		}
	)
	{
		const params:{ [key in string]: string} = {};
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.fins_announcement_api_url,
					params: params
				}
			)
		);
	}


	// API: /option/index_option
	//               _   _             ___           _            ___        _   _             
	//    ___  _ __ | |_(_) ___  _ __ |_ _|_ __   __| | _____  __/ _ \ _ __ | |_(_) ___  _ __  
	//   / _ \| '_ \| __| |/ _ \| '_ \ | || '_ \ / _` |/ _ \ \/ / | | | '_ \| __| |/ _ \| '_ \ 
	//  | (_) | |_) | |_| | (_) | | | || || | | | (_| |  __/>  <| |_| | |_) | |_| | (_) | | | |
	//   \___/| .__/ \__|_|\___/|_| |_|___|_| |_|\__,_|\___/_/\_\\___/| .__/ \__|_|\___/|_| |_|
	//        |_|                                                     |_|                      
	async optionIndexOption(
		{
			date,
			pagination_key
		}:
		{
			date:				string | Date | Dayjs;
			pagination_key?:	string;
		}
	): Promise<Result>
	{
		const params:
		{
			date:				string;
			pagination_key?:	string;
		} = { date: this.toJQDate( date ) }

		if( pagination_key		){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.optionIndexOption_api_url,
					params: params
				}
			)
		);
	}


	// API: /derivatives/futures
	//       _           _            _   _                _____      _                       
	//    __| | ___ _ __(_)_   ____ _| |_(_)_   _____  ___|  ___|   _| |_ _   _ _ __ ___  ___ 
	//   / _` |/ _ \ '__| \ \ / / _` | __| \ \ / / _ \/ __| |_ | | | | __| | | | '__/ _ \/ __|
	//  | (_| |  __/ |  | |\ V / (_| | |_| |\ V /  __/\__ \  _|| |_| | |_| |_| | | |  __/\__ \
	//   \__,_|\___|_|  |_| \_/ \__,_|\__|_| \_/ \___||___/_|   \__,_|\__|\__,_|_|  \___||___/
	//                                                                                        
	async derivativesFutures(
		{
			date,
			category,
			contract_flag,
			pagination_key

		}:
		{
			date:				string | Date | Dayjs;
			category?:			DERIVATIVES_FUTURES_CAT_T;
			contract_flag?:		string;
			pagination_key?:	string;
		}
	): Promise<Result>
	{
		const params:{ [key in string]: string} = {};

		params['date']			= this.toJQDate( date );

		if( category		){ params['category']		= category }
		if( contract_flag	){ params['contract_flag']	= contract_flag }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.derivatives_futures_api_url,
					params: params
				}
			)
		);
	}


	// API: /derivatives/options
	// derivativesOptions
	async derivativesOptions(
		{
			date,
			category,
			code,
			contract_flag,
			pagination_key

		}:
		{
			date:				string | Date | Dayjs;
			category?:			DERIVATIVES_OPTIONS_CAT_T;
			code?:				string;
			contract_flag?:		string;
			pagination_key?:	string;
		}
	)
	{
		if( code && category !== 'EQOP' )
		{
			return this.failureResult("'code' can be specified only when 'EQOP' is specified for the category.");
		}

		const params:{ [key in string]: string} =
		{
			date: this.toJQDate( date )
		};

		if( category		){ params['category']		= category }
		if( code			){ params['code']			= code }
		if( contract_flag	){ params['contract_flag']	= contract_flag }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		return this.returnResult(
			await this._request_wiith_auth_header(
				{
					url: this.derivatives_options_api_url,
					params: params
				}
			)
		);
	}


	// - - - - - - - - - - - - - - - - - - - -
	// Utility
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * Convert the specified date to a string in the “YYYY-MM-DD” format
	 * required by the J-QUANTS API.
	 * 
	 * @param {string | Date | Dayjs} date - The input date to be converted. It can be:
	 *  - A string representing a date that Dayjs can parse,
	 *    or simply a string in the 'YYYY-MM-DD' format.
	 *  - A JavaScript `Date` object.
	 *  - A `Dayjs` object.
	 * 
	 * @returns {string} The date formatted as "YYYY-MM-DD".
	 * 
	 * @throws {Error} If the input is a string and does not represent a valid date, or if the input is neither
	 * a string, `Date`, nor `Dayjs` object.
	 */
	toJQDate( date: string | Date | Dayjs ): string
	{
		const date_format = 'YYYY-MM-DD';

		if( typeof date === 'string' )
		{
			if( dayjs( date ).isValid() )
			{
				return dayjs( date ).format( date_format );
			}
			else
			{
				throw Error(`The date format of the string "${date}" is invalid.`);
			}
		}
		
		if( date instanceof Date )
		{
			return dayjs( date ).format( date_format );
		}
		else if( dayjs.isDayjs( date ) )
		{
			return date.format( date_format );
		}
		else
		{
			throw Error('The date is neither a Date object nor a Dayjs object, nor is it a string in "YYYY-MM-DD" format.');
		}
	}

	protected successResult(...args: ResultMakerArgsT ):Result
	{
		return this._last_result = Result.success( ...args );
	}

	protected failureResult(...args: ResultMakerArgsT ):Result
	{
		return this._last_result = Result.failure( ...args );
	}

	protected returnResult( r: Result ): Result
	{
		return this._last_result = r;
	}
}