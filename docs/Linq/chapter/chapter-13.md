---
sidebar_position: 13
title: "Chapter 13: Real-World LINQ Scenarios"
description: "Combining joins, grouping, and projections for complex business queries"
---

# Chapter 13: Real-World LINQ — Joining, Grouping, and Projection Combined

## 13.1 Overview

Most real-world queries aren't simple. They often:
- Involve multiple tables (joins)
- Need aggregations or summaries
- Require flattening or projection
- Sometimes include conditional grouping

In this chapter, we'll work with 3 related entities to simulate a database-like structure.

## 13.2 Sample Data Setup

```csharp
var departments = new[]
{
    new { DeptId = 1, DeptName = "IT" },
    new { DeptId = 2, DeptName = "HR" },
    new { DeptId = 3, DeptName = "Finance" }
};

var employees = new[]
{
    new { EmpId = 1, Name = "John", DeptId = 1, Salary = 90000 },
    new { EmpId = 2, Name = "Alice", DeptId = 2, Salary = 70000 },
    new { EmpId = 3, Name = "Bob", DeptId = 1, Salary = 85000 },
    new { EmpId = 4, Name = "Daisy", DeptId = 3, Salary = 95000 },
    new { EmpId = 5, Name = "Evan", DeptId = 3, Salary = 80000 }
};

var projects = new[]
{
    new { ProjId = 1, ProjName = "ERP System", DeptId = 1 },
    new { ProjId = 2, ProjName = "Recruitment Portal", DeptId = 2 },
    new { ProjId = 3, ProjName = "Payroll System", DeptId = 3 },
    new { ProjId = 4, ProjName = "Inventory App", DeptId = 1 }
};
```

## 13.3 Example 1: Join Employees with Departments

**Goal:** Show employee name with their department.

### Query Syntax

```csharp
var result = from e in employees
             join d in departments on e.DeptId equals d.DeptId
             select new { e.Name, d.DeptName };
```

### Method Syntax

```csharp
var result = employees
    .Join(departments, e => e.DeptId, d => d.DeptId,
          (e, d) => new { e.Name, d.DeptName });
```

**Output:**
```
John - IT
Alice - HR
Bob - IT
Daisy - Finance
Evan - Finance
```

## 13.4 Example 2: Join + Grouping — Total Salary by Department

```csharp
var result = from e in employees
             join d in departments on e.DeptId equals d.DeptId
             group e by d.DeptName into deptGroup
             select new
             {
                 Dept = deptGroup.Key,
                 TotalSalary = deptGroup.Sum(e => e.Salary),
                 AvgSalary = deptGroup.Average(e => e.Salary),
                 EmployeeCount = deptGroup.Count()
             };
```

**Output:**
```
IT - Total: 175000, Avg: 87500, Count: 2
HR - Total: 70000, Avg: 70000, Count: 1
Finance - Total: 175000, Avg: 87500, Count: 2
```

## 13.5 Example 3: Join + Group + Aggregation + Sorting

**Goal:** Show top departments by average salary.

```csharp
var result = employees
    .Join(departments, e => e.DeptId, d => d.DeptId, (e, d) => new { e, d })
    .GroupBy(x => x.d.DeptName)
    .Select(g => new
    {
        Dept = g.Key,
        AverageSalary = g.Average(x => x.e.Salary)
    })
    .OrderByDescending(x => x.AverageSalary);
```

**Output:**
```
Finance - 87500
IT - 87500
HR - 70000
```

## 13.6 Example 4: Join Across 3 Tables

**Goal:** List all employees and their projects (via department).

### Method Syntax

```csharp
var result = employees
    .Join(departments, e => e.DeptId, d => d.DeptId, (e, d) => new { e, d })
    .Join(projects, ed => ed.d.DeptId, p => p.DeptId,
          (ed, p) => new { ed.e.Name, ed.d.DeptName, p.ProjName });
```

**Output:**
```
John - IT - ERP System
John - IT - Inventory App
Bob - IT - ERP System
Bob - IT - Inventory App
Alice - HR - Recruitment Portal
Daisy - Finance - Payroll System
Evan - Finance - Payroll System
```

## 13.7 Example 5: Group Join + Projection — Department with Projects

```csharp
var result = departments
    .GroupJoin(
        projects,
        d => d.DeptId,
        p => p.DeptId,
        (d, projGroup) => new
        {
            Department = d.DeptName,
            Projects = projGroup.Select(p => p.ProjName)
        }
    );
```

**Output:**
```
IT: ERP System, Inventory App
HR: Recruitment Portal
Finance: Payroll System
```

## 13.8 Example 6: Nested Group Join — Departments with Employees and Projects

```csharp
var result = from d in departments
             join e in employees on d.DeptId equals e.DeptId into empGroup
             join p in projects on d.DeptId equals p.DeptId into projGroup
             select new
             {
                 d.DeptName,
                 Employees = empGroup.Select(x => x.Name),
                 Projects = projGroup.Select(x => x.ProjName)
             };
```

**Output:**
```
IT → Employees: John, Bob | Projects: ERP System, Inventory App  
HR → Employees: Alice | Projects: Recruitment Portal  
Finance → Employees: Daisy, Evan | Projects: Payroll System
```

## 13.9 Example 7: Complex Aggregation — Highest Paid Employee per Department

```csharp
var result = employees
    .GroupBy(e => e.DeptId)
    .Select(g => g.OrderByDescending(e => e.Salary).First())
    .Join(departments, e => e.DeptId, d => d.DeptId, (e, d) => new
    {
        e.Name,
        Department = d.DeptName,
        e.Salary
    });
```

**Output:**
```
John - IT - 90000
Alice - HR - 70000
Daisy - Finance - 95000
```

## 13.10 Example 8: Employees Working on Projects in Their Department

**Goal:** Use a join condition with a common key (DeptId).

```csharp
var result = from e in employees
             join p in projects on e.DeptId equals p.DeptId
             select new
             {
                 e.Name,
                 Project = p.ProjName,
                 Department = e.DeptId
             };
```

**Output:**
```
John - ERP System
John - Inventory App
Bob - ERP System
Bob - Inventory App
Alice - Recruitment Portal
Daisy - Payroll System
Evan - Payroll System
```

## 13.11 Example 9: Multi-Level Grouping — Employees Count by Department & Project

```csharp
var result = from p in projects
             join e in employees on p.DeptId equals e.DeptId
             group e by new { p.ProjName, p.DeptId } into grp
             select new
             {
                 grp.Key.ProjName,
                 grp.Key.DeptId,
                 EmployeeCount = grp.Count()
             };
```

**Output:**
```
ERP System (Dept 1): 2 Employees
Inventory App (Dept 1): 2 Employees
Recruitment Portal (Dept 2): 1 Employee
Payroll System (Dept 3): 2 Employees
```

## 13.12 Example 10: Custom Projection — Combine Aggregation, Join, and Flatten

**Goal:** For each department, show:
- Department name
- Total salary
- Average salary
- List of employee names
- List of projects

```csharp
var result = from d in departments
             join e in employees on d.DeptId equals e.DeptId into empGroup
             join p in projects on d.DeptId equals p.DeptId into projGroup
             select new
             {
                 Department = d.DeptName,
                 TotalSalary = empGroup.Sum(e => e.Salary),
                 AverageSalary = empGroup.Average(e => e.Salary),
                 Employees = empGroup.Select(e => e.Name),
                 Projects = projGroup.Select(p => p.ProjName)
             };
```

**Output:**
```
IT → Total: 175000 | Avg: 87500 | Employees: John, Bob | Projects: ERP System, Inventory App
HR → Total: 70000 | Avg: 70000 | Employees: Alice | Projects: Recruitment Portal
Finance → Total: 175000 | Avg: 87500 | Employees: Daisy, Evan | Projects: Payroll System
```

## 13.13 Practical Pattern — Building a Summary Dashboard

**Real-world use case:** Create a summary of company data.

```csharp
var dashboard = from d in departments
                join e in employees on d.DeptId equals e.DeptId into empGroup
                join p in projects on d.DeptId equals p.DeptId into projGroup
                select new
                {
                    Department = d.DeptName,
                    EmployeeCount = empGroup.Count(),
                    ProjectCount = projGroup.Count(),
                    TopEmployee = empGroup.OrderByDescending(e => e.Salary).First().Name,
                    TotalSalary = empGroup.Sum(e => e.Salary)
                };
```

**Output:**
```
IT - Employees: 2, Projects: 2, Top: John, Total: 175000
HR - Employees: 1, Projects: 1, Top: Alice, Total: 70000
Finance - Employees: 2, Projects: 1, Top: Daisy, Total: 175000
```

## 13.14 Key Learnings from Chapter

| Concept | Description |
|---------|-------------|
| **Join + GroupBy** | Used for department-wise or category-wise summaries |
| **Nested Joins** | Combine multiple tables to simulate relational queries |
| **Projection** | Create custom shaped results with combined fields |
| **Flattening** | Use `SelectMany()` or nested selects to handle lists |
| **Aggregations** | `Sum`, `Count`, `Average` — used per group or subquery |
| **Deferred Execution** | Still applies — these queries only run on enumeration |

## 13.15 Practice Exercises

Given the same data (departments, employees, projects):

### Tasks:

1. List departments with total employee salary and number of projects
2. Get highest and lowest-paid employee per department
3. Create a mapping of department → employee names → project names
4. Show all employees working on multiple projects in their department
5. Combine joins and groups to show department, total salary, and average salary for employees earning above 80,000 only

:::tip Challenge Yourself
Try solving these exercises before looking at the solutions. They combine everything you've learned so far!
:::

---

**Ready for the final chapter?** Continue to [Chapter 14: LINQ Performance Optimization and Best Practices](./chapter-14) to learn how to write efficient, production-ready LINQ queries.