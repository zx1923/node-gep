import { isFunction } from '../utils/helper';
import { DataInput } from '../types';

class DataIO {
  inpArray: Array<DataInput>
  outArray: Array<number>

  constructor() {
    this.inpArray = [];
    this.outArray = [];
  }

  add(xdata: DataInput, ydata: number) {
    this.inpArray.push(xdata);
    this.outArray.push(ydata);
  }

  export() {
    return {
      x: this.inpArray,
      y: this.outArray
    };
  }
};

export default DataIO;