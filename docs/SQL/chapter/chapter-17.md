---
sidebar_position: 17
title: Full-Text Search, Spatial Data & Specialized Features
description: Master SQL Server Full-Text Search, Spatial Data types (Geometry/Geography), HierarchyID, and specialized features
keywords: [SQL Server, full-text search, CONTAINS, FREETEXT, spatial data, geometry, geography, HierarchyID, columnstore, filestream]
---

# Chapter 17: Full-Text Search, Spatial Data & Specialized Features

> **Topics Covered:** Full-Text Indexing, CONTAINS, FREETEXT, Geometry/Geography types, HierarchyID

---

## PART A — FULL-TEXT SEARCH (FTS)

Full-Text Search allows SQL Server to perform fast, intelligent text searching beyond simple `LIKE '%word%'`.

**Useful for:**

- Search bars
- E-commerce search
- Knowledge bases
- Matching phrases
- Ranking results

---

## 17.1 What is Full-Text Search?

:::tip Interview Definition
Full-Text Search (FTS) is a specialized indexing feature in SQL Server that allows fast searching of text data using linguistic rules, not simple string matching.
:::

**FTS supports:**

- Word-based search
- Inflections ("run", "running", "ran")
- Synonyms via Thesaurus
- Ranking (based on relevance)
- Phrase searching

---

## 17.2 Creating Full-Text Search Components

FTS requires:

- Full-Text Catalog
- Full-Text Index

### Step 1 — Create Full-Text Catalog

```sql
CREATE FULLTEXT CATALOG ProductCatalog;
```

### Step 2 — Create Full-Text Index

```sql
CREATE FULLTEXT INDEX ON Products(ProductName)
KEY INDEX PK_Products
ON ProductCatalog;
```

:::note
FTS requires a unique index (usually primary key) as the key.
:::

---

## 17.3 FTS Search Functions

There are 2 major functions:

### A. CONTAINS

Searches for specific words or phrases.

#### Example

```sql
SELECT *
FROM Products
WHERE CONTAINS(ProductName, 'laptop');
```

#### Search EXACT Phrase

```sql
WHERE CONTAINS(ProductName, '"gaming laptop"')
```

#### Search ANY of the Words

```sql
WHERE CONTAINS(ProductName, '("fast" OR "lightweight")')
```

#### Search for Inflectional Forms

```sql
WHERE CONTAINS(ProductDescription, 'FORMSOF(INFLECTIONAL, run)');
```

:::info
Matches: run, running, ran.
:::

### B. FREETEXT

Natural-language search.

```sql
WHERE FREETEXT(ProductDescription, 'powerful laptop');
```

:::tip
Picks relevant matches even if exact words don't appear.
:::

---

## 17.4 Ranking Results with FTS

Useful for search engines:

```sql
SELECT ProductName, ProductDescription, KEY_TBL.RANK
FROM FREETEXTTABLE(Products, ProductDescription, 'gaming laptop') AS KEY_TBL
JOIN Products p ON p.ProductID = KEY_TBL.[KEY]
ORDER BY KEY_TBL.RANK DESC;
```

---

## PART B — SPATIAL DATA (Geometry & Geography)

Spatial types are used for:

- Maps
- GPS
- Location search
- Distance calculations
- Geofencing
- Logistics apps

SQL Server supports two spatial types:

| Type | Use |
|------|-----|
| `geometry` | Flat (2D) coordinate system |
| `geography` | Round-earth systems (GPS, latitude, longitude) |

---

## 17.5 GEOMETRY DATA TYPE (2D)

### Example: Storing a Point

```sql
DECLARE @g geometry = geometry::Point(10, 20, 0);
SELECT @g.ToString();
```

### Creating Spatial Table

```sql
CREATE TABLE Locations (
   ID INT IDENTITY,
   Shape geometry
);
```

### Insert a Polygon (Area)

```sql
INSERT INTO Locations(Shape)
VALUES (geometry::STPolyFromText('POLYGON((0 0, 0 5, 5 5, 5 0, 0 0))', 0));
```

### Spatial Methods

| Method | Description |
|--------|-------------|
| `STArea()` | Area of polygon |
| `STLength()` | Length of line |
| `STDistance()` | Distance between shapes |
| `STContains()` | Whether shape contains another |
| `STWithin()` | Whether shape is inside another |

#### Example

```sql
SELECT @poly.STArea();
```

---

## 17.6 GEOGRAPHY DATA TYPE (GPS / Round Earth)

**Used for:**

- Latitude/Longitude
- Real-world distances (KM, miles)

### Store a GPS Coordinate

```sql
DECLARE @loc geography = geography::Point(19.0760, 72.8777, 4326);
SELECT @loc.ToString();
```

### Distance Between Two Points

```sql
SELECT loc1.STDistance(loc2) / 1000 AS DistanceInKM;
```

### Find Nearby Locations

```sql
SELECT Name
FROM Places
WHERE GeoPoint.STDistance(@myLocation) < 1000;  -- within 1km
```

---

## PART C — HIERARCHYID

HierarchyID stores tree structures, useful for:

- Organization charts
- Folder trees
- Category trees
- Nested menus

---

## 17.7 What is HierarchyID?

:::tip Interview Definition
`hierarchyid` is a SQL Server data type optimized for storing hierarchical data such as parent-child or tree structures.
:::

### Example: Category Tree

#### Create Table

```sql
CREATE TABLE Categories (
   CategoryID INT IDENTITY,
   Node hierarchyid,
   CategoryName VARCHAR(50)
);
```

#### Add Root

```sql
INSERT INTO Categories (Node, CategoryName)
VALUES (hierarchyid::GetRoot(), 'Electronics');
```

#### Add Children

```sql
INSERT INTO Categories (Node, CategoryName)
VALUES ((SELECT Node.GetDescendant(NULL, NULL) 
         FROM Categories 
         WHERE CategoryName='Electronics'), 'Mobiles');
```

### HierarchyID Functions

| Function | Description |
|----------|-------------|
| `GetAncestor()` | Move up tree |
| `GetDescendant()` | Add child |
| `ToString()` | Return path-like string |
| `GetLevel()` | Depth in tree |

---

## PART D — OTHER SPECIALIZED FEATURES

### 17.8 FILESTREAM

**Used for storing:**

- PDFs
- Images
- Videos
- Files > 2MB

Stored in Windows file system but managed by SQL Server.

---

### 17.9 COLUMNSTORE INDEXES

**Used in:**

- Data warehouses
- Large analytical queries
- Reporting systems

Provides massive compression and performance.

---

### 17.10 IN-MEMORY OLTP (Memory-Optimized Tables)

**Used for:**

- High frequency writes
- Low-latency OLTP
- High concurrency workloads

---

## 17.11 Interview Questions

### Q1: Difference between CONTAINS and FREETEXT?

- **CONTAINS** → precise matching
- **FREETEXT** → natural language search

### Q2: What is a Full-Text Index?

A special index that accelerates text searching using linguistic rules.

### Q3: Geometry vs Geography?

| geometry | geography |
|----------|-----------|
| 2D | Round-earth |
| Fast | Accurate for earth coordinates |

### Q4: What is hierarchyID?

Data type for storing hierarchical structures.

### Q5: What is STDistance()?

Returns distance between geography/geometry objects.

### Q6: When to use Full-Text Search?

- Search engines
- Product search
- Document search

---

## 17.12 Summary

| Feature | Purpose |
|---------|---------|
| **Full-Text Index** | Fast word/phrase search |
| **CONTAINS** | Exact word/phrase |
| **FREETEXT** | Natural search |
| **geometry** | 2D coordinates |
| **geography** | GPS, real earth |
| **HierarchyID** | Parent-child trees |
| **Columnstore** | High-speed analytics |
| **FileStream** | Large files storage |

---

## 17.13 Next Chapter Preview

**Next: Chapter 18 — Backups, Restore, High Availability**

Topics include:

- Full / Differential / Log backups
- Recovery Models
- RESTORE strategies
- AlwaysOn Availability Groups (high-level)
- Best practices
