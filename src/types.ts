
import {Dayjs} from "dayjs";

export type TOKEN_RECORD =
{
	token: string;
	expiration: Dayjs;
};

export abstract class APITokenStore
{
	abstract getRefreshTokenInfo(): Promise<TOKEN_RECORD | undefined>;
	abstract setRefreshTokenInfo({token,expiration}:TOKEN_RECORD): Promise<boolean>;
	abstract getIdTokenInfo(): Promise<TOKEN_RECORD | undefined>;
	abstract setIdTokenInfo({token,expiration}:TOKEN_RECORD): Promise<boolean>;
}

export abstract class JQCredentialStore
{
	abstract user(): Promise<string>;
	abstract password(): Promise<string>;
}

export type TokenSet = {
	idToken: string;
	refreshToken: string;
};

export function isTokenSet( obj: unknown ): obj is TokenSet
{
	if( ! obj || typeof obj !== 'object' )
	{
		return false;
	}

	const tokenSet = obj as TokenSet;
	return (
		Object.prototype.hasOwnProperty.call( tokenSet, 'idToken' ) &&
		Object.prototype.hasOwnProperty.call( tokenSet, 'refreshToken' ) &&
		typeof tokenSet.idToken === 'string' &&
		typeof tokenSet.refreshToken === 'string'
	);
}


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
export type TokenAuthUserResponse =
{	
	refreshToken: string;
};

// 200 https://api.jquants.com/v1/token/auth_refresh
export type TokenAuthRefreshResponse =
{
	idToken: string;	
};


//   _     _     _           _ ___        __     __  ____  ____  __
//  | |   (_)___| |_ ___  __| |_ _|_ __  / _| ___\ \/ /\ \/ /\ \/ /
//  | |   | / __| __/ _ \/ _` || || '_ \| |_ / _ \\  /  \  /  \  / 
//  | |___| \__ \ ||  __/ (_| || || | | |  _| (_) /  \  /  \  /  \ 
//  |_____|_|___/\__\___|\__,_|___|_| |_|_|  \___/_/\_\/_/\_\/_/\_\
//                                                                 
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

export type ListedInfoResponse =
{
	info: ListedInfoItem[];
};


//   ____       _          ____        _ _        ___              _           __  ____  ____  __
//  |  _ \ _ __(_) ___ ___|  _ \  __ _(_) |_   _ / _ \ _   _  ___ | |_ ___  ___\ \/ /\ \/ /\ \/ /
//  | |_) | '__| |/ __/ _ \ | | |/ _` | | | | | | | | | | | |/ _ \| __/ _ \/ __|\  /  \  /  \  / 
//  |  __/| |  | | (_|  __/ |_| | (_| | | | |_| | |_| | |_| | (_) | ||  __/\__ \/  \  /  \  /  \ 
//  |_|   |_|  |_|\___\___|____/ \__,_|_|_|\__, |\__\_\\__,_|\___/ \__\___||___/_/\_\/_/\_\/_/\_\
//                                         |___/                                                 

// 株価四本値(/prices/daily_quotes)
export type PriceDailyQuoteItem =
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

export type PriceDailyQuotesResponse =
{
  daily_quotes: PriceDailyQuoteItem[];
  pagination_key?: string;
};


//   ____       _          ____       _                  _             __  ____  ____  __
//  |  _ \ _ __(_) ___ ___|  _ \ _ __(_) ___ ___  ___   / \   _ __ ___ \ \/ /\ \/ /\ \/ /
//  | |_) | '__| |/ __/ _ \ |_) | '__| |/ __/ _ \/ __| / _ \ | '_ ` _ \ \  /  \  /  \  / 
//  |  __/| |  | | (_|  __/  __/| |  | | (_|  __/\__ \/ ___ \| | | | | |/  \  /  \  /  \ 
//  |_|   |_|  |_|\___\___|_|   |_|  |_|\___\___||___/_/   \_\_| |_| |_/_/\_\/_/\_\/_/\_\
//
export type PricePricesAmItem =
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

export type PricePricesAmResponse =
{
  daily_quotes: PricePricesAmItem[];
  pagination_key?: string;
};


//   __  __            _        _      _____              _           ____                  
//  |  \/  | __ _ _ __| | _____| |_ __|_   _| __ __ _  __| | ___  ___/ ___| _ __   ___  ___ 
//  | |\/| |/ _` | '__| |/ / _ \ __/ __|| || '__/ _` |/ _` |/ _ \/ __\___ \| '_ \ / _ \/ __|
//  | |  | | (_| | |  |   <  __/ |_\__ \| || | | (_| | (_| |  __/\__ \___) | |_) |  __/ (__ 
//  |_|  |_|\__,_|_|  |_|\_\___|\__|___/|_||_|  \__,_|\__,_|\___||___/____/| .__/ \___|\___|
//                                                                         |_|              
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
export type MarketsShortSellingItem =
{
	Date: string;
	Sector33Code: string;
	SellingExcludingShortSellingTurnoverValue: number;
	ShortSellingWithRestrictionsTurnoverValue: number;
	ShortSellingWithoutRestrictionsTurnoverValue: number
};

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
export type MarketsTradingCalendarItem =
{
	Date: string;
    HolidayDivision: string;
};

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

export type IndicesItem =
{
	Date: string;
	Code: string;
	Open: number;
	High: number;
	Low: number;
	Close: number;
};

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
export type IndicesTopixItem =
{
	Date: string;
	Open: number;
	High: number;
	Low: number;
	Close: number;
};

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

export type FinsFsDetailsItem =
{
	DisclosedDate: string;
	DisclosedTime: string;
	LocalCode: string;
	DisclosureNumber: string;
	TypeOfDocument: string;
	FinancialStatement: FinsFsDetailsFinancialStatement
};

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

export type DerivativesOptionsResponse =
{
	options: DerivativesOptionsItem[];
	pagination_key?: string;
};
