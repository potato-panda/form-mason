import db from '../db/db';

const isProduction = process.env.NODE_ENV === 'production';

type LogParameters = [level?: 'info' | 'error' | 'ok', message?: string];

interface Logger {
  name: string;
  log: (...args: LogParameters) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  ok: (...args: any[]) => void;
}

export default class LoggerFactory {
  static create(name: string): Logger {
    const log = async function (...[level = 'info', message]: LogParameters) {
      if (isProduction) return;
      const date = new Date();
      const tx = db.transaction('logs', 'readwrite');
      tx.objectStore('logs').add({
        date,
        name,
        level,
        message,
      });
      console.log(
        `${date.toISOString()} ${name.padEnd(20, ' ')}  ${level.padEnd(5, ' ')} | ${message}`
      );
    };

    return isProduction
      ? {
          name,
          log: () => {},
          info: () => {},
          error: () => {},
          ok: () => {},
        }
      : {
          name,
          log,
          info: function (message?: string) {
            this.log('info', message);
          },
          error: function (message?: string) {
            this.log('error', message);
          },
          ok: function (message?: string) {
            this.log('ok', message);
          },
        };
  }
}
