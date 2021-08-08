
enum GenePartAs {
  Father = 'father',
  Mother = 'mother'
};

declare function ChromosomeReduceFunc(row: number, col:number);
declare function AgentChromeLinkFunc(prev, curt);
declare function AgentLossFunc(out: number | number[], target: number | number[]);
interface ChromosomeOption {
  shape: [number, number]               // 基因形
  linkFunc?: typeof ChromosomeReduceFunc // 基因连接函数
  activation?: Function
}

interface AgentOption {
  chromesomeOption: ChromosomeOption
  chromosomeLen?: number
  lossFunc?: typeof AgentLossFunc
  linkFunc?: typeof AgentChromeLinkFunc
  activation?: Function
}

interface OperItem {
  func: Function
  name: string
};

interface OperSets {
  funcs: Array<OperItem>  // 函数符集合
  vars: Array<OperItem>   // 终止符集合
}

interface EnvOption  { 
  operSets: OperSets
  maxpLen: number         // 函数符的最大参数个数
  headLen: number         // 头部长度
  mutantRate: number      // 突变概率
  inheritCount: number    // 精英数量
  mixinRate: number       // 混入新个体占比
  reviseRate: number      // 自动调整比率
};

interface GenePart {
  range: Array<number>
  part: Array<OperItem>
};

interface DataInput {
  [key: string]: number
};

interface PopulationOption {
  agent: AgentOption
  count: number
  topn: number
  iteration?: number
  stopLoss?: number
};

export {
  EnvOption,
  GenePartAs,
  GenePart,
  OperItem,
  OperSets,
  ChromosomeOption,
  ChromosomeReduceFunc,
  AgentOption,
  AgentChromeLinkFunc,
  AgentLossFunc,
  DataInput,
  PopulationOption
};