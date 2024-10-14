
import {Dayjs} from "dayjs";

export type TOKEN_RECORD =
{
	token: string;
	expiration: Dayjs;
}

export abstract class APITokenStore
{
	abstract get_refresh_token_info():TOKEN_RECORD | undefined;
	abstract set_refresh_token_info({token,expiration}:TOKEN_RECORD):void;
	abstract get_id_token_info():TOKEN_RECORD | undefined;
	abstract set_id_token_info({token,expiration}:TOKEN_RECORD):void;
}