# Chapter 7 — Subqueries and Derived Tables

### Scalar, Multi-row, Correlated, Nested Subqueries, and Derived Tables

---

## 7.1 Introduction

A **Subquery** (inner query) is a query inside another query.

### Interview Definition

> A subquery is a query nested inside another SQL query that returns data used by the outer query for filtering, comparison, or computation.

### Use Cases

* Compare values between tables
* Perform dynamic calculations
* Filter based on results of another query

---

## 7.2 Types of Subqueries

| Type                | Returns                          | Common Use              |
| ------------------- | -------------------------------- | ----------------------- |
| Scalar Subquery     | One value                        | SELECT, WHERE, HAVING   |
| Multi-row Subquery  | Multiple rows                    | IN, ANY, ALL            |
| Correlated Subquery | Runs once per outer row          | Dependent filtering     |
| Nested Subquery     | Subquery inside another subquery | Multi-level filtering   |
| Derived Table       | Subquery in FROM clause          | Acts as temporary table |

### Sample Setup

```sql
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName NVARCHAR(50)
);
CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    EmpName NVARCHAR(100),
    DeptID INT,
    Salary DECIMAL(10,2)
);
INSERT INTO Departments VALUES
(1, 'IT'), (2, 'HR'), (3, 'Finance');
INSERT INTO Employees VALUES
(101, 'Amit', 1, 60000),
(102, 'Rita', 1, 55000),
(103, 'Raj', 2, 45000),
(104, 'Meena', 3, 70000),
(105, 'Kiran', NULL, 30000);
```

---

## 7.3 Scalar Subquery

Returns **exactly one value**.

### Example — In SELECT

```sql
SELECT EmpName,
       Salary,
       (SELECT AVG(Salary) FROM Employees) AS AvgCompanySalary
FROM Employees;
```

### Example — In WHERE

```sql
SELECT EmpName, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

**Interview Tip:** Scalar subqueries must return one value only.

---

## 7.4 Multi-row Subquery

Used with **IN**, **ANY**, **ALL**.

### Example — IN

```sql
SELECT EmpName, Salary
FROM Employees
WHERE DeptID IN (
    SELECT DeptID FROM Departments
    WHERE DeptName IN ('IT', 'HR')
);
```

### Example — ANY

```sql
SELECT EmpName, Salary
FROM Employees
WHERE Salary > ANY (
    SELECT Salary FROM Employees WHERE DeptID = 1
);
```

### Example — ALL

```sql
SELECT EmpName, Salary
FROM Employees
WHERE Salary > ALL (
    SELECT Salary FROM Employees WHERE DeptID = 2
);
```

---

## 7.5 Correlated Subquery

Subquery **depends on the outer query**.

### Example

```sql
SELECT E.EmpName, E.Salary
FROM Employees E
WHERE E.Salary > (
    SELECT AVG(Salary)
    FROM Employees
    WHERE DeptID = E.DeptID
);
```

Runs once for each employee.

### Equivalent Using JOIN

```sql
SELECT E.EmpName, E.Salary, D.AvgSalary
FROM Employees E
JOIN (
    SELECT DeptID, AVG(Salary) AS AvgSalary
    FROM Employees
    GROUP BY DeptID
) D ON E.DeptID = D.DeptID
WHERE E.Salary > D.AvgSalary;
```

---

## 7.6 Nested Subqueries

Subqueries inside another subquery.

### Example

```sql
SELECT EmpName
FROM Employees
WHERE DeptID = (
    SELECT DeptID
    FROM Departments
    WHERE DeptName = (
        SELECT DeptName FROM Departments
        WHERE DeptID = 1
    )
);
```

---

## 7.7 Derived Tables

Subquery in the **FROM clause**, acts as a temporary table.

### Example

```sql
SELECT DeptID, AvgSalary
FROM (
    SELECT DeptID, AVG(Salary) AS AvgSalary
    FROM Employees
    GROUP BY DeptID
) AS DeptAvg
WHERE AvgSalary > 50000;
```

### Subquery vs Derived Table

| Feature | Subquery         | Derived Table |
| ------- | ---------------- | ------------- |
| Usage   | Anywhere         | Only in FROM  |
| Returns | Scalar/multi-row | Virtual table |
| Alias   | Optional         | Mandatory     |

---

## 7.8 Common Interview Examples

### Example 1 — Max salary employee

```sql
SELECT EmpName, Salary
FROM Employees
WHERE Salary = (SELECT MAX(Salary) FROM Employees);
```

### Example 2 — Departments with >1 employee

```sql
SELECT DeptID
FROM Employees
GROUP BY DeptID
HAVING COUNT(*) > 1;
```

### Example — With subquery

```sql
SELECT DeptID
FROM Departments
WHERE DeptID IN (
    SELECT DeptID FROM Employees
    GROUP BY DeptID HAVING COUNT(*) > 1
);
```

### Example 3 — Salary above department average

```sql
SELECT EmpName, DeptID, Salary
FROM Employees E
WHERE Salary > (
    SELECT AVG(Salary)
    FROM Employees
    WHERE DeptID = E.DeptID
);
```

### Example 4 — Derived table for top salary per department

```sql
SELECT D.DeptName, DT.EmpName, DT.Salary
FROM Departments D
JOIN (
    SELECT EmpName, DeptID, Salary,
           RANK() OVER(PARTITION BY DeptID ORDER BY Salary DESC) AS RankNo
    FROM Employees
) AS DT ON D.DeptID = DT.DeptID
WHERE DT.RankNo = 1;
```

---

## 7.9 Practice Questions

1. Employees earning above overall average salary.
2. Departments where minimum salary > 40000.
3. Correlated subquery: employees earning more than department avg.
4. Derived table: top salary per department.
5. Nested subquery: employees in same dept as 'Rita'.

---

## 7.10 Summary

| Concept             | Definition                 |
| ------------------- | -------------------------- |
| Subquery            | Query inside another query |
| Scalar Subquery     | Returns one value          |
| Multi-row Subquery  | Returns multiple values    |
| Correlated Subquery | References outer query     |
| Nested Subquery     | Subquery inside another    |
| Derived Table       | Subquery in FROM clause    |
| ANY/ALL/IN          | Multi-row comparison tools |

---

## 7.11 Interview Recap

| Term                | Interview Definition                                  |
| ------------------- | ----------------------------------------------------- |
| Subquery            | Query inside another used for comparison/filtering    |
| Scalar Subquery     | One-row, one-column result                            |
| Correlated Subquery | Runs once per outer row                               |
| Derived Table       | Subquery used as temporary table                      |
| Nested Subquery     | Multi-level subquery                                  |
| Join vs Subquery    | Join merges horizontally; subquery filters vertically |

---

## 7.12 Next Chapter Preview

Next: **Chapter 8 — Common Table Expressions (CTEs) and Recursive Queries**

You will learn:

* WITH clause syntax
* Recursive CTEs
* Hierarchical queries (employee-manag
