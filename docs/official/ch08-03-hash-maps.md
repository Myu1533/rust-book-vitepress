## Storing Keys with Associated Values in Hash Maps 使用 Hash Map 储存键值对

最后介绍的常用集合类型是 哈希 map（hash map）。HashMap<K, V> 类型储存了一个键类型 K 对应一个值类型 V 的映射。它通过一个 哈希函数（hashing function）来实现映射，决定如何将键和值放入内存中。很多编程语言支持这种数据结构，不过通常有不同的名字：哈希、map、对象、哈希表或者关联数组，仅举几例。

The last of our common collections is the _hash map_. The type `HashMap<K, V>`
stores a mapping of keys of type `K` to values of type `V` using a
_hashing function_, which determines how it places these keys and values into
memory. Many programming languages support this kind of data structure, but
they often use a different name, such as hash, map, object, hash table,
dictionary, or associative array, just to name a few.

哈希 map 可以用于需要任何类型作为键来寻找数据的情况，而不是像 vector 那样通过索引。例如，在一个游戏中，你可以将每个团队的分数记录到哈希 map 中，其中键是队伍的名字而值是每个队伍的分数。给出一个队名，就能得到他们的得分。

Hash maps are useful when you want to look up data not by using an index, as
you can with vectors, but by using a key that can be of any type. For example,
in a game, you could keep track of each team’s score in a hash map in which
each key is a team’s name and the values are each team’s score. Given a team
name, you can retrieve its score.

本章我们会介绍哈希 map 的基本 API，不过还有更多吸引人的功能隐藏于标准库在 HashMap<K, V> 上定义的函数中。一如既往请查看标准库文档来了解更多信息。

We’ll go over the basic API of hash maps in this section, but many more goodies
are hiding in the functions defined on `HashMap<K, V>` by the standard library.
As always, check the standard library documentation for more information.

### Creating a New Hash Map 新建一个哈希 map

可以使用 new 创建一个空的 HashMap，并使用 insert 增加元素。在示例 8-20 中我们记录两支队伍的分数，分别是蓝队和黄队。蓝队开始有 10 分而黄队开始有 50 分：

One way to create an empty hash map is using `new` and adding elements with
`insert`. In Listing 8-20, we’re keeping track of the scores of two teams whose
names are _Blue_ and _Yellow_. The Blue team starts with 10 points, and the
Yellow team starts with 50.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
```

<span class="caption">
示例 8-20：新建一个哈希 map 并插入一些键值对
Listing 8-20: Creating a new hash map and inserting some
keys and values</span>

注意必须首先 use 标准库中集合部分的 HashMap。在这三个常用集合中，HashMap 是最不常用的，所以并没有被 prelude 自动引用。标准库中对 HashMap 的支持也相对较少，例如，并没有内建的构建宏。

Note that we need to first `use` the `HashMap` from the collections portion of
the standard library. Of our three common collections, this one is the least
often used, so it’s not included in the features brought into scope
automatically in the prelude. Hash maps also have less support from the
standard library; there’s no built-in macro to construct them, for example.

像 vector 一样，哈希 map 将它们的数据储存在堆上，这个 HashMap 的键类型是 String 而值类型是 i32。类似于 vector，哈希 map 是同质的：所有的键必须是相同类型，值也必须都是相同类型。

Just like vectors, hash maps store their data on the heap. This `HashMap` has
keys of type `String` and values of type `i32`. Like vectors, hash maps are
homogeneous: all of the keys must have the same type as each other, and all of
the values must have the same type.

### Accessing Values in a Hash Map 访问哈希 map 中的值

可以通过 get 方法并提供对应的键来从哈希 map 中获取值，如示例 8-21 所示：

We can get a value out of the hash map by providing its key to the `get`
method, as shown in Listing 8-21.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    let team_name = String::from("Blue");
    let score = scores.get(&team_name).copied().unwrap_or(0);
```

<span class="caption">
示例 8-21：访问哈希 map 中储存的蓝队分数
Listing 8-21: Accessing the score for the Blue team
stored in the hash map</span>

这里，score 是与蓝队分数相关的值，应为 10。get 方法返回 Option<&V>，如果某个键在哈希 map 中没有对应的值，get 会返回 None。程序中通过调用 copied 方法来获取一个 Option<i32> 而不是 Option<&i32>，接着调用 unwrap_or 在 scores 中没有该键所对应的项时将其设置为零。

Here, `score` will have the value that’s associated with the Blue team, and the
result will be `10`. The `get` method returns an `Option<&V>`; if there’s no
value for that key in the hash map, `get` will return `None`. This program
handles the `Option` by calling `copied` to get an `Option<i32>` rather than an
`Option<&i32>`, then `unwrap_or` to set `score` to zero if `scores` doesn't
have an entry for the key.

可以使用与 vector 类似的方式来遍历哈希 map 中的每一个键值对，也就是 for 循环：

We can iterate over each key/value pair in a hash map in a similar manner as we
do with vectors, using a `for` loop:

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    for (key, value) in &scores {
        println!("{key}: {value}");
    }
```

这会以任意顺序打印出每一个键值对：

This code will print each pair in an arbitrary order:

```text
Yellow: 50
Blue: 10
```

### Hash Maps and Ownership 哈希 map 和所有权

对于像 i32 这样的实现了 Copy trait 的类型，其值可以拷贝进哈希 map。对于像 String 这样拥有所有权的值，其值将被移动而哈希 map 会成为这些值的所有者，如示例 8-22 所示：

For types that implement the `Copy` trait, like `i32`, the values are copied
into the hash map. For owned values like `String`, the values will be moved and
the hash map will be the owner of those values, as demonstrated in Listing 8-22.

```rust
    use std::collections::HashMap;

    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();
    map.insert(field_name, field_value);
    // 这里 field_name 和 field_value 不再有效，
    // 尝试使用它们看看会出现什么编译错误！
```

<span class="caption">
示例 8-22：展示一旦键值对被插入后就为哈希 map 所拥有
Listing 8-22: Showing that keys and values are owned by
the hash map once they’re inserted</span>

当 insert 调用将 field_name 和 field_value 移动到哈希 map 中后，将不能使用这两个绑定。

We aren’t able to use the variables `field_name` and `field_value` after
they’ve been moved into the hash map with the call to `insert`.

如果将值的引用插入哈希 map，这些值本身将不会被移动进哈希 map。但是这些引用指向的值必须至少在哈希 map 有效时也是有效的。第十章 “生命周期确保引用有效” 部分将会更多的讨论这个问题。

If we insert references to values into the hash map, the values won’t be moved
into the hash map. The values that the references point to must be valid for at
least as long as the hash map is valid. We’ll talk more about these issues in
the [“Validating References with
Lifetimes”][validating-references-with-lifetimes]<!-- ignore --> section in
Chapter 10.

### Updating a Hash Map 更新哈希 map

尽管键值对的数量是可以增长的，每个唯一的键只能同时关联一个值（反之不一定成立：比如蓝队和黄队的 scores 哈希 map 中都可能存储有 10 这个值）。

Although the number of key and value pairs is growable, each unique key can
only have one value associated with it at a time (but not vice versa: for
example, both the Blue team and the Yellow team could have value 10 stored in
the `scores` hash map).

当我们想要改变哈希 map 中的数据时，必须决定如何处理一个键已经有值了的情况。可以选择完全无视旧值并用新值代替旧值。可以选择保留旧值而忽略新值，并只在键 没有 对应值时增加新值。或者可以结合新旧两值。让我们看看这分别该如何处理！

When you want to change the data in a hash map, you have to decide how to
handle the case when a key already has a value assigned. You could replace the
old value with the new value, completely disregarding the old value. You could
keep the old value and ignore the new value, only adding the new value if the
key _doesn’t_ already have a value. Or you could combine the old value and the
new value. Let’s look at how to do each of these!

#### Overwriting a Value 覆盖一个值

如果我们插入了一个键值对，接着用相同的键插入一个不同的值，与这个键相关联的旧值将被替换。即便示例 8-23 中的代码调用了两次 insert，哈希 map 也只会包含一个键值对，因为两次都是对蓝队的键插入的值：

If we insert a key and a value into a hash map and then insert that same key
with a different value, the value associated with that key will be replaced.
Even though the code in Listing 8-23 calls `insert` twice, the hash map will
only contain one key/value pair because we’re inserting the value for the Blue
team’s key both times.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);

    println!("{scores:?}");
```

<span class="caption">
示例 8-23：替换以特定键储存的值
Listing 8-23: Replacing a value stored with a particular
key</span>

这会打印出 {"Blue": 25}。原始的值 10 则被覆盖了。

This code will print `{"Blue": 25}`. The original value of `10` has been
overwritten.

<!-- Old headings. Do not remove or links may break. -->

<a id="only-inserting-a-value-if-the-key-has-no-value"></a>

#### Adding a Key and Value Only If a Key Isn’t Present 只在键没有对应值时插入键值对

我们经常会检查某个特定的键是否已经存在于哈希 map 中并进行如下操作：如果哈希 map 中键已经存在则不做任何操作。如果不存在则连同值一块插入。

It’s common to check whether a particular key already exists in the hash map
with a value then take the following actions: if the key does exist in the hash
map, the existing value should remain the way it is. If the key doesn’t exist,
insert it and a value for it.

为此哈希 map 有一个特有的 API，叫做 entry，它获取我们想要检查的键作为参数。entry 函数的返回值是一个枚举，Entry，它代表了可能存在也可能不存在的值。比如说我们想要检查黄队的键是否关联了一个值。如果没有，就插入值 50，对于蓝队也是如此。使用 entry API 的代码看起来像示例 8-24 这样：

Hash maps have a special API for this called `entry` that takes the key you
want to check as a parameter. The return value of the `entry` method is an enum
called `Entry` that represents a value that might or might not exist. Let’s say
we want to check whether the key for the Yellow team has a value associated
with it. If it doesn’t, we want to insert the value 50, and the same for the
Blue team. Using the `entry` API, the code looks like Listing 8-24.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);

    println!("{scores:?}");
```

<span class="caption">
示例 8-24：使用 entry 方法只在键没有对应一个值时插入
Listing 8-24: Using the `entry` method to only insert if
the key does not already have a value</span>

Entry 的 or_insert 方法在键对应的值存在时就返回这个值的可变引用，如果不存在则将参数作为新值插入并返回新值的可变引用。这比编写自己的逻辑要简明的多，另外也与借用检查器结合得更好。

The `or_insert` method on `Entry` is defined to return a mutable reference to
the value for the corresponding `Entry` key if that key exists, and if not,
inserts the parameter as the new value for this key and returns a mutable
reference to the new value. This technique is much cleaner than writing the
logic ourselves and, in addition, plays more nicely with the borrow checker.

运行示例 8-24 的代码会打印出 {"Yellow": 50, "Blue": 10}。第一个 entry 调用会插入黄队的键和值 50，因为黄队并没有一个值。第二个 entry 调用不会改变哈希 map 因为蓝队已经有了值 10。

Running the code in Listing 8-24 will print `{"Yellow": 50, "Blue": 10}`. The
first call to `entry` will insert the key for the Yellow team with the value
50 because the Yellow team doesn’t have a value already. The second call to
`entry` will not change the hash map because the Blue team already has the
value 10.

#### Updating a Value Based on the Old Value 根据旧值更新一个值

另一个常见的哈希 map 的应用场景是找到一个键对应的值并根据旧的值更新它。例如，示例 8-25 中的代码计数一些文本中每一个单词分别出现了多少次。我们使用哈希 map 以单词作为键并递增其值来记录我们遇到过几次这个单词。如果是第一次看到某个单词，就插入值 0。

Another common use case for hash maps is to look up a key’s value and then
update it based on the old value. For instance, Listing 8-25 shows code that
counts how many times each word appears in some text. We use a hash map with
the words as keys and increment the value to keep track of how many times we’ve
seen that word. If it’s the first time we’ve seen a word, we’ll first insert
the value 0.

```rust
    use std::collections::HashMap;

    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }

    println!("{map:?}");
```

<span class="caption">
示例 8-25：通过哈希 map 储存单词和计数来统计出现次数
Listing 8-25: Counting occurrences of words using a hash
map that stores words and counts</span>

这会打印出 {"world": 2, "hello": 1, "wonderful": 1}。你可能会看到相同的键值对以不同的顺序打印：回忆一下“访问哈希 map 中的值”部分中遍历哈希 map 会以任意顺序进行。

This code will print `{"world": 2, "hello": 1, "wonderful": 1}`. You might see
the same key/value pairs printed in a different order: recall from the
[“Accessing Values in a Hash Map”][access]<!-- ignore --> section that
iterating over a hash map happens in an arbitrary order.

split_whitespace 方法返回一个由空格分隔 text 值子 slice 的迭代器。or_insert 方法返回这个键的值的一个可变引用（&mut V）。这里我们将这个可变引用储存在 count 变量中，所以为了赋值必须首先使用星号（\*）解引用 count。这个可变引用在 for 循环的结尾离开作用域，这样所有这些改变都是安全的并符合借用规则。

The `split_whitespace` method returns an iterator over sub-slices, separated by
whitespace, of the value in `text`. The `or_insert` method returns a mutable
reference (`&mut V`) to the value for the specified key. Here we store that
mutable reference in the `count` variable, so in order to assign to that value,
we must first dereference `count` using the asterisk (`*`). The mutable
reference goes out of scope at the end of the `for` loop, so all of these
changes are safe and allowed by the borrowing rules.

### Hashing Functions 哈希函数

HashMap 默认使用一种叫做 SipHash 的哈希函数，它可以抵御涉及哈希表（hash table）1 的拒绝服务（Denial of Service, DoS）攻击。然而这并不是可用的最快的算法，不过为了更高的安全性值得付出一些性能的代价。如果性能监测显示此哈希函数非常慢，以致于你无法接受，你可以指定一个不同的 hasher 来切换为其它函数。hasher 是一个实现了 BuildHasher trait 的类型。第十章会讨论 trait 和如何实现它们。你并不需要从头开始实现你自己的 hasher；crates.io 有其他人分享的实现了许多常用哈希算法的 hasher 的库。

By default, `HashMap` uses a hashing function called _SipHash_ that can provide
resistance to Denial of Service (DoS) attacks involving hash
tables[^siphash]<!-- ignore -->. This is not the fastest hashing algorithm
available, but the trade-off for better security that comes with the drop in
performance is worth it. If you profile your code and find that the default
hash function is too slow for your purposes, you can switch to another function
by specifying a different hasher. A _hasher_ is a type that implements the
`BuildHasher` trait. We’ll talk about traits and how to implement them in
Chapter 10. You don’t necessarily have to implement your own hasher from
scratch; [crates.io](https://crates.io/)<!-- ignore --> has libraries shared by
other Rust users that provide hashers implementing many common hashing
algorithms.

[^siphash]: [https://en.wikipedia.org/wiki/SipHash](https://en.wikipedia.org/wiki/SipHash)

## Summary 总结

vector、字符串和哈希 map 会在你的程序需要储存、访问和修改数据时帮助你。这里有一些你应该能够解决的练习问题：

Vectors, strings, and hash maps will provide a large amount of functionality
necessary in programs when you need to store, access, and modify data. Here are
some exercises you should now be equipped to solve:

- Given a list of integers, use a vector and return the median (when sorted,
  the value in the middle position) and mode (the value that occurs most often;
  a hash map will be helpful here) of the list. 给定一系列数字，使用 vector 并返回这个列表的中位数（排列数组后位于中间的值）和众数（mode，出现次数最多的值；这里哈希 map 会很有帮助）。
- Convert strings to pig latin. The first consonant of each word is moved to
  the end of the word and “ay” is added, so “first” becomes “irst-fay.” Words
  that start with a vowel have “hay” added to the end instead (“apple” becomes
  “apple-hay”). Keep in mind the details about UTF-8 encoding! 将字符串转换为 Pig Latin，也就是每一个单词的第一个辅音字母被移动到单词的结尾并增加 “ay”，所以 “first” 会变成 “irst-fay”。元音字母开头的单词则在结尾增加 “hay”（“apple” 会变成 “apple-hay”）。牢记 UTF-8 编码！
- Using a hash map and vectors, create a text interface to allow a user to add
  employee names to a department in a company. For example, “Add Sally to
  Engineering” or “Add Amir to Sales.” Then let the user retrieve a list of all
  people in a department or all people in the company by department, sorted
  alphabetically. 使用哈希 map 和 vector，创建一个文本接口来允许用户向公司的部门中增加员工的名字。例如，“Add Sally to Engineering” 或 “Add Amir to Sales”。接着让用户获取一个部门的所有员工的列表，或者公司每个部门的所有员工按照字典序排列的列表。

标准库 API 文档中描述的这些类型的方法将有助于你进行这些练习！

The standard library API documentation describes methods that vectors, strings,
and hash maps have that will be helpful for these exercises!

我们已经开始接触可能会有失败操作的复杂程序了，这也意味着接下来是一个了解错误处理的绝佳时机！

We’re getting into more complex programs in which operations can fail, so, it’s
a perfect time to discuss error handling. We’ll do that next!

[validating-references-with-lifetimes]: ch10-03-lifetime-syntax.html#validating-references-with-lifetimes
[access]: #accessing-values-in-a-hash-map
