import Agent from "./agent";
import Env from "./env";
import Chromosome from "./chromosome";
import { PopulationOption, AgentOption, DataInput, ChromoGeneParts, ChromoEncodeGenes } from "../types";
import { getRandomRange, replaceArrayPart } from "../utils/helper";

interface AgentItem {
  agent: Agent
  loss: number
  prob: number
};

class Population {
  agents: AgentItem[]
  private agentOption: AgentOption
  private iterationTimes: number
  private stopLoss: number
  private topn: number
  private total: number

  constructor(option: PopulationOption) {
    const { iteration = 1, stopLoss = 0.001, agent, total = 100, topn = 0.5 } = option;
    this.iterationTimes = iteration;
    this.stopLoss = stopLoss;
    this.agentOption = agent
    this.topn = topn;
    this.total = total;
    this.agents = Population.createAgents(total, this.agentOption);
  }

  getAgents() {
    return this.agents;
  }

  /**
   * 获取表现最后的len个个体
   * @param len 长度
   */
  getTop(len: number = 1) {
    return this.agents.slice(0, len);
  }

  /**
   * 对每一个个体进行生存考验
   * @param xdata 输入值
   * @param ydata 输出值
   */
  alive(xdata: Array<DataInput>, ydata: Array<number>) {
    this.agents.forEach((ag, idx) => {
      try {
        ag.loss = ag.agent.getFitness(xdata, ydata);
      } catch (err) {
        throw err;
      }
    });
    this.agents.sort((a, b) => {
      return a.loss - b.loss;
    });
    this.agents = Population.getProbability(this.agents, this.topn);
  }

  /**
   * 以对象实例的方式进行杂交
   */
  hybridize() {
    const oldAgents = [...this.agents];
    this.agents = [];
    const { mixinRate } = Env.getOptions();
    const newAgentCount = Math.floor(this.total * mixinRate);
    for (let i = 0; i < newAgentCount; i++) {
      this.agents.push(Population.createAgentItem(new Agent(this.agentOption)));
    }
    // 保留精英
    const [ best ] = oldAgents;
    this.agents.push(Population.createAgentItem(best.agent));
    for (let i = newAgentCount - 1; i < this.total; i++) {
      // 随机取出父本的一段基因片段，与母本基因结合，生成新个体
      const [ father ] = Population.getRandomAgent(oldAgents, 1);
      const fParts = father.agent.getRandomParts();
      const fChild = this.createMixinAgent(fParts, best.agent.getChromosomes());
      this.agents.push(Population.createAgentItem(fChild));
    }
  }

  /**
   * 使用序列码的方式进行杂交
   */
  encodeHybridize() {
    const oldAgents = [...this.agents];
    this.agents = [];
    const { mixinRate } = Env.getOptions();
    const newAgentCount = Math.floor(this.total * mixinRate);
    for (let i = 0; i < newAgentCount; i++) {
      this.agents.push(Population.createAgentItem(new Agent(this.agentOption)));
    }
    // 保留精英
    const [ best ] = oldAgents;
    this.agents.push(Population.createAgentItem(best.agent));
    // 交叉变异
    for (let i = newAgentCount - 1; i < this.total; i++) {
      const [ father, mother ] = Population.getRandomAgent(oldAgents, 2);
      const childChromo = Population.createMixedAgentChromoGenes(father.agent, mother.agent);
      const chromoSets = [];
      childChromo.forEach(encodeGenes => {
        const geneMap = Chromosome.transEncodeGeneToGeneSets(encodeGenes);
        const childChromo = new Chromosome(this.agentOption.chromesome, geneMap);
        chromoSets.push(childChromo);
      });
      const childAgent = new Agent(this.agentOption, chromoSets);
      this.agents.push(Population.createAgentItem(childAgent));
    }
  }

  /**
   * 将染色体基因片段融合到母本中，生成新个体
   * @param part 染色体基因片段
   * @param motherChromos 母本染色体
   */
  createMixinAgent(part: ChromoGeneParts[], motherChromos: Chromosome[]) {
    if (part.length !== motherChromos.length) {
      throw new TypeError(`Chromosome number cannot be matched`);
    }
    const childChromos = [];
    motherChromos.forEach((chromo, idx) => {
      const newGenes = chromo.getMixedGenes(part[idx]);
      const newChromo = new Chromosome(this.agentOption.chromesome, newGenes);
      childChromos.push(newChromo);
    });
    return new Agent(this.agentOption, childChromos);
  }

  /**
   * 生成混合后的新染色体序列
   * @param fAgent 父本
   * @param mAgent 母本
   * @returns 
   */
  static createMixedAgentChromoGenes(fAgent: Agent, mAgent: Agent) {
    const fEncodeChromos = fAgent.getEncodeChromosomes();
    const mEncodeChromos = mAgent.getEncodeChromosomes();
    const countArray = [];
    fEncodeChromos.forEach(el => {
      const [w, h] = el.shape;
      countArray.push(w * h);
    });
    const ranges = getRandomRange(Env.getOptions().headLen, countArray);
    // 新染色体
    const newChromos: ChromoEncodeGenes = [];
    mEncodeChromos.forEach((el, cidx) => {
      const genesRes = [];
      el.genes.forEach((gn, gidx) => {
        const [start, end] = ranges[cidx][gidx];
        const part = gn.slice(start, end + 1);
        const mixedGenes = replaceArrayPart(fEncodeChromos[cidx].genes[gidx], start, part);
        genesRes.push(mixedGenes);
      });
      newChromos.push({
        shape: el.shape,
        genes: genesRes
      });
    });
    return newChromos;
  }

  static createAgentItem(agent: Agent) {
    return { agent, loss: -1, prob: 0 };
  }

  /**
   * 生成个体
   * @param count 数量
   * @param agentSets 配置信息
   * @returns 
   */
  static createAgents(count: number, agentSets: AgentOption) {
    const result: AgentItem[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        agent: new Agent(agentSets),
        loss: -1,
        prob: 0
      });
    }
    return result;
  }

  /**
   * 获取每一个个体的生成概率
   * @param agents 种群
   */
  static getProbability(agents: AgentItem[], topn: number) {
    const len = Math.floor(agents.length * topn);
    let sumValue = 0;
    agents.forEach((ag, idx) => {
      if (idx < len) {
        sumValue += ag.loss;
      } else {
        ag.prob = 0;
      }
    });
    for (let i = 0; i < len; i++) {
      agents[len - i - 1].prob = agents[i].loss / sumValue;
    }
    return agents;
  }

  /**
   * 从给定种群中选中给个个数的个体
   * @param agents 种群
   * @param len 个数
   */
  static getRandomAgent(agents: AgentItem[], len: number = 1) {
    const selects: AgentItem[] = [];
    for (let i = 0; i < len; i++) {
      const val = Math.random();
      let total = 0;
      for (let n = 0; n < agents.length; n++) {
        if (total < val && val <= total + agents[n].prob || n === agents.length - 1) {
          selects.push(agents[n]);
          break;
        }
        total += agents[n].prob;
      }
    }
    return selects;
  }

};

export default Population;