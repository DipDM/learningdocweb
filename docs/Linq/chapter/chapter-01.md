# Chapter 1: Introduction to LINQ

## 1.1 What is LINQ

LINQ (Language Integrated Query) is a set of features introduced in .NET (from C# 3.0 onwards) that brings query capabilities directly into C#.
It allows you to query data from arrays, lists, XML, databases, and more using a uniform syntax.

In simple terms:

- LINQ lets you write SQL-like queries directly inside C#.
- It brings consistency to data querying (whether you query objects, XML, or databases).

## 1.2 Why Use LINQ

| Problem Before LINQ | How LINQ Solves It |
|---------------------|-------------------|
| Multiple syntaxes for different data sources (SQL, XML, objects). | One unified querying syntax. |
| Harder to debug & maintain due to loops and nested conditions. | Cleaner, declarative code. |
| Manual filtering, sorting, and projection. | Built-in query operators like `where`, `orderby`, `select`. |

## 1.3 LINQ Syntax Types

There are two ways to write LINQ queries:

| Syntax Type | Description | Example |
|-------------|-------------|---------|
| Query Syntax | SQL-like syntax, easy to read. | `from x in data where x > 10 select x` |
| Method Syntax | Uses methods and lambda expressions. | `data.Where(x => x > 10).Select(x => x)` |

Both are equivalent.
Internally, Query Syntax is converted to Method Syntax by the compiler.

## 1.4 LINQ Architecture Overview

- **Data Source** — Collection or dataset (e.g., array, list, XML, DB).
- **Query Creation** — Define the query using LINQ.
- **Query Execution** — Fetch or materialize data.

**Example:**

```csharp
// Step 1: Data Source
int[] numbers = { 1, 2, 3, 4, 5 };

// Step 2: Query Creation
var query = from n in numbers
            where n > 2
            select n;

// Step 3: Query Execution
foreach (var num in query)
{
    Console.WriteLine(num);
}
```

**Output:**

```
3
4
5
```

## 1.5 Deferred Execution vs Immediate Execution

### Deferred Execution

LINQ queries are not executed when defined — only when you iterate (e.g., using `foreach` or `.ToList()`).

**Example:**

```csharp
var result = from n in numbers
             where n > 2
             select n;  // Not executed yet

foreach (var num in result)  // Executed here
    Console.WriteLine(num);
```

### Immediate Execution

When you use operators like `.ToList()`, `.ToArray()`, `.Count()`, LINQ executes immediately.

**Example:**

```csharp
var result = (from n in numbers
              where n > 2
              select n).ToList();  // Executes immediately
```

## 1.6 Basic LINQ Query Structure

### Query Syntax

```csharp
from variable in dataSource
where condition
orderby something
select result
```

### Method Syntax

```csharp
dataSource
    .Where(x => condition)
    .OrderBy(x => something)
    .Select(x => result);
```

## 1.7 Common LINQ Keywords (Query Syntax)

| Keyword | Purpose | Equivalent Method |
|---------|---------|-------------------|
| `from` | Defines data source and range variable | Start of query |
| `where` | Filters data based on condition | `.Where()` |
| `select` | Projects data into a new form | `.Select()` |
| `orderby` | Sorts results ascending or descending | `.OrderBy()`, `.OrderByDescending()` |
| `group` | Groups results by key | `.GroupBy()` |
| `join` | Joins two data sources | `.Join()` |
| `let` | Introduces a temporary variable in query | N/A (inline variable) |
| `into` | Allows further query continuation after group or join | Used for query chaining |

## 1.8 Example: Filtering and Selecting

### Query Syntax

```csharp
int[] scores = { 45, 80, 30, 60, 90 };

var passed = from s in scores
             where s >= 60
             select s;

foreach (var score in passed)
{
    Console.WriteLine(score);
}
```

### Method Syntax

```csharp
var passed = scores.Where(s => s >= 60).Select(s => s);

foreach (var score in passed)
{
    Console.WriteLine(score);
}
```

**Output:**

```
80
60
90
```

## 1.9 Example: Sorting

### Query Syntax

```csharp
var sorted = from s in scores
             orderby s descending
             select s;
```

### Method Syntax

```csharp
var sorted = scores.OrderByDescending(s => s);
```

**Output:**

```
90
80
60
45
30
```

## 1.10 Example: Projection (Selecting Specific Fields)

Suppose we have:

```csharp
var students = new[]
{
    new { Name = "John", Marks = 85 },
    new { Name = "Alice", Marks = 70 },
    new { Name = "Bob", Marks = 60 }
};
```

### Query Syntax

```csharp
var names = from s in students
            select s.Name;
```

### Method Syntax

```csharp
var names = students.Select(s => s.Name);
```

**Output:**

```
John
Alice
Bob
```

## 1.11 Execution Flow Summary

| Step | Description | Example |
|------|-------------|---------|
| 1 | Define Data Source | `int[] nums = {1,2,3,4};` |
| 2 | Create Query | `var q = from n in nums select n;` |
| 3 | Execute Query | `foreach (var i in q) Console.WriteLine(i);` |

## 1.12 Summary

- LINQ integrates querying directly into C#.
- Two syntaxes: Query Syntax (SQL-style) and Method Syntax (Lambda-based).
- Queries are deferred until executed.
- Unified querying model for multiple data types.

## Next Chapter Preview

**Chapter 2: LINQ Filtering & Sorting Operations**

We'll cover:
- `Where`, `OfType`
- `OrderBy`, `OrderByDescending`
- `ThenBy`, `ThenByDescending`
- Real-world examples and performance discussion.