
import { TOKEN_RECORD } from '../../types';

/**
 * API トークンの永続化ストアのための抽象（abstract）クラスです。
 *
 * 本抽象クラスを継承したクラスのインスタンスは {@link JQuantsAPIClient} の
 * コンストラクターに `tokenStore` として渡すことにより API トークンの
 * 永続化ストアとして利用されます。
 *
 * @abstract
 * @class APITokenStore
 * @typedef {APITokenStore}
 * @category データストア系のための 抽象（Abstract）クラス
 */
export abstract class APITokenStore
{
	/**
	 * リフレッシュトークンの情報を {@link TOKEN_RECORD} 型で返すメソッドを実装してください。
	 *
	 * このメソッドは非同期関数としてコールされ、トークン情報({@link TOKEN_RECORD})を取得するために呼び出されます。
	 *
	 * @abstract
	 * @returns {Promise<TOKEN_RECORD | undefined>} リフレッシュトークン情報を取得する非同期関数。
	 */
	abstract getRefreshTokenInfo(): Promise<TOKEN_RECORD | undefined>;
	
	/**
	 * {@link TOKEN_RECORD} 型のリフレッシュトークン情報を保存するメソッドを実装してください。
	 * このメソッドは非同期メソッドとしてコールされ、トークン情報を保存するために呼び出されます。
	 *
	 * @abstract
	 * @param {TOKEN_RECORD} tokenRecord トークン情報
	 * @returns {Promise<boolean>} トークン情報をリフレッシュする非同期操作
	 */
	abstract setRefreshTokenInfo( tokenRecord: TOKEN_RECORD): Promise<boolean>;

	/**
	 * ID トークンの情報を {@link TOKEN_RECORD} 型で返すメソッドを実装してください。
	 *
	 * このメソッドは非同期関数としてコールされ、トークン情報({@link TOKEN_RECORD})を取得するためにコールされます。
	 *
	 * @abstract
	 * @returns {Promise<TOKEN_RECORD | undefined>} - ID トークン情報を取得する非同期関数。
	 */
	abstract getIdTokenInfo(): Promise<TOKEN_RECORD | undefined>;

	/**
	 * {@link TOKEN_RECORD} 型の ID トークン情報を保存するメソッドを実装してください。
	 * このメソッドは非同期メソッドとしてコールされ、トークン情報を保存するために呼び出されます。
	 *
	 * @abstract
	 * @param {TOKEN_RECORD} tokenRecord - トークン情報
	 * @returns {Promise<boolean>} - トークン情報をリフレッシュする非同期操作
	 */
	abstract setIdTokenInfo( tokenRecord: TOKEN_RECORD): Promise<boolean>;
}

