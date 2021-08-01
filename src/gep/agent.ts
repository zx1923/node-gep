import Gene from './gene';
import Env from './env';
import Chromosome from './chromosome';
import { AgentOption, ChromosomeOption, AgentChromeLinkFunc } from '../types';

class Agent {
  private chromosomeList: Chromosome[]
  chromoLinkFunc: typeof AgentChromeLinkFunc

  constructor(options: AgentOption) {
    const { chromosomeLen, chromesomeOption, linkFunc } = options;
    this.chromoLinkFunc = linkFunc;

    if (chromosomeLen) {
      this.chromosomeList = Agent.createChromosomes(chromosomeLen, chromesomeOption);
    } else {
      this.chromosomeList = [];
    }
  }

  getChromosomes() {
    return this.chromosomeList;
  }

  /**
   * 计算适应度
   */
  getFitness() {
    
  }

  /**
   * 获取染色体的值
   * @returns 
   */
   getChromoValue() {
    return Agent.chromosomeFitness(this.chromosomeList);
  }

  /**
   * 计算染色体的值
   * @param chromoList 染色体数组
   * @returns 
   */
  static chromosomeFitness(chromoList: Chromosome[]) {
    const res = [];
    chromoList.forEach(chromo => {
      res.push({
        reduceValue: chromo.getReduceValue(),
        shapeValue: chromo.getShapeValue()
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
  static createChromosomes(count: number, chromoOptions: ChromosomeOption): Chromosome[] {
    const res = [];
    for (let i = 0; i < count; i++) {
      res.push(new Chromosome(chromoOptions));
    }
    return res;
  }
}

export default Agent;