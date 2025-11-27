#  1. Introduction & Getting Started

Below are the individual markdown files prepared for **Chapter 1**. Each section is ready to be saved as a separate `.md` file under `docs/content/SQL/01-introduction/`.

Use the file markers to copy each section into the corresponding file in your repo.

---

<!-- FILE: docs/content/SQL/01-introduction/README.md -->

## Chapter 1 — Introduction & Getting Started

Welcome to Chapter 1. This chapter builds the foundation for SQL Server usage and basic querying.

### What this chapter covers

* What SQL Server is and typical editions
* Tools: SSMS, sqlcmd, Azure Data Studio
* How to connect to an instance
* Basic database/object model
* First queries
* Understanding errors
* Running scripts

### Learning objectives

After this chapter you will be able to:

* Explain SQL Server object hierarchy
* Connect to an instance and create a database
* Write basic `SELECT` statements
* Understand SSMS result panes
* Debug common errors


<!-- FILE: docs/content/SQL/01-introduction/1.1-overview.md -->

## 1.1 Quick conceptual overview

SQL Server is a relational database management system (RDBMS) from Microsoft.

**Key concepts**

* **Instance** — A running SQL Server engine process. One machine can host multiple instances.
* **Database** — Logical container for data; typically has data files (`.mdf`) and log files (`.ldf`).
* **Schema** — Namespace inside a database (e.g., `dbo`, `sales`). Objects are referenced as `schema.object`.
* **Common object types** — tables, views, stored procedures, functions, triggers, indexes.

Short notes:

* Instances host databases; databases host schemas; schemas host objects.

---

<!-- FILE: docs/content/SQL/01-introduction/1.2-tools.md -->

## 1.2 Tools (short)

#### SQL Server Management Studio (SSMS)

* Classic Windows GUI for managing SQL Server.
* Object Explorer, Query Editor, Execution Plan, Management tools.

#### Azure Data Studio

* Cross-platform editor with notebooks and modern UI.
* Good for cross-platform workflows and lightweight editing.

#### sqlcmd

* Command-line client for executing ad-hoc or scripted SQL commands (Windows / Linux).

When to use:

* Use SSMS for deep administrative tasks and execution plans.
* Use Azure Data Studio for cross-platform development and notebooks.
* Use `sqlcmd` for automation and CI pipelines.

---

<!-- FILE: docs/content/SQL/01-introduction/1.3-create-database.md -->

## 1.3 Create a database (example)

```sql
-- Create a new database named LearningDB
CREATE DATABASE LearningDB;
GO

-- Switch context to the database
USE LearningDB;
GO
```

**Explanation**: `CREATE DATABASE` provisions data and log files. `USE` changes the current database context for the session.

Tip: In scripts run in SSMS, `GO` is a batch separator understood by the client (SSMS/Azure Data Studio), not a T-SQL command.

---

<!-- FILE: docs/content/SQL/01-introduction/1.4-create-table.md -->

## 1.4 Create a table & insert rows

```sql
-- create a simple table to experiment
CREATE TABLE dbo.Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName  NVARCHAR(50) NOT NULL,
    LastName   NVARCHAR(50) NOT NULL,
    HireDate   DATE NULL,
    Salary     DECIMAL(10,2) NULL
);
GO

-- insert sample data
INSERT INTO dbo.Employees (FirstName, LastName, HireDate, Salary)
VALUES
 ('Asha', 'Patil',  '2020-03-15', 45000.00),
 ('Vikram', 'Kumar', '2018-11-01', 60000.00),
 ('Rita', 'Shah',    '2021-06-20', 38000.50);
GO
```

**Notes**:

* `IDENTITY(1,1)` creates an auto-increment column starting at 1.
* `PRIMARY KEY` creates a unique constraint and a clustered index by default (unless changed).

---

<!-- FILE: docs/content/SQL/01-introduction/1.5-select.md -->

## 1.5 Basic SELECT queries

#### Example 1 — select all columns

```sql
SELECT *
FROM dbo.Employees;
```

> Use `*` sparingly in production; explicit columns are preferred.

#### Example 2 — select specific columns

```sql
SELECT EmployeeID, FirstName, LastName, Salary
FROM dbo.Employees;
```

#### Example 3 — expression & alias

```sql
SELECT FirstName + ' ' + LastName AS FullName,
       Salary,
       Salary * 12 AS AnnualSalary
FROM dbo.Employees;
```

#### Example 4 — literal and computed column

```sql
SELECT 'Company: ABC Pvt Ltd' AS Company,
       GETDATE() AS RetrievedAt
FROM dbo.Employees;
```

**Notes**:

* `+` concatenates strings for `NVARCHAR` types.
* `AS` creates a column alias.

---

<!-- FILE: docs/content/SQL/01-introduction/1.6-filtering.md -->

## 1.6 Filtering rows (WHERE)

```sql
SELECT EmployeeID, FirstName, LastName, Salary
FROM dbo.Employees
WHERE Salary > 40000;
```

**Explanation**: `WHERE` filters rows using comparison operators (`=`, `<`, `>`, `<=`, `>=`, `<>`) and logical operators (`AND`, `OR`, `NOT`).

---

<!-- FILE: docs/content/SQL/01-introduction/1.7-orderby.md -->

## 1.7 Sorting (ORDER BY)

```sql
SELECT EmployeeID, FirstName, LastName, Salary
FROM dbo.Employees
ORDER BY Salary DESC, LastName ASC;
```

**Note**: Result sets are unordered unless an `ORDER BY` is specified.

---

<!-- FILE: docs/content/SQL/01-introduction/1.8-top.md -->

## 1.8 Limiting rows (TOP)

```sql
-- top 2 highest salaries:
SELECT TOP (2) EmployeeID, FirstName, LastName, Salary
FROM dbo.Employees
ORDER BY Salary DESC;
```

**Note**: `TOP (n)` returns the first `n` rows of the ordered result. For pagination use `OFFSET ... FETCH` (covered later).

---

<!-- FILE: docs/content/SQL/01-introduction/1.9-ssms-panes.md -->

## 1.9 Understanding result panes and messages (SSMS)

* **Results grid**: tabular view of query output.
* **Messages**: shows row counts, warnings, errors.
* **Execution plan**: visualizes how SQL Server executed the query (important for tuning).

**Common error example**:

```
Msg 208, Level 16, State 1, Line 1
Invalid object name 'dbo.Employees'
```

Meaning: object not found in the current database or schema — check `USE` and spelling.

---

<!-- FILE: docs/content/SQL/01-introduction/1.10-debugging.md -->

## 1.10 Basic mistakes and debugging tips

* **Wrong database context** → run:

```sql
SELECT DB_NAME();
```

* **Missing GO** in scripts may cause dependency order issues in SSMS.
* **Case sensitivity** depends on database collation; most installs are case-insensitive.

Quick tips:

* Confirm you are in the intended database.
* Use fully-qualified names: `Database.Schema.Object` when troubleshooting cross-db issues.

---

<!-- FILE: docs/content/SQL/01-introduction/1.11-exercises.md -->

## 1.11 Exercises (practice)

1. **Create PracticeDB and Customers table**

   * Create a database `PracticeDB` and a table `Customers` with columns:

     * `CustomerID INT IDENTITY PK`
     * `Name NVARCHAR(100)`
     * `Email NVARCHAR(255)`
     * `CreatedAt DATETIME DEFAULT GETDATE()`
   * Insert 4 rows and select them.

2. **FullName & AnnualSalary**

   * Write a query to show `FullName` and `AnnualSalary` for employees with `Salary < 50000`, ordered by `HireDate` DESC.

3. **NULL HireDate**

   * Insert a row with `NULL` `HireDate` and write a query to select rows where `HireDate IS NULL`.

---

<!-- FILE: docs/content/SQL/01-introduction/1.12-solutions.md -->

## 1.12 Solutions (brief)

#### Solution — Create DB & Table

```sql
CREATE DATABASE PracticeDB;
GO
USE PracticeDB;
GO

CREATE TABLE dbo.Customers (
  CustomerID INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Email NVARCHAR(255) NULL,
  CreatedAt DATETIME NOT NULL DEFAULT (GETDATE())
);
GO

INSERT INTO dbo.Customers (Name, Email) VALUES
('Rahul Desai','rahul@example.com'),
('Meera Joshi','meera@example.com'),
('Sonal Rao','sonal@example.com'),
('Kumar Singh','kumar@example.com');

SELECT * FROM dbo.Customers;
```

#### Solution — FullName & AnnualSalary

```sql
SELECT FirstName + ' ' + LastName AS FullName,
       Salary,
       Salary * 12 AS AnnualSalary,
       HireDate
FROM dbo.Employees
WHERE Salary < 50000
ORDER BY HireDate DESC;
```

#### Solution — NULL example

```sql
INSERT INTO dbo.Employees (FirstName, LastName, HireDate, Salary)
VALUES ('Test', 'User', NULL, 30000);

SELECT * FROM dbo.Employees WHERE HireDate IS NULL;
```

---

<!-- FILE: docs/content/SQL/01-introduction/1.13-next-steps.md -->

## 1.13 Recommended next steps

* Practice creating databases and tables.
* Explore SSMS panes: Object Explorer, Query Editor, Results, Messages, Execution Plan.
* When comfortable, move to **Chapter 2 — Data Types & NULLs** to study types, storage, and NULL behavior in detail.

---

## How to use

1. Create folder: `docs/content/SQL/01-introduction/` in your repo.
2. Create each file named above and paste corresponding section content (the canvas shows each file block).
3. Restart `npm run docs:dev` and visit `/content/SQL/01-introduction/` to see the chapter index and navigate the sub-pages.

If you want, I can also:

* generate the corresponding `sidebar` entries for `config.js` (I can paste the array),
* or create the files directly in a zip for download.

Tell me which next step you want.
