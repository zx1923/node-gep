
function _is(obj: any, type: string): boolean {
  return getTypeOf(obj) === type;
}

/**
 * 获取数据类型
 * 
 * @param obj 
 * @returns string 
 */
function getTypeOf(obj: any): string {
  let type = Object.prototype.toString.call(obj);
  return type.replace(/\[object\s|\]/g, '');
}

/**
 * 是否为对象
 * 
 * @param obj 被检测值
 * @returns true/false
 */
function isObject(obj: any): boolean {
  return _is(obj, 'Object');
}

/**
 * 是否为a array
 * 
 * @param obj 被检测值
 * @returns true/false
 */
function isArray(obj: any): boolean {
  return Array.isArray(obj);
}

/**
 * 是否为 function
 * 
 * @param obj 被检测值
 * @returns true/false
 */
function isFunction(obj: any): boolean {
  return _is(obj, 'Function');
}

/**
 * 是否为异步 function
 * 
 * @param obj 被检测值
 * @returns true/false
 */
function isAsyncFunction(obj: any) {
  return _is(obj, 'AsyncFunction');
}

/**
 * 是否为正则
 * 
 * @param obj 被检测对象
 * @returns 
 */
function isRegExp(obj: any): boolean {
  return _is(obj, 'RegExp');
}

/**
 * 是否为字符串
 * 
 * @param obj 被检测对象
 */
function isString(obj: any): boolean {
  return _is(obj, 'String');
}

/**
 * 是否为数字
 * 
 * @param obj 被检测对象
 */
function isNumber(obj: any): boolean {
  return _is(obj, 'Number');
}

/**
 * 从给定数组中随机获取指定个元素
 * 
 * @param arr 数组
 * @param count 获取的元素个数
 */
function getRandomFromArray(arr: Array<any>, count = 1) {
  const len = arr.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * len);
    result.push(arr[idx]);
  }
  return result;
}

/**
 * 在给定长度内获取一个随机片段
 * @param len 长度
 * @param countArray 数量的维度数组
 * @returns 
 */
function getRandomRange(len: number, countArray: number[]) {
  const res = [];
  countArray.forEach(el => {
    const ranges = [];
    for (let i = 0; i < el; i++) {
      const r1 = Math.floor(Math.random() * len);
      const r2 = Math.floor(Math.random() * len);
      ranges.push([r1, r2].sort((a, b) => a - b));
    }
    res.push(ranges);
  });
  return res;
}

/**
 * 从给定位置开始替换数据的值
 * @param arr 原数组
 * @param start 开始位置
 * @param part 替换值
 * @returns 
 */
function replaceArrayPart(arr: any[], start: number, part: any[]) {
  const res = [...arr];
  res.forEach((el, idx) => {
    if (idx >= start && idx < start + part.length) {
      res[idx] = part[idx - start];
    }
  });
  return res;
}

/**
 * 数组求和
 * @param args 被求和值
 * @returns 
 */
function sum(args: number[]) {
  let val = 0;
  args.forEach(el => val += el);
  return val;
} 

export {
  getTypeOf,
  isObject,
  isArray,
  isFunction,
  isAsyncFunction,
  isRegExp,
  isString,
  isNumber,
  getRandomFromArray,
  getRandomRange,
  replaceArrayPart,
  sum,
};