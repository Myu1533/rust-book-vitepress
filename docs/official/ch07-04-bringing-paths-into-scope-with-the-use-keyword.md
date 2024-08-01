## Bringing Paths into Scope with the `use` Keyword 使用 use 关键字将路径引入作用域

不得不编写路径来调用函数显得不便且重复。在示例 7-7 中，无论我们选择 add_to_waitlist 函数的绝对路径还是相对路径，每次我们想要调用 add_to_waitlist 时，都必须指定 front_of_house 和 hosting。幸运的是，有一种方法可以简化这个过程。我们可以使用 use 关键字创建一个短路径，然后就可以在作用域中的任何地方使用这个更短的名字。

Having to write out the paths to call functions can feel inconvenient and
repetitive. In Listing 7-7, whether we chose the absolute or relative path to
the `add_to_waitlist` function, every time we wanted to call `add_to_waitlist`
we had to specify `front_of_house` and `hosting` too. Fortunately, there’s a
way to simplify this process: we can create a shortcut to a path with the `use`
keyword once, and then use the shorter name everywhere else in the scope.

在示例 7-11 中，我们将 crate::front_of_house::hosting 模块引入了 eat_at_restaurant 函数的作用域，而我们只需要指定 hosting::add_to_waitlist 即可在 eat_at_restaurant 中调用 add_to_waitlist 函数。

In Listing 7-11, we bring the `crate::front_of_house::hosting` module into the
scope of the `eat_at_restaurant` function so we only have to specify
`hosting::add_to_waitlist` to call the `add_to_waitlist` function in
`eat_at_restaurant`.

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

<span class="caption">
示例 7-11: 使用 use 将模块引入作用域
Listing 7-11: Bringing a module into scope with
`use`</span>

在作用域中增加 use 和路径类似于在文件系统中创建软连接（符号连接，symbolic link）。通过在 crate 根增加 use crate::front_of_house::hosting，现在 hosting 在作用域中就是有效的名称了，如同 hosting 模块被定义于 crate 根一样。通过 use 引入作用域的路径也会检查私有性，同其它路径一样。

Adding `use` and a path in a scope is similar to creating a symbolic link in
the filesystem. By adding `use crate::front_of_house::hosting` in the crate
root, `hosting` is now a valid name in that scope, just as though the `hosting`
module had been defined in the crate root. Paths brought into scope with `use`
also check privacy, like any other paths.

注意 use 只能创建 use 所在的特定作用域内的短路径。示例 7-12 将 eat_at_restaurant 函数移动到了一个叫 customer 的子模块，这又是一个不同于 use 语句的作用域，所以函数体不能编译。

Note that `use` only creates the shortcut for the particular scope in which the
`use` occurs. Listing 7-12 moves the `eat_at_restaurant` function into a new
child module named `customer`, which is then a different scope than the `use`
statement, so the function body won’t compile:

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness,does_not_compile,ignore
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

mod customer {
    pub fn eat_at_restaurant() {
        hosting::add_to_waitlist();
    }
}
```

<span class="caption">
示例 7-12: use 语句只适用于其所在的作用域
Listing 7-12: A `use` statement only applies in the scope
it’s in</span>

编译器错误显示短路径不再适用于 customer 模块中：

The compiler error shows that the shortcut no longer applies within the
`customer` module:

```console
$ cargo build
   Compiling restaurant v0.1.0 (file:///projects/restaurant)
error[E0433]: failed to resolve: use of undeclared crate or module `hosting`
  --> src/lib.rs:11:9
   |
11 |         hosting::add_to_waitlist();
   |         ^^^^^^^ use of undeclared crate or module `hosting`
   |
help: consider importing this module through its public re-export
   |
10 +     use crate::hosting;
   |

warning: unused import: `crate::front_of_house::hosting`
 --> src/lib.rs:7:5
  |
7 | use crate::front_of_house::hosting;
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |
  = note: `#[warn(unused_imports)]` on by default

For more information about this error, try `rustc --explain E0433`.
warning: `restaurant` (lib) generated 1 warning
error: could not compile `restaurant` (lib) due to 1 previous error; 1 warning emitted

```

注意这里还有一个警告说 use 在其作用域内不再被使用！为了修复这个问题，可以将 use 移动到 customer 模块内，或者在子模块 customer 内通过 super::hosting 引用父模块中的这个短路径。

Notice there’s also a warning that the `use` is no longer used in its scope! To
fix this problem, move the `use` within the `customer` module too, or reference
the shortcut in the parent module with `super::hosting` within the child
`customer` module.

### Creating Idiomatic `use` Paths 创建惯用的 use 路径

在示例 7-11 中，你可能会比较疑惑，为什么我们是指定 use crate::front_of_house::hosting ，然后在 eat_at_restaurant 中调用 hosting::add_to_waitlist ，而不是通过指定一直到 add_to_waitlist 函数的 use 路径来得到相同的结果，如示例 7-13 所示。

In Listing 7-11, you might have wondered why we specified `use
crate::front_of_house::hosting` and then called `hosting::add_to_waitlist` in
`eat_at_restaurant` rather than specifying the `use` path all the way out to
the `add_to_waitlist` function to achieve the same result, as in Listing 7-13.

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting::add_to_waitlist;

pub fn eat_at_restaurant() {
    add_to_waitlist();
}
```

<span class="caption">
示例 7-13: 使用 use 将 add_to_waitlist 函数引入作用域，这并不符合习惯
Listing 7-13: Bringing the `add_to_waitlist` function
into scope with `use`, which is unidiomatic</span>

虽然示例 7-11 和 7-13 都完成了相同的任务，但示例 7-11 是使用 use 将函数引入作用域的习惯用法。要想使用 use 将函数的父模块引入作用域，我们必须在调用函数时指定父模块，这样可以清晰地表明函数不是在本地定义的，同时使完整路径的重复度最小化。示例 7-13 中的代码不清楚 add_to_waitlist 是在哪里被定义的。

Although both Listing 7-11 and 7-13 accomplish the same task, Listing 7-11 is
the idiomatic way to bring a function into scope with `use`. Bringing the
function’s parent module into scope with `use` means we have to specify the
parent module when calling the function. Specifying the parent module when
calling the function makes it clear that the function isn’t locally defined
while still minimizing repetition of the full path. The code in Listing 7-13 is
unclear as to where `add_to_waitlist` is defined.

另一方面，使用 use 引入结构体、枚举和其他项时，习惯是指定它们的完整路径。示例 7-14 展示了将 HashMap 结构体引入二进制 crate 作用域的习惯用法。

On the other hand, when bringing in structs, enums, and other items with `use`,
it’s idiomatic to specify the full path. Listing 7-14 shows the idiomatic way
to bring the standard library’s `HashMap` struct into the scope of a binary
crate.

<span class="filename">Filename: src/main.rs</span>

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, 2);
}
```

<span class="caption">
示例 7-14: 将 HashMap 引入作用域的习惯用法
Listing 7-14: Bringing `HashMap` into scope in an
idiomatic way</span>

这种习惯用法背后没有什么硬性要求：它只是一种惯例，人们已经习惯了以这种方式阅读和编写 Rust 代码。

There’s no strong reason behind this idiom: it’s just the convention that has
emerged, and folks have gotten used to reading and writing Rust code this way.

这个习惯用法有一个例外，那就是我们想使用 use 语句将两个具有相同名称的项带入作用域，因为 Rust 不允许这样做。示例 7-15 展示了如何将两个具有相同名称但不同父模块的 Result 类型引入作用域，以及如何引用它们。

The exception to this idiom is if we’re bringing two items with the same name
into scope with `use` statements, because Rust doesn’t allow that. Listing 7-15
shows how to bring two `Result` types into scope that have the same name but
different parent modules and how to refer to them.

<span class="filename">Filename: src/lib.rs</span>

```rust
use std::fmt;
use std::io;

fn function1() -> fmt::Result {
    // --snip--
}

fn function2() -> io::Result<()> {
    // --snip--
}
```

<span class="caption">
示例 7-15: 使用父模块将两个具有相同名称的类型引入同一作用域
Listing 7-15: Bringing two types with the same name into
the same scope requires using their parent modules.</span>

如你所见，使用父模块可以区分这两个 Result 类型。如果我们是指定 use std::fmt::Result 和 use std::io::Result，我们将在同一作用域拥有了两个 Result 类型，当我们使用 Result 时，Rust 则不知道我们要用的是哪个。

As you can see, using the parent modules distinguishes the two `Result` types.
If instead we specified `use std::fmt::Result` and `use std::io::Result`, we’d
have two `Result` types in the same scope and Rust wouldn’t know which one we
meant when we used `Result`.

### Providing New Names with the `as` Keyword 使用 as 关键字提供新的名称

使用 use 将两个同名类型引入同一作用域这个问题还有另一个解决办法：在这个类型的路径后面，我们使用 as 指定一个新的本地名称或者别名。示例 7-16 展示了另一个编写示例 7-15 中代码的方法，通过 as 重命名其中一个 Result 类型。

There’s another solution to the problem of bringing two types of the same name
into the same scope with `use`: after the path, we can specify `as` and a new
local name, or _alias_, for the type. Listing 7-16 shows another way to write
the code in Listing 7-15 by renaming one of the two `Result` types using `as`.

<span class="filename">Filename: src/lib.rs</span>

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

<span class="caption">
示例 7-16: 使用 as 关键字重命名引入作用域的类型
Listing 7-16: Renaming a type when it’s brought into
scope with the `as` keyword</span>

在第二个 use 语句中，我们选择 IoResult 作为 std::io::Result 的新名称，它与从 std::fmt 引入作用域的 Result 并不冲突。示例 7-15 和示例 7-16 都是惯用的，如何选择都取决于你！

In the second `use` statement, we chose the new name `IoResult` for the
`std::io::Result` type, which won’t conflict with the `Result` from `std::fmt`
that we’ve also brought into scope. Listing 7-15 and Listing 7-16 are
considered idiomatic, so the choice is up to you!

### Re-exporting Names with `pub use` 使用 pub use 重导出名称

使用 use 关键字，将某个名称导入当前作用域后，这个名称在此作用域中就可以使用了，但它对此作用域之外还是私有的。如果想让其他人调用我们的代码时，也能够正常使用这个名称，就好像它本来就在当前作用域一样，那我们可以将 pub 和 use 合起来使用。这种技术被称为 “重导出（re-exporting）”：我们不仅将一个名称导入了当前作用域，还允许别人把它导入他们自己的作用域。

When we bring a name into scope with the `use` keyword, the name available in
the new scope is private. To enable the code that calls our code to refer to
that name as if it had been defined in that code’s scope, we can combine `pub`
and `use`. This technique is called _re-exporting_ because we’re bringing
an item into scope but also making that item available for others to bring into
their scope.

示例 7-17 将示例 7-11 根模块中的 use 改为 pub use 。

Listing 7-17 shows the code in Listing 7-11 with `use` in the root module
changed to `pub use`.

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

<span class="caption">
例 7-17: 通过 pub use 使名称可从新作用域中被导入至任何代码
Listing 7-17: Making a name available for any code to use
from a new scope with `pub use`</span>

在这个修改之前，外部代码需要使用路径 restaurant::front_of_house::hosting::add_to_waitlist() 来调用 add_to_waitlist 函数。现在这个 pub use 从根模块重导出了 hosting 模块，外部代码现在可以使用路径 restaurant::hosting::add_to_waitlist。

Before this change, external code would have to call the `add_to_waitlist`
function by using the path
`restaurant::front_of_house::hosting::add_to_waitlist()`. Now that this `pub
use` has re-exported the `hosting` module from the root module, external code
can now use the path `restaurant::hosting::add_to_waitlist()` instead.

当你代码的内部结构与调用你代码的程序员所想象的结构不同时，重导出会很有用。例如，在这个餐馆的比喻中，经营餐馆的人会想到“前台”和“后台”。但顾客在光顾一家餐馆时，可能不会以这些术语来考虑餐馆的各个部分。使用 pub use，我们可以使用一种结构编写代码，却将不同的结构形式暴露出来。这样做使我们的库井井有条，也使开发这个库的程序员和调用这个库的程序员都更加方便。在“使用 pub use 导出合适的公有 API”部分让我们再看另一个 pub use 的例子来了解这如何影响 crate 的文档。

Re-exporting is useful when the internal structure of your code is different
from how programmers calling your code would think about the domain. For
example, in this restaurant metaphor, the people running the restaurant think
about “front of house” and “back of house.” But customers visiting a restaurant
probably won’t think about the parts of the restaurant in those terms. With
`pub use`, we can write our code with one structure but expose a different
structure. Doing so makes our library well organized for programmers working on
the library and programmers calling the library. We’ll look at another example
of `pub use` and how it affects your crate’s documentation in the [“Exporting a
Convenient Public API with `pub use`”][ch14-pub-use]<!-- ignore --> section of
Chapter 14.

### Using External Packages 使用外部包

在第二章中我们编写了一个猜猜看游戏。那个项目使用了一个外部包，rand，来生成随机数。为了在项目中使用 rand，在 Cargo.toml 中加入了如下行：

In Chapter 2, we programmed a guessing game project that used an external
package called `rand` to get random numbers. To use `rand` in our project, we
added this line to _Cargo.toml_:

<!-- When updating the version of `rand` used, also update the version of
`rand` used in these files so they all match:
* ch02-00-guessing-game-tutorial.md
* ch14-03-cargo-workspaces.md
-->

<span class="filename">Filename: Cargo.toml</span>

```toml
rand = "0.8.5"

```

在 Cargo.toml 中加入 rand 依赖告诉了 Cargo 要从 crates.io 下载 rand 和其依赖，并使其可在项目代码中使用。

Adding `rand` as a dependency in _Cargo.toml_ tells Cargo to download the
`rand` package and any dependencies from [crates.io](https://crates.io/) and
make `rand` available to our project.

接着，为了将 rand 定义引入项目包的作用域，我们加入一行 use 起始的包名，它以 rand 包名开头并列出了需要引入作用域的项。回忆一下第二章的 “生成一个随机数” 部分，我们曾将 Rng trait 引入作用域并调用了 rand::thread_rng 函数：

Then, to bring `rand` definitions into the scope of our package, we added a
`use` line starting with the name of the crate, `rand`, and listed the items
we wanted to bring into scope. Recall that in the [“Generating a Random
Number”][rand]<!-- ignore --> section in Chapter 2, we brought the `Rng` trait
into scope and called the `rand::thread_rng` function:

```rust
use rand::Rng;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1..=100);
}
```

crates.io 上有很多 Rust 社区成员发布的包，将其引入你自己的项目都需要一道相同的步骤：在 Cargo.toml 列出它们并通过 use 将其中定义的项引入项目包的作用域中。

Members of the Rust community have made many packages available at
[crates.io](https://crates.io/), and pulling any of them into your package
involves these same steps: listing them in your package’s _Cargo.toml_ file and
using `use` to bring items from their crates into scope.

注意 std 标准库对于你的包来说也是外部 crate。因为标准库随 Rust 语言一同分发，无需修改 Cargo.toml 来引入 std，不过需要通过 use 将标准库中定义的项引入项目包的作用域中来引用它们，比如我们使用的 HashMap：

Note that the standard `std` library is also a crate that’s external to our
package. Because the standard library is shipped with the Rust language, we
don’t need to change _Cargo.toml_ to include `std`. But we do need to refer to
it with `use` to bring items from there into our package’s scope. For example,
with `HashMap` we would use this line:

```rust
use std::collections::HashMap;
```

这是一个以标准库 crate 名 std 开头的绝对路径。

This is an absolute path starting with `std`, the name of the standard library
crate.

### Using Nested Paths to Clean Up Large `use` Lists 嵌套路径来消除大量的 use 行

当需要引入很多定义于相同包或相同模块的项时，为每一项单独列出一行会占用源码很大的空间。例如猜猜看章节示例 2-4 中有两行 use 语句都从 std 引入项到作用域：

If we’re using multiple items defined in the same crate or same module,
listing each item on its own line can take up a lot of vertical space in our
files. For example, these two `use` statements we had in the Guessing Game in
Listing 2-4 bring items from `std` into scope:

<span class="filename">Filename: src/main.rs</span>

```rust
// --snip--
use std::cmp::Ordering;
use std::io;
// --snip--

```

相反，我们可以使用嵌套路径将相同的项在一行中引入作用域。这么做需要指定路径的相同部分，接着是两个冒号，接着是大括号中的各自不同的路径部分，如示例 7-18 所示。

Instead, we can use nested paths to bring the same items into scope in one
line. We do this by specifying the common part of the path, followed by two
colons, and then curly brackets around a list of the parts of the paths that
differ, as shown in Listing 7-18.

<span class="filename">Filename: src/main.rs</span>

```rust
// --snip--
use std::{cmp::Ordering, io};
// --snip--

```

<span class="caption">
示例 7-18: 指定嵌套的路径在一行中将多个带有相同前缀的项引入作用域
Listing 7-18: Specifying a nested path to bring multiple
items with the same prefix into scope</span>

在较大的程序中，使用嵌套路径从相同包或模块中引入很多项，可以显著减少所需的独立 use 语句的数量！

In bigger programs, bringing many items into scope from the same crate or
module using nested paths can reduce the number of separate `use` statements
needed by a lot!

我们可以在路径的任何层级使用嵌套路径，这在组合两个共享子路径的 use 语句时非常有用。例如，示例 7-19 中展示了两个 use 语句：一个将 std::io 引入作用域，另一个将 std::io::Write 引入作用域：

We can use a nested path at any level in a path, which is useful when combining
two `use` statements that share a subpath. For example, Listing 7-19 shows two
`use` statements: one that brings `std::io` into scope and one that brings
`std::io::Write` into scope.

<span class="filename">Filename: src/lib.rs</span>

```rust
use std::io;
use std::io::Write;
```

<span class="caption">
示例 7-19: 通过两行 use 语句引入两个路径，其中一个是另一个的子路径
Listing 7-19: Two `use` statements where one is a subpath
of the other</span>

两个路径的相同部分是 std::io，这正是第一个路径。为了在一行 use 语句中引入这两个路径，可以在嵌套路径中使用 self，如示例 7-20 所示。

The common part of these two paths is `std::io`, and that’s the complete first
path. To merge these two paths into one `use` statement, we can use `self` in
the nested path, as shown in Listing 7-20.

<span class="filename">Filename: src/lib.rs</span>

```rust
use std::io::{self, Write};
```

<span class="caption">
示例 7-20: 将示例 7-19 中部分重复的路径合并为一个 use 语句
Listing 7-20: Combining the paths in Listing 7-19 into
one `use` statement</span>

这一行便将 std::io 和 std::io::Write 同时引入作用域。

This line brings `std::io` and `std::io::Write` into scope.

### The Glob Operator 通过 glob 运算符将所有的公有定义引入作用域

如果希望将一个路径下 所有 公有项引入作用域，可以指定路径后跟 \*，glob 运算符：

If we want to bring _all_ public items defined in a path into scope, we can
specify that path followed by the `*` glob operator:

```rust
use std::collections::*;
```

这个 use 语句将 std::collections 中定义的所有公有项引入当前作用域。使用 glob 运算符时请多加小心！Glob 会使得我们难以推导作用域中有什么名称和它们是在何处定义的。

This `use` statement brings all public items defined in `std::collections` into
the current scope. Be careful when using the glob operator! Glob can make it
harder to tell what names are in scope and where a name used in your program
was defined.

glob 运算符经常用于测试模块 tests 中，这时会将所有内容引入作用域；我们将在第十一章 “如何编写测试” 部分讲解。glob 运算符有时也用于 prelude 模式；查看 标准库中的文档 了解这个模式的更多细节。

The glob operator is often used when testing to bring everything under test
into the `tests` module; we’ll talk about that in the [“How to Write
Tests”][writing-tests]<!-- ignore --> section in Chapter 11. The glob operator
is also sometimes used as part of the prelude pattern: see [the standard
library documentation](../std/prelude/index.html#other-preludes)<!-- ignore -->
for more information on that pattern.

[ch14-pub-use]: ch14-02-publishing-to-crates-io.html#exporting-a-convenient-public-api-with-pub-use
[rand]: ch02-00-guessing-game-tutorial.html#generating-a-random-number
[writing-tests]: ch11-01-writing-tests.html#how-to-write-tests
