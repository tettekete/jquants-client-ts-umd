
import type { TOKEN_RECORD } from "../../types";
import dayjs from "dayjs";


/**
 * `obj` が {@link TOKEN_RECORD} 型であることを TypeScript に示すための型ガード関数です。
 *
 * @param {unknown} obj - 評価対象オブジェクト
 * @returns {obj is TOKEN_RECORD} 
 * @category JQuantsAPIClient（本モジュール）
 */
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
