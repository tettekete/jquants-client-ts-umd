

import { JQCredentialStore } from '../abstract-classes';


/**
 * 認証情報をメモリ上に保持するクラス
 *
 * @class InMemoryCredentialStore
 * @typedef {InMemoryCredentialStore}
 * @extends {JQCredentialStore}
 * @example
 * // 使用例
 * import { InMemoryCredentialStore } from '@tettekete/jquants-client/extra';
 * const credsStore = new InMemoryCredentialStore({
 *   user: 'your_jquants_user',
 *   password: 'your_jquants_password'
 * });
 * // または
 * const credsStore = new InMemoryCredentialStore('your_jquants_user', 'your_jquants_password');
 * @category デフォルト提供の認証情報ストア
 */
export class InMemoryCredentialStore extends JQCredentialStore
{
	private _user: string | undefined;
	private _password: string | undefined;

	// constructor overload signature
	constructor(
		{
			user,
			password
		}:
		{
			user?: string;
			password?: string;
		}
	);
	constructor(user: string, password: string);

	// actual constructor implementation
	constructor(userOrObj: string | { user?: string, password?: string }, password?: string)
	{
		super();

		if( typeof userOrObj === 'string' && typeof password === 'string'  )
		{
			this._user = userOrObj;
			this._password = password;
		}
		else if( typeof userOrObj === 'object' )
		{
			this._user = userOrObj.user;
			this._password = userOrObj.password;
		}
		else
		{
			this._user = undefined;
			this._password = undefined;
		}
	}

	async user(): Promise<string> { return this._user ?? '' }
	async password(): Promise<string> { return this._password ?? '' }
}
