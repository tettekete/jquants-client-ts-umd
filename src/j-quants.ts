import ExURL ,{ HTTP_METHODS_T } from './util/exUrl';
import DUResult,{DUResultT} from '@tettekete/du-result';
import { getLogger } from './util/logger';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import dayjs ,{Dayjs} from 'dayjs';
import pino from 'pino';

import { InMemoryTokenStore } from './lib/defaultStores/InMemoryTokenStore';
import { DotEnvCredentialStore  } from './lib/defaultStores/DotEnvCredentialStore';
import {
	APITokenStore,
	TOKEN_RECORD,
	Logger_T,
	JQCredentialStore,
	ListedInfoResponse,
	PriceDailyQuotesResponse,
	PricePricesAmResponse,
	MarketsTradesSpecResponse,
	MarketsWeeklyMarginInterestResponse,
	MarketsShortSellingResponse,
	MarketsShortSellingPositionsResponse,
	MarketsBreakdownResponse,
	MarketsTradingCalendarResponse,
	IndicesResponse,
	IndicesTopixResponse,
	FinsStatementsResponse,
	FinsFsDetailsResponse,
	FinsDividendResponse,
	FinsAnnouncementResponse,
	OptionIndexOptionResponse,
	DerivativesFuturesResponse,
	DerivativesOptionsResponse,
} from './types';
export * from './types';
import { isTokenRecord } from './lib/type-guard/client';
import {
	isTokenAuthUserResponse,
	isTokenAuthRefreshResponse,
	isListedInfoResponse,
	isPriceDailyQuotesResponse,
	isPricePricesAmResponse,
	isMarketsTradesSpecResponse,
	isMarketsWeeklyMarginInterestResponse,
	isMarketsShortSellingResponse,
	isMarketsShortSellingPositionsResponse,
	isMarketsBreakdownResponse,
	isMarketsTradingCalendarResponse,
	isIndicesResponse,
	isIndicesTopixResponse,
	isFinsStatementsResponse,
	isFinsFsDetailsResponse,
	isFinsDividendResponse,
	isFinsAnnouncementResponse,
	isOptionIndexOptionResponse,
	isDerivativesFuturesResponse,
	isDerivativesOptionsResponse,
} from './type-guard';

type API_CONFIG_T =
{
	path: string;
	method: HTTP_METHODS_T;
};

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

function isValidToken(tokenRecord: TOKEN_RECORD | undefined): boolean
{
	if( ! tokenRecord )
	{
		return false;
	}

	const expiration: Dayjs = dayjs( tokenRecord.expiration );
	return dayjs().isBefore( expiration );
}


export default class JQuantsAPIHandler
{
	logger: Logger_T;
	private _refreshTokenRecord	: TOKEN_RECORD | undefined;
	private _idTokenRecord		: TOKEN_RECORD | undefined;

	private _credsStore		: JQCredentialStore;
	private _tokenStore	: APITokenStore;

	private _autoTokenRefresh: boolean;

	private _refreshTokenTTL	= kRefreshTokenTTL;
	private _idTokenTTL 		= kIdTokenTTL;

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
	};

	// - - - - - - - - - - - - - - - - - - - -
	// common getter / setter
	// - - - - - - - - - - - - - - - - - - - -
	set refreshTokenTTL( ttl: number )
	{
		this._refreshTokenTTL = ttl;
	}

	get refreshTokenTTL(): number
	{
		return this._refreshTokenTTL ?? kRefreshTokenTTL;
	}

	set idTokenTTL( ttl: number )
	{
		this._idTokenTTL = ttl;
	}

	get idTokenTTL(): number
	{
		return this._idTokenTTL ?? kIdTokenTTL;
	}

	set tokenStore( tokenStore: APITokenStore )
	{
		this._tokenStore = tokenStore;
	}

	get tokenStore(): APITokenStore | undefined
	{
		return this._tokenStore;
	}
	
	/**
	 * this._refreshTokenRecord.token にアクセスするためのエイリアスアクセサ
	 * 期限切れの場合 undefined を返す
	 *
	 * @readonly
	 * @type {(string | undefined)}
	 */
	get refreshToken(): string | undefined
	{
		// レコードが登録されていて期限切れで無ければトークンを返す
		if( isValidToken( this._refreshTokenRecord ) 
			&& isTokenRecord( this._refreshTokenRecord )
		)
		{
			return this._refreshTokenRecord.token;
		}

		return undefined;
	};

	/**
	 * this._idTokenRecord.token にアクセスするためのエイリアスアクセサ
	 * 期限切れの場合 undefined を返す
	 *
	 * @readonly
	 * @type {(string | undefined)}
	 */
	get idToken(): string | undefined
	{
		// レコードが登録されていて期限切れで無ければトークンを返す
		if( isValidToken( this._idTokenRecord )
			&& isTokenRecord( this._idTokenRecord )
		)
		{
			return this._idTokenRecord.token;
		}

		return undefined;
	};

	set autoTokenRefresh( isEnabled: boolean)
	{
		this._autoTokenRefresh = isEnabled;
	}

	get autoTokenRefresh(): boolean
	{
		return this._autoTokenRefresh;
	}
	

	// alias for accessing logger with a short name
	get lg(): Logger_T
	{
		return this.logger;
	}

	// - - - - - - - - - - - - - - - - - - - -
	// API URLs getter
	// - - - - - - - - - - - - - - - - - - - -

	get refreshApiUrl()		{ return JQuantsAPIHandler._api_url_maker( 'refresh_api' ) }
	get idTokenApiUrl()		{ return JQuantsAPIHandler._api_url_maker( 'id_token_api' ) }
	get listedInfoApiUrl()	{ return JQuantsAPIHandler._api_url_maker( 'listed_info' ) }
	get pricesDailyQuotesApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'prices_daily_quotes' ) }
	get pricesPricesAmApiUrl()
							{ return  JQuantsAPIHandler._api_url_maker( 'prices_prices_am' ) }
	get marketsTradesSpecApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'markets_trades_spec' ) }
	get marketsWeeklyMarginInterestApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'markets_weekly_margin_interest' ) }
	get marketsShortSellingApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'markets_short_selling' ) }
	get marketsBreakdownApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'markets_breakdown' ) }
	get marketsTradingCalendarApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'markets_trading_calendar' ) }
	get indicesApiUrl()		{ return JQuantsAPIHandler._api_url_maker( 'indices' ) }
	get indicesTopixApiUrl(){ return JQuantsAPIHandler._api_url_maker( 'indices_topix' ) }
	get finsStatementsApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'fins_statements' ) }
	get finsFsDetailsApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'fins_fs_details' ) }
	get finsDividendApiUrl(){ return JQuantsAPIHandler._api_url_maker( 'fins_dividend' ) }
	get finsAnnouncementApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'fins_announcement' ) }
	get optionIndexOptionApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'option_index_option' ) }
	get derivativesFuturesApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'derivatives_futures' ) }
	get derivativesOptionsApiUrl()
							{ return JQuantsAPIHandler._api_url_maker( 'derivatives_options' ) }


	
	//                       _                   _             
	//    ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ ___  _ __ 
	//   / __/ _ \| '_ \/ __| __| '__| | | |/ __| __/ _ \| '__|
	//  | (_| (_) | | | \__ \ |_| |  | |_| | (__| || (_) | |   
	//   \___\___/|_| |_|___/\__|_|   \__,_|\___|\__\___/|_|   
	//                                                         
	constructor({
		credsStore = new DotEnvCredentialStore(),
		tokenStore = new InMemoryTokenStore(),
		logLevel = 'error',
		autoTokenRefresh = true
	}:
	{
		credsStore		?: JQCredentialStore;
		tokenStore		?: APITokenStore;
		logLevel		?: pino.Level;
		autoTokenRefresh?: boolean
	} = {})
	{
		this._credsStore	= credsStore;
		this._tokenStore	= tokenStore;

		this.logger = getLogger( logLevel );
		this._autoTokenRefresh = autoTokenRefresh;
	}

	private static _api_url_maker( url_for: string ): ExURL
	{
		if( ! Object.prototype.hasOwnProperty.call(JQuantsAPIHandler.URLs,  url_for ) )
		{
			throw Error(`"${url_for}" is unknown api symbol`);
		}

		const baseURL: ExURL			= JQuantsAPIHandler.baseURL.clone();
		const target: API_CONFIG_T	= JQuantsAPIHandler.URLs[url_for];

		const api_url = baseURL.withPath( target.path );
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
		req: AxiosRequestConfig
	): Promise<
		DUResultT<AxiosResponse , AxiosError | unknown>
	>
	{
		let result: DUResultT<AxiosResponse , AxiosError | unknown>;
		try
		{
			this.lg.trace(`request_with_axios: ${req.method} ${req.url}`);
			const res: AxiosResponse = await axios( req );

			this.lg.trace(`request path: ${Object.prototype.hasOwnProperty.call(res, 'request') ? res.request.path : 'unknown'}`);
			this.lg.trace(`status: ${res.status} ${res.statusText}`);

			result = DUResult.success<AxiosResponse>( res );

			this.lg.trace(`data: ${JSON.stringify( res.data ,null ,2)}`.substring(0,80) + ' ...');
		}
		catch (e: unknown )
		{
			if( e instanceof AxiosError )
			{
				result = DUResult.failure<AxiosError>( "AxiosError was thrown." ,e );
			}
			else
			{
				result = DUResult.failure( "Unknown error" , e );
			}
			
		}

		return result;
	}
	
	async _request_with_auth_header(
		{
			url,
			params
		}:
		{
			url: ExURL;
			params: { [key in string]: string | number }
		}
	): Promise<DUResultT<AxiosResponse , AxiosError | unknown>>
	{
		if( this._autoTokenRefresh )
		{
			const idToken = await this.getIdToken();
			if( ! idToken )
			{
				return DUResult.failure( "Failed to obtain ID token." );
			}
		}

		const req: AxiosRequestConfig =
		{
			url:	url.toString(),
			method: url.method,
			headers:
			{
				Authorization: this.idToken
			}
		};

		if( Object.keys(params).length )
		{
			req['params'] = params;
		}

		const r = await this.request_with_axios( req );

		return r;
	}


	//              _   ____       __               _   _____     _              ____                 _ _   
	//    __ _  ___| |_|  _ \ ___ / _|_ __ ___  ___| |_|_   _|__ | | _____ _ __ |  _ \ ___  ___ _   _| | |_ 
	//   / _` |/ _ \ __| |_) / _ \ |_| '__/ _ \/ __| '_ \| |/ _ \| |/ / _ \ '_ \| |_) / _ \/ __| | | | | __|
	//  | (_| |  __/ |_|  _ <  __/  _| | |  __/\__ \ | | | | (_) |   <  __/ | | |  _ <  __/\__ \ |_| | | |_ 
	//   \__, |\___|\__|_| \_\___|_| |_|  \___||___/_| |_|_|\___/|_|\_\___|_| |_|_| \_\___||___/\__,_|_|\__|
	//   |___/                                                                                                                                                               
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * Refresh Token 取得 API をコールしリフレッシュトークンを取得する。
	 * 
	 * 取得したトークンは this._tokenStore を通してトークンストアに保存される、また
	 * 同レコードは this._refreshTokenRecord にもキャッシュとして格納される。
	 * 
	 * @param param0 
	 * @returns 
	 */
	async getRefreshTokenResult(): Promise<DUResultT<TOKEN_RECORD ,AxiosError | unknown>>
	{
		const exUrl		= this.refreshApiUrl;
		const _email	= await this._credsStore.user();
		const _pw		= await this._credsStore.password();

		if( ! _email || ! _pw )
		{
			return DUResult.failure("Either email or password is not defined.");
		}

		const req: AxiosRequestConfig =
		{
			url:	exUrl.toString(),
			method: exUrl.method,
			data:
			{
				mailaddress: _email,
				password: _pw
			}
		};


		const r = await this.request_with_axios( req );

		if( r.ok
			&& isTokenAuthUserResponse( r.data.data )
			)
		{
			const tokenRec:TOKEN_RECORD =
			{
				token: r.data.data.refreshToken,
				expiration: dayjs().add( this.refreshTokenTTL,'second')
			};

			await this._tokenStore.set_refresh_token_info( tokenRec );
			this._refreshTokenRecord = tokenRec;

			return DUResult.success<TOKEN_RECORD>( tokenRec );
		}
		else if( r.ng )
		{
			return r;
		}
		
		return DUResult.failure("Unknown error." , r.data );
	}


	//              _   ____       __               _   _____     _              
	//    __ _  ___| |_|  _ \ ___ / _|_ __ ___  ___| |_|_   _|__ | | _____ _ __  
	//   / _` |/ _ \ __| |_) / _ \ |_| '__/ _ \/ __| '_ \| |/ _ \| |/ / _ \ '_ \ 
	//  | (_| |  __/ |_|  _ <  __/  _| | |  __/\__ \ | | | | (_) |   <  __/ | | |
	//   \__, |\___|\__|_| \_\___|_| |_|  \___||___/_| |_|_|\___/|_|\_\___|_| |_|
	//   |___/                                                                   
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * テキストのリフレッシュトークンを取得して返します。
	 *
	 * getRefreshTokenResult() とは異なり、メンバー変数やトークンストアに有効なリフレッシュトークンが
	 * 保存されている場合はそれを返します。
	 * それらが無効である場合 getRefreshTokenResult() をコールし Web API からリフレッシュトークンを
	 * 取得します。
	 *
	 * @async
	 * @returns {Promise<string | undefined>} 
	 */
	async getRefreshToken(): Promise<string | undefined>
	{
		const breakCondition = () => 
		{
			return isValidToken( this._refreshTokenRecord );
		};

		const queue:(()=>Promise<boolean>)[] = [
			async () =>
			{
				this._refreshTokenRecord	= await this._tokenStore.get_refresh_token_info();
				return true;// 読み出せなかった場合、次のタスクで WebAPI からリフレッシュトークンを取得するので、ここでは true を返す
			},
			async () =>
			{
				const r = await this.getRefreshTokenResult();	// 成功すれば this.refreshTokenRecord も更新する
				return r.ok;
			}
		];

		for( const task of queue )
		{
			if( breakCondition() ){ break };
			const r = await task();
			if( ! r ){ break };
		}

		return this.refreshToken;
	}


	//              _   ___ ____ _____     _              ____                 _ _   
	//    __ _  ___| |_|_ _|  _ \_   _|__ | | _____ _ __ |  _ \ ___  ___ _   _| | |_ 
	//   / _` |/ _ \ __|| || | | || |/ _ \| |/ / _ \ '_ \| |_) / _ \/ __| | | | | __|
	//  | (_| |  __/ |_ | || |_| || | (_) |   <  __/ | | |  _ <  __/\__ \ |_| | | |_ 
	//   \__, |\___|\__|___|____/ |_|\___/|_|\_\___|_| |_|_| \_\___||___/\__,_|_|\__|
	//   |___/                                                                                                               
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * WebAPI をコールして ID トークンを取得する。
	 *
	 * 取得したトークンは this._tokenStore を通してトークンストアに保存される、また
	 * 同レコードは this._idTokenRecord にもキャッシュして格納される。
	 *
	 * @async
	 * @param {{
	 * 		refresh_token?:		string | undefined;
	 * 	}} [param0={}] 
	 * @param {string} param0.refresh_token - リフレッシュトークン
	 * @returns {Promise<DUResultT<TOKEN_RECORD , AxiosError | unknown>>} - r.data is ID token when r.ok
	 * 	
	 */
	async getIDTokenResult(
	{
		refresh_token,
	}
	:{
		refresh_token?:		string | undefined;
	} = {}): Promise<DUResultT<TOKEN_RECORD , AxiosError | unknown>>
	{
		const exUrl = this.idTokenApiUrl;

		const _refresh_token = refresh_token ?? this.refreshToken;
		if(! _refresh_token )
		{
			return DUResult.failure("refresh_token not defined.");
		}

		const req: AxiosRequestConfig =
		{
			url:	exUrl.toString(),
			method: exUrl.method,
			params:
			{
				refreshtoken: _refresh_token
			}
		};

		const r = await this.request_with_axios( req );

		if(
			r.ok
			&& isTokenAuthRefreshResponse( r.data.data )
		)
		{
			const axiosResponse = r.data;
			const tokenRec:TOKEN_RECORD =
			{
				token: axiosResponse.data.idToken,
				expiration: dayjs().add( this.idTokenTTL ,'second')
			};
			
			await this._tokenStore.set_id_token_info( tokenRec );
			this._idTokenRecord = tokenRec;
			return DUResult.success<TOKEN_RECORD>( tokenRec );
		}
		else if( r.ng )
		{
			return r;
		}

		return DUResult.failure("Invalid error." , r.data );
	}


	//              _   ___    _ _____     _              
	//    __ _  ___| |_|_ _|__| |_   _|__ | | _____ _ __  
	//   / _` |/ _ \ __|| |/ _` | | |/ _ \| |/ / _ \ '_ \ 
	//  | (_| |  __/ |_ | | (_| | | | (_) |   <  __/ | | |
	//   \__, |\___|\__|___\__,_| |_|\___/|_|\_\___|_| |_|
	//   |___/                                            
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * テキストの ID トークンを取得して返します。

	 * getIDTokenResult() とは異なり、メンバー変数やトークンストアに有効な ID トークンが
	 * 保存されている場合はそれを返します。
	 * それらが無効である場合 getIDTokenResult() をコールし Web API から ID トークンを
	 * 取得します。
	 *
	 * @async
	 * @returns {Promise<string | undefined>} 
	 */
	async getIdToken(): Promise<string | undefined>
	{
		const breakCondition = () => 
		{
			return isValidToken( this._idTokenRecord );
		};

		// 現時点で this._idTokenRecord が有効で無い場合に順次行う処理をキュー化
		const queue:(()=>Promise<boolean>)[] = [
			async () =>
			{
				// トークンストアから ID トークンを読み出す
				this._idTokenRecord = await this._tokenStore.get_id_token_info();
				return true;	// 読み出せたかどうかにかかわらず breakCondition() で評価されるので必ず true を返す
			},
			async () =>
			{
				// メンバー変数若しくはトークンストアからリフレッシュトークンを取得し、
				// それらが有効なリフレッシュトークンでは無い場合 Web API から
				// リフレッシュトークンを取得する
				const refreshToken = await this.getRefreshToken();
				return !! refreshToken;	// リフレッシュトークンを取得できなかった場合 queue を抜ける
			},
			async () =>
			{
				// Web API から ID トークンを取得する
				const r = await this.getIDTokenResult();	// 成功すれば this._idTokenRecord も更新する
				return r.ok;	// 何らかの理由で ID トークンを取得できなかった場合( r.ok === false )ならば queue を抜ける
			}
		];

		for( const task of queue )
		{
			if( breakCondition() ){ break };
			const r = await task();
			if( ! r ){ break };
		}

		return this.idToken;
	}


	private static _makeAPIResult<EXPECTED_TYPE>(
		r:DUResultT<AxiosResponse,AxiosError | unknown> 
		,typeGuardFn: (value: unknown) => value is EXPECTED_TYPE
		,typeName: string
		,methodOrAPIName: string
	)
	:DUResultT<EXPECTED_TYPE,AxiosError | unknown>
	{
		if( r.ok  )
		{	
			if( typeGuardFn( r.data.data ) )
			{
				return DUResult.success<EXPECTED_TYPE>( r.message , r.data.data );
			}
			else if( ! r.data )
			{
				return DUResult.failure('Invalid error: .data property is falsy.');
			}
			else
			{
				return DUResult.failure(`Type guard error: .data type is not ${typeName}.`);
			}
		}
		else
		{
			return r;
		}	
	}

	// API: /listed/info
	//   _ _     _           _ ___        __       
	//  | (_)___| |_ ___  __| |_ _|_ __  / _| ___  
	//  | | / __| __/ _ \/ _` || || '_ \| |_ / _ \ 
	//  | | \__ \ ||  __/ (_| || || | | |  _| (_) |
	//  |_|_|___/\__\___|\__,_|___|_| |_|_|  \___/ 
	//                                             
	async listedInfo({code , date}:{code?: string, date?: string | Date | Dayjs } = {})
		:Promise<DUResultT<ListedInfoResponse,AxiosError | unknown>>
	{
		const params:{code?: string, date?: string } = {};
		if( code ){ params['code'] = code }
		if( date ){ params['date'] = this.toJQDate( date ) }

		const r = await this._request_with_auth_header(
			{
				url: this.listedInfoApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<ListedInfoResponse>(
			r,
			isListedInfoResponse,
			'ListedInfoResponse',
			'listedInfo()'
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
	): Promise<DUResultT<PriceDailyQuotesResponse ,AxiosError | unknown>>
	{
		// arg pattern validation
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('pricesDailyQuotes() requires either "code" or "date", but not both.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('pricesDailyQuotes() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('In pricesDailyQuotes(), if either "from" or "to" is specified, both are required.');
		}

		const params:{ [key in string]: string} = {};
		if( code				){ params['code']			= code }
		if( from				){ params['from']			= this.toJQDate( from ) }
		if( to					){ params['to']				= this.toJQDate( to ) }
		if( date				){ params['date']			= this.toJQDate( date ) }
		if( pagination_key		){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.pricesDailyQuotesApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<PriceDailyQuotesResponse>(
			r,
			isPriceDailyQuotesResponse,
			'PriceDailyQuoteItem',
			'pricesDailyQuotes()'
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
	 * @returns {Promise<DUResultT<PricePricesAmResponse ,AxiosError | unknown>>} - A promise that resolves to the result of the API call.
	 */
	async pricesPricesAm({
		code,
		pagination_key
	}
	:{
		code?: string;
		pagination_key?: string
	}): Promise<DUResultT<PricePricesAmResponse ,AxiosError | unknown>>
	{
		const params:{code?: string, pagination_key?: string } = {};
		if( code )				{ params['code'] = code }
		if( pagination_key )	{ params['pagination_key'] = pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.pricesPricesAmApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<PricePricesAmResponse>(
			r,
			isPricePricesAmResponse,
			'PricePricesAmResponse',
			'pricesPricesAm()'
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
	): Promise<DUResultT<MarketsTradesSpecResponse , AxiosError | unknown >>
	{
		const params:{ [key in string]: string} = {};

		if( section	){ params['section']	= section }
		if( from	){ params['from']		= this.toJQDate( from ) }
		if( to		){ params['to']			= this.toJQDate( to ) }

		const r = await this._request_with_auth_header(
			{
				url: this.marketsTradesSpecApiUrl,
				params: params
			}
		);
		
		return JQuantsAPIHandler._makeAPIResult<MarketsTradesSpecResponse>(
			r,
			isMarketsTradesSpecResponse,
			'MarketsTradesSpecResponse',
			'marketsTradesSpec()'
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
	): Promise<DUResultT<MarketsWeeklyMarginInterestResponse ,AxiosError | unknown>>
	{
		// arg pattern validation
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('marketsWeeklyMarginInterest() requires either "code" or "date", but not both.');
		}

		if( code && (! from || ! to) )
		{
			return DUResult.failure('When specifying "code" in marketsWeeklyMarginInterest(), "from" and "to" are required.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('marketsWeeklyMarginInterest() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('If "from" or "to" is used, both must be defined in marketsWeeklyMarginInterest().');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		const r = await this._request_with_auth_header(
			{
				url: this.marketsWeeklyMarginInterestApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<MarketsWeeklyMarginInterestResponse>(
			r,
			isMarketsWeeklyMarginInterestResponse,
			'MarketsWeeklyMarginInterestResponse',
			'marketsWeeklyMarginInterest()'
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
	): Promise<DUResultT<MarketsShortSellingResponse,AxiosError | unknown>>
	{
		if( (! sector33code && ! date ) )
		{
			return DUResult.failure('marketsShortSelling() requires either "code" or "date", or both.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('marketsShortSelling() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('In marketsShortSelling(), if either "from" or "to" is specified, both are required.');
		}

		const params:{ [key in string]: string} = {};
		if( sector33code		){ params['sector33code']	= sector33code }
		if( from				){ params['from']			= this.toJQDate( from ) }
		if( to					){ params['to']				= this.toJQDate( to ) }
		if( date				){ params['date']			= this.toJQDate( date ) }
		if( pagination_key		){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.marketsShortSellingApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<MarketsShortSellingResponse>(
			r,
			isMarketsShortSellingResponse,
			'MarketsShortSellingResponse',
			'marketsShortSelling()'
		);
	}
	

	//                        _        _       ____  _                _   ____       _ _ _             ____           _ _   _                 
	//   _ __ ___   __ _ _ __| | _____| |_ ___/ ___|| |__   ___  _ __| |_/ ___|  ___| | (_)_ __   __ _|  _ \ ___  ___(_) |_(_) ___  _ __  ___ 
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __\___ \| '_ \ / _ \| '__| __\___ \ / _ \ | | | '_ \ / _` | |_) / _ \/ __| | __| |/ _ \| '_ \/ __|
	//  | | | | | | (_| | |  |   <  __/ |_\__ \___) | | | | (_) | |  | |_ ___) |  __/ | | | | | | (_| |  __/ (_) \__ \ | |_| | (_) | | | \__ \
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/____/|_| |_|\___/|_|   \__|____/ \___|_|_|_|_| |_|\__, |_|   \___/|___/_|\__|_|\___/|_| |_|___/
	//                                                                                           |___/                                                                                                                                 |___/                                                      |_|                         
	async marketsShortSellingPositions(
		{
			code,
			disclosed_date,
			disclosed_date_from,
			disclosed_date_to,
			calculated_date,
			pagination_key
		}:
		{
			code?: string;
			disclosed_date?:	string | Date | Dayjs;
			disclosed_date_from?:	string | Date | Dayjs;
			disclosed_date_to?:	string | Date | Dayjs;
			calculated_date?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<DUResultT<MarketsShortSellingPositionsResponse,AxiosError | unknown>>
	{
		if( (! code && ! calculated_date ) )
		{
			return DUResult.failure('marketsShortSellingPositions() requires either "code" or "calculated_date", or both.');
		}

		let flag = 0b0000;
		const disclosedDateFlag = 1 << 0;
		const disclosedDateFromToFlag = 1 << 1;
		const calculatedDateFlag = 1 << 2;
		if( disclosed_date )							{ flag = flag | disclosedDateFlag }
		if( disclosed_date_from || disclosed_date_to )	{ flag = flag | disclosedDateFromToFlag }
		if( calculated_date )							{ flag = flag | calculatedDateFlag }

		if( code )
		{
			if( flag & (flag -1 ) && flag !== 0 )
			{
				return DUResult.failure('When specifying "code" in marketsShortSellingPositions(), only one of "disclosed_date", "disclosed_date_from"/"disclosed_date_to" ,"calculated_date" can be specified.');
			}
		}
		else
		{
			if( disclosed_date_from || disclosed_date_to )
			{
				return DUResult.failure('Cannot specify "disclosed_date_from"/"disclosed_date_to" when "code" is not specified in marketsShortSellingPositions().');
			}
			else if( disclosed_date && calculated_date )
			{
				return DUResult.failure('Cannot specify both "disclosed_date" and "calculated_date" when "code" is not specified in marketsShortSellingPositions().');
			}
		}

		const params:{ [key in string]: string} = {};
		if( code				){ params['code']					= code }
		if( disclosed_date		){ params['disclosed_date']			= this.toJQDate( disclosed_date ) }
		if( disclosed_date_from	){ params['disclosed_date_from']	= this.toJQDate( disclosed_date_from ) }
		if( disclosed_date_to	){ params['disclosed_date_to']		= this.toJQDate( disclosed_date_to ) }
		if( calculated_date		){ params['calculated_date']		= this.toJQDate( calculated_date ) }
		if( pagination_key		){ params['pagination_key']			= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.marketsShortSellingApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<MarketsShortSellingPositionsResponse>(
			r,
			isMarketsShortSellingPositionsResponse,
			'MarketsShortSellingPositionsResponse',
			'marketsShortSellingPositions()'
		);
	}


	// API: /markets/breakdown
	//                        _        _       ____                 _       _                     
	//   _ __ ___   __ _ _ __| | _____| |_ ___| __ ) _ __ ___  __ _| | ____| | _____      ___ __  
	//  | '_ ` _ \ / _` | '__| |/ / _ \ __/ __|  _ \| '__/ _ \/ _` | |/ / _` |/ _ \ \ /\ / / '_ \ 
	//  | | | | | | (_| | |  |   <  __/ |_\__ \ |_) | | |  __/ (_| |   < (_| | (_) \ V  V /| | | |
	//  |_| |_| |_|\__,_|_|  |_|\_\___|\__|___/____/|_|  \___|\__,_|_|\_\__,_|\___/ \_/\_/ |_| |_|
	//                                                                                            
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
	): Promise<DUResultT<MarketsBreakdownResponse ,AxiosError | unknown>>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('marketsBreakdown() requires either "code" or "date", but not both.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('marketsBreakdown() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('If "from" or "to" is used, both must be defined in marketsBreakdown().');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		const r = await this._request_with_auth_header(
			{
				url: this.marketsBreakdownApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<MarketsBreakdownResponse>(
			r,
			isMarketsBreakdownResponse,
			'MarketsBreakdownResponse',
			'marketsBreakdown()'
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
	): Promise<DUResultT<MarketsTradingCalendarResponse ,AxiosError | unknown>>
	{
		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('If "from" or "to" is used, both must be defined in marketsTradingCalendar().');
		}

		const params:{
			holidaydivision?: HOLIDAY_DIVISION_T;
			from?:	string;
			to?:	string;
		} = {};

		if( typeof holidaydivision === 'number' ){ params['holidaydivision']	= holidaydivision }
		if( from			){ params['from']				= this.toJQDate( from ) }
		if( to				){ params['to']					= this.toJQDate( to ) }
		
		const r = await this._request_with_auth_header(
			{
				url: this.marketsTradingCalendarApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<MarketsTradingCalendarResponse>(
			r,
			isMarketsTradingCalendarResponse,
			'MarketsTradingCalendarResponse',
			'marketsTradingCalendar()'
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
	): Promise<DUResultT<IndicesResponse ,AxiosError | unknown>>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('indices() requires either "code" or "date", but not both.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('indices() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('If "from" or "to" is used, both must be defined in indices().');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		const r = await this._request_with_auth_header(
			{
				url: this.indicesApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<IndicesResponse>(
			r,
			isIndicesResponse,
			'IndicesResponse',
			'indices()'
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
	): Promise<DUResultT<IndicesTopixResponse ,AxiosError | unknown>>
	{
		const params:{ [key in string]: string} = {};
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }
		
		const r = await this._request_with_auth_header(
			{
				url: this.indicesTopixApiUrl,
				params: params
			}
		);
		
		return JQuantsAPIHandler._makeAPIResult<IndicesTopixResponse>(
			r,
			isIndicesTopixResponse,
			'IndicesTopixResponse',
			'indicesTopix()'
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
	): Promise<DUResultT<FinsStatementsResponse, AxiosError | unknown>>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('finsStatements() requires either "code" or "date", but not both.');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.finsStatementsApiUrl,
				params: params
			}
		);
		
		return JQuantsAPIHandler._makeAPIResult<FinsStatementsResponse>(
			r,
			isFinsStatementsResponse,
			'FinsStatementsResponse',
			'finsStatements()'
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
	): Promise<DUResultT<FinsFsDetailsResponse ,AxiosError | unknown>>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('finsStatements() requires either "code" or "date", but not both.');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.finsFsDetailsApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<FinsFsDetailsResponse>(
			r,
			isFinsFsDetailsResponse,
			'FinsFsDetailsResponse',
			'finsFsDetails()'
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
	): Promise<DUResultT<FinsDividendResponse, AxiosError | unknown>>
	{
		if( (! code && ! date) || ( code && date ) )
		{
			return DUResult.failure('finsDividend() requires either "code" or "date", but not both.');
		}

		if( date && (from || to ) )
		{
			return DUResult.failure('finsDividend() does not allow "date" and "from"/"to" to be specified at the same time.');
		}

		if( (from || to) && ( ! from || ! to ) )
		{
			return DUResult.failure('If "from" or "to" is used, both must be defined in finsDividend().');
		}

		const params:{ [key in string]: string} = {};
		if( code			){ params['code']			= code }
		if( from			){ params['from']			= this.toJQDate( from ) }
		if( to				){ params['to']				= this.toJQDate( to ) }
		if( date			){ params['date']			= this.toJQDate( date ) }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.finsDividendApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<FinsDividendResponse>(
			r,
			isFinsDividendResponse,
			'FinsDividendResponse',
			'finsDividend()'
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
		} = {}
	):Promise<DUResultT<FinsAnnouncementResponse ,AxiosError | unknown>>
	{
		const params:{ [key in string]: string} = {};
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.finsAnnouncementApiUrl,
				params: params
			}
		);
		
		return JQuantsAPIHandler._makeAPIResult<FinsAnnouncementResponse>(
			r,
			isFinsAnnouncementResponse,
			'FinsAnnouncementResponse',
			'finsAnnouncement()'
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
	): Promise<DUResultT<OptionIndexOptionResponse ,AxiosError | unknown>>
	{
		const params:
		{
			date:				string;
			pagination_key?:	string;
		} = { date: this.toJQDate( date ) };

		if( pagination_key		){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.optionIndexOptionApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<OptionIndexOptionResponse>(
			r,
			isOptionIndexOptionResponse,
			'OptionIndexOptionResponse',
			'optionIndexOption()'
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
	): Promise<DUResultT<DerivativesFuturesResponse,AxiosError | unknown>>
	{
		const params:{ [key in string]: string} = {};

		params['date']			= this.toJQDate( date );

		if( category		){ params['category']		= category }
		if( contract_flag	){ params['contract_flag']	= contract_flag }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.derivativesFuturesApiUrl,
				params: params
			}
		);

		return JQuantsAPIHandler._makeAPIResult<DerivativesFuturesResponse>(
			r,
			isDerivativesFuturesResponse,
			'DerivativesFuturesResponse',
			'derivativesFutures()'
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
	):Promise<DUResultT<DerivativesOptionsResponse ,AxiosError | unknown>>
	{
		if( code && category !== 'EQOP' )
		{
			return DUResult.failure("'code' can be specified only when 'EQOP' is specified for the category.");
		}

		const params:{ [key in string]: string} =
		{
			date: this.toJQDate( date )
		};

		if( category		){ params['category']		= category }
		if( code			){ params['code']			= code }
		if( contract_flag	){ params['contract_flag']	= contract_flag }
		if( pagination_key	){ params['pagination_key']	= pagination_key }

		const r = await this._request_with_auth_header(
			{
				url: this.derivativesOptionsApiUrl,
				params: params
			}
		);
		
		return JQuantsAPIHandler._makeAPIResult<DerivativesOptionsResponse>(
			r,
			isDerivativesOptionsResponse,
			'DerivativesOptionsResponse',
			'derivativesOptions()'
		);
	}


	// - - - - - - - - - - - - - - - - - - - -
	// Utility
	// - - - - - - - - - - - - - - - - - - - -
	/**
	 * Convert the specified date to a string in the "YYYY-MM-DD" format
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
}