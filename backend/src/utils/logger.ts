import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Log format to strip sensitive fields (JWT tokens, passwords, session secrets)
const sanitizeFormat = winston.format((info) => {
  const sanitize = (val: any): any => {
    if (typeof val !== 'object' || val === null) {
      if (typeof val === 'string') {
        // Mask JWT-like strings or authorization headers or credit cards or pins
        if (val.startsWith('Bearer ') || val.length > 100 && /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/.test(val)) {
          return '[MASKED_JWT]';
        }
        // Mask 10-digit numbers or similar sensitive tokens if necessary
        if (/^\d{10}$/.test(val)) {
          return val.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
        }
      }
      return val;
    }
    const sanitizedObj = { ...val };
    for (const key in sanitizedObj) {
      if (Object.prototype.hasOwnProperty.call(sanitizedObj, key)) {
        if (/password|token|secret|jwt|auth|pin/i.test(key)) {
          sanitizedObj[key] = '[MASKED]';
        } else {
          sanitizedObj[key] = sanitize(sanitizedObj[key]);
        }
      }
    }
    return sanitizedObj;
  };

  const message = info.message;
  if (typeof message === 'string') {
    // Basic regex cleaning for inline logs
    info.message = message.replace(/Bearer\s+[a-zA-Z0-9-._~+/]+=*/g, 'Bearer [MASKED_JWT]');
  } else if (typeof message === 'object') {
    info.message = sanitize(message);
  }

  // Sanitize any metadata properties
  for (const key in info) {
    if (Object.prototype.hasOwnProperty.call(info, key) && key !== 'level' && key !== 'message') {
      info[key] = sanitize(info[key]);
    }
  }

  return info;
});

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  sanitizeFormat(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level.toUpperCase()}: ${typeof info.message === 'object' ? JSON.stringify(info.message) : info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${typeof info.message === 'object' ? JSON.stringify(info.message) : info.message}`
      )
    ),
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
});
