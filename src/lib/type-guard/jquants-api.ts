
import type {
	TokenAuthUserResponse,
	TokenAuthRefreshResponse,
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
} from '../../types';

type KVValidTypes = 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array';
type KVTypeValidatorT =
{
	key: string;
	type: KVValidTypes | KVValidTypes[];
		// JSON.parse の結果、値に undefined や function が入る事はない
	required: boolean;
};

function KVTypeValidator(data: unknown, defines: readonly KVTypeValidatorT[]): boolean
{
	if( typeof data !== 'object' || data === null )
	{
		return false;
	}

	const record = data as Record<string,unknown>;
	for( const {key,type,required} of defines )
	{
		const hasKey = key in record;

		if( required || hasKey )
		{
			const value = record[key];

			if( value === undefined ){ return false };

			let types: string[];
			if( ! Array.isArray( type ) )
			{
				types = [type];
			}
			else
			{
				types = type;
			}

			let isTypeOK = false;
			for(const expectedType of types )
			{
				switch( expectedType )
				{
					case 'null':
						if( value === null ) { isTypeOK = true };
						break;
					
					case 'array':
						if( Array.isArray(value) ){ isTypeOK = true };
						break;
					
					default:
						if( typeof value === expectedType ){ isTypeOK = true };
						break;
				}
			}

			if( ! isTypeOK )
			{
				return false;
			}
			
		}
		// else{ 必須ではない、かつ存在もしていない -> 無視して良い }
	}

	return true;
}



/**
 * `data` が {@link TokenAuthUserResponse} 型であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @returns {data is TokenAuthUserResponse} 
 * @category J-Quants API レスポンス
 */
export function isTokenAuthUserResponse(data: unknown): data is TokenAuthUserResponse
{
	if( typeof data === 'object' 
		&& data !== null
		&& 'refreshToken' in data
		&& typeof data.refreshToken === 'string'
	)
	{
		return true;
	}

	return false;
}



/**
 * `data` が {@link TokenAuthRefreshResponse} 型であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @returns {data is TokenAuthRefreshResponse} 
 * @category J-Quants API レスポンス
 */
export function isTokenAuthRefreshResponse(data: unknown): data is TokenAuthRefreshResponse
{
	if( typeof data === 'object' 
		&& data !== null
		&& 'idToken' in data
		&& typeof data.idToken === 'string'
	)
	{
		return true;
	}

	return false;
}

// 上場銘柄一覧(/listed/info)
/**
 * `data` が {@link ListedInfoResponse} 型（上場銘柄一覧(/listed/info)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、info に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is ListedInfoResponse} 
 * @category J-Quants API レスポンス
 */
export function isListedInfoResponse(data: unknown ,sampleSize = 0 ): data is ListedInfoResponse
{
	const rootKey = 'info';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const listedInfoItemSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: 'Date',				type:'string' },
		{required: true,	key: 'Code',				type:'string' },
		{required: true,	key: 'CompanyName',			type:'string' },
		{required: true,	key: 'CompanyNameEnglish',	type:'string' },
		{required: true,	key: 'Sector17Code',		type:'string' },
		{required: true,	key: 'Sector17CodeName',	type:'string' },
		{required: true,	key: 'Sector33Code',		type:'string' },
		{required: true,	key: 'Sector33CodeName',	type:'string' },
		{required: true,	key: 'ScaleCategory',		type:'string' },
		{required: true,	key: 'MarketCode',			type:'string' },
		{required: true,	key: 'MarketCodeName',		type:'string' },
		{required: false,	key: 'MarginCode',			type:'string' },
		{required: false,	key: 'MarginCodeName',		type:'string' }
	];

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return verifyList.every( item => KVTypeValidator( item ,listedInfoItemSpecs) );
}


// 株価四本値(/prices/daily_quotes)
/**
 * `data` が {@link PricesDailyQuotesResponse}型（株価四本値(/prices/daily_quotes)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`daily_quotes` に含まれるオブジェクトリストのうち、最初 `sampleSize` 分だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is PricesDailyQuotesResponse} 
 * @category J-Quants API レスポンス
 */
export function isPricesDailyQuotesResponse(data: unknown ,sampleSize = 0 ): data is PricesDailyQuotesResponse
{
	const rootKey = 'daily_quotes';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,	type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'AdjustmentClose',				type: 'number' },
		{ required: true,	key: 'AdjustmentFactor',			type: 'number' },
		{ required: true,	key: 'AdjustmentHigh',				type: 'number' },
		{ required: true,	key: 'AdjustmentLow',				type: 'number' },
		{ required: true,	key: 'AdjustmentOpen',				type: 'number' },
		{ required: true,	key: 'AdjustmentVolume',			type: 'number' },
		{ required: true,	key: 'Close',						type: 'number' },
		{ required: true,	key: 'Code',						type: 'string' },
		{ required: true,	key: 'Date',						type: 'string' },
		{ required: true,	key: 'High',						type: 'number' },
		{ required: true,	key: 'Low',							type: 'number' },
		{ required: true,	key: 'LowerLimit',					type: 'string' },
		{ required: true,	key: 'Open',						type: 'number' },
		{ required: true,	key: 'TurnoverValue',				type: 'number' },
		{ required: true,	key: 'UpperLimit',					type: 'string' },
		{ required: true,	key: 'Volume',						type: 'number' },

		{ required: false,	key: 'MorningOpen',					type: 'number' },
		{ required: false,	key: 'MorningHigh',					type: 'number' },
		{ required: false,	key: 'MorningLow',					type: 'number' },
		{ required: false,	key: 'MorningClose',				type: 'number' },
		{ required: false,	key: 'MorningUpperLimit',			type: 'string' },
		{ required: false,	key: 'MorningLowerLimit',			type: 'string' },
		{ required: false,	key: 'MorningVolume',				type: 'number' },
		{ required: false,	key: 'MorningTurnoverValue',		type: 'number' },
		{ required: false,	key: 'MorningAdjustmentOpen',		type: 'number' },
		{ required: false,	key: 'MorningAdjustmentHigh',		type: 'number' },
		{ required: false,	key: 'MorningAdjustmentLow',		type: 'number' },
		{ required: false,	key: 'MorningAdjustmentClose',		type: 'number' },
		{ required: false,	key: 'MorningAdjustmentVolume',		type: 'number' },

		{ required: false,	key: 'AfternoonOpen',				type: 'number' },
		{ required: false,	key: 'AfternoonHigh',				type: 'number' },
		{ required: false,	key: 'AfternoonLow',				type: 'number' },
		{ required: false,	key: 'AfternoonClose',				type: 'number' },
		{ required: false,	key: 'AfternoonUpperLimit',			type: 'string' },
		{ required: false,	key: 'AfternoonLowerLimit',			type: 'string' },
		{ required: false,	key: 'AfternoonVolume',				type: 'number' },
		{ required: false,	key: 'AfternoonTurnoverValue',		type: 'number' },
		{ required: false,	key: 'AfternoonAdjustmentOpen',		type: 'number' },
		{ required: false,	key: 'AfternoonAdjustmentHigh',		type: 'number' },
		{ required: false,	key: 'AfternoonAdjustmentLow',		type: 'number' },
		{ required: false,	key: 'AfternoonAdjustmentClose',	type: 'number' },
		{ required: false,	key: 'AfternoonAdjustmentVolume',	type: 'number' }
	] as const;


	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();
	
	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link PricesPricesAmResponse}型（前場四本値(/prices/prices_am)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0]  - 1 以上の値を指定した場合、info に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is PricesPricesAmResponse} 
 * @category J-Quants API レスポンス
 */
export function isPricesPricesAmResponse( data: unknown , sampleSize = 0 ): data is PricesPricesAmResponse
{
	const rootKey = 'prices_am';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,	type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',					type: 'string' },
		{ required: true,	key: 'Code',					type: 'string' },
		{ required: true,	key: 'MorningOpen',				type: 'number' },
		{ required: true,	key: 'MorningHigh',				type: 'number' },
		{ required: true,	key: 'MorningLow',				type: 'number' },
		{ required: true,	key: 'MorningClose',			type: 'number' },
		{ required: true,	key: 'MorningVolume',			type: 'number' },
		{ required: true,	key: 'MorningTurnoverValue',	type: 'number' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link MarketsTradesSpecResponse}型（投資部門別情報(/markets/trades_spec)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、info に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsTradesSpecResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsTradesSpecResponse( data: unknown , sampleSize = 0 ): data is MarketsTradesSpecResponse
{
	const rootKey = 'trades_spec';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,	type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'PublishedDate',						type: 'string' },
		{ required: true,	key: 'StartDate',							type: 'string' },
		{ required: true,	key: 'EndDate',								type: 'string' },
		{ required: true,	key: 'Section',								type: 'string' },
		{ required: true,	key: 'ProprietarySales',					type: 'number' },
		{ required: true,	key: 'ProprietaryPurchases',				type: 'number' },
		{ required: true,	key: 'ProprietaryTotal',					type: 'number' },
		{ required: true,	key: 'ProprietaryBalance',					type: 'number' },
		{ required: true,	key: 'BrokerageSales',						type: 'number' },
		{ required: true,	key: 'BrokeragePurchases',					type: 'number' },
		{ required: true,	key: 'BrokerageTotal',						type: 'number' },
		{ required: true,	key: 'BrokerageBalance',					type: 'number' },
		{ required: true,	key: 'TotalSales',							type: 'number' },
		{ required: true,	key: 'TotalPurchases',						type: 'number' },
		{ required: true,	key: 'TotalTotal',							type: 'number' },
		{ required: true,	key: 'TotalBalance',						type: 'number' },
		{ required: true,	key: 'IndividualsSales',					type: 'number' },
		{ required: true,	key: 'IndividualsPurchases',				type: 'number' },
		{ required: true,	key: 'IndividualsTotal',					type: 'number' },
		{ required: true,	key: 'IndividualsBalance',					type: 'number' },
		{ required: true,	key: 'ForeignersSales',						type: 'number' },
		{ required: true,	key: 'ForeignersPurchases',					type: 'number' },
		{ required: true,	key: 'ForeignersTotal',						type: 'number' },
		{ required: true,	key: 'ForeignersBalance',					type: 'number' },
		{ required: true,	key: 'SecuritiesCosSales',					type: 'number' },
		{ required: true,	key: 'SecuritiesCosPurchases',				type: 'number' },
		{ required: true,	key: 'SecuritiesCosTotal',					type: 'number' },
		{ required: true,	key: 'SecuritiesCosBalance',				type: 'number' },
		{ required: true,	key: 'InvestmentTrustsSales',				type: 'number' },
		{ required: true,	key: 'InvestmentTrustsPurchases',			type: 'number' },
		{ required: true,	key: 'InvestmentTrustsTotal',				type: 'number' },
		{ required: true,	key: 'InvestmentTrustsBalance',				type: 'number' },
		{ required: true,	key: 'BusinessCosSales',					type: 'number' },
		{ required: true,	key: 'BusinessCosPurchases',				type: 'number' },
		{ required: true,	key: 'BusinessCosTotal',					type: 'number' },
		{ required: true,	key: 'BusinessCosBalance',					type: 'number' },
		{ required: true,	key: 'OtherCosSales',						type: 'number' },
		{ required: true,	key: 'OtherCosPurchases',					type: 'number' },
		{ required: true,	key: 'OtherCosTotal',						type: 'number' },
		{ required: true,	key: 'OtherCosBalance',						type: 'number' },
		{ required: true,	key: 'InsuranceCosSales',					type: 'number' },
		{ required: true,	key: 'InsuranceCosPurchases',				type: 'number' },
		{ required: true,	key: 'InsuranceCosTotal',					type: 'number' },
		{ required: true,	key: 'InsuranceCosBalance',					type: 'number' },
		{ required: true,	key: 'CityBKsRegionalBKsEtcSales',			type: 'number' },
		{ required: true,	key: 'CityBKsRegionalBKsEtcPurchases',		type: 'number' },
		{ required: true,	key: 'CityBKsRegionalBKsEtcTotal',			type: 'number' },
		{ required: true,	key: 'CityBKsRegionalBKsEtcBalance',		type: 'number' },
		{ required: true,	key: 'TrustBanksSales',						type: 'number' },
		{ required: true,	key: 'TrustBanksPurchases',					type: 'number' },
		{ required: true,	key: 'TrustBanksTotal',						type: 'number' },
		{ required: true,	key: 'TrustBanksBalance',					type: 'number' },
		{ required: true,	key: 'OtherFinancialInstitutionsSales',		type: 'number' },
		{ required: true,	key: 'OtherFinancialInstitutionsPurchases',	type: 'number' },
		{ required: true,	key: 'OtherFinancialInstitutionsTotal',		type: 'number' },
		{ required: true,	key: 'OtherFinancialInstitutionsBalance',	type: 'number' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}


/**
 * `data` が {@link MarketsWeeklyMarginInterestResponse}型（信用取引週末残高(/markets/weekly_margin_interest)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、info に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsWeeklyMarginInterestResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsWeeklyMarginInterestResponse( data:unknown , sampleSize = 0 )
	: data is MarketsWeeklyMarginInterestResponse
{
	const rootKey = 'weekly_margin_interest';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,	type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',								type: 'string' },
		{ required: true,	key: 'Code',								type: 'string' },
		{ required: true,	key: 'ShortMarginTradeVolume',				type: 'number' },
		{ required: true,	key: 'LongMarginTradeVolume',				type: 'number' },
		{ required: true,	key: 'ShortNegotiableMarginTradeVolume',	type: 'number' },
		{ required: true,	key: 'LongNegotiableMarginTradeVolume',		type: 'number' },
		{ required: true,	key: 'ShortStandardizedMarginTradeVolume',	type: 'number' },
		{ required: true,	key: 'LongStandardizedMarginTradeVolume',	type: 'number' },
		{ required: true,	key: 'IssueType',							type: 'string' },
		
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}


/**
 * `data` が {@link MarketsShortSellingResponse}型（業種別空売り比率(/markets/short_selling)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`short_selling` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsShortSellingResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsShortSellingResponse( data:unknown , sampleSize = 0 )
	: data is MarketsShortSellingResponse
{
	const rootKey = 'short_selling';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,	type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',											type: 'string' },
		{ required: true,	key: 'Sector33Code',									type: 'string' },
		{ required: true,	key: 'SellingExcludingShortSellingTurnoverValue',		type: 'number' },
		{ required: true,	key: 'ShortSellingWithRestrictionsTurnoverValue',		type: 'number' },
		{ required: true,	key: 'ShortSellingWithoutRestrictionsTurnoverValue',	type: 'number' },		
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link MarketsShortSellingPositionsResponse}型（空売り残高報告(/markets/short_selling_positions)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`short_selling_positions` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsShortSellingPositionsResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsShortSellingPositionsResponse( data:unknown , sampleSize = 0 )
	: data is MarketsShortSellingPositionsResponse
{
	const rootKey = 'short_selling_positions';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'DisclosedDate',								type: 'string' },
		{ required: true,	key: 'CalculatedDate',								type: 'string' },
		{ required: true,	key: 'Code',										type: 'string' },
		{ required: true,	key: 'ShortSellerName',								type: 'string' },
		{ required: true,	key: 'ShortSellerAddress',							type: 'string' },
		{ required: true,	key: 'DiscretionaryInvestmentContractorName',		type: 'string' },
		{ required: true,	key: 'DiscretionaryInvestmentContractorAddress',	type: 'string' },
		{ required: true,	key: 'InvestmentFundName',							type: 'string' },
		{ required: true,	key: 'ShortPositionsToSharesOutstandingRatio',		type: 'number' },
		{ required: true,	key: 'ShortPositionsInSharesNumber',				type: 'number' },
		{ required: true,	key: 'ShortPositionsInTradingUnitsNumber',			type: 'number' },
		{ required: true,	key: 'CalculationInPreviousReportingDate',			type: 'string' },
		{ required: true,	key: 'ShortPositionsInPreviousReportingRatio',		type: 'number' },
		{ required: true,	key: 'Notes',										type: 'string' },
				
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link MarketsBreakdownResponse}型（売買内訳データ(/markets/breakdown)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`breakdown` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsBreakdownResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsBreakdownResponse( data:unknown , sampleSize = 0 )
	: data is MarketsBreakdownResponse
{
	const rootKey = 'breakdown';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',							type: 'string' },
		{ required: true,	key: 'Code',							type: 'string' },
		{ required: true,	key: 'LongSellValue',					type: 'number' },
		{ required: true,	key: 'ShortSellWithoutMarginValue',		type: 'number' },
		{ required: true,	key: 'MarginSellNewValue',				type: 'number' },
		{ required: true,	key: 'MarginSellCloseValue',			type: 'number' },
		{ required: true,	key: 'LongBuyValue',					type: 'number' },
		{ required: true,	key: 'MarginBuyNewValue',				type: 'number' },
		{ required: true,	key: 'MarginBuyCloseValue',				type: 'number' },
		{ required: true,	key: 'LongSellVolume',					type: 'number' },
		{ required: true,	key: 'ShortSellWithoutMarginVolume',	type: 'number' },
		{ required: true,	key: 'MarginSellNewVolume',				type: 'number' },
		{ required: true,	key: 'MarginSellCloseVolume',			type: 'number' },
		{ required: true,	key: 'LongBuyVolume',					type: 'number' },
		{ required: true,	key: 'MarginBuyNewVolume',				type: 'number' },
		{ required: true,	key: 'MarginBuyCloseVolume',			type: 'number' },
				
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link MarketsTradingCalendarResponse}型（取引カレンダー(/markets/trading_calendar)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`trading_calendar` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is MarketsTradingCalendarResponse} 
 * @category J-Quants API レスポンス
 */
export function isMarketsTradingCalendarResponse( data:unknown , sampleSize: number = 0 )
	: data is MarketsTradingCalendarResponse
{
	const rootKey = 'trading_calendar';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' }
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',			type: 'string' },
		{ required: true,	key: 'HolidayDivision',	type: 'string' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}


/**
 * `data` が {@link IndicesResponse}型（指数四本値(/indices)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`indices` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is IndicesResponse} 
 * @category J-Quants API レスポンス
 */
export function isIndicesResponse( data:unknown , sampleSize: number = 0 )
	: data is IndicesResponse
{
	const rootKey = 'indices';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',	type: 'string' },
		{ required: true,	key: 'Code',	type: 'string' },
		{ required: true,	key: 'Open',	type: 'number' },
		{ required: true,	key: 'High',	type: 'number' },
		{ required: true,	key: 'Low',		type: 'number' },
		{ required: true,	key: 'Close',	type: 'number' },	
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}


/**
 * `data` が {@link IndicesTopixResponse}型（TOPIX指数四本値(/indices/topix)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`topix` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is IndicesTopixResponse} 
 * @category J-Quants API レスポンス
 */
export function isIndicesTopixResponse( data:unknown , sampleSize: number = 0 )
	: data is IndicesTopixResponse
{
	const rootKey = 'topix';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',	type: 'string' },
		{ required: true,	key: 'Open',	type: 'number' },
		{ required: true,	key: 'High',	type: 'number' },
		{ required: true,	key: 'Low',		type: 'number' },
		{ required: true,	key: 'Close',	type: 'number' },
		{ required: true,	key: 'Close',	type: 'number' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link FinsStatementsResponse}型（財務情報(/fins/statements)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`statements` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is FinsStatementsResponse} 
 * @category J-Quants API レスポンス
 */
export function isFinsStatementsResponse( data:unknown , sampleSize: number = 0 )
	: data is FinsStatementsResponse
{
	const rootKey = 'statements';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'DisclosedDate',								type: 'string' },
		{ required: true,	key: 'DisclosedTime',								type: 'string' },
		{ required: true,	key: 'LocalCode',									type: 'string' },
		{ required: true,	key: 'DisclosureNumber',							type: 'string' },
		{ required: true,	key: 'TypeOfDocument',								type: 'string' },
		{ required: true,	key: 'TypeOfCurrentPeriod',							type: 'string' },
		{ required: true,	key: 'CurrentPeriodStartDate',						type: 'string' },
		{ required: true,	key: 'CurrentPeriodEndDate',						type: 'string' },
		{ required: true,	key: 'CurrentFiscalYearStartDate',					type: 'string' },
		{ required: true,	key: 'CurrentFiscalYearEndDate',					type: 'string' },
		{ required: true,	key: 'NextFiscalYearStartDate',						type: 'string' },
		{ required: true,	key: 'NextFiscalYearEndDate',						type: 'string' },
		{ required: true,	key: 'NetSales',									type: 'string' },
		{ required: true,	key: 'OperatingProfit',								type: 'string' },
		{ required: true,	key: 'OrdinaryProfit',								type: 'string' },
		{ required: true,	key: 'Profit',										type: 'string' },
		{ required: true,	key: 'EarningsPerShare',							type: 'string' },
		{ required: true,	key: 'DilutedEarningsPerShare',						type: 'string' },
		{ required: true,	key: 'TotalAssets',									type: 'string' },
		{ required: true,	key: 'Equity',										type: 'string' },
		{ required: true,	key: 'EquityToAssetRatio',							type: 'string' },
		{ required: true,	key: 'BookValuePerShare',							type: 'string' },
		{ required: true,	key: 'CashFlowsFromOperatingActivities',			type: 'string' },
		{ required: true,	key: 'CashFlowsFromInvestingActivities',			type: 'string' },
		{ required: true,	key: 'CashFlowsFromFinancingActivities',			type: 'string' },
		{ required: true,	key: 'CashAndEquivalents',							type: 'string' },
		{ required: true,	key: 'ResultDividendPerShare1stQuarter',			type: 'string' },
		{ required: true,	key: 'ResultDividendPerShare2ndQuarter',			type: 'string' },
		{ required: true,	key: 'ResultDividendPerShare3rdQuarter',			type: 'string' },
		{ required: true,	key: 'ResultDividendPerShareFiscalYearEnd',			type: 'string' },
		{ required: true,	key: 'ResultDividendPerShareAnnual',				type: 'string' },
		{ required: true,	key: 'DistributionsPerUnit(REIT)',					type: 'string' },
		{ required: true,	key: 'ResultTotalDividendPaidAnnual',				type: 'string' },
		{ required: true,	key: 'ResultPayoutRatioAnnual',						type: 'string' },
		{ required: true,	key: 'ForecastDividendPerShare1stQuarter',			type: 'string' },
		{ required: true,	key: 'ForecastDividendPerShare2ndQuarter',			type: 'string' },
		{ required: true,	key: 'ForecastDividendPerShare3rdQuarter',			type: 'string' },
		{ required: true,	key: 'ForecastDividendPerShareFiscalYearEnd',		type: 'string' },
		{ required: true,	key: 'ForecastDividendPerShareAnnual',				type: 'string' },
		{ required: true,	key: 'ForecastDistributionsPerUnit(REIT)',			type: 'string' },
		{ required: true,	key: 'ForecastTotalDividendPaidAnnual',				type: 'string' },
		{ required: true,	key: 'ForecastPayoutRatioAnnual',					type: 'string' },
		{ required: true,	key: 'NextYearForecastDividendPerShare1stQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastDividendPerShare2ndQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastDividendPerShare3rdQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastDividendPerShareFiscalYearEnd',	type: 'string' },
		{ required: true,	key: 'NextYearForecastDividendPerShareAnnual',		type: 'string' },
		{ required: true,	key: 'NextYearForecastDistributionsPerUnit(REIT)',	type: 'string' },
		{ required: true,	key: 'NextYearForecastPayoutRatioAnnual',			type: 'string' },
		{ required: true,	key: 'ForecastNetSales2ndQuarter',					type: 'string' },
		{ required: true,	key: 'ForecastOperatingProfit2ndQuarter',			type: 'string' },
		{ required: true,	key: 'ForecastOrdinaryProfit2ndQuarter',			type: 'string' },
		{ required: true,	key: 'ForecastProfit2ndQuarter',					type: 'string' },
		{ required: true,	key: 'ForecastEarningsPerShare2ndQuarter',			type: 'string' },
		{ required: true,	key: 'NextYearForecastNetSales2ndQuarter',			type: 'string' },
		{ required: true,	key: 'NextYearForecastOperatingProfit2ndQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastOrdinaryProfit2ndQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastProfit2ndQuarter',			type: 'string' },
		{ required: true,	key: 'NextYearForecastEarningsPerShare2ndQuarter',	type: 'string' },
		{ required: true,	key: 'ForecastNetSales',							type: 'string' },
		{ required: true,	key: 'ForecastOperatingProfit',						type: 'string' },
		{ required: true,	key: 'ForecastOrdinaryProfit',						type: 'string' },
		{ required: true,	key: 'ForecastProfit',								type: 'string' },
		{ required: true,	key: 'ForecastEarningsPerShare',					type: 'string' },
		{ required: true,	key: 'NextYearForecastNetSales',					type: 'string' },
		{ required: true,	key: 'NextYearForecastOperatingProfit',				type: 'string' },
		{ required: true,	key: 'NextYearForecastOrdinaryProfit',				type: 'string' },
		{ required: true,	key: 'NextYearForecastProfit',						type: 'string' },
		{ required: true,	key: 'NextYearForecastEarningsPerShare',			type: 'string' },
		{ required: true,	key: 'MaterialChangesInSubsidiaries',				type: 'string' },
		{ required: true,	key: 'SignificantChangesInTheScopeOfConsolidation',	type: 'string' },
		{ required: true,	key: 'ChangesBasedOnRevisionsOfAccountingStandard',	type: 'string' },
		{ required: true,	key: 'ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard',	type: 'string' },
		{ required: true,	key: 'ChangesInAccountingEstimates',				type: 'string' },
		{ required: true,	key: 'RetrospectiveRestatement',					type: 'string' },
		{ required: true,	key: 'NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock',	type: 'string' },
		{ required: true,	key: 'NumberOfTreasuryStockAtTheEndOfFiscalYear',	type: 'string' },
		{ required: true,	key: 'AverageNumberOfShares',						type: 'string' },
		{ required: true,	key: 'NonConsolidatedNetSales',						type: 'string' },
		{ required: true,	key: 'NonConsolidatedOperatingProfit',				type: 'string' },
		{ required: true,	key: 'NonConsolidatedOrdinaryProfit',				type: 'string' },
		{ required: true,	key: 'NonConsolidatedProfit',						type: 'string' },
		{ required: true,	key: 'NonConsolidatedEarningsPerShare',				type: 'string' },
		{ required: true,	key: 'NonConsolidatedTotalAssets',					type: 'string' },
		{ required: true,	key: 'NonConsolidatedEquity',						type: 'string' },
		{ required: true,	key: 'NonConsolidatedEquityToAssetRatio',			type: 'string' },
		{ required: true,	key: 'NonConsolidatedBookValuePerShare',			type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedNetSales2ndQuarter',	type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedOperatingProfit2ndQuarter',	type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedOrdinaryProfit2ndQuarter',		type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedProfit2ndQuarter',		type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedEarningsPerShare2ndQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedNetSales2ndQuarter',	type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedOperatingProfit2ndQuarter',type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter',type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedProfit2ndQuarter',		type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter',type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedNetSales',				type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedOperatingProfit',		type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedOrdinaryProfit',		type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedProfit',				type: 'string' },
		{ required: true,	key: 'ForecastNonConsolidatedEarningsPerShare',		type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedNetSales',		type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedOperatingProfit',	type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedOrdinaryProfit',	type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedProfit',		type: 'string' },
		{ required: true,	key: 'NextYearForecastNonConsolidatedEarningsPerShare',	type: 'string' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}


/**
 * `data` が {@link FinsFsDetailsResponse}型（財務諸表(BS/PL)(/fins/fs_details)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`fs_details` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is FinsFsDetailsResponse} 
 * @category J-Quants API レスポンス
 */
export function isFinsFsDetailsResponse( data:unknown , sampleSize: number = 0 )
	: data is FinsFsDetailsResponse
{
	const rootKey = 'fs_details';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'DisclosedDate',								type: 'string' },
		{ required: true,	key: 'DisclosedTime',								type: 'string' },
		{ required: true,	key: 'LocalCode',									type: 'string' },
		{ required: true,	key: 'DisclosureNumber',							type: 'string' },
		{ required: true,	key: 'TypeOfDocument',								type: 'string' },
		{ required: true,	key: 'FinancialStatement',							type: 'object' },
	] as const;

	const financialStatementSpecs: KVTypeValidatorT[] =
	[
		{ required: false, key: "Goodwill (IFRS)", type: 'string'},
		{ required: false, key: "Retained earnings (IFRS)", type: 'string'},
		{ required: false, key: "Operating profit (loss) (IFRS)", type: 'string'},
		{ required: false, key: "Previous fiscal year end date, DEI", type: 'string'},
		{ required: false, key: "Basic earnings (loss) per share (IFRS)", type: 'string'},
		{ required: false, key: "Document type, DEI", type: 'string'},
		{ required: false, key: "Current period end date, DEI", type: 'string'},
		{ required: false, key: "Revenue - 2 (IFRS)", type: 'string'},
		{ required: false, key: "Industry code when consolidated financial statements are prepared in accordance with industry specific regulations, DEI", type: 'string'},
		{ required: false, key: "Profit (loss) attributable to owners of parent (IFRS)", type: 'string'},
		{ required: false, key: "Other current liabilities - CL (IFRS)", type: 'string'},
		{ required: false, key: "Share of profit (loss) of investments accounted for using equity method (IFRS)", type: 'string'},
		{ required: false, key: "Current liabilities (IFRS)", type: 'string'},
		{ required: false, key: "Equity attributable to owners of parent (IFRS)", type: 'string'},
		{ required: false, key: "Whether consolidated financial statements are prepared, DEI", type: 'string'},
		{ required: false, key: "Non-current liabilities (IFRS)", type: 'string'},
		{ required: false, key: "Other expenses (IFRS)", type: 'string'},
		{ required: false, key: "Income taxes payable - CL (IFRS)", type: 'string'},
		{ required: false, key: "Filer name in English, DEI", type: 'string'},
		{ required: false, key: "Non-controlling interests (IFRS)", type: 'string'},
		{ required: false, key: "Capital surplus (IFRS)", type: 'string'},
		{ required: false, key: "Finance costs (IFRS)", type: 'string'},
		{ required: false, key: "Other current assets - CA (IFRS)", type: 'string'},
		{ required: false, key: "Property, plant and equipment (IFRS)", type: 'string'},
		{ required: false, key: "Deferred tax liabilities (IFRS)", type: 'string'},
		{ required: false, key: "Other components of equity (IFRS)", type: 'string'},
		{ required: false, key: "Current fiscal year start date, DEI", type: 'string'},
		{ required: false, key: "Type of current period, DEI", type: 'string'},
		{ required: false, key: "Cash and cash equivalents (IFRS)", type: 'string'},
		{ required: false, key: "Share capital (IFRS)", type: 'string'},
		{ required: false, key: "Retirement benefit asset - NCA (IFRS)", type: 'string'},
		{ required: false, key: "Number of submission, DEI", type: 'string'},
		{ required: false, key: "Trade and other receivables - CA (IFRS)", type: 'string'},
		{ required: false, key: "Liabilities and equity (IFRS)", type: 'string'},
		{ required: false, key: "EDINET code, DEI", type: 'string'},
		{ required: false, key: "Equity (IFRS)", type: 'string'},
		{ required: false, key: "Security code, DEI", type: 'string'},
		{ required: false, key: "Other financial assets - CA (IFRS)", type: 'string'},
		{ required: false, key: "Other financial assets - NCA (IFRS)", type: 'string'},
		{ required: false, key: "Income taxes receivable - CA (IFRS)", type: 'string'},
		{ required: false, key: "Investments accounted for using equity method (IFRS)", type: 'string'},
		{ required: false, key: "Other non-current assets - NCA (IFRS)", type: 'string'},
		{ required: false, key: "Previous fiscal year start date, DEI", type: 'string'},
		{ required: false, key: "Filer name in Japanese, DEI", type: 'string'},
		{ required: false, key: "Deferred tax assets (IFRS)", type: 'string'},
		{ required: false, key: "Trade and other payables - CL (IFRS)", type: 'string'},
		{ required: false, key: "Bonds and borrowings - CL (IFRS)", type: 'string'},
		{ required: false, key: "Current fiscal year end date, DEI", type: 'string'},
		{ required: false, key: "XBRL amendment flag, DEI", type: 'string'},
		{ required: false, key: "Non-current assets (IFRS)", type: 'string'},
		{ required: false, key: "Retirement benefit liability - NCL (IFRS)", type: 'string'},
		{ required: false, key: "Amendment flag, DEI", type: 'string'},
		{ required: false, key: "Assets (IFRS)", type: 'string'},
		{ required: false, key: "Income tax expense (IFRS)", type: 'string'},
		{ required: false, key: "Report amendment flag, DEI", type: 'string'},
		{ required: false, key: "Profit (loss) (IFRS)", type: 'string'},
		{ required: false, key: "Operating expenses (IFRS)", type: 'string'},
		{ required: false, key: "Intangible assets (IFRS)", type: 'string'},
		{ required: false, key: "Profit (loss) before tax from continuing operations (IFRS)", type: 'string'},
		{ required: false, key: "Liabilities (IFRS)", type: 'string'},
		{ required: false, key: "Accounting standards, DEI", type: 'string'},
		{ required: false, key: "Bonds and borrowings - NCL (IFRS)", type: 'string'},
		{ required: false, key: "Finance income (IFRS)", type: 'string'},
		{ required: false, key: "Profit (loss) attributable to non-controlling interests (IFRS)", type: 'string'},
		{ required: false, key: "Comparative period end date, DEI", type: 'string'},
		{ required: false, key: "Current assets (IFRS)", type: 'string'},
		{ required: false, key: "Other non-current liabilities - NCL (IFRS)", type: 'string'},
		{ required: false, key: "Other income (IFRS)", type: 'string'},
		{ required: false, key: "Treasury shares (IFRS)", type: 'string'}
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( (item) =>
		{
			return (
				KVTypeValidator( item ,subItemSpecs)
				&& KVTypeValidator( item.FinancialStatement ,financialStatementSpecs )
			);
		})
	);
}



/**
 * `data` が {@link FinsDividendResponse}型（配当金情報(/fins/dividend)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`dividend` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is FinsDividendResponse} 
 * @category J-Quants API レスポンス
 */
export function isFinsDividendResponse( data:unknown , sampleSize: number = 0 )
	: data is FinsDividendResponse
{
	const rootKey = 'dividend';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'AnnouncementDate',			type: 'string' },
		{ required: true,	key: 'AnnouncementTime',			type: 'string' },
		{ required: true,	key: 'Code',						type: 'string' },
		{ required: true,	key: 'ReferenceNumber',				type: 'string' },
		{ required: true,	key: 'StatusCode',					type: 'string' },
		{ required: true,	key: 'BoardMeetingDate',			type: 'string' },
		{ required: true,	key: 'InterimFinalCode',			type: 'string' },
		{ required: true,	key: 'ForecastResultCode',			type: 'string' },
		{ required: true,	key: 'InterimFinalTerm',			type: 'string' },
		{ required: true,	key: 'GrossDividendRate',			type: ['string','number'] },
		{ required: true,	key: 'RecordDate',					type: 'string' },
		{ required: true,	key: 'ExDate',						type: 'string' },
		{ required: true,	key: 'ActualRecordDate',			type: 'string' },
		{ required: true,	key: 'PayableDate',					type: 'string' },
		{ required: true,	key: 'CAReferenceNumber',			type: 'string' },
		{ required: true,	key: 'DistributionAmount',			type: ['string','number'] },
		{ required: true,	key: 'RetainedEarnings',			type: ['string','number'] },
		{ required: true,	key: 'DeemedDividend',				type: ['string','number'] },
		{ required: true,	key: 'DeemedCapitalGains',			type: ['string','number'] },
		{ required: true,	key: 'NetAssetDecreaseRatio',		type: ['string','number'] },
		{ required: true,	key: 'CommemorativeSpecialCode',	type: 'string' },
		{ required: true,	key: 'CommemorativeDividendRate',	type: ['string','number'] },
		{ required: true,	key: 'SpecialDividendRate',			type: ['string','number'] },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link FinsAnnouncementResponse}型（決算発表予定日(/fins/announcement)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`announcement` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is FinsAnnouncementResponse} 
 * @category J-Quants API レスポンス
 */
export function isFinsAnnouncementResponse( data:unknown , sampleSize: number = 0 )
	: data is FinsAnnouncementResponse
{
	const rootKey = 'announcement';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',			type: 'string' },
		{ required: true,	key: 'Code',			type: 'string' },
		{ required: true,	key: 'CompanyName',		type: 'string' },
		{ required: true,	key: 'FiscalYear',		type: 'string' },
		{ required: true,	key: 'SectorName',		type: 'string' },
		{ required: true,	key: 'FiscalQuarter',	type: 'string' },
		{ required: true,	key: 'Section',			type: 'string' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link OptionIndexOptionResponse}型（日経225オプション四本値(/option/index_option)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`index_option` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is OptionIndexOptionResponse} 
 * @category J-Quants API レスポンス
 */
export function isOptionIndexOptionResponse( data:unknown , sampleSize: number = 0 )
	: data is OptionIndexOptionResponse
{
	const rootKey = 'index_option';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Date',							type: 'string' },
		{ required: true,	key: 'Code',							type: 'string' },
		{ required: true,	key: 'WholeDayOpen',					type: 'number' },
		{ required: true,	key: 'WholeDayHigh',					type: 'number' },
		{ required: true,	key: 'WholeDayLow',						type: 'number' },
		{ required: true,	key: 'WholeDayClose',					type: 'number' },
		{ required: true,	key: 'NightSessionOpen',				type: ['number','string'] },
		{ required: true,	key: 'NightSessionHigh',				type: ['number','string'] },
		{ required: true,	key: 'NightSessionLow',					type: ['number','string'] },
		{ required: true,	key: 'NightSessionClose',				type: ['number','string'] },
		{ required: true,	key: 'DaySessionOpen',					type: 'number' },
		{ required: true,	key: 'DaySessionHigh',					type: 'number' },
		{ required: true,	key: 'DaySessionLow',					type: 'number' },
		{ required: true,	key: 'DaySessionClose',					type: 'number' },
		{ required: true,	key: 'Volume',							type: 'number' },
		{ required: true,	key: 'OpenInterest',					type: 'number' },
		{ required: true,	key: 'TurnoverValue',					type: 'number' },
		{ required: true,	key: 'ContractMonth',					type: 'string' },
		{ required: true,	key: 'StrikePrice',						type: 'number' },
		{ required: true,	key: 'Volume(OnlyAuction)',				type: 'number' },
		{ required: true,	key: 'EmergencyMarginTriggerDivision',	type: 'string' },
		{ required: true,	key: 'PutCallDivision',					type: 'string' },
		{ required: true,	key: 'LastTradingDay',					type: 'string' },
		{ required: true,	key: 'SpecialQuotationDay',				type: 'string' },
		{ required: true,	key: 'SettlementPrice',					type: 'number' },
		{ required: true,	key: 'TheoreticalPrice',				type: 'number' },
		{ required: true,	key: 'BaseVolatility',					type: 'number' },
		{ required: true,	key: 'UnderlyingPrice',					type: 'number' },
		{ required: true,	key: 'ImpliedVolatility',				type: 'number' },
		{ required: true,	key: 'InterestRate',					type: 'number' },

	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link DerivativesFuturesResponse}型（先物四本値(/derivatives/futures)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`futures` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is DerivativesFuturesResponse} 
 * @category J-Quants API レスポンス
 */
export function isDerivativesFuturesResponse( data:unknown , sampleSize: number = 0 )
	: data is DerivativesFuturesResponse
{
	const rootKey = 'futures';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Code',							type: 'string'},
		{ required: true,	key: 'DerivativesProductCategory',		type: 'string'},
		{ required: true,	key: 'Date',							type: 'string'},
		{ required: true,	key: 'WholeDayOpen',					type: 'number'},
		{ required: true,	key: 'WholeDayHigh',					type: 'number'},
		{ required: true,	key: 'WholeDayLow',						type: 'number'},
		{ required: true,	key: 'WholeDayClose',					type: 'number'},
		{ required: true,	key: 'MorningSessionOpen',				type: ['string','number'] },
		{ required: true,	key: 'MorningSessionHigh',				type: ['string','number'] },
		{ required: true,	key: 'MorningSessionLow',				type: ['string','number'] },
		{ required: true,	key: 'MorningSessionClose',				type: ['string','number'] },
		{ required: true,	key: 'NightSessionOpen',				type: ['string','number'] },
		{ required: true,	key: 'NightSessionHigh',				type: ['string','number'] },
		{ required: true,	key: 'NightSessionLow',					type: ['string','number'] },
		{ required: true,	key: 'NightSessionClose',				type: ['string','number'] },
		{ required: true,	key: 'DaySessionOpen',					type: 'number'},
		{ required: true,	key: 'DaySessionHigh',					type: 'number'},
		{ required: true,	key: 'DaySessionLow',					type: 'number'},
		{ required: true,	key: 'DaySessionClose',					type: 'number'},
		{ required: true,	key: 'Volume(OnlyAuction)',				type: 'number'},
		{ required: true,	key: 'OpenInterest',					type: 'number'},
		{ required: true,	key: 'TurnoverValue',					type: 'number'},
		{ required: true,	key: 'ContractMonth',					type: 'string'},
		{ required: true,	key: 'Volume(OnlyAuction)',				type: 'number' },
		{ required: true,	key: 'EmergencyMarginTriggerDivision',	type: 'string' },
		{ required: true,	key: 'LastTradingDay',					type: 'string' },
		{ required: true,	key: 'SpecialQuotationDay',				type: 'string' },
		{ required: true,	key: 'SettlementPrice',					type: 'number' },
		{ required: true,	key: 'CentralContractMonthFlag',		type: 'string' },
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}



/**
 * `data` が {@link DerivativesOptionsResponse}型（オプション四本値(/derivatives/options)レスポンス）であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} data - 評価対象データ
 * @param {number} [sampleSize=0] - 1 以上の値を指定した場合、`options` に含まれるオブジェクトリストのうち、最初のその数だけのデータを型検証に使用します。
 * データサイズが大きくパフォーマンスに影響がある場合に使用してください。
 * 0 の場合は全てのデータを検証します。デフォルトは 0 です。
 * @returns {data is DerivativesOptionsResponse} 
 * @category J-Quants API レスポンス
 */
export function isDerivativesOptionsResponse( data:unknown , sampleSize: number = 0 )
	: data is DerivativesOptionsResponse
{
	const rootKey = 'options';
	if( typeof data !== 'object'
		|| data === null
		|| ! ( rootKey in data )
		|| ! Array.isArray( data[rootKey] )
	)
	{
		return false;
	}

	const rootSpecs: KVTypeValidatorT[] =
	[
		{required: true,	key: rootKey,			type:'array' },
		{required: false,	key: 'pagination_key',	type:'string'}
	] as const;

	const subItemSpecs: KVTypeValidatorT[] =
	[
		{ required: true,	key: 'Code',							type: 'string'},
		{ required: true,	key: 'DerivativesProductCategory',		type: 'string'},
		{ required: true,	key: 'UnderlyingSSO',					type: 'string'},
		{ required: true,	key: 'Date',							type: 'string'},
		{ required: true,	key: 'WholeDayOpen',					type: 'number'},
		{ required: true,	key: 'WholeDayHigh',					type: 'number'},
		{ required: true,	key: 'WholeDayLow',						type: 'number'},
		{ required: true,	key: 'WholeDayClose',					type: 'number'},
		{ required: true,	key: 'MorningSessionOpen',				type: ['string','number']},
		{ required: true,	key: 'MorningSessionHigh',				type: ['string','number']},
		{ required: true,	key: 'MorningSessionLow',				type: ['string','number']},
		{ required: true,	key: 'MorningSessionClose',				type: ['string','number']},
		{ required: true,	key: 'NightSessionOpen',				type: ['string','number']},
		{ required: true,	key: 'NightSessionHigh',				type: ['string','number']},
		{ required: true,	key: 'NightSessionLow',					type: ['string','number']},
		{ required: true,	key: 'NightSessionClose',				type: ['string','number']},
		{ required: true,	key: 'DaySessionOpen',					type: 'number'},
		{ required: true,	key: 'DaySessionHigh',					type: 'number'},
		{ required: true,	key: 'DaySessionLow',					type: 'number'},
		{ required: true,	key: 'DaySessionClose',					type: 'number'},
		{ required: true,	key: 'Volume',							type: 'number'},
		{ required: true,	key: 'OpenInterest',					type: 'number'},
		{ required: true,	key: 'TurnoverValue',					type: 'number'},
		{ required: true,	key: 'ContractMonth',					type: 'string'},
		{ required: true,	key: 'StrikePrice',						type: 'number'},
		{ required: true,	key: 'Volume(OnlyAuction)',				type: 'number'},
		{ required: true,	key: 'EmergencyMarginTriggerDivision',	type: 'string'},
		{ required: true,	key: 'PutCallDivision',					type: 'string'},
		{ required: true,	key: 'LastTradingDay',					type: 'string'},
		{ required: true,	key: 'SpecialQuotationDay',				type: 'string'},
		{ required: true,	key: 'SettlementPrice',					type: 'number'},
		{ required: true,	key: 'TheoreticalPrice',				type: 'number'},
		{ required: true,	key: 'BaseVolatility',					type: 'number'},
		{ required: true,	key: 'UnderlyingPrice',					type: 'number'},
		{ required: true,	key: 'ImpliedVolatility',				type: 'number'},
		{ required: true,	key: 'InterestRate',					type: 'number'},
		{ required: true,	key: 'CentralContractMonthFlag',		type: 'string'},
	] as const;

	const verifyList = (()=>
	{
		if( sampleSize > 0 )
		{
			return data[rootKey].slice(0, sampleSize );
		}

		return data[rootKey];
	})();

	return (
		KVTypeValidator( data , rootSpecs )
		&& verifyList.every( item => KVTypeValidator( item ,subItemSpecs) )
	);
}
