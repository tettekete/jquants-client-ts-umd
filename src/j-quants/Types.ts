
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

export interface Logger_T {
  trace(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  fatal(message: string, ...args: any[]): void;
}