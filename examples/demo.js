const { Operator, DataIO, Env, Loss, Link, Activation, Population } = require('../dist/lib/gep.min.js');

const operators = new Operator();
operators.setVars('x');
const operSets = operators.toArray();

const envOpts = {
  headLen: 4,
  mutateRate: 0.3,
  mixinRate: 0.3,
  reviseRate: 0.00001,
};

const dataio = new DataIO();
function demo(params) {
  return Math.cos(params / 2) + Math.sqrt(params / 3) - Math.sin(params) + Math.random();
  // return 3.14 * params * params + params / 2;
}

for (let i = 0; i < 50; i += 0.5) {
  dataio.add({ x: i }, demo(i));
}

const { x: xdata, y: ydata } = dataio.export();

Env.setOptions(envOpts, operSets);

const popset = {
  agent: {
    chromosomeLen: 1,
    lossFunc: Loss.absolute_mean,
    chromesome: {
      shape: [1, 4],
      linkFunc: Link.none,
      activation: Activation.none,
    }
  },
  total: 100,
  topn: 1
}

const start = Date.now();
const myPop = new Population(popset);
for (let i = 0; i < 5000; i++) {
  myPop.alive(xdata, ydata);
  if (i % 100 === 0) {
    const [ best ] = myPop.getTop();
    console.log(`${i}:`, Env.get('mutateRate'), best.loss, best.agent.getEncodeChromosomes()[0].genes.join(' <-> '));
  }
  myPop.crossover();
}
console.log(Date.now() - start, 'ms');
