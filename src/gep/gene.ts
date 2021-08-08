import { OperItem, GenePart, OperSets, DataInput } from '../types'
import ComputeNode from '../modules/compute-node';
import { getRandomFromArray } from '../utils/helper';
import Activation from '../modules/activation';
import Env from './env';

class Gene {
  headLen: number
  private genes: Array<OperItem>
  private expressionTree: Array<ComputeNode>

  constructor(geneSets?: Array<OperItem>) {
    const { operSets, headLen, maxpLen } = Env.getOptions();
    this.headLen = headLen;
    
    if (geneSets == undefined || !Array.isArray(geneSets) || !geneSets.length) {
      this.genes = Gene.createGenesArray(headLen, maxpLen, operSets);
    } else {
      this.genes = [...geneSets];
    }
    // 生成表达式树
    this.expressionTree = Gene.createComputeTree(this.genes);
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
  getValue(xdata: DataInput) {
    const result = Gene.calculate(this.expressionTree, xdata);
    return result[0];
  }

  /**
   * 返回基因的编码数组
   */
  encode() {
    const chars = [];
    this.genes.forEach(el => {
      chars.push(el.name);
    });
    return chars;
  }

  /**
   * 将基因转码为 ComputeNode 树
   * @param genes 基因
   * @param index 起始索引
   * @param tnode ComputeNode对象
   * @returns 
   */
  static createComputeTree(genes: Array<OperItem>, index = 0, tnode?: Array<ComputeNode>): Array<ComputeNode> {
    if (index === 0) {
      tnode = [ new ComputeNode(genes[index]) ];
      return this.createComputeTree(genes, index + 1, tnode);
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
    const newTnodeArr = this.createComputeTree(genes, index, gnodeArray);
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
  static calculate(expressNodes: Array<ComputeNode>, xdata: DataInput) {
    const result: Array<number> = [];
    expressNodes.forEach(node => {
      if (!node.params.length) {
        result.push(xdata[node.name] ? xdata[node.name] : node.func());
        return;
      }
      result.push(node.func(...Gene.calculate(node.params, xdata)));
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