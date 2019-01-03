import { SipHelper } from '../base/sip-helper';
import { SipConfig } from '../sip-config';
import { SipInjectable } from "../vue-extends/decorators/sip-inject";
import { SipServiceBase } from '../vue-extends/sip-service-base';
import { SipLoggerLevel } from "./sip-logger-level";
import { SipLoggerOptions } from "./sip-logger-options";

const DEFAULT_OPTIONS: SipLoggerOptions = {
  level: SipLoggerLevel.WARN,
  global: true,
  globalAs: "sipLogger"
};

function deserializeVueObject(p){
  return SipConfig.env == 'production' ? p : SipHelper.deserializeVueObject(p);
}

@SipInjectable({ scope: "business" })
export class SipLoggerService extends SipServiceBase {
  private _level: SipLoggerLevel;
  private _globalAs: string;

  constructor(component:any) {
    super(component);

    let config = SipConfig;

    // Move this to the constructor definition when optional parameters are working with @Injectable: https://github.com/angular/angular/issues/7344
    let { level, global, globalAs } = Object.assign({}, DEFAULT_OPTIONS, config.loggerOptions);

    this._level = level;
    this._globalAs = globalAs;

    global && this._global();

  }

  error(message?: any, ...optionalParams: any[]) {
    this.isErrorEnabled() && console.error.apply(console, deserializeVueObject(arguments));
  }

  warn(message?: any, ...optionalParams: any[]) {
    this.isWarnEnabled() && console.warn.apply(console, deserializeVueObject(arguments));
  }

  info(message?: any, ...optionalParams: any[]) {
    this.isInfoEnabled() && console.info.apply(console, deserializeVueObject(arguments));
  }

  log(message?: any, ...optionalParams: any[]) {
    this.isLogEnabled() && console.log.apply(console, deserializeVueObject(arguments));
  }

  debug(message?: any, ...optionalParams: any[]) {
    this.isDebugEnabled() && console.warn.apply(console, deserializeVueObject(arguments));
  }

  debugger(){
    if (this.isDebugEnabled()) debugger;
  }

  private _global = () => (<any>window)[this._globalAs] = this;

  isErrorEnabled = (): boolean => this.level >= SipLoggerLevel.ERROR;
  isWarnEnabled = (): boolean => this.level >= SipLoggerLevel.WARN;
  isInfoEnabled = (): boolean => this.level >= SipLoggerLevel.INFO;
  isDebugEnabled = (): boolean => this.level >= SipLoggerLevel.DEBUG;
  isLogEnabled = (): boolean => this.level >= SipLoggerLevel.LOG;

  get level(): SipLoggerLevel { return this._level; }

  set level(level: SipLoggerLevel) {
    this._level = level;
  }

}
