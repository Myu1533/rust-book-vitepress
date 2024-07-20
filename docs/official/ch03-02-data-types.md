# Data Types 数据类型

Rust 中每种值都有确定的*数据类型*，可以帮助 Rust 的明确的知道怎么处理数据。我们将看看两种数据类型集合：标准类和混合类。

Every value in Rust is of a certain _data type_, which tells Rust what kind of
data is being specified so it knows how to work with that data. We’ll look at
two data type subsets: scalar and compound.

记住 Rust 是*静态类型*语言，也就是说编译的时候必须清楚的指明所有变量的类型。编译器通常知道我们所要使用的数据类型，并且知道怎么处理它。在例子中，例如我们在[“Comparing the Guess to the Secret
Number”][comparing-the-guess-to-the-secret-number]使用`parse`将`字符串`类型转换为`数字`类型，我们必须声明类型：

Keep in mind that Rust is a _statically typed_ language, which means that it
must know the types of all variables at compile time. The compiler can usually
infer what type we want to use based on the value and how we use it. In cases
when many types are possible, such as when we converted a `String` to a numeric
type using `parse` in the [“Comparing the Guess to the Secret
Number”][comparing-the-guess-to-the-secret-number]<!-- ignore --> section in
Chapter 2, we must add a type annotation, like this:

```rust
let guess: u32 = "42".parse().expect("Not a number!");
```

如果我们没有在代码前声明`: u32`类型，Rust 将报错，编译器需要知道我们所使用的类型的更多的信息：

If we don’t add the `: u32` type annotation shown in the preceding code, Rust
will display the following error, which means the compiler needs more
information from us to know which type we want to use:

```console
$ cargo build
   Compiling no_type_annotations v0.1.0 (file:///projects/no_type_annotations)
error[E0282]: type annotations needed
 --> src/main.rs:2:9
  |
2 |     let guess = "42".parse().expect("Not a number!");
  |         ^^^^^
  |
help: consider giving `guess` an explicit type
  |
2 |     let guess: _ = "42".parse().expect("Not a number!");
  |              +++

For more information about this error, try `rustc --explain E0282`.
error: could not compile `no_type_annotations` due to previous error
```

你将看到其他数据类型的不同声明方式。

You’ll see different type annotations for other data types.

### Scalar Types 标量类型

一个标量类型是单一数值。Rust 有 4 中主要的标量类型: 整型，浮点数，布尔值以及字符。其他编程语言里面也有。看看他们在 Rust 里怎么运行的：

A _scalar_ type represents a single value. Rust has four primary scalar types:
integers, floating-point numbers, Booleans, and characters. You may recognize
these from other programming languages. Let’s jump into how they work in Rust.

#### Integer Types 整型

整数时不包含的小数部分的数字。第二章我们用整型类型`u32`表示。这个类型标识这是一个占用 32 位空间的无符号的整型。表 3-1 展示了 Rust 的内置整型。我们可以使用下面任意一种描述整型。

An _integer_ is a number without a fractional component. We used one integer
type in Chapter 2, the `u32` type. This type declaration indicates that the
value it’s associated with should be an unsigned integer (signed integer types
start with `i` instead of `u`) that takes up 32 bits of space. Table 3-1 shows
the built-in integer types in Rust. We can use any of these variants to declare
the type of an integer value.

<span class="caption">Table 3-1: Integer Types in Rust</span>

| Length  | Signed  | Unsigned |
| ------- | ------- | -------- |
| 8-bit   | `i8`    | `u8`     |
| 16-bit  | `i16`   | `u16`    |
| 32-bit  | `i32`   | `u32`    |
| 64-bit  | `i64`   | `u64`    |
| 128-bit | `i128`  | `u128`   |
| arch    | `isize` | `usize`  |

任何一种都可以是有符号或者无符号并且有明确的大小。_有符号_ 和 _无符号_ 表示一个数字是否需要符号，尤其是负数的时候。就像在纸上写数字一样：有符号数字前面有加号或者减号；然而，它没有符号的时候，被看作正数。有符号数据用[two’s complement][twos-complement]的方法表示。

Each variant can be either signed or unsigned and has an explicit size.
_Signed_ and _unsigned_ refer to whether it’s possible for the number to be
negative—in other words, whether the number needs to have a sign with it
(signed) or whether it will only ever be positive and can therefore be
represented without a sign (unsigned). It’s like writing numbers on paper: when
the sign matters, a number is shown with a plus sign or a minus sign; however,
when it’s safe to assume the number is positive, it’s shown with no sign.
Signed numbers are stored using [two’s complement][twos-complement]<!-- ignore
--> representation.

有符号的不同类型的存储范围-(2<sup>n - 1</sup>) to 2<sup>n -
1</sup> - 1，n 表示不同类型占用的字节数。例如`i8`范围 -(2<sup>7</sup>) to 2<sup>7</sup> - 1，也就是
-128 到 127。
无符号的不同类型的存储范围 0 to 2<sup>n</sup> - 1，因此`u8`的范围是 2<sup>8</sup> - 1，即 0-255。

Each signed variant can store numbers from -(2<sup>n - 1</sup>) to 2<sup>n -
1</sup> - 1 inclusive, where _n_ is the number of bits that variant uses. So an
`i8` can store numbers from -(2<sup>7</sup>) to 2<sup>7</sup> - 1, which equals
-128 to 127. Unsigned variants can store numbers from 0 to 2<sup>n</sup> - 1,
so a `u8` can store numbers from 0 to 2<sup>8</sup> - 1, which equals 0 to 255.

另外，`i的大小` 和 `u的大小`依赖于程序所在的电脑架构，在“架构”表里列举了：64 bits 代表你的电脑是 65 位架构
，32 bits 表示你的电脑是 32 位的架构。
Additionally, the `isize` and `usize` types depend on the architecture of the
computer your program is running on, which is denoted in the table as “arch”:
64 bits if you’re on a 64-bit architecture and 32 bits if you’re on a 32-bit
architecture.

我可以用表 3-2 里表示法表示整型。注意数字可以直接用数字加类型后缀表示，例如`57u8`，就表示数字类型。数字表示法也可以用`_`作为分割，让一个数字易读，例如`1_000`，与`1000`有相同的值。

You can write integer literals in any of the forms shown in Table 3-2. Note
that number literals that can be multiple numeric types allow a type suffix,
such as `57u8`, to designate the type. Number literals can also use `_` as a
visual separator to make the number easier to read, such as `1_000`, which will
have the same value as if you had specified `1000`.

<span class="caption">表 3-2: Rust 整型表达式</span>

<span class="caption">Table 3-2: Integer Literals in Rust</span>

| Number literals  | Example       |
| ---------------- | ------------- |
| Decimal          | `98_222`      |
| Hex              | `0xff`        |
| Octal            | `0o77`        |
| Binary           | `0b1111_0000` |
| Byte (`u8` only) | `b'A'`        |

现在清楚需要使用那种整型类型了吗？如果还不确定，Rust 的默认设置是开始的好地方：整型默认是`i32`。主流状况中你需要使用`isize` 或 `usize`是需要知道集合的序号。

So how do you know which type of integer to use? If you’re unsure, Rust’s
defaults are generally good places to start: integer types default to `i32`.
The primary situation in which you’d use `isize` or `usize` is when indexing
some sort of collection.

> ##### Integer Overflow 整型溢出
>
> 假如你有一个存储 0 到 255 的`u8`类型的变量。如果你想赋值一个超出边界的值，例如 256，整型溢出就发生了，会得到两种
> 异常中的一个。如果你在调试模式编译时，Rust 会检查整型溢出，如果这发生，将在运行时引发程序*混乱*。Rust 会利用
> 程序异常退出来中断混乱；这将在第九章的[“Unrecoverable Errors with
> `panic!`”][unrecoverable-errors-with-panic]深入讨论
>
> Let’s say you have a variable of type `u8` that can hold values between 0 and 255. If you try to change the variable to a value outside that range, such as
> 256, _integer overflow_ will occur, which can result in one of two behaviors.
> When you’re compiling in debug mode, Rust includes checks for integer overflow
> that cause your program to _panic_ at runtime if this behavior occurs. Rust
> uses the term _panicking_ when a program exits with an error; we’ll discuss
> panics in more depth in the [“Unrecoverable Errors with
> `panic!`”][unrecoverable-errors-with-panic]<!-- ignore --> section in Chapter 9.
>
> 当你在释出模式下编译，Rust 不会包含引起混乱的整型溢出的检查。相反，如果溢出发生，Rust 会提供一种二进制补码。简单来说，超过最大值的时候，类型会将超过的数值重设为该类型能处理的最小值。例如`u8`的例子，256 这个值会变为 0，257 会变为 1，以此类推。程序不会产生混乱，但是变量将会获得一个超出预期的值。整型溢出的包裹特性应当被当作异常。
>
> When you’re compiling in release mode with the `--release` flag, Rust does
> _not_ include checks for integer overflow that cause panics. Instead, if
> overflow occurs, Rust performs _two’s complement wrapping_. In short, values
> greater than the maximum value the type can hold “wrap around” to the minimum
> of the values the type can hold. In the case of a `u8`, the value 256 becomes
> 0, the value 257 becomes 1, and so on. The program won’t panic, but the
> variable will have a value that probably isn’t what you were expecting it to
> have. Relying on integer overflow’s wrapping behavior is considered an error.
>
> 为了准确的处理可能产生的溢出，可以使用标准库中提供的处理数值类型的方法：
> To explicitly handle the possibility of overflow, you can use these families
> of methods provided by the standard library for primitive numeric types:
>
> - 将所有模式都都用`wrapping_*`包裹，例如`wrapping_add`.
> - Wrap in all modes with the `wrapping_*` methods, such as `wrapping_add`.
> - 如果使用了`checked_*`方法的溢出返回`None`。
> - Return the `None` value if there is overflow with the `checked_*` methods.
> -
> - Return the value and a boolean indicating whether there was overflow with
>   the `overflowing_*` methods.
> - Saturate at the value’s minimum or maximum values with the `saturating_*`
>   methods.

#### Floating-Point Types 浮点类型

Rust 也有两个 10 进制的浮点数的原始类型。Rust 的浮点类型是`f32`和`f64`，也就是 32 位和 64 位。默认类型是`f64`,由于在现代 CPU 上，速度和`f32`一样，但是可以处理更多的精度。所有的浮点类型都带有标记。

Rust also has two primitive types for _floating-point numbers_, which are
numbers with decimal points. Rust’s floating-point types are `f32` and `f64`,
which are 32 bits and 64 bits in size, respectively. The default type is `f64`
because on modern CPUs, it’s roughly the same speed as `f32` but is capable of
more precision. All floating-point types are signed.

下面介绍一下浮点类型的操作
Here’s an example that shows floating-point numbers in action:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let x = 2.0;
  let y: f32 = 3.0;
}
```

浮点类型数值符合 IEEE-754 标准。`f32`是单精度浮点数，`f64`是双精度浮点数。

Floating-point numbers are represented according to the IEEE-754 standard. The
`f32` type is a single-precision float, and `f64` has double precision.

#### Numeric Operations 数值操作

Rust 支持基础的数学操作：加减乘除取余。整数除法下取整。以下是例子：

Rust supports the basic mathematical operations you’d expect for all the number
types: addition, subtraction, multiplication, division, and remainder. Integer
division truncates toward zero to the nearest integer. The following code shows
how you’d use each numeric operation in a `let` statement:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let sum = 5 + 10;

  let difference = 95.5 - 4.3;

  let product = 4 * 30;

  let quotient = 56.7 / 32.2;

  let truncated = -5 / 3;

  let remainder = 43 % 5;
}
```

每个表达式展示了数学运算的使用并计算了结果，并赋值给对应的变量。[AppendixB][appendix_b]里面包含了 Rust 提供的所有运算符。

Each expression in these statements uses a mathematical operator and evaluates
to a single value, which is then bound to a variable. [Appendix
B][appendix_b]<!-- ignore --> contains a list of all operators that Rust
provides.

#### The Boolean Type 布尔类型

更其他语言一样，Rust 的布尔类型也有两个值：`true`和`false`。布尔类型占用一个字节。布尔类型的关键字是`bool`。例如：

As in most other programming languages, a Boolean type in Rust has two possible
values: `true` and `false`. Booleans are one byte in size. The Boolean type in
Rust is specified using `bool`. For example:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let t = true;

  let f: bool = false;
}
```

通过条件控制来使用布尔类型，例如在`if`表达式中。我们建在[“ControlFlow”][control-flow]说明`if`的用法。

The main way to use Boolean values is through conditionals, such as an `if`
expression. We’ll cover how `if` expressions work in Rust in the [“Control
Flow”][control-flow]<!-- ignore --> section.

#### The Character Type 字符类型

Rust 的字符类型是语言中提供的最原始也是最原子的类型。以下是字符类型的声明：

Rust’s `char` type is the language’s most primitive alphabetic type. Here are
some examples of declaring `char` values:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let c = 'z';

  let z: char = 'Z';

  let heart_eyed_cat = 'cat';
}
```

注意，我们用单引号声明 char 字面量，而与之相反的是，使用双引号声明字符串字面量。Rust 的 char 类型的大小为四个字节 (four bytes)，并代表了一个 Unicode 标量值（Unicode Scalar Value），这意味着它可以比 ASCII 表示更多内容。在 Rust 中，带变音符号的字母（Accented letters），中文、日文、韩文等字符，emoji（绘文字）以及零长度的空白字符都是有效的 char 值。Unicode 标量值包含从 U+0000 到 U+D7FF 和 U+E000 到 U+10FFFF 在内的值。不过，“字符” 并不是一个 Unicode 中的概念，所以人直觉上的 “字符” 可能与 Rust 中的 char 并不符合。第八章的 “使用字符串储存 UTF-8 编码的文本” 中将详细讨论这个主题。

Note that we specify `char` literals with single quotes, as opposed to string
literals, which use double quotes. Rust’s `char` type is four bytes in size and
represents a Unicode Scalar Value, which means it can represent a lot more than
just ASCII. Accented letters; Chinese, Japanese, and Korean characters; emoji;
and zero-width spaces are all valid `char` values in Rust. Unicode Scalar
Values range from `U+0000` to `U+D7FF` and `U+E000` to `U+10FFFF` inclusive.
However, a “character” isn’t really a concept in Unicode, so your human
intuition for what a “character” is may not match up with what a `char` is in
Rust. We’ll discuss this topic in detail in [“Storing UTF-8 Encoded Text with
Strings”][strings]<!-- ignore --> in Chapter 8.

### Compound Types 复合类型

复合类型可以把多种数值放在一个类型中。Rust 有两种原始复合类型：元组和数组。

_Compound types_ can group multiple values into one type. Rust has two
primitive compound types: tuples and arrays.

#### The Tuple Type 元组类型

一个元组是把一组不同类型的值放到一个复合类型中。元组是固定长度：一次声明，元组大小就不能增长和缩小。

A _tuple_ is a general way of grouping together a number of values with a
variety of types into one compound type. Tuples have a fixed length: once
declared, they cannot grow or shrink in size.

在花括号中通过逗号分隔一组值来创建元组。元组中每个位置一个类型，元组中的每个值的类型不是必须一样的。在下面例子中我们将增加可选类型注解：

We create a tuple by writing a comma-separated list of values inside
parentheses. Each position in the tuple has a type, and the types of the
different values in the tuple don’t have to be the same. We’ve added optional
type annotations in this example:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

变量`tup`被整个元组赋值，因为元组是单独的复合元素。从元组中获取单个值，我们可以用模式匹配来解构元组的值，如下：
The variable `tup` binds to the entire tuple because a tuple is considered a
single compound element. To get the individual values out of a tuple, we can
use pattern matching to destructure a tuple value, like this:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let tup = (500, 6.4, 1);
  let (x, y, z) = tup;
  println!("The value of y is: {y}");
}
```

这个程序首先创建一个元组并赋值给变量`tup`。然后通过模式匹配的方式获取`tup`中的值并赋值给 3 个变量，`x`,`y`,`z`。这就是解构，因为它把一个元组分解为三个部分。最终，程序输出`y`的值为`6.4`。

This program first creates a tuple and binds it to the variable `tup`. It then
uses a pattern with `let` to take `tup` and turn it into three separate
variables, `x`, `y`, and `z`. This is called _destructuring_ because it breaks
the single tuple into three parts. Finally, the program prints the value of
`y`, which is `6.4`.

我们也允许通过`.`跟着索引来访问值。例如：
We can also access a tuple element directly by using a period (`.`) followed by
the index of the value we want to access. For example:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let x: (i32, f64, u8) = (500, 6.4, 1);

  let five_hundred = x.0;

  let six_point_four = x.1;

  let one = x.2;
}
```

这个程序首先创建一个元组并赋值给变量`tup`，通过索引来访问每个元组元素的值。跟大多出编程语言一样，元组从 0 开始。

This program creates the tuple `x` and then accesses each element of the tuple
using their respective indices. As with most programming languages, the first
index in a tuple is 0.

没有值的元组有一个特殊的名字-`单元`元组。它的值及类型都是`()`，表示空值或者空类型。如果表达式不返回其他值，则会隐式的返回单元元组。
The tuple without any values has a special name, _unit_. This value and its
corresponding type are both written `()` and represent an empty value or an
empty return type. Expressions implicitly return the unit value if they don’t
return any other value.

#### The Array Type 数组类型

另外一种多个值的组合叫做数组。和元组不同，数组中的元素必须有相同的类型。和其他编程语言不同的是，Rust 的数组是固定长度的。

Another way to have a collection of multiple values is with an _array_. Unlike
a tuple, every element of an array must have the same type. Unlike arrays in
some other languages, arrays in Rust have a fixed length.

我们将数组的值写成在方括号内，用逗号分隔：

We write the values in an array as a comma-separated list inside square
brackets:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
  let a = [1, 2, 3, 4, 5];
}
```

当你想要在栈而不是在堆上为数据分配空间（第四章将讨论栈与堆的更多内容），或者是想要确保总是有固定数量的元素时，数组非常有用。但是数组并不如向量类型是标准库提供的一个允许增长和缩小长度的类似数组的集合类型。当不确定是应该使用数组还是向量的时候，那么很可能应该使用向量。

Arrays are useful when you want your data allocated on the stack rather than
the heap (we will discuss the stack and the heap more in [Chapter
4][stack-and-heap]<!-- ignore -->) or when you want to ensure you always have a
fixed number of elements. An array isn’t as flexible as the vector type,
though. A _vector_ is a similar collection type provided by the standard
library that _is_ allowed to grow or shrink in size. If you’re unsure whether
to use an array or a vector, chances are you should use a vector. [Chapter
8][vectors]<!-- ignore --> discusses vectors in more detail.

然而，但你知道元素的个数以及不需要改变的时候，数组非常有用。例如，如果程序里有一组月份的名字，你用数组比用向量好，因为你知道它总是包含 12 个元素：

However, arrays are more useful when you know the number of elements will not
need to change. For example, if you were using the names of the month in a
program, you would probably use an array rather than a vector because you know
it will always contain 12 elements:

```rust
let months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
```

可以像这样编写数组的类型：在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量。

You write an array’s type using square brackets with the type of each element,
a semicolon, and then the number of elements in the array, like so:

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

这里，i32 是每个元素的类型。分号之后，数字 5 表明该数组包含五个元素。

Here, `i32` is the type of each element. After the semicolon, the number `5`
indicates the array contains five elements.

你还可以通过在方括号中指定初始值加分号再加元素个数的方式来创建一个每个元素都为相同值的数组。

You can also initialize an array to contain the same value for each element by
specifying the initial value, followed by a semicolon, and then the length of
the array in square brackets, as shown here:

```rust
let a = [3; 5];
```

变量名为 a 的数组将包含 5 个元素，这些元素的值最初都将被设置为 3。这种写法与 let a = [3, 3, 3, 3, 3]; 效果相同，但更简洁。

The array named `a` will contain `5` elements that will all be set to the value
`3` initially. This is the same as writing `let a = [3, 3, 3, 3, 3];` but in a
more concise way.

##### Accessing Array Elements 访问数组元素

数组是可以在栈 (stack) 上分配的已知固定大小的单个内存块。可以使用索引来访问数组的元素，像这样：

An array is a single chunk of memory of a known, fixed size that can be
allocated on the stack. You can access elements of an array using indexing,
like this:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let first = a[0];
    let second = a[1];
}
```

在这个例子中，叫做 first 的变量的值是 1，因为它是数组索引 [0] 的值。变量 second 将会是数组索引 [1] 的值 2。

In this example, the variable named `first` will get the value `1` because that
is the value at index `[0]` in the array. The variable named `second` will get
the value `2` from index `[1]` in the array.

##### Invalid Array Element Access 无效的数组元素访问

让我们看看如果我们访问数组结尾之后的元素会发生什么呢？比如你执行以下代码，它使用类似于第 2 章中的猜数字游戏的代码从用户那里获取数组索引：

Let’s see what happens if you try to access an element of an array that is past
the end of the array. Say you run this code, similar to the guessing game in
Chapter 2, to get an array index from the user:

<span class="filename">Filename: src/main.rs</span>

```rust,panics
use std::io;

fn main() {
    let a = [1, 2, 3, 4, 5];

    println!("Please enter an array index.");

    let mut index = String::new();

    io::stdin()
        .read_line(&mut index)
        .expect("Failed to read line");

    let index: usize = index
        .trim()
        .parse()
        .expect("Index entered was not a number");

    let element = a[index];

    println!("The value of the element at index {index} is: {element}");
}
```

此代码编译成功。如果您使用 cargo run 运行此代码并输入 0、1、2、3 或 4，程序将在数组中相应索引的值打印出来。如果你输入一个超过数组长度，如 10，你会看到这样的输出：

This code compiles successfully. If you run this code using `cargo run` and
enter `0`, `1`, `2`, `3`, or `4`, the program will print out the corresponding
value at that index in the array. If you instead enter a number past the end of
the array, such as `10`, you’ll see output like this:

<!-- manual-regeneration
cd listings/ch03-common-programming-concepts/no-listing-15-invalid-array-access
cargo run
10
-->

```console
thread 'main' panicked at src/main.rs:19:19:
index out of bounds: the len is 5 but the index is 10
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

程序在索引操作中使用一个无效的值时导致 运行时 错误。程序带着错误信息退出，并且没有执行最后的 println! 语句。当尝试用索引访问一个元素时，Rust 会检查指定的索引是否小于数组的长度。如果索引超出了数组长度，Rust 会 panic，这是 Rust 术语，它用于程序因为错误而退出的情况。这种检查必须在运行时进行，特别是在这种情况下，因为编译器不可能知道用户在以后运行代码时将输入什么值。

The program resulted in a _runtime_ error at the point of using an invalid
value in the indexing operation. The program exited with an error message and
didn’t execute the final `println!` statement. When you attempt to access an
element using indexing, Rust will check that the index you’ve specified is less
than the array length. If the index is greater than or equal to the length,
Rust will panic. This check has to happen at runtime, especially in this case,
because the compiler can’t possibly know what value a user will enter when they
run the code later.

这是第一个在实战中遇到的 Rust 安全原则的例子。在很多底层语言中，并没有进行这类检查，这样当提供了一个不正确的索引时，就会访问无效的内存。通过立即退出而不是允许内存访问并继续执行，Rust 让你避开此类错误。第九章会更详细地讨论 Rust 的错误处理机制，以及如何编写可读性强而又安全的代码，使程序既不会 panic 也不会导致非法内存访问。

This is an example of Rust’s memory safety principles in action. In many
low-level languages, this kind of check is not done, and when you provide an
incorrect index, invalid memory can be accessed. Rust protects you against this
kind of error by immediately exiting instead of allowing the memory access and
continuing. Chapter 9 discusses more of Rust’s error handling and how you can
write readable, safe code that neither panics nor allows invalid memory access.

[comparing-the-guess-to-the-secret-number]: ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[twos-complement]: https://en.wikipedia.org/wiki/Two%27s_complement
[control-flow]: ch03-05-control-flow.html#control-flow
[strings]: ch08-02-strings.html#storing-utf-8-encoded-text-with-strings
[stack-and-heap]: ch04-01-what-is-ownership.html#the-stack-and-the-heap
[vectors]: ch08-01-vectors.html
[unrecoverable-errors-with-panic]: ch09-01-unrecoverable-errors-with-panic.html
[appendix_b]: appendix-02-operators.md
