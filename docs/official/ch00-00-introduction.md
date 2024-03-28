# Introduction 简介

> 提示: 当前版本的与[No Starch Press][nsp] 上的 [The Rust Programming
> Language][nsprust] 印刷版和电子版内容一致
>
> Note: This edition of the book is the same as [The Rust Programming
> Language][nsprust] available in print and ebook format from [No Starch
> Press][nsp].

[nsprust]: https://nostarch.com/rust-programming-language-2nd-edition
[nsp]: https://nostarch.com/

欢迎来到 Rust 世界，这是一本 Rust 的指引书籍。Rust 将帮助你编写更快，更可靠的软件。高级工程和底层控制经常在面向对象语言中；Rust 将挑战冲突。通过平衡技术难度和良好开发体验，Rust 给你提供控制底层细节的选择（比如说内存使用），而不需要困在传统的控制的连接上。

Welcome to _The Rust Programming Language_, an introductory book about Rust.
The Rust programming language helps you write faster, more reliable software.
High-level ergonomics and low-level control are often at odds in programming
language design; Rust challenges that conflict. Through balancing powerful
technical capacity and a great developer experience, Rust gives you the option
to control low-level details (such as memory usage) without all the hassle
traditionally associated with such control.

## Who Rust Is For Rust 为了谁

Rust 源自许多人的各种原因。让我们来看看其中最重要的几个群体。

Rust is ideal for many people for a variety of reasons. Let’s look at a few of
the most important groups.

### Teams of Developers 开发团队

Rust 致力于成为一个在不同系统间协同的大型开发团队的产品化工具。底层代码容易出翔多方面的微小的 Bug，而这些在大多数语言中需要经验丰富的开发人员在严格的测试和仔细的代码审查中才能被发现。在 Rust 中，编译器作为一个门将的角色，在编译阶段就能阻止这些难以捕捉的 Bugs，包括并发 Bugs。有了编译器的工作，团队可以把时间花在编程逻辑上，而不是发现 Bugs。

Rust is proving to be a productive tool for collaborating among large teams of
developers with varying levels of systems programming knowledge. Low-level code
is prone to various subtle bugs, which in most other languages can be caught
only through extensive testing and careful code review by experienced
developers. In Rust, the compiler plays a gatekeeper role by refusing to
compile code with these elusive bugs, including concurrency bugs. By working
alongside the compiler, the team can spend their time focusing on the program’s
logic rather than chasing down bugs.

Rust 也在系统层面同时提供了开发工具：

Rust also brings contemporary developer tools to the systems programming world:

- Cargo, 依赖管理和构建工具，减少新增，编译和管理依赖的痛点，保持 Rust 生态的一致。
- Cargo, the included dependency manager and build tool, makes adding,
  compiling, and managing dependencies painless and consistent across the Rust
  ecosystem.
- Rustfmt 帮助开发者保持代码风格一致。
- The Rustfmt formatting tool ensures a consistent coding style across
  developers.
- Rust 的 IDE 提供了代码的完整性和行内错误信息。
- The Rust Language Server powers Integrated Development Environment (IDE)
  integration for code completion and inline error messages.

通过使用 Rust 生态的工具，提升了开发者在系统层面代码的生产力。

By using these and other tools in the Rust ecosystem, developers can be
productive while writing systems-level code.

### Students 学生

Rust 也是那些对系统概念感兴趣的学生的语言。使用 Rust，许多人学习了例如操作系统开发等内容。社区非常欢迎学生并乐意回答他们的问题。通过这本书的影响，Rust 团队希望把系统概念传播给更多的人，尤其是新的开发人员。

Rust is for students and those who are interested in learning about systems
concepts. Using Rust, many people have learned about topics like operating
systems development. The community is very welcoming and happy to answer
student questions. Through efforts such as this book, the Rust teams want to
make systems concepts more accessible to more people, especially those new to
programming.

### Companies 企业

成百上千的公司，无论大小，在各种任务中使用 Rust，包括命令行工具，网络服务，DevOps 工具，元器件设备，音视频分析和转制，加密货币，生物信息，搜索引擎，物联网，机器学习，甚至 Firefox 浏览器的核心部分。

Hundreds of companies, large and small, use Rust in production for a variety of
tasks, including command line tools, web services, DevOps tooling, embedded
devices, audio and video analysis and transcoding, cryptocurrencies,
bioinformatics, search engines, Internet of Things applications, machine
learning, and even major parts of the Firefox web browser.

### Open Source Developers 开源开发者

Rust 也是为了愿意给 Rust 共享的开发者，社区，开发工具，库。我们欢迎为 Rust 做贡献。

Rust is for people who want to build the Rust programming language, community,
developer tools, and libraries. We’d love to have you contribute to the Rust
language.

### People Who Value Speed and Stability 为了速度和稳定的人

Rust 也是为了关注速度和稳定的一群人。关于速度，我们关注 Rust 的执行速度和开发速度。Rust 的编译器的检查通过增加特性的构建来确保稳定。这是与那些脆弱缺少检查的遗留代码进行对比，开发人员通常害怕修改。努力零成本抽象，高级特性编译成底层代码跟手撸代码一样足够快，Rust 竭尽全力将安全的代码变得快速。

Rust is for people who crave speed and stability in a language. By speed, we
mean both how quickly Rust code can run and the speed at which Rust lets you
write programs. The Rust compiler’s checks ensure stability through feature
additions and refactoring. This is in contrast to the brittle legacy code in
languages without these checks, which developers are often afraid to modify. By
striving for zero-cost abstractions, higher-level features that compile to
lower-level code as fast as code written manually, Rust endeavors to make safe
code be fast code as well.

Rust 希望服务不同的用户；这里面涉及很多大的利益。总的来说，Rust 最大的目标就是减少开发人员提供安全，产品化，高速，工程化的成本减少。给 Rust 为你工作的机会。

The Rust language hopes to support many other users as well; those mentioned
here are merely some of the biggest stakeholders. Overall, Rust’s greatest
ambition is to eliminate the trade-offs that programmers have accepted for
decades by providing safety _and_ productivity, speed _and_ ergonomics. Give
Rust a try and see if its choices work for you.

## Who This Book Is For 这么书写给谁

这本书帮助那些用其他语言编程，但是不限制是哪一种语言。我是尝试使重要的迁移对各种开发背景的人都易于使用。我们不想话太多时间讨论编程是什么或者怎么思考。如果你正在进入新的编程阶段。你最好是能被一本专门提供的书很好的服务，引导开发。

This book assumes that you’ve written code in another programming language but
doesn’t make any assumptions about which one. We’ve tried to make the material
broadly accessible to those from a wide variety of programming backgrounds. We
don’t spend a lot of time talking about what programming _is_ or how to think
about it. If you’re entirely new to programming, you would be better served by
reading a book that specifically provides an introduction to programming.

## How to Use This Book 怎么使用这本书

事实上，本书建议你从前到后阅读。后面的章回依赖前面的章回，早期的章回可能没有深挖但后期的章回可能重提这些内容。

In general, this book assumes that you’re reading it in sequence from front to
back. Later chapters build on concepts in earlier chapters, and earlier
chapters might not delve into details on a particular topic but will revisit
the topic in a later chapter.

你会发现两种章节：概念章节和项目章节。在概念章节，你将学习 Rust 的一个方面。项目章节，我们将一起利用当先所学构建小的项目。2，12 和 20 章节是项目章节；剩下的都是概念章节。

You’ll find two kinds of chapters in this book: concept chapters and project
chapters. In concept chapters, you’ll learn about an aspect of Rust. In project
chapters, we’ll build small programs together, applying what you’ve learned so
far. Chapters 2, 12, and 20 are project chapters; the rest are concept chapters.

第一章解释如何安装 Rust，如何写“Hello World！”以及 Rust 的包管理及构建工具 Cargo 怎么用。章节 2 手把手带领你写一个猜数字程序。在这里我们隐藏了高级概念，在随后的章节里逐渐补充。如果你想立马行动，第二章就是那个起点。第三章介绍了与其他语言类似的特性，在第四章你将学习 Rust 的自有系统。如果你想学习每一个细节，你可能想跳过第二章直接从第三章开始，再回到第二章，你应该更愿意用所学来写程序。

Chapter 1 explains how to install Rust, how to write a “Hello, world!” program,
and how to use Cargo, Rust’s package manager and build tool. Chapter 2 is a
hands-on introduction to writing a program in Rust, having you build up a
number guessing game. Here we cover concepts at a high level, and later
chapters will provide additional detail. If you want to get your hands dirty
right away, Chapter 2 is the place for that. Chapter 3 covers Rust features
that are similar to those of other programming languages, and in Chapter 4
you’ll learn about Rust’s ownership system. If you’re a particularly meticulous
learner who prefers to learn every detail before moving on to the next, you
might want to skip Chapter 2 and go straight to Chapter 3, returning to Chapter
2 when you’d like to work on a project applying the details you’ve learned.

第五章讨论结构和方法，第六章讨论枚举，`match`表达式，`if let`控制流结果。你将在 Rust 中使用结构和枚举自定义类型。

Chapter 5 discusses structs and methods, and Chapter 6 covers enums, `match`
expressions, and the `if let` control flow construct. You’ll use structs and
enums to make custom types in Rust.

第七章，你想学习模块系统和组织你的 API。第八章讨论由标准库提供的常见集合数据结构，例如向量，字符串和哈希。第九章探索 Rust 的异常处理的原理和技巧。

In Chapter 7, you’ll learn about Rust’s module system and about privacy rules
for organizing your code and its public Application Programming Interface
(API). Chapter 8 discusses some common collection data structures that the
standard library provides, such as vectors, strings, and hash maps. Chapter 9
explores Rust’s error-handling philosophy and techniques.

第十章深入通用技术，特性和生命周期，这些提供给你多种类型使用。十一章全部讲的是测试，Rust 必要的安全保证你的程序逻辑正确。在第十二章，我们将构建一个依赖于`grep`命令行工具的文件内容搜索的功能，通过这里，我们将使用前面章节提到的概念。

Chapter 10 digs into generics, traits, and lifetimes, which give you the power
to define code that applies to multiple types. Chapter 11 is all about testing,
which even with Rust’s safety guarantees is necessary to ensure your program’s
logic is correct. In Chapter 12, we’ll build our own implementation of a subset
of functionality from the `grep` command line tool that searches for text
within files. For this, we’ll use many of the concepts we discussed in the
previous chapters.

第十三章探索封装和迭代：来自函数编程的特性。十四章我们将深入 Cargo，谈谈如何分享库的最佳方式。十五章讨论标准库体提供的智能指针，更加函数化的特性。

Chapter 13 explores closures and iterators: features of Rust that come from
functional programming languages. In Chapter 14, we’ll examine Cargo in more
depth and talk about best practices for sharing your libraries with others.
Chapter 15 discusses smart pointers that the standard library provides and the
traits that enable their functionality.

在第十六章，我们将通过不同的模型的并发编程，讨论如何在 Rust 中减少对多线程的恐惧。第十七章探讨 Rust 与面向对象编程的差异。

In Chapter 16, we’ll walk through different models of concurrent programming
and talk about how Rust helps you to program in multiple threads fearlessly.
Chapter 17 looks at how Rust idioms compare to object-oriented programming
principles you might be familiar with.

十八章介绍模式和模式匹配，它们是 Rust 传播思想的最有效的方式。第十九章是大杂烩，保活不安全的 Rust，宏命令和更多的生命周期，特性，类型，函数以及封装。

Chapter 18 is a reference on patterns and pattern matching, which are powerful
ways of expressing ideas throughout Rust programs. Chapter 19 contains a
smorgasbord of advanced topics of interest, including unsafe Rust, macros, and
more about lifetimes, traits, types, functions, and closures.

在二十章，我们将完成一个地秤的多线程网络服务。

In Chapter 20, we’ll complete a project in which we’ll implement a low-level
multithreaded web server!

最终，是写提供其他有用信息的附件。附件 A 列举了 Rust 的关键字，附件 B 是执行器和标记，附件 C 标准库提供的特性，附件 D 介绍有用的开发工具，附件 E 解释 Rust 的编辑器。附件 F，可以找到本书的其他翻译版本，附件 G 我们介绍了 Rust 如何产生的和 Rust 的暗面。

Finally, some appendices contain useful information about the language in a
more reference-like format. Appendix A covers Rust’s keywords, Appendix B
covers Rust’s operators and symbols, Appendix C covers derivable traits
provided by the standard library, Appendix D covers some useful development
tools, and Appendix E explains Rust editions. In Appendix F, you can find
translations of the book, and in Appendix G we’ll cover how Rust is made and
what nightly Rust is.

本书怎么读都没错：如果你想跳过开头那就跳过去！你遇到迷惑的地方就跳回谦虚章节就好了。适合你就行了。

There is no wrong way to read this book: if you want to skip ahead, go for it!
You might have to jump back to earlier chapters if you experience any
confusion. But do whatever works for you.

<span id="ferris"></span>

这是学习看懂编译器的错误信息的重要部分：引导你找到可以工作的代码。例如，我们提供很多携带错误信息的编译不通过的例子。随机找一个例子，他可能是未编译的！去报你遇到的内容，你尝试运行的例子是有错误意义的。图标将帮你区分代码是否可运行：

An important part of the process of learning Rust is learning how to read the
error messages the compiler displays: these will guide you toward working code.
As such, we’ll provide many examples that don’t compile along with the error
message the compiler will show you in each situation. Know that if you enter
and run a random example, it may not compile! Make sure you read the
surrounding text to see whether the example you’re trying to run is meant to
error. Ferris will also help you distinguish code that isn’t meant to work:

| Ferris                                                                                                             | Meaning                                          |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| <img src="./img/ferris/does_not_compile.svg" class="ferris-explain" alt="Ferris with a question mark"/>            | This code does not compile!                      |
| <img src="./img/ferris/panics.svg" class="ferris-explain" alt="Ferris throwing up their hands"/>                   | This code panics!                                |
| <img src="./img/ferris/not_desired_behavior.svg" class="ferris-explain" alt="Ferris with one claw up, shrugging"/> | This code does not produce the desired behavior. |

In most situations, we’ll lead you to the correct version of any code that
doesn’t compile.

## Source Code 源码

源文件都在[GitHub][book]上。

The source files from which this book is generated can be found on
[GitHub][book].

[book]: https://github.com/rust-lang/book/tree/main/src
