---
type: blog
status: draft
slug: basic-scripting-in-cli
title: Basic Scripting in CLI
description: What is basic scripting in CLI and what you can do with it
featured_image: null
published_date: 2024-03-25T16:26:53.000Z
author: jacopo-marrone
crossposted_url: null
keywords:
  - cli
---

## CLI General Reminders

- **File extensions are not necessary** for "doing things", extensions are used to mark which format the information is written in.
  Outside CLI context, extensions are used by the OS to pick an appropriate Application and use it to open a file.
  In CLI context they "are just the final part of the file name", so when you create a script file it's good practice to include an extension that indicate that is a script (`.sh` `.command` `.script`)
- **Which folder you are in does not count**, but :
  - when referencing file path using a "relative" approach, the starting point is your current folder (knows as `cwd`, current working directory)
  - when referencing file path using a "relative" approach, it is ininfluent.

## Basic Scripting

The syntax depends on the `shell` you are using.  
Common shells are `bash` and `zsh`.

The shell is the "executable" that execute what you write. To learn more here is a [Terminal vs Shell](/blog/terminal-vs-shell) blog post.

## Strings

```bash
# create a variable named "msg" with "Hello John" as value
msg="Hello John" # double quotes ("works" with variables)
msg='Hello John' # alternative quotes (NOT "works" with variables)

# print it                         output
echo $msg                          # hello john
echo "$msg"                        # hello john
echo '$msg'                        # $msg
echo "msg values is $msg, bye"     # msg value is hello john , bye
echo "msg values is ${msg} , bye"  # msg value is hello john , bye
```

## Numbers

```bash
# create avariable named "count" with 0 as value
count=0

# increment it
count=$((count+10))
echo $count          # 10

# increment it
((count+=10))
echo $count          # 20

# print it
echo "Count is ${count} \!\!"
```

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic ?  
Tell me in the comments!
