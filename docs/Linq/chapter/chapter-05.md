---
sidebar_position: 5
title: Joining in LINQ
description: Learn about different types of joins in LINQ including inner join, left outer join, group join, and cross join with practical examples
keywords: [LINQ, joins, inner join, left outer join, group join, cross join, C#]
---

# Chapter 5: Joining in LINQ

## 5.1 What is a Join

A join in LINQ is used to combine elements from two or more data sources based on a common key (like a foreign key in SQL).

LINQ supports different types of joins:

- **Inner Join**
- **Left Outer Join**
- **Group Join**
- **Cross Join** (Cartesian product)
- **Multiple Joins** (chained joins)

## 5.2 Datasets for Examples

We'll use these collections throughout the chapter:

```csharp
var departments = new[]
{
    new { DeptId = 1, DeptName = "IT" },
    new { DeptId = 2, DeptName = "HR" },
    new { DeptId = 3, DeptName = "Finance" }
};

var employees = new[]
{
    new { EmpId = 101, Name = "John", DeptId = 1 },
    new { EmpId = 102, Name = "Alice", DeptId = 2 },
    new { EmpId = 103, Name = "Bob", DeptId = 1 },
    new { EmpId = 104, Name = "Daisy", DeptId = 3 },
    new { EmpId = 105, Name = "Evan", DeptId = 4 } // No department found
};
```

---

## 5.3 Inner Join

### Purpose

- Matches elements in both collections where keys are equal
- Equivalent to SQL `INNER JOIN`

### Query Syntax

```csharp
var result = from e in employees
             join d in departments
             on e.DeptId equals d.DeptId
             select new { e.Name, d.DeptName };
```

### Method Syntax

```csharp
var result = employees.Join(
    departments,
    e => e.DeptId,
    d => d.DeptId,
    (e, d) => new { e.Name, d.DeptName }
);
```

### Output

```
John - IT
Alice - HR
Bob - IT
Daisy - Finance
```

:::info Explanation
- `join` links employees with departments using `DeptId`
- Employee "Evan" is excluded (no matching department)
:::

---

## 5.4 Group Join

### Purpose

- Performs a join but groups the matching elements — equivalent to SQL join with `GROUP BY` behavior
- Returns each item in the first collection with a group of related items from the second

### Query Syntax

```csharp
var result = from d in departments
             join e in employees
             on d.DeptId equals e.DeptId into empGroup
             select new
             {
                 d.DeptName,
                 Employees = empGroup
             };
```

### Method Syntax

```csharp
var result = departments.GroupJoin(
    employees,
    d => d.DeptId,
    e => e.DeptId,
    (d, empGroup) => new { d.DeptName, Employees = empGroup }
);
```

### Output

```
IT:
 - John
 - Bob
HR:
 - Alice
Finance:
 - Daisy
```

:::tip
Each department contains its collection of employees.
:::

---

## 5.5 Left Outer Join

### Purpose

- Includes all elements from the left collection (even if there are no matches on the right)
- Equivalent to SQL `LEFT OUTER JOIN`

LINQ does not have a direct left join keyword, but you can simulate it using:
**GroupJoin + DefaultIfEmpty()**

### Query Syntax

```csharp
var result = from d in departments
             join e in employees
             on d.DeptId equals e.DeptId into empGroup
             from emp in empGroup.DefaultIfEmpty()
             select new
             {
                 Department = d.DeptName,
                 Employee = emp != null ? emp.Name : "No Employee"
             };
```

### Method Syntax

```csharp
var result = departments.GroupJoin(
    employees,
    d => d.DeptId,
    e => e.DeptId,
    (d, empGroup) => new { d, empGroup }
)
.SelectMany(
    x => x.empGroup.DefaultIfEmpty(),
    (x, e) => new
    {
        Department = x.d.DeptName,
        Employee = e?.Name ?? "No Employee"
    }
);
```

### Output

```
IT - John
IT - Bob
HR - Alice
Finance - Daisy
```

:::note
No Department for Evan is ignored. If we reversed collections, we could find employees with no department too.
:::

---

## 5.6 Right Outer Join (Conceptual)

C# LINQ doesn't have a direct Right Join, but you can simulate it by reversing your collections and performing a Left Join.

### Example

To get all employees and their department names (including those without a department):

```csharp
var result = from e in employees
             join d in departments
             on e.DeptId equals d.DeptId into deptGroup
             from dept in deptGroup.DefaultIfEmpty()
             select new
             {
                 Employee = e.Name,
                 Department = dept?.DeptName ?? "No Department"
             };
```

### Output

```
John - IT
Alice - HR
Bob - IT
Daisy - Finance
Evan - No Department
```

---

## 5.7 Cross Join (Cartesian Product)

### Purpose

- Generates all possible combinations between two collections
- Equivalent to SQL `CROSS JOIN`

### Query Syntax

```csharp
var result = from e in employees
             from d in departments
             select new { e.Name, d.DeptName };
```

### Method Syntax

```csharp
var result = employees.SelectMany(
    e => departments,
    (e, d) => new { e.Name, d.DeptName }
);
```

### Output (conceptually)

```
John - IT
John - HR
John - Finance
Alice - IT
Alice - HR
...
```

---

## 5.8 Multiple Joins

You can join multiple data sources together.

### Example

```csharp
var salaries = new[]
{
    new { EmpId = 101, Amount = 80000 },
    new { EmpId = 102, Amount = 75000 },
    new { EmpId = 103, Amount = 82000 }
};
```

### Query Syntax

```csharp
var result = from e in employees
             join d in departments on e.DeptId equals d.DeptId
             join s in salaries on e.EmpId equals s.EmpId
             select new { e.Name, d.DeptName, s.Amount };
```

### Method Syntax

```csharp
var result = employees
    .Join(departments, e => e.DeptId, d => d.DeptId, (e, d) => new { e, d })
    .Join(salaries, ed => ed.e.EmpId, s => s.EmpId, (ed, s) => new
    {
        ed.e.Name,
        ed.d.DeptName,
        s.Amount
    });
```

### Output

```
John - IT - 80000
Alice - HR - 75000
Bob - IT - 82000
```

---

## 5.9 Key Difference Summary

| Join Type | Query Syntax | Method Syntax | Equivalent SQL | Description |
|-----------|--------------|---------------|----------------|-------------|
| Inner Join | `join ... on ... equals` | `.Join()` | INNER JOIN | Matches in both sides |
| Group Join | `join ... into` | `.GroupJoin()` | JOIN + GROUP | Groups matching results |
| Left Outer Join | `join ... into ... from ... DefaultIfEmpty()` | `.GroupJoin() + .SelectMany()` | LEFT JOIN | Includes all from left side |
| Cross Join | `from a in A from b in B` | `.SelectMany()` | CROSS JOIN | All combinations |
| Right Join | Not direct (reverse left join) | Reverse `.GroupJoin()` | RIGHT JOIN | Simulated manually |

---

## 5.10 Real-World Example: Orders and Customers

```csharp
var customers = new[]
{
    new { Id = 1, Name = "John" },
    new { Id = 2, Name = "Alice" },
    new { Id = 3, Name = "Bob" }
};

var orders = new[]
{
    new { OrderId = 101, CustomerId = 1, Amount = 500 },
    new { OrderId = 102, CustomerId = 2, Amount = 800 },
    new { OrderId = 103, CustomerId = 1, Amount = 250 }
};
```

### Customer and Their Orders

```csharp
var result = from c in customers
             join o in orders on c.Id equals o.CustomerId into orderGroup
             select new
             {
                 c.Name,
                 Orders = orderGroup
             };

foreach (var r in result)
{
    Console.WriteLine($"{r.Name}:");
    foreach (var o in r.Orders)
        Console.WriteLine($"  Order {o.OrderId} - {o.Amount}");
}
```

### Output

```
John:
  Order 101 - 500
  Order 103 - 250
Alice:
  Order 102 - 800
Bob:
  (no orders)
```

---

## 5.11 Summary

| Keyword / Method | Type | Description |
|------------------|------|-------------|
| `join` | Query Syntax | Inner join |
| `.Join()` | Method Syntax | Inner join |
| `join ... into` | Query Syntax | Group join |
| `.GroupJoin()` | Method Syntax | Group join |
| `.DefaultIfEmpty()` | Method | Used for Left Outer join |
| `from ... from ...` | Query Syntax | Cross join |
| `.SelectMany()` | Method | Cross join |
| `into` | Query continuation | Enables chained queries after join |

---

## 5.12 Practice Exercises

### Given Data

```csharp
var customers = new[]
{
    new { Id = 1, Name = "John" },
    new { Id = 2, Name = "Alice" },
    new { Id = 3, Name = "Bob" }
};

var orders = new[]
{
    new { OrderId = 101, CustomerId = 1, Amount = 500 },
    new { OrderId = 102, CustomerId = 2, Amount = 800 },
    new { OrderId = 103, CustomerId = 4, Amount = 300 }
};
```

### Tasks

1. Perform an inner join between customers and orders
2. Perform a left outer join so all customers appear (even those without orders)
3. Find customers with more than one order
4. Create a group join showing each customer and their list of order IDs

:::tip Next Steps
Try implementing these exercises yourself before checking the solutions. Practice with different datasets to master LINQ joins!
:::