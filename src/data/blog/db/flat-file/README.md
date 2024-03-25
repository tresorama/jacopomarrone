# Datasource - Flat File in Disk

## Overview

When you are initializing the project you:
- Define your blog post front-matter custom fields schema
- Code in React to customize appearance.

When you have a new blogpost to add:
- Create a new `.md` file inside a specific folder.
- Re-Deploy

## Configuration

You should have completed the "datasource agnostic" initial setup and be redirected here to perform additional configiration.  
In case you did't , [start here](../../../../../README.md).

### Additional Configration

#### Overview

1. Install needed packages
2. Create a blogpost folder

#### 1. Install needed Packages

```bash
yarn add gray-matter
```

These are versions used when creating this project

```json
"gray-matter": "^4.0.3",
```

#### 2. Create a blogpost folder

Move `src/utils/blog/db/flat-file/example/blog-contents` directory to `src`.  
At the end you will have `src/blog-contents`.  
Inside that folder you have some example of blog post to start with.  
