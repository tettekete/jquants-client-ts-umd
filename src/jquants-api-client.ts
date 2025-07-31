import ExURL ,{ HTTP_METHODS_T } from './util/exUrl';
import DUResult,{DUResultT} from '@tettekete/du-result';
import { getLogger } from './util/logger';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import dayjs ,{Dayjs} from 'dayjs';
import pino from 'pino';

import { InMemoryTokenStore } from './lib/defaultStores/InMemoryTokenStore';
import { DotEnvCredentialStore  } from './lib/defaultStores/DotEnvCredentialStore';
import { APITokenStore ,JQCredentialStore } from './lib/abstract-classes';
export * from './lib/abstract-classes';
import {
	TOKEN_RECORD,
	Logger_T,
	APIUnavailableResponse,
	ListedInfoResponse,
	PricesDailyQuotesResponse,
	PricesPricesAmResponse,
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
	isPricesDailyQuotesResponse,
	isPricesPricesAmResponse,
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
/**
 * 投資部門別情報(/markets/trades_spec) の section パラメータに使用可能な市場名のユニオン型定義です。
 *
 * @typedef {INVESTMENT_CATEGORY_T}
 * @category Web API コール用リテラルユニオン型
 */
export type INVESTMENT_CATEGORY_T = 'TSE1st' | 'TSE2nd' | 'TSEMothers' | 'TSEJASDAQ' | 'TSEPrime' | 'TSEStandard' | 'TSEGrowth' | 'TokyoNagoya';

/**
 * 取引カレンダー(/markets/trading_calendar) の `holidaydivision” パラメータに使用可能な休日区分のユニオン型定義です
 *
 * 取引カレンダー - 休日区分
 * |項目|値|
 * |---|---|
 * |非営業日				|`0`|
 * |営業日					|`1`|
 * |東証半日立会日			|`2`|
 * |非営業日(祝日取引あり)	|`3`|
 * @typedef {HOLIDAY_DIVISION_T}
 * @category Web API コール用リテラルユニオン型
 */
export type HOLIDAY_DIVISION_T = 0 | 1 | 2 | 3;


/**
 * 先物四本値(/derivatives/futures) の category パラメータに指定可能な文字列のユニオン型定義です。
 *
 * 先物四本値 - 先物商品区分コード
 * 
 * | コード        | 商品区分名称           | データ収録期間     |
 * | ---------- | ---------------- | ----------- |
 * | `TOPIXF`   | TOPIX先物          | 2008/5/7〜   |
 * | `TOPIXMF`  | ミニTOPIX先物        | 2008/6/16〜  |
 * | `MOTF`     | マザーズ先物           | 2016/7/19〜  |
 * | `NKVIF`    | 日経平均VI先物         | 2012/2/27〜  |
 * | `NKYDF`    | 日経平均・配当指数先物      | 2010/7/26〜  |
 * | `NK225F`   | 日経225先物          | 2008/5/7〜   |
 * | `NK225MF`  | 日経225mini先物      | 2008/5/7〜   |
 * | `JN400F`   | JPX日経インデックス400先物 | 2014/11/25〜 |
 * | `REITF`    | 東証REIT指数先物       | 2008/6/16〜  |
 * | `DJIAF`    | NYダウ先物           | 2012/5/28〜  |
 * | `JGBLF`    | 長期国債先物           | 2008/5/7〜   |
 * | `NK225MCF` | 日経225マイクロ先物      | 2023/5/29〜  |
 * | `TOA3MF`   | TONA3ヶ月金利先物      | 2023/5/29〜  |
 * @typedef {DERIVATIVES_FUTURES_CAT_T}
 * @category Web API コール用リテラルユニオン型
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


/**
 * オプション四本値 - オプション商品区分コード
 * API: /derivatives/options
 *
 * |商品区分コード|商品区分名称|データ収録期間|
 * |---|---|---|
 * |TOPIXE|TOPIXオプション|2008/5/7〜|
 * |NK225E|日経225オプション|2008/5/7〜|
 * |JGBLFE|長期国債先物オプション|2008/5/7〜|
 * |EQOP|有価証券オプション|2014/11/17〜|
 * |NK225MWE|日経225miniオプション|2023/5/29〜|
 * @typedef {DERIVATIVES_OPTIONS_CAT_T}
 * @category Web API コール用リテラルユニオン型
 */
export type DERIVATIVES_OPTIONS_CAT_T	= 'TOPIXE'
										| 'NK225E'
										| 'JGBLFE'
										| 'EQOP'
										| 'NK225MWE'
										;

/**
 * 33業種コードリテラルユニオン型定義
 * 各業種のコードを示す文字列型。\n具体的な業種は水産・農林業からサービス業まで多岐にわたる。\nそれぞれの業種に対応する4桁のコードが割り当てられている。
 *
 * 詳細は下記リンクを参照
 * - [“33業種コード及び業種名 | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/listed_info/sector33code)
 *
 * @typedef {SECTOR33CODE_T}
 * @category Web API コール用リテラルユニオン型
 */
export type SECTOR33CODE_T =
	| '0050' // 水産・農林業
	| '1050' // 鉱業
	| '2050' // 建設業
	| '3050' // 食料品
	| '3100' // 繊維製品
	| '3150' // パルプ・紙
	| '3200' // 化学
	| '3250' // 医薬品
	| '3300' // 石油･石炭製品
	| '3350' // ゴム製品
	| '3400' // ガラス･土石製品
	| '3450' // 鉄鋼
	| '3500' // 非鉄金属
	| '3550' // 金属製品
	| '3600' // 機械
	| '3650' // 電気機器
	| '3700' // 輸送用機器
	| '3750' // 精密機器
	| '3800' // その他製品
	| '4050' // 電気･ガス業
	| '5050' // 陸運業
	| '5100' // 海運業
	| '5150' // 空運業
	| '5200' // 倉庫･運輸関連業
	| '5250' // 情報･通信業
	| '6050' // 卸売業
	| '6100' // 小売業
	| '7050' // 銀行業
	| '7100' // 証券･商品先物取引業
	| '7150' // 保険業
	| '7200' // その他金融業
	| '8050' // 不動産業
	| '9050' // サービス業
	| '9999' // その他
	;

export type INDICES_CODE_T =
	| '0000'	// TOPIX	2008/5/7〜
	| '0001'	// 東証二部総合指数	2008/5/7〜2022/4/1
	| '0028'	// TOPIX Core30	2008/5/7〜
	| '0029'	// TOPIX Large 70	2008/5/7〜
	| '002A'	// TOPIX 100	2008/5/7〜
	| '002B'	// TOPIX Mid400	2008/5/7〜
	| '002C'	// TOPIX 500	2008/5/7〜
	| '002D'	// TOPIX Small	2008/5/7〜
	| '002E'	// TOPIX 1000	2008/5/7〜
	| '002F'	// TOPIX Small500	（四本値）2018/10/9〜（終値のみ）2018/9/3〜
	| '0040'	// 東証業種別 水産・農林業	2008/5/7〜
	| '0041'	// 東証業種別 鉱業	2008/5/7〜
	| '0042'	// 東証業種別 建設業	2008/5/7〜
	| '0043'	// 東証業種別 食料品	2008/5/7〜
	| '0044'	// 東証業種別 繊維製品	2008/5/7〜
	| '0045'	// 東証業種別 パルプ・紙	2008/5/7〜
	| '0046'	// 東証業種別 化学	2008/5/7〜
	| '0047'	// 東証業種別 医薬品	2008/5/7〜
	| '0048'	// 東証業種別 石油・石炭製品​	2008/5/7〜
	| '0049'	// 東証業種別 ゴム製品	2008/5/7〜
	| '004A'	// 東証業種別 ガラス・土石製品	2008/5/7〜
	| '004B'	// 東証業種別 鉄鋼	2008/5/7〜
	| '004C'	// 東証業種別 非鉄金属	2008/5/7〜
	| '004D'	// 東証業種別 金属製品	2008/5/7〜
	| '004E'	// 東証業種別 機械	2008/5/7〜
	| '004F'	// 東証業種別 電気機器	2008/5/7〜
	| '0050'	// 東証業種別 輸送用機器	2008/5/7〜
	| '0051'	// 東証業種別 精密機器	2008/5/7〜
	| '0052'	// 東証業種別 その他製品	2008/5/7〜
	| '0053'	// 東証業種別 電気・ガス業	2008/5/7〜
	| '0054'	// 東証業種別 陸運業	2008/5/7〜
	| '0055'	// 東証業種別 海運業	2008/5/7〜
	| '0056'	// 東証業種別 空運業	2008/5/7〜
	| '0057'	// 東証業種別 倉庫・運輸関連業​	2008/5/7〜
	| '0058'	// 東証業種別 情報・通信業	2008/5/7〜
	| '0059'	// 東証業種別 卸売業	2008/5/7〜
	| '005A'	// 東証業種別 小売業	2008/5/7〜
	| '005B'	// 東証業種別 銀行業	2008/5/7〜
	| '005C'	// 東証業種別 証券・商品先物取引業	2008/5/7〜
	| '005D'	// 東証業種別 保険業	2008/5/7〜
	| '005E'	// 東証業種別 その他金融業	2008/5/7〜
	| '005F'	// 東証業種別 不動産業	2008/5/7〜
	| '0060'	// 東証業種別 サービス業	2008/5/7〜
	| '0070'	// 東証グロース市場250指数	(旧：東証マザーズ指数※)	2008/5/7〜
	| '0075'	// REIT	2008/5/7〜
	| '0080'	// TOPIX-17 食品	2009/2/2〜
	| '0081'	// TOPIX-17 エネルギー資源	2009/2/2〜
	| '0082'	// TOPIX-17 建設・資材	2009/2/2〜
	| '0083'	// TOPIX-17 素材・化学	2009/2/2〜
	| '0084'	// TOPIX-17 医薬品	2009/2/2〜
	| '0085'	// TOPIX-17 自動車・輸送機	2009/2/2〜
	| '0086'	// TOPIX-17 鉄鋼・非鉄​	2009/2/2〜
	| '0087'	// TOPIX-17 機械	2009/2/2〜
	| '0088'	// TOPIX-17 電機・精密	2009/2/2〜
	| '0089'	// TOPIX-17 情報通信・サービスその他	2009/2/2〜
	| '008A'	// TOPIX-17 電力・ガス	2009/2/2〜
	| '008B'	// TOPIX-17 運輸・物流	2009/2/2〜
	| '008C'	// TOPIX-17 商社・卸売	2009/2/2〜
	| '008D'	// TOPIX-17 小売	2009/2/2〜
	| '008E'	// TOPIX-17 銀行	2009/2/2〜
	| '008F'	// TOPIX-17 金融（除く銀行）	2009/2/2〜
	| '0090'	// TOPIX-17 不動産	2009/2/2〜
	| '0091'	// JASDAQ INDEX	2008/5/7〜2022/4/1
	| '0500'	// 東証プライム市場指数	2022/6/27〜
	| '0501'	// 東証スタンダード市場指数	2022/6/27〜
	| '0502'	// 東証グロース市場指数	2022/6/27〜
	| '0503'	// JPXプライム150指数	（四本値）2023/7/3〜（終値のみ）2023/5/29〜
	| '8100'	// TOPIX バリュー	2009/2/9〜
	| '812C'	// TOPIX500 バリュー	2009/2/9〜
	| '812D'	// TOPIXSmall バリュー	2009/2/9〜
	| '8200'	// TOPIX グロース	2009/2/9〜
	| '822C'	// TOPIX500 グロース	2009/2/9〜
	| '822D'	// TOPIXSmall グロース	2009/2/9〜
	| '8501'	// 東証REIT オフィス指数	（四本値）2010/3/8〜（終値のみ）2010/3/1〜
	| '8502'	// 東証REIT 住宅指数	（四本値）2010/3/8〜（終値のみ）2010/3/1〜
	| '8503'	// 東証REIT 商業・物流等指数	（四本値）2010/3/8〜（終値のみ）2010/3/1〜
;


const kRefreshTokenTTL	= 7 * 24 * 3600;	/** リフレッシュトークンの有効期限 */
const kIdTokenTTL		= 24 * 3600;		/** IDトークンの有効期限 */

function isValidToken(tokenRecord: TOKEN_RECORD | undefined): boolean
{
	if( ! tokenRecord )
	{
		return false;
	}

	const expiration: Dayjs = dayjs( tokenRecord.expiration );
	return dayjs().isBefore( expiration );
}




/**
 * メインクラス
 *
 * @class JQuantsAPIClient
 * @typedef {JQuantsAPIClient}
 * @category メインクラス
 */
export class JQuantsAPIClient
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
		markets_short_selling_positions:
		{
			path: 'markets/short_selling_positions',
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

	get refreshApiUrl()		{ return JQuantsAPIClient._api_url_maker( 'refresh_api' ) }
	get idTokenApiUrl()		{ return JQuantsAPIClient._api_url_maker( 'id_token_api' ) }
	get listedInfoApiUrl()	{ return JQuantsAPIClient._api_url_maker( 'listed_info' ) }
	get pricesDailyQuotesApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'prices_daily_quotes' ) }
	get pricesPricesAmApiUrl()
							{ return  JQuantsAPIClient._api_url_maker( 'prices_prices_am' ) }
	get marketsTradesSpecApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_trades_spec' ) }
	get marketsWeeklyMarginInterestApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_weekly_margin_interest' ) }
	get marketsShortSellingApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_short_selling' ) }
	get marketsShortSellingPositionsApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_short_selling_positions' ) }
	get marketsBreakdownApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_breakdown' ) }
	get marketsTradingCalendarApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'markets_trading_calendar' ) }
	get indicesApiUrl()		{ return JQuantsAPIClient._api_url_maker( 'indices' ) }
	get indicesTopixApiUrl(){ return JQuantsAPIClient._api_url_maker( 'indices_topix' ) }
	get finsStatementsApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'fins_statements' ) }
	get finsFsDetailsApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'fins_fs_details' ) }
	get finsDividendApiUrl(){ return JQuantsAPIClient._api_url_maker( 'fins_dividend' ) }
	get finsAnnouncementApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'fins_announcement' ) }
	get optionIndexOptionApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'option_index_option' ) }
	get derivativesFuturesApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'derivatives_futures' ) }
	get derivativesOptionsApiUrl()
							{ return JQuantsAPIClient._api_url_maker( 'derivatives_options' ) }


	
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
		if( ! Object.prototype.hasOwnProperty.call(JQuantsAPIClient.URLs,  url_for ) )
		{
			throw Error(`"${url_for}" is unknown api symbol`);
		}

		const baseURL: ExURL			= JQuantsAPIClient.baseURL.clone();
		const target: API_CONFIG_T	= JQuantsAPIClient.URLs[url_for];

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
	private async request_with_axios(
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
	
	private async _request_with_auth_header(
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
	 * @returns {Promise<DUResultT<TOKEN_RECORD ,AxiosError | unknown>>}
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

			await this._tokenStore.setRefreshTokenInfo( tokenRec );
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
				this._refreshTokenRecord	= await this._tokenStore.getRefreshTokenInfo();
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
			
			await this._tokenStore.setIdTokenInfo( tokenRec );
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
				this._idTokenRecord = await this._tokenStore.getIdTokenInfo();
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
				return DUResult.failure(`Invalid error: .data property is falsy at ${methodOrAPIName}.`);
			}
			else
			{
				return DUResult.failure(`Type guard error: .data type is not ${typeName} at ${methodOrAPIName}.`);
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
	/**
	 * 上場銘柄一覧(/listed/info)をコールします。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [上場銘柄一覧(/listed/info) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/listed_info)
	 *
	 * @param {Object} [param0={}]
	 * @param {string} [param0.code] - 銘柄コード
	 * @param {string | Date | Dayjs} [param0.date] - 日付
	 * @returns {Promise<DUResultT<ListedInfoResponse,AxiosError | unknown>>}
	 */
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

		return JQuantsAPIClient._makeAPIResult<ListedInfoResponse>(
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
	/**
	 * 株価四本値(/prices/daily_quotes)をコールします。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [株価四本値(/prices/daily_quotes) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/daily_quotes)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `date` と `from`/`to` を同時に指定してもエラーとはならず `date` を元に検索が行われる
	 * - `from`/`to` は必ずしも両方を指定する必要は無い
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?:	string | Date | Dayjs;
	 * 			date?:	string | Date | Dayjs;
	 * 			pagination_key?:	string
	 * 		}} param0 - リクエストパラメータ
	 * @param {string} param0.code - 銘柄コード
	 * @param {*} param0.from - 開始日付
	 * @param {*} param0.to - 終了日付
	 * @param {*} param0.date - 日付
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<PricesDailyQuotesResponse ,AxiosError | unknown>>} 
	 */
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
	): Promise<DUResultT<PricesDailyQuotesResponse ,AxiosError | unknown>>
	{
		// arg pattern validation
		if( ! code && ! date )
		{
			return DUResult.failure('pricesDailyQuotes() requires either "code" or "date", but not both.');
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

		return JQuantsAPIClient._makeAPIResult<PricesDailyQuotesResponse>(
			r,
			isPricesDailyQuotesResponse,
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
	 * 前場四本値(/prices/prices_am) をコールします。要プレミアムプラン
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [“前場四本値(/prices/prices_am) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/prices_am) を参照してください。
	 * 
	 * 注意点:
	 *
	 * 本 API は取得できない時間帯があります。その場合 API はステータスコード 210 を返しますが、
	 * データ構造は本来のデータ構造と異なり、実質的にエラーであるため、本モジュールでは
	 * `DUResult.failure<APIUnavailableResponse>()` を返します。
	 *
	 * また、前場終了直後数十分程度の間も取得できない場合があります。
	 *
	 * @function pricesPricesAm
	 * @param {Object} params - The parameters for the request.
	 * @param {string} [params.code] - The stock code to filter the results (optional).
	 * @param {string} [params.pagination_key] - The pagination key for retrieving the next set of results (optional).
	 * @returns {Promise<DUResultT<PricesPricesAmResponse ,AxiosError | APIUnavailableResponse | unknown>>} - A promise that resolves to the result of the API call.
	 */
	async pricesPricesAm({
		code,
		pagination_key
	}
	:{
		code?: string;
		pagination_key?: string
	}): Promise<DUResultT<PricesPricesAmResponse ,AxiosError | APIUnavailableResponse | unknown>>
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

		if( r.ok && r.data.status === 210 )
		{
			return DUResult.failure<APIUnavailableResponse>(
				`Status code 210: Unavailable during retrieval time or stock code does not exist`,
				r.data.data
			);
		}

		return JQuantsAPIClient._makeAPIResult<PricesPricesAmResponse>(
			r,
			isPricesPricesAmResponse,
			'PricesPricesAmResponse',
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
	/**
	 * 投資部門別情報(/markets/trades_spec)をコールします。ライトプラン以上
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * 
	 * - [“投資部門別情報(/markets/trades_spec) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/trades_spec)
	 *
	 * @param {{
	 * 			section?: INVESTMENT_CATEGORY_T;
	 * 			from?: string | Date | Dayjs;
	 * 			to?: string | Date | Dayjs;
	 * 		}} [param0={}] 
	 * @param {INVESTMENT_CATEGORY_T} param0.section 
	 * @param {*} param0.from 
	 * @param {*} param0.to 
	 * @returns {Promise<DUResultT<MarketsTradesSpecResponse , AxiosError | unknown >>} 
	 */
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
		
		return JQuantsAPIClient._makeAPIResult<MarketsTradesSpecResponse>(
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
	/**
	/**
	 * 信用取引週末残高(/markets/weekly_margin_interest)。要スタンダードプラン。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [“信用取引週末残高(/markets/weekly_margin_interest) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/weekly_margin_interest)
	 * 
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `code` と `date` を同時に指定するパターンが掲載されていないが、特に問題なく両方を同時に指定出来る
	 * - `date` と `from`/`to` を同時に指定してもエラーとはならず `date` を元に検索が行われる
	 * - `from`/`to` は必ずしも両方を指定する必要は無く、片方のみを指定した場合でも期待通りの結果が得られる
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			date?:	string | Date | Dayjs;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - API リクエストパラメータ
	 * @param {string} param0.code - マーケットコード
	 * @param {*} param0.date - 参照日
	 * @param {*} param0.from - 開始日
	 * @param {*} param0.to - 終了日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<MarketsWeeklyMarginInterestResponse ,AxiosError | unknown>>} 週次マージン金利を取得する非同期関数です。
	 */
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
		if( ! code && ! date )
		{
			return DUResult.failure('marketsWeeklyMarginInterest() requires either "code" or "date", but not both.');
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

		return JQuantsAPIClient._makeAPIResult<MarketsWeeklyMarginInterestResponse>(
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
	/**
	 * 業種別空売り比率(/markets/short_selling)。要スタンダードプラン。
	 * 
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `date` と `from`/`to` を同時に指定してもエラーとはならず `date` を元に検索が行われる
	 * - `from` / `to` の片方のみを指定してもエラーにはならず、期待通りの結果が得られる
	 *
	 * @param {{
	 * 			sector33code?: string;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?:	string | Date | Dayjs;
	 * 			date?:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - API リクエストパラメータ
	 * @param {string} param0.sector33code - セクター33コード
	 * @param {*} param0.from - 開始日
	 * @param {*} param0.to - 終了日
	 * @param {*} param0.date - 特定日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<MarketsShortSellingResponse,AxiosError | unknown>>} 市場の短期売却情報を取得する非同期関数。
	 */
	async marketsShortSelling(
		{
			sector33code,
			from,
			to,
			date,
			pagination_key
		}:
		{
			sector33code?: SECTOR33CODE_T;
			from?:	string | Date | Dayjs;
			to?:	string | Date | Dayjs;
			date?:	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<DUResultT<MarketsShortSellingResponse,AxiosError | unknown>>
	{
		if( ! sector33code && ! date )
		{
			return DUResult.failure('marketsShortSelling() requires either "code" or "date", or both.');
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

		return JQuantsAPIClient._makeAPIResult<MarketsShortSellingResponse>(
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
	//                                                                                           |___/                                        
	/**
	 * 空売り残高報告(/markets/short_selling_positions)。要スタンダードプラン。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [“空売り残高報告(/markets/short_selling_positions) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/short_selling_positions)
	 * 
	 * 公式ドキュメントのパラメータ組み合わせ制限と実際の挙動が一致していない事が多いため
	 * 細かい入力バリデーションは廃止しました。
	 * 代わりにエラーレスポンスデータの `message` などを参照してください。
	 *
	 * @param {{
	 * 			code?: string;
	 * 			disclosed_date?:	string | Date | Dayjs;
	 * 			disclosed_date_from?:	string | Date | Dayjs;
	 * 			disclosed_date_to?:	string | Date | Dayjs;
	 * 			calculated_date?:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 売りポジションを取得するためのパラメータ
	 * @param {string} param0.code 銘柄コード
	 * @param {*} param0.disclosed_date 開示日
	 * @param {*} param0.disclosed_date_from 開示開始日
	 * @param {*} param0.disclosed_date_to 開示終了日
	 * @param {*} param0.calculated_date 計算日
	 * @param {string} param0.pagination_key ページネーションキー
	 * @returns {Promise<DUResultT<MarketsShortSellingPositionsResponse,AxiosError | unknown>>} ショート・セリングポジションのマーケット情報を取得する非同期関数。
	 */
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
		if( (! code && ! disclosed_date && ! calculated_date ) )
		{
			return DUResult.failure('marketsShortSellingPositions() requires either "code" or "disclosed_date" or "calculated_date", or both.');
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
				url: this.marketsShortSellingPositionsApiUrl,
				params: params
			}
		);

		return JQuantsAPIClient._makeAPIResult<MarketsShortSellingPositionsResponse>(
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
	/**
	 * 売買内訳データ(/markets/breakdown)。要プレミアムプラン
 	 * 
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [“売買内訳データ(/markets/breakdown) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/breakdown)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `code` と `date` を同時に指定するパターンが掲載されていないが、特に問題なく両方を同時に指定出来る
	 * - `date` と `from`/`to` を同時に指定してもエラーとはならず `date` を元に検索が行われる
	 * - `from`/`to` は必ずしも両方を指定する必要は無く、片方のみを指定した場合でも期待通りの結果が得られる
	 *
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			date?:	string | Date | Dayjs;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?: 	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 市場の内訳を取得するパラメータ
	 * @param {string} param0.code 市場コード
	 * @param {*} param0.date 特定の日付
	 * @param {*} param0.from 開始日
	 * @param {*} param0.to 終了日
	 * @param {string} param0.pagination_key ページネーションキー
	 * @returns {Promise<DUResultT<MarketsBreakdownResponse ,AxiosError | unknown>>} 市場の詳細情報を取得する非同期関数。
	 */
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
		if( ! code && ! date )
		{
			return DUResult.failure('marketsBreakdown() requires either "code" or "date".');
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

		return JQuantsAPIClient._makeAPIResult<MarketsBreakdownResponse>(
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
	
	/**
	 * 取引カレンダー(/markets/trading_calendar)をコールします。フリープランの場合条件付きで利用可
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [取引カレンダー(/markets/trading_calendar) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/trading_calendar)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - 他の API と異なり、`from`/`to` を使用する場合両方指定する必要がある。
	 * - それ以外はドキュメント通り、パラメータ無し、`holidaydivision` のみ、`from`/`to` のみの指定が可能。
	 *
	 * @param {{
	 * 			holidaydivision?: HOLIDAY_DIVISION_T;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?:	string | Date | Dayjs;
	 * 		}} param0 
	 * @param {HOLIDAY_DIVISION_T} param0.holidaydivision 
	 * @param {*} param0.from 
	 * @param {*} param0.to 
	 * @returns {Promise<DUResultT<MarketsTradingCalendarResponse ,AxiosError | unknown>>} 
	 */
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

		return JQuantsAPIClient._makeAPIResult<MarketsTradingCalendarResponse>(
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
	
	/**
	 * 指数四本値(/indices) をコールします。要スタンダードプラン
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [“指数四本値(/indices) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/indices)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `code` と `date` を同時に指定するパターンが掲載されていないが、特に問題なく両方を同時に指定出来る
	 * - `date` と `from`/`to` を同時に指定してもエラーとはならず `date` を元に検索が行われる
	 * - `from`/`to` は必ずしも両方を指定する必要は無く、片方のみを指定した場合でも期待通りの結果が得られる
	 *
	 * @param {{
	 * 			code?:	INDICES_CODE_T;
	 * 			date?:	string | Date | Dayjs;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?: 	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - API リクエストパラメータ
	 * @param {INDICES_CODE_T} param0.code - インデックスコード
	 * @param {*} param0.date - 日付
	 * @param {*} param0.from - 開始日
	 * @param {*} param0.to - 終了日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<IndicesResponse ,AxiosError | unknown>>} インデックスデータを非同期で取得します。
	 */
	async indices(
		{
			code,		// This is an index code, not a stock code. See https://jpx.gitbook.io/j-quants-ja/api-reference/indices/indexcodes
			date,
			from,
			to,
			pagination_key
		}:
		{
			code?:	INDICES_CODE_T;
			date?:	string | Date | Dayjs;
			from?:	string | Date | Dayjs;
			to?: 	string | Date | Dayjs;
			pagination_key?: string;
		}
	): Promise<DUResultT<IndicesResponse ,AxiosError | unknown>>
	{
		if( (! code && ! date) )
		{
			return DUResult.failure('indices() requires either "code" or "date", but not both.');
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

		return JQuantsAPIClient._makeAPIResult<IndicesResponse>(
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
	
	/**
	 * TOPIX指数四本値(/indices/topix) をコールします。要ライトプラン以上
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [“TOPIX指数四本値(/indices/topix) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/topix)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `from`/`to` は必ずしも両方を指定する必要は無く、片方のみを指定した場合でも期待通りの結果が得られる
	 *
	 * @param {{
	 * 			from?:	string | Date | Dayjs;
	 * 			to?: 	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 
	 * @param {*} param0.from - 開始日
	 * @param {*} param0.to - 終了日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<IndicesTopixResponse ,AxiosError | unknown>>} 
	 */
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
		
		return JQuantsAPIClient._makeAPIResult<IndicesTopixResponse>(
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
	/**
	 * 財務情報(/fins/statements)をコールします。フリープランの場合条件付きで利用可
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [財務情報(/fins/statements) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/statements)
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			date?:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - API リクエストパラメータ
	 * @param {string} param0.code - 銘柄コード
	 * @param {*} param0.date - 参照日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<FinsStatementsResponse, AxiosError | unknown>>} 
	 */
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
		if( ! code && ! date )
		{
			return DUResult.failure('finsStatements() requires either "code" or "date".');
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
		
		return JQuantsAPIClient._makeAPIResult<FinsStatementsResponse>(
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
	/**
	 * 財務諸表(BS/PL)(/fins/fs_details)をコールします。要プレミアムプラン
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [財務諸表(BS/PL)(/fins/fs_details) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/statements-1)
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			date?:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 
	 * @param {string} param0.code 
	 * @param {*} param0.date 
	 * @param {string} param0.pagination_key 
	 * @returns {Promise<DUResultT<FinsFsDetailsResponse ,AxiosError | unknown>>} 
	 */
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
		if( (! code && ! date) )
		{
			return DUResult.failure('finsFsDetails() requires either "code" or "date".');
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

		return JQuantsAPIClient._makeAPIResult<FinsFsDetailsResponse>(
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
	/**
	 * 配当金情報(/fins/dividend)をコールします。要プレミアムプラン
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [“配当金情報(/fins/dividend) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/dividend)
	 *
	 * 公式ドキュメントのパラメータ組み合わせ説明と実際の挙動について(2025-07-31時点):
	 *
	 * - `code` と `date` は同時に指定出来ないかのように書かれているが実際にはは出来る
	 * - `from` と `to` はセットで指定する必要があるかのように書かれているが片方だけの指定も有効で、期待通りに動作する
	 * - `date` と `from` / `to` を同時に指定してもエラーにはならず `date` が優先される 
	 *
	 * @param {{
	 * 			code?:	string;
	 * 			date?:	string | Date | Dayjs;
	 * 			from?:	string | Date | Dayjs;
	 * 			to?: 	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - 配当情報を取得するための引数オブジェクト
	 * @param {string} param0.code - 証券コード
	 * @param {*} param0.date - 特定の日付
	 * @param {*} param0.from - 検索開始日
	 * @param {*} param0.to - 検索終了日
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<FinsDividendResponse, AxiosError | unknown>>} 配当金データを取得する非同期関数。
	 */
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
		if( ! code && ! date )
		{
			return DUResult.failure('finsDividend() requires either "code" or "date".');
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

		return JQuantsAPIClient._makeAPIResult<FinsDividendResponse>(
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
	
	/**
	 * 決算発表予定日(/fins/announcement)をコールします。フリープランの場合条件付きで利用可
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [決算発表予定日(/fins/announcement) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/announcement)
	 *
	 * @param {{
	 * 			pagination_key?: string;
	 * 		}} [param0={}] 
	 * @param {string} param0.pagination_key 
	 * @returns {Promise<DUResultT<FinsAnnouncementResponse ,AxiosError | unknown>>} 
	 */
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
		
		return JQuantsAPIClient._makeAPIResult<FinsAnnouncementResponse>(
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
	/**
	 * 日経225オプション四本値(/option/index_option)をコールします。要スタンダードプラン。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [“日経225オプション四本値(/option/index_option) | J-Quants API”](https://jpx.gitbook.io/j-quants-ja/api-reference/index_option)
	 *
	 * @param {{
	 * 			date:	string | Date | Dayjs;
	 * 			pagination_key?: string;
	 * 		}} param0 - API リクエストパラメータ
	 * @param {string | Date | Dayjs} param0.date - 日付
	 * @param {string} param0.pagination_key - ページネーションキー
	 * @returns {Promise<DUResultT<OptionIndexOptionResponse ,AxiosError | unknown>>} インデックスオプションデータを非同期で取得します。
	 */
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

		return JQuantsAPIClient._makeAPIResult<OptionIndexOptionResponse>(
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
	
	/**
	 * 先物四本値(/derivatives/futures)をコールします。要プレミアムプラン。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 *
	 * - [先物四本値(/derivatives/futures) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/futures)
	 *
	 * @param {{
	 * 			date:				string | Date | Dayjs;
	 * 			category?:			DERIVATIVES_FUTURES_CAT_T;
	 * 			contract_flag?:		string;
	 * 			pagination_key?:	string;
	 * 		}} param0 
	 * @param {*} param0.date 
	 * @param {DERIVATIVES_FUTURES_CAT_T} param0.category 
	 * @param {string} param0.contract_flag 
	 * @param {string} param0.pagination_key 
	 * @returns {Promise<DUResultT<DerivativesFuturesResponse,AxiosError | unknown>>} 
	 */
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

		return JQuantsAPIClient._makeAPIResult<DerivativesFuturesResponse>(
			r,
			isDerivativesFuturesResponse,
			'DerivativesFuturesResponse',
			'derivativesFutures()'
		);
	}


	// API: /derivatives/options
	//       _           _            _   _                 ___        _   _                 
	//    __| | ___ _ __(_)_   ____ _| |_(_)_   _____  ___ / _ \ _ __ | |_(_) ___  _ __  ___ 
	//   / _` |/ _ \ '__| \ \ / / _` | __| \ \ / / _ \/ __| | | | '_ \| __| |/ _ \| '_ \/ __|
	//  | (_| |  __/ |  | |\ V / (_| | |_| |\ V /  __/\__ \ |_| | |_) | |_| | (_) | | | \__ \
	//   \__,_|\___|_|  |_| \_/ \__,_|\__|_| \_/ \___||___/\___/| .__/ \__|_|\___/|_| |_|___/
	//                                                          |_|                          
	/**
	 * オプション四本値(/derivatives/options)をコールします。要プレミアムプラン。
	 *
	 * 詳細は公式ドキュメントを参照してください。
	 * - [オプション四本値(/derivatives/options) | J-Quants API](https://jpx.gitbook.io/j-quants-ja/api-reference/options)
	 *
	 * @param {{
	 * 			date:				string | Date | Dayjs;
	 * 			category?:			DERIVATIVES_OPTIONS_CAT_T;
	 * 			code?:				string;
	 * 			contract_flag?:		string;
	 * 			pagination_key?:	string;
	 * 		}} param0 
	 * @param {*} param0.date 
	 * @param {DERIVATIVES_OPTIONS_CAT_T} param0.category 
	 * @param {string} param0.code 
	 * @param {string} param0.contract_flag 
	 * @param {string} param0.pagination_key 
	 * @returns {Promise<DUResultT<DerivativesOptionsResponse ,AxiosError | unknown>>} 
	 */
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
		
		return JQuantsAPIClient._makeAPIResult<DerivativesOptionsResponse>(
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
	 * required by the J-Quants API.
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
	private toJQDate( date: string | Date | Dayjs ): string
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