## To `panic!` or Not to `panic!` 要不要 panic!

那么，该如何决定何时应该 panic! 以及何时应该返回 Result 呢？如果代码 panic，就没有恢复的可能。你可以选择对任何错误场景都调用 panic!，不管是否有可能恢复，不过这样就是你代替调用者决定了这是不可恢复的。选择返回 Result 值的话，就将选择权交给了调用者，而不是代替他们做出决定。调用者可能会选择以符合他们场景的方式尝试恢复，或者也可能干脆就认为 Err 是不可恢复的，所以他们也可能会调用 panic! 并将可恢复的错误变成了不可恢复的错误。因此返回 Result 是定义可能会失败的函数的一个好的默认选择。

So how do you decide when you should call `panic!` and when you should return
`Result`? When code panics, there’s no way to recover. You could call `panic!`
for any error situation, whether there’s a possible way to recover or not, but
then you’re making the decision that a situation is unrecoverable on behalf of
the calling code. When you choose to return a `Result` value, you give the
calling code options. The calling code could choose to attempt to recover in a
way that’s appropriate for its situation, or it could decide that an `Err`
value in this case is unrecoverable, so it can call `panic!` and turn your
recoverable error into an unrecoverable one. Therefore, returning `Result` is a
good default choice when you’re defining a function that might fail.

在一些类似示例、原型代码（prototype code）和测试中，panic 比返回 Result 更为合适，下文中会讨论合适的原因，紧接着讨论另外一种特殊情况，即有些场景编译器无法认识这个分支代码是不可能走到的，但是程序员可以判断出来的，这种场景也可以用 panic!。另外章节最后会总结一些在库代码中如何决定是否要 panic 的通用指导原则。

In situations such as examples, prototype code, and tests, it’s more
appropriate to write code that panics instead of returning a `Result`. Let’s
explore why, then discuss situations in which the compiler can’t tell that
failure is impossible, but you as a human can. The chapter will conclude with
some general guidelines on how to decide whether to panic in library code.

### Examples, Prototype Code and Tests 示例、代码原型和测试都非常适合 panic

当你编写一个示例来展示一些概念时，在拥有健壮的错误处理代码的同时也会使得例子不那么明确。例如，调用一个类似 unwrap 这样可能 panic! 的方法可以被理解为一个你实际希望程序处理错误方式的占位符，它根据其余代码运行方式可能会各不相同。

When you’re writing an example to illustrate some concept, also including robust
error-handling code can make the example less clear. In
examples, it’s understood that a call to a method like `unwrap` that could
panic is meant as a placeholder for the way you’d want your application to
handle errors, which can differ based on what the rest of your code is doing.

类似地，在我们准备好决定如何处理错误之前，unwrap 和 expect 方法在原型设计时非常方便。当我们准备好让程序更加健壮时，它们会在代码中留下清晰的标记。

Similarly, the `unwrap` and `expect` methods are very handy when prototyping,
before you’re ready to decide how to handle errors. They leave clear markers in
your code for when you’re ready to make your program more robust.

如果方法调用在测试中失败了，我们希望这个测试都失败，即便这个方法并不是需要测试的功能。因为 panic! 会将测试标记为失败，此时调用 unwrap 或 expect 是恰当的。

If a method call fails in a test, you’d want the whole test to fail, even if
that method isn’t the functionality under test. Because `panic!` is how a test
is marked as a failure, calling `unwrap` or `expect` is exactly what should
happen.

### Cases in Which You Have More Information Than the Compiler 当我们比编译器知道更多的情况

当你有一些其他的逻辑来确保 Result 会是 Ok 值时，调用 unwrap 或者 expect 也是合适的，虽然编译器无法理解这种逻辑。你仍然需要处理一个 Result 值：即使在你的特定情况下逻辑上是不可能的，你所调用的任何操作仍然有可能失败。如果通过人工检查代码来确保永远也不会出现 Err 值，那么调用 unwrap 也是完全可以接受的，这里是一个例子：

It would also be appropriate to call `unwrap` or `expect` when you have some
other logic that ensures the `Result` will have an `Ok` value, but the logic
isn’t something the compiler understands. You’ll still have a `Result` value
that you need to handle: whatever operation you’re calling still has the
possibility of failing in general, even though it’s logically impossible in
your particular situation. If you can ensure by manually inspecting the code
that you’ll never have an `Err` variant, it’s perfectly acceptable to call
`unwrap`, and even better to document the reason you think you’ll never have an
`Err` variant in the `expect` text. Here’s an example:

```rust
    use std::net::IpAddr;

    let home: IpAddr = "127.0.0.1"
        .parse()
        .expect("Hardcoded IP address should be valid");
```

我们通过解析一个硬编码的字符来创建一个 IpAddr 实例。可以看出 127.0.0.1 是一个有效的 IP 地址，所以这里使用 expect 是可以接受的。然而，拥有一个硬编码的有效的字符串也不能改变 parse 方法的返回值类型：它仍然是一个 Result 值，而编译器仍然会要求我们处理这个 Result，好像还是有可能出现 Err 成员那样。这是因为编译器还没有智能到可以识别出这个字符串总是一个有效的 IP 地址。如果 IP 地址字符串来源于用户而不是硬编码进程序中的话，那么就 确实 有失败的可能性，这时就绝对需要我们以一种更健壮的方式处理 Result 了。提及这个 IP 地址是硬编码的假设会促使我们将来把 expect 替换为更好的错误处理，我们应该从其它代码获取 IP 地址。

We’re creating an `IpAddr` instance by parsing a hardcoded string. We can see
that `127.0.0.1` is a valid IP address, so it’s acceptable to use `expect`
here. However, having a hardcoded, valid string doesn’t change the return type
of the `parse` method: we still get a `Result` value, and the compiler will
still make us handle the `Result` as if the `Err` variant is a possibility
because the compiler isn’t smart enough to see that this string is always a
valid IP address. If the IP address string came from a user rather than being
hardcoded into the program and therefore _did_ have a possibility of failure,
we’d definitely want to handle the `Result` in a more robust way instead.
Mentioning the assumption that this IP address is hardcoded will prompt us to
change `expect` to better error handling code if in the future, we need to get
the IP address from some other source instead.

### Guidelines for Error Handling 错误处理指导原则

在当有可能会导致有害状态的情况下建议使用 panic! —— 在这里，有害状态是指当一些假设、保证、协议或不可变性被打破的状态，例如无效的值、自相矛盾的值或者被传递了不存在的值 —— 外加如下几种情况：

It’s advisable to have your code panic when it’s possible that your code
could end up in a bad state. In this context, a _bad state_ is when some
assumption, guarantee, contract, or invariant has been broken, such as when
invalid values, contradictory values, or missing values are passed to your
code—plus one or more of the following:

- The bad state is something that is unexpected, as opposed to something that
  will likely happen occasionally, like a user entering data in the wrong
  format. 有害状态是非预期的行为，与偶尔会发生的行为相对，比如用户输入了错误格式的数据。
- Your code after this point needs to rely on not being in this bad state,
  rather than checking for the problem at every step. 在此之后代码的运行依赖于不处于这种有害状态，而不是在每一步都检查是否有问题。
- There’s not a good way to encode this information in the types you use. We’ll
  work through an example of what we mean in the [“Encoding States and Behavior
  as Types”][encoding]<!-- ignore --> section of Chapter 17. 没有可行的手段来将有害状态信息编码进所使用的类型中的情况。我们会在第十七章 “将状态和行为编码为类型” 部分通过一个例子来说明我们的意思。

如果别人调用你的代码并传递了一个没有意义的值，尽最大可能返回一个错误，如此库的用户就可以决定在这种情况下该如何处理。然而在继续执行代码是不安全或有害的情况下，最好的选择可能是调用 panic! 并警告库的用户他们的代码中有 bug，这样他们就会在开发时进行修复。类似的，如果你正在调用不受你控制的外部代码，并且它返回了一个你无法修复的无效状态，那么 panic! 往往是合适的。

If someone calls your code and passes in values that don’t make sense, it’s
best to return an error if you can so the user of the library can decide what
they want to do in that case. However, in cases where continuing could be
insecure or harmful, the best choice might be to call `panic!` and alert the
person using your library to the bug in their code so they can fix it during
development. Similarly, `panic!` is often appropriate if you’re calling
external code that is out of your control and it returns an invalid state that
you have no way of fixing.

然而当错误预期会出现时，返回 Result 仍要比调用 panic! 更为合适。这样的例子包括解析器接收到格式错误的数据，或者 HTTP 请求返回了一个表明触发了限流的状态。在这些例子中，应该通过返回 Result 来表明失败预期是可能的，这样将有害状态向上传播，调用者就可以决定该如何处理这个问题。使用 panic! 来处理这些情况就不是最好的选择。

However, when failure is expected, it’s more appropriate to return a `Result`
than to make a `panic!` call. Examples include a parser being given malformed
data or an HTTP request returning a status that indicates you have hit a rate
limit. In these cases, returning a `Result` indicates that failure is an
expected possibility that the calling code must decide how to handle.

当你的代码在进行一个使用无效值进行调用时可能将用户置于风险中的操作时，代码应该首先验证值是有效的，并在其无效时 panic!。这主要是出于安全的原因：尝试操作无效数据会暴露代码漏洞，这就是标准库在尝试越界访问数组时会 panic! 的主要原因：尝试访问不属于当前数据结构的内存是一个常见的安全隐患。函数通常都遵循 契约（contracts）：它们的行为只有在输入满足特定条件时才能得到保证。当违反契约时 panic 是有道理的，因为这通常代表调用方的 bug，而且这也不是那种你希望所调用的代码必须处理的错误。事实上所调用的代码也没有合理的方式来恢复，而是需要调用方的 程序员 修复其代码。函数的契约，尤其是当违反它会造成 panic 的契约，应该在函数的 API 文档中得到解释。

When your code performs an operation that could put a user at risk if it’s
called using invalid values, your code should verify the values are valid first
and panic if the values aren’t valid. This is mostly for safety reasons:
attempting to operate on invalid data can expose your code to vulnerabilities.
This is the main reason the standard library will call `panic!` if you attempt
an out-of-bounds memory access: trying to access memory that doesn’t belong to
the current data structure is a common security problem. Functions often have
_contracts_: their behavior is only guaranteed if the inputs meet particular
requirements. Panicking when the contract is violated makes sense because a
contract violation always indicates a caller-side bug and it’s not a kind of
error you want the calling code to have to explicitly handle. In fact, there’s
no reasonable way for calling code to recover; the calling _programmers_ need
to fix the code. Contracts for a function, especially when a violation will
cause a panic, should be explained in the API documentation for the function.

虽然在所有函数中都拥有许多错误检查是冗长而烦人的。幸运的是，可以利用 Rust 的类型系统（以及编译器的类型检查）为你进行很多检查。如果函数有一个特定类型的参数，可以在知晓编译器已经确保其拥有一个有效值的前提下进行你的代码逻辑。例如，如果你使用了一个并不是 Option 的类型，则程序期望它是 有值 的并且不是 空值。你的代码无需处理 Some 和 None 这两种情况，它只会有一种情况就是绝对会有一个值。尝试向函数传递空值的代码甚至根本不能编译，所以你的函数在运行时没有必要判空。另外一个例子是使用像 u32 这样的无符号整型，也会确保它永远不为负。

However, having lots of error checks in all of your functions would be verbose
and annoying. Fortunately, you can use Rust’s type system (and thus the type
checking done by the compiler) to do many of the checks for you. If your
function has a particular type as a parameter, you can proceed with your code’s
logic knowing that the compiler has already ensured you have a valid value. For
example, if you have a type rather than an `Option`, your program expects to
have _something_ rather than _nothing_. Your code then doesn’t have to handle
two cases for the `Some` and `None` variants: it will only have one case for
definitely having a value. Code trying to pass nothing to your function won’t
even compile, so your function doesn’t have to check for that case at runtime.
Another example is using an unsigned integer type such as `u32`, which ensures
the parameter is never negative.

### Creating Custom Types for Validation 创建自定义类型进行有效性验证

让我们使用 Rust 类型系统的思想来进一步确保值的有效性，并尝试创建一个自定义类型以进行验证。回忆一下第二章的猜猜看游戏，我们的代码要求用户猜测一个 1 到 100 之间的数字，在将其与秘密数字做比较之前我们从未验证用户的猜测是位于这两个数字之间的，我们只验证它是否为正。在这种情况下，其影响并不是很严重：“Too high” 或 “Too low” 的输出仍然是正确的。但是这是一个很好的引导用户得出有效猜测的辅助，例如当用户猜测一个超出范围的数字或者输入字母时采取不同的行为。

Let’s take the idea of using Rust’s type system to ensure we have a valid value
one step further and look at creating a custom type for validation. Recall the
guessing game in Chapter 2 in which our code asked the user to guess a number
between 1 and 100. We never validated that the user’s guess was between those
numbers before checking it against our secret number; we only validated that
the guess was positive. In this case, the consequences were not very dire: our
output of “Too high” or “Too low” would still be correct. But it would be a
useful enhancement to guide the user toward valid guesses and have different
behavior when a user guesses a number that’s out of range versus when a user
types, for example, letters instead.

一种实现方式是将猜测解析成 i32 而不仅仅是 u32，来默许输入负数，接着检查数字是否在范围内：

One way to do this would be to parse the guess as an `i32` instead of only a
`u32` to allow potentially negative numbers, and then add a check for the
number being in range, like so:

```rust
    loop {
        // --snip--

        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        if guess < 1 || guess > 100 {
            println!("The secret number will be between 1 and 100.");
            continue;
        }

        match guess.cmp(&secret_number) {
            // --snip--
    }

```

if 表达式检查了值是否超出范围，告诉用户出了什么问题，并调用 continue 开始下一次循环，请求另一个猜测。if 表达式之后，就可以在知道 guess 在 1 到 100 之间的情况下与秘密数字作比较了。

The `if` expression checks whether our value is out of range, tells the user
about the problem, and calls `continue` to start the next iteration of the loop
and ask for another guess. After the `if` expression, we can proceed with the
comparisons between `guess` and the secret number knowing that `guess` is
between 1 and 100.

然而，这并不是一个理想的解决方案：如果让程序仅仅处理 1 到 100 之间的值是一个绝对需要满足的要求，而且程序中的很多函数都有这样的要求，在每个函数中都有这样的检查将是非常冗余的（并可能潜在的影响性能）。

However, this is not an ideal solution: if it was absolutely critical that the
program only operated on values between 1 and 100, and it had many functions
with this requirement, having a check like this in every function would be
tedious (and might impact performance).

相反我们可以创建一个新类型来将验证放入创建其实例的函数中，而不是到处重复这些检查。这样就可以安全地在函数签名中使用新类型并相信它们接收到的值。示例 9-13 中展示了一个定义 Guess 类型的方法，只有在 new 函数接收到 1 到 100 之间的值时才会创建 Guess 的实例：

Instead, we can make a new type and put the validations in a function to create
an instance of the type rather than repeating the validations everywhere. That
way, it’s safe for functions to use the new type in their signatures and
confidently use the values they receive. Listing 9-13 shows one way to define a
`Guess` type that will only create an instance of `Guess` if the `new` function
receives a value between 1 and 100.

<!-- Deliberately not using rustdoc_include here; the `main` function in the
file requires the `rand` crate. We do want to include it for reader
experimentation purposes, but don't want to include it for rustdoc testing
purposes. -->

```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {value}.");
        }

        Guess { value }
    }

    pub fn value(&self) -> i32 {
        self.value
    }
}
```

<span class="caption">
示例 9-13：一个 Guess 类型，它只在值位于 1 和 100 之间时才继续
Listing 9-13: A `Guess` type that will only continue with
values between 1 and 100</span>

首先，我们定义了一个包含 i32 类型字段 value 的结构体 Guess。这里是储存猜测值的地方。

First, we define a struct named `Guess` that has a field named `value` that
holds an `i32`. This is where the number will be stored.

接着在 Guess 上实现了一个叫做 new 的关联函数来创建 Guess 的实例。new 定义为接收一个 i32 类型的参数 value 并返回一个 Guess。new 函数中代码的测试确保了其值是在 1 到 100 之间的。如果 value 没有通过测试则调用 panic!，这会警告调用这个函数的程序员有一个需要修改的 bug，因为创建一个 value 超出范围的 Guess 将会违反 Guess::new 所遵循的契约。Guess::new 会出现 panic 的条件应该在其公有 API 文档中被提及；第十四章会涉及到在 API 文档中表明 panic! 可能性的相关规则。如果 value 通过了测试，我们新建一个 Guess，其字段 value 将被设置为参数 value 的值，接着返回这个 Guess。

Then we implement an associated function named `new` on `Guess` that creates
instances of `Guess` values. The `new` function is defined to have one
parameter named `value` of type `i32` and to return a `Guess`. The code in the
body of the `new` function tests `value` to make sure it’s between 1 and 100.
If `value` doesn’t pass this test, we make a `panic!` call, which will alert
the programmer who is writing the calling code that they have a bug they need
to fix, because creating a `Guess` with a `value` outside this range would
violate the contract that `Guess::new` is relying on. The conditions in which
`Guess::new` might panic should be discussed in its public-facing API
documentation; we’ll cover documentation conventions indicating the possibility
of a `panic!` in the API documentation that you create in Chapter 14. If
`value` does pass the test, we create a new `Guess` with its `value` field set
to the `value` parameter and return the `Guess`.

接着，我们实现了一个借用了 self 的方法 value，它没有任何其他参数并返回一个 i32。这类方法有时被称为 getter，因为它的目的就是返回对应字段的数据。这样的公有方法是必要的，因为 Guess 结构体的 value 字段是私有的。私有的字段 value 是很重要的，这样使用 Guess 结构体的代码将不允许直接设置 value 的值：调用者 必须 使用 Guess::new 方法来创建一个 Guess 的实例，这就确保了不会存在一个 value 没有通过 Guess::new 函数的条件检查的 Guess。

Next, we implement a method named `value` that borrows `self`, doesn’t have any
other parameters, and returns an `i32`. This kind of method is sometimes called
a _getter_, because its purpose is to get some data from its fields and return
it. This public method is necessary because the `value` field of the `Guess`
struct is private. It’s important that the `value` field be private so code
using the `Guess` struct is not allowed to set `value` directly: code outside
the module _must_ use the `Guess::new` function to create an instance of
`Guess`, thereby ensuring there’s no way for a `Guess` to have a `value` that
hasn’t been checked by the conditions in the `Guess::new` function.

于是，一个接收（或返回）1 到 100 之间数字的函数就可以声明为接收（或返回） Guess 的实例，而不是 i32，同时其函数体中也无需进行任何额外的检查。

A function that has a parameter or returns only numbers between 1 and 100 could
then declare in its signature that it takes or returns a `Guess` rather than an
`i32` and wouldn’t need to do any additional checks in its body.

## Summary 总结

Rust 的错误处理功能被设计为帮助你编写更加健壮的代码。panic! 宏代表一个程序无法处理的状态，并停止执行而不是使用无效或不正确的值继续处理。Rust 类型系统的 Result 枚举代表操作可能会在一种可以恢复的情况下失败。可以使用 Result 来告诉代码调用者他需要处理潜在的成功或失败。在适当的场景使用 panic! 和 Result 将会使你的代码在面对不可避免的错误时显得更加可靠。

Rust’s error handling features are designed to help you write more robust code.
The `panic!` macro signals that your program is in a state it can’t handle and
lets you tell the process to stop instead of trying to proceed with invalid or
incorrect values. The `Result` enum uses Rust’s type system to indicate that
operations might fail in a way that your code could recover from. You can use
`Result` to tell code that calls your code that it needs to handle potential
success or failure as well. Using `panic!` and `Result` in the appropriate
situations will make your code more reliable in the face of inevitable problems.

现在我们已经见识过了标准库中 Option 和 Result 泛型枚举的能力了，在下一章让我们聊聊泛型是如何工作的，以及如何在你的代码中使用它们。

Now that you’ve seen useful ways that the standard library uses generics with
the `Option` and `Result` enums, we’ll talk about how generics work and how you
can use them in your code.

[encoding]: ch17-03-oo-design-patterns.html#encoding-states-and-behavior-as-types
