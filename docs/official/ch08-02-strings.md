## Storing UTF-8 Encoded Text with Strings 使用字符串储存 UTF-8 编码的文本

第四章已经讲过一些字符串的内容，不过现在让我们更深入地了解它。字符串是新晋 Rustacean 们通常会被困住的领域，这是由于三方面理由的结合：Rust 倾向于确保暴露出可能的错误，字符串是比很多程序员所想象的要更为复杂的数据结构，以及 UTF-8。所有这些要素结合起来对于来自其他语言背景的程序员就可能显得很困难了。

We talked about strings in Chapter 4, but we’ll look at them in more depth now.
New Rustaceans commonly get stuck on strings for a combination of three
reasons: Rust’s propensity for exposing possible errors, strings being a more
complicated data structure than many programmers give them credit for, and
UTF-8. These factors combine in a way that can seem difficult when you’re
coming from other programming languages.

在集合章节中讨论字符串的原因是，字符串就是作为字节的集合外加一些方法实现的，当这些字节被解释为文本时，这些方法提供了实用的功能。在这一部分，我们会讲到 String 中那些任何集合类型都有的操作，比如创建、更新和读取。也会讨论 String 与其他集合不一样的地方，例如索引 String 是很复杂的，由于人和计算机理解 String 数据方式的不同。

We discuss strings in the context of collections because strings are
implemented as a collection of bytes, plus some methods to provide useful
functionality when those bytes are interpreted as text. In this section, we’ll
talk about the operations on `String` that every collection type has, such as
creating, updating, and reading. We’ll also discuss the ways in which `String`
is different from the other collections, namely how indexing into a `String` is
complicated by the differences between how people and computers interpret
`String` data.

### What Is a String? 什么是字符串？

在开始深入这些方面之前，我们需要讨论一下术语 字符串 的具体意义。Rust 的核心语言中只有一种字符串类型：字符串 slice str，它通常以被借用的形式出现，&str。第四章讲到了 字符串 slices：它们是一些对储存在别处的 UTF-8 编码字符串数据的引用。举例来说，由于字符串字面值被储存在程序的二进制输出中，因此字符串字面值也是字符串 slices。

We’ll first define what we mean by the term _string_. Rust has only one string
type in the core language, which is the string slice `str` that is usually seen
in its borrowed form `&str`. In Chapter 4, we talked about _string slices_,
which are references to some UTF-8 encoded string data stored elsewhere. String
literals, for example, are stored in the program’s binary and are therefore
string slices.

字符串（String）类型由 Rust 标准库提供，而不是编入核心语言，它是一种可增长、可变、可拥有、UTF-8 编码的字符串类型。当 Rustaceans 提及 Rust 中的 "字符串 "时，他们可能指的是 String 或 string slice &str 类型，而不仅仅是其中一种类型。虽然本节主要讨论 String，但这两种类型在 Rust 的标准库中都有大量使用，而且 String 和 字符串 slices 都是 UTF-8 编码的。

The `String` type, which is provided by Rust’s standard library rather than
coded into the core language, is a growable, mutable, owned, UTF-8 encoded
string type. When Rustaceans refer to “strings” in Rust, they might be
referring to either the `String` or the string slice `&str` types, not just one
of those types. Although this section is largely about `String`, both types are
used heavily in Rust’s standard library, and both `String` and string slices
are UTF-8 encoded.

### Creating a New String 新建字符串

很多 Vec 可用的操作在 String 中同样可用，事实上 String 被实现为一个带有一些额外保证、限制和功能的字节 vector 的封装。其中一个同样作用于 Vec<T> 和 String 函数的例子是用来新建一个实例的 new 函数，如示例 8-11 所示。

Many of the same operations available with `Vec<T>` are available with `String`
as well, because `String` is actually implemented as a wrapper around a vector
of bytes with some extra guarantees, restrictions, and capabilities. An example
of a function that works the same way with `Vec<T>` and `String` is the `new`
function to create an instance, shown in Listing 8-11.

```rust
    let mut s = String::new();
```

<span class="caption">示例 8-11：新建一个空的 String Listing 8-11: Creating a new, empty `String`</span>

这新建了一个叫做 s 的空的字符串，接着我们可以向其中装载数据。通常字符串会有初始数据，因为我们希望一开始就有这个字符串。为此，可以使用 to_string 方法，它能用于任何实现了 Display trait 的类型，比如字符串字面值。示例 8-12 展示了两个例子。

This line creates a new empty string called `s`, which we can then load data
into. Often, we’ll have some initial data that we want to start the string
with. For that, we use the `to_string` method, which is available on any type
that implements the `Display` trait, as string literals do. Listing 8-12 shows
two examples.

```rust
    let data = "initial contents";

    let s = data.to_string();

    // 该方法也可直接用于字符串字面值：
    let s = "initial contents".to_string();
```

<span class="caption">
示例 8-12：使用 to_string 方法从字符串字面值创建 String
Listing 8-12: Using the `to_string` method to create a
`String` from a string literal</span>

这些代码会创建包含 initial contents 的字符串。

This code creates a string containing `initial contents`.

也可以使用 String::from 函数来从字符串字面值创建 String。示例 8-13 中的代码等同于使用 to_string。

We can also use the function `String::from` to create a `String` from a string
literal. The code in Listing 8-13 is equivalent to the code from Listing 8-12
that uses `to_string`.

```rust
    let s = String::from("initial contents");
```

<span class="caption">
示例 8-13：使用 String::from 函数从字符串字面值创建 String
Listing 8-13: Using the `String::from` function to create
a `String` from a string literal</span>

因为字符串应用广泛，这里有很多不同的用于字符串的通用 API 可供选择。其中一些可能看起来多余，不过都有其用武之地！在这个例子中，String::from 和 .to_string 最终做了完全相同的工作，所以如何选择就是代码风格与可读性的问题了。

Because strings are used for so many things, we can use many different generic
APIs for strings, providing us with a lot of options. Some of them can seem
redundant, but they all have their place! In this case, `String::from` and
`to_string` do the same thing, so which you choose is a matter of style and
readability.

记住字符串是 UTF-8 编码的，所以可以包含任何可以正确编码的数据，如示例 8-14 所示。

Remember that strings are UTF-8 encoded, so we can include any properly encoded
data in them, as shown in Listing 8-14.

```rust
    let hello = String::from("السلام عليكم");
    let hello = String::from("Dobrý den");
    let hello = String::from("Hello");
    let hello = String::from("שלום");
    let hello = String::from("नमस्ते");
    let hello = String::from("こんにちは");
    let hello = String::from("안녕하세요");
    let hello = String::from("你好");
    let hello = String::from("Olá");
    let hello = String::from("Здравствуйте");
    let hello = String::from("Hola");
```

<span class="caption">
示例 8-14：在字符串中储存不同语言的问候语
Listing 8-14: Storing greetings in different languages in
strings</span>

所有这些都是有效的 String 值。

All of these are valid `String` values.

### Updating a String 更新字符串

String 的大小可以增加，其内容也可以改变，就像可以放入更多数据来改变 Vec 的内容一样。另外，可以方便的使用 + 运算符或 format! 宏来拼接 String 值。

A `String` can grow in size and its contents can change, just like the contents
of a `Vec<T>`, if you push more data into it. In addition, you can conveniently
use the `+` operator or the `format!` macro to concatenate `String` values.

#### Appending to a String with `push_str` and `push` 使用 push_str 和 push 附加字符串

可以通过 push_str 方法来附加字符串 slice，从而使 String 变长，如示例 8-15 所示。

We can grow a `String` by using the `push_str` method to append a string slice,
as shown in Listing 8-15.

```rust
    let mut s = String::from("foo");
    s.push_str("bar");
```

<span class="caption">
示例 8-15：使用 push_str 方法向 String 附加字符串 slice
Listing 8-15: Appending a string slice to a `String`
using the `push_str` method</span>

执行这两行代码之后，s 将会包含 foobar。push_str 方法采用字符串 slice，因为我们并不需要获取参数的所有权。例如，示例 8-16 中我们希望在将 s2 的内容附加到 s1 之后还能使用它。

After these two lines, `s` will contain `foobar`. The `push_str` method takes a
string slice because we don’t necessarily want to take ownership of the
parameter. For example, in the code in Listing 8-16, we want to be able to use
`s2` after appending its contents to `s1`.

```rust
    let mut s1 = String::from("foo");
    let s2 = "bar";
    s1.push_str(s2);
    println!("s2 is {s2}");
```

<span class="caption">
示例 8-16：将字符串 slice 的内容附加到 String 后使用它
Listing 8-16: Using a string slice after appending its
contents to a `String`</span>

如果 push_str 方法获取了 s2 的所有权，就不能在最后一行打印出其值了。好在代码如我们期望那样工作！

If the `push_str` method took ownership of `s2`, we wouldn’t be able to print
its value on the last line. However, this code works as we’d expect!

push 方法被定义为获取一个单独的字符作为参数，并附加到 String 中。示例 8-17 展示了使用 push 方法将字母 "l" 加入 String 的代码。

The `push` method takes a single character as a parameter and adds it to the
`String`. Listing 8-17 adds the letter “l” to a `String` using the `push`
method.

```rust
    let mut s = String::from("lo");
    s.push('l');
```

<span class="caption">
示例 8-17：使用 push 将一个字符加入 String 值中
Listing 8-17: Adding one character to a `String` value
using `push`</span>

执行这些代码之后，s 将会包含 “lol”。

As a result, `s` will contain `lol`.

#### Concatenation with the `+` Operator or the `format!` Macro 使用 + 运算符或 format! 宏拼接字符串

通常你会希望将两个已知的字符串合并在一起。一种办法是像这样使用 + 运算符，如示例 8-18 所示。

Often, you’ll want to combine two existing strings. One way to do so is to use
the `+` operator, as shown in Listing 8-18.

```rust
    let s1 = String::from("Hello, ");
    let s2 = String::from("world!");
    let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用
```

<span class="caption">
示例 8-18：使用 + 运算符将两个 String 值合并到一个新的 String 值中
Listing 8-18: Using the `+` operator to combine two
`String` values into a new `String` value</span>

执行完这些代码之后，字符串 s3 将会包含 Hello, world!。s1 在相加后不再有效的原因，和使用 s2 的引用的原因，与使用 + 运算符时调用的函数签名有关。+ 运算符使用了 add 函数，这个函数签名看起来像这样：

The string `s3` will contain `Hello, world!`. The reason `s1` is no longer
valid after the addition, and the reason we used a reference to `s2`, has to do
with the signature of the method that’s called when we use the `+` operator.
The `+` operator uses the `add` method, whose signature looks something like
this:

```rust
fn add(self, s: &str) -> String {
```

在标准库中你会发现，add 的定义使用了泛型和关联类型。在这里我们替换为了具体类型，这也正是当使用 String 值调用这个方法会发生的。第十章会讨论泛型。这个签名提供了理解 + 运算那微妙部分的线索。

In the standard library, you'll see `add` defined using generics and associated
types. Here, we’ve substituted in concrete types, which is what happens when we
call this method with `String` values. We’ll discuss generics in Chapter 10.
This signature gives us the clues we need to understand the tricky bits of the
`+` operator.

首先，s2 使用了 &，意味着我们使用第二个字符串的 引用 与第一个字符串相加。这是因为 add 函数的 s 参数：只能将 &str 和 String 相加，不能将两个 String 值相加。不过等一下 —— &s2 的类型是 &String, 而不是 add 第二个参数所指定的 &str。那么为什么示例 8-18 还能编译呢？

First, `s2` has an `&`, meaning that we’re adding a _reference_ of the second
string to the first string. This is because of the `s` parameter in the `add`
function: we can only add a `&str` to a `String`; we can’t add two `String`
values together. But wait—the type of `&s2` is `&String`, not `&str`, as
specified in the second parameter to `add`. So why does Listing 8-18 compile?

之所以能够在 add 调用中使用 &s2 是因为 &String 可以被 强转（coerced）成 &str。当 add 函数被调用时，Rust 使用了一个被称为 Deref 强制转换（deref coercion）的技术，你可以将其理解为它把 &s2 变成了 &s2[..]。第十五章会更深入的讨论 Deref 强制转换。因为 add 没有获取参数的所有权，所以 s2 在这个操作后仍然是有效的 String。

The reason we’re able to use `&s2` in the call to `add` is that the compiler
can _coerce_ the `&String` argument into a `&str`. When we call the `add`
method, Rust uses a _deref coercion_, which here turns `&s2` into `&s2[..]`.
We’ll discuss deref coercion in more depth in Chapter 15. Because `add` does
not take ownership of the `s` parameter, `s2` will still be a valid `String`
after this operation.

其次，可以发现签名中 add 获取了 self 的所有权，因为 self 没有 使用 &。这意味着示例 8-18 中的 s1 的所有权将被移动到 add 调用中，之后就不再有效。所以虽然 let s3 = s1 + &s2; 看起来就像它会复制两个字符串并创建一个新的字符串，而实际上这个语句会获取 s1 的所有权，附加上从 s2 中拷贝的内容，并返回结果的所有权。换句话说，它看起来好像生成了很多拷贝，不过实际上并没有：这个实现比拷贝要更高效。

Second, we can see in the signature that `add` takes ownership of `self`,
because `self` does _not_ have an `&`. This means `s1` in Listing 8-18 will be
moved into the `add` call and will no longer be valid after that. So although
`let s3 = s1 + &s2;` looks like it will copy both strings and create a new one,
this statement actually takes ownership of `s1`, appends a copy of the contents
of `s2`, and then returns ownership of the result. In other words, it looks
like it’s making a lot of copies but isn’t; the implementation is more
efficient than copying.

如果想要级联多个字符串，+ 的行为就显得笨重了：

If we need to concatenate multiple strings, the behavior of the `+` operator
gets unwieldy:

```rust
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = s1 + "-" + &s2 + "-" + &s3;
```

这时 s 的内容会是 “tic-tac-toe”。在有这么多 + 和 " 字符的情况下，很难理解具体发生了什么。对于更为复杂的字符串链接，可以使用 format! 宏：

At this point, `s` will be `tic-tac-toe`. With all of the `+` and `"`
characters, it’s difficult to see what’s going on. For more complicated string
combining, we can instead use the `format!` macro:

```rust
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = format!("{s1}-{s2}-{s3}");
```

这些代码也会将 s 设置为 “tic-tac-toe”。format! 与 println! 的工作原理相同，不过不同于将输出打印到屏幕上，它返回一个带有结果内容的 String。这个版本就好理解的多，宏 format! 生成的代码使用引用所以不会获取任何参数的所有权。

This code also sets `s` to `tic-tac-toe`. The `format!` macro works like
`println!`, but instead of printing the output to the screen, it returns a
`String` with the contents. The version of the code using `format!` is much
easier to read, and the code generated by the `format!` macro uses references
so that this call doesn’t take ownership of any of its parameters.

### Indexing into Strings 索引字符串

在很多语言中，通过索引来引用字符串中的单独字符是有效且常见的操作。然而在 Rust 中，如果你尝试使用索引语法访问 String 的一部分，会出现一个错误。考虑一下如示例 8-19 中所示的无效代码。

In many other programming languages, accessing individual characters in a
string by referencing them by index is a valid and common operation. However,
if you try to access parts of a `String` using indexing syntax in Rust, you’ll
get an error. Consider the invalid code in Listing 8-19.

```rust
    let s1 = String::from("hello");
    let h = s1[0];
```

<span class="caption">
示例 8-19：尝试对字符串使用索引语法
Listing 8-19: Attempting to use indexing syntax with a
String</span>

这段代码会导致如下错误：

This code will result in the following error:

```console
$ cargo run
   Compiling collections v0.1.0 (file:///projects/collections)
error[E0277]: the type `str` cannot be indexed by `{integer}`
 --> src/main.rs:3:16
  |
3 |     let h = s1[0];
  |                ^ string indices are ranges of `usize`
  |
  = help: the trait `SliceIndex<str>` is not implemented for `{integer}`, which is required by `String: Index<_>`
  = note: you can use `.chars().nth()` or `.bytes().nth()`
          for more information, see chapter 8 in The Book: <https://doc.rust-lang.org/book/ch08-02-strings.html#indexing-into-strings>
  = help: the trait `SliceIndex<[_]>` is implemented for `usize`
  = help: for that trait implementation, expected `[_]`, found `str`
  = note: required for `String` to implement `Index<{integer}>`

For more information about this error, try `rustc --explain E0277`.
error: could not compile `collections` (bin "collections") due to 1 previous error
```

错误和提示说明了全部问题：Rust 的字符串不支持索引。那么接下来的问题是，为什么不支持呢？为了回答这个问题，我们必须先聊一聊 Rust 是如何在内存中储存字符串的。

The error and the note tell the story: Rust strings don’t support indexing. But
why not? To answer that question, we need to discuss how Rust stores strings in
memory.

#### Internal Representation 内部表现

String 是一个 Vec<u8> 的封装。让我们看看示例 8-14 中一些正确编码的字符串的例子。首先是这一个：

A `String` is a wrapper over a `Vec<u8>`. Let’s look at some of our properly
encoded UTF-8 example strings from Listing 8-14. First, this one:

```rust
    let hello = String::from("Hola");
```

在这里，len 的值是 4，这意味着储存字符串 “Hola” 的 Vec 的长度是四个字节：这里每一个字母的 UTF-8 编码都占用一个字节。那下面这个例子又如何呢？（注意这个字符串中的首字母是西里尔字母的 Ze 而不是数字 3。）

In this case, `len` will be 4, which means the vector storing the string “Hola”
is 4 bytes long. Each of these letters takes 1 byte when encoded in UTF-8. The
following line, however, may surprise you. (Note that this string begins with
the capital Cyrillic letter Ze, not the number 3.)

```rust
let hello = String::from("Здравствуйте");
```

当问及这个字符是多长的时候有人可能会说是 12。然而，Rust 的回答是 24。这是使用 UTF-8 编码 “Здравствуйте” 所需要的字节数，这是因为每个 Unicode 标量值需要两个字节存储。因此一个字符串字节值的索引并不总是对应一个有效的 Unicode 标量值。作为演示，考虑如下无效的 Rust 代码：

Asked how long the string is, you might say 12. In fact, Rust’s answer is 24:
that’s the number of bytes it takes to encode “Здравствуйте” in UTF-8, because
each Unicode scalar value in that string takes 2 bytes of storage. Therefore,
an index into the string’s bytes will not always correlate to a valid Unicode
scalar value. To demonstrate, consider this invalid Rust code:

```rust
let hello = "Здравствуйте";
let answer = &hello[0];
```

我们已经知道 answer 不是第一个字符 3。当使用 UTF-8 编码时，（西里尔字母的 Ze）З 的第一个字节是 208，第二个是 151，所以 answer 实际上应该是 208，不过 208 自身并不是一个有效的字母。返回 208 可不是一个请求字符串第一个字母的人所希望看到的，不过它是 Rust 在字节索引 0 位置所能提供的唯一数据。用户通常不会想要一个字节值被返回。即使这个字符串只有拉丁字母，如果 &"hello"[0] 是返回字节值的有效代码，它也会返回 104 而不是 h。

You already know that `answer` will not be `З`, the first letter. When encoded
in UTF-8, the first byte of `З` is `208` and the second is `151`, so it would
seem that `answer` should in fact be `208`, but `208` is not a valid character
on its own. Returning `208` is likely not what a user would want if they asked
for the first letter of this string; however, that’s the only data that Rust
has at byte index 0. Users generally don’t want the byte value returned, even
if the string contains only Latin letters: if `&"hello"[0]` were valid code
that returned the byte value, it would return `104`, not `h`.

为了避免返回意外的值并造成不能立刻发现的 bug，Rust 根本不会编译这些代码，并在开发过程中及早杜绝了误会的发生。

The answer, then, is that to avoid returning an unexpected value and causing
bugs that might not be discovered immediately, Rust doesn’t compile this code
at all and prevents misunderstandings early in the development process.

#### Bytes and Scalar Values and Grapheme Clusters! Oh My! 字节、标量值和字形簇！天呐！

这引起了关于 UTF-8 的另外一个问题：从 Rust 的角度来讲，事实上有三种相关方式可以理解字符串：字节、标量值和字形簇（最接近人们眼中 字母 的概念）。

Another point about UTF-8 is that there are actually three relevant ways to
look at strings from Rust’s perspective: as bytes, scalar values, and grapheme
clusters (the closest thing to what we would call _letters_).

比如这个用梵文书写的印度语单词 “नमस्ते”，最终它储存在 vector 中的 u8 值看起来像这样：

If we look at the Hindi word “नमस्ते” written in the Devanagari script, it is
stored as a vector of `u8` values that looks like this:

```text
[224, 164, 168, 224, 164, 174, 224, 164, 184, 224, 165, 141, 224, 164, 164,
224, 165, 135]
```

这里有 18 个字节，也就是计算机最终会储存的数据。如果从 Unicode 标量值的角度理解它们，也就像 Rust 的 char 类型那样，这些字节看起来像这样：

That’s 18 bytes and is how computers ultimately store this data. If we look at
them as Unicode scalar values, which are what Rust’s `char` type is, those
bytes look like this:

```text
['न', 'म', 'स', '्', 'त', 'े']
```

这里有六个 char，不过第四个和第六个都不是字母，它们是发音符号本身并没有任何意义。最后，如果以字形簇的角度理解，就会得到人们所说的构成这个单词的四个字母：

There are six `char` values here, but the fourth and sixth are not letters:
they’re diacritics that don’t make sense on their own. Finally, if we look at
them as grapheme clusters, we’d get what a person would call the four letters
that make up the Hindi word:

```text
["न", "म", "स्", "ते"]
```

Rust 提供了多种不同的方式来解释计算机储存的原始字符串数据，这样程序就可以选择它需要的表现方式，而无所谓是何种人类语言。

Rust provides different ways of interpreting the raw string data that computers
store so that each program can choose the interpretation it needs, no matter
what human language the data is in.

最后一个 Rust 不允许使用索引获取 String 字符的原因是，索引操作预期总是需要常数时间（O(1)）。但是对于 String 不可能保证这样的性能，因为 Rust 必须从开头到索引位置遍历来确定有多少有效的字符。

A final reason Rust doesn’t allow us to index into a `String` to get a
character is that indexing operations are expected to always take constant time
(O(1)). But it isn’t possible to guarantee that performance with a `String`,
because Rust would have to walk through the contents from the beginning to the
index to determine how many valid characters there were.

### Slicing Strings 字符串 slice

索引字符串通常是一个坏点子，因为字符串索引应该返回的类型是不明确的：字节值、字符、字形簇或者字符串 slice。因此，如果你真的希望使用索引创建字符串 slice 时，Rust 会要求你更明确一些。为了更明确索引并表明你需要一个字符串 slice，相比使用 [] 和单个值的索引，可以使用 [] 和一个 range 来创建含特定字节的字符串 slice：

Indexing into a string is often a bad idea because it’s not clear what the
return type of the string-indexing operation should be: a byte value, a
character, a grapheme cluster, or a string slice. If you really need to use
indices to create string slices, therefore, Rust asks you to be more specific.

Rather than indexing using `[]` with a single number, you can use `[]` with a
range to create a string slice containing particular bytes:

```rust
let hello = "Здравствуйте";

let s = &hello[0..4];
```

这里，s 会是一个 &str，它包含字符串的头四个字节。早些时候，我们提到了这些字母都是两个字节长的，所以这意味着 s 将会是 “Зд”。

Here, `s` will be a `&str` that contains the first 4 bytes of the string.
Earlier, we mentioned that each of these characters was 2 bytes, which means
`s` will be `Зд`.

如果获取 &hello[0..1] 会发生什么呢？答案是：Rust 在运行时会 panic，就跟访问 vector 中的无效索引时一样：

If we were to try to slice only part of a character’s bytes with something like
`&hello[0..1]`, Rust would panic at runtime in the same way as if an invalid
index were accessed in a vector:

```console
$ cargo run
   Compiling collections v0.1.0 (file:///projects/collections)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.43s
     Running `target/debug/collections`
thread 'main' panicked at src/main.rs:4:19:
byte index 1 is not a char boundary; it is inside 'З' (bytes 0..2) of `Здравствуйте`
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

你应该小心谨慎地使用这个操作，因为这么做可能会使你的程序崩溃。

You should use ranges to create string slices with caution, because doing so
can crash your program.

### Methods for Iterating Over Strings 遍历字符串的方法

操作字符串每一部分的最好的方法是明确表示需要字符还是字节。对于单独的 Unicode 标量值使用 chars 方法。对 “Зд” 调用 chars 方法会将其分开并返回两个 char 类型的值，接着就可以遍历其结果来访问每一个元素了：

The best way to operate on pieces of strings is to be explicit about whether
you want characters or bytes. For individual Unicode scalar values, use the
`chars` method. Calling `chars` on “Зд” separates out and returns two values
of type `char`, and you can iterate over the result to access each element:

```rust
for c in "Зд".chars() {
    println!("{c}");
}
```

这些代码会打印出如下内容：

This code will print the following:

```text
З
д
```

另外 bytes 方法返回每一个原始字节，这可能会适合你的使用场景：

Alternatively, the `bytes` method returns each raw byte, which might be
appropriate for your domain:

```rust
for b in "Зд".bytes() {
    println!("{b}");
}
```

这些代码会打印出组成 String 的 4 个字节：

This code will print the four bytes that make up this string:

```text
208
151
208
180
```

不过请记住有效的 Unicode 标量值可能会由不止一个字节组成。

But be sure to remember that valid Unicode scalar values may be made up of more
than 1 byte.

从字符串中获取如同天城文这样的字形簇是很复杂的，所以标准库并没有提供这个功能。crates.io 上有些提供这样功能的 crate。

Getting grapheme clusters from strings as with the Devanagari script is
complex, so this functionality is not provided by the standard library. Crates
are available on [crates.io](https://crates.io/)<!-- ignore --> if this is the
functionality you need.

### Strings Are Not So Simple 字符串并不简单

总而言之，字符串还是很复杂的。不同的语言选择了不同的向程序员展示其复杂性的方式。Rust 选择了以准确的方式处理 String 数据作为所有 Rust 程序的默认行为，这意味着程序员们必须更多的思考如何预先处理 UTF-8 数据。这种权衡取舍相比其他语言更多的暴露出了字符串的复杂性，不过也使你在开发周期后期免于处理涉及非 ASCII 字符的错误。

To summarize, strings are complicated. Different programming languages make
different choices about how to present this complexity to the programmer. Rust
has chosen to make the correct handling of `String` data the default behavior
for all Rust programs, which means programmers have to put more thought into
handling UTF-8 data upfront. This trade-off exposes more of the complexity of
strings than is apparent in other programming languages, but it prevents you
from having to handle errors involving non-ASCII characters later in your
development life cycle.

好消息是标准库提供了很多围绕 String 和 &str 构建的功能，来帮助我们正确处理这些复杂场景。请务必查看这些使用方法的文档，例如 contains 来搜索一个字符串，和 replace 将字符串的一部分替换为另一个字符串。

The good news is that the standard library offers a lot of functionality built
off the `String` and `&str` types to help handle these complex situations
correctly. Be sure to check out the documentation for useful methods like
`contains` for searching in a string and `replace` for substituting parts of a
string with another string.

现在让我们转向一些不太复杂的集合：哈希 map！

Let’s switch to something a bit less complex: hash maps!
