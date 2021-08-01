import { OperItem, GenePart, OperSets } from '../types'
import ComputeNode from '../modules/compute-node';
import { getRandomFromArray } from '../utils/helper';
import Activation from '../modules/activation';
import Env from './env';

class Gene {
  headLen: number
  private genes: Array<OperItem>
  activeFunc: Function

  constructor(geneSets?: Array<OperItem>) {
    const { operSets, headLen, maxpLen, activation } = Env.getOptions();
    this.headLen = headLen;
    
    if (geneSets == undefined || !Array.isArray(geneSets) || !geneSets.length) {
      this.genes = Gene.createGenesArray(headLen, maxpLen, operSets);
    } else {
      this.genes = [...geneSets];
    }

    this.activeFunc = activation || Activation.none;
  }

  /**
   * 设置激活函数
   * @param func 激活函数
   */
  setActivationFunc(func: typeof Activation) {
    this.activeFunc = func;
  }

  /**
   * 获取随机基因片段
   * @returns 
   */
  getRandomPart(): GenePart {
    return Gene.getGenePart(this);
  }

  /**
   * 获取基因
   * @returns 
   */
  getGenes() {
    return this.genes;
  }

  /**
   * 获取基因表达式的值
   * @returns 
   */
  getValue() {
    const result = Gene.calculate(Gene.decode(this.genes));
    return this.activeFunc(result[0]);
  }

  /**
   * 将基因转码为 ComputeNode 树
   * @param genes 基因
   * @param index 起始索引
   * @param tnode ComputeNode对象
   * @returns 
   */
  static decode(genes: Array<OperItem>, index = 0, tnode?: Array<ComputeNode>): Array<ComputeNode> {
    if (index === 0) {
      tnode = [ new ComputeNode(genes[index]) ];
      return this.decode(genes, index + 1, tnode);
    }
    const gnodeArray = [];
    tnode.forEach(node => {
      for (let i = 0; i < node.plen; i++) {
        const cnode = new ComputeNode(genes[index]);
        gnodeArray.push(cnode);
        index += 1;
      }
    });
    if (!gnodeArray.length) {
      return tnode;
    }
    let n = 0;
    const newTnodeArr = this.decode(genes, index, gnodeArray);
    tnode.forEach(node => {
      for (let i = 0; i < node.plen; i++) {
        node.params.push(newTnodeArr[n]);
        n += 1;
      }
    });
    return tnode;
  }

  /**
   * 计算基因表达式的值
   * @param geneObj 基因对象
   */
  static calculate(expressNodes: Array<ComputeNode>) {
    const result: Array<number> = [];
    expressNodes.forEach(node => {
      if (!node.params.length) {
        result.push(node.func());
        return;
      }
      result.push(node.func(...Gene.calculate(node.params)));
    });
    return result;
  }

  /**
   * 从基因中获取一个片段
   * @param geneObj 基因数组
   * @param start 起始索引
   * @param end 终止索引
   */
  static getGenePart(geneObj: Gene, start?: number, end?: number): GenePart {
    const randomIndex = () => Math.floor(Math.random() * geneObj.headLen);
    [start, end] = [start, end].map(el => {
      if (el === undefined || el < 0) {
        return randomIndex();
      }
      return el;
    }).sort();
    return {
      range: [start, end],
      part: geneObj.getGenes().slice(start, end + 1)
    };
  }

  /**
   * 生成基因编码
   * @param headLen 头部长度
   * @param endLen 尾部长度
   * @param maxpLen 最大参数长
   * @param opers 函数符
   * @param ends 终止符
   */
  static createGenesArray(headLen: number, maxpLen: number, operSets: OperSets): Array<OperItem> {
    const endLen = headLen * (maxpLen * 1) + 1;
    const headsSets = [...operSets.funcs, ...operSets.vars];
    let genesArray: Array<OperItem> = [];
    genesArray = genesArray.concat(getRandomFromArray(headsSets, headLen));
    genesArray = genesArray.concat(getRandomFromArray(operSets.vars, endLen));
    return genesArray;
  }
}

export default Gene;