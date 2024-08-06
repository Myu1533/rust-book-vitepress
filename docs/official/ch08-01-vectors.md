## Storing Lists of Values with Vectors 使用 Vector 储存列表

我们要讲到的第一个类型是 Vec<T>，也被称为 vector。vector 允许我们在一个单独的数据结构中储存多于一个的值，它在内存中彼此相邻地排列所有的值。vector 只能储存相同类型的值。它们在拥有一系列项的场景下非常实用，例如文件中的文本行或是购物车中商品的价格。

The first collection type we’ll look at is `Vec<T>`, also known as a _vector_.
Vectors allow you to store more than one value in a single data structure that
puts all the values next to each other in memory. Vectors can only store values
of the same type. They are useful when you have a list of items, such as the
lines of text in a file or the prices of items in a shopping cart.

### Creating a New Vector 新建向量

为了创建一个新的空 vector，可以调用 Vec::new 函数，如示例 8-1 所示：

To create a new empty vector, we call the `Vec::new` function, as shown in
Listing 8-1.

```rust
    let v: Vec<i32> = Vec::new();
```

<span class="caption">
示例 8-1：新建一个空的 vector 来储存 i32 类型的值
Listing 8-1: Creating a new, empty vector to hold values
of type `i32`</span>

注意这里我们增加了一个类型注解。因为没有向这个 vector 中插入任何值，Rust 并不知道我们想要储存什么类型的元素。这是一个非常重要的点。vector 是用泛型实现的，第十章会涉及到如何对你自己的类型使用它们。现在，所有你需要知道的就是 Vec<T> 是一个由标准库提供的类型，它可以存放任何类型，而当 Vec 存放某个特定类型时，那个类型位于尖括号中。在示例 8-1 中，我们告诉 Rust v 这个 Vec<T> 将存放 i32 类型的元素。

Note that we added a type annotation here. Because we aren’t inserting any
values into this vector, Rust doesn’t know what kind of elements we intend to
store. This is an important point. Vectors are implemented using generics;
we’ll cover how to use generics with your own types in Chapter 10. For now,
know that the `Vec<T>` type provided by the standard library can hold any type.
When we create a vector to hold a specific type, we can specify the type within
angle brackets. In Listing 8-1, we’ve told Rust that the `Vec<T>` in `v` will
hold elements of the `i32` type.

通常，我们会用初始值来创建一个 Vec<T> 而 Rust 会推断出储存值的类型，所以很少会需要这些类型注解。为了方便 Rust 提供了 vec! 宏，这个宏会根据我们提供的值来创建一个新的 vector。示例 8-2 新建一个拥有值 1、2 和 3 的 Vec<i32>。推断为 i32 是因为这是默认整型类型，第三章的 “数据类型” 讨论过：

More often, you’ll create a `Vec<T>` with initial values and Rust will infer
the type of value you want to store, so you rarely need to do this type
annotation. Rust conveniently provides the `vec!` macro, which will create a
new vector that holds the values you give it. Listing 8-2 creates a new
`Vec<i32>` that holds the values `1`, `2`, and `3`. The integer type is `i32`
because that’s the default integer type, as we discussed in the [“Data
Types”][data-types]<!-- ignore --> section of Chapter 3.

```rust
    let v = vec![1, 2, 3];
```

<span class="caption">
示例 8-2：新建一个包含初值的 vector
Listing 8-2: Creating a new vector containing
values</span>

因为我们提供了 i32 类型的初始值，Rust 可以推断出 v 的类型是 Vec<i32>，因此类型注解就不是必须的。接下来让我们看看如何修改一个 vector。

Because we’ve given initial `i32` values, Rust can infer that the type of `v`
is `Vec<i32>`, and the type annotation isn’t necessary. Next, we’ll look at how
to modify a vector.

### Updating a Vector 更新向量

对于新建一个 vector 并向其增加元素，可以使用 push 方法，如示例 8-3 所示：

To create a vector and then add elements to it, we can use the `push` method,
as shown in Listing 8-3.

```rust
    let mut v = Vec::new();

    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
```

<span class="caption">
示例 8-3：使用 push 方法向 vector 增加值
Listing 8-3: Using the `push` method to add values to a
vector</span>

如第三章中讨论的任何变量一样，如果想要能够改变它的值，必须使用 mut 关键字使其可变。放入其中的所有值都是 i32 类型的，而且 Rust 也根据数据做出如此判断，所以不需要 Vec<i32> 注解。

As with any variable, if we want to be able to change its value, we need to
make it mutable using the `mut` keyword, as discussed in Chapter 3. The numbers
we place inside are all of type `i32`, and Rust infers this from the data, so
we don’t need the `Vec<i32>` annotation.

### Reading Elements of Vectors 读取向量的元素

有两种方法引用 vector 中储存的值：通过索引或使用 get 方法。在接下来的示例中，为了更加清楚的说明，我们已经标注了这些函数返回的值的类型。

There are two ways to reference a value stored in a vector: via indexing or
using the `get` method. In the following examples, we’ve annotated the types of
the values that are returned from these functions for extra clarity.

示例 8-4 展示了访问 vector 中一个值的两种方式，索引语法或者 get 方法：

Listing 8-4 shows both methods of accessing a value in a vector, with indexing
syntax and the `get` method.

```rust
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("The third element is {third}");

    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
```

<span class="caption">
示例 8-5：尝试访问一个包含 5 个元素的 vector 的索引 100 处的元素
Listing 8-4: Using indexing syntax or the `get` method to
access an item in a vector</span>

这里有几个细节需要注意。我们使用索引值 2 来获取第三个元素，因为索引是从数字 0 开始的。使用 & 和 [] 会得到一个索引位置元素的引用。当使用索引作为参数调用 get 方法时，会得到一个可以用于 match 的 Option<&T>。

Note a few details here. We use the index value of `2` to get the third element
because vectors are indexed by number, starting at zero. Using `&` and `[]`
gives us a reference to the element at the index value. When we use the `get`
method with the index passed as an argument, we get an `Option<&T>` that we can
use with `match`.

Rust 提供了两种引用元素的方法的原因是当尝试使用现有元素范围之外的索引值时可以选择让程序如何运行。举个例子，让我们看看使用这个技术，尝试在当有一个 5 个元素的 vector 接着访问索引 100 位置的元素会发生什么，如示例 8-5 所示：

The reason Rust provides these two ways to reference an element is so you can
choose how the program behaves when you try to use an index value outside the
range of existing elements. As an example, let’s see what happens when we have
a vector of five elements and then we try to access an element at index 100
with each technique, as shown in Listing 8-5.

```rust,should_panic,panics
    let v = vec![1, 2, 3, 4, 5];

    let does_not_exist = &v[100];
    let does_not_exist = v.get(100);
```

<span class="caption">
示例 8-5：尝试访问一个包含 5 个元素的 vector 的索引 100 处的元素
Listing 8-5: Attempting to access the element at index
100 in a vector containing five elements</span>

当运行这段代码，你会发现对于第一个 [] 方法，当引用一个不存在的元素时 Rust 会造成 panic。这个方法更适合当程序认为尝试访问超过 vector 结尾的元素是一个严重错误的情况，这时应该使程序崩溃。

When we run this code, the first `[]` method will cause the program to panic
because it references a nonexistent element. This method is best used when you
want your program to crash if there’s an attempt to access an element past the
end of the vector.

当 get 方法被传递了一个数组外的索引时，它不会 panic 而是返回 None。当偶尔出现超过 vector 范围的访问属于正常情况的时候可以考虑使用它。接着你的代码可以有处理 Some(&element) 或 None 的逻辑，如第六章讨论的那样。例如，索引可能来源于用户输入的数字。如果它们不慎输入了一个过大的数字那么程序就会得到 None 值，你可以告诉用户当前 vector 元素的数量并再请求它们输入一个有效的值。这就比因为输入错误而使程序崩溃要友好的多！

When the `get` method is passed an index that is outside the vector, it returns
`None` without panicking. You would use this method if accessing an element
beyond the range of the vector may happen occasionally under normal
circumstances. Your code will then have logic to handle having either
`Some(&element)` or `None`, as discussed in Chapter 6. For example, the index
could be coming from a person entering a number. If they accidentally enter a
number that’s too large and the program gets a `None` value, you could tell the
user how many items are in the current vector and give them another chance to
enter a valid value. That would be more user-friendly than crashing the program
due to a typo!

一旦程序获取了一个有效的引用，借用检查器将会执行所有权和借用规则（第四章讲到）来确保 vector 内容的这个引用和任何其他引用保持有效。回忆一下不能在相同作用域中同时存在可变和不可变引用的规则。这个规则适用于示例 8-6，当我们获取了 vector 的第一个元素的不可变引用并尝试在 vector 末尾增加一个元素的时候，如果尝试在函数的后面引用这个元素是行不通的：

When the program has a valid reference, the borrow checker enforces the
ownership and borrowing rules (covered in Chapter 4) to ensure this reference
and any other references to the contents of the vector remain valid. Recall the
rule that states you can’t have mutable and immutable references in the same
scope. That rule applies in Listing 8-6, where we hold an immutable reference
to the first element in a vector and try to add an element to the end. This
program won’t work if we also try to refer to that element later in the
function:

```rust
    let mut v = vec![1, 2, 3, 4, 5];

    let first = &v[0];

    v.push(6);

    println!("The first element is: {first}");
```

<span class="caption">
示例 8-6：在拥有 vector 中项的引用的同时向其增加一个元素
Listing 8-6: Attempting to add an element to a vector
while holding a reference to an item</span>

编译会给出这个错误：

Compiling this code will result in this error:

```console
$ cargo run
   Compiling collections v0.1.0 (file:///projects/collections)
error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:5
  |
4 |     let first = &v[0];
  |                  - immutable borrow occurs here
5 |
6 |     v.push(6);
  |     ^^^^^^^^^ mutable borrow occurs here
7 |
8 |     println!("The first element is: {first}");
  |                                     ------- immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `collections` (bin "collections") due to 1 previous error
```

示例 8-6 中的代码看起来应该能够运行：为什么第一个元素的引用会关心 vector 结尾的变化？不能这么做的原因是由于 vector 的工作方式：在 vector 的结尾增加新元素时，在没有足够空间将所有元素依次相邻存放的情况下，可能会要求分配新内存并将老的元素拷贝到新的空间中。这时，第一个元素的引用就指向了被释放的内存。借用规则阻止程序陷入这种状况。

The code in Listing 8-6 might look like it should work: why should a reference
to the first element care about changes at the end of the vector? This error is
due to the way vectors work: because vectors put the values next to each other
in memory, adding a new element onto the end of the vector might require
allocating new memory and copying the old elements to the new space, if there
isn’t enough room to put all the elements next to each other where the vector
is currently stored. In that case, the reference to the first element would be
pointing to deallocated memory. The borrowing rules prevent programs from
ending up in that situation.

> 注意：关于 Vec<T> 类型的更多实现细节，请查看 “The Rustonomicon”
> Note: For more on the implementation details of the `Vec<T>` type, see [“The
> Rustonomicon”][nomicon].

### Iterating over the Values in a Vector 遍历 vector 中的元素

如果想要依次访问 vector 中的每一个元素，我们可以遍历其所有的元素而无需通过索引一次一个的访问。示例 8-7 展示了如何使用 for 循环来获取 i32 值的 vector 中的每一个元素的不可变引用并将其打印：

To access each element in a vector in turn, we would iterate through all of the
elements rather than use indices to access one at a time. Listing 8-7 shows how
to use a `for` loop to get immutable references to each element in a vector of
`i32` values and print them.

```rust
    let v = vec![100, 32, 57];
    for i in &v {
        println!("{i}");
    }
```

<span class="caption">
示例 8-7：通过 for 循环遍历 vector 的元素并打印
Listing 8-7: Printing each element in a vector by
iterating over the elements using a `for` loop</span>

我们也可以遍历可变 vector 的每一个元素的可变引用以便能改变它们。示例 8-8 中的 for 循环会给每一个元素加 50：

We can also iterate over mutable references to each element in a mutable vector
in order to make changes to all the elements. The `for` loop in Listing 8-8
will add `50` to each element.

```rust
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
```

<span class="caption">
示例 8-8：遍历 vector 中元素的可变引用
Listing 8-8: Iterating over mutable references to
elements in a vector</span>

为了修改可变引用所指向的值，在使用 += 运算符之前必须使用解引用运算符（\*）获取 i 中的值。第十五章的 “通过解引用运算符追踪指针的值” 部分会详细介绍解引用运算符。

To change the value that the mutable reference refers to, we have to use the
`*` dereference operator to get to the value in `i` before we can use the `+=`
operator. We’ll talk more about the dereference operator in the [“Following the
Pointer to the Value with the Dereference Operator”][deref]<!-- ignore -->
section of Chapter 15.

因为借用检查器的规则，无论可变还是不可变地遍历一个 vector 都是安全的。如果尝试在示例 8-7 和 示例 8-8 的 for 循环体内插入或删除项，都会得到一个类似示例 8-6 代码中类似的编译错误。for 循环中获取的 vector 引用阻止了同时对 vector 整体的修改。

Iterating over a vector, whether immutably or mutably, is safe because of the
borrow checker's rules. If we attempted to insert or remove items in the `for`
loop bodies in Listing 8-7 and Listing 8-8, we would get a compiler error
similar to the one we got with the code in Listing 8-6. The reference to the
vector that the `for` loop holds prevents simultaneous modification of the
whole vector.

### Using an Enum to Store Multiple Types 使用枚举来储存多种类型

vector 只能储存相同类型的值。这是很不方便的；绝对会有需要储存一系列不同类型的值的用例。幸运的是，枚举的成员都被定义为相同的枚举类型，所以当需要在 vector 中储存不同类型值时，我们可以定义并使用一个枚举！

Vectors can only store values that are the same type. This can be inconvenient;
there are definitely use cases for needing to store a list of items of
different types. Fortunately, the variants of an enum are defined under the
same enum type, so when we need one type to represent elements of different
types, we can define and use an enum!

例如，假如我们想要从电子表格的一行中获取值，而这一行的有些列包含数字，有些包含浮点值，还有些是字符串。我们可以定义一个枚举，其成员会存放这些不同类型的值，同时所有这些枚举成员都会被当作相同类型：那个枚举的类型。接着可以创建一个储存枚举值的 vector，这样最终就能够储存不同类型的值了。示例 8-9 展示了其用例：

For example, say we want to get values from a row in a spreadsheet in which
some of the columns in the row contain integers, some floating-point numbers,
and some strings. We can define an enum whose variants will hold the different
value types, and all the enum variants will be considered the same type: that
of the enum. Then we can create a vector to hold that enum and so, ultimately,
holds different types. We’ve demonstrated this in Listing 8-9.

```rust
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
```

<span class="caption">
示例 8-9：定义一个枚举，以便能在 vector 中存放不同类型的数据
Listing 8-9: Defining an `enum` to store values of
different types in one vector</span>

Rust 在编译时就必须准确的知道 vector 中类型的原因在于它需要知道储存每个元素到底需要多少内存。第二个好处是可以准确的知道这个 vector 中允许什么类型。如果 Rust 允许 vector 存放任意类型，那么当对 vector 元素执行操作时一个或多个类型的值就有可能会造成错误。使用枚举外加 match 意味着 Rust 能在编译时就保证总是会处理所有可能的情况，正如第六章讲到的那样。

Rust needs to know what types will be in the vector at compile time so it knows
exactly how much memory on the heap will be needed to store each element. We
must also be explicit about what types are allowed in this vector. If Rust
allowed a vector to hold any type, there would be a chance that one or more of
the types would cause errors with the operations performed on the elements of
the vector. Using an enum plus a `match` expression means that Rust will ensure
at compile time that every possible case is handled, as discussed in Chapter 6.

如果在编写程序时不能确切无遗地知道运行时会储存进 vector 的所有类型，枚举技术就行不通了。相反，你可以使用 trait 对象，第十七章会讲到它。

If you don’t know the exhaustive set of types a program will get at runtime to
store in a vector, the enum technique won’t work. Instead, you can use a trait
object, which we’ll cover in Chapter 17.

现在我们了解了一些使用 vector 的最常见的方式，请一定去看看标准库中 Vec 定义的很多其他实用方法的 API 文档。例如，除了 push 之外还有一个 pop 方法，它会移除并返回 vector 的最后一个元素。

Now that we’ve discussed some of the most common ways to use vectors, be sure
to review [the API documentation][vec-api]<!-- ignore --> for all the many
useful methods defined on `Vec<T>` by the standard library. For example, in
addition to `push`, a `pop` method removes and returns the last element.

### Dropping a Vector Drops Its Elements 丢弃 vector 时也会丢弃其所有元素

类似于任何其他的 struct，vector 在其离开作用域时会被释放，如示例 8-4 所标注的：

Like any other `struct`, a vector is freed when it goes out of scope, as
annotated in Listing 8-10.

```rust
    {
        let v = vec![1, 2, 3, 4];

        // do stuff with v
    } // <- v goes out of scope and is freed here
```

<span class="caption">
示例 8-10：展示 vector 和其元素于何处被丢弃
Listing 8-10: Showing where the vector and its elements
are dropped</span>

当 vector 被丢弃时，所有其内容也会被丢弃，这意味着这里它包含的整数将被清理。借用检查器确保了任何 vector 中内容的引用仅在 vector 本身有效时才可用。

When the vector gets dropped, all of its contents are also dropped, meaning the
integers it holds will be cleaned up. The borrow checker ensures that any
references to contents of a vector are only used while the vector itself is
valid.

让我们继续下一个集合类型：String！

Let’s move on to the next collection type: `String`!

[data-types]: ch03-02-data-types.html#data-types
[nomicon]: ../nomicon/vec/vec.html
[vec-api]: ../std/vec/struct.Vec.html
[deref]: ch15-02-deref.html#following-the-pointer-to-the-value-with-the-dereference-operator
