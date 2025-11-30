---
sidebar_position: 13
title: Stored Procedures, Functions & Triggers
description: Complete guide to SQL Server stored procedures, scalar and table-valued functions, views, and triggers with interview-level depth
keywords: [SQL Server, stored procedures, functions, triggers, views, scalar functions, table-valued functions, database programming]
---

# Chapter 13: Stored Procedures, Functions & Triggers

> **Topics Covered:** SPs, Scalar Functions, Table-Valued Functions, Views, Triggers — with interview-level depth

---

## 13.1 Introduction

SQL Server supports several programmable objects (database code):

- Stored Procedures
- Functions (Scalar & Table-Valued)
- Views
- Triggers

These objects help you:

- Reuse logic
- Improve performance
- Enforce business rules
- Control data access

:::tip Interview Definitions

**Stored Procedure:** A precompiled group of SQL statements stored in the database that can accept parameters and return results.

**Function:** A reusable database object that returns a value and cannot modify data (except for table-valued functions returning tables).

**Trigger:** A special type of stored procedure that automatically executes in response to INSERT, UPDATE, or DELETE operations.
:::

---

## 13.2 Stored Procedures (SPs)

### 13.2.1 Creating a Basic Stored Procedure

```sql
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT * FROM Employees;
END;
```

**Execute:**

```sql
EXEC GetAllEmployees;
```

### 13.2.2 SP with Input Parameters

```sql
CREATE PROCEDURE GetEmployeesByDept
    @DeptID INT
AS
BEGIN
    SELECT * FROM Employees WHERE DeptID = @DeptID;
END;
```

**Call:**

```sql
EXEC GetEmployeesByDept @DeptID = 2;
```

### 13.2.3 SP with Multiple Parameters

```sql
CREATE PROCEDURE SearchEmployees
    @Name NVARCHAR(50),
    @MinSalary DECIMAL(10,2)
AS
BEGIN
    SELECT *
    FROM Employees
    WHERE EmpName LIKE @Name + '%'
      AND Salary >= @MinSalary;
END;
```

### 13.2.4 SP with Output Parameter

```sql
CREATE PROCEDURE CountEmployees
    @DeptID INT,
    @Total INT OUTPUT
AS
BEGIN
    SELECT @Total = COUNT(*) 
    FROM Employees 
    WHERE DeptID = @DeptID;
END;
```

**Execute:**

```sql
DECLARE @Result INT;
EXEC CountEmployees 1, @Result OUTPUT;
SELECT @Result;
```

### 13.2.5 SP with RETURN Value

```sql
CREATE PROCEDURE CheckSalary
    @Salary DECIMAL(10,2)
AS
BEGIN
    IF @Salary > 50000 
        RETURN 1;
    RETURN 0;
END;
```

### 13.2.6 Advantages of Stored Procedures

- **Precompiled** → Faster execution
- **Security** (avoid SQL injection)
- **Code reuse**
- **Centralized logic**
- **Transaction support**

### 13.2.7 When NOT to Use SPs

- When logic must run on client-side
- When heavy business logic is needed (API level preferred)

---

## 13.3 Functions

SQL Server supports:

- Scalar Functions
- Inline Table-Valued Functions
- Multi-Statement Table-Valued Functions

### 13.3.1 SCALAR FUNCTION

#### Definition

Returns a single value.

#### Example — Return Bonus Based on Salary

```sql
CREATE FUNCTION GetBonus (@Salary DECIMAL(10,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @Salary * 0.10;
END;
```

**Usage:**

```sql
SELECT EmpName, Salary, dbo.GetBonus(Salary) AS Bonus
FROM Employees;
```

#### Limitations

- Cannot modify data
- Cannot use non-deterministic functions in some cases
- Sometimes cause performance issues (row-by-row execution)

### 13.3.2 INLINE TABLE-VALUED FUNCTION (iTVF)

#### Definition

Returns a table and behaves like a view with parameters. Fastest type of function.

#### Example

```sql
CREATE FUNCTION GetEmployeesByDept (@DeptID INT)
RETURNS TABLE
AS
RETURN (
    SELECT EmpID, EmpName, Salary
    FROM Employees
    WHERE DeptID = @DeptID
);
```

**Use:**

```sql
SELECT * FROM dbo.GetEmployeesByDept(1);
```

### 13.3.3 MULTI-STATEMENT TABLE-VALUED FUNCTION (mTVF)

#### Definition

Returns a table but built with multiple statements.

#### Example

```sql
CREATE FUNCTION TopEarners ()
RETURNS @tbl TABLE (EmpID INT, EmpName NVARCHAR(50), Salary INT)
AS
BEGIN
    INSERT INTO @tbl
    SELECT EmpID, EmpName, Salary 
    FROM Employees 
    WHERE Salary > 50000;

    RETURN;
END;
```

:::warning Note
Slower than inline TVFs because they use a table variable internally.
:::

---

## 13.4 Views

### 13.4.1 Definition

A View is a stored SELECT query that behaves like a virtual table.

### Example

```sql
CREATE VIEW vwEmployeeDetails
AS
SELECT E.EmpID, E.EmpName, D.DeptName
FROM Employees E
JOIN Departments D ON E.DeptID = D.DeptID;
```

**Use:**

```sql
SELECT * FROM vwEmployeeDetails;
```

### 13.4.2 Types of Views

- Simple View
- Complex View (joins, aggregations)
- Indexed View (Materialized)

### Why Use Views?

- **Security** (hide complex schema)
- **Simplify queries**
- **Centralize business logic**

---

## 13.5 Triggers

### 13.5.1 Definition

A Trigger is a special procedure that runs automatically when an event (INSERT/UPDATE/DELETE) happens on a table.

### Trigger Types

| Type | Description |
|------|-------------|
| **AFTER INSERT/UPDATE/DELETE** | Fires after the operation |
| **INSTEAD OF INSERT/UPDATE/DELETE** | Replaces normal operation |
| **DDL Triggers** | Fire on CREATE/ALTER/DROP |
| **Logon Triggers** | Fire at login time |

### 13.5.2 INSERT Trigger Example

```sql
CREATE TRIGGER trg_AfterInsert_Employees
ON Employees
AFTER INSERT
AS
BEGIN
    INSERT INTO EmployeeAudit(EmpID, ActionType, ActionDate)
    SELECT EmpID, 'INSERT', GETDATE()
    FROM inserted;
END;
```

### 13.5.3 UPDATE Trigger Example

```sql
CREATE TRIGGER trg_AfterUpdate_Employees
ON Employees
AFTER UPDATE
AS
BEGIN
    INSERT INTO EmployeeAudit(EmpID, ActionType, ActionDate)
    SELECT EmpID, 'UPDATE', GETDATE()
    FROM inserted;
END;
```

### inserted and deleted Tables

| Table | Description |
|-------|-------------|
| **inserted** | New values after insert/update |
| **deleted** | Old values before delete/update |

### 13.5.4 INSTEAD OF Trigger Example

Useful for preventing unwanted changes.

```sql
CREATE TRIGGER trg_PreventDeleteDept
ON Departments
INSTEAD OF DELETE
AS
BEGIN
    PRINT 'Deleting departments is not allowed!';
END;
```

---

## 13.6 Differences — MUST KNOW FOR INTERVIEWS

### 13.6.1 Stored Procedure vs Function

| Feature | Stored Procedure | Function |
|---------|-----------------|----------|
| **Returns** | 0 or more results | Must return single value or table |
| **Use in SELECT** | No | Yes |
| **Transaction support** | Yes | No (except mTVF internal ops) |
| **Can modify data** | Yes | No |
| **Error handling** | TRY/CATCH allowed | Not allowed |
| **Parameters** | Input & Output | Only input |

### 13.6.2 SP vs Trigger

| Stored Procedure | Trigger |
|-----------------|---------|
| Executed manually | Executes automatically |
| Controlled by user/app | Controlled by SQL Server event |
| Can accept parameters | Cannot accept parameters |

### 13.6.3 Inline TVF vs Multi-Statement TVF

| Inline TVF | Multi-Statement TVF |
|------------|---------------------|
| Faster | Slower |
| Optimizer-friendly | Uses table variable (less optimized) |
| Single SELECT | Can have multiple statements |

---

## 13.7 Best Practices

- Keep stored procedures small and focused
- Avoid scalar functions in SELECT (they slow down queries)
- Avoid triggers for business logic (prefer SP/API)
- Use inline TVF whenever possible
- Avoid multi-statement TVF unless necessary
- Use TRY/CATCH inside SPs for safety

---

## 13.8 Practice Questions

1. Write SP to return employees with salary > given value
2. Create scalar function to return full name
3. Create inline TVF to return employees by department
4. Write update trigger to track salary changes
5. Create view showing department-wise employee count

---

## 13.9 Summary

| Object | Purpose |
|--------|---------|
| **Stored Procedures** | Reusable logic with parameters |
| **Scalar Functions** | Returns a single value |
| **Inline TVF** | Returns table; fastest |
| **Multi-Statement TVF** | Complex logic; slower |
| **Views** | Virtual table; simplify queries |
| **Triggers** | Automatic execution on table events |

---

## 13.10 Next Chapter Preview

**Next: Chapter 14 — Error Handling & TRY/CATCH**

We will cover:

- TRY/CATCH
- THROW vs RAISERROR
- Error handling inside SPs
- Transactions with error logic
- Custom errors
