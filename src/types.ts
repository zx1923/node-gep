
enum GenePartAs {
  Father = 'father',
  Mother = 'mother'
};

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
  activation: Function    // 激活函数
};

interface GenePart {
  range: Array<number>
  part: Array<OperItem>
};

export {
  EnvOption,
  GenePartAs,
  GenePart,
  OperItem,
  OperSets,
};