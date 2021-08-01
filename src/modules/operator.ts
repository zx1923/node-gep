import { isFunction } from '../utils/helper';
import { OperSets } from '../types';

const BuildInFuncs: object = {
  '+': (a: number, b: number) => {
    return a + b;
  },
  '-': (a: number, b: number) => {
    return a - b;
  },
  '*': (a: number, b: number) => {
    return a * b;
  },
  '/': (a: number, b: number) => {
    return a / b;
  },
  sqrt: (a: number) => {
    return a <= 0 ? 0 : Math.sqrt(a);
  },
  log: (a: number) => {
    return a <= 0 ? 0 : Math.log(a);
  },
  exp: (a: number) => {
    return Math.exp(a);
  },
  pow: (a: number, b: number) => {
    if (a < 0 && b < 1) {
      return 0;
    }
    return b >= 0 ? Math.pow(a, b) : 0;
  },
  sin: (a: number) => {
    return Math.sin(a);
  },
  cos: (a: number) => {
    return Math.cos(a);
  },
  tan: (a: number) => {
    return Math.tan(a);
  }
}

class Operator {
  funcs: object
  vars: object

  constructor(funcs: object = {}, vars: object = {}) {
    this.funcs = { ...BuildInFuncs, ...funcs };
    this.vars = vars;
  }

  clear() {
    this.funcs = {};
    this.vars = {};
  }

  importFunc(fnObj: object) {
    this.funcs = { ...this.funcs, ...fnObj };
  }

  importVars(varObj: object) {
    for (let name in varObj) {
      const value = varObj[name];
      if (!isFunction(value)) {
        varObj[name] = () => value;
      }
    }
    this.vars = { ...this.vars, ...varObj };
  }

  setFunc(name: string, fn: Function) {
    this.funcs[name] = fn;
  }

  setVars(name: string, value: any | Function) {
    this.vars[name] = isFunction(value) ? value : (() => value);
  }

  toArray() {
    const result: OperSets = {
      funcs: [],
      vars: []
    };
    ['funcs', 'vars'].forEach(el => {
      for (let name in this[el]) {
        result[el].push({
          name,
          func: this[el][name]
        });
      }
    });
    return result;
  }

};

export default Operator;