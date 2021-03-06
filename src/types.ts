
export declare function ChromosomeReduceFunc(row: number, col:number);
export declare function AgentChromeLinkFunc(prev, curt);
export declare function AgentLossFunc(out: number[][], target: number[][]);
export interface ChromosomeOption {
  shape: [number, number]               // 基因形
  linkFunc?: typeof ChromosomeReduceFunc // 基因连接函数
  activation?: Function
}

export interface AgentOption {
  chromesome: ChromosomeOption
  chromosomeLen?: number
  lossFunc?: typeof AgentLossFunc
}

export interface OperItem {
  func: Function
  name: string
};

export interface OperSets {
  funcs: Array<OperItem>  // 函数符集合
  vars: Array<OperItem>   // 终止符集合
}

export interface EnvOption  {
  headLen: number         // 头部长度
  mutateRate: number      // 突变概率
  mixinRate: number       // 混入新个体占比
  reviseRate: number      // 自动调整比率
  maxpLen?: number         // 函数符的最大参数个数
  geneLen?: number         // 基因长度，计算得出
};

export interface GenePart {
  range: [number, number]
  part: Array<OperItem>
};

export interface GenePartItem {
  position: [number, number],
  genePart: GenePart
};

export interface DataInput {
  [key: string]: number
};

export interface PopulationOption {
  agent: AgentOption
  total: number
  topn: number
  iteration?: number
  stopLoss?: number
};

export type ChromoGeneParts = GenePartItem[];
export interface EncodeGenes {
  shape: [number, number]
  genes: string[][]
};

export type ChromoEncodeGenes = EncodeGenes[];
