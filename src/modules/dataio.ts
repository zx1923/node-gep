import { DataInput } from '../types';

class DataIO {
  inpArray: DataInput[]
  outArray: number[][]

  constructor() {
    this.inpArray = [];
    this.outArray = [];
  }

  add(xdata: DataInput, ydata: number | number[]) {
    this.inpArray.push(xdata);
    this.outArray.push(Array.isArray(ydata) ? ydata : [ ydata ]);
  }

  export() {
    return {
      x: this.inpArray,
      y: this.outArray
    };
  }
};

export default DataIO;