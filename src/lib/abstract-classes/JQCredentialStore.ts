
/**
 *
 * J-Quants Web API 認証用の情報を提供するためのストアオブジェクトのための抽象化クラスです。
 *
 * 本抽象クラスを継承したクラスのインスタンスは {@link JQuantsAPIClient} の
 * `credsStore` に渡すことにより、リフレッシュトークンの取得時に使用されます。
 *
 * @abstract
 * @class JQCredentialStore
 * @typedef {JQCredentialStore}
 * @category データストア系のための 抽象（Abstract）クラス
 */
export abstract class JQCredentialStore
{
	/**
	 * 認証情報を取得するための非同期メソッドを実装してください。
	 *
	 * @abstract
	 * @returns {Promise<string>} 認証情報を取得する非同期関数。
	 */
	abstract user(): Promise<string>;

	/**
	 * 認証情報のパスワードを取得するための非同期メソッドを実装してください。
	 *
	 * @abstract
	 * @returns {Promise<string>} 認証情報のパスワードを取得する非同期関数。
	 */
	abstract password(): Promise<string>;
}

