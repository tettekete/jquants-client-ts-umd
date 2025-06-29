
import {Dayjs} from "dayjs";

export type TOKEN_RECORD =
{
	token: string;
	expiration: Dayjs;
};

export abstract class APITokenStore
{
	abstract get_refresh_token_info(): Promise<TOKEN_RECORD | undefined>;
	abstract set_refresh_token_info({token,expiration}:TOKEN_RECORD): Promise<boolean>;
	abstract get_id_token_info(): Promise<TOKEN_RECORD | undefined>;
	abstract set_id_token_info({token,expiration}:TOKEN_RECORD): Promise<boolean>;
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