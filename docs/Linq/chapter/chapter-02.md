---
sidebar_position: 2
title: "Chapter 2: LINQ Filtering and Sorting"
description: "Master filtering and sorting operations in LINQ"
---

# Chapter 2: LINQ Filtering and Sorting

## 2.1 Overview

Filtering and sorting are two of the most common tasks in data querying.
In LINQ, these operations are performed using:

- Filtering operators like `where`, `OfType`.
- Sorting operators like `orderby`, `OrderBy`, `ThenBy`.

## 2.2 The where Keyword / .Where() Method

### Purpose

Filters a sequence based on a Boolean condition.

### Syntax

| Type | Example |
|------|---------|
| Query Syntax | `from s in students where s.Marks > 60 select s;` |
| Method Syntax | `students.Where(s => s.Marks > 60);` |

### What It Does

Returns only those elements that satisfy the given condition.

### Example

```csharp
var students = new[]
{
    new { Name = "John", Marks = 80 },
    new { Name = "Alice", Marks = 55 },
    new { Name = "Bob", Marks = 70 },
    new { Name = "Daisy", Marks = 45 }
};
```

**Query Syntax**

```csharp
var passed = from s in students
             where s.Marks >= 60
             select s.Name;
```

**Method Syntax**

```csharp
var passed = students.Where(s => s.Marks >= 60)
                     .Select(s => s.Name);
```

**Output:**

```
John
Bob
```

:::info Explanation
The `where` clause filters all students whose Marks >= 60.
:::

## 2.3 Multiple Conditions in where

You can combine multiple conditions using logical operators.

### Example

**Query Syntax**

```csharp
var result = from s in students
             where s.Marks >= 60 && s.Marks <= 80
             select s;
```

**Method Syntax**

```csharp
var result = students
             .Where(s => s.Marks >= 60 && s.Marks <= 80);
```

**Output:**

```
John (80)
Bob (70)
```

## 2.4 The OfType&lt;T&gt;() Operator

### Purpose

Filters elements based on their type in a non-generic collection.

### What It Does

Returns only elements of a specific type (useful in mixed collections).

### Example

```csharp
ArrayList list = new ArrayList() { 1, "two", 3, "four", 5 };
```

**Query Syntax**

`OfType` has no direct query syntax equivalent, it's method-only.

**Method Syntax**

```csharp
var numbers = list.OfType<int>();
```

**Output:**

```
1
3
5
```

:::note Explanation
Only integers are selected; strings are ignored.
:::

## 2.5 Sorting — orderby and OrderBy

### Purpose

Sorts a sequence ascending by default.

### Syntax

| Type | Example |
|------|---------|
| Query Syntax | `from s in students orderby s.Marks select s;` |
| Method Syntax | `students.OrderBy(s => s.Marks);` |

### Example

```csharp
var sorted = from s in students
             orderby s.Marks
             select new { s.Name, s.Marks };
```

or

```csharp
var sorted = students.OrderBy(s => s.Marks)
                     .Select(s => new { s.Name, s.Marks });
```

**Output:**

```
Daisy - 45
Alice - 55
Bob - 70
John - 80
```

## 2.6 Sorting Descending — orderby ... descending / .OrderByDescending()

### Purpose

Sorts the data in descending order.

### Example

**Query Syntax**

```csharp
var desc = from s in students
           orderby s.Marks descending
           select s;
```

**Method Syntax**

```csharp
var desc = students.OrderByDescending(s => s.Marks);
```

**Output:**

```
John - 80
Bob - 70
Alice - 55
Daisy - 45
```

## 2.7 ThenBy / ThenByDescending

### Purpose

Used for secondary sorting when you want to sort by multiple fields.

### Example

```csharp
var employees = new[]
{
    new { Name = "John", Dept = "HR", Salary = 50000 },
    new { Name = "Alice", Dept = "IT", Salary = 80000 },
    new { Name = "Bob", Dept = "IT", Salary = 75000 },
    new { Name = "Daisy", Dept = "HR", Salary = 55000 }
};
```

**Query Syntax**

```csharp
var sorted = from e in employees
             orderby e.Dept, e.Salary descending
             select e;
```

**Method Syntax**

```csharp
var sorted = employees
             .OrderBy(e => e.Dept)
             .ThenByDescending(e => e.Salary);
```

**Output:**

```
HR - Daisy (55000)
HR - John (50000)
IT - Alice (80000)
IT - Bob (75000)
```

## 2.8 Filtering + Sorting Combined

You can combine both `where` and `orderby`.

### Example

```csharp
var result = from s in students
             where s.Marks >= 60
             orderby s.Marks descending
             select s;
```

or

```csharp
var result = students
             .Where(s => s.Marks >= 60)
             .OrderByDescending(s => s.Marks);
```

**Output:**

```
John - 80
Bob - 70
```

## 2.9 Custom Sorting Using Comparer

Sometimes you may need custom sorting logic.

### Example

Sort names by length.

```csharp
string[] names = { "John", "Alexander", "Bob", "Chris" };

var sorted = names.OrderBy(n => n.Length);
```

**Output:**

```
Bob
John
Chris
Alexander
```

## 2.10 Key Takeaways

| Concept | Query Syntax | Method Syntax | Description |
|---------|--------------|---------------|-------------|
| Filter Data | `where` | `.Where()` | Selects items based on condition |
| Type Filter | — | `.OfType<T>()` | Filters by element type |
| Sort Ascending | `orderby` | `.OrderBy()` | Sorts ascending (default) |
| Sort Descending | `orderby ... descending` | `.OrderByDescending()` | Sorts descending |
| Multi-Level Sort | `orderby a, b` | `.OrderBy().ThenBy()` | Secondary sorting |

## 2.11 Practice Exercise

Given this list:

```csharp
var employees = new[]
{
    new { Name = "John", Dept = "IT", Salary = 90000 },
    new { Name = "Alice", Dept = "HR", Salary = 75000 },
    new { Name = "Bob", Dept = "IT", Salary = 85000 },
    new { Name = "Daisy", Dept = "Finance", Salary = 70000 },
    new { Name = "Evan", Dept = "Finance", Salary = 95000 }
};
```

### Task

1. Get all employees from IT department sorted by salary descending.
2. Get all employees whose salary is between 75,000 and 90,000 sorted by department name.

Use both query and method syntax for each.

:::tip Challenge
Try coding them — I'll check and explain your solutions next.
:::

---

**Ready to continue?** Move on to [Chapter 3: LINQ Projection and Transformation](./chapter-03) to learn about Select, SelectMany, and data shaping.