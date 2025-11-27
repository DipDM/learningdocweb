# Chapter 6 — Joins and Set Operators

## INNER, LEFT, RIGHT, FULL, CROSS, SELF, APPLY, UNION, INTERSECT, EXCEPT

---

## 6.1 Introduction

SQL JOINs allow combining data from multiple tables based on related columns (usually foreign keys).

**JOIN definition (interview style):**

> A JOIN combines rows from two or more tables based on a related column, returning a unified result.

This chapter covers all major JOIN types and Set Operators.

---

## 6.2 Types of Joins Overview

| Join Type                 | Returns                                  |
| ------------------------- | ---------------------------------------- |
| INNER JOIN                | Only matching rows between tables        |
| LEFT JOIN                 | All rows from left + matching from right |
| RIGHT JOIN                | All rows from right + matching from left |
| FULL JOIN                 | All rows from both tables                |
| CROSS JOIN                | Cartesian product (all combinations)     |
| SELF JOIN                 | Table joined with itself                 |
| CROSS APPLY / OUTER APPLY | Join with table-valued function result   |

---

## 6.3 Sample Data Setup

```sql
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName NVARCHAR(50)
);
CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    EmpName NVARCHAR(100),
    DeptID INT,
    Salary DECIMAL(10,2),
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
);
INSERT INTO Departments VALUES
(1, 'IT'), (2, 'HR'), (3, 'Finance');
INSERT INTO Employees VALUES
(101, 'Amit', 1, 60000),
(102, 'Rita', 1, 55000),
(103, 'Raj', 2, 45000),
(104, 'Meena', NULL, 30000);
```

---

## 6.4 INNER JOIN

### Definition

Returns only rows with matching values in both tables.

### Syntax

```sql
SELECT columns
FROM table1
INNER JOIN table2
ON table1.column = table2.column;
```

### Example

```sql
SELECT E.EmpName, D.DeptName
FROM Employees E
INNER JOIN Departments D
ON E.DeptID = D.DeptID;
```

**Explanation:** Only employees with valid DeptID appear (Meena is excluded).

---

## 6.5 LEFT JOIN

### Definition

Returns all rows from left table and matching rows from right.

### Example

```sql
SELECT E.EmpName, D.DeptName
FROM Employees E
LEFT JOIN Departments D
ON E.DeptID = D.DeptID;
```

**Explanation:** Meena appears, but DeptName = NULL.

---

## 6.6 RIGHT JOIN

### Definition

Returns all rows from right table and matching from left.

### Example

```sql
SELECT D.DeptName, E.EmpName
FROM Employees E
RIGHT JOIN Departments D
ON E.DeptID = D.DeptID;
```

**Explanation:** All departments appear, even if no employees.

---

## 6.7 FULL JOIN

### Definition

Returns all rows from both tables, matched or not.

### Example

```sql
SELECT E.EmpName, D.DeptName
FROM Employees E
FULL JOIN Departments D
ON E.DeptID = D.DeptID;
```

**Explanation:** Combines LEFT + RIGHT join behavior.

---

## 6.8 CROSS JOIN

### Definition

Produces Cartesian product.

### Example

```sql
SELECT E.EmpName, D.DeptName
FROM Employees E
CROSS JOIN Departments D;
```

4 employees × 3 departments → 12 rows.

---

## 6.9 SELF JOIN

### Definition

Join a table with itself.

### Setup

```sql
CREATE TABLE EmployeeManager (
    EmpID INT,
    EmpName NVARCHAR(100),
    ManagerID INT
);
INSERT INTO EmployeeManager VALUES
(1, 'Amit', NULL),
(2, 'Rita', 1),
(3, 'Raj', 1),
(4, 'Neha', 2);
```

### Example

```sql
SELECT E.EmpName AS Employee, M.EmpName AS Manager
FROM EmployeeManager E
LEFT JOIN EmployeeManager M
ON E.ManagerID = M.EmpID;
```

---

## 6.10 CROSS APPLY & OUTER APPLY

### Setup

```sql
CREATE FUNCTION dbo.fn_GetTopSalaries(@Dept INT)
RETURNS TABLE
AS
RETURN (
    SELECT TOP 2 EmpName, Salary
    FROM Employees
    WHERE DeptID = @Dept
    ORDER BY Salary DESC
);
```

### CROSS APPLY (excludes empty results)

```sql
SELECT D.DeptName, T.EmpName, T.Salary
FROM Departments D
CROSS APPLY dbo.fn_GetTopSalaries(D.DeptID) AS T;
```

### OUTER APPLY (includes empty results)

```sql
SELECT D.DeptName, T.EmpName, T.Salary
FROM Departments D
OUTER APPLY dbo.fn_GetTopSalaries(D.DeptID) AS T;
```

---

## 6.11 Set Operators

| Operator  | Description                 | Duplicates |
| --------- | --------------------------- | ---------- |
| UNION     | Unique rows from both       | Removed    |
| UNION ALL | All rows                    | Kept       |
| INTERSECT | Rows common to both         | Removed    |
| EXCEPT    | Rows in first not in second | Removed    |

### Example — UNION

```sql
SELECT DeptID FROM Employees
UNION
SELECT DeptID FROM Departments;
```

### Example — INTERSECT

```sql
SELECT DeptID FROM Employees
INTERSECT
SELECT DeptID FROM Departments;
```

### Example — EXCEPT

```sql
SELECT DeptID FROM Departments
EXCEPT
SELECT DeptID FROM Employees;
```

---

## 6.12 Practical Scenarios

| Scenario                               | Recommended Approach |
| -------------------------------------- | -------------------- |
| Employees with department names        | INNER JOIN           |
| All employees even without departments | LEFT JOIN            |
| Departments with no employees          | RIGHT JOIN or EXCEPT |
| All combinations                       | CROSS JOIN           |
| Employee-manager relationships         | SELF JOIN            |
| Combine without duplicates             | UNION                |
| Find mismatch between datasets         | EXCEPT               |
| Find common rows                       | INTERSECT            |

---

## 6.13 Practice Questions

1. Use INNER JOIN to display employees with department names.
2. Use LEFT JOIN to display all employees.
3. Use RIGHT JOIN to display all departments.
4. Use EXCEPT to list departments without employees.
5. Use SELF JOIN to show employees with managers.
6. Use CROSS APPLY to get top salary per department.
7. Use UNION to combine employee names from two tables.

---

## 6.14 Summary

| Concept    | Key Point                           |
| ---------- | ----------------------------------- |
| JOIN       | Combines rows using related columns |
| INNER JOIN | Only matching rows                  |
| LEFT JOIN  | All left rows + matched right       |
| RIGHT JOIN | All right rows + matched left       |
| FULL JOIN  | All rows from both tables           |
| CROSS JOIN | Cartesian product                   |
| SELF JOIN  | Table joined with itself            |
| APPLY      | Joins with function results         |
| UNION      | Unique rows from two queries        |
| UNION ALL  | All rows (keeps duplicates)         |
| INTERSECT  | Common rows                         |
| EXCEPT     | Rows in first not in second         |

---

## 6.15 Next Chapter Preview

Next: **Chapter 7 — Subqueries and Derived Tables**

You will learn:

* Scalar, multi-row, and correlated subqueries
* Subqueries in SELECT, WHERE, FROM, HAVING
* Derived tables
* JOIN vs Subquery perform
