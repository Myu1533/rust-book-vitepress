# Understanding Ownership 理解所有权

Rust 的所有权是非常独有特性，与其他语言有很大的区别。它使 Rust 在不需要垃圾回收的情况下保证内存安全，因此理解所有权的工作方式非常重要。本章，将讨论和所有权相关的几个特性：借用，切片以及内存中 Rust 如何存放数据。

Ownership is Rust’s most unique feature and has deep implications for the rest
of the language. It enables Rust to make memory safety guarantees without
needing a garbage collector, so it’s important to understand how ownership
works. In this chapter, we’ll talk about ownership as well as several related
features: borrowing, slices, and how Rust lays data out in memory.
