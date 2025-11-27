# Chapter 4: Grouping in LINQ

## 4.1 What is Grouping

Grouping in LINQ organizes elements in a sequence into groups based on a key.

It's conceptually similar to `GROUP BY` in SQL, but in LINQ it returns a sequence of groups, not a single aggregated result.

Each group is represented by an `IGrouping<TKey, TElement>` object:

- **Key** → the value you grouped by.
- Each `IGrouping` contains the elements that share that key.

## 4.2 The group by Keyword / .GroupBy() Method

### Purpose

To divide elements of a collection into groups according to a specified key.

### Syntax

| Syntax Type | Example |
|-------------|---------|
| Query Syntax | `from e in employees group e by e.Dept;` |
| Method Syntax | `employees.GroupBy(e => e.Dept);` |

### Example Dataset

```csharp
var employees = new[]
{
    new { Name = "John", Dept = "IT", Salary = 80000 },
    new { Name = "Alice", Dept = "HR", Salary = 70000 },
    new { Name = "Bob", Dept = "IT", Salary = 85000 },
    new { Name = "Daisy", Dept = "Finance", Salary = 75000 },
    new { Name = "Evan", Dept = "IT", Salary = 95000 },
    new { Name = "Fiona", Dept = "HR", Salary = 72000 }
};
```

## 4.3 Basic Grouping

**Query Syntax**

```csharp
var groups = from e in employees
             group e by e.Dept;
```

**Method Syntax**

```csharp
var groups = employees.GroupBy(e => e.Dept);
```

**Output (conceptually):**

```
IT:
 - John
 - Bob
 - Evan
HR:
 - Alice
 - Fiona
Finance:
 - Daisy
```

### Accessing Group Key and Items

```csharp
foreach (var group in groups)
{
    Console.WriteLine($"Department: {group.Key}");
    foreach (var emp in group)
    {
        Console.WriteLine($"  {emp.Name} - {emp.Salary}");
    }
}
```

**Output:**

```
Department: IT
  John - 80000
  Bob - 85000
  Evan - 95000
Department: HR
  Alice - 70000
  Fiona - 72000
Department: Finance
  Daisy - 75000
```

## 4.4 Grouping with Custom Key

You can group using computed or combined fields.

### Example: Group by Salary Range

```csharp
var groups = from e in employees
             group e by (e.Salary >= 80000 ? "High" : "Low") into g
             select new { SalaryGroup = g.Key, Employees = g };
```

**Output:**

```
High:
  John, Bob, Evan
Low:
  Alice, Daisy, Fiona
```

**Method Syntax Equivalent**

```csharp
var groups = employees
    .GroupBy(e => e.Salary >= 80000 ? "High" : "Low")
    .Select(g => new { SalaryGroup = g.Key, Employees = g });
```

## 4.5 Using into Keyword (Query Continuation)

`into` is used after grouping to continue querying on grouped results.

### Example

```csharp
var result = from e in employees
             group e by e.Dept into deptGroup
             where deptGroup.Count() > 1
             select new
             {
                 Dept = deptGroup.Key,
                 EmployeeCount = deptGroup.Count()
             };
```

**Output:**

```
IT - 3
HR - 2
```

:::info Explanation
- `group e by e.Dept` groups employees by department.
- `into deptGroup` lets you continue querying grouped results.
- `where deptGroup.Count() > 1` filters departments with more than one employee.
:::

## 4.6 Aggregations with Grouping

You can combine `GroupBy` with aggregate functions like:

- `Count()`
- `Sum()`
- `Average()`
- `Min()`
- `Max()`

### Example: Average Salary per Department

**Query Syntax**

```csharp
var result = from e in employees
             group e by e.Dept into g
             select new
             {
                 Dept = g.Key,
                 AvgSalary = g.Average(e => e.Salary)
             };
```

**Method Syntax**

```csharp
var result = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Dept = g.Key,
        AvgSalary = g.Average(e => e.Salary)
    });
```

**Output:**

```
IT - 86666.67
HR - 71000
Finance - 75000
```

## 4.7 Nested Grouping Example

You can group within a group (multi-level grouping).

### Example

```csharp
var result = from e in employees
             group e by e.Dept into deptGroup
             select new
             {
                 Dept = deptGroup.Key,
                 SalaryGroups = from emp in deptGroup
                                group emp by (emp.Salary >= 80000 ? "High" : "Low")
             };
```

**Conceptual Output:**

```
IT:
  High -> Bob, Evan
  Low  -> John
HR:
  Low -> Alice, Fiona
Finance:
  Low -> Daisy
```

## 4.8 The ToLookup() Method

### Purpose

Similar to `GroupBy`, but:

- Executed **immediately**
- Returns a `Lookup<TKey, TElement>` (like a Dictionary with multiple values per key)

### Example

```csharp
var lookup = employees.ToLookup(e => e.Dept);

foreach (var group in lookup)
{
    Console.WriteLine(group.Key);
    foreach (var emp in group)
        Console.WriteLine($"  {emp.Name}");
}
```

### Difference Summary

| Feature | GroupBy() | ToLookup() |
|---------|-----------|------------|
| Execution | Deferred | Immediate |
| Type Returned | `IEnumerable<IGrouping<TKey, TElement>>` | `ILookup<TKey, TElement>` |
| Mutability | Can't be modified after execution | Can't be modified |
| Use Case | Query-building | Lookup-based retrieval |

## 4.9 Real-World Example: Students by Class

```csharp
var students = new[]
{
    new { Name = "John", Class = "10A" },
    new { Name = "Alice", Class = "10A" },
    new { Name = "Bob", Class = "10B" },
    new { Name = "Daisy", Class = "10B" },
    new { Name = "Evan", Class = "10C" }
};
```

### Example: Group Students by Class

```csharp
var groups = students.GroupBy(s => s.Class);

foreach (var g in groups)
{
    Console.WriteLine($"Class: {g.Key}");
    foreach (var s in g)
        Console.WriteLine($"  {s.Name}");
}
```

**Output:**

```
Class: 10A
  John
  Alice
Class: 10B
  Bob
  Daisy
Class: 10C
  Evan
```

## 4.10 Summary Table

| Keyword / Method | Type | Description |
|------------------|------|-------------|
| `group by` | Query Syntax | Groups data based on a key |
| `.GroupBy()` | Method Syntax | Groups data based on a key (deferred) |
| `into` | Query Continuation | Enables further query operations on grouped data |
| `.ToLookup()` | Method Syntax | Creates a lookup (immediate execution) |
| `.Count()`, `.Sum()`, `.Average()` | Aggregate | Used with grouped data for aggregation |

## 4.11 Practice Exercises

### Given Data

```csharp
var sales = new[]
{
    new { Product = "Laptop", Category = "Electronics", Price = 1000 },
    new { Product = "Phone", Category = "Electronics", Price = 700 },
    new { Product = "Shirt", Category = "Clothing", Price = 50 },
    new { Product = "Jeans", Category = "Clothing", Price = 80 },
    new { Product = "Mixer", Category = "Appliances", Price = 150 },
    new { Product = "Fan", Category = "Appliances", Price = 120 }
};
```

### Tasks

1. Group products by category.
2. Show total and average price per category.
3. Filter categories where the total price > 500.
4. Create a lookup using `ToLookup()` for category → products.

:::tip Challenge
Practice these exercises to master grouping operations in LINQ!
:::