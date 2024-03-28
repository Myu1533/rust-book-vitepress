## Comments 注释

所有开发人员为了让代码易于理解，但是有时候需要额外的解释。在这些案例中，开发人员利用注释要辅助，注释会被编译器忽略，但他人阅读代码时有很有用。
All programmers strive to make their code easy to understand, but sometimes
extra explanation is warranted. In these cases, programmers leave _comments_ in
their source code that the compiler will ignore but people reading the source
code may find useful.

这里有一个简单的注释

Here’s a simple comment:

```rust
// hello, world
```

在 Rust 中，通常注释结构以双斜杠开始，注释内容跟在双斜杠之后。超出一行的注释，那每一行都需要`//`作为开头，如下：

In Rust, the idiomatic comment style starts a comment with two slashes, and the
comment continues until the end of the line. For comments that extend beyond a
single line, you’ll need to include `//` on each line, like this:

```rust
// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.
```

注释也可以接在代码后面：
Comments can also be placed at the end of lines containing code:

<span class="filename">Filename: src/main.rs</span>

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-24-comments-end-of-line/src/main.rs}}
```

都你大部分时候使用的是下面的格式，注释与代码分离，写在代码上面一行：
But you’ll more often see them used in this format, with the comment on a
separate line above the code it’s annotating:

<span class="filename">Filename: src/main.rs</span>

```rust
{{#rustdoc_include ../listings/ch03-common-programming-concepts/no-listing-25-comments-above-line/src/main.rs}}
```

Rust 也有另外一种注释，文档注释，我们将在十四章讨论 [“Publishing a Crate to Crates.io”][publishing]

Rust also has another kind of comment, documentation comments, which we’ll
discuss in the [“Publishing a Crate to Crates.io”][publishing]<!-- ignore -->
section of Chapter 14.

[publishing]: ch14-02-publishing-to-crates-io.html
