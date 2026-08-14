/* English content for the Python Syntax Reference. Block count and key shape
   mirror data.pysyntax.js index for index. */
window.TEACHING_EN = window.TEACHING_EN || {};

Object.assign(window.TEACHING_EN, {

  py_syntax: {
    principle: [
      { h: "How to use this page" },
      { p: "This page does not teach concepts. It is **what you open when you have forgotten how something is written**. Every entry has three parts: the form, a runnable example, and the output it must produce. Skip around freely." },
      { note: "If you want **why** rather than **how**, read **Python 101**, which goes from zero in order. This page is that page's reference card." },
      { h: "Rules that apply to every line on this page" },
      { table: { head: ["Rule", "Right", "Wrong"], rows: [
        ["No semicolon at the end of a line", "`x = 5`", "`x = 5;`"],
        ["Blocks are indented by 4 spaces", "`if x:` then a new indented line", "using braces"],
        ["A block header ends with a colon", "`if x > 0:`", "`if x > 0`"],
        ["No type declaration", "`x = 5`", "`int x = 5`"],
        ["Comments start with `#`", "`# a note`", "`// a note`"],
        ["Case matters", "`name` and `Name` are different", "—"]
      ]}},
      { code: String.raw`# save as any name ending in .py, then run:
#   python3 yourfile.py

print("Hello")        # print to the screen
x = 5                 # assign
if x > 0:             # a block header ends with :
    print("positive") # inside the block, indented 4 spaces
print("done")         # outside the block`,
        cap: "The basic shape, using every rule above", lang: "python" }
    ],

    theory: [
      { h: "Declaring a variable" },
      { code: String.raw`name = value`,
        cap: "The form", lang: "text" },
      { code: String.raw`name = "Somchai"     # text
age = 20             # whole number
height = 172.5       # decimal
is_student = True    # true or false
nothing = None       # no value

print(name, age, height, is_student, nothing)`,
        cap: "Example", lang: "python" },
      { code: String.raw`Somchai 20 172.5 True None`,
        cap: "Output", lang: "text" },
      { table: { head: ["Topic", "Rule"], rows: [
        ["No type needed", "Python takes it from the value you assign"],
        ["A name starts with", "a letter or an underscore, never a digit"],
        ["A name contains", "letters, digits and underscores; no spaces or punctuation"],
        ["Style", "`snake_case` for variables and functions, `PascalCase` for classes"],
        ["Constants", "there are none; an all-capitals name is the convention, e.g. `MAX_SIZE`"]
      ]}},
      { code: String.raw`a = b = c = 0            # assign three at once
x, y = 3, 4              # assign a pair
x, y = y, x              # swap them in one line
print(x, y)              # 4 3

count = 0
count += 1               # the same as count = count + 1
count -= 1               # subtract
count *= 2               # multiply
print(count)             # 0`,
        cap: "The shorthand forms you will use most", lang: "python" },
      { h: "The basic data types" },
      { table: { head: ["Type", "Written", "Example"], rows: [
        ["`str`", "in single or double quotes", "`\"abc\"`, `'abc'`"],
        ["`int`", "digits with no point", "`42`, `-7`"],
        ["`float`", "digits with a point", "`3.14`, `2.0`"],
        ["`bool`", "`True` or `False`, capitalised", "`True`"],
        ["`list`", "square brackets", "`[1, 2, 3]`"],
        ["`tuple`", "round brackets", "`(1, 2)`"],
        ["`dict`", "braces, in key-value pairs", "`{\"a\": 1}`"],
        ["`set`", "braces, no pairs", "`{1, 2}`"],
        ["`NoneType`", "`None`", "`None`"]
      ]}},
      { code: String.raw`print(type(42))          # <class 'int'>
print(type("42"))        # <class 'str'>
print(type(3.14))        # <class 'float'>
print(type(True))        # <class 'bool'>
print(type([1, 2]))      # <class 'list'>
print(type({"a": 1}))    # <class 'dict'>`,
        cap: "When you want to know what something is, ask type()", lang: "python" },
      { h: "Converting between types" },
      { code: String.raw`int(value)      float(value)      str(value)      bool(value)`,
        cap: "The form", lang: "text" },
      { code: String.raw`print(int("42"))         # 42      text -> whole number
print(int(3.9))          # 3       decimal -> whole number (truncated)
print(float("3.14"))     # 3.14    text -> decimal
print(str(42))           # '42'    number -> text
print(bool(0))           # False   zero counts as false
print(bool(""))          # False   an empty string counts as false
print(bool("0"))         # True    a string with a character counts as true

print(int("abc"))        # ValueError: invalid literal for int()`,
        cap: "The last line fails — a conversion that cannot work needs a try", lang: "python" },
      { h: "Operators" },
      { table: { head: ["Group", "Operators", "Example", "Gives"], rows: [
        ["arithmetic", "`+ - * /`", "`7 / 2`", "`3.5` (always a decimal)"],
        ["", "`//`", "`7 // 2`", "`3` (floored)"],
        ["", "`%`", "`7 % 2`", "`1` (remainder)"],
        ["", "power", "see the code below", "`8`"],
        ["comparison", "`== !=`", "`5 == 5`", "`True`"],
        ["", "`> < >= <=`", "`5 >= 5`", "`True`"],
        ["logic", "`and or not`", "`True and False`", "`False`"],
        ["membership", "`in`, `not in`", "`\"a\" in \"cat\"`", "`True`"],
        ["identity", "`is`, `is not`", "`x is None`", "only ever with None"]
      ]}},
      { code: String.raw`print(7 + 2)    # 9
print(7 - 2)    # 5
print(7 * 2)    # 14
print(7 / 2)    # 3.5   division always gives a decimal
print(7 // 2)   # 3     floored
print(7 % 2)    # 1     remainder
print(2 ** 3)   # 8     power (two stars)`,
        cap: "Every arithmetic operator with its result", lang: "python" },
      { note: "`=` assigns and `==` compares. Confusing them inside a condition is a `SyntaxError` in Python, which is a mercy — some languages let it through." },
      { h: "Text and formatting" },
      { code: String.raw`f"text {variable} more text"`,
        cap: "The f-string form — an f before the quote", lang: "text" },
      { code: String.raw`name = "Somchai"
score = 87.6543

print(f"{name} scored {score}")        # Somchai scored 87.6543
print(f"{score:.2f}")                  # 87.65      two decimal places
print(f"{score:>10.2f}")               #      87.65 right-aligned in 10
print(f"{name:*^11}")                  # **Somchai** centred, padded with *
print(f"{42:04d}")                     # 0042       zero-padded
print(f"{score = }")                   # score = 87.6543  name included`,
        cap: "The formatting options you will actually use", lang: "python" },
      { code: String.raw`text = "Hello World"

print(len(text))              # 11
print(text.upper())           # HELLO WORLD
print(text.lower())           # hello world
print(text.replace("l", "L")) # HeLLo WorLd
print(text.split(" "))        # ['Hello', 'World']
print("-".join(["a", "b"]))   # a-b
print("  ab  ".strip())       # 'ab'
print(text.startswith("He"))  # True
print(text[0])                # H       first character
print(text[-1])               # d       last character
print(text[0:5])              # Hello   from 0 up to but not 5`,
        cap: "The string methods used most often", lang: "python" }
    ],

    foundations: [
      { h: "if — do it when the condition is true" },
      { code: String.raw`if condition:
    statement`,
        cap: "The form — a colon ends the header, then indent 4 spaces", lang: "text" },
      { code: String.raw`age = 20

if age >= 18:
    print("adult")`,
        cap: "Example", lang: "python" },
      { code: String.raw`adult`,
        cap: "Output", lang: "text" },
      { h: "if / else — with a fallback" },
      { code: String.raw`if condition:
    statement when true
else:
    statement when false`,
        cap: "The form", lang: "text" },
      { code: String.raw`age = 15

if age >= 18:
    print("adult")
else:
    print("not old enough")`,
        cap: "Example", lang: "python" },
      { code: String.raw`not old enough`,
        cap: "Output", lang: "text" },
      { h: "if / elif / else — several choices" },
      { code: String.raw`if first condition:
    statement
elif second condition:
    statement
elif third condition:
    statement
else:
    statement when none matched`,
        cap: "The form — any number of `elif`, at most one `else`", lang: "text" },
      { code: String.raw`score = 75

if score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"

print(f"grade {grade}")`,
        cap: "Example", lang: "python" },
      { code: String.raw`grade B`,
        cap: "Output", lang: "text" },
      { note: "**Checked top to bottom; the first true one wins and the rest are never checked.** Put `score >= 60` first and someone with 75 gets a C — **the order of the conditions is part of the logic**." },
      { h: "Nesting and combining conditions" },
      { code: String.raw`age = 20
has_ticket = True

# nested
if age >= 18:
    if has_ticket:
        print("come in")
    else:
        print("buy a ticket first")
else:
    print("too young")

# combined with and — easier to read when it fits
if age >= 18 and has_ticket:
    print("come in")

# or means either one is enough
if age < 3 or age > 60:
    print("discount applies")

# not inverts it
if not has_ticket:
    print("no ticket yet")`,
        cap: "If it fits with an and, combine it — three levels of nesting means extract a function", lang: "python" },
      { h: "One-line if, and choosing a value with a condition" },
      { code: String.raw`age = 20

# it fits on one line, but only use it when it is genuinely short
if age >= 18: print("adult")

# choosing a value — value if condition else other value
status = "adult" if age >= 18 else "minor"
print(status)                      # adult

# it nests, but go back to a plain if once it stops reading well
size = "large" if age > 60 else "medium" if age > 18 else "small"`,
        cap: "The last two lines are what other languages call a ternary", lang: "python" },
      { h: "match — comparing many values tidily (3.10 and later)" },
      { code: String.raw`command = "start"

match command:
    case "start":
        print("starting")
    case "stop":
        print("stopping")
    case "pause" | "hold":          # matches either
        print("paused")
    case _:                          # everything else
        print(f"unknown command {command}")`,
        cap: "Like a switch elsewhere, where `case _` is the default", lang: "python" },
      { h: "while — repeat until the condition is false" },
      { code: String.raw`while condition:
    statement`,
        cap: "The form", lang: "text" },
      { code: String.raw`count = 1
while count <= 3:
    print(f"round {count}")
    count += 1          # forget this and it never ends; Ctrl+C to stop
print("done")`,
        cap: "Example", lang: "python" },
      { code: String.raw`round 1
round 2
round 3
done`,
        cap: "Output", lang: "text" },
      { h: "for — do something with each item" },
      { code: String.raw`for variable in something iterable:
    statement`,
        cap: "The form", lang: "text" },
      { code: String.raw`for fruit in ["apple", "banana"]:
    print(fruit)

for letter in "abc":
    print(letter)

for i in range(3):          # 0 1 2
    print(i)

for i in range(1, 4):       # 1 2 3
    print(i)

for i in range(0, 10, 3):   # 0 3 6 9
    print(i)

for index, value in enumerate(["a", "b"]):
    print(index, value)     # 0 a / 1 b`,
        cap: "`range` always stops before the last value", lang: "python" },
      { h: "break, continue, and a loop's else" },
      { code: String.raw`for i in range(5):
    if i == 3:
        break               # leave the loop at once
    print(i)                # 0 1 2

for i in range(5):
    if i % 2 == 0:
        continue            # skip to the next round
    print(i)                # 1 3

for i in range(3):
    print(i)
else:
    print("finished without a break")   # runs when nothing broke out`,
        cap: "A loop's `else` is peculiar to Python and useful when searching", lang: "python" },
      { h: "Functions" },
      { code: String.raw`def function_name(parameters):
    """description"""
    return value`,
        cap: "The form", lang: "text" },
      { code: String.raw`def greet(name):
    """Greet one person."""
    return f"Hello {name}"


print(greet("Somchai"))      # Hello Somchai


def add(a, b=10):            # b has a default
    return a + b


print(add(5))                # 15
print(add(5, 20))            # 25
print(add(b=1, a=2))         # 3   named arguments; order stops mattering


def stats(numbers):
    return min(numbers), max(numbers)     # two values at once


low, high = stats([3, 1, 4])
print(low, high)             # 1 4`,
        cap: "Defaults, named arguments, and returning several values", lang: "python" },
      { note: "A function with no `return` returns `None`. `result = print(\"hi\")` leaves `result` as `None` rather than text — which is where the `NoneType` in so many error messages comes from." },
      { h: "Type hints — telling people and tools what goes in and out" },
      { code: String.raw`def name(parameter: type) -> return type:`,
        cap: "The form — 42 requires them from Module 01", lang: "text" },
      { code: String.raw`def add(a: int, b: int) -> int:
    return a + b


def greet(name: str) -> str:
    return f"Hello {name}"


def find(items: list[str], target: str) -> str | None:
    """Return the match, or None when there is none."""
    for item in items:
        if item == target:
            return item
    return None


def show(text: str) -> None:      # returns nothing: None
    print(text)`,
        cap: "`|` means either, and `None` means it returns nothing", lang: "python" }
    ],

    architecture: [
      { h: "list — ordered and changeable" },
      { code: String.raw`name = [value, value, value]`,
        cap: "The form", lang: "text" },
      { code: String.raw`items = ["a", "b", "c"]

print(items[0])          # a       first
print(items[-1])         # c       last
print(items[0:2])        # ['a', 'b']
print(len(items))        # 3
print("a" in items)      # True

items.append("d")        # add at the end
items.insert(0, "z")     # insert at position 0
items.remove("b")        # remove the first item with this value
last = items.pop()       # take the last one off
items.sort()             # sorts in place, returns None
print(items)             # ['a', 'c', 'z']

print(sorted([3, 1, 2])) # [1, 2, 3]   returns a new list`,
        cap: "`.sort()` edits in place; `sorted()` returns a new one", lang: "python" },
      { h: "dict — keys paired with values" },
      { code: String.raw`name = {key: value, key: value}`,
        cap: "The form", lang: "text" },
      { code: String.raw`student = {"name": "Somchai", "age": 20}

print(student["name"])            # Somchai
print(student.get("email"))       # None      no crash on a missing key
print(student.get("email", "-"))  # -         with a fallback
print("name" in student)          # True      tests the keys

student["age"] = 21               # change a value
student["email"] = "a@b.c"        # add a key
del student["email"]              # remove one

for key, value in student.items():
    print(key, value)

print(list(student.keys()))       # ['name', 'age']
print(list(student.values()))     # ['Somchai', 21]`,
        cap: "`student[\"missing\"]` raises KeyError; `.get()` does not", lang: "python" },
      { h: "tuple and set" },
      { code: String.raw`point = (3, 4)           # tuple — cannot be changed
x, y = point             # unpack into two names
print(x, y)              # 3 4
point[0] = 9             # TypeError

unique = {1, 2, 2, 3}    # set — no duplicates, no order
print(unique)            # {1, 2, 3}
print(2 in unique)       # True
print({1, 2} & {2, 3})   # {2}    in both
print({1, 2} | {2, 3})   # {1, 2, 3}  in either
print({1, 2} - {2, 3})   # {1}    only on the left`,
        cap: "A tuple for values that should not change; a set when only membership matters", lang: "python" },
      { h: "Comprehensions — a new collection in one line" },
      { code: String.raw`[expression for variable in collection if condition]`,
        cap: "The form — the `if` part is optional", lang: "text" },
      { code: String.raw`numbers = [1, 2, 3, 4, 5]

print([n * n for n in numbers])                  # [1, 4, 9, 16, 25]
print([n for n in numbers if n % 2 == 0])        # [2, 4]
print({w: len(w) for w in ["ab", "abc"]})        # {'ab': 2, 'abc': 3}
print({n % 3 for n in numbers})                  # {0, 1, 2}`,
        cap: "The same shape works for lists, dicts and sets", lang: "python" },
      { h: "Handling errors" },
      { code: String.raw`try:
    something that might fail
except type of error:
    what to do when it fails
else:
    what to do when it did not
finally:
    what happens either way`,
        cap: "The form — `else` and `finally` are optional", lang: "text" },
      { code: String.raw`try:
    age = int(input("age: "))
except ValueError:
    print("that must be a number")
else:
    print(f"next year: {age + 1}")
finally:
    print("input finished")

# raising your own
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("not enough funds")
    return balance - amount`,
        cap: "Catch the narrowest thing that can genuinely happen", lang: "python" },
      { h: "Files" },
      { code: String.raw`with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("first line\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    print(f.read())

with open("notes.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())

with open("notes.txt", "a", encoding="utf-8") as f:
    f.write("appended\n")`,
        cap: "`w` replaces, `r` reads, `a` appends — and always pass encoding", lang: "python" },
      { h: "Classes" },
      { code: String.raw`class ClassName:
    def __init__(self, parameters):
        self.attribute = value

    def method_name(self):
        return value`,
        cap: "The form — `self` is the first parameter of every method", lang: "text" },
      { code: String.raw`class Student:
    """One student."""

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
        self.scores: list[int] = []

    def add_score(self, score: int) -> None:
        self.scores.append(score)

    def average(self) -> float:
        if not self.scores:
            return 0.0
        return sum(self.scores) / len(self.scores)


student = Student("Somchai", 20)
student.add_score(80)
student.add_score(90)
print(student.name, student.average())      # Somchai 85.0`,
        cap: "`__init__` runs automatically when the instance is created", lang: "python" },
      { code: String.raw`class Person:
    def __init__(self, name: str) -> None:
        self.name = name

    def show(self) -> None:
        print(f"name: {self.name}")


class Student(Person):                   # inherits from Person
    def __init__(self, name: str, school: str) -> None:
        super().__init__(name)           # call the parent's __init__
        self.school = school

    def show(self) -> None:
        super().show()                   # call the parent's method
        print(f"school: {self.school}")


Student("Somchai", "42").show()`,
        cap: "The brackets after the class name name the parent", lang: "python" }
    ],

    dataflow: [
      { h: "Taking input from the user" },
      { code: String.raw`answer = input("the prompt: ")`,
        cap: "The form — it always returns text", lang: "text" },
      { code: String.raw`name = input("name: ")
age = int(input("age: "))        # you convert it yourself
print(f"{name} is {age}")`,
        cap: "Forget the `int()` and `age + 1` fails with a TypeError", lang: "python" },
      { h: "Taking values from the command line" },
      { code: String.raw`import sys

print(sys.argv)          # ['prog.py', 'a', 'b']
print(sys.argv[0])       # prog.py   <- the script's name, not an argument
print(sys.argv[1:])      # ['a', 'b'] <- what the user actually typed

if len(sys.argv) < 2:
    print(f"usage: python3 {sys.argv[0]} <value>")
    sys.exit(1)`,
        cap: "$ python3 prog.py a b", lang: "python" },
      { h: "import — using things from another file" },
      { code: String.raw`import math                      # the whole module
print(math.sqrt(16))             # 4.0

from math import sqrt            # just the name you want
print(sqrt(16))                  # 4.0

from math import sqrt as root    # under a different name
print(root(16))                  # 4.0

import mytools                   # your own mytools.py
print(mytools.helper())`,
        cap: "A `.py` file sitting beside yours is a module you can import at once", lang: "python" },
      { table: { head: ["Module that ships with Python", "For", "Example"], rows: [
        ["`math`", "mathematics", "`math.sqrt(16)`, `math.floor(3.7)`"],
        ["`random`", "randomness", "`random.randint(1, 6)`, `random.choice(items)`"],
        ["`datetime`", "dates and times", "`datetime.date.today()`"],
        ["`json`", "reading and writing JSON", "`json.dumps(data)`, `json.loads(text)`"],
        ["`os`", "the filesystem and environment", "`os.path.exists(path)`"],
        ["`sys`", "arguments and streams", "`sys.argv`, `sys.exit(1)`"]
      ]}},
      { h: "The __main__ guard" },
      { code: String.raw`def main() -> None:
    print("running")


if __name__ == "__main__":
    main()`,
        cap: "Run the file directly and it runs; import it and you get only the definitions", lang: "python" }
    ],

    tricks: [
      { h: "A table against brace languages" },
      { table: { head: ["C-like", "Python"], rows: [
        ["`if (x > 0) { ... }`", "`if x > 0:` then indent"],
        ["`else if`", "`elif`"],
        ["`&&`, `||`, `!`", "`and`, `or`, `not`"],
        ["`true`, `false`", "`True`, `False` — capitalised"],
        ["`null`", "`None`"],
        ["`for (i = 0; i < n; i++)`", "`for i in range(n):`"],
        ["`switch`", "`match` (3.10 and later) or `if/elif`"],
        ["`x++`", "`x += 1` — there is no `++`"],
        ["`/* comment */`", "`#`, one line at a time"],
        ["`;` at the end of a line", "not needed"]
      ]}},
      { h: "The syntax errors you will meet most" },
      { table: { head: ["Written like this", "The error", "The fix"], rows: [
        ["`if x > 0` (no colon)", "`SyntaxError: expected ':'`", "add the `:`"],
        ["a line in a block not indented", "`IndentationError: expected an indented block`", "indent by 4 spaces"],
        ["uneven indentation in one block", "`IndentationError: unexpected indent`", "make every line in the block match"],
        ["tabs mixed with spaces", "`TabError`", "set the editor to insert 4 spaces for Tab"],
        ["`if x = 5:`", "`SyntaxError`", "use `==` to compare"],
        ["`print(\"a\" + 1)`", "`TypeError`", "convert first: `\"a\" + str(1)`"],
        ["`true` instead of `True`", "`NameError: name 'true' is not defined`", "capitalise it"],
        ["an unclosed bracket or quote", "`SyntaxError` pointing at **the next line**", "look at the line above the one it names"]
      ]}},
      { note: "A `SyntaxError` usually points at the line after the mistake, because Python keeps reading until the statement cannot be completed. Whenever you see one, check the line above the one it names first." },
      { h: "Shortcuts worth knowing" },
      { code: String.raw`# testing for empty — use the value itself
if items:              # better than if len(items) > 0
    ...

# chained comparisons
if 0 <= score <= 100:  # better than if score >= 0 and score <= 100
    ...

# looping with the position
for index, item in enumerate(items):
    ...

# looping over two sequences together
for name, age in zip(names, ages):
    ...

# a fallback when a key is missing
value = data.get("key", "fallback")

# swapping
a, b = b, a`,
        cap: "These six make code shorter and easier to read immediately", lang: "python" }
    ],

    eval: [
      { qa: [
        { q: "Why does Python not need a type declaration?", a: "Because the type belongs to the **value**, not the name. In `x = 5` the 5 is already an int, and `x` is only a name pointing at it. Writing `x = \"abc\"` next is perfectly legal." },
        { q: "How does `elif` differ from separate `if` statements?", a: "An `elif` is only tested when the previous conditions were false, and once one is true the rest are skipped entirely. Separate `if` statements are all tested, and more than one can run." },
        { q: "Why does indentation matter?", a: "Because it is the syntax. Python uses the indentation level to say which lines belong to which block, in place of the braces other languages use, so indenting wrongly changes the meaning of the program or stops it running." },
        { q: "What is the difference between `=` and `==`?", a: "`=` assigns a value to a name; `==` asks whether two values are equal. Writing `if x = 5:` is a `SyntaxError` in Python, which catches the confusion before the program even runs." },
        { q: "What does `input()` return?", a: "Always text, even when the user typed digits. If you need a number, convert it with `int()` or `float()`, and that conversion can fail on other input, so it belongs inside a `try`." },
        { q: "What numbers does `range(1, 5)` produce?", a: "1, 2, 3, 4 — it always stops before the last value. For 5 as well you need `range(1, 6)`. When unsure, wrap it in `list()` and print it." },
        { q: "What does a function with no `return` return?", a: "`None`, automatically. So `result = print(\"hi\")` leaves `result` as `None` rather than text, which is where the `NoneType` in so many error messages comes from." },
        { q: "How do a `list` and a `tuple` differ?", a: "A list can be added to, removed from and changed; a tuple cannot be changed once created. Use a tuple when the values form one group that should not be edited, such as a coordinate or several values returned from a function." },
        { q: "How does `dict[\"key\"]` differ from `dict.get(\"key\")`?", a: "The first raises `KeyError` when the key is absent; the second returns `None`, and takes a fallback with `get(\"key\", fallback)`. Choose by whether a missing key is an error or an ordinary case." },
        { q: "What is `self`?", a: "The instance the method was called on. Python passes it automatically as the first argument, so when you write `student.add_score(80)`, `self` inside the method is that `student`." },
        { q: "Where do you look when you get a `SyntaxError`?", a: "At the line it names **and the line above it**, because an unclosed bracket or quote makes Python read on to the next line before it can tell that something is wrong." }
      ]}
    ]
  }

});
