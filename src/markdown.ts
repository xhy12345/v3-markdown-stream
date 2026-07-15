export const streamContent =  `
# Markdown 全面功能演示

## 报告文档链接

以下为报告文档下载卡片示例（链接包含 \`type=result\` 参数时自动渲染为卡片）：

[AI客服平台 — 需求文档](https://example.com/report/requirement.pdf?type=result&format=pdf)

[2026年度技术报告](https://example.com/report/tech-2026.docx?type=result&format=docx)

[数据分析结果汇总](https://example.com/report/data-analysis.xlsx?type=result&format=xlsx)

## 自定义组件（图表）

### 柱状图

以下是柱状图表，使用代码块语法展示：

\`\`\`echarts
{
  "title": { "text": "月度销售额" },
  "tooltip": { "trigger": "axis" },
  "legend": { "data": ["销量"] },
  "xAxis": { "type": "category", "data": ["一月", "二月", "三月", "四月", "五月"] },
  "yAxis": { "type": "value" },
  "series": [{ "name": "销量", "type": "bar", "data": [10, 20, 30, 40, 50] }]
}
\`\`\`

### 折线图

以下是折线图表，使用代码块语法展示：

\`\`\`echarts
{
  "title": { "text": "未来一周气温变化" },
  "tooltip": { "trigger": "axis" },
  "legend": {},
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  "yAxis": {
    "type": "value",
    "axisLabel": { "formatter": "{value} °C" }
  },
  "series": [
    {
      "name": "Highest",
      "type": "line",
      "data": [10, 11, 13, 11, 12, 12, 9],
      "markPoint": { "data": [{ "type": "max", "name": "Max" }, { "type": "min", "name": "Min" }] },
      "markLine": { "data": [{ "type": "average", "name": "Avg" }] }
    },
    {
      "name": "Lowest",
      "type": "line",
      "data": [1, -2, 2, 5, 3, 2, 0],
      "markPoint": { "data": [{ "name": "周最低", "value": -2, "xAxis": 1, "yAxis": -1.5 }] },
      "markLine": { "data": [{ "type": "average", "name": "Avg" }, [{ "symbol": "none", "x": "90%", "yAxis": "max" }, { "symbol": "circle", "label": { "position": "start", "formatter": "Max" }, "type": "max", "name": "最高点" }]] }
    }
  ]
}
\`\`\`

### 饼图

以下是饼图表，使用代码块语法展示：

\`\`\`echarts
{
  "title": { "text": "浏览器市场份额", "left": "center" },
  "tooltip": { "trigger": "item", "formatter": "{a} <br/>{b}: {c} ({d}%)" },
  "legend": { "bottom": "0%" },
  "series": [
    {
      "name": "访问来源",
      "type": "pie",
      "radius": "50%",
      "data": [
        { "value": 1048, "name": "Chrome" },
        { "value": 735, "name": "Firefox" },
        { "value": 580, "name": "Safari" },
        { "value": 484, "name": "Edge" }
      ]
    }
  ]
}
\`\`\`

### 流程图（Mermaid）

以下是Mermaid流程图，使用代码块语法展示：

\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
\`\`\`

### 时序图（Mermaid）

\`\`\`mermaid
sequenceDiagram
    participant 用户
    participant 服务器
    participant 数据库
    用户->>服务器: 发送请求
    服务器->>数据库: 查询数据
    数据库-->>服务器: 返回结果
    服务器-->>用户: 响应数据
\`\`\`


## 文本格式

这是**粗体文本**，这是*斜体文本*，这是***加粗斜体***。

<a href="https://www.baidu.com/">原生html标签百度</a>

这是~~删除线文本~~，这是<u>下划线文本</u>，这是<mark>高亮文本</mark>。

这是^上标^和~下标~。

啦啦啦德玛西亚，啦啦啦<br>皇子开大 <ref>[3]</ref>

这是内联代码：\`let hello = 'world'\`。

## 标题层级

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 列表

### 无序列表
- 项目一
- 项目二
  - 子项目A
  - 子项目B
    - 孙项目1
    - 孙项目2
- 项目三

### 有序列表
1. 第一步
2. 第二步
   1. 子步骤A
   2. 子步骤B
3. 第三步

### 任务列表
- [x] 已完成任务
- [ ] 未完成任务
- [x] 另一个已完成任务
- [ ] 另一个未完成任务

## 链接和图片

### 链接
[百度](https://www.baidu.com)
<https://www.example.com>
[带标题的链接](https://www.google.com "Google首页")
[相对路径链接](./assets/vue.svg)

### 图片
![Vue Logo](https://img0.baidu.com/it/u=736188794,4119241415&fm=253&fmt=auto&app=120&f=JPEG?w=340&h=260 "Vue.js Logo")

## 代码块

### 普通代码块
\`\`\`
function hello() {
  console.log('Hello, Markdown!');
}
\`\`\`

### JavaScript代码（带语法高亮）
\`\`\`javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return 'Hello, my name is ' + this.name;
  }
}
\`\`\`

### Python代码（带语法高亮）
\`\`\`python
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci(10) = " + str(fibonacci(10)))
\`\`\`

### HTML代码（带语法高亮）
\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>示例页面</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
\`\`\`

## 表格

### 基本表格
| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25   | 工程师 |
| 李四 | 30   | 设计师 |
| 王五 | 28   | 产品经理 |

### 带对齐的表格
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容1  |  内容2   |  内容3 |
| 很长很长的内容 |  居中内容  |  12345 |

## 引用块

> 这是一个基本引用块。

> 这是一个多层嵌套的引用块。
>> 这是第二层引用。
>>> 这是第三层引用。

> 引用块中可以包含
> 多行文本
> 和**格式化文本**

## 水平线

---

***

___

## 数学公式（KaTeX）

### 内联数学公式
$E = mc^2$ 是爱因斯坦的质能方程。

### 块级数学公式
$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

$$
\\int_{a}^{b} f(x) dx
$$

## 提示框

::: warning
这是一个警告块。
:::

::: tip 提示标题
这是带标题的提示。
:::

::: error 错误块
这是一个错误块。
:::

## 原生HTML标签

<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <p>这是使用原生HTML创建的内容块。</p>
  <button>点击我</button>
</div>

<details>
  <summary>点击展开详情</summary>
  <p>这里是隐藏的详细内容。</p>
</details>


## 定义列表

术语1
: 术语1的定义
: 术语1的另一个定义

术语2
: 术语2的定义

## 自动链接和邮箱

https://www.github.com

user@example.com

## 转义字符

\\# 这不是一个标题
\\* 这不是斜体文本
\\[\\] 这不是一个链接
\\\\ 这是一个反斜杠

## 特殊字符和多语言支持

### 特殊符号
© ® ™ ± ÷ × ∑ ∫ √ ∞ ≈ ≠ ≤ ≥

### 多语言文本
English: Hello world!
中文: 你好，世界！
日本語: こんにちは、世界！
Español: ¡Hola Mundo!
Français: Bonjour Monde!
Русский: Привет, мир!
العربية: مرحبا بالعالم!

## 高级代码块（带行号）
\`\`\`javascript
1| // 这是第1行注释
2| function calculateSum(a, b) {
3|   return a + b;
4| }
5| 
6| const result = calculateSum(5, 3);
7| console.log(result); // 输出: 8
\`\`\`

## 总结

本示例涵盖了Markdown的所有主要功能，包括基本语法、扩展语法和特殊功能。

`