import {jest,describe, expect, test} from '@jest/globals';
import axios, { AxiosInstance,AxiosResponse ,InternalAxiosRequestConfig} from 'axios';
import JQH from '../src/j-quants'


import { Dayjs } from 'dayjs';

import { OnMemoryCredsStore } from '../src/j-quants/OnMemoryCredsStore';
import { OnMemoryTokenStore } from '../src/j-quants/OnMemoryTokenStore';

const credsStore = new OnMemoryCredsStore({user: 'foo@example.com' , password: 'password' });
const tokenStore = new OnMemoryTokenStore();


jest.mock('axios');
// const response = {refreshToken: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.eHZcVe3Gc5OTU84-grqkQEijS5byj3GLjf_35s7Ez6FHLmzpXFZkfTbCenD85QAi5B15-qVs9FHsdBkimyU8UGHSV6zpUn-TqF-fIDoZ8v2MMSo6FYsjVQ-NXBjxwsCkSe7E7n08v7j9NM83UYlYyvlGwtQm91ACApSmk_nO72nZAORgDWfxAXLERGqj6ef93_M3Sf4PxCQmFC_VKtCV2zajhu2qq4AIH_sWRQGyzauG2b3Fex0uh72SMTDErxCFjqaszJ4FNhPAEQ5AGOiS_gsqbuQlijHQg7L-W6Sai6CpGgJuMR75qPsFtWmPUKYPeqfvixCJY14Adiz6HT2sLA.y6mrPfUMw_i25C4_.WfwkvmYh17bgekqVLhdvZRKN01Nu82EOKoB3FLzD8Nr7oaulHnG2ZixUOW5sQcmfiYvbeqY1lB0LVlH_6FQGjn20BTF-A3xAJQmBSM7inetBCCaTmhhcFte8QseNoBkEoTqy2JpUh5PNaxXNkn1FSVZgZCqtbrFLYfRkG4bmhbI1TDS_y6ov1Ms1POdq7oRP27PMAJaE9Ehkqx27qtVHw7OADDDIeLe2_DjoGtJ98giHZ34rE_khu0NbDQxh40CdVMZe3JcBn0aUGFNcHVhP7owQewZ7pE4olJ5Bvc-eFFV5us7scMQXvvuA9BrNl-Hk8UB4bK9BTNo8b7IKamSrxZSZEprf4ppeaN2i6kDH7knnakJZvGJAmm-vSWzLBzcP4Tfba7CQ_uWWRMhGqwg0Hp2-NJ581eSlQcZYidITkxtJtkF3F6VENevEWI07-hcqvXxOV3-ml6xiZn9bDvXnDbE9TcYpXBRjmMyB64QzZSRQneKoNUnl-Nd12My7m0zubAikLBwnA2hkDnhrfXw7bWh524Yxjbe5VuPTxVeVBEpPdz15sd-iZBnsbVveYkJvK6cp-AlWmzItC9P4YaOYO20HkoDaGY648B1zncqB9WnON-_OiEz7i6g2nc4HIQfMsPN9irjt0IJTROI-_fpRQPKuintsWtUK8bpkXVEo-hp53OeX1sLU_ayvMC_2zBj9knFTigypPrYM1auO9fof46N2S_1xjU4Sglu_DzVArHKSJCDHYABST_DxjUUuLACRy8oXqdU5awiBhehVoHVKZJtfeZ6AqivKYcOj2WxNgZV43ByyQAUqmFlMGCN5YtxxsmEqgQHeDot1ztJTbuK2OeSSuQ4raKjZ9x5MRCByme-v34qm7DaV5b27UnWI36gkTfCL7Tf1KzxZQVLiYwoqFkcUrZkFa7QO2oVFAwhgUOyE5rTyspRvNKtN9cs83lk0dMBautQV5-Qmpxj-7gyD_gslqLmPdzOC7mNgXsagkoASZXy9wmyFm0anWwQtyl0fMiGpnU9Ldl08yWsElQAPVWtYeJdmDVrN2OteYmzHTysZl-ZZ26BaDRHDp5zvUr9swLNocLGGIGpOlxlsBb7XXfXiRImZDmompiBSm0xP4OGaTCdigXkEvyG7x9I-PljFOrZQNPHPhdNdsLoqQa6ULNHgAirWnJS4phGGaFCeXoP_A8i829BDob5A5QxhFdi65lcNc6mxdXp5t9fuDQGjA4ORdT1N1RVFT1DVAgOjo5PzKsyqznMQ_YW2_JeV6O7fvubFMpIROtLwUObVqPJRCjFZx2XPKukbe7CfXU48agm8qd7S35290o9SXK0LIUlf9rvYs02KvBo5RA.QbGr0RMHVe0XHzw_-ih5zQ"};
const response: AxiosResponse = {
	status: 200,
	statusText: "OK",
	config: ({} as InternalAxiosRequestConfig),
	headers:
	{
		"Content-Type": "application/json; charset=utf-8"
	},
	data:
	{
		refreshToken: "<YOUR refreshToken>"
	}
}

const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.mockResolvedValue( response );
// axiosMock.get.mockResolvedValue( response );

describe('Get tokens',()=>
{
	test('JQH.getRefreshToken',()=>
	{
		axiosMock.mockResolvedValue( {data: {refreshToken: "<YOUR refreshToken>"}} );
		
		let jqh = new JQH(
			{
				creds_store: credsStore,
				token_store: tokenStore
			}
		);
		let promise = jqh.getRefreshToken();
		
		promise.then( (r) =>
			{
				expect( r.ok ).toBeTruthy;
				expect( r.data ).toBe( "<YOUR refreshToken>" );

				expect( jqh.refresh_token ).toBe( "<YOUR refreshToken>" );
			});
	});


	test('JQH.getIDToken',()=>
	{
		axiosMock.mockResolvedValue( {data: {idToken: "<ID token>"}} );
		
		let jqh = new JQH(
			{
				creds_store: credsStore,
				token_store: tokenStore
			}
		);
		let promise = jqh.getIDToken({
						refresh_token: "<My refreshToken>"
				});
		
		promise.then( (r) =>
			{
				expect( r.ok ).toBeTruthy;
				expect( r.data ).toBe( "<ID token>" );

				expect( jqh.id_token ).toBe( "<ID token>" );
			});
	});
})


	
