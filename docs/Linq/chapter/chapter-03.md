# Chapter 3: Projection and Transformation in LINQ

## 3.1 What is Projection

Projection means transforming data from one form into another.
In LINQ, it's done using `select` (Query Syntax) or `.Select()` (Method Syntax).

You can:

- Extract a single property (e.g., only names),
- Create new anonymous objects (e.g., combine multiple fields),
- Transform collections (e.g., select nested data).

## 3.2 The select Keyword / .Select() Method

### Purpose

To define what the output of a query should look like — full object, a few fields, or a new shape.

### Syntax

| Type | Example |
|------|---------|
| Query Syntax | `from s in students select s.Name;` |
| Method Syntax | `students.Select(s => s.Name);` |

### Example 1: Selecting a Single Property

```csharp
var students = new[]
{
    new { Name = "John", Marks = 80 },
    new { Name = "Alice", Marks = 70 },
    new { Name = "Bob", Marks = 60 }
};
```

**Query Syntax**

```csharp
var names = from s in students
            select s.Name;
```

**Method Syntax**

```csharp
var names = students.Select(s => s.Name);
```

**Output:**

```
John
Alice
Bob
```

### Example 2: Selecting Multiple Properties (Anonymous Type)

You can project multiple fields into a new anonymous object.

**Query Syntax**

```csharp
var result = from s in students
             select new { s.Name, s.Marks };
```

**Method Syntax**

```csharp
var result = students.Select(s => new { s.Name, s.Marks });
```

**Output:**

```
John - 80
Alice - 70
Bob - 60
```

### Example 3: Creating a Computed Field

You can create new calculated or derived values.

**Query Syntax**

```csharp
var result = from s in students
             select new
             {
                 s.Name,
                 Percentage = s.Marks / 100.0 * 100
             };
```

**Method Syntax**

```csharp
var result = students.Select(s => new
{
    s.Name,
    Percentage = s.Marks / 100.0 * 100
});
```

**Output:**

```
John - 80%
Alice - 70%
Bob - 60%
```

## 3.3 The let Keyword

### Purpose

Allows you to store a computed value (temporary variable) inside a query.

:::note
There is no direct method syntax equivalent to `let`.
:::

### Example

```csharp
var result = from s in students
             let grade = s.Marks >= 75 ? "A" : "B"
             select new { s.Name, s.Marks, grade };
```

**Output:**

```
John - 80 - A
Alice - 70 - B
Bob - 60 - B
```

:::info Explanation
`let` creates a temporary variable (`grade`) used later in the same query.
:::

## 3.4 The SelectMany() Method

### Purpose

Used to flatten collections of collections (e.g., a list inside another list).
While `.Select()` keeps nested structure, `.SelectMany()` merges them into a single sequence.

### Example 1: Understanding the Difference

```csharp
var classes = new[]
{
    new { ClassName = "A", Students = new[] { "John", "Alice" } },
    new { ClassName = "B", Students = new[] { "Bob", "Daisy" } }
};
```

**Using Select**

```csharp
var result = classes.Select(c => c.Students);

foreach (var group in result)
{
    Console.WriteLine(string.Join(", ", group));
}
```

**Output:**

```
John, Alice
Bob, Daisy
```

Here you get a collection of arrays (nested structure).

**Using SelectMany**

```csharp
var result = classes.SelectMany(c => c.Students);

foreach (var student in result)
{
    Console.WriteLine(student);
}
```

**Output:**

```
John
Alice
Bob
Daisy
```

:::tip Explanation
`.SelectMany()` flattens all the inner collections into a single list.
:::

### Example 2: Selecting with Transformation

You can flatten and project together:

```csharp
var result = classes.SelectMany(
    c => c.Students,
    (c, student) => new { c.ClassName, StudentName = student }
);
```

**Output:**

```
Class A - John
Class A - Alice
Class B - Bob
Class B - Daisy
```

## 3.5 Combining where, select, and let

### Example

```csharp
var result = from s in students
             let grade = s.Marks >= 75 ? "A" : "B"
             where s.Marks >= 60
             orderby s.Marks descending
             select new { s.Name, s.Marks, grade };
```

**Output:**

```
John - 80 - A
Alice - 70 - B
Bob - 60 - B
```

:::info Explanation
- `let` creates a grade.
- `where` filters passing students.
- `orderby` sorts.
- `select` shapes final output.
:::

## 3.6 Real-World Example: Students and Subjects

```csharp
var students = new[]
{
    new { Name = "John", Subjects = new[] { "Math", "Science" } },
    new { Name = "Alice", Subjects = new[] { "Math", "History" } },
    new { Name = "Bob", Subjects = new[] { "English", "Science" } }
};
```

### Flatten All Subjects with Student Names

```csharp
var result = students.SelectMany(
    s => s.Subjects,
    (s, subject) => new { s.Name, Subject = subject }
);
```

**Output:**

```
John - Math
John - Science
Alice - Math
Alice - History
Bob - English
Bob - Science
```

## 3.7 Summary

| Concept | Query Syntax | Method Syntax | Description |
|---------|--------------|---------------|-------------|
| Projection | `select` | `.Select()` | Choose what data to return |
| Temporary Variable | `let` | (no direct equivalent) | Define calculated field |
| Flatten Nested Collections | — | `.SelectMany()` | Flatten nested lists |
| Transformation | `select new {}` | `.Select(x => new {})` | Create new data shape |

## 3.8 Practice Exercises

### Given Data

```csharp
var employees = new[]
{
    new { Name = "John", Projects = new[] { "App", "API" } },
    new { Name = "Alice", Projects = new[] { "Web", "Mobile" } },
    new { Name = "Bob", Projects = new[] { "Desktop", "API" } }
};
```

### Tasks

1. Select only employee names.
2. Create a new object `{ Name, ProjectCount }` using `select new`.
3. Flatten all projects (show employee name and project name) using `SelectMany()`.
4. Using `let`, assign a variable `IsAPI = true` if project list contains "API", and show `{ Name, IsAPI }`.

:::tip Challenge
Try solving these exercises on your own before moving to the next chapter!
:::