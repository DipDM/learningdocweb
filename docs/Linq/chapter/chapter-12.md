---
sidebar_position: 12
title: "Chapter 12: Advanced LINQ Techniques"
description: "Master grouping, lookups, and projections for report generation and analytics"
---

# Chapter 12: Advanced LINQ Techniques — Grouping, Lookups & Projections

## 12.1 Overview

In advanced LINQ:
- You don't just filter or sort — you **shape and summarize** data
- These queries are commonly used in report generation, analytics, dashboards, and database-heavy applications

## 12.2 Example Dataset

We'll use this dataset throughout the chapter:

```csharp
var employees = new[]
{
    new { Id = 1, Name = "John", Dept = "IT", Salary = 90000, City = "Pune" },
    new { Id = 2, Name = "Alice", Dept = "HR", Salary = 75000, City = "Delhi" },
    new { Id = 3, Name = "Bob", Dept = "IT", Salary = 85000, City = "Pune" },
    new { Id = 4, Name = "Daisy", Dept = "Finance", Salary = 70000, City = "Mumbai" },
    new { Id = 5, Name = "Evan", Dept = "Finance", Salary = 95000, City = "Pune" },
    new { Id = 6, Name = "Fiona", Dept = "HR", Salary = 72000, City = "Delhi" },
};
```

## 12.3 Grouping with Aggregation

Grouping lets you organize data by category, and aggregation helps summarize each group.

### Example 1: Average Salary per Department

**Query Syntax**

```csharp
var avgSalary = from e in employees
                group e by e.Dept into deptGroup
                select new
                {
                    Department = deptGroup.Key,
                    AverageSalary = deptGroup.Average(e => e.Salary)
                };
```

**Method Syntax**

```csharp
var avgSalary = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Department = g.Key,
        AverageSalary = g.Average(e => e.Salary)
    });
```

**Output:**
```
IT - 87500
HR - 73500
Finance - 82500
```

### Example 2: Group + Multiple Aggregations

```csharp
var stats = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Department = g.Key,
        Count = g.Count(),
        Min = g.Min(e => e.Salary),
        Max = g.Max(e => e.Salary),
        Total = g.Sum(e => e.Salary),
        Average = g.Average(e => e.Salary)
    });
```

**Output:**
```
IT: Count=2, Total=175000, Avg=87500
HR: Count=2, Total=147000, Avg=73500
Finance: Count=2, Total=165000, Avg=82500
```

## 12.4 Group by Multiple Keys

You can group by multiple columns (e.g., Department + City).

```csharp
var result = employees
    .GroupBy(e => new { e.Dept, e.City })
    .Select(g => new
    {
        g.Key.Dept,
        g.Key.City,
        EmployeeCount = g.Count(),
        TotalSalary = g.Sum(e => e.Salary)
    });
```

**Output:**
```
IT - Pune: 2 Employees, 175000
HR - Delhi: 2 Employees, 147000
Finance - Mumbai: 1 Employee, 70000
Finance - Pune: 1 Employee, 95000
```

## 12.5 Grouping and Ordering

You can order groups by their key or aggregated values.

```csharp
var result = employees
    .GroupBy(e => e.Dept)
    .OrderByDescending(g => g.Average(e => e.Salary))
    .Select(g => new
    {
        Dept = g.Key,
        AvgSalary = g.Average(e => e.Salary)
    });
```

**Output (Descending by Average Salary):**
```
IT - 87500
Finance - 82500
HR - 73500
```

## 12.6 Flattening Groups (Group Join + SelectMany)

### Example: List all departments with their employees

```csharp
var departments = new[]
{
    new { Id = 1, Name = "IT" },
    new { Id = 2, Name = "HR" },
    new { Id = 3, Name = "Finance" }
};

var result = departments.GroupJoin(
    employees,
    d => d.Name,
    e => e.Dept,
    (d, empGroup) => new
    {
        Department = d.Name,
        Employees = empGroup.Select(e => e.Name)
    }
);

foreach (var dept in result)
{
    Console.WriteLine($"{dept.Department}: {string.Join(", ", dept.Employees)}");
}
```

**Output:**
```
IT: John, Bob
HR: Alice, Fiona
Finance: Daisy, Evan
```

## 12.7 ToLookup() — Immediate Grouping

### Definition

`ToLookup()` is similar to `GroupBy()` but executes immediately and returns a `Lookup<TKey, TElement>` (like a dictionary of lists).

### Example

```csharp
var lookup = employees.ToLookup(e => e.Dept);

foreach (var group in lookup)
{
    Console.WriteLine($"Dept: {group.Key}");
    foreach (var emp in group)
        Console.WriteLine($"  {emp.Name}");
}
```

**Output:**
```
Dept: IT
  John
  Bob
Dept: HR
  Alice
  Fiona
Dept: Finance
  Daisy
  Evan
```

### Difference: GroupBy() vs ToLookup()

| Feature | GroupBy() | ToLookup() |
|---------|-----------|------------|
| **Execution** | Deferred | Immediate |
| **Return Type** | `IEnumerable<IGrouping>` | `ILookup<TKey, TElement>` |
| **Mutability** | Re-evaluated each time | Fixed snapshot |
| **Common Use** | Query building | Fast lookup in memory |

## 12.8 Nested Grouping Example

**Scenario:** Group employees by City, and within each city, group by Department.

```csharp
var result = employees
    .GroupBy(e => e.City)
    .Select(cityGroup => new
    {
        City = cityGroup.Key,
        Departments = cityGroup.GroupBy(e => e.Dept)
                               .Select(dg => new
                               {
                                   Department = dg.Key,
                                   Count = dg.Count()
                               })
    });
```

**Output:**
```
City: Pune
  IT - 2
  Finance - 1
City: Delhi
  HR - 2
City: Mumbai
  Finance - 1
```

## 12.9 Custom Projection After Grouping

You can use `SelectMany()` to flatten and project grouped data.

```csharp
var result = employees
    .GroupBy(e => e.Dept)
    .SelectMany(
        g => g,
        (deptGroup, emp) => new
        {
            deptGroup.Key,
            emp.Name,
            emp.Salary
        }
    );
```

**Output:**
```
IT - John - 90000
IT - Bob - 85000
HR - Alice - 75000
HR - Fiona - 72000
Finance - Daisy - 70000
Finance - Evan - 95000
```

## 12.10 Real-World Example: Department Summary Report

```csharp
var summary = employees
    .GroupBy(e => e.Dept)
    .Select(g => new
    {
        Department = g.Key,
        TotalSalary = g.Sum(e => e.Salary),
        HighestPaid = g.OrderByDescending(e => e.Salary).First().Name,
        Cities = string.Join(", ", g.Select(e => e.City).Distinct())
    });
```

**Output:**
```
IT - Total: 175000, Highest: John, Cities: Pune
HR - Total: 147000, Highest: Alice, Cities: Delhi
Finance - Total: 165000, Highest: Evan, Cities: Mumbai, Pune
```

## 12.11 Nested Query (Subquery Example)

You can use one LINQ query inside another, similar to SQL subqueries.

```csharp
var result = from e in employees
             where e.Salary > (from emp in employees
                               where emp.Dept == e.Dept
                               select emp.Salary).Average()
             select new { e.Name, e.Dept, e.Salary };
```

**Output:**
```
John - IT - 90000
Evan - Finance - 95000
Alice - HR - 75000
```

**Explanation:** Each employee is compared to the average salary of their department.

## 12.12 Summary Table

| Feature | Description | Syntax Type | Execution |
|---------|-------------|-------------|-----------|
| `GroupBy()` | Groups data by key | Deferred | Query |
| `ToLookup()` | Groups data immediately | Immediate | Method |
| `SelectMany()` | Flattens nested collections | Method | Deferred |
| Nested Grouping | Group within groups | Query/Method | Deferred |
| Aggregation after Grouping | Perform `Count()`, `Sum()` etc. | Both | Deferred/Immediate |

## 12.13 Common Interview Question Patterns

| Question | Expected Concept |
|----------|------------------|
| Get average salary by department | `GroupBy()` + `Average()` |
| Get employee with highest salary per department | `GroupBy()` + `OrderByDescending().First()` |
| Create department-to-employee mapping | `ToLookup()` |
| Flatten a nested list of departments/employees | `SelectMany()` |
| Find employees earning above their department's average | Subquery (`where` + `select`) |

## 12.14 Practice Exercises

Given the employees dataset:

### Tasks:

1. Group employees by department and show total & average salary
2. Group by department and city, then count employees
3. Find top-paid employee in each department
4. Create a lookup of department → list of employee names
5. Find employees earning above their department's average salary

---

**Ready for more?** Continue to [Chapter 13: Joining, Grouping, and Projection Combined](./chapter-13) to explore real-world query scenarios used in interviews and EF Core projects.