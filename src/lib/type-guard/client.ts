
import type { TOKEN_RECORD } from "../../types";
import dayjs from "dayjs";

export function isTokenRecord( obj: unknown ): obj is TOKEN_RECORD
{
	return (
		typeof obj === 'object'
		&& obj !== null
		&& ('token' in obj)
		&& typeof obj.token	=== 'string'
		&& ('expiration' in obj)
		&& dayjs.isDayjs(obj.expiration)
	);
}
