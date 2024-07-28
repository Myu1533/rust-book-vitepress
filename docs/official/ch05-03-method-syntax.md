## Method Syntax 方法语法

方法（method）与函数类似：它们使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数是不同的，因为它们在结构体的上下文中被定义（或者是枚举或 trait 对象的上下文，将分别在第六章和第十七章讲解），并且它们第一个参数总是 self，它代表调用该方法的结构体实例。

_Methods_ are similar to functions: we declare them with the `fn` keyword and a
name, they can have parameters and a return value, and they contain some code
that’s run when the method is called from somewhere else. Unlike functions,
methods are defined within the context of a struct (or an enum or a trait
object, which we cover in [Chapter 6][enums]<!-- ignore --> and [Chapter
17][trait-objects]<!-- ignore -->, respectively), and their first parameter is
always `self`, which represents the instance of the struct the method is being
called on.

### Defining Methods 定义方法

让我们把前面实现的获取一个 Rectangle 实例作为参数的 area 函数，改写成一个定义于 Rectangle 结构体上的 area 方法，如示例 5-13 所示：

Let’s change the `area` function that has a `Rectangle` instance as a parameter
and instead make an `area` method defined on the `Rectangle` struct, as shown
in Listing 5-13.

<span class="filename">Filename: src/main.rs</span>

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

<span class="caption">
示例 5-13：在 Rectangle 结构体上定义 area 方法
Listing 5-13: Defining an `area` method on the
`Rectangle` struct</span>

为了使函数定义于 Rectangle 的上下文中，我们开始了一个 impl 块（impl 是 implementation 的缩写），这个 impl 块中的所有内容都将与 Rectangle 类型相关联。接着将 area 函数移动到 impl 大括号中，并将签名中的第一个（在这里也是唯一一个）参数和函数体中其他地方的对应参数改成 self。然后在 main 中将我们先前调用 area 方法并传递 rect1 作为参数的地方，改成使用 方法语法（method syntax）在 Rectangle 实例上调用 area 方法。方法语法获取一个实例并加上一个点号，后跟方法名、圆括号以及任何参数。

To define the function within the context of `Rectangle`, we start an `impl`
(implementation) block for `Rectangle`. Everything within this `impl` block
will be associated with the `Rectangle` type. Then we move the `area` function
within the `impl` curly brackets and change the first (and in this case, only)
parameter to be `self` in the signature and everywhere within the body. In
`main`, where we called the `area` function and passed `rect1` as an argument,
we can instead use _method syntax_ to call the `area` method on our `Rectangle`
instance. The method syntax goes after an instance: we add a dot followed by
the method name, parentheses, and any arguments.

在 area 的签名中，使用 &self 来替代 rectangle: &Rectangle，&self 实际上是 self: &Self 的缩写。在一个 impl 块中，Self 类型是 impl 块的类型的别名。方法的第一个参数必须有一个名为 self 的 Self 类型的参数，所以 Rust 让你在第一个参数位置上只用 self 这个名字来简化。注意，我们仍然需要在 self 前面使用 & 来表示这个方法借用了 Self 实例，就像我们在 rectangle: &Rectangle 中做的那样。方法可以选择获得 self 的所有权，或者像我们这里一样不可变地借用 self，或者可变地借用 self，就跟其他参数一样。

In the signature for `area`, we use `&self` instead of `rectangle: &Rectangle`.
The `&self` is actually short for `self: &Self`. Within an `impl` block, the
type `Self` is an alias for the type that the `impl` block is for. Methods must
have a parameter named `self` of type `Self` for their first parameter, so Rust
lets you abbreviate this with only the name `self` in the first parameter spot.
Note that we still need to use the `&` in front of the `self` shorthand to
indicate that this method borrows the `Self` instance, just as we did in
`rectangle: &Rectangle`. Methods can take ownership of `self`, borrow `self`
immutably, as we’ve done here, or borrow `self` mutably, just as they can any
other parameter.

这里选择 &self 的理由跟在函数版本中使用 &Rectangle 是相同的：我们并不想获取所有权，只希望能够读取结构体中的数据，而不是写入。如果想要在方法中改变调用方法的实例，需要将第一个参数改为 &mut self。通过仅仅使用 self 作为第一个参数来使方法获取实例的所有权是很少见的；这种技术通常用在当方法将 self 转换成别的实例的时候，这时我们想要防止调用者在转换之后使用原始的实例。

We chose `&self` here for the same reason we used `&Rectangle` in the function
version: we don’t want to take ownership, and we just want to read the data in
the struct, not write to it. If we wanted to change the instance that we’ve
called the method on as part of what the method does, we’d use `&mut self` as
the first parameter. Having a method that takes ownership of the instance by
using just `self` as the first parameter is rare; this technique is usually
used when the method transforms `self` into something else and you want to
prevent the caller from using the original instance after the transformation.

使用方法替代函数，除了可使用方法语法和不需要在每个函数签名中重复 self 的类型之外，其主要好处在于组织性。我们将某个类型实例能做的所有事情都一起放入 impl 块中，而不是让将来的用户在我们的库中到处寻找 Rectangle 的功能。

The main reason for using methods instead of functions, in addition to
providing method syntax and not having to repeat the type of `self` in every
method’s signature, is for organization. We’ve put all the things we can do
with an instance of a type in one `impl` block rather than making future users
of our code search for capabilities of `Rectangle` in various places in the
library we provide.

请注意，我们可以选择将方法的名称与结构中的一个字段相同。例如，我们可以在 Rectangle 上定义一个方法，并命名为 width：

Note that we can choose to give a method the same name as one of the struct’s
fields. For example, we can define a method on `Rectangle` that is also named
`width`:

<span class="filename">Filename: src/main.rs</span>

```rust
impl Rectangle {
    fn width(&self) -> bool {
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    if rect1.width() {
        println!("The rectangle has a nonzero width; it is {}", rect1.width);
    }
}
```

在这里，我们选择让 width 方法在实例的 width 字段的值大于 0 时返回 true，等于 0 时则返回 false：我们可以出于任何目的，在同名的方法中使用同名的字段。在 main 中，当我们在 rect1.width 后面加上括号时。Rust 知道我们指的是方法 width。当我们不使用圆括号时，Rust 知道我们指的是字段 width。

Here, we’re choosing to make the `width` method return `true` if the value in
the instance’s `width` field is greater than `0` and `false` if the value is
`0`: we can use a field within a method of the same name for any purpose. In
`main`, when we follow `rect1.width` with parentheses, Rust knows we mean the
method `width`. When we don’t use parentheses, Rust knows we mean the field
`width`.

通常，但并不总是如此，与字段同名的方法将被定义为只返回字段中的值，而不做其他事情。这样的方法被称为 getters，Rust 并不像其他一些语言那样为结构字段自动实现它们。Getters 很有用，因为你可以把字段变成私有的，但方法是公共的，这样就可以把对字段的只读访问作为该类型公共 API 的一部分。我们将在第七章中讨论什么是公有和私有，以及如何将一个字段或方法指定为公有或私有。

Often, but not always, when we give a method the same name as a field we want
it to only return the value in the field and do nothing else. Methods like this
are called _getters_, and Rust does not implement them automatically for struct
fields as some other languages do. Getters are useful because you can make the
field private but the method public, and thus enable read-only access to that
field as part of the type’s public API. We will discuss what public and private
are and how to designate a field or method as public or private in [Chapter
7][public]<!-- ignore -->.

> ### Where’s the `->` Operator? -> 运算符到哪去了？
>
> 在 C/C++ 语言中，有两个不同的运算符来调用方法：. 直接在对象上调用方法，而 -> 在一个对象的指针上调用方法，这时需要先解引用（dereference）指针。换句话说，如果 object 是一个指针，那么 object->something() 就像 (*object).something() 一样。
> In C and C++, two different operators are used for calling methods: you use
> `.` if you’re calling a method on the object directly and `->` if you’re
> calling the method on a pointer to the object and need to dereference the
> pointer first. In other words, if `object` is a pointer,
> `object->something()` is similar to `(*object).something()`.
>
> Rust 并没有一个与 -> 等效的运算符；相反，Rust 有一个叫 自动引用和解引用（automatic referencing and dereferencing）的功能。方法调用是 Rust 中少数几个拥有这种行为的地方。
> Rust doesn’t have an equivalent to the `->` operator; instead, Rust has a
> feature called _automatic referencing and dereferencing_. Calling methods is
> one of the few places in Rust that has this behavior.
>
> 它是这样工作的：当使用 object.something() 调用方法时，Rust 会自动为 object 添加 &、&mut 或 _ 以便使 object 与方法签名匹配。也就是说，这些代码是等价的：
> Here’s how it works: when you call a method with `object.something()`, Rust
> automatically adds in `&`, `&mut`, or `_`so`object` matches the signature of
> the method. In other words, the following are the same:
>
> <!-- CAN'T EXTRACT SEE BUG https://github.com/rust-lang/mdBook/issues/1127 -->
>
> ```rust
> # #[derive(Debug,Copy,Clone)]
> # struct Point {
> #     x: f64,
> #     y: f64,
> # }
> #
> # impl Point {
> #    fn distance(&self, other: &Point) -> f64 {
> #        let x_squared = f64::powi(other.x - self.x, 2);
> #        let y_squared = f64::powi(other.y - self.y, 2);
> #
> #        f64::sqrt(x_squared + y_squared)
> #    }
> # }
> # let p1 = Point { x: 0.0, y: 0.0 };
> # let p2 = Point { x: 5.0, y: 6.5 };
> p1.distance(&p2);
> (&p1).distance(&p2);
> ```
>
> 第一行看起来简洁的多。这种自动引用的行为之所以有效，是因为方法有一个明确的接收者———— self 的类型。在给出接收者和方法名的前提下，Rust 可以明确地计算出方法是仅仅读取（&self），做出修改（&mut self）或者是获取所有权（self）。事实上，Rust 对方法接收者的隐式借用让所有权在实践中更友好。
> The first one looks much cleaner. This automatic referencing behavior works
> because methods have a clear receiver—the type of `self`. Given the receiver
> and name of a method, Rust can figure out definitively whether the method is
> reading (`&self`), mutating (`&mut self`), or consuming (`self`). The fact
> that Rust makes borrowing implicit for method receivers is a big part of
> making ownership ergonomic in practice.

### Methods with More Parameters 带有更多参数的方法

让我们通过实现 Rectangle 结构体上的另一方法来练习使用方法。这回，我们让一个 Rectangle 的实例获取另一个 Rectangle 实例，如果 self （第一个 Rectangle）能完全包含第二个长方形则返回 true；否则返回 false。一旦我们定义了 can_hold 方法，就可以编写示例 5-14 中的代码。

Let’s practice using methods by implementing a second method on the `Rectangle`
struct. This time we want an instance of `Rectangle` to take another instance
of `Rectangle` and return `true` if the second `Rectangle` can fit completely
within `self` (the first `Rectangle`); otherwise, it should return `false`.
That is, once we’ve defined the `can_hold` method, we want to be able to write
the program shown in Listing 5-14.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };

    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

<span class="caption">
示例 5-14：使用还未实现的 can_hold 方法
Listing 5-14: Using the as-yet-unwritten `can_hold`
method</span>

同时我们希望看到如下输出，因为 rect2 的两个维度都小于 rect1，而 rect3 比 rect1 要宽：

The expected output would look like the following because both dimensions of
`rect2` are smaller than the dimensions of `rect1`, but `rect3` is wider than
`rect1`:

```text
Can rect1 hold rect2? true
Can rect1 hold rect3? false
```

因为我们想定义一个方法，所以它应该位于 impl Rectangle 块中。方法名是 can_hold，并且它会获取另一个 Rectangle 的不可变借用作为参数。通过观察调用方法的代码可以看出参数是什么类型的：rect1.can_hold(&rect2) 传入了 &rect2，它是一个 Rectangle 的实例 rect2 的不可变借用。这是可以理解的，因为我们只需要读取 rect2（而不是写入，这意味着我们需要一个不可变借用），而且希望 main 保持 rect2 的所有权，这样就可以在调用这个方法后继续使用它。can_hold 的返回值是一个布尔值，其实现会分别检查 self 的宽高是否都大于另一个 Rectangle。让我们在示例 5-13 的 impl 块中增加这个新的 can_hold 方法，如示例 5-15 所示：

We know we want to define a method, so it will be within the `impl Rectangle`
block. The method name will be `can_hold`, and it will take an immutable borrow
of another `Rectangle` as a parameter. We can tell what the type of the
parameter will be by looking at the code that calls the method:
`rect1.can_hold(&rect2)` passes in `&rect2`, which is an immutable borrow to
`rect2`, an instance of `Rectangle`. This makes sense because we only need to
read `rect2` (rather than write, which would mean we’d need a mutable borrow),
and we want `main` to retain ownership of `rect2` so we can use it again after
calling the `can_hold` method. The return value of `can_hold` will be a
Boolean, and the implementation will check whether the width and height of
`self` are greater than the width and height of the other `Rectangle`,
respectively. Let’s add the new `can_hold` method to the `impl` block from
Listing 5-13, shown in Listing 5-15.

<span class="filename">Filename: src/main.rs</span>

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

<span class="caption">
示例 5-15：在 Rectangle 上实现 can_hold 方法，它获取另一个 Rectangle 实例作为参数
Listing 5-15: Implementing the `can_hold` method on
`Rectangle` that takes another `Rectangle` instance as a parameter</span>

如果结合示例 5-14 的 main 函数来运行，就会看到期望的输出。在方法签名中，可以在 self 后增加多个参数，而且这些参数就像函数中的参数一样工作。

When we run this code with the `main` function in Listing 5-14, we’ll get our
desired output. Methods can take multiple parameters that we add to the
signature after the `self` parameter, and those parameters work just like
parameters in functions.

### Associated Functions 关联函数

所有在 impl 块中定义的函数被称为 关联函数（associated functions），因为它们与 impl 后面命名的类型相关。我们可以定义不以 self 为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例。我们已经使用了一个这样的函数：在 String 类型上定义的 String::from 函数。

All functions defined within an `impl` block are called _associated functions_
because they’re associated with the type named after the `impl`. We can define
associated functions that don’t have `self` as their first parameter (and thus
are not methods) because they don’t need an instance of the type to work with.
We’ve already used one function like this: the `String::from` function that’s
defined on the `String` type.

不是方法的关联函数经常被用作返回一个结构体新实例的构造函数。这些函数的名称通常为 new ，但 new 并不是一个关键字。例如我们可以提供一个叫做 square 关联函数，它接受一个维度参数并且同时作为宽和高，这样可以更轻松的创建一个正方形 Rectangle 而不必指定两次同样的值：

Associated functions that aren’t methods are often used for constructors that
will return a new instance of the struct. These are often called `new`, but
`new` isn’t a special name and isn’t built into the language. For example, we
could choose to provide an associated function named `square` that would have
one dimension parameter and use that as both width and height, thus making it
easier to create a square `Rectangle` rather than having to specify the same
value twice:

<span class="filename">Filename: src/main.rs</span>

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
```

关键字 Self 在函数的返回类型中代指在 impl 关键字后出现的类型，在这里是 Rectangle

The `Self` keywords in the return type and in the body of the function are
aliases for the type that appears after the `impl` keyword, which in this case
is `Rectangle`.

使用结构体名和 :: 语法来调用这个关联函数：比如 let sq = Rectangle::square(3);。这个函数位于结构体的命名空间中：:: 语法用于关联函数和模块创建的命名空间。第七章会讲到模块。

To call this associated function, we use the `::` syntax with the struct name;
`let sq = Rectangle::square(3);` is an example. This function is namespaced by
the struct: the `::` syntax is used for both associated functions and
namespaces created by modules. We’ll discuss modules in [Chapter
7][modules]<!-- ignore -->.

### Multiple `impl` Blocks 多个 impl 块

每个结构体都允许拥有多个 impl 块。例如，示例 5-16 中的代码等同于示例 5-15，但每个方法有其自己的 impl 块。

Each struct is allowed to have multiple `impl` blocks. For example, Listing
5-15 is equivalent to the code shown in Listing 5-16, which has each method in
its own `impl` block.

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

<span class="caption">
示例 5-16：使用多个 impl 块重写示例 5-15
Listing 5-16: Rewriting Listing 5-15 using multiple `impl`
blocks</span>

这里没有理由将这些方法分散在多个 impl 块中，不过这是有效的语法。第十章讨论泛型和 trait 时会看到实用的多 impl 块的用例。

There’s no reason to separate these methods into multiple `impl` blocks here,
but this is valid syntax. We’ll see a case in which multiple `impl` blocks are
useful in Chapter 10, where we discuss generic types and traits.

## Summary 总结

结构体让你可以创建出在你的领域中有意义的自定义类型。通过结构体，我们可以将相关联的数据片段联系起来并命名它们，这样可以使得代码更加清晰。在 impl 块中，你可以定义与你的类型相关联的函数，而方法是一种相关联的函数，让你指定结构体的实例所具有的行为。

Structs let you create custom types that are meaningful for your domain. By
using structs, you can keep associated pieces of data connected to each other
and name each piece to make your code clear. In `impl` blocks, you can define
functions that are associated with your type, and methods are a kind of
associated function that let you specify the behavior that instances of your
structs have.

但结构体并不是创建自定义类型的唯一方法：让我们转向 Rust 的枚举功能，为你的工具箱再添一个工具。

But structs aren’t the only way you can create custom types: let’s turn to
Rust’s enum feature to add another tool to your toolbox.

[enums]: ch06-00-enums.html
[trait-objects]: ch17-02-trait-objects.md
[public]: ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html#exposing-paths-with-the-pub-keyword
[modules]: ch07-02-defining-modules-to-control-scope-and-privacy.html
