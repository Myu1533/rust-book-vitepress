# Error Handling 错误处理

错误是软件中不可否认的事实，所以 Rust 有一些处理出错情况的特性。在许多情况下，Rust 要求你承认错误的可能性，并在你的代码编译前采取一些行动。这一要求使你的程序更加健壮，因为它可以确保你在将代码部署到生产环境之前就能发现错误并进行适当的处理。

Errors are a fact of life in software, so Rust has a number of features for
handling situations in which something goes wrong. In many cases, Rust requires
you to acknowledge the possibility of an error and take some action before your
code will compile. This requirement makes your program more robust by ensuring
that you’ll discover errors and handle them appropriately before you’ve
deployed your code to production!

Rust 将错误分为两大类：可恢复的（recoverable）和 不可恢复的（unrecoverable）错误。对于一个可恢复的错误，比如文件未找到的错误，我们很可能只想向用户报告问题并重试操作。不可恢复的错误总是 bug 出现的征兆，比如试图访问一个超过数组末端的位置，因此我们要立即停止程序。

Rust groups errors into two major categories: _recoverable_ and _unrecoverable_
errors. For a recoverable error, such as a _file not found_ error, we most
likely just want to report the problem to the user and retry the operation.
Unrecoverable errors are always symptoms of bugs, like trying to access a
location beyond the end of an array, and so we want to immediately stop the
program.

大多数语言并不区分这两种错误，并采用类似异常这样方式统一处理它们。Rust 没有异常。相反，它有 Result<T, E> 类型，用于处理可恢复的错误，还有 panic! 宏，在程序遇到不可恢复的错误时停止执行。本章首先介绍 panic! 调用，接着会讲到如何返回 Result<T, E>。此外，我们将探讨在决定是尝试从错误中恢复还是停止执行时的注意事项。

Most languages don’t distinguish between these two kinds of errors and handle
both in the same way, using mechanisms such as exceptions. Rust doesn’t have
exceptions. Instead, it has the type `Result<T, E>` for recoverable errors and
the `panic!` macro that stops execution when the program encounters an
unrecoverable error. This chapter covers calling `panic!` first and then talks
about returning `Result<T, E>` values. Additionally, we’ll explore
considerations when deciding whether to try to recover from an error or to stop
execution.
