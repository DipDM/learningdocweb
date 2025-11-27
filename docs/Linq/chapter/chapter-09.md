---
sidebar_position: 9
title: Partitioning Operators
description: Master LINQ partitioning operators including Skip, Take, SkipWhile, and TakeWhile for pagination and data segmentation
keywords: [LINQ, partitioning, Skip, Take, SkipWhile, TakeWhile, pagination, C#]
---

# Chapter 9: Partitioning Operators in LINQ

## 9.1 What Are Partitioning Operators

Partitioning operators split or select portions of data from a sequence.

They don't modify the source; instead, they return new sequences (subsets) of the original data.

| Operator | Purpose |
|----------|---------|
| `Skip()` | Skips a specified number of elements |
| `Take()` | Takes a specified number of elements |
| `SkipWhile()` | Skips elements while a condition is true |
| `TakeWhile()` | Takes elements while a condition is true |

---

## 9.2 Example Dataset

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

var students = new[]
{
    new { Id = 1, Name = "John", Marks = 95 },
    new { Id = 2, Name = "Alice", Marks = 80 },
    new { Id = 3, Name = "Bob", Marks = 65 },
    new { Id = 4, Name = "Daisy", Marks = 50 },
    new { Id = 5, Name = "Evan", Marks = 35 }
};
```

---

## 9.3 Take()

### Purpose

Returns the first N elements of a sequence.

### Example 1: Take First 3 Numbers

```csharp
var result = numbers.Take(3);
Console.WriteLine(string.Join(", ", result));
```

**Output:**

```
1, 2, 3
```

### Example 2: Take Top 3 Students by Marks

```csharp
var top3 = students.OrderByDescending(s => s.Marks).Take(3);

foreach (var s in top3)
    Console.WriteLine($"{s.Name} - {s.Marks}");
```

**Output:**

```
John - 95
Alice - 80
Bob - 65
```

:::info Explanation
- `Take()` does not modify the original data
- If fewer elements exist than requested, it just returns all
:::

---

## 9.4 Skip()

### Purpose

Skips a specified number of elements and returns the rest.

### Example 1: Skip First 5 Numbers

```csharp
var result = numbers.Skip(5);
Console.WriteLine(string.Join(", ", result));
```

**Output:**

```
6, 7, 8, 9, 10
```

### Example 2: Paging Example

Imagine we show 2 students per page:

```csharp
int pageNumber = 2;
int pageSize = 2;

var page2 = students.Skip((pageNumber - 1) * pageSize).Take(pageSize);

foreach (var s in page2)
    Console.WriteLine($"{s.Name} - {s.Marks}");
```

**Output:**

```
Bob - 65
Daisy - 50
```

:::tip Explanation
- `Skip((page-1)*pageSize)` moves to the right position
- `Take(pageSize)` selects the page content
:::

---

## 9.5 TakeWhile()

### Purpose

Takes elements from the start of the sequence as long as a condition is true.

Stops immediately when the condition becomes false.

### Example 1: Take numbers while less than 6

```csharp
var result = numbers.TakeWhile(n => n < 6);
Console.WriteLine(string.Join(", ", result));
```

**Output:**

```
1, 2, 3, 4, 5
```

:::info Explanation
Stops at 6 because the condition `(n < 6)` becomes false.
:::

### Example 2: Take students while marks > 60

```csharp
var result = students.TakeWhile(s => s.Marks > 60);
```

**Output:**

```
John - 95
Alice - 80
Bob - 65
```

:::note
As soon as a student with Marks ≤ 60 is found (Daisy), it stops.
:::

---

## 9.6 SkipWhile()

### Purpose

Skips elements from the start while a condition is true.

Starts returning elements once the condition becomes false.

### Example 1: Skip numbers less than 5

```csharp
var result = numbers.SkipWhile(n => n < 5);
Console.WriteLine(string.Join(", ", result));
```

**Output:**

```
5, 6, 7, 8, 9, 10
```

### Example 2: Skip students while marks > 60

```csharp
var result = students.SkipWhile(s => s.Marks > 60);
```

**Output:**

```
Daisy - 50
Evan - 35
```

:::info Explanation
It skips John, Alice, and Bob (since their Marks > 60) and starts returning from Daisy (50).
:::

---

## 9.7 Combining Skip and Take

Paging is the most common real-world use.

### Example: Get page 3 of students, 2 per page

```csharp
int pageSize = 2;
int page = 3;

var result = students
    .OrderByDescending(s => s.Marks)
    .Skip((page - 1) * pageSize)
    .Take(pageSize);

foreach (var s in result)
    Console.WriteLine($"{s.Name} - {s.Marks}");
```

**Output:**

```
Daisy - 50
Evan - 35
```

---

## 9.8 Important Notes

| Operator | Execution Type | Stops Early? | Common Use |
|----------|----------------|--------------|------------|
| `Take()` | Immediate | ❌ | Limiting results |
| `Skip()` | Immediate | ❌ | Paging |
| `TakeWhile()` | Deferred | ✅ | Conditional start selection |
| `SkipWhile()` | Deferred | ✅ | Conditional skip |
| Combined | Deferred | ✅ | Pagination, Data Segmentation |

---

## 9.9 Real-World Use Cases

| Scenario | Operator(s) Used |
|----------|------------------|
| Implementing data pagination | `Skip()` + `Take()` |
| Display top N records | `Take()` |
| Skip invalid/processed data | `SkipWhile()` |
| Read until condition fails | `TakeWhile()` |
| Stream processing until threshold | `TakeWhile()` |

---

## 9.10 Summary Table

| Operator | Description | Example | Output |
|----------|-------------|---------|--------|
| `Take(n)` | Takes first n elements | `numbers.Take(3)` | 1, 2, 3 |
| `Skip(n)` | Skips first n elements | `numbers.Skip(5)` | 6, 7, 8, 9, 10 |
| `TakeWhile(cond)` | Takes while condition true | `numbers.TakeWhile(x < 6)` | 1–5 |
| `SkipWhile(cond)` | Skips while condition true | `numbers.SkipWhile(x < 5)` | 5–10 |

---

## 9.11 Practice Exercises

### Dataset

```csharp
var employees = new[]
{
    new { Id = 1, Name = "John", Salary = 90000 },
    new { Id = 2, Name = "Alice", Salary = 85000 },
    new { Id = 3, Name = "Bob", Salary = 75000 },
    new { Id = 4, Name = "Daisy", Salary = 60000 },
    new { Id = 5, Name = "Evan", Salary = 50000 },
    new { Id = 6, Name = "Frank", Salary = 40000 }
};
```

### Tasks

1. Take the top 3 highest-paid employees
2. Skip the top 2 highest-paid, and take the next 2 (simulate 2nd page)
3. Take employees while salary ≥ 60000
4. Skip employees while salary > 70000 and return remaining
5. Create a generic paging function using `Skip()` and `Take()`

:::tip Next Steps
Would you like to:
- Solve these exercises next (practice your skills), or
- Move ahead to Chapter 10: Deferred vs Immediate Execution (Advanced LINQ behavior)?
:::