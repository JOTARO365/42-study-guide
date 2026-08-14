/* English content for Python 101. Block count and key shape mirror
   data.py101.js index for index. */
window.TEACHING_EN = window.TEACHING_EN || {};

Object.assign(window.TEACHING_EN, {

  py_101: {
    principle: [
      { h: "Who this page is for" },
      { p: "Anyone who has never written Python — or never written any code at all. Every topic comes with something you can type in and run straight away, short enough to retype rather than copy." },
      { note: "The one rule of this page: **every topic ends with something you can run.** Reading the theory is not enough; you have to see your own output before any of it becomes real. Change a number in each example and run it again." },
      { h: "What Python is" },
      { p: "A language you **run directly** — no compilation step. You write a plain text file ending in `.py`, and Python reads it line by line from top to bottom." },
      { p: "That is what makes it good to start with: edit and run immediately, nothing in between, and error messages that name the line that broke." },
      { h: "What you need — two things" },
      { table: { head: ["Needed", "How to check"], rows: [
        ["Python itself, version 3.10 or later", "`python3 --version`"],
        ["Any text editor", "VS Code, nano, even Notepad"]
      ]}},
      { p: "No IDE, no notebook, no libraries to install. This whole page uses `python3` and a text file, nothing else." },
      { h: "Three ways to run Python" },
      { code: String.raw`# 1) the REPL — one line at a time, instant output, good for experiments
$ python3
>>> 2 + 3
5
>>> exit()

# 2) a file — what this page uses throughout
$ python3 hello.py

# 3) one-liner — handy for a quick check
$ python3 -c "print(2 + 3)"`,
        cap: "The REPL is for trying things; files are for real work", lang: "bash" },
      { h: "Your first program" },
      { code: String.raw`# hello.py
print("Hello, world!")
print("2 + 3 =", 2 + 3)`,
        cap: "hello.py", lang: "python" },
      { code: String.raw`$ python3 hello.py
Hello, world!
2 + 3 = 5`,
        cap: "The output you should get", lang: "bash" },
      { p: "`print()` is the only thing that shows you what your program is doing, and it stays your main debugging tool for a long time — when you cannot tell what a variable holds, print it instead of guessing." },
      { h: "What Python skips" },
      { code: String.raw`# a line starting with # is a comment; Python ignores it
price = 100  # it can also follow code

"""
Triple quotes are a multi-line string.
Put one at the top of a file or a function and it becomes documentation.
"""`,
        cap: "Comments say why, not what", lang: "python" },
      { h: "Where this page takes you" },
      { table: { head: ["Tab", "What you get"], rows: [
        ["Values, Types, Names", "numbers, text, variables, and the single most misunderstood idea: a variable is a name, not a box"],
        ["Conditions, Loops, Functions", "making the program decide, repeat, and split into named pieces"],
        ["Data Structures", "lists, dicts, tuples, sets — holding many things, and picking the right kind"],
        ["Errors, Files, Imports", "reading a traceback, catching errors, and splitting a program across files"],
        ["Classes & A Real Program", "classes, type hints, and one complete program that passes the 42 gate"],
        ["Beginner Traps", "16 mistakes everyone makes, in the order they usually happen"]
      ]}},
      { p: "Finish this page and you can go straight to **Python Modules 00–04** — the first 42 subject uses nothing beyond this page's first four tabs." }
    ],

    theory: [
      { h: "Values have types, and the type decides what you can do" },
      { table: { head: ["Type", "Examples", "Holds"], rows: [
        ["`int`", "`42`, `-7`, `0`", "whole numbers, unlimited size"],
        ["`float`", "`3.14`, `-0.5`, `2.0`", "numbers with a decimal part"],
        ["`str`", "`\"hello\"`, `'a'`", "text"],
        ["`bool`", "`True`, `False`", "true or false (capital T and F)"],
        ["`None`", "`None`", "no value — different from 0 and from an empty string"]
      ]}},
      { code: String.raw`print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("42"))      # <class 'str'>
print(type(True))      # <class 'bool'>
print(type(None))      # <class 'NoneType'>`,
        cap: "You can ask Python what something is instead of guessing", lang: "python" },
      { note: "`type(x)` and `dir(x)` are not advanced topics, they are how you teach yourself — `dir(\"abc\")` lists everything a string can do." },
      { h: "A variable is a name, not a box" },
      { p: "Get this wrong at the start and you will be confused for months. In some languages a variable is a box holding a value; in Python **a variable is a label stuck onto an object**." },
      { code: String.raw`a = [1, 2]
b = a           # no copy — a second label on the same list
b.append(3)

print(a)        # [1, 2, 3]   <- a changed too: same object
print(a is b)   # True        <- literally the same object
print(id(a) == id(b))   # True`,
        cap: "Two labels, one object", lang: "python" },
      { code: String.raw`a = [1, 2]
b = a.copy()    # or list(a) or a[:]
b.append(3)

print(a)        # [1, 2]      <- independent now
print(a is b)   # False`,
        cap: "If you want a second one, ask for a copy", lang: "python" },
      { p: "Picture that once and nearly every \"my data changed by itself\" bug disappears, including the mutable-default-argument trap in the last tab." },
      { h: "Changeable and unchangeable" },
      { table: { head: ["Mutable — changed in place", "Immutable — cannot be changed"], rows: [
        ["`list`, `dict`, `set`", "`int`, `float`, `str`, `bool`, `tuple`"],
        ["`items.append(4)` changes the original", "`name.upper()` builds a new one; the original does not move"]
      ]}},
      { code: String.raw`name = "somchai"
name.upper()            # <- computed and thrown away; nothing happens
print(name)             # somchai

name = name.upper()     # <- you have to take the result
print(name)             # SOMCHAI`,
        cap: "The quietest beginner bug: calling a method and dropping the result", lang: "python" },
      { h: "Numbers and arithmetic" },
      { code: String.raw`print(7 + 2)    # 9
print(7 - 2)    # 5
print(7 * 2)    # 14
print(7 / 2)    # 3.5    <- / always gives a float
print(7 // 2)   # 3      <- // floors
print(7 % 2)    # 1      <- remainder
print(7 ** 2)   # 49     <- power

print(8 / 2)    # 4.0    <- not 4
print(-7 // 2)  # -4     <- floors, it does not truncate toward zero`,
        cap: "The last two lines are where people trip", lang: "python" },
      { note: "`0.1 + 0.2` does not equal `0.3` — not a Python bug, but binary fractions, which cannot hold those decimals exactly. Compare with a tolerance, and use the `decimal` module for money." },
      { h: "Text" },
      { code: String.raw`name = "Somchai"
age = 20

# f-string — the one to use; put an f before the quote
print(f"{name} is {age} years old")
print(f"next year: {age + 1}")     # expressions work inside
print(f"{3.14159:.2f}")            # 3.14 — two decimal places

# + concatenates, but both sides must be strings
print("age " + str(age))           # convert first`,
        cap: "f-strings read better and go wrong less often", lang: "python" },
      { code: String.raw`text = "  Hello World  "
print(text.strip())            # "Hello World"  trims both ends
print(text.strip().lower())    # "hello world"
print("a,b,c".split(","))      # ['a', 'b', 'c']
print("-".join(["a", "b"]))    # "a-b"
print("hello".replace("l", "L"))   # "heLLo"
print(len("hello"))            # 5
print("hello"[0])              # h    the first index is 0
print("hello"[-1])             # o    negative counts from the end
print("hello"[1:4])            # ell  from 1 up to but not 4`,
        cap: "The string methods you will use most", lang: "python" },
      { h: "Reading user input — and everyone's first trap" },
      { code: String.raw`age = input("your age: ")
print(age + 1)      # TypeError: can only concatenate str (not "int") to str`,
        cap: "input() always returns a string, even when the user typed digits", lang: "python" },
      { code: String.raw`age = int(input("your age: "))
print(age + 1)      # works

# but if the user types "abc", the int() line raises
# handling that is in the Errors, Files, Imports tab`,
        cap: "Convert before you use it", lang: "python" },
      { h: "True and false" },
      { code: String.raw`print(5 > 3)        # True
print(5 == 5)       # True   <- == compares
print(5 != 3)       # True
print(5 >= 5)       # True

# and / or / not are words, not symbols
print(True and False)   # False
print(True or False)    # True
print(not True)         # False`,
        cap: "= assigns, == compares", lang: "python" },
      { p: "Python lets you use non-`bool` values in a condition. This is called **truthiness** — everything \"empty\" counts as false." },
      { table: { head: ["Counts as false", "Counts as true"], rows: [
        ["`0`, `0.0`", "every other number, including `-1`"],
        ["`\"\"` the empty string", "any string with something in it, including `\"0\"` and `\" \"`"],
        ["`[]`, `{}`, `set()` when empty", "any collection with at least one member"],
        ["`None`, `False`", "`True`"]
      ]}},
      { code: String.raw`items = []
if items:
    print("has items")
else:
    print("empty")          # <- this one runs

# better than len(items) > 0: shorter, and the standard idiom`,
        cap: "Use the collection itself in the condition", lang: "python" },
      { note: "`\"0\"` is true, because it is a string with one character in it, not the number zero — which is why you always convert before comparing." }
    ],

    foundations: [
      { h: "Indentation is the syntax, not a style choice" },
      { p: "Other languages use braces to say which block a line belongs to. Python uses **how far the line is indented**. Indent wrongly and the program either behaves wrongly or refuses to run." },
      { code: String.raw`score = 75

if score >= 50:
    print("passed")        # indented 4 spaces = inside the if
    print("well done")     # still inside
print("check complete")    # not indented = outside; always runs`,
        cap: "Four spaces is the standard", lang: "python" },
      { note: "Set your editor to insert **4 spaces** for the Tab key on day one. Mixing tabs and spaces produces a `TabError` you cannot see by looking, and it is the one error a beginner cannot debug alone." },
      { h: "if / elif / else" },
      { code: String.raw`score = 75

if score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"

print(f"grade {grade}")   # grade B`,
        cap: "Checked top to bottom; the first true one wins and the rest are skipped", lang: "python" },
      { p: "Order matters — put `score >= 60` first and someone with 75 gets a C, because that condition is true first." },
      { h: "while — repeat until the condition is false" },
      { code: String.raw`count = 1
while count <= 5:
    print(count)
    count = count + 1      # forget this line and it never ends
print("done")`,
        cap: "Something inside has to be able to make the condition false", lang: "python" },
      { code: String.raw`while True:
    answer = input("type quit to exit: ")
    if answer == "quit":
        break              # leave the loop immediately
    if answer == "":
        continue           # skip to the next round
    print(f"got: {answer}")`,
        cap: "break leaves the loop; continue skips the rest of this round", lang: "python" },
      { note: "If the program hangs, press **Ctrl+C** to stop it — then check whether the variable in the condition is actually being changed." },
      { h: "for — do something with each item" },
      { code: String.raw`for fruit in ["apple", "banana", "orange"]:
    print(fruit)

for letter in "abc":
    print(letter)

for number in range(5):        # 0 1 2 3 4 — starts at 0, stops before 5
    print(number)

for number in range(1, 5):     # 1 2 3 4 — stops before 5
    print(number)

for number in range(0, 10, 2): # 0 2 4 6 8 — in steps of 2
    print(number)`,
        cap: "range always stops before the last value", lang: "python" },
      { code: String.raw`print(list(range(1, 5)))   # [1, 2, 3, 4]`,
        cap: "When in doubt, wrap it in list() and look", lang: "python" },
      { code: String.raw`items = ["a", "b", "c"]

for index, item in enumerate(items):
    print(index, item)         # 0 a / 1 b / 2 c

names = ["Somchai", "Somying"]
ages = [20, 22]
for name, age in zip(names, ages):
    print(f"{name} is {age}")`,
        cap: "enumerate when you need the position, zip for two lists at once", lang: "python" },
      { h: "Functions — giving a block of code a name" },
      { code: String.raw`def greet(name):
    """Greet one person."""
    return f"Hello {name}"


message = greet("Somchai")
print(message)                 # Hello Somchai`,
        cap: "def defines it, return sends a value back", lang: "python" },
      { table: { head: ["Word", "Means"], rows: [
        ["`def`", "begins a function definition"],
        ["parameter", "the name in the brackets at definition — `name`"],
        ["argument", "the real value at the call — `\"Somchai\"`"],
        ["`return`", "sends a value back and ends the function immediately"],
        ["no `return`", "the function returns `None` automatically"]
      ]}},
      { code: String.raw`def add(a, b=10):          # b has a default
    return a + b

print(add(5))              # 15
print(add(5, 20))          # 25
print(add(b=1, a=2))       # 3   named arguments; order stops mattering`,
        cap: "Defaults and named arguments", lang: "python" },
      { note: "A function with no `return` returns `None`. `result = print(\"hi\")` leaves `result` as `None`, not as text — this is where the `NoneType` in so many error messages comes from." },
      { h: "Scope" },
      { code: String.raw`total = 0                  # a name at file level

def broken():
    total = total + 1      # UnboundLocalError
    return total

def works(current):
    return current + 1     # takes it in, gives it back, touches nothing outside

total = works(total)
print(total)               # 1`,
        cap: "Assign to an outer name anywhere in a function and Python treats it as local everywhere in that function", lang: "python" },
      { p: "A function that **takes values in and hands values back** is easier to test and harder to break than one that reaches out and edits things — a habit worth building from the start." },
      { h: "Putting it together" },
      { code: String.raw`def grade_of(score):
    """Turn a score into a grade."""
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    return "F"


scores = [95, 72, 65, 40]
for score in scores:
    print(f"{score} -> {grade_of(score)}")`,
        cap: "A function, conditions and a loop in ten lines", lang: "python" },
      { p: "Note the repeated `return` instead of `elif` — `return` ends the function immediately, and the shape reads well when each branch is short." },
      { note: "This tab and the previous one **cover the whole of Module 00** — its eight exercises are print, input, arithmetic, conditionals, loops and functions, and nothing more." }
    ],

    architecture: [
      { h: "Holding many things — pick the right kind" },
      { table: { head: ["Type", "Written", "Use when", "Changeable?"], rows: [
        ["`list`", "`[1, 2, 3]`", "ordered, duplicates allowed, add and remove", "yes"],
        ["`tuple`", "`(1, 2, 3)`", "a group that should not change, like a coordinate", "no"],
        ["`dict`", "`{\"a\": 1}`", "keys paired with values, looked up by key", "yes"],
        ["`set`", "`{1, 2, 3}`", "no duplicates, and asking whether something is in it", "yes"]
      ]}},
      { h: "list — ordered items" },
      { code: String.raw`items = ["a", "b", "c"]

print(items[0])          # a      first
print(items[-1])         # c      last
print(items[0:2])        # ['a', 'b']
print(len(items))        # 3

items.append("d")        # add at the end
items.insert(0, "z")     # insert at position 0
items.remove("b")        # remove the first item with this value
last = items.pop()       # take the last one off and use it
print(items)             # ['z', 'a', 'c']

print("a" in items)      # True   membership test
print(sorted([3, 1, 2])) # [1, 2, 3]  returns a new list
numbers = [3, 1, 2]
numbers.sort()           # sorts in place and returns None
print(numbers)           # [1, 2, 3]`,
        cap: "sorted() returns a new list; .sort() edits in place and returns None", lang: "python" },
      { note: "`numbers = numbers.sort()` leaves `numbers` as `None` — methods that change something in place return `None` on purpose, so you cannot mistake them for ones that hand you a new object." },
      { h: "dict — keys paired with values" },
      { code: String.raw`student = {"name": "Somchai", "age": 20}

print(student["name"])            # Somchai
print(student["email"])           # KeyError: 'email'
print(student.get("email"))       # None       no crash, but None
print(student.get("email", "-"))  # -          with a fallback

student["age"] = 21               # change an existing value
student["email"] = "a@b.c"        # add a new key
del student["email"]              # remove one

print("name" in student)          # True   tests keys, not values
print(list(student.keys()))       # ['name', 'age']
print(list(student.values()))     # ['Somchai', 21]

for key, value in student.items():
    print(f"{key}: {value}")`,
        cap: "Loop with .items() when you need both key and value", lang: "python" },
      { p: "A dict **remembers insertion order** since Python 3.7 — that property is what lets \"first one given wins\" work without storing the order separately, and it is exactly what Module 03 checks." },
      { h: "tuple — grouped and locked" },
      { code: String.raw`point = (3, 4)
x, y = point                 # unpack into two names
print(x, y)                  # 3 4

point[0] = 99                # TypeError — tuples cannot be changed

def min_max(numbers):
    return min(numbers), max(numbers)    # returning several values = a tuple

low, high = min_max([3, 1, 4])
print(low, high)             # 1 4`,
        cap: "Returning several values from a function is implicitly a tuple", lang: "python" },
      { h: "set — unique, and unordered" },
      { code: String.raw`numbers = [1, 2, 2, 3, 3, 3]
unique = set(numbers)
print(unique)                # {1, 2, 3}
print(len(unique))           # 3

a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)                 # {2, 3}     in both
print(a | b)                 # {1,2,3,4}  in either
print(a - b)                 # {1}        in a but not b

print(2 in a)                # True — fast even for a large set`,
        cap: "Use a set when all you care about is membership and uniqueness", lang: "python" },
      { note: "A set has **no guaranteed order** — anything printed from one must be `sorted()` first, or the output can differ between runs and your tests stop meaning anything." },
      { h: "Comprehensions — building a list from a list" },
      { code: String.raw`numbers = [1, 2, 3, 4, 5]

# the long way
squares = []
for n in numbers:
    squares.append(n * n)

# a comprehension — the same thing
squares = [n * n for n in numbers]
print(squares)                     # [1, 4, 9, 16, 25]

# with a filter
evens = [n for n in numbers if n % 2 == 0]
print(evens)                       # [2, 4]

# the same shape works for dicts and sets
lengths = {word: len(word) for word in ["ab", "abc"]}
print(lengths)                     # {'ab': 2, 'abc': 3}`,
        cap: "Read left to right: what to take, from where, what to keep", lang: "python" },
      { p: "A comprehension should read in one line. Once it nests twice or carries several conditions, go back to an ordinary loop — short and readable are not the same thing." },
      { h: "Generators — computed only when needed" },
      { code: String.raw`squares = (n * n for n in range(5))    # round brackets, not square

print(sum(squares))       # 30    <- walks to the end
print(sum(squares))       # 0     <- exhausted; usable once`,
        cap: "The quietest bug in Module 03", lang: "python" },
      { p: "A generator does not hold all its results in memory, which suits large data — but it can be walked **once**. Convert it to a list if you need to loop twice." },
      { h: "How to choose" },
      { table: { head: ["Question", "Use"], rows: [
        ["Order matters and duplicates are fine", "`list`"],
        ["Looked up by name rather than position", "`dict`"],
        ["Only membership matters, and no duplicates", "`set`"],
        ["A group of values that should not change", "`tuple`"]
      ]}},
      { note: "This tab is the whole of **Module 03 (Data Quest)** — its seven exercises are lists, dicts, sets, tuples, comprehensions and generators." }
    ],

    dataflow: [
      { h: "Reading a traceback" },
      { p: "A traceback is not an insult, it is a report of what happened where. **Read it bottom-up.**" },
      { code: String.raw`Traceback (most recent call last):
  File "app.py", line 12, in <module>
    main()
  File "app.py", line 8, in main
    print(total(numbers))
  File "app.py", line 4, in total
    return sum(values) / len(values)
ZeroDivisionError: division by zero`,
        cap: "An example traceback", lang: "text" },
      { table: { head: ["Line", "Tells you"], rows: [
        ["the last line", "**what went wrong** — `ZeroDivisionError: division by zero`"],
        ["the lines above it", "**where** — `app.py` line 4, inside `total`"],
        ["the rest", "**how it got there** — `main()` called `total()`"]
      ]}},
      { p: "When the error happens inside somebody else's library, look for the **last frame that is your own file** — that is where you handed it the wrong thing." },
      { h: "The errors you will meet, and what they mean" },
      { table: { head: ["Name", "Means"], rows: [
        ["`SyntaxError`", "unreadable — a missing bracket, quote or colon. Usually **before** the line it names"],
        ["`IndentationError` / `TabError`", "inconsistent indentation, or tabs mixed with spaces"],
        ["`NameError`", "a name that does not exist — a typo, or used before it was set"],
        ["`TypeError`", "the operation and the type disagree, e.g. `\"5\" + 1`"],
        ["`ValueError`", "the right type but an unusable value, e.g. `int(\"abc\")`"],
        ["`IndexError`", "a position past the end of a list"],
        ["`KeyError`", "that key is not in the dict"],
        ["`AttributeError`", "the object does not have that — usually it is not the type you think"],
        ["`ZeroDivisionError`", "division by zero"]
      ]}},
      { h: "Catching errors with try / except" },
      { code: String.raw`try:
    age = int(input("age: "))
except ValueError:
    print("please type a number")
else:
    print(f"next year: {age + 1}")     # runs when nothing was raised
finally:
    print("input finished")            # runs no matter what`,
        cap: "try / except / else / finally in full", lang: "python" },
      { note: "**Catch the narrowest thing that can actually happen.** `except ValueError` says you know what can go wrong; a bare `except Exception` swallows your own bugs along with it and hides them. This is what the whole of Module 02 is about." },
      { code: String.raw`def read_age(text):
    """Turn text into an age; return None when it cannot be used."""
    try:
        value = int(text)
    except ValueError:
        return None
    if value < 0:
        return None
    return value


print(read_age("20"))     # 20
print(read_age("abc"))    # None
print(read_age("-5"))     # None`,
        cap: "The shape that works in practice: catch it and return something the caller can handle", lang: "python" },
      { h: "Raising your own errors" },
      { code: String.raw`class TooYoungError(Exception):
    """Younger than the system accepts."""


def register(age):
    if age < 18:
        raise TooYoungError(f"age {age} is below the limit")
    return "registered"


try:
    print(register(15))
except TooYoungError as error:
    print(f"failed: {error}")`,
        cap: "raise to report; except as to read the message", lang: "python" },
      { h: "Files" },
      { code: String.raw`# writing — "w" replaces everything already there
with open("notes.txt", "w", encoding="utf-8") as handle:
    handle.write("first line\n")
    handle.write("second line\n")

# reading it all at once
with open("notes.txt", "r", encoding="utf-8") as handle:
    content = handle.read()
print(content)

# line by line — cheap on memory for a large file
with open("notes.txt", "r", encoding="utf-8") as handle:
    for line in handle:
        print(line.rstrip())      # rstrip drops the trailing \n

# appending without losing what is there
with open("notes.txt", "a", encoding="utf-8") as handle:
    handle.write("appended\n")`,
        cap: "Always pass encoding=\"utf-8\", or non-ASCII text breaks on some machines", lang: "python" },
      { p: "`with` closes the file automatically when the block ends — whether it ends with a `return`, with an error, or normally. That is why you should always use it, and it is what **Module 04 makes you write by hand** for three exercises, so you can see what it does for you." },
      { code: String.raw`try:
    with open("missing.txt", "r", encoding="utf-8") as handle:
        print(handle.read())
except FileNotFoundError:
    print("no such file")
except PermissionError:
    print("not allowed to read it")`,
        cap: "A file is the outside world — it can always fail", lang: "python" },
      { h: "Splitting a program across files" },
      { code: String.raw`# mathtools.py
def add(a, b):
    return a + b

PI = 3.14159`,
        cap: "mathtools.py", lang: "python" },
      { code: String.raw`# app.py — three ways to import
import mathtools
print(mathtools.add(1, 2))

from mathtools import add
print(add(1, 2))

from mathtools import add as plus
print(plus(1, 2))`,
        cap: "app.py", lang: "python" },
      { table: { head: ["Form", "What you get"], rows: [
        ["`import x`", "the module — reach things through `x.name`"],
        ["`from x import name`", "the function itself — call `name` directly"],
        ["`from x import name as other`", "the same thing under a different name in this file"]
      ]}},
      { note: "Never name a file after a standard module — your own `random.py` or `json.py` gets imported instead of the real one, and the resulting error makes no sense at all." },
      { h: "Taking values from the command line" },
      { code: String.raw`# args.py
import sys

print(sys.argv)          # ['args.py', 'a', 'b']  <- the first is the script
print(sys.argv[1:])      # ['a', 'b']             <- what the user typed

if len(sys.argv) < 2:
    print(f"usage: python3 {sys.argv[0]} <number>...")
    sys.exit(1)          # a non-zero exit code means it did not succeed

numbers = []
for text in sys.argv[1:]:
    try:
        numbers.append(int(text))
    except ValueError:
        print(f"skipping '{text}': not a number")
print(f"total {sum(numbers)}")`,
        cap: "$ python3 args.py 3 4 x  ->  skipping 'x' / total 7", lang: "python" },
      { p: "`sys.argv` is always a list of strings, exactly like `input()` — you convert them yourself every time. And `sys.argv[0]` is the script's name, not the first argument; what the user typed starts at index 1. This is how **Module 03 takes its parameters** and reports malformed ones without stopping." },
      { h: "What ships with Python already" },
      { code: String.raw`import math
print(math.sqrt(16))          # 4.0
print(math.floor(3.7))        # 3

import random
print(random.randint(1, 6))   # a number from 1 to 6
print(random.choice(["a", "b"]))

import datetime
print(datetime.date.today())

import json
print(json.dumps({"a": 1}))   # '{"a": 1}'`,
        cap: "Nothing to install; it is already there", lang: "python" },
      { h: "The __main__ guard" },
      { code: String.raw`def main():
    print("running")


if __name__ == "__main__":
    main()`,
        cap: "Run the file directly and it works; import it and you get only the definitions", lang: "python" },
      { p: "When a file is imported, `__name__` is the module's name rather than `\"__main__\"`, so this guard lets one file be both a program and a library — and it is a question asked at the Module 01 evaluation." }
    ],

    implementation: [
      { h: "Classes — data and behaviour kept together" },
      { p: "When you have several dicts with the same keys, and several functions that all take one of those dicts as their first argument, that is the signal it should be a class." },
      { code: String.raw`class Student:
    """One student."""

    def __init__(self, name, age):
        """Build a new student — runs when Student(...) is called."""
        self.name = name
        self.age = age
        self.scores = []

    def add_score(self, score):
        """Record one score."""
        self.scores.append(score)

    def average(self):
        """Average score; 0.0 when there are none yet."""
        if not self.scores:
            return 0.0
        return sum(self.scores) / len(self.scores)


student = Student("Somchai", 20)
student.add_score(80)
student.add_score(90)
print(f"{student.name} averages {student.average()}")   # Somchai averages 85.0`,
        cap: "self is the instance itself, and is the first parameter of every method", lang: "python" },
      { table: { head: ["Part", "What it is"], rows: [
        ["`class Student:`", "the blueprint, not a real one yet"],
        ["`Student(\"Somchai\", 20)`", "creating an instance — one real student"],
        ["`__init__`", "runs automatically at creation; sets the starting state"],
        ["`self`", "the instance the method was called on; Python passes it for you"],
        ["`self.name`", "an attribute — data belonging to that instance"]
      ]}},
      { note: "Always create state inside `__init__`. Write `scores = []` at class level instead and every student shares one list — one of the hardest beginner bugs to find." },
      { h: "Inheritance" },
      { code: String.raw`class Person:
    def __init__(self, name):
        self.name = name

    def show(self):
        print(f"name: {self.name}")


class Student(Person):
    def __init__(self, name, school):
        super().__init__(name)      # let the parent set its own part
        self.school = school

    def show(self):
        super().show()              # print the parent's line first
        print(f"school: {self.school}")


Student("Somchai", "42").show()`,
        cap: "super() calls the parent — in __init__ and in other methods alike", lang: "python" },
      { p: "Copying the parent's `print` into the child instead of calling `super().show()` is exactly what **Module 01 exercise 5 marks against**." },
      { h: "A single underscore" },
      { code: String.raw`class Account:
    def __init__(self, balance):
        self._balance = balance     # one underscore = "do not touch from outside"

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def balance(self):
        return self._balance`,
        cap: "Python has no real private; the underscore is an agreement between people", lang: "python" },
      { p: "Use **one** underscore, not two. Two mangles the name, which makes subclassing awkward for no benefit in return." },
      { h: "Type hints — telling people and tools what goes in and out" },
      { code: String.raw`def add(a: int, b: int) -> int:
    """Add two whole numbers."""
    return a + b


def greet(name: str) -> str:
    return f"Hello {name}"


def find(items: list[str], target: str) -> str | None:
    """Return the match, or None when there is none."""
    for item in items:
        if item == target:
            return item
    return None`,
        cap: "After the name is the parameter's type; after the arrow is what comes back", lang: "python" },
      { p: "Python does **not** enforce them at runtime — a wrong hint still runs. The value is that a reader understands immediately, and a checker catches the mistake before the program runs, which is what 42 requires from Module 01 onward." },
      { h: "The gate 42 checks — build the habit while your programs are still ten lines long" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install flake8 mypy

./.venv/bin/flake8 myfile.py      # style
./.venv/bin/mypy myfile.py        # types`,
        cap: "These two decide your mark before your logic is even read", lang: "bash" },
      { table: { head: ["Rule", "Detail"], rows: [
        ["Line length", "at most 79 characters (flake8's default)"],
        ["Indentation", "4 spaces, never tabs"],
        ["Naming", "`PascalCase` for classes, `snake_case` for functions and variables"],
        ["Blank lines", "two between top-level functions"],
        ["Type hints", "on every function and method"],
        ["Errors", "no traceback in front of an evaluator"]
      ]}},
      { h: "One complete program" },
      { code: String.raw`#!/usr/bin/env python3
"""Score book — take scores from the user and summarise them."""


def read_score(text: str) -> int | None:
    """Turn text into a score of 0-100; None when unusable."""
    try:
        value = int(text)
    except ValueError:
        return None
    if value < 0 or value > 100:
        return None
    return value


def grade_of(score: int) -> str:
    """Turn a score into a grade."""
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    return "F"


def summarise(scores: list[int]) -> dict[str, float]:
    """Summarise a whole set of scores."""
    if not scores:
        return {"count": 0, "average": 0.0, "highest": 0, "lowest": 0}
    return {
        "count": len(scores),
        "average": round(sum(scores) / len(scores), 2),
        "highest": max(scores),
        "lowest": min(scores),
    }


def main() -> None:
    """Take scores until the user types done, then summarise."""
    scores: list[int] = []
    while True:
        text = input("score (or done): ").strip()
        if text == "done":
            break
        score = read_score(text)
        if score is None:
            print("must be a number from 0 to 100")
            continue
        scores.append(score)
        print(f"  recorded: {score} -> {grade_of(score)}")

    summary = summarise(scores)
    print(f"count: {summary['count']}")
    print(f"average: {summary['average']}")
    print(f"highest: {summary['highest']}")
    print(f"lowest: {summary['lowest']}")


if __name__ == "__main__":
    main()`,
        cap: "Passes flake8 and mypy, and uses everything on this page", lang: "python" },
      { p: "It has all of it: functions with meaningful names, type hints, narrow error handling, a loop with a way out, readable conditions, the right data structures, and the `__main__` guard. Write that yourself and you are ready for Module 00." },
      { h: "Practice — easiest first" },
      { p: "Reading is not enough. Do all ten before moving on to the Python Modules pages. Each one uses only what is on this page, and each one has to pass flake8 and mypy." },
      { ul: [
        "1. Ask for a name, greet the user, and report how many characters the name has",
        "2. Ask for two numbers and print the sum, difference, product, quotient and remainder, handling division by zero",
        "3. Ask for an age and say whether it is a child, a teenager or an adult, using `if` and `elif`",
        "4. Print the times table for a number the user picks, from 1 to 12, with a loop",
        "5. Write `is_prime(n: int) -> bool` and print every prime below 100",
        "6. Take words until the user types done, then report the longest, the shortest, and how many were unique",
        "7. Count how often each letter appears in a piece of text and print them most-frequent first — a `dict` plus `sorted`",
        "8. Read a text file and write a new one with a line number in front of every line, handling the file not existing",
        "9. Take numbers from `sys.argv` and print the average, highest and lowest, skipping non-numbers with a message",
        "10. Write a `Wallet` class with `deposit`, `withdraw` and `balance` that refuses an overdraft through an exception of your own"
      ]},
      { note: "**Do number 10 without looking back at this page and you have finished 101.** It needs a class, state, validation and a custom exception — the core of Modules 01 and 02." }
    ],

    tricks: [
      { h: "16 traps, in the order they usually happen" },
      { p: "Every one of these happens to everyone — not because you are slow, but because the language works that way. Read them now and you will recognise them when they arrive." },
      { h: "1) input() always returns a string" },
      { code: String.raw`age = input("age: ")
print(age + 1)          # TypeError
print(int(age) + 1)     # right — but raises if the user typed "abc"`,
        cap: "Convert, then plan for the conversion failing", lang: "python" },
      { h: "2) Calling a method and dropping the result" },
      { code: String.raw`name = "somchai"
name.upper()                 # nothing happens
name = name.upper()          # right

items = [3, 1, 2]
sorted(items)                # nothing happens to items
items = sorted(items)        # right`,
        cap: "Immutable things always hand you a new one; take it", lang: "python" },
      { h: "3) is versus ==" },
      { code: String.raw`a = [1, 2]
b = [1, 2]
print(a == b)      # True   same value
print(a is b)      # False  different objects

x = 5
y = 5
print(x is y)      # True — but by accident: CPython caches small ints
z = 1000
w = 1000
print(z is w)      # may well be False`,
        cap: "Rule: use is only with None, True and False", lang: "python" },
      { h: "4) Integer division" },
      { code: String.raw`print(8 / 2)     # 4.0   <- always a float
print(8 // 2)    # 4
print(-7 // 2)   # -4    <- floors; it does not truncate
print(int(-3.5)) # -3    <- this one truncates toward zero`,
        cap: "// and int() round differently once a value is negative", lang: "python" },
      { h: "5) Floats are not exact" },
      { code: String.raw`print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False

print(abs(0.1 + 0.2 - 0.3) < 1e-9)   # True — compare with a tolerance`,
        cap: "For money, use the decimal module", lang: "python" },
      { h: "6) Changing a list while looping over it" },
      { code: String.raw`items = [1, 2, 2, 3]
for item in items:
    if item % 2 == 0:
        items.remove(item)
print(items)          # [1, 2, 3]  <- the second 2 survives!

items = [1, 2, 2, 3]
items = [item for item in items if item % 2 != 0]
print(items)          # [1, 3]     <- right`,
        cap: "Removing one shifts the positions, so the next item is skipped", lang: "python" },
      { h: "7) A mutable default argument" },
      { code: String.raw`def add_item(item, basket=[]):     # wrong
    basket.append(item)
    return basket

print(add_item("a"))    # ['a']
print(add_item("b"))    # ['a', 'b']  <- the same basket!

def add_item(item, basket=None):   # right
    if basket is None:
        basket = []
    basket.append(item)
    return basket`,
        cap: "A default is created once, when the function is defined", lang: "python" },
      { h: "8) Shadowing something that already exists" },
      { code: String.raw`list = [1, 2, 3]        # list() is now unusable
str = "abc"             # so is str()
sum = 0                 # and sum()

# the error appears a hundred lines later and reads like nonsense
# use items, text, total instead`,
        cap: "Names to avoid: list, dict, str, int, sum, id, type, input, max, min", lang: "python" },
      { h: "9) KeyError versus .get()" },
      { code: String.raw`student = {"name": "Somchai"}

print(student["age"])              # KeyError
print(student.get("age"))          # None — no crash, but sometimes that is the bug
print(student.get("age", 0))       # 0 — a fallback you chose

if "age" in student:               # clearest when the two cases differ
    print(student["age"])`,
        cap: "Pick the one that matches what you meant", lang: "python" },
      { h: "10) range stops before the last value" },
      { code: String.raw`print(list(range(5)))       # [0, 1, 2, 3, 4]  — no 5
print(list(range(1, 5)))    # [1, 2, 3, 4]     — no 5

items = ["a", "b", "c"]
print(items[3])             # IndexError — the last index is 2`,
        cap: "When in doubt, wrap it in list() and print it", lang: "python" },
      { h: "11) UnboundLocalError" },
      { code: String.raw`count = 0

def broken():
    count = count + 1       # UnboundLocalError
    return count

def works():
    local_count = 0         # its own variable
    local_count += 1
    return local_count`,
        cap: "Assigning anywhere in a function makes that name local everywhere in it", lang: "python" },
      { h: "12) Comparing a string to a number" },
      { code: String.raw`print("10" < "9")       # True  — character by character, '1' < '9'
print(10 < 9)           # False — as numbers
print("10" == 10)       # False — different types, never equal`,
        cap: "Convert to the same type before comparing", lang: "python" },
      { h: "13) A copy is not deep" },
      { code: String.raw`import copy

rows = [[1, 2], [3, 4]]
shallow = rows.copy()
shallow[0].append(99)
print(rows)              # [[1, 2, 99], [3, 4]]  <- the inner lists are shared

deep = copy.deepcopy(rows)
deep[0].append(100)
print(rows)              # unchanged`,
        cap: ".copy() copies one level only", lang: "python" },
      { h: "14) A generator is walked once" },
      { code: String.raw`squares = (n * n for n in range(3))
print(list(squares))     # [0, 1, 4]
print(list(squares))     # []   <- exhausted`,
        cap: "Store it as a list if you need to loop twice", lang: "python" },
      { h: "15) Closures bind at call time, not at creation" },
      { code: String.raw`funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])          # [2, 2, 2]  <- all see the same i

funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])          # [0, 1, 2]  <- bound at creation`,
        cap: "Bites when you build functions inside a loop", lang: "python" },
      { h: "16) Tabs mixed with spaces" },
      { p: "You cannot see the difference, but Python can. The result is a `TabError`, or worse, code that silently runs in the wrong block. **Set your editor to insert 4 spaces for the Tab key on day one** and this can never happen." },
      { h: "Debugging tools that actually help" },
      { code: String.raw`# 1) print with the name included
print(f"{items=}")            # items=[1, 2, 3]

# 2) ask what type it is when you are unsure
print(type(value), value)

# 3) stop and look around
breakpoint()                  # n = next line, c = continue, q = quit`,
        cap: "f\"{name=}\" prints the name and the value; it saves a lot of time", lang: "python" }
    ],

    eval: [
      { qa: [
        { q: "What is a variable in Python?", a: "A name bound to an object, not a box holding a value. `b = a` copies nothing; it puts a second name on the same object. If that object is mutable, a change made through one name is visible through the other." },
        { q: "Why does `name.upper()` leave the name unchanged?", a: "Because strings are immutable, so their methods return a new string rather than editing the original. You have to take the result: `name = name.upper()`." },
        { q: "How do `/` and `//` differ?", a: "`/` always returns a float, even when it divides evenly. `//` floors to a whole number — and it really floors rather than truncating toward zero, so `-7 // 2` is -4." },
        { q: "When do you use `is` rather than `==`?", a: "`==` asks whether the values are equal; `is` asks whether it is the same object. Use `is` only with `None`, `True` and `False`, because with numbers and strings it can appear to work by accident thanks to CPython's caching." },
        { q: "What is truthiness?", a: "Python's willingness to use a non-bool value in a condition. Empty things — `0`, `\"\"`, `[]`, `{}`, `None` — count as false and everything else as true, which is why `if items:` is preferred over `if len(items) > 0:`." },
        { q: "How do a list and a tuple differ?", a: "A list can be changed — items added, removed, reordered. A tuple cannot be changed once created. Use a tuple when the values form one group that should not be edited, such as a coordinate or the several values a function returns." },
        { q: "When should you use a dict instead of a list?", a: "When you look things up by name or id rather than by position. A dict lookup costs the same however many entries there are, while searching a list means walking it." },
        { q: "How do you read a traceback?", a: "Bottom-up. The last line says what went wrong, the lines above say in which file and on which line, and the remaining frames say how execution got there. When the error is inside a library, look for the last frame that is your own file." },
        { q: "Why is a bare `except Exception` a bad idea?", a: "It swallows every error, including bugs you never meant to catch, so the program carries on in a broken state and the cause becomes untraceable. Catch the narrowest type that can genuinely occur." },
        { q: "Why is `finally` needed when code after the try would run anyway?", a: "Code after the try does not run if the block returns or raises something uncaught. `finally` runs on every exit path, which makes it the correct place for cleanup." },
        { q: "Why is `with open(...)` better than a plain `open()`?", a: "It closes the file when the block ends, whether that is a return, an error or a normal finish. Closing by hand means remembering every exit path, and the one added later during a refactor is the one that gets forgotten." },
        { q: "What is `if __name__ == \"__main__\":` for?", a: "When a file is imported, `__name__` is the module's name rather than `\"__main__\"`, so the guard gives the importer the function definitions without running the program. One file can then be both a program and a library." },
        { q: "What is `self`?", a: "The instance the method was called on. Python passes it automatically as the first argument, so when you write `student.add_score(80)`, `self` inside the method is that `student`." },
        { q: "Why create a list in `__init__` rather than at class level?", a: "Anything written at class level is created once and shared by every instance, so an empty list there means all students record scores into the same list. What is in `__init__` is created fresh for each instance." },
        { q: "What is the mutable default argument problem, and how do you fix it?", a: "`def f(items=[])` creates that list once, when the function is defined, not on each call. Every call that omits the argument reuses the one list, which keeps accumulating. Fix it by defaulting to `None` and creating the list inside the function." },
        { q: "Are type hints enforced at runtime?", a: "No — a wrong hint still runs. Their value is that a reader immediately knows what a function takes and returns, and that a tool like mypy catches the mistake before the program runs, which is what 42 requires from Module 01 onward." },
        { q: "Why does flake8 use a 79-character line length?", a: "It is the tool's default, which comes from PEP 8, Python's own style guide. The 42 subjects supply no config file, so that default is the rule you are checked against." },
        { q: "What comes after this page?", a: "The Python Modules 00–04 page. This page's first four tabs cover the whole of Module 00, and the classes and data structures tabs cover almost all of Modules 01 and 03." }
      ]}
    ]
  }

});
