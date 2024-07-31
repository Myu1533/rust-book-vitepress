## Paths for Referring to an Item in the Module Tree 在模块树中引用路径

来看一下 Rust 如何在模块树中找到一个项的位置，我们使用路径的方式，就像在文件系统使用路径一样。为了调用一个函数，我们需要知道它的路径。

To show Rust where to find an item in a module tree, we use a path in the same
way we use a path when navigating a filesystem. To call a function, we need to
know its path.

路径有两种形式：

A path can take two forms:

- An _absolute path_ is the full path starting from a crate root; for code
  from an external crate, the absolute path begins with the crate name, and for
  code from the current crate, it starts with the literal `crate`. 绝对路径（absolute path）是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 crate 开头。
- A _relative path_ starts from the current module and uses `self`, `super`, or
  an identifier in the current module. 相对路径（relative path）从当前模块开始，以 self、super 或定义在当前模块中的标识符开头。

绝对路径和相对路径都后跟一个或多个由双冒号（::）分割的标识符。

Both absolute and relative paths are followed by one or more identifiers
separated by double colons (`::`).

回到示例 7-1，假设我们希望调用 add_to_waitlist 函数。还是同样的问题，add_to_waitlist 函数的路径是什么？在示例 7-3 中删除了一些模块和函数。

Returning to Listing 7-1, say we want to call the `add_to_waitlist` function.
This is the same as asking: what’s the path of the `add_to_waitlist` function?
Listing 7-3 contains Listing 7-1 with some of the modules and functions
removed.

我们将展示两种方式从 crate 根路径下`eat_at_restaurant` 调用 `add_to_waitlist` 方法。这些路径都是正确的，但是这将引发另一个问题，在编译时将被阻止。稍后我们会解释

We’ll show two ways to call the `add_to_waitlist` function from a new function
`eat_at_restaurant` defined in the crate root. These paths are correct, but
there’s another problem remaining that will prevent this example from compiling
as-is. We’ll explain why in a bit.

eat_at_restaurant 函数是我们 crate 库的一个公共 API，所以我们使用 pub 关键字来标记它。在 “使用 pub 关键字暴露路径” 一节，我们将详细介绍 pub。注意，这个例子无法编译通过，我们稍后会解释原因。

The `eat_at_restaurant` function is part of our library crate’s public API, so
we mark it with the `pub` keyword. In the [“Exposing Paths with the `pub`
Keyword”][pub]<!-- ignore --> section, we’ll go into more detail about `pub`.

<span class="filename">Filename: src/lib.rs</span>

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

<span class="caption">
示例 7-3: 使用绝对路径和相对路径来调用 add_to_waitlist 函数
Listing 7-3: Calling the `add_to_waitlist` function using
absolute and relative paths</span>

第一种方式，我们在 eat_at_restaurant 中调用 add_to_waitlist 函数，使用的是绝对路径。add_to_waitlist 函数与 eat_at_restaurant 被定义在同一 crate 中，这意味着我们可以使用 crate 关键字为起始的绝对路径。在 crate 后面，我们持续地嵌入模块，直到我们找到 add_to_waitlist。你可以想象出一个相同结构的文件系统，我们通过指定路径 /front_of_house/hosting/add_to_waitlist 来执行 add_to_waitlist 程序。我们使用 crate 从 crate 根开始就类似于在 shell 中使用 / 从文件系统根开始。

The first time we call the `add_to_waitlist` function in `eat_at_restaurant`,
we use an absolute path. The `add_to_waitlist` function is defined in the same
crate as `eat_at_restaurant`, which means we can use the `crate` keyword to
start an absolute path. We then include each of the successive modules until we
make our way to `add_to_waitlist`. You can imagine a filesystem with the same
structure: we’d specify the path `/front_of_house/hosting/add_to_waitlist` to
run the `add_to_waitlist` program; using the `crate` name to start from the
crate root is like using `/` to start from the filesystem root in your shell.

第二种方式，我们在 eat_at_restaurant 中调用 add_to_waitlist，使用的是相对路径。这个路径以 front_of_house 为起始，这个模块在模块树中，与 eat_at_restaurant 定义在同一层级。与之等价的文件系统路径就是 front_of_house/hosting/add_to_waitlist。以模块名开头意味着该路径是相对路径。

The second time we call `add_to_waitlist` in `eat_at_restaurant`, we use a
relative path. The path starts with `front_of_house`, the name of the module
defined at the same level of the module tree as `eat_at_restaurant`. Here the
filesystem equivalent would be using the path
`front_of_house/hosting/add_to_waitlist`. Starting with a module name means
that the path is relative.

选择使用相对路径还是绝对路径，要取决于你的项目，也取决于你是更倾向于将项的定义代码与使用该项的代码分开来移动，还是一起移动。举一个例子，如果我们要将 front_of_house 模块和 eat_at_restaurant 函数一起移动到一个名为 customer_experience 的模块中，我们需要更新 add_to_waitlist 的绝对路径，但是相对路径还是可用的。然而，如果我们要将 eat_at_restaurant 函数单独移到一个名为 dining 的模块中，还是可以使用原本的绝对路径来调用 add_to_waitlist，但是相对路径必须要更新。我们更倾向于使用绝对路径，因为把代码定义和项调用各自独立地移动是更常见的。

Choosing whether to use a relative or absolute path is a decision you’ll make
based on your project, and depends on whether you’re more likely to move item
definition code separately from or together with the code that uses the item.
For example, if we move the `front_of_house` module and the `eat_at_restaurant`
function into a module named `customer_experience`, we’d need to update the
absolute path to `add_to_waitlist`, but the relative path would still be valid.
However, if we moved the `eat_at_restaurant` function separately into a module
named `dining`, the absolute path to the `add_to_waitlist` call would stay the
same, but the relative path would need to be updated. Our preference in general
is to specify absolute paths because it’s more likely we’ll want to move code
definitions and item calls independently of each other.

让我们试着编译一下示例 7-3，并查明为何不能编译！示例 7-4 展示了这个错误。

Let’s try to compile Listing 7-3 and find out why it won’t compile yet! The
error we get is shown in Listing 7-4.

```console
$ cargo build
   Compiling restaurant v0.1.0 (file:///projects/restaurant)
error[E0603]: module `hosting` is private
 --> src/lib.rs:9:28
  |
9 |     crate::front_of_house::hosting::add_to_waitlist();
  |                            ^^^^^^^  --------------- function `add_to_waitlist` is not publicly re-exported
  |                            |
  |                            private module
  |
note: the module `hosting` is defined here
 --> src/lib.rs:2:5
  |
2 |     mod hosting {
  |     ^^^^^^^^^^^

error[E0603]: module `hosting` is private
  --> src/lib.rs:12:21
   |
12 |     front_of_house::hosting::add_to_waitlist();
   |                     ^^^^^^^  --------------- function `add_to_waitlist` is not publicly re-exported
   |                     |
   |                     private module
   |
note: the module `hosting` is defined here
  --> src/lib.rs:2:5
   |
2  |     mod hosting {
   |     ^^^^^^^^^^^

For more information about this error, try `rustc --explain E0603`.
error: could not compile `restaurant` (lib) due to 2 previous errors

```

<span class="caption">
示例 7-4: 构建示例 7-3 出现的编译器错误
Listing 7-4: Compiler errors from building the code in
Listing 7-3</span>

错误信息说 hosting 模块是私有的。换句话说，我们拥有 hosting 模块和 add_to_waitlist 函数的正确路径，但是 Rust 不让我们使用，因为它不能访问私有片段。在 Rust 中，默认所有项（函数、方法、结构体、枚举、模块和常量）对父模块都是私有的。如果希望创建一个私有函数或结构体，你可以将其放入一个模块。

The error messages say that module `hosting` is private. In other words, we
have the correct paths for the `hosting` module and the `add_to_waitlist`
function, but Rust won’t let us use them because it doesn’t have access to the
private sections. In Rust, all items (functions, methods, structs, enums,
modules, and constants) are private to parent modules by default. If you want
to make an item like a function or struct private, you put it in a module.

父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用它们父模块中的项。这是因为子模块封装并隐藏了它们的实现详情，但是子模块可以看到它们定义的上下文。继续拿餐馆作比喻，把私有性规则想象成餐馆的后台办公室：餐馆内的事务对餐厅顾客来说是不可知的，但办公室经理可以洞悉其经营的餐厅并在其中做任何事情。

Items in a parent module can’t use the private items inside child modules, but
items in child modules can use the items in their ancestor modules. This is
because child modules wrap and hide their implementation details, but the child
modules can see the context in which they’re defined. To continue with our
metaphor, think of the privacy rules as being like the back office of a
restaurant: what goes on in there is private to restaurant customers, but
office managers can see and do everything in the restaurant they operate.

Rust 选择以这种方式来实现模块系统功能，因此默认隐藏内部实现细节。这样一来，你就知道可以更改内部代码的哪些部分而不会破坏外部代码。不过 Rust 也确实提供了通过使用 pub 关键字来创建公共项，使子模块的内部部分暴露给上级模块。

Rust chose to have the module system function this way so that hiding inner
implementation details is the default. That way, you know which parts of the
inner code you can change without breaking outer code. However, Rust does give
you the option to expose inner parts of child modules’ code to outer ancestor
modules by using the `pub` keyword to make an item public.

### Exposing Paths with the `pub` Keyword 使用 pub 关键字暴露路径

让我们回头看一下示例 7-4 的错误，它告诉我们 hosting 模块是私有的。我们想让父模块中的 eat_at_restaurant 函数可以访问子模块中的 add_to_waitlist 函数，因此我们使用 pub 关键字来标记 hosting 模块，如示例 7-5 所示。

Let’s return to the error in Listing 7-4 that told us the `hosting` module is
private. We want the `eat_at_restaurant` function in the parent module to have
access to the `add_to_waitlist` function in the child module, so we mark the
`hosting` module with the `pub` keyword, as shown in Listing 7-5.

<span class="filename">Filename: src/lib.rs</span>

```rust
mod front_of_house {
    pub mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

<span class="caption">
示例 7-5: 使用 pub 关键字声明 hosting 模块使其可在 eat_at_restaurant 使用
Listing 7-5: Declaring the `hosting` module as `pub` to
use it from `eat_at_restaurant`</span>

不幸的是，示例 7-5 的代码编译仍然有错误，如示例 7-6 所示。

Unfortunately, the code in Listing 7-5 still results in an error, as shown in
Listing 7-6.

```console
$ cargo build
   Compiling restaurant v0.1.0 (file:///projects/restaurant)
error[E0603]: function `add_to_waitlist` is private
 --> src/lib.rs:9:37
  |
9 |     crate::front_of_house::hosting::add_to_waitlist();
  |                                     ^^^^^^^^^^^^^^^ private function
  |
note: the function `add_to_waitlist` is defined here
 --> src/lib.rs:3:9
  |
3 |         fn add_to_waitlist() {}
  |         ^^^^^^^^^^^^^^^^^^^^

error[E0603]: function `add_to_waitlist` is private
  --> src/lib.rs:12:30
   |
12 |     front_of_house::hosting::add_to_waitlist();
   |                              ^^^^^^^^^^^^^^^ private function
   |
note: the function `add_to_waitlist` is defined here
  --> src/lib.rs:3:9
   |
3  |         fn add_to_waitlist() {}
   |         ^^^^^^^^^^^^^^^^^^^^

For more information about this error, try `rustc --explain E0603`.
error: could not compile `restaurant` (lib) due to 2 previous errors

```

<span class="caption">
示例 7-6: 构建示例 7-5 出现的编译器错误
Listing 7-6: Compiler errors from building the code in
Listing 7-5</span>

发生了什么？在 mod hosting 前添加了 pub 关键字，使其变成公有的。伴随着这种变化，如果我们可以访问 front_of_house，那我们也可以访问 hosting。但是 hosting 的 内容（contents）仍然是私有的；这表明使模块公有并不使其内容也是公有的。模块上的 pub 关键字只允许其父模块引用它，而不允许访问内部代码。因为模块是一个容器，只是将模块变为公有能做的其实并不太多；同时需要更深入地选择将一个或多个项变为公有。

What happened? Adding the `pub` keyword in front of `mod hosting` makes the
module public. With this change, if we can access `front_of_house`, we can
access `hosting`. But the _contents_ of `hosting` are still private; making the
module public doesn’t make its contents public. The `pub` keyword on a module
only lets code in its ancestor modules refer to it, not access its inner code.
Because modules are containers, there’s not much we can do by only making the
module public; we need to go further and choose to make one or more of the
items within the module public as well.

示例 7-6 中的错误说，add_to_waitlist 函数是私有的。私有性规则不但应用于模块，还应用于结构体、枚举、函数和方法。

The errors in Listing 7-6 say that the `add_to_waitlist` function is private.
The privacy rules apply to structs, enums, functions, and methods as well as
modules.

让我们继续将 pub 关键字放置在 add_to_waitlist 函数的定义之前，使其变成公有。如示例 7-7 所示。

Let’s also make the `add_to_waitlist` function public by adding the `pub`
keyword before its definition, as in Listing 7-7.

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

<span class="caption">
示例 7-7: 为 mod hosting 和 fn add_to_waitlist 添加 pub 关键字使它们可以在 eat_at_restaurant 函数中被调用
Listing 7-7: Adding the `pub` keyword to `mod hosting`
and `fn add_to_waitlist` lets us call the function from
`eat_at_restaurant`</span>

现在代码可以编译通过了！为了了解为何增加 pub 关键字使得我们可以在 add_to_waitlist 中调用这些路径与私有性规则有关，让我们看看绝对路径和相对路径。

Now the code will compile! To see why adding the `pub` keyword lets us use
these paths in `add_to_waitlist` with respect to the privacy rules, let’s look
at the absolute and the relative paths.

在绝对路径，我们从 crate 也就是 crate 根开始。crate 根中定义了 front_of_house 模块。虽然 front_of_house 模块不是公有的，不过因为 eat_at_restaurant 函数与 front_of_house 定义于同一模块中（即，eat_at_restaurant 和 front_of_house 是兄弟），我们可以从 eat_at_restaurant 中引用 front_of_house。接下来是使用 pub 标记的 hosting 模块。我们可以访问 hosting 的父模块，所以可以访问 hosting。最后，add_to_waitlist 函数被标记为 pub ，我们可以访问其父模块，所以这个函数调用是有效的！

In the absolute path, we start with `crate`, the root of our crate’s module
tree. The `front_of_house` module is defined in the crate root. While
`front_of_house` isn’t public, because the `eat_at_restaurant` function is
defined in the same module as `front_of_house` (that is, `eat_at_restaurant`
and `front_of_house` are siblings), we can refer to `front_of_house` from
`eat_at_restaurant`. Next is the `hosting` module marked with `pub`. We can
access the parent module of `hosting`, so we can access `hosting`. Finally, the
`add_to_waitlist` function is marked with `pub` and we can access its parent
module, so this function call works!

在相对路径，其逻辑与绝对路径相同，除了第一步：不同于从 crate 根开始，路径从 front_of_house 开始。front_of_house 模块与 eat_at_restaurant 定义于同一模块，所以从 eat_at_restaurant 中开始定义的该模块相对路径是有效的。接下来因为 hosting 和 add_to_waitlist 被标记为 pub，路径其余的部分也是有效的，因此函数调用也是有效的！

In the relative path, the logic is the same as the absolute path except for the
first step: rather than starting from the crate root, the path starts from
`front_of_house`. The `front_of_house` module is defined within the same module
as `eat_at_restaurant`, so the relative path starting from the module in which
`eat_at_restaurant` is defined works. Then, because `hosting` and
`add_to_waitlist` are marked with `pub`, the rest of the path works, and this
function call is valid!

如果你计划共享你的库 crate 以便其它项目可以使用你的代码，公有 API 将是决定 crate 用户如何与你代码交互的契约。关于管理公有 API 的修改以便被人更容易依赖你的库有着很多考量。这些考量超出了本书的范畴；如果你对这些话题感兴趣，请查阅 The Rust API Guidelines

If you plan on sharing your library crate so other projects can use your code,
your public API is your contract with users of your crate that determines how
they can interact with your code. There are many considerations around managing
changes to your public API to make it easier for people to depend on your
crate. These considerations are out of the scope of this book; if you’re
interested in this topic, see [The Rust API Guidelines][api-guidelines].

> #### Best Practices for Packages with a Binary and a Library 二进制和库 crate 包的最佳实践
>
> 我们提到过包可以同时包含一个 src/main.rs 二进制 crate 根和一个 src/lib.rs 库 crate 根，并且这两个 crate 默认以包名来命名。通常，这种包含二进制 crate 和库 crate 的模式的包，在二进制 crate 中只有足够的代码来启动一个可执行文件，可执行文件调用库 crate 的代码。又因为库 crate 可以共享，这使得其它项目从包提供的大部分功能中受益。
> We mentioned a package can contain both a _src/main.rs_ binary crate root as
> well as a _src/lib.rs_ library crate root, and both crates will have the
> package name by default. Typically, packages with this pattern of containing
> both a library and a binary crate will have just enough code in the binary
> crate to start an executable that calls code with the library crate. This
> lets other projects benefit from the most functionality that the package
> provides, because the library crate’s code can be shared.
>
> 模块树应该定义在 src/lib.rs 中。这样通过以包名开头的路径，公有项就可以在二进制 crate 中使用。二进制 crate 就完全变成了同其它 外部 crate 一样的库 crate 的用户：它只能使用公有 API。这有助于你设计一个好的 API；你不仅仅是作者，也是用户！
> The module tree should be defined in _src/lib.rs_. Then, any public items can
> be used in the binary crate by starting paths with the name of the package.
> The binary crate becomes a user of the library crate just like a completely
> external crate would use the library crate: it can only use the public API.
> This helps you design a good API; not only are you the author, you’re also a
> client!
>
> 在第十二章我们会通过一个同时包含二进制 crate 和库 crate 的命令行程序来展示这些包组织上的实践。
> In [Chapter 12][ch12]<!-- ignore -->, we’ll demonstrate this organizational
> practice with a command-line program that will contain both a binary crate
> and a library crate.

### Starting Relative Paths with `super` super 开始的相对路径

我们可以通过在路径的开头使用 super ，从父模块开始构建相对路径，而不是从当前模块或者 crate 根开始。这类似以 .. 语法开始一个文件系统路径。使用 super 允许我们引用父模块中的已知项，这使得重新组织模块树变得更容易 —— 当模块与父模块关联的很紧密，但某天父模块可能要移动到模块树的其它位置。

We can construct relative paths that begin in the parent module, rather than
the current module or the crate root, by using `super` at the start of the
path. This is like starting a filesystem path with the `..` syntax. Using
`super` allows us to reference an item that we know is in the parent module,
which can make rearranging the module tree easier when the module is closely
related to the parent, but the parent might be moved elsewhere in the module
tree someday.

考虑一下示例 7-8 中的代码，它模拟了厨师更正了一个错误订单，并亲自将其提供给客户的情况。back_of_house 模块中的定义的 fix_incorrect_order 函数通过指定的 super 起始的 deliver_order 路径，来调用父模块中的 deliver_order 函数：

Consider the code in Listing 7-8 that models the situation in which a chef
fixes an incorrect order and personally brings it out to the customer. The
function `fix_incorrect_order` defined in the `back_of_house` module calls the
function `deliver_order` defined in the parent module by specifying the path to
`deliver_order` starting with `super`:

<span class="filename">Filename: src/lib.rs</span>

```rust,test_harness
fn deliver_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::deliver_order();
    }

    fn cook_order() {}
}
```

<span class="caption">
示例 7-8: 使用以 super 开头的相对路径从父目录开始调用函数
Listing 7-8: Calling a function using a relative path
starting with `super`</span>

fix_incorrect_order 函数在 back_of_house 模块中，所以我们可以使用 super 进入 back_of_house 父模块，也就是本例中的 crate 根。在这里，我们可以找到 deliver_order。成功！我们认为 back_of_house 模块和 deliver_order 函数之间可能具有某种关联关系，并且，如果我们要重新组织这个 crate 的模块树，需要一起移动它们。因此，我们使用 super，这样一来，如果这些代码被移动到了其他模块，我们只需要更新很少的代码。

The `fix_incorrect_order` function is in the `back_of_house` module, so we can
use `super` to go to the parent module of `back_of_house`, which in this case
is `crate`, the root. From there, we look for `deliver_order` and find it.
Success! We think the `back_of_house` module and the `deliver_order` function
are likely to stay in the same relationship to each other and get moved
together should we decide to reorganize the crate’s module tree. Therefore, we
used `super` so we’ll have fewer places to update code in the future if this
code gets moved to a different module.

### Making Structs and Enums Public 创建公有的结构体和枚举

我们还可以使用 pub 来设计公有的结构体和枚举，不过关于在结构体和枚举上使用 pub 还有一些额外的细节需要注意。如果我们在一个结构体定义的前面使用了 pub ，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的。我们可以根据情况决定每个字段是否公有。在示例 7-9 中，我们定义了一个公有结构体 back_of_house:Breakfast，其中有一个公有字段 toast 和私有字段 seasonal_fruit。这个例子模拟的情况是，在一家餐馆中，顾客可以选择随餐附赠的面包类型，但是厨师会根据季节和库存情况来决定随餐搭配的水果。餐馆可用的水果变化是很快的，所以顾客不能选择水果，甚至无法看到他们将会得到什么水果。

We can also use `pub` to designate structs and enums as public, but there are a
few details extra to the usage of `pub` with structs and enums. If we use `pub`
before a struct definition, we make the struct public, but the struct’s fields
will still be private. We can make each field public or not on a case-by-case
basis. In Listing 7-9, we’ve defined a public `back_of_house::Breakfast` struct
with a public `toast` field but a private `seasonal_fruit` field. This models
the case in a restaurant where the customer can pick the type of bread that
comes with a meal, but the chef decides which fruit accompanies the meal based
on what’s in season and in stock. The available fruit changes quickly, so
customers can’t choose the fruit or even see which fruit they’ll get.

<span class="filename">Filename: src/lib.rs</span>

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    // 在夏天订购一个黑麦土司作为早餐
    let mut meal = back_of_house::Breakfast::summer("Rye");
    // 改变主意更换想要面包的类型
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);

    // 如果取消下一行的注释代码不能编译；
    // 不允许查看或修改早餐附带的季节水果
    // meal.seasonal_fruit = String::from("blueberries");
}
```

<span class="caption">
示例 7-9: 带有公有和私有字段的结构体
Listing 7-9: A struct with some public fields and some
private fields</span>

因为 back_of_house::Breakfast 结构体的 toast 字段是公有的，所以我们可以在 eat_at_restaurant 中使用点号来随意的读写 toast 字段。注意，我们不能在 eat_at_restaurant 中使用 seasonal_fruit 字段，因为 seasonal_fruit 是私有的。尝试去除那一行修改 seasonal_fruit 字段值的代码的注释，看看你会得到什么错误！

Because the `toast` field in the `back_of_house::Breakfast` struct is public,
in `eat_at_restaurant` we can write and read to the `toast` field using dot
notation. Notice that we can’t use the `seasonal_fruit` field in
`eat_at_restaurant` because `seasonal_fruit` is private. Try uncommenting the
line modifying the `seasonal_fruit` field value to see what error you get!

还请注意一点，因为 back_of_house::Breakfast 具有私有字段，所以这个结构体需要提供一个公共的关联函数来构造 Breakfast 的实例 (这里我们命名为 summer)。如果 Breakfast 没有这样的函数，我们将无法在 eat_at_restaurant 中创建 Breakfast 实例，因为我们不能在 eat_at_restaurant 中设置私有字段 seasonal_fruit 的值。

Also, note that because `back_of_house::Breakfast` has a private field, the
struct needs to provide a public associated function that constructs an
instance of `Breakfast` (we’ve named it `summer` here). If `Breakfast` didn’t
have such a function, we couldn’t create an instance of `Breakfast` in
`eat_at_restaurant` because we couldn’t set the value of the private
`seasonal_fruit` field in `eat_at_restaurant`.

与之相反，如果我们将枚举设为公有，则它的所有成员都将变为公有。我们只需要在 enum 关键字前面加上 pub，就像示例 7-10 展示的那样。

In contrast, if we make an enum public, all of its variants are then public. We
only need the `pub` before the `enum` keyword, as shown in Listing 7-10.

<span class="filename">Filename: src/lib.rs</span>

```rust
mod back_of_house {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

<span class="caption">
示例 7-10: 设计公有枚举，使其所有成员公有
Listing 7-10: Designating an enum as public makes all its
variants public</span>

因为我们创建了名为 Appetizer 的公有枚举，所以我们可以在 eat_at_restaurant 中使用 Soup 和 Salad 成员。

Because we made the `Appetizer` enum public, we can use the `Soup` and `Salad`
variants in `eat_at_restaurant`.

如果枚举成员不是公有的，那么枚举会显得用处不大；给枚举的所有成员挨个添加 pub 是很令人恼火的，因此枚举成员默认就是公有的。结构体通常使用时，不必将它们的字段公有化，因此结构体遵循常规，内容全部是私有的，除非使用 pub 关键字。

Enums aren’t very useful unless their variants are public; it would be annoying
to have to annotate all enum variants with `pub` in every case, so the default
for enum variants is to be public. Structs are often useful without their
fields being public, so struct fields follow the general rule of everything
being private by default unless annotated with `pub`.

还有一种使用 pub 的场景我们还没有涉及到，那就是我们最后要讲的模块功能：use 关键字。我们将先单独介绍 use，然后展示如何结合使用 pub 和 use。

There’s one more situation involving `pub` that we haven’t covered, and that is
our last module system feature: the `use` keyword. We’ll cover `use` by itself
first, and then we’ll show how to combine `pub` and `use`.

[pub]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword
[api-guidelines]: https://rust-lang.github.io/api-guidelines/
[ch12]: ch12-00-an-io-project.html
