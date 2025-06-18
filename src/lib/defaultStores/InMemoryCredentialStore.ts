

import { JQCredentialStore } from '../../types';

export class InMemoryCredentialStore extends JQCredentialStore
{
	private _user: string | undefined;
	private _password: string | undefined;

	constructor(
		{
			user,
			password
		}:
		{
			user?: string;
			password?: string;
		} = {}
	)
	{
		super();
		this._user = user;
		this._password = password;
	}
	async user(): Promise<string> { return this._user ?? '' }
	async password(): Promise<string> { return this._password ?? '' }
}
