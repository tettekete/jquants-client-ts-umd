import {describe, expect, test} from '@jest/globals';
// import { assert } from "chai";
import Result from '../src/util/result';


describe('Throws an exception when assigning to a ReadOnly member.',()=>
{
	let r = Result.success("OK","Hello");
	
	test("ok",()=>{
		expect(()=>
		{
			// @ts-ignore
			r.ok = false
		}).toThrow();
	});

	test("ng",()=>{
		expect(()=>
		{
			// @ts-ignore
			r.ng = false
		}).toThrow();
	});

	test("message",()=>{
		expect(()=>
		{
			// @ts-ignore
			r.message = "SUCCSESS"
		}).toThrow();
	});

	test("data",()=>{
		expect(()=>
		{
			// @ts-ignore
			r.data = "See you again"
		}).toThrow();
	});
	
})

let index = 0;
describe.each([
	{f: ()=>{return Result.success()}						,b: true	,m: "success" ,o: null },
	{f: ()=>{return Result.success("OK")}					,b: true	,m:"OK" ,o: "OK" },
	{f: ()=>{return Result.success("OK",{foo: "bar"})}		,b: true	,m:"OK" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success(undefined,{foo: "bar"})}	,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success(null,{foo: "bar"})}		,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.success({foo: "bar"})}			,b: true	,m:"success" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure()}						,b: false	,m:"failure" ,o: null},
	{f: ()=>{return Result.failure("NG")}					,b: false	,m:"NG" ,o: "NG"},
	{f: ()=>{return Result.failure("NG",{foo: "bar"})}		,b: false	,m:"NG" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure(undefined,{foo: "bar"})}	,b: false	,m:"failure" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure(null,{foo: "bar"})}		,b: false	,m:"failure" ,o: {foo: "bar"}},
	{f: ()=>{return Result.failure({foo: "bar"})}			,b: false	,m:"failure" ,o: {foo: "bar"}},

])('All construct patterns',({f,b,m,o}) =>
{
	index++;
	test(`${index}:コンストラクタで例外スローしない`,()=>
	{
		expect( f ).not.toThrow();
	});
	
	let r = f();
	test(`ブール評価が ${b} である`,()=>
	{
		if( b )
		{
			expect( r.ok ).toBeTruthy()
			expect( r.ng ).toBeFalsy()
			expect( r.isSuccess() ).toBeTruthy()
			expect( r.isFailure() ).toBeFalsy()
		}
		else
		{
			expect( r.ok ).toBeFalsy()
			expect( r.ng ).toBeTruthy()
			expect( r.isSuccess() ).toBeFalsy()
			expect( r.isFailure() ).toBeTruthy()
		}
	});
	
	test(`message が "${m}" である`,()=>
	{
		expect( r.message ).toBe( m );
	})
	
	test('data が期待値通りである',()=>
	{
		expect( JSON.stringify(r.data) ).toEqual( JSON.stringify( o ) )
		// assert.deepEqual( r.data , o );
	})
});

