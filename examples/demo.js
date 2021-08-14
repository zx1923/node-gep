const { Operator, DataIO, Env, Loss, Link, Activation, Population } = require('gep');

const operators = new Operator();
operators.setVars('x');
const operSets = operators.toArray();

const envOpts = {
  operSets,
  headLen: 5,
  inheritCount: 1,  // 直接进入下一轮个体数量
  mutatRate: 0.3,  // 突变率
  mixinRate: 0.3,   // 新个体的混入占比
  reviseRate: 0.01, // 修正率，自动调整突变率和个体混入占比
};

const dataio = new DataIO();
function demo(params) {
  return Math.sign(params) + Math.cos(params / 2) + Math.sqrt(params) + Math.random();
}

for (let i = 0; i < 100; i++) {
  dataio.add({ x: i }, demo(i));
}

const { x: xdata, y: ydata } = dataio.export();

Env.setOptions(envOpts);

const popset = {
  agent: {
    chromosomeLen: 1,
    lossFunc: Loss.absoluteAvg,
    linkFunc: Link.none,
    chromesome: {
      shape: [1, 3],
      linkFunc: Link.none,
      activation: Activation.none,
    }
  },
  total: 50,
  topn: 1
}

const start = Date.now();
const myPop = new Population(popset);
for (let i = 0; i < 2000; i++) {
  myPop.alive(xdata, ydata);
  if (i % 100 === 0) {
    const [ best ] = myPop.getTop();
    console.log(`${i}:`, myPop.agents[0].loss, best.agent.getEncodeChromosomes()[0].genes.join(','));
  }
  myPop.encodeHybridize();
}
console.log(Date.now() - start, 'ms');
