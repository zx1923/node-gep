class Link {
  static none(...args) {
    return args;
  }
  static addUp(...args: number[]) {
    if (args.length <= 1) {
      return args[0];
    }
    let res = 0;
    args.forEach(el => {
      res += el;
    });
    return res;
  }
};

export default Link;