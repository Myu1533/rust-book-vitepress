## Control Flow 控制流

根据条件是否为真来决定是否执行某些代码，以及根据条件是否为真来重复运行一段代码的能力是大部分编程语言的基本组成部分。Rust 代码中最常见的用来控制执行流的结构是 if 表达式和循环。

The ability to run some code depending on whether a condition is `true` and to
run some code repeatedly while a condition is `true` are basic building blocks
in most programming languages. The most common constructs that let you control
the flow of execution of Rust code are `if` expressions and loops.

### `if` Expressions `if` 表达式

if 表达式允许根据条件执行不同的代码分支。你提供一个条件并表示 “如果条件满足，运行这段代码；如果条件不满足，不运行这段代码。

An `if` expression allows you to branch your code depending on conditions. You
provide a condition and then state, “If this condition is met, run this block
of code. If the condition is not met, do not run this block of code.”

在项目目录新建一个叫做 branches 的项目，来学习 `if` 表达式。在 src/main.rs 文件中，输入如下内容：

Create a new project called _branches_ in your _projects_ directory to explore
the `if` expression. In the _src/main.rs_ file, input the following:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
}
```

所有的 if 表达式都以 if 关键字开头，其后跟一个条件。在这个例子中，条件检查变量 number 的值是否小于 5。在条件为 true 时希望执行的代码块位于紧跟条件之后的大括号中。if 表达式中与条件关联的代码块有时被叫做 arms，就像第二章 “比较猜测的数字和秘密数字” 部分中讨论到的 match 表达式中的分支一样。

All `if` expressions start with the keyword `if`, followed by a condition. In
this case, the condition checks whether or not the variable `number` has a
value less than 5. We place the block of code to execute if the condition is
`true` immediately after the condition inside curly brackets. Blocks of code
associated with the conditions in `if` expressions are sometimes called _arms_,
just like the arms in `match` expressions that we discussed in the [“Comparing
the Guess to the Secret Number”][comparing-the-guess-to-the-secret-number]<!--
ignore --> section of Chapter 2.

也可以包含一个可选的 else 表达式来提供一个在条件为 false 时应当执行的代码块，这里我们就这么做了。如果不提供 else 表达式并且条件为 false 时，程序会直接忽略 if 代码块并继续执行下面的代码

Optionally, we can also include an `else` expression, which we chose to do
here, to give the program an alternative block of code to execute should the
condition evaluate to `false`. If you don’t provide an `else` expression and
the condition is `false`, the program will just skip the `if` block and move on
to the next bit of code.

尝试运行代码，应该能看到如下输出：

Try running this code; you should see the following output:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.31s
     Running `target/debug/branches`
condition was true
```

尝试改变 number 的值使条件为 false 时看看会发生什么：

Let’s try changing the value of `number` to a value that makes the condition
`false` to see what happens:

```rust
let number = 7;
```

再次运行程序并查看输出：

Run the program again, and look at the output:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.31s
     Running `target/debug/branches`
condition was false
```

另外值得注意的是代码中的条件 必须 是 bool 值。如果条件不是 bool 值，我们将得到一个错误。例如，尝试运行以下代码：

It’s also worth noting that the condition in this code _must_ be a `bool`. If
the condition isn’t a `bool`, we’ll get an error. For example, try running the
following code:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let number = 3;

    if number {
        println!("number was three");
    }
}
```

这里 if 条件的值是 3，Rust 抛出了一个错误：

The `if` condition evaluates to a value of `3` this time, and Rust throws an
error:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
error[E0308]: mismatched types
 --> src/main.rs:4:8
  |
4 |     if number {
  |        ^^^^^^ expected `bool`, found integer

For more information about this error, try `rustc --explain E0308`.
error: could not compile `branches` (bin "branches") due to 1 previous error
```

这个错误表明 Rust 期望一个 bool 却得到了一个整数。不像 Ruby 或 JavaScript 这样的语言，Rust 并不会尝试自动地将非布尔值转换为布尔值。必须总是显式地使用布尔值作为 if 的条件。例如，如果想要 if 代码块只在一个数字不等于 0 时执行，可以把 if 表达式修改成下面这样：

The error indicates that Rust expected a `bool` but got an integer. Unlike
languages such as Ruby and JavaScript, Rust will not automatically try to
convert non-Boolean types to a Boolean. You must be explicit and always provide
`if` with a Boolean as its condition. If we want the `if` code block to run
only when a number is not equal to `0`, for example, we can change the `if`
expression to the following:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let number = 3;

    if number != 0 {
        println!("number was something other than zero");
    }
}
```

运行代码会打印出 number was something other than zero。

Running this code will print `number was something other than zero`.

#### Handling Multiple Conditions with `else if` 使用 else if 处理多重条件

可以将 else if 表达式与 if 和 else 组合来实现多重条件。例如：

You can use multiple conditions by combining `if` and `else` in an `else if`
expression. For example:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
}
```

这个程序有四个可能的执行路径。运行后应该能看到如下输出：

This program has four possible paths it can take. After running it, you should
see the following output:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.31s
     Running `target/debug/branches`
number is divisible by 3
```

当执行这个程序时，它按顺序检查每个 if 表达式并执行第一个条件为 true 的代码块。注意即使 6 可以被 2 整除，也不会输出 number is divisible by 2，更不会输出 else 块中的 number is not divisible by 4, 3, or 2。原因是 Rust 只会执行第一个条件为 true 的代码块，并且一旦它找到一个以后，甚至都不会检查剩下的条件了。

When this program executes, it checks each `if` expression in turn and executes
the first body for which the condition evaluates to `true`. Note that even
though 6 is divisible by 2, we don’t see the output `number is divisible by 2`,
nor do we see the `number is not divisible by 4, 3, or 2` text from the `else`
block. That’s because Rust only executes the block for the first `true`
condition, and once it finds one, it doesn’t even check the rest.

使用过多的 else if 表达式会使代码显得杂乱无章，所以如果有多于一个 else if 表达式，最好重构代码。为此，第六章会介绍一个强大的 Rust 分支结构（branching construct），叫做 match。

Using too many `else if` expressions can clutter your code, so if you have more
than one, you might want to refactor your code. Chapter 6 describes a powerful
Rust branching construct called `match` for these cases.

#### Using `if` in a `let` Statement 在 let 语句中使用 if

因为 if 是一个表达式，我们可以在 let 语句的右侧使用它，例如在示例 3-2 中：

Because `if` is an expression, we can use it on the right side of a `let`
statement to assign the outcome to a variable, as in Listing 3-2.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}");
}
```

<span class="caption">
示例 3-2：将 if 表达式的返回值赋给一个变量
Listing 3-2: Assigning the result of an `if` expression
to a variable</span>

number 变量将会绑定到表示 if 表达式结果的值上。运行这段代码看看会出现什么：

The `number` variable will be bound to a value based on the outcome of the `if`
expression. Run this code to see what happens:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.30s
     Running `target/debug/branches`
The value of number is: 5
```

记住，代码块的值是其最后一个表达式的值，而数字本身就是一个表达式。在这个例子中，整个 if 表达式的值取决于哪个代码块被执行。这意味着 if 的每个分支的可能的返回值都必须是相同类型；在示例 3-2 中，if 分支和 else 分支的结果都是 i32 整型。如果它们的类型不匹配，如下面这个例子，则会出现一个错误：

Remember that blocks of code evaluate to the last expression in them, and
numbers by themselves are also expressions. In this case, the value of the
whole `if` expression depends on which block of code executes. This means the
values that have the potential to be results from each arm of the `if` must be
the same type; in Listing 3-2, the results of both the `if` arm and the `else`
arm were `i32` integers. If the types are mismatched, as in the following
example, we’ll get an error:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let condition = true;

    let number = if condition { 5 } else { "six" };

    println!("The value of number is: {number}");
}
```

当编译这段代码时，会得到一个错误。if 和 else 分支的值类型是不相容的，同时 Rust 也准确地指出在程序中的何处发现的这个问题：

When we try to compile this code, we’ll get an error. The `if` and `else` arms
have value types that are incompatible, and Rust indicates exactly where to
find the problem in the program:

```console
$ cargo run
   Compiling branches v0.1.0 (file:///projects/branches)
error[E0308]: `if` and `else` have incompatible types
 --> src/main.rs:4:44
  |
4 |     let number = if condition { 5 } else { "six" };
  |                                 -          ^^^^^ expected integer, found `&str`
  |                                 |
  |                                 expected because of this

For more information about this error, try `rustc --explain E0308`.
error: could not compile `branches` (bin "branches") due to 1 previous error
```

if 代码块中的表达式返回一个整数，而 else 代码块中的表达式返回一个字符串。这不可行，因为变量必须只有一个类型。Rust 需要在编译时就确切的知道 number 变量的类型，这样它就可以在编译时验证在每处使用的 number 变量的类型是有效的。如果 number 的类型仅在运行时确定，则 Rust 无法做到这一点；且编译器必须跟踪每一个变量的多种假设类型，那么它就会变得更加复杂，对代码的保证也会减少。

The expression in the `if` block evaluates to an integer, and the expression in
the `else` block evaluates to a string. This won’t work because variables must
have a single type, and Rust needs to know at compile time what type the
`number` variable is, definitively. Knowing the type of `number` lets the
compiler verify the type is valid everywhere we use `number`. Rust wouldn’t be
able to do that if the type of `number` was only determined at runtime; the
compiler would be more complex and would make fewer guarantees about the code
if it had to keep track of multiple hypothetical types for any variable.

### Repetition with Loops 使用循环重复执行

多次执行同一段代码是很常用的，Rust 为此提供了多种 循环（loops）。一个循环执行循环体中的代码直到结尾并紧接着回到开头继续执行。为了实验一下循环，让我们新建一个叫做 loops 的项目。

It’s often useful to execute a block of code more than once. For this task,
Rust provides several _loops_, which will run through the code inside the loop
body to the end and then start immediately back at the beginning. To experiment
with loops, let’s make a new project called _loops_.

Rust 有三种循环：loop、while 和 for。我们每一个都试试。

Rust has three kinds of loops: `loop`, `while`, and `for`. Let’s try each one.

#### Repeating Code with `loop` 使用 loop 重复执行代码

loop 关键字告诉 Rust 一遍又一遍地执行一段代码直到你明确要求停止。

The `loop` keyword tells Rust to execute a block of code over and over again
forever or until you explicitly tell it to stop.

作为一个例子，将 loops 目录中的 src/main.rs 文件修改为如下：

As an example, change the _src/main.rs_ file in your _loops_ directory to look
like this:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    loop {
        println!("again!");
    }
}
```

当运行这个程序时，我们会看到连续的反复打印 again!，直到我们手动停止程序。大部分终端都支持一个快捷键，ctrl-c，来终止一个陷入无限循环的程序。尝试一下：

When we run this program, we’ll see `again!` printed over and over continuously
until we stop the program manually. Most terminals support the keyboard
shortcut <span class="keystroke">ctrl-c</span> to interrupt a program that is
stuck in a continual loop. Give it a try:

<!-- manual-regeneration
cd listings/ch03-common-programming-concepts/no-listing-32-loop
cargo run
CTRL-C
-->

```console
$ cargo run
   Compiling loops v0.1.0 (file:///projects/loops)
    Finished dev [unoptimized + debuginfo] target(s) in 0.29s
     Running `target/debug/loops`
again!
again!
again!
again!
^Cagain!
```

符号 ^C 代表你在这按下了 ctrl-c。在 ^C 之后你可能看到也可能看不到 again! ，这取决于在接收到终止信号时代码执行到了循环的何处。

The symbol `^C` represents where you pressed <span
class="keystroke">ctrl-c</span>. You may or may not see the word `again!`
printed after the `^C`, depending on where the code was in the loop when it
received the interrupt signal.

幸运的是，Rust 提供了一种从代码中跳出循环的方法。可以使用 break 关键字来告诉程序何时停止循环。回忆一下在第二章猜猜看游戏的 [“Quitting After a Correct Guess”][quitting-after-a-correct-guess] 部分使用过它来在用户猜对数字赢得游戏后退出程序。

Fortunately, Rust also provides a way to break out of a loop using code. You
can place the `break` keyword within the loop to tell the program when to stop
executing the loop. Recall that we did this in the guessing game in the
[“Quitting After a Correct Guess”][quitting-after-a-correct-guess]<!-- ignore
--> section of Chapter 2 to exit the program when the user won the game by
guessing the correct number.

我们在猜谜游戏中也使用了 continue。循环中的 continue 关键字告诉程序跳过这个循环迭代中的任何剩余代码，并转到下一个迭代。

We also used `continue` in the guessing game, which in a loop tells the program
to skip over any remaining code in this iteration of the loop and go to the
next iteration.

#### Returning Values from Loops 从循环返回值

loop 的一个用例是重试可能会失败的操作，比如检查线程是否完成了任务。然而你可能会需要将操作的结果传递给其它的代码。如果将返回值加入你用来停止循环的 break 表达式，它会被停止的循环返回：

One of the uses of a `loop` is to retry an operation you know might fail, such
as checking whether a thread has completed its job. You might also need to pass
the result of that operation out of the loop to the rest of your code. To do
this, you can add the value you want returned after the `break` expression you
use to stop the loop; that value will be returned out of the loop so you can
use it, as shown here:

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");
}
```

在循环之前，我们声明了一个名为 counter 的变量并初始化为 0。接着声明了一个名为 result 来存放循环的返回值。在循环的每一次迭代中，我们将 counter 变量加 1，接着检查计数是否等于 10。当相等时，使用 break 关键字返回值 counter \* 2。循环之后，我们通过分号结束赋值给 result 的语句。最后打印出 result 的值，也就是 20。

Before the loop, we declare a variable named `counter` and initialize it to
`0`. Then we declare a variable named `result` to hold the value returned from
the loop. On every iteration of the loop, we add `1` to the `counter` variable,
and then check whether the `counter` is equal to `10`. When it is, we use the
`break` keyword with the value `counter * 2`. After the loop, we use a
semicolon to end the statement that assigns the value to `result`. Finally, we
print the value in `result`, which in this case is `20`.

#### Loop Labels to Disambiguate Between Multiple Loops 循环标签：在多个循环之间消除歧义

如果存在嵌套循环，break 和 continue 应用于此时最内层的循环。你可以选择在一个循环上指定一个 循环标签（loop label），然后将标签与 break 或 continue 一起使用，使这些关键字应用于已标记的循环而不是最内层的循环。下面是一个包含两个嵌套循环的示例。

If you have loops within loops, `break` and `continue` apply to the innermost
loop at that point. You can optionally specify a _loop label_ on a loop that
you can then use with `break` or `continue` to specify that those keywords
apply to the labeled loop instead of the innermost loop. Loop labels must begin
with a single quote. Here’s an example with two nested loops:

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

外层循环有一个标签 counting_up，它将从 0 数到 2。没有标签的内部循环从 10 向下数到 9。第一个没有指定标签的 break 将只退出内层循环。break 'counting_up; 语句将退出外层循环。这个代码打印：

The outer loop has the label `'counting_up`, and it will count up from 0 to 2.
The inner loop without a label counts down from 10 to 9. The first `break` that
doesn’t specify a label will exit the inner loop only. The `break
'counting_up;` statement will exit the outer loop. This code prints:

```console
$ cargo run
   Compiling loops v0.1.0 (file:///projects/loops)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.58s
     Running `target/debug/loops`
count = 0
remaining = 10
remaining = 9
count = 1
remaining = 10
remaining = 9
count = 2
remaining = 10
End count = 2
```

#### Conditional Loops with `while` while 条件循环

在程序中计算循环的条件也很常见。当条件为 true，执行循环。当条件不再为 true，调用 break 停止循环。这个循环类型可以通过组合 loop、if、else 和 break 来实现；如果你喜欢的话，现在就可以在程序中试试。

然而，这个模式太常用了，Rust 为此内置了一个语言结构，它被称为 while 循环。示例 3-3 使用了 while：程序循环三次，每次数字都减一。接着，在循环结束后，打印出另一个信息并退出。

A program will often need to evaluate a condition within a loop. While the
condition is `true`, the loop runs. When the condition ceases to be `true`, the
program calls `break`, stopping the loop. It’s possible to implement behavior
like this using a combination of `loop`, `if`, `else`, and `break`; you could
try that now in a program, if you’d like. However, this pattern is so common
that Rust has a built-in language construct for it, called a `while` loop. In
Listing 3-3, we use `while` to loop the program three times, counting down each
time, and then, after the loop, print a message and exit.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

<span class="caption">
示例 3-3: 当条件为真时，使用 while 循环运行代码
Listing 3-3: Using a `while` loop to run code while a
condition holds true</span>

这种结构消除了很多使用 loop、if、else 和 break 时所必须的嵌套，这样更加清晰。当条件为 true 就执行，否则退出循环。

This construct eliminates a lot of nesting that would be necessary if you used
`loop`, `if`, `else`, and `break`, and it’s clearer. While a condition
evaluates to `true`, the code runs; otherwise, it exits the loop.

#### Looping Through a Collection with `for` 使用 for 遍历集合

可以使用 while 结构来遍历集合中的元素，比如数组。例如，看看示例 3-4。

You can choose to use the `while` construct to loop over the elements of a
collection, such as an array. For example, the loop in Listing 3-4 prints each
element in the array `a`.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;

    while index < 5 {
        println!("the value is: {}", a[index]);

        index += 1;
    }
}
```

<span class="caption">
示例 3-4：使用 while 循环遍历集合中的元素
Listing 3-4: Looping through each element of a collection
using a `while` loop</span>

这里，代码对数组中的元素进行计数。它从索引 0 开始，并接着循环直到遇到数组的最后一个索引（这时，index < 5 不再为真）。运行这段代码会打印出数组中的每一个元素：

Here, the code counts up through the elements in the array. It starts at index
`0`, and then loops until it reaches the final index in the array (that is,
when `index < 5` is no longer `true`). Running this code will print every
element in the array:

```console
$ cargo run
   Compiling loops v0.1.0 (file:///projects/loops)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.32s
     Running `target/debug/loops`
the value is: 10
the value is: 20
the value is: 30
the value is: 40
the value is: 50
```

数组中的所有五个元素都如期被打印出来。尽管 index 在某一时刻会到达值 5，不过循环在其尝试从数组获取第六个值（会越界）之前就停止了。

All five array values appear in the terminal, as expected. Even though `index`
will reach a value of `5` at some point, the loop stops executing before trying
to fetch a sixth value from the array.

但这个过程很容易出错；如果索引长度或测试条件不正确会导致程序 panic。例如，如果将 a 数组的定义改为包含 4 个元素而忘记了更新条件 while index < 4，则代码会 panic。这也使程序更慢，因为编译器增加了运行时代码来对每次循环进行条件检查，以确定在循环的每次迭代中索引是否在数组的边界内。

However, this approach is error prone; we could cause the program to panic if
the index value or test condition is incorrect. For example, if you changed the
definition of the `a` array to have four elements but forgot to update the
condition to `while index < 4`, the code would panic. It’s also slow, because
the compiler adds runtime code to perform the conditional check of whether the
index is within the bounds of the array on every iteration through the loop.

作为更简洁的替代方案，可以使用 for 循环来对一个集合的每个元素执行一些代码。for 循环看起来如示例 3-5 所示：

As a more concise alternative, you can use a `for` loop and execute some code
for each item in a collection. A `for` loop looks like the code in Listing 3-5.

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

<span class="caption">
示例 3-5：使用 for 循环遍历集合中的元素
Listing 3-5: Looping through each element of a collection
using a `for` loop</span>

当运行这段代码时，将看到与示例 3-4 一样的输出。更为重要的是，我们增强了代码安全性，并消除了可能由于超出数组的结尾或遍历长度不够而缺少一些元素而导致的 bug。

When we run this code, we’ll see the same output as in Listing 3-4. More
importantly, we’ve now increased the safety of the code and eliminated the
chance of bugs that might result from going beyond the end of the array or not
going far enough and missing some items.

例如，在示例 3-4 的代码中，如果你将 a 数组的定义改为有四个元素，但忘记将条件更新为 while index < 4，代码将会 panic。使用 for 循环的话，就不需要惦记着在改变数组元素个数时修改其他的代码了。

Using the `for` loop, you wouldn’t need to remember to change any other code if
you changed the number of values in the array, as you would with the method
used in Listing 3-4.

for 循环的安全性和简洁性使得它成为 Rust 中使用最多的循环结构。即使是在想要循环执行代码特定次数时，例如示例 3-3 中使用 while 循环的倒计时例子，大部分 Rustacean 也会使用 for 循环。这么做的方式是使用 Range，它是标准库提供的类型，用来生成从一个数字开始到另一个数字之前结束的所有数字的序列。

The safety and conciseness of `for` loops make them the most commonly used loop
construct in Rust. Even in situations in which you want to run some code a
certain number of times, as in the countdown example that used a `while` loop
in Listing 3-3, most Rustaceans would use a `for` loop. The way to do that
would be to use a `Range`, provided by the standard library, which generates
all numbers in sequence starting from one number and ending before another
number.

下面是一个使用 for 循环来倒计时的例子，它还使用了一个我们还未讲到的方法，rev，用来反转 range。

Here’s what the countdown would look like using a `for` loop and another method
we’ve not yet talked about, `rev`, to reverse the range:

<span class="filename">Filename: src/main.rs</span>

```rust
fn main() {
    for number in (1..4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
}
```

这段代码看起来更帅气不是吗？

This code is a bit nicer, isn’t it?

## Summary 总结

你做到了！这是一个大章节：你学习了变量、标量和复合数据类型、函数、注释、 if 表达式和循环！如果你想要实践本章讨论的概念，尝试构建如下程序：

You made it! This was a sizable chapter: you learned about variables, scalar
and compound data types, functions, comments, `if` expressions, and loops! To
practice with the concepts discussed in this chapter, try building programs to
do the following:

- 相互转换摄氏与华氏温度。
- 生成第 n 个斐波那契数。
- 打印圣诞颂歌 “The Twelve Days of Christmas” 的歌词，并利用歌曲中的重复部分（编写循环）。

- Convert temperatures between Fahrenheit and Celsius.
- Generate the *n*th Fibonacci number.
- Print the lyrics to the Christmas carol “The Twelve Days of Christmas,”
  taking advantage of the repetition in the song.

当你准备好继续的时候，让我们讨论一个其他语言中 并不 常见的概念：所有权（ownership）。

When you’re ready to move on, we’ll talk about a concept in Rust that _doesn’t_
commonly exist in other programming languages: ownership.

[comparing-the-guess-to-the-secret-number]: ch02-00-guessing-game-tutorial.html#comparing-the-guess-to-the-secret-number
[quitting-after-a-correct-guess]: ch02-00-guessing-game-tutorial.html#quitting-after-a-correct-guess
