## Variables and Mutability 变量与可变性

就如[“Storing Values with Variables”][storing-values-with-variables]部分所提及的，变量默认为不可变的。这就是 Rust 的很多推进之一，它是你编写代码时可以感受到 Rust 提供的安全性和并发性。然而，你还是可以让你的变量可变。现在让我们看看为什么 Rust 鼓励你使用不可变以及为什么你需要跳出来。

As mentioned in the [“Storing Values with Variables”][storing-values-with-variables]<!-- ignore --> section, by default,
variables are immutable. This is one of many nudges Rust gives you to write
your code in a way that takes advantage of the safety and easy concurrency that
Rust offers. However, you still have the option to make your variables mutable.
Let’s explore how and why Rust encourages you to favor immutability and why
sometimes you might want to opt out.

当一个变量不可变的时候，一个值绑定到一个名字上，你不可以改变那个值。举个例子，用`cargo new variables`在你的项目目录生成一个名叫 Variables 的新项目。

When a variable is immutable, once a value is bound to a name, you can’t change
that value. To illustrate this, generate a new project called _variables_ in
your _projects_ directory by using `cargo new variables`.

然后，在*variables*的目录，打开*src/main.rs*，用下面的代码覆盖里面的代码，但是还没有编译：

Then, in your new _variables_ directory, open _src/main.rs_ and replace its
code with the following code, which won’t compile just yet:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}
```

保存并执行`cargo run`。你会收到一个关于不可变性的错误提示，如下所示：

Save and run the program using `cargo run`. You should receive an error message
regarding an immutability error, as shown in this output:

```console
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: consider making this binding mutable: `mut x`
3 |     println!("The value of x is: {x}");
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables` due to previous error
```

这个例子展示了编译器如何帮助你发现项目里的错误。编译错误是令人沮丧的，但它只是提示你在项目中的代码并不是安全的；并不是说你不是好的开发人员！有经验的 Rustaceans 依然会收到编译错误。

This example shows how the compiler helps you find errors in your programs.
Compiler errors can be frustrating, but really they only mean your program
isn’t safely doing what you want it to do yet; they do _not_ mean that you’re
not a good programmer! Experienced Rustaceans still get compiler errors.

你会收到`` cannot assign twice to immutable variable `x` `` 错误信息，是因为你尝试将第二个值赋值给不可变的`x`变量。

You received the error message `` cannot assign twice to immutable variable `x` `` because you tried to assign a second value to the immutable `x` variable.

当我们尝试改变一个不可变的值时，这会导致异常，因此在编译阶段获取错误就很重要。如果你的一部分执行代码假定值不变，另一部分则要修改那个值，那第一部分代码可能就不会按预期的执行。事实上这种有缺陷很难被追踪，尤其是第二部分代码只是偶尔改变那个值。Rust 的编译器认为你标记那个值不变，那它就真的不便，所以你不用时刻追踪它。你的代码是有充分的理由通过编译的。

It’s important that we get compile-time errors when we attempt to change a
value that’s designated as immutable because this very situation can lead to
bugs. If one part of our code operates on the assumption that a value will
never change and another part of our code changes that value, it’s possible
that the first part of the code won’t do what it was designed to do. The cause
of this kind of bug can be difficult to track down after the fact, especially
when the second piece of code changes the value only _sometimes_. The Rust
compiler guarantees that when you state that a value won’t change, it really
won’t change, so you don’t have to keep track of it yourself. Your code is thus
easier to reason through.

但是可变的变量也很有用，使代码更容易编写。尽管变量默认不可变，但是在变量名前面增加`mut`可以让他们可变，参考[Chapter2][storing-values-with-variables]。增加 `mut`对阅读代码的人员意味着变量的值在其他代码部分会被改变。

But mutability can be very useful, and can make code more convenient to write.
Although variables are immutable by default, you can make them mutable by
adding `mut` in front of the variable name as you did in [Chapter
2][storing-values-with-variables]<!-- ignore -->. Adding `mut` also conveys
intent to future readers of the code by indicating that other parts of the code
will be changing this variable’s value.

举个例子，如下 _src/main.rs_ ：

For example, let’s change _src/main.rs_ to the following:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}
```

当我们运行时，结果如下：
When we run the program now, we get this:

```console
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.30s
     Running `target/debug/variables`
The value of x is: 5
The value of x is: 6
```

当使用了`mut`，我们可以将`x`的值从`5`变为`6`。最后，由你来决定是否使变量可变，同时也依赖于你清楚的知道在什么样的情况下使用。
We’re allowed to change the value bound to `x` from `5` to `6` when `mut` is
used. Ultimately, deciding whether to use mutability or not is up to you and
depends on what you think is clearest in that particular situation.

### Constants 常量

与不可变变量类似，常量也是不可以改变的，但是它们之间还有一些不同之处。
Like immutable variables, _constants_ are values that are bound to a name and
are not allowed to change, but there are a few differences between constants
and variables.

首先，常量不可以用`mut`。常量默认始终不可变。用`const`替代`let`定义常量，它的类型也必须声明。我们将在下一个部分讨论，[“Data Types”][data-types]，现在不必关心细节。你只需要知道必须声明类型就好。

First, you aren’t allowed to use `mut` with constants. Constants aren’t just
immutable by default—they’re always immutable. You declare constants using the
`const` keyword instead of the `let` keyword, and the type of the value _must_
be annotated. We’ll cover types and type annotations in the next section,
[“Data Types”][data-types]<!-- ignore -->, so don’t worry about the details
right now. Just know that you must always annotate the type.

常量可以在任何作用域里申明，包括全局作用域，许多部分的代码都可以调用。

Constants can be declared in any scope, including the global scope, which makes
them useful for values that many parts of code need to know about.

最后一个不同是，常量必须在常量表达式里设置，不可以在运行时作为计算结果。

The last difference is that constants may be set only to a constant expression,
not the result of a value that could only be computed at runtime.

下面是常量的声明例子：

Here’s an example of a constant declaration:

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

常量名`THREE_HOURS_IN_SECONDS`，它的值是 60*60*3.Rust 的常量名用大写配合下划线组成。编译器在编译时以有限的操作求值，也让我们以可理解和校验的方式定义这个值，这可比直接写 10800 好多了。在[Rust Reference’s section on constant evaluation][const-eval]有更多操作常量的信息。

The constant’s name is `THREE_HOURS_IN_SECONDS` and its value is set to the
result of multiplying 60 (the number of seconds in a minute) by 60 (the number
of minutes in an hour) by 3 (the number of hours we want to count in this
program). Rust’s naming convention for constants is to use all uppercase with
underscores between words. The compiler is able to evaluate a limited set of
operations at compile time, which lets us choose to write out this value in a
way that’s easier to understand and verify, rather than setting this constant
to the value 10,800. See the [Rust Reference’s section on constant
evaluation][const-eval] for more information on what operations can be used
when declaring constants.

常量在程序初始化时校验，它们被限制在作用域内。这个属性使常量在你的应用的范围内被多个地方调用，例如游戏中玩家的最大分数，或者光速。

Constants are valid for the entire time a program runs, within the scope in
which they were declared. This property makes constants useful for values in
your application domain that multiple parts of the program might need to know
about, such as the maximum number of points any player of a game is allowed to
earn, or the speed of light.

常量的硬编码对未来的代码管理者提供了有用的意义。在未来需要更新的时候，硬编码只需要在一个地方修改就好。

Naming hardcoded values used throughout your program as constants is useful in
conveying the meaning of that value to future maintainers of the code. It also
helps to have only one place in your code you would need to change if the
hardcoded value needed to be updated in the future.

### Shadowing 影子替身

就像你在[Chapter2][comparing-the-guess-to-the-secret-number]猜数字游戏里看到那样，你可以声明一个跟前文变量同名的变量。Rustaceans 称第一个变量被第二个变量遮蔽了，也就是说第二个变量才是你会用到的。事实上，也就是说第二个变量替代了第一个变量，所有调用都指向这个变量直到它自己被替代或者作用域结束。我们可以用同名替代变量：

As you saw in the guessing game tutorial in [Chapter
2][comparing-the-guess-to-the-secret-number]<!-- ignore -->, you can declare a
new variable with the same name as a previous variable. Rustaceans say that the
first variable is _shadowed_ by the second, which means that the second
variable is what the compiler will see when you use the name of the variable.
In effect, the second variable overshadows the first, taking any uses of the
variable name to itself until either it itself is shadowed or the scope ends.
We can shadow a variable by using the same variable’s name and repeating the
use of the `let` keyword as follows:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
```

程序第一次给`x`赋值`5`。然后新建一个变量`x`，将源数据加`1`赋值给它，也就是`6`。然后，花括号包裹的内部作用域，第三次声明`x`变量，前序数据乘 2 赋值给它，也就是`12`。当作用域结束，作用域替换结束，`x`的值变回`6`.以下是程序运行结果：

This program first binds `x` to a value of `5`. Then it creates a new variable
`x` by repeating `let x =`, taking the original value and adding `1` so the
value of `x` is then `6`. Then, within an inner scope created with the curly
brackets, the third `let` statement also shadows `x` and creates a new
variable, multiplying the previous value by `2` to give `x` a value of `12`.
When that scope is over, the inner shadowing ends and `x` returns to being `6`.
When we run this program, it will output the following:

```console
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.31s
     Running `target/debug/variables`
The value of x in the inner scope is: 12
The value of x is: 6
```

替换方法与定义可变变量不同，因为当我们没有使用`let`关键字却要改变变量时，编译阶段会报错。通过`let`，我们会得到一些值的转换，但是这些转换完成后变量就不可改变了。

Shadowing is different from marking a variable as `mut` because we’ll get a
compile-time error if we accidentally try to reassign to this variable without
using the `let` keyword. By using `let`, we can perform a few transformations
on a value but have the variable be immutable after those transformations have
been completed.

二者常见的不同是用`let`新建变量更有效，我们在重用名字的时候可以改变值的类型。例如，我们的程序要获取用户输入了多少空格，然后我们要把空格数存下来：

The other difference between `mut` and shadowing is that because we’re
effectively creating a new variable when we use the `let` keyword again, we can
change the type of the value but reuse the same name. For example, say our
program asks a user to show how many spaces they want between some text by
inputting space characters, and then we want to store that input as a number:

```rust
let spaces = "   ";
let spaces = spaces.len();
```

第一个 `spaces`变量是字符串类型，第二个变量是数字类型。替换可以帮我们在不同名字间节约空间，例如`spaces_str`和`spaces_num`；相反，我们可以重用`spaces`。因此，如果我们在这里用`mut`，那么我们将收到如下的编译错误：

The first `spaces` variable is a string type and the second `spaces` variable
is a number type. Shadowing thus spares us from having to come up with
different names, such as `spaces_str` and `spaces_num`; instead, we can reuse
the simpler `spaces` name. However, if we try to use `mut` for this, as shown
here, we’ll get a compile-time error:

```rust
let mut spaces = "   ";
spaces = spaces.len();
```

错误将指出我们不能改变变量的类型：

The error says we’re not allowed to mutate a variable’s type:

```console
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
error[E0308]: mismatched types
 --> src/main.rs:3:14
  |
2 |     let mut spaces = "   ";
  |                      ----- expected due to this value
3 |     spaces = spaces.len();
  |              ^^^^^^^^^^^^ expected `&str`, found `usize`
```

现在我们清楚了变量如何工作，下面我们来看看数据类型。

Now that we’ve explored how variables work, let’s look at more data types they
can have.

[comparing-the-guess-to-the-secret-number]: ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[data-types]: ch03-02-data-types.html#data-types
[storing-values-with-variables]: ch02-00-guessing-game-tutorial.html#storing-values-with-variables
[const-eval]: ../reference/const_eval.html
