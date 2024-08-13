---
type: blog
status: published
title: Essential CLI commands
description: Useful list of CLI commands to get you started
featured_image: null
published_date: 2024-03-25T16:26:53.078Z
author: jacopo-marrone
crossposted_url: https://dev.to/tresorama/essential-cli-commands-2nn3
---

## Terminal vs Shells

[Terminal and shells are not the same things](/blog/terminal-vs-shell), even if they are used as synonymous.  
Command must be written in the syntax expected by your shell.  
This article is written for `zsh` shell, the one I'm using in my Mac.

## CLI General Reminders

- **File extensions are not necessary** for "doing things", extensions are used to mark which format the information is written in.
  Outside CLI context, extensions are used by the OS to pick an appropriate Application and use it to open a file.
  In CLI context they "are just the final part of the file name", so when you create a script file it's good practice to include an extension that indicate that is a script (`.sh` `.command` `.script`)
- **Which folder you are in does not count**, but :
  - when referencing file path using a "relative" approach, the starting point is your current folder (knows as `cwd`, current working directory)
  - when referencing file path using a "relative" approach, it is irrelevant.

## Commands

Here is a list of essential CLI commands for your daily tasks...

### Print absolute path of current directory

```bash
# pwd (print working directory)
pwd
```

### Show files/folder of a directory

```bash
# show files of current directory
ls
# show files of other directory
ls path/to/directory
# show as list (easily scannable)
ls -l
# include hidden files
ls -a
```

### Show the file tree of a directory

```bash
# Install the "tree" command if on MacOS
brew install tree
```

```bash
# show tree with depth level = 1
tree -L 1

# output
.
├── Summer_Forest.mp4
├── dummy-assets
├── prove
├── text.txt
└── screenshot
```

```bash
# show tree with depth level = 2
tree -L 2

# output
.
├── Summer_Forest.mp4
├── dummy-assets
│   ├── artist
│   ├── images
│   └── travel
├── prove
│   ├── Schermata 2023-07-16 alle 20.33.14.png
│   ├── Schermata 2023-07-16 alle 20.33.22.png
│   ├── Schermata 2023-09-14 alle 21.56.02.png
│   ├── Schermata 2024-01-21 alle 17.56.25.png
│   ├── Schermata 2024-01-24 alle 21.57.38.png
│   ├── Schermata 2024-02-09 alle 18.39.27.png
│   ├── Schermata 2024-02-09 alle 18.39.54.png
│   ├── Schermata 2024-02-09 alle 18.55.26.png
│   ├── Schermata 2024-02-28 alle 10.39.45.png
│   ├── Schermata 2024-02-28 alle 13.06.00.png
│   ├── Schermata 2024-02-28 alle 14.41.22.png
│   ├── Schermata 2024-03-03 alle 16.29.49.png
│   ├── Schermata 2024-03-04 alle 17.11.15.png
│   ├── Schermata 2024-03-04 alle 18.05.51.png
│   ├── Schermata 2024-03-08 alle 17.50.21.png
│   ├── Schermata 2024-03-09 alle 15.36.57.png
│   └── Schermata 2024-03-11 alle 13.50.38.png
├── text.txt
└── screenshot
    ├── Schermata 2024-01-30 alle 17.28.04.png
    └── Schermata 2024-02-26 alle 14.52.17.png
```

### Go to a directory

Change current directory with provided one

```bash
# go to dir (named "dirName") that is child of current directory
cd dirName 
# go to dir (named "dirName") knowing its absolute path
cd /absolute/path/to/dirName
# go to parent directory
cd ..
# go to home directory
# in MacOS home directiry is /Users/your-name
cd ~
```

### Create a directory

```bash
# create a new directory named "dirName" as child of current dir
mkdir dirName
```

### Create a file

```bash
# create a new file named "fileName" as child of current dir
touch fileName
```

### Edit a file with a text editor

```bash
# with "nano" text editor
nano fileName.txt
# with "vs code" text editor
code fileName.txt
# with "vim" text editor
vi fileName.txt
# with "micro text editor
micro fileName.txt
```

### Open a file with the default app used by the OS

```bash
# open a file named "fileName" with OS default app
open fileName.png
```

### Show in Finder/File Explorer a directory

```bash
# show current dir (do not miss the dot)
open .
# show a dir using absolute path
open /abs/path/to/dir
```

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic?  
Tell me in the comments!
