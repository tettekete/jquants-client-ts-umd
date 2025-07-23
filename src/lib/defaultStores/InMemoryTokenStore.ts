
import { APITokenStore, TOKEN_RECORD } from '../../types';
import { Dayjs } from 'dayjs';

export class InMemoryTokenStore extends APITokenStore
{
	private refresh_token: string | undefined = undefined;
	private refresh_token_expire: Dayjs | undefined = undefined;
	private id_token: string | undefined		= undefined;
	private id_token_expire: Dayjs | undefined	= undefined;

	async getRefreshTokenInfo(): Promise<TOKEN_RECORD | undefined>
	{
		if( ! this.refresh_token || ! this.refresh_token_expire )
		{
			return Promise.resolve( undefined );
		}

		return {
			token: this.refresh_token,
			expiration: this.refresh_token_expire
		};
	}

	async setRefreshTokenInfo({ token, expiration }: TOKEN_RECORD): Promise<boolean>
	{
		this.refresh_token = token;
		this.refresh_token_expire = expiration;

		return true;
	}

	async getIdTokenInfo(): Promise<TOKEN_RECORD | undefined>
	{
		if( ! this.id_token || ! this.id_token_expire )
		{
			return Promise.resolve( undefined );
		}

		return {
			token: this.id_token,
			expiration: this.id_token_expire
		};
	}

	async setIdTokenInfo({ token, expiration }: TOKEN_RECORD): Promise<boolean>
	{
		this.id_token = token;
		this.id_token_expire = expiration;

		return true;
	}
}