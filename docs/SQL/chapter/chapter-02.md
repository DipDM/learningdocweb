---
slug: /sql/chapter-02
title: 2. SQL Server Data Types and NULLs
description: Test page to verify fonts, code blocks, headings, sidebar, and layout.
sidebar_position: 3
---

# SQL Server Data Types and NULLs

## 2.1 Introduction

Every column in SQL Server has a data type that defines:

* What kind of data can be stored (text, numbers, dates, etc.)
* How much space it takes
* What operations you can perform on it (mathematical, string functions, etc.)

Understanding data types is critical for:

* Writing correct queries
* Preventing data loss or rounding errors
* Optimizing storage and performance

---

## 2.2 Classification of Data Types

SQL Server provides several categories of data types:

| Category            | Examples                                                              | Description                                                    |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| Exact Numeric       | INT, BIGINT, SMALLINT, TINYINT, DECIMAL, NUMERIC, MONEY, SMALLMONEY   | Used for integers or precise decimal values                    |
| Approximate Numeric | FLOAT, REAL                                                           | Used when precision is less important (scientific/engineering) |
| Character Strings   | CHAR, VARCHAR                                                         | For text data using ASCII                                      |
| Unicode Strings     | NCHAR, NVARCHAR, NTEXT                                                | For multilingual text (Unicode)                                |
| Date and Time       | DATE, TIME, DATETIME, SMALLDATETIME, DATETIME2, DATETIMEOFFSET        | For storing temporal values                                    |
| Binary Data         | BINARY, VARBINARY, IMAGE                                              | For images, files, or raw bytes                                |
| Other Types         | BIT, UNIQUEIDENTIFIER, XML, JSON, SQL_VARIANT, GEOGRAPHY, HIERARCHYID | Specialized use cases                                          |

---

## 2.3 Key Data Types Explained

### A. Exact Numeric

#### INT

* Range: -2,147,483,648 to 2,147,483,647
* Storage: 4 bytes
* Common for IDs, counts, small numerical values.

#### BIGINT

* Range: extremely large values
* Storage: 8 bytes

#### DECIMAL(p, s) or NUMERIC(p, s)

* Fixed precision and scale
* `p` = total digits, `s` = digits after decimal
* Example: `DECIMAL(10,2)` → max 10 digits, 2 after decimal

Example:

```sql
DECLARE @price DECIMAL(10,2) = 1234.56;
SELECT @price AS Price;
```

---

### B. Approximate Numeric

#### FLOAT(n) and REAL

* FLOAT → 8 bytes (precision ~15 digits)
* REAL → 4 bytes (precision ~7 digits)
* Used when approximate values are acceptable
* Avoid for financial calculations

---

### C. Character Data

#### CHAR(n)

* Fixed-length string
* Example: `CHAR(10)` → always 10 characters

#### VARCHAR(n)

* Variable-length string
* Example: `VARCHAR(50)` → uses only required storage

#### NCHAR(n) and NVARCHAR(n)

* Unicode versions of CHAR/VARCHAR
* Each character → 2 bytes
* Required for multilingual text

Example:

```sql
DECLARE @name NVARCHAR(50) = N'दीपेश मेंढे';
SELECT @name AS UnicodeExample;
```

---

### D. Date and Time Data Types

| Type           | Storage    | Range                       | Accuracy | Example                       |
| -------------- | ---------- | --------------------------- | -------- | ----------------------------- |
| DATE           | 3 bytes    | 0001–9999                   | 1 day    | '2025-11-06'                  |
| TIME(n)        | 3–5 bytes  | 00:00:00 → 23:59:59.9999999 | 100 ns   | '13:45:30'                    |
| DATETIME       | 8 bytes    | 1753–9999                   | 3.33 ms  | '2025-11-06 13:45:30'         |
| DATETIME2(n)   | 6–8 bytes  | 0001–9999                   | 100 ns   | '2025-11-06 13:45:30.1234567' |
| SMALLDATETIME  | 4 bytes    | 1900–2079                   | 1 min    | '2025-11-06 13:46'            |
| DATETIMEOFFSET | 8–10 bytes | includes timezone offset    | —        | '2025-11-06 13:45:30 +05:30'  |

Example:

```sql
DECLARE @today DATE = GETDATE();
DECLARE @now DATETIME2 = SYSDATETIME();
SELECT @today AS TodayDate, @now AS CurrentDateTime;
```

---

### E. BIT Type

Boolean-like values (0, 1, or NULL)

Example:

```sql
CREATE TABLE Products (
    ProductID INT,
    Name VARCHAR(50),
    IsAvailable BIT
);

INSERT INTO Products VALUES (1, 'Pen', 1), (2, 'Pencil', 0);
SELECT * FROM Products;
```

---

### F. UNIQUEIDENTIFIER

Globally unique identifier (GUID)

Example:

```sql
SELECT NEWID() AS RandomGUID;
```

---

## 2.4 NULLs in SQL Server

### Definition

NULL represents unknown, missing, or not applicable data — not zero or empty string.

### Key Points

* NULL ≠ 0
* NULL ≠ ''
* NULL ≠ NULL
* Must use `IS NULL` or `IS NOT NULL`

Example:

```sql
SELECT * FROM Employees WHERE HireDate IS NULL;
SELECT * FROM Employees WHERE HireDate IS NOT NULL;
```

### Behavior in Expressions

```sql
SELECT 5 + NULL AS Result;  -- returns NULL
```

### NULL Handling Functions

```sql
SELECT ISNULL(NULL, 'Unknown') AS Result;
SELECT COALESCE(NULL, NULL, 'FirstNonNull') AS Result;
SELECT NULLIF(10,10) AS Result;
```

---

## 2.5 Type Conversion

### Implicit Conversion

SQL Server converts compatible types automatically.

Example:

```sql
SELECT 10 + 10.5 AS Result;
```

### Explicit Conversion

```sql
SELECT CAST('2025-11-06' AS DATETIME) AS DateValue;
SELECT CONVERT(VARCHAR(10), GETDATE(), 103) AS DateFormatDDMMYYYY;
```

---

## 2.6 Practical Examples

```sql
SELECT FirstName, ISNULL(Salary, 0) AS Salary
FROM Employees;

SELECT FirstName, LastName
FROM Employees
WHERE HireDate IS NULL;

SELECT COALESCE(FirstName, '') + ' ' + COALESCE(LastName, '') AS FullName
FROM Employees;
```

---

## 2.7 Practice Questions

Create a table `Orders` with:

* OrderID INT (PK)
* OrderDate DATETIME
* CustomerName NVARCHAR(100)
* Amount DECIMAL(10,2)
* IsDelivered BIT

Then:

1. Insert at least 3 records (one with NULL Amount).
2. Display orders where Amount is NULL.
3. Replace NULL Amounts with 0 using ISNULL.
4. Demonstrate `NULL = NULL` vs `IS NULL`.
5. Show current system date/time using DATETIME & DATETIMEOFFSET.

---

## 2.8 Summary

| Concept         | Key Takeaway                                                  |
| --------------- | ------------------------------------------------------------- |
| Data types      | Define the nature, size, and behavior of stored data          |
| Numeric types   | Exact (INT, DECIMAL) vs Approximate (FLOAT)                   |
| Character types | CHAR/VARCHAR (ASCII), NCHAR/NVARCHAR (Unicode)                |
| Date/time types | Multiple variants for precision & storage                     |
| NULL            | Represents unknown/missing data; handled with ISNULL/COALESCE |
| Conversion      | Use CAST() and CONVERT() for explicit conversion              |

---

Next: **Chapter 3 — CREATE, ALTER, DROP (DDL Operations)**
