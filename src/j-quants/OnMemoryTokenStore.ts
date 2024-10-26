
import { APITokenStore, TOKEN_RECORD } from './Types';
import { Dayjs } from 'dayjs';

export class OnMemoryTokenStore extends APITokenStore
{
	private refresh_token: string | undefined = undefined;
	private refresh_token_expire: Dayjs | undefined = undefined;
	private id_token: string | undefined		= undefined;
	private id_token_expire: Dayjs | undefined	= undefined;

	get_refresh_token_info()
	{
		if( ! this.refresh_token || ! this.refresh_token_expire )
		{
			return undefined;
		}

		return {
			token: this.refresh_token,
			expiration: this.refresh_token_expire

		} as TOKEN_RECORD
	}

	set_refresh_token_info({ token, expiration }: TOKEN_RECORD): void {
		this.refresh_token = token;
		this.refresh_token_expire = expiration;
	}

	get_id_token_info(): TOKEN_RECORD | undefined {
		if( ! this.id_token || ! this.id_token_expire )
		{
			return undefined
		}

		return {
			token: this.id_token,
			expiration: this.id_token_expire
		}
	}

	set_id_token_info({ token, expiration }: TOKEN_RECORD): void {
		this.id_token = token;
		this.id_token_expire = expiration;
	}
}