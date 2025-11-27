# Chapter 3 — DDL (CREATE, ALTER, DROP) and Constraints

## 3.1 Introduction

In SQL Server, **Data Definition Language (DDL)** statements define and modify database structures such as databases, tables, schemas, indexes, and constraints.

### Common DDL Commands

| Command      | Purpose                                                         |
| ------------ | --------------------------------------------------------------- |
| **CREATE**   | Creates a new database object (table, view, etc.)               |
| **ALTER**    | Modifies an existing object (add column, change datatype, etc.) |
| **DROP**     | Deletes an existing object                                      |
| **TRUNCATE** | Removes all data from a table but keeps its structure           |

> Note: TRUNCATE is technically DML but behaves like DDL due to minimal logging.

---

## 3.2 SQL Object Hierarchy

SQL Server objects follow this structure:

```
Instance
 └── Database
      └── Schema
           └── Table / View / Procedure / Function
```

* **Instance** → Running SQL Server engine
* **Database** → Collection of data
* **Schema** → Logical container (default: dbo)
* **Table** → Stores rows and columns

---

## 3.3 CREATE Command

### Syntax

```sql
CREATE TABLE [schema_name.]table_name (
    column_name data_type [NULL | NOT NULL]
        [CONSTRAINT constraint_name constraint_type],
    ...
);
```

### Example 1 — Create Students Table

```sql
CREATE TABLE dbo.Students (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NULL,
    Email NVARCHAR(100) UNIQUE,
    AdmissionDate DATETIME DEFAULT(GETDATE()),
    Marks DECIMAL(5,2) CHECK (Marks BETWEEN 0 AND 100)
);
```

### Explanation

* **IDENTITY(1,1)** → Auto-increment
* **PRIMARY KEY** → Unique row identifier
* **NOT NULL** → Mandatory value
* **UNIQUE** → Distinct values required
* **DEFAULT** → Assigns default value
* **CHECK** → Restricts allowed values

### Example 2 — Create Relationship (Foreign Key)

```sql
CREATE TABLE dbo.Departments (
    DeptID INT IDENTITY(1,1) PRIMARY KEY,
    DeptName NVARCHAR(50) NOT NULL
);

CREATE TABLE dbo.Employees (
    EmpID INT IDENTITY(1,1) PRIMARY KEY,
    EmpName NVARCHAR(100) NOT NULL,
    Salary DECIMAL(10,2),
    DeptID INT FOREIGN KEY REFERENCES dbo.Departments(DeptID)
);
```

---

## 3.4 Constraints in Detail

Constraints ensure data integrity.

| Constraint      | Purpose                              |
| --------------- | ------------------------------------ |
| **PRIMARY KEY** | Uniquely identifies each row         |
| **FOREIGN KEY** | Enforces relationship between tables |
| **UNIQUE**      | Prevents duplicate values            |
| **CHECK**       | Restricts values using logic         |
| **DEFAULT**     | Supplies a default value             |
| **NOT NULL**    | Requires a value                     |

### PRIMARY KEY

```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    ProductName NVARCHAR(100)
);
```

#### Composite Key

```sql
CREATE TABLE Orders (
    OrderID INT,
    ProductID INT,
    PRIMARY KEY (OrderID, ProductID)
);
```

### FOREIGN KEY

```sql
ALTER TABLE Employees
ADD CONSTRAINT FK_Employees_Departments
FOREIGN KEY (DeptID)
REFERENCES Departments(DeptID);
```

#### With Cascading

```sql
FOREIGN KEY (DeptID)
REFERENCES Departments(DeptID)
ON DELETE CASCADE
ON UPDATE CASCADE;
```

### UNIQUE

```sql
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(100) UNIQUE
);
```

### CHECK

```sql
CREATE TABLE Accounts (
    AccountID INT PRIMARY KEY,
    Balance DECIMAL(10,2) CHECK (Balance >= 0)
);
```

### DEFAULT

```sql
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    OrderDate DATETIME DEFAULT(GETDATE()),
    Status NVARCHAR(20) DEFAULT('Pending')
);
```

### NOT NULL

```sql
CREATE TABLE Countries (
    CountryID INT PRIMARY KEY,
    CountryName NVARCHAR(50) NOT NULL
);
```

---

## 3.5 ALTER Command

### A. Add Column

```sql
ALTER TABLE Employees
ADD PhoneNumber NVARCHAR(15);
```

### B. Modify Data Type

```sql
ALTER TABLE Employees
ALTER COLUMN Salary DECIMAL(12,2);
```

### C. Drop Column

```sql
ALTER TABLE Employees
DROP COLUMN PhoneNumber;
```

### D. Add Constraint

```sql
ALTER TABLE Employees
ADD CONSTRAINT CK_Salary CHECK (Salary > 0);
```

### E. Drop Constraint

```sql
ALTER TABLE Employees
DROP CONSTRAINT CK_Salary;
```

---

## 3.6 DROP Command

### A. Drop Table

```sql
DROP TABLE dbo.Students;
```

### B. Drop Database

```sql
DROP DATABASE LearningDB;
```

> ⚠️ Danger: DROP permanently removes structure + data.

---

## 3.7 TRUNCATE vs DELETE vs DROP

| Operation    | Removes Data    | Keeps Structure | Logs Rows | Can Rollback | Speed   |
| ------------ | --------------- | --------------- | --------- | ------------ | ------- |
| **DELETE**   | Yes (selective) | Yes             | Yes       | Yes          | Slow    |
| **TRUNCATE** | Yes (all rows)  | Yes             | Minimal   | Yes          | Fast    |
| **DROP**     | Yes             | No              | N/A       | No           | Fastest |

---

## 3.8 Practical Examples

### Example 1 — Add & Drop Column

```sql
ALTER TABLE Students ADD City NVARCHAR(50);
ALTER TABLE Students DROP COLUMN City;
```

### Example 2 — Add CHECK Constraint

```sql
ALTER TABLE Students
ADD CONSTRAINT CK_Marks CHECK (Marks BETWEEN 0 AND 100);
```

### Example 3 — Drop Constraint

```sql
ALTER TABLE Students
DROP CONSTRAINT CK_Marks;
```

### Example 4 — TRUNCATE & DELETE

```sql
DELETE FROM Employees WHERE Salary < 40000;
TRUNCATE TABLE Employees;
```

---

## 3.9 Practice Questions

Create table `Customers`:

* CustomerID INT (PK)
* Name NVARCHAR(100) NOT NULL
* Email NVARCHAR(100) UNIQUE
* JoinDate DATE DEFAULT(GETDATE())
* Age INT CHECK (Age >= 18)

Then:

1. Add column `PhoneNumber`.
2. Add CHECK constraint enforcing length ≥ 10.
3. Drop `PhoneNumber` column.
4. Create tables `Authors` and `Books` with FK relationship.

---

## 3.10 Summary

| Concept            | Description                                 |
| ------------------ | ------------------------------------------- |
| **CREATE**         | Create objects                              |
| **ALTER**          | Modify objects                              |
| **DROP**           | Delete objects                              |
| **Constraints**    | Enforce rules for data integrity            |
| **TRUNCATE**       | Fast removal of all data                    |
| **DELETE vs DROP** | DELETE removes data; DROP removes structure |

---

## 3.11 Next Chapter Preview

Next: **Chapter 4 — DML (INSERT, UPDATE, DELETE, MERGE)**

You’ll learn:

* Safe data insertion & updates
* Using transactions
* OUTPUT clause
* MERGE (UPSERT logic)
