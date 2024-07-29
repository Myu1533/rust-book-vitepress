## Defining an Enum 定义枚举

结构体给予你将字段和数据聚合在一起的方法，像 Rectangle 结构体有 width 和 height 两个字段。而枚举给予你一个途径去声明某个值是一个集合中的一员。比如，我们想让 Rectangle 是一些形状的集合，包含 Circle 和 Triangle 。为了做到这个，Rust 提供了枚举类型。

Where structs give you a way of grouping together related fields and data, like
a `Rectangle` with its `width` and `height`, enums give you a way of saying a
value is one of a possible set of values. For example, we may want to say that
`Rectangle` is one of a set of possible shapes that also includes `Circle` and
`Triangle`. To do this, Rust allows us to encode these possibilities as an enum.

让我们看看一个需要诉诸于代码的场景，来考虑为何此时使用枚举更为合适且实用。假设我们要处理 IP 地址。目前被广泛使用的两个主要 IP 标准：IPv4（version four）和 IPv6（version six）。这是我们的程序可能会遇到的所有可能的 IP 地址类型：所以可以 枚举 出所有可能的值，这也正是此枚举名字的由来。

Let’s look at a situation we might want to express in code and see why enums
are useful and more appropriate than structs in this case. Say we need to work
with IP addresses. Currently, two major standards are used for IP addresses:
version four and version six. Because these are the only possibilities for an
IP address that our program will come across, we can _enumerate_ all possible
variants, which is where enumeration gets its name.

任何一个 IP 地址要么是 IPv4 的要么是 IPv6 的，而且不能两者都是。IP 地址的这个特性使得枚举数据结构非常适合这个场景，因为枚举值只可能是其中一个成员。IPv4 和 IPv6 从根本上讲仍是 IP 地址，所以当代码在处理适用于任何类型的 IP 地址的场景时应该把它们当作相同的类型。

Any IP address can be either a version four or a version six address, but not
both at the same time. That property of IP addresses makes the enum data
structure appropriate because an enum value can only be one of its variants.
Both version four and version six addresses are still fundamentally IP
addresses, so they should be treated as the same type when the code is handling
situations that apply to any kind of IP address.

可以通过在代码中定义一个 IpAddrKind 枚举来表现这个概念并列出可能的 IP 地址类型，V4 和 V6。这被称为枚举的 成员（variants）：

We can express this concept in code by defining an `IpAddrKind` enumeration and
listing the possible kinds an IP address can be, `V4` and `V6`. These are the
variants of the enum:

```rust
enum IpAddrKind {
    V4,
    V6,
}

```

现在 IpAddrKind 就是一个可以在代码中使用的自定义数据类型了。

`IpAddrKind` is now a custom data type that we can use elsewhere in our code.

### Enum Values 枚举值

可以像这样创建 IpAddrKind 两个不同成员的实例：

We can create instances of each of the two variants of `IpAddrKind` like this:

```rust
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
```

注意枚举的成员位于其标识符的命名空间中，并使用两个冒号分开。这么设计的益处是现在 IpAddrKind::V4 和 IpAddrKind::V6 都是 IpAddrKind 类型的。例如，接着可以定义一个函数来获取任何 IpAddrKind：

Note that the variants of the enum are namespaced under its identifier, and we
use a double colon to separate the two. This is useful because now both values
`IpAddrKind::V4` and `IpAddrKind::V6` are of the same type: `IpAddrKind`. We
can then, for instance, define a function that takes any `IpAddrKind`:

```rust
fn route(ip_kind: IpAddrKind) {}
```

现在可以使用任一成员来调用这个函数：

And we can call this function with either variant:

```rust
    route(IpAddrKind::V4);
    route(IpAddrKind::V6);
```

使用枚举甚至还有更多优势。进一步考虑一下我们的 IP 地址类型，目前没有一个存储实际 IP 地址 数据 的方法；只知道它是什么 类型 的。考虑到已经在第五章学习过结构体了，你可能会像示例 6-1 那样处理这个问题：

Using enums has even more advantages. Thinking more about our IP address type,
at the moment we don’t have a way to store the actual IP address _data_; we
only know what _kind_ it is. Given that you just learned about structs in
Chapter 5, you might be tempted to tackle this problem with structs as shown in
Listing 6-1.

```rust
    enum IpAddrKind {
        V4,
        V6,
    }

    struct IpAddr {
        kind: IpAddrKind,
        address: String,
    }

    let home = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.1"),
    };

    let loopback = IpAddr {
        kind: IpAddrKind::V6,
        address: String::from("::1"),
    };

```

<span class="caption">
示例 6-1：将 IP 地址的数据和 IpAddrKind 成员存储在一个 struct 中
Listing 6-1: Storing the data and `IpAddrKind` variant of
an IP address using a `struct`</span>

这里我们定义了一个有两个字段的结构体 IpAddr：IpAddrKind（之前定义的枚举）类型的 kind 字段和 String 类型 address 字段。我们有这个结构体的两个实例。第一个，home，它的 kind 的值是 IpAddrKind::V4 与之相关联的地址数据是 127.0.0.1。第二个实例，loopback，kind 的值是 IpAddrKind 的另一个成员，V6，关联的地址是 ::1。我们使用了一个结构体来将 kind 和 address 打包在一起，现在枚举成员就与值相关联了。

Here, we’ve defined a struct `IpAddr` that has two fields: a `kind` field that
is of type `IpAddrKind` (the enum we defined previously) and an `address` field
of type `String`. We have two instances of this struct. The first is `home`,
and it has the value `IpAddrKind::V4` as its `kind` with associated address
data of `127.0.0.1`. The second instance is `loopback`. It has the other
variant of `IpAddrKind` as its `kind` value, `V6`, and has address `::1`
associated with it. We’ve used a struct to bundle the `kind` and `address`
values together, so now the variant is associated with the value.

我们可以使用一种更简洁的方式来表达相同的概念，仅仅使用枚举并将数据直接放进每一个枚举成员而不是将枚举作为结构体的一部分。IpAddr 枚举的新定义表明了 V4 和 V6 成员都关联了 String 值：

However, representing the same concept using just an enum is more concise:
rather than an enum inside a struct, we can put data directly into each enum
variant. This new definition of the `IpAddr` enum says that both `V4` and `V6`
variants will have associated `String` values:

```rust
    enum IpAddr {
        V4(String),
        V6(String),
    }

    let home = IpAddr::V4(String::from("127.0.0.1"));

    let loopback = IpAddr::V6(String::from("::1"));

```

我们直接将数据附加到枚举的每个成员上，这样就不需要一个额外的结构体了。这里也很容易看出枚举工作的另一个细节：每一个我们定义的枚举成员的名字也变成了一个构建枚举的实例的函数。也就是说，IpAddr::V4() 是一个获取 String 参数并返回 IpAddr 类型实例的函数调用。作为定义枚举的结果，这些构造函数会自动被定义。

We attach data to each variant of the enum directly, so there is no need for an
extra struct. Here, it’s also easier to see another detail of how enums work:
the name of each enum variant that we define also becomes a function that
constructs an instance of the enum. That is, `IpAddr::V4()` is a function call
that takes a `String` argument and returns an instance of the `IpAddr` type. We
automatically get this constructor function defined as a result of defining the
enum.

用枚举替代结构体还有另一个优势：每个成员可以处理不同类型和数量的数据。IPv4 版本的 IP 地址总是含有四个值在 0 和 255 之间的数字部分。如果我们想要将 V4 地址存储为四个 u8 值而 V6 地址仍然表现为一个 String，这就不能使用结构体了。枚举则可以轻易的处理这个情况：

There’s another advantage to using an enum rather than a struct: each variant
can have different types and amounts of associated data. Version four IP
addresses will always have four numeric components that will have values
between 0 and 255. If we wanted to store `V4` addresses as four `u8` values but
still express `V6` addresses as one `String` value, we wouldn’t be able to with
a struct. Enums handle this case with ease:

```rust
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }

    let home = IpAddr::V4(127, 0, 0, 1);

    let loopback = IpAddr::V6(String::from("::1"));

```

这些代码展示了使用枚举来存储两种不同 IP 地址的几种可能的选择。然而，事实证明存储和编码 IP 地址实在是太常见了以致标准库提供了一个开箱即用的定义！让我们看看标准库是如何定义 IpAddr 的：它正有着跟我们定义和使用的一样的枚举和成员，不过它将成员中的地址数据嵌入到了两个不同形式的结构体中，它们对不同的成员的定义是不同的：

We’ve shown several different ways to define data structures to store version
four and version six IP addresses. However, as it turns out, wanting to store
IP addresses and encode which kind they are is so common that [the standard
library has a definition we can use!][IpAddr]<!-- ignore --> Let’s look at how
the standard library defines `IpAddr`: it has the exact enum and variants that
we’ve defined and used, but it embeds the address data inside the variants in
the form of two different structs, which are defined differently for each
variant:

```rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

这些代码展示了可以将任意类型的数据放入枚举成员中：例如字符串、数字类型或者结构体。甚至可以包含另一个枚举！另外，标准库中的类型通常并不比你设想出来的要复杂多少。

This code illustrates that you can put any kind of data inside an enum variant:
strings, numeric types, or structs, for example. You can even include another
enum! Also, standard library types are often not much more complicated than
what you might come up with.

注意虽然标准库中包含一个 IpAddr 的定义，仍然可以创建和使用我们自己的定义而不会有冲突，因为我们并没有将标准库中的定义引入作用域。第七章会讲到如何导入类型。

Note that even though the standard library contains a definition for `IpAddr`,
we can still create and use our own definition without conflict because we
haven’t brought the standard library’s definition into our scope. We’ll talk
more about bringing types into scope in Chapter 7.

来看看示例 6-2 中的另一个枚举的例子：它的成员中内嵌了多种多样的类型：

Let’s look at another example of an enum in Listing 6-2: this one has a wide
variety of types embedded in its variants.

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

```

<span class="caption">
示例 6-2：一个 Message 枚举，其每个成员都存储了不同数量和类型的值
Listing 6-2: A `Message` enum whose variants each store
different amounts and types of values</span>

这个枚举有四个含有不同类型的成员：

This enum has four variants with different types:

- `Quit` has no data associated with it at all.Quit 没有关联任何数据。
- `Move` has named fields, like a struct does.Move 类似结构体包含命名字段。
- `Write` includes a single `String`.Write 包含单独一个 String。
- `ChangeColor` includes three `i32` values.ChangeColor 包含三个 i32。

定义一个如示例 6-2 中所示那样的有关联值的枚举的方式和定义多个不同类型的结构体的方式很相像，除了枚举不使用 struct 关键字以及其所有成员都被组合在一起位于 Message 类型下。如下这些结构体可以包含与之前枚举成员中相同的数据：

Defining an enum with variants such as the ones in Listing 6-2 is similar to
defining different kinds of struct definitions, except the enum doesn’t use the
`struct` keyword and all the variants are grouped together under the `Message`
type. The following structs could hold the same data that the preceding enum
variants hold:

```rust
struct QuitMessage; // 类单元结构体
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // 元组结构体
struct ChangeColorMessage(i32, i32, i32); // 元组结构体

```

不过，如果我们使用不同的结构体，由于它们都有不同的类型，我们将不能像使用示例 6-2 中定义的 Message 枚举那样，轻易的定义一个能够处理这些不同类型的结构体的函数，因为枚举是单独一个类型。

But if we used the different structs, each of which has its own type, we
couldn’t as easily define a function to take any of these kinds of messages as
we could with the `Message` enum defined in Listing 6-2, which is a single type.

结构体和枚举还有另一个相似点：就像可以使用 impl 来为结构体定义方法那样，也可以在枚举上定义方法。这是一个定义于我们 Message 枚举上的叫做 call 的方法：

There is one more similarity between enums and structs: just as we’re able to
define methods on structs using `impl`, we’re also able to define methods on
enums. Here’s a method named `call` that we could define on our `Message` enum:

```rust
    impl Message {
        fn call(&self) {
            // 在这里定义方法体
        }
    }

    let m = Message::Write(String::from("hello"));
    m.call();

```

方法体使用了 self 来获取调用方法的值。这个例子中，创建了一个值为 Message::Write(String::from("hello")) 的变量 m，而且这就是当 m.call() 运行时 call 方法中的 self 的值。

The body of the method would use `self` to get the value that we called the
method on. In this example, we’ve created a variable `m` that has the value
`Message::Write(String::from("hello"))`, and that is what `self` will be in the
body of the `call` method when `m.call()` runs.

让我们看看标准库中的另一个非常常见且实用的枚举：Option。

Let’s look at another enum in the standard library that is very common and
useful: `Option`.

### The `Option` Enum and Its Advantages Over Null Values Option 枚举和其相对于空值的优势

这一部分会分析一个 Option 的案例，Option 是标准库定义的另一个枚举。Option 类型应用广泛因为它编码了一个非常普遍的场景，即一个值要么有值要么没值。

This section explores a case study of `Option`, which is another enum defined
by the standard library. The `Option` type encodes the very common scenario in
which a value could be something or it could be nothing.

例如，如果请求一个非空列表的第一项，会得到一个值，如果请求一个空的列表，就什么也不会得到。从类型系统的角度来表达这个概念就意味着编译器需要检查是否处理了所有应该处理的情况，这样就可以避免在其他编程语言中非常常见的 bug。

For example, if you request the first item in a non-empty list, you would get
a value. If you request the first item in an empty list, you would get nothing.
Expressing this concept in terms of the type system means the compiler can
check whether you’ve handled all the cases you should be handling; this
functionality can prevent bugs that are extremely common in other programming
languages.

编程语言的设计经常要考虑包含哪些功能，但考虑排除哪些功能也很重要。Rust 并没有很多其他语言中有的空值功能。空值（Null ）是一个值，它代表没有值。在有空值的语言中，变量总是这两种状态之一：空值和非空值。

Programming language design is often thought of in terms of which features you
include, but the features you exclude are important too. Rust doesn’t have the
null feature that many other languages have. _Null_ is a value that means there
is no value there. In languages with null, variables can always be in one of
two states: null or not-null.

Tony Hoare，null 的发明者，在他 2009 年的演讲 “Null References: The Billion Dollar Mistake” 中曾经说到

In his 2009 presentation “Null References: The Billion Dollar Mistake,” Tony
Hoare, the inventor of null, has this to say:

> 我称之为我十亿美元的错误。当时，我在为一个面向对象语言设计第一个综合性的面向引用的类型系统。我的目标是通过编译器的自动检查来保证所有引用的使用都应该是绝对安全的。不过我未能抵抗住引入一个空引用的诱惑，仅仅是因为它是这么的容易实现。这引发了无数错误、漏洞和系统崩溃，在之后的四十多年中造成了数十亿美元的苦痛和伤害。
> I call it my billion-dollar mistake. At that time, I was designing the first
> comprehensive type system for references in an object-oriented language. My
> goal was to ensure that all use of references should be absolutely safe, with
> checking performed automatically by the compiler. But I couldn’t resist the
> temptation to put in a null reference, simply because it was so easy to
> implement. This has led to innumerable errors, vulnerabilities, and system
> crashes, which have probably caused a billion dollars of pain and damage in
> the last forty years.

空值的问题在于当你尝试像一个非空值那样使用一个空值，会出现某种形式的错误。因为空和非空的属性无处不在，非常容易出现这类错误。

The problem with null values is that if you try to use a null value as a
not-null value, you’ll get an error of some kind. Because this null or not-null
property is pervasive, it’s extremely easy to make this kind of error.

然而，空值尝试表达的概念仍然是有意义的：空值是一个因为某种原因目前无效或缺失的值。

However, the concept that null is trying to express is still a useful one: a
null is a value that is currently invalid or absent for some reason.

问题不在于概念而在于具体的实现。为此，Rust 并没有空值，不过它确实拥有一个可以编码存在或不存在概念的枚举。这个枚举是 Option<T>，而且它定义于标准库中，如下：

The problem isn’t really with the concept but with the particular
implementation. As such, Rust does not have nulls, but it does have an enum
that can encode the concept of a value being present or absent. This enum is
`Option<T>`, and it is [defined by the standard library][option]<!-- ignore -->
as follows:

```rust
enum Option<T> {
    None,
    Some(T),
}
```

Option<T> 枚举是如此有用以至于它甚至被包含在了 prelude 之中，你不需要将其显式引入作用域。另外，它的成员也是如此，可以不需要 Option:: 前缀来直接使用 Some 和 None。即便如此 Option<T> 也仍是常规的枚举，Some(T) 和 None 仍是 Option<T> 的成员。

The `Option<T>` enum is so useful that it’s even included in the prelude; you
don’t need to bring it into scope explicitly. Its variants are also included in
the prelude: you can use `Some` and `None` directly without the `Option::`
prefix. The `Option<T>` enum is still just a regular enum, and `Some(T)` and
`None` are still variants of type `Option<T>`.

<T> 语法是一个我们还未讲到的 Rust 功能。它是一个泛型类型参数，第十章会更详细的讲解泛型。目前，所有你需要知道的就是 <T> 意味着 Option 枚举的 Some 成员可以包含任意类型的数据，同时每一个用于 T 位置的具体类型使得 Option<T> 整体作为不同的类型。这里是一些包含数字类型和字符串类型 Option 值的例子：

The `<T>` syntax is a feature of Rust we haven’t talked about yet. It’s a
generic type parameter, and we’ll cover generics in more detail in Chapter 10.
For now, all you need to know is that `<T>` means that the `Some` variant of
the `Option` enum can hold one piece of data of any type, and that each
concrete type that gets used in place of `T` makes the overall `Option<T>` type
a different type. Here are some examples of using `Option` values to hold
number types and string types:

```rust
    let some_number = Some(5);
    let some_char = Some('e');

    let absent_number: Option<i32> = None;

```

some_number 的类型是 Option<i32>。some_char 的类型是 Option<char>，这（与 some_number）是一个不同的类型。因为我们在 Some 成员中指定了值，Rust 可以推断其类型。对于 absent_number，Rust 需要我们指定 Option 整体的类型，因为编译器只通过 None 值无法推断出 Some 成员保存的值的类型。这里我们告诉 Rust 希望 absent_number 是 Option<i32> 类型的。

The type of `some_number` is `Option<i32>`. The type of `some_char` is
`Option<char>`, which is a different type. Rust can infer these types because
we’ve specified a value inside the `Some` variant. For `absent_number`, Rust
requires us to annotate the overall `Option` type: the compiler can’t infer the
type that the corresponding `Some` variant will hold by looking only at a
`None` value. Here, we tell Rust that we mean for `absent_number` to be of type
`Option<i32>`.

当有一个 Some 值时，我们就知道存在一个值，而这个值保存在 Some 中。当有个 None 值时，在某种意义上，它跟空值具有相同的意义：并没有一个有效的值。那么，Option<T> 为什么就比空值要好呢？

When we have a `Some` value, we know that a value is present and the value is
held within the `Some`. When we have a `None` value, in some sense it means the
same thing as null: we don’t have a valid value. So why is having `Option<T>`
any better than having null?

简而言之，因为 Option<T> 和 T（这里 T 可以是任何类型）是不同的类型，编译器不允许像一个肯定有效的值那样使用 Option<T>。例如，这段代码不能编译，因为它尝试将 Option<i8> 与 i8 相加：

In short, because `Option<T>` and `T` (where `T` can be any type) are different
types, the compiler won’t let us use an `Option<T>` value as if it were
definitely a valid value. For example, this code won’t compile, because it’s
trying to add an `i8` to an `Option<i8>`:

```rust
    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    let sum = x + y;

```

如果运行这些代码，将得到类似这样的错误信息：

If we run this code, we get an error message like this one:

```console
$ cargo run
   Compiling enums v0.1.0 (file:///projects/enums)
error[E0277]: cannot add `Option<i8>` to `i8`
 --> src/main.rs:5:17
  |
5 |     let sum = x + y;
  |                 ^ no implementation for `i8 + Option<i8>`
  |
  = help: the trait `Add<Option<i8>>` is not implemented for `i8`
  = help: the following other types implement trait `Add<Rhs>`:
            <i8 as Add>
            <i8 as Add<&i8>>
            <&'a i8 as Add<i8>>
            <&i8 as Add<&i8>>

For more information about this error, try `rustc --explain E0277`.
error: could not compile `enums` (bin "enums") due to 1 previous error

```

很好！事实上，错误信息意味着 Rust 不知道该如何将 Option<i8> 与 i8 相加，因为它们的类型不同。当在 Rust 中拥有一个像 i8 这样类型的值时，编译器确保它总是有一个有效的值。我们可以自信使用而无需做空值检查。只有当使用 Option<i8>（或者任何用到的类型）的时候需要担心可能没有值，而编译器会确保我们在使用值之前处理了为空的情况。

Intense! In effect, this error message means that Rust doesn’t understand how
to add an `i8` and an `Option<i8>`, because they’re different types. When we
have a value of a type like `i8` in Rust, the compiler will ensure that we
always have a valid value. We can proceed confidently without having to check
for null before using that value. Only when we have an `Option<i8>` (or
whatever type of value we’re working with) do we have to worry about possibly
not having a value, and the compiler will make sure we handle that case before
using the value.

换句话说，在对 Option<T> 进行运算之前必须将其转换为 T。通常这能帮助我们捕获到空值最常见的问题之一：假设某值不为空但实际上为空的情况。

In other words, you have to convert an `Option<T>` to a `T` before you can
perform `T` operations with it. Generally, this helps catch one of the most
common issues with null: assuming that something isn’t null when it actually is.

消除了错误地假设一个非空值的风险，会让你对代码更加有信心。为了拥有一个可能为空的值，你必须要显式的将其放入对应类型的 Option<T> 中。接着，当使用这个值时，必须明确的处理值为空的情况。只要一个值不是 Option<T> 类型，你就 可以 安全的认定它的值不为空。这是 Rust 的一个经过深思熟虑的设计决策，来限制空值的泛滥以增加 Rust 代码的安全性。

Eliminating the risk of incorrectly assuming a not-null value helps you to be
more confident in your code. In order to have a value that can possibly be
null, you must explicitly opt in by making the type of that value `Option<T>`.
Then, when you use that value, you are required to explicitly handle the case
when the value is null. Everywhere that a value has a type that isn’t an
`Option<T>`, you _can_ safely assume that the value isn’t null. This was a
deliberate design decision for Rust to limit null’s pervasiveness and increase
the safety of Rust code.

那么当有一个 Option<T> 的值时，如何从 Some 成员中取出 T 的值来使用它呢？Option<T> 枚举拥有大量用于各种情况的方法：你可以查看它的文档。熟悉 Option<T> 的方法将对你的 Rust 之旅非常有用。

So how do you get the `T` value out of a `Some` variant when you have a value
of type `Option<T>` so that you can use that value? The `Option<T>` enum has a
large number of methods that are useful in a variety of situations; you can
check them out in [its documentation][docs]<!-- ignore -->. Becoming familiar
with the methods on `Option<T>` will be extremely useful in your journey with
Rust.

总的来说，为了使用 Option<T> 值，需要编写处理每个成员的代码。你想要一些代码只当拥有 Some(T) 值时运行，允许这些代码使用其中的 T。也希望一些代码只在值为 None 时运行，这些代码并没有一个可用的 T 值。match 表达式就是这么一个处理枚举的控制流结构：它会根据枚举的成员运行不同的代码，这些代码可以使用匹配到的值中的数据。

In general, in order to use an `Option<T>` value, you want to have code that
will handle each variant. You want some code that will run only when you have a
`Some(T)` value, and this code is allowed to use the inner `T`. You want some
other code to run only if you have a `None` value, and that code doesn’t have a
`T` value available. The `match` expression is a control flow construct that
does just this when used with enums: it will run different code depending on
which variant of the enum it has, and that code can use the data inside the
matching value.

[IpAddr]: ../std/net/enum.IpAddr.html
[option]: ../std/option/enum.Option.html
[docs]: ../std/option/enum.Option.html
