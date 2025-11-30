---
sidebar_position: 16
title: Working with JSON & XML
description: Master JSON and XML in SQL Server including OPENJSON, FOR JSON, XML nodes, value(), query(), and data shredding
keywords: [SQL Server, JSON, XML, OPENJSON, FOR JSON, JSON_VALUE, JSON_QUERY, XML nodes, XQuery, data parsing]
---

# Chapter 16: Working with JSON & XML in SQL Server

> **Topics Covered:** JSON functions, OPENJSON, FOR JSON, XML nodes, value(), query(), exist(), shredding

---

## 16.1 Introduction

Modern applications exchange data as:

- **JSON** (most common)
- **XML** (banking, enterprise, SOAP services)

SQL Server has built-in support for:

- Parsing JSON
- Constructing JSON
- Querying JSON
- XML shredding
- XML querying

---

## PART A — JSON in SQL Server

:::info
SQL Server (2016+) fully supports JSON.
:::

---

## 16.2 JSON Basics

SQL Server treats JSON as `NVARCHAR`, not as a separate data type.

### Example JSON

```json
{
  "Name": "Dipesh",
  "Age": 24,
  "Skills": ["SQL", "C#", "Vue"],
  "Address": {
    "City": "Nagpur",
    "Zip": 440001
  }
}
```

---

## 16.3 JSON_VALUE() — Extract a Simple Scalar Value

```sql
SELECT JSON_VALUE(@json, '$.Name') AS Name;
SELECT JSON_VALUE(@json, '$.Address.City') AS City;
```

:::note
- Returns only scalar (string, number)
- Cannot return objects or arrays
:::

---

## 16.4 JSON_QUERY() — Extract an Object or Array

```sql
SELECT JSON_QUERY(@json, '$.Skills') AS SkillsArray;
SELECT JSON_QUERY(@json, '$.Address') AS AddressObject;
```

**Used for:**

- Arrays
- Objects
- Nested structures

---

## 16.5 JSON_MODIFY() — Update JSON

```sql
SET @json = JSON_MODIFY(@json, '$.Age', 25);
SET @json = JSON_MODIFY(@json, '$.Address.City', 'Mumbai');
```

**You can:**

- Update
- Insert
- Delete

---

## 16.6 OPENJSON — Convert JSON to Table (Shredding)

### Example JSON Array

```json
[
  { "ID": 1, "Name": "Amit" },
  { "ID": 2, "Name": "Ravi" }
]
```

### Parse with OPENJSON

```sql
SELECT *
FROM OPENJSON(@json)
WITH (
   ID INT '$.ID',
   Name NVARCHAR(50) '$.Name'
);
```

:::important
This is extremely powerful — one of the most asked interview questions.
:::

---

## 16.7 OPENJSON without WITH Clause

```sql
SELECT *
FROM OPENJSON(@json);
```

**Returns:**

- key
- value
- type

---

## 16.8 OPENJSON with CROSS APPLY (Heavy Use in APIs)

### Example

```sql
SELECT e.ID, x.Skill
FROM Employees e
CROSS APPLY OPENJSON(e.Skills) 
     WITH (Skill NVARCHAR(50) '$') x;
```

---

## 16.9 Generate JSON using FOR JSON

### Example

```sql
SELECT EmpID, EmpName, Salary 
FROM Employees
FOR JSON AUTO;
```

### FOR JSON PATH

Allows full control of nested structures.

### Example

```sql
SELECT 
   EmpID AS 'id',
   EmpName AS 'name',
   (
       SELECT DeptName, Location
       FROM Departments d 
       WHERE d.DeptID = e.DeptID
       FOR JSON PATH
   ) AS 'department'
FROM Employees e
FOR JSON PATH;
```

:::tip
Produces nested JSON like APIs return.
:::

---

## 16.10 Validate JSON

```sql
SELECT ISJSON(@json);
```

**Returns:**

- `1` = valid
- `0` = invalid

---

## PART B — XML in SQL Server

XML has dedicated data type `XML`.

---

## 16.11 XML Basics

```xml
<Employee>
   <Name>Dipesh</Name>
   <Age>24</Age>
   <Skills>
      <Skill>SQL</Skill>
      <Skill>C#</Skill>
   </Skills>
</Employee>
```

**SQL Server can:**

- Query XML
- Extract values
- Use XPath
- Shred XML into rows

---

## 16.12 XML Value() — Extract Scalar

### Example

```sql
SELECT @xml.value('(/Employee/Name/text())[1]', 'VARCHAR(50)');
```

---

## 16.13 XML Query() — Return XML Fragment

```sql
SELECT @xml.query('/Employee/Skills');
```

---

## 16.14 XML Nodes() — Convert XML into Table Rows

### Example XML

```xml
<Skills>
  <Skill>SQL</Skill>
  <Skill>C#</Skill>
  <Skill>Vue</Skill>
</Skills>
```

### Parse XML into Rows

```sql
SELECT A.X.value('(text())[1]', 'VARCHAR(50)') AS Skill
FROM @xml.nodes('/Skills/Skill') AS A(X);
```

:::important
Very important interview topic.
:::

---

## 16.15 XML Exist() — Check Existence of a Node

```sql
SELECT @xml.exist('/Employee/Age');
```

**Returns:**

- `1` = exists
- `0` = does not exist

---

## 16.16 Storing XML in Tables

```sql
ALTER TABLE Employees 
ADD ProfileXML XML;
```

---

## 16.17 Indexing XML

For large XML columns:

```sql
CREATE PRIMARY XML INDEX IX_Profile ON Employees(ProfileXML);
```

:::tip
Speeds up XML queries.
:::

---

## PART C — JSON vs XML

| Feature | JSON | XML |
|---------|------|-----|
| **Format** | Lightweight | Verbose |
| **Usage** | APIs, web apps | Enterprise & legacy |
| **Native Type** | NVARCHAR | XML |
| **Querying** | JSON_VALUE, OPENJSON | XQuery, value(), nodes() |
| **Speed** | Faster for modern apps | Slower |
| **Schema** | No schema enforced | Can enforce XSD |
| **Nesting** | Easy | Complex |

---

## PART D — Real-World Examples

### 16.18 Store Multiple Addresses in JSON

```sql
CREATE TABLE Users (
    UserID INT,
    Addresses NVARCHAR(MAX)  -- JSON
);
```

---

### 16.19 Parse JSON in API-based Backend

**Structure from API:**

```json
{
   "filters": {
      "minSalary": 30000,
      "department": "IT"
   }
}
```

**SQL:**

```sql
DECLARE @json NVARCHAR(MAX) = @input;

SELECT *
FROM Employees
WHERE Salary >= JSON_VALUE(@json, '$.filters.minSalary')
  AND Dept = JSON_VALUE(@json, '$.filters.department');
```

---

### 16.20 Convert Table to JSON for API Response

```sql
SELECT EmpID, EmpName, Salary 
FROM Employees
FOR JSON PATH, ROOT('Employees');
```

---

## 16.21 Interview Questions

### Q1: What is OPENJSON?

A table-valued function that parses JSON into rows and columns.

### Q2: Difference between JSON_VALUE and JSON_QUERY?

| Function | Returns |
|----------|---------|
| `JSON_VALUE` | Scalar |
| `JSON_QUERY` | Array/Object |

### Q3: What is FOR JSON PATH?

Used to create custom/nested JSON output ideal for APIs.

### Q4: How to update JSON inside SQL Server?

Using `JSON_MODIFY`.

### Q5: XML value() vs nodes()?

- **value()** → scalar
- **nodes()** → rowset

### Q6: JSON vs XML which is faster?

JSON, due to lighter structure and simpler parsing.

### Q7: Does SQL Server store JSON natively?

No — JSON is stored as `NVARCHAR`.

### Q8: Does SQL Server store XML natively?

Yes — `XML` data type with indexing support.

---

## 16.22 Summary

| Concept | Summary |
|---------|---------|
| **JSON_VALUE** | Extract scalar |
| **JSON_QUERY** | Extract array/object |
| **JSON_MODIFY** | Update JSON |
| **OPENJSON** | Convert JSON → table |
| **FOR JSON PATH** | Create JSON output |
| **XML.value** | Extract scalar |
| **XML.nodes** | Convert XML → table |
| **XML.exist** | Check node existence |
| **XML Index** | Speeds XML queries |

---

## 16.23 Next Chapter Preview

**Next: Chapter 17 — Full-Text Search, Spatial Data & Other Specialized Features**

We will cover:

- Full-Text Index
- CONTAINS / FREETEXT
- Spatial Data Types (Geometry, Geography)
- HierarchyID
- Advanced specialized features
