# CHAPTER 9 — Window (Analytic) Functions

**ROW_NUMBER, RANK, DENSE_RANK, NTILE, LEAD/LAG, SUM OVER, AVG OVER, PARTITION BY, ORDER BY**

## 1. INTRODUCTION

Window functions allow you to perform calculations across a set of rows related to the current row, without collapsing rows like a normal GROUP BY.

They are used for:
- Ranking
- Running totals
- Moving averages
- Finding previous/next row values
- Top-N queries per group
- Deduplication

### Interview Definition

A window function performs a calculation across a set of rows that are related to the current row, defined using an OVER() clause with optional PARTITION BY and ORDER BY.

## 2. THE OVER() CLAUSE

All window functions require:

```sql
OVER ( [PARTITION BY column] [ORDER BY column] )
```

**PARTITION BY**
- Divides result set into groups (like subgrouping)

**ORDER BY**
- Defines order of rows within each partition

## 3. WINDOW FUNCTION CATEGORIES

| Category | Functions |
|----------|-----------|
| Ranking functions | ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE() |
| Analytic/Value functions | LEAD(), LAG(), FIRST_VALUE(), LAST_VALUE() |
| Aggregate window functions | SUM() OVER, AVG() OVER, MIN() OVER, MAX() OVER |

### Sample Dataset

Let's create a dataset:

```sql
CREATE TABLE Sales (
    SaleID INT,
    EmpName NVARCHAR(50),
    Dept NVARCHAR(50),
    SaleAmount INT
);

INSERT INTO Sales VALUES
(1, 'Amit', 'IT', 500),
(2, 'Amit', 'IT', 700),
(3, 'Rita', 'IT', 600),
(4, 'Raj', 'HR', 300),
(5, 'Raj', 'HR', 400),
(6, 'Neha', 'HR', 700),
(7, 'Neha', 'HR', 200);
```

## 4. RANKING FUNCTIONS

### 4.1 ROW_NUMBER()

**Definition:** Assigns a unique sequential number starting from 1 within each partition.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       ROW_NUMBER() OVER(PARTITION BY Dept ORDER BY SaleAmount DESC) AS RowNum
FROM Sales;
```

**Use Case:**
- Fetch top-N per department
- Remove duplicates

### 4.2 RANK()

**Definition:** Assigns a rank, but ties receive same rank, and ranks skip after ties.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       RANK() OVER(PARTITION BY Dept ORDER BY SaleAmount DESC) AS RankNo
FROM Sales;
```

**When to use:**
- Competitions or leaderboards where ties matter

### 4.3 DENSE_RANK()

**Definition:** Like RANK(), but no gaps in ranking.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       DENSE_RANK() OVER(PARTITION BY Dept ORDER BY SaleAmount DESC) AS DenseRankNo
FROM Sales;
```

**When to use:**
- Rankings where you don't skip numbers after ties

### 4.4 NTILE(n)

**Definition:** Distributes rows into n equal buckets.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       NTILE(4) OVER(ORDER BY SaleAmount DESC) AS Quartile
FROM Sales;
```

**Use Case:**
- Divide customers into quartiles
- Marketing segmentation

## 5. ANALYTIC / VALUE WINDOW FUNCTIONS

### 5.1 LAG()

**Definition:** Access previous row value without a self-join.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       LAG(SaleAmount) OVER(PARTITION BY Dept ORDER BY SaleAmount) AS PreviousSale
FROM Sales;
```

**Use Case:**
- Compare current vs previous value
- Trend analysis

### 5.2 LEAD()

**Definition:** Access next row value.

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       LEAD(SaleAmount) OVER(PARTITION BY Dept ORDER BY SaleAmount) AS NextSale
FROM Sales;
```

### 5.3 FIRST_VALUE() / LAST_VALUE()

**Example:**
```sql
SELECT EmpName, Dept, SaleAmount,
       FIRST_VALUE(SaleAmount) OVER(PARTITION BY Dept ORDER BY SaleAmount) AS LowestSale,
       LAST_VALUE(SaleAmount) OVER(PARTITION BY Dept ORDER BY SaleAmount
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS HighestSale
FROM Sales;
```

## 6. AGGREGATE WINDOW FUNCTIONS (SUM OVER, AVG OVER)

**Definition:** Performs aggregate calculations without collapsing rows (unlike GROUP BY).

### Example — Running Total

```sql
SELECT EmpName, Dept, SaleAmount,
       SUM(SaleAmount) OVER(PARTITION BY Dept ORDER BY SaleAmount) AS RunningTotal
FROM Sales;
```

### Example — Percentage Contribution

```sql
SELECT EmpName, SaleAmount,
       SaleAmount * 100.0 / SUM(SaleAmount) OVER() AS PercentContribution
FROM Sales;
```

### Example — Average Sale Per Department

```sql
SELECT EmpName, Dept, SaleAmount,
       AVG(SaleAmount) OVER(PARTITION BY Dept) AS AvgDeptSales
FROM Sales;
```

### Example — Min & Max without GROUP BY

```sql
SELECT EmpName, Dept, SaleAmount,
       MIN(SaleAmount) OVER(PARTITION BY Dept) AS MinSale,
       MAX(SaleAmount) OVER(PARTITION BY Dept) AS MaxSale
FROM Sales;
```

## 7. WINDOW FRAME CLAUSE

Used for advanced analytics:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

### Example — Proper Running Total

```sql
SELECT EmpName, SaleAmount,
    SUM(SaleAmount) OVER(
        ORDER BY SaleAmount 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS TrueRunningTotal
FROM Sales;
```

## 8. TOP INTERVIEW QUESTIONS (With Ready Answers)

### Q1: Difference between RANK() and DENSE_RANK()?
- RANK() skips numbers after ties
- DENSE_RANK() does not skip numbers

### Q2: Difference between ROW_NUMBER() and RANK()?
- ROW_NUMBER() always unique
- RANK() allows ties

### Q3: What does PARTITION BY do?
- It divides result set into groups
- Window function then operates separately inside each group

### Q4: Can window functions be used in WHERE?
**No.** They can only be used in:
- SELECT
- ORDER BY
- HAVING (indirectly via subquery)

**To filter:**
```sql
WITH CTE AS (
   SELECT *, ROW_NUMBER() OVER(...) AS rn
   FROM Sales
)
SELECT * FROM CTE WHERE rn = 1;
```

### Q5: How to get the top 1 employee per department?

```sql
WITH Ranked AS (
    SELECT *, 
           ROW_NUMBER() OVER(PARTITION BY Dept ORDER BY SaleAmount DESC) AS rn
    FROM Sales
)
SELECT EmpName, Dept, SaleAmount
FROM Ranked
WHERE rn = 1;
```

## 9. PRACTICAL USE CASES

| Use Case | Window Function |
|----------|----------------|
| Deduplicate rows | ROW_NUMBER() |
| Get top-N per group | ROW_NUMBER(), RANK() |
| Compare with previous/next row | LAG(), LEAD() |
| Running totals | SUM() OVER |
| Percentile or quartile grouping | NTILE() |
| Partitioned analytics | SUM/AVG OVER PARTITION BY |

## 10. PRACTICE QUESTIONS

1. Using ROW_NUMBER, get the highest sale per department
2. Using RANK, rank employees based on sale amount per department
3. Use NTILE(4) to segment employees into quartiles
4. Use LAG to compare each sale with previous sale in same department
5. Use SUM OVER to calculate running total of sales
6. Use AVG OVER to find department-wise average salary

## 11. SUMMARY

| Function | Behavior |
|----------|----------|
| ROW_NUMBER() | Unique numbering |
| RANK() | Ties share rank; rank skips numbers |
| DENSE_RANK() | Ties share rank; no skip in numbers |
| NTILE() | Splits rows into N buckets |
| LAG() | Previous row value |
| LEAD() | Next row value |
| FIRST_VALUE() | First row value in window |
| LAST_VALUE() | Last row value in window |
| OVER() | Defines partition and order |
| PARTITION BY | Groups data without collapsing rows |
| ORDER BY | Defines row sequence for function |

## 12. NEXT CHAPTER PREVIEW

**Next: Chapter 10 — Indexes and Query Optimization**

You'll learn:
- Clustered vs non-clustered indexes
- Covering indexes
- Included columns
- Seek vs Scan
- Execution plan analysis
- Index fragmentation, fill factor
- Performance tuning strategies