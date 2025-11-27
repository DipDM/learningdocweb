---
sidebar_position: 7
title: Set Operations in LINQ
description: Learn LINQ set operations including Distinct, Union, Intersect, Except, and SequenceEqual for working with collections
keywords: [LINQ, set operations, Distinct, Union, Intersect, Except, SequenceEqual, C#]
---

# Chapter 7: Set Operations in LINQ

## 7.1 What Are Set Operations

Set operations allow you to perform mathematical set-based operations between two or more sequences (collections).

They are typically used to:

- Remove duplicates
- Combine results
- Find common or unique elements

LINQ implements these operations via method syntax only — there is no direct query syntax equivalent for set operations.

---

## 7.2 Available LINQ Set Operators

| Operator | Description | Return Type |
|----------|-------------|-------------|
| `Distinct()` | Removes duplicate elements | `IEnumerable<T>` |
| `Union()` | Combines two sequences, removing duplicates | `IEnumerable<T>` |
| `Intersect()` | Returns common elements | `IEnumerable<T>` |
| `Except()` | Returns elements in first sequence that are not in the second | `IEnumerable<T>` |

---

## 7.3 Example Datasets

We'll use two lists for clarity:

```csharp
var listA = new List<int> { 1, 2, 3, 4, 5, 5, 2 };
var listB = new List<int> { 4, 5, 6, 7, 8 };
```

---

## 7.4 Distinct()

### Purpose

Removes duplicate elements from a sequence.

### Method Syntax

```csharp
var result = listA.Distinct();
```

### Output

```
1, 2, 3, 4, 5
```

:::info Explanation
`Distinct()` uses the default equality comparer for the element type to remove duplicates.
:::

### Custom Distinct with Objects

```csharp
var students = new[]
{
    new { Id = 1, Name = "John" },
    new { Id = 2, Name = "Alice" },
    new { Id = 1, Name = "John" }
};

// Distinct() doesn't work on anonymous types unless in same scope (compiler generates comparer)
var unique = students.Distinct(); // Works since they're same anonymous type
```

:::note
If using custom class, you need to provide an `IEqualityComparer<T>`.
:::

---

## 7.5 Union()

### Purpose

Combines two sequences and removes duplicates.

### Example

```csharp
var result = listA.Union(listB);
```

### Output

```
1, 2, 3, 4, 5, 6, 7, 8
```

:::tip
All unique elements from both sequences appear once.
:::

### Union with Strings

```csharp
var cities1 = new[] { "Mumbai", "Pune", "Delhi" };
var cities2 = new[] { "Delhi", "Chennai", "Pune" };

var allCities = cities1.Union(cities2);
```

**Output:**

```
Mumbai, Pune, Delhi, Chennai
```

---

## 7.6 Intersect()

### Purpose

Finds common elements in both sequences.

### Example

```csharp
var result = listA.Intersect(listB);
```

### Output

```
4, 5
```

:::info
Only values present in both collections appear in the result.
:::

### Example with Strings

```csharp
var set1 = new[] { "C#", "Java", "Python" };
var set2 = new[] { "Python", "Go", "C#" };

var common = set1.Intersect(set2);
```

**Output:**

```
C#, Python
```

---

## 7.7 Except()

### Purpose

Returns elements from the first collection that are not in the second.

### Example

```csharp
var result = listA.Except(listB);
```

### Output

```
1, 2, 3
```

:::info Explanation
Removes elements from `listA` that exist in `listB`.
:::

### Example: Employees not in HR

```csharp
var allEmployees = new[] { "John", "Alice", "Bob", "Evan" };
var hrEmployees = new[] { "Alice", "Evan" };

var nonHR = allEmployees.Except(hrEmployees);
```

**Output:**

```
John, Bob
```

---

## 7.8 Using Custom Comparers

### Purpose

To define equality for complex types.

### Example

```csharp
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class StudentComparer : IEqualityComparer<Student>
{
    public bool Equals(Student x, Student y)
    {
        return x.Id == y.Id;
    }

    public int GetHashCode(Student obj)
    {
        return obj.Id.GetHashCode();
    }
}
```

Now use it with set operators:

```csharp
var s1 = new List<Student>
{
    new Student { Id = 1, Name = "John" },
    new Student { Id = 2, Name = "Alice" }
};

var s2 = new List<Student>
{
    new Student { Id = 2, Name = "Alice" },
    new Student { Id = 3, Name = "Bob" }
};

var unique = s1.Union(s2, new StudentComparer());
```

**Output:**

```
1-John, 2-Alice, 3-Bob
```

---

## 7.9 SequenceEqual() — Comparing Whole Sequences

### Purpose

Checks if two sequences contain the same elements in the same order.

### Example

```csharp
var seq1 = new[] { 1, 2, 3 };
var seq2 = new[] { 1, 2, 3 };
var seq3 = new[] { 3, 2, 1 };

Console.WriteLine(seq1.SequenceEqual(seq2)); // True
Console.WriteLine(seq1.SequenceEqual(seq3)); // False
```

:::important
`SequenceEqual` checks both value equality and order.
:::

---

## 7.10 Practical Example

### Example: Comparing Department Lists

```csharp
var oldDepartments = new[] { "IT", "HR", "Finance" };
var newDepartments = new[] { "IT", "HR", "Marketing" };
```

### Find New Departments

```csharp
var added = newDepartments.Except(oldDepartments);
```

**Output:**

```
Marketing
```

### Find Removed Departments

```csharp
var removed = oldDepartments.Except(newDepartments);
```

**Output:**

```
Finance
```

### Find Unchanged Departments

```csharp
var same = oldDepartments.Intersect(newDepartments);
```

**Output:**

```
IT, HR
```

---

## 7.11 Combining Multiple Set Operations

### Example: Union + Except

```csharp
var list1 = new[] { 1, 2, 3, 4 };
var list2 = new[] { 3, 4, 5, 6 };
var list3 = new[] { 6, 7 };

var result = list1.Union(list2).Except(list3);
```

**Output:**

```
1, 2, 3, 4, 5
```

---

## 7.12 Summary Table

| Operator | Description | Removes Duplicates | Order Sensitive | Requires Comparer for Complex Types |
|----------|-------------|-------------------|-----------------|-------------------------------------|
| `Distinct()` | Removes duplicates | ✅ Yes | ❌ No | ✅ Optional |
| `Union()` | Combines sequences uniquely | ✅ Yes | ❌ No | ✅ Optional |
| `Intersect()` | Common elements only | ✅ Yes | ❌ No | ✅ Optional |
| `Except()` | Elements in first not in second | ✅ Yes | ❌ No | ✅ Optional |
| `SequenceEqual()` | Compares full sequences | ❌ N/A | ✅ Yes | ✅ Optional |

---

## 7.13 Real-World Use Cases

| Use Case | LINQ Operator |
|----------|---------------|
| Remove duplicate records from list | `Distinct()` |
| Merge customer lists from two sources | `Union()` |
| Find customers present in both campaigns | `Intersect()` |
| Find users who unsubscribed | `Except()` |
| Verify database data synchronization | `SequenceEqual()` |

---

## 7.14 Practice Exercises

### Given Data

```csharp
var oldCustomers = new[] { "John", "Alice", "Bob", "Evan" };
var newCustomers = new[] { "Alice", "Evan", "Charlie", "Daisy" };
```

### Tasks

1. Find customers common to both lists
2. Find new customers added in the new list
3. Find customers who left (present before but not now)
4. Combine both lists (remove duplicates)
5. Compare both lists to see if they are identical

:::tip Next Steps
Would you like to:
- Solve these exercises (practice your skills), or
- Move to Chapter 8: Element & Quantifier Operators (First, Single, Any, All, Contains)?
:::