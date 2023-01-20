export class Logger {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
  buildMessage(status: 'error' | 'info', ...args: unknown[]) {
    return `
============ ${this.key} - ${status} - START ===========
${args.map(item => "\n" + item + "\n").join('')}
============ BlogPost Not Valid - END ===========
    `.trimEnd();
  }
  log(...args: unknown[]) {
    const message = this.buildMessage('info', ...args);
    console.log(message);
    return message;
  }
  error(...args: unknown[]) {
    const message = this.buildMessage('error', ...args);
    console.error(message);
    return message;
  }
}