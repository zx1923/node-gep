import Chromosome from './chromosome';
import Loss from '../modules/loss';
import { AgentOption, ChromosomeOption, AgentLossFunc, DataInput, ChromoGeneParts, ChromoEncodeGenes } from '../types';

interface ChromoValueResult {
  reduceValue: number[]
  shapeValue: number[][]
};

interface ChromoItem {
  chromo: Chromosome
  lossValue: number
};

class Agent {
  private loss: number
  chromosomeList: ChromoItem[]
  chromoLossFunc: typeof AgentLossFunc

  constructor(options: AgentOption, chromoSets?: Chromosome[]) {
    const { chromosomeLen = 1, chromesome, lossFunc } = options;
    this.chromoLossFunc = lossFunc || Loss.absolute;

    this.loss = -1;
    if (chromoSets !== undefined && Array.isArray(chromoSets) && chromoSets.length) {
      this.chromosomeList = [];
      chromoSets.forEach(el => {
        this.chromosomeList.push({ chromo: el, lossValue: -1 });
      });
    } else {
      this.chromosomeList = Agent.createChromosomes(chromosomeLen, chromesome);
    }
  }

  /**
   * 获取全部染色体
   * @returns 
   */
  getChromosomes() {
    const chromos: Chromosome[] = [];
    this.chromosomeList.forEach(el => {
      chromos.push(el.chromo);
    });
    return chromos;
  }

  /**
   * 获取序列化编码后的染色体
   */
  getEncodeChromosomes() {
    const encodeChromos: ChromoEncodeGenes = [];
    this.chromosomeList.forEach(el => {
      encodeChromos.push(el.chromo.getEncodeGenes());
    });
    return encodeChromos;
  }

  /**
   * 计算适应度
   */
  getFitness(xdata: DataInput[], ydata: number[][]) {
    this.loss = this.calculateLoss(xdata, ydata);
    return this.loss;
  }

  /**
   * 计算适应度
   * @param xdata 输入值
   * @param ydata 输出值
   */
  calculateLoss(xdata: DataInput[], ydata: number[][]) {
    if (!xdata.length || xdata.length !== ydata.length) {
      throw new Error(`The input data is invalid`);
    }
    const outResArr: number[][] = [];
    ydata.forEach((line, idx) => {
      let outItem: number[] = [];
      this.chromosomeList.forEach(item => {
        outItem = outItem.concat(item.chromo.getReduceValue(xdata[idx]));
      });
      outResArr.push(outItem);
    });
    return this.chromoLossFunc(outResArr, ydata);
  }

  /**
   * 获取染色体的值
   * @returns 
   */
  getChromoValue(xdata: DataInput) {
    return Agent.chromosomeGetValue(this.chromosomeList, xdata);
  }

  /**
   * 从染色体中获取随机基因片段
   * @returns 
   */
  getRandomParts() {
    const parts: ChromoGeneParts[] = [];
    this.chromosomeList.forEach(el => {
      parts.push(el.chromo.getRandomParts());
    });
    return parts;
  }

  /**
   * 计算染色体的值
   * @param chromoList 染色体数组
   * @returns 
   */
  static chromosomeGetValue(chromoList: ChromoItem[], xdata: DataInput) {
    const res: ChromoValueResult[] = [];
    chromoList.forEach(item => {
      res.push({
        reduceValue: item.chromo.getReduceValue(xdata),
        shapeValue: item.chromo.getShapeValue(xdata)
      });
    });
    return res;
  }

  /**
   * 
   * @param count 染色体条数
   * @param chromoOptions 染色体规则
   * @returns 
   */
  static createChromosomes(count: number, chromoOptions: ChromosomeOption): ChromoItem[] {
    const res = [];
    for (let i = 0; i < count; i++) {
      res.push({
        chromo: new Chromosome(chromoOptions),
        lossValue: -1
      });
    }
    return res;
  }
}

export default Agent;