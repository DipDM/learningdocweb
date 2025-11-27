---
sidebar_position: 11
title: "Chapter 11: IEnumerable vs IQueryable & Expression Trees"
description: "Understanding the crucial differences between IEnumerable and IQueryable for performance optimization"
---

# Chapter 11: IEnumerable vs IQueryable & Expression Trees

## 11.1 Overview

At first glance, `IEnumerable<T>` and `IQueryable<T>` seem similar — both can be queried with LINQ. But how and where they execute your query is very different.

Understanding this difference is crucial for:
- Performance tuning in Entity Framework
- Avoiding "client-side evaluation" issues
- Writing optimized database queries

## 11.2 Definitions

| Interface | Namespace | Description |
|-----------|-----------|-------------|
| `IEnumerable<T>` | `System.Collections.Generic` | Works with in-memory data (LINQ to Objects) |
| `IQueryable<T>` | `System.Linq` | Works with out-of-memory data (like databases, remote sources) |

## 11.3 Key Concept Difference

| Aspect | IEnumerable&lt;T&gt; | IQueryable&lt;T&gt; |
|--------|----------------------|---------------------|
| **Execution Location** | In-memory (CLR) | Translated and executed remotely (e.g., SQL) |
| **Query Type** | LINQ to Objects | LINQ to Entities / LINQ to SQL |
| **Delegate Type** | Uses `Func<T,bool>` | Uses `Expression<Func<T,bool>>` |
| **Data Source** | Collections (Lists, Arrays, etc.) | ORM-backed data (DbSet, Queryable) |
| **Filtering** | Done in memory | Done in data source (e.g., database) |
| **Performance** | Loads all data first, then filters | Translates query → executes remotely |
| **Deferred Execution** | Yes | Yes, but translation happens remotely |
| **Use When** | You already have data in memory | You're querying a remote data source |

## 11.4 Visual Comparison

```
IEnumerable<T>                          IQueryable<T>
----------------                        ----------------
   In Memory                               Remote Source
  (RAM/Objects)                            (Database/Server)
        |                                         |
 LINQ executes locally                  LINQ builds expression tree
 (C# delegates run in CLR)              translated to SQL or provider query
```

## 11.5 Example — IEnumerable

**Data Source:** In-memory collection

```csharp
List<Student> students = new()
{
    new Student { Id = 1, Name = "John", Marks = 85 },
    new Student { Id = 2, Name = "Alice", Marks = 70 },
    new Student { Id = 3, Name = "Bob", Marks = 90 }
};

IEnumerable<Student> query = students.Where(s => s.Marks > 75);
```

**Explanation:**
- The filtering `(s.Marks > 75)` happens in memory
- Uses delegates (`Func`)
- Executed by the .NET runtime, not translated

## 11.6 Example — IQueryable

**Data Source:** Database Context (EF Core)

```csharp
IQueryable<Student> query = dbContext.Students.Where(s => s.Marks > 75);
```

**Explanation:**
- The expression `s => s.Marks > 75` is converted into SQL
- Execution happens in the database, not in memory
- Uses Expression Trees to build the SQL equivalent

**Generated SQL Example:**
```sql
SELECT * FROM Students WHERE Marks > 75;
```

## 11.7 Internal Mechanics

| Step | IEnumerable | IQueryable |
|------|-------------|------------|
| 1 | Stores collection reference | Stores query provider and expression tree |
| 2 | Executes filtering in C# | Builds expression tree |
| 3 | Applies predicates locally | Query provider (EF Core, LINQ to SQL) translates tree |
| 4 | Executes immediately | Sent to remote source for execution |
| 5 | Returns filtered results | Returns query result from data source |

## 11.8 Delegate vs Expression

### IEnumerable uses:

```csharp
Func<Student, bool> predicate = s => s.Marks > 75;
```

Executed directly in memory by the runtime.

### IQueryable uses:

```csharp
Expression<Func<Student, bool>> expression = s => s.Marks > 75;
```

Stored as an expression tree, which describes the logic instead of executing it immediately.

## 11.9 What Are Expression Trees

### Definition

An expression tree is a data structure that represents code in a tree-like format, where each node is an expression (method call, property access, etc.).

They're crucial for query translation, because they allow LINQ providers (like EF Core) to inspect your code and convert it into SQL or other query languages.

### Example

```csharp
Expression<Func<int, bool>> expr = num => num > 5;
```

You can inspect it:

```csharp
Console.WriteLine(expr.Body);  // Output: (num > 5)
Console.WriteLine(expr.Parameters[0].Name); // Output: num
```

### Example Tree Structure

```
Lambda Expression
 ├── Parameter: num
 └── Body: (num > 5)
```

## 11.10 Real Difference Example

### Case 1: IEnumerable

```csharp
var students = dbContext.Students.ToList();  // Fetches all rows into memory
var result = students.Where(s => s.Marks > 80); // Filter in memory
```

**Behavior:**
- Fetches all students from DB first
- Then filters in memory
- → Performance hit

### Case 2: IQueryable

```csharp
var result = dbContext.Students.Where(s => s.Marks > 80).ToList();
```

**Behavior:**
- Builds expression tree → translates to SQL
- Fetches only required records
- → High performance

## 11.11 Mixing IEnumerable and IQueryable

:::tip
You can combine both, but you must be aware of where execution shifts.
:::

```csharp
var query = dbContext.Students
                     .Where(s => s.Marks > 70)     // SQL side (IQueryable)
                     .AsEnumerable()               // Switch to IEnumerable
                     .Where(s => s.Name.StartsWith("A")); // In-memory
```

**Explanation:**
- The first `Where` runs in SQL (server)
- `AsEnumerable()` moves results into memory
- The next `Where` runs locally in C#

**This technique is useful when:**
- Some filters cannot be translated to SQL
- You want a hybrid query: part server-side, part client-side

## 11.12 When to Use Which

| Use Case | Recommended Interface | Reason |
|----------|----------------------|--------|
| In-memory collections (List, Array) | `IEnumerable<T>` | Simpler and faster for small data |
| Database or remote sources | `IQueryable<T>` | Translates to SQL for performance |
| Mixed queries (part SQL, part local) | `IQueryable<T>` + `AsEnumerable()` | Split execution intentionally |
| Custom query providers | `IQueryable<T>` | Needed for translation |

## 11.13 Real-World Example: Entity Framework

### ✅ Efficient (IQueryable)

```csharp
// IQueryable example — efficient
var query = dbContext.Employees
    .Where(e => e.Salary > 50000 && e.City == "Pune")
    .Select(e => new { e.Name, e.Salary });

// Translated to SQL:
// SELECT Name, Salary FROM Employees WHERE Salary > 50000 AND City = 'Pune';
```

### ❌ Inefficient (IEnumerable)

```csharp
// IEnumerable example — inefficient
var all = dbContext.Employees.ToList(); // fetches entire table
var filtered = all.Where(e => e.Salary > 50000);
```

The second filter runs after fetching everything, which can be **100x slower** on large tables.

## 11.14 Common Mistakes

### 1. Using IEnumerable for database queries

```csharp
var data = dbContext.Products.AsEnumerable().Where(p => p.Price > 500);
```

→ Loads all products into memory before filtering.

### 2. Forgetting to use ToList() before disposing DbContext

```csharp
var result = dbContext.Employees.Where(e => e.IsActive);
dbContext.Dispose();
foreach (var e in result) // Throws ObjectDisposedException
    Console.WriteLine(e.Name);
```

### 3. Client-side evaluation in EF

Some expressions can't be translated to SQL:

```csharp
var result = dbContext.Employees
    .Where(e => CustomFunction(e.Name)); // ❌ Will cause client-side filtering
```

Always use translatable expressions (no local C# logic inside).

## 11.15 Summary Table

| Feature | IEnumerable&lt;T&gt; | IQueryable&lt;T&gt; |
|---------|----------------------|---------------------|
| **Namespace** | `System.Collections.Generic` | `System.Linq` |
| **Execution** | In-memory | Remote (database, service) |
| **Query Translation** | Not translated | Translated (e.g., SQL) |
| **Predicate Type** | `Func<T, bool>` | `Expression<Func<T, bool>>` |
| **Deferred Execution** | Yes | Yes |
| **Filtering Location** | Client-side | Server-side |
| **Best for** | In-memory data | Remote queries |
| **Performance** | Slower on large data | Optimized by provider |

## 11.16 Quick Real-Life Example

### ❌ Bad: Inefficient (IEnumerable)

```csharp
var employees = db.Employees.ToList().Where(e => e.City == "Pune");
```

Fetches all employees from DB.

### ✅ Good: Efficient (IQueryable)

```csharp
var employees = db.Employees.Where(e => e.City == "Pune").ToList();
```

Translates to SQL → fetches only Pune employees.

## 11.17 Expression Tree Example — Manual Construction

You can even build LINQ queries dynamically using Expression Trees.

```csharp
ParameterExpression param = Expression.Parameter(typeof(int), "n");
Expression body = Expression.GreaterThan(param, Expression.Constant(5));
var lambda = Expression.Lambda<Func<int, bool>>(body, param);

Console.WriteLine(lambda); // n => (n > 5)

var compiled = lambda.Compile();
Console.WriteLine(compiled(10)); // True
```

**Explanation:**
- Expression Trees describe code as data structures
- You can inspect, modify, or generate queries dynamically

## 11.18 Practice Exercises

### Tasks:

1. **Explain what happens in these two lines:**
   ```csharp
   var a = dbContext.Students.ToList().Where(s => s.Marks > 80);
   var b = dbContext.Students.Where(s => s.Marks > 80).ToList();
   ```
   (Which runs SQL, which runs in memory?)

2. Create an example using `AsEnumerable()` to move part of the query to client side.

3. Show how an `Expression<Func<int,bool>>` works by printing its `Body` and `Parameters`.

4. Write one inefficient (client-side) and one efficient (server-side) version of the same EF query.

---

**Ready for the next chapter?** Continue to [Chapter 12: Advanced LINQ Techniques](./chapter-12) to explore grouping with aggregates, lookups, and custom projections.