
interface Result_IF {
	data?: any | null | undefined;
	success: boolean;
	message?: string | null | undefined;
};

/**
 * Rresult クラス
 * 
 * ok メンバや ng メンバを参照するとするとのその成否が分かり、
 * message や data メンバ経由でエラーメッセージや成功データ
 * （あるいは失敗データ）を取得できる様にするためのコンテナクラス。
 * 
 * @example
 * let r = Result.success();
 * // r.ok === true
 * // r.ng === false
 * // r.message === "success"
 * // r.data === null
 * 
 * let r2 = Result.failure( {foo: {bar : "buzz"}} );
 * // r2.ok === false
 * // r2.ng === true
 * // r2.message === "failure"
 * // r2.data === {foo: {bar : "buzz"}}
 * 
 * let r3 = Result.success( "You can fly!" ,{foo: {bar : "buzz"}} );
 * // r3.ok === true
 * // r3.ng === false
 * // r3.message === "You can fly!"
 * // r3.data === {foo: {bar : "buzz"}}
 * 
 */

export default class Result {
	private readonly _ok: boolean;
	private readonly _data: any | null | undefined;
	private readonly _message: string | null | undefined;

	get ok()		{ return this._ok }
	get ng()		{ return ! this._ok }
	get data()		{ return this._data }
	get message()	{ return this._message }

	/**
	 * コンストラクタ
	 * @private
	 * @param {Result_IF} args - コンストラクタ引き数オブジェクト
	 * @param {boolean} args.success - 本オブジェクトの成否を表す bool 値
	 * @param {string} [args.message] - 結果に関するメッセージ (任意)
	 * @param {any} [args.data] - 結果データ (任意)
	 */
    private constructor({
		data
		,message
		,success
	}:Result_IF )
	{
		if( typeof data !== 'undefined' )
		{
			this._data		= data;	
		}

		if( typeof message !== 'undefined' )
		{
			this._message		= message;	
		}
        
        this._ok	= success;
    }

	private static _arg_parser(
		success: boolean,
		messageOrData?: string | any,
		data?: any
	): Result_IF
	{
		let r: Result_IF =
		{
			success: success,
			message: success ? 'success' : 'failure'
		};

		if( typeof messageOrData === 'string')
		{
			/* construct pattern:
				( textMessage )
				( textMessage , dataObject )
			*/
			r.message	= messageOrData;
			r.data		= data ?? messageOrData
		}
		else
		{
			/* construct pattern:
				()
				( dataObject )
				( undefined ,dataObject )
				( null ,dataObject )
			*/
			r.data		= messageOrData ?? data ?? null
		}

		return r;
	}

    static success(
		messageOrData?: string | any
		,data?: any
	): Result
	{
		return new Result( Result._arg_parser( true ,messageOrData,data ) );
    }

    static failure(
		messageOrData?: string | any
		,data?: any
	): Result
	{
		return new Result( Result._arg_parser( false ,messageOrData,data ) );
    }

    isSuccess(): boolean {
        return this.ok;
    }

    isFailure(): boolean {
        return !this.ok;
    }
}
