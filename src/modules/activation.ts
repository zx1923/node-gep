
class Activation {
  static sigmoid(a: number) {
    return 1 / (1 + Math.exp(-a));
  }
  static tanh(a: number) {
    return Math.tanh(a);
  }
  static relu(a: number) {
    return Math.max(0, a);
  }
  static none(a: number) {
    return a;
  }
}

export default Activation;