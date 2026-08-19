export const roadmapsData = [
  {
    "title": "Computer Science",
    "slug": "computer-science",
    "description": "Learn computing fundamentals, programming, algorithms, systems, and software engineering.",
    "category": "Foundations",
    "difficulty": "Intermediate",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "cs-intro",
        "videoTitle": "Crash Course Computer Science",
        "videoInstructor": "CrashCourse",
        "videoUrl": "https://www.youtube.com/watch?v=O5nskjZ_GoI",
        "videoDescription": "A high-level overview of how computers work, from transistors to full systems.",
        "videoDuration": "10:30",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Computer Fundamentals",
        "description": "Understand how CPUs execute instructions, how registers and caches affect performance, and how memory hierarchy connects software execution to physical hardware.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 10,
        "prerequisites": [],
        "skills": [
          "Computer Architecture",
          "Operating Systems"
        ],
        "learningObjectives": [
          "Explain the role of the CPU, ALU, and registers in processing data.",
          "Describe the instruction execution cycle (fetch, decode, execute).",
          "Differentiate between primary and secondary storage."
        ],
        "topics": [
          "CPU architecture",
          "Instruction cycle",
          "Memory hierarchy",
          "Motherboard components"
        ],
        "practicalExercise": "Use a simple program or simulator to trace how an instruction moves through the CPU execution cycle.",
        "recommendedBookTitle": "Code: The Hidden Language of Computer Hardware and Software",
        "recommendedBookAuthor": "Charles Petzold",
        "recommendedBookUrl": "https://www.microsoftpressstore.com/store/code-the-hidden-language-of-computer-hardware-and-9780137909100",
        "recommendedBookDescription": "Explores the foundational mechanisms of how computers work, from logic gates to processors.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-binary",
        "videoTitle": "See How Computers Add Numbers In One Lesson",
        "videoInstructor": "In One Lesson",
        "videoUrl": "https://www.youtube.com/watch?v=VBDoT8o4q00",
        "videoDescription": "A fantastic visual explanation of how binary numbers and logic gates create computation.",
        "videoDuration": "14:26",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Binary & Number Systems",
        "description": "Comprehend how computers represent data internally using binary and hexadecimal, and perform fundamental bitwise operations.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 5,
        "prerequisites": [
          "cs-intro"
        ],
        "skills": [
          "Mathematics",
          "Binary Logic"
        ],
        "learningObjectives": [
          "Convert numbers between base-10, base-2, and base-16.",
          "Explain ASCII and Unicode text representation.",
          "Perform basic bitwise operations like AND, OR, XOR, and shifts."
        ],
        "topics": [
          "Binary numbering system",
          "Hexadecimal numbering",
          "Two's complement",
          "Bitwise operations",
          "Character encoding"
        ],
        "practicalExercise": "Write a script that manually converts a user-provided integer into its binary and hexadecimal equivalents without using built-in conversion functions.",
        "recommendedBookTitle": "Computer Systems: A Programmer's Perspective",
        "recommendedBookAuthor": "Randal E. Bryant, David R. O'Hallaron",
        "recommendedBookUrl": "https://csapp.cs.cmu.edu/",
        "recommendedBookDescription": "Provides deep insights into data representation, including binary, hex, and bitwise operations.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-math",
        "videoTitle": "Discrete Math 1: Sets, Propositional Logic, and Proofs",
        "videoInstructor": "TheTrevTutor",
        "videoUrl": "https://www.youtube.com/watch?v=tyDKR4FG3Yw",
        "videoDescription": "An excellent full-length lecture series on discrete mathematics foundations.",
        "videoDuration": "1:25:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Discrete Mathematics",
        "description": "Grasp mathematical concepts that form the foundation of computer algorithms, including logic, set theory, and combinatorics.",
        "stage": "FOUNDATIONS",
        "order": 3,
        "estimatedHours": 20,
        "prerequisites": [
          "cs-binary"
        ],
        "skills": [
          "Discrete Math",
          "Logic"
        ],
        "learningObjectives": [
          "Evaluate complex boolean logic expressions.",
          "Apply set operations to solve mathematical problems.",
          "Calculate permutations and combinations for algorithmic complexity."
        ],
        "topics": [
          "Boolean algebra",
          "Set theory",
          "Combinatorics",
          "Graph theory basics",
          "Proof techniques"
        ],
        "practicalExercise": "Create truth tables for complex logical statements and write a program to verify De Morgan's laws programmatically.",
        "recommendedBookTitle": "Discrete Mathematics and Its Applications",
        "recommendedBookAuthor": "Kenneth H. Rosen",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/discrete-mathematics-its-applications-rosen/M9781259676512.html",
        "recommendedBookDescription": "The standard textbook for discrete math, covering logic, combinatorics, and graph theory comprehensively.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-prog",
        "videoTitle": "CS50x 2023 - Lecture 1 - C",
        "videoInstructor": "David J. Malan",
        "videoUrl": "https://www.youtube.com/watch?v=kLGHm1174i8",
        "videoDescription": "CS50x 2023 Lecture 1 covering C, variables, and loops.",
        "videoDuration": "2:27:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Programming Fundamentals",
        "description": "Master the foundational syntax and control structures of a programming language to write executable scripts and applications.",
        "stage": "PROGRAMMING",
        "order": 4,
        "estimatedHours": 20,
        "prerequisites": [
          "cs-math"
        ],
        "skills": [
          "Python",
          "C",
          "Java"
        ],
        "learningObjectives": [
          "Declare and manipulate different variable types.",
          "Implement conditional logic to control execution flow.",
          "Utilize loops to iterate over data collections."
        ],
        "topics": [
          "Variables and types",
          "Control structures (if/else)",
          "Iteration (loops)",
          "Functions and scope",
          "Basic error handling"
        ],
        "practicalExercise": "Build a command-line calculator that takes user input, parses the operation, executes conditional logic, and safely handles divide-by-zero errors.",
        "recommendedBookTitle": "Structure and Interpretation of Computer Programs",
        "recommendedBookAuthor": "Harold Abelson, Gerald Jay Sussman",
        "recommendedBookUrl": "https://mitpress.mit.edu/9780262543231/structure-and-interpretation-of-computer-programs/",
        "recommendedBookDescription": "A classic text that teaches fundamental programming concepts and abstraction.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-git",
        "videoTitle": "Git and GitHub for Beginners - Crash Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=RGOj5yH7evk",
        "videoDescription": "A comprehensive beginner tutorial covering all essential Git commands.",
        "videoDuration": "1:08:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Git & Version Control",
        "description": "Understand decentralized version control concepts and commands to safely track code changes and collaborate with others.",
        "stage": "PROGRAMMING",
        "order": 5,
        "estimatedHours": 10,
        "prerequisites": [
          "cs-prog"
        ],
        "skills": [
          "Git",
          "GitHub",
          "Version Control"
        ],
        "learningObjectives": [
          "Initialize and configure a local Git repository.",
          "Stage, commit, and inspect changes using the Git CLI.",
          "Resolve merge conflicts efficiently."
        ],
        "topics": [
          "Version control concepts",
          "Staging and committing",
          "Branching and merging",
          "Remote repositories",
          "Conflict resolution"
        ],
        "practicalExercise": "Simulate a team environment by cloning a repo, creating a feature branch, generating a merge conflict intentionally, and resolving it successfully.",
        "recommendedBookTitle": "Pro Git",
        "recommendedBookAuthor": "Scott Chacon, Ben Straub",
        "recommendedBookUrl": "https://git-scm.com/book/en/v2",
        "recommendedBookDescription": "The official, comprehensive guide to Git version control, free to read online.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "cs-arrays",
        "videoTitle": "Data Structures: Arrays vs Linked Lists",
        "videoInstructor": "mycodeschool",
        "videoUrl": "https://www.youtube.com/watch?v=lC-yYCOnN8Q",
        "videoDescription": "A clear comparison of memory layout and performance between arrays and linked lists.",
        "videoDuration": "16:10",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Arrays & Linked Lists",
        "description": "Analyze the memory allocation and performance characteristics of contiguous versus linked linear data structures.",
        "stage": "DATA STRUCTURES",
        "order": 6,
        "estimatedHours": 15,
        "prerequisites": [
          "cs-prog"
        ],
        "skills": [
          "Data Structures",
          "Algorithms"
        ],
        "learningObjectives": [
          "Contrast contiguous memory arrays with pointer-based linked lists.",
          "Calculate the time complexity for insertion and deletion operations.",
          "Implement a singly linked list from scratch."
        ],
        "topics": [
          "Contiguous memory",
          "Pointers and references",
          "Array insertion/deletion",
          "Singly linked lists",
          "Doubly linked lists"
        ],
        "practicalExercise": "Write a program that implements a custom Linked List class with append, prepend, insert, and delete methods, then compare its speed to a standard array for inserting at index 0.",
        "recommendedBookTitle": "Introduction to Algorithms",
        "recommendedBookAuthor": "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
        "recommendedBookUrl": "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        "recommendedBookDescription": "The definitive textbook on algorithms and data structures, including arrays and linked lists.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-stacks",
        "videoTitle": "Data Structures: Stacks and Queues",
        "videoInstructor": "HackerRank",
        "videoUrl": "https://www.youtube.com/watch?v=wjI1WNcIntg",
        "videoDescription": "A short, conceptual overview of LIFO and FIFO data structures.",
        "videoDuration": "08:15",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Stacks & Queues",
        "description": "Implement and apply Last-In-First-Out (LIFO) and First-In-First-Out (FIFO) data structures for managing application state and tasks.",
        "stage": "DATA STRUCTURES",
        "order": 7,
        "estimatedHours": 15,
        "prerequisites": [
          "cs-arrays"
        ],
        "skills": [
          "Data Structures"
        ],
        "learningObjectives": [
          "Implement a stack using both an array and a linked list.",
          "Implement a queue and understand circular queues.",
          "Apply stacks to evaluate postfix expressions."
        ],
        "topics": [
          "LIFO operations",
          "FIFO operations",
          "Stack implementations",
          "Queue implementations",
          "Deque (Double-ended queue)"
        ],
        "practicalExercise": "Create a bracket-matching utility that uses a stack data structure to validate if a string of code has properly closed parentheses and braces.",
        "recommendedBookTitle": "Algorithms, 4th Edition",
        "recommendedBookAuthor": "Robert Sedgewick, Kevin Wayne",
        "recommendedBookUrl": "https://algs4.cs.princeton.edu/home/",
        "recommendedBookDescription": "Excellent explanations and Java implementations of stacks, queues, and other core data structures.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-trees",
        "videoTitle": "Data Structures: Trees",
        "videoInstructor": "HackerRank",
        "videoUrl": "https://www.youtube.com/watch?v=oSWTXtMglKE",
        "videoDescription": "Introduction to hierarchical data structures and binary search trees.",
        "videoDuration": "10:10",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Trees & Graphs",
        "description": "Navigate and manipulate hierarchical and relational data using tree and graph structures.",
        "stage": "DATA STRUCTURES",
        "order": 8,
        "estimatedHours": 25,
        "prerequisites": [
          "cs-stacks"
        ],
        "skills": [
          "Data Structures",
          "Graph Theory"
        ],
        "learningObjectives": [
          "Traverse trees using in-order, pre-order, and post-order techniques.",
          "Implement a Binary Search Tree (BST) for efficient data lookup.",
          "Distinguish between directed, undirected, and weighted graphs."
        ],
        "topics": [
          "Binary Trees",
          "Tree Traversals",
          "Binary Search Trees",
          "Graph representations (Adjacency Matrix/List)",
          "Heaps and Priority Queues"
        ],
        "practicalExercise": "Build a Binary Search Tree that inserts a list of random integers, then write a function that prints them in sorted order using in-order traversal.",
        "recommendedBookTitle": "Introduction to Algorithms",
        "recommendedBookAuthor": "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
        "recommendedBookUrl": "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        "recommendedBookDescription": "Detailed analysis and algorithms for traversing and manipulating trees and graphs.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-bigo",
        "videoTitle": "Time Complexity – Big O Notation Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=Mo4vesaut8g",
        "videoDescription": "Comprehensive Big O Notation course.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Complexity & Big O",
        "description": "Evaluate the efficiency of algorithms by quantifying their time and space resource requirements as data scales.",
        "stage": "ALGORITHMS",
        "order": 9,
        "estimatedHours": 15,
        "prerequisites": [
          "cs-trees"
        ],
        "skills": [
          "Algorithms",
          "Time Complexity"
        ],
        "learningObjectives": [
          "Identify O(1), O(N), O(N^2), and O(log N) algorithms.",
          "Calculate the worst-case time complexity of nested loops.",
          "Evaluate the space complexity tradeoffs in recursive functions."
        ],
        "topics": [
          "Asymptotic notation",
          "Time complexity",
          "Space complexity",
          "Best, worst, and average cases",
          "Amortized analysis"
        ],
        "practicalExercise": "Write two different functions to find duplicates in an array (one using nested loops, one using a hash set) and mathematically prove their differing Big O complexities.",
        "recommendedBookTitle": "Grokking Algorithms",
        "recommendedBookAuthor": "Aditya Bhargava",
        "recommendedBookUrl": "https://www.manning.com/books/grokking-algorithms-second-edition",
        "recommendedBookDescription": "A highly visual, easy-to-understand introduction to algorithms and Big O notation.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-sort",
        "videoTitle": "Algorithms: Sorting",
        "videoInstructor": "HackerRank",
        "videoUrl": "https://www.youtube.com/watch?v=pkkFqlG0Hds",
        "videoDescription": "A quick visual explanation of standard sorting algorithms.",
        "videoDuration": "09:30",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Sorting & Searching",
        "description": "Analyze fundamental algorithmic patterns to effectively order and retrieve data collections.",
        "stage": "ALGORITHMS",
        "order": 10,
        "estimatedHours": 20,
        "prerequisites": [
          "cs-bigo"
        ],
        "skills": [
          "Algorithms"
        ],
        "learningObjectives": [
          "Implement classic sorting algorithms like Merge Sort and Quick Sort.",
          "Execute Binary Search on a sorted collection.",
          "Compare the stability and in-place properties of different sorts."
        ],
        "topics": [
          "Bubble, Insertion, Selection sort",
          "Merge sort",
          "Quick sort",
          "Linear and Binary search",
          "Sorting stability"
        ],
        "practicalExercise": "Implement Merge Sort and Quick Sort, generate an array of 100,000 random integers, and benchmark the time each algorithm takes to sort the array.",
        "recommendedBookTitle": "The Art of Computer Programming, Vol. 3: Sorting and Searching",
        "recommendedBookAuthor": "Donald E. Knuth",
        "recommendedBookUrl": "https://www-cs-faculty.stanford.edu/~knuth/taocp.html",
        "recommendedBookDescription": "The ultimate authority on sorting and searching algorithms.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-dp",
        "videoTitle": "Dynamic Programming - Learn to Solve Algorithmic Problems",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=oBt53YbR9Kk",
        "videoDescription": "A thorough course covering memoization and tabulation for complex algorithms.",
        "videoDuration": "5:10:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Dynamic Programming",
        "description": "Optimize recursive algorithms by identifying overlapping subproblems and caching their results.",
        "stage": "ALGORITHMS",
        "order": 11,
        "estimatedHours": 30,
        "prerequisites": [
          "cs-sort"
        ],
        "skills": [
          "Algorithms",
          "Dynamic Programming"
        ],
        "learningObjectives": [
          "Distinguish between top-down memoization and bottom-up tabulation.",
          "Identify problems that possess optimal substructure.",
          "Solve the classic knapsack or coin change problems."
        ],
        "topics": [
          "Memoization",
          "Tabulation",
          "Overlapping subproblems",
          "Optimal substructure",
          "State transitions"
        ],
        "practicalExercise": "Write a recursive Fibonacci function, observe its slowness at N=40, then optimize it using memoization to execute instantly.",
        "recommendedBookTitle": "Dynamic Programming for Coding Interviews",
        "recommendedBookAuthor": "Kamal Rawat, Meenakshi",
        "recommendedBookUrl": "https://www.amazon.com/Dynamic-Programming-Coding-Interviews-Bottom-Up/dp/1946556696",
        "recommendedBookDescription": "A practical guide to understanding and applying dynamic programming to algorithmic problems.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-arch",
        "videoTitle": "Lecture 9. Branch Prediction I - Carnegie Mellon - Comp. Arch. 2015",
        "videoInstructor": "Onur Mutlu",
        "videoUrl": "https://www.youtube.com/watch?v=3R-zFv1O9C0",
        "videoDescription": "Lecture on Branch Prediction from Carnegie Mellon University.",
        "videoDuration": "1:20:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Computer Architecture",
        "description": "Explore the physical and logical layers of computing devices, understanding how assembly language commands physical hardware.",
        "stage": "CORE COMPUTER SCIENCE",
        "order": 12,
        "estimatedHours": 35,
        "prerequisites": [
          "cs-dp"
        ],
        "skills": [
          "Computer Architecture",
          "Assembly"
        ],
        "learningObjectives": [
          "Map high-level code to assembly instructions.",
          "Explain the impact of L1/L2/L3 CPU caching on performance.",
          "Describe pipelining and superscalar execution."
        ],
        "topics": [
          "Instruction Set Architectures (ISA)",
          "Assembly language basics",
          "CPU Caching",
          "Pipelining",
          "Virtual memory hardware"
        ],
        "practicalExercise": "Write a simple program in an assembly simulator (like MARS or a web-based ARM emulator) that adds two numbers and stores the result in memory.",
        "recommendedBookTitle": "Computer Organization and Design",
        "recommendedBookAuthor": "David A. Patterson, John L. Hennessy",
        "recommendedBookUrl": "https://www.elsevier.com/books/computer-organization-and-design-mips-edition/patterson/978-0-12-820109-1",
        "recommendedBookDescription": "The foundational text for understanding computer architecture, pipelining, and memory hierarchy.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-os",
        "videoTitle": "Operating Systems: Crash Course Computer Science #18",
        "videoInstructor": "CrashCourse",
        "videoUrl": "https://www.youtube.com/watch?v=26QPDBe-NB8",
        "videoDescription": "Crash Course on Operating Systems concepts.",
        "videoDuration": "0:13:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Operating Systems",
        "description": "Understand how the operating system manages hardware resources, processes, and concurrent execution.",
        "stage": "CORE COMPUTER SCIENCE",
        "order": 13,
        "estimatedHours": 40,
        "prerequisites": [
          "cs-arch"
        ],
        "skills": [
          "Operating Systems",
          "Linux",
          "Concurrency"
        ],
        "learningObjectives": [
          "Differentiate between processes and threads.",
          "Identify common synchronization issues like race conditions and deadlocks.",
          "Explain how the OS manages virtual memory via paging."
        ],
        "topics": [
          "Process management",
          "Multithreading and Concurrency",
          "Locks, Mutexes, and Semaphores",
          "Memory management and Paging",
          "File systems"
        ],
        "practicalExercise": "Write a multithreaded script where multiple threads attempt to increment a shared counter, observe the race condition, and fix it using a Mutex.",
        "recommendedBookTitle": "Operating System Concepts",
        "recommendedBookAuthor": "Abraham Silberschatz, Peter Baer Galvin, Greg Gagne",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Operating+System+Concepts%2C+10th+Edition-p-9781119320913",
        "recommendedBookDescription": "Provides a strong foundation for processes, memory management, scheduling and operating-system architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-db",
        "videoTitle": "Database Design Course - Learn how to design and plan a database",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=ztHopE5Wnpc",
        "videoDescription": "Comprehensive introduction to relational schemas and normalization.",
        "videoDuration": "8:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Databases",
        "description": "Design structured relational data models and guarantee data integrity using transaction properties.",
        "stage": "CORE COMPUTER SCIENCE",
        "order": 14,
        "estimatedHours": 30,
        "prerequisites": [
          "cs-os"
        ],
        "skills": [
          "Databases",
          "SQL",
          "PostgreSQL"
        ],
        "learningObjectives": [
          "Design a normalized relational schema up to 3NF.",
          "Write SQL queries utilizing JOINs, GROUP BY, and aggregations.",
          "Explain the ACID properties of database transactions."
        ],
        "topics": [
          "Relational Data Modeling",
          "Normalization (1NF, 2NF, 3NF)",
          "SQL Querying",
          "Indexes and Performance",
          "ACID Transactions"
        ],
        "practicalExercise": "Design an e-commerce schema (Users, Orders, Products, Order_Items), write the SQL to create the tables, and query the total revenue per user.",
        "recommendedBookTitle": "Database System Concepts",
        "recommendedBookAuthor": "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
        "recommendedBookUrl": "https://db-book.com/",
        "recommendedBookDescription": "Comprehensive coverage of database modeling, SQL, normalization, and transaction management.",
        "resourceType": "BOOK"
      },
      {
        "key": "cs-net",
        "videoTitle": "Computer Networking Full Course in One Video",
        "videoInstructor": "NetworkChuck",
        "videoUrl": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
        "videoDescription": "A fun and practical breakdown of OSI layers and networking basics.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Computer Networks",
        "description": "Analyze the protocols and layers that enable global data communication across interconnected computer networks.",
        "stage": "CORE COMPUTER SCIENCE",
        "order": 15,
        "estimatedHours": 30,
        "prerequisites": [
          "cs-os"
        ],
        "skills": [
          "Networking",
          "TCP/IP"
        ],
        "learningObjectives": [
          "Map real-world protocols to the OSI and TCP/IP models.",
          "Explain the differences between TCP and UDP transmission.",
          "Trace the steps of a DNS resolution."
        ],
        "topics": [
          "OSI Model",
          "TCP/IP Suite",
          "IP Addressing (IPv4/IPv6)",
          "DNS (Domain Name System)",
          "HTTP/HTTPS fundamentals"
        ],
        "practicalExercise": "Use Wireshark or tcpdump to capture network packets while loading a webpage, and filter the capture to inspect the DNS request and TCP handshake.",
        "recommendedBookTitle": "Computer Networking: A Top-Down Approach",
        "recommendedBookAuthor": "James Kurose, Keith Ross",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003336/9780136681557",
        "recommendedBookDescription": "A widely used textbook teaching networking starting from the application layer down to the physical layer.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "Software Engineering",
    "slug": "software-engineering",
    "description": "Learn how to build, test, deploy, and maintain robust software systems.",
    "category": "Engineering",
    "difficulty": "Intermediate",
    "estimatedHours": 400,
    "nodes": [
      {
        "key": "se-lang",
        "videoTitle": "JavaScript: The Hard Parts",
        "videoInstructor": "Frontend Masters",
        "videoUrl": "https://www.youtube.com/watch?v=8zKuNo4ay8E",
        "videoDescription": "Deep exploration of execution context, closures, and async JS.",
        "videoDuration": "2:15:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Language Fundamentals",
        "description": "Master the advanced features, idioms, and standard libraries of a core programming language used in software engineering.",
        "stage": "PROGRAMMING",
        "order": 1,
        "estimatedHours": 40,
        "prerequisites": [],
        "skills": [
          "JavaScript",
          "TypeScript",
          "Python"
        ],
        "learningObjectives": [
          "Utilize advanced language features like closures, decorators, or generics.",
          "Implement idiomatic error handling and memory management.",
          "Leverage the language's package ecosystem to integrate third-party tools."
        ],
        "topics": [
          "Advanced syntax and typing",
          "Memory and reference management",
          "Error handling patterns",
          "Asynchronous programming constructs",
          "Standard libraries and package managers"
        ],
        "practicalExercise": "Build a robust CLI tool that reads a local file, parses its contents, performs an asynchronous API request, and safely handles all edge cases and exceptions.",
        "recommendedBookTitle": "Eloquent JavaScript",
        "recommendedBookAuthor": "Marijn Haverbeke",
        "recommendedBookUrl": "https://eloquentjavascript.net/",
        "recommendedBookDescription": "An excellent deep-dive into JavaScript, a core language for modern software engineering.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-git",
        "videoTitle": "13 Advanced (but useful) Git Techniques and Shortcuts",
        "videoInstructor": "Fireship",
        "videoUrl": "https://www.youtube.com/watch?v=eCGKObB-GEY",
        "videoDescription": "Advanced Git techniques and workflow shortcuts.",
        "videoDuration": "0:10:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Version Control (Git)",
        "description": "Execute advanced version control workflows required for collaborative engineering environments.",
        "stage": "PROGRAMMING",
        "order": 2,
        "estimatedHours": 15,
        "prerequisites": [
          "se-lang"
        ],
        "skills": [
          "Git",
          "GitHub",
          "GitLab"
        ],
        "learningObjectives": [
          "Execute interactive rebases to clean up commit history.",
          "Implement a branching strategy such as GitFlow or Trunk-Based Development.",
          "Utilize git bisect to identify commits that introduced bugs."
        ],
        "topics": [
          "Interactive rebasing",
          "Squashing commits",
          "Git hooks",
          "Branching strategies",
          "Git bisect and reflog"
        ],
        "practicalExercise": "Create a dummy repository, add 10 commits (with one containing a bug), use git rebase to squash the first 3 commits, and use git bisect to find the buggy commit.",
        "recommendedBookTitle": "Pro Git",
        "recommendedBookAuthor": "Scott Chacon, Ben Straub",
        "recommendedBookUrl": "https://git-scm.com/book/en/v2",
        "recommendedBookDescription": "Advanced Git topics including rebasing, branching strategies, and hooks.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "se-web",
        "videoTitle": "HTML & CSS Full Course - Beginner to Pro",
        "videoInstructor": "SuperSimpleDev",
        "videoUrl": "https://www.youtube.com/watch?v=G3e-cpL7ofc",
        "videoDescription": "Full HTML & CSS tutorial for beginners.",
        "videoDuration": "6:31:24",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Web Fundamentals",
        "description": "Build responsive and accessible web interfaces using core browser technologies.",
        "stage": "FRONTEND",
        "order": 3,
        "estimatedHours": 30,
        "prerequisites": [
          "se-git"
        ],
        "skills": [
          "HTML",
          "CSS",
          "JavaScript"
        ],
        "learningObjectives": [
          "Structure documents with semantic HTML for accessibility.",
          "Style complex layouts using CSS Flexbox and Grid.",
          "Manipulate the DOM dynamically using Vanilla JavaScript."
        ],
        "topics": [
          "Semantic HTML",
          "CSS Flexbox & Grid",
          "Responsive design (Media queries)",
          "DOM manipulation",
          "Browser events and bubbling"
        ],
        "practicalExercise": "Create a responsive, accessible to-do list application using only HTML, CSS, and Vanilla JavaScript, ensuring it works on both desktop and mobile screens.",
        "recommendedBookTitle": "MDN Web Docs: Learn Web Development",
        "recommendedBookAuthor": "Mozilla",
        "recommendedBookUrl": "https://developer.mozilla.org/en-US/docs/Learn",
        "recommendedBookDescription": "The most authoritative and up-to-date documentation on HTML, CSS, and Vanilla JavaScript.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "se-frontend",
        "videoTitle": "React Course - Beginner's Tutorial",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=bMknfKXIFA8",
        "videoDescription": "Complete guide to components, state, hooks, and modern React.",
        "videoDuration": "11:55:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Frontend Frameworks",
        "description": "Develop stateful, high-performance Single Page Applications (SPAs) using modern JavaScript frameworks.",
        "stage": "FRONTEND",
        "order": 4,
        "estimatedHours": 40,
        "prerequisites": [
          "se-web"
        ],
        "skills": [
          "React",
          "Next.js",
          "Vue.js"
        ],
        "learningObjectives": [
          "Manage component-level and application-level state.",
          "Implement client-side routing.",
          "Optimize rendering performance and component lifecycles."
        ],
        "topics": [
          "Component architecture",
          "State management (Redux, Context, Pinia)",
          "Component lifecycles/Hooks",
          "Client-side routing",
          "Virtual DOM concepts"
        ],
        "practicalExercise": "Build a weather application using React or Vue that fetches data from a public API, utilizes complex state management, and updates the UI components dynamically.",
        "recommendedBookTitle": "React Official Documentation",
        "recommendedBookAuthor": "Meta",
        "recommendedBookUrl": "https://react.dev/",
        "recommendedBookDescription": "The official guide to building fast, interactive UIs using React.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "se-backend",
        "videoTitle": "Node.js and Express.js - Full Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=Oe421EPjeBE",
        "videoDescription": "Node.js and Express.js comprehensive course.",
        "videoDuration": "8:16:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Backend Fundamentals",
        "description": "Architect and implement scalable server-side applications that handle business logic, file processing, and client requests.",
        "stage": "BACKEND",
        "order": 5,
        "estimatedHours": 40,
        "prerequisites": [
          "se-git"
        ],
        "skills": [
          "Node.js",
          "Express",
          "Python",
          "FastAPI"
        ],
        "learningObjectives": [
          "Initialize and configure a robust HTTP server.",
          "Implement middleware for logging, authentication, and error handling.",
          "Manage environment variables and configuration securely."
        ],
        "topics": [
          "Server frameworks (Express, FastAPI, Django)",
          "Middleware architecture",
          "Request/Response lifecycle",
          "Environment configuration",
          "Error handling and logging"
        ],
        "practicalExercise": "Set up a Node.js/Express or Python/FastAPI server with custom middleware that logs all incoming request headers and securely stores an API key in a .env file.",
        "recommendedBookTitle": "Node.js Design Patterns",
        "recommendedBookAuthor": "Mario Casciaro, Luciano Mammino",
        "recommendedBookUrl": "https://www.nodejsdesignpatterns.com/",
        "recommendedBookDescription": "Essential patterns for building scalable and maintainable backend applications in Node.js.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-api",
        "videoTitle": "REST API Concepts and Examples",
        "videoInstructor": "Web Concepts",
        "videoUrl": "https://www.youtube.com/watch?v=7YcW25PHnAA",
        "videoDescription": "Clear explanation of REST principles and HTTP methods.",
        "videoDuration": "20:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "RESTful APIs",
        "description": "Design predictable, secure, and standardized application programming interfaces for client-server communication.",
        "stage": "BACKEND",
        "order": 6,
        "estimatedHours": 25,
        "prerequisites": [
          "se-backend"
        ],
        "skills": [
          "REST APIs",
          "GraphQL"
        ],
        "learningObjectives": [
          "Design RESTful URL structures and use proper HTTP methods.",
          "Implement pagination, filtering, and sorting for collections.",
          "Compare REST architectural constraints with GraphQL."
        ],
        "topics": [
          "REST constraints",
          "HTTP Status Codes",
          "Pagination & Filtering",
          "Authentication (JWT, OAuth)",
          "API Documentation (Swagger/OpenAPI)"
        ],
        "practicalExercise": "Design and implement a REST API for a blog (CRUD operations for Posts and Comments), fully documented using Swagger or Postman.",
        "recommendedBookTitle": "Build APIs You Won't Hate",
        "recommendedBookAuthor": "Phil Sturgeon, Marc Jenkins",
        "recommendedBookUrl": "https://apisyouwonthate.com/books/build-apis-you-wont-hate/",
        "recommendedBookDescription": "Practical advice on designing predictable, standard-compliant RESTful APIs.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-db",
        "videoTitle": "Prisma ORM Crash Course",
        "videoInstructor": "Web Dev Simplified",
        "videoUrl": "https://www.youtube.com/watch?v=RebA5J-rlwg",
        "videoDescription": "Learn how to use Prisma for schema modeling and database queries.",
        "videoDuration": "45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Databases & ORMs",
        "description": "Integrate databases into backend applications securely using Object-Relational Mappers (ORMs) or query builders.",
        "stage": "BACKEND",
        "order": 7,
        "estimatedHours": 30,
        "prerequisites": [
          "se-api"
        ],
        "skills": [
          "SQL",
          "PostgreSQL",
          "Prisma",
          "MongoDB"
        ],
        "learningObjectives": [
          "Configure a database connection pool in a backend application.",
          "Execute CRUD operations using an ORM like Prisma, TypeORM, or SQLAlchemy.",
          "Write database migrations to track schema changes over time."
        ],
        "topics": [
          "Database connections & pooling",
          "ORMs vs Query Builders",
          "Database Migrations",
          "Handling relations (1:1, 1:N, M:N)",
          "N+1 query problem"
        ],
        "practicalExercise": "Set up a Prisma or SQLAlchemy project, define a User and Post model with a 1-to-Many relationship, generate a migration, and write a script to seed the database.",
        "recommendedBookTitle": "Designing Data-Intensive Applications",
        "recommendedBookAuthor": "Martin Kleppmann",
        "recommendedBookUrl": "https://dataintensive.net/",
        "recommendedBookDescription": "The definitive guide to understanding databases, ORMs, and how to build reliable, scalable data systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-unit",
        "videoTitle": "Jest Crash Course - Unit Testing in JavaScript",
        "videoInstructor": "Traversy Media",
        "videoUrl": "https://www.youtube.com/watch?v=7r4xVDI2vho",
        "videoDescription": "Quick and practical guide to writing unit tests using Jest.",
        "videoDuration": "55:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Unit Testing",
        "description": "Ensure code reliability by isolating and testing individual units of logic automatically.",
        "stage": "TESTING",
        "order": 8,
        "estimatedHours": 20,
        "prerequisites": [
          "se-frontend",
          "se-db"
        ],
        "skills": [
          "Testing",
          "Jest",
          "Mocha"
        ],
        "learningObjectives": [
          "Write unit tests utilizing assertions, setup, and teardown functions.",
          "Isolate units by mocking external dependencies and modules.",
          "Measure and analyze test coverage metrics."
        ],
        "topics": [
          "Test runners (Jest, PyTest)",
          "Assertions",
          "Mocking and Stubbing",
          "Test Driven Development (TDD)",
          "Code Coverage"
        ],
        "practicalExercise": "Take a complex utility function (e.g., a custom date formatter), write a comprehensive suite of unit tests for all edge cases using Jest or PyTest, and achieve 100% coverage.",
        "recommendedBookTitle": "Test-Driven Development: By Example",
        "recommendedBookAuthor": "Kent Beck",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/test-driven-development-by-example/P200000009546/9780321146533",
        "recommendedBookDescription": "The seminal book on writing automated tests and the TDD methodology.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-e2e",
        "videoTitle": "Cypress E2E Testing Full Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=u8vMu7viCm8",
        "videoDescription": "Comprehensive introduction to end-to-end testing with Cypress.",
        "videoDuration": "3:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Integration & E2E Testing",
        "description": "Validate system integrity by testing interconnected components and simulating real user interactions in a browser.",
        "stage": "TESTING",
        "order": 9,
        "estimatedHours": 20,
        "prerequisites": [
          "se-unit"
        ],
        "skills": [
          "Cypress",
          "Playwright",
          "Integration Testing"
        ],
        "learningObjectives": [
          "Configure an E2E testing framework like Cypress or Playwright.",
          "Simulate user actions (clicks, typing, navigation) programmatically.",
          "Intercept and stub network requests to test frontend behavior predictably."
        ],
        "topics": [
          "Integration testing principles",
          "E2E frameworks (Cypress, Playwright)",
          "DOM selection for testing",
          "Network stubbing",
          "Visual regression testing"
        ],
        "practicalExercise": "Write a Playwright or Cypress test suite that navigates to a login page, enters credentials, submits the form, and asserts that the user is redirected to the dashboard.",
        "recommendedBookTitle": "Cypress Official Documentation",
        "recommendedBookAuthor": "Cypress",
        "recommendedBookUrl": "https://docs.cypress.io/",
        "recommendedBookDescription": "The official docs for setting up and writing robust end-to-end and integration tests.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "se-clean",
        "videoTitle": "Clean Code - Uncle Bob",
        "videoInstructor": "Robert C. Martin",
        "videoUrl": "https://www.youtube.com/watch?v=7EmboKQH8lM",
        "videoDescription": "A classic talk on writing readable and maintainable software.",
        "videoDuration": "1:25:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Clean Code & Refactoring",
        "description": "Apply software engineering principles to write readable, maintainable, and self-documenting code.",
        "stage": "DESIGN",
        "order": 10,
        "estimatedHours": 20,
        "prerequisites": [
          "se-e2e"
        ],
        "skills": [
          "Clean Code",
          "Refactoring"
        ],
        "learningObjectives": [
          "Apply SOLID principles to decouple software modules.",
          "Identify and refactor code smells (e.g., long methods, primitive obsession).",
          "Implement meaningful naming conventions and project structures."
        ],
        "topics": [
          "SOLID Principles",
          "DRY and KISS",
          "Code Smells",
          "Refactoring techniques",
          "Meaningful naming"
        ],
        "practicalExercise": "Take a deeply nested, poorly named 100-line \"spaghetti\" function and iteratively refactor it into smaller, single-responsibility functions with clear names.",
        "recommendedBookTitle": "Clean Code: A Handbook of Agile Software Craftsmanship",
        "recommendedBookAuthor": "Robert C. Martin",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/clean-code-a-handbook-of-agile-software-craftsmanship/P200000009406/9780132350884",
        "recommendedBookDescription": "The industry standard guide to writing readable, maintainable, and refactored code.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-patterns",
        "videoTitle": "Design Patterns in Object Oriented Programming",
        "videoInstructor": "Christopher Okhravi",
        "videoUrl": "https://www.youtube.com/watch?v=v9ejT8FO-7I",
        "videoDescription": "A well-explained series covering the most common design patterns.",
        "videoDuration": "4:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Design Patterns",
        "description": "Utilize proven architectural solutions to solve recurring software design problems efficiently.",
        "stage": "DESIGN",
        "order": 11,
        "estimatedHours": 30,
        "prerequisites": [
          "se-clean"
        ],
        "skills": [
          "Design Patterns",
          "Software Architecture"
        ],
        "learningObjectives": [
          "Implement creational patterns like Singleton and Factory.",
          "Apply structural patterns like Adapter and Decorator.",
          "Utilize behavioral patterns like Strategy and Observer."
        ],
        "topics": [
          "Creational Patterns",
          "Structural Patterns",
          "Behavioral Patterns",
          "Dependency Injection",
          "Event-driven architecture"
        ],
        "practicalExercise": "Implement the Observer pattern to create a simple event bus system where multiple components can subscribe to and react to user notification events.",
        "recommendedBookTitle": "Design Patterns: Elements of Reusable Object-Oriented Software",
        "recommendedBookAuthor": "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/design-patterns-elements-of-reusable-object-oriented-software/P200000009526/9780201633610",
        "recommendedBookDescription": "The classic \"Gang of Four\" book that cataloged the core software design patterns.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-arch",
        "videoTitle": "System Design Interview Prep",
        "videoInstructor": "Gaurav Sen",
        "videoUrl": "https://www.youtube.com/watch?v=xpDnVSmNFX0",
        "videoDescription": "Great playlist for understanding load balancing, caching, and scalability.",
        "videoDuration": "3:30:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "System Architecture",
        "description": "Design high-level system structures capable of handling scale, fault tolerance, and distributed operations.",
        "stage": "SYSTEM DESIGN",
        "order": 12,
        "estimatedHours": 35,
        "prerequisites": [
          "se-patterns"
        ],
        "skills": [
          "System Design",
          "Microservices",
          "Distributed Systems"
        ],
        "learningObjectives": [
          "Compare monolithic, microservices, and serverless architectures.",
          "Design systems with load balancing and caching layers.",
          "Understand the CAP theorem and distributed data trade-offs."
        ],
        "topics": [
          "Monoliths vs Microservices",
          "Load Balancing",
          "Caching (Redis, Memcached)",
          "Message Queues (RabbitMQ, Kafka)",
          "CAP Theorem"
        ],
        "practicalExercise": "Draw a system architecture diagram for a scalable URL shortener, including load balancers, application servers, a Redis cache, and a primary/replica database setup.",
        "recommendedBookTitle": "System Design Interview – An Insider's Guide",
        "recommendedBookAuthor": "Alex Xu",
        "recommendedBookUrl": "https://bytebytego.com/",
        "recommendedBookDescription": "Highly visual and practical explanations of large-scale system architectures and trade-offs.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-cicd",
        "videoTitle": "GitHub Actions Tutorial",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=R8_veQiYBjI",
        "videoDescription": "Step-by-step setup of an automated CI/CD workflow.",
        "videoDuration": "45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "CI/CD",
        "description": "Automate the testing, integration, and delivery pipelines to release software rapidly and reliably.",
        "stage": "DEVOPS",
        "order": 13,
        "estimatedHours": 25,
        "prerequisites": [
          "se-arch"
        ],
        "skills": [
          "CI/CD",
          "GitHub Actions",
          "Jenkins"
        ],
        "learningObjectives": [
          "Configure a continuous integration pipeline to run tests automatically.",
          "Automate build processes and artifact generation.",
          "Deploy code to staging or production environments upon passing pipelines."
        ],
        "topics": [
          "Continuous Integration",
          "Continuous Deployment/Delivery",
          "Pipeline YAML syntax",
          "Build artifacts",
          "Deployment strategies (Blue/Green, Canary)"
        ],
        "practicalExercise": "Create a GitHub Actions workflow that installs dependencies, runs a linter, executes unit tests, and builds the project whenever code is pushed to the main branch.",
        "recommendedBookTitle": "Continuous Delivery",
        "recommendedBookAuthor": "Jez Humble, David Farley",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/continuous-delivery-reliable-software-releases-through-build-test-and-deployment-automation/P200000009462/9780321601919",
        "recommendedBookDescription": "The foundational text on automating the software delivery pipeline and CI/CD principles.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-docker",
        "videoTitle": "Docker Crash Course for Absolute Beginners",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=3c-iZaI7xLE",
        "videoDescription": "Learn Docker basics, containers, and Dockerfiles.",
        "videoDuration": "1:25:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Containerization",
        "description": "Isolate applications and their dependencies into reproducible, portable containers.",
        "stage": "DEVOPS",
        "order": 14,
        "estimatedHours": 20,
        "prerequisites": [
          "se-cicd"
        ],
        "skills": [
          "Docker",
          "Containers"
        ],
        "learningObjectives": [
          "Write a Dockerfile to containerize a web application.",
          "Manage image layers to minimize build times and sizes.",
          "Orchestrate multi-container environments using Docker Compose."
        ],
        "topics": [
          "Dockerfiles and Images",
          "Container execution",
          "Docker Volumes and Networking",
          "Docker Compose",
          "Image optimization"
        ],
        "practicalExercise": "Write a Dockerfile for a Node.js or Python backend, and create a docker-compose.yml file that launches both the backend container and a PostgreSQL database container connected via a Docker network.",
        "recommendedBookTitle": "Docker Deep Dive",
        "recommendedBookAuthor": "Nigel Poulton",
        "recommendedBookUrl": "https://nigelpoulton.com/docker-deep-dive/",
        "recommendedBookDescription": "A highly acclaimed, up-to-date resource for mastering containers and Docker.",
        "resourceType": "BOOK"
      },
      {
        "key": "se-deploy",
        "videoTitle": "Deploying Web Apps on AWS",
        "videoInstructor": "Be A Better Dev",
        "videoUrl": "https://www.youtube.com/watch?v=3hLmDS179YE",
        "videoDescription": "Practical guide to setting up infrastructure and hosting projects.",
        "videoDuration": "25:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Deployment & Hosting",
        "description": "Provision hosting infrastructure and deploy applications to modern cloud environments.",
        "stage": "DEVOPS",
        "order": 15,
        "estimatedHours": 20,
        "prerequisites": [
          "se-docker"
        ],
        "skills": [
          "AWS",
          "Vercel",
          "Heroku"
        ],
        "learningObjectives": [
          "Configure domain names, DNS records, and SSL certificates.",
          "Deploy a frontend app to a CDN-backed service (e.g., Vercel, Netlify).",
          "Deploy a containerized backend to a cloud provider (e.g., AWS, Heroku, Render)."
        ],
        "topics": [
          "Cloud Providers (AWS, GCP, Azure)",
          "PaaS vs IaaS",
          "DNS Configuration",
          "SSL/TLS provisioning",
          "Monitoring and Logging in Production"
        ],
        "practicalExercise": "Deploy a full-stack application by hosting the frontend on Vercel/Netlify, hosting the backend API on Render/Heroku, and securely passing production database credentials via environment variables.",
        "recommendedBookTitle": "AWS Well-Architected Framework",
        "recommendedBookAuthor": "Amazon Web Services",
        "recommendedBookUrl": "https://aws.amazon.com/architecture/well-architected/",
        "recommendedBookDescription": "Official best practices for deploying, hosting, and securing applications in the cloud.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      }
    ]
  },
  {
    "title": "Cybersecurity",
    "slug": "cybersecurity",
    "description": "Learn how to secure networks, applications, and systems against digital threats.",
    "category": "Security",
    "difficulty": "Advanced",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "cy-fund",
        "videoTitle": "Cyber Security Full Course for Beginner",
        "videoInstructor": "My CS",
        "videoUrl": "https://www.youtube.com/watch?v=U_P23SqJaDc",
        "videoDescription": "Covers threat modeling, CIA triad, and risk assessment basics.",
        "videoDuration": "4:15:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Security Fundamentals",
        "description": "Understand the core tenets of information security, threat modeling, and risk assessment.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 25,
        "prerequisites": [],
        "skills": [
          "Cybersecurity",
          "Risk Management"
        ],
        "learningObjectives": [
          "Explain the CIA Triad (Confidentiality, Integrity, Availability).",
          "Identify common attack vectors and threat actors.",
          "Perform a basic risk assessment for a small business."
        ],
        "topics": [
          "CIA Triad",
          "Risk Management",
          "Threat Modeling",
          "Compliance frameworks (NIST, ISO)",
          "Social Engineering"
        ],
        "practicalExercise": "Write a threat model using the STRIDE methodology for a theoretical mobile banking application.",
        "recommendedBookTitle": "The Web Application Hacker's Handbook",
        "recommendedBookAuthor": "Dafydd Stuttard, Marcus Pinto",
        "recommendedBookUrl": "https://portswigger.net/web-security/web-application-hackers-handbook",
        "recommendedBookDescription": "A fundamental guide to understanding web vulnerabilities and the core tenets of security.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-os",
        "videoTitle": "Linux Essentials for Ethical Hackers",
        "videoInstructor": "HackerSploit",
        "videoUrl": "https://www.youtube.com/watch?v=sSbt2nZ2R4c",
        "videoDescription": "Linux server security and essentials for ethical hacking.",
        "videoDuration": "3:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "OS Security",
        "description": "Harden operating systems against exploitation by managing permissions, services, and system configurations.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 30,
        "prerequisites": [
          "cy-fund"
        ],
        "skills": [
          "Linux",
          "Windows Security",
          "OS Security"
        ],
        "learningObjectives": [
          "Configure file permissions and access control lists (ACLs) in Linux.",
          "Manage Windows Registry, group policies, and active directory basics.",
          "Implement endpoint protection and logging."
        ],
        "topics": [
          "Linux permissions (chmod, chown)",
          "Windows Active Directory",
          "Group Policy Objects (GPO)",
          "Endpoint Security",
          "System Hardening"
        ],
        "practicalExercise": "Set up a Linux virtual machine and run a hardening script, manually adjusting permissions on sensitive directories and disabling unnecessary background services.",
        "recommendedBookTitle": "Linux Basics for Hackers",
        "recommendedBookAuthor": "OccupyTheWeb",
        "recommendedBookUrl": "https://nostarch.com/linuxbasicsforhackers",
        "recommendedBookDescription": "Teaches essential Linux administration and security hardening techniques.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-net",
        "videoTitle": "Wireshark Tutorial for Beginners",
        "videoInstructor": "David Bombal",
        "videoUrl": "https://www.youtube.com/watch?v=lb1Dw0elw0Q",
        "videoDescription": "Learn how to capture and analyze network packets for security.",
        "videoDuration": "40:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Networking Basics",
        "description": "Analyze network traffic and understand the vulnerabilities inherent in common network protocols.",
        "stage": "FOUNDATIONS",
        "order": 3,
        "estimatedHours": 35,
        "prerequisites": [
          "cy-os"
        ],
        "skills": [
          "Networking",
          "TCP/IP",
          "Wireshark"
        ],
        "learningObjectives": [
          "Analyze packets using Wireshark to identify plaintext credentials.",
          "Explain the mechanisms of ARP spoofing and DNS poisoning.",
          "Secure wireless networks against common attacks."
        ],
        "topics": [
          "TCP/IP vulnerabilities",
          "Packet analysis (Wireshark)",
          "ARP spoofing",
          "DNS poisoning",
          "Wireless security (WPA3)"
        ],
        "practicalExercise": "Download a sample PCAP file containing malicious traffic, use Wireshark to isolate the attacker's IP, and extract the unencrypted FTP credentials.",
        "recommendedBookTitle": "Practical Packet Analysis",
        "recommendedBookAuthor": "Chris Sanders",
        "recommendedBookUrl": "https://nostarch.com/packetanalysis3",
        "recommendedBookDescription": "The best resource for learning how to use Wireshark to analyze network traffic and spot anomalies.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-crypto",
        "videoTitle": "Prime Numbers & RSA Encryption Algorithm",
        "videoInstructor": "Computerphile",
        "videoUrl": "https://www.youtube.com/watch?v=O4xNbxGWKbg",
        "videoDescription": "Introduction to Cryptography and RSA.",
        "videoDuration": "0:15:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Cryptography",
        "description": "Apply cryptographic principles to protect data at rest and in transit.",
        "stage": "CORE SECURITY",
        "order": 4,
        "estimatedHours": 30,
        "prerequisites": [
          "cy-net"
        ],
        "skills": [
          "Cryptography",
          "Encryption",
          "PKI"
        ],
        "learningObjectives": [
          "Differentiate between symmetric and asymmetric encryption.",
          "Implement secure password hashing using algorithms like bcrypt or Argon2.",
          "Explain how Public Key Infrastructure (PKI) and SSL/TLS work."
        ],
        "topics": [
          "Symmetric vs Asymmetric Encryption",
          "Hashing and Salt",
          "Digital Signatures",
          "Public Key Infrastructure (PKI)",
          "SSL/TLS Handshake"
        ],
        "practicalExercise": "Write a script that hashes a password using bcrypt, verifies a login attempt, and creates an asymmetric RSA key pair to encrypt a secret message.",
        "recommendedBookTitle": "Serious Cryptography",
        "recommendedBookAuthor": "Jean-Philippe Aumasson",
        "recommendedBookUrl": "https://nostarch.com/seriouscrypto",
        "recommendedBookDescription": "A modern, practical guide to encryption, hashing, and public key infrastructure.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-iam",
        "videoTitle": "OAuth 2.0 and OpenID Connect",
        "videoInstructor": "Okta",
        "videoUrl": "https://www.youtube.com/watch?v=996OiexHze0",
        "videoDescription": "A brilliant, easy-to-understand explanation of modern authentication flows.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Identity & Access Management",
        "description": "Design and enforce strong authentication and authorization controls to restrict unauthorized access.",
        "stage": "CORE SECURITY",
        "order": 5,
        "estimatedHours": 25,
        "prerequisites": [
          "cy-crypto"
        ],
        "skills": [
          "IAM",
          "Authentication",
          "OAuth"
        ],
        "learningObjectives": [
          "Implement Multi-Factor Authentication (MFA).",
          "Configure Role-Based Access Control (RBAC).",
          "Understand OAuth2.0 and OpenID Connect flows."
        ],
        "topics": [
          "Authentication vs Authorization",
          "Multi-Factor Authentication (MFA)",
          "Role-Based Access Control (RBAC)",
          "OAuth2.0 & OIDC",
          "Single Sign-On (SSO)"
        ],
        "practicalExercise": "Configure an OAuth2.0 flow using a provider like Auth0 or Okta in a sample application, ensuring tokens are securely stored.",
        "recommendedBookTitle": "OAuth 2 in Action",
        "recommendedBookAuthor": "Justin Richer, Antonio Sanso",
        "recommendedBookUrl": "https://www.manning.com/books/oauth-2-in-action",
        "recommendedBookDescription": "A deep dive into modern authorization flows, OAuth2, and OIDC.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-netsec",
        "videoTitle": "Firewalls and Network Security",
        "videoInstructor": "PowerCert Animated Videos",
        "videoUrl": "https://www.youtube.com/watch?v=kDEX1HXybrU",
        "videoDescription": "Visual breakdown of firewalls, IDS, IPS, and network segmentation.",
        "videoDuration": "12:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Network Security",
        "description": "Deploy infrastructure-level defenses to block malicious traffic and detect intrusions.",
        "stage": "INFRASTRUCTURE",
        "order": 6,
        "estimatedHours": 35,
        "prerequisites": [
          "cy-iam"
        ],
        "skills": [
          "Network Security",
          "Firewalls",
          "IDS/IPS"
        ],
        "learningObjectives": [
          "Configure stateful firewall rules.",
          "Differentiate between Intrusion Detection (IDS) and Prevention (IPS) Systems.",
          "Set up a Virtual Private Network (VPN) securely."
        ],
        "topics": [
          "Firewalls (Stateful, WAF)",
          "IDS/IPS (Snort, Suricata)",
          "VPN Protocols (IPSec, WireGuard)",
          "Network Segmentation",
          "Zero Trust Architecture"
        ],
        "practicalExercise": "Configure iptables or UFW on a Linux server to block all incoming traffic except for SSH (restricted to a specific IP) and HTTPS.",
        "recommendedBookTitle": "Network Security Assessment",
        "recommendedBookAuthor": "Chris McNab",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/network-security-assessment/9781491911044/",
        "recommendedBookDescription": "Comprehensive strategies for defending networks, configuring firewalls, and deploying IDSs.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-cloudsec",
        "videoTitle": "AWS Security Best Practices",
        "videoInstructor": "AWS Events",
        "videoUrl": "https://www.youtube.com/watch?v=TjD4_4H0iUI",
        "videoDescription": "Official AWS session on security best practices.",
        "videoDuration": "0:45:00",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Cloud Security",
        "description": "Secure virtualized resources and IAM policies within major public cloud providers.",
        "stage": "INFRASTRUCTURE",
        "order": 7,
        "estimatedHours": 35,
        "prerequisites": [
          "cy-netsec"
        ],
        "skills": [
          "Cloud Security",
          "AWS Security",
          "Azure Security"
        ],
        "learningObjectives": [
          "Audit an AWS S3 bucket or Azure Blob for public exposure.",
          "Implement principle of least privilege for cloud IAM roles.",
          "Understand cloud shared responsibility models."
        ],
        "topics": [
          "Cloud Shared Responsibility Model",
          "Cloud IAM Policies",
          "Data at rest/transit encryption in Cloud",
          "Misconfiguration scanning",
          "Serverless security"
        ],
        "practicalExercise": "Use a tool like ScoutSuite to run a security audit against a sandbox AWS or GCP account and remediate an overly permissive IAM policy.",
        "recommendedBookTitle": "AWS Security Documentation",
        "recommendedBookAuthor": "Amazon Web Services",
        "recommendedBookUrl": "https://docs.aws.amazon.com/security/",
        "recommendedBookDescription": "Official guides on the shared responsibility model, IAM policies, and cloud hardening.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "cy-appsec",
        "videoTitle": "OWASP Top 10 Vulnerabilities Explained",
        "videoInstructor": "F5 DevCentral",
        "videoUrl": "https://www.youtube.com/watch?v=r0wP_R5d-p0",
        "videoDescription": "Explanation of the OWASP Top 10 security risks.",
        "videoDuration": "0:20:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Web Application Security",
        "description": "Identify, exploit, and patch common vulnerabilities in web applications.",
        "stage": "APPSEC",
        "order": 8,
        "estimatedHours": 45,
        "prerequisites": [
          "cy-netsec"
        ],
        "skills": [
          "Application Security",
          "OWASP",
          "Web Security"
        ],
        "learningObjectives": [
          "Identify and mitigate Cross-Site Scripting (XSS) vulnerabilities.",
          "Execute and patch SQL Injection (SQLi) flaws.",
          "Implement defenses against Cross-Site Request Forgery (CSRF)."
        ],
        "topics": [
          "OWASP Top 10",
          "Cross-Site Scripting (XSS)",
          "SQL Injection (SQLi)",
          "Cross-Site Request Forgery (CSRF)",
          "Insecure Direct Object References (IDOR)"
        ],
        "practicalExercise": "Spin up OWASP Juice Shop, successfully execute a SQL injection attack to bypass the login screen, and review the code fix required to prevent it.",
        "recommendedBookTitle": "OWASP Top Ten",
        "recommendedBookAuthor": "OWASP Foundation",
        "recommendedBookUrl": "https://owasp.org/www-project-top-ten/",
        "recommendedBookDescription": "The industry-standard awareness document for web application security vulnerabilities and mitigations.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "cy-sast",
        "videoTitle": "Introduction to Static Analysis",
        "videoInstructor": "Gary McGraw",
        "videoUrl": "https://www.youtube.com/watch?v=1F2lW5V95cE",
        "videoDescription": "Secure coding and SAST concepts.",
        "videoDuration": "0:50:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Secure Coding & SAST",
        "description": "Integrate automated security testing tools into the development pipeline to catch vulnerabilities early.",
        "stage": "APPSEC",
        "order": 9,
        "estimatedHours": 30,
        "prerequisites": [
          "cy-appsec"
        ],
        "skills": [
          "Secure Coding",
          "SAST",
          "DAST"
        ],
        "learningObjectives": [
          "Run Static Application Security Testing (SAST) tools against a codebase.",
          "Interpret vulnerability reports and eliminate false positives.",
          "Enforce secure coding guidelines."
        ],
        "topics": [
          "Static Application Security Testing (SAST)",
          "Dynamic Application Security Testing (DAST)",
          "Software Composition Analysis (SCA)",
          "DevSecOps pipelines",
          "Secure coding standards"
        ],
        "practicalExercise": "Add a SAST scanner (like SonarQube or Semgrep) to a CI/CD pipeline, commit intentionally vulnerable code, and observe the pipeline fail with the security report.",
        "recommendedBookTitle": "Secure by Design",
        "recommendedBookAuthor": "Dan Bergh Johnsson, Daniel Deogun, Daniel Sawano",
        "recommendedBookUrl": "https://www.manning.com/books/secure-by-design",
        "recommendedBookDescription": "Focuses on writing secure code and integrating security testing (SAST/DAST) into development.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-pt",
        "videoTitle": "Ethical Hacking Full Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        "videoDescription": "Extensive course covering enumeration, exploitation, and Metasploit.",
        "videoDuration": "14:50:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Penetration Testing",
        "description": "Simulate adversary attacks using offensive tools and methodologies to assess system security posture.",
        "stage": "OFFENSIVE",
        "order": 10,
        "estimatedHours": 55,
        "prerequisites": [
          "cy-appsec"
        ],
        "skills": [
          "Penetration Testing",
          "Ethical Hacking",
          "Metasploit"
        ],
        "learningObjectives": [
          "Conduct network reconnaissance using Nmap.",
          "Exploit known vulnerabilities using Metasploit.",
          "Write a professional penetration testing report."
        ],
        "topics": [
          "Reconnaissance and Enumeration",
          "Vulnerability Scanning (Nessus/OpenVAS)",
          "Exploitation Frameworks (Metasploit)",
          "Privilege Escalation",
          "Reporting and Documentation"
        ],
        "practicalExercise": "Target a vulnerable virtual machine (like Metasploitable), perform an Nmap scan to find open ports, and use Metasploit to gain a reverse shell.",
        "recommendedBookTitle": "Penetration Testing: A Hands-On Introduction to Hacking",
        "recommendedBookAuthor": "Georgia Weidman",
        "recommendedBookUrl": "https://nostarch.com/pentesting",
        "recommendedBookDescription": "An excellent practical guide to offensive security, enumeration, and exploitation using tools like Metasploit.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-malware",
        "videoTitle": "Malware Analysis Fundamentals",
        "videoInstructor": "SANS Institute",
        "videoUrl": "https://www.youtube.com/watch?v=C1L2L_sE1W4",
        "videoDescription": "Fundamentals of analyzing malware.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Malware Analysis",
        "description": "Analyze malicious software behavior safely using sandboxing and reverse engineering techniques.",
        "stage": "OFFENSIVE",
        "order": 11,
        "estimatedHours": 40,
        "prerequisites": [
          "cy-pt"
        ],
        "skills": [
          "Malware Analysis",
          "Reverse Engineering"
        ],
        "learningObjectives": [
          "Set up an isolated malware analysis sandbox.",
          "Perform static analysis to extract strings and metadata from an executable.",
          "Perform dynamic analysis to monitor file system and registry changes."
        ],
        "topics": [
          "Sandboxing",
          "Static Analysis (Ghidra, IDA)",
          "Dynamic Analysis (Process Hacker, Wireshark)",
          "Obfuscation and Packing",
          "Indicators of Compromise (IoCs)"
        ],
        "practicalExercise": "Safely execute a harmless sample (e.g., EICAR or a custom script) in an isolated sandbox and use Process Monitor to track its behavior.",
        "recommendedBookTitle": "Practical Malware Analysis",
        "recommendedBookAuthor": "Michael Sikorski, Andrew Honig",
        "recommendedBookUrl": "https://nostarch.com/malware",
        "recommendedBookDescription": "The definitive textbook for safely analyzing malware through static and dynamic techniques.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-soc",
        "videoTitle": "SOC Level 1 Security Analyst Intro",
        "videoInstructor": "John Hammond",
        "videoUrl": "https://www.youtube.com/watch?v=8VzXqQxQ7vM",
        "videoDescription": "A look into the role of a SOC Analyst.",
        "videoDuration": "0:30:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "SOC Operations",
        "description": "Operate within a Security Operations Center, monitoring alerts and correlating logs to detect active threats.",
        "stage": "DEFENSIVE",
        "order": 12,
        "estimatedHours": 35,
        "prerequisites": [
          "cy-netsec"
        ],
        "skills": [
          "SIEM",
          "SOC",
          "Splunk"
        ],
        "learningObjectives": [
          "Ingest and query logs using a SIEM like Splunk or ELK.",
          "Correlate disparate log events to identify an attack chain.",
          "Triage security alerts and filter false positives."
        ],
        "topics": [
          "Security Information and Event Management (SIEM)",
          "Log Aggregation",
          "Threat Hunting",
          "Alert Triage",
          "SOC Metrics"
        ],
        "practicalExercise": "Import a dataset of web server logs into an ELK stack or Splunk instance and write queries to identify a brute-force SSH attack based on failed logins.",
        "recommendedBookTitle": "Blue Team Field Manual (BTFM)",
        "recommendedBookAuthor": "Alan J White, Ben Clark",
        "recommendedBookUrl": "https://www.amazon.com/Blue-Team-Field-Manual-BTFM/dp/1500734628",
        "recommendedBookDescription": "A quick reference guide for defenders working in a Security Operations Center, handling alerts and SIEMs.",
        "resourceType": "BOOK"
      },
      {
        "key": "cy-ir",
        "videoTitle": "Incident Response and Digital Forensics",
        "videoInstructor": "SANS Institute",
        "videoUrl": "https://www.youtube.com/watch?v=D6D7f40T1j4",
        "videoDescription": "DFIR concepts and walkthroughs.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE",
        "title": "Incident Response",
        "description": "Coordinate the identification, containment, eradication, and recovery from a cyber security breach.",
        "stage": "DEFENSIVE",
        "order": 13,
        "estimatedHours": 35,
        "prerequisites": [
          "cy-soc"
        ],
        "skills": [
          "Incident Response",
          "Digital Forensics"
        ],
        "learningObjectives": [
          "Execute the phases of the Incident Response lifecycle.",
          "Acquire forensic disk and memory images without modifying evidence.",
          "Analyze memory dumps for malicious processes."
        ],
        "topics": [
          "Incident Response Lifecycle (NIST)",
          "Digital Forensics",
          "Memory Analysis (Volatility)",
          "Chain of Custody",
          "Post-Incident Review"
        ],
        "practicalExercise": "Use Volatility to analyze a provided memory dump, extract the command history, and identify the exact command an attacker used to deploy a payload.",
        "recommendedBookTitle": "Incident Response & Computer Forensics",
        "recommendedBookAuthor": "Jason T. Luttgens, Matthew Pepe, Kevin Mandia",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/incident-response-computer-forensics-third-edition-luttgens-pepe/9780071798686.html",
        "recommendedBookDescription": "A foundational text covering the entire incident response lifecycle and digital forensics techniques.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "AI & Machine Learning",
    "slug": "ai-machine-learning",
    "description": "Master data processing, modeling, and deep learning algorithms.",
    "category": "Data",
    "difficulty": "Advanced",
    "estimatedHours": 500,
    "nodes": [
      {
        "key": "ai-py",
        "videoTitle": "Python for Data Science - Course for Beginners",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
        "videoDescription": "A comprehensive Python tutorial specifically focused on data science and machine learning libraries.",
        "videoDuration": "12:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Python for Data Science",
        "description": "Master data manipulation and numerical operations using industry-standard Python libraries for data science.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "Python",
          "Pandas",
          "NumPy"
        ],
        "learningObjectives": [
          "Perform vectorized operations with NumPy",
          "Manipulate tabular data using Pandas",
          "Clean and prepare datasets for modeling"
        ],
        "topics": [
          "NumPy Arrays",
          "Pandas DataFrames",
          "Vectorization",
          "Data Cleaning"
        ],
        "practicalExercise": "Load a raw CSV dataset, handle missing values, and calculate summary statistics using Pandas.",
        "recommendedBookTitle": "Python for Data Analysis",
        "recommendedBookAuthor": "Wes McKinney",
        "recommendedBookUrl": "https://wesmckinney.com/book/",
        "recommendedBookDescription": "Written by the creator of pandas, this is the ultimate guide to data manipulation in Python.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-math",
        "videoTitle": "Mathematics for Machine Learning - Linear Algebra",
        "videoInstructor": "Imperial College London",
        "videoUrl": "https://www.coursera.org/learn/linear-algebra-machine-learning",
        "videoDescription": "Builds a strong mathematical foundation in linear algebra crucial for understanding machine learning algorithms.",
        "videoDuration": "18:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Math for ML",
        "description": "Develop a solid foundation in the mathematical concepts essential for understanding and building machine learning algorithms.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 45,
        "prerequisites": [
          "ai-py"
        ],
        "skills": [
          "Linear Algebra",
          "Calculus",
          "Probability",
          "Statistics"
        ],
        "learningObjectives": [
          "Understand linear transformations and matrices",
          "Apply calculus concepts for optimization",
          "Grasp probability distributions and statistical significance"
        ],
        "topics": [
          "Linear Algebra",
          "Calculus for ML",
          "Probability Distributions",
          "Hypothesis Testing"
        ],
        "practicalExercise": "Implement matrix multiplication and gradient descent from scratch using base Python.",
        "recommendedBookTitle": "Mathematics for Machine Learning",
        "recommendedBookAuthor": "Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong",
        "recommendedBookUrl": "https://mml-book.github.io/",
        "recommendedBookDescription": "A rigorous but accessible text that bridges the gap between mathematical foundations and machine learning algorithms.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-data",
        "videoTitle": "Data Visualization in Python with Matplotlib and Seaborn",
        "videoInstructor": "Corey Schafer",
        "videoUrl": "https://www.youtube.com/watch?v=UO98lJQ3QGI",
        "videoDescription": "An excellent tutorial series teaching data visualization techniques using Python's leading plotting libraries.",
        "videoDuration": "5:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Data Visualization",
        "description": "Create compelling visualizations and interpret complex datasets to uncover hidden trends and communicate findings.",
        "stage": "FOUNDATIONS",
        "order": 3,
        "estimatedHours": 25,
        "prerequisites": [
          "ai-math"
        ],
        "skills": [
          "Data Visualization",
          "Matplotlib",
          "Seaborn"
        ],
        "learningObjectives": [
          "Create static, animated, and interactive visualizations",
          "Identify patterns and outliers in datasets",
          "Design effective charts for data storytelling"
        ],
        "topics": [
          "Matplotlib",
          "Seaborn",
          "Exploratory Data Analysis (EDA)",
          "Data Storytelling"
        ],
        "practicalExercise": "Perform exploratory data analysis on a real-world dataset and present findings through a series of well-annotated plots.",
        "recommendedBookTitle": "Fundamentals of Data Visualization",
        "recommendedBookAuthor": "Claus O. Wilke",
        "recommendedBookUrl": "https://clauswilke.com/dataviz/",
        "recommendedBookDescription": "An excellent guide to making visually appealing and informative data visualizations, avoiding common pitfalls.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-pre",
        "videoTitle": "Data Preprocessing in Machine Learning",
        "videoInstructor": "Krish Naik",
        "videoUrl": "https://www.youtube.com/watch?v=sKqQEVR_320",
        "videoDescription": "Preprocessing techniques for AI models.",
        "videoDuration": "0:45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Data Preprocessing",
        "description": "Transform raw, messy data into structured formats optimized for machine learning algorithms.",
        "stage": "MACHINE LEARNING",
        "order": 4,
        "estimatedHours": 25,
        "prerequisites": [
          "ai-data"
        ],
        "skills": [
          "Data Preprocessing",
          "Feature Engineering"
        ],
        "learningObjectives": [
          "Handle missing data appropriately",
          "Scale and normalize features",
          "Engineer new features to improve model performance"
        ],
        "topics": [
          "Imputation",
          "Feature Scaling",
          "Encoding Categorical Variables",
          "Feature Engineering"
        ],
        "practicalExercise": "Process a dataset containing mixed data types, scale numerical features, and encode categorical variables using Scikit-Learn.",
        "recommendedBookTitle": "Feature Engineering for Machine Learning",
        "recommendedBookAuthor": "Alice Zheng, Amanda Casari",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/",
        "recommendedBookDescription": "Provides deep insights into transforming raw data into effective features for ML models.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-sl",
        "videoTitle": "Supervised Machine Learning: Regression and Classification",
        "videoInstructor": "Andrew Ng",
        "videoUrl": "https://www.coursera.org/learn/machine-learning",
        "videoDescription": "The world's most famous machine learning course, covering regression, classification, and core supervised learning.",
        "videoDuration": "33:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Supervised Learning",
        "description": "Train models that learn from labeled data to predict outcomes and classify information accurately.",
        "stage": "MACHINE LEARNING",
        "order": 5,
        "estimatedHours": 45,
        "prerequisites": [
          "ai-pre"
        ],
        "skills": [
          "Machine Learning",
          "Scikit-learn",
          "Supervised Learning"
        ],
        "learningObjectives": [
          "Implement regression and classification algorithms",
          "Understand the bias-variance tradeoff",
          "Utilize ensemble methods to improve accuracy"
        ],
        "topics": [
          "Linear Regression",
          "Logistic Regression",
          "Decision Trees",
          "Random Forests",
          "Support Vector Machines"
        ],
        "practicalExercise": "Build and compare a logistic regression model and a random forest classifier to predict customer churn.",
        "recommendedBookTitle": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
        "recommendedBookAuthor": "Aurélien Géron",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/",
        "recommendedBookDescription": "An outstanding practical introduction to machine learning using Python's leading frameworks.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-ul",
        "videoTitle": "Unsupervised Learning, Recommenders, Reinforcement Learning",
        "videoInstructor": "Andrew Ng",
        "videoUrl": "https://www.coursera.org/learn/unsupervised-learning-recommenders-reinforcement-learning",
        "videoDescription": "Teaches clustering, dimensionality reduction, and advanced unsupervised learning algorithms.",
        "videoDuration": "27:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Unsupervised Learning",
        "description": "Discover hidden structures and patterns in unlabeled data using clustering and dimensionality reduction techniques.",
        "stage": "MACHINE LEARNING",
        "order": 6,
        "estimatedHours": 25,
        "prerequisites": [
          "ai-sl"
        ],
        "skills": [
          "Unsupervised Learning",
          "Clustering"
        ],
        "learningObjectives": [
          "Group similar data points using clustering algorithms",
          "Reduce dataset dimensionality while preserving variance",
          "Identify anomalies and outliers"
        ],
        "topics": [
          "K-Means Clustering",
          "Hierarchical Clustering",
          "Principal Component Analysis (PCA)",
          "Anomaly Detection"
        ],
        "practicalExercise": "Segment a customer base using K-Means clustering and visualize the clusters using PCA.",
        "recommendedBookTitle": "Pattern Recognition and Machine Learning",
        "recommendedBookAuthor": "Christopher M. Bishop",
        "recommendedBookUrl": "https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf",
        "recommendedBookDescription": "The definitive textbook on machine learning from a Bayesian perspective, essential for understanding unsupervised methods.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-eval",
        "videoTitle": "Model Evaluation and Selection - Machine Learning",
        "videoInstructor": "StatQuest with Josh Starmer",
        "videoUrl": "https://www.youtube.com/watch?v=Kdsp6soqA7o",
        "videoDescription": "A clear, visual breakdown of cross-validation, ROC curves, and how to rigorously evaluate ML models.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Model Evaluation",
        "description": "Rigorously assess model performance and optimize hyperparameters to ensure robust and generalizable machine learning solutions.",
        "stage": "MACHINE LEARNING",
        "order": 7,
        "estimatedHours": 25,
        "prerequisites": [
          "ai-ul"
        ],
        "skills": [
          "Model Evaluation",
          "Hyperparameter Tuning"
        ],
        "learningObjectives": [
          "Apply cross-validation techniques",
          "Calculate and interpret evaluation metrics",
          "Optimize models using grid and random search"
        ],
        "topics": [
          "Cross-Validation",
          "Precision, Recall, F1-Score",
          "ROC and AUC",
          "Hyperparameter Tuning"
        ],
        "practicalExercise": "Perform grid search cross-validation on a support vector classifier and analyze the resulting confusion matrix.",
        "recommendedBookTitle": "Evaluating Machine Learning Models",
        "recommendedBookAuthor": "Alice Zheng",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/evaluating-machine-learning/9781492048756/",
        "recommendedBookDescription": "A concise and practical guide to selecting the right metrics for evaluating ML model performance.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-dl",
        "videoTitle": "Deep Learning Specialization",
        "videoInstructor": "Andrew Ng",
        "videoUrl": "https://www.coursera.org/specializations/deep-learning",
        "videoDescription": "A comprehensive journey through neural networks, backpropagation, and building deep learning models.",
        "videoDuration": "80:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Deep Learning Basics",
        "description": "Build and train artificial neural networks to solve complex problems using deep learning frameworks.",
        "stage": "DEEP LEARNING",
        "order": 8,
        "estimatedHours": 45,
        "prerequisites": [
          "ai-eval"
        ],
        "skills": [
          "Deep Learning",
          "PyTorch",
          "TensorFlow",
          "Neural Networks"
        ],
        "learningObjectives": [
          "Understand the architecture of neural networks",
          "Implement forward and backward propagation",
          "Build models using PyTorch or TensorFlow"
        ],
        "topics": [
          "Artificial Neural Networks",
          "Backpropagation",
          "Activation Functions",
          "Optimization Algorithms",
          "PyTorch Basics"
        ],
        "practicalExercise": "Construct a multi-layer perceptron to classify handwritten digits using PyTorch.",
        "recommendedBookTitle": "Deep Learning",
        "recommendedBookAuthor": "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
        "recommendedBookUrl": "https://www.deeplearningbook.org/",
        "recommendedBookDescription": "The most comprehensive and authoritative textbook on deep learning available.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-cv",
        "videoTitle": "Convolutional Neural Networks (CNNs)",
        "videoInstructor": "Stanford University (CS231n)",
        "videoUrl": "https://www.youtube.com/watch?v=vT1JzLTH4G4",
        "videoDescription": "Stanford's premier course on computer vision, covering CNN architectures, object detection, and image processing.",
        "videoDuration": "20:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Computer Vision",
        "description": "Enable machines to interpret and analyze visual information from the world using computer vision techniques.",
        "stage": "SPECIALIZATION",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "ai-dl"
        ],
        "skills": [
          "Computer Vision",
          "CNNs",
          "OpenCV"
        ],
        "learningObjectives": [
          "Process and augment image data",
          "Build Convolutional Neural Networks (CNNs)",
          "Implement object detection models"
        ],
        "topics": [
          "Image Processing",
          "Convolutional Neural Networks",
          "Object Detection",
          "Transfer Learning",
          "OpenCV"
        ],
        "practicalExercise": "Fine-tune a pre-trained ResNet model to classify a custom dataset of images.",
        "recommendedBookTitle": "Computer Vision: Algorithms and Applications",
        "recommendedBookAuthor": "Richard Szeliski",
        "recommendedBookUrl": "https://szeliski.org/Book/",
        "recommendedBookDescription": "A comprehensive reference for both classic and modern computer vision techniques.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-nlp",
        "videoTitle": "Natural Language Processing with Deep Learning",
        "videoInstructor": "Stanford University (CS224N)",
        "videoUrl": "https://www.youtube.com/watch?v=rmVRLeJRkl4",
        "videoDescription": "Detailed lectures on NLP, word embeddings, RNNs, and the mathematical foundations of processing human language.",
        "videoDuration": "22:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Natural Language Processing",
        "description": "Process, analyze, and generate human language data using natural language processing algorithms.",
        "stage": "SPECIALIZATION",
        "order": 10,
        "estimatedHours": 45,
        "prerequisites": [
          "ai-dl"
        ],
        "skills": [
          "Natural Language Processing",
          "Transformers",
          "Hugging Face"
        ],
        "learningObjectives": [
          "Preprocess text data for modeling",
          "Implement Recurrent Neural Networks (RNNs)",
          "Understand the Transformer architecture"
        ],
        "topics": [
          "Text Preprocessing",
          "Word Embeddings",
          "RNNs and LSTMs",
          "Transformers",
          "Hugging Face Transformers"
        ],
        "practicalExercise": "Build a sentiment analysis model using a pre-trained Transformer model from Hugging Face.",
        "recommendedBookTitle": "Speech and Language Processing",
        "recommendedBookAuthor": "Dan Jurafsky, James H. Martin",
        "recommendedBookUrl": "https://web.stanford.edu/~jurafsky/slp3/",
        "recommendedBookDescription": "The standard textbook covering all aspects of natural language processing and computational linguistics.",
        "resourceType": "BOOK"
      },
      {
        "key": "ai-llm",
        "videoTitle": "Hugging Face Transformers Course",
        "videoInstructor": "Hugging Face",
        "videoUrl": "https://www.youtube.com/watch?v=00GKzGMK6O4",
        "videoDescription": "Official Hugging Face NLP course introduction.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Generative AI & LLMs",
        "description": "Leverage and fine-tune large language models to build advanced generative AI applications.",
        "stage": "SPECIALIZATION",
        "order": 11,
        "estimatedHours": 45,
        "prerequisites": [
          "ai-nlp"
        ],
        "skills": [
          "Generative AI",
          "LLMs",
          "Prompt Engineering",
          "RAG"
        ],
        "learningObjectives": [
          "Understand the architecture of large language models",
          "Implement Retrieval-Augmented Generation (RAG)",
          "Fine-tune LLMs for specific domains"
        ],
        "topics": [
          "Large Language Models",
          "Prompt Engineering",
          "Retrieval-Augmented Generation",
          "Parameter-Efficient Fine-Tuning (PEFT)"
        ],
        "practicalExercise": "Develop a specialized Q&A chatbot using LangChain, RAG, and an open-source LLM.",
        "recommendedBookTitle": "Hugging Face Course",
        "recommendedBookAuthor": "Hugging Face",
        "recommendedBookUrl": "https://huggingface.co/course/",
        "recommendedBookDescription": "The best hands-on course for working with large language models, transformers, and fine-tuning.",
        "resourceType": "COURSE_RESOURCE"
      },
      {
        "key": "ai-mlops",
        "videoTitle": "Machine Learning Engineering for Production (MLOps)",
        "videoInstructor": "DeepLearning.AI",
        "videoUrl": "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
        "videoDescription": "Covers the entire lifecycle of ML in production, from deploying models to monitoring concept drift.",
        "videoDuration": "60:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "MLOps",
        "description": "Bridge the gap between model development and production by implementing robust machine learning operations.",
        "stage": "PRODUCTION",
        "order": 12,
        "estimatedHours": 35,
        "prerequisites": [
          "ai-llm",
          "ai-cv"
        ],
        "skills": [
          "MLOps",
          "Model Deployment",
          "Docker",
          "MLflow"
        ],
        "learningObjectives": [
          "Package and containerize ML models",
          "Deploy models as scalable APIs",
          "Monitor model performance and handle concept drift"
        ],
        "topics": [
          "Model Containerization (Docker)",
          "Model Deployment",
          "MLflow",
          "Model Monitoring",
          "CI/CD for ML"
        ],
        "practicalExercise": "Containerize a Scikit-Learn model using Docker and deploy it as a REST API using FastAPI.",
        "recommendedBookTitle": "Designing Machine Learning Systems",
        "recommendedBookAuthor": "Chip Huyen",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
        "recommendedBookDescription": "A must-read for architecting reliable, scalable, and maintainable ML systems in production.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "Cloud Engineering",
    "slug": "cloud-engineering",
    "description": "Learn how to design, deploy, and manage scalable cloud infrastructure.",
    "category": "Infrastructure",
    "difficulty": "Intermediate",
    "estimatedHours": 400,
    "nodes": [
      {
        "key": "ce-linux",
        "videoTitle": "Linux for Cloud Engineers",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=v_1qaXN_x4I",
        "videoDescription": "Linux fundamentals for DevOps and Cloud Engineering.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Linux Basics",
        "description": "Master the Linux operating system, command-line tools, and shell scripting necessary for cloud infrastructure management.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 25,
        "prerequisites": [],
        "skills": [
          "Linux",
          "Bash",
          "Shell Scripting",
          "Command Line"
        ],
        "learningObjectives": [
          "Navigate and manage the Linux file system",
          "Configure file permissions and ownership",
          "Automate tasks using Bash scripting"
        ],
        "topics": [
          "Linux Command Line",
          "File Permissions",
          "Process Management",
          "Bash Scripting"
        ],
        "practicalExercise": "Write a bash script that monitors server disk usage, logs the data, and sends an alert if usage exceeds 80%.",
        "recommendedBookTitle": "The Linux Command Line",
        "recommendedBookAuthor": "William Shotts",
        "recommendedBookUrl": "https://linuxcommand.org/tlcl.php",
        "recommendedBookDescription": "An accessible yet thorough guide to mastering the Linux shell, a required skill for cloud engineers.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-net",
        "videoTitle": "Networking Fundamentals for Cloud Computing",
        "videoInstructor": "NetworkChuck",
        "videoUrl": "https://www.youtube.com/watch?v=qiQR5rTSshw",
        "videoDescription": "Explains IP addressing, subnetting, and networking models with a focus on cloud infrastructure.",
        "videoDuration": "3:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Networking Fundamentals",
        "description": "Understand the foundational networking concepts required to design and manage secure cloud environments.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 30,
        "prerequisites": [
          "ce-linux"
        ],
        "skills": [
          "Computer Networking",
          "TCP/IP",
          "DNS",
          "Subnetting"
        ],
        "learningObjectives": [
          "Design network subnets",
          "Understand TCP/IP and OSI models",
          "Configure DNS and routing"
        ],
        "topics": [
          "TCP/IP Model",
          "Subnetting and CIDR",
          "DNS Resolution",
          "Routing Basics"
        ],
        "practicalExercise": "Calculate and design a subnetting scheme for a corporate network, separating public and private IP ranges.",
        "recommendedBookTitle": "Computer Networking: A Top-Down Approach",
        "recommendedBookAuthor": "James Kurose, Keith Ross",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003333/9780136681557",
        "recommendedBookDescription": "The best introduction to networking fundamentals, using a top-down application-to-hardware approach.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-cloud",
        "videoTitle": "Cloud Computing Explained",
        "videoInstructor": "Simplilearn",
        "videoUrl": "https://www.youtube.com/watch?v=M988_fsOSWo",
        "videoDescription": "A high-level overview of cloud service models (IaaS, PaaS, SaaS) and deployment architectures.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Cloud Computing Concepts",
        "description": "Grasp the core principles, service models, and architectural patterns of modern cloud computing.",
        "stage": "CORE CLOUD",
        "order": 3,
        "estimatedHours": 20,
        "prerequisites": [
          "ce-net"
        ],
        "skills": [
          "Cloud Computing",
          "AWS",
          "Azure",
          "Google Cloud"
        ],
        "learningObjectives": [
          "Differentiate between IaaS, PaaS, and SaaS",
          "Understand cloud deployment models",
          "Evaluate major cloud service providers"
        ],
        "topics": [
          "Cloud Service Models",
          "Cloud Deployment Models",
          "High Availability",
          "Scalability Concepts"
        ],
        "practicalExercise": "Design a high-level architecture diagram comparing an on-premises web application to a cloud-native equivalent.",
        "recommendedBookTitle": "AWS Well-Architected Framework",
        "recommendedBookAuthor": "Amazon Web Services (AWS)",
        "recommendedBookUrl": "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
        "recommendedBookDescription": "Essential official documentation detailing best practices for designing and operating reliable cloud systems.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-comp",
        "videoTitle": "AWS EC2 Tutorial For Beginners",
        "videoInstructor": "Intellipaat",
        "videoUrl": "https://www.youtube.com/watch?v=Z3OtvE3K2-Q",
        "videoDescription": "Learn how to use AWS EC2 instances.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Compute Services",
        "description": "Provision and manage compute resources ranging from virtual machines to serverless functions.",
        "stage": "CORE CLOUD",
        "order": 4,
        "estimatedHours": 30,
        "prerequisites": [
          "ce-cloud"
        ],
        "skills": [
          "Virtual Machines",
          "Serverless",
          "AWS EC2",
          "AWS Lambda"
        ],
        "learningObjectives": [
          "Deploy and configure virtual machines",
          "Understand serverless computing paradigms",
          "Manage compute scaling"
        ],
        "topics": [
          "Virtual Machines",
          "Serverless Computing",
          "Auto-scaling",
          "Compute Instance Types"
        ],
        "practicalExercise": "Deploy a virtual machine instance on AWS or Azure and configure a basic web server using user-data scripts.",
        "recommendedBookTitle": "Amazon EC2 Documentation",
        "recommendedBookAuthor": "Amazon Web Services (AWS)",
        "recommendedBookUrl": "https://docs.aws.amazon.com/ec2/",
        "recommendedBookDescription": "The authoritative resource for provisioning and managing compute instances on AWS.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-store",
        "videoTitle": "AWS S3 Tutorial For Beginners",
        "videoInstructor": "Be A Better Dev",
        "videoUrl": "https://www.youtube.com/watch?v=O1a5kM2EaBc",
        "videoDescription": "Comprehensive guide to Amazon S3.",
        "videoDuration": "0:45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Storage",
        "description": "Implement scalable, durable, and highly available cloud storage solutions tailored for different workloads.",
        "stage": "CORE CLOUD",
        "order": 5,
        "estimatedHours": 20,
        "prerequisites": [
          "ce-comp"
        ],
        "skills": [
          "Cloud Storage",
          "AWS S3",
          "EBS"
        ],
        "learningObjectives": [
          "Differentiate between block, file, and object storage",
          "Configure object storage buckets and permissions",
          "Manage storage lifecycles and backups"
        ],
        "topics": [
          "Object Storage",
          "Block Storage",
          "File Storage",
          "Data Lifecycle Management"
        ],
        "practicalExercise": "Create a cloud object storage bucket, upload a static website, and configure bucket policies for public access.",
        "recommendedBookTitle": "Amazon S3 Documentation",
        "recommendedBookAuthor": "Amazon Web Services (AWS)",
        "recommendedBookUrl": "https://docs.aws.amazon.com/s3/",
        "recommendedBookDescription": "The definitive guide to utilizing the industry-standard cloud object storage service.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-db",
        "videoTitle": "Cloud Databases: AWS RDS Tutorial",
        "videoInstructor": "Stephane Maarek",
        "videoUrl": "https://www.youtube.com/watch?v=VlM_K1x5h3g",
        "videoDescription": "Overview of AWS RDS and DynamoDB.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Cloud Databases",
        "description": "Deploy, manage, and scale fully managed relational and NoSQL databases in the cloud.",
        "stage": "CORE CLOUD",
        "order": 6,
        "estimatedHours": 30,
        "prerequisites": [
          "ce-store"
        ],
        "skills": [
          "Databases",
          "SQL",
          "NoSQL",
          "Amazon RDS",
          "DynamoDB"
        ],
        "learningObjectives": [
          "Deploy managed relational database services",
          "Implement NoSQL database solutions",
          "Configure database backups and high availability"
        ],
        "topics": [
          "Managed Relational Databases",
          "NoSQL Cloud Databases",
          "Database Replication",
          "Database Security"
        ],
        "practicalExercise": "Provision a managed PostgreSQL database, configure network access rules, and perform a basic data migration.",
        "recommendedBookTitle": "Database Internals",
        "recommendedBookAuthor": "Alex Petrov",
        "recommendedBookUrl": "https://www.databass.dev/",
        "recommendedBookDescription": "Provides a deep dive into the inner workings of distributed data systems and cloud databases.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-vnet",
        "videoTitle": "AWS VPC Tutorial",
        "videoInstructor": "Adrian Cantrill",
        "videoUrl": "https://www.youtube.com/watch?v=hZJc8Ew4y1Q",
        "videoDescription": "Mastering AWS Virtual Private Cloud.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Virtual Networks",
        "description": "Design and configure secure, scalable virtual networks that form the backbone of cloud architectures.",
        "stage": "CORE CLOUD",
        "order": 7,
        "estimatedHours": 25,
        "prerequisites": [
          "ce-db"
        ],
        "skills": [
          "VPC",
          "Cloud Networking"
        ],
        "learningObjectives": [
          "Create and configure Virtual Private Clouds (VPCs)",
          "Manage network security groups and ACLs",
          "Establish secure network connectivity"
        ],
        "topics": [
          "Virtual Private Clouds (VPC)",
          "Security Groups",
          "Network ACLs",
          "VPN and Peering"
        ],
        "practicalExercise": "Create a custom VPC with public and private subnets, configuring route tables to allow internet access only for the public subnet.",
        "recommendedBookTitle": "Amazon VPC Documentation",
        "recommendedBookAuthor": "Amazon Web Services (AWS)",
        "recommendedBookUrl": "https://docs.aws.amazon.com/vpc/",
        "recommendedBookDescription": "Official guide for designing secure and scalable virtual private clouds.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-lb",
        "videoTitle": "Load Balancing & High Availability Explained",
        "videoInstructor": "Hussein Nasser",
        "videoUrl": "https://www.youtube.com/watch?v=K0Ta65OqQkY",
        "videoDescription": "Explains Layer 4 vs Layer 7 load balancing, CDNs, and architecting highly available systems.",
        "videoDuration": "2:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Load Balancing & CDN",
        "description": "Distribute traffic across application components to improve resilience and optimize content delivery.",
        "stage": "CORE CLOUD",
        "order": 8,
        "estimatedHours": 20,
        "prerequisites": [
          "ce-vnet"
        ],
        "skills": [
          "Load Balancing",
          "CDN",
          "AWS CloudFront"
        ],
        "learningObjectives": [
          "Configure application and network load balancers",
          "Implement Content Delivery Networks (CDNs)",
          "Configure health checks"
        ],
        "topics": [
          "Load Balancing Concepts",
          "Application vs Network Load Balancers",
          "Content Delivery Networks (CDN)",
          "Caching Strategies"
        ],
        "practicalExercise": "Set up an application load balancer to distribute traffic across two web server instances and verify health check functionality.",
        "recommendedBookTitle": "NGINX Official Documentation",
        "recommendedBookAuthor": "F5, Inc.",
        "recommendedBookUrl": "https://docs.nginx.com/",
        "recommendedBookDescription": "Comprehensive documentation for configuring load balancers, reverse proxies, and web servers.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-iam",
        "videoTitle": "AWS IAM Explained for Beginners",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=420I8YQ2248",
        "videoDescription": "AWS Identity and Access Management deep dive.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "IAM & Security",
        "description": "Secure cloud environments through granular identity and access management policies.",
        "stage": "SECURITY",
        "order": 9,
        "estimatedHours": 25,
        "prerequisites": [
          "ce-lb"
        ],
        "skills": [
          "IAM",
          "Cloud Security",
          "Authentication",
          "Authorization"
        ],
        "learningObjectives": [
          "Create and manage IAM users and roles",
          "Implement the principle of least privilege",
          "Configure multi-factor authentication"
        ],
        "topics": [
          "Identity and Access Management (IAM)",
          "Role-Based Access Control (RBAC)",
          "Policy Evaluation Logic",
          "Multi-Factor Authentication (MFA)"
        ],
        "practicalExercise": "Create an IAM role with policies that grant read-only access to specific storage buckets, and assign it to a temporary user.",
        "recommendedBookTitle": "AWS IAM Documentation",
        "recommendedBookAuthor": "Amazon Web Services (AWS)",
        "recommendedBookUrl": "https://docs.aws.amazon.com/iam/",
        "recommendedBookDescription": "Crucial resource for understanding cloud identity, roles, and access management policies.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-secrets",
        "videoTitle": "HashiCorp Vault Tutorial for Beginners",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=nrhxNNH5lt0",
        "videoDescription": "Introduction to HashiCorp Vault for secrets management.",
        "videoDuration": "0:50:00",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Secrets Management",
        "description": "Safeguard sensitive information such as API keys, database passwords, and TLS certificates in the cloud.",
        "stage": "SECURITY",
        "order": 10,
        "estimatedHours": 15,
        "prerequisites": [
          "ce-iam"
        ],
        "skills": [
          "Secrets Management",
          "AWS Secrets Manager",
          "HashiCorp Vault"
        ],
        "learningObjectives": [
          "Understand the importance of secret management",
          "Use managed secret services",
          "Implement dynamic secret generation"
        ],
        "topics": [
          "Secrets Management",
          "Encryption at Rest",
          "Key Management Systems",
          "Dynamic Secrets"
        ],
        "practicalExercise": "Store a database credential in a managed secrets service and write a simple script to retrieve it dynamically at runtime.",
        "recommendedBookTitle": "HashiCorp Vault Documentation",
        "recommendedBookAuthor": "HashiCorp",
        "recommendedBookUrl": "https://developer.hashicorp.com/vault/docs",
        "recommendedBookDescription": "The industry standard documentation for secrets management, encryption, and privileged access.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ce-iac",
        "videoTitle": "Terraform Course - Beginner to Advanced",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=7xngnjfIlK4",
        "videoDescription": "A complete course on Infrastructure as Code, covering Terraform syntax, state management, and modules.",
        "videoDuration": "13:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Infrastructure as Code",
        "description": "Automate the provisioning and management of cloud infrastructure using declarative code.",
        "stage": "AUTOMATION",
        "order": 11,
        "estimatedHours": 35,
        "prerequisites": [
          "ce-secrets"
        ],
        "skills": [
          "Infrastructure as Code",
          "Terraform",
          "CloudFormation"
        ],
        "learningObjectives": [
          "Write infrastructure code using Terraform",
          "Manage state files and dependencies",
          "Implement modular infrastructure design"
        ],
        "topics": [
          "Infrastructure as Code Concepts",
          "Terraform Syntax",
          "State Management",
          "Terraform Modules"
        ],
        "practicalExercise": "Write and execute a Terraform script to provision a VPC, a public subnet, and an EC2 instance.",
        "recommendedBookTitle": "Terraform Up & Running",
        "recommendedBookAuthor": "Yevgeniy Brikman",
        "recommendedBookUrl": "https://www.terraformupandrunning.com/",
        "recommendedBookDescription": "The best practical guide for implementing Infrastructure as Code using Terraform.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-docker",
        "videoTitle": "Docker Tutorial for Beginners",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=3c-iBn73dDE",
        "videoDescription": "Excellent tutorial on containerization, writing Dockerfiles, and orchestrating with Docker Compose.",
        "videoDuration": "3:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Containers",
        "description": "Package applications and their dependencies into standardized units for seamless deployment.",
        "stage": "AUTOMATION",
        "order": 12,
        "estimatedHours": 25,
        "prerequisites": [
          "ce-iac"
        ],
        "skills": [
          "Docker",
          "Containerization"
        ],
        "learningObjectives": [
          "Write efficient Dockerfiles",
          "Manage container lifecycles",
          "Orchestrate multi-container applications"
        ],
        "topics": [
          "Containerization Concepts",
          "Dockerfiles",
          "Docker Compose",
          "Container Registries"
        ],
        "practicalExercise": "Create a multi-stage Dockerfile for a Node.js application, build the image, and push it to a container registry.",
        "recommendedBookTitle": "Docker Deep Dive",
        "recommendedBookAuthor": "Nigel Poulton",
        "recommendedBookUrl": "https://nigelpoulton.com/docker-deep-dive/",
        "recommendedBookDescription": "An approachable yet thorough guide to understanding Docker and containerization technologies.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-k8s",
        "videoTitle": "Kubernetes Crash Course",
        "videoInstructor": "Traversy Media",
        "videoUrl": "https://www.youtube.com/watch?v=s_o8dwzRlu4",
        "videoDescription": "Quick and practical introduction to Kubernetes architecture, deployments, and services.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Kubernetes",
        "description": "Automate the deployment, scaling, and management of containerized applications using Kubernetes.",
        "stage": "AUTOMATION",
        "order": 13,
        "estimatedHours": 45,
        "prerequisites": [
          "ce-docker"
        ],
        "skills": [
          "Kubernetes",
          "EKS",
          "GKE"
        ],
        "learningObjectives": [
          "Understand Kubernetes architecture and components",
          "Deploy applications using Pods and Deployments",
          "Expose applications using Services"
        ],
        "topics": [
          "Kubernetes Architecture",
          "Pods and Deployments",
          "Services and Ingress",
          "ConfigMaps and Secrets"
        ],
        "practicalExercise": "Deploy a containerized application to a local Kubernetes cluster, configure a Service to expose it, and perform a rolling update.",
        "recommendedBookTitle": "Kubernetes: Up and Running",
        "recommendedBookAuthor": "Brendan Burns, Joe Beda, Kelsey Hightower",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/kubernetes-up-and/9781492046523/",
        "recommendedBookDescription": "Written by the creators of Kubernetes, it offers the best practical overview of container orchestration.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-cicd",
        "videoTitle": "GitHub Actions CI/CD Complete Course",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=R8_veQiYBjI",
        "videoDescription": "Teaches how to automate software workflows, from building code to deploying cloud infrastructure.",
        "videoDuration": "3:30:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Cloud CI/CD",
        "description": "Establish automated pipelines to build, test, and deploy code changes reliably and efficiently.",
        "stage": "AUTOMATION",
        "order": 14,
        "estimatedHours": 25,
        "prerequisites": [
          "ce-k8s"
        ],
        "skills": [
          "CI/CD",
          "GitHub Actions",
          "AWS CodePipeline"
        ],
        "learningObjectives": [
          "Design continuous integration pipelines",
          "Implement automated deployment strategies",
          "Integrate security checks into CI/CD"
        ],
        "topics": [
          "Continuous Integration (CI)",
          "Continuous Deployment (CD)",
          "Pipeline Configuration",
          "Deployment Strategies (Blue/Green, Canary)"
        ],
        "practicalExercise": "Configure a GitHub Actions pipeline that builds a Docker image on push and deploys it to a staging environment.",
        "recommendedBookTitle": "Continuous Delivery",
        "recommendedBookAuthor": "Jez Humble, David Farley",
        "recommendedBookUrl": "https://martinfowler.com/books/continuousDelivery.html",
        "recommendedBookDescription": "The foundational text establishing the principles and practices of CI/CD pipelines.",
        "resourceType": "BOOK"
      },
      {
        "key": "ce-ops",
        "videoTitle": "Prometheus and Grafana Tutorial",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=h4Sl21AKiDg",
        "videoDescription": "How to set up comprehensive monitoring, metrics collection, and observability dashboards.",
        "videoDuration": "2:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Monitoring & Observability",
        "description": "Ensure system reliability by implementing comprehensive monitoring, logging, and alerting solutions.",
        "stage": "OPERATIONS",
        "order": 15,
        "estimatedHours": 30,
        "prerequisites": [
          "ce-cicd"
        ],
        "skills": [
          "Monitoring",
          "Logging",
          "Observability",
          "Prometheus",
          "Grafana",
          "CloudWatch"
        ],
        "learningObjectives": [
          "Implement centralized logging",
          "Configure metrics collection and dashboards",
          "Set up actionable alerts"
        ],
        "topics": [
          "Observability Concepts",
          "Centralized Logging",
          "Metrics and Dashboards",
          "Alerting Systems"
        ],
        "practicalExercise": "Set up a Prometheus and Grafana stack to monitor server CPU and memory usage, and configure an alert for high CPU utilization.",
        "recommendedBookTitle": "Site Reliability Engineering",
        "recommendedBookAuthor": "Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff",
        "recommendedBookUrl": "https://sre.google/sre-book/table-of-contents/",
        "recommendedBookDescription": "Google's authoritative guide on operating large-scale systems with high reliability.",
        "resourceType": "BOOK"
      },
      {
        "key": "storage-databases",
        "title": "Storage & Databases",
        "description": "Understand cloud-native storage solutions and database engines, focusing on scalability, replication, and consistency trade-offs.",
        "learningObjectives": [
          "Compare object, block, and file storage in cloud environments.",
          "Evaluate relational vs. NoSQL databases for specific workloads.",
          "Design highly available database architectures with sharding and read replicas."
        ],
        "topics": [
          "Object Storage",
          "Block Storage",
          "Relational Databases",
          "NoSQL",
          "Eventual Consistency",
          "ACID",
          "Sharding"
        ],
        "practicalExercise": "Deploy a multi-region PostgreSQL cluster and configure asynchronous read replicas.",
        "skills": [
          "PostgreSQL",
          "AWS S3",
          "Database Architecture"
        ],
        "stage": "Advanced",
        "order": 16,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Designing Data-Intensive Applications",
        "recommendedBookAuthor": "Martin Kleppmann",
        "recommendedBookUrl": "https://dataintensive.net/",
        "recommendedBookDescription": "A deep dive into the architecture of data systems, replication, and distributed consensus.",
        "resourceType": "BOOK",
        "videoTitle": "AWS re:Invent: Deep Dive on Amazon S3",
        "videoInstructor": "AWS",
        "videoUrl": "https://www.youtube.com/watch?v=y1kO1L5R8C4",
        "videoDescription": "An architectural deep dive into how Amazon S3 scales under the hood.",
        "videoDuration": "60m",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE"
      },
      {
        "key": "identity-security",
        "title": "Identity & Security",
        "description": "Master identity management and security protocols essential for protecting modern cloud infrastructure and applications.",
        "learningObjectives": [
          "Implement OAuth2 and OIDC for secure API access.",
          "Design zero-trust network architectures.",
          "Manage secrets and encryption keys dynamically."
        ],
        "topics": [
          "OAuth2",
          "OIDC",
          "SAML",
          "Zero Trust",
          "KMS",
          "IAM",
          "RBAC"
        ],
        "practicalExercise": "Implement an API gateway that authenticates requests using JWTs issued by an OIDC provider.",
        "skills": [
          "Identity & Access Management",
          "OAuth2",
          "Cloud Security"
        ],
        "stage": "Advanced",
        "order": 17,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "OAuth 2 in Action",
        "recommendedBookAuthor": "Justin Richer, Antonio Sanso",
        "recommendedBookUrl": "https://www.manning.com/books/oauth-2-in-action",
        "recommendedBookDescription": "Comprehensive guide to building and securing APIs using OAuth2.",
        "resourceType": "BOOK",
        "videoTitle": "OAuth 2.0 and OpenID Connect (in plain English)",
        "videoInstructor": "Okta",
        "videoUrl": "https://www.youtube.com/watch?v=996OiexHze0",
        "videoDescription": "A crystal clear explanation of identity protocols.",
        "videoDuration": "55m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "containers-orchestration",
        "title": "Containers & Orchestration",
        "description": "Learn to containerize applications and manage them at scale using Kubernetes orchestration.",
        "learningObjectives": [
          "Build optimized container images.",
          "Deploy and scale applications using Kubernetes Deployments.",
          "Configure service discovery and ingress controllers."
        ],
        "topics": [
          "Docker",
          "Kubernetes",
          "Helm",
          "Service Mesh",
          "Ingress",
          "cgroups",
          "Namespaces"
        ],
        "practicalExercise": "Deploy a microservices application on a local Minikube cluster with a configured Ingress resource.",
        "skills": [
          "Docker",
          "Kubernetes",
          "Systems Architecture"
        ],
        "stage": "Advanced",
        "order": 18,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Kubernetes Up & Running",
        "recommendedBookAuthor": "Brendan Burns",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/kubernetes-up-and/9781492046523/",
        "recommendedBookDescription": "Practical guide to deploying and managing distributed systems on Kubernetes.",
        "resourceType": "BOOK",
        "videoTitle": "Kubernetes in 5 mins",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=VnvRFRk_51k",
        "videoDescription": "Quick overview of Kubernetes core concepts and architecture.",
        "videoDuration": "5m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      }
    ]
  },
  {
    "title": "Data Engineering",
    "slug": "data-engineering",
    "description": "Learn to build resilient data pipelines and data architectures.",
    "category": "Data",
    "difficulty": "Advanced",
    "estimatedHours": 420,
    "nodes": [
      {
        "key": "de-sql",
        "videoTitle": "Advanced SQL Tutorial",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=qw--VYLpxG4",
        "videoDescription": "Covers window functions, CTEs, and complex joins required for heavy data analytics.",
        "videoDuration": "4:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Advanced SQL",
        "description": "Master advanced SQL querying techniques to manipulate, aggregate, and analyze complex datasets effectively.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "SQL",
          "PostgreSQL",
          "Database Optimization"
        ],
        "learningObjectives": [
          "Write complex JOINs and subqueries",
          "Utilize window functions for advanced analytics",
          "Optimize SQL queries for performance"
        ],
        "topics": [
          "Advanced JOINs",
          "Window Functions",
          "Common Table Expressions (CTEs)",
          "Query Optimization"
        ],
        "practicalExercise": "Write a SQL query utilizing window functions to calculate the running total of sales and the moving average for each product category.",
        "recommendedBookTitle": "SQL Performance Explained",
        "recommendedBookAuthor": "Markus Winand",
        "recommendedBookUrl": "https://sql-performance-explained.com/",
        "recommendedBookDescription": "A must-read for data engineers focused on writing highly optimized, advanced SQL queries.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-py",
        "videoTitle": "Python for Data Engineering",
        "videoInstructor": "Seattle Data Guy",
        "videoUrl": "https://www.youtube.com/watch?v=9_H898863tI",
        "videoDescription": "Best practices for using Python in Data Engineering pipelines.",
        "videoDuration": "PT45M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Python for Data Engineering",
        "description": "Leverage Python to build robust data processing scripts, handle file formats, and interact with APIs.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 25,
        "prerequisites": [
          "de-sql"
        ],
        "skills": [
          "Python",
          "Data Processing",
          "Pandas"
        ],
        "learningObjectives": [
          "Manipulate data using Python data structures",
          "Process large files efficiently",
          "Interact with databases using Python"
        ],
        "topics": [
          "Python Data Structures",
          "File I/O (CSV, JSON)",
          "API Integration",
          "Database Connectors"
        ],
        "practicalExercise": "Develop a Python script that extracts data from a public REST API, transforms the JSON response, and loads it into a SQLite database.",
        "recommendedBookTitle": "Fluent Python",
        "recommendedBookAuthor": "Luciano Ramalho",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
        "recommendedBookDescription": "Teaches idiomatic Python, crucial for writing performant and maintainable data engineering scripts.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-model",
        "videoTitle": "Data Modeling Fundamentals",
        "videoInstructor": "Luke Barousse",
        "videoUrl": "https://www.youtube.com/watch?v=68mF9p3U7c0",
        "videoDescription": "Learn how to design robust data models.",
        "videoDuration": "PT1H10M",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Data Modeling",
        "description": "Design efficient database schemas that optimize for analytical workloads and business reporting.",
        "stage": "ARCHITECTURE",
        "order": 3,
        "estimatedHours": 30,
        "prerequisites": [
          "de-py"
        ],
        "skills": [
          "Data Modeling",
          "Star Schema",
          "Relational Databases"
        ],
        "learningObjectives": [
          "Understand dimensional modeling concepts",
          "Design star and snowflake schemas",
          "Differentiate between OLTP and OLAP modeling"
        ],
        "topics": [
          "Dimensional Modeling",
          "Star Schema",
          "Snowflake Schema",
          "Fact and Dimension Tables"
        ],
        "practicalExercise": "Design a star schema for a retail business, defining the fact table for sales and dimension tables for time, product, and store.",
        "recommendedBookTitle": "The Data Warehouse Toolkit",
        "recommendedBookAuthor": "Ralph Kimball, Margy Ross",
        "recommendedBookUrl": "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/",
        "recommendedBookDescription": "The undisputed bible of dimensional modeling and data warehouse design.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-dw",
        "videoTitle": "Cloud Data Warehousing with Snowflake",
        "videoInstructor": "freeCodeCamp / Tech with Tim",
        "videoUrl": "https://www.youtube.com/watch?v=x-73J-O_QeM",
        "videoDescription": "Learn how to build data warehouses and AI agents with Snowflake.",
        "videoDuration": "PT2H",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Data Warehousing",
        "description": "Architect and manage modern cloud data warehouses to support large-scale enterprise analytics.",
        "stage": "ARCHITECTURE",
        "order": 4,
        "estimatedHours": 40,
        "prerequisites": [
          "de-model"
        ],
        "skills": [
          "Data Warehousing",
          "Snowflake",
          "BigQuery",
          "Amazon Redshift"
        ],
        "learningObjectives": [
          "Understand columnar storage and MPP architectures",
          "Load data into modern data warehouses",
          "Optimize warehouse performance"
        ],
        "topics": [
          "Data Warehouse Architecture",
          "Massively Parallel Processing (MPP)",
          "Columnar Storage",
          "Cloud Data Warehouses (Snowflake, BigQuery)"
        ],
        "practicalExercise": "Set up a trial account on a cloud data warehouse, bulk load a large dataset, and run performance-optimized analytical queries.",
        "recommendedBookTitle": "Snowflake Official Documentation",
        "recommendedBookAuthor": "Snowflake",
        "recommendedBookUrl": "https://docs.snowflake.com/",
        "recommendedBookDescription": "The best resource for learning cloud-native data warehousing architectures and patterns.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "de-dl",
        "videoTitle": "Data Lakes and Data Lakehouses Explained",
        "videoInstructor": "Databricks",
        "videoUrl": "https://www.youtube.com/watch?v=9V2oB0zJ15o",
        "videoDescription": "An official introduction to Data Lakes and Lakehouse architecture.",
        "videoDuration": "PT15M",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Data Lakes",
        "description": "Implement data lakes to store vast amounts of raw, unstructured, and semi-structured data cost-effectively.",
        "stage": "ARCHITECTURE",
        "order": 5,
        "estimatedHours": 30,
        "prerequisites": [
          "de-dw"
        ],
        "skills": [
          "Data Lakes",
          "Apache Parquet",
          "Delta Lake"
        ],
        "learningObjectives": [
          "Design data lake architectures",
          "Work with big data file formats",
          "Implement data lakehouse concepts"
        ],
        "topics": [
          "Data Lake Architecture",
          "Parquet and ORC Formats",
          "Data Lakehouse Concepts",
          "Delta Lake / Apache Iceberg"
        ],
        "practicalExercise": "Convert a large CSV dataset into Parquet format, partition the data by date, and query it using a serverless query engine.",
        "recommendedBookTitle": "Delta Lake Documentation",
        "recommendedBookAuthor": "The Linux Foundation",
        "recommendedBookUrl": "https://docs.delta.io/latest/index.html",
        "recommendedBookDescription": "Official guide to implementing reliable data lakes using ACID transactions.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "de-batch",
        "videoTitle": "Apache Spark Crash Course",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=_C8kWso4ne4",
        "videoDescription": "Teaches distributed batch processing, RDDs, and DataFrames using PySpark.",
        "videoDuration": "2:30:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Batch Processing",
        "description": "Process massive datasets efficiently using distributed batch processing frameworks like Apache Spark.",
        "stage": "PROCESSING",
        "order": 6,
        "estimatedHours": 45,
        "prerequisites": [
          "de-dl"
        ],
        "skills": [
          "Batch Processing",
          "Apache Spark",
          "Hadoop",
          "Distributed Systems"
        ],
        "learningObjectives": [
          "Understand distributed computing concepts",
          "Write Spark applications using PySpark",
          "Optimize batch processing jobs"
        ],
        "topics": [
          "Distributed Computing",
          "Apache Spark Architecture",
          "RDDs and DataFrames",
          "Spark Optimization"
        ],
        "practicalExercise": "Write a PySpark script to clean, aggregate, and transform a large log dataset, saving the output as partitioned Parquet files.",
        "recommendedBookTitle": "Spark: The Definitive Guide",
        "recommendedBookAuthor": "Bill Chambers, Matei Zaharia",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/",
        "recommendedBookDescription": "Written by the creator of Apache Spark, it is the ultimate guide to distributed batch processing.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-stream",
        "videoTitle": "Apache Kafka in 1 Hour",
        "videoInstructor": "Guilherme Ferreira (NDC)",
        "videoUrl": "https://www.youtube.com/watch?v=0hK2sK2jX7s",
        "videoDescription": "Crash course on Kafka fundamentals and event streaming.",
        "videoDuration": "PT1H",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Stream Processing",
        "description": "Design and build real-time data processing pipelines to handle continuous data streams.",
        "stage": "PROCESSING",
        "order": 7,
        "estimatedHours": 45,
        "prerequisites": [
          "de-batch"
        ],
        "skills": [
          "Stream Processing",
          "Apache Kafka",
          "Real-time Data"
        ],
        "learningObjectives": [
          "Understand event streaming architectures",
          "Produce and consume messages using Apache Kafka",
          "Process real-time data using stream processing engines"
        ],
        "topics": [
          "Event Streaming",
          "Apache Kafka",
          "Stream Processing Concepts",
          "Stateful vs Stateless Processing"
        ],
        "practicalExercise": "Set up a local Kafka cluster, write a Python producer to stream simulated sensor data, and a consumer to aggregate metrics in real time.",
        "recommendedBookTitle": "Kafka: The Definitive Guide",
        "recommendedBookAuthor": "Neha Narkhede, Gwen Shapira, Todd Palino",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/kafka-the-definitive/9781491936153/",
        "recommendedBookDescription": "Comprehensive instruction on event streaming and real-time data architectures using Apache Kafka.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-elt",
        "videoTitle": "dbt (Data Build Tool) Fundamentals",
        "videoInstructor": "dbt Labs",
        "videoUrl": "https://www.youtube.com/watch?v=5rGz5FzH4yI",
        "videoDescription": "Official introductory course for dbt.",
        "videoDuration": "PT1H30M",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "ELT & Data Transformation",
        "description": "Modernize data transformation workflows using ELT patterns and tools like dbt.",
        "stage": "PIPELINES",
        "order": 8,
        "estimatedHours": 30,
        "prerequisites": [
          "de-dw"
        ],
        "skills": [
          "ETL",
          "ELT",
          "dbt",
          "Data Transformation"
        ],
        "learningObjectives": [
          "Understand the shift from ETL to ELT",
          "Build modular data transformations using dbt",
          "Implement data testing and documentation"
        ],
        "topics": [
          "ETL vs ELT",
          "dbt (data build tool)",
          "Modular SQL Modeling",
          "Data Testing"
        ],
        "practicalExercise": "Create a dbt project that transforms raw e-commerce data into a modeled star schema, including data quality tests for primary keys.",
        "recommendedBookTitle": "dbt Official Documentation",
        "recommendedBookAuthor": "dbt Labs",
        "recommendedBookUrl": "https://docs.getdbt.com/",
        "recommendedBookDescription": "Provides complete instructions for implementing modern ELT pipelines and data transformations.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "de-orch",
        "videoTitle": "Apache Airflow Tutorial",
        "videoInstructor": "Marc Lamberti",
        "videoUrl": "https://www.youtube.com/watch?v=aTaytcxy2Ck",
        "videoDescription": "Learn Apache Airflow fundamentals and best practices.",
        "videoDuration": "PT30M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Data Orchestration",
        "description": "Schedule, monitor, and manage complex data pipeline workflows using orchestration tools.",
        "stage": "ORCHESTRATION",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "de-elt",
          "de-stream"
        ],
        "skills": [
          "Apache Airflow",
          "Data Orchestration",
          "Data Pipelines"
        ],
        "learningObjectives": [
          "Define Directed Acyclic Graphs (DAGs)",
          "Schedule data pipelines using Apache Airflow",
          "Implement error handling and retries"
        ],
        "topics": [
          "Workflow Orchestration",
          "Apache Airflow Concepts",
          "DAG Definition",
          "Task Dependencies"
        ],
        "practicalExercise": "Write an Airflow DAG that schedules a daily data extraction task, followed by a transformation task, with appropriate retry logic.",
        "recommendedBookTitle": "Data Pipelines with Apache Airflow",
        "recommendedBookAuthor": "Bas P. Harenslak, Julian de Ruiter",
        "recommendedBookUrl": "https://www.manning.com/books/data-pipelines-with-apache-airflow",
        "recommendedBookDescription": "A highly practical resource for orchestrating, scheduling, and monitoring complex data workflows.",
        "resourceType": "BOOK"
      },
      {
        "key": "de-gov",
        "videoTitle": "Data Governance Principles",
        "videoInstructor": "Alation",
        "videoUrl": "https://www.youtube.com/watch?v=9_H898863tI",
        "videoDescription": "An overview of data governance and security.",
        "videoDuration": "PT50M",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE",
        "title": "Data Governance & Security",
        "description": "Establish frameworks and practices to ensure data quality, security, and compliance across the organization.",
        "stage": "OPERATIONS",
        "order": 10,
        "estimatedHours": 25,
        "prerequisites": [
          "de-orch"
        ],
        "skills": [
          "Data Governance",
          "Data Quality",
          "Data Security"
        ],
        "learningObjectives": [
          "Implement data quality checks",
          "Manage metadata and data catalogs",
          "Apply data masking and access controls"
        ],
        "topics": [
          "Data Governance Frameworks",
          "Data Quality Management",
          "Data Catalogs",
          "Data Privacy and Security"
        ],
        "practicalExercise": "Implement automated data quality checks within a pipeline to flag records with missing critical fields before they reach the data warehouse.",
        "recommendedBookTitle": "Data Governance: The Definitive Guide",
        "recommendedBookAuthor": "Evren Eryurek, Uri Gilad, et al.",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/data-governance-the/9781492063483/",
        "recommendedBookDescription": "Covers essential strategies for managing data quality, security, and compliance at scale.",
        "resourceType": "BOOK"
      },
      {
        "key": "data-pipelines-airflow",
        "title": "Data Pipelines & Airflow",
        "description": "Design and schedule robust data engineering pipelines using Apache Airflow.",
        "learningObjectives": [
          "Write reproducible DAGs in Python.",
          "Implement incremental data loading patterns.",
          "Handle pipeline failures and dependencies effectively."
        ],
        "topics": [
          "ETL/ELT",
          "DAGs",
          "Apache Airflow",
          "Data Warehousing",
          "Idempotency",
          "Task Scheduling"
        ],
        "practicalExercise": "Build an Airflow DAG that extracts data from an API, transforms it in a staging area, and loads it into a data warehouse.",
        "skills": [
          "Python",
          "Apache Airflow",
          "Data Engineering"
        ],
        "stage": "Advanced",
        "order": 11,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Data Pipelines with Apache Airflow",
        "recommendedBookAuthor": "Bas Harenslak, Julian de Ruiter",
        "recommendedBookUrl": "https://www.manning.com/books/data-pipelines-with-apache-airflow",
        "recommendedBookDescription": "An in-depth guide to building automated data pipelines with Airflow.",
        "resourceType": "BOOK",
        "videoTitle": "Apache Airflow Tutorial for Beginners",
        "videoInstructor": "Marc Lamberti",
        "videoUrl": "https://www.youtube.com/watch?v=aTaytcxy2Ck",
        "videoDescription": "Step-by-step tutorial on building your first DAGs in Airflow.",
        "videoDuration": "2h",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      }
    ]
  },
  {
    "title": "DevOps & SRE",
    "slug": "devops-sre",
    "description": "Bridge development and operations with automation and reliability.",
    "category": "Engineering",
    "difficulty": "Advanced",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "do-linux",
        "videoTitle": "Linux System Administration Full Course",
        "videoInstructor": "FreeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=V1y-mbWM3B8",
        "videoDescription": "A comprehensive tutorial on Linux system administration covering systemd, process management, and networking.",
        "videoDuration": "4:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Advanced Linux",
        "description": "Administer Linux systems at an advanced level, focusing on kernel tuning, service management, and deep troubleshooting.",
        "stage": "SYSTEMS",
        "order": 1,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "Linux",
          "System Administration",
          "Bash"
        ],
        "learningObjectives": [
          "Manage services with systemd",
          "Troubleshoot performance using strace and perf",
          "Configure kernel parameters via sysctl"
        ],
        "topics": [
          "systemd",
          "Kernel Tuning",
          "strace",
          "Process Management",
          "File Systems"
        ],
        "practicalExercise": "Deploy a custom systemd service, configure it to restart on failure, and trace its system calls using strace.",
        "recommendedBookTitle": "UNIX and Linux System Administration Handbook",
        "recommendedBookAuthor": "Evi Nemeth, Garth Snyder, Trent R. Hein, Ben Whaley",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/unix-and-linux-system-administration-handbook/P200000009403/9780134277554",
        "recommendedBookDescription": "The definitive guide for Linux system administration, covering kernel tuning, processes, and deep troubleshooting.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-net",
        "videoTitle": "Networking for DevOps",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=j_UUnlVC2Ss",
        "videoDescription": "An excellent overview of networking concepts essential for DevOps engineers, including DNS, proxies, and load balancers.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Networking for DevOps",
        "description": "Configure and manage network services critical for DevOps, including load balancing, DNS, and reverse proxies.",
        "stage": "SYSTEMS",
        "order": 2,
        "estimatedHours": 30,
        "prerequisites": [
          "do-linux"
        ],
        "skills": [
          "Networking",
          "Nginx",
          "Load Balancing",
          "DNS"
        ],
        "learningObjectives": [
          "Configure Nginx as a reverse proxy",
          "Manage DNS records for application routing",
          "Implement load balancing strategies"
        ],
        "topics": [
          "Nginx",
          "HAProxy",
          "Load Balancing",
          "DNS Management",
          "Reverse Proxying"
        ],
        "practicalExercise": "Set up an Nginx load balancer to distribute traffic across multiple backend application servers.",
        "recommendedBookTitle": "High Performance Browser Networking",
        "recommendedBookAuthor": "Ilya Grigorik",
        "recommendedBookUrl": "https://hpbn.co/",
        "recommendedBookDescription": "An essential resource for understanding networking in a modern DevOps context, including TCP, UDP, load balancing, and proxying.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-script",
        "videoTitle": "Python for DevOps",
        "videoInstructor": "Kunal Kushwaha",
        "videoUrl": "https://www.youtube.com/watch?v=2TzE5iP8N7s",
        "videoDescription": "Using Python for automation and scripting in DevOps.",
        "videoDuration": "PT1H20M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Scripting & Automation",
        "description": "Automate system administration and deployment tasks using scripting languages like Python, Bash, and Go.",
        "stage": "AUTOMATION",
        "order": 3,
        "estimatedHours": 30,
        "prerequisites": [
          "do-linux"
        ],
        "skills": [
          "Python",
          "Go",
          "Automation"
        ],
        "learningObjectives": [
          "Write robust Bash scripts for system tasks",
          "Develop Python scripts for API interaction",
          "Build simple CLI tools in Go"
        ],
        "topics": [
          "Bash Scripting",
          "Python Automation",
          "Go CLI",
          "Error Handling",
          "Task Automation"
        ],
        "practicalExercise": "Write a Python script to automate the backup of a database directory and upload it to cloud storage.",
        "recommendedBookTitle": "Automate the Boring Stuff with Python",
        "recommendedBookAuthor": "Al Sweigart",
        "recommendedBookUrl": "https://automatetheboringstuff.com/",
        "recommendedBookDescription": "A highly practical book for DevOps engineers learning to automate repetitive system tasks and API interactions.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-iac",
        "videoTitle": "Terraform Course - Automate your AWS cloud infrastructure",
        "videoInstructor": "FreeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=7xngnjfIlK4",
        "videoDescription": "A complete guide to Infrastructure as Code using Terraform to provision AWS cloud resources declaratively.",
        "videoDuration": "3:10:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Infrastructure as Code",
        "description": "Provision and manage cloud infrastructure programmatically using tools like Terraform and Pulumi.",
        "stage": "INFRASTRUCTURE",
        "order": 4,
        "estimatedHours": 45,
        "prerequisites": [
          "do-net",
          "do-script"
        ],
        "skills": [
          "Infrastructure as Code",
          "Terraform",
          "Pulumi"
        ],
        "learningObjectives": [
          "Write Terraform configurations to provision resources",
          "Manage infrastructure state securely",
          "Modularize infrastructure code"
        ],
        "topics": [
          "Terraform",
          "Pulumi",
          "State Management",
          "Infrastructure Modules",
          "Declarative Provisioning"
        ],
        "practicalExercise": "Use Terraform to deploy a VPC, subnets, and an EC2 instance in AWS, storing state in an S3 bucket.",
        "recommendedBookTitle": "Terraform: Up & Running",
        "recommendedBookAuthor": "Yevgeniy Brikman",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/terraform-up/9781098116736/",
        "recommendedBookDescription": "The industry standard book for mastering infrastructure as code using Terraform, covering state management and modules.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-config",
        "videoTitle": "Ansible Tutorial for Beginners",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=1id6IGBpe6s",
        "videoDescription": "Get started with infrastructure configuration using Ansible.",
        "videoDuration": "PT2H",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Configuration Management",
        "description": "Automate the configuration and setup of servers and software using configuration management tools.",
        "stage": "INFRASTRUCTURE",
        "order": 5,
        "estimatedHours": 30,
        "prerequisites": [
          "do-iac"
        ],
        "skills": [
          "Configuration Management",
          "Ansible"
        ],
        "learningObjectives": [
          "Write Ansible playbooks for server configuration",
          "Manage inventory and variables",
          "Ensure idempotent system state"
        ],
        "topics": [
          "Ansible",
          "Playbooks",
          "Idempotence",
          "Inventory Management",
          "Roles"
        ],
        "practicalExercise": "Create an Ansible playbook to install, configure, and secure an Nginx web server across multiple nodes.",
        "recommendedBookTitle": "Ansible for DevOps",
        "recommendedBookAuthor": "Jeff Geerling",
        "recommendedBookUrl": "https://www.ansiblefordevops.com/",
        "recommendedBookDescription": "The most widely recommended guide for learning Ansible configuration management and automation in a DevOps environment.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-docker",
        "videoTitle": "Docker Tutorial for Beginners",
        "videoInstructor": "Programming with Mosh",
        "videoUrl": "https://www.youtube.com/watch?v=pTFZFxd4hOI",
        "videoDescription": "A fast-paced introduction to Docker, containerization, writing Dockerfiles, and using Docker Compose.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Containers",
        "description": "Package applications and their dependencies into standardized containers for consistent deployment.",
        "stage": "CONTAINERS",
        "order": 6,
        "estimatedHours": 25,
        "prerequisites": [
          "do-config"
        ],
        "skills": [
          "Docker",
          "Containers"
        ],
        "learningObjectives": [
          "Write Dockerfiles to containerize applications",
          "Manage multi-container setups with Docker Compose",
          "Optimize image sizes and security"
        ],
        "topics": [
          "Docker",
          "Containers",
          "Docker Compose",
          "Image Optimization",
          "Container Runtimes"
        ],
        "practicalExercise": "Containerize a Node.js application, optimize the Dockerfile with multi-stage builds, and deploy it using Docker Compose alongside a Redis container.",
        "recommendedBookTitle": "Docker Deep Dive",
        "recommendedBookAuthor": "Nigel Poulton",
        "recommendedBookUrl": "https://nigelpoulton.com/books/docker-deep-dive/",
        "recommendedBookDescription": "A comprehensive and frequently updated guide to Docker containerization, image optimization, and container internals.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-k8s",
        "videoTitle": "Kubernetes Course - Full Beginners Tutorial",
        "videoInstructor": "FreeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=X48VuDVv0do",
        "videoDescription": "An in-depth course on Kubernetes administration, deploying pods, services, and managing container orchestration.",
        "videoDuration": "4:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Kubernetes Administration",
        "description": "Orchestrate containerized applications at scale using Kubernetes for high availability and resilient operations.",
        "stage": "CONTAINERS",
        "order": 7,
        "estimatedHours": 55,
        "prerequisites": [
          "do-docker"
        ],
        "skills": [
          "Kubernetes",
          "Container Orchestration"
        ],
        "learningObjectives": [
          "Deploy applications using Kubernetes Deployments and Pods",
          "Configure Services and Ingress for network routing",
          "Manage cluster resources and RBAC"
        ],
        "topics": [
          "Kubernetes",
          "Pods & Deployments",
          "Services & Ingress",
          "StatefulSets",
          "RBAC"
        ],
        "practicalExercise": "Deploy a scalable microservice architecture on a local Minikube cluster, complete with ConfigMaps and an Ingress controller.",
        "recommendedBookTitle": "Kubernetes: Up and Running",
        "recommendedBookAuthor": "Kelsey Hightower, Brendan Burns, Joe Beda",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/",
        "recommendedBookDescription": "Written by the creators of Kubernetes, it provides the most authoritative guide to orchestrating containers.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-mesh",
        "videoTitle": "Istio Service Mesh Crash Course",
        "videoInstructor": "Hussein Nasser",
        "videoUrl": "https://www.youtube.com/watch?v=16fgzlwtwVQ",
        "videoDescription": "Deep dive into Istio and service mesh architecture.",
        "videoDuration": "PT45M",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Service Mesh",
        "description": "Manage and secure microservice communications using service meshes like Istio or Linkerd.",
        "stage": "CONTAINERS",
        "order": 8,
        "estimatedHours": 30,
        "prerequisites": [
          "do-k8s"
        ],
        "skills": [
          "Service Mesh",
          "Istio"
        ],
        "learningObjectives": [
          "Install and configure a service mesh in Kubernetes",
          "Implement mutual TLS between services",
          "Control traffic routing and retries"
        ],
        "topics": [
          "Service Mesh",
          "Istio",
          "mTLS",
          "Traffic Management",
          "Envoy Proxy"
        ],
        "practicalExercise": "Deploy Istio in a Kubernetes cluster to enforce mTLS between two microservices and route 10% of traffic to a canary release.",
        "recommendedBookTitle": "Istio: Up and Running",
        "recommendedBookAuthor": "Lee Calcote, Zack Butcher",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/istio-up-and/9781492043689/",
        "recommendedBookDescription": "Provides a practical, hands-on introduction to service mesh concepts and Istio architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-cicd",
        "videoTitle": "CI/CD Pipelines with GitHub Actions",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=R8_veQiYBjI",
        "videoDescription": "Learn to automate building, testing, and deployment workflows using GitHub Actions CI/CD.",
        "videoDuration": "1:15:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Advanced CI/CD",
        "description": "Build robust continuous integration and continuous deployment pipelines to automate software delivery.",
        "stage": "DELIVERY",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "do-docker"
        ],
        "skills": [
          "CI/CD",
          "GitHub Actions",
          "Jenkins",
          "GitLab CI"
        ],
        "learningObjectives": [
          "Design CI pipelines to build and test code",
          "Automate artifact publishing",
          "Implement safe deployment strategies like blue-green"
        ],
        "topics": [
          "CI/CD Pipelines",
          "GitHub Actions",
          "GitLab CI",
          "Deployment Strategies",
          "Artifact Management"
        ],
        "practicalExercise": "Create a GitHub Actions workflow that runs unit tests, builds a Docker image, and pushes it to a registry on every merge to main.",
        "recommendedBookTitle": "Continuous Delivery",
        "recommendedBookAuthor": "Jez Humble, David Farley",
        "recommendedBookUrl": "https://martinfowler.com/books/continuousDelivery.html",
        "recommendedBookDescription": "The foundational book that defined CI/CD and deployment pipelines for modern software engineering.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-gitops",
        "videoTitle": "GitOps with ArgoCD",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=MeU5_s9T7oM",
        "videoDescription": "Implement GitOps practices for Kubernetes deployments.",
        "videoDuration": "PT40M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "GitOps",
        "description": "Manage infrastructure and application deployments declaratively using Git as the single source of truth.",
        "stage": "DELIVERY",
        "order": 10,
        "estimatedHours": 30,
        "prerequisites": [
          "do-k8s",
          "do-cicd"
        ],
        "skills": [
          "GitOps",
          "ArgoCD"
        ],
        "learningObjectives": [
          "Deploy applications using ArgoCD or Flux",
          "Synchronize cluster state with Git repositories",
          "Implement automated rollback strategies"
        ],
        "topics": [
          "GitOps",
          "ArgoCD",
          "Flux",
          "Declarative Configuration",
          "Continuous Synchronization"
        ],
        "practicalExercise": "Set up ArgoCD to monitor a Git repository containing Kubernetes manifests and automatically apply changes to a cluster.",
        "recommendedBookTitle": "GitOps and Kubernetes",
        "recommendedBookAuthor": "Billy Yuen, Alexander Matyushentsev",
        "recommendedBookUrl": "https://www.manning.com/books/gitops-and-kubernetes",
        "recommendedBookDescription": "Written by the creators of ArgoCD, this book is the definitive guide to implementing declarative GitOps pipelines.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-obs",
        "videoTitle": "Prometheus and Grafana Tutorial",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=h4Sl21AKiDg",
        "videoDescription": "Learn how to implement observability by scraping metrics with Prometheus and visualizing them with Grafana.",
        "videoDuration": "1:35:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Observability",
        "description": "Implement comprehensive monitoring, logging, and tracing to gain deep insights into system behavior.",
        "stage": "RELIABILITY",
        "order": 11,
        "estimatedHours": 40,
        "prerequisites": [
          "do-k8s"
        ],
        "skills": [
          "Observability",
          "Prometheus",
          "Grafana",
          "OpenTelemetry"
        ],
        "learningObjectives": [
          "Configure Prometheus to scrape metrics",
          "Create insightful Grafana dashboards",
          "Implement distributed tracing with OpenTelemetry"
        ],
        "topics": [
          "Observability",
          "Prometheus",
          "Grafana",
          "OpenTelemetry",
          "Log Aggregation"
        ],
        "practicalExercise": "Instrument a sample application with OpenTelemetry, collect metrics using Prometheus, and visualize system latency in Grafana.",
        "recommendedBookTitle": "Prometheus: Up & Running",
        "recommendedBookAuthor": "Brian Brazil",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/prometheus-up/9781492034137/",
        "recommendedBookDescription": "An authoritative guide to modern observability, metrics, and alerting by a core Prometheus developer.",
        "resourceType": "BOOK"
      },
      {
        "key": "do-sre",
        "videoTitle": "What is Site Reliability Engineering?",
        "videoInstructor": "Google Cloud Tech",
        "videoUrl": "https://www.youtube.com/watch?v=uTEL8Ff1Zvk",
        "videoDescription": "Official video from Google explaining SRE culture, SLIs, SLOs, and error budgets.",
        "videoDuration": "0:25:00",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Site Reliability Engineering",
        "description": "Apply software engineering practices to system administration to improve system reliability and manage incident response.",
        "stage": "RELIABILITY",
        "order": 12,
        "estimatedHours": 30,
        "prerequisites": [
          "do-obs"
        ],
        "skills": [
          "SRE",
          "Incident Management",
          "Reliability Engineering"
        ],
        "learningObjectives": [
          "Define and track SLIs, SLOs, and SLAs",
          "Manage error budgets for new releases",
          "Conduct blameless post-mortems"
        ],
        "topics": [
          "SRE Principles",
          "SLI/SLO/SLA",
          "Error Budgets",
          "Incident Management",
          "Post-mortems"
        ],
        "practicalExercise": "Define an SLO for a critical user journey, set up alerting for when the error budget is rapidly depleting, and draft a simulated post-mortem report.",
        "recommendedBookTitle": "Site Reliability Engineering",
        "recommendedBookAuthor": "Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff",
        "recommendedBookUrl": "https://sre.google/sre-book/table-of-contents/",
        "recommendedBookDescription": "The seminal book from Google that established the principles, practices, and culture of Site Reliability Engineering.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "observability-sre",
        "title": "Observability & SRE",
        "description": "Establish deep visibility into system health and reliability engineering practices.",
        "learningObjectives": [
          "Instrument applications with metrics, logs, and traces.",
          "Define and measure SLIs, SLOs, and SLAs.",
          "Configure automated alerting rules and dashboards."
        ],
        "topics": [
          "Metrics",
          "Logs",
          "Distributed Tracing",
          "SLIs & SLOs",
          "Prometheus",
          "Grafana",
          "OpenTelemetry"
        ],
        "practicalExercise": "Instrument a Python service with OpenTelemetry and visualize the traces in Jaeger.",
        "skills": [
          "Prometheus",
          "OpenTelemetry",
          "SRE"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Site Reliability Engineering",
        "recommendedBookAuthor": "Niall Richard Murphy et al.",
        "recommendedBookUrl": "https://sre.google/sre-book/table-of-contents/",
        "recommendedBookDescription": "How Google runs production systems, foundational for modern DevOps/SRE.",
        "resourceType": "BOOK",
        "videoTitle": "What is Site Reliability Engineering?",
        "videoInstructor": "Google Cloud",
        "videoUrl": "https://www.youtube.com/watch?v=uTEL8Ff1Zvk",
        "videoDescription": "An introduction to the core principles of SRE.",
        "videoDuration": "10m",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL"
      }
    ]
  },
  {
    "title": "Network Engineering",
    "slug": "network-engineering",
    "description": "Design, implement, and manage complex physical and virtual networks.",
    "category": "Infrastructure",
    "difficulty": "Intermediate",
    "estimatedHours": 400,
    "nodes": [
      {
        "key": "nw-fund",
        "videoTitle": "Computer Networking Full Course",
        "videoInstructor": "NetworkChuck",
        "videoUrl": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
        "videoDescription": "A fun and engaging introduction to computer networking, OSI models, and Ethernet.",
        "videoDuration": "1:45:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Network Fundamentals",
        "description": "Master the foundational concepts of computer networking, including protocol models and data transmission.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "Computer Networking",
          "TCP/IP",
          "Ethernet"
        ],
        "learningObjectives": [
          "Explain the layers of the OSI and TCP/IP models",
          "Analyze packet encapsulation at each layer",
          "Understand MAC addressing and Ethernet frames"
        ],
        "topics": [
          "OSI Model",
          "TCP/IP Model",
          "Ethernet",
          "MAC Addressing",
          "Packet Encapsulation"
        ],
        "practicalExercise": "Use Wireshark to capture and analyze local network traffic, identifying MAC addresses and observing the TCP three-way handshake.",
        "recommendedBookTitle": "Computer Networking: A Top-Down Approach",
        "recommendedBookAuthor": "James Kurose, Keith Ross",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003333/9780136681557",
        "recommendedBookDescription": "The most widely used and respected academic textbook for learning foundational networking concepts.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-media",
        "videoTitle": "Fiber Optic Cabling Tutorial",
        "videoInstructor": "Fiber Optic Association",
        "videoUrl": "https://www.youtube.com/watch?v=0MwMkCG_vlI",
        "videoDescription": "Learn about network media and physical layer components.",
        "videoDuration": "PT25M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Network Media & Hardware",
        "description": "Evaluate and select appropriate physical media and networking hardware for enterprise environments.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 20,
        "prerequisites": [
          "nw-fund"
        ],
        "skills": [
          "Networking Hardware",
          "Fiber Optics"
        ],
        "learningObjectives": [
          "Differentiate between types of copper and fiber cabling",
          "Select appropriate switches and routers for specific use cases",
          "Understand physical layer signaling"
        ],
        "topics": [
          "Fiber Optics",
          "Copper Cabling",
          "Switches",
          "Routers",
          "Physical Layer"
        ],
        "practicalExercise": "Design a physical network layout for a small office, selecting appropriate cabling types and switch specifications for optimal performance.",
        "recommendedBookTitle": "Cabling: The Complete Guide to Copper and Fiber-Optic Networking",
        "recommendedBookAuthor": "Andrew Oliviero, Bill Woodward",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Cabling:+The+Complete+Guide+to+Copper+and+Fiber-Optic+Networking,+5th+Edition-p-9781118807323",
        "recommendedBookDescription": "An authoritative guide covering the physical layer, copper, and fiber-optic cabling standards for enterprise networks.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-switch",
        "videoTitle": "VLANs and Spanning Tree Protocol",
        "videoInstructor": "Jeremy's IT Lab",
        "videoUrl": "https://www.youtube.com/watch?v=g34QN5eiEYI",
        "videoDescription": "Detailed overview of Switching concepts and VLANs.",
        "videoDuration": "PT40M",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Switching & VLANs",
        "description": "Design and configure Layer 2 network topologies using switching technologies and VLANs.",
        "stage": "LAYER 2",
        "order": 3,
        "estimatedHours": 35,
        "prerequisites": [
          "nw-media"
        ],
        "skills": [
          "Switching",
          "VLANs",
          "Spanning Tree Protocol"
        ],
        "learningObjectives": [
          "Configure VLANs for network segmentation",
          "Implement Spanning Tree Protocol (STP) to prevent loops",
          "Configure trunking and inter-VLAN routing"
        ],
        "topics": [
          "Switching",
          "VLANs",
          "Spanning Tree Protocol (STP)",
          "Trunking (802.1Q)",
          "Layer 2 Security"
        ],
        "practicalExercise": "Configure multiple VLANs across two interconnected switches, ensuring proper trunking and STP configuration to prevent broadcast loops.",
        "recommendedBookTitle": "CCNA 200-301 Official Cert Guide",
        "recommendedBookAuthor": "Wendell Odom",
        "recommendedBookUrl": "https://www.ciscopress.com/store/ccna-200-301-official-cert-guide-volume-1-9780135792735",
        "recommendedBookDescription": "The definitive Cisco guide to mastering Layer 2 switching, VLANs, and Spanning Tree Protocol.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "nw-ip",
        "videoTitle": "Subnetting Mastery",
        "videoInstructor": "Practical Networking",
        "videoUrl": "https://www.youtube.com/watch?v=s_Ntt6eTN94",
        "videoDescription": "Master IP addressing and subnetting easily.",
        "videoDuration": "PT30M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "IP Addressing & Subnetting",
        "description": "Plan and implement scalable IP addressing schemes using IPv4 subnetting and IPv6.",
        "stage": "LAYER 3",
        "order": 4,
        "estimatedHours": 30,
        "prerequisites": [
          "nw-fund"
        ],
        "skills": [
          "IP Addressing",
          "Subnetting",
          "IPv6"
        ],
        "learningObjectives": [
          "Calculate subnets using CIDR notation",
          "Design hierarchical IP addressing plans",
          "Configure basic IPv6 networking"
        ],
        "topics": [
          "IPv4",
          "Subnetting",
          "CIDR",
          "IPv6",
          "DHCP"
        ],
        "practicalExercise": "Given a large IP block, design a subnetting scheme for 5 different departments, allocating appropriate host capacities for each.",
        "recommendedBookTitle": "IPv6 Fundamentals",
        "recommendedBookAuthor": "Rick Graziani",
        "recommendedBookUrl": "https://www.ciscopress.com/store/ipv6-fundamentals-a-straightforward-approach-to-understanding-9781587144776",
        "recommendedBookDescription": "An essential and clear resource for mastering IP addressing, CIDR, and the transition to IPv6.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-route",
        "videoTitle": "BGP Routing Protocol Tutorial",
        "videoInstructor": "Kevin Wallace Training",
        "videoUrl": "https://www.youtube.com/watch?v=3R-zS7v8BEE",
        "videoDescription": "Understanding advanced routing protocols like BGP.",
        "videoDuration": "PT1H10M",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Routing Protocols",
        "description": "Implement and troubleshoot dynamic routing protocols to enable communication across complex networks.",
        "stage": "LAYER 3",
        "order": 5,
        "estimatedHours": 50,
        "prerequisites": [
          "nw-ip",
          "nw-switch"
        ],
        "skills": [
          "Routing",
          "OSPF",
          "BGP"
        ],
        "learningObjectives": [
          "Configure OSPF for interior gateway routing",
          "Understand BGP fundamentals for exterior routing",
          "Troubleshoot routing loops and metric issues"
        ],
        "topics": [
          "OSPF",
          "BGP",
          "Dynamic Routing",
          "Static Routing",
          "Route Redistribution"
        ],
        "practicalExercise": "Configure a multi-area OSPF network in a simulated environment, verifying routing tables and connectivity between disparate networks.",
        "recommendedBookTitle": "Routing TCP/IP, Volume 1",
        "recommendedBookAuthor": "Jeff Doyle",
        "recommendedBookUrl": "https://www.ciscopress.com/store/routing-tcp-ip-volume-1-9781587052026",
        "recommendedBookDescription": "The industry standard reference for understanding interior routing protocols like OSPF and EIGRP.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-wireless",
        "videoTitle": "Enterprise Wireless Networking",
        "videoInstructor": "Cisco",
        "videoUrl": "https://www.youtube.com/watch?v=mD_sY588k_M",
        "videoDescription": "Principles of designing enterprise wireless networks.",
        "videoDuration": "PT50M",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE",
        "title": "Wireless Networking",
        "description": "Design, deploy, and secure enterprise wireless networks based on 802.11 standards.",
        "stage": "ADVANCED TECHNOLOGIES",
        "order": 6,
        "estimatedHours": 30,
        "prerequisites": [
          "nw-switch"
        ],
        "skills": [
          "Wireless Networking",
          "Wi-Fi"
        ],
        "learningObjectives": [
          "Plan wireless coverage considering RF propagation",
          "Configure enterprise wireless controllers and APs",
          "Implement secure wireless authentication (WPA3/802.1X)"
        ],
        "topics": [
          "802.11 Standards",
          "RF Fundamentals",
          "Wireless Controllers",
          "WPA3",
          "Wireless Roaming"
        ],
        "practicalExercise": "Perform a simulated RF site survey to determine optimal access point placement for a floor plan to ensure overlapping coverage without interference.",
        "recommendedBookTitle": "CWNA Certified Wireless Network Administrator Study Guide",
        "recommendedBookAuthor": "David D. Coleman, David A. Westcott",
        "recommendedBookUrl": "https://www.wiley.com/en-us/CWNA+Certified+Wireless+Network+Administrator+Study+Guide,+6th+Edition-p-9781119734208",
        "recommendedBookDescription": "The most comprehensive and authoritative text on enterprise 802.11 wireless networking and RF fundamentals.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-sec",
        "videoTitle": "Firewalls and VPNs Explained",
        "videoInstructor": "PowerCert Animated Videos",
        "videoUrl": "https://www.youtube.com/watch?v=kDEX1HXybrU",
        "videoDescription": "A clear, animated explanation of stateful firewalls, IPSec VPNs, and network security concepts.",
        "videoDuration": "0:45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Network Security",
        "description": "Protect network infrastructure from unauthorized access and attacks using firewalls, VPNs, and ACLs.",
        "stage": "SECURITY",
        "order": 7,
        "estimatedHours": 45,
        "prerequisites": [
          "nw-route"
        ],
        "skills": [
          "Network Security",
          "Firewalls",
          "VPNs"
        ],
        "learningObjectives": [
          "Implement Access Control Lists (ACLs) to filter traffic",
          "Configure stateful firewalls",
          "Set up secure IPSec VPN tunnels"
        ],
        "topics": [
          "Firewalls",
          "IPSec VPNs",
          "Access Control Lists (ACLs)",
          "Network Segmentation",
          "Intrusion Prevention Systems (IPS)"
        ],
        "practicalExercise": "Configure a site-to-site IPSec VPN between two branch office routers, ensuring encrypted communication for internal subnets.",
        "recommendedBookTitle": "Network Security Technologies and Solutions",
        "recommendedBookAuthor": "Yusuf Bhaiji",
        "recommendedBookUrl": "https://www.ciscopress.com/store/network-security-technologies-and-solutions-ccie-professional-9781587052460",
        "recommendedBookDescription": "A deep dive into securing network infrastructures with firewalls, VPNs, and Access Control Lists.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-voip",
        "videoTitle": "Understanding VoIP and SIP",
        "videoInstructor": "3CX",
        "videoUrl": "https://www.youtube.com/watch?v=Vl03qGvS2b4",
        "videoDescription": "Foundations of Voice over IP and SIP protocols.",
        "videoDuration": "PT30M",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Voice over IP (VoIP)",
        "description": "Deploy and manage Voice over IP networks, ensuring call quality and reliable signaling.",
        "stage": "ADVANCED TECHNOLOGIES",
        "order": 8,
        "estimatedHours": 25,
        "prerequisites": [
          "nw-route"
        ],
        "skills": [
          "VoIP",
          "SIP",
          "QoS"
        ],
        "learningObjectives": [
          "Understand SIP signaling and RTP media streams",
          "Configure Quality of Service (QoS) for voice traffic",
          "Troubleshoot common VoIP issues like jitter and latency"
        ],
        "topics": [
          "VoIP",
          "SIP",
          "RTP",
          "Quality of Service (QoS)",
          "Voice Gateways"
        ],
        "practicalExercise": "Configure QoS policies on a router to prioritize VoIP traffic (RTP) over standard HTTP data to minimize latency during congestion.",
        "recommendedBookTitle": "SIP: Understanding the Session Initiation Protocol",
        "recommendedBookAuthor": "Alan B. Johnston",
        "recommendedBookUrl": "https://us.artechhouse.com/SIP-Understanding-the-Session-Initiation-Protocol-Fourth-Edition-P1778.aspx",
        "recommendedBookDescription": "The definitive guide to understanding SIP, RTP, and VoIP architectures for network engineers.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-cloud",
        "videoTitle": "AWS Networking Fundamentals",
        "videoInstructor": "A Cloud Guru",
        "videoUrl": "https://www.youtube.com/watch?v=L5uUvJb8F5U",
        "videoDescription": "Introduction to cloud networking and VPCs on AWS.",
        "videoDuration": "PT55M",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Cloud Networking",
        "description": "Architect and manage virtual networks within public cloud environments like AWS and Azure.",
        "stage": "MODERN NETWORKING",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "nw-route"
        ],
        "skills": [
          "Cloud Networking",
          "AWS Networking"
        ],
        "learningObjectives": [
          "Design secure Virtual Private Clouds (VPCs)",
          "Configure cloud routing and security groups",
          "Implement hybrid connectivity (e.g., Direct Connect)"
        ],
        "topics": [
          "Cloud Networking",
          "VPC",
          "Security Groups",
          "Cloud Routers",
          "Hybrid Cloud Connectivity"
        ],
        "practicalExercise": "Deploy an AWS VPC with public and private subnets, configuring a NAT Gateway and route tables to allow outbound internet access for private resources.",
        "recommendedBookTitle": "AWS Certified Advanced Networking Official Study Guide",
        "recommendedBookAuthor": "Sidhartha Chauhan",
        "recommendedBookUrl": "https://www.wiley.com/en-us/AWS+Certified+Advanced+Networking+Official+Study+Guide:+Specialty+Exam-p-9781119439837",
        "recommendedBookDescription": "The official guide to designing and managing complex virtual networks and hybrid connectivity in AWS.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "nw-auto",
        "videoTitle": "Network Automation with Python",
        "videoInstructor": "David Bombal",
        "videoUrl": "https://www.youtube.com/watch?v=O1mDq-k4V4A",
        "videoDescription": "Learn how to automate network configurations using Python.",
        "videoDuration": "PT1H30M",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Network Automation",
        "description": "Automate network provisioning, configuration, and monitoring using programming and configuration tools.",
        "stage": "MODERN NETWORKING",
        "order": 10,
        "estimatedHours": 40,
        "prerequisites": [
          "nw-route"
        ],
        "skills": [
          "Network Automation",
          "Python",
          "Ansible"
        ],
        "learningObjectives": [
          "Write Python scripts using Netmiko to configure devices",
          "Automate network deployments with Ansible",
          "Interact with network device APIs"
        ],
        "topics": [
          "Network Automation",
          "Python",
          "Netmiko",
          "Ansible",
          "REST APIs for Networking"
        ],
        "practicalExercise": "Write a Python script that connects to multiple routers via SSH, backs up their running configurations, and saves them to a version control repository.",
        "recommendedBookTitle": "Network Programmability and Automation",
        "recommendedBookAuthor": "Jason Edelman, Scott S. Lowe, Matt Oswalt",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/network-programmability-and/9781491931240/",
        "recommendedBookDescription": "The fundamental book for network engineers transitioning to software-driven automation using Python, Ansible, and APIs.",
        "resourceType": "BOOK"
      },
      {
        "key": "nw-sdn",
        "videoTitle": "What is Software Defined Networking (SDN)?",
        "videoInstructor": "IBM Technology",
        "videoUrl": "https://www.youtube.com/watch?v=Z58XjC5QWEE",
        "videoDescription": "An official explanation of SDN concepts from IBM.",
        "videoDuration": "PT8M",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Software Defined Networking",
        "description": "Modernize network architecture by decoupling the control plane from the data plane using SDN technologies.",
        "stage": "MODERN NETWORKING",
        "order": 11,
        "estimatedHours": 40,
        "prerequisites": [
          "nw-auto",
          "nw-sec"
        ],
        "skills": [
          "SDN",
          "SD-WAN",
          "OpenFlow"
        ],
        "learningObjectives": [
          "Understand the architecture of Software Defined Networks",
          "Implement SD-WAN solutions for branch connectivity",
          "Configure network controllers using OpenFlow"
        ],
        "topics": [
          "SDN Architecture",
          "SD-WAN",
          "OpenFlow",
          "Network Controllers",
          "Network Virtualization"
        ],
        "practicalExercise": "Deploy a basic SDN controller environment (e.g., Mininet) to dynamically route traffic between virtual hosts based on controller policies.",
        "recommendedBookTitle": "Software Defined Networks: A Comprehensive Approach",
        "recommendedBookAuthor": "Paul Goransson, Chuck Black, Timothy Culver",
        "recommendedBookUrl": "https://www.elsevier.com/books/software-defined-networks/goransson/978-0-12-804555-8",
        "recommendedBookDescription": "An authoritative look at SDN architecture, OpenFlow, and the decoupling of the control and data planes.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "Embedded Systems",
    "slug": "embedded-systems",
    "description": "Program microcontrollers, real-time operating systems, and hardware interfaces.",
    "category": "Engineering",
    "difficulty": "Advanced",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "em-c",
        "videoTitle": "C Programming for Embedded Systems",
        "videoInstructor": "FastBit Embedded Brain Academy",
        "videoUrl": "https://www.youtube.com/watch?v=O1mDq-k4V4A",
        "videoDescription": "Learn C programming tailored for hardware interaction.",
        "videoDuration": "PT2H",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "C Programming for Embedded",
        "description": "Master C programming tailored for resource-constrained embedded systems, focusing on low-level memory and hardware access.",
        "stage": "PROGRAMMING",
        "order": 1,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "C",
          "C++",
          "Memory Management"
        ],
        "learningObjectives": [
          "Perform advanced bit manipulation",
          "Manage pointers and memory safely",
          "Use volatile keywords for hardware registers"
        ],
        "topics": [
          "C Programming",
          "Bit Manipulation",
          "Pointers & Memory",
          "Volatile Variables",
          "Structs & Unions"
        ],
        "practicalExercise": "Write a C program to read and write directly to memory-mapped hardware registers, utilizing bitwise operators to toggle specific GPIO pins.",
        "recommendedBookTitle": "Making Embedded Systems",
        "recommendedBookAuthor": "Elecia White",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/",
        "recommendedBookDescription": "A highly acclaimed guide to writing optimized C code for resource-constrained microcontrollers.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-circuits",
        "videoTitle": "Basic Electronics Course",
        "videoInstructor": "The Engineering Mindset",
        "videoUrl": "https://www.youtube.com/watch?v=mc979OhitAg",
        "videoDescription": "An intuitive visual guide to voltage, current, Ohm's law, and passive components for beginners.",
        "videoDuration": "2:10:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Basic Electronics",
        "description": "Understand foundational electronic principles required to interface microcontrollers with real-world hardware.",
        "stage": "HARDWARE",
        "order": 2,
        "estimatedHours": 30,
        "prerequisites": [],
        "skills": [
          "Circuit Design",
          "Electronics"
        ],
        "learningObjectives": [
          "Apply Ohm's and Kirchhoff's laws",
          "Analyze basic resistor and capacitor circuits",
          "Read and interpret electronic schematics"
        ],
        "topics": [
          "Voltage & Current",
          "Ohm's Law",
          "Passive Components",
          "Circuit Schematics",
          "Basic Electronics"
        ],
        "practicalExercise": "Design and calculate resistor values for a simple LED driver circuit and a voltage divider for an ADC input.",
        "recommendedBookTitle": "Practical Electronics for Inventors",
        "recommendedBookAuthor": "Paul Scherz, Simon Monk",
        "recommendedBookUrl": "https://www.mhprofessional.com/practical-electronics-for-inventors-fourth-edition-9781259587542-usa",
        "recommendedBookDescription": "An excellent, intuitive introduction to basic electronics, Ohm's law, and passive components.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-arch",
        "videoTitle": "8051 Microcontroller Architecture",
        "videoInstructor": "NPTEL",
        "videoUrl": "https://www.youtube.com/watch?v=kY31R97w_kE",
        "videoDescription": "A detailed lecture series covering the fundamentals of the 8051 microcontroller.",
        "videoDuration": "55:10",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Microcontroller Architecture",
        "description": "Explore the internal architecture of microcontrollers, including CPUs, memory, and interrupt systems.",
        "stage": "HARDWARE",
        "order": 3,
        "estimatedHours": 45,
        "prerequisites": [
          "em-c",
          "em-circuits"
        ],
        "skills": [
          "Microcontrollers",
          "Computer Architecture",
          "ARM"
        ],
        "learningObjectives": [
          "Understand ARM Cortex-M architecture",
          "Configure system clocks and timers",
          "Implement interrupt service routines (ISRs)"
        ],
        "topics": [
          "Microcontroller Architecture",
          "ARM Cortex",
          "Registers",
          "Interrupts & Exceptions",
          "Clock Systems"
        ],
        "practicalExercise": "Configure a microcontroller's timer peripheral to generate periodic interrupts, toggling an LED within the ISR.",
        "recommendedBookTitle": "The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors",
        "recommendedBookAuthor": "Joseph Yiu",
        "recommendedBookUrl": "https://www.elsevier.com/books/the-definitive-guide-to-arm-cortex-m3-and-cortex-m4-processors/yiu/978-0-12-408082-9",
        "recommendedBookDescription": "The absolute reference for understanding ARM microcontroller architecture, registers, and interrupts.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-io",
        "videoTitle": "Embedded Peripherals: GPIO, ADC, PWM",
        "videoInstructor": "Phil's Lab",
        "videoUrl": "https://www.youtube.com/watch?v=Kz6qSjM3a-s",
        "videoDescription": "Detailed tutorial on handling embedded I/O and peripherals.",
        "videoDuration": "PT45M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Peripherals & I/O",
        "description": "Interface microcontrollers with external components using analog and digital I/O peripherals.",
        "stage": "HARDWARE",
        "order": 4,
        "estimatedHours": 35,
        "prerequisites": [
          "em-arch"
        ],
        "skills": [
          "Hardware Interfaces",
          "Digital Electronics"
        ],
        "learningObjectives": [
          "Configure GPIO pins for input and output",
          "Sample analog signals using ADCs",
          "Generate analog-like signals using PWM"
        ],
        "topics": [
          "GPIO",
          "Analog-to-Digital Converters (ADC)",
          "Pulse Width Modulation (PWM)",
          "Digital I/O",
          "Hardware Interfacing"
        ],
        "practicalExercise": "Write firmware to read a variable voltage from a potentiometer using an ADC and map that value to adjust the brightness of an LED using PWM.",
        "recommendedBookTitle": "Embedded Systems: Introduction to Arm Cortex-M Microcontrollers",
        "recommendedBookAuthor": "Jonathan W. Valvano",
        "recommendedBookUrl": "http://users.ece.utexas.edu/~valvano/arm/",
        "recommendedBookDescription": "A university-level text that masterfully explains hardware interfacing, ADCs, and digital I/O.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-comm",
        "videoTitle": "UART, SPI, and I2C Explained",
        "videoInstructor": "GreatScott!",
        "videoUrl": "https://www.youtube.com/watch?v=lyeK38bA72M",
        "videoDescription": "Explanation of common hardware communication protocols.",
        "videoDuration": "PT10M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Communication Protocols",
        "description": "Implement standard embedded communication protocols to exchange data with sensors and other microcontrollers.",
        "stage": "PROTOCOLS",
        "order": 5,
        "estimatedHours": 45,
        "prerequisites": [
          "em-io"
        ],
        "skills": [
          "UART",
          "SPI",
          "I2C",
          "CAN Bus"
        ],
        "learningObjectives": [
          "Configure UART for serial communication",
          "Interface with sensors via I2C and SPI",
          "Understand CAN bus for automotive/industrial applications"
        ],
        "topics": [
          "UART",
          "SPI",
          "I2C",
          "CAN Bus",
          "Serial Communication"
        ],
        "practicalExercise": "Develop a driver to read temperature and humidity data from an external sensor over the I2C bus and transmit the readings via UART to a PC.",
        "recommendedBookTitle": "Serial Port Complete",
        "recommendedBookAuthor": "Jan Axelson",
        "recommendedBookUrl": "http://janaxelson.com/spc.htm",
        "recommendedBookDescription": "The go-to reference for implementing UART and other serial communication protocols in embedded systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-rtos",
        "videoTitle": "FreeRTOS Tutorial",
        "videoInstructor": "Digi-Key",
        "videoUrl": "https://www.youtube.com/watch?v=F321087yYy4",
        "videoDescription": "An excellent introductory series to Real-Time Operating Systems and FreeRTOS concepts.",
        "videoDuration": "1:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Real-Time Operating Systems",
        "description": "Develop deterministic, multitasking firmware using Real-Time Operating Systems.",
        "stage": "SYSTEMS",
        "order": 6,
        "estimatedHours": 55,
        "prerequisites": [
          "em-comm"
        ],
        "skills": [
          "RTOS",
          "Concurrency",
          "Operating Systems"
        ],
        "learningObjectives": [
          "Create and manage RTOS tasks",
          "Implement task synchronization using semaphores and mutexes",
          "Analyze and resolve priority inversion"
        ],
        "topics": [
          "RTOS",
          "Task Scheduling",
          "Semaphores & Mutexes",
          "Inter-Task Communication",
          "Concurrency"
        ],
        "practicalExercise": "Build a FreeRTOS application with three tasks: reading a sensor, processing the data, and blinking a status LED, ensuring thread-safe data passing.",
        "recommendedBookTitle": "Mastering the FreeRTOS Real Time Kernel",
        "recommendedBookAuthor": "Richard Barry",
        "recommendedBookUrl": "https://www.freertos.org/Documentation/RTOS_book.html",
        "recommendedBookDescription": "The official guide written by the creator of FreeRTOS, covering tasks, semaphores, and concurrency.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "em-linux",
        "videoTitle": "Introduction to Embedded Linux",
        "videoInstructor": "Digi-Key Electronics",
        "videoUrl": "https://www.youtube.com/watch?v=1uR6e_m3u1E",
        "videoDescription": "A solid introduction to Embedded Linux and Buildroot.",
        "videoDuration": "PT1H15M",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Embedded Linux",
        "description": "Deploy and customize Linux operating systems for embedded devices using tools like Yocto or Buildroot.",
        "stage": "SYSTEMS",
        "order": 7,
        "estimatedHours": 60,
        "prerequisites": [
          "em-arch"
        ],
        "skills": [
          "Embedded Linux",
          "Linux Kernel",
          "Yocto"
        ],
        "learningObjectives": [
          "Configure U-Boot bootloaders",
          "Compile custom Linux kernels and device tree overlays",
          "Build custom root filesystems using Yocto Project"
        ],
        "topics": [
          "Embedded Linux",
          "U-Boot",
          "Linux Kernel",
          "Device Trees",
          "Yocto / Buildroot"
        ],
        "practicalExercise": "Use Buildroot to create a minimal bootable embedded Linux image for a Raspberry Pi or BeagleBone, including a custom user-space application.",
        "recommendedBookTitle": "Mastering Embedded Linux Programming",
        "recommendedBookAuthor": "Chris Simmonds",
        "recommendedBookUrl": "https://www.packtpub.com/product/mastering-embedded-linux-programming-third-edition/9781789530384",
        "recommendedBookDescription": "A comprehensive guide to building custom Linux systems using Yocto, U-Boot, and the Linux kernel.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-iot",
        "videoTitle": "Introduction to Internet of Things",
        "videoInstructor": "Prof. Sudip Misra",
        "videoUrl": "https://www.youtube.com/watch?v=UrwbeOllc68",
        "videoDescription": "NPTEL lecture on IoT fundamentals and embedded connectivity.",
        "videoDuration": "40:15",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Embedded IoT",
        "description": "Connect embedded systems to the internet, implementing wireless protocols and secure data transmission.",
        "stage": "ADVANCED",
        "order": 8,
        "estimatedHours": 45,
        "prerequisites": [
          "em-rtos"
        ],
        "skills": [
          "IoT",
          "MQTT",
          "BLE",
          "Embedded Security"
        ],
        "learningObjectives": [
          "Configure Wi-Fi and Bluetooth Low Energy (BLE) stacks",
          "Publish and subscribe to data using MQTT",
          "Implement secure boot and TLS for IoT devices"
        ],
        "topics": [
          "IoT Connectivity",
          "BLE",
          "MQTT",
          "Wi-Fi for Embedded",
          "Embedded Security"
        ],
        "practicalExercise": "Develop firmware for an ESP32 to securely connect to an MQTT broker over Wi-Fi and publish telemetry data using TLS encryption.",
        "recommendedBookTitle": "Building the Internet of Things",
        "recommendedBookAuthor": "Maciej Kranz",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Building+the+Internet+of+Things:+Implement+New+Business+Models,+Disrupt+Competitors,+Transform+Your+Industry-p-9781119285663",
        "recommendedBookDescription": "Provides deep insights into IoT connectivity, protocols like MQTT, and embedded security.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-power",
        "videoTitle": "Low Power Microcontroller Design",
        "videoInstructor": "Texas Instruments",
        "videoUrl": "https://www.youtube.com/watch?v=Zf_xHlE56s8",
        "videoDescription": "Official TI training on low power embedded system design techniques.",
        "videoDuration": "35:10",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Low Power Design",
        "description": "Optimize embedded system designs for minimal power consumption in battery-operated devices.",
        "stage": "ADVANCED",
        "order": 9,
        "estimatedHours": 30,
        "prerequisites": [
          "em-arch"
        ],
        "skills": [
          "Low Power Design",
          "Hardware Optimization"
        ],
        "learningObjectives": [
          "Implement microcontroller sleep modes",
          "Profile and measure system power consumption",
          "Optimize firmware loops for low energy utilization"
        ],
        "topics": [
          "Low Power Design",
          "Sleep Modes",
          "Power Profiling",
          "Battery Optimization",
          "Energy Harvesting"
        ],
        "practicalExercise": "Refactor a polling-based sensor application to use deep sleep modes and wake-on-interrupt, measuring the reduction in average current draw.",
        "recommendedBookTitle": "Low Power Methodology Manual: For System-on-Chip Design",
        "recommendedBookAuthor": "Michael Keating",
        "recommendedBookUrl": "https://link.springer.com/book/10.1007/978-0-387-71819-4",
        "recommendedBookDescription": "An advanced, authoritative methodology manual on designing power-efficient microcontrollers and systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "em-test",
        "videoTitle": "Hardware Debugging and Testing",
        "videoInstructor": "EEVblog",
        "videoUrl": "https://www.youtube.com/watch?v=7M7FqA8G9K8",
        "videoDescription": "EEVblog tutorial on debugging circuits with an oscilloscope.",
        "videoDuration": "25:40",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Hardware Testing & Debugging",
        "description": "Utilize hardware tools to debug complex embedded systems and verify signal integrity.",
        "stage": "ADVANCED",
        "order": 10,
        "estimatedHours": 35,
        "prerequisites": [
          "em-comm"
        ],
        "skills": [
          "Hardware Debugging",
          "JTAG",
          "Oscilloscopes"
        ],
        "learningObjectives": [
          "Use logic analyzers to decode serial buses",
          "Operate oscilloscopes to measure signal timing",
          "Debug firmware using JTAG and SWD interfaces"
        ],
        "topics": [
          "Hardware Debugging",
          "Oscilloscopes",
          "Logic Analyzers",
          "JTAG / SWD",
          "Signal Integrity"
        ],
        "practicalExercise": "Use a logic analyzer to capture and decode an I2C transaction, identifying addressing issues or missing ACK signals on the bus.",
        "recommendedBookTitle": "Debugging: The 9 Indispensable Rules",
        "recommendedBookAuthor": "David J. Agans",
        "recommendedBookUrl": "https://debuggingrules.com/",
        "recommendedBookDescription": "A legendary guide to hardware and software debugging methodologies, essential for embedded testing.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "Robotics Engineering",
    "slug": "robotics-engineering",
    "description": "Design, build, and program autonomous robots and intelligent machines.",
    "category": "Engineering",
    "difficulty": "Advanced",
    "estimatedHours": 500,
    "nodes": [
      {
        "key": "rob-prog",
        "videoTitle": "Programming for Robotics (ROS) - Lecture 1",
        "videoInstructor": "ETH Zurich",
        "videoUrl": "https://www.youtube.com/watch?v=0BxVPCIQnw0",
        "videoDescription": "Covers ROS architecture, master, nodes, topics, and Gazebo.",
        "videoDuration": "45:30",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Programming for Robotics",
        "description": "Write robust, real-time control software using C++ and Python specifically tailored for robotic applications.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 40,
        "prerequisites": [],
        "skills": [
          "C++",
          "Python"
        ],
        "learningObjectives": [
          "Apply OOP principles to robot control software",
          "Manage memory efficiently in C++",
          "Interface Python scripts with C++ libraries",
          "Develop asynchronous logic for sensory processing"
        ],
        "topics": [
          "C++ Memory Management",
          "Python scripting",
          "Real-time constraints",
          "Object-Oriented Programming",
          "Concurrency and Multithreading"
        ],
        "practicalExercise": "Write a C++ class that simulates a motor controller and expose it to a Python test script using Pybind11.",
        "recommendedBookTitle": "Effective C++: 55 Specific Ways to Improve Your Programs and Designs",
        "recommendedBookAuthor": "Scott Meyers",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/effective-c-55-specific-ways-to-improve-your-programs-and-designs/P200000009228/9780321334879",
        "recommendedBookDescription": "A definitive guide to C++ best practices, crucial for writing performant and memory-safe robotics software.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-math",
        "videoTitle": "Linear Algebra for Robotics",
        "videoInstructor": "MIT OpenCourseWare",
        "videoUrl": "https://ocw.mit.edu/courses/res-18-009-learn-differential-equations-up-close-with-gilbert-strang-and-cleve-moler-fall-2015/",
        "videoDescription": "Covers matrix transformations, quaternions, and forward kinematics essentials.",
        "videoDuration": "55:00",
        "videoPlatform": "MIT OCW",
        "videoType": "COURSE",
        "title": "Math for Robotics",
        "description": "Apply linear algebra, calculus, and probability theory to model and solve robotic movement and uncertainty problems.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 45,
        "prerequisites": [
          "rob-prog"
        ],
        "skills": [
          "Linear Algebra",
          "Calculus",
          "Probability"
        ],
        "learningObjectives": [
          "Perform matrix transformations for 3D coordinate mapping",
          "Calculate derivatives for velocity and acceleration",
          "Model sensor noise using probability distributions",
          "Apply Quaternions for 3D rotation"
        ],
        "topics": [
          "Linear Algebra",
          "Calculus",
          "Probability and Statistics",
          "Coordinate Transformations",
          "Quaternions"
        ],
        "practicalExercise": "Compute the end-effector position of a 2-DOF robotic arm given joint angles and link lengths using matrix multiplication.",
        "recommendedBookTitle": "Probabilistic Robotics",
        "recommendedBookAuthor": "Sebastian Thrun, Wolfram Burgard, Dieter Fox",
        "recommendedBookUrl": "http://www.probabilistic-robotics.org/",
        "recommendedBookDescription": "The authoritative textbook on mathematics and algorithms for uncertainty in robotics.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-ros",
        "videoTitle": "Programming for Robotics (ROS) - Lecture 2",
        "videoInstructor": "ETH Zurich",
        "videoUrl": "https://www.youtube.com/watch?v=wX-y0w4wR3c",
        "videoDescription": "Focuses on package structure, C++ client library (roscpp).",
        "videoDuration": "48:20",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "ROS Basics",
        "description": "Build distributed robotic applications using the Robot Operating System (ROS) publish-subscribe architecture.",
        "stage": "FOUNDATIONS",
        "order": 3,
        "estimatedHours": 35,
        "prerequisites": [
          "rob-math"
        ],
        "skills": [
          "ROS",
          "Robotics Middleware"
        ],
        "learningObjectives": [
          "Create ROS nodes in C++ and Python",
          "Design custom ROS messages and services",
          "Visualize sensor data using RViz",
          "Launch multi-node systems using launch files"
        ],
        "topics": [
          "ROS Architecture",
          "Nodes and Master",
          "Topics, Services, and Actions",
          "RViz Visualization",
          "TF (Transform) Tree"
        ],
        "practicalExercise": "Develop a publisher node that simulates lidar data and a subscriber node that filters obstacles closer than 1 meter.",
        "recommendedBookTitle": "Mastering ROS for Robotics Programming",
        "recommendedBookAuthor": "Lentin Joseph",
        "recommendedBookUrl": "https://www.packtpub.com/product/mastering-ros-for-robotics-programming-third-edition/9781801071024",
        "recommendedBookDescription": "A comprehensive guide to learning the Robot Operating System (ROS) for building distributed robotic applications.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-hw",
        "videoTitle": "Introduction to Robotics Hardware",
        "videoInstructor": "MIT OpenCourseWare",
        "videoUrl": "https://www.youtube.com/watch?v=lTzEomPjM5c",
        "videoDescription": "Overview of physical robot components, chassis, and mechanics.",
        "videoDuration": "50:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Robotics Hardware",
        "description": "Integrate microcontrollers, custom circuits, and mechanical components to form the physical foundation of a robot.",
        "stage": "HARDWARE",
        "order": 4,
        "estimatedHours": 35,
        "prerequisites": [],
        "skills": [
          "Microcontrollers",
          "Embedded Systems",
          "Electronics"
        ],
        "learningObjectives": [
          "Select appropriate microcontrollers for real-time tasks",
          "Design power distribution boards for motors and sensors",
          "Interface logic-level components with high-power actuators",
          "Evaluate mechanical constraints for payload limits"
        ],
        "topics": [
          "Microcontroller architecture",
          "Power Electronics",
          "Signal Isolation",
          "Mechanical Enclosures",
          "Thermal Management"
        ],
        "practicalExercise": "Draft a schematic to safely power a Raspberry Pi and four 12V DC motors from a single 3S LiPo battery.",
        "recommendedBookTitle": "Practical Electronics for Inventors",
        "recommendedBookAuthor": "Paul Scherz, Simon Monk",
        "recommendedBookUrl": "https://www.mhprofessional.com/9781259587542-usa-practical-electronics-for-inventors-fourth-edition",
        "recommendedBookDescription": "An excellent, practical guide covering electronics, microcontrollers, and motors for hardware integration.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-sensors",
        "videoTitle": "Sensors and Actuators",
        "videoInstructor": "Prof. Roland Siegwart",
        "videoUrl": "https://www.youtube.com/watch?v=wX-y0w4wR3c",
        "videoDescription": "Lecture on sensors, perception, and actuators in robotics.",
        "videoDuration": "55:30",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Sensors & Actuators",
        "description": "Process and interpret data from diverse sensor modalities to perceive the physical environment.",
        "stage": "HARDWARE",
        "order": 5,
        "estimatedHours": 35,
        "prerequisites": [
          "rob-hw"
        ],
        "skills": [
          "Sensors",
          "Actuators",
          "Hardware Interfaces"
        ],
        "learningObjectives": [
          "Calibrate IMUs to eliminate drift",
          "Extract point clouds from 2D/3D Lidar",
          "Parse encoder ticks into wheel odometry",
          "Integrate range finders for obstacle avoidance"
        ],
        "topics": [
          "Inertial Measurement Units (IMU)",
          "Optical Encoders",
          "Lidar and Radar",
          "Ultrasonic and IR Sensors",
          "Sensor Calibration"
        ],
        "practicalExercise": "Implement a Python script that calculates instantaneous velocity and heading from quadrature encoder pulses.",
        "recommendedBookTitle": "Sensors and Actuators: Engineering System Instrumentation",
        "recommendedBookAuthor": "Clarence W. de Silva",
        "recommendedBookUrl": "https://www.routledge.com/Sensors-and-Actuators-Engineering-System-Instrumentation-Second-Edition/de-Silva/p/book/9781466506817",
        "recommendedBookDescription": "Detailed coverage of modern sensors, actuators, and signal processing for robotic perception.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-kinematics",
        "videoTitle": "Robotics 1: Kinematics and Dynamics",
        "videoInstructor": "Prof. Oussama Khatib",
        "videoUrl": "https://www.youtube.com/watch?v=0yDHzzNqHUA",
        "videoDescription": "Stanford University CS223A introduction to robotics and kinematics.",
        "videoDuration": "1:15:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Kinematics & Dynamics",
        "description": "Formulate mathematical models to map joint variables to end-effector positions and vice versa.",
        "stage": "KINEMATICS",
        "order": 6,
        "estimatedHours": 50,
        "prerequisites": [
          "rob-math"
        ],
        "skills": [
          "Kinematics",
          "Dynamics",
          "Physics"
        ],
        "learningObjectives": [
          "Derive Denavit-Hartenberg parameters for manipulators",
          "Solve forward kinematics for serial linkages",
          "Compute inverse kinematics numerically and analytically",
          "Analyze the Jacobian matrix for singularities"
        ],
        "topics": [
          "Forward Kinematics",
          "Inverse Kinematics",
          "Denavit-Hartenberg Convention",
          "Jacobians",
          "Singularity Analysis"
        ],
        "practicalExercise": "Write a solver that calculates the required joint angles for a 3-DOF arm to reach a specific (x, y, z) coordinate.",
        "recommendedBookTitle": "Modern Robotics: Mechanics, Planning, and Control",
        "recommendedBookAuthor": "Kevin M. Lynch, Frank C. Park",
        "recommendedBookUrl": "http://modernrobotics.org/",
        "recommendedBookDescription": "The definitive university-level textbook on robot mechanics and kinematics.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-control",
        "videoTitle": "Control Engineering Fundamentals",
        "videoInstructor": "Brian Douglas",
        "videoUrl": "https://www.youtube.com/watch?v=Pi7l8mMjYVE",
        "videoDescription": "Introduction to control theory and PID controllers.",
        "videoDuration": "15:25",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Control Theory",
        "description": "Design feedback loops to regulate robotic actuators and maintain desired states amidst disturbances.",
        "stage": "CONTROL SYSTEMS",
        "order": 7,
        "estimatedHours": 55,
        "prerequisites": [
          "rob-sensors",
          "rob-kinematics"
        ],
        "skills": [
          "Control Theory",
          "Control Systems",
          "PID"
        ],
        "learningObjectives": [
          "Tune PID controllers for motor velocity and position",
          "Formulate state-space models for dynamic systems",
          "Implement Linear Quadratic Regulators (LQR)",
          "Design trajectory tracking controllers"
        ],
        "topics": [
          "PID Control",
          "State-Space Representation",
          "Linear Quadratic Regulator (LQR)",
          "Model Predictive Control (MPC)",
          "Stability Analysis"
        ],
        "practicalExercise": "Simulate a differential drive robot in software and tune a PID controller to track a straight-line trajectory.",
        "recommendedBookTitle": "Feedback Control of Dynamic Systems",
        "recommendedBookAuthor": "Gene F. Franklin, J. David Powell, Abbas Emami-Naeini",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/feedback-control-of-dynamic-systems/P200000003254/9780134685717",
        "recommendedBookDescription": "A standard text for understanding feedback loops, PID, and state-space control models.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-vision",
        "videoTitle": "Computer Vision for Robotics",
        "videoInstructor": "Cyrill Stachniss",
        "videoUrl": "https://www.youtube.com/watch?v=3X3n13L_Vp4",
        "videoDescription": "Photogrammetry and robotics vision concepts.",
        "videoDuration": "55:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Robotic Vision",
        "description": "Extract actionable features from camera feeds to enable visual tracking and object recognition.",
        "stage": "AI & VISION",
        "order": 8,
        "estimatedHours": 45,
        "prerequisites": [
          "rob-prog"
        ],
        "skills": [
          "Computer Vision",
          "OpenCV",
          "Image Processing"
        ],
        "learningObjectives": [
          "Calibrate cameras to remove lens distortion",
          "Perform color and edge-based feature extraction",
          "Estimate camera motion via visual odometry",
          "Implement real-time object detection pipelines"
        ],
        "topics": [
          "Camera Calibration",
          "Image Processing Filtering",
          "Feature Matching (SIFT/SURF/ORB)",
          "Visual Odometry",
          "Stereo Vision"
        ],
        "practicalExercise": "Use OpenCV to detect and track a brightly colored ball in a live webcam feed, publishing its center coordinates.",
        "recommendedBookTitle": "Multiple View Geometry in Computer Vision",
        "recommendedBookAuthor": "Richard Hartley, Andrew Zisserman",
        "recommendedBookUrl": "https://www.cambridge.org/core/books/multiple-view-geometry-in-computer-vision/5B942AFE03B75AD03248A962E3A5E5B9",
        "recommendedBookDescription": "The foundational book for geometric computer vision, camera calibration, and visual odometry.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-filter",
        "videoTitle": "Understanding the Kalman Filter",
        "videoInstructor": "MATLAB",
        "videoUrl": "https://www.youtube.com/watch?v=mwn8xhgNpFY",
        "videoDescription": "A highly intuitive explanation of state estimation and sensor fusion.",
        "videoDuration": "54:30",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "State Estimation",
        "description": "Fuse noisy measurements from multiple sensors to maintain an accurate estimate of the robot's state.",
        "stage": "AI & VISION",
        "order": 9,
        "estimatedHours": 45,
        "prerequisites": [
          "rob-math",
          "rob-control"
        ],
        "skills": [
          "State Estimation",
          "Kalman Filters",
          "Sensor Fusion"
        ],
        "learningObjectives": [
          "Implement the standard Kalman Filter for linear systems",
          "Apply Extended Kalman Filters (EKF) to non-linear kinematics",
          "Develop Particle Filters for global localization",
          "Handle sensor asynchrony and latency in filtering"
        ],
        "topics": [
          "Bayesian Estimation",
          "Kalman Filter (KF)",
          "Extended Kalman Filter (EKF)",
          "Particle Filters (Monte Carlo Localization)",
          "Sensor Fusion"
        ],
        "practicalExercise": "Combine noisy IMU acceleration data and delayed GPS position data using an EKF to estimate vehicle trajectory.",
        "recommendedBookTitle": "State Estimation for Robotics",
        "recommendedBookAuthor": "Timothy D. Barfoot",
        "recommendedBookUrl": "http://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser17.pdf",
        "recommendedBookDescription": "A rigorous mathematical deep dive into Kalman filters, EKFs, and state estimation techniques.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-slam",
        "videoTitle": "SLAM Course",
        "videoInstructor": "Cyrill Stachniss",
        "videoUrl": "https://www.youtube.com/watch?v=U6vr3iNrwmA",
        "videoDescription": "Introduction to Simultaneous Localization and Mapping.",
        "videoDuration": "1:00:20",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "SLAM & Navigation",
        "description": "Construct maps of unknown environments while simultaneously keeping track of the robot's location within them.",
        "stage": "INTEGRATION",
        "order": 10,
        "estimatedHours": 55,
        "prerequisites": [
          "rob-vision",
          "rob-filter"
        ],
        "skills": [
          "SLAM",
          "Path Planning",
          "Autonomous Navigation"
        ],
        "learningObjectives": [
          "Formulate graph-based SLAM problems",
          "Extract and match spatial features across lidar scans",
          "Perform loop closure to correct odometry drift",
          "Generate occupancy grid maps for navigation"
        ],
        "topics": [
          "Simultaneous Localization and Mapping",
          "Graph SLAM",
          "Iterative Closest Point (ICP)",
          "Loop Closure",
          "Occupancy Grids"
        ],
        "practicalExercise": "Process a bag file of 2D lidar scans and odometry to build an occupancy grid map using the Gmapping algorithm.",
        "recommendedBookTitle": "Introduction to Autonomous Mobile Robots",
        "recommendedBookAuthor": "Roland Siegwart, Illah R. Nourbakhsh, Davide Scaramuzza",
        "recommendedBookUrl": "https://mitpress.mit.edu/9780262015356/introduction-to-autonomous-mobile-robots/",
        "recommendedBookDescription": "Comprehensive overview of mapping, localization, and navigation for autonomous robots.",
        "resourceType": "BOOK"
      },
      {
        "key": "rob-ml",
        "videoTitle": "Deep Learning for Robotics",
        "videoInstructor": "Sergey Levine",
        "videoUrl": "https://www.youtube.com/watch?v=wX-y0w4wR3c",
        "videoDescription": "UC Berkeley CS294 lecture on Deep Reinforcement Learning.",
        "videoDuration": "1:20:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Machine Learning for Robotics",
        "description": "Deploy machine learning models to solve complex perception, grasping, and autonomous decision-making tasks.",
        "stage": "INTEGRATION",
        "order": 11,
        "estimatedHours": 45,
        "prerequisites": [
          "rob-slam"
        ],
        "skills": [
          "Machine Learning",
          "Reinforcement Learning",
          "Deep Learning"
        ],
        "learningObjectives": [
          "Train Deep Neural Networks for robotic vision",
          "Formulate Reinforcement Learning environments for control",
          "Deploy models efficiently on edge hardware",
          "Apply Imitation Learning to human demonstrations"
        ],
        "topics": [
          "Deep Learning",
          "Reinforcement Learning",
          "Imitation Learning",
          "Edge AI inference",
          "Sim-to-Real Transfer"
        ],
        "practicalExercise": "Train a simple Deep Q-Network (DQN) agent in simulation to balance an inverted pendulum on a cart.",
        "recommendedBookTitle": "Reinforcement Learning: An Introduction",
        "recommendedBookAuthor": "Richard S. Sutton, Andrew G. Barto",
        "recommendedBookUrl": "http://incompleteideas.net/book/the-book-2nd.html",
        "recommendedBookDescription": "The most authoritative introduction to reinforcement learning, highly relevant for robotic control.",
        "resourceType": "BOOK"
      }
    ]
  },
  {
    "title": "Telecommunications",
    "slug": "telecommunications",
    "description": "Design and manage global communication networks and RF systems.",
    "category": "Infrastructure",
    "difficulty": "Advanced",
    "estimatedHours": 420,
    "nodes": [
      {
        "key": "tc-math",
        "videoTitle": "Advanced Engineering Math for Telecom",
        "videoInstructor": "Prof. Erwin Kreyszig",
        "videoUrl": "https://www.youtube.com/watch?v=gZNm7L96pfY",
        "videoDescription": "Provides the mathematical foundations of Fourier analysis and differential equations.",
        "videoDuration": "1:02:15",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Applied Mathematics",
        "description": "Utilize advanced mathematical frameworks to model electromagnetic phenomena and signal transformations.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 40,
        "prerequisites": [],
        "skills": [
          "Mathematics",
          "Calculus",
          "Fourier Analysis"
        ],
        "learningObjectives": [
          "Evaluate Fourier transforms of time-domain signals",
          "Solve partial differential equations for wave propagation",
          "Analyze complex power in AC circuits",
          "Apply statistical methods to noise modeling"
        ],
        "topics": [
          "Fourier Series and Transforms",
          "Differential Equations",
          "Complex Analysis",
          "Probability Theory",
          "Vector Calculus"
        ],
        "practicalExercise": "Calculate the frequency spectrum of a square wave signal and plot its first five harmonics.",
        "recommendedBookTitle": "Advanced Engineering Mathematics",
        "recommendedBookAuthor": "Erwin Kreyszig",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Advanced+Engineering+Mathematics%2C+10th+Edition-p-9780470458365",
        "recommendedBookDescription": "A comprehensive reference for differential equations, complex analysis, and vector calculus.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-signals",
        "videoTitle": "Signals and Systems",
        "videoInstructor": "Alan V. Oppenheim",
        "videoUrl": "https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/",
        "videoDescription": "Legendary MIT course covering continuous and discrete-time signals and LTI systems.",
        "videoDuration": "50:00",
        "videoPlatform": "MIT OCW",
        "videoType": "COURSE",
        "title": "Signals & Systems",
        "description": "Analyze continuous and discrete-time signals and their interactions with linear time-invariant systems.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 45,
        "prerequisites": [
          "tc-math"
        ],
        "skills": [
          "Signal Processing",
          "Systems Theory"
        ],
        "learningObjectives": [
          "Characterize signals in time and frequency domains",
          "Compute convolutions of signals and system impulse responses",
          "Determine system stability and causality",
          "Apply the Laplace transform to circuit analysis"
        ],
        "topics": [
          "Continuous-Time Signals",
          "Discrete-Time Signals",
          "Linear Time-Invariant (LTI) Systems",
          "Convolution",
          "Laplace Transforms"
        ],
        "practicalExercise": "Determine the output response of a first-order RC low-pass filter to a step input using convolution.",
        "recommendedBookTitle": "Signals and Systems",
        "recommendedBookAuthor": "Alan V. Oppenheim, Alan S. Willsky, S. Hamid Nawab",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/signals-and-systems/P200000003185/9780138147570",
        "recommendedBookDescription": "The classic and authoritative text on continuous and discrete-time signals and LTI systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-analog",
        "videoTitle": "Analog Communication",
        "videoInstructor": "Prof. Goutam Das",
        "videoUrl": "https://www.youtube.com/watch?v=tT7Fw83C0lU",
        "videoDescription": "NPTEL course on analog communication systems.",
        "videoDuration": "45:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Analog Communications",
        "description": "Design and analyze modulation schemes used to transmit analog information over continuous carrier waves.",
        "stage": "CORE TELECOM",
        "order": 3,
        "estimatedHours": 35,
        "prerequisites": [
          "tc-signals"
        ],
        "skills": [
          "Analog Communications",
          "RF Engineering"
        ],
        "learningObjectives": [
          "Evaluate bandwidth requirements for AM and FM signals",
          "Design heterodyne receiver architectures",
          "Calculate Signal-to-Noise Ratio (SNR) in analog links",
          "Implement envelope detectors for demodulation"
        ],
        "topics": [
          "Amplitude Modulation (AM)",
          "Frequency Modulation (FM)",
          "Phase Modulation (PM)",
          "Superheterodyne Receivers",
          "Noise in Analog Systems"
        ],
        "practicalExercise": "Simulate an AM transmitter and receiver chain, observing the waveform at the antenna, mixer, and demodulator.",
        "recommendedBookTitle": "Communication Systems",
        "recommendedBookAuthor": "Simon Haykin, Michael Moher",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Communication+Systems%2C+5th+Edition-p-9780471697909",
        "recommendedBookDescription": "An in-depth exploration of analog modulation, receivers, and noise in communication systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-digital",
        "videoTitle": "Digital Communication",
        "videoInstructor": "Prof. Aditya K. Jagannatham",
        "videoUrl": "https://www.youtube.com/watch?v=r_r2l9FkOAw",
        "videoDescription": "NPTEL lecture on digital communication basics.",
        "videoDuration": "48:30",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Digital Communications",
        "description": "Convert analog information into digital formats and implement resilient digital modulation techniques.",
        "stage": "CORE TELECOM",
        "order": 4,
        "estimatedHours": 45,
        "prerequisites": [
          "tc-analog"
        ],
        "skills": [
          "Digital Communications",
          "Modulation",
          "Information Theory"
        ],
        "learningObjectives": [
          "Apply Nyquist sampling and quantization to analog signals",
          "Analyze Bit Error Rate (BER) for various modulation schemes",
          "Design QAM and PSK constellations",
          "Implement forward error correction coding"
        ],
        "topics": [
          "Sampling Theorem",
          "Pulse Code Modulation (PCM)",
          "Digital Modulation (ASK, FSK, PSK, QAM)",
          "Information Theory",
          "Error Correction Codes"
        ],
        "practicalExercise": "Plot the constellation diagram of a 16-QAM signal subject to Additive White Gaussian Noise (AWGN).",
        "recommendedBookTitle": "Digital Communications",
        "recommendedBookAuthor": "John G. Proakis, Masoud Salehi",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/digital-communications-proakis-salehi/M9780072957167.html",
        "recommendedBookDescription": "The industry standard textbook covering digital modulation, coding, and information theory.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-net",
        "videoTitle": "Telecommunication Networks",
        "videoInstructor": "Prof. Shiv Kalyanaraman",
        "videoUrl": "https://www.youtube.com/watch?v=34d7w0w0t1Q",
        "videoDescription": "Comprehensive introduction to telecommunication network principles.",
        "videoDuration": "50:10",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Telecomm Networks",
        "description": "Architect and manage large-scale switching systems that route voice and data traffic globally.",
        "stage": "NETWORKING",
        "order": 5,
        "estimatedHours": 30,
        "prerequisites": [
          "tc-digital"
        ],
        "skills": [
          "Telecommunications Networks",
          "Switching"
        ],
        "learningObjectives": [
          "Differentiate between circuit-switched and packet-switched networks",
          "Design hierarchical network topologies",
          "Analyze traffic queuing and Erlang blocking probabilities",
          "Evaluate signaling protocols for call setup"
        ],
        "topics": [
          "Circuit vs Packet Switching",
          "Public Switched Telephone Network (PSTN)",
          "Network Topologies",
          "Teletraffic Engineering (Erlang)",
          "Signaling System 7 (SS7)"
        ],
        "practicalExercise": "Calculate the required number of voice trunks for a central office using the Erlang B formula given a specific blocking probability.",
        "recommendedBookTitle": "Telecommunication System Engineering",
        "recommendedBookAuthor": "Roger L. Freeman",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Telecommunication+System+Engineering%2C+4th+Edition-p-9780471451334",
        "recommendedBookDescription": "Detailed engineering guidelines for designing and managing large-scale telecommunication networks.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-ip",
        "videoTitle": "IP Networking Basics",
        "videoInstructor": "NetworkChuck",
        "videoUrl": "https://www.youtube.com/watch?v=vVj4z3U9j2I",
        "videoDescription": "Fun and simple tutorial on how IP networks function.",
        "videoDuration": "20:10",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "IP Networking",
        "description": "Implement routing protocols and IP addressing schemes to enable robust data packet delivery.",
        "stage": "NETWORKING",
        "order": 6,
        "estimatedHours": 35,
        "prerequisites": [
          "tc-net"
        ],
        "skills": [
          "TCP/IP",
          "Computer Networking",
          "Routing"
        ],
        "learningObjectives": [
          "Design scalable IPv4 and IPv6 subnetting plans",
          "Configure OSPF and BGP routing on network devices",
          "Implement Quality of Service (QoS) for real-time traffic",
          "Analyze TCP congestion control mechanisms"
        ],
        "topics": [
          "IPv4 and IPv6",
          "Interior Gateway Protocols (OSPF)",
          "Border Gateway Protocol (BGP)",
          "TCP/UDP Transport",
          "Quality of Service (QoS)"
        ],
        "practicalExercise": "Set up a virtual network topology in GNS3 and configure OSPF routing between three distinct subnets.",
        "recommendedBookTitle": "Computer Networking: A Top-Down Approach",
        "recommendedBookAuthor": "James Kurose, Keith Ross",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003194/9780133594140",
        "recommendedBookDescription": "The premier text on IP networking, routing protocols, and internet architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-wireless",
        "videoTitle": "Wireless Communications",
        "videoInstructor": "Prof. Andrea Goldsmith",
        "videoUrl": "https://www.youtube.com/watch?v=qW8t8u7r97Y",
        "videoDescription": "Stanford university lecture on wireless communication fundamentals.",
        "videoDuration": "1:12:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Wireless Communications",
        "description": "Characterize radio frequency propagation and design antenna systems for unguided transmission.",
        "stage": "WIRELESS",
        "order": 7,
        "estimatedHours": 40,
        "prerequisites": [
          "tc-digital"
        ],
        "skills": [
          "Wireless Communications",
          "RF Engineering",
          "Antenna Design"
        ],
        "learningObjectives": [
          "Calculate link budgets for wireless point-to-point links",
          "Analyze multipath fading and Doppler shift effects",
          "Design dipole and patch antennas",
          "Evaluate RF transceiver performance metrics"
        ],
        "topics": [
          "RF Wave Propagation",
          "Antenna Theory",
          "Link Budget Analysis",
          "Fading Models",
          "RF Transceiver Architecture"
        ],
        "practicalExercise": "Use the Friis transmission equation to calculate the received power of a 2.4 GHz link given transmitter power, antenna gains, and distance.",
        "recommendedBookTitle": "Wireless Communications",
        "recommendedBookAuthor": "Andrea Goldsmith",
        "recommendedBookUrl": "https://www.cambridge.org/core/books/wireless-communications/310F0A38166DDB7782AFA5EAA3BB6BAA",
        "recommendedBookDescription": "A highly acclaimed book detailing wireless channel capacity, fading models, and RF link design.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-cellular",
        "videoTitle": "4G LTE and 5G NR Architecture",
        "videoInstructor": "Ali Larijani",
        "videoUrl": "https://www.youtube.com/watch?v=Jm3jR2W658c",
        "videoDescription": "An industry perspective on mobile network architectures.",
        "videoDuration": "45:00",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE",
        "title": "Mobile Networks (4G/5G)",
        "description": "Deploy and optimize mobile cellular architectures, ranging from LTE to 5G New Radio.",
        "stage": "WIRELESS",
        "order": 8,
        "estimatedHours": 45,
        "prerequisites": [
          "tc-wireless",
          "tc-ip"
        ],
        "skills": [
          "4G LTE",
          "5G",
          "Mobile Networks"
        ],
        "learningObjectives": [
          "Map logical and physical channels in LTE/5G",
          "Analyze handovers and mobility management procedures",
          "Design frequency reuse plans for cell sites",
          "Evaluate Massive MIMO and beamforming gains"
        ],
        "topics": [
          "Cellular Concepts and Frequency Reuse",
          "LTE Architecture (EPC, eNodeB)",
          "5G New Radio (NR) and Core",
          "Massive MIMO",
          "Mobility Management"
        ],
        "practicalExercise": "Simulate an LTE attach procedure, tracing the signaling messages between the User Equipment (UE), eNodeB, and MME.",
        "recommendedBookTitle": "5G NR: The Next Generation Wireless Access Technology",
        "recommendedBookAuthor": "Erik Dahlman, Stefan Parkvall, Johan Sköld",
        "recommendedBookUrl": "https://www.elsevier.com/books/5g-nr/dahlman/978-0-12-822822-7",
        "recommendedBookDescription": "Authored by Ericsson experts, providing a deep technical dive into 5G New Radio and cellular architectures.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-optical",
        "videoTitle": "Optical Fiber Communication",
        "videoInstructor": "Prof. Pradeep Kumar",
        "videoUrl": "https://www.youtube.com/watch?v=kYv_J00u34o",
        "videoDescription": "Detailed university course on optical transmission systems.",
        "videoDuration": "58:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Optical Communications",
        "description": "Engineer high-capacity backbone networks using fiber optic cables and wavelength division multiplexing.",
        "stage": "ADVANCED",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "tc-digital"
        ],
        "skills": [
          "Fiber Optics",
          "Optical Engineering"
        ],
        "learningObjectives": [
          "Calculate optical power loss and dispersion penalties",
          "Design Wavelength Division Multiplexing (WDM) links",
          "Evaluate optical amplifiers (EDFA, Raman)",
          "Select appropriate laser sources and photodiodes"
        ],
        "topics": [
          "Fiber Optic Waveguides",
          "Chromatic and Polarization Mode Dispersion",
          "Wavelength Division Multiplexing (WDM)",
          "Optical Amplifiers",
          "Optical Transceivers"
        ],
        "practicalExercise": "Design a 100 km optical link, calculating the required launch power given fiber attenuation, splice losses, and receiver sensitivity.",
        "recommendedBookTitle": "Optical Fiber Communications",
        "recommendedBookAuthor": "Gerd Keiser",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/optical-fiber-communications-keiser/M9780073380711.html",
        "recommendedBookDescription": "The definitive guide on optical links, wavelength division multiplexing, and fiber physics.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-sat",
        "videoTitle": "Satellite Communications",
        "videoInstructor": "Prof. Kalyan Kumar Bandyopadhyay",
        "videoUrl": "https://www.youtube.com/watch?v=P67HlW_wGj8",
        "videoDescription": "NPTEL lecture covering orbital mechanics and satcom systems.",
        "videoDuration": "52:10",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Satellite Communications",
        "description": "Establish long-distance communications utilizing orbiting spacecraft transponders and earth stations.",
        "stage": "ADVANCED",
        "order": 10,
        "estimatedHours": 30,
        "prerequisites": [
          "tc-wireless"
        ],
        "skills": [
          "Satellite Communications",
          "RF Engineering"
        ],
        "learningObjectives": [
          "Calculate look angles (azimuth, elevation) for geostationary satellites",
          "Analyze satellite link budgets including atmospheric losses",
          "Design earth station parabolic antennas",
          "Evaluate multiple access schemes (FDMA, TDMA) for satellite links"
        ],
        "topics": [
          "Orbital Mechanics",
          "Satellite Link Design",
          "Earth Station Architecture",
          "Propagation Effects (Rain Fade)",
          "Multiple Access Schemes"
        ],
        "practicalExercise": "Compute the G/T (Gain-to-Noise-Temperature) ratio for a satellite receiving earth station at C-band.",
        "recommendedBookTitle": "Satellite Communications",
        "recommendedBookAuthor": "Timothy Pratt, Jeremy E. Allnutt",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Satellite+Communications%2C+3rd+Edition-p-9781119482178",
        "recommendedBookDescription": "A comprehensive reference for orbital mechanics, link budgets, and earth station design.",
        "resourceType": "BOOK"
      },
      {
        "key": "tc-dsp",
        "videoTitle": "Digital Signal Processing (RES.6-008)",
        "videoInstructor": "Prof. Alan V. Oppenheim",
        "videoUrl": "https://www.youtube.com/playlist?list=PLB28591A54157833C",
        "videoDescription": "Classic, comprehensive MIT OCW video series on DSP.",
        "videoDuration": "40:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Digital Signal Processing",
        "description": "Process and transform discrete signals using digital algorithms and hardware accelerators.",
        "stage": "ADVANCED",
        "order": 11,
        "estimatedHours": 40,
        "prerequisites": [
          "tc-signals"
        ],
        "skills": [
          "DSP",
          "Signal Processing"
        ],
        "learningObjectives": [
          "Design Finite Impulse Response (FIR) and Infinite Impulse Response (IIR) filters",
          "Compute the Fast Fourier Transform (FFT)",
          "Implement DSP algorithms on specialized processors or FPGAs",
          "Analyze quantization effects in digital filters"
        ],
        "topics": [
          "Z-Transforms",
          "FIR/IIR Digital Filters",
          "Fast Fourier Transform (FFT)",
          "Multirate Signal Processing",
          "DSP Architecture"
        ],
        "practicalExercise": "Design an FIR bandpass filter using a Hamming window in Python and plot its magnitude and phase response.",
        "recommendedBookTitle": "Discrete-Time Signal Processing",
        "recommendedBookAuthor": "Alan V. Oppenheim, Ronald W. Schafer",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/discrete-time-signal-processing/P200000003264/9780131988422",
        "recommendedBookDescription": "The foundational text for FFT algorithms, digital filter design, and DSP architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "analog-digital-communications",
        "title": "Analog & Digital Communications",
        "description": "Analyze analog and digital modulation schemes and understand noise impacts in communication channels.",
        "learningObjectives": [
          "Compare AM, FM, and PM analog modulations.",
          "Analyze digital modulation techniques like QAM and PSK.",
          "Calculate channel capacity and signal-to-noise ratios."
        ],
        "topics": [
          "Modulation",
          "Demodulation",
          "Shannon Capacity",
          "QAM",
          "PSK",
          "Fourier Transforms",
          "Bandwidth"
        ],
        "practicalExercise": "Simulate a QPSK modulation and demodulation system adding AWGN in Python/MATLAB.",
        "skills": [
          "Signal Processing",
          "MATLAB",
          "Telecommunications"
        ],
        "stage": "Advanced",
        "order": 12,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Digital Communications",
        "recommendedBookAuthor": "John Proakis",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/digital-communications-proakis-salehi/M9780072957167.html",
        "recommendedBookDescription": "The definitive textbook on digital communications theory.",
        "resourceType": "BOOK",
        "videoTitle": "Understanding Modulation",
        "videoInstructor": "Iain Explains Signals",
        "videoUrl": "https://www.youtube.com/watch?v=glJj3H1M6zI",
        "videoDescription": "Visual explanation of how analog and digital modulation works.",
        "videoDuration": "15m",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE"
      },
      {
        "key": "wireless-cellular",
        "title": "Wireless & Cellular",
        "description": "Explore cellular network architectures and mobile broadband standards from 4G LTE to 5G.",
        "learningObjectives": [
          "Explain the architecture of an LTE/5G core network.",
          "Understand OFDMA and MIMO technologies.",
          "Analyze handovers and mobility management."
        ],
        "topics": [
          "4G LTE",
          "5G NR",
          "OFDMA",
          "MIMO",
          "Core Network (EPC)",
          "RAN",
          "Mobility Management"
        ],
        "practicalExercise": "Analyze a standard cellular network packet trace to identify registration and bearer setup procedures.",
        "skills": [
          "Telecommunications",
          "Wireless Networks",
          "Network Analysis"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Wireless Communications",
        "recommendedBookAuthor": "Andrea Goldsmith",
        "recommendedBookUrl": "https://www.cambridge.org/core/books/wireless-communications/8A88E0BE6CE6A0E72C41A41CE3DAE254",
        "recommendedBookDescription": "Rigorous treatment of wireless communications and cellular systems.",
        "resourceType": "BOOK",
        "videoTitle": "5G Architecture Explained",
        "videoInstructor": "TechWorld with Nana",
        "videoUrl": "https://www.youtube.com/watch?v=o04_v1Xg1Cg",
        "videoDescription": "High-level overview of 5G New Radio and Core Architecture.",
        "videoDuration": "20m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "optical-networking",
        "title": "Optical Networking",
        "description": "Understand fiber optic communication systems and dense wavelength-division multiplexing (DWDM).",
        "learningObjectives": [
          "Calculate optical link budgets.",
          "Understand DWDM components and architectures.",
          "Analyze optical impairments like dispersion and attenuation."
        ],
        "topics": [
          "Fiber Optics",
          "DWDM",
          "Optical Amplifiers",
          "Link Budget",
          "Dispersion",
          "ROADM",
          "OTN"
        ],
        "practicalExercise": "Design an optical link budget for a 100km fiber span including splices and amplifier gains.",
        "skills": [
          "Optical Networks",
          "Telecommunications",
          "Systems Engineering"
        ],
        "stage": "Advanced",
        "order": 14,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Optical Networks: A Practical Perspective",
        "recommendedBookAuthor": "Rajiv Ramaswami",
        "recommendedBookUrl": "https://www.elsevier.com/books/optical-networks/ramaswami/978-0-12-374092-2",
        "recommendedBookDescription": "Comprehensive look at the architecture and design of optical networks.",
        "resourceType": "BOOK",
        "videoTitle": "Fiber Optic Communication Systems",
        "videoInstructor": "NPTEL",
        "videoUrl": "https://www.youtube.com/watch?v=O15-QW9E1W8",
        "videoDescription": "University-level lectures on fiber optics and wave propagation.",
        "videoDuration": "50m",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE"
      },
      {
        "key": "voip-sip",
        "title": "VoIP & SIP",
        "description": "Master the protocols powering modern voice and video communications over IP networks.",
        "learningObjectives": [
          "Analyze SIP call flows for registration and session setup.",
          "Explain the role of RTP and RTCP in media delivery.",
          "Troubleshoot NAT traversal issues using STUN/TURN."
        ],
        "topics": [
          "SIP",
          "RTP/RTCP",
          "SDP",
          "NAT Traversal",
          "WebRTC",
          "QoS",
          "Codecs"
        ],
        "practicalExercise": "Set up a local Asterisk or FreeSWITCH server and configure two SIP softphones to establish a call.",
        "skills": [
          "SIP",
          "VoIP",
          "Network Protocols"
        ],
        "stage": "Advanced",
        "order": 15,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "SIP: Understanding the Session Initiation Protocol",
        "recommendedBookAuthor": "Alan B. Johnston",
        "recommendedBookUrl": "https://us.artechhouse.com/SIP-Understanding-the-Session-Initiation-Protocol-Fourth-Edition-P1751.aspx",
        "recommendedBookDescription": "Detailed guide to SIP architecture, messages, and call flows.",
        "resourceType": "BOOK",
        "videoTitle": "SIP Basic Call Flow",
        "videoInstructor": "The SIP School",
        "videoUrl": "https://www.youtube.com/watch?v=7uK3VcwvUew",
        "videoDescription": "Visual breakdown of a standard SIP invite and media setup.",
        "videoDuration": "12m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      }
    ]
  },
  {
    "title": "Electronics Engineering",
    "slug": "electronics-engineering",
    "description": "Design, analyze, and build electronic circuits and systems.",
    "category": "Engineering",
    "difficulty": "Advanced",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "ee-math",
        "videoTitle": "Differential Equations for Electrical Engineers",
        "videoInstructor": "MIT OpenCourseWare",
        "videoUrl": "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/video_galleries/video-lectures/",
        "videoDescription": "Masterclass on solving differential equations for RLC circuits and applying Laplace transforms.",
        "videoDuration": "49:00",
        "videoPlatform": "MIT OCW",
        "videoType": "COURSE",
        "title": "Engineering Mathematics",
        "description": "Apply calculus and differential equations to solve complex electrical engineering problems.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 40,
        "prerequisites": [],
        "skills": [
          "Mathematics",
          "Calculus",
          "Differential Equations"
        ],
        "learningObjectives": [
          "Solve first and second order differential equations for RLC circuits",
          "Apply Laplace transforms to analyze transient circuit behavior",
          "Utilize linear algebra for nodal analysis of large networks",
          "Perform vector calculus for electromagnetic field analysis"
        ],
        "topics": [
          "Differential Equations",
          "Laplace Transforms",
          "Linear Algebra",
          "Vector Calculus",
          "Complex Numbers"
        ],
        "practicalExercise": "Derive the time-domain voltage response of an underdamped series RLC circuit subjected to a step input.",
        "recommendedBookTitle": "Differential Equations for Engineers",
        "recommendedBookAuthor": "MIT OpenCourseWare",
        "recommendedBookUrl": "https://ocw.mit.edu/courses/18-03-differential-equations-spring-2010/",
        "recommendedBookDescription": "An exceptional free course covering the differential equations and Laplace transforms essential for EE.",
        "resourceType": "COURSE_RESOURCE"
      },
      {
        "key": "ee-physics",
        "videoTitle": "Physics II: Electricity and Magnetism",
        "videoInstructor": "Walter Lewin",
        "videoUrl": "https://www.youtube.com/watch?v=xh5Bf6k472M",
        "videoDescription": "Classic MIT 8.02 lecture by Prof. Walter Lewin.",
        "videoDuration": "49:25",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Physics for Electronics",
        "description": "Understand the fundamental laws of electromagnetism and quantum mechanics governing electronic devices.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 35,
        "prerequisites": [
          "ee-math"
        ],
        "skills": [
          "Physics",
          "Electromagnetism"
        ],
        "learningObjectives": [
          "Apply Maxwell's equations to determine electric and magnetic fields",
          "Analyze the movement of charge carriers in semiconductors",
          "Evaluate magnetic materials for inductor and transformer cores",
          "Calculate capacitance and inductance from physical geometries"
        ],
        "topics": [
          "Maxwell's Equations",
          "Semiconductor Physics",
          "Electromagnetic Fields",
          "Dielectrics and Magnetic Materials",
          "Quantum Mechanics Basics"
        ],
        "practicalExercise": "Calculate the electric field intensity and potential difference between two parallel plates with a specified dielectric medium.",
        "recommendedBookTitle": "Introduction to Electrodynamics",
        "recommendedBookAuthor": "David J. Griffiths",
        "recommendedBookUrl": "https://www.cambridge.org/core/books/introduction-to-electrodynamics/9E131DB42C12DFFFEFBAFCD7DAE7B6C5",
        "recommendedBookDescription": "The standard undergraduate text for mastering Maxwell's equations and electromagnetic theory.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-circuits",
        "videoTitle": "Circuit Analysis",
        "videoInstructor": "Michel van Biezen",
        "videoUrl": "https://www.youtube.com/watch?v=84G2yWl-z1A",
        "videoDescription": "Clear tutorial on analyzing basic electronic circuits.",
        "videoDuration": "10:15",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Circuit Analysis",
        "description": "Analyze linear passive circuits under DC, AC steady-state, and transient conditions.",
        "stage": "CORE ELECTRONICS",
        "order": 3,
        "estimatedHours": 45,
        "prerequisites": [
          "ee-physics"
        ],
        "skills": [
          "Circuit Design",
          "Circuit Analysis",
          "Electrical Engineering"
        ],
        "learningObjectives": [
          "Apply mesh and nodal analysis to solve complex networks",
          "Utilize Thevenin's and Norton's theorems for circuit simplification",
          "Analyze AC circuits using phasors and complex impedance",
          "Calculate real, reactive, and apparent power in AC systems"
        ],
        "topics": [
          "Ohm's and Kirchhoff's Laws",
          "Network Theorems",
          "Phasor Analysis",
          "AC Power Analysis",
          "Transient Response"
        ],
        "practicalExercise": "Determine the Thevenin equivalent circuit of a given resistive network with independent and dependent sources.",
        "recommendedBookTitle": "Fundamentals of Electric Circuits",
        "recommendedBookAuthor": "Charles K. Alexander, Matthew N.O. Sadiku",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/fundamentals-electric-circuits-alexander-sadiku/M9781260226409.html",
        "recommendedBookDescription": "A comprehensive and clear textbook on DC and AC circuit analysis, network theorems, and transients.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-analog",
        "videoTitle": "Circuits and Electronics",
        "videoInstructor": "Anant Agarwal",
        "videoUrl": "https://www.youtube.com/watch?v=afwaJS1jENI",
        "videoDescription": "MIT 6.002 analog electronics and circuit design.",
        "videoDuration": "50:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Analog Electronics",
        "description": "Design and bias circuits utilizing non-linear active components like diodes and transistors.",
        "stage": "CORE ELECTRONICS",
        "order": 4,
        "estimatedHours": 50,
        "prerequisites": [
          "ee-circuits"
        ],
        "skills": [
          "Analog Electronics",
          "Transistors",
          "Op-Amps"
        ],
        "learningObjectives": [
          "Design BJT and MOSFET amplifier stages",
          "Analyze frequency response and bandwidth of amplifiers",
          "Implement active filters and oscillators using Operational Amplifiers",
          "Evaluate non-ideal characteristics of real op-amps"
        ],
        "topics": [
          "Diodes and Rectifiers",
          "Bipolar Junction Transistors (BJTs)",
          "Field Effect Transistors (MOSFETs)",
          "Operational Amplifiers (Op-Amps)",
          "Frequency Response"
        ],
        "practicalExercise": "Design a common-emitter BJT amplifier with a specified voltage gain and input impedance, verifying it in LTspice.",
        "recommendedBookTitle": "Microelectronic Circuits",
        "recommendedBookAuthor": "Adel S. Sedra, Kenneth C. Smith",
        "recommendedBookUrl": "https://global.oup.com/academic/product/microelectronic-circuits-9780190853464",
        "recommendedBookDescription": "The globally recognized gold standard for analog circuit design, op-amps, and transistor amplifiers.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-digital",
        "videoTitle": "Digital Logic Design",
        "videoInstructor": "Neso Academy",
        "videoUrl": "https://www.youtube.com/watch?v=RkL5-88-g-U",
        "videoDescription": "Comprehensive playlist on digital logic and boolean algebra.",
        "videoDuration": "12:30",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Digital Electronics",
        "description": "Construct logic circuits, state machines, and computational units using discrete digital components.",
        "stage": "CORE ELECTRONICS",
        "order": 5,
        "estimatedHours": 45,
        "prerequisites": [
          "ee-circuits"
        ],
        "skills": [
          "Digital Electronics",
          "Logic Design",
          "Digital Logic"
        ],
        "learningObjectives": [
          "Simplify Boolean expressions using Karnaugh maps",
          "Design combinational logic (adders, multiplexers, decoders)",
          "Implement sequential logic using flip-flops and registers",
          "Synthesize finite state machines (Moore and Mealy)"
        ],
        "topics": [
          "Boolean Algebra",
          "Combinational Logic",
          "Sequential Logic",
          "Finite State Machines (FSM)",
          "Timing and Propagation Delay"
        ],
        "practicalExercise": "Design and simulate a 4-bit synchronous up/down counter using D flip-flops and logic gates.",
        "recommendedBookTitle": "Digital Design: With an Introduction to the Verilog HDL, VHDL, and SystemVerilog",
        "recommendedBookAuthor": "M. Morris Mano, Michael D. Ciletti",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/digital-design-with-an-introduction-to-the-verilog-hdl-vhdl-and-systemverilog/P200000003268/9780134549897",
        "recommendedBookDescription": "The premier resource for combinational and sequential logic design and digital electronics.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-signals",
        "videoTitle": "Signals and Systems (RES.6.007)",
        "videoInstructor": "Prof. Alan V. Oppenheim",
        "videoUrl": "https://www.youtube.com/playlist?list=PLUl4u3cNGP63X6R5zZ7-L6QjR7-4O3Y_N",
        "videoDescription": "MIT OCW lectures covering Fourier representations, Laplace and Z transforms.",
        "videoDuration": "35:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Signals & Systems",
        "description": "Process and analyze continuous and discrete electrical signals.",
        "stage": "SYSTEMS",
        "order": 6,
        "estimatedHours": 40,
        "prerequisites": [
          "ee-math",
          "ee-circuits"
        ],
        "skills": [
          "Signal Processing",
          "Systems Theory"
        ],
        "learningObjectives": [
          "Compute Fourier transforms to determine signal bandwidth",
          "Design analog filters to meet specific attenuation criteria",
          "Apply the Nyquist-Shannon sampling theorem",
          "Analyze system response using convolution"
        ],
        "topics": [
          "Fourier Analysis",
          "Analog Filter Design",
          "Sampling Theory",
          "Convolution",
          "Modulation Basics"
        ],
        "practicalExercise": "Design a second-order Butterworth active low-pass filter to attenuate high-frequency noise from an audio signal.",
        "recommendedBookTitle": "Linear Systems and Signals",
        "recommendedBookAuthor": "B.P. Lathi, Roger Green",
        "recommendedBookUrl": "https://global.oup.com/academic/product/linear-systems-and-signals-9780190200176",
        "recommendedBookDescription": "An intuitive and rigorous approach to understanding continuous and discrete-time signals.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-micro",
        "videoTitle": "Microprocessors and Microcontrollers",
        "videoInstructor": "Prof. Santanu Chattopadhyay",
        "videoUrl": "https://nptel.ac.in/courses/108105102",
        "videoDescription": "IIT Kharagpur course on microprocessor architecture, 8085, 8086, and ARM.",
        "videoDuration": "30:00:00",
        "videoPlatform": "NPTEL",
        "videoType": "COURSE",
        "title": "Microprocessors",
        "description": "Program and interface microprocessors at the architecture and assembly level.",
        "stage": "SYSTEMS",
        "order": 7,
        "estimatedHours": 40,
        "prerequisites": [
          "ee-digital"
        ],
        "skills": [
          "Microprocessors",
          "Computer Architecture",
          "Assembly"
        ],
        "learningObjectives": [
          "Write optimized assembly language routines",
          "Configure hardware interrupts and timers",
          "Interface microprocessors with external memory and peripherals",
          "Analyze CPU pipelining and memory hierarchies"
        ],
        "topics": [
          "CPU Architecture",
          "Assembly Language",
          "Interrupts and Exceptions",
          "Memory Interfacing",
          "I/O Protocols"
        ],
        "practicalExercise": "Write an ARM assembly program that toggles an LED at a specific frequency using a hardware timer interrupt.",
        "recommendedBookTitle": "Computer Organization and Design ARM Edition",
        "recommendedBookAuthor": "David A. Patterson, John L. Hennessy",
        "recommendedBookUrl": "https://www.elsevier.com/books/computer-organization-and-design-arm-edition/patterson/978-0-12-801733-3",
        "recommendedBookDescription": "The definitive guide to microprocessor architecture, assembly language, and hardware interfacing.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-power",
        "videoTitle": "Power Electronics Fundamentals",
        "videoInstructor": "Prof. Robert Erickson",
        "videoUrl": "https://www.coursera.org/learn/power-electronics",
        "videoDescription": "Thorough analysis of switching converters, DC-DC topologies, and power losses.",
        "videoDuration": "18:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Power Electronics",
        "description": "Design efficient switching converters to regulate, distribute, and convert electrical power.",
        "stage": "SPECIALIZATION",
        "order": 8,
        "estimatedHours": 40,
        "prerequisites": [
          "ee-analog"
        ],
        "skills": [
          "Power Electronics",
          "Power Engineering"
        ],
        "learningObjectives": [
          "Analyze buck, boost, and buck-boost DC-DC converters",
          "Design isolated converters (Flyback, Forward)",
          "Evaluate switching losses in power MOSFETs/IGBTs",
          "Implement control loops for voltage regulation"
        ],
        "topics": [
          "DC-DC Converters",
          "AC-DC Rectifiers",
          "DC-AC Inverters",
          "Magnetic Component Design",
          "Thermal Management"
        ],
        "practicalExercise": "Calculate the required inductor and capacitor values for a 12V to 5V buck converter operating at 100 kHz.",
        "recommendedBookTitle": "Power Electronics: Converters, Applications, and Design",
        "recommendedBookAuthor": "Ned Mohan, Tore M. Undeland, William P. Robbins",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Power+Electronics%3A+Converters%2C+Applications%2C+and+Design%2C+3rd+Edition-p-9780471226932",
        "recommendedBookDescription": "The authoritative text on switching converters, DC-DC topologies, and power semiconductors.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-pcb",
        "videoTitle": "PCB Design with KiCad",
        "videoInstructor": "Phil's Lab",
        "videoUrl": "https://www.youtube.com/watch?v=aVUqaB0IMh4",
        "videoDescription": "Excellent, practical walkthrough of schematic capture and multi-layer PCB layout.",
        "videoDuration": "2:10:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "PCB Design",
        "description": "Translate schematic diagrams into manufacturable, high-quality Printed Circuit Boards.",
        "stage": "APPLIED",
        "order": 9,
        "estimatedHours": 35,
        "prerequisites": [
          "ee-analog",
          "ee-digital"
        ],
        "skills": [
          "PCB Design",
          "Altium",
          "KiCad"
        ],
        "learningObjectives": [
          "Capture schematics and manage component libraries",
          "Route multi-layer PCBs considering signal integrity",
          "Implement proper grounding and decoupling techniques",
          "Generate Gerber files and BOMs for manufacturing"
        ],
        "topics": [
          "Schematic Capture",
          "PCB Layout and Routing",
          "Signal Integrity",
          "EMI/EMC Considerations",
          "Manufacturing Files (Gerbers)"
        ],
        "practicalExercise": "Layout a 4-layer PCB for a microcontroller board, ensuring continuous ground planes and impedance-matched USB traces.",
        "recommendedBookTitle": "KiCad Documentation",
        "recommendedBookAuthor": "KiCad Developers",
        "recommendedBookUrl": "https://docs.kicad.org/",
        "recommendedBookDescription": "The official guide for schematic capture and PCB layout using the industry-leading open-source EDA tool.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "ee-rf",
        "videoTitle": "Microwave Engineering",
        "videoInstructor": "IIT Guwahati",
        "videoUrl": "https://www.youtube.com/playlist?list=PLm2b3P6H66y7T5d29rFkC1G10g3V10-jI",
        "videoDescription": "NPTEL course on transmission lines, Smith charts, and waveguides.",
        "videoDuration": "25:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "RF & Microwave",
        "description": "Engineer high-frequency circuits where lumped-element approximations no longer apply.",
        "stage": "SPECIALIZATION",
        "order": 10,
        "estimatedHours": 45,
        "prerequisites": [
          "ee-physics",
          "ee-analog"
        ],
        "skills": [
          "RF Engineering",
          "Microwave Engineering"
        ],
        "learningObjectives": [
          "Utilize the Smith Chart for impedance matching",
          "Design microstrip and stripline transmission lines",
          "Evaluate S-parameters for RF components",
          "Design RF amplifiers and oscillators"
        ],
        "topics": [
          "Transmission Line Theory",
          "Smith Charts",
          "S-Parameters",
          "RF Amplifiers",
          "Impedance Matching Networks"
        ],
        "practicalExercise": "Design an L-section impedance matching network to match a 50-ohm source to a complex load at 2.4 GHz using a Smith Chart.",
        "recommendedBookTitle": "Microwave Engineering",
        "recommendedBookAuthor": "David M. Pozar",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Microwave+Engineering%2C+4th+Edition-p-9780470631553",
        "recommendedBookDescription": "The absolute standard for RF design, S-parameters, Smith charts, and high-frequency circuit analysis.",
        "resourceType": "BOOK"
      },
      {
        "key": "ee-vlsi",
        "videoTitle": "Introduction to VLSI Design",
        "videoInstructor": "NPTEL Faculty",
        "videoUrl": "https://nptel.ac.in/courses/108107129",
        "videoDescription": "Combinational and sequential circuit design, Verilog modeling, and design flow.",
        "videoDuration": "30:00:00",
        "videoPlatform": "NPTEL",
        "videoType": "COURSE",
        "title": "VLSI Design",
        "description": "Design Complex Integrated Circuits (ICs) using hardware description languages and CMOS technology.",
        "stage": "SPECIALIZATION",
        "order": 11,
        "estimatedHours": 50,
        "prerequisites": [
          "ee-digital"
        ],
        "skills": [
          "VLSI",
          "Verilog",
          "VHDL",
          "ASIC Design"
        ],
        "learningObjectives": [
          "Analyze CMOS inverter voltage transfer characteristics",
          "Write synthesizable Verilog/VHDL code",
          "Perform static timing analysis on digital pipelines",
          "Evaluate power dissipation in CMOS logic"
        ],
        "topics": [
          "CMOS Technology",
          "Hardware Description Languages (Verilog/VHDL)",
          "Logic Synthesis",
          "Static Timing Analysis",
          "ASIC Design Flow"
        ],
        "practicalExercise": "Write a synthesizable Verilog module for a 16-bit ALU and write a testbench to verify its arithmetic and logic operations.",
        "recommendedBookTitle": "CMOS VLSI Design: A Circuits and Systems Perspective",
        "recommendedBookAuthor": "Neil Weste, David Harris",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/cmos-vlsi-design-a-circuits-and-systems-perspective/P200000003180/9780321547743",
        "recommendedBookDescription": "The essential textbook for understanding CMOS technology, digital IC design, and VLSI architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "circuit-theory",
        "title": "Circuit Theory",
        "description": "Develop a strong foundation in linear circuit analysis and fundamental electrical laws.",
        "learningObjectives": [
          "Apply Kirchhoff's laws to complex resistive networks.",
          "Analyze RLC circuits in both time and frequency domains.",
          "Calculate real, reactive, and apparent power in AC circuits."
        ],
        "topics": [
          "Ohm's Law",
          "Kirchhoff's Laws",
          "Thevenin & Norton Equivalent",
          "AC/DC Analysis",
          "RLC Circuits",
          "Phasors",
          "Operational Amplifiers"
        ],
        "practicalExercise": "Simulate an RLC bandpass filter in LTspice and measure its resonant frequency and bandwidth.",
        "skills": [
          "Circuit Analysis",
          "LTspice",
          "Electronics Engineering"
        ],
        "stage": "Advanced",
        "order": 12,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Fundamentals of Electric Circuits",
        "recommendedBookAuthor": "Charles Alexander, Matthew Sadiku",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/fundamentals-electric-circuits-alexander-sadiku/M9781260226409.html",
        "recommendedBookDescription": "Accessible and comprehensive introduction to circuit analysis.",
        "resourceType": "BOOK",
        "videoTitle": "EEVblog #859 - Bypass Capacitor Tutorial",
        "videoInstructor": "Dave Jones",
        "videoUrl": "https://www.youtube.com/watch?v=BcJ6UdDx1vg",
        "videoDescription": "Practical demonstration of circuit theory applied to decoupling.",
        "videoDuration": "30m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "digital-logic-design",
        "title": "Digital Logic Design",
        "description": "Design and analyze combinational and sequential logic circuits for digital systems.",
        "learningObjectives": [
          "Simplify boolean expressions using Karnaugh Maps.",
          "Design finite state machines (FSMs) for control logic.",
          "Implement digital circuits using Hardware Description Languages (HDL)."
        ],
        "topics": [
          "Boolean Algebra",
          "Logic Gates",
          "Flip-Flops",
          "FSMs",
          "Multiplexers",
          "Verilog/VHDL",
          "Timing Analysis"
        ],
        "practicalExercise": "Write a Verilog module for a traffic light controller FSM and simulate its testbench.",
        "skills": [
          "Digital Logic",
          "Verilog",
          "FPGA"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Digital Design",
        "recommendedBookAuthor": "M. Morris Mano",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/digital-design-with-an-introduction-to-the-verilog-hdl-vhdl-and-systemverilog/P200000003254/9780134549897",
        "recommendedBookDescription": "Classic textbook on modern digital design and HDL.",
        "resourceType": "BOOK",
        "videoTitle": "Crash Course Computer Science: Boolean Logic",
        "videoInstructor": "Carrie Anne Philbin",
        "videoUrl": "https://www.youtube.com/watch?v=gI-qXk7XojA",
        "videoDescription": "High-level overview of digital logic foundations.",
        "videoDuration": "10m",
        "videoPlatform": "YouTube",
        "videoType": "COURSE"
      },
      {
        "key": "signal-integrity",
        "title": "Signal Integrity",
        "description": "Understand high-speed digital design principles to prevent signal degradation on PCBs.",
        "learningObjectives": [
          "Model transmission lines and identify impedance mismatches.",
          "Analyze cross-talk and ground bounce in high-speed traces.",
          "Design proper termination schemes for digital signals."
        ],
        "topics": [
          "Transmission Lines",
          "Impedance Matching",
          "Cross-talk",
          "Reflections",
          "EMI/EMC",
          "Decoupling",
          "Eye Diagrams"
        ],
        "practicalExercise": "Use HyperLynx or a free SI simulator to analyze the reflection on an unterminated 100MHz clock trace.",
        "skills": [
          "PCB Design",
          "Signal Integrity",
          "High-Speed Design"
        ],
        "stage": "Advanced",
        "order": 14,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "High-Speed Digital Design: A Handbook of Black Magic",
        "recommendedBookAuthor": "Howard Johnson, Martin Graham",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/high-speed-digital-design-a-handbook-of-black-magic/P200000009581/9780133957242",
        "recommendedBookDescription": "The definitive guide to high-speed signaling and PCB design.",
        "resourceType": "BOOK",
        "videoTitle": "Eric Bogatin on Signal Integrity",
        "videoInstructor": "Eric Bogatin",
        "videoUrl": "https://www.youtube.com/watch?v=8V-w5t1s5F4",
        "videoDescription": "Key rules of thumb for high-speed PCB design.",
        "videoDuration": "1h",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE"
      }
    ]
  },
  {
    "title": "IoT Engineering",
    "slug": "iot-engineering",
    "description": "Connect embedded devices to the cloud and build smart systems.",
    "category": "Engineering",
    "difficulty": "Intermediate",
    "estimatedHours": 420,
    "nodes": [
      {
        "key": "iot-fund",
        "videoTitle": "Introduction to Internet of Things",
        "videoInstructor": "Prof. Sudip Misra",
        "videoUrl": "https://nptel.ac.in/courses/106105166",
        "videoDescription": "A comprehensive foundational course covering the complete architecture and applications of IoT systems.",
        "videoDuration": "30:00:00",
        "videoPlatform": "NPTEL",
        "videoType": "COURSE",
        "title": "IoT Fundamentals",
        "description": "Understand the architecture of Internet of Things systems, from edge devices to cloud processing.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 15,
        "prerequisites": [],
        "skills": [
          "IoT",
          "Systems Architecture"
        ],
        "learningObjectives": [
          "Define the layers of an IoT architecture",
          "Identify appropriate use cases for IoT solutions",
          "Compare edge computing vs cloud processing"
        ],
        "topics": [
          "Edge Devices",
          "Gateways",
          "Cloud Integration",
          "IoT Security Fundamentals"
        ],
        "practicalExercise": "Design a high-level architecture diagram for a smart home temperature monitoring system.",
        "recommendedBookTitle": "Designing the Internet of Things",
        "recommendedBookAuthor": "Adrian McEwen & Hakim Cassimally",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Designing+the+Internet+of+Things-p-9781118430620",
        "recommendedBookDescription": "A foundational text on IoT architecture covering edge devices, networking, and cloud services.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-hw",
        "videoTitle": "Practical Programming in C (6.087)",
        "videoInstructor": "MIT OCW",
        "videoUrl": "https://ocw.mit.edu/courses/6-087-practical-programming-in-c-january-iap-2010/",
        "videoDescription": "Foundational C programming essential for embedded systems hardware.",
        "videoDuration": "15:00:00",
        "videoPlatform": "MIT OCW",
        "videoType": "COURSE",
        "title": "Embedded Hardware",
        "description": "Comprehend the fundamental hardware components used in IoT devices, including microcontrollers and basic circuits.",
        "stage": "EDGE",
        "order": 2,
        "estimatedHours": 30,
        "prerequisites": [
          "iot-fund"
        ],
        "skills": [
          "Embedded Systems",
          "Microcontrollers",
          "Raspberry Pi"
        ],
        "learningObjectives": [
          "Differentiate between popular microcontrollers like Arduino and ESP32",
          "Explain the role of GPIO pins in hardware interfacing",
          "Understand basic power management in embedded systems"
        ],
        "topics": [
          "Microcontroller Architectures",
          "GPIO Interfaces",
          "Analog to Digital Converters",
          "Power Regulators"
        ],
        "practicalExercise": "Wire an LED and a push button to a microcontroller development board.",
        "recommendedBookTitle": "Exploring Arduino",
        "recommendedBookAuthor": "Jeremy Blum",
        "recommendedBookUrl": "https://www.exploringarduino.com/",
        "recommendedBookDescription": "An excellent guide to microcontrollers and basic circuits for embedded IoT hardware.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-prog",
        "videoTitle": "C++ Programming Course - Beginner to Advanced",
        "videoInstructor": "freeCodeCamp.org",
        "videoUrl": "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
        "videoDescription": "Master the C/C++ programming required to write robust edge device firmware.",
        "videoDuration": "31:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Edge Programming",
        "description": "Develop firmware for embedded devices using languages like C, C++, and MicroPython.",
        "stage": "EDGE",
        "order": 3,
        "estimatedHours": 35,
        "prerequisites": [
          "iot-hw"
        ],
        "skills": [
          "C",
          "C++",
          "Python",
          "MicroPython"
        ],
        "learningObjectives": [
          "Write basic control structures in C/C++ for microcontrollers",
          "Implement interrupt service routines for responsive systems",
          "Deploy code to a physical device"
        ],
        "topics": [
          "Embedded C/C++",
          "Memory Management",
          "Interrupts and Polling",
          "MicroPython"
        ],
        "practicalExercise": "Write a program that blinks an LED at varying intervals based on button presses.",
        "recommendedBookTitle": "Making Embedded Systems",
        "recommendedBookAuthor": "Elecia White",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/",
        "recommendedBookDescription": "The industry standard book for learning C/C++ embedded programming and memory management.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-sensors",
        "videoTitle": "Sensors and Actuators",
        "videoInstructor": "Prof. Hardik Jeetendra Pandya",
        "videoUrl": "https://nptel.ac.in/courses/108108147",
        "videoDescription": "IISc Bangalore course on microfabrication, sensors, and real-world applications.",
        "videoDuration": "20:00:00",
        "videoPlatform": "NPTEL",
        "videoType": "COURSE",
        "title": "Sensors & Actuators",
        "description": "Interface microcontrollers with various sensors and actuators to interact with the physical environment.",
        "stage": "EDGE",
        "order": 4,
        "estimatedHours": 30,
        "prerequisites": [
          "iot-prog"
        ],
        "skills": [
          "Sensors",
          "Actuators",
          "Hardware Interfaces"
        ],
        "learningObjectives": [
          "Read analog and digital signals from sensors",
          "Control actuators like motors or relays",
          "Calibrate sensor data for accuracy"
        ],
        "topics": [
          "Digital Sensors",
          "Analog Sensors",
          "Motor Controllers",
          "Signal Conditioning"
        ],
        "practicalExercise": "Build a circuit that reads ambient light levels and controls a servo motor accordingly.",
        "recommendedBookTitle": "Practical Electronics for Inventors",
        "recommendedBookAuthor": "Paul Scherz, Simon Monk",
        "recommendedBookUrl": "https://www.mheducation.com/highered/product/practical-electronics-inventors-fourth-edition-scherz-monk/9781259587542.html",
        "recommendedBookDescription": "A highly authoritative book for understanding and interfacing with all types of sensors and actuators.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-net",
        "videoTitle": "Computer Networking Full Course",
        "videoInstructor": "NetworkChuck",
        "videoUrl": "https://www.youtube.com/watch?v=IPvYjXCsTg8",
        "videoDescription": "A fun and practical introduction to TCP/IP and networking basics.",
        "videoDuration": "1:30:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "IoT Networking",
        "description": "Establish network connectivity for IoT devices using standard networking protocols.",
        "stage": "CONNECTIVITY",
        "order": 5,
        "estimatedHours": 25,
        "prerequisites": [
          "iot-fund"
        ],
        "skills": [
          "Computer Networking",
          "TCP/IP"
        ],
        "learningObjectives": [
          "Configure WiFi credentials on an embedded device",
          "Understand the basics of TCP/IP communication",
          "Set up a local network gateway"
        ],
        "topics": [
          "WiFi and Ethernet",
          "TCP/IP Stack",
          "MAC and IP Addressing",
          "Network Gateways"
        ],
        "practicalExercise": "Connect an ESP32 to a local WiFi network and ping a known server.",
        "recommendedBookTitle": "Computer Networking: A Top-Down Approach",
        "recommendedBookAuthor": "James Kurose & Keith Ross",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003335/9780136681557",
        "recommendedBookDescription": "The most definitive guide to TCP/IP and networking fundamentals applicable to IoT connectivity.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-lpwan",
        "videoTitle": "What is LoRa and LoRaWAN?",
        "videoInstructor": "Andreas Spiess",
        "videoUrl": "https://www.youtube.com/watch?v=hMOwbNUpDQA",
        "videoDescription": "In-depth explanation of LPWAN technologies, focusing on LoRa architecture and implementation.",
        "videoDuration": "18:20",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Low Power Wireless",
        "description": "Utilize low-power wide-area networks for long-range, energy-efficient IoT communication.",
        "stage": "CONNECTIVITY",
        "order": 6,
        "estimatedHours": 35,
        "prerequisites": [
          "iot-net"
        ],
        "skills": [
          "Wireless Networking",
          "BLE",
          "LoRaWAN",
          "Zigbee"
        ],
        "learningObjectives": [
          "Compare LPWAN technologies like LoRaWAN, NB-IoT, and Sigfox",
          "Configure a LoRaWAN node and connect to a gateway",
          "Optimize data payloads for low bandwidth networks"
        ],
        "topics": [
          "LoRa and LoRaWAN",
          "BLE Mesh",
          "Zigbee",
          "Cellular IoT"
        ],
        "practicalExercise": "Transmit dummy sensor data over a simulated LoRaWAN network.",
        "recommendedBookTitle": "LoRaWAN Official Documentation",
        "recommendedBookAuthor": "LoRa Alliance",
        "recommendedBookUrl": "https://lora-alliance.org/about-lorawan/",
        "recommendedBookDescription": "The official specs and guidelines for implementing low power wide area networks using LoRaWAN.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "iot-proto",
        "videoTitle": "How MQTT Works - Beginners Guide",
        "videoInstructor": "Steve Cope",
        "videoUrl": "https://steves-internet-guide.com/mqtt/",
        "videoDescription": "Comprehensive guide and video tutorials on MQTT, QoS, and retained messages.",
        "videoDuration": "01:30:00",
        "videoPlatform": "Steve's Internet Guide",
        "videoType": "TUTORIAL",
        "title": "IoT Protocols",
        "description": "Implement specialized IoT application-layer protocols for efficient data transfer.",
        "stage": "CONNECTIVITY",
        "order": 7,
        "estimatedHours": 30,
        "prerequisites": [
          "iot-net"
        ],
        "skills": [
          "MQTT",
          "CoAP",
          "WebSockets",
          "Network Protocols"
        ],
        "learningObjectives": [
          "Publish and subscribe to MQTT topics",
          "Explain the advantages of CoAP over HTTP for constrained devices",
          "Secure protocol communications using basic encryption"
        ],
        "topics": [
          "MQTT Architecture",
          "CoAP Protocol",
          "WebSockets",
          "Payload Serialization (JSON/CBOR)"
        ],
        "practicalExercise": "Set up an MQTT broker and write a script to publish temperature data to it.",
        "recommendedBookTitle": "MQTT Version 5.0 Specification",
        "recommendedBookAuthor": "OASIS",
        "recommendedBookUrl": "https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html",
        "recommendedBookDescription": "The official standard specification for MQTT, the premier lightweight messaging protocol for IoT.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "iot-cloud",
        "videoTitle": "Getting Started with AWS IoT",
        "videoInstructor": "AWS Training Center",
        "videoUrl": "https://explore.skillbuilder.aws/",
        "videoDescription": "Self-paced course covering key concepts and real-world AWS IoT Core use cases.",
        "videoDuration": "02:00:00",
        "videoPlatform": "AWS Skill Builder",
        "videoType": "OFFICIAL",
        "title": "Cloud Integration",
        "description": "Integrate edge devices with cloud platforms for data aggregation and remote management.",
        "stage": "CLOUD",
        "order": 8,
        "estimatedHours": 40,
        "prerequisites": [
          "iot-proto"
        ],
        "skills": [
          "Cloud Computing",
          "AWS IoT",
          "Azure IoT"
        ],
        "learningObjectives": [
          "Provision an IoT device on AWS IoT or Azure IoT Hub",
          "Implement cloud-to-device messaging",
          "Configure basic serverless functions for data processing"
        ],
        "topics": [
          "Cloud Device Management",
          "AWS IoT Core",
          "Azure IoT Hub",
          "Serverless Data Pipelines"
        ],
        "practicalExercise": "Register a virtual device on a cloud platform and stream telemetry data.",
        "recommendedBookTitle": "AWS IoT Core Documentation",
        "recommendedBookAuthor": "Amazon Web Services",
        "recommendedBookUrl": "https://docs.aws.amazon.com/iot/",
        "recommendedBookDescription": "The authoritative guide to connecting, managing, and securing edge devices in the AWS cloud.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "iot-data",
        "videoTitle": "InfluxDB: The Basics of Time Series Data",
        "videoInstructor": "InfluxData",
        "videoUrl": "https://www.youtube.com/watch?v=n5o49P5ePZ4",
        "videoDescription": "Foundational concepts for managing time-series data with InfluxDB.",
        "videoDuration": "00:45:00",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL",
        "title": "Time-Series Data",
        "description": "Store, query, and visualize time-series data generated by IoT fleets.",
        "stage": "CLOUD",
        "order": 9,
        "estimatedHours": 30,
        "prerequisites": [
          "iot-cloud"
        ],
        "skills": [
          "Time-Series Databases",
          "InfluxDB",
          "Data Analytics"
        ],
        "learningObjectives": [
          "Design a schema for time-series data",
          "Query time-series databases for trends and anomalies",
          "Create real-time dashboards for monitoring"
        ],
        "topics": [
          "Time-Series Databases (InfluxDB)",
          "Data Visualization (Grafana)",
          "Data Aggregation",
          "Anomaly Detection"
        ],
        "practicalExercise": "Build a Grafana dashboard visualizing historical temperature and humidity data.",
        "recommendedBookTitle": "InfluxDB Official Documentation",
        "recommendedBookAuthor": "InfluxData",
        "recommendedBookUrl": "https://docs.influxdata.com/",
        "recommendedBookDescription": "Comprehensive documentation for storing and querying time-series data at scale.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "iot-sec",
        "videoTitle": "IoT & Hardware Hacking for Beginners",
        "videoInstructor": "The Cyber Mentor",
        "videoUrl": "https://www.youtube.com/watch?v=kGq_0k0y0hU",
        "videoDescription": "9+ hour course covering PCB analysis, UART hacking, and IoT OSINT.",
        "videoDuration": "09:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "IoT Security",
        "description": "Secure IoT devices and networks against unauthorized access and data breaches.",
        "stage": "SECURITY",
        "order": 10,
        "estimatedHours": 40,
        "prerequisites": [
          "iot-proto",
          "iot-hw"
        ],
        "skills": [
          "IoT Security",
          "Cryptography",
          "Embedded Security"
        ],
        "learningObjectives": [
          "Implement TLS/DTLS for secure communication",
          "Manage device identities and certificates",
          "Perform secure over-the-air (OTA) updates"
        ],
        "topics": [
          "Device Authentication",
          "Data Encryption",
          "Secure Boot",
          "OTA Updates"
        ],
        "practicalExercise": "Generate X.509 certificates and use them to authenticate an MQTT client.",
        "recommendedBookTitle": "Practical IoT Hacking",
        "recommendedBookAuthor": "Fotios Chantzis",
        "recommendedBookUrl": "https://nostarch.com/practical-iot-hacking",
        "recommendedBookDescription": "A hands-on guide covering threat modeling, device authentication, and securing the entire IoT ecosystem.",
        "resourceType": "BOOK"
      },
      {
        "key": "iot-edgeai",
        "videoTitle": "Tiny ML, Harvard Style",
        "videoInstructor": "Prof. Vijay Janapa Reddi",
        "videoUrl": "https://www.youtube.com/watch?v=F_Yw3a7y79g",
        "videoDescription": "In-depth seminar on the vision and technical challenges of TinyML.",
        "videoDuration": "01:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Edge AI / TinyML",
        "description": "Deploy machine learning models directly onto edge devices for local inference.",
        "stage": "ADVANCED",
        "order": 11,
        "estimatedHours": 40,
        "prerequisites": [
          "iot-prog",
          "iot-data"
        ],
        "skills": [
          "TinyML",
          "Edge Computing",
          "Machine Learning"
        ],
        "learningObjectives": [
          "Quantize ML models for constrained environments",
          "Run inference on a microcontroller using TinyML frameworks",
          "Reduce latency and bandwidth usage via edge processing"
        ],
        "topics": [
          "TinyML Concepts",
          "Model Quantization",
          "TensorFlow Lite for Microcontrollers",
          "Edge Inference"
        ],
        "practicalExercise": "Train a simple wake-word detection model and deploy it to an ESP32.",
        "recommendedBookTitle": "TinyML",
        "recommendedBookAuthor": "Pete Warden & Daniel Situnayake",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/tinyml/9781492052036/",
        "recommendedBookDescription": "The pioneering book on running machine learning models on microcontrollers and edge devices.",
        "resourceType": "BOOK"
      },
      {
        "key": "embedded-systems-basics",
        "title": "Embedded Systems Basics",
        "description": "Learn the architecture of microcontrollers and write bare-metal firmware.",
        "learningObjectives": [
          "Interface microcontrollers with peripherals using I2C/SPI/UART.",
          "Implement interrupt service routines (ISRs) efficiently.",
          "Manage hardware timers and PWM outputs."
        ],
        "topics": [
          "Microcontrollers",
          "Interrupts",
          "Timers/PWM",
          "I2C/SPI/UART",
          "ADC/DAC",
          "Bare-metal C",
          "Watchdogs"
        ],
        "practicalExercise": "Write a bare-metal C program to read an analog temperature sensor and output the value over UART via interrupts.",
        "skills": [
          "C",
          "Embedded Systems",
          "Hardware Integration"
        ],
        "stage": "Advanced",
        "order": 12,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Making Embedded Systems",
        "recommendedBookAuthor": "Elecia White",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/making-embedded-systems/9781449308580/",
        "recommendedBookDescription": "Design patterns and best practices for developing embedded software.",
        "resourceType": "BOOK",
        "videoTitle": "Embedded Systems Programming Lesson 0",
        "videoInstructor": "Quantum Leaps",
        "videoUrl": "https://www.youtube.com/watch?v=3V9eqvkMzHA",
        "videoDescription": "Excellent series on building embedded firmware from the ground up.",
        "videoDuration": "15m",
        "videoPlatform": "YouTube",
        "videoType": "COURSE"
      },
      {
        "key": "iot-sensors-data",
        "title": "IoT Sensors & Data",
        "description": "Acquire data from physical environments using IoT sensors and preprocess it at the edge.",
        "learningObjectives": [
          "Select appropriate sensors for environmental, motion, or structural monitoring.",
          "Apply digital filters to clean noisy sensor data.",
          "Implement edge processing to reduce transmission bandwidth."
        ],
        "topics": [
          "Sensor Types (MEMS, Optical, etc.)",
          "Signal Conditioning",
          "Digital Filtering",
          "Edge Computing",
          "Data Calibration",
          "Sampling Theorem"
        ],
        "practicalExercise": "Interface an MPU6050 accelerometer with a microcontroller and apply a simple moving average filter to smooth the data.",
        "skills": [
          "IoT",
          "Sensor Interfacing",
          "Data Processing"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "IoT Fundamentals",
        "recommendedBookAuthor": "David Hanes et al.",
        "recommendedBookUrl": "https://www.ciscopress.com/store/iot-fundamentals-networking-technologies-protocols-9781587144561",
        "recommendedBookDescription": "Networking technologies, protocols, and use cases for the Internet of Things.",
        "resourceType": "BOOK",
        "videoTitle": "How MEMS Accelerometers Work",
        "videoInstructor": "RealPars",
        "videoUrl": "https://www.youtube.com/watch?v=KZVgKu6v808",
        "videoDescription": "Visual explanation of internal sensor mechanics.",
        "videoDuration": "8m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "wireless-protocols",
        "title": "Wireless Protocols",
        "description": "Analyze local and personal area wireless networks optimized for IoT devices.",
        "learningObjectives": [
          "Compare power consumption and range of BLE, Zigbee, and Wi-Fi.",
          "Understand mesh networking topologies and routing.",
          "Implement low-power sleep modes in wireless nodes."
        ],
        "topics": [
          "Bluetooth Low Energy (BLE)",
          "Zigbee",
          "LoRaWAN",
          "Wi-Fi",
          "Mesh Networks",
          "Low Power Wide Area Networks (LPWAN)",
          "Security Handshakes"
        ],
        "practicalExercise": "Configure two ESP32 devices to communicate via BLE, one acting as a GATT server and the other as a client.",
        "skills": [
          "Wireless Protocols",
          "IoT",
          "Embedded Systems"
        ],
        "stage": "Advanced",
        "order": 14,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Wireless Networking Technology",
        "recommendedBookAuthor": "Stephen A. Rackley",
        "recommendedBookUrl": "https://www.elsevier.com/books/wireless-networking-technology/rackley/978-0-7506-6788-3",
        "recommendedBookDescription": "Overview of physical and MAC layer characteristics of wireless networks.",
        "resourceType": "BOOK",
        "videoTitle": "BLE (Bluetooth Low Energy) Basics",
        "videoInstructor": "NovelBits",
        "videoUrl": "https://www.youtube.com/watch?v=F6I45Y1c3iY",
        "videoDescription": "Explanation of GATT profiles and BLE architecture.",
        "videoDuration": "20m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "iot-messaging",
        "title": "IoT Messaging",
        "description": "Design efficient and scalable message routing for constrained IoT networks.",
        "learningObjectives": [
          "Implement publish-subscribe architectures using MQTT.",
          "Compare MQTT, CoAP, and HTTP for IoT payloads.",
          "Design topic hierarchies and handle Quality of Service (QoS) levels."
        ],
        "topics": [
          "MQTT",
          "CoAP",
          "AMQP",
          "Publish/Subscribe",
          "QoS Levels",
          "Payload Serialization (JSON/Protobuf)"
        ],
        "practicalExercise": "Set up a local Mosquitto MQTT broker and write a Python script to publish and subscribe to telemetry topics.",
        "skills": [
          "MQTT",
          "IoT Architecture",
          "Networking"
        ],
        "stage": "Advanced",
        "order": 15,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "MQTT Essentials",
        "recommendedBookAuthor": "Gastón C. Hillar",
        "recommendedBookUrl": "https://www.packtpub.com/product/mqtt-essentials-a-lightweight-iot-protocol/9781787287815",
        "recommendedBookDescription": "Practical guide to the MQTT protocol and broker implementations.",
        "resourceType": "BOOK",
        "videoTitle": "What is MQTT and How It Works",
        "videoInstructor": "HiveMQ",
        "videoUrl": "https://www.youtube.com/watch?v=EHjMGO6nE1k",
        "videoDescription": "Clear overview of MQTT publish/subscribe mechanics.",
        "videoDuration": "10m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "iot-cloud-platforms",
        "title": "IoT Cloud Platforms",
        "description": "Integrate edge devices with cloud platforms for fleet management, data analytics, and digital twins.",
        "learningObjectives": [
          "Provision and authenticate IoT devices securely at scale.",
          "Build serverless data ingestion pipelines for telemetry.",
          "Model physical devices using Digital Twins."
        ],
        "topics": [
          "Device Provisioning",
          "AWS IoT Core / Azure IoT Hub",
          "Digital Twins",
          "Over-The-Air (OTA) Updates",
          "Time-Series Databases",
          "Fleet Management"
        ],
        "practicalExercise": "Provision a virtual device in AWS IoT Core and route its MQTT messages to a DynamoDB table.",
        "skills": [
          "Cloud Platforms",
          "AWS/Azure",
          "IoT Architecture"
        ],
        "stage": "Advanced",
        "order": 16,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Building the Internet of Things",
        "recommendedBookAuthor": "Maciej Kranz",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Building+the+Internet+of+Things%3A+Implement+New+Business+Models%2C+Disrupt+Competitors%2C+Transform+Your+Industry-p-9781119285663",
        "recommendedBookDescription": "Strategic approach to building enterprise IoT solutions.",
        "resourceType": "BOOK",
        "videoTitle": "AWS IoT Core - Complete Tutorial",
        "videoInstructor": "Be A Better Dev",
        "videoUrl": "https://www.youtube.com/watch?v=33K8L0H1M_c",
        "videoDescription": "Hands-on walkthrough of AWS IoT Core setup.",
        "videoDuration": "40m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      }
    ]
  },
  {
    "title": "Game Development",
    "slug": "game-development",
    "description": "Build interactive games, graphics engines, and real-time physics.",
    "category": "Engineering",
    "difficulty": "Intermediate",
    "estimatedHours": 450,
    "nodes": [
      {
        "key": "gd-prog",
        "videoTitle": "C# Fundamentals for Beginners",
        "videoInstructor": "Bob Tabor",
        "videoUrl": "https://dotnet.microsoft.com/en-us/learn/csharp",
        "videoDescription": "The perfect starting point for learning C#, the language used in Unity.",
        "videoDuration": "5:00:00",
        "videoPlatform": "Microsoft",
        "videoType": "OFFICIAL",
        "title": "Programming Foundations",
        "description": "Master the programming constructs and object-oriented principles essential for game development.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 40,
        "prerequisites": [],
        "skills": [
          "C++",
          "C#",
          "Object-Oriented Programming"
        ],
        "learningObjectives": [
          "Apply object-oriented principles to game design",
          "Manage memory efficiently in a gaming context",
          "Write scripts to control game logic and state"
        ],
        "topics": [
          "C++/C# Syntax",
          "Memory Management",
          "Object-Oriented Design",
          "Scripting Fundamentals"
        ],
        "practicalExercise": "Implement a basic character controller script handling movement and jumping.",
        "recommendedBookTitle": "C++ Primer",
        "recommendedBookAuthor": "Stanley B. Lippman",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/c-primer/P200000000185/9780321714114",
        "recommendedBookDescription": "The definitive guide to C++, essential for understanding memory and object-oriented paradigms in game development.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-math",
        "videoTitle": "Math for Game Developers",
        "videoInstructor": "Jorge Rodriguez",
        "videoUrl": "https://www.youtube.com/playlist?list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My",
        "videoDescription": "A playlist covering vectors, matrices, and quaternions specifically tailored for games.",
        "videoDuration": "10:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Math for Games",
        "description": "Apply mathematical concepts crucial for 3D graphics, physics, and gameplay mechanics.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 35,
        "prerequisites": [
          "gd-prog"
        ],
        "skills": [
          "Mathematics",
          "Linear Algebra",
          "3D Mathematics"
        ],
        "learningObjectives": [
          "Calculate vectors for movement and direction",
          "Utilize matrices for object transformations",
          "Apply quaternions for smooth 3D rotations"
        ],
        "topics": [
          "Vector Math",
          "Matrix Transformations",
          "Quaternions",
          "Trigonometry in Games"
        ],
        "practicalExercise": "Write a function to calculate the trajectory of a projectile given an initial velocity and angle.",
        "recommendedBookTitle": "3D Math Primer for Graphics and Game Development",
        "recommendedBookAuthor": "Fletcher Dunn, Ian Parberry",
        "recommendedBookUrl": "https://gamemath.com/",
        "recommendedBookDescription": "An accessible yet mathematically rigorous text on vectors, matrices, and quaternions for 3D games.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-ds",
        "videoTitle": "Data Structures and Algorithms",
        "videoInstructor": "Abdul Bari",
        "videoUrl": "https://www.youtube.com/@abdul_bari",
        "videoDescription": "Clear, in-depth logic and implementation of C/C++ data structures and algorithms.",
        "videoDuration": "40:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Data Structures & Algos",
        "description": "Implement efficient data structures and algorithms to handle complex game states.",
        "stage": "FOUNDATIONS",
        "order": 3,
        "estimatedHours": 30,
        "prerequisites": [
          "gd-prog"
        ],
        "skills": [
          "Data Structures",
          "Algorithms",
          "Optimization"
        ],
        "learningObjectives": [
          "Select appropriate data structures for spatial partitioning",
          "Optimize search algorithms for game entities",
          "Analyze the time complexity of game loops"
        ],
        "topics": [
          "Spatial Trees (Quadtrees/Octrees)",
          "Graph Algorithms",
          "Object Pooling",
          "Algorithm Complexity"
        ],
        "practicalExercise": "Implement an object pool for managing bullet projectiles in a shooter game.",
        "recommendedBookTitle": "Introduction to Algorithms",
        "recommendedBookAuthor": "Thomas H. Cormen",
        "recommendedBookUrl": "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        "recommendedBookDescription": "The standard academic reference for understanding complex algorithms and spatial data structures.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-engine",
        "videoTitle": "Unity Beginner Tutorial",
        "videoInstructor": "Brackeys",
        "videoUrl": "https://www.youtube.com/watch?v=IlKaB1etrik",
        "videoDescription": "The definitive tutorial for learning the Unity Engine interface and basics.",
        "videoDuration": "2:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Game Engines",
        "description": "Navigate and utilize professional game engines to assemble and build interactive experiences.",
        "stage": "CORE GAMEDEV",
        "order": 4,
        "estimatedHours": 45,
        "prerequisites": [
          "gd-prog"
        ],
        "skills": [
          "Game Engines",
          "Unity",
          "Unreal Engine"
        ],
        "learningObjectives": [
          "Navigate the interface of a major game engine like Unity or Unreal",
          "Assemble scenes using built-in assets and prefabs",
          "Configure project settings for different target platforms"
        ],
        "topics": [
          "Engine Interface & Navigation",
          "Scene Management",
          "Asset Pipelines",
          "Build Processes"
        ],
        "practicalExercise": "Create a simple multi-level scene with a main menu and basic transitions.",
        "recommendedBookTitle": "Unreal Engine 5 Documentation",
        "recommendedBookAuthor": "Epic Games",
        "recommendedBookUrl": "https://docs.unrealengine.com/5.0/en-US/",
        "recommendedBookDescription": "The official, comprehensive resource for navigating and building interactive scenes in Unreal Engine.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "gd-arch",
        "videoTitle": "Unity ECS Basics",
        "videoInstructor": "Jason Weimann",
        "videoUrl": "https://www.youtube.com/c/JasonWeimann",
        "videoDescription": "Guide to the Entity Component System (ECS) architecture in Unity.",
        "videoDuration": "00:45:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Game Architecture",
        "description": "Design scalable game architectures using modern patterns like Entity-Component-System (ECS).",
        "stage": "CORE GAMEDEV",
        "order": 5,
        "estimatedHours": 35,
        "prerequisites": [
          "gd-engine"
        ],
        "skills": [
          "Software Architecture",
          "ECS",
          "Game Design Patterns"
        ],
        "learningObjectives": [
          "Explain the game loop and frame timing",
          "Implement the Entity-Component-System architecture",
          "Apply common design patterns like Singleton and Observer"
        ],
        "topics": [
          "The Game Loop",
          "Entity-Component-System (ECS)",
          "Event Systems",
          "Design Patterns"
        ],
        "practicalExercise": "Refactor a monolithic game script into a component-based architecture.",
        "recommendedBookTitle": "Game Programming Patterns",
        "recommendedBookAuthor": "Robert Nystrom",
        "recommendedBookUrl": "https://gameprogrammingpatterns.com/",
        "recommendedBookDescription": "A must-read book that maps classic software design patterns to modern game engine architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-physics",
        "videoTitle": "Cyclone Game Physics Engine",
        "videoInstructor": "Ian Millington",
        "videoUrl": "https://github.com/idmillington/cyclone-physics",
        "videoDescription": "Source code and implementation guide for robust game physics.",
        "videoDuration": "05:00:00",
        "videoPlatform": "GitHub",
        "videoType": "COURSE",
        "title": "Physics Simulation",
        "description": "Simulate realistic physical interactions, collisions, and forces within a virtual world.",
        "stage": "SYSTEMS",
        "order": 6,
        "estimatedHours": 35,
        "prerequisites": [
          "gd-math",
          "gd-arch"
        ],
        "skills": [
          "Game Physics",
          "Physics Simulation"
        ],
        "learningObjectives": [
          "Configure rigid bodies and colliders",
          "Implement continuous vs discrete collision detection",
          "Apply physical forces and impulses via script"
        ],
        "topics": [
          "Rigid Body Dynamics",
          "Collision Detection",
          "Raycasting",
          "Physics Materials"
        ],
        "practicalExercise": "Create a physics-based puzzle where a ball must bounce off angled surfaces to hit a target.",
        "recommendedBookTitle": "Real-Time Collision Detection",
        "recommendedBookAuthor": "Christer Ericson",
        "recommendedBookUrl": "https://realtimecollisiondetection.net/",
        "recommendedBookDescription": "The absolute standard text for implementing physical simulation, raycasting, and collision detection.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-graphics",
        "videoTitle": "Shader Programming for Beginners",
        "videoInstructor": "Freya Holmér",
        "videoUrl": "https://www.youtube.com/watch?v=kfM-yu0iQBk",
        "videoDescription": "A brilliant visual introduction to writing shaders and the rendering pipeline.",
        "videoDuration": "3:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Graphics Programming",
        "description": "Program the rendering pipeline to create stunning visuals and custom shader effects.",
        "stage": "SYSTEMS",
        "order": 7,
        "estimatedHours": 50,
        "prerequisites": [
          "gd-math",
          "gd-arch"
        ],
        "skills": [
          "Graphics Programming",
          "Shaders",
          "OpenGL",
          "DirectX"
        ],
        "learningObjectives": [
          "Understand the stages of the graphics rendering pipeline",
          "Write custom shaders for materials and lighting",
          "Optimize rendering performance and draw calls"
        ],
        "topics": [
          "Rendering Pipelines",
          "Shader Programming (HLSL/GLSL)",
          "Lighting Models",
          "Post-Processing Effects"
        ],
        "practicalExercise": "Write a custom fragment shader to create a stylized 'toon' shading effect.",
        "recommendedBookTitle": "Real-Time Rendering",
        "recommendedBookAuthor": "Tomas Akenine-Möller",
        "recommendedBookUrl": "https://www.realtimerendering.com/",
        "recommendedBookDescription": "The industry bible for graphics programming, shaders, and the rendering pipeline.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-ai",
        "videoTitle": "A* Pathfinding Algorithm",
        "videoInstructor": "Sebastian Lague",
        "videoUrl": "https://github.com/SebLague/Pathfinding",
        "videoDescription": "Implementation series for the A* pathfinding algorithm in Unity.",
        "videoDuration": "02:00:00",
        "videoPlatform": "YouTube/GitHub",
        "videoType": "TUTORIAL",
        "title": "Game AI",
        "description": "Develop artificial intelligence for non-player characters to create engaging gameplay.",
        "stage": "SYSTEMS",
        "order": 8,
        "estimatedHours": 40,
        "prerequisites": [
          "gd-ds",
          "gd-arch"
        ],
        "skills": [
          "Game AI",
          "Pathfinding",
          "Artificial Intelligence"
        ],
        "learningObjectives": [
          "Implement A* pathfinding algorithms",
          "Design finite state machines for NPC behavior",
          "Create complex decision-making using behavior trees"
        ],
        "topics": [
          "Pathfinding (NavMesh & A*)",
          "Finite State Machines",
          "Behavior Trees",
          "Steering Behaviors"
        ],
        "practicalExercise": "Build an enemy AI that patrols waypoints and chases the player upon detection.",
        "recommendedBookTitle": "Programming Game AI by Example",
        "recommendedBookAuthor": "Mat Buckland",
        "recommendedBookUrl": "https://www.jbpub.com/catalog/9781556220784/",
        "recommendedBookDescription": "A classic hands-on book focusing on finite state machines, pathfinding, and autonomous agent behavior.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-audio",
        "videoTitle": "Introduction to FMOD for Unity",
        "videoInstructor": "FMOD",
        "videoUrl": "https://www.fmod.com/resources/documentation-studio",
        "videoDescription": "Learn how to integrate complex spatial audio using FMOD.",
        "videoDuration": "2:00:00",
        "videoPlatform": "FMOD",
        "videoType": "OFFICIAL",
        "title": "Audio Programming",
        "description": "Integrate and manipulate audio to create immersive and dynamic soundscapes.",
        "stage": "SYSTEMS",
        "order": 9,
        "estimatedHours": 25,
        "prerequisites": [
          "gd-arch"
        ],
        "skills": [
          "Audio Programming",
          "Digital Signal Processing"
        ],
        "learningObjectives": [
          "Implement 3D spatial audio and attenuation",
          "Manage audio sources, listeners, and mixing",
          "Trigger sound effects synchronously with animations"
        ],
        "topics": [
          "Spatial Audio",
          "Audio Mixers and DSP",
          "Dynamic Soundscapes",
          "FMOD / Wwise Integration"
        ],
        "practicalExercise": "Set up audio zones where background music seamlessly transitions based on player location.",
        "recommendedBookTitle": "Game Audio Implementation",
        "recommendedBookAuthor": "Richard Stevens, Dave Raybould",
        "recommendedBookUrl": "https://www.routledge.com/Game-Audio-Implementation-A-Practical-Guide-Using-the-Unreal-Engine/Stevens-Raybould/p/book/9781138777248",
        "recommendedBookDescription": "A comprehensive guide to integrating spatial audio and interactive soundscapes into game engines.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-net",
        "videoTitle": "Networking for Games",
        "videoInstructor": "Glenn Fiedler",
        "videoUrl": "https://gafferongames.com/post/client_server_connection/",
        "videoDescription": "A famous series on building custom UDP networked physics for multiplayer.",
        "videoDuration": "3:00:00",
        "videoPlatform": "GafferOnGames",
        "videoType": "LECTURE",
        "title": "Multiplayer Networking",
        "description": "Engineer multiplayer networking systems for synchronized, real-time gameplay.",
        "stage": "NETWORKING",
        "order": 10,
        "estimatedHours": 50,
        "prerequisites": [
          "gd-arch"
        ],
        "skills": [
          "Game Networking",
          "UDP",
          "Distributed Systems"
        ],
        "learningObjectives": [
          "Compare TCP vs UDP for game networking",
          "Implement client-side prediction and server reconciliation",
          "Synchronize game state across multiple clients"
        ],
        "topics": [
          "Network Protocols (UDP/TCP)",
          "State Synchronization",
          "Client Prediction",
          "Lag Compensation"
        ],
        "practicalExercise": "Implement a simple networked lobby where multiple players can chat and spawn avatars.",
        "recommendedBookTitle": "Multiplayer Game Programming",
        "recommendedBookAuthor": "Josh Glazer, Sanjay Madhav",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/multiplayer-game-programming-architecting-networked-games/P200000000216/9780134044955",
        "recommendedBookDescription": "The authoritative book on networked gameplay, state synchronization, and client-server architecture.",
        "resourceType": "BOOK"
      },
      {
        "key": "gd-opt",
        "videoTitle": "Performance and Optimization Learning Path",
        "videoInstructor": "Unity Technologies",
        "videoUrl": "https://learn.unity.com/",
        "videoDescription": "Official Unity techniques for optimizing framerate, memory, and CPU overhead.",
        "videoDuration": "03:00:00",
        "videoPlatform": "Unity Learn",
        "videoType": "OFFICIAL",
        "title": "Performance Optimization",
        "description": "Identify bottlenecks and optimize game performance across various hardware profiles.",
        "stage": "ADVANCED",
        "order": 11,
        "estimatedHours": 35,
        "prerequisites": [
          "gd-ds",
          "gd-engine"
        ],
        "skills": [
          "Performance Optimization",
          "Multithreading",
          "Profiling"
        ],
        "learningObjectives": [
          "Use profiling tools to identify CPU/GPU bottlenecks",
          "Implement multithreading for heavy computational tasks",
          "Optimize memory usage to prevent garbage collection spikes"
        ],
        "topics": [
          "Profiling Tools",
          "Memory Profiling",
          "Multithreading and Jobs",
          "LOD (Level of Detail) Systems"
        ],
        "practicalExercise": "Profile a scene with low framerate and apply optimization techniques to reach 60fps.",
        "recommendedBookTitle": "Game Engine Architecture",
        "recommendedBookAuthor": "Jason Gregory",
        "recommendedBookUrl": "https://www.gameenginebook.com/",
        "recommendedBookDescription": "Provides deep insights into profiling, memory optimization, and multithreading at the engine level.",
        "resourceType": "BOOK"
      },
      {
        "key": "c-performance",
        "title": "C++ & Performance",
        "description": "Write high-performance C++ code by leveraging modern language features and memory management techniques.",
        "learningObjectives": [
          "Manage memory efficiently using smart pointers.",
          "Optimize CPU cache utilization with data-oriented design.",
          "Profile and eliminate performance bottlenecks."
        ],
        "topics": [
          "Modern C++",
          "Memory Management",
          "Move Semantics",
          "Multithreading",
          "Cache Locality",
          "SIMD"
        ],
        "practicalExercise": "Rewrite an object-oriented particle system using a Data-Oriented Design (DOD) approach to improve cache hits.",
        "skills": [
          "C++",
          "Performance Optimization",
          "Systems Architecture"
        ],
        "stage": "Advanced",
        "order": 12,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Effective Modern C++",
        "recommendedBookAuthor": "Scott Meyers",
        "recommendedBookUrl": "https://www.oreilly.com/library/view/effective-modern-c/9781491908419/",
        "recommendedBookDescription": "Best practices for C++11 and C++14 to write correct and efficient code.",
        "resourceType": "BOOK",
        "videoTitle": "Data-Oriented Design and C++",
        "videoInstructor": "Mike Acton",
        "videoUrl": "https://www.youtube.com/watch?v=rX0ItVEVjHc",
        "videoDescription": "A legendary CppCon talk on hardware-aware programming.",
        "videoDuration": "1h30m",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE"
      },
      {
        "key": "game-engine-architecture",
        "title": "Game Engine Architecture",
        "description": "Understand the foundational subsystems of modern game engines and how they integrate.",
        "learningObjectives": [
          "Design a game loop with fixed and variable time steps.",
          "Implement a foundational entity-component system (ECS).",
          "Integrate physics and rendering subsystems."
        ],
        "topics": [
          "Game Loops",
          "Entity Component Systems",
          "Memory Allocators",
          "Physics Integration",
          "Rendering Pipelines",
          "Asset Management"
        ],
        "practicalExercise": "Build a minimal 2D game engine core with a custom memory allocator and a basic ECS.",
        "skills": [
          "C++",
          "Systems Architecture",
          "Game Development"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Game Engine Architecture",
        "recommendedBookAuthor": "Jason Gregory",
        "recommendedBookUrl": "https://www.gameenginebook.com/",
        "recommendedBookDescription": "Comprehensive guide to the theory and practice of game engine software development.",
        "resourceType": "BOOK",
        "videoTitle": "Game Engine Architecture: An Introduction",
        "videoInstructor": "Cherno",
        "videoUrl": "https://www.youtube.com/watch?v=i6eAUtsgsbA",
        "videoDescription": "Overview of building a game engine from scratch.",
        "videoDuration": "45m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      }
    ]
  },
  {
    "title": "Systems Engineering",
    "slug": "systems-engineering",
    "description": "Design and manage complex, multi-disciplinary engineering systems.",
    "category": "Engineering",
    "difficulty": "Advanced",
    "estimatedHours": 400,
    "nodes": [
      {
        "key": "sys-think",
        "videoTitle": "Introduction to Systems Thinking",
        "videoInstructor": "Dr. Russell Ackoff",
        "videoUrl": "https://www.youtube.com/watch?v=OqEeIG8aPPk",
        "videoDescription": "A classic lecture explaining the core concepts of holism and emergence.",
        "videoDuration": "1:12:00",
        "videoPlatform": "YouTube",
        "videoType": "CONFERENCE",
        "title": "Systems Thinking",
        "description": "Analyze complex systems by understanding their boundaries, components, and interrelationships.",
        "stage": "FOUNDATIONS",
        "order": 1,
        "estimatedHours": 25,
        "prerequisites": [],
        "skills": [
          "Systems Thinking",
          "Systems Engineering"
        ],
        "learningObjectives": [
          "Define system boundaries and environments",
          "Identify emergent properties in complex systems",
          "Map interdependencies between system components"
        ],
        "topics": [
          "System Lifecycles",
          "System Boundaries",
          "Emergence and Complexity",
          "Holistic Problem Solving"
        ],
        "practicalExercise": "Create a causal loop diagram detailing the interactions in an urban transit system.",
        "recommendedBookTitle": "Thinking in Systems: A Primer",
        "recommendedBookAuthor": "Donella H. Meadows",
        "recommendedBookUrl": "https://www.chelseagreen.com/product/thinking-in-systems/",
        "recommendedBookDescription": "The essential primer on understanding causal loops, emergence, and complex systems.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-req",
        "videoTitle": "Introduction to Systems Engineering",
        "videoInstructor": "UNSW",
        "videoUrl": "https://www.youtube.com/@UNSWCommunity",
        "videoDescription": "Broad coverage of systems engineering processes and requirements elicitation.",
        "videoDuration": "10:00:00",
        "videoPlatform": "YouTube",
        "videoType": "COURSE",
        "title": "Requirements Engineering",
        "description": "Elicit, define, and manage technical requirements throughout the system lifecycle.",
        "stage": "FOUNDATIONS",
        "order": 2,
        "estimatedHours": 35,
        "prerequisites": [
          "sys-think"
        ],
        "skills": [
          "Requirements Engineering",
          "Technical Writing"
        ],
        "learningObjectives": [
          "Elicit requirements from diverse stakeholders",
          "Write clear, verifiable, and unambiguous requirements",
          "Establish traceability matrices"
        ],
        "topics": [
          "Requirements Elicitation",
          "Functional vs Non-Functional Requirements",
          "Requirements Traceability",
          "Use Case Development"
        ],
        "practicalExercise": "Draft a set of formal requirements for an autonomous drone delivery service.",
        "recommendedBookTitle": "Requirements Engineering: From System Goals to UML Models to Software",
        "recommendedBookAuthor": "Axel van Lamsweerde",
        "recommendedBookUrl": "https://www.wiley.com/en-us/Requirements+Engineering%3A+From+System+Goals+to+UML+Models+to+Software+Specifications-p-9780470012703",
        "recommendedBookDescription": "A thorough academic and practical guide to eliciting and managing complex technical requirements.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-arch",
        "videoTitle": "System Architecture Design",
        "videoInstructor": "MIT OpenCourseWare",
        "videoUrl": "https://ocw.mit.edu/courses/16-885j-aircraft-systems-engineering-fall-2005/",
        "videoDescription": "Insight into functional and physical architecture using aerospace examples.",
        "videoDuration": "20:00:00",
        "videoPlatform": "MIT OCW",
        "videoType": "COURSE",
        "title": "System Architecture",
        "description": "Design robust system architectures by allocating functions to physical components.",
        "stage": "DESIGN",
        "order": 3,
        "estimatedHours": 40,
        "prerequisites": [
          "sys-req"
        ],
        "skills": [
          "Systems Architecture",
          "System Design"
        ],
        "learningObjectives": [
          "Develop functional and physical architectures",
          "Evaluate architectural trade-offs",
          "Document system architectures using standard frameworks"
        ],
        "topics": [
          "Functional Decomposition",
          "Physical Architecture",
          "Trade Studies",
          "Architecture Frameworks (e.g., DoDAF)"
        ],
        "practicalExercise": "Perform a functional decomposition of a commercial passenger aircraft.",
        "recommendedBookTitle": "Systems Architecture",
        "recommendedBookAuthor": "Edward Crawley, Bruce Cameron, Daniel Selva",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/systems-architecture/P200000006764/9780133973652",
        "recommendedBookDescription": "A modern guide to functional decomposition and system design methodologies used in aerospace and beyond.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-mbse",
        "videoTitle": "MBSE with SysML: Automated Consistency",
        "videoInstructor": "Lenny Delligatti",
        "videoUrl": "https://delligattiassociates.com/presentations/",
        "videoDescription": "Webinar covering automated consistency and the benefits of MBSE.",
        "videoDuration": "00:30:00",
        "videoPlatform": "Delligatti Associates",
        "videoType": "LECTURE",
        "title": "Model-Based Systems Eng (MBSE)",
        "description": "Apply model-based techniques to formalize system engineering practices using SysML.",
        "stage": "DESIGN",
        "order": 4,
        "estimatedHours": 45,
        "prerequisites": [
          "sys-arch"
        ],
        "skills": [
          "MBSE",
          "SysML",
          "Modeling"
        ],
        "learningObjectives": [
          "Read and create SysML diagrams",
          "Transition from document-based to model-based engineering",
          "Understand the concept of a digital twin"
        ],
        "topics": [
          "SysML Foundations",
          "Model Integration",
          "Digital Threads",
          "MBSE Tools (e.g., Cameo)"
        ],
        "practicalExercise": "Model the state machine of a smart thermostat using SysML.",
        "recommendedBookTitle": "A Practical Guide to SysML",
        "recommendedBookAuthor": "Sanford Friedenthal, Alan Moore, Rick Steiner",
        "recommendedBookUrl": "https://www.elsevier.com/books/a-practical-guide-to-sysml/friedenthal/978-0-12-800202-5",
        "recommendedBookDescription": "The definitive reference for Model-Based Systems Engineering and SysML by its creators.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-icd",
        "videoTitle": "Interface Management in Systems Engineering",
        "videoInstructor": "INCOSE",
        "videoUrl": "https://www.incose.org/incose-member-resources/webinars",
        "videoDescription": "Standard INCOSE practices for interface control documents and ICDs.",
        "videoDuration": "01:00:00",
        "videoPlatform": "INCOSE",
        "videoType": "CONFERENCE",
        "title": "Interface Management",
        "description": "Define and manage interfaces between disparate system components or subsystems.",
        "stage": "DESIGN",
        "order": 5,
        "estimatedHours": 30,
        "prerequisites": [
          "sys-arch"
        ],
        "skills": [
          "Interface Management",
          "API Design",
          "Integration"
        ],
        "learningObjectives": [
          "Identify internal and external system interfaces",
          "Draft comprehensive Interface Control Documents (ICDs)",
          "Manage physical and logical boundary interactions"
        ],
        "topics": [
          "Interface Identification",
          "Interface Control Documents (ICD)",
          "API Specifications",
          "N-Squared Charts"
        ],
        "practicalExercise": "Create an N-Squared chart identifying interfaces between subsystems of a satellite.",
        "recommendedBookTitle": "System Engineering Analysis, Design, and Development",
        "recommendedBookAuthor": "Charles S. Wasson",
        "recommendedBookUrl": "https://www.wiley.com/en-us/System+Engineering+Analysis%2C+Design%2C+and+Development%3A+Concepts%2C+Principles%2C+and+Practices%2C+2nd+Edition-p-9781118442265",
        "recommendedBookDescription": "Extensive coverage of interface management, system boundaries, and API specification practices.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-vv",
        "videoTitle": "Verification and Validation (16.842)",
        "videoInstructor": "Prof. Olivier de Weck",
        "videoUrl": "https://www.youtube.com/watch?v=kG-x8gYp9E8",
        "videoDescription": "MIT lecture on design verification, technical risk management, and V&V curves.",
        "videoDuration": "01:25:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Verification & Validation",
        "description": "Plan and execute verification and validation activities to ensure system compliance and suitability.",
        "stage": "LIFECYCLE",
        "order": 6,
        "estimatedHours": 40,
        "prerequisites": [
          "sys-req"
        ],
        "skills": [
          "Verification",
          "Validation",
          "Testing"
        ],
        "learningObjectives": [
          "Differentiate between verification and validation",
          "Develop comprehensive test plans",
          "Trace test cases back to original requirements"
        ],
        "topics": [
          "V&V Methodologies",
          "Test Planning",
          "Acceptance Testing",
          "Traceability Matrices"
        ],
        "practicalExercise": "Design a test plan to verify the emergency braking system of a modern train.",
        "recommendedBookTitle": "INCOSE Systems Engineering Handbook",
        "recommendedBookAuthor": "INCOSE",
        "recommendedBookUrl": "https://www.incose.org/systems-engineering-certification/se-handbook",
        "recommendedBookDescription": "The global official standard for systems engineering processes including verification and validation.",
        "resourceType": "OFFICIAL_DOCUMENTATION"
      },
      {
        "key": "sys-risk",
        "videoTitle": "Risk Management",
        "videoInstructor": "Coursera",
        "videoUrl": "https://www.coursera.org/learn/risk-management",
        "videoDescription": "Identification, assessment, and mitigation of risks in system life cycles.",
        "videoDuration": "10:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Risk Management",
        "description": "Identify, analyze, and mitigate risks across the system development lifecycle.",
        "stage": "MANAGEMENT",
        "order": 7,
        "estimatedHours": 35,
        "prerequisites": [
          "sys-arch"
        ],
        "skills": [
          "Risk Management",
          "FMEA",
          "Reliability"
        ],
        "learningObjectives": [
          "Conduct Failure Mode and Effects Analysis (FMEA)",
          "Develop risk mitigation and contingency plans",
          "Assess risk probability and impact"
        ],
        "topics": [
          "Risk Assessment Matrices",
          "Failure Mode and Effects Analysis (FMEA)",
          "Fault Tree Analysis (FTA)",
          "Mitigation Strategies"
        ],
        "practicalExercise": "Perform an FMEA on a conceptual life-support subsystem for a spacecraft.",
        "recommendedBookTitle": "System Safety Engineering and Risk Assessment",
        "recommendedBookAuthor": "Nicholas J. Bahr",
        "recommendedBookUrl": "https://www.routledge.com/System-Safety-Engineering-and-Risk-Assessment-A-Practical-Approach/Bahr/p/book/9781482263675",
        "recommendedBookDescription": "A practical guide to fault tree analysis, FMEA, and mitigating system-level risks.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-rel",
        "videoTitle": "Reliability Engineering",
        "videoInstructor": "Coursera Instructors",
        "videoUrl": "https://www.coursera.org/specializations/reliability-engineering",
        "videoDescription": "Foundations of designing systems for reliability, availability, and maintainability.",
        "videoDuration": "15:00:00",
        "videoPlatform": "Coursera",
        "videoType": "COURSE",
        "title": "Reliability & Safety",
        "description": "Engineer systems for high reliability, availability, and functional safety.",
        "stage": "SPECIALIZATION",
        "order": 8,
        "estimatedHours": 40,
        "prerequisites": [
          "sys-risk"
        ],
        "skills": [
          "Reliability Engineering",
          "Functional Safety"
        ],
        "learningObjectives": [
          "Calculate Mean Time Between Failures (MTBF)",
          "Design systems with appropriate redundancy",
          "Comply with functional safety standards"
        ],
        "topics": [
          "Reliability Block Diagrams",
          "MTBF and MTTR",
          "Redundancy and Fault Tolerance",
          "Functional Safety (e.g., ISO 26262)"
        ],
        "practicalExercise": "Calculate the overall system reliability of a redundant dual-pump cooling system.",
        "recommendedBookTitle": "Reliability Engineering and Risk Analysis",
        "recommendedBookAuthor": "Mohammad Modarres",
        "recommendedBookUrl": "https://www.routledge.com/Reliability-Engineering-and-Risk-Analysis-A-Practical-Guide/Modarres-Kaminskiy-Krivtsov/p/book/9781498745871",
        "recommendedBookDescription": "Authoritative text detailing MTBF calculations, fault tolerance, and functional safety standards.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-conf",
        "videoTitle": "Configuration Management Best Practices",
        "videoInstructor": "Systems Engineering Instructors",
        "videoUrl": "https://www.youtube.com/@SystemsEngineering",
        "videoDescription": "Maintaining consistency in product performance and physical attributes.",
        "videoDuration": "02:00:00",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL",
        "title": "Configuration Management",
        "description": "Control system baselines and manage changes systematically throughout development.",
        "stage": "MANAGEMENT",
        "order": 9,
        "estimatedHours": 25,
        "prerequisites": [
          "sys-think"
        ],
        "skills": [
          "Configuration Management",
          "Change Management"
        ],
        "learningObjectives": [
          "Establish and manage configuration baselines",
          "Implement a formal change control process",
          "Maintain version control for hardware and software assets"
        ],
        "topics": [
          "Configuration Identification",
          "Change Control Boards (CCB)",
          "Version Management",
          "Configuration Status Accounting"
        ],
        "practicalExercise": "Draft a change request workflow for updating the firmware of deployed IoT devices.",
        "recommendedBookTitle": "Configuration Management Principles and Practice",
        "recommendedBookAuthor": "Anne Mette Jonassen Hass",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/configuration-management-principles-and-practice/P200000000142/9780321117664",
        "recommendedBookDescription": "An in-depth look at change control boards, version baselines, and lifecycle tracking.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-ops",
        "videoTitle": "Operations and Sustainment",
        "videoInstructor": "Defense Acquisition University",
        "videoUrl": "https://www.dau.edu/training/",
        "videoDescription": "Logistics and long-term maintenance planning for deployed systems.",
        "videoDuration": "10:00:00",
        "videoPlatform": "DAU",
        "videoType": "OFFICIAL",
        "title": "Operations & Maintenance",
        "description": "Plan for the long-term operation, sustainment, and eventual retirement of complex systems.",
        "stage": "LIFECYCLE",
        "order": 10,
        "estimatedHours": 30,
        "prerequisites": [
          "sys-vv"
        ],
        "skills": [
          "Operations",
          "Maintenance",
          "Lifecycle Management"
        ],
        "learningObjectives": [
          "Design for maintainability and supportability",
          "Estimate Total Ownership Cost (TOC)",
          "Plan for system obsolescence and disposal"
        ],
        "topics": [
          "Logistics Support",
          "Maintenance Planning",
          "Lifecycle Costing",
          "System Retirement"
        ],
        "practicalExercise": "Create a preventative maintenance schedule for a solar power farm.",
        "recommendedBookTitle": "Maintenance and Reliability Best Practices",
        "recommendedBookAuthor": "Ramesh Gulati",
        "recommendedBookUrl": "https://industrialpress.com/maintenance-reliability-best-practices/",
        "recommendedBookDescription": "Comprehensive guide for system sustainment, lifecycle costing, and preventive maintenance.",
        "resourceType": "BOOK"
      },
      {
        "key": "sys-dist",
        "videoTitle": "Distributed Systems Course",
        "videoInstructor": "Martin Kleppmann",
        "videoUrl": "https://www.youtube.com/watch?v=UEAMfLPZZhE&list=PLeKd45zvjcDFUEv_ohi_vzujZzFi-R2L8",
        "videoDescription": "An outstanding lecture series on consistency models, consensus, and scalability.",
        "videoDuration": "8:00:00",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE",
        "title": "Distributed Systems",
        "description": "Architect and manage large-scale distributed systems prioritizing scalability and consensus.",
        "stage": "SPECIALIZATION",
        "order": 11,
        "estimatedHours": 45,
        "prerequisites": [
          "sys-arch"
        ],
        "skills": [
          "Distributed Systems",
          "Cloud Computing",
          "Scalability"
        ],
        "learningObjectives": [
          "Understand consensus algorithms in distributed networks",
          "Design systems for horizontal scalability",
          "Analyze data consistency models"
        ],
        "topics": [
          "Distributed Architectures",
          "Consensus Protocols",
          "Scalability Patterns",
          "CAP Theorem"
        ],
        "practicalExercise": "Design a distributed database architecture for a global e-commerce platform ensuring high availability.",
        "recommendedBookTitle": "Designing Data-Intensive Applications",
        "recommendedBookAuthor": "Martin Kleppmann",
        "recommendedBookUrl": "https://dataintensive.net/",
        "recommendedBookDescription": "The undisputed best resource for understanding distributed systems, consensus algorithms, and scalability.",
        "resourceType": "BOOK"
      },
      {
        "key": "model-based-systems-engineering",
        "title": "Model-Based Systems Engineering",
        "description": "Apply Model-Based Systems Engineering (MBSE) using SysML to formally define complex systems.",
        "learningObjectives": [
          "Create requirement, structure, and behavior diagrams in SysML.",
          "Trace requirements directly to system components and tests.",
          "Perform parametric analysis to evaluate system constraints."
        ],
        "topics": [
          "MBSE Principles",
          "SysML",
          "Requirement Diagrams",
          "Block Definition Diagrams",
          "State Machine Diagrams",
          "Parametric Diagrams"
        ],
        "practicalExercise": "Use an MBSE tool (like Cameo or Capella) to model the requirements and block definition diagram of an autonomous drone.",
        "skills": [
          "MBSE",
          "SysML",
          "Systems Engineering"
        ],
        "stage": "Advanced",
        "order": 12,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "A Practical Guide to SysML",
        "recommendedBookAuthor": "Sanford Friedenthal, Alan Moore, Rick Steiner",
        "recommendedBookUrl": "https://www.elsevier.com/books/a-practical-guide-to-sysml/friedenthal/978-0-12-800202-5",
        "recommendedBookDescription": "The definitive guide to the Systems Modeling Language.",
        "resourceType": "BOOK",
        "videoTitle": "Introduction to MBSE",
        "videoInstructor": "IBM Engineering",
        "videoUrl": "https://www.youtube.com/watch?v=zT3z8m4nK4k",
        "videoDescription": "High-level introduction to the benefits and practice of MBSE.",
        "videoDuration": "25m",
        "videoPlatform": "YouTube",
        "videoType": "TUTORIAL"
      },
      {
        "key": "system-architecture-design",
        "title": "System Architecture Design",
        "description": "Design scalable, robust, and functional architectures for multidisciplinary complex systems.",
        "learningObjectives": [
          "Map functional requirements to physical/logical architectures.",
          "Evaluate trade-offs using architectural trade studies.",
          "Define clean interfaces and boundaries between system modules."
        ],
        "topics": [
          "Functional Architecture",
          "Physical Architecture",
          "Trade Studies",
          "Interface Control Documents (ICDs)",
          "Modularity",
          "System Integration"
        ],
        "practicalExercise": "Conduct a Pugh matrix trade study comparing three different propulsion architectures for a satellite.",
        "skills": [
          "Systems Architecture",
          "Trade Studies",
          "Systems Engineering"
        ],
        "stage": "Advanced",
        "order": 13,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "System Architecture",
        "recommendedBookAuthor": "Bruce Cameron, Edward Crawley, Daniel Selva",
        "recommendedBookUrl": "https://www.pearson.com/en-us/subject-catalog/p/system-architecture-strategy-and-product-development-for-complex-systems/P200000003058/9780133973952",
        "recommendedBookDescription": "A rigorous approach to system architecture strategy and development.",
        "resourceType": "BOOK",
        "videoTitle": "System Architecture Design",
        "videoInstructor": "MIT OpenCourseWare",
        "videoUrl": "https://www.youtube.com/watch?v=8XQoBfM3D4o",
        "videoDescription": "MIT lecture on architecting complex systems.",
        "videoDuration": "1h20m",
        "videoPlatform": "YouTube",
        "videoType": "LECTURE"
      },
      {
        "key": "product-lifecycle-management",
        "title": "Product Lifecycle Management",
        "description": "Manage the entire lifecycle of a complex product from ideation through engineering to retirement.",
        "learningObjectives": [
          "Understand the V-Model of systems engineering.",
          "Manage engineering changes (ECNs) and version control for hardware.",
          "Integrate PLM tools with CAD and ERP systems."
        ],
        "topics": [
          "V-Model",
          "Configuration Management",
          "Engineering Change Orders",
          "BOM Management",
          "Verification & Validation",
          "End of Life (EOL)"
        ],
        "practicalExercise": "Create a multi-level Bill of Materials (BOM) for a hardware product and execute an Engineering Change Order (ECO) to swap a component.",
        "skills": [
          "PLM",
          "Configuration Management",
          "Systems Engineering"
        ],
        "stage": "Advanced",
        "order": 14,
        "estimatedHours": 5,
        "prerequisites": [],
        "recommendedBookTitle": "Product Lifecycle Management",
        "recommendedBookAuthor": "John Stark",
        "recommendedBookUrl": "https://link.springer.com/book/10.1007/978-3-030-01614-2",
        "recommendedBookDescription": "Comprehensive overview of PLM concepts and practices.",
        "resourceType": "BOOK",
        "videoTitle": "What is PLM?",
        "videoInstructor": "Siemens Software",
        "videoUrl": "https://www.youtube.com/watch?v=q6O9328i31g",
        "videoDescription": "Corporate introduction to Product Lifecycle Management.",
        "videoDuration": "5m",
        "videoPlatform": "YouTube",
        "videoType": "OFFICIAL"
      }
    ]
  }
];
