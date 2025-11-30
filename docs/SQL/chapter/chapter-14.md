---
sidebar_position: 14
title: Error Handling & T-SQL Best Practices
description: Master SQL Server error handling with TRY/CATCH, THROW, transactions, and learn enterprise-grade T-SQL best practices
keywords: [SQL Server, error handling, TRY CATCH, THROW, RAISERROR, T-SQL best practices, transactions, XACT_STATE, database optimization]
---

# Chapter 14: Error Handling, TRY/CATCH, and T-SQL Best Practices

> **Topics Covered:** Clean T-SQL, Modern error handling, robust transactions, logging, and interview-ready explanations

---

## 14.1 Introduction

Errors in SQL Server happen due to:

- Constraint violations
- Invalid data
- Type conversions
- Deadlocks
- Network failures
- Logic errors

To keep data safe, consistent, and recoverable, SQL Server provides structured error handling using:

- TRY/CATCH
- THROW
- RAISERROR (legacy)
- XACT_STATE()
- Logging patterns
- Proper T-SQL best practices

:::note
This chapter makes you ready for real-world backend systems + interviews.
:::

---

## 14.2 Error Handling Basics

SQL Server errors occur at runtime and if not handled, can break transactions or leave data partially updated.

:::tip Interview Definition — TRY/CATCH
TRY/CATCH in SQL Server is a structured mechanism for detecting runtime errors and executing custom logic (rollback, logging, etc.) in the CATCH block.
:::

---

## 14.3 TRY / CATCH Structure

### Syntax

```sql
BEGIN TRY
    -- Code that may fail
END TRY
BEGIN CATCH
    -- Error handling code
END CATCH;
```

### Example

```sql
BEGIN TRY
    SELECT 10 / 0;  -- Generates divide by zero error
END TRY
BEGIN CATCH
    PRINT 'Error occurred!';
END CATCH;
```

---

## 14.4 Error Detail Functions

Inside a CATCH block, you can fetch detailed error information:

| Function | Meaning |
|----------|---------|
| `ERROR_NUMBER()` | Error code |
| `ERROR_MESSAGE()` | Full message |
| `ERROR_LINE()` | Line causing error |
| `ERROR_PROCEDURE()` | Stored procedure name |
| `ERROR_SEVERITY()` | Severity level |
| `ERROR_STATE()` | State |

### Example

```sql
BEGIN TRY
    SELECT 1 / 0;
END TRY
BEGIN CATCH
    SELECT 
        ERROR_NUMBER() AS ErrNum,
        ERROR_MESSAGE() AS ErrMsg,
        ERROR_LINE() AS ErrLine;
END CATCH;
```

---

## 14.5 Error Handling with Transactions

### Why Needed?

To prevent:

- Partial updates
- Data corruption
- Money transfer inconsistencies
- Broken operations

### Correct Pattern (Industry Standard)

```sql
BEGIN TRY
    BEGIN TRANSACTION;

    -- risky operations
    UPDATE Accounts SET Balance = Balance - 500 WHERE AccID = 1;
    UPDATE Accounts SET Balance = Balance + 500 WHERE AccID = 2;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    SELECT 
        ERROR_NUMBER() AS ErrNum,
        ERROR_MESSAGE() AS ErrMsg;
END CATCH;
```

---

## 14.6 XACT_STATE() — Transaction State Check

### Definition

`XACT_STATE()` returns whether the transaction is committable or uncommittable inside a CATCH block.

### Return Values

| Value | Meaning |
|-------|---------|
| **1** | Transaction active and committable |
| **0** | No active transaction |
| **-1** | Transaction active but uncommittable |

### Usage Pattern

```sql
BEGIN CATCH
    IF XACT_STATE() = -1
        ROLLBACK TRANSACTION;   -- Must rollback

    IF XACT_STATE() = 1
        COMMIT TRANSACTION;     -- Safe to commit

    THROW;  -- rethrow error
END CATCH;
```

:::info
This is used in high-availability, financial systems, and critical workloads.
:::

---

## 14.7 THROW vs RAISERROR

Both raise custom errors, but THROW is preferred.

### 14.7.1 THROW (Recommended)

#### Syntax

```sql
THROW 50001, 'Invalid Amount', 1;
```

#### Advantages

- Accurate line number
- Simpler syntax
- Fully supported in modern SQL Server

### 14.7.2 RAISERROR (Legacy)

#### Syntax

```sql
RAISERROR ('Error Msg', 16, 1);
```

### Differences

| THROW | RAISERROR |
|-------|-----------|
| Modern | Legacy |
| Accurate error line | Not always accurate |
| Simple | Supports formatting |
| Recommended | Deprecated in future |

### Re-throw Original Error

```sql
BEGIN CATCH
    THROW;
END CATCH;
```

---

## 14.8 Logging Errors to a Table

:::tip Best Practice
Always log errors for monitoring.
:::

### Create Error Log Table

```sql
CREATE TABLE ErrorLog (
    LogID INT IDENTITY PRIMARY KEY,
    ErrorNum INT,
    ErrorMsg NVARCHAR(4000),
    ErrorProcedure NVARCHAR(200),
    ErrorLine INT,
    ErrorTime DATETIME DEFAULT GETDATE()
);
```

### Insert Error in CATCH

```sql
INSERT INTO ErrorLog(ErrorNum, ErrorMsg, ErrorProcedure, ErrorLine)
VALUES (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE(), ERROR_LINE());
```

---

## 14.9 T-SQL Best Practices (Very Important for Interviews)

These best practices ensure:

- Faster performance
- Cleaner code
- More predictable behaviour
- Reduced bugs
- Better maintainability

### 14.9.1 Avoid SELECT *

Use explicit columns:

```sql
SELECT Name, Salary FROM Employees;
```

### 14.9.2 Always Use Schema Name (dbo)

```sql
SELECT * FROM dbo.Employees;
```

### 14.9.3 Avoid Non-Sargable Expressions

**Non-sargable:**

```sql
WHERE YEAR(OrderDate) = 2024;
```

**Sargable:**

```sql
WHERE OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01';
```

### 14.9.4 Use Proper Data Types

**Bad:**

```sql
Phone VARCHAR(500)
```

**Good:**

```sql
Phone VARCHAR(15)
```

### 14.9.5 Avoid Implicit Conversions

**Bad:**

```sql
WHERE EmpID = '101'
```

**Good:**

```sql
WHERE EmpID = 101
```

### 14.9.6 Use Stored Procedures Over Ad-Hoc SQL

**Benefits:**

- Prevents SQL injection
- Better plan caching
- Centralized logic

### 14.9.7 Avoid Cursors (use set-based logic)

- Cursor = slow
- Set-based operations = fast

### 14.9.8 Use TRY/CATCH with All Transactions

Always safe.

### 14.9.9 Keep Transactions Short

Long transactions → blocking & deadlocks.

### 14.9.10 Avoid OR in WHERE Clause

**Bad:**

```sql
WHERE Status = 'Active' OR Status = 'Pending'
```

**Good:**

```sql
WHERE Status IN ('Active','Pending')
```

### 14.9.11 Use INDEXes Correctly

- Index columns in WHERE
- Index join columns
- Avoid indexing low-selectivity columns (like Gender)

### 14.9.12 Avoid Triggers for Business Logic

Use triggers ONLY for:

- Audits
- Enforcing integrity
- Logging

### 14.9.13 Use SET NOCOUNT ON in SPs

Reduces unnecessary network traffic:

```sql
SET NOCOUNT ON;
```

---

## 14.10 Complete Real-World Pattern (ALL IN ONE)

Below is the recommended T-SQL pattern used in enterprise backends:

```sql
CREATE PROCEDURE TransferAmount
    @From INT,
    @To INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRAN;

        IF @Amount <= 0
            THROW 50020, 'Amount must be greater than zero', 1;

        UPDATE Accounts SET Balance = Balance - @Amount WHERE AccID = @From;
        UPDATE Accounts SET Balance = Balance + @Amount WHERE AccID = @To;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() = -1 
            ROLLBACK;
        ELSE IF XACT_STATE() = 1
            COMMIT;  -- very rare case

        INSERT INTO ErrorLog(ErrorNum, ErrorMsg, ErrorProcedure, ErrorLine)
        VALUES (ERROR_NUMBER(), ERROR_MESSAGE(), ERROR_PROCEDURE(), ERROR_LINE());

        THROW;  -- bubble error outward
    END CATCH
END;
```

:::tip
This pattern is considered enterprise-grade and appears in interviews often.
:::

---

## 14.11 Interview Questions (With Strong Answers)

### Q1: What is TRY/CATCH in SQL Server?

TRY/CATCH is structured error handling to trap runtime errors and handle them gracefully.

### Q2: What is THROW?

A modern way to raise errors with accurate line numbers.

### Q3: What is XACT_STATE()?

Used inside CATCH to know if a transaction can be committed or must be rolled back.

### Q4: RAISERROR vs THROW?

- **THROW** is modern, simpler, accurate
- **RAISERROR** is legacy and may be retired

### Q5: Why use SET NOCOUNT ON?

Improves performance by suppressing "X rows affected."

### Q6: Why avoid SELECT * ?

Reduces IO, improves covering indexes, increases performance.

### Q7: Why avoid non-sargable expressions?

They disable index usage → cause table scans.

### Q8: Why avoid table variables for large datasets?

They do not store statistics → poor execution plans.

### Q9: Why avoid triggers for business logic?

Triggers make flow unpredictable; use SPs instead.

---

## 14.12 Summary

| Concept | Summary |
|---------|---------|
| **TRY/CATCH** | Structured error handling |
| **THROW** | Modern error raising |
| **XACT_STATE** | Checks commit/rollback state |
| **Logging** | Insert errors to audit table |
| **Best Practices** | Performance + reliability |
| **Avoid** | SELECT *, cursors, non-sargable queries |
| **Use** | Proper data types, schema names, SET NOCOUNT ON |
