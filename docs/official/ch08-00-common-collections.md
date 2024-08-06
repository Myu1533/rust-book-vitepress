# Common Collections 通用集合

Rust 标准库包含了一类叫做集合的非常有用的数据结构。其他大多数数据类型提供一个特定的值，但是集合可以包含多种值。与数组和元组不同，集合数据指针存储在栈上，这就意味着数据在编译的时候不需要被明确的知道以及在程序运行中可以增长或缩小。每种集合都有不同的功能和消耗，根据情况选择不同的数据结构，是开发必备的技能。本章节，我们将讨论 Rust 的三种经常使用的集合：

Rust’s standard library includes a number of very useful data structures called
_collections_. Most other data types represent one specific value, but
collections can contain multiple values. Unlike the built-in array and tuple
types, the data these collections point to is stored on the heap, which means
the amount of data does not need to be known at compile time and can grow or
shrink as the program runs. Each kind of collection has different capabilities
and costs, and choosing an appropriate one for your current situation is a
skill you’ll develop over time. In this chapter, we’ll discuss three
collections that are used very often in Rust programs:

- A _vector_ allows you to store a variable number of values next to each other. 向量结合允许连续存贮一系列的可变数值变量。
- A _string_ is a collection of characters. We’ve mentioned the `String` type
  previously, but in this chapter we’ll talk about it in depth. 字符串是字符的集合。前面我们已经提到过字符串，但本章我们将深入讨论。
- A _hash map_ allows you to associate a value with a particular key. It’s a
  particular implementation of the more general data structure called a _map_. 哈希图允许我们将值与特定的键关联。这是图的一直特殊实现。

标准库中的其他集合请查看文档。

To learn about the other kinds of collections provided by the standard library,
see [the documentation][collections].

我们将讨论如何创建和更新向量，字符串，哈希图以及他们的特殊之处。

We’ll discuss how to create and update vectors, strings, and hash maps, as well
as what makes each special.

[collections]: ../std/collections/index.html
