class Loss {
  static absolute(out: number | number[], target: number | number[]) {
    if (!Array.isArray(out) && !Array.isArray(target)) {
      return Math.abs(out - target);
    }
    if (Array.isArray(out) && Array.isArray(target) && out.length <= target.length) {
      let loss = 0;
      out.forEach((value, idx) => {
        loss += Math.abs(value - target[idx]);
      });
      return (isNaN(loss) || !isFinite(loss)) ? Number.MAX_SAFE_INTEGER : loss;
    }
    throw new Error(`Params 'out' or 'target' is invalid`);
  }
};

export default Loss;