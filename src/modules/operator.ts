import { isFunction } from '../utils/helper';
import { OperSets } from '../types';

const BuildInFuncs: object = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
  '*2': (a: number) => a * a,
  sqrt: (a: number) => Math.sqrt(a),
  log: (a: number) => Math.log(a),
  pow: (a: number, b: number) => Math.pow(a, b),
  sin: (a: number) => Math.sin(a),
  cos: (a: number) => Math.cos(a),
  e: () => Math.E,
  '/2': (a: number) => a / 2,
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

  setVars(name: string, value: any | Function = 0) {
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