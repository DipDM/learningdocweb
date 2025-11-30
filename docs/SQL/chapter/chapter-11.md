---
sidebar_position: 11
title: CHAPTER-11 - Transactions, Locking & Isolation Levels
description: Comprehensive guide to SQL Server transactions, ACID properties, locking mechanisms, deadlocks, and isolation levels
keywords: [SQL Server, transactions, ACID, locking, deadlocks, isolation levels, blocking, snapshot isolation, database]
---

# Chapter 11: Transactions, Locking & Isolation Levels

> **Topics Covered:** ACID, Lock Types, Deadlocks, Isolation Levels, Blocking, Row Versioning

---

## 11.1 Introduction

When multiple users interact with the database at the same time, SQL Server must ensure:

- Data remains consistent
- No corruption or partial updates occur
- Queries don't read "dirty" or incomplete data

This is where transactions, locking, and isolation levels come in.

:::tip Interview Definition — Transaction
A transaction is a group of SQL statements that must be treated as a single logical unit of work. Either all statements succeed, or none do.
:::

---

## 11.2 ACID Properties

Every transaction must follow ACID:

| Property | Meaning |
|----------|---------|
| **Atomicity** | All-or-nothing execution |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions do not affect each other |
| **Durability** | Once committed, changes are permanent |

---

## 11.3 Transaction Commands

### Basic Syntax

```sql
BEGIN TRANSACTION;

-- SQL operations

COMMIT TRANSACTION;     -- Save changes
ROLLBACK TRANSACTION;   -- Undo changes
```

### Example 1 — Simple Transaction

```sql
BEGIN TRANSACTION;

UPDATE Accounts SET Balance = Balance - 1000 WHERE AccNo = 1;
UPDATE Accounts SET Balance = Balance + 1000 WHERE AccNo = 2;

COMMIT TRANSACTION;
```

### Example 2 — Transaction with Error Handling

```sql
BEGIN TRY
    BEGIN TRANSACTION;

    UPDATE Accounts SET Balance = Balance - 500 WHERE AccNo = 1;
    UPDATE Accounts SET Balance = Balance + 500 WHERE AccNo = 2;

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
END CATCH;
```

---

## 11.4 Locking in SQL Server

SQL uses locks to control concurrent access to data.

### 11.4.1 Types of Locks

| Lock Type | Description |
|-----------|-------------|
| **Shared (S)** | Allows read; blocks write |
| **Exclusive (X)** | Used for write; blocks read and write |
| **Update (U)** | Prevents deadlock during update |
| **Intent Locks (IS, IX, SIX)** | Shows intention to lock underlying rows/pages |
| **Schema Locks (Sch-S, Sch-M)** | When altering schema |
| **Bulk Update (BU)** | For bulk operations |

### 11.4.2 Where Locks Occur?

Locks can be taken at:

- **Row**
- **Page** (8 KB)
- **Table**

:::info
SQL Server automatically decides lock level.
:::

---

## 11.5 Blocking

### Definition

Blocking occurs when one transaction holds a lock and another transaction has to wait.

### Example

**Transaction A:**

```sql
BEGIN TRAN;
UPDATE Employees SET Salary = 80000 WHERE EmpID = 1;
-- No COMMIT yet → lock held
```

**Transaction B:**

```sql
SELECT * FROM Employees WHERE EmpID = 1;
```

:::note
Transaction B waits until A commits or rolls back.
:::

---

## 11.6 Deadlocks

### Definition (Interview Strong Answer)

A deadlock occurs when two transactions block each other by holding locks on resources the other transaction needs.

### Example

**Transaction 1:**
- Locks row A
- Wants row B

**Transaction 2:**
- Locks row B
- Wants row A

:::danger
SQL chooses a deadlock victim, rolls it back.
:::

### How to Detect Deadlocks

SQL Server Error Log:
```
"Transaction (Process ID ...) was deadlocked on ... and has been chosen as the deadlock victim."
```

### Preventing Deadlocks

- Access tables in same order
- Keep transactions short
- Use `UPDLOCK` hints
- Avoid user input inside transactions
- Use lower isolation level if safe
- Avoid long-running queries

---

## 11.7 Isolation Levels

This defines how much a transaction isolates itself from others.

### Key Concepts

**Dirty Read**
- Read uncommitted data

**Non-Repeatable Read**
- Same query returns different results within one transaction

**Phantom Read**
- New rows appear between queries in a transaction

### Isolation Level Table (Very Important!)

| Isolation Level | Dirty Read | Non-repeatable Read | Phantom | Notes |
|-----------------|------------|---------------------|---------|-------|
| **Read Uncommitted** | Yes | Yes | Yes | No locks → fastest |
| **Read Committed** (default) | No | Yes | Yes | Basic locking |
| **Repeatable Read** | No | No | Yes | Prevents re-read conflicts |
| **Serializable** | No | No | No | Highest isolation, slowest |
| **Snapshot** | No | No | No | Uses row versioning instead of locks |

---

## 11.8 Read Uncommitted

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

SELECT * FROM Orders;  -- dirty reads allowed
```

:::info Features
- Cheapest
- Can read uncommitted (dirty) rows
- Used for heavy read reporting systems
:::

---

## 11.9 Read Committed (DEFAULT)

- Prevents dirty reads
- Uses shared locks during read

```sql
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

---

## 11.10 Repeatable Read

- Prevents dirty reads
- Prevents non-repeatable reads
- Still allows phantom reads

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

---

## 11.11 Serializable

Most strict.

- No dirty reads
- No non-repeatable reads
- No phantom reads
- Locks entire range of data

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

---

## 11.12 Snapshot Isolation

- No locks for reading
- Uses row versioning
- Fast for OLTP + heavy read workloads

### Enable Snapshot

```sql
ALTER DATABASE MyDB SET ALLOW_SNAPSHOT_ISOLATION ON;
ALTER DATABASE MyDB SET READ_COMMITTED_SNAPSHOT ON;
```

### Use Snapshot

```sql
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;

SELECT * FROM Employees;
```

:::tip
No blocking, no deadlocks for reads.
:::

---

## 11.13 Locking Hints (Advanced)

```sql
SELECT * FROM Employees WITH (NOLOCK);
```

Equivalent to Read Uncommitted.

### Other Hints

- `HOLDLOCK` → Serializable
- `UPDLOCK` → Prevent update deadlocks
- `ROWLOCK` → Row-level lock
- `PAGLOCK` → Page-level lock

---

## 11.14 Interview Questions (with Strong Answers)

### Q1: What is a transaction?

A transaction is a logical unit of work that must complete fully or not at all (ACID).

### Q2: What is a deadlock?

A deadlock happens when two transactions hold locks that the other needs, causing both to wait indefinitely.

### Q3: How do you solve deadlocks?

- Access tables in consistent order
- Keep transactions short
- Use appropriate isolation levels
- Use `UPDLOCK` where necessary

### Q4: What is the difference between blocking and deadlock?

- **Blocking:** One transaction waits for another → resolves when lock is released
- **Deadlock:** Two transactions wait on each other → SQL must abort one

### Q5: What is Snapshot Isolation?

Isolation that uses row versioning instead of locks, preventing blocking and deadlocks.

### Q6: What is Dirty Read?

Reading uncommitted data from another transaction.

### Q7: What is Serializable Isolation?

The strictest isolation level — transactions behave as if executed one after another.

---

## 11.15 Real-World Scenarios

### Scenario 1: High read load (reporting system)

Use:

```sql
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```

or `WITH (NOLOCK)` or Snapshot Isolation.

### Scenario 2: Prevent lost updates

Use:

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

### Scenario 3: Ensuring strict consistency (banking, finance)

Use:

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### Scenario 4: Reducing deadlocks

- Use `UPDLOCK`
- Reduce transaction duration
- Use `SNAPSHOT` isolation

---

## 11.16 Practice Problems

1. Write a transaction that transfers money between two accounts and rolls back on failure
2. Demonstrate blocking by updating a row and selecting it in another session
3. Create a deadlock scenario with two sessions and resolve it
4. Write queries using each isolation level and analyze behavior
5. Enable snapshot isolation and test non-blocking reads

---

## 11.17 Summary

| Topic | Summary |
|-------|---------|
| **Transaction** | Logical unit of work (ACID) |
| **Locks** | Control concurrent access |
| **Blocking** | One transaction waits for another |
| **Deadlock** | Two transactions wait on each other |
| **Isolation Levels** | Control visibility & consistency of data |
| **Snapshot Isolation** | Uses row versioning, avoids locks |
| **Locking Hints** | Control locking behavior manually |

---

## 11.18 Next Chapter Preview

**Next: Chapter 12 — Constraints, Defaults & Data Integrity**

We'll cover:

- Primary, Foreign, Unique, Check
- Default constraints
- Cascading rules
- Data integrity best practices
- Interview deep questions
