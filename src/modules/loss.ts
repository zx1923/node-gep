import { argmax } from '../utils/helper';
class Loss {
  // 绝对值损失
  static absolute(out: number[][], target: number[][]) {
    let loss = 0;
    out.forEach((line, lidx) => {
      line.forEach((value, tidx) => {
        loss += Math.abs(value - target[lidx][tidx]);
      });
    });
    return (isNaN(loss) || !isFinite(loss)) ? Number.MAX_SAFE_INTEGER : loss;
  }

  // 绝对值平均损失
  static absolute_mean(out: number[][], target: number[][]) {
    const totalLoss = Loss.absolute(out, target);
    return totalLoss / out.length;
  }

  // 分类距离误差
  static categorical_disc(out: number[][], target: number[][]) {
    let sum = 0;
    out.forEach((line, idx) => {
      sum += Math.abs(argmax(line) - argmax(target[idx]));
    });
    return sum / out.length;
  }
};

export default Loss;