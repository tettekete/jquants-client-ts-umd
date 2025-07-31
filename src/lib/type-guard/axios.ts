/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios';
import axios ,{AxiosError} from 'axios';


/**
 * `obj` が `AxiosResponse` 型であることを TypeScript に示すための型ガード関数です。
 *
 * @template [T=any] 
 * @template [D=any] 
 * @param {unknown} obj 
 * @returns {obj is AxiosResponse<T, D>} 
 * @category Axios 関連
 */
export function isAxiosResponse<T = any, D = any>(obj: unknown): obj is AxiosResponse<T, D>
{
	if (typeof obj !== 'object' || obj === null) return false;

	const res = obj as Partial<AxiosResponse>;

	return (
		typeof res.status === 'number' &&
		typeof res.statusText === 'string' &&
		typeof res.config === 'object' &&
		res.config !== null &&
		'data' in res &&
		'headers' in res
	);
}


/**
 * `payload` が `AxiosError` 型であることを TypeScript に示すための型ガード関数です。
 *
 * `axios.isAxiosError()` をラップした関数です。
 *
 * @template [T=any] 
 * @template [D=any] 
 * @param {*} payload 
 * @returns {payload is AxiosError<T, D>} 
 * @category Axios 関連
 */
export function isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>
{
	return axios.isAxiosError( payload );
}
