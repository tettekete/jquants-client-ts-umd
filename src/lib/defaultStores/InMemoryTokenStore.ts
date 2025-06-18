
import { APITokenStore, TOKEN_RECORD } from '../../types';
import { Dayjs } from 'dayjs';

export class InMemoryTokenStore extends APITokenStore
{
	private refresh_token: string | undefined = undefined;
	private refresh_token_expire: Dayjs | undefined = undefined;
	private id_token: string | undefined		= undefined;
	private id_token_expire: Dayjs | undefined	= undefined;

	async get_refresh_token_info(): Promise<TOKEN_RECORD | undefined>
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

	async set_refresh_token_info({ token, expiration }: TOKEN_RECORD): Promise<boolean>
	{
		this.refresh_token = token;
		this.refresh_token_expire = expiration;

		return true;
	}

	async get_id_token_info(): Promise<TOKEN_RECORD | undefined>
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

	async set_id_token_info({ token, expiration }: TOKEN_RECORD): Promise<boolean>
	{
		this.id_token = token;
		this.id_token_expire = expiration;

		return true;
	}
}