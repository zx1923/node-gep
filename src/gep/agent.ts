import Chromosome from './chromosome';
import Loss from '../modules/loss';
import { AgentOption, ChromosomeOption, AgentChromeLinkFunc, AgentLossFunc, DataInput, ChromoGeneParts, ChromoEncodeGenes } from '../types';
import Link from '../modules/link';

interface ChromoValueResult {
  reduceValue: Array<number>
  shapeValue: number[][]
};

interface ChromoItem {
  chromo: Chromosome
  lossValue: number
};

class Agent {
  chromosomeList: ChromoItem[]
  chromoLinkFunc: typeof AgentChromeLinkFunc // TODO: 连接函数，保留
  chromoLossFunc: typeof AgentLossFunc

  constructor(options: AgentOption, chromoSets?: Chromosome[]) {
    const { chromosomeLen = 1, chromesome, linkFunc, lossFunc } = options;
    this.chromoLinkFunc = linkFunc || Link.addUp;
    this.chromoLossFunc = lossFunc || Loss.absolute;

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
  getFitness(xdata: Array<DataInput>, ydata: Array<number>) {
    this.calculateFitness(xdata, ydata);
    const [ best ] = this.chromosomeList;
    return best.lossValue;
  }

  /**
   * 计算适应度
   * @param xdata 输入值
   * @param ydata 输出值
   */
  calculateFitness(xdata: Array<DataInput>, ydata: Array<number>) {
    if (!xdata.length || xdata.length !== ydata.length) {
      throw new Error(`The input data is invalid`);
    }
    // TODO: 对染色体的适应度重新进行整理计算
    this.chromosomeList.forEach(item => {
      // console.log('=====>', item);
      const reduceResArray = item.chromo.getReduceValue(xdata);
      item.lossValue = this.chromoLossFunc(reduceResArray, ydata);
    });
    Agent.fitnessSort(this.chromosomeList);
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
   * 根据染色体的适应度进行排序
   * @param chromoList 染色体数组
   */
  static fitnessSort(chromoList: ChromoItem[]) {
    chromoList.sort((a, b) => {
      return a.lossValue - b.lossValue;
    });
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