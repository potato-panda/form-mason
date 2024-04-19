const prod = process.env.NODE_ENV === 'production';

interface Logger {
  name: string;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  ok: (...args: any[]) => void;
}

export class LoggerFactory {
  static create(name: string): Logger {
    return prod
      ? {
          name,
          log: () => {},
          info: () => {},
          error: () => {},
          ok: () => {},
        }
      : {
          name,
          log: function (
            ...[level = 'info', message]: [
              level?: 'info' | 'error' | 'ok',
              message?: string,
            ]
          ) {
            console.log(
              `${new Date().toISOString()} ${name.padEnd(20, ' ')}  ${level.padEnd(5, ' ')} | ${message}`
            );
          },
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
