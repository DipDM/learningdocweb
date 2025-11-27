# CHAPTER 10 — Indexes & Query Optimization

**Clustered / Non-Clustered / Included Columns / Covering Index / Seek vs Scan / Statistics / Execution Plans / Fragmentation**

> This chapter is crucial for interviews, real-world performance, and tuning slow queries.

## 1. INTRODUCTION

Indexing is the heart of SQL performance. Well-designed indexes make queries fast, and poor indexing makes even simple queries slow.

### Interview Definition (Short & Strong)

An index in SQL Server is a data structure that improves the speed of data retrieval by providing a fast lookup path for rows, similar to an index in a book.

## 2. TYPES OF INDEXES

| Index Type | Description |
|------------|-------------|
| Clustered Index | Defines the physical order of rows in a table |
| Non-Clustered Index | A separate structure that references table rows via pointers (RID/Key) |
| Unique Index | Ensures uniqueness |
| Filtered Index | Index on subset of rows |
| Covering Index | Query can be fully answered from index |
| Columnstore Index | Optimized for analytics (OLAP) |
| Hash Index (Memory-Optimized) | Used for in-memory tables |

## 3. CLUSTERED INDEX

### Definition

A clustered index determines the physical order of the rows in the table. Each table can have only ONE clustered index.

### Characteristics

- Acts like the table's backbone
- Data is stored in a B-Tree sorted by the clustered key
- Ideal for:
  - Range queries
  - Sorting
  - Searching by primary key

### Example

```sql
CREATE CLUSTERED INDEX IX_Employees_EmpID
ON Employees (EmpID);
```

### Primary Key → Clustered Index (Default)

```sql
CREATE TABLE Orders (
   OrderID INT PRIMARY KEY,    -- auto creates clustered index
   OrderDate DATETIME,
   Amount DECIMAL(10,2)
);
```

If no clustered index exists, SQL Server makes PK index clustered unless instructed otherwise.

### When to choose Clustered Index

For columns frequently used in:
- ORDER BY
- BETWEEN queries
- ranges

Ideal columns:
- Identity keys
- Sequential values

## 4. NON-CLUSTERED INDEX

### Definition

A non-clustered index is a separate structure containing key values and pointers (Row Locator) to the actual table rows.

### Characteristics

- Doesn't affect physical order of rows
- Multiple non-clustered indexes are allowed
- Good for:
  - Search queries (WHERE)
  - JOIN conditions
  - Filtering

### Syntax

```sql
CREATE NONCLUSTERED INDEX IX_Employees_Name
ON Employees (EmpName);
```

### Row Locator

- For clustered tables → clustered key is locator
- For heaps → RID (Row Identifier)

## 5. INCLUDED COLUMNS

### Definition

Included columns are non-key columns added to a non-clustered index to make it covering without affecting the index's sort order.

### Syntax

```sql
CREATE NONCLUSTERED INDEX IX_Employees_Name
ON Employees (EmpName)
INCLUDE (DeptID, Salary);
```

### Why use INCLUDED?

- Reduces lookups
- Improves performance
- Makes index cover the entire query

## 6. COVERING INDEX

### Definition

A covering index is an index that contains all the columns required by a query, so SQL Server does not need to go back to the base table.

### Example Query

```sql
SELECT EmpName, Salary
FROM Employees
WHERE EmpName = 'Amit';
```

### Create covering index

```sql
CREATE NONCLUSTERED INDEX IX_Employees_Cover
ON Employees (EmpName)
INCLUDE (Salary);
```

### Benefit

Avoids the expensive "Key Lookup" or "RID Lookup".

## 7. SEEK vs SCAN

### Definition

| Operation | Meaning |
|-----------|---------|
| Index SEEK | Fast lookup using index structure → best performance |
| Index SCAN | Reads entire index table → slower |
| Table SCAN | Reads entire table → worst performance |

### When SQL uses SEEK

- When WHERE column is indexed
- When searching by exact match or range on leading index column

### When SQL uses SCAN

- Missing index on filtered column
- Non-sargable queries (LIKE '%abc', functions on indexed column)

### Non-Sargable Example (Avoid)

```sql
SELECT *
FROM Employees
WHERE YEAR(HireDate) = 2020;  -- BAD
```

SQL will scan because index cannot be used.

### Sargable Rewrite (Good)

```sql
WHERE HireDate >= '2020-01-01' AND HireDate < '2021-01-01'
```

## 8. EXECUTION PLANS

Execution plans show how SQL Server executes queries.

### How to view plan

- Press **Ctrl + M** → Include Actual Execution Plan
- Or use:

```sql
SET SHOWPLAN_ALL ON;
```

### Important Operators

| Operator | Meaning |
|----------|---------|
| Clustered Index Seek | Very fast, best-case scenario |
| Clustered Index Scan | Reads whole index |
| Key Lookup | Looks up additional columns from clustered index |
| RID Lookup | Lookup on heap |
| Hash Match | Join using hash table |
| Merge Join | Requires sorted input |
| Nested Loop | Row-by-row join |

### Key Lookup Problem

Occurs when query needs columns NOT in index.

**Fix:** Use INCLUDED columns or Covering Index.

## 9. STATISTICS

### Definition

Statistics store data distribution information used by the optimizer to produce efficient execution plans.

### Types

- Index statistics (auto-created)
- Column statistics

### Update Stats

```sql
UPDATE STATISTICS Employees;
```

or automatically via SQL Server every time enough changes occur.

### When stale statistics cause problems?

Wrong estimates → Wrong join strategy → Slow queries

## 10. INDEX FRAGMENTATION

Fragmentation occurs when data pages are not stored contiguously.

### Two Types

- **Logical Fragmentation (External)** → Out-of-order pages
- **Internal Fragmentation** → Too much free space inside pages

### Check Fragmentation

```sql
SELECT index_id, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('Employees'), NULL, NULL, NULL);
```

### Fix Fragmentation

| Fragmentation | Action |
|---------------|--------|
| 5% – 30% | REORGANIZE |
| > 30% | REBUILD |

### Commands

```sql
ALTER INDEX IX_Employees_Name ON Employees REORGANIZE;
ALTER INDEX IX_Employees_Name ON Employees REBUILD;
```

## 11. FILTERED INDEX

### Definition

A non-clustered index on subset of rows using a WHERE clause.

### Example

```sql
CREATE NONCLUSTERED INDEX IX_ActiveUsers
ON Users (LastLoginDate)
WHERE IsActive = 1;
```

### Benefits

- Smaller index
- Faster
- Perfect for sparse columns

## 12. COLUMNSTORE INDEX (OLAP)

### Definition

Stores data column-wise, optimized for analytics, not OLTP.

### Usage

- Data warehouse queries
- Big aggregations

### Create

```sql
CREATE COLUMNSTORE INDEX IX_Sales_ColumnStore
ON Sales;
```

## 13. REAL INTERVIEW QUESTIONS (with answers)

### Q1: What is the difference between Clustered and Non-Clustered Index?

- Clustered index sorts and stores data physically → only one allowed
- Non-clustered index is a separate structure pointing to data rows → many allowed

### Q2: What is a Key Lookup?

A lookup operation when non-clustered index does not contain all required columns.

### Q3: How to fix Key Lookup?

Create a covering index with INCLUDE columns.

### Q4: What is SARGability?

Query ability to use indexes effectively. Non-sargable operations cause scans.

### Q5: How does SQL choose execution plans?

Using statistics and cost-based optimizer.

### Q6: What is fragmentation and how to fix it?

Out-of-order pages → slow IO

Fix via REORGANIZE or REBUILD

### Q7: When to use Filtered Indexes?

When you only need to index a subset of data.

## 14. PRACTICE TASKS

1. Create a clustered index on primary key in Employees
2. Create non-clustered index on DeptID
3. Add INCLUDE (Salary) to that index
4. Find a query that produces a Key Lookup and fix it
5. Compare table scan vs index seek using execution plan
6. Check fragmentation and rebuild index

## 15. SUMMARY

| Concept | Meaning |
|---------|---------|
| Clustered Index | Defines physical order of table |
| Non-Clustered Index | Separate index structure |
| Included Columns | Make index covering |
| Covering Index | Query doesn't need table lookup |
| Seek | Fast lookup |
| Scan | Reads entire table/index |
| Statistics | Used by optimizer to choose plan |
| Fragmentation | Out-of-order pages → degrade performance |
| Filtered Index | Index on subset of rows |
| Columnstore Index | Analytics-focused index |

## 16. NEXT CHAPTER PREVIEW

**Next: Chapter 11 — Transactions, Locking, and Isolation Levels**

We'll cover:
- ACID properties
- BEGIN / COMMIT / ROLLBACK
- Lock types (Shared, Exclusive, Update)
- Deadlocks
- Isolation levels (Read Uncommitted → Serializable → Snapshot)