import { EnvOption } from '../types';

class Env {
  
  static envOptions: EnvOption
  static OperMaps: object

  static setOptions(opts: EnvOption) {
    if (!opts.headLen || !opts.operSets) {
      throw new Error(`Gene constructor params is invalid`);
    }
    let maxpLen = 0;
    for (let name in opts.operSets.funcs) {
      const fn = opts.operSets.funcs[name];
      if (maxpLen <= fn.func.length) {
        maxpLen = fn.func.length;
      }
    }
    Env.envOptions = {
      ...opts,
      maxpLen,
      geneLen: opts.headLen + opts.headLen * (opts.maxpLen - 1) + 1,
    };

    // oper map
    Env.OperMaps = {};
    [ ...opts.operSets.funcs, ...opts.operSets.vars ].forEach(el => {
      Env.OperMaps[el.name] = el;
    });
  }

  static getOptions() {
    return { ...Env.envOptions };
  }

  static set(key: keyof EnvOption, value: any) {
    Env.envOptions[key] = value;
  }

  static get(key: keyof EnvOption) {
    return Env.envOptions[key];
  }
};

export default Env;