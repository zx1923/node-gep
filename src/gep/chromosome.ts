import Gene from './gene';
import { isArray, } from '../utils/helper';
import { ChromosomeOption, OperItem, ChromosomeReduceFunc } from '../types';

class Chromosome {
  genesMap: Array<Gene>[]
  shape: [number, number]
  linkFunc: typeof ChromosomeReduceFunc
  lastShapeValue: Array<number>[]

  constructor(option: ChromosomeOption, chromoGeneSets: Array<Gene>[] = []) {
    this.shape = option.shape;
    this.linkFunc = option.linkFunc.bind(this);
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
   * 生成使用linkFunc连接的基因值
   */
  getValue() {
    let sum = 0;
    const func = (row, col) => {
      const val = this.genesMap[row][col].getValue();
      sum += val;
      return val;
    };
    this.lastShapeValue = Chromosome.reduce(this.shape, func);
    return sum;
  }

  /**
   * 输出与shape相等的基因值
   */
  getShapeValue() {
    if (!this.lastShapeValue || !this.lastShapeValue.length) {
      const func = (row, col) => {
        return this.genesMap[row][col].getValue();
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
  static createGenesUseShape(shape: Array<number>) {
    const [w, h] = shape;
    const result = [];
    for (let i = 0; i < h; i++) {
      const gene = [];
      for (let n = 0; n < w; n++) {
        gene.push(new Gene());
      }
      result.push(gene);
    }
    return result;
  }
}

export default Chromosome;