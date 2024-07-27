# Using Structs to Structure Related Data 使用结构体组织相关联的数据

struct，或者 structure，是一个自定义数据类型，允许你包装和命名多个相关的值，从而形成一个有意义的组合。如果你熟悉一门面向对象语言，struct 就像对象中的数据属性。在本章中，我们会对元组和结构体进行比较和对比。

A _struct_, or _structure_, is a custom data type that lets you package
together and name multiple related values that make up a meaningful group. If
you’re familiar with an object-oriented language, a _struct_ is like an
object’s data attributes. In this chapter, we’ll compare and contrast tuples
with structs to build on what you already know and demonstrate when structs are
a better way to group data.

我们还将演示如何定义和实例化结构体，并讨论如何定义关联函数，特别是被称为 方法 的那种关联函数，以指定与结构体类型相关的行为。你可以在程序中基于结构体和枚举（enum）（在第六章介绍）创建新类型，以充分利用 Rust 的编译时类型检查。

We’ll demonstrate how to define and instantiate structs. We’ll discuss how to
define associated functions, especially the kind of associated functions called
_methods_, to specify behavior associated with a struct type. Structs and enums
(discussed in Chapter 6) are the building blocks for creating new types in your
program’s domain to take full advantage of Rust’s compile-time type checking.
