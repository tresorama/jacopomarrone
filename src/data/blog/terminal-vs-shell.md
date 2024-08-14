---
fmContentType: blog
status: published
title: Terminal vs Shell
published_date: 2024-03-25T15:26:53.078Z
author: jacopo-marrone
crossposted_url: https://dev.to/tresorama/terminal-vs-shell-39jk
---

Terminal and Shell are not the same things but are commonly used interchangeably to refer to the the same concept: **doing things with a CLI (command line interface).**

## Which is the difference between Terminal and Shell?

I like analogies to understand concepts, so when talking about Terminal and Shell these are what comes to my mind...

### Analogy with VideoGames Emulator

If you want to play old Pokemon games in 2024, you have 2 options

- Buy a Nintendo GameBoy Color/Advance and the game cartridge
- Download an Emulator software on your PC and download the game file (ROM)

Opting for the Emulator...

You launch the Emulator, you decide which Console simulate and then you launch the game you want to play.
Similarly, When you launch a Terminal, you decide which Shell execute and then launch your commands by typing with the keyboard.

An Emulator can execute multiple Consoles.
A Terminal can execute multiple Shells.

If Consoles are `GameBoy Color`, `GameBoy Advance`...  
Shells are `zsh`, `bash`...

### Analogy with Node and PHP

If you are familiar to **Javascript** and **Node.js** you know that you can "execute" js code by writing js code inside a file and then execute it by opening a Terminal and doing

```bash
node script.js
```

`node` is the executable that parse the `script.js`, interprets it and executes it.

Same things with **PHP**

```bash
php script.php
```

`php` is the executable that parse the `script.php`, interprets it and executes it.

Going back to Terminal vs Shell, you can think that when you do

```bash
echo 'a text portion'
```

under the hood this pseudo code happens

```bash
shell "echo 'a text portion'"
```

So the `shell` (like `node` and `php` in previous example) interprets and execute the code.

## Common Shells

Common shells in MacOS are `zsh`, and `bash`.  
Other shells are:

- `sh`
- `csh`
- `dash`
- `ksh`
- `tcsh`

## Which shell I'm using right now?

To check which shell is currently running you can run

```bash
echo $0
# output
zsh

# not working? try these
ps -p $$
```

## Which shells are installed?

To check which shells are installed you can run

```bash
cat /etc/shells

# output

# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

## How to change shell for current session?

To change which shell is currently running you can run

```bash
# launch a "bash" shell
bash

# print current running shell
echo $0 
# bash

# print default shell for current user
echo $SHELL
# /bin/zsh

# exit shell
exit
```

...or...

```bash
# launch a zsh shell
zsh

# print current running shell
echo $0 
# zsh

# print default shell for current user
echo $SHELL
# /bin/zsh

# exit shell
exit
```

As you noted, this will not change the default shell for your user, but it will change the shell for the current CLI session only.

## How to check and change default shell?

When you open the "Terminal" app on your OS, that programs launch the "shell" configured as default for your user.  
**Every user has a default shell defined.**

You can check which is the default shell for you user by running

```bash
echo "$SHELL"

# /bin/zsh

# In my case the default is "zsh", 
# and the binary/executable path for "zsh" is /bin/zsh.
```

Then list shells path that you can use with

```bash
cat /etc/shells

# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

And update the default shell with

```bash
# change to "sh" shell
chsh -s /bin/sh

# or, change to "bash" shell
chsh -s /bin/bash
```

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic?  
Tell me in the comments !
