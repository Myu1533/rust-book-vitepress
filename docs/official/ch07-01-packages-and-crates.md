## Packages and Crates 包和 Crate

模块系统的第一部分，我们将介绍包和 crate。

The first parts of the module system we’ll cover are packages and crates.

crate 是 Rust 在编译时最小的代码单位。如果你用 rustc 而不是 cargo 来编译一个文件（第一章我们这么做过），编译器还是会将那个文件认作一个 crate。crate 可以包含模块，模块可以定义在其他文件，然后和 crate 一起编译，我们会在接下来的章节中遇到。

A _crate_ is the smallest amount of code that the Rust compiler considers at a
time. Even if you run `rustc` rather than `cargo` and pass a single source code
file (as we did all the way back in the “Writing and Running a Rust Program”
section of Chapter 1), the compiler considers that file to be a crate. Crates
can contain modules, and the modules may be defined in other files that get
compiled with the crate, as we’ll see in the coming sections.

crate 有两种形式：二进制项和库。二进制项 可以被编译为可执行程序，比如一个命令行程序或者一个 web server。它们必须有一个 main 函数来定义当程序被执行的时候所需要做的事情。目前我们所创建的 crate 都是二进制项。

A crate can come in one of two forms: a binary crate or a library crate.
_Binary crates_ are programs you can compile to an executable that you can run,
such as a command-line program or a server. Each must have a function called
`main` that defines what happens when the executable runs. All the crates we’ve
created so far have been binary crates.

库 并没有 main 函数，它们也不会编译为可执行程序，它们提供一些诸如函数之类的东西，使其他项目也能使用这些东西。比如 第二章 的 rand crate 就提供了生成随机数的东西。大多数时间 Rustaceans 说的 crate 指的都是库，这与其他编程语言中 library 概念一致。

_Library crates_ don’t have a `main` function, and they don’t compile to an
executable. Instead, they define functionality intended to be shared with
multiple projects. For example, the `rand` crate we used in [Chapter
2][rand]<!-- ignore --> provides functionality that generates random numbers.
Most of the time when Rustaceans say “crate”, they mean library crate, and they
use “crate” interchangeably with the general programming concept of a “library".

crate root 是一个源文件，Rust 编译器以它为起始点，并构成你的 crate 的根模块（我们将在 “定义模块来控制作用域与私有性” 一节深入解读）。

The _crate root_ is a source file that the Rust compiler starts from and makes
up the root module of your crate (we’ll explain modules in depth in the
[“Defining Modules to Control Scope and Privacy”][modules]<!-- ignore -->
section).

包（package）是提供一系列功能的一个或者多个 crate。一个包会包含一个 Cargo.toml 文件，阐述如何去构建这些 crate。Cargo 就是一个包含构建你代码的二进制项的包。Cargo 也包含这些二进制项所依赖的库。其他项目也能用 Cargo 库来实现与 Cargo 命令行程序一样的逻辑。

A _package_ is a bundle of one or more crates that provides a set of
functionality. A package contains a _Cargo.toml_ file that describes how to
build those crates. Cargo is actually a package that contains the binary crate
for the command-line tool you’ve been using to build your code. The Cargo
package also contains a library crate that the binary crate depends on. Other
projects can depend on the Cargo library crate to use the same logic the Cargo
command-line tool uses.

包中可以包含至多一个库 crate(library crate)。包中可以包含任意多个二进制 crate(binary crate)，但是必须至少包含一个 crate（无论是库的还是二进制的）。

A package can contain as many binary crates as you like, but at most only one
library crate. A package must contain at least one crate, whether that’s a
library or binary crate.

让我们来看看创建包的时候会发生什么。首先，我们输入命令 cargo new：

Let’s walk through what happens when we create a package. First, we enter the
command `cargo new`:

```console
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml
src
$ ls my-project/src
main.rs


```

运行了这条命令后，我们先用 ls （译者注：此命令为 Linux 平台的指令，Windows 下可用 dir）来看看 Cargo 给我们创建了什么，Cargo 会给我们的包创建一个 Cargo.toml 文件。查看 Cargo.toml 的内容，会发现并没有提到 src/main.rs，因为 Cargo 遵循的一个约定：src/main.rs 就是一个与包同名的二进制 crate 的 crate 根。同样的，Cargo 知道如果包目录中包含 src/lib.rs，则包带有与其同名的库 crate，且 src/lib.rs 是 crate 根。crate 根文件将由 Cargo 传递给 rustc 来实际构建库或者二进制项目。

After we run `cargo new`, we use `ls` to see what Cargo creates. In the project
directory, there’s a _Cargo.toml_ file, giving us a package. There’s also a
_src_ directory that contains _main.rs_. Open _Cargo.toml_ in your text editor,
and note there’s no mention of _src/main.rs_. Cargo follows a convention that
_src/main.rs_ is the crate root of a binary crate with the same name as the
package. Likewise, Cargo knows that if the package directory contains
_src/lib.rs_, the package contains a library crate with the same name as the
package, and _src/lib.rs_ is its crate root. Cargo passes the crate root files
to `rustc` to build the library or binary.

在此，我们有了一个只包含 src/main.rs 的包，意味着它只含有一个名为 my-project 的二进制 crate。如果一个包同时含有 src/main.rs 和 src/lib.rs，则它有两个 crate：一个二进制的和一个库的，且名字都与包相同。通过将文件放在 src/bin 目录下，一个包可以拥有多个二进制 crate：每个 src/bin 下的文件都会被编译成一个独立的二进制 crate。

Here, we have a package that only contains _src/main.rs_, meaning it only
contains a binary crate named `my-project`. If a package contains _src/main.rs_
and _src/lib.rs_, it has two crates: a binary and a library, both with the same
name as the package. A package can have multiple binary crates by placing files
in the _src/bin_ directory: each file will be a separate binary crate.

[modules]: ch07-02-defining-modules-to-control-scope-and-privacy.html
[rand]: ch02-00-guessing-game-tutorial.html#generating-a-random-number
