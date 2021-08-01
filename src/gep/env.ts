import { EnvOption } from '../types';

class Env {
  
  static envOptions: EnvOption

  static setOptions(opts: EnvOption) {
    if (!opts.headLen || !opts.maxpLen) {
      throw new Error(`Gene constructor params is invalid`);
    }
    Env.envOptions = opts;
  }

  static getOptions() {
    return { ...Env.envOptions };
  }

  static set(key: keyof EnvOption, value: any) {
    Env[key] = value;
  }

  static get(key: keyof EnvOption) {
    return Env[key];
  }
};

export default Env;