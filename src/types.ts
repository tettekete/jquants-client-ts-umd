
import {Dayjs} from "dayjs";

/**
 * トークンとその有効期限を格納するデータ型定義です。
 *
 * @typedef {TOKEN_RECORD}
 * @category その他
 */
export type TOKEN_RECORD =
{
	token: string;
	expiration: Dayjs;
};

/**
 * ロガー用インターフェイス定義
 *
 * @interface Logger_T
 * @typedef {Logger_T}
 * @category その他
 */
export interface Logger_T
{
  trace(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  fatal(message: string, ...args: unknown[]): void;
}

// 200 https://api.jquants.com/v1/token/auth_user
/**
 * 認証 API が 200 OK を返した時、AxiosResponse の data プロパティー値の型定義
 *
 * @typedef {TokenAuthUserResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type TokenAuthUserResponse =
{	
	refreshToken: string;
};

// 200 https://api.jquants.com/v1/token/auth_refresh
/**
 * ID トークン取得 API が 200 OK を返した時、AxiosResponse の data プロパティー値の型定義
 *
 * @typedef {TokenAuthRefreshResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type TokenAuthRefreshResponse =
{
	idToken: string;	
};


/**
 * APIが利用できない場合のレスポンスを表します。
 * 
 * pricesPricesAm などのAPIで、取得時間外や銘柄コードが存在しない場合に返されることがあります。
 * その場合、レスポンスのステータスコードは 2xx 系だが利用不可能なため本来のデータ構造とは異なり、message プロパティーのみを持つオブジェクトが返されます。
 *
 * @typedef {APIUnavailableResponse}
 */
export type APIUnavailableResponse =
{
	message: string;
}

//   _     _     _           _ ___        __     __  ____  ____  __
//  | |   (_)___| |_ ___  __| |_ _|_ __  / _| ___\ \/ /\ \/ /\ \/ /
//  | |   | / __| __/ _ \/ _` || || '_ \| |_ / _ \\  /  \  /  \  / 
//  | |___| \__ \ ||  __/ (_| || || | | |  _| (_) /  \  /  \  /  \ 
//  |_____|_|___/\__\___|\__,_|___|_| |_|_|  \___/_/\_\/_/\_\/_/\_\
//                                                                 
/**
 * 上場銘柄一覧(/listed/info)レスポンス `info` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {ListedInfoItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type ListedInfoItem =
{
	Date: string;
	Code: string;
	CompanyName: string;
	CompanyNameEnglish: string;
	Sector17Code: string;
	Sector17CodeName: string;
	Sector33Code: string;
	Sector33CodeName: string;
	ScaleCategory: string;
	MarketCode: string;
	MarketCodeName: string;
	MarginCode: string;
	MarginCodeName: string;
};


/**
 * 上場銘柄一覧(/listed/info)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {ListedInfoResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type ListedInfoResponse =
{
	info: ListedInfoItem[];
};


//   ____       _               ____        _ _        ___              _           __  ____  ____  __
//  |  _ \ _ __(_) ___ ___  ___|  _ \  __ _(_) |_   _ / _ \ _   _  ___ | |_ ___  ___\ \/ /\ \/ /\ \/ /
//  | |_) | '__| |/ __/ _ \/ __| | | |/ _` | | | | | | | | | | | |/ _ \| __/ _ \/ __|\  /  \  /  \  / 
//  |  __/| |  | | (_|  __/\__ \ |_| | (_| | | | |_| | |_| | |_| | (_) | ||  __/\__ \/  \  /  \  /  \ 
//  |_|   |_|  |_|\___\___||___/____/ \__,_|_|_|\__, |\__\_\\__,_|\___/ \__\___||___/_/\_\/_/\_\/_/\_\
//                                              |___/                                                 
/**
 * 株価四本値(/prices/daily_quotes)レスポンス `daily_quotes` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {PricesDailyQuotesItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type PricesDailyQuotesItem =
{
	Date: string;
	Code: string;
	Open: number;
	High: number;
	Low: number;
	Close: number;
	UpperLimit: string;
	LowerLimit: string;
	Volume: number;
	TurnoverValue: number;
	AdjustmentFactor: number;
	AdjustmentOpen: number;
	AdjustmentHigh: number;
	AdjustmentLow: number;
	AdjustmentClose: number;
	AdjustmentVolume: number;
	MorningOpen?: number;
	MorningHigh?: number;
	MorningLow?: number;
	MorningClose?: number;
	MorningUpperLimit?: string;
	MorningLowerLimit?: string;
	MorningVolume?: number;
	MorningTurnoverValue?: number;
	MorningAdjustmentOpen?: number;
	MorningAdjustmentHigh?: number;
	MorningAdjustmentLow?: number;
	MorningAdjustmentClose?: number;
	MorningAdjustmentVolume?: number;
	AfternoonOpen?: number;
	AfternoonHigh?: number;
	AfternoonLow?: number;
	AfternoonClose?: number;
	AfternoonUpperLimit?: string;
	AfternoonLowerLimit?: string;
	AfternoonVolume?: number;
	AfternoonTurnoverValue?: number;
	AfternoonAdjustmentOpen?: number;
	AfternoonAdjustmentHigh?: number;
	AfternoonAdjustmentLow?: number;
	AfternoonAdjustmentClose?: number;
	AfternoonAdjustmentVolume?: number;
};


/**
 * 株価四本値(/prices/daily_quotes)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {PricesDailyQuotesResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type PricesDailyQuotesResponse =
{
  daily_quotes: PricesDailyQuotesItem[];
  pagination_key?: string;
};


//   ____       _               ____       _                  _             __  ____  ____  __
//  |  _ \ _ __(_) ___ ___  ___|  _ \ _ __(_) ___ ___  ___   / \   _ __ ___ \ \/ /\ \/ /\ \/ /
//  | |_) | '__| |/ __/ _ \/ __| |_) | '__| |/ __/ _ \/ __| / _ \ | '_ ` _ \ \  /  \  /  \  / 
//  |  __/| |  | | (_|  __/\__ \  __/| |  | | (_|  __/\__ \/ ___ \| | | | | |/  \  /  \  /  \ 
//  |_|   |_|  |_|\___\___||___/_|   |_|  |_|\___\___||___/_/   \_\_| |_| |_/_/\_\/_/\_\/_/\_\
//                                                                                            
/**
 * 前場四本値(/prices/prices_am)レスポンス `daily_quotes` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {PricesPricesAmItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type PricesPricesAmItem =
{
	Date: string;
	Code: string;
	MorningOpen: number;
	MorningHigh: number;
	MorningLow: number;
	MorningClose: number;
	MorningVolume: number;
	MorningTurnoverValue: number;
};


/**
 * 前場四本値(/prices/prices_am)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {PricesPricesAmResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type PricesPricesAmResponse =
{
  daily_quotes: PricesPricesAmItem[];
  pagination_key?: string;
};


//   __  __            _        _      _____              _           ____                  
//  |  \/  | __ _ _ __| | _____| |_ __|_   _| __ __ _  __| | ___  ___/ ___| _ __   ___  ___ 
//  | |\/| |/ _` | '__| |/ / _ \ __/ __|| || '__/ _` |/ _` |/ _ \/ __\___ \| '_ \ / _ \/ __|
//  | |  | | (_| | |  |   <  __/ |_\__ \| || | | (_| | (_| |  __/\__ \___) | |_) |  __/ (__ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/|_||_|  \__,_|\__,_|\___||___/____/| .__/ \___|\___|
//                                                                         |_|              
/**
 * 投資部門別情報(/markets/trades_spec)レスポンス `trades_spec` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsTradesSpecItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsTradesSpecItem =
{
	PublishedDate: string;
	StartDate: string;
	EndDate: string;
	Section: string;
	ProprietarySales: number;
	ProprietaryPurchases: number;
	ProprietaryTotal: number;
	ProprietaryBalance: number;
	BrokerageSales: number;
	BrokeragePurchases: number;
	BrokerageTotal: number;
	BrokerageBalance: number;
	TotalSales: number;
	TotalPurchases: number;
	TotalTotal: number;
	TotalBalance: number;
	IndividualsSales: number;
	IndividualsPurchases: number;
	IndividualsTotal: number;
	IndividualsBalance: number;
	ForeignersSales: number;
	ForeignersPurchases: number;
	ForeignersTotal: number;
	ForeignersBalance: number;
	SecuritiesCosSales: number;
	SecuritiesCosPurchases: number;
	SecuritiesCosTotal: number;
	SecuritiesCosBalance: number;
	InvestmentTrustsSales: number;
	InvestmentTrustsPurchases: number;
	InvestmentTrustsTotal: number;
	InvestmentTrustsBalance: number;
	BusinessCosSales: number;
	BusinessCosPurchases: number;
	BusinessCosTotal: number;
	BusinessCosBalance: number;
	OtherCosSales: number;
	OtherCosPurchases: number;
	OtherCosTotal: number;
	OtherCosBalance: number;
	InsuranceCosSales: number;
	InsuranceCosPurchases: number;
	InsuranceCosTotal: number;
	InsuranceCosBalance: number;
	CityBKsRegionalBKsEtcSales: number;
	CityBKsRegionalBKsEtcPurchases: number;
	CityBKsRegionalBKsEtcTotal: number;
	CityBKsRegionalBKsEtcBalance: number;
	TrustBanksSales: number;
	TrustBanksPurchases: number;
	TrustBanksTotal: number;
	TrustBanksBalance: number;
	OtherFinancialInstitutionsSales: number;
	OtherFinancialInstitutionsPurchases: number;
	OtherFinancialInstitutionsTotal: number;
	OtherFinancialInstitutionsBalance: number;
};


/**
 * 投資部門別情報(/markets/trades_spec)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsTradesSpecResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsTradesSpecResponse =
{
	trades_spec: MarketsTradesSpecItem[];
	pagination_key?: string;
};


//   __  __            _        _     __        __        _    _       __  __                 _       ___       _                     _  __  ____  ____  __
//  |  \/  | __ _ _ __| | _____| |_ __\ \      / /__  ___| | _| |_   _|  \/  | __ _ _ __ __ _(_)_ __ |_ _|_ __ | |_ ___ _ __ ___  ___| |_\ \/ /\ \/ /\ \/ /
//  | |\/| |/ _` | '__| |/ / _ \ __/ __\ \ /\ / / _ \/ _ \ |/ / | | | | |\/| |/ _` | '__/ _` | | '_ \ | || '_ \| __/ _ \ '__/ _ \/ __| __|\  /  \  /  \  / 
//  | |  | | (_| | |  |   <  __/ |_\__ \\ V  V /  __/  __/   <| | |_| | |  | | (_| | | | (_| | | | | || || | | | ||  __/ | |  __/\__ \ |_ /  \  /  \  /  \ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/ \_/\_/ \___|\___|_|\_\_|\__, |_|  |_|\__,_|_|  \__, |_|_| |_|___|_| |_|\__\___|_|  \___||___/\__/_/\_\/_/\_\/_/\_\
//                                                               |___/                  |___/                                                              
/**
 * 信用取引週末残高(/markets/weekly_margin_interest)レスポンス `weekly_margin_interest` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsWeeklyMarginInterestItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsWeeklyMarginInterestItem =
{
	Date: string;
	Code: string;
	ShortMarginTradeVolume: number;
	LongMarginTradeVolume: number;
	ShortNegotiableMarginTradeVolume: number;
	LongNegotiableMarginTradeVolume: number;
	ShortStandardizedMarginTradeVolume: number;
	LongStandardizedMarginTradeVolume: number;
	IssueType: string
};


/**
 * 信用取引週末残高(/markets/weekly_margin_interest)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsWeeklyMarginInterestResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type  MarketsWeeklyMarginInterestResponse =
{
	weekly_margin_interest: MarketsWeeklyMarginInterestItem[];
	pagination_key?: string;
};


//   __  __            _        _       ____  _                _   ____       _ _ _            __  ____  ____  __
//  |  \/  | __ _ _ __| | _____| |_ ___/ ___|| |__   ___  _ __| |_/ ___|  ___| | (_)_ __   __ _\ \/ /\ \/ /\ \/ /
//  | |\/| |/ _` | '__| |/ / _ \ __/ __\___ \| '_ \ / _ \| '__| __\___ \ / _ \ | | | '_ \ / _` |\  /  \  /  \  / 
//  | |  | | (_| | |  |   <  __/ |_\__ \___) | | | | (_) | |  | |_ ___) |  __/ | | | | | | (_| |/  \  /  \  /  \ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/____/|_| |_|\___/|_|   \__|____/ \___|_|_|_|_| |_|\__, /_/\_\/_/\_\/_/\_\
//                                                                                        |___/                  
/**
 * 業種別空売り比率(/markets/short_selling)レスポンス `short_selling` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsShortSellingItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsShortSellingItem =
{
	Date: string;
	Sector33Code: string;
	SellingExcludingShortSellingTurnoverValue: number;
	ShortSellingWithRestrictionsTurnoverValue: number;
	ShortSellingWithoutRestrictionsTurnoverValue: number
};


/**
 * 業種別空売り比率(/markets/short_selling)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsShortSellingResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsShortSellingResponse =
{
	short_selling: MarketsShortSellingItem[];
	pagination_key?: string;
};


//   __  __            _        _       ____  _                _   ____       _ _ _             ____           _ _   _                __  ____  ____  __
//  |  \/  | __ _ _ __| | _____| |_ ___/ ___|| |__   ___  _ __| |_/ ___|  ___| | (_)_ __   __ _|  _ \ ___  ___(_) |_(_) ___  _ __  ___\ \/ /\ \/ /\ \/ /
//  | |\/| |/ _` | '__| |/ / _ \ __/ __\___ \| '_ \ / _ \| '__| __\___ \ / _ \ | | | '_ \ / _` | |_) / _ \/ __| | __| |/ _ \| '_ \/ __|\  /  \  /  \  / 
//  | |  | | (_| | |  |   <  __/ |_\__ \___) | | | | (_) | |  | |_ ___) |  __/ | | | | | | (_| |  __/ (_) \__ \ | |_| | (_) | | | \__ \/  \  /  \  /  \ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/____/|_| |_|\___/|_|   \__|____/ \___|_|_|_|_| |_|\__, |_|   \___/|___/_|\__|_|\___/|_| |_|___/_/\_\/_/\_\/_/\_\
//                                                                                        |___/                                                         
/**
 * 空売り残高報告(/markets/short_selling_positions)レスポンス `short_selling_positions` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsShortSellingPositionsItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsShortSellingPositionsItem =
{
	DisclosedDate: string;
	CalculatedDate: string;
	Code: string;
	ShortSellerName: string;
	ShortSellerAddress: string;
	DiscretionaryInvestmentContractorName: string;
	DiscretionaryInvestmentContractorAddress: string;
	InvestmentFundName: string;
	ShortPositionsToSharesOutstandingRatio: number;
	ShortPositionsInSharesNumber: number;
	ShortPositionsInTradingUnitsNumber: number;
	CalculationInPreviousReportingDate: string;
	ShortPositionsInPreviousReportingRatio: number;
	Notes: string;
};


/**
 * 空売り残高報告(/markets/short_selling_positions)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsShortSellingPositionsResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsShortSellingPositionsResponse =
{
	short_selling_positions: MarketsShortSellingPositionsItem[];
	pagination_key?: string
};

//   __  __            _        _       ____                 _       _                    __  ____  ____  __
//  |  \/  | __ _ _ __| | _____| |_ ___| __ ) _ __ ___  __ _| | ____| | _____      ___ __ \ \/ /\ \/ /\ \/ /
//  | |\/| |/ _` | '__| |/ / _ \ __/ __|  _ \| '__/ _ \/ _` | |/ / _` |/ _ \ \ /\ / / '_ \ \  /  \  /  \  / 
//  | |  | | (_| | |  |   <  __/ |_\__ \ |_) | | |  __/ (_| |   < (_| | (_) \ V  V /| | | |/  \  /  \  /  \ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/____/|_|  \___|\__,_|_|\_\__,_|\___/ \_/\_/ |_| |_/_/\_\/_/\_\/_/\_\
//                                                                                                          
/**
 * 売買内訳データ(/markets/breakdown)レスポンス `breakdown` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsBreakdownItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsBreakdownItem =
{
	Date: string; 
	Code: string; 
	LongSellValue: number;
	ShortSellWithoutMarginValue: number;
	MarginSellNewValue: number;
	MarginSellCloseValue: number;
	LongBuyValue: number;
	MarginBuyNewValue: number;
	MarginBuyCloseValue: number;
	LongSellVolume: number;
	ShortSellWithoutMarginVolume: number;
	MarginSellNewVolume: number;
	MarginSellCloseVolume: number;
	LongBuyVolume: number;
	MarginBuyNewVolume: number;
	MarginBuyCloseVolume: number;
};


/**
 * 売買内訳データ(/markets/breakdown)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsBreakdownResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsBreakdownResponse =
{
	breakdown: MarketsBreakdownItem[];
	pagination_key?: string
};


//   __  __            _        _      _____              _ _              ____      _                _          __  ____  ____  __
//  |  \/  | __ _ _ __| | _____| |_ __|_   _| __ __ _  __| (_)_ __   __ _ / ___|__ _| | ___ _ __   __| | __ _ _ _\ \/ /\ \/ /\ \/ /
//  | |\/| |/ _` | '__| |/ / _ \ __/ __|| || '__/ _` |/ _` | | '_ \ / _` | |   / _` | |/ _ \ '_ \ / _` |/ _` | '__\  /  \  /  \  / 
//  | |  | | (_| | |  |   <  __/ |_\__ \| || | | (_| | (_| | | | | | (_| | |__| (_| | |  __/ | | | (_| | (_| | |  /  \  /  \  /  \ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/|_||_|  \__,_|\__,_|_|_| |_|\__, |\____\__,_|_|\___|_| |_|\__,_|\__,_|_| /_/\_\/_/\_\/_/\_\
//                                                                  |___/                                                          
/**
 * 取引カレンダー(/markets/trading_calendar)レスポンス `trading_calendar` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {MarketsTradingCalendarItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsTradingCalendarItem =
{
	Date: string;
    HolidayDivision: string;
};


/**
 * 取引カレンダー(/markets/trading_calendar)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {MarketsTradingCalendarResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type MarketsTradingCalendarResponse =
{
	trading_calendar: MarketsTradingCalendarItem[];
};

//   ___           _ _              __  ____  ____  __
//  |_ _|_ __   __| (_) ___ ___  ___\ \/ /\ \/ /\ \/ /
//   | || '_ \ / _` | |/ __/ _ \/ __|\  /  \  /  \  / 
//   | || | | | (_| | | (_|  __/\__ \/  \  /  \  /  \ 
//  |___|_| |_|\__,_|_|\___\___||___/_/\_\/_/\_\/_/\_\
//                                                    
/**
 * 指数四本値(/indices)レスポンス `indices` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {IndicesItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type IndicesItem =
{
	Date: string;
	Code: string;
	Open: number;
	High: number;
	Low: number;
	Close: number;
};


/**
 * 指数四本値(/indices)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {IndicesResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type IndicesResponse =
{
	indices: IndicesItem[];
	pagination_key?: string;
};


//   ___           _ _              _____           _      __  ____  ____  __
//  |_ _|_ __   __| (_) ___ ___  __|_   _|__  _ __ (_)_  __\ \/ /\ \/ /\ \/ /
//   | || '_ \ / _` | |/ __/ _ \/ __|| |/ _ \| '_ \| \ \/ / \  /  \  /  \  / 
//   | || | | | (_| | | (_|  __/\__ \| | (_) | |_) | |>  <  /  \  /  \  /  \ 
//  |___|_| |_|\__,_|_|\___\___||___/|_|\___/| .__/|_/_/\_\/_/\_\/_/\_\/_/\_\
//                                           |_|                             
/**
 * TOPIX指数四本値(/indices/topix)レスポンス `topix` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {IndicesTopixItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type IndicesTopixItem =
{
	Date: string;
	Open: number;
	High: number;
	Low: number;
	Close: number;
};


/**
 * TOPIX指数四本値(/indices/topix)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {IndicesTopixResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type IndicesTopixResponse =
{
	topix: IndicesTopixItem[];
	pagination_key?: string;
};


//   _____ _           ____  _        _                            _      __  ____  ____  __
//  |  ___(_)_ __  ___/ ___|| |_ __ _| |_ ___ _ __ ___   ___ _ __ | |_ ___\ \/ /\ \/ /\ \/ /
//  | |_  | | '_ \/ __\___ \| __/ _` | __/ _ \ '_ ` _ \ / _ \ '_ \| __/ __|\  /  \  /  \  / 
//  |  _| | | | | \__ \___) | || (_| | ||  __/ | | | | |  __/ | | | |_\__ \/  \  /  \  /  \ 
//  |_|   |_|_| |_|___/____/ \__\__,_|\__\___|_| |_| |_|\___|_| |_|\__|___/_/\_\/_/\_\/_/\_\
//                                                                                          
/**
 * 財務情報(/fins/statements)レスポンス `statements` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {FinsStatementsItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsStatementsItem =
{
	DisclosedDate: string;
	DisclosedTime: string;
	LocalCode: string;
	DisclosureNumber: string;
	TypeOfDocument: string;
	TypeOfCurrentPeriod: string;
	CurrentPeriodStartDate: string;
	CurrentPeriodEndDate: string;
	CurrentFiscalYearStartDate: string;
	CurrentFiscalYearEndDate: string;
	NextFiscalYearStartDate:string;
	NextFiscalYearEndDate:string;
	NetSales: string;
	OperatingProfit: string;
	OrdinaryProfit:string;
	Profit: string;
	EarningsPerShare: string;
	DilutedEarningsPerShare:string;
	TotalAssets: string;
	Equity: string;
	EquityToAssetRatio: string;
	BookValuePerShare:string;
	CashFlowsFromOperatingActivities:string;
	CashFlowsFromInvestingActivities:string;
	CashFlowsFromFinancingActivities:string;
	CashAndEquivalents: string;
	ResultDividendPerShare1stQuarter:string;
	ResultDividendPerShare2ndQuarter: string;
	ResultDividendPerShare3rdQuarter:string;
	ResultDividendPerShareFiscalYearEnd:string;
	ResultDividendPerShareAnnual:string;
	"DistributionsPerUnit(REIT)": string;
	ResultTotalDividendPaidAnnual: string;
	ResultPayoutRatioAnnual: string;
	ForecastDividendPerShare1stQuarter: string;
	ForecastDividendPerShare2ndQuarter: string;
	ForecastDividendPerShare3rdQuarter: string;
	ForecastDividendPerShareFiscalYearEnd: string;
	ForecastDividendPerShareAnnual: string;
	"ForecastDistributionsPerUnit(REIT)": string;
	ForecastTotalDividendPaidAnnual: string;
	ForecastPayoutRatioAnnual: string;
	NextYearForecastDividendPerShare1stQuarter: string;
	NextYearForecastDividendPerShare2ndQuarter: string;
	NextYearForecastDividendPerShare3rdQuarter: string;
	NextYearForecastDividendPerShareFiscalYearEnd: string;
	NextYearForecastDividendPerShareAnnual: string;
	"NextYearForecastDistributionsPerUnit(REIT)": string;
	NextYearForecastPayoutRatioAnnual: string;
	ForecastNetSales2ndQuarter: string;
	ForecastOperatingProfit2ndQuarter: string;
	ForecastOrdinaryProfit2ndQuarter: string;
	ForecastProfit2ndQuarter: string;
	ForecastEarningsPerShare2ndQuarter: string;
	NextYearForecastNetSales2ndQuarter: string;
	NextYearForecastOperatingProfit2ndQuarter: string;
	NextYearForecastOrdinaryProfit2ndQuarter: string;
	NextYearForecastProfit2ndQuarter: string;
	NextYearForecastEarningsPerShare2ndQuarter: string;
	ForecastNetSales: string;
	ForecastOperatingProfit: string;
	ForecastOrdinaryProfit: string;
	ForecastProfit: string;
	ForecastEarningsPerShare: string;
	NextYearForecastNetSales: string;
	NextYearForecastOperatingProfit: string;
	NextYearForecastOrdinaryProfit: string;
	NextYearForecastProfit: string;
	NextYearForecastEarningsPerShare: string;
	MaterialChangesInSubsidiaries: string;
	SignificantChangesInTheScopeOfConsolidation: string;
	ChangesBasedOnRevisionsOfAccountingStandard: string;
	ChangesOtherThanOnesBasedOnRevisionsOfAccountingStandard: string;
	ChangesInAccountingEstimates: string;
	RetrospectiveRestatement: string;
	NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock: string;
	NumberOfTreasuryStockAtTheEndOfFiscalYear: string;
	AverageNumberOfShares: string;
	NonConsolidatedNetSales: string;
	NonConsolidatedOperatingProfit: string;
	NonConsolidatedOrdinaryProfit: string;
	NonConsolidatedProfit: string;
	NonConsolidatedEarningsPerShare: string;
	NonConsolidatedTotalAssets: string;
	NonConsolidatedEquity: string;
	NonConsolidatedEquityToAssetRatio: string;
	NonConsolidatedBookValuePerShare: string;
	ForecastNonConsolidatedNetSales2ndQuarter: string;
	ForecastNonConsolidatedOperatingProfit2ndQuarter: string;
	ForecastNonConsolidatedOrdinaryProfit2ndQuarter: string;
	ForecastNonConsolidatedProfit2ndQuarter: string;
	ForecastNonConsolidatedEarningsPerShare2ndQuarter: string;
	NextYearForecastNonConsolidatedNetSales2ndQuarter: string;
	NextYearForecastNonConsolidatedOperatingProfit2ndQuarter: string;
	NextYearForecastNonConsolidatedOrdinaryProfit2ndQuarter: string;
	NextYearForecastNonConsolidatedProfit2ndQuarter: string;
	NextYearForecastNonConsolidatedEarningsPerShare2ndQuarter: string;
	ForecastNonConsolidatedNetSales: string;
	ForecastNonConsolidatedOperatingProfit: string;
	ForecastNonConsolidatedOrdinaryProfit: string;
	ForecastNonConsolidatedProfit: string;
	ForecastNonConsolidatedEarningsPerShare: string;
	NextYearForecastNonConsolidatedNetSales: string;
	NextYearForecastNonConsolidatedOperatingProfit: string;
	NextYearForecastNonConsolidatedOrdinaryProfit: string;
	NextYearForecastNonConsolidatedProfit: string;
	NextYearForecastNonConsolidatedEarningsPerShare: string;
};


/**
 * 財務情報(/fins/statements)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {FinsStatementsResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsStatementsResponse =
{
	statements: FinsStatementsItem[];
	pagination_key?: string;
};


//   _____ _           _____    ____       _        _ _    __  ____  ____  __
//  |  ___(_)_ __  ___|  ___|__|  _ \  ___| |_ __ _(_) |___\ \/ /\ \/ /\ \/ /
//  | |_  | | '_ \/ __| |_ / __| | | |/ _ \ __/ _` | | / __|\  /  \  /  \  / 
//  |  _| | | | | \__ \  _|\__ \ |_| |  __/ || (_| | | \__ \/  \  /  \  /  \ 
//  |_|   |_|_| |_|___/_|  |___/____/ \___|\__\__,_|_|_|___/_/\_\/_/\_\/_/\_\
//                                                                           
/**
 * 財務諸表(BS/PL)(/fins/fs_details)レスポンス `fs_details[].FinancialStatement` プロパティーに格納されるオブジェクトの型定義です。
 *
 * `FinancialStatement` のデータについては公式サイトの解説を参照してください。
 *
 * @typedef {FinsFsDetailsFinancialStatement}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsFsDetailsFinancialStatement =
{
	"Goodwill (IFRS)"?: string;
	"Retained earnings (IFRS)"?: string;
	"Operating profit (loss) (IFRS)"?: string;
	"Previous fiscal year end date, DEI"?: string;
	"Basic earnings (loss) per share (IFRS)"?: string;
	"Document type, DEI"?: string;
	"Current period end date, DEI"?: string;
	"Revenue - 2 (IFRS)"?: string;
	"Industry code when consolidated financial statements are prepared in accordance with industry specific regulations, DEI"?: string;
	"Profit (loss) attributable to owners of parent (IFRS)"?: string;
	"Other current liabilities - CL (IFRS)"?: string;
	"Share of profit (loss) of investments accounted for using equity method (IFRS)"?: string;
	"Current liabilities (IFRS)"?: string;
	"Equity attributable to owners of parent (IFRS)"?: string;
	"Whether consolidated financial statements are prepared, DEI"?: string;
	"Non-current liabilities (IFRS)"?: string;
	"Other expenses (IFRS)"?: string;
	"Income taxes payable - CL (IFRS)"?: string;
	"Filer name in English, DEI"?: string;
	"Non-controlling interests (IFRS)"?: string;
	"Capital surplus (IFRS)"?: string;
	"Finance costs (IFRS)"?: string;
	"Other current assets - CA (IFRS)"?: string;
	"Property, plant and equipment (IFRS)"?: string;
	"Deferred tax liabilities (IFRS)"?: string;
	"Other components of equity (IFRS)"?: string;
	"Current fiscal year start date, DEI"?: string;
	"Type of current period, DEI"?: string;
	"Cash and cash equivalents (IFRS)"?: string;
	"Share capital (IFRS)"?: string;
	"Retirement benefit asset - NCA (IFRS)"?: string;
	"Number of submission, DEI"?: string;
	"Trade and other receivables - CA (IFRS)"?: string;
	"Liabilities and equity (IFRS)"?: string;
	"EDINET code, DEI"?: string;
	"Equity (IFRS)"?: string;
	"Security code, DEI"?: string;
	"Other financial assets - CA (IFRS)"?: string;
	"Other financial assets - NCA (IFRS)": "2898000000",
	"Income taxes receivable - CA (IFRS)"?: string;
	"Investments accounted for using equity method (IFRS)"?: string;
	"Other non-current assets - NCA (IFRS)"?: string;
	"Previous fiscal year start date, DEI"?: string;
	"Filer name in Japanese, DEI"?: string;
	"Deferred tax assets (IFRS)"?: string;
	"Trade and other payables - CL (IFRS)"?: string;
	"Bonds and borrowings - CL (IFRS)"?: string;
	"Current fiscal year end date, DEI"?: string;
	"XBRL amendment flag, DEI"?: string;
	"Non-current assets (IFRS)"?: string;
	"Retirement benefit liability - NCL (IFRS)"?: string;
	"Amendment flag, DEI"?: string;
	"Assets (IFRS)"?: string;
	"Income tax expense (IFRS)"?: string;
	"Report amendment flag, DEI"?: string;
	"Profit (loss) (IFRS)"?: string;
	"Operating expenses (IFRS)"?: string;
	"Intangible assets (IFRS)"?: string;
	"Profit (loss) before tax from continuing operations (IFRS)"?: string;
	"Liabilities (IFRS)"?: string;
	"Accounting standards, DEI"?: string;
	"Bonds and borrowings - NCL (IFRS)"?: string;
	"Finance income (IFRS)"?: string;
	"Profit (loss) attributable to non-controlling interests (IFRS)"?: string;
	"Comparative period end date, DEI"?: string;
	"Current assets (IFRS)"?: string;
	"Other non-current liabilities - NCL (IFRS)"?: string;
	"Other income (IFRS)"?: string;
	"Treasury shares (IFRS)"?: string;
};


/**
 * 財務諸表(BS/PL)(/fins/fs_details)レスポンス `fs_details` プロパティーに格納される要素オブジェクトの型定義です。
 *
 * @typedef {FinsFsDetailsItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsFsDetailsItem =
{
	DisclosedDate: string;
	DisclosedTime: string;
	LocalCode: string;
	DisclosureNumber: string;
	TypeOfDocument: string;
	FinancialStatement: FinsFsDetailsFinancialStatement
};


/**
 * 財務諸表(BS/PL)(/fins/fs_details)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {FinsFsDetailsResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsFsDetailsResponse =
{
	fs_details: FinsFsDetailsItem[];
	pagination_key?: string;
};

//   _____ _           ____  _       _     _                ___  ____  ____  __
//  |  ___(_)_ __  ___|  _ \(_)_   _(_) __| | ___ _ __   __| \ \/ /\ \/ /\ \/ /
//  | |_  | | '_ \/ __| | | | \ \ / / |/ _` |/ _ \ '_ \ / _` |\  /  \  /  \  / 
//  |  _| | | | | \__ \ |_| | |\ V /| | (_| |  __/ | | | (_| |/  \  /  \  /  \ 
//  |_|   |_|_| |_|___/____/|_| \_/ |_|\__,_|\___|_| |_|\__,_/_/\_\/_/\_\/_/\_\
//                                                                             
/**
 * 配当金情報(/fins/dividend)レスポンス `dividend` プロパティーに格納される
 * 要素オブジェクトの型定義です。
 *
 * @typedef {FinsDividendItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsDividendItem =
{
	AnnouncementDate: string;
	AnnouncementTime: string;
	Code: string;
	ReferenceNumber: string;
	StatusCode: string;
	BoardMeetingDate: string;
	InterimFinalCode: string;
	ForecastResultCode: string;
	InterimFinalTerm: string;
	GrossDividendRate: string | number;
	RecordDate: string;
	ExDate: string;
	ActualRecordDate: string;
	PayableDate: string;
	CAReferenceNumber: string;
	DistributionAmount: string | number;
	RetainedEarnings: string | number;
	DeemedDividend: string | number;
	DeemedCapitalGains: string | number;
	NetAssetDecreaseRatio: string | number;
	CommemorativeSpecialCode: string;
	CommemorativeDividendRate: string | number;
	SpecialDividendRate: string | number;
};


/**
 * 配当金情報(/fins/dividend)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {FinsDividendResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsDividendResponse =
{
	dividend: FinsDividendItem[];
	pagination_key?: string;
};


//   _____ _              _                                                                _  __  ____  ____  __
//  |  ___(_)_ __  ___   / \   _ __  _ __   ___  _   _ _ __   ___ ___ _ __ ___   ___ _ __ | |_\ \/ /\ \/ /\ \/ /
//  | |_  | | '_ \/ __| / _ \ | '_ \| '_ \ / _ \| | | | '_ \ / __/ _ \ '_ ` _ \ / _ \ '_ \| __|\  /  \  /  \  / 
//  |  _| | | | | \__ \/ ___ \| | | | | | | (_) | |_| | | | | (_|  __/ | | | | |  __/ | | | |_ /  \  /  \  /  \ 
//  |_|   |_|_| |_|___/_/   \_\_| |_|_| |_|\___/ \__,_|_| |_|\___\___|_| |_| |_|\___|_| |_|\__/_/\_\/_/\_\/_/\_\
//                                                                                                              
/**
 * 決算発表予定日(/fins/announcement)レスポンス `announcement` プロパティーに格納される
 * 要素オブジェクトの型定義です。
 *
 * @typedef {FinsAnnouncementItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsAnnouncementItem =
{
	Date: string;
	Code: string;
	CompanyName: string;
	FiscalYear: string;
	SectorName: string;
	FiscalQuarter: string;
	Section: string;
};


/**
 * 決算発表予定日(/fins/announcement)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {FinsAnnouncementResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type FinsAnnouncementResponse =
{
	announcement: FinsAnnouncementItem[];
	pagination_key?: string;
};


//    ___        _   _             ___           _            ___        _   _            __  ____  ____  __
//   / _ \ _ __ | |_(_) ___  _ __ |_ _|_ __   __| | _____  __/ _ \ _ __ | |_(_) ___  _ __ \ \/ /\ \/ /\ \/ /
//  | | | | '_ \| __| |/ _ \| '_ \ | || '_ \ / _` |/ _ \ \/ / | | | '_ \| __| |/ _ \| '_ \ \  /  \  /  \  / 
//  | |_| | |_) | |_| | (_) | | | || || | | | (_| |  __/>  <| |_| | |_) | |_| | (_) | | | |/  \  /  \  /  \ 
//   \___/| .__/ \__|_|\___/|_| |_|___|_| |_|\__,_|\___/_/\_\\___/| .__/ \__|_|\___/|_| |_/_/\_\/_/\_\/_/\_\
//        |_|                                                     |_|                                       
/**
 * 日経225オプション四本値(/option/index_option)レスポンス `index_option` プロパティーに格納される
 * 要素オブジェクトの型定義です。
 *
 * @typedef {OptionIndexOptionItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type OptionIndexOptionItem =
{
	Date: string;
	Code: string;
	WholeDayOpen: number;
	WholeDayHigh: number;
	WholeDayLow: number;
	WholeDayClose: number;
	NightSessionOpen: number | string;
	NightSessionHigh: number | string;
	NightSessionLow: number | string;
	NightSessionClose: number | string;
	DaySessionOpen: number;
	DaySessionHigh: number;
	DaySessionLow: number;
	DaySessionClose: number;
	Volume: number;
	OpenInterest: number;
	TurnoverValue: number;
	ContractMonth: string;
	StrikePrice: number;
	'Volume(OnlyAuction)'?: number;
	EmergencyMarginTriggerDivision: string;
	PutCallDivision: string;
	LastTradingDay?: string;
	SpecialQuotationDay?: string;
	SettlementPrice?: number;
	TheoreticalPrice?: number;
	BaseVolatility?: number;
	UnderlyingPrice?: number;
	ImpliedVolatility?: number;
	InterestRate?: number;
};


/**
 * 日経225オプション四本値(/option/index_option)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {OptionIndexOptionResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type OptionIndexOptionResponse =
{
	index_option: OptionIndexOptionItem[];
	pagination_key?: string;
};


//   ____            _            _   _                _____      _                      __  ____  ____  __
//  |  _ \  ___ _ __(_)_   ____ _| |_(_)_   _____  ___|  ___|   _| |_ _   _ _ __ ___  ___\ \/ /\ \/ /\ \/ /
//  | | | |/ _ \ '__| \ \ / / _` | __| \ \ / / _ \/ __| |_ | | | | __| | | | '__/ _ \/ __|\  /  \  /  \  / 
//  | |_| |  __/ |  | |\ V / (_| | |_| |\ V /  __/\__ \  _|| |_| | |_| |_| | | |  __/\__ \/  \  /  \  /  \ 
//  |____/ \___|_|  |_| \_/ \__,_|\__|_| \_/ \___||___/_|   \__,_|\__|\__,_|_|  \___||___/_/\_\/_/\_\/_/\_\
//                                                                                                         
/**
 * 先物四本値(/derivatives/futures)レスポンス `futures` プロパティーに格納される
 * 要素オブジェクトの型定義です。
 *
 * @typedef {DerivativesFuturesItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type DerivativesFuturesItem =
{
	Code: string;
	DerivativesProductCategory: string;
	Date: string;
	WholeDayOpen: number;
	WholeDayHigh: number;
	WholeDayLow: number;
	WholeDayClose: number;
	MorningSessionOpen: string | number;
	MorningSessionHigh: string | number;
	MorningSessionLow: string | number;
	MorningSessionClose: string | number;
	NightSessionOpen: string | number;
	NightSessionHigh: string | number;
	NightSessionLow: string | number;
	NightSessionClose: string | number;
	DaySessionOpen: number;
	DaySessionHigh: number;
	DaySessionLow: number;
	DaySessionClose: number;
	Volume: number;
	OpenInterest: number;
	TurnoverValue: number;
	ContractMonth: string;
	'Volume(OnlyAuction)': number;
	EmergencyMarginTriggerDivision: string;
	LastTradingDay: string;
	SpecialQuotationDay: string;
	SettlementPrice: number;
	CentralContractMonthFlag: string;
};


/**
 * 先物四本値(/derivatives/futures)の成功時レスポンスデータ構造の型定義です
 *
 * @typedef {DerivativesFuturesResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type DerivativesFuturesResponse =
{
	futures: DerivativesFuturesItem[];
	pagination_key?: string;
};


//   ____            _            _   _                 ___        _   _                __  ____  ____  __
//  |  _ \  ___ _ __(_)_   ____ _| |_(_)_   _____  ___ / _ \ _ __ | |_(_) ___  _ __  ___\ \/ /\ \/ /\ \/ /
//  | | | |/ _ \ '__| \ \ / / _` | __| \ \ / / _ \/ __| | | | '_ \| __| |/ _ \| '_ \/ __|\  /  \  /  \  / 
//  | |_| |  __/ |  | |\ V / (_| | |_| |\ V /  __/\__ \ |_| | |_) | |_| | (_) | | | \__ \/  \  /  \  /  \ 
//  |____/ \___|_|  |_| \_/ \__,_|\__|_| \_/ \___||___/\___/| .__/ \__|_|\___/|_| |_|___/_/\_\/_/\_\/_/\_\
//                                                          |_|                                           
/**
 * オプション四本値(/derivatives/options)レスポンス `options` プロパティーに格納される
 * 要素オブジェクトの型定義です。
 *
 * @typedef {DerivativesOptionsItem}
 * @category J-Quants API レスポンス向け型定義
 */
export type DerivativesOptionsItem =
{
	Code: string;
	DerivativesProductCategory: string;
	UnderlyingSSO: string;
	Date: string;
	WholeDayOpen: number;
	WholeDayHigh: number;
	WholeDayLow: number;
	WholeDayClose: number;
	MorningSessionOpen: string | number;
	MorningSessionHigh: string | number;
	MorningSessionLow: string | number;
	MorningSessionClose: string | number;
	NightSessionOpen: string | number;
	NightSessionHigh: string | number;
	NightSessionLow: string | number;
	NightSessionClose: string | number;
	DaySessionOpen: number;
	DaySessionHigh: number;
	DaySessionLow: number;
	DaySessionClose: number;
	Volume: number;
	OpenInterest: number;
	TurnoverValue: number;
	ContractMonth: string;
	StrikePrice: number;
	'Volume(OnlyAuction)': number;
	EmergencyMarginTriggerDivision: string;
	PutCallDivision: string;
	LastTradingDay: string;
	SpecialQuotationDay: string;
	SettlementPrice: number;
	TheoreticalPrice: number;
	BaseVolatility: number;
	UnderlyingPrice: number;
	ImpliedVolatility: number;
	InterestRate: number;
	CentralContractMonthFlag: string;
};


/**
 * オプション四本値(/derivatives/options)の成功時レスポンスデータ構造の型定義です。
 *
 * @typedef {DerivativesOptionsResponse}
 * @category J-Quants API レスポンス向け型定義
 */
export type DerivativesOptionsResponse =
{
	options: DerivativesOptionsItem[];
	pagination_key?: string;
};
