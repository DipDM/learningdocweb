---
sidebar_position: 12
title: Constraints, Defaults & Data Integrity
description: Master SQL Server constraints including PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT, and CASCADE operations for data integrity
keywords: [SQL Server, constraints, primary key, foreign key, unique, check, default, cascade, data integrity, database]
---

# Chapter 12: Constraints, Defaults & Data Integrity

> **Topics Covered:** PRIMARY, FOREIGN, UNIQUE, CHECK, DEFAULT, NOT NULL, CASCADE

---

## 12.1 Introduction

Constraints ensure your data remains valid, consistent, and reliable according to business rules.

Even if your application fails to validate something, constraints inside SQL Server will protect your data.

:::tip Interview Definition — Constraint
A constraint is a rule applied on a table column to maintain data integrity and prevent invalid data from being inserted, updated, or deleted.
:::

---

## 12.2 Types of Constraints

| Constraint | Purpose |
|------------|---------|
| **PRIMARY KEY** | Uniquely identifies each row |
| **FOREIGN KEY** | Ensures referential integrity between tables |
| **UNIQUE** | No duplicate values allowed |
| **CHECK** | Restricts values using logical conditions |
| **DEFAULT** | Sets default value when none is provided |
| **NOT NULL** | Ensures a value must be provided |

---

## 12.3 Primary Key (PK)

### Definition

A primary key uniquely identifies a row and automatically creates a unique index (clustered by default).

### Rules

- Cannot contain `NULL`
- Must be unique
- Only one primary key per table
- Can be composite (multiple columns)

### Example 1 — Single-column PK

```sql
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    Name NVARCHAR(100)
);
```

### Example 2 — Composite PK

```sql
CREATE TABLE Orders (
    OrderID INT,
    ProductID INT,
    Quantity INT,
    PRIMARY KEY (OrderID, ProductID)
);
```

---

## 12.4 Foreign Key (FK)

### Definition

A foreign key enforces a relationship between two tables, ensuring values in the child table must exist in the parent table.

### Example

```sql
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName NVARCHAR(50)
);

CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    EmpName NVARCHAR(100),
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
);
```

---

## 12.5 CASCADE Options (VERY IMPORTANT)

| Cascade Type | Meaning |
|--------------|---------|
| **ON DELETE CASCADE** | Deletes child rows when parent is deleted |
| **ON UPDATE CASCADE** | Updates child rows if parent key changes |
| **SET NULL** | Sets child FK to NULL |
| **NO ACTION** | Default — prevent delete/update if child exists |

### Example

```sql
FOREIGN KEY (DeptID)
REFERENCES Departments(DeptID)
ON DELETE CASCADE
ON UPDATE CASCADE;
```

### When to Use Cascades

- Hierarchical data
- Parent-child dependent records
- Cleanup scenarios

### When NOT to Use

- When deleting parent should not wipe out children
- Financial or audit data

---

## 12.6 UNIQUE Constraint

### Definition

Ensures all values in a column (or combination) are unique.

### Example

```sql
CREATE TABLE Users (
   UserID INT PRIMARY KEY,
   Email NVARCHAR(100) UNIQUE
);
```

:::note
Allows only one `NULL` value in SQL Server.
:::

### Composite UNIQUE

```sql
ALTER TABLE Users
ADD CONSTRAINT UQ_User_Contact UNIQUE (Email, PhoneNumber);
```

---

## 12.7 CHECK Constraint

### Definition

CHECK enforces a condition on values allowed in a column.

### Examples

#### Example 1 — Simple Check

```sql
CHECK (Age >= 18)
```

#### Example 2 — Multiple Conditions

```sql
CHECK (Salary BETWEEN 20000 AND 200000)
```

#### Example 3 — Condition with OR

```sql
CHECK (Gender IN ('M','F','O'))
```

#### Example 4 — Check Two Columns

```sql
CHECK (StartDate <= EndDate)
```

### Adding a CHECK Later

```sql
ALTER TABLE Employees
ADD CONSTRAINT CK_Salary CHECK (Salary > 0);
```

---

## 12.8 DEFAULT Constraint

### Definition

Sets a default value when no value is provided.

### Example 1

```sql
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderDate DATETIME DEFAULT GETDATE()
);
```

### Example 2 — Add Default Later

```sql
ALTER TABLE Orders
ADD CONSTRAINT DF_OrderDate DEFAULT GETDATE() FOR OrderDate;
```

---

## 12.9 NOT NULL Constraint

### Definition

Ensures that a column cannot contain NULL values.

### Example

```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    Price DECIMAL(10,2) NOT NULL
);
```

### Convert NULL Column to NOT NULL

```sql
ALTER TABLE Products
ALTER COLUMN Price DECIMAL(10,2) NOT NULL;
```

---

## 12.10 How Constraints Protect Data

### Scenario 1 — Prevent Invalid Age

```sql
Age CHECK >= 18
```

User cannot insert age 15.

### Scenario 2 — Prevent Orphan Records

`FOREIGN KEY` prevents adding Employee with invalid DeptID.

### Scenario 3 — Default Values Fill Missing Data

OrderDate automatically gets today's date.

### Scenario 4 — Prevent Duplicates

`UNIQUE` on Email ensures no duplicate emails.

---

## 12.11 System Views for Constraints

### Check Constraints

```sql
SELECT * FROM sys.check_constraints;
```

### Foreign Keys

```sql
SELECT * FROM sys.foreign_keys;
```

### Default Constraints

```sql
SELECT * FROM sys.default_constraints;
```

---

## 12.12 Interview Questions (Strong Answers)

### Q1: Primary Key vs Unique Key?

| Primary Key | Unique Key |
|-------------|------------|
| Only one allowed per table | Multiple allowed |
| Cannot contain NULL | Can contain one NULL |
| Clustered index by default | Non-clustered by default |

### Q2: What is referential integrity?

Referential integrity ensures that a child record must have a valid parent record, enforced by a Foreign Key.

### Q3: When do you use CHECK vs Foreign Key?

- **CHECK** validates column values based on logic
- **FK** validates values based on another table

### Q4: What is ON DELETE CASCADE?

Automatically deletes child rows when parent is deleted.

### Q5: Can FOREIGN KEY reference UNIQUE column?

Yes — FK can reference PK or UNIQUE key.

### Q6: Can CHECK reference another table?

No — only column values of same row.

### Q7: What is difference between DEFAULT and NOT NULL?

- **DEFAULT** inserts a value when missing
- **NOT NULL** requires value to exist

---

## 12.13 Practice Questions

1. Create `Authors` and `Books` tables with FK and `ON DELETE CASCADE`
2. Add `UNIQUE` constraint on `Email` in `Users` table
3. Add `CHECK` constraint ensuring `Salary > 0`
4. Add `DEFAULT` value for `CreatedDate`
5. Enforce `NOT NULL` on `PhoneNumber` column

---

## 12.14 Summary

| Constraint | Purpose |
|------------|---------|
| **PRIMARY KEY** | Unique row identifier |
| **FOREIGN KEY** | Parent-child relationship; referential integrity |
| **UNIQUE** | No duplicates |
| **CHECK** | Restrict allowed values |
| **DEFAULT** | Auto-assign value |
| **NOT NULL** | Ensure value exists |
| **CASCADE** | Auto-update/delete dependent records |

---

## 12.15 Next Chapter Preview

**Next: Chapter 13 — Stored Procedures, Functions & Triggers**

We will cover:

- Stored Procedures (Input, Output params)
- Scalar & Table-Valued Functions
- Triggers (AFTER/INSTEAD OF)
- Execution contexts
- Interview-heavy questions
