# LINQ Masterclass — From Basics to Advanced (C#)

## Chapter 1: Introduction to LINQ

### 1.1 What is LINQ

LINQ (Language Integrated Query) is a feature in C# that allows querying collections (arrays, lists, databases, XML, etc.) in a declarative way — just like SQL.

It provides a consistent model for querying different types of data:

- LINQ to Objects (collections)
- LINQ to SQL
- LINQ to XML
- LINQ to Entities (Entity Framework)

LINQ uses extension methods from `System.Linq` and supports two syntaxes:

- Query Syntax (SQL-like)
- Method Syntax (Fluent)

### 1.2 Query Syntax vs Method Syntax

| Type | Description | Example |
|------|-------------|---------|
| Query Syntax | SQL-like syntax, more readable | `from x in collection where x > 10 select x;` |
| Method Syntax | Uses extension methods and lambdas | `collection.Where(x => x > 10).Select(x => x);` |

Both produce the same result after compilation.

### 1.3 Example: Basic LINQ Query

**Query Syntax**
```csharp
int[] numbers = { 1, 2, 3, 4, 5 };
var result = from n in numbers
             where n > 2
             select n;
```

**Method Syntax**
```csharp
var result = numbers.Where(n => n > 2).Select(n => n);
```

## Chapter 2: The from, where, and select Keywords

### 2.1 from

**Purpose:** Specifies the data source and range variable (like an iterator).

- Used at the start of a LINQ query.
- Declares a variable that represents each element in the collection.

**Example**

```csharp
var query = from num in numbers select num;
```

### 2.2 where

**Purpose:** Filters elements based on a boolean condition.
Equivalent to SQL's WHERE clause.

**Example**

**Query Syntax**

```csharp
var result = from n in numbers
             where n > 3
             select n;
```

**Method Syntax**

```csharp
var result = numbers.Where(n => n > 3);
```

**Capability:**
Filters data according to given predicates. Supports multiple conditions using logical operators `&&`, `||`, `!`.

### 2.3 select

**Purpose:** Projects each element into a new form or shape.

**Query Syntax**

```csharp
var names = from s in students
            select s.Name;
```

**Method Syntax**

```csharp
var names = students.Select(s => s.Name);
```

**Capability:**
Transforms data — you can return a single property, anonymous type, or custom object.

### 2.4 Example — Combined

```csharp
var result = from s in students
             where s.Marks > 70
             select new { s.Name, s.Marks };
```

**Equivalent:**

```csharp
var result = students
             .Where(s => s.Marks > 70)
             .Select(s => new { s.Name, s.Marks });
```

## Chapter 3: Ordering — orderby, OrderBy, ThenBy

### 3.1 orderby

**Purpose:** Sorts the results by one or more fields.

**Query Syntax**

```csharp
var result = from s in students
             orderby s.Marks descending
             select s;
```

**Method Syntax**

```csharp
var result = students.OrderByDescending(s => s.Marks);
```

**Capability:**
Orders results ascending by default. You can use:

- `ascending` (default)
- `descending`

### 3.2 ThenBy / ThenByDescending

Used for secondary sorting.

**Example**

```csharp
var result = students
             .OrderBy(s => s.Class)
             .ThenByDescending(s => s.Marks);
```

## Chapter 4: Grouping — group, GroupBy

### 4.1 group

**Purpose:** Groups elements based on a key.

**Query Syntax**

```csharp
var result = from s in students
             group s by s.Class;
```

**Method Syntax**

```csharp
var result = students.GroupBy(s => s.Class);
```

**Capability:**
Creates groups (like SQL GROUP BY) where each group can be iterated over.

**Example with Projection**

```csharp
var result = from s in students
             group s by s.Class into g
             select new { Class = g.Key, Count = g.Count() };
```

**Equivalent:**

```csharp
var result = students.GroupBy(s => s.Class)
                     .Select(g => new { Class = g.Key, Count = g.Count() });
```

## Chapter 5: Aggregation Operators

**Purpose:** Perform calculations on data such as counting, summing, averaging.

| Operator | Description | Example |
|----------|-------------|---------|
| `Count()` | Counts elements | `students.Count()` |
| `Sum()` | Adds numeric values | `students.Sum(s => s.Marks)` |
| `Average()` | Finds mean | `students.Average(s => s.Marks)` |
| `Min()` / `Max()` | Finds min or max value | `students.Max(s => s.Marks)` |

## Chapter 6: Joining — join, Join, GroupJoin

### 6.1 join

**Purpose:** Combines data from multiple sources based on matching keys.

**Query Syntax**

```csharp
var result = from s in students
             join d in departments on s.DeptId equals d.Id
             select new { s.Name, d.DeptName };
```

**Method Syntax**

```csharp
var result = students.Join(departments,
                           s => s.DeptId,
                           d => d.Id,
                           (s, d) => new { s.Name, d.DeptName });
```

**Capability:**
Performs inner joins. You can use `into` for group joins.

### 6.2 GroupJoin

**Purpose:** Performs a left outer join.

```csharp
var result = departments.GroupJoin(students,
                                   d => d.Id,
                                   s => s.DeptId,
                                   (d, sGroup) => new { d.DeptName, Students = sGroup });
```

## Chapter 7: Set Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `Distinct()` | Removes duplicates | `numbers.Distinct()` |
| `Union()` | Combines unique elements | `list1.Union(list2)` |
| `Intersect()` | Common elements | `list1.Intersect(list2)` |
| `Except()` | Elements in first not in second | `list1.Except(list2)` |

## Chapter 8: Quantifiers

| Operator | Description | Example |
|----------|-------------|---------|
| `Any()` | Checks if any element matches condition | `students.Any(s => s.Marks > 90)` |
| `All()` | Checks if all elements match | `students.All(s => s.Marks > 40)` |
| `Contains()` | Checks if a specific value exists | `numbers.Contains(5)` |

## Chapter 9: Element Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `First()` / `FirstOrDefault()` | First element (with or without condition) | `students.First(s => s.Marks > 90)` |
| `Last()` / `LastOrDefault()` | Last element | `students.Last()` |
| `Single()` / `SingleOrDefault()` | Exactly one element | `students.Single(s => s.Id == 5)` |
| `ElementAt()` | Element by index | `students.ElementAt(2)` |

## Chapter 10: Projection — Select, SelectMany

### 10.1 Select

Already covered — transforms each element.

### 10.2 SelectMany

**Purpose:** Flattens collections of collections.

**Example**

```csharp
var allSubjects = students.SelectMany(s => s.Subjects);
```

**Capability:**
Converts nested sequences into a single flattened sequence.

## Chapter 11: Deferred and Immediate Execution

- **Deferred Execution:** Query runs when iterated (`foreach`, `ToList()`, etc.)
- **Immediate Execution:** Query runs immediately when executed (`ToList()`, `Count()`, etc.)

**Example**

```csharp
var q = students.Where(s => s.Marks > 60); // Deferred
var list = q.ToList(); // Immediate
```

## Chapter 12: IEnumerable vs IQueryable

| Type | Executes in | Used For | Example |
|------|-------------|----------|---------|
| `IEnumerable` | In-memory collections | LINQ to Objects | `.Where(...)` on List |
| `IQueryable` | Database (SQL generated) | LINQ to Entities | `.Where(...)` on DbSet |

## Chapter 13: Joining with Nested Queries

**Example:**

```csharp
var result = from s in students
             where s.Marks > (from s2 in students select s2.Marks).Average()
             select s;
```

**Capability:**
Nested queries for complex filtering (subqueries).

## Chapter 14: Advanced Techniques

- Dynamic LINQ
- Expression Trees
- `AsEnumerable()` vs `AsQueryable()`
- Pagination using `Skip()` and `Take()`
- Performance Tips

**Example: Pagination**

```csharp
var page = students.Skip(10).Take(10);
```

## Summary Table — Common LINQ Keywords and Capabilities

| Keyword / Method | Purpose | Syntax Type |
|------------------|---------|-------------|
| `from` | Defines range variable | Query |
| `where` / `Where()` | Filter elements | Both |
| `select` / `Select()` | Project elements | Both |
| `orderby` / `OrderBy()` | Sort ascending | Both |
| `orderby ... descending` / `OrderByDescending()` | Sort descending | Both |
| `group` / `GroupBy()` | Group elements | Both |
| `join` / `Join()` | Inner join | Both |
| `into` / `GroupJoin()` | Grouped join / continuation | Both |
| `Distinct()`, `Union()`, `Intersect()`, `Except()` | Set operations | Method |
| `First()`, `Single()`, `ElementAt()` | Element selection | Method |
| `Any()`, `All()`, `Contains()` | Quantifiers | Method |
| `Skip()`, `Take()` | Pagination | Method |
| `Count()`, `Sum()`, `Average()`, `Max()`, `Min()` | Aggregation | Method |