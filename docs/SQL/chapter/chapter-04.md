# Chapter 4 — DML (Data Manipulation Language)

### INSERT, UPDATE, DELETE, MERGE with OUTPUT and Transactions

---

## 4.1 Introduction

In this chapter, we move from defining structures (**DDL**) to manipulating data using **DML**.

### Common DML Commands

| Command    | Description                                    |
| ---------- | ---------------------------------------------- |
| **INSERT** | Adds new rows                                  |
| **UPDATE** | Modifies existing rows                         |
| **DELETE** | Removes existing rows                          |
| **MERGE**  | Inserts, updates, or deletes based on matching |

We cover syntax, examples, variations, and best practices.

---

## 4.2 INSERT Command

### Purpose

Adds new rows to a table.

### A. Basic Syntax

```sql
INSERT INTO table_name (column1, column2)
VALUES (value1, value2);
```

### B. Example — Basic Insert

```sql
INSERT INTO dbo.Students (FirstName, LastName, DateOfBirth, Email, Marks)
VALUES ('Amit', 'Sharma', '2002-01-15', 'amit@example.com', 85.5);
```

### C. Example — Insert Multiple Rows

```sql
INSERT INTO dbo.Students (FirstName, LastName, Marks)
VALUES
('Ravi', 'Patel', 75),
('Sonal', 'Rao', 92),
('Kiran', 'Mehta', 67);
```

### D. Example — Insert from Another Table

```sql
INSERT INTO dbo.Graduates (Name, Email)
SELECT FirstName + ' ' + LastName, Email
FROM dbo.Students
WHERE Marks > 80;
```

### E. Example — Insert Default Values

```sql
INSERT INTO dbo.Students DEFAULT VALUES;
```

### F. Example — Insert Using Subquery

```sql
INSERT INTO dbo.TopStudents (StudentName, Marks)
SELECT FirstName + ' ' + LastName, Marks
FROM dbo.Students
WHERE Marks >= 90;
```

---

## 4.3 UPDATE Command

### Purpose

Modifies existing rows.

### A. Basic Syntax

```sql
UPDATE table_name
SET column1 = value1
WHERE condition;
```

### B. Example — Simple Update

```sql
UPDATE dbo.Students
SET Marks = 95
WHERE StudentID = 2;
```

### C. Example — Conditional Update

```sql
UPDATE dbo.Students
SET Marks = Marks + 5
WHERE Marks < 80;
```

### D. Example — Update from Another Table

```sql
UPDATE S
SET S.Marks = G.NewMarks
FROM dbo.Students S
JOIN dbo.GradeUpdates G ON S.StudentID = G.StudentID;
```

### E. Example — Update With Subquery

```sql
UPDATE dbo.Students
SET Marks = (SELECT AVG(Marks) FROM dbo.Students)
WHERE Marks IS NULL;
```

---

## 4.4 DELETE Command

### Purpose

Removes rows from a table.

### A. Basic Syntax

```sql
DELETE FROM table_name
WHERE condition;
```

### B. Example — Delete Rows

```sql
DELETE FROM dbo.Students
WHERE Marks < 35;
```

### C. Example — Delete All Rows

```sql
DELETE FROM dbo.Students;
```

### D. Example — Delete Using JOIN

```sql
DELETE S
FROM dbo.Students S
JOIN dbo.Departments D ON S.DeptID = D.DeptID
WHERE D.DeptName = 'Science';
```

### E. Example — Delete Using Subquery

```sql
DELETE FROM dbo.Students
WHERE DeptID IN (
    SELECT DeptID FROM dbo.Departments WHERE DeptName = 'Arts'
);
```

### F. DELETE vs TRUNCATE

| Feature           | DELETE | TRUNCATE |
| ----------------- | ------ | -------- |
| Removes all rows  | Yes    | Yes      |
| Uses WHERE        | Yes    | No       |
| Logs each row     | Yes    | Minimal  |
| Rollback possible | Yes    | Yes      |
| Resets identity   | No     | Yes      |

---

## 4.5 MERGE Command

### Purpose

Performs INSERT, UPDATE, or DELETE in one statement.

### Syntax

```sql
MERGE target_table AS T
USING source_table AS S
ON (T.id = S.id)
WHEN MATCHED THEN
    UPDATE SET T.column = S.column
WHEN NOT MATCHED BY TARGET THEN
    INSERT (columns...) VALUES (values...)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
```

### Example

```sql
MERGE dbo.Students AS Target
USING dbo.NewStudents AS Source
ON Target.Email = Source.Email
WHEN MATCHED THEN
    UPDATE SET Target.Marks = Source.Marks
WHEN NOT MATCHED BY TARGET THEN
    INSERT (FirstName, LastName, Email, Marks)
    VALUES (Source.FirstName, Source.LastName, Source.Email, Source.Marks)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
```

### When to Use MERGE

* Syncing data between tables
* Nightly imports
* Deduplication

---

## 4.6 OUTPUT Clause

Allows returning affected rows.

### Example — Track Inserted Rows

```sql
INSERT INTO dbo.LogTable (Name, Marks)
OUTPUT inserted.Name, inserted.Marks
VALUES ('Ravi', 90);
```

### Example — Capture Updated Rows

```sql
UPDATE dbo.Students
SET Marks = Marks + 5
OUTPUT deleted.Marks AS OldMarks, inserted.Marks AS NewMarks
WHERE Marks < 80;
```

### Example — Capture Deleted Rows

```sql
DELETE FROM dbo.Students
OUTPUT deleted.StudentID, deleted.FirstName, deleted.Marks
WHERE Marks < 40;
```

---

## 4.7 Transactions

### Purpose

Group multiple DML operations into a single unit.

### Syntax

```sql
BEGIN TRANSACTION;
-- operations
COMMIT TRANSACTION;
-- or
ROLLBACK TRANSACTION;
```

### Example

```sql
BEGIN TRANSACTION;

UPDATE dbo.Students SET Marks = Marks + 10 WHERE Marks < 50;
DELETE FROM dbo.Students WHERE Marks IS NULL;

IF @@ERROR <> 0
    ROLLBACK TRANSACTION;
ELSE
    COMMIT TRANSACTION;
```

---

## 4.8 Practical Examples

### Example 1 — Insert and Log

```sql
INSERT INTO dbo.Students (FirstName, LastName, Marks)
OUTPUT inserted.StudentID, inserted.FirstName
INTO dbo.InsertLog
VALUES ('Neha', 'Patel', 88);
```

### Example 2 — Safe Update in Transaction

```sql
BEGIN TRANSACTION;
UPDATE dbo.Students SET Marks = Marks + 5 WHERE Marks < 60;

IF @@ROWCOUNT > 0
    COMMIT TRANSACTION;
ELSE
    ROLLBACK TRANSACTION;
```

### Example 3 — Merge Synchronization

```sql
MERGE dbo.TargetTable AS T
USING dbo.SourceTable AS S
ON T.ID = S.ID
WHEN MATCHED THEN UPDATE SET T.Value = S.Value
WHEN NOT MATCHED BY TARGET THEN INSERT (ID, Value) VALUES (S.ID, S.Value)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
```

---

## 4.9 Practice Questions

1. Create tables `Products` and `NewProducts` with overlapping data.

   * Use **MERGE** to update and insert records.

2. Use **OUTPUT** to show IDs of students deleted with Marks < 50.

3. Write an UPDATE with JOIN to increase salary by 10% for IT department employees.

4. Use a transaction:

   * Insert 2 new students
   * If one fails, rollback both

---

## 4.10 Summary

| Concept         | Description                   |
| --------------- | ----------------------------- |
| **INSERT**      | Adds data                     |
| **UPDATE**      | Modifies data                 |
| **DELETE**      | Removes data                  |
| **MERGE**       | Combines insert/update/delete |
| **OUTPUT**      | Returns affected rows         |
| **TRANSACTION** | Ensures data integrity        |

---

## 4.11 Next Chapter Preview

Next: **Chapter 5 — Filtering, Sorting, and Aggregation**

You’ll learn:

* WHERE, ORDER BY, DISTINCT
* Aggregate functions (SUM, AVG, COUNT)
* GROUP BY and HAVING
* Advanced grouping: ROLLUP, CUBE, GROUPING SETS
