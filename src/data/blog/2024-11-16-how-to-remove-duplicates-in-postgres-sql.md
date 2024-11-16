---
status: published
title: How to remove duplicates in Postgres SQL
slug: how-to-remove-duplicates-in-postgres-sql
description: Short guide on how to find duplicate data in a Postgres table and remove only duplicates
featured_image: ""
published_date: 2024-11-16T17:37:09.502Z
author: jacopo-marrone
crossposted_url: ""
fmContentType: blog
keywords:
  - duplicates
  - postgres
  - sql
---

## Our schema

```sql
create table "post" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);

create table "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
)

create table "post_like" (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES post(id),
  user_id INTEGER NOT NULL REFERENCES user(id)
)

```

Now we want to ensure that each user cannot like the same post more than once.
This can be prevented by:
- using a `unique` constraint on the pair `post_id` + `user_id` columns of the `post_like` table.
- or removing the `id` column of the `post_like` table and use a composite primary key on `post_id` + `user_id`

But, assuming we are at a point where duplicates are already there, we need to remove them.

## Check if there are duplicates

```sql
select 
  post_id, 
  user_id,
  count(*)
from post_like
group by post_id, user_id
having count(*) > 2
;

```

```md
| post_id | user_id | count |
| ------- | ------- | ----- |
| 3       | 2       | 2     |
```

This output tells us that user `2` has liked post `3` more than one time, specifically 2 times.

## Remove duplicates

Now that we know that there are duplicates, we can remove them.  
We split this process in two step:
- read duplicates
- remove duplicates (dry run)
- remove duplicates (real run)

**Read duplicates**

> **Transaction rollback**  
> To test our queries without removing real data, until we are sure the query is correct, we use the transaction `rollback` feature.  
> By doing this our query will never be committed, is similar to the
> "dry run" concept that you can find on other applications (like
> rsync).

> **CTE**  
> We use `CTE` because it provides a good DX.  
> With `CTE`, we can run a query, store the results in a temporary table, and then use the same table for subsequent queries.  
> This mental model is similar to what we usually do in coding by creating a temporary variable.  
> \
> The CTE syntax is 
> ```sql
>  with 
>  <cte_name> as (
>    <query>
>  ),
>  <cte_name_2> as (
>    <query_2> -- here we can refernce <cte_name>
>  )
>  <final_query> -- here we can refernce <cte_name> and <cte_name_2>
>  ```


With both transaction and CTE, we can do the following:

```sql
begin; -- start transaction

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
select *
from duplicates_info
;

rollback; -- ends transaction discarding every changes to the database 

```

```md
| group_index | id | post_id | user_id |
| ----------- | -- | ------- | ------- |
| 1           | 1  | 1       | 1       |
| 1           | 2  | 2       | 2       |
| 1           | 3  | 3       | 2       |
| 2           | 4  | 3       | 2       |
```

The latest row of results, where `group_index` is 2, means that this row is the second one in the group with post_id = 3 and user_id = 2.

> **What happens here with the syntax?**
> 
> `row_number() over (partition by ...) as group_index` is a window function that, first group rows by the columns in the `partition by` clause, and then assigns a number to each row, based on the index of the row in the group.  
> \
> `partition` is similar to `group by`, because it groups the rows by a common column, but if `group by` return only 1 row for each group, `partition` let us add new columns to the source table based on groups.
> \
> `group_index` is a column name alias, regular sql syntax.  


**Filter only duplicates**

Now let's keep only items with `group_index > 1`, which means that the row is not the first one in the group, or in other words, it is a duplicate.

```diff
begin; -- start transaction

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
select *
from duplicates_info
+ where group_index > 1
;

rollback; -- ends transaction discarding every changes to the database 
```

```md
| group_index | id | post_id | user_id |
| ----------- | -- | ------- | ------- |
| 2           | 4  | 3       | 2       |
```

We need to remove only this row, with id `4`.

**Remove duplicates - dry run**

Now rewite the final query so that we read from `post_like` table and not anymore from the cte `duplicates_info`.
We still use the cte `duplicates_info` to get the `id` of the duplicates.

```diff
begin; -- start transaction

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
- select *
- from duplicates_info
- where group_index > 1
+ select *
+ from post_like
+ where id in (
+  select id from duplicates_info
+  where group_index > 1
+ )
;

rollback; -- ends transaction discarding every changes to the database 
```
We will see the records that we want to remove.  
After we checked that they are correct, we swap `select` with `delete`.

```diff
begin; -- start transaction

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
- select *
+ delete
from post_like
where id in (
 select id from duplicates_info
 where group_index > 1
)
+ returning * -- will output deleted rows
;

rollback; -- ends transaction discarding every changes to the database 
```

This last query is what we finally want to execute.  
But becuase we still have `rollback` statement, these chhanges are simulated, and not applied to the database.

**Remove duplicates - real run**

Finally we can remove the duplicates for real.
Here we use `commit` instead of `rollback`, so that the changes are applied to the database.

```diff
begin; -- start transaction

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
delete
from post_like
where id in (
 select id from duplicates_info
 where group_index > 1
)
returning * -- output deleted rows
;

- -- ends transaction discarding every changes to the database 
- rollback; 

+ -- ends transaction applying changes to the database
+ commit; 
```



### Final Code

```sql
-- start transaction
begin; 

with
duplicates_info as (
  select
    row_number() over (
      partition by post_id, user_id order by user_id
    ) as group_index,
    id,
    post_id,
    user_id
  from post_like
)
delete
from post_like
where id in (
 select id from duplicates_info
 where group_index > 1
)
returning * -- output deleted rows
;

-- ends transaction discarding every changes to the database 
-- rollback; 

-- ends transaction applying changes to the database
commit; 
```