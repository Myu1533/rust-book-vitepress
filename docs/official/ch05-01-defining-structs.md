## Defining and Instantiating Structs 结构体的定义和实例化

结构体和我们在“元组类型”部分论过的元组类似，它们都包含多个相关的值。和元组一样，结构体的每一部分可以是不同类型。但不同于元组，结构体需要命名各部分数据以便能清楚的表明其值的意义。由于有了这些名字，结构体比元组更灵活：不需要依赖顺序来指定或访问实例中的值。

Structs are similar to tuples, discussed in [“The Tuple Type”][tuples]<!--
ignore --> section, in that both hold multiple related values. Like tuples, the
pieces of a struct can be different types. Unlike with tuples, in a struct
you’ll name each piece of data so it’s clear what the values mean. Adding these
names means that structs are more flexible than tuples: you don’t have to rely
on the order of the data to specify or access the values of an instance.

定义结构体，需要使用 struct 关键字并为整个结构体提供一个名字。结构体的名字需要描述它所组合的数据的意义。接着，在大括号中，定义每一部分数据的名字和类型，我们称为 字段（field）。例如，示例 5-1 展示了一个存储用户账号信息的结构体：

To define a struct, we enter the keyword `struct` and name the entire struct. A
struct’s name should describe the significance of the pieces of data being
grouped together. Then, inside curly brackets, we define the names and types of
the pieces of data, which we call _fields_. For example, Listing 5-1 shows a
struct that stores information about a user account.

<span class="filename">Filename: src/main.rs</span>

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

<span class="caption">Listing 5-1: A `User` struct definition</span>

一旦定义了结构体后，为了使用它，通过为每个字段指定具体值来创建这个结构体的 实例。创建一个实例需要以结构体的名字开头，接着在大括号中使用 key: value 键 - 值对的形式提供字段，其中 key 是字段的名字，value 是需要存储在字段中的数据值。实例中字段的顺序不需要和它们在结构体中声明的顺序一致。换句话说，结构体的定义就像一个类型的通用模板，而实例则会在这个模板中放入特定数据来创建这个类型的值。例如，可以像示例 5-2 这样来声明一个特定的用户：

To use a struct after we’ve defined it, we create an _instance_ of that struct
by specifying concrete values for each of the fields. We create an instance by
stating the name of the struct and then add curly brackets containing _key:
value_ pairs, where the keys are the names of the fields and the values are the
data we want to store in those fields. We don’t have to specify the fields in
the same order in which we declared them in the struct. In other words, the
struct definition is like a general template for the type, and instances fill
in that template with particular data to create values of the type. For
example, we can declare a particular user as shown in Listing 5-2.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
}
```

<span class="caption">
示例 5-2：创建 User 结构体的实例
Listing 5-2: Creating an instance of the `User`
struct</span>

为了从结构体中获取某个特定的值，可以使用点号。举个例子，想要用户的邮箱地址，可以用 user1.email。如果结构体的实例是可变的，我们可以使用点号并为对应的字段赋值。示例 5-3 展示了如何改变一个可变的 User 实例中 email 字段的值：

To get a specific value from a struct, we use dot notation. For example, to
access this user’s email address, we use `user1.email`. If the instance is
mutable, we can change a value by using the dot notation and assigning into a
particular field. Listing 5-3 shows how to change the value in the `email`
field of a mutable `User` instance.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let mut user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");
}
```

<span class="caption">
示例 5-3：改变 User 实例 email 字段的值
Listing 5-3: Changing the value in the `email` field of a
`User` instance</span>

注意整个实例必须是可变的；Rust 并不允许只将某个字段标记为可变。另外需要注意同其他任何表达式一样，我们可以在函数体的最后一个表达式中构造一个结构体的新实例，来隐式地返回这个实例。

Note that the entire instance must be mutable; Rust doesn’t allow us to mark
only certain fields as mutable. As with any expression, we can construct a new
instance of the struct as the last expression in the function body to
implicitly return that new instance.

示例 5-4 显示了一个 build_user 函数，它返回一个带有给定的 email 和用户名的 User 结构体实例。active 字段的值为 true，并且 sign_in_count 的值为 1。

Listing 5-4 shows a `build_user` function that returns a `User` instance with
the given email and username. The `active` field gets the value of `true`, and
the `sign_in_count` gets a value of `1`.

<span class="filename">Filename: src/main.rs</span>

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username: username,
        email: email,
        sign_in_count: 1,
    }
}
```

<span class="caption">
示例 5-4：build_user 函数获取 email 和用户名并返回 User 实例
Listing 5-4: A `build_user` function that takes an email
and username and returns a `User` instance</span>

为函数参数起与结构体字段相同的名字是可以理解的，但是不得不重复 email 和 username 字段名称与变量有些啰嗦。如果结构体有更多字段，重复每个名称就更加烦人了。幸运的是，有一个方便的简写语法！

It makes sense to name the function parameters with the same name as the struct
fields, but having to repeat the `email` and `username` field names and
variables is a bit tedious. If the struct had more fields, repeating each name
would get even more annoying. Luckily, there’s a convenient shorthand!

<!-- Old heading. Do not remove or links may break. -->

<a id="using-the-field-init-shorthand-when-variables-and-fields-have-the-same-name"></a>

### Using the Field Init Shorthand 使用字段初始化简写语法

因为示例 5-4 中的参数名与字段名都完全相同，我们可以使用 字段初始化简写语法（field init shorthand）来重写 build_user，这样其行为与之前完全相同，不过无需重复 username 和 email 了，如示例 5-5 所示。

Because the parameter names and the struct field names are exactly the same in
Listing 5-4, we can use the _field init shorthand_ syntax to rewrite
`build_user` so it behaves exactly the same but doesn’t have the repetition of
`username` and `email`, as shown in Listing 5-5.

<span class="filename">Filename: src/main.rs</span>

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

<span class="caption">
示例 5-5：build_user 函数使用了字段初始化简写语法，因为 username 和 email 参数与结构体字段同名
Listing 5-5: A `build_user` function that uses field init
shorthand because the `username` and `email` parameters have the same name as
struct fields</span>

这里我们创建了一个新的 User 结构体实例，它有一个叫做 email 的字段。我们想要将 email 字段的值设置为 build_user 函数 email 参数的值。因为 email 字段与 email 参数有着相同的名称，则只需编写 email 而不是 email: email。

Here, we’re creating a new instance of the `User` struct, which has a field
named `email`. We want to set the `email` field’s value to the value in the
`email` parameter of the `build_user` function. Because the `email` field and
the `email` parameter have the same name, we only need to write `email` rather
than `email: email`.

### Creating Instances from Other Instances with Struct Update Syntax 使用结构体更新语法从其他实例创建实例

使用旧实例的大部分值但改变其部分值来创建一个新的结构体实例通常是很有用的。这可以通过 结构体更新语法（struct update syntax）实现。

It’s often useful to create a new instance of a struct that includes most of
the values from another instance, but changes some. You can do this using
_struct update syntax_.

首先，示例 5-6 展示了不使用更新语法时，如何在 user2 中创建一个新 User 实例。我们为 email 设置了新的值，其他值则使用了实例 5-2 中创建的 user1 中的同名值：

First, in Listing 5-6 we show how to create a new `User` instance in `user2`
regularly, without the update syntax. We set a new value for `email` but
otherwise use the same values from `user1` that we created in Listing 5-2.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    // --snip--

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("another@example.com"),
        sign_in_count: user1.sign_in_count,
    };
}
```

<span class="caption">
示例 5-6：使用 user1 中的一个值创建一个新的 User 实例
Listing 5-6: Creating a new `User` instance using one of
the values from `user1`</span>

使用结构体更新语法，我们可以通过更少的代码来达到相同的效果，如示例 5-7 所示。.. 语法指定了剩余未显式设置值的字段应有与给定实例对应字段相同的值。

Using struct update syntax, we can achieve the same effect with less code, as
shown in Listing 5-7. The syntax `..` specifies that the remaining fields not
explicitly set should have the same value as the fields in the given instance.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

<span class="caption">
示例 5-7：使用结构体更新语法为一个 User 实例设置一个新的 email 值，不过其余值来自 user1 变量中实例的字段
Listing 5-7: Using struct update syntax to set a new
`email` value for a `User` instance but to use the rest of the values from
`user1`</span>

示例 5-7 中的代码也在 user2 中创建了一个新实例，但该实例中 email 字段的值与 user1 不同，而 username、 active 和 sign_in_count 字段的值与 user1 相同。..user1 必须放在最后，以指定其余的字段应从 user1 的相应字段中获取其值，但我们可以选择以任何顺序为任意字段指定值，而不用考虑结构体定义中字段的顺序。

The code in Listing 5-7 also creates an instance in `user2` that has a
different value for `email` but has the same values for the `username`,
`active`, and `sign_in_count` fields from `user1`. The `..user1` must come last
to specify that any remaining fields should get their values from the
corresponding fields in `user1`, but we can choose to specify values for as
many fields as we want in any order, regardless of the order of the fields in
the struct’s definition.

请注意，结构更新语法就像带有 = 的赋值，因为它移动了数据，就像我们在“变量与数据交互的方式（一）：移动”部分讲到的一样。在这个例子中，总体上说我们在创建 user2 后不能就再使用 user1 了，因为 user1 的 username 字段中的 String 被移到 user2 中。如果我们给 user2 的 email 和 username 都赋予新的 String 值，从而只使用 user1 的 active 和 sign_in_count 值，那么 user1 在创建 user2 后仍然有效。active 和 sign_in_count 的类型是实现 Copy trait 的类型，所以我们在“变量与数据交互的方式（二）：克隆” 部分讨论的行为同样适用。

Note that the struct update syntax uses `=` like an assignment; this is because
it moves the data, just as we saw in the [“Variables and Data Interacting with
Move”][move]<!-- ignore --> section. In this example, we can no longer use
`user1` as a whole after creating `user2` because the `String` in the
`username` field of `user1` was moved into `user2`. If we had given `user2` new
`String` values for both `email` and `username`, and thus only used the
`active` and `sign_in_count` values from `user1`, then `user1` would still be
valid after creating `user2`. Both `active` and `sign_in_count` are types that
implement the `Copy` trait, so the behavior we discussed in the [“Stack-Only
Data: Copy”][copy]<!-- ignore --> section would apply.

### Using Tuple Structs Without Named Fields to Create Different Types 使用没有命名字段的元组结构体来创建不同的类型

也可以定义与元组（在第三章讨论过）类似的结构体，称为 元组结构体（tuple structs）。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。当你想给整个元组取一个名字，并使元组成为与其他元组不同的类型时，元组结构体是很有用的，这时像常规结构体那样为每个字段命名就显得多余和形式化了。

Rust also supports structs that look similar to tuples, called _tuple structs_.
Tuple structs have the added meaning the struct name provides but don’t have
names associated with their fields; rather, they just have the types of the
fields. Tuple structs are useful when you want to give the whole tuple a name
and make the tuple a different type from other tuples, and when naming each
field as in a regular struct would be verbose or redundant.

要定义元组结构体，以 struct 关键字和结构体名开头并后跟元组中的类型。例如，下面是两个分别叫做 Color 和 Point 元组结构体的定义和用法：

To define a tuple struct, start with the `struct` keyword and the struct name
followed by the types in the tuple. For example, here we define and use two
tuple structs named `Color` and `Point`:

<span class="filename">Filename: src/main.rs</span>

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

注意 black 和 origin 值的类型不同，因为它们是不同的元组结构体的实例。你定义的每一个结构体有其自己的类型，即使结构体中的字段可能有着相同的类型。例如，一个获取 Color 类型参数的函数不能接受 Point 作为参数，即便这两个类型都由三个 i32 值组成。在其他方面，元组结构体实例类似于元组，你可以将它们解构为单独的部分，也可以使用 . 后跟索引来访问单独的值，等等。

Note that the `black` and `origin` values are different types because they’re
instances of different tuple structs. Each struct you define is its own type,
even though the fields within the struct might have the same types. For
example, a function that takes a parameter of type `Color` cannot take a
`Point` as an argument, even though both types are made up of three `i32`
values. Otherwise, tuple struct instances are similar to tuples in that you can
destructure them into their individual pieces, and you can use a `.` followed
by the index to access an individual value.

### Unit-Like Structs Without Any Fields 没有任何字段的类单元结构体

我们也可以定义一个没有任何字段的结构体！它们被称为 类单元结构体（unit-like structs）因为它们类似于 ()，即“元组类型”一节中提到的 unit 类型。类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。我们将在第十章介绍 trait。下面是一个声明和实例化一个名为 AlwaysEqual 的 unit 结构的例子。

You can also define structs that don’t have any fields! These are called
_unit-like structs_ because they behave similarly to `()`, the unit type that
we mentioned in [“The Tuple Type”][tuples]<!-- ignore --> section. Unit-like
structs can be useful when you need to implement a trait on some type but don’t
have any data that you want to store in the type itself. We’ll discuss traits
in Chapter 10. Here’s an example of declaring and instantiating a unit struct
named `AlwaysEqual`:

<span class="filename">Filename: src/main.rs</span>

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

为了定义 AlwaysEqual，我们使用 struct 关键字，接着是我们想要的名称，然后是一个分号。不需要花括号或圆括号！然后，我们可以以类似的方式在 subject 变量中创建 AlwaysEqual 的实例：只需使用我们定义的名称，无需任何花括号或圆括号。设想我们稍后将为这个类型实现某种行为，使得每个 AlwaysEqual 的实例始终等于任何其它类型的实例，也许是为了获得一个已知的结果以便进行测试。我们无需要任何数据来实现这种行为！在第十章中，你会看到如何定义特征并在任何类型上实现它们，包括类单元结构体。

To define `AlwaysEqual`, we use the `struct` keyword, the name we want, and
then a semicolon. No need for curly brackets or parentheses! Then we can get an
instance of `AlwaysEqual` in the `subject` variable in a similar way: using the
name we defined, without any curly brackets or parentheses. Imagine that later
we’ll implement behavior for this type such that every instance of
`AlwaysEqual` is always equal to every instance of any other type, perhaps to
have a known result for testing purposes. We wouldn’t need any data to
implement that behavior! You’ll see in Chapter 10 how to define traits and
implement them on any type, including unit-like structs.

> ### Ownership of Struct Data 结构体数据的所有权
>
> 在示例 5-1 中的 User 结构体的定义中，我们使用了自身拥有所有权的 String 类型而不是 &str 字符串 slice 类型。这是一个有意而为之的选择，因为我们想要这个结构体拥有它所有的数据，为此只要整个结构体是有效的话其数据也是有效的。
> In the `User` struct definition in Listing 5-1, we used the owned `String`
> type rather than the `&str` string slice type. This is a deliberate choice
> because we want each instance of this struct to own all of its data and for
> that data to be valid for as long as the entire struct is valid.
>
> 可以使结构体存储被其他对象拥有的数据的引用，不过这么做的话需要用上 生命周期（lifetimes），这是一个第十章会讨论的 Rust 功能。生命周期确保结构体引用的数据有效性跟结构体本身保持一致。如果你尝试在结构体中存储一个引用而不指定生命周期将是无效的，比如这样：
> It’s also possible for structs to store references to data owned by something
> else, but to do so requires the use of _lifetimes_, a Rust feature that we’ll
> discuss in Chapter 10. Lifetimes ensure that the data referenced by a struct
> is valid for as long as the struct is. Let’s say you try to store a reference
> in a struct without specifying lifetimes, like the following; this won’t work:
>
> <span class="filename">Filename: src/main.rs</span>
>
> <!-- CAN'T EXTRACT SEE https://github.com/rust-lang/mdBook/issues/1127 -->
>
> ```rust
> struct User {
>     active: bool,
>     username: &str,
>     email: &str,
>     sign_in_count: u64,
> }
>
> fn main() {
>     let user1 = User {
>         active: true,
>         username: "someusername123",
>         email: "someone@example.com",
>         sign_in_count: 1,
>     };
> }
> ```
>
> 编译器会抱怨它需要生命周期标识符：
> The compiler will complain that it needs lifetime specifiers:
>
> ```console
> $ cargo run
>    Compiling structs v0.1.0 (file:///projects/structs)
> error[E0106]: missing lifetime specifier
>  --> src/main.rs:3:15
>   |
> 3 |     username: &str,
>   |               ^ expected named lifetime parameter
>   |
> help: consider introducing a named lifetime parameter
>   |
> 1 ~ struct User<'a> {
> 2 |     active: bool,
> 3 ~     username: &'a str,
>   |
>
> error[E0106]: missing lifetime specifier
>  --> src/main.rs:4:12
>   |
> 4 |     email: &str,
>   |            ^ expected named lifetime parameter
>   |
> help: consider introducing a named lifetime parameter
>   |
> 1 ~ struct User<'a> {
> 2 |     active: bool,
> 3 |     username: &str,
> 4 ~     email: &'a str,
>   |
>
> For more information about this error, try `rustc --explain E0106`.
> error: could not compile `structs` (bin "structs") due to 2 previous errors
> ```
>
> 第十章会讲到如何修复这个问题以便在结构体中存储引用，不过现在，我们会使用像 String 这类拥有所有权的类型来替代 &str 这样的引用以修正这个错误。
> In Chapter 10, we’ll discuss how to fix these errors so you can store
> references in structs, but for now, we’ll fix errors like these using owned
> types like `String` instead of references like `&str`.

<!-- manual-regeneration
for the error above
after running update-rustc.sh:
pbcopy < listings/ch05-using-structs-to-structure-related-data/no-listing-02-reference-in-struct/output.txt
paste above
add `> ` before every line -->

[tuples]: ch03-02-data-types.html#the-tuple-type
[move]: ch04-01-what-is-ownership.html#variables-and-data-interacting-with-move
[copy]: ch04-01-what-is-ownership.html#stack-only-data-copy
