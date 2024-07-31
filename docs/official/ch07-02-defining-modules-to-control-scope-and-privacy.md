## Defining Modules to Control Scope and Privacy 定义模块来控制作用域与私有性

在本节，我们将讨论模块和其它一些关于模块系统的部分，如允许你命名项的 路径（paths）；用来将路径引入作用域的 use 关键字；以及使项变为公有的 pub 关键字。我们还将讨论 as 关键字、外部包和 glob 运算符。现在，让我们把注意力放在模块上！

In this section, we’ll talk about modules and other parts of the module system,
namely _paths_ that allow you to name items; the `use` keyword that brings a
path into scope; and the `pub` keyword to make items public. We’ll also discuss
the `as` keyword, external packages, and the glob operator.

首先，我们将从一系列的规则开始，在你未来组织代码的时候，这些规则可被用作简单的参考。接下来我们将会详细的解释每条规则。

First, we’re going to start with a list of rules for easy reference when you’re
organizing your code in the future. Then we’ll explain each of the rules in
detail.

### Modules Cheat Sheet 模块小抄

这里我们提供一个简单的参考，用来解释模块、路径、use 关键词和 pub 关键词如何在编译器中工作，以及大部分开发者如何组织他们的代码。我们将在本章节中举例说明每条规则，不过这是一个解释模块工作方式的良好参考。

Here we provide a quick reference on how modules, paths, the `use` keyword, and
the `pub` keyword work in the compiler, and how most developers organize their
code. We’ll be going through examples of each of these rules throughout this
chapter, but this is a great place to refer to as a reminder of how modules
work.

- **Start from the crate root**: When compiling a crate, the compiler first
  looks in the crate root file (usually _src/lib.rs_ for a library crate or
  _src/main.rs_ for a binary crate) for code to compile. 从 crate 根节点开始: 当编译一个 crate, 编译器首先在 crate 根文件（通常，对于一个库 crate 而言是 src/lib.rs，对于一个二进制 crate 而言是 src/main.rs）中寻找需要被编译的代码。
- **Declaring modules**: In the crate root file, you can declare new modules;
  say, you declare a “garden” module with `mod garden;`. The compiler will look
  for the module’s code in these places: 声明模块: 在 crate 根文件中，你可以声明一个新模块；比如，你用 mod garden;声明了一个叫做 garden 的模块。编译器会在下列路径中寻找模块代码：
  - Inline, within curly brackets that replace the semicolon following `mod
garden` 内联，在大括号中，当 mod garden 后方不是一个分号而是一个大括号
  - In the file _src/garden.rs_ 在文件 src/garden.rs
  - In the file _src/garden/mod.rs_ 在文件 src/garden/mod.rs
- **Declaring submodules**: In any file other than the crate root, you can
  declare submodules. For example, you might declare `mod vegetables;` in
  _src/garden.rs_. The compiler will look for the submodule’s code within the
  directory named for the parent module in these places: 声明子模块: 在除了 crate 根节点以外的其他文件中，你可以定义子模块。比如，你可能在 src/garden.rs 中定义了 mod vegetables;。编译器会在以父模块命名的目录中寻找子模块代码：
  - Inline, directly following `mod vegetables`, within curly brackets instead
    of the semicolon 内联，在大括号中，当 mod vegetables 后方不是一个分号而是一个大括号
  - In the file _src/garden/vegetables.rs_ 在文件 src/garden/vegetables.rs
  - In the file _src/garden/vegetables/mod.rs_ 在文件 src/garden/vegetables/mod.rs
- **Paths to code in modules**: Once a module is part of your crate, you can
  refer to code in that module from anywhere else in that same crate, as long
  as the privacy rules allow, using the path to the code. For example, an
  `Asparagus` type in the garden vegetables module would be found at
  `crate::garden::vegetables::Asparagus`. 模块中的代码路径: 一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。举例而言，一个 garden vegetables 模块下的 Asparagus 类型可以在 crate::garden::vegetables::Asparagus 被找到。
- **Private vs public**: Code within a module is private from its parent
  modules by default. To make a module public, declare it with `pub mod`
  instead of `mod`. To make items within a public module public as well, use
  `pub` before their declarations. 私有 vs 公用: 一个模块里的代码默认对其父模块私有。为了使一个模块公用，应当在声明时使用 pub mod 替代 mod。为了使一个公用模块内部的成员公用，应当在声明前使用 pub。
- **The `use` keyword**: Within a scope, the `use` keyword creates shortcuts to
  items to reduce repetition of long paths. In any scope that can refer to
  `crate::garden::vegetables::Asparagus`, you can create a shortcut with `use
crate::garden::vegetables::Asparagus;` and from then on you only need to
  write `Asparagus` to make use of that type in the scope. use 关键字: 在一个作用域内，use 关键字创建了一个成员的快捷方式，用来减少长路径的重复。在任何可以引用 crate::garden::vegetables::Asparagus 的作用域，你可以通过 use crate::garden::vegetables::Asparagus;创建一个快捷方式，然后你就可以在作用域中只写 Asparagus 来使用该类型。

这里我们创建一个名为 backyard 的二进制 crate 来说明这些规则。该 crate 的路径同样命名为 backyard，该路径包含了这些文件和目录：

Here we create a binary crate named `backyard` that illustrates these rules. The
crate’s directory, also named `backyard`, contains these files and directories:

```text
backyard
├── Cargo.lock
├── Cargo.toml
└── src
    ├── garden
    │   └── vegetables.rs
    ├── garden.rs
    └── main.rs
```

这个例子中的 crate 根文件是 src/main.rs，该文件包括了：

The crate root file in this case is _src/main.rs_, and it contains:

<span class="filename">Filename: src/main.rs</span>

```rust
use crate::garden::vegetables::Asparagus;

pub mod garden;

fn main() {
    let plant = Asparagus {};
    println!("I'm growing {plant:?}!");
}
```

pub mod garden;行告诉编译器应该包含在 src/garden.rs 文件中发现的代码：

The `pub mod garden;` line tells the compiler to include the code it finds in
_src/garden.rs_, which is:

<span class="filename">Filename: src/garden.rs</span>

```rust
pub mod vegetables;
```

在此处， pub mod vegetables;意味着在 src/garden/vegetables.rs 中的代码也应该被包括。这些代码是：

Here, `pub mod vegetables;` means the code in _src/garden/vegetables.rs_ is
included too. That code is:

```rust
#[derive(Debug)]
pub struct Asparagus {}
```

现在让我们深入了解这些规则的细节并在实际中演示它们！

Now let’s get into the details of these rules and demonstrate them in action!

### Grouping Related Code in Modules 在模块中对相关代码进行分组

模块 让我们可以将一个 crate 中的代码进行分组，以提高可读性与重用性。因为一个模块中的代码默认是私有的，所以还可以利用模块控制项的 私有性。私有项是不可为外部使用的内在详细实现。我们也可以将模块和它其中的项标记为公开的，这样，外部代码就可以使用并依赖它们。

_Modules_ let us organize code within a crate for readability and easy reuse.
Modules also allow us to control the _privacy_ of items, because code within a
module is private by default. Private items are internal implementation details
not available for outside use. We can choose to make modules and the items
within them public, which exposes them to allow external code to use and depend
on them.

例如， 我们要编写一个提供餐厅功能的库。我们要定义标记方法且在组织代码的时候让方法体为空，而不是直接实现整个餐厅的功能。

As an example, let’s write a library crate that provides the functionality of a
restaurant. We’ll define the signatures of functions but leave their bodies
empty to concentrate on the organization of the code, rather than the
implementation of a restaurant.

在餐饮业，餐馆中会有一些地方被称之为 前台（front of house），还有另外一些地方被称之为 后台（back of house）。前台是招待顾客的地方，在这里，店主可以为顾客安排座位，服务员接受顾客下单和付款，调酒师会制作饮品。后台则是由厨师工作的厨房，洗碗工的工作地点，以及经理做行政工作的地方组成。

In the restaurant industry, some parts of a restaurant are referred to as
_front of house_ and others as _back of house_. Front of house is where
customers are; this encompasses where the hosts seat customers, servers take
orders and payment, and bartenders make drinks. Back of house is where the
chefs and cooks work in the kitchen, dishwashers clean up, and managers do
administrative work.

我们可以将函数放置到嵌套的模块中，来使我们的 crate 结构与实际的餐厅结构相同。通过执行 cargo new --lib restaurant，来创建一个新的名为 restaurant 的库。然后将示例 7-1 中所罗列出来的代码放入 src/lib.rs 中，来定义一些模块和函数。

To structure our crate in this way, we can organize its functions into nested
modules. Create a new library named `restaurant` by running `cargo new
restaurant --lib`; then enter the code in Listing 7-1 into _src/lib.rs_ to
define some modules and function signatures. Here’s the front of house section:

<span class="filename">Filename: src/lib.rs</span>

```rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn serve_order() {}

        fn take_payment() {}
    }
}
```

<span class="caption">
示例 7-1：一个包含了其他内置了函数的模块的 front_of_house 模块
Listing 7-1: A `front_of_house` module containing other
modules that then contain functions</span>

我们定义一个模块，是以 mod 关键字为起始，然后指定模块的名字（本例中叫做 front_of_house），并且用花括号包围模块的主体。在模块内，我们还可以定义其他的模块，就像本例中的 hosting 和 serving 模块。模块还可以保存一些定义的其他项，比如结构体、枚举、常量、特性、或者函数。

We define a module with the `mod` keyword followed by the name of the module
(in this case, `front_of_house`). The body of the module then goes inside curly
brackets. Inside modules, we can place other modules, as in this case with the
modules `hosting` and `serving`. Modules can also hold definitions for other
items, such as structs, enums, constants, traits, and—as in Listing
7-1—functions.

通过使用模块，我们可以将相关的定义分组到一起，并指出它们为什么相关。程序员可以通过使用这段代码，更加容易地找到他们想要的定义，因为他们可以基于分组来对代码进行导航，而不需要阅读所有的定义。程序员向这段代码中添加一个新的功能时，他们也会知道代码应该放置在何处，可以保持程序的组织性

By using modules, we can group related definitions together and name why
they’re related. Programmers using this code can navigate the code based on the
groups rather than having to read through all the definitions, making it easier
to find the definitions relevant to them. Programmers adding new functionality
to this code would know where to place the code to keep the program organized.

在前面我们提到了，src/main.rs 和 src/lib.rs 叫做 crate 根。之所以这样叫它们是因为这两个文件的内容都分别在 crate 模块结构的根组成了一个名为 crate 的模块，该结构被称为 模块树（module tree）。

Earlier, we mentioned that _src/main.rs_ and _src/lib.rs_ are called crate
roots. The reason for their name is that the contents of either of these two
files form a module named `crate` at the root of the crate’s module structure,
known as the _module tree_.

示例 7-2 展示了示例 7-1 中的模块树的结构。

Listing 7-2 shows the module tree for the structure in Listing 7-1.

```text
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

<span class="caption">
示例 7-2: 示例 7-1 中代码的模块树
Listing 7-2: The module tree for the code in Listing
7-1</span>

这个树展示了一些模块是如何被嵌入到另一个模块的（例如，hosting 嵌套在 front_of_house 中）。这个树还展示了一些模块是互为 兄弟（siblings）的，这意味着它们定义在同一模块中（hosting 和 serving 被一起定义在 front_of_house 中）。继续沿用家庭关系的比喻，如果一个模块 A 被包含在模块 B 中，我们将模块 A 称为模块 B 的 子（child），模块 B 则是模块 A 的 父（parent）。注意，整个模块树都植根于名为 crate 的隐式模块下。

This tree shows how some of the modules nest inside one another; for example,
`hosting` nests inside `front_of_house`. The tree also shows that some modules
are _siblings_ to each other, meaning they’re defined in the same module;
`hosting` and `serving` are siblings defined within `front_of_house`. If module
A is contained inside module B, we say that module A is the _child_ of module B
and that module B is the _parent_ of module A. Notice that the entire module
tree is rooted under the implicit module named `crate`.

这个模块树可能会令你想起电脑上文件系统的目录树；这是一个非常恰当的类比！就像文件系统的目录，你可以使用模块来组织你的代码。并且，就像目录中的文件，我们需要一种方法来找到模块。

The module tree might remind you of the filesystem’s directory tree on your
computer; this is a very apt comparison! Just like directories in a filesystem,
you use modules to organize your code. And just like files in a directory, we
need a way to find our modules.
