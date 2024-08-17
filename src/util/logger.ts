
import pino ,{ Logger ,Level } from 'pino';

let loggers:{[key in Level]?: Logger} = {};

export const getLogger = (log_level:Level = "info") =>
{
	if( ! loggers[log_level] )
	{
		loggers[log_level] = pino({
			level: log_level,
			transport: {
			  target: 'pino-pretty',
			  options: {
				colorize: true
			  }
			}
		});
	}

	return loggers[log_level];
}

