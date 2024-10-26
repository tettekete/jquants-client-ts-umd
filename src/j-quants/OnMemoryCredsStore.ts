

import { JQCredentialStore } from './Types';

export class OnMemoryCredsStore extends JQCredentialStore
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
		super()
		this._user = user;
		this._password = password
	}
	user(): string { return this._user ?? ''}
	password(): string { return this._password ?? ''}
}
