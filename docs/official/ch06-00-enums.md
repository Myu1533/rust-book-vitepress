# Enums and Pattern Matching 枚举和模式匹配

本章介绍 枚举（enumerations），也被称作 enums。枚举允许你通过列举可能的 成员（variants）来定义一个类型。首先，我们会定义并使用一个枚举来展示它是如何连同数据一起编码信息的。接下来，我们会探索一个特别有用的枚举，叫做 Option，它代表一个值要么是某个值要么什么都不是。然后会讲到在 match 表达式中用模式匹配，针对不同的枚举值编写相应要执行的代码。最后会介绍 if let，另一个简洁方便处理代码中枚举的结构。

In this chapter, we’ll look at _enumerations_, also referred to as _enums_.
Enums allow you to define a type by enumerating its possible _variants_. First
we’ll define and use an enum to show how an enum can encode meaning along with
data. Next, we’ll explore a particularly useful enum, called `Option`, which
expresses that a value can be either something or nothing. Then we’ll look at
how pattern matching in the `match` expression makes it easy to run different
code for different values of an enum. Finally, we’ll cover how the `if let`
construct is another convenient and concise idiom available to handle enums in
your code.
