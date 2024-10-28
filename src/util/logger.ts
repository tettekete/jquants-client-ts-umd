
import pino ,{ Logger ,Level } from 'pino';

const loggers:{[key in Level]?: Logger} = {};

export const getLogger = (log_level:Level = "error") =>
{
	if( ! loggers[log_level] )
	{
		loggers[log_level] = pino({
			level: log_level,
			transport: {
			  target: 'pino-pretty',
			  options: {
				colorize: true,
				destination: 2
			  }
			}
		});
	}

	return loggers[log_level];
};

