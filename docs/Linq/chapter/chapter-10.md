---
sidebar_position: 10
title: "Chapter 10: Deferred vs Immediate Execution"
description: "Understanding when and how LINQ queries execute behind the scenes"
---

# Chapter 10: Deferred vs Immediate Execution in LINQ

## What You'll Learn

- How LINQ queries execute behind the scenes
- The difference between deferred and immediate execution
- Which operators cause immediate execution
- Common pitfalls and best practices for real-world projects

## 10.1 Why This Matters

When you write a LINQ query, it doesn't always run immediately. Understanding when and how your query executes is key to:

- Avoid unexpected results
- Avoid multiple enumerations
- Optimize performance

## 10.2 The Two Execution Types

| Execution Type | Description | Trigger |
|----------------|-------------|---------|
| **Deferred Execution** | The query is defined but not executed until results are requested. | Enumeration (e.g., `foreach`, `.ToList()`, `.Count()`) |
| **Immediate Execution** | The query is executed right away, and results are stored in memory. | Terminal methods (`ToList()`, `ToArray()`, `Count()`, etc.) |

## 10.3 Example Dataset

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };
```

## 10.4 Example of Deferred Execution

### Query Definition

```csharp
var query = from n in numbers
            where n > 2
            select n;
```

**At this point:**
- The query has not executed yet
- It only stores instructions on how to fetch data

### Query Execution

```csharp
foreach (var n in query)
{
    Console.WriteLine(n);
}
```

**Output:**
```
3
4
5
```

**Explanation:**
- Execution happens only during enumeration
- If you modify `numbers` before the loop, the query reflects the change

## 10.5 Demonstrating Deferred Execution Behavior

```csharp
var query = numbers.Where(n => n > 2);

numbers.Add(6);

foreach (var n in query)
{
    Console.WriteLine(n);
}
```

**Output:**
```
3
4
5
6
```

**Explanation:**
- Because of deferred execution, the query executes after 6 is added
- It works on the latest state of the collection

## 10.6 Forcing Immediate Execution

### Using Materialization Methods

| Method | Description |
|--------|-------------|
| `.ToList()` | Executes query and returns `List<T>` |
| `.ToArray()` | Executes query and returns array |
| `.ToDictionary()` | Executes query and stores results as dictionary |
| `.Count()`, `.Sum()`, `.Average()` | Execute immediately to compute values |

### Example

```csharp
var query = numbers.Where(n => n > 2).ToList();

numbers.Add(6);

foreach (var n in query)
{
    Console.WriteLine(n);
}
```

**Output:**
```
3
4
5
```

**Explanation:**
- `.ToList()` caused immediate execution
- Adding 6 afterward did not affect the query result

## 10.7 Comparison Example (Deferred vs Immediate)

```csharp
var deferred = numbers.Where(n => n > 2);     // Deferred
var immediate = numbers.Where(n => n > 2).ToList(); // Immediate

numbers.Add(6);

Console.WriteLine("Deferred:");
foreach (var n in deferred)
    Console.WriteLine(n);

Console.WriteLine("Immediate:");
foreach (var n in immediate)
    Console.WriteLine(n);
```

**Output:**
```
Deferred:
3
4
5
6

Immediate:
3
4
5
```

**Explanation:**
- Deferred query re-evaluates the collection on each iteration
- Immediate query is fixed once evaluated

## 10.8 Query Reuse and Deferred Execution Pitfall

:::warning
Be careful when reusing the same query after modifying the source.
:::

```csharp
var query = numbers.Where(n => n % 2 == 0);

Console.WriteLine("Even numbers before add:");
foreach (var n in query)
    Console.WriteLine(n);

numbers.Add(8); // modifies original data

Console.WriteLine("Even numbers after add:");
foreach (var n in query)
    Console.WriteLine(n);
```

**Output:**
```
Even numbers before add:
2
4

Even numbers after add:
2
4
8
```

**Explanation:**
- The query is re-evaluated each time it's enumerated
- For consistent results, materialize with `.ToList()`

## 10.9 Immediate Execution with Aggregates

Certain operators execute immediately, even without enumeration:

| Operator | Type | Execution |
|----------|------|-----------|
| `Count()` | Aggregate | Immediate |
| `Sum()` | Aggregate | Immediate |
| `Average()` | Aggregate | Immediate |
| `Min()` | Aggregate | Immediate |
| `Max()` | Aggregate | Immediate |
| `ToList()` | Conversion | Immediate |
| `ToArray()` | Conversion | Immediate |
| `ToDictionary()` | Conversion | Immediate |
| `First()`, `Last()`, `Single()` | Element | Immediate |

### Example

```csharp
int count = numbers.Count(); // executes immediately
Console.WriteLine(count);
```

Even if you later add more numbers, `count` won't change — it's already evaluated.

## 10.10 Mixed Example (Deferred + Immediate)

```csharp
var filtered = numbers.Where(n => n > 2);   // Deferred
int count = filtered.Count();               // Immediate
numbers.Add(10);

Console.WriteLine("Count: " + count);

foreach (var n in filtered)
    Console.WriteLine(n);
```

**Output:**
```
Count: 3
3
4
5
10
```

**Explanation:**
- `Count()` executed immediately (before adding 10)
- The `foreach` executes later and reflects the new data

## 10.11 When to Use Deferred vs Immediate Execution

| Scenario | Recommended Execution | Reason |
|----------|----------------------|--------|
| Data that may change before use | Deferred | Always gives latest data |
| Data that must remain consistent | Immediate | Locks the result in time |
| Performance-critical queries (used multiple times) | Immediate | Avoids re-evaluating query |
| Lightweight data processing | Deferred | Saves memory, processes on demand |

## 10.12 Common Pitfalls

### 1. Unexpected Results After Source Change

```csharp
var query = employees.Where(e => e.Salary > 50000);
employees.Add(new Employee { Salary = 70000 });
```

→ New employee unexpectedly appears in later results.

### 2. Multiple Enumeration (Performance hit)

```csharp
var query = employees.Where(e => e.Salary > 50000);
Console.WriteLine(query.Count()); // executes query
Console.WriteLine(query.Average(e => e.Salary)); // executes again
```

→ Evaluate once using `.ToList()` if results are reused.

### 3. Deferred Execution with External Resources

```csharp
using (var context = new MyDbContext())
{
    var query = context.Employees.Where(e => e.IsActive);
} // context disposed here
```

→ Deferred execution will fail later when context is closed. Use `.ToList()` before the context is disposed.

## 10.13 Real-World Example: Avoiding Lazy Pitfalls

```csharp
using (var db = new CompanyContext())
{
    var query = db.Employees.Where(e => e.Salary > 50000).ToList(); // Immediate
    // Safe: Data is fetched before db disposal
}
```

## 10.14 Best Practices

### Use Deferred Execution when:
- Working with in-memory collections
- You want up-to-date results every time you enumerate

### Use Immediate Execution when:
- Working with external resources (DB, API)
- You want consistent data snapshot
- You'll enumerate the same data multiple times

### Avoid multiple enumerations:

```csharp
var result = query.ToList(); // materialize once
var total = result.Count();
```

## 10.15 Summary Table

| Execution Type | Description | Trigger | Example Operators |
|----------------|-------------|---------|-------------------|
| **Deferred** | Query executes only when enumerated | `foreach`, `ToList()`, etc. | `Where()`, `Select()`, `GroupBy()` |
| **Immediate** | Query executes instantly | Materializers or aggregates | `Count()`, `ToList()`, `Sum()`, `First()` |

## 10.16 Practice Exercises

Given:
```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };
```

**Tasks:**
1. Create a deferred query to select even numbers
2. Add a new even number and verify deferred behavior
3. Convert the query to immediate execution with `.ToList()`
4. Demonstrate that adding another number doesn't affect the list
5. Use `Count()` and show that it executes immediately

---

**Ready for the next chapter?** Continue to [Chapter 11: IQueryable vs IEnumerable and Expression Trees](./chapter-11) to dive into how LINQ translates to database queries and expression trees.