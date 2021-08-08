import Gene from './gene';
import { isArray, } from '../utils/helper';
import { ChromosomeOption, OperItem, ChromosomeReduceFunc, DataInput } from '../types';
import Activation from '../modules/activation';
import Link from '../modules/link';

class Chromosome {
  private genesMap: Array<Gene>[]
  shape: [number, number]
  linkFunc: typeof ChromosomeReduceFunc   // TODO: 连接函数，保留
  private lastShapeValue: Array<number>[]
  private activeFunc: Function

  constructor(option: ChromosomeOption, chromoGeneSets: Array<Gene>[] = []) {
    const { shape, linkFunc, activation } = option;
    this.shape = (shape && shape.length === 2) ? shape : [1, 1];
    this.linkFunc = linkFunc || Link.addUp;
    this.activeFunc = activation || Activation.none;

    this.lastShapeValue = [];
    if (!chromoGeneSets || !isArray(chromoGeneSets) || !chromoGeneSets.length) {
      this.genesMap = Chromosome.createGenesUseShape(this.shape);
    } else {
      this.genesMap = chromoGeneSets;
    }
  }

  /**
   * 获取染色体基因组
   * @returns 
   */
  getGenes(): Array<OperItem>[] {
    const func = (row, col) => {
      return this.genesMap[row][col].encode();
    };
    return Chromosome.reduce(this.shape, func);
  }

  /**
   * 生成相加后的基因值
   */
  getReduceValue(xdata: DataInput | DataInput[]) {
    const xinputArray = Array.isArray(xdata) ? xdata : [xdata];
    const result: number[] = [];
    xinputArray.forEach(inpx => {
      let sum = 0;
      const func = (row, col) => {
        const val = this.genesMap[row][col].getValue(inpx);
        sum += val;
        return this.activeFunc(val);
      };
      this.lastShapeValue = Chromosome.reduce(this.shape, func);
      result.push(this.activeFunc(sum));
    });
    return result;
  }

  /**
   * 输出与shape相等的基因值
   */
  getShapeValue(xdata: DataInput) {
    if (!this.lastShapeValue || !this.lastShapeValue.length) {
      const func = (row, col) => {
        return this.genesMap[row][col].getValue(xdata);
      };
      this.lastShapeValue = Chromosome.reduce(this.shape, func);
    }
    return this.lastShapeValue;
  }

  /**
   * 基于给定的shape，使用给定的回调函数进行循环归档
   * @param shape 形状
   * @param fn 回调
   * @returns 
   */
  static reduce(shape: [number, number], fn: typeof ChromosomeReduceFunc): any[] {
    const [h, w] = shape;
    const res = []
    for (let i = 0; i < h; i++) {
      const row = [];
      for (let n = 0; n < w; n++) {
        row.push(fn(n, i));
      }
      res.push(row);
    }
    return res;
  }

  /**
   * 生成指定形状的染色体
   * @param shape 形状
   * @returns 
   */
  static createGenesUseShape(shape: [number, number]) {
    const func = () => {
      return new Gene();
    };
    return Chromosome.reduce(shape, func);
  }
}

export default Chromosome;