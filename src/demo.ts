import Operator from "./modules/operator";
import Env from "./gep/env";
import Activation from "./modules/activation";
import Chromosome from './gep/chromosome';
import Gene from './gep/gene';
import { OperItem, ChromosomeOption } from "./types";

const operators = new Operator();
operators.setVars('1', 1);
operators.setVars('2', 2);
const operSets = operators.toArray();

const envOpts = {
  operSets,
  headLen: 6,
  maxpLen: 2,
  inheritCount: 1,  // 直接进入下一轮个体数量
  mutantRate: 0.1,  // 突变率
  mixinRate: 0.1,   // 新个体的混入占比
  reviseRate: 0.01, // 修正率，自动调整突变率和个体混入占比
  activation: Activation.tanh
};

Env.setOptions(envOpts);

const chromoOpts: ChromosomeOption = {
  shape: [3, 1],
  linkFunc: () => {}
};

const chromo = new Chromosome(chromoOpts);

console.log(chromo.getGenes());
console.log(chromo.getValue());

// const gene = new Gene();
// console.log(gene.getGenes())
// console.log(gene.getValue());
