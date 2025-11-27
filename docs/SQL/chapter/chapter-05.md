# Chapter 5 — Filtering, Sorting, and Aggregation

### WHERE, ORDER BY, DISTINCT, GROUP BY, HAVING, ROLLUP, CUBE, GROUPING SETS

---

## 5.1 Introduction

In this chapter, we focus on querying and analyzing data effectively.

You will learn:

* Filtering with **WHERE** and **DISTINCT**
* Sorting with **ORDER BY**
* Aggregation with **GROUP BY** and **HAVING**
* Advanced grouping: **ROLLUP**, **CUBE**, **GROUPING SETS**

---

## 5.2 Filtering Data — WHERE Clause

### Purpose

Filters rows before grouping/aggregation.

### Syntax

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

### Supported Operators

| Category         | Operators            |
| ---------------- | -------------------- |
| Comparison       | =, &lt;&gt;, &gt;, &lt;, &gt;=, &lt;=  |
| Range            | BETWEEN ... AND ...  |
| Set Membership   | IN, NOT IN           |
| Pattern Matching | LIKE, NOT LIKE       |
| Null Check       | IS NULL, IS NOT NULL |
| Logical          | AND, OR, NOT         |

### Examples

**Example 1 — Simple filter**

```sql
SELECT * FROM dbo.Students
WHERE Marks > 70;
```

**Example 2 — Multiple conditions**

```sql
SELECT FirstName, LastName, Marks
FROM dbo.Students
WHERE Marks > 70 AND DeptID = 1;
```

**Example 3 — Using IN**

```sql
SELECT * FROM dbo.Students
WHERE DeptID IN (1,3,5);
```

**Example 4 — Using BETWEEN**

```sql
SELECT * FROM dbo.Students
WHERE Marks BETWEEN 60 AND 80;
```

**Example 5 — Using LIKE**

```sql
SELECT * FROM dbo.Students
WHERE FirstName LIKE 'A%';
```

### Key Notes

* String comparisons are case-insensitive by default.
* `BETWEEN` is inclusive.
* Use **IS NULL** for NULL checks.

---

## 5.3 Sorting Data — ORDER BY

### Purpose

Sorts result sets.

### Syntax

```sql
SELECT column1, column2
FROM table_name
ORDER BY column1 [ASC|DESC];
```

### Examples

**Example 1 — Ascending order**

```sql
SELECT FirstName, Marks
FROM dbo.Students
ORDER BY Marks;
```

**Example 2 — Descending order**

```sql
SELECT FirstName, Marks
FROM dbo.Students
ORDER BY Marks DESC;
```

**Example 3 — Multiple columns**

```sql
SELECT FirstName, LastName, Marks
FROM dbo.Students
ORDER BY Marks DESC, LastName ASC;
```

### Notes

* You can use column aliases in ORDER BY.
* SQL Server does not guarantee row order without ORDER BY.

---

## 5.4 DISTINCT — Removing Duplicates

### Purpose

Removes duplicate rows.

### Syntax

```sql
SELECT DISTINCT column1
FROM table_name;
```

### Example

```sql
SELECT DISTINCT DeptID
FROM dbo.Students;
```

### Note

`DISTINCT` applies to the entire row.

---

## 5.5 Aggregation Functions

SQL Server provides these aggregate functions:

| Function | Description   |
| -------- | ------------- |
| COUNT()  | Count rows    |
| SUM()    | Total sum     |
| AVG()    | Average value |
| MIN()    | Minimum value |
| MAX()    | Maximum value |

### Examples

```sql
SELECT COUNT(*) AS TotalStudents FROM dbo.Students;
SELECT AVG(Marks) AS AverageMarks FROM dbo.Students;
SELECT SUM(Salary) AS TotalSalary FROM dbo.Employees;
```

---

## 5.6 Grouping — GROUP BY

### Purpose

Groups rows for summarization.

### Syntax

```sql
SELECT column1, AGG(column2)
FROM table_name
GROUP BY column1;
```

### Examples

**Example 1 — Count students per department**

```sql
SELECT DeptID, COUNT(*) AS StudentCount
FROM dbo.Students
GROUP BY DeptID;
```

**Example 2 — Avg marks per department**

```sql
SELECT DeptID, AVG(Marks) AS AvgMarks
FROM dbo.Students
GROUP BY DeptID;
```

**Example 3 — Multiple grouping**

```sql
SELECT DeptID, Gender, COUNT(*) AS StudentCount
FROM dbo.Students
GROUP BY DeptID, Gender;
```

### Key Rules

* Every non-aggregated column must be in GROUP BY.
* WHERE filters before grouping.

---

## 5.7 Filtering Groups — HAVING Clause

### Purpose

Filters groups after aggregation.

### Syntax

```sql
SELECT column1, AGG(column2)
FROM table_name
GROUP BY column1
HAVING condition;
```

### Examples

**Example 1 — Departments with more than 3 students**

```sql
SELECT DeptID, COUNT(*) AS TotalStudents
FROM dbo.Students
GROUP BY DeptID
HAVING COUNT(*) > 3;
```

**Example 2 — Departments with avg marks > 70**

```sql
SELECT DeptID, AVG(Marks) AS AvgMarks
FROM dbo.Students
GROUP BY DeptID
HAVING AVG(Marks) > 70;
```

### WHERE vs HAVING

| Clause | Filters | Aggregate Use? |
| ------ | ------- | -------------- |
| WHERE  | Rows    | No             |
| HAVING | Groups  | Yes            |

---

## 5.8 Advanced Grouping — ROLLUP, CUBE, GROUPING SETS

### A. ROLLUP

Generates subtotals and grand totals.

```sql
SELECT DeptID, Gender, COUNT(*) AS StudentCount
FROM dbo.Students
GROUP BY ROLLUP(DeptID, Gender);
```

### B. CUBE

Generates all possible grouping combinations.

```sql
SELECT DeptID, Gender, COUNT(*)
FROM dbo.Students
GROUP BY CUBE(DeptID, Gender);
```

### C. GROUPING SETS

Custom grouping combinations.

```sql
SELECT DeptID, Gender, COUNT(*)
FROM dbo.Students
GROUP BY GROUPING SETS (
    (DeptID, Gender),
    (DeptID),
    ()
);
```

### D. Identify Summary Rows

```sql
SELECT DeptID, Gender, COUNT(*) AS Count,
       GROUPING(DeptID) AS IsDeptTotal,
       GROUPING(Gender) AS IsGenderTotal
FROM dbo.Students
GROUP BY ROLLUP(DeptID, Gender);
```

---

## 5.9 Practical Examples

### Example 1 — Salary summary per department

```sql
SELECT DeptID, SUM(Salary), AVG(Salary)
FROM dbo.Employees
GROUP BY DeptID;
```

### Example 2 — ROLLUP totals

```sql
SELECT DeptID, Gender, COUNT(*)
FROM dbo.Students
GROUP BY ROLLUP(DeptID, Gender);
```

### Example 3 — Departments with avg marks > 80

```sql
SELECT DeptID, AVG(Marks)
FROM dbo.Students
GROUP BY DeptID
HAVING AVG(Marks) > 80;
```

---

## 5.10 Practice Questions

1. Display all unique department IDs.
2. List students scoring between 70 and 90.
3. Find total students per department.
4. Find departments with more than 5 students.
5. Get total + subtotals using ROLLUP for DeptID & Gender.
6. Use GROUPING() to label summary rows.

---

## 5.11 Summary

| Concept                       | Purpose                        |
| ----------------------------- | ------------------------------ |
| WHERE                         | Filters rows before grouping   |
| ORDER BY                      | Sorts result set               |
| DISTINCT                      | Removes duplicates             |
| Aggregates                    | SUM, AVG, COUNT, etc.          |
| GROUP BY                      | Group rows for summary         |
| HAVING                        | Filters groups                 |
| ROLLUP / CUBE / GROUPING SETS | Multi-level summary aggregates |

---

## 5.12 Next Chapter Preview

Next: **Chapter 6 — Joins and Set Operators**

You’ll learn:

* INNER, LEFT, RIGHT, FULL, CROSS, SELF joins
* APPLY (CROSS/OUTER)
* Set operators: UNION, INTERSECT, EXCEPT
