# CHAPTER 8 — Common Table Expressions (CTEs) and Recursive Queries

## 1. INTRODUCTION

Common Table Expressions (CTEs) provide a temporary, named result set that exists only during the execution of a single SQL statement. They make complex queries easier to read, modular, and recursive-friendly.

### Interview Definition

A CTE (Common Table Expression) is a temporary, named result set defined using the WITH keyword that can be referenced within a SELECT, INSERT, UPDATE, or DELETE statement.

### Why use CTEs?

- Improves query readability and structure
- Can be reused multiple times in the same query
- Supports recursion for hierarchical or tree-like data (e.g., employee-manager relationships)

## 2. BASIC CTE STRUCTURE

### Syntax

```sql
WITH cte_name (column1, column2, ...)
AS
(
    -- CTE query definition
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition
)
-- Main query using the CTE
SELECT * FROM cte_name;
```

### Example 1 — Simple CTE

```sql
WITH HighSalaryEmployees AS
(
    SELECT EmpID, EmpName, Salary
    FROM Employees
    WHERE Salary > 50000
)
SELECT * FROM HighSalaryEmployees;
```

**Explanation:**
- CTE filters employees earning more than 50,000
- The main query simply reads from the CTE as if it were a table

### Equivalent Query Without CTE

```sql
SELECT * 
FROM (
    SELECT EmpID, EmpName, Salary
    FROM Employees
    WHERE Salary > 50000
) AS HighSalaryEmployees;
```

CTE offers better readability than nested subqueries.

## 3. MULTIPLE CTEs

You can define more than one CTE by separating them with commas.

```sql
WITH IT_Employees AS
(
    SELECT EmpID, EmpName, Salary, DeptID
    FROM Employees
    WHERE DeptID = 1
),
HighEarners AS
(
    SELECT EmpID, EmpName, Salary
    FROM Employees
    WHERE Salary > 60000
)
SELECT I.EmpName, I.Salary
FROM IT_Employees I
JOIN HighEarners H ON I.EmpID = H.EmpID;
```

### Key Points

- Each CTE can reference previous ones defined in the same WITH block
- They are temporary — valid only for that statement

## 4. USING CTEs WITH DML OPERATIONS

CTEs can also be used with UPDATE, DELETE, or INSERT.

### Example — Update Using CTE

```sql
WITH LowSalary AS
(
    SELECT EmpID, Salary
    FROM Employees
    WHERE Salary < 40000
)
UPDATE LowSalary
SET Salary = Salary + 5000;
```

**Explanation:**
- CTE identifies employees earning below 40,000
- The outer update modifies only those rows

### Example — Delete Using CTE

```sql
WITH OldEmployees AS
(
    SELECT EmpID FROM Employees WHERE Salary < 30000
)
DELETE FROM OldEmployees;
```

### Example — Insert Using CTE

```sql
WITH HighEarners AS
(
    SELECT EmpName, Salary
    FROM Employees
    WHERE Salary > 60000
)
INSERT INTO HighSalaryLog (EmpName, Salary)
SELECT EmpName, Salary FROM HighEarners;
```

## 5. RECURSIVE CTE

### Definition

A Recursive CTE is a CTE that references itself, allowing you to process hierarchical or tree-structured data (like organization charts).

### Recursive CTE Structure

```sql
WITH cte_name (columns)
AS
(
    -- Anchor member (base query)
    SELECT ...
    FROM table
    WHERE condition

    UNION ALL

    -- Recursive member (refers to CTE)
    SELECT ...
    FROM table
    INNER JOIN cte_name
    ON table.column = cte_name.column
)
SELECT * FROM cte_name;
```

### Rules for Recursive CTE

- Must include an anchor member (the starting point)
- Must include a recursive member that references the CTE itself
- Must end with a UNION ALL (not UNION, unless you want to remove duplicates)
- Must have a termination condition to prevent infinite recursion
- Default recursion depth is 100 levels (configurable via MAXRECURSION)

## 6. RECURSIVE CTE EXAMPLE — EMPLOYEE HIERARCHY

Let's create a sample employee table for demonstration.

```sql
CREATE TABLE EmployeeHierarchy (
    EmpID INT,
    EmpName NVARCHAR(50),
    ManagerID INT
);

INSERT INTO EmployeeHierarchy VALUES
(1, 'Amit', NULL),     -- CEO
(2, 'Rita', 1),
(3, 'Raj', 1),
(4, 'Neha', 2),
(5, 'Kiran', 3),
(6, 'Meena', 4);
```

### Recursive CTE Query

```sql
WITH EmployeeCTE AS
(
    -- Anchor: top-level employee (no manager)
    SELECT EmpID, EmpName, ManagerID, 0 AS Level
    FROM EmployeeHierarchy
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive: employees reporting to someone in the CTE
    SELECT E.EmpID, E.EmpName, E.ManagerID, EC.Level + 1
    FROM EmployeeHierarchy E
    INNER JOIN EmployeeCTE EC
    ON E.ManagerID = EC.EmpID
)
SELECT * FROM EmployeeCTE;
```

**Explanation:**
- The CTE first selects the CEO (where ManagerID IS NULL)
- Then recursively finds all employees reporting to that person, and so on
- Each recursion level increments the hierarchy depth

### Output Example:

| EmpID | EmpName | ManagerID | Level |
|-------|---------|-----------|-------|
| 1     | Amit    | NULL      | 0     |
| 2     | Rita    | 1         | 1     |
| 3     | Raj     | 1         | 1     |
| 4     | Neha    | 2         | 2     |
| 5     | Kiran   | 3         | 2     |
| 6     | Meena   | 4         | 3     |

### Limiting Recursion

To prevent infinite loops:

```sql
OPTION (MAXRECURSION 5);
```

## 7. REAL-LIFE USE CASES OF CTEs

| Use Case | Example |
|----------|---------|
| Organizational hierarchy | Find employees reporting to a manager recursively |
| Bill of materials (BOM) | Identify components and sub-components |
| Parent-child relationships | Folder structures, category hierarchies |
| Ranked reporting | Rank or level computation in reports |
| Temporary aggregation | Group and reuse results for complex analysis |

## 8. ADVANCED EXAMPLES

### Example 1 — Display path from employee to top manager

```sql
WITH Chain AS
(
    SELECT EmpID, EmpName, ManagerID, CAST(EmpName AS NVARCHAR(MAX)) AS HierarchyPath
    FROM EmployeeHierarchy
    WHERE ManagerID IS NULL

    UNION ALL

    SELECT E.EmpID, E.EmpName, E.ManagerID,
           CAST(C.HierarchyPath + ' -> ' + E.EmpName AS NVARCHAR(MAX))
    FROM EmployeeHierarchy E
    INNER JOIN Chain C ON E.ManagerID = C.EmpID
)
SELECT * FROM Chain;
```

**Output Example:**
Amit -> Rita -> Neha -> Meena

### Example 2 — Count number of subordinates for each employee

```sql
WITH SubTree AS
(
    SELECT EmpID, ManagerID
    FROM EmployeeHierarchy
    WHERE ManagerID IS NOT NULL
    UNION ALL
    SELECT E.EmpID, E.ManagerID
    FROM EmployeeHierarchy E
    INNER JOIN SubTree S ON E.ManagerID = S.EmpID
)
SELECT ManagerID, COUNT(*) AS SubordinateCount
FROM SubTree
GROUP BY ManagerID;
```

## 9. DIFFERENCE BETWEEN CTE AND DERIVED TABLE

| Feature | CTE | Derived Table |
|---------|-----|---------------|
| Definition | Temporary named result set defined using WITH | Subquery inside FROM |
| Reusability | Can be referenced multiple times | Used once |
| Readability | High (structured) | Harder for complex queries |
| Recursion | Supported | Not supported |
| Scope | Single statement | Single statement |

## 10. PRACTICE QUESTIONS

1. Write a CTE to find employees earning above average salary
2. Create a recursive CTE to list all subordinates under a given manager
3. Use multiple CTEs to show:
   - Average salary per department, and
   - Employees earning above their department's average
4. Write a CTE with MAXRECURSION to limit hierarchy depth to 3 levels
5. Create a CTE-based update to increase salary by 10% for employees under a manager named "Rita"

## 11. SUMMARY

| Concept | Description |
|---------|-------------|
| CTE | A temporary named result set defined using WITH |
| Recursive CTE | A CTE that references itself for hierarchical queries |
| Anchor Member | Base query that starts recursion |
| Recursive Member | Query that refers back to the CTE |
| MAXRECURSION | Limits recursion depth to prevent infinite loops |
| CTE vs Derived Table | CTE supports recursion and reusability |
| Use Cases | Hierarchies, ranking, organization structures, reusable subqueries |

## 12. INTERVIEW DEFINITIONS (QUICK REFERENCE)

| Term | Interview Definition |
|------|---------------------|
| Common Table Expression (CTE) | A temporary result set defined with the WITH clause used to simplify complex queries |
| Recursive CTE | A CTE that refers to itself to handle hierarchical or tree-structured data |
| Anchor Member | The initial query in a recursive CTE |
| Recursive Member | The query that refers back to the CTE for recursion |
| MAXRECURSION | Clause used to restrict the number of recursion levels (default 100) |
| Difference between CTE and Subquery | CTEs are more readable, reusable, and support recursion |
| Difference between CTE and Derived Table | Derived tables are used once; CTEs can be referenced multiple times |

## 13. NEXT CHAPTER PREVIEW

**Next: Chapter 9 — Window (Analytic) Functions**

You'll learn:
- Ranking functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE)
- Aggregate window functions (SUM() OVER, AVG() OVER)
- PARTITION BY, ORDER BY within window clauses
- Interview-style questions and practical reporting examples