# Managing Growing Projects with Packages, Crates, and Modules 用包，Crates 和模块管理增长中的项目

当你编写大型程序时，组织你的代码显得尤为重要。通过对相关功能进行分组和划分不同功能的代码，你可以清楚在哪里可以找到实现了特定功能的代码，以及在哪里可以改变一个功能的工作方式。

As you write large programs, organizing your code will become increasingly
important. By grouping related functionality and separating code with distinct
features, you’ll clarify where to find code that implements a particular
feature and where to go to change how a feature works.

到目前为止，我们编写的程序都在一个文件的一个模块中。伴随着项目的增长，你应该通过将代码分解为多个模块和多个文件来组织代码。一个包可以包含多个二进制 crate 项和一个可选的 crate 库。伴随着包的增长，你可以将包中的部分代码提取出来，做成独立的 crate，这些 crate 则作为外部依赖项。本章将会涵盖所有这些概念。对于一个由一系列相互关联的包组成的超大型项目，Cargo 提供了 “工作空间” 这一功能，我们将在第十四章的 “Cargo Workspaces” 对此进行讲解。

The programs we’ve written so far have been in one module in one file. As a
project grows, you should organize code by splitting it into multiple modules
and then multiple files. A package can contain multiple binary crates and
optionally one library crate. As a package grows, you can extract parts into
separate crates that become external dependencies. This chapter covers all
these techniques. For very large projects comprising a set of interrelated
packages that evolve together, Cargo provides _workspaces_, which we’ll cover
in the [“Cargo Workspaces”][workspaces]<!-- ignore --> section in Chapter 14.

我们也会讨论封装来实现细节，这可以使你更高级地重用代码：你实现了一个操作后，其他的代码可以通过该代码的公共接口来进行调用，而不需要知道它是如何实现的。你在编写代码时可以定义哪些部分是其他代码可以使用的公共部分，以及哪些部分是你有权更改实现细节的私有部分。这是另一种减少你在脑海中记住项目内容数量的方法。

We’ll also discuss encapsulating implementation details, which lets you reuse
code at a higher level: once you’ve implemented an operation, other code can
call your code via its public interface without having to know how the
implementation works. The way you write code defines which parts are public for
other code to use and which parts are private implementation details that you
reserve the right to change. This is another way to limit the amount of detail
you have to keep in your head.

这里有一个需要说明的概念 “作用域（scope）”：代码所在的嵌套上下文有一组定义为 “in scope” 的名称。当阅读、编写和编译代码时，程序员和编译器需要知道特定位置的特定名称是否引用了变量、函数、结构体、枚举、模块、常量或者其他有意义的项。你可以创建作用域，以及改变哪些名称在作用域内还是作用域外。同一个作用域内不能拥有两个相同名称的项；可以使用一些工具来解决名称冲突。

A related concept is scope: the nested context in which code is written has a
set of names that are defined as “in scope.” When reading, writing, and
compiling code, programmers and compilers need to know whether a particular
name at a particular spot refers to a variable, function, struct, enum, module,
constant, or other item and what that item means. You can create scopes and
change which names are in or out of scope. You can’t have two items with the
same name in the same scope; tools are available to resolve name conflicts.

Rust 有许多功能可以让你管理代码的组织，包括哪些内容可以被公开，哪些内容作为私有部分，以及程序每个作用域中的名字。这些功能，有时被统称为 “模块系统（the module system）”，包括：

Rust has a number of features that allow you to manage your code’s
organization, including which details are exposed, which details are private,
and what names are in each scope in your programs. These features, sometimes
collectively referred to as the _module system_, include:

- **Packages:** A Cargo feature that lets you build, test, and share crates 包（Packages）：Cargo 的一个功能，它允许你构建、测试和分享 crate
- **Crates:** A tree of modules that produces a library or executable Crates ：一个模块的树形结构，它形成了库或二进制项目。
- **Modules** and **use:** Let you control the organization, scope, and
  privacy of paths 模块（Modules）和 use：允许你控制作用域和路径的私有性
- **Paths:** A way of naming an item, such as a struct, function, or module 路径（path）：一个命名例如结构体、函数或模块等项的方式。

本章将会涵盖所有这些概念，讨论它们如何交互，并说明如何使用它们来管理作用域。到最后，你会对模块系统有深入的了解，并且能够像专业人士一样使用作用域！

In this chapter, we’ll cover all these features, discuss how they interact, and
explain how to use them to manage scope. By the end, you should have a solid
understanding of the module system and be able to work with scopes like a pro!

[workspaces]: ch14-03-cargo-workspaces.html
