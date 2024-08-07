## Recoverable Errors with `Result` 用 Result 处理可恢复的错误

大部分错误并没有严重到需要程序完全停止执行。有时候，一个函数失败，仅仅就是因为一个容易理解和响应的原因。例如，如果因为打开一个并不存在的文件而失败，此时我们可能想要创建这个文件，而不是终止进程。

Most errors aren’t serious enough to require the program to stop entirely.
Sometimes, when a function fails, it’s for a reason that you can easily
interpret and respond to. For example, if you try to open a file and that
operation fails because the file doesn’t exist, you might want to create the
file instead of terminating the process.

回忆一下第二章 “使用 Result 类型来处理潜在的错误” 部分中的那个 Result 枚举，它定义有如下两个成员，Ok 和 Err：

Recall from [“Handling Potential Failure with `Result`”][handle_failure]<!--
ignore --> in Chapter 2 that the `Result` enum is defined as having two
variants, `Ok` and `Err`, as follows:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

T 和 E 是泛型类型参数；第十章会详细介绍泛型。现在你需要知道的就是 T 代表成功时返回的 Ok 成员中的数据的类型，而 E 代表失败时返回的 Err 成员中的错误的类型。因为 Result 有这些泛型类型参数，我们可以将 Result 类型和标准库中为其定义的函数用于很多不同的场景，这些情况中需要返回的成功值和失败值可能会各不相同。

The `T` and `E` are generic type parameters: we’ll discuss generics in more
detail in Chapter 10. What you need to know right now is that `T` represents
the type of the value that will be returned in a success case within the `Ok`
variant, and `E` represents the type of the error that will be returned in a
failure case within the `Err` variant. Because `Result` has these generic type
parameters, we can use the `Result` type and the functions defined on it in
many different situations where the successful value and error value we want to
return may differ.

让我们调用一个返回 Result 的函数，因为它可能会失败：如示例 9-3 所示打开一个文件：

Let’s call a function that returns a `Result` value because the function could
fail. In Listing 9-3 we try to open a file.

<span class="filename">Filename: src/main.rs</span>

```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");
}
```

<span class="caption">
示例 9-3：打开文件
Listing 9-3: Opening a file</span>

File::open 的返回值是 Result<T, E>。泛型参数 T 会被 File::open 的实现放入成功返回值的类型 std::fs::File，这是一个文件句柄。错误返回值使用的 E 的类型是 std::io::Error。这些返回类型意味着 File::open 调用可能成功并返回一个可以读写的文件句柄。这个函数调用也可能会失败：例如，也许文件不存在，或者可能没有权限访问这个文件。File::open 函数需要一个方法在告诉我们成功与否的同时返回文件句柄或者错误信息。这些信息正好是 Result 枚举所代表的。

The return type of `File::open` is a `Result<T, E>`. The generic parameter `T`
has been filled in by the implementation of `File::open` with the type of the
success value, `std::fs::File`, which is a file handle. The type of `E` used in
the error value is `std::io::Error`. This return type means the call to
`File::open` might succeed and return a file handle that we can read from or
write to. The function call also might fail: for example, the file might not
exist, or we might not have permission to access the file. The `File::open`
function needs to have a way to tell us whether it succeeded or failed and at
the same time give us either the file handle or error information. This
information is exactly what the `Result` enum conveys.

当 File::open 成功时，greeting_file_result 变量将会是一个包含文件句柄的 Ok 实例。当失败时，greeting_file_result 变量将会是一个包含了更多关于发生了何种错误的信息的 Err 实例。

In the case where `File::open` succeeds, the value in the variable
`greeting_file_result` will be an instance of `Ok` that contains a file handle.
In the case where it fails, the value in `greeting_file_result` will be an
instance of `Err` that contains more information about the kind of error that
happened.

我们需要在示例 9-3 的代码中增加根据 File::open 返回值进行不同处理的逻辑。示例 9-4 展示了一个使用基本工具处理 Result 的例子：第六章学习过的 match 表达式。

We need to add to the code in Listing 9-3 to take different actions depending
on the value `File::open` returns. Listing 9-4 shows one way to handle the
`Result` using a basic tool, the `match` expression that we discussed in
Chapter 6.

<span class="filename">Filename: src/main.rs</span>

```rust,should_panic
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {error:?}"),
    };
}
```

<span class="caption">
示例 9-4：使用 match 表达式处理可能会返回的 Result 成员
Listing 9-4: Using a `match` expression to handle the
`Result` variants that might be returned</span>

注意与 Option 枚举一样，Result 枚举和其成员也被导入到了 prelude 中，所以就不需要在 match 分支中的 Ok 和 Err 之前指定 Result::。

Note that, like the `Option` enum, the `Result` enum and its variants have been
brought into scope by the prelude, so we don’t need to specify `Result::`
before the `Ok` and `Err` variants in the `match` arms.

这里我们告诉 Rust 当结果是 Ok 时，返回 Ok 成员中的 file 值，然后将这个文件句柄赋值给变量 greeting_file。match 之后，我们可以利用这个文件句柄来进行读写。

When the result is `Ok`, this code will return the inner `file` value out of
the `Ok` variant, and we then assign that file handle value to the variable
`greeting_file`. After the `match`, we can use the file handle for reading or
writing.

match 的另一个分支处理从 File::open 得到 Err 值的情况。在这种情况下，我们选择调用 panic! 宏。如果当前目录没有一个叫做 hello.txt 的文件，当运行这段代码时会看到如下来自 panic! 宏的输出：

The other arm of the `match` handles the case where we get an `Err` value from
`File::open`. In this example, we’ve chosen to call the `panic!` macro. If
there’s no file named _hello.txt_ in our current directory and we run this
code, we’ll see the following output from the `panic!` macro:

```console
$ cargo run
   Compiling error-handling v0.1.0 (file:///projects/error-handling)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.73s
     Running `target/debug/error-handling`
thread 'main' panicked at src/main.rs:8:23:
Problem opening the file: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

一如既往，此输出准确地告诉了我们到底出了什么错。

As usual, this output tells us exactly what has gone wrong.

### Matching on Different Errors 匹配不同的错误

示例 9-4 中的代码不管 File::open 是因为什么原因失败都会 panic!。我们真正希望的是对不同的错误原因采取不同的行为：如果 File::open 因为文件不存在而失败，我们希望创建这个文件并返回新文件的句柄。如果 File::open 因为任何其他原因失败，例如没有打开文件的权限，我们仍然希望像示例 9-4 那样 panic!。让我们看看示例 9-5，其中 match 增加了另一个分支：

The code in Listing 9-4 will `panic!` no matter why `File::open` failed.
However, we want to take different actions for different failure reasons: if
`File::open` failed because the file doesn’t exist, we want to create the file
and return the handle to the new file. If `File::open` failed for any other
reason—for example, because we didn’t have permission to open the file—we still
want the code to `panic!` in the same way as it did in Listing 9-4. For this we
add an inner `match` expression, shown in Listing 9-5.

<span class="filename">Filename: src/main.rs</span>

<!-- ignore this test because otherwise it creates hello.txt which causes other
tests to fail lol -->

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {e:?}"),
            },
            other_error => {
                panic!("Problem opening the file: {other_error:?}");
            }
        },
    };
}
```

<span class="caption">
示例 9-5：使用不同的方式处理不同类型的错误
Listing 9-5: Handling different kinds of errors in
different ways</span>

File::open 返回的 Err 成员中的值类型 io::Error，它是一个标准库中提供的结构体。这个结构体有一个返回 io::ErrorKind 值的 kind 方法可供调用。io::ErrorKind 是一个标准库提供的枚举，它的成员对应 io 操作可能导致的不同错误类型。我们感兴趣的成员是 ErrorKind::NotFound，它代表尝试打开的文件并不存在。这样，match 就匹配完 greeting_file_result 了，不过对于 error.kind() 还有一个内层 match。

The type of the value that `File::open` returns inside the `Err` variant is
`io::Error`, which is a struct provided by the standard library. This struct
has a method `kind` that we can call to get an `io::ErrorKind` value. The enum
`io::ErrorKind` is provided by the standard library and has variants
representing the different kinds of errors that might result from an `io`
operation. The variant we want to use is `ErrorKind::NotFound`, which indicates
the file we’re trying to open doesn’t exist yet. So we match on
`greeting_file_result`, but we also have an inner match on `error.kind()`.

我们希望在内层 match 中检查的条件是 error.kind() 的返回值是否为 ErrorKind 的 NotFound 成员。如果是，则尝试通过 File::create 创建文件。然而因为 File::create 也可能会失败，还需要增加一个内层 match 语句。当文件不能被创建，会打印出一个不同的错误信息。外层 match 的最后一个分支保持不变，这样对任何除了文件不存在的错误会使程序 panic。

The condition we want to check in the inner match is whether the value returned
by `error.kind()` is the `NotFound` variant of the `ErrorKind` enum. If it is,
we try to create the file with `File::create`. However, because `File::create`
could also fail, we need a second arm in the inner `match` expression. When the
file can’t be created, a different error message is printed. The second arm of
the outer `match` stays the same, so the program panics on any error besides
the missing file error.

> ### Alternatives to Using `match` with `Result<T, E>` 不同于使用 match 和 Result<T, E>
>
> 这里有好多 match！match 确实很强大，不过也非常的原始。第十三章我们会介绍闭包（closure），它会和定义在 Result<T, E> 中的很多方法一起使用。在处理代码中的 Result<T, E> 值时，相比于使用 match ，使用这些方法会更加简洁。
> That’s a lot of `match`! The `match` expression is very useful but also very
> much a primitive. In Chapter 13, you’ll learn about closures, which are used
> with many of the methods defined on `Result<T, E>`. These methods can be more
> concise than using `match` when handling `Result<T, E>` values in your code.
>
> 例如，这是另一个编写与示例 9-5 逻辑相同但是使用闭包和 unwrap_or_else 方法的例子：
> For example, here’s another way to write the same logic as shown in Listing
> 9-5, this time using closures and the `unwrap_or_else` method:
>
> <!-- CAN'T EXTRACT SEE https://github.com/rust-lang/mdBook/issues/1127 -->
>
> ```rust
> use std::fs::File;
> use std::io::ErrorKind;
>
> fn main() {
>     let greeting_file = File::open("hello.txt").unwrap_or_else(|error| {
>         if error.kind() == ErrorKind::NotFound {
>             File::create("hello.txt").unwrap_or_else(|error| {
>                 panic!("Problem creating the file: {:?}", error);
>             })
>         } else {
>             panic!("Problem opening the file: {:?}", error);
>         }
>     });
> }
> ```
>
> 虽然这段代码有着如示例 9-5 一样的行为，但并没有包含任何 match 表达式且更容易阅读。在阅读完第十三章后再回到这个例子，并查看标准库文档 unwrap_or_else 方法都做了什么操作。在处理错误时，还有很多这类方法可以消除大量嵌套的 match 表达式。
> Although this code has the same behavior as Listing 9-5, it doesn’t contain
> any `match` expressions and is cleaner to read. Come back to this example
> after you’ve read Chapter 13, and look up the `unwrap_or_else` method in the
> standard library documentation. Many more of these methods can clean up huge
> nested `match` expressions when you’re dealing with errors.

### Shortcuts for Panic on Error: `unwrap` and `expect` 失败时 panic 的简写：unwrap 和 expect

match 能够胜任它的工作，不过它可能有点冗长并且不总是能很好的表明其意图。Result<T, E> 类型定义了很多辅助方法来处理各种情况。其中之一叫做 unwrap，它的实现就类似于示例 9-4 中的 match 语句。如果 Result 值是成员 Ok，unwrap 会返回 Ok 中的值。如果 Result 是成员 Err，unwrap 会为我们调用 panic!。这里是一个实践 unwrap 的例子：

Using `match` works well enough, but it can be a bit verbose and doesn’t always
communicate intent well. The `Result<T, E>` type has many helper methods
defined on it to do various, more specific tasks. The `unwrap` method is a
shortcut method implemented just like the `match` expression we wrote in
Listing 9-4. If the `Result` value is the `Ok` variant, `unwrap` will return
the value inside the `Ok`. If the `Result` is the `Err` variant, `unwrap` will
call the `panic!` macro for us. Here is an example of `unwrap` in action:

<span class="filename">Filename: src/main.rs</span>

```rust,should_panic
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap();
}
```

如果调用这段代码时不存在 hello.txt 文件，我们将会看到一个 unwrap 调用 panic! 时提供的错误信息：

If we run this code without a _hello.txt_ file, we’ll see an error message from
the `panic!` call that the `unwrap` method makes:

<!-- manual-regeneration
cd listings/ch09-error-handling/no-listing-04-unwrap
cargo run
copy and paste relevant text
-->

```text
thread 'main' panicked at src/main.rs:4:49:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
```

还有另一个类似于 unwrap 的方法它还允许我们选择 panic! 的错误信息：expect。使用 expect 而不是 unwrap 并提供一个好的错误信息可以表明你的意图并更易于追踪 panic 的根源。expect 的语法看起来像这样：

Similarly, the `expect` method lets us also choose the `panic!` error message.
Using `expect` instead of `unwrap` and providing good error messages can convey
your intent and make tracking down the source of a panic easier. The syntax of
`expect` looks like this:

<span class="filename">Filename: src/main.rs</span>

```rust,should_panic
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
}
```

expect 与 unwrap 的使用方式一样：返回文件句柄或调用 panic! 宏。expect 在调用 panic! 时使用的错误信息将是我们传递给 expect 的参数，而不像 unwrap 那样使用默认的 panic! 信息。它看起来像这样：

We use `expect` in the same way as `unwrap`: to return the file handle or call
the `panic!` macro. The error message used by `expect` in its call to `panic!`
will be the parameter that we pass to `expect`, rather than the default
`panic!` message that `unwrap` uses. Here’s what it looks like:

<!-- manual-regeneration
cd listings/ch09-error-handling/no-listing-05-expect
cargo run
copy and paste relevant text
-->

```text
thread 'main' panicked at src/main.rs:5:10:
hello.txt should be included in this project: Os { code: 2, kind: NotFound, message: "No such file or directory" }
```

在生产级别的代码中，大部分 Rustaceans 选择 expect 而不是 unwrap 并提供更多关于为何操作期望是一直成功的上下文。如此如果该假设真的被证明是错的，你也有更多的信息来用于调试。

In production-quality code, most Rustaceans choose `expect` rather than
`unwrap` and give more context about why the operation is expected to always
succeed. That way, if your assumptions are ever proven wrong, you have more
information to use in debugging.

### Propagating Errors 传递错误

当编写一个其实先会调用一些可能会失败的操作的函数时，除了在这个函数中处理错误外，还可以选择让调用者知道这个错误并决定该如何处理。这被称为 传递（propagating）错误，这样能更好的控制代码调用，因为比起你代码所拥有的上下文，调用者可能拥有更多信息或逻辑来决定应该如何处理错误。

When a function’s implementation calls something that might fail, instead of
handling the error within the function itself, you can return the error to the
calling code so that it can decide what to do. This is known as _propagating_
the error and gives more control to the calling code, where there might be more
information or logic that dictates how the error should be handled than what
you have available in the context of your code.

例如，示例 9-6 展示了一个从文件中读取用户名的函数。如果文件不存在或不能读取，这个函数会将这些错误返回给调用它的代码：

For example, Listing 9-6 shows a function that reads a username from a file. If
the file doesn’t exist or can’t be read, this function will return those errors
to the code that called the function.

<span class="filename">Filename: src/main.rs</span>

<!-- Deliberately not using rustdoc_include here; the `main` function in the
file panics. We do want to include it for reader experimentation purposes, but
don't want to include it for rustdoc testing purposes. -->

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

<span class="caption">
示例 9-6：一个函数使用 match 将错误返回给代码调用者
Listing 9-6: A function that returns errors to the
calling code using `match`</span>

这个函数可以编写成更加简短的形式，不过我们以大量手动处理开始以便探索错误处理；在最后我们会展示更短的形式。让我们看看函数的返回值：Result<String, io::Error>。这意味着函数返回一个 Result<T, E> 类型的值，其中泛型参数 T 的具体类型是 String，而 E 的具体类型是 io::Error。

This function can be written in a much shorter way, but we’re going to start by
doing a lot of it manually in order to explore error handling; at the end,
we’ll show the shorter way. Let’s look at the return type of the function
first: `Result<String, io::Error>`. This means the function is returning a
value of the type `Result<T, E>` where the generic parameter `T` has been
filled in with the concrete type `String`, and the generic type `E` has been
filled in with the concrete type `io::Error`.

如果这个函数没有出任何错误成功返回，函数的调用者会收到一个包含 String 的 Ok 值 —— 函数从文件中读取到的用户名。如果函数遇到任何错误，函数的调用者会收到一个 Err 值，它储存了一个包含更多这个问题相关信息的 io::Error 实例。这里选择 io::Error 作为函数的返回值是因为它正好是函数体中那两个可能会失败的操作的错误返回值：File::open 函数和 read_to_string 方法。

If this function succeeds without any problems, the code that calls this
function will receive an `Ok` value that holds a `String`—the username that
this function read from the file. If this function encounters any problems, the
calling code will receive an `Err` value that holds an instance of `io::Error`
that contains more information about what the problems were. We chose
`io::Error` as the return type of this function because that happens to be the
type of the error value returned from both of the operations we’re calling in
this function’s body that might fail: the `File::open` function and the
`read_to_string` method.

函数体以调用 File::open 函数开始。接着使用 match 处理返回值 Result，类似示例 9-4，如果 File::open 成功了，模式变量 file 中的文件句柄就变成了可变变量 username_file 中的值，接着函数继续执行。在 Err 的情况下，我们没有调用 panic!，而是使用 return 关键字提前结束整个函数，并将来自 File::open 的错误值（现在在模式变量 e 中）作为函数的错误值传回给调用者。

The body of the function starts by calling the `File::open` function. Then we
handle the `Result` value with a `match` similar to the `match` in Listing 9-4.
If `File::open` succeeds, the file handle in the pattern variable `file`
becomes the value in the mutable variable `username_file` and the function
continues. In the `Err` case, instead of calling `panic!`, we use the `return`
keyword to return early out of the function entirely and pass the error value
from `File::open`, now in the pattern variable `e`, back to the calling code as
this function’s error value.

所以，如果在 username_file 中有一个文件句柄，该函数随后会在变量 username 中创建一个新的 String 并调用文件句柄 username_file 上的 read_to_string 方法，以将文件的内容读入 username。read_to_string 方法也返回一个 Result，因为它可能会失败，哪怕是 File::open 已经成功了。因此，我们需要另一个 match 来处理这个 Result：如果 read_to_string 执行成功，那么这个函数也就成功了，我们将从文件中读取的用户名返回，此时用户名位于被封装进 Ok 的 username 中。如果 read_to_string 执行失败，则像之前处理 File::open 的返回值的 match 那样返回错误值。然而，我们无需显式调用 return 语句，因为这是函数的最后一个表达式。

So if we have a file handle in `username_file`, the function then creates a new
`String` in variable `username` and calls the `read_to_string` method on
the file handle in `username_file` to read the contents of the file into
`username`. The `read_to_string` method also returns a `Result` because it
might fail, even though `File::open` succeeded. So we need another `match` to
handle that `Result`: if `read_to_string` succeeds, then our function has
succeeded, and we return the username from the file that’s now in `username`
wrapped in an `Ok`. If `read_to_string` fails, we return the error value in the
same way that we returned the error value in the `match` that handled the
return value of `File::open`. However, we don’t need to explicitly say
`return`, because this is the last expression in the function.

调用这个函数的代码最终会得到一个包含用户名的 Ok 值，或者一个包含 io::Error 的 Err 值。我们无从得知调用者会如何处理这些值。例如，如果他们得到了一个 Err 值，他们可能会选择 panic! 并使程序崩溃、使用一个默认的用户名或者从文件之外的地方寻找用户名。我们没有足够的信息知晓调用者具体会如何尝试，所以将所有的成功或失败信息向上传播，让他们选择合适的处理方法。

The code that calls this code will then handle getting either an `Ok` value
that contains a username or an `Err` value that contains an `io::Error`. It’s
up to the calling code to decide what to do with those values. If the calling
code gets an `Err` value, it could call `panic!` and crash the program, use a
default username, or look up the username from somewhere other than a file, for
example. We don’t have enough information on what the calling code is actually
trying to do, so we propagate all the success or error information upward for
it to handle appropriately.

这种传播错误的模式在 Rust 是如此的常见，以至于 Rust 提供了 ? 问号运算符来使其更易于处理。

This pattern of propagating errors is so common in Rust that Rust provides the
question mark operator `?` to make this easier.

#### A Shortcut for Propagating Errors: the `?` Operator 传递错误的简写：? 运算符

示例 9-7 展示了一个 read_username_from_file 的实现，它实现了与示例 9-6 中的代码相同的功能，不过这个实现使用了 ? 运算符：

Listing 9-7 shows an implementation of `read_username_from_file` that has the
same functionality as in Listing 9-6, but this implementation uses the
`?` operator.

<span class="filename">Filename: src/main.rs</span>

<!-- Deliberately not using rustdoc_include here; the `main` function in the
file panics. We do want to include it for reader experimentation purposes, but
don't want to include it for rustdoc testing purposes. -->

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```

<span class="caption">
示例 9-7：一个使用 ? 运算符向调用者返回错误的函数
Listing 9-7: A function that returns errors to the
calling code using the `?` operator</span>

Result 值之后的 ? 被定义为与示例 9-6 中定义的处理 Result 值的 match 表达式有着完全相同的工作方式。如果 Result 的值是 Ok，这个表达式将会返回 Ok 中的值而程序将继续执行。如果值是 Err，Err 将作为整个函数的返回值，就好像使用了 return 关键字一样，这样错误值就被传播给了调用者。

The `?` placed after a `Result` value is defined to work in almost the same way
as the `match` expressions we defined to handle the `Result` values in Listing
9-6. If the value of the `Result` is an `Ok`, the value inside the `Ok` will
get returned from this expression, and the program will continue. If the value
is an `Err`, the `Err` will be returned from the whole function as if we had
used the `return` keyword so the error value gets propagated to the calling
code.

示例 9-6 中的 match 表达式与 ? 运算符所做的有一点不同：? 运算符所使用的错误值被传递给了 from 函数，它定义于标准库的 From trait 中，其用来将错误从一种类型转换为另一种类型。当 ? 运算符调用 from 函数时，收到的错误类型被转换为由当前函数返回类型所指定的错误类型。这在当函数返回单个错误类型来代表所有可能失败的方式时很有用，即使其可能会因很多种原因失败。

There is a difference between what the `match` expression from Listing 9-6 does
and what the `?` operator does: error values that have the `?` operator called
on them go through the `from` function, defined in the `From` trait in the
standard library, which is used to convert values from one type into another.
When the `?` operator calls the `from` function, the error type received is
converted into the error type defined in the return type of the current
function. This is useful when a function returns one error type to represent
all the ways a function might fail, even if parts might fail for many different
reasons.

例如，我们可以将示例 9-7 中的 read_username_from_file 函数修改为返回一个自定义的 OurError 错误类型。如果我们也定义了 impl From<io::Error> for OurError 来从 io::Error 构造一个 OurError 实例，那么 read_username_from_file 函数体中的 ? 运算符调用会调用 from 并转换错误而无需在函数中增加任何额外的代码。

For example, we could change the `read_username_from_file` function in Listing
9-7 to return a custom error type named `OurError` that we define. If we also
define `impl From<io::Error> for OurError` to construct an instance of
`OurError` from an `io::Error`, then the `?` operator calls in the body of
`read_username_from_file` will call `from` and convert the error types without
needing to add any more code to the function.

在示例 9-7 的上下文中，File::open 调用结尾的 ? 会将 Ok 中的值返回给变量 username_file。如果发生了错误，? 运算符会使整个函数提前返回并将任何 Err 值返回给调用代码。同理也适用于 read_to_string 调用结尾的 ?。

In the context of Listing 9-7, the `?` at the end of the `File::open` call will
return the value inside an `Ok` to the variable `username_file`. If an error
occurs, the `?` operator will return early out of the whole function and give
any `Err` value to the calling code. The same thing applies to the `?` at the
end of the `read_to_string` call.

? 运算符消除了大量样板代码并使得函数的实现更简单。我们甚至可以在 ? 之后直接使用链式方法调用来进一步缩短代码，如示例 9-8 所示：

The `?` operator eliminates a lot of boilerplate and makes this function’s
implementation simpler. We could even shorten this code further by chaining
method calls immediately after the `?`, as shown in Listing 9-8.

<span class="filename">Filename: src/main.rs</span>

<!-- Deliberately not using rustdoc_include here; the `main` function in the
file panics. We do want to include it for reader experimentation purposes, but
don't want to include it for rustdoc testing purposes. -->

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();

    File::open("hello.txt")?.read_to_string(&mut username)?;

    Ok(username)
}
```

<span class="caption">
示例 9-8：问号运算符之后的链式方法调用
Listing 9-8: Chaining method calls after the `?`
operator</span>

在 username 中创建新的 String 被放到了函数开头；这一部分没有变化。我们对 File::open("hello.txt")? 的结果直接链式调用了 read_to_string，而不再创建变量 username_file。仍然需要 read_to_string 调用结尾的 ?，而且当 File::open 和 read_to_string 都成功没有失败时返回包含用户名 username 的 Ok 值。其功能再一次与示例 9-6 和示例 9-7 保持一致，不过这是一个与众不同且更符合工程学（ergonomic）的写法。

示例 9-9 展示了一个使用 fs::read_to_string 的更为简短的写法：

We’ve moved the creation of the new `String` in `username` to the beginning of
the function; that part hasn’t changed. Instead of creating a variable
`username_file`, we’ve chained the call to `read_to_string` directly onto the
result of `File::open("hello.txt")?`. We still have a `?` at the end of the
`read_to_string` call, and we still return an `Ok` value containing `username`
when both `File::open` and `read_to_string` succeed rather than returning
errors. The functionality is again the same as in Listing 9-6 and Listing 9-7;
this is just a different, more ergonomic way to write it.

Listing 9-9 shows a way to make this even shorter using `fs::read_to_string`.

<span class="filename">Filename: src/main.rs</span>

<!-- Deliberately not using rustdoc_include here; the `main` function in the
file panics. We do want to include it for reader experimentation purposes, but
don't want to include it for rustdoc testing purposes. -->

```rust
use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    fs::read_to_string("hello.txt")
}
```

<span class="caption">
示例 9-9: 使用 fs::read_to_string 而不是打开后读取文件
Listing 9-9: Using `fs::read_to_string` instead of
opening and then reading the file</span>

将文件读取到一个字符串是相当常见的操作，所以 Rust 提供了名为 fs::read_to_string 的函数，它会打开文件、新建一个 String、读取文件的内容，并将内容放入 String，接着返回它。当然，这样做就没有展示所有这些错误处理的机会了，所以我们最初就选择了艰苦的道路。

Reading a file into a string is a fairly common operation, so the standard
library provides the convenient `fs::read_to_string` function that opens the
file, creates a new `String`, reads the contents of the file, puts the contents
into that `String`, and returns it. Of course, using `fs::read_to_string`
doesn’t give us the opportunity to explain all the error handling, so we did it
the longer way first.

#### Where The `?` Operator Can Be Used 哪里可以使用 ? 运算符

? 运算符只能被用于返回值与 ? 作用的值相兼容的函数。因为 ? 运算符被定义为从函数中提早返回一个值，这与示例 9-6 中的 match 表达式有着完全相同的工作方式。示例 9-6 中 match 作用于一个 Result 值，提早返回的分支返回了一个 Err(e) 值。函数的返回值必须是 Result 才能与这个 return 相兼容。

The `?` operator can only be used in functions whose return type is compatible
with the value the `?` is used on. This is because the `?` operator is defined
to perform an early return of a value out of the function, in the same manner
as the `match` expression we defined in Listing 9-6. In Listing 9-6, the
`match` was using a `Result` value, and the early return arm returned an
`Err(e)` value. The return type of the function has to be a `Result` so that
it’s compatible with this `return`.

在示例 9-10 中，让我们看看在返回值不兼容的 main 函数中使用 ? 运算符会得到什么错误：

In Listing 9-10, let’s look at the error we’ll get if we use the `?` operator
in a `main` function with a return type incompatible with the type of the value
we use `?` on:

<span class="filename">Filename: src/main.rs</span>

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")?;
}
```

<span class="caption">
示例 9-10: 尝试在返回 () 的 main 函数中使用 ? 的代码不能编译
Listing 9-10: Attempting to use the `?` in the `main`
function that returns `()` won’t compile</span>

这段代码打开一个文件，这可能会失败。? 运算符作用于 File::open 返回的 Result 值，不过 main 函数的返回类型是 () 而不是 Result。当编译这些代码，会得到如下错误信息：

This code opens a file, which might fail. The `?` operator follows the `Result`
value returned by `File::open`, but this `main` function has the return type of
`()`, not `Result`. When we compile this code, we get the following error
message:

```console
$ cargo run
   Compiling error-handling v0.1.0 (file:///projects/error-handling)
error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option` (or another type that implements `FromResidual`)
 --> src/main.rs:4:48
  |
3 | fn main() {
  | --------- this function should return `Result` or `Option` to accept `?`
4 |     let greeting_file = File::open("hello.txt")?;
  |                                                ^ cannot use the `?` operator in a function that returns `()`
  |
  = help: the trait `FromResidual<Result<Infallible, std::io::Error>>` is not implemented for `()`

For more information about this error, try `rustc --explain E0277`.
error: could not compile `error-handling` (bin "error-handling") due to 1 previous error
```

这个错误指出只能在返回 Result 或者其它实现了 FromResidual 的类型的函数中使用 ? 运算符。

This error points out that we’re only allowed to use the `?` operator in a
function that returns `Result`, `Option`, or another type that implements
`FromResidual`.

To fix the error, you have two choices. One choice is to change the return type
of your function to be compatible with the value you’re using the `?` operator
on as long as you have no restrictions preventing that. The other technique is
to use a `match` or one of the `Result<T, E>` methods to handle the `Result<T,
E>` in whatever way is appropriate.

The error message also mentioned that `?` can be used with `Option<T>` values
as well. As with using `?` on `Result`, you can only use `?` on `Option` in a
function that returns an `Option`. The behavior of the `?` operator when called
on an `Option<T>` is similar to its behavior when called on a `Result<T, E>`:
if the value is `None`, the `None` will be returned early from the function at
that point. If the value is `Some`, the value inside the `Some` is the
resulting value of the expression and the function continues. Listing 9-11 has
an example of a function that finds the last character of the first line in the
given text:

```rust
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-11/src/main.rs:here}}
```

<span class="caption">Listing 9-11: Using the `?` operator on an `Option<T>`
value</span>

This function returns `Option<char>` because it’s possible that there is a
character there, but it’s also possible that there isn’t. This code takes the
`text` string slice argument and calls the `lines` method on it, which returns
an iterator over the lines in the string. Because this function wants to
examine the first line, it calls `next` on the iterator to get the first value
from the iterator. If `text` is the empty string, this call to `next` will
return `None`, in which case we use `?` to stop and return `None` from
`last_char_of_first_line`. If `text` is not the empty string, `next` will
return a `Some` value containing a string slice of the first line in `text`.

The `?` extracts the string slice, and we can call `chars` on that string slice
to get an iterator of its characters. We’re interested in the last character in
this first line, so we call `last` to return the last item in the iterator.
This is an `Option` because it’s possible that the first line is the empty
string, for example if `text` starts with a blank line but has characters on
other lines, as in `"\nhi"`. However, if there is a last character on the first
line, it will be returned in the `Some` variant. The `?` operator in the middle
gives us a concise way to express this logic, allowing us to implement the
function in one line. If we couldn’t use the `?` operator on `Option`, we’d
have to implement this logic using more method calls or a `match` expression.

Note that you can use the `?` operator on a `Result` in a function that returns
`Result`, and you can use the `?` operator on an `Option` in a function that
returns `Option`, but you can’t mix and match. The `?` operator won’t
automatically convert a `Result` to an `Option` or vice versa; in those cases,
you can use methods like the `ok` method on `Result` or the `ok_or` method on
`Option` to do the conversion explicitly.

So far, all the `main` functions we’ve used return `()`. The `main` function is
special because it’s the entry and exit point of executable programs, and there
are restrictions on what its return type can be for the programs to behave as
expected.

Luckily, `main` can also return a `Result<(), E>`. Listing 9-12 has the
code from Listing 9-10 but we’ve changed the return type of `main` to be
`Result<(), Box<dyn Error>>` and added a return value `Ok(())` to the end. This
code will now compile:

```rust
{{#rustdoc_include ../listings/ch09-error-handling/listing-09-12/src/main.rs}}
```

<span class="caption">Listing 9-12: Changing `main` to return `Result<(), E>`
allows the use of the `?` operator on `Result` values</span>

The `Box<dyn Error>` type is a _trait object_, which we’ll talk about in the
[“Using Trait Objects that Allow for Values of Different
Types”][trait-objects]<!-- ignore --> section in Chapter 17. For now, you can
read `Box<dyn Error>` to mean “any kind of error.” Using `?` on a `Result`
value in a `main` function with the error type `Box<dyn Error>` is allowed,
because it allows any `Err` value to be returned early. Even though the body of
this `main` function will only ever return errors of type `std::io::Error`, by
specifying `Box<dyn Error>`, this signature will continue to be correct even if
more code that returns other errors is added to the body of `main`.

When a `main` function returns a `Result<(), E>`, the executable will
exit with a value of `0` if `main` returns `Ok(())` and will exit with a
nonzero value if `main` returns an `Err` value. Executables written in C return
integers when they exit: programs that exit successfully return the integer
`0`, and programs that error return some integer other than `0`. Rust also
returns integers from executables to be compatible with this convention.

The `main` function may return any types that implement [the
`std::process::Termination` trait][termination]<!-- ignore -->, which contains
a function `report` that returns an `ExitCode`. Consult the standard library
documentation for more information on implementing the `Termination` trait for
your own types.

Now that we’ve discussed the details of calling `panic!` or returning `Result`,
let’s return to the topic of how to decide which is appropriate to use in which
cases.

[handle_failure]: ch02-00-guessing-game-tutorial.html#handling-potential-failure-with-result
[trait-objects]: ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types
[termination]: ../std/process/trait.Termination.html
