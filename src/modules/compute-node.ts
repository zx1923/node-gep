import { OperItem } from '../types';

class ComputeNode {
  plen: number
  params: Array<any>
  func: Function
  name: string
  
  constructor (oper: OperItem) {
    this.plen = oper.func.length;
    this.params = [];
    this.name = oper.name;
    this.func = oper.func;
  }

};

export default ComputeNode;