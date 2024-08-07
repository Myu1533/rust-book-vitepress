## Unrecoverable Errors with `panic!` 用 panic! 处理不可恢复的错误

突然有一天，代码出问题了，而你对此束手无策。对于这种情况，Rust 有 panic!宏。在实践中有两种方法造成 panic：执行会造成代码 panic 的操作（比如访问超过数组结尾的内容）或者显式调用 panic! 宏。这两种情况都会使程序 panic。通常情况下这些 panic 会打印出一个错误信息，展开并清理栈数据，然后退出。通过一个环境变量，你也可以让 Rust 在 panic 发生时打印调用堆栈（call stack）以便于定位 panic 的原因。

Sometimes, bad things happen in your code, and there’s nothing you can do about
it. In these cases, Rust has the `panic!` macro. There are two ways to cause a
panic in practice: by taking an action that causes our code to panic (such as
accessing an array past the end) or by explicitly calling the `panic!` macro.
In both cases, we cause a panic in our program. By default, these panics will
print a failure message, unwind, clean up the stack, and quit. Via an
environment variable, you can also have Rust display the call stack when a
panic occurs to make it easier to track down the source of the panic.

> ### Unwinding the Stack or Aborting in Response to a Panic 对应 panic 时的栈展开或终止
>
> 当出现 panic 时，程序默认会开始 展开（unwinding），这意味着 Rust 会回溯栈并清理它遇到的每一个函数的数据，不过这个回溯并清理的过程有很多工作。另一种选择是直接 终止（abort），这会不清理数据就退出程序。
> By default, when a panic occurs, the program starts _unwinding_, which
> means Rust walks back up the stack and cleans up the data from each function
> it encounters. However, this walking back and cleanup is a lot of work. Rust,
> therefore, allows you to choose the alternative of immediately _aborting_,
> which ends the program without cleaning up.
>
> 那么程序所使用的内存需要由操作系统来清理。如果你需要项目的最终二进制文件越小越好，panic 时通过在 Cargo.toml 的 [profile] 部分增加 panic = 'abort'，可以由展开切换为终止。例如，如果你想要在 release 模式中 panic 时直接终止：
> Memory that the program was using will then need to be cleaned
> up by the operating system. If in your project you need to make the resulting
> binary as small as possible, you can switch from unwinding to aborting upon a
> panic by adding `panic = 'abort'` to the appropriate `[profile]` sections in
> your _Cargo.toml_ file. For example, if you want to abort on panic in release
> mode, add this:
>
> ```toml
> [profile.release]
> panic = 'abort'
> ```

让我们在一个简单的程序中调用 panic!：

Let’s try calling `panic!` in a simple program:

<span class="filename">Filename: src/main.rs</span>

```rust,should_panic,panics
fn main() {
    panic!("crash and burn");
}
```

运行程序将会出现类似这样的输出：

When you run the program, you’ll see something like this:

```console
$ cargo run
   Compiling panic v0.1.0 (file:///projects/panic)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.25s
     Running `target/debug/panic`
thread 'main' panicked at src/main.rs:2:5:
crash and burn
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

最后两行包含 panic! 调用造成的错误信息。第一行显示了 panic 提供的信息并指明了源码中 panic 出现的位置：src/main.rs:2:5 表明这是 src/main.rs 文件的第二行第五个字符。

The call to `panic!` causes the error message contained in the last two lines.
The first line shows our panic message and the place in our source code where
the panic occurred: _src/main.rs:2:5_ indicates that it’s the second line,
fifth character of our _src/main.rs_ file.

在这个例子中，被指明的那一行是我们代码的一部分，而且查看这一行的话就会发现 panic! 宏的调用。在其他情况下，panic! 可能会出现在我们的代码所调用的代码中。错误信息报告的文件名和行号可能指向别人代码中的 panic! 宏调用，而不是我们代码中最终导致 panic! 的那一行。我们可以使用 panic! 被调用的函数的 backtrace 来寻找代码中出问题的地方。下面我们会详细介绍 backtrace 是什么。

In this case, the line indicated is part of our code, and if we go to that
line, we see the `panic!` macro call. In other cases, the `panic!` call might
be in code that our code calls, and the filename and line number reported by
the error message will be someone else’s code where the `panic!` macro is
called, not the line of our code that eventually led to the `panic!` call. We
can use the backtrace of the functions the `panic!` call came from to figure
out the part of our code that is causing the problem. We’ll discuss backtraces
in more detail next.

### Using a `panic!` Backtrace 使用 panic! 的 backtrace

让我们来看看另一个因为我们代码中的 bug 引起的别的库中 panic! 的例子，而不是直接的宏调用。示例 9-1 有一些尝试通过索引访问 vector 中元素的例子：

Let’s look at another example to see what it’s like when a `panic!` call comes
from a library because of a bug in our code instead of from our code calling
the macro directly. Listing 9-1 has some code that attempts to access an
index in a vector beyond the range of valid indexes.

<span class="filename">Filename: src/main.rs</span>

```rust,should_panic,panics
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```

<span class="caption">
示例 9-1：尝试访问超越 vector 结尾的元素，这会造成 panic!
Listing 9-1: Attempting to access an element beyond the
end of a vector, which will cause a call to `panic!`</span>

这里尝试访问 vector 的第一百个元素（这里的索引是 99 因为索引从 0 开始），不过它只有三个元素。这种情况下 Rust 会 panic。[] 应当返回一个元素，不过如果传递了一个无效索引，就没有可供 Rust 返回的正确的元素。

Here, we’re attempting to access the 100th element of our vector (which is at
index 99 because indexing starts at zero), but the vector has only 3 elements.
In this situation, Rust will panic. Using `[]` is supposed to return an
element, but if you pass an invalid index, there’s no element that Rust could
return here that would be correct.

C 语言中，尝试读取数据结构之后的值是未定义行为（undefined behavior）。你会得到任何对应数据结构中这个元素的内存位置的值，甚至是这些内存并不属于这个数据结构的情况。这被称为 缓冲区溢出（buffer overread），并可能会导致安全漏洞，比如攻击者可以像这样操作索引来读取储存在数据结构之后不被允许的数据。

In C, attempting to read beyond the end of a data structure is undefined
behavior. You might get whatever is at the location in memory that would
correspond to that element in the data structure, even though the memory
doesn’t belong to that structure. This is called a _buffer overread_ and can
lead to security vulnerabilities if an attacker is able to manipulate the index
in such a way as to read data they shouldn’t be allowed to that is stored after
the data structure.

为了保护程序远离这类漏洞，如果尝试读取一个索引不存在的元素，Rust 会停止执行并拒绝继续。尝试运行上面的程序会出现如下：

To protect your program from this sort of vulnerability, if you try to read an
element at an index that doesn’t exist, Rust will stop execution and refuse to
continue. Let’s try it and see:

```console
$ cargo run
   Compiling panic v0.1.0 (file:///projects/panic)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.27s
     Running `target/debug/panic`
thread 'main' panicked at src/main.rs:4:6:
index out of bounds: the len is 3 but the index is 99
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

错误指向 main.rs 的第 4 行，这里我们尝试访问索引 99。下面的说明（note）行提醒我们可以设置 RUST_BACKTRACE 环境变量来得到一个 backtrace。backtrace 是一个执行到目前位置所有被调用的函数的列表。Rust 的 backtrace 跟其他语言中的一样：阅读 backtrace 的关键是从头开始读直到发现你编写的文件。这就是问题的发源地。这一行往上是你的代码所调用的代码；往下则是调用你的代码的代码。这些行可能包含核心 Rust 代码，标准库代码或用到的 crate 代码。让我们将 RUST_BACKTRACE 环境变量设置为任何不是 0 的值来获取 backtrace 看看。示例 9-2 展示了与你看到类似的输出：

This error points at line 4 of our `main.rs` where we attempt to access index 99. The next note line tells us that we can set the `RUST_BACKTRACE`
environment variable to get a backtrace of exactly what happened to cause the
error. A _backtrace_ is a list of all the functions that have been called to
get to this point. Backtraces in Rust work as they do in other languages: the
key to reading the backtrace is to start from the top and read until you see
files you wrote. That’s the spot where the problem originated. The lines above
that spot are code that your code has called; the lines below are code that
called your code. These before-and-after lines might include core Rust code,
standard library code, or crates that you’re using. Let’s try getting a
backtrace by setting the `RUST_BACKTRACE` environment variable to any value
except 0. Listing 9-2 shows output similar to what you’ll see.

<!-- manual-regeneration
cd listings/ch09-error-handling/listing-09-01
RUST_BACKTRACE=1 cargo run
copy the backtrace output below
check the backtrace number mentioned in the text below the listing
-->

```console
$ RUST_BACKTRACE=1 cargo run
thread 'main' panicked at src/main.rs:4:6:
index out of bounds: the len is 3 but the index is 99
stack backtrace:
   0: rust_begin_unwind
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/std/src/panicking.rs:645:5
   1: core::panicking::panic_fmt
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/panicking.rs:72:14
   2: core::panicking::panic_bounds_check
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/panicking.rs:208:5
   3: <usize as core::slice::index::SliceIndex<[T]>>::index
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/slice/index.rs:255:10
   4: core::slice::index::<impl core::ops::index::Index<I> for [T]>::index
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/slice/index.rs:18:9
   5: <alloc::vec::Vec<T,A> as core::ops::index::Index<I>>::index
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/alloc/src/vec/mod.rs:2770:9
   6: panic::main
             at ./src/main.rs:4:6
   7: core::ops::function::FnOnce::call_once
             at /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/ops/function.rs:250:5
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```

<span class="caption">
示例 9-2：当设置 RUST_BACKTRACE 环境变量时 panic! 调用所生成的 backtrace 信息
Listing 9-2: The backtrace generated by a call to
`panic!` displayed when the environment variable `RUST_BACKTRACE` is set</span>

这里有大量的输出！你实际看到的输出可能因不同的操作系统和 Rust 版本而有所不同。为了获取带有这些信息的 backtrace，必须启用 debug 标识。当不使用 --release 参数运行 cargo build 或 cargo run 时 debug 标识会默认启用，就像这里一样。

That’s a lot of output! The exact output you see might be different depending
on your operating system and Rust version. In order to get backtraces with this
information, debug symbols must be enabled. Debug symbols are enabled by
default when using `cargo build` or `cargo run` without the `--release` flag,
as we have here.

示例 9-2 的输出中，backtrace 的 6 行指向了我们项目中造成问题的行：src/main.rs 的第 4 行。如果你不希望程序 panic，第一个提到我们编写的代码行的位置是你应该开始调查的，以便查明是什么值如何在这个地方引起了 panic。在示例 9-1 中，我们故意编写会 panic 的代码来演示如何使用 backtrace，修复这个 panic 的方法就是不要尝试在一个只包含三个项的 vector 中请求索引是 100 的元素。当将来你的代码出现了 panic，你需要搞清楚在这特定的场景下代码中执行了什么操作和什么值导致了 panic，以及应当如何处理才能避免这个问题。

In the output in Listing 9-2, line 6 of the backtrace points to the line in our
project that’s causing the problem: line 4 of _src/main.rs_. If we don’t want
our program to panic, we should start our investigation at the location pointed
to by the first line mentioning a file we wrote. In Listing 9-1, where we
deliberately wrote code that would panic, the way to fix the panic is to not
request an element beyond the range of the vector indexes. When your code
panics in the future, you’ll need to figure out what action the code is taking
with what values to cause the panic and what the code should do instead.

本章后面的小节 “要不要 panic!” 会再次回到 panic! 并讲解何时应该、何时不应该使用 panic! 来处理错误情况。接下来，我们来看看如何使用 Result 来从错误中恢复。

We’ll come back to `panic!` and when we should and should not use `panic!` to
handle error conditions in the [“To `panic!` or Not to
`panic!`”][to-panic-or-not-to-panic]<!-- ignore --> section later in this
chapter. Next, we’ll look at how to recover from an error using `Result`.

[to-panic-or-not-to-panic]: ch09-03-to-panic-or-not-to-panic.html#to-panic-or-not-to-panic
