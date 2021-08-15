import { EnvOption, OperSets } from '../types';

class Env {
  
  static envOptions: EnvOption
  static operMaps: object
  static operSets: OperSets

  static setOptions(opts: EnvOption, opers: OperSets) {
    if (!opts.headLen) {
      throw new Error(`Gene constructor params is invalid`);
    }
    Env.operSets = opers;
    let maxpLen = 0;
    for (let name in opers.funcs) {
      const fn = opers.funcs[name];
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
    Env.operMaps = {};
    [ ...opers.funcs, ...opers.vars ].forEach(el => {
      Env.operMaps[el.name] = el;
    });
  }

  static getOpers() {
    return Env.operSets;
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