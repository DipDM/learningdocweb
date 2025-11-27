---
sidebar_position: 6
title: Aggregation and Summary Operators
description: Master LINQ aggregation operators including Count, Sum, Average, Min, Max, and custom Aggregate for data analysis
keywords: [LINQ, aggregation, Count, Sum, Average, Min, Max, Aggregate, C#, data analysis]
---

# Chapter 6: Aggregation and Summary Operators in LINQ

## 6.1 What is Aggregation

Aggregation means applying a computation over a set of elements to produce a single value.

Examples include:

- Counting elements
- Finding totals or averages
- Getting min/max values
- Custom reduction (like concatenation or complex math)

In LINQ, these are available both as query syntax and method syntax (though query syntax is limited — most aggregation happens via methods).

---

## 6.2 Common Aggregation Methods

| Operator | Description | Example |
|----------|-------------|---------|
| `Count()` | Counts elements | `employees.Count()` |
| `Sum()` | Adds all numeric values | `employees.Sum(e => e.Salary)` |
| `Average()` | Computes mean | `employees.Average(e => e.Salary)` |
| `Min()` | Finds smallest value | `employees.Min(e => e.Salary)` |
| `Max()` | Finds largest value | `employees.Max(e => e.Salary)` |
| `Aggregate()` | Performs custom accumulation | `numbers.Aggregate(...)` |

---

## 6.3 Example Dataset

```csharp
var employees = new[]
{
    new { Id = 1, Name = "John", Dept = "IT", Salary = 80000 },
    new { Id = 2, Name = "Alice", Dept = "HR", Salary = 70000 },
    new { Id = 3, Name = "Bob", Dept = "IT", Salary = 90000 },
    new { Id = 4, Name = "Daisy", Dept = "Finance", Salary = 75000 },
    new { Id = 5, Name = "Evan", Dept = "IT", Salary = 95000 }
};
```

---

## 6.4 Count()

### Purpose

Counts elements in a collection.

### Example 1: Count All

```csharp
int totalEmployees = employees.Count();
Console.WriteLine(totalEmployees); // 5
```

### Example 2: Count with Condition

```csharp
int highEarners = employees.Count(e => e.Salary > 80000);
Console.WriteLine(highEarners); // 2
```

### Query Syntax (Less Common)

```csharp
var count = (from e in employees
             where e.Salary > 80000
             select e).Count();
```

---

## 6.5 Sum()

### Purpose

Returns the sum of numeric values.

### Example: Sum of Salaries

```csharp
decimal totalSalary = employees.Sum(e => e.Salary);
Console.WriteLine(totalSalary); // 410000
```

### Grouped Sum Example

Total salary per department:

```csharp
var totalByDept = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Dept = g.Key,
        TotalSalary = g.Sum(e => e.Salary)
    });
```

**Output:**

```
IT - 265000
HR - 70000
Finance - 75000
```

---

## 6.6 Average()

### Purpose

Computes average of numeric values.

### Example: Average Salary

```csharp
var avgSalary = employees.Average(e => e.Salary);
Console.WriteLine(avgSalary); // 82000
```

### Grouped Average

```csharp
var avgByDept = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Dept = g.Key,
        AvgSalary = g.Average(e => e.Salary)
    });
```

**Output:**

```
IT - 88333.33
HR - 70000
Finance - 75000
```

---

## 6.7 Min() and Max()

### Purpose

Finds minimum or maximum value in a collection.

### Example

```csharp
var minSalary = employees.Min(e => e.Salary);
var maxSalary = employees.Max(e => e.Salary);

Console.WriteLine($"Min: {minSalary}, Max: {maxSalary}");
```

**Output:**

```
Min: 70000, Max: 95000
```

### Example with Names

You can also use it for non-numeric types (lexical order):

```csharp
var firstName = employees.Min(e => e.Name); // Alice
var lastName = employees.Max(e => e.Name);  // John
```

---

## 6.8 Aggregate() — Custom Aggregation

### Purpose

Performs custom accumulation or computation not covered by built-in methods.

### Signature

```csharp
TAccumulate Aggregate<TSource>(
    Func<TSource, TSource, TSource> func
)
```

Or with seed value:

```csharp
TAccumulate Aggregate<TSource, TAccumulate>(
    TAccumulate seed,
    Func<TAccumulate, TSource, TAccumulate> func
)
```

### Example 1: Sum using Aggregate

```csharp
var total = employees.Select(e => e.Salary)
                     .Aggregate((a, b) => a + b);

Console.WriteLine(total); // 410000
```

### Example 2: String Concatenation

```csharp
var names = employees.Select(e => e.Name)
                     .Aggregate((a, b) => a + ", " + b);

Console.WriteLine(names);
// John, Alice, Bob, Daisy, Evan
```

### Example 3: Seed Example

```csharp
var totalWithSeed = employees.Select(e => e.Salary)
                             .Aggregate(10000m, (a, b) => a + b);

Console.WriteLine(totalWithSeed); // 420000
```

:::tip Understanding Aggregate
The `Aggregate` method is powerful for custom operations. The seed value (if provided) becomes the initial accumulator value, and the function is applied sequentially to each element.
:::

---

## 6.9 Combined Example — Department Stats

Compute multiple aggregates per group.

```csharp
var stats = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Dept = g.Key,
        Count = g.Count(),
        Min = g.Min(e => e.Salary),
        Max = g.Max(e => e.Salary),
        Total = g.Sum(e => e.Salary),
        Average = g.Average(e => e.Salary)
    });
```

**Output:**

```
IT: Count=3, Min=80000, Max=95000, Total=265000, Avg=88333
HR: Count=1, Total=70000
Finance: Count=1, Total=75000
```

---

## 6.10 Practical Example: Sales Summary

```csharp
var sales = new[]
{
    new { Product = "Laptop", Category = "Electronics", Price = 1000 },
    new { Product = "Phone", Category = "Electronics", Price = 800 },
    new { Product = "Mixer", Category = "Appliances", Price = 150 },
    new { Product = "Fan", Category = "Appliances", Price = 120 },
    new { Product = "Jeans", Category = "Clothing", Price = 60 },
    new { Product = "Shirt", Category = "Clothing", Price = 40 }
};
```

### Category-wise Aggregation

```csharp
var summary = sales
    .GroupBy(s => s.Category)
    .Select(g => new
    {
        Category = g.Key,
        Count = g.Count(),
        MinPrice = g.Min(s => s.Price),
        MaxPrice = g.Max(s => s.Price),
        Total = g.Sum(s => s.Price),
        AvgPrice = g.Average(s => s.Price)
    });
```

**Output:**

```
Electronics: Count=2, Total=1800, Avg=900
Appliances: Count=2, Total=270, Avg=135
Clothing: Count=2, Total=100, Avg=50
```

---

## 6.11 Summary Table

| Operator | Description | Method Syntax | Query Syntax Support |
|----------|-------------|---------------|---------------------|
| `Count()` | Number of elements | `collection.Count()` | Yes (with parentheses) |
| `Sum()` | Total of numeric field | `collection.Sum(x => x.Value)` | Limited |
| `Average()` | Mean value | `collection.Average(x => x.Value)` | Limited |
| `Min()` | Smallest value | `collection.Min(x => x.Value)` | Limited |
| `Max()` | Largest value | `collection.Max(x => x.Value)` | Limited |
| `Aggregate()` | Custom accumulation logic | `collection.Aggregate(...)` | No |

---

## 6.12 Key Differences: Aggregate vs Other Operators

| Feature | Aggregate() | Other Aggregates |
|---------|-------------|------------------|
| Custom Logic | Yes | No |
| Return Type | Custom | Usually numeric |
| Execution | Manual | Built-in optimized |
| Example | Concatenate, factorial, etc. | Sum, Average, Count |

:::info When to Use Aggregate
Use `Aggregate()` when you need custom accumulation logic that isn't covered by standard operators. For common operations like sum or average, prefer the dedicated methods as they're more readable and optimized.
:::

---

## 6.13 Practice Exercises

### Given Data

```csharp
var sales = new[]
{
    new { Product = "Laptop", Category = "Electronics", Price = 1000 },
    new { Product = "Phone", Category = "Electronics", Price = 800 },
    new { Product = "Shirt", Category = "Clothing", Price = 50 },
    new { Product = "Jeans", Category = "Clothing", Price = 80 },
    new { Product = "Mixer", Category = "Appliances", Price = 150 }
};
```

### Tasks

1. Find total sales amount (Sum)
2. Find average price of all products (Average)
3. Find category with the highest total sales
4. Using Aggregate(), concatenate all product names separated by commas
5. Group products by category and show:
   - Count
   - Total Price
   - Average Price

:::tip Challenge
Try solving these exercises without looking at previous examples. Aggregation is one of the most commonly used LINQ operations in real-world applications!
:::