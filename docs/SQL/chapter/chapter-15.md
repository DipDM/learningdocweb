---
sidebar_position: 15
title: Dynamic SQL, Parameterization & Security
description: Master SQL Server dynamic SQL with sp_executesql, prevent SQL injection, and learn safe parameterization techniques
keywords: [SQL Server, dynamic SQL, sp_executesql, SQL injection, parameterization, QUOTENAME, security, EXEC]
---

# Chapter 15: Dynamic SQL, Parameterization & Security Considerations

> **Topics Covered:** EXEC(), sp_executesql, SQL Injection, safe patterns, performance, best practices

---

## 15.1 Introduction

Dynamic SQL is required when:

- Table or column names are dynamic
- WHERE conditions are dynamic
- Filters come from user input
- Pagination logic changes
- Search screens need flexible filters
- Building complex reports
- Multi-tenant or configurable databases

Dynamic SQL is extremely common in enterprise applications.

:::tip Interview Definition — Dynamic SQL
Dynamic SQL is SQL code that is built and executed at runtime instead of being written statically inside the query or stored procedure.
:::

### Two Ways to Execute Dynamic SQL

1. `EXEC()`
2. `sp_executesql` (recommended)

---

## 15.2 EXEC() — Simple Dynamic SQL

### Syntax

```sql
DECLARE @sql NVARCHAR(MAX);
SET @sql = 'SELECT * FROM Employees';
EXEC(@sql);
```

This is the simplest but least secure method.

### Drawbacks of EXEC()

- Vulnerable to SQL injection
- No parameterization
- Poor plan caching
- Hard to debug

:::danger
Because of this, `EXEC()` is rarely used in production systems.
:::

---

## 15.3 sp_executesql — SAFE DYNAMIC SQL (Recommended)

This is the best, safest, and most optimized method.

### Syntax

```sql
sp_executesql 
    @SQL,
    @ParameterDefinitions,
    @Param1 = value1,
    @Param2 = value2
```

### Example — With Parameters

```sql
DECLARE 
    @sql NVARCHAR(MAX),
    @DeptID INT;

SET @DeptID = 2;

SET @sql = N'SELECT EmpID, EmpName FROM Employees WHERE DeptID = @d';

EXEC sp_executesql 
    @sql,
    N'@d INT',
    @d = @DeptID;
```

### Benefits of sp_executesql

- **SQL Injection Safe**
- **Reuses execution plans**
- **Supports parameters**
- Works well with .NET parameterized queries

:::tip
This is the method used in all enterprise apps.
:::

---

## 15.4 Dynamic WHERE Conditions (Very Common)

Suppose filters are optional:

- Name
- Department
- Minimum Salary

### Correct Pattern

```sql
DECLARE @sql NVARCHAR(MAX) = 'SELECT * FROM Employees WHERE 1=1';

IF @Name IS NOT NULL
    SET @sql += ' AND EmpName LIKE @n';

IF @DeptID IS NOT NULL
    SET @sql += ' AND DeptID = @d';

IF @MinSalary IS NOT NULL
    SET @sql += ' AND Salary >= @s';

EXEC sp_executesql 
    @sql,
    N'@n VARCHAR(50), @d INT, @s INT',
    @n = @Name,
    @d = @DeptID,
    @s = @MinSalary;
```

---

## 15.5 Dynamic ORDER BY (Another Common Requirement)

### Example

```sql
DECLARE @sql NVARCHAR(MAX);
DECLARE @col VARCHAR(50) = 'Salary';

SET @sql = 'SELECT * FROM Employees ORDER BY ' + QUOTENAME(@col);

EXEC(@sql);
```

:::info
`QUOTENAME()` protects from injection.
:::

---

## 15.6 Dynamic Table Name — Use QUOTENAME()

### NEVER DO THIS

```sql
SET @sql = 'SELECT * FROM ' + @Table;  -- Dangerous!
```

### SAFE

```sql
SET @sql = 'SELECT * FROM ' + QUOTENAME(@Table);
```

:::tip
`QUOTENAME()` prevents injection by wrapping with `[]`.
:::

---

## 15.7 SQL Injection (Most Important Security Topic)

### Definition

SQL Injection is a security vulnerability where attackers modify dynamic SQL queries to run malicious code.

### Example Attack

```sql
'; DROP TABLE Users; --
```

### Bad Dynamic SQL

```sql
SET @sql = 'SELECT * FROM Users WHERE UserName = ''' + @UserName + '''';
EXEC(@sql);
```

:::danger
Dangerous because attacker can inject code.
:::

---

## 15.8 How to Prevent SQL Injection

### 1. Always Use sp_executesql with Parameters

```sql
EXEC sp_executesql N'SELECT * FROM Users WHERE UserName = @u',
                   N'@u VARCHAR(50)',
                   @u = @UserName;
```

### 2. Use QUOTENAME() for Table/Column Names

```sql
SET @sql = 'SELECT * FROM ' + QUOTENAME(@TableName);
```

### 3. Never Build SQL by String Concatenation

### 4. Validate Inputs

- Allow only expected characters
- Allow only expected values for ORDER BY

### 5. Use Stored Procedures + Parameterization

Instead of inline SQL.

---

## 15.9 Parameter Sniffing & Dynamic SQL

Dynamic SQL can sometimes fix parameter sniffing issues because:

- Plans are not reused
- SQL is compiled fresh each time

But excessive dynamic SQL can cause:

- CPU overhead
- More recompilations

:::note
Balance is required.
:::

---

## 15.10 Performance Considerations

### 1. sp_executesql Supports Plan Cache Reuse

Better performance.

### 2. EXEC() Generates a New Plan Each Time

Slower.

### 3. Dynamic SQL Can Become Sargable

When optional filters are ignored.

### 4. Use NVARCHAR Over VARCHAR

Always preferred in SQL Server.

---

## 15.11 Dynamic INSERT / UPDATE / DELETE

### Dynamic INSERT

```sql
SET @sql = 'INSERT INTO ' + QUOTENAME(@Table) + '(Name, Age)
            VALUES (@n, @a)';

EXEC sp_executesql 
    @sql,
    N'@n VARCHAR(50), @a INT',
    @n = @Name,
    @a = @Age;
```

---

## 15.12 Full Stored Procedure Example

Most common enterprise pattern:

```sql
CREATE PROCEDURE SearchEmployeesDynamic
    @Name NVARCHAR(50) = NULL,
    @DeptID INT = NULL,
    @MinSalary INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @sql NVARCHAR(MAX) = 'SELECT EmpID, EmpName, Salary FROM Employees WHERE 1=1';

    IF @Name IS NOT NULL
        SET @sql += ' AND EmpName LIKE @Name';

    IF @DeptID IS NOT NULL
        SET @sql += ' AND DeptID = @DeptID';

    IF @MinSalary IS NOT NULL
        SET @sql += ' AND Salary >= @MinSalary';

    EXEC sp_executesql 
        @sql,
        N'@Name NVARCHAR(50), @DeptID INT, @MinSalary INT',
        @Name = @Name,
        @DeptID = @DeptID,
        @MinSalary = @MinSalary;
END;
```

---

## 15.13 Interview Questions (Strong Answers)

### Q1: What is dynamic SQL?

Dynamic SQL is SQL code generated and executed at runtime instead of being hard-coded.

### Q2: Difference between EXEC and sp_executesql?

| Feature | EXEC | sp_executesql |
|---------|------|---------------|
| **Parameters** | No | Yes |
| **Injection Safe** | No | Yes |
| **Plan Cache** | Poor | Good |
| **Recommended?** | No | YES |

### Q3: How do you prevent SQL injection?

- Use `sp_executesql`
- Parameterize values
- Use `QUOTENAME()` for identifiers
- Validate user inputs

### Q4: Why use QUOTENAME()?

To safely inject table/column names without risk of injection.

### Q5: When do we need dynamic SQL?

- Dynamic filters
- Dynamic ordering
- Dynamic table/column names
- Building flexible search pages

### Q6: What is parameter sniffing and how does dynamic SQL help?

Parameter sniffing occurs when SQL Server caches a plan for one parameter and reuses it for others. Dynamic SQL can bypass cached plan reuse.

---

## 15.14 Summary

| Topic | Meaning |
|-------|---------|
| **Dynamic SQL** | Build SQL at runtime |
| **EXEC()** | Simple but unsafe |
| **sp_executesql** | Safe, parameterized, cached |
| **SQL Injection** | Serious security threat |
| **QUOTENAME** | Protects identifiers |
| **Dynamic conditions** | Essential for search screens |
| **Best Practice** | Always parameterize |

---

## 15.15 Next Chapter Preview

**Next: Chapter 16 — Working with JSON & XML in SQL Server**

We will cover:

- FOR JSON
- OPENJSON
- JSON_VALUE / JSON_QUERY
- XML nodes, value(), exist()
- Use cases for APIs and modern apps
