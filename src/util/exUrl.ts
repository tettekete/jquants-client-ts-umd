
export type HTTP_METHODS_T = "GET" 
					| "HEAD"
					| "POST"
					| "PUT"
					| "DELETE"
					| "CONNECT"
					| "TRACE"
					| "PATCH"
					| "OPTIONS"
					;

export default class ExUrl extends URL
{
	protected _method: HTTP_METHODS_T = "GET";

	constructor(url: string, base?: string)
	{
		super(url, base);
	}

	set method( _method: HTTP_METHODS_T )
	{
		this._method = _method;
	}

	get method(): HTTP_METHODS_T
	{
		return this._method;
	}

	// clone メソッドを追加して新しい URL インスタンスを返す
	public clone(): ExUrl
	{
		const cloned = new ExUrl(this.toString());
		cloned.method = this.method;
		return cloned;
	}

	// withPath メソッドを追加してパスを追加した新しい URL を返す
	public withPath(path: string): ExUrl
	{
		const cloned = this.clone();
		if( ! cloned.pathname.match(/\/$/) )
		{
			cloned.pathname += '/';
		}

		path = path.replace(/^\//,'');

		cloned.pathname = new URL(path, cloned).pathname;
		return cloned;
	}
}