---
type: blog
status: published
title: Git remove file from not last commit
published_date: 2022-10-11T20:35:07.322Z
author: jacopo-marrone
crossposted_url: https://dev.to/tresorama/git-remove-file-from-not-last-commit-2nh4
---
## CAUTION

**Before continue we need to understand that this will break the Git history.**

This means that after the fact, in case the commit in question was already pushed you will need to overwrite it with `git push --force`, and every repo co-worker will need to `git pull --force`.

## Git and Ethereum, somewhat similar

Git has a chain of commits, called **history**.
Ethereum/Bitcoin has a chain of blocks, called **blockchain**.

Every commit (Git) or block (Ethereum) has a parent commit/block, so when you ***edit*** a block/commit you will change also its children.

Only what precedes the ***changed*** commit/block remains identical, all that follows will be a new ***thing***.

This it's why they say **"Git rebase rewrites history"**.

Note that in practice is not possibile to ***edit*** a commit, you can only overwriting it with a different version of it.

Git History and blockchain are both immutable.

## Going back to our problem

My problem is that i've scraped some date on the Web and saved this data on a .json file, this file size is 220MB, and Github let us upload files with a limit of 100MB per file.

> remote: error: File XXX is 220.00 MB; this exceeds GitHub's file size limit of 100 MB

But i became aware of that only when i tried to push the repo.
So i need to remove that file from my Git history.

## Git History

This is the Git History of this example.

```bash
e6cfcb4 (HEAD -> main) build: update docs about docker adminer # OK
d817a6c feat(api): get-XXX-by-id now use internal data         # OK
9176b01 feat: seed database with scraped data  # 👈 WRONG ONE
c1301d1 build: install ts-node for running scripts             # OK
8c26fd5 feat: add XXX model to db                              # OK
e51acdb refactor: folder structure                             # OK
e0f1c7f build: add env.example                                 # OK
a7d7e34 feat: vote persists in db                              # OK
f32d6c4 build: imported shadow-database docker instance        # OK
987a245 build: implement prisma with first migration           # OK
...
```

We need to :

- keep all commit previous to `9176b01`
- edit `9176b01` commit , removing the unwanted file
- commit a new version of `9176b01` with changes
- recreate all untouched commits after `9176b01`

## Git rebase interactive

I could be wrong if i say that this is the only way to resolve this problem, I am only a regular developer that stackoverflows when need some help, like all of us 😎.

> If you know other solutions or has suggestions write them in the comments !

Anyway, let's start.

## Start

As a recap, the ***wrong*** commit is `9176b01`,
and last commit before the wrong one is `c1301d1`.

```bash
# Start rebasing from last correct commit
git rebase -i c1301d1
```

Git will ask instruction on the rebase process.

```bash
pick 9176b01 feat: seed database with scarped data
pick d817a6c feat(api): get-XXX-by-id now use internal data
pick e6cfcb4 build: update docs about docker adminer

# Rebase c1301d1..e6cfcb4 onto c1301d1 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
```

We must tell Git which commit we want to preserve and which ones we want to edit.
So we tell Git we want to edit `9176b01` by swapping `pick` with `edit`.

```bash
edit 9176b01 feat: seed database with scarped data
pick d817a6c feat(api): get-XXX-by-id now use internal data
pick e6cfcb4 build: update docs about docker adminer

# Rebase c1301d1..e6cfcb4 onto c1301d1 (3 commands)
#
# Commands:
# ...
```

Save with `:wq` and Git tell us

```bash
Stopped at 9176b01...  feat: seed database with scraped data
You can amend the commit now, with

  git commit --amend 

Once you are satisfied with your changes, run

  git rebase --continue
```

Now if we `git log --oneline`, we see that our last commit is the wrong one, we are back at that point.

Let's remove the unwanted file, by

```bash
rm path/to/unwanted-file
```

> Tip:  
> If you want to keep the file but undo changes made by this ***wrong commit*** use `git show path/to/changed-file | git apply -R` instead of `rm path/to/file`
>
> In this example both command produces that same effect because the file didn't exists before this commit, so undo is same as delete.

Add changes to staging area with

```bash
git add path/to/unwanted-file
```

and

```bash
git commit --amend
```

Edit the commit message if you want and confirm with `:wq`.

Then complete the rebase

```bash
git rebase --continue
```

Voilà !  
Now we have rewritten the Git history from that point.

## Conclusion

I write articles mainly to help future myself or to help the growth of tools I use in my work.

If this article was helpful to you leave a like.

Would you like me to talk about a particular topic ?  
Tell me in the comments !
