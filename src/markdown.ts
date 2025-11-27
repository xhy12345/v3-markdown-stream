export const streamContent = `# Markdown 全面功能演示

## 1. 文本格式

这是**粗体文本**，这是*斜体文本*，这是***加粗斜体***。

<a href="https://www.baidu.com/">原生html标签百度</a>

这是~~删除线文本~~，这是<u>下划线文本</u>，这是<mark>高亮文本</mark>。

这是^上标^和~下标~。

啦啦啦德玛西亚，啦啦啦<br>皇子开大

这是内联代码：\`let hello = 'world'\`。

## 2. 标题层级

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 3. 列表

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

## 4. 链接和图片

### 链接
[百度](https://www.baidu.com)
<https://www.example.com>
[带标题的链接](https://www.google.com "Google首页")
[相对路径链接](./assets/vue.svg)

### 图片
![Vue Logo](https://img0.baidu.com/it/u=736188794,4119241415&fm=253&fmt=auto&app=120&f=JPEG?w=1140&h=760 "Vue.js Logo")

## 5. 代码块

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

## 6. 表格

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

## 7. 引用块

> 这是一个基本引用块。

> 这是一个多层嵌套的引用块。
>> 这是第二层引用。
>>> 这是第三层引用。

> 引用块中可以包含
> 多行文本
> 和**格式化文本**

## 8. 水平线

---

***

___

## 9. 数学公式（KaTeX）

### 内联数学公式
E = mc^2 是爱因斯坦的质能方程。

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

## 10. 提示框

::: warning
这是一个警告块。
:::

::: tip 提示标题
这是带标题的提示。
:::

::: error 错误块
这是一个错误块。
:::

## 11. 原生HTML标签

<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <p>这是使用原生HTML创建的内容块。</p>
  <button onclick="alert('Hello from HTML!')">点击我</button>
</div>

<details>
  <summary>点击展开详情</summary>
  <p>这里是隐藏的详细内容。</p>
</details>


## 14. 定义列表

术语1
: 术语1的定义
: 术语1的另一个定义

术语2
: 术语2的定义

## 15. 自动链接和邮箱

https://www.github.com

user@example.com

## 16. 转义字符

\\# 这不是一个标题
\\* 这不是斜体文本
\\[\\] 这不是一个链接
\\\\ 这是一个反斜杠

## 17. 特殊字符和多语言支持

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

## 18. 高级代码块（带行号）
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

本示例涵盖了Markdown的所有主要功能，包括基本语法、扩展语法和特殊功能。`