import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RUST",
  description: "rust docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Book", link: "/official/title-page" },
    ],

    sidebar: [
      {
        text: "Book",
        items: [
          {
            text: "The Rust Programming Language",
            link: "/official/title-page",
          },
          { text: "Foreword", link: "/official/foreword" },
          { text: "Introduction", link: "/official/ch00-00-introduction" },
          {
            text: "1.Getting Started",
            link: "/official/ch01-00-getting-started",
            items: [
              {
                text: "1.1.Installation",
                link: "/official/ch01-01-installation",
              },
              {
                text: "1.2.Hello, World!",
                link: "/official/ch01-02-hello-world",
              },
              {
                text: "1.3.Hello, Cargo!",
                link: "/official/ch01-03-hello-cargo",
              },
            ],
          },
          {
            text: "Programming a Guessing Game",
            link: "/official/ch02-00-guessing-game-tutorial",
          },
          {
            text: "3.Common Programming Concepts",
            link: "/official/ch03-00-common-programming-concepts",
            items: [
              {
                text: "3.1.Variables and Mutability",
                link: "/official/ch03-01-variables-mutability",
              },
              {
                text: "3.2.Data Types",
                link: "/official/ch03-02-data-types",
              },
              {
                text: "3.3.Functions",
                link: "/official/ch03-03-how-functions-work",
              },
              {
                text: "3.4.Functions",
                link: "/official/ch03-04-comments",
              },
              {
                text: "3.5.Control Flow",
                link: "/official/ch03-05-control-flow",
              },
            ],
          },
          {
            text: "4.Understanding Ownership",
            link: "/official/ch04-00-understanding-ownership",
            items: [
              {
                text: "4.1.What is Ownership",
                link: "/official/ch04-01-what-is-ownership",
              },
              {
                text: "4.2.References and Borrowing",
                link: "/official/ch04-02-references-and-borrowing",
              },
              {
                text: "4.3.The Slice Type",
                link: "/official/ch04-03-slice",
              },
            ],
          },
          {
            text: "5.Using Structs to Structure Related Data",
            link: "/official/ch05-00-structs",
            items: [
              {
                text: "5.1.Defining and Instantiating Structs",
                link: "/official/ch05-01-defining-structs",
              },
              {
                text: "5.2.An Example Program Using Structs",
                link: "/official/ch05-02-example-structs",
              },
              {
                text: "5.3.Method Syntax",
                link: "/official/ch05-03-method-syntax",
              },
            ],
          },
          {
            text: "6.Enums and Pattern Matching",
            link: "/official/ch06-00-enums",
            items: [
              {
                text: "6.1.Defining an Enum",
                link: "/official/ch06-01-defining-an-enum",
              },
              {
                text: "6.2.The match Control Flow Construct",
                link: "/official/ch06-02-match",
              },
              {
                text: "6.3.Concise Control Flow with if let",
                link: "/official/ch06-03-if-let",
              },
            ],
          },
          {
            text: "7.Managing Growing Projects with Packages, Crates and Modules",
            link: "/official/ch07-00-managing-growing-projects-with-packages-crates-and-modules",
            items: [
              {
                text: "7.1.Packages and Crates",
                link: "/official/ch07-01-packages-and-crates",
              },
              {
                text: "7.2.Defining Modules to Control Scope and Privacy",
                link: "/official/ch07-02-defining-modules-to-control-scope-and-privacy",
              },
              {
                text: "7.3.Paths for Referring to an Item in the Module Tree",
                link: "/official/ch07-03-paths-for-referring-to-an-item-in-the-module-tree",
              },
              {
                text: "7.4.Bringing Paths into Scope with the use Keyword",
                link: "/official/ch07-04-binging-paths-into-scope-with-the-use-keyword",
              },
              {
                text: "7.5.Separating Modules into Different Files",
                link: "/official/ch07-05-separating-modules-into-different-files",
              },
            ],
          },
          {
            text: "8.Common Collections",
            link: "/official/ch08-00-common-collections",
            items: [
              {
                text: "8.1.Storing Lists of Values with Vectors",
                link: "/official/ch08-01-vectors",
              },
              {
                text: "8.2.Storing UTF-8 Encoded Text with Strings",
                link: "/official/ch08-02-strings",
              },
              {
                text: "8.3.Storing Keys with Associated Values in Hash Maps",
                link: "/official/ch08-03-hash-maps",
              },
            ],
          },
          {
            text: "9.Error Handling",
            link: "/official/ch09-00-error-handling",
            items: [
              {
                text: "9.1.Unrecoverable Errors with panic!",
                link: "/official/ch09-01-unrecoverable-errors-with-panic",
              },
              {
                text: "9.2.Recoverable Errors with Result",
                link: "/official/ch09-02-recoverable-errors-with-result",
              },
              {
                text: "9.3.To panic! or Not to panic!",
                link: "/official/ch09-03-to-panic-or-not-to-panic",
              },
            ],
          },
          {
            text: "10.Generic Types, Traits, and Lifetimes",
            link: "/official/ch10-00-generics",
            items: [
              {
                text: "10.1.Generic Data Types",
                link: "/official/ch10-01-syntax",
              },
              {
                text: "10.2.Traits: Defining Shared Behavior",
                link: "/official/ch10-02-traits",
              },
              {
                text: "10.3.Validating References with Lifetimes",
                link: "/official/ch10-03-lifetime-syntax",
              },
            ],
          },
          {
            text: "11.Writing Automated Tests",
            link: "/official/ch11-00-testing",
            items: [
              {
                text: "11.1.How to Write Tests",
                link: "/official/ch11-01-writing-tests",
              },
              {
                text: "11.2.Controlling How Tests Are Run",
                link: "/official/ch11-02-running-tests",
              },
              {
                text: "11.3.Test Organization",
                link: "/official/ch11-03-test-organization",
              },
            ],
          },
          {
            text: "12.An I/O Project: Building a Command Line Program",
            link: "/official/ch12-00-an-io-project",
            items: [
              {
                text: "12.1.Accepting Command Line Arguments",
                link: "/official/ch12-01-accepting-command-line-arguments",
              },
              {
                text: "12.2.Reading a File",
                link: "/official/ch12-02-reading-a-file",
              },
              {
                text: "12.3.Refactoring to Improve Modularity and Error Handling",
                link: "/official/ch12-03-improving-error-handling-and-modularity",
              },
              {
                text: "12.4.Developing the Library’s Functionality with Test-Driven Development",
                link: "/official/ch12-04-testing-the-librarys-functionality",
              },
              {
                text: "12.5.Working with Environment Variables",
                link: "/official/ch12-05-working-with-environment-variables",
              },
              {
                text: "12.6.Writing Error Messages to Standard Error Instead of Standard Output",
                link: "/official/ch12-06-writing-to-stderr-instead-of-stdout",
              },
            ],
          },
          {
            text: "13.Functional Language Features: Iterators and Closures",
            link: "/official/ch13-00-functional-features",
            items: [
              {
                text: "13.1.Closures: Anonymous Functions that Capture Their Environment",
                link: "/official/ch13-01-closures",
              },
              {
                text: "13.2.Processing a Series of Items with Iterators",
                link: "/official/ch13-02-iterators",
              },
              {
                text: "13.3.Improving Our I/O Project",
                link: "/official/ch13-03-improving-our-io-project",
              },
              {
                text: "13.4.Comparing Performance: Loops vs. Iterators",
                link: "/official/ch13-04-performance",
              },
            ],
          },
          {
            text: "14.More About Cargo and Crates.io",
            link: "/official/ch14-00-more-about-cargo",
            items: [
              {
                text: "14.1.Customizing Builds with Release Profiles",
                link: "/official/ch14-01-release-profiles",
              },
              {
                text: "14.2.Publishing a Crate to Crates.io",
                link: "/official/ch14-02-publishing-to-crates-io",
              },
              {
                text: "14.3.Cargo Workspaces",
                link: "/official/ch14-03-cargo-workspaces",
              },
              {
                text: "14.4.Installing Binaries with cargo install",
                link: "/official/ch14-04-installing-binaries",
              },
              {
                text: "14.5.Extending Cargo with Custom Commands",
                link: "/official/ch14-05-extending-cargo",
              },
            ],
          },
          {
            text: "15.Smart Pointers",
            link: "/official/ch15-00-smart-pointers",
            items: [
              {
                text: "15.1.Using Box<T> to Point to Data on the Heap",
                link: "/official/ch15-01-box",
              },
              {
                text: "15.2.Treating Smart Pointers Like Regular References with the Deref Trait",
                link: "/official/ch15-02-deref",
              },
              {
                text: "15.3.Running Code on Cleanup with the Drop Trait",
                link: "/official/ch15-03-drop",
              },
              {
                text: "15.4.Rc<T>, the Reference Counted Smart Pointer",
                link: "/official/ch15-04-rc",
              },
              {
                text: "15.5.RefCell<T> and the Interior Mutability Pattern",
                link: "/official/ch15-05-interior-mutability",
              },
              {
                text: "15.6.Reference Cycles Can Leak Memory",
                link: "/official/ch15-06-reference-cycles",
              },
            ],
          },
          {
            text: "16.Fearless Concurrency",
            link: "/official/ch16-00-concurrency",
            items: [
              {
                text: "16.1.Using Threads to Run Code Simultaneously",
                link: "/official/ch16-01-threads",
              },
              {
                text: "16.2.Using Message Passing to Transfer Data Between Threads",
                link: "/official/ch16-02-message-passing",
              },
              {
                text: "16.3.Shared-State Concurrency",
                link: "/official/ch16-03-shared-state",
              },
              {
                text: "16.4.Extensible Concurrency with the Sync and Send Traits",
                link: "/official/ch16-04-extensible-concurrency-sync-and-send",
              },
            ],
          },
          {
            text: "17.Object-Oriented Programming Features of Rust",
            link: "/official/ch17-00-oop",
            items: [
              {
                text: "17.1.Characteristics of Object-Oriented Languages",
                link: "/official/ch17-01-what-is-oo",
              },
              {
                text: "17.2.Using Trait Objects That Allow for Values of Different Types",
                link: "/official/ch17-02-trait-objects",
              },
              {
                text: "17.3.Implementing an Object-Oriented Design Pattern",
                link: "/official/ch17-03-oo-design-patterns",
              },
            ],
          },
          {
            text: "18.Patterns and Matching",
            link: "/official/ch18-00-patterns",
            items: [
              {
                text: "18.1.All the Places Patterns Can Be Used",
                link: "/official/ch18-01-all-the-places-for-patterns",
              },
              {
                text: "18.2.Refutability: Whether a Pattern Might Fail to Match",
                link: "/official/ch18-02-refutability",
              },
              {
                text: "18.3.Pattern Syntax",
                link: "/official/ch18-03-oo-pattern-syntax",
              },
            ],
          },
          {
            text: "19.Advanced Features",
            link: "/official/ch19-00-advanced-features",
            items: [
              {
                text: "19.1.Unsafe Rust",
                link: "/official/ch19-01-unsafe-rust",
              },
              {
                text: "19.2.Advanced Traits",
                link: "/official/ch19-03-advanced-traits",
              },
              {
                text: "19.3.Advanced Types",
                link: "/official/ch19-04-advanced-types",
              },
              {
                text: "19.4.Advanced Functions and Closures",
                link: "/official/ch19-05-advanced-functions-and-closures",
              },
              {
                text: "19.5.Macros",
                link: "/official/ch19-06-macros",
              },
            ],
          },
          {
            text: "20.Final Project: Building a Multithreaded Web Server",
            link: "/official/ch20-00-final-project-a-web-server",
            items: [
              {
                text: "20.1.Building a Single-Threaded Web Server",
                link: "/official/ch20-01-single-threaded",
              },
              {
                text: "20.2.Turning Our Single-Threaded Server into a Multithreaded Server",
                link: "/official/ch20-02-multithreaded",
              },
              {
                text: "20.3.Graceful Shutdown and Cleanup",
                link: "/official/ch20-03-graceful-shutdown-and-cleanup",
              },
            ],
          },
          {
            text: "21.Appendix",
            link: "/official/appendix-00",
            items: [
              {
                text: "21.1.Appendix A: Keywords",
                link: "/official/appendix-01-keywords",
              },
              {
                text: "21.2.Appendix B: Operators and Symbols",
                link: "/official/appendix-02-operators",
              },
              {
                text: "21.3.Appendix C: Derivable Traits",
                link: "/official/appendix-03-derivable-traits",
              },
              {
                text: "21.4.Appendix D - Useful Development Tools",
                link: "/official/appendix-04-useful-development-tools",
              },
              {
                text: "21.5.Appendix E - Editions",
                link: "/official/appendix-05-editions",
              },
              {
                text: "21.6.Appendix F: Translations of the Book",
                link: "/official/appendix-06-translation",
              },
              {
                text: "21.7.Appendix G - How Rust is Made and “Nightly Rust”",
                link: "/official/appendix-07-nightly-rust",
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
