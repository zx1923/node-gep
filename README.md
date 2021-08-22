# node-gep

这是一个使用 JavaScript 作为执行语言的遗传算法框架，通过该框架，可以快速构建一个遗传算法模型。

**gepjs** 是 **表达式遗传算法** 的 JavaScript 实现，可以在 `Web` 和 `Node` 环境中运行。

在传统的遗传算法中，通常使用二进制编码作为基因， **表达式遗传算法** 与此不同，它使用 **算子** 作为基因的最小单位，基于算子对基因进行编码和解码。在此基础之上，**gepjs** 经过改良，建立了一套更健壮的复杂系统，用于解决复杂的问题。

## 安装

使用下面的命令可以在项目中添加 **gep** 模块。

```shell
npm i -S gepjs
# or
npm install gepjs --save
```

## 引入

**gepjs** 支持在 `node` 端和 `web` 端使用，引入也非常简单。

在 `node` 端使用时，使用 require 引入。

```js
const NodeGep = require('gepjs');
```

在 `web` 端使用时，如嵌入 Vue 中或在基于 webpack 打包的项目中，可以使用 import 引入。

```js
import * as Gep from 'gepjs'
```

同时，**gepjs** 也支持在 typescript 中使用，在 typescript 中引入：

```js
import * as Gep from 'gepjs'
// or
import { Gene } from 'gepjs'
```

## 使用场景

虽然基于神经网络模型的机器学习算法是目前的主流，但 **表达式遗传算法** 依然可以解决一些神经网络模型不便解决的问题，比如在无法得到一阶梯度的场景下，遗传算法的表现会更优于神经网络模型。

暂且不讨论模型之间的具体差异，**gepjs** 作为 JavaScript 版本的算法框架实现，希望可以解决以下问题：

- 表达式搜索和表达式发现；
- 复杂模型简化；
- 常量发现；
- 复杂回归问题；
- 初阶分类问题；

## 开发指南

参考下列文档，了解 **gepjs** 的模块：

- [快速上手](https://gep.smartline.cc/guide/quick-start.html);
- [名词解释](https://gep.smartline.cc/guide/explanation.html);
- [API文档（完善中）](https://gep.smartline.cc/gep/introduction.html);

## 可视化示例

回归问题：

- [线性回归](https://gep.smartline.cc/examples/linear-regression.html);
- [非线性回归](https://gep.smartline.cc/examples/nonlinear-regression.html);

分类问题：

- [Iris-鸢尾花分类](https://gep.smartline.cc/examples/iris-classification.html)