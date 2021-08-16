class Loss {
  static absolute(out: number[], target: number[][], channel: number) {
    let loss = 0;
    out.forEach((value, idx) => {
      loss += Math.abs(value - target[idx][channel]);
    });
    return (isNaN(loss) || !isFinite(loss)) ? Number.MAX_SAFE_INTEGER : loss;
  }

  static absoluteAvg(out: number[], target: number[][], channel: number) {
    const sum = Loss.absolute(out, target, channel);
    return sum / out.length;
  }
};

export default Loss;