# Common Programming Concepts 常见的编程概念

本章涵盖的概念在其他编程语言中也有出现，它们如何在 Rust 里执行。许多编程语言的核心都很多相似的地方。本章的概念都不是 Rust 独有的，但我们将讨论他们在 Rust 中的来龙去脉，并阐述使用这些概念的约定。

This chapter covers concepts that appear in almost every programming language
and how they work in Rust. Many programming languages have much in common at
their core. None of the concepts presented in this chapter are unique to Rust,
but we’ll discuss them in the context of Rust and explain the conventions
around using these concepts.

尤其，你想学习变量，基本类型，方法，注释和控制流。这些函数会出现在所有的 Rust 项目里，越早学习，基础越好。

Specifically, you’ll learn about variables, basic types, functions, comments,
and control flow. These foundations will be in every Rust program, and learning
them early will give you a strong core to start from.

> #### Keywords 关键字
>
> Rust 有一堆关键字，只提供给 Rust 使用，其他语言也一样。记住你不能在变量名和方法名上使用它们。大多数关键字有特殊的意义，在你的 Rust 项目里将大量使用；有些现在没有被函数化关联，未来可能被使用。可以在[附件 A][appendix_a]里查找
>
> The Rust language has a set of _keywords_ that are reserved for use by the
> language only, much as in other languages. Keep in mind that you cannot use
> these words as names of variables or functions. Most of the keywords have
> special meanings, and you’ll be using them to do various tasks in your Rust
> programs; a few have no current functionality associated with them but have
> been reserved for functionality that might be added to Rust in the future. You
> can find a list of the keywords in [Appendix A][appendix_a]<!-- ignore -->.

[appendix_a]: appendix-01-keywords.md
