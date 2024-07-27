## The Slice Type 切片类型

slice 允许你引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一种引用，所以它没有所有权。

_Slices_ let you reference a contiguous sequence of elements in a collection
rather than the whole collection. A slice is a kind of reference, so it does
not have ownership.

这里有一个编程小习题：编写一个函数，该函数接收一个用空格分隔单词的字符串，并返回在该字符串中找到的第一个单词。如果函数在该字符串中并未找到空格，则整个字符串就是一个单词，所以应该返回整个字符串。

Here’s a small programming problem: write a function that takes a string of
words separated by spaces and returns the first word it finds in that string.
If the function doesn’t find a space in the string, the whole string must be
one word, so the entire string should be returned.

让我们推敲下如何不用 slice 编写这个函数的签名，来理解 slice 能解决的问题：

Let’s work through how we’d write the signature of this function without using
slices, to understand the problem that slices will solve:

```rust
fn first_word(s: &String) -> ?
```

first_word 函数有一个参数 &String。因为我们不需要所有权，所以这没有问题。不过应该返回什么呢？我们并没有一个真正获取 部分 字符串的办法。不过，我们可以返回单词结尾的索引，结尾由一个空格表示。试试如示例 4-7 中的代码。

The `first_word` function has a `&String` as a parameter. We don’t want
ownership, so this is fine. But what should we return? We don’t really have a
way to talk about _part_ of a string. However, we could return the index of the
end of the word, indicated by a space. Let’s try that, as shown in Listing 4-7.

<span class="filename">Filename: src/main.rs</span>

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}
```

<span class="caption">
示例 4-7：first_word 函数返回 String 参数的一个字节索引值
Listing 4-7: The `first_word` function that returns a
byte index value into the `String` parameter</span>

因为需要逐个元素的检查 String 中的值是否为空格，需要用 as_bytes 方法将 String 转化为字节数组。

Because we need to go through the `String` element by element and check whether
a value is a space, we’ll convert our `String` to an array of bytes using the
`as_bytes` method.

```rust
let bytes = s.as_bytes();
```

接下来，使用 iter 方法在字节数组上创建一个迭代器：

Next, we create an iterator over the array of bytes using the `iter` method:

```rust
for (i, &item) in bytes.iter().enumerate() {
```

我们将在第十三章详细讨论迭代器。现在，只需知道 iter 方法返回集合中的每一个元素，而 enumerate 包装了 iter 的结果，将这些元素作为元组的一部分来返回。enumerate 返回的元组中，第一个元素是索引，第二个元素是集合中元素的引用。这比我们自己计算索引要方便一些。

We’ll discuss iterators in more detail in [Chapter 13][ch13]<!-- ignore -->.
For now, know that `iter` is a method that returns each element in a collection
and that `enumerate` wraps the result of `iter` and returns each element as
part of a tuple instead. The first element of the tuple returned from
`enumerate` is the index, and the second element is a reference to the element.
This is a bit more convenient than calculating the index ourselves.

因为 enumerate 方法返回一个元组，我们可以使用模式来解构，我们将在第六章中进一步讨论有关模式的问题。所以在 for 循环中，我们指定了一个模式，其中元组中的 i 是索引而元组中的 &item 是单个字节。因为我们从 .iter().enumerate() 中获取了集合元素的引用，所以模式中使用了 &。

Because the `enumerate` method returns a tuple, we can use patterns to
destructure that tuple. We’ll be discussing patterns more in [Chapter
6][ch6]<!-- ignore -->. In the `for` loop, we specify a pattern that has `i`
for the index in the tuple and `&item` for the single byte in the tuple.
Because we get a reference to the element from `.iter().enumerate()`, we use
`&` in the pattern.

在 for 循环中，我们通过字节的字面值语法来寻找代表空格的字节。如果找到了一个空格，返回它的位置。否则，使用 s.len() 返回字符串的长度：

Inside the `for` loop, we search for the byte that represents the space by
using the byte literal syntax. If we find a space, we return the position.
Otherwise, we return the length of the string by using `s.len()`.

```rust
if item == b' ' {
      return i;
  }
}

s.len()
```

现在有了一个找到字符串中第一个单词结尾索引的方法，不过这有一个问题。我们返回了一个独立的 usize，不过它只在 &String 的上下文中才是一个有意义的数字。换句话说，因为它是一个与 String 相分离的值，无法保证将来它仍然有效。考虑一下示例 4-8 中使用了示例 4-7 中 first_word 函数的程序。

We now have a way to find out the index of the end of the first word in the
string, but there’s a problem. We’re returning a `usize` on its own, but it’s
only a meaningful number in the context of the `&String`. In other words,
because it’s a separate value from the `String`, there’s no guarantee that it
will still be valid in the future. Consider the program in Listing 4-8 that
uses the `first_word` function from Listing 4-7.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word 的值为 5

    s.clear(); // 这清空了字符串，使其等于 ""

    // word 在此处的值仍然是 5，
    // 但是没有更多的字符串让我们可以有效地应用数值 5。word 的值现在完全无效！
}
```

<span class="caption">
示例 4-8：存储 first_word 函数调用的返回值并接着改变 String 的内容
Listing 4-8: Storing the result from calling the
`first_word` function and then changing the `String` contents</span>

这个程序编译时没有任何错误，而且在调用 s.clear() 之后使用 word 也不会出错。因为 word 与 s 状态完全没有联系，所以 word 仍然包含值 5。可以尝试用值 5 来提取变量 s 的第一个单词，不过这是有 bug 的，因为在我们将 5 保存到 word 之后 s 的内容已经改变。

This program compiles without any errors and would also do so if we used `word`
after calling `s.clear()`. Because `word` isn’t connected to the state of `s`
at all, `word` still contains the value `5`. We could use that value `5` with
the variable `s` to try to extract the first word out, but this would be a bug
because the contents of `s` have changed since we saved `5` in `word`.

我们不得不时刻担心 word 的索引与 s 中的数据不再同步，这很啰嗦且易出错！如果编写这么一个 second_word 函数的话，管理索引这件事将更加容易出问题。它的签名看起来像这样：

Having to worry about the index in `word` getting out of sync with the data in
`s` is tedious and error prone! Managing these indices is even more brittle if
we write a `second_word` function. Its signature would have to look like this:

```rust
fn second_word(s: &String) -> (usize, usize) {
```

现在我们要跟踪一个开始索引 和 一个结尾索引，同时有了更多从数据的某个特定状态计算而来的值，但都完全没有与这个状态相关联。现在有三个飘忽不定的不相关变量需要保持同步。

Now we’re tracking a starting _and_ an ending index, and we have even more
values that were calculated from data in a particular state but aren’t tied to
that state at all. We have three unrelated variables floating around that need
to be kept in sync.

幸运的是，Rust 为这个问题提供了一个解决方法：字符串 slice。

Luckily, Rust has a solution to this problem: string slices.

### String Slices 字符串切片

字符串 slice（string slice）是 String 中一部分值的引用，它看起来像这样：

A _string slice_ is a reference to part of a `String`, and it looks like this:

```rust
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];
```

不同于整个 String 的引用，hello 是一个部分 String 的引用，由一个额外的 [0..5] 部分指定。可以使用一个由中括号中的 [starting_index..ending_index] 指定的 range 创建一个 slice，其中 starting_index 是 slice 的第一个位置，ending_index 则是 slice 最后一个位置的后一个值。在其内部，slice 的数据结构存储了 slice 的开始位置和长度，长度对应于 ending_index 减去 starting_index 的值。所以对于 let world = &s[6..11]; 的情况，world 将是一个包含指向 s 索引 6 的指针和长度值 5 的 slice。

Rather than a reference to the entire `String`, `hello` is a reference to a
portion of the `String`, specified in the extra `[0..5]` bit. We create slices
using a range within brackets by specifying `[starting_index..ending_index]`,
where `starting_index` is the first position in the slice and `ending_index` is
one more than the last position in the slice. Internally, the slice data
structure stores the starting position and the length of the slice, which
corresponds to `ending_index` minus `starting_index`. So, in the case of `let
world = &s[6..11];`, `world` would be a slice that contains a pointer to the
byte at index 6 of `s` with a length value of `5`.

Figure 4-6 shows this in a diagram.

<img alt="Three tables: a table representing the stack data of s, which points
to the byte at index 0 in a table of the string data &quot;hello world&quot; on
the heap. The third table rep-resents the stack data of the slice world, which
has a length value of 5 and points to byte 6 of the heap data table."
src="./img/trpl04-06.svg" class="center" style="width: 50%;" />

<span class="caption">
图 4-6：引用了部分 String 的字符串 slice
Figure 4-6: String slice referring to part of a
`String`</span>

对于 Rust 的 .. range 语法，如果想要从索引 0 开始，可以不写两个点号之前的值。换句话说，如下两个语句是相同的：

With Rust’s `..` range syntax, if you want to start at index 0, you can drop
the value before the two periods. In other words, these are equal:

```rust
let s = String::from("hello");

let slice = &s[0..2];
let slice = &s[..2];
```

依此类推，如果 slice 包含 String 的最后一个字节，也可以舍弃尾部的数字。这意味着如下也是相同的：

By the same token, if your slice includes the last byte of the `String`, you
can drop the trailing number. That means these are equal:

```rust
let s = String::from("hello");

let len = s.len();

let slice = &s[3..len];
let slice = &s[3..];
```

也可以同时舍弃这两个值来获取整个字符串的 slice。所以如下亦是相同的：

You can also drop both values to take a slice of the entire string. So these
are equal:

```rust
let s = String::from("hello");

let len = s.len();

let slice = &s[0..len];
let slice = &s[..];
```

> 注意：字符串 slice range 的索引必须位于有效的 UTF-8 字符边界内，如果尝试从一个多字节字符的中间位置创建字符串 slice，则程序将会因错误而退出。出于介绍字符串 slice 的目的，本部分假设只使用 ASCII 字符集；第八章的 “使用字符串储存 UTF-8 编码的文本” 部分会更加全面的讨论 UTF-8 处理问题。
> Note: String slice range indices must occur at valid UTF-8 character
> boundaries. If you attempt to create a string slice in the middle of a
> multibyte character, your program will exit with an error. For the purposes
> of introducing string slices, we are assuming ASCII only in this section; a
> more thorough discussion of UTF-8 handling is in the [“Storing UTF-8 Encoded
> Text with Strings”][strings]<!-- ignore --> section of Chapter 8.

在记住所有这些知识后，让我们重写 first_word 来返回一个 slice。“字符串 slice” 的类型声明写作 &str：

With all this information in mind, let’s rewrite `first_word` to return a
slice. The type that signifies “string slice” is written as `&str`:

<span class="filename">Filename: src/main.rs</span>

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}
```

我们使用跟示例 4-7 相同的方式获取单词结尾的索引，通过寻找第一个出现的空格。当找到一个空格，我们返回一个字符串 slice，它使用字符串的开始和空格的索引作为开始和结束的索引。

We get the index for the end of the word the same way we did in Listing 4-7, by
looking for the first occurrence of a space. When we find a space, we return a
string slice using the start of the string and the index of the space as the
starting and ending indices.

现在当调用 first_word 时，会返回与底层数据关联的单个值。这个值由一个 slice 开始位置的引用和 slice 中元素的数量组成。

Now when we call `first_word`, we get back a single value that is tied to the
underlying data. The value is made up of a reference to the starting point of
the slice and the number of elements in the slice.

second_word 函数也可以改为返回一个 slice：

Returning a slice would also work for a `second_word` function:

```rust
fn second_word(s: &String) -> &str {
```

现在我们有了一个不易混淆且直观的 API 了，因为编译器会确保指向 String 的引用持续有效。还记得示例 4-8 程序中，那个当我们获取第一个单词结尾的索引后，接着就清除了字符串导致索引就无效的 bug 吗？那些代码在逻辑上是不正确的，但却没有显示任何直接的错误。问题会在之后尝试对空字符串使用第一个单词的索引时出现。slice 就不可能出现这种 bug 并让我们更早的知道出问题了。使用 slice 版本的 first_word 会抛出一个编译时错误：

We now have a straightforward API that’s much harder to mess up because the
compiler will ensure the references into the `String` remain valid. Remember
the bug in the program in Listing 4-8, when we got the index to the end of the
first word but then cleared the string so our index was invalid? That code was
logically incorrect but didn’t show any immediate errors. The problems would
show up later if we kept trying to use the first word index with an emptied
string. Slices make this bug impossible and let us know we have a problem with
our code much sooner. Using the slice version of `first_word` will throw a
compile-time error:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    s.clear(); // 错误！

    println!("the first word is: {}", word);
}
```

Here’s the compiler error:

```console
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
  --> src/main.rs:18:5
   |
16 |     let word = first_word(&s);
   |                           -- immutable borrow occurs here
17 |
18 |     s.clear(); // error!
   |     ^^^^^^^^^ mutable borrow occurs here
19 |
20 |     println!("the first word is: {word}");
   |                                  ------ immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership` (bin "ownership") due to 1 previous error
```

回忆一下借用规则，当拥有某值的不可变引用时，就不能再获取一个可变引用。因为 clear 需要清空 String，它尝试获取一个可变引用。在调用 clear 之后的 println! 使用了 word 中的引用，所以这个不可变的引用在此时必须仍然有效。Rust 不允许 clear 中的可变引用和 word 中的不可变引用同时存在，因此编译失败。Rust 不仅使得我们的 API 简单易用，也在编译时就消除了一整类的错误！

Recall from the borrowing rules that if we have an immutable reference to
something, we cannot also take a mutable reference. Because `clear` needs to
truncate the `String`, it needs to get a mutable reference. The `println!`
after the call to `clear` uses the reference in `word`, so the immutable
reference must still be active at that point. Rust disallows the mutable
reference in `clear` and the immutable reference in `word` from existing at the
same time, and compilation fails. Not only has Rust made our API easier to use,
but it has also eliminated an entire class of errors at compile time!

<!-- Old heading. Do not remove or links may break. -->

<a id="string-literals-are-slices"></a>

#### String Literals as Slices 字符串字面值就是切片

还记得我们讲到过字符串字面值被储存在二进制文件中吗？现在知道 slice 了，我们就可以正确地理解字符串字面值了：

Recall that we talked about string literals being stored inside the binary. Now
that we know about slices, we can properly understand string literals:

```rust
let s = "Hello, world!";
```

这里 s 的类型是 &str：它是一个指向二进制程序特定位置的 slice。这也就是为什么字符串字面值是不可变的；&str 是一个不可变引用。

The type of `s` here is `&str`: it’s a slice pointing to that specific point of
the binary. This is also why string literals are immutable; `&str` is an
immutable reference.

#### String Slices as Parameters 字符串切片作为参数

在知道了能够获取字面值和 String 的 slice 后，我们对 first_word 做了改进，这是它的签名：

Knowing that you can take slices of literals and `String` values leads us to
one more improvement on `first_word`, and that’s its signature:

```rust
fn first_word(s: &String) -> &str {
```

而更有经验的 Rustacean 会编写出示例 4-9 中的签名，因为它使得可以对 &String 值和 &str 值使用相同的函数：

A more experienced Rustacean would write the signature shown in Listing 4-9
instead because it allows us to use the same function on both `&String` values
and `&str` values.

```rust
fn first_word(s: &str) -> &str {
```

<span class="caption">
示例 4-9: 通过将 s 参数的类型改为字符串 slice 来改进 first_word 函数
Listing 4-9: Improving the `first_word` function by using
a string slice for the type of the `s` parameter</span>

如果有一个字符串 slice，可以直接传递它。如果有一个 String，则可以传递整个 String 的 slice 或对 String 的引用。这种灵活性利用了 deref coercions 的优势，这个特性我们将在“函数和方法的隐式 Deref 强制转换”章节中介绍。

If we have a string slice, we can pass that directly. If we have a `String`, we
can pass a slice of the `String` or a reference to the `String`. This
flexibility takes advantage of _deref coercions_, a feature we will cover in
[“Implicit Deref Coercions with Functions and
Methods”][deref-coercions]<!--ignore--> section of Chapter 15.

定义一个获取字符串 slice 而不是 String 引用的函数使得我们的 API 更加通用并且不会丢失任何功能：

Defining a function to take a string slice instead of a reference to a `String`
makes our API more general and useful without losing any functionality:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let my_string = String::from("hello world");

    // `first_word` 适用于 `String`（的 slice），部分或全部
    let word = first_word(&my_string[0..6]);
    let word = first_word(&my_string[..]);
    // `first_word` 也适用于 `String` 的引用，
    // 这等价于整个 `String` 的 slice
    let word = first_word(&my_string);

    let my_string_literal = "hello world";

    // `first_word` 适用于字符串字面值，部分或全部
    let word = first_word(&my_string_literal[0..6]);
    let word = first_word(&my_string_literal[..]);

    // 因为字符串字面值已经 **是** 字符串 slice 了，
    // 这也是适用的，无需 slice 语法！
    let word = first_word(my_string_literal);
}
```

### Other Slices 其他切片

字符串 slice，正如你想象的那样，是针对字符串的。不过也有更通用的 slice 类型。考虑一下这个数组：

String slices, as you might imagine, are specific to strings. But there’s a
more general slice type too. Consider this array:

```rust
let a = [1, 2, 3, 4, 5];
```

就跟我们想要获取字符串的一部分那样，我们也会想要引用数组的一部分。我们可以这样做：

Just as we might want to refer to part of a string, we might want to refer to
part of an array. We’d do so like this:

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];

assert_eq!(slice, &[2, 3]);
```

这个 slice 的类型是 &[i32]。它跟字符串 slice 的工作方式一样，通过存储第一个集合元素的引用和一个集合总长度。你可以对其他所有集合使用这类 slice。第八章讲到 vector 时会详细讨论这些集合。

This slice has the type `&[i32]`. It works the same way as string slices do, by
storing a reference to the first element and a length. You’ll use this kind of
slice for all sorts of other collections. We’ll discuss these collections in
detail when we talk about vectors in Chapter 8.

## Summary 总结

所有权、借用和 slice 这些概念让 Rust 程序在编译时确保内存安全。Rust 语言提供了跟其他系统编程语言相同的方式来控制你使用的内存，但拥有数据所有者在离开作用域后自动清除其数据的功能意味着你无须额外编写和调试相关的控制代码。

The concepts of ownership, borrowing, and slices ensure memory safety in Rust
programs at compile time. The Rust language gives you control over your memory
usage in the same way as other systems programming languages, but having the
owner of data automatically clean up that data when the owner goes out of scope
means you don’t have to write and debug extra code to get this control.

所有权系统影响了 Rust 中很多其他部分的工作方式，所以我们还会继续讲到这些概念，这将贯穿本书的余下内容。让我们开始第五章，来看看如何将多份数据组合进一个`struct`中。

Ownership affects how lots of other parts of Rust work, so we’ll talk about
these concepts further throughout the rest of the book. Let’s move on to
Chapter 5 and look at grouping pieces of data together in a `struct`.

[ch13]: ch13-02-iterators.html
[ch6]: ch06-02-match.html#patterns-that-bind-to-values
[strings]: ch08-02-strings.html#storing-utf-8-encoded-text-with-strings
[deref-coercions]: ch15-02-deref.html#implicit-deref-coercions-with-functions-and-methods
