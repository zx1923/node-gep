const { Operator, DataIO, Env, Loss, Link, Activation, Population } = require('../dist/lib/gep.min.js');

const operators = new Operator();
operators.setVars('x');
const operSets = operators.toArray();

const envOpts = {
  headLen: 5,
  mutateRate: 0.3,
  mixinRate: 0.3,
  reviseRate: 0.00001,
};

const dataio = new DataIO();
function demo(params) {
  return Math.cos(params / 2) + Math.sqrt(params / 3) - Math.sin(params) + Math.random();
}

for (let i = 0; i < 100; i += 0.5) {
  dataio.add({ x: i }, [demo(i), demo(i)]);
}

const { x: xdata, y: ydata } = dataio.export();

Env.setOptions(envOpts, operSets);

const popset = {
  agent: {
    chromosomeLen: 2,
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
for (let i = 0; i < 4000; i++) {
  myPop.alive(xdata, ydata);
  if (i % 100 === 0) {
    const [ best ] = myPop.getTop();
    console.log(`${i}:`, Env.get('mutateRate'), best.loss, best.agent.getEncodeChromosomes()[0].genes.join(','));
  }
  myPop.crossover();
}
console.log(Date.now() - start, 'ms');
