/* ============================================================
   data.en.js — English content (overrides Thai per section when LANG=en)
   window.TEACHING_EN[projectId][sectionKey] = [ ...blocks ]
   Block schema is identical to data.js. If a section is missing here,
   the renderer falls back to the Thai version in data.js.
   ============================================================ */

window.TEACHING_EN = {
  "push_swap": {
    principle: [
      { p: "Heads up: push_swap isn't just 'write a program that sorts numbers' — it's a puzzle that forces you to sort data through a tiny, fixed set of commands as cheaply as possible. That's why it actually trains algorithmic thinking." },
      { h: "What's the problem?" },
      { p: "You start with stack **A** (all the numbers) and **B** (empty). Goal: sort A ascending by **printing the sequence of commands** to stdout, one per line, using **as few operations as possible**." },
      { h: "The 11 operations (memorize these for the eval)" },
      { table: { head: ["Group", "Commands", "Effect"], rows: [
        ["swap", "sa / sb / ss", "swap the top 2 (ss = both A and B at once)"],
        ["push", "pa / pb", "move the top across stacks (pb: A→B, pa: B→A)"],
        ["rotate", "ra / rb / rr", "top element → bottom"],
        ["rev rotate", "rra / rrb / rrr", "bottom element → top"],
      ]}},
      { note: "Core idea: ss/rr/rrr act on both stacks at once but count as ONE operation — with good timing you save half the moves." },
      { h: "Scoring" },
      { table: { head: ["Count", "Full 100%", "Pass"], rows: [
        ["100 numbers", "< 700 ops", "< 1100"],
        ["500 numbers", "≤ 5500 ops", "< 8500"],
      ]}},
      { h: "Two ideas you must grasp" },
      { p: "**(a) Normalization** — turn raw values into 'ranks'. e.g. [-999, 0, 42, 1000000] → ranks [0,1,2,3]. The algorithm only cares who is bigger, so ranks make position math easy and dodge overflow." },
      { p: "**(b) Cost-based greedy (Turkish sort)** for n>5: push almost everything to B → each round pick the element that's 'cheapest' to push back into A → repeat until B is empty → rotate the smallest to the top." },
      { h: "Background: why this differs from normal sorting" },
      { p: "The sorts you learn in class (bubble, quick, merge) are judged by **time**. push_swap is judged by the **number of operations you print**, and you can only move data through 11 commands on 2 stacks (no random access). So it's a 'sort with your hands tied' puzzle — strategy matters, not just correctness." },
      { p: "The real target is 'be correct' (easy) **plus** 'use few enough ops to pass <700 / ≤5500' (hard). That second part is where the choice of algorithm decides everything." },
      { h: "Comparing algorithms (why Turkish sort won)" },
      { table: { head: ["Method", "Idea", "ops ~100", "Verdict"], rows: [
        ["Selection (push the min each time)", "find min → rotate it to top → pb, later pa back", "~900–1500", "Easiest to write, but too many ops (try the demo button)"],
        ["Radix / binary sort", "look at each bit of the rank, pb/pa per bit", "~700–1100", "Stable but borderline, and longer code"],
        ["Cost-based greedy (Turkish)", "compute a 'price' for every element in B, insert the cheapest", "~580", "Clearly passes + consistent → chosen"],
      ]}},
      { p: "**Why Turkish sort:** it treats 'insert back into A' as a minimization problem instead of inserting blindly — so every round makes the most worthwhile move. The result is low, stable op counts (100 numbers ≈ 580 every run), unlike radix (borderline) or selection (over budget)." },
      { h: "Why normalize (instead of sorting raw values)?" },
      { p: "With raw values, finding 'where to insert' means comparing arbitrarily-spread numbers and risks overflow during the math. Turning them into **ranks 0..n-1** makes every value a small, contiguous integer in a known range → you compute target/cost with pure index math: simple and unbreakable." },
      { h: "Why hardcode the small cases (n ≤ 5)?" },
      { p: "Greedy has overhead (push to B, compute cost). For 2–5 numbers it isn't worth it — small cases have very few arrangements (3 numbers = only 6), so we **hardcode the minimum-op answer** (3 numbers ≤ 2 ops), which beats letting greedy handle it." },
      { note: "Why rr/rrr matter to this choice: the thing that makes Turkish sort win is that 'cost has direction'. When A and B must rotate the same way, we merge them into rr/rrr (1 op instead of 2). Without this trick the op count blows past the budget — which is exactly why cost is designed to carry direction too." },
    ],
    theory: [
      { p: "This section gathers the **core theory to grasp first** so push_swap's code actually clicks — instead of just memorizing it." },
      { h: "1) Stack — a LIFO structure" },
      { p: "A stack is **Last In, First Out (LIFO)** — like a pile of plates: you can only add or take from the top, never reach the middle directly." },
      { ul: [
        "**push** = put on top, **pop** = take from top, **peek** = look at the top — all O(1)",
        "push_swap forces you to work within this limit: you can only touch the 'top' of 2 stacks (so you use rotate to bring the element you want up to the top)",
      ]},
      { note: "This is why it's hard: with free access to any index (a normal array) sorting would be trivial — but a stack only lets you touch the top." },
      { h: "2) Linked list" },
      { p: "There are two main ways to store an ordered sequence:" },
      { table: { head: ["", "Array", "Linked list"], rows: [
        ["Memory layout", "one contiguous block", "scattered, joined by pointers"],
        ["Access any index", "O(1) (computed address)", "O(n) (walk from the head)"],
        ["Insert/remove at head", "O(n) (shift everything)", "O(1) (just move a pointer)"],
      ]}},
      { p: "push_swap uses a linked list because its main operations (push/pop/rotate) act on the head/tail of the list, which is O(1) — no shifting the whole block like an array." },
      { h: "3) Big-O — measuring complexity" },
      { p: "Big-O tells you 'how fast work grows as the data (n) grows', looking at the trend rather than wall-clock time." },
      { table: { head: ["Notation", "Meaning", "Example here"], rows: [
        ["O(1)", "constant, independent of n", "stack push/pop"],
        ["O(n)", "linear in n", "walking A to find a target"],
        ["O(n²)", "quadratic", "normalize (compares every pair)"],
        ["O(n log n)", "lower bound of comparison sort", "the target a good sort aims for"],
      ]}},
      { note: "The twist for push_swap: we don't measure 'time', we measure the **number of operations printed**. A time-fast algorithm can still lose by printing too many ops." },
      { h: "4) Why comparison sort needs at least ~n·log₂n" },
      { p: "Think of a **decision tree**: each 'a < b ?' has 2 answers (true/false) = a branch into 2. The leaves are all possible orderings, and there are n! of them. The tree's height (longest path) is the worst-case number of comparisons — and to fit n! leaves a binary tree must be at least log₂(n!) ≈ n·log₂n tall." },
      { h: "5) Greedy algorithm" },
      { p: "Greedy = 'each step, pick the locally best thing', hoping the total comes out good. It isn't always optimal, but for many problems it's near-optimal and fast. push_swap greedily picks the 'cheapest element in B' every round → low, stable op counts (practically optimal here)." },
      { h: "6) Rank & order statistics (the basis of normalize)" },
      { p: "**A value's rank = how many elements are smaller than it.** Turning values into ranks (0..n-1) is the order-statistics idea: comparisons become small, contiguous integers, so position math is trivial." },
      { h: "7) Integers & overflow (two's complement)" },
      { p: "A 32-bit `int` stores values in **two's complement**, which makes the range asymmetric:" },
      { table: { head: ["", "Value"], rows: [
        ["INT_MAX", "2147483647 (2³¹−1)"],
        ["INT_MIN", "−2147483648 (−2³¹)"],
      ]}},
      { p: "Negatives reach one further than positives (0 takes a slot on the positive side). Adding past the edge 'wraps around' (overflow), which is undefined behavior — so push_swap accumulates in a `long` first, then checks the int bounds itself." },
      { h: "8) Permutations & combinatorics (why hardcoding 3 works)" },
      { p: "Arranging n things has n! orders — 3 things have only 3! = 6, few enough to write fixed rules covering every case (≤ 2 ops). That's the theoretical reason small cases are hardcoded instead of going through greedy." },

      { h: "🔬 Deep Dive A: the formal definition of Big-O" },
      { p: "We use Big-O loosely, but it has a precise definition: f(n) = O(g(n)) means g is a 'ceiling' for f once n is large enough." },
      { code: String.raw`f(n) = O(g(n))   iff
  there exist constants c > 0 and n0 such that
  0 <= f(n) <= c*g(n)   for all n >= n0

Example: f(n) = 3n^2 + 5n + 2  is O(n^2)
  pick c = 4, n0 = 6 :
  3n^2 + 5n + 2 <= 4n^2   when n >= 6   OK
  (the 5n+2 term is swallowed by the faster-growing n^2)`, cap: "Big-O looks only at the fastest-growing term and ignores constants — for large n that term dominates everything", lang: "txt" },
      { p: "It has relatives: **Ω (omega)** = a lower bound (at least this much), **Θ (theta)** = both upper and lower (tight). When we say 'the fastest sort is n log n' we really mean Ω(n log n) — an unavoidable lower bound." },
      { h: "🔬 Deep Dive B: proof that comparison sort needs ≥ ~n·log₂n" },
      { code: String.raw`A binary tree of height h has at most 2^h leaves.
We must cover every possible ordering -> 2^h >= n!
                                       -> h >= log2(n!)

Using Stirling's approximation:
  log2(n!) ~= n*log2(n) - n*log2(e)
           ~= n*log2(n)   (leading term)

So the worst case needs at least ~n*log2(n) comparisons.`, cap: "Tree height = number of questions on the longest path = comparisons in the worst case", lang: "txt" },
      { code: String.raw`Concrete at n = 100:
  100! ~= 9.33 x 10^157
  log2(100!) ~= 524.8  -> at least ~525 comparisons
  n*log2(n) = 100 x 6.64 ~= 664

-> this is the "theoretical floor" that explains why push_swap's
   budget is < 700 ops for 100 numbers (very close to the floor!)`, cap: "The < 700 budget isn't arbitrary — it tracks the theoretical lower bound of sorting", lang: "txt" },
      { note: "This explains why selection sort (O(n²) ops ≈ 5000+ for 100) loses badly, while Turkish sort (~580) sits very close to the ~525 floor." },
      { h: "🔬 Deep Dive C: how two's complement & overflow actually work" },
      { code: String.raw`Writing -5 in 8-bit:
   5        = 0000 0101
   flip bits = 1111 1010
   +1       = 1111 1011  = -5

Why is the range asymmetric?
   8 bits hold 256 values (2^8)
   split: positive 0..127 (128 incl 0) | negative -1..-128 (128)
   -> the negative side has one more, because 0 eats a positive slot

   32-bit int: INT_MIN = -2147483648 , INT_MAX = +2147483647
   |INT_MIN| = 2147483648, one larger than INT_MAX -> +2147483648 doesn't fit!`, cap: "This is why valid_int checks the positive bound (<=2147483647) and negative bound (<=2147483648) separately", lang: "txt" },
      { code: String.raw`What overflow is:
   INT_MAX + 1 = 0111...1 + 1 = 1000...0 = INT_MIN  (wraps around!)
   In C, signed int overflow is undefined behavior

How to guard (in the code): accumulate digits in a long (64-bit, much
   wider range), then compare against the int bounds yourself,
   before the value could ever overflow.`, lang: "txt" },
      { h: "🔬 Deep Dive D: walking the cost calculation step by step" },
      { p: "Say we want to insert an element from B back into A, where the target position in A = 3 (out of size 8) and the element in B is at pos = 6 (out of size 7):" },
      { code: String.raw`ca = cost_of(3, 8): 3 <= 8/2 (=4)?  yes -> +3   (ra x3)
cb = cost_of(6, 7): 6 <= 7/2 (=3.5)? no  -> -(7-6) = -1  (rrb x1)

different signs (+3 and -1) -> rotate opposite ways
total = |3| + |1| = 4 rotations + pa = 5 ops`, cap: "Opposite directions: just add them up", lang: "txt" },
      { code: String.raw`Compare with the "same direction" case -- ca = +3, cb = +2 :
  no rr -> ra x3 + rb x2 + pa = 6 ops
  with rr -> rr x2 (drops both together) leaving ca=+1
           -> rr x2 + ra x1 + pa = 4 ops   * saves 2 ops!

This is why pick_cost uses max(|ca|,|cb|) when directions match
(the overlapping part is merged away by rr/rrr).`, cap: "The key reason the op count drops enough to pass the budget", lang: "txt" },
      { note: "Theory takeaway: empirically Turkish sort grows like ~n·log n (100→~580, 500→~5233), close to the n·log₂n lower bound — that's why it beats radix/selection on op count." },
      { h: "📖 Further reading (go deeper on the theory)" },
      { links: [
        { label: "Big-O notation — Wikipedia", url: "https://en.wikipedia.org/wiki/Big_O_notation", note: "Formal definition + growth-rate comparison table" },
        { label: "Comparison sort (lower bound) — Wikipedia", url: "https://en.wikipedia.org/wiki/Comparison_sort", note: "Full Ω(n log n) decision-tree proof" },
        { label: "VisuAlgo — Sorting (animated)", url: "https://visualgo.net/en/sorting", note: "Watch selection/insertion/merge run visually" },
        { label: "VisuAlgo — Linked List & Stack", url: "https://visualgo.net/en/list", note: "See linked-list pointers move step by step" },
        { label: "Two's complement — Wikipedia", url: "https://en.wikipedia.org/wiki/Two%27s_complement", note: "Why INT_MIN/INT_MAX are asymmetric + overflow" },
        { label: "Stirling's approximation — Wikipedia", url: "https://en.wikipedia.org/wiki/Stirling%27s_approximation", note: "Where log₂(n!) ≈ n·log₂n comes from" },
      ]},
    ],
    foundations: [
      { h: "0) Primer: what is a pointer (for beginners)" },
      { p: "A normal variable holds a 'value', e.g. `int x = 5;`. **A pointer holds an 'address'** of another variable in memory — like a house number, not the house itself." },
      { code: String.raw`int   x = 5;
int  *p = &x;   // p holds "the address of x"  (& = address-of)
*p = 9;         // * = go to that address and change it -> now x = 9`, cap: "& = address-of, * = dereference (follow the address to read/write the value)", lang: "c" },
      { p: "We use pointers because (1) we pass an address instead of copying a whole blob, (2) a function can change the caller's real variable, and (3) we can build structures that grow, like a linked list." },
      { h: "1) How the t_node struct is built" },
      { p: "Our stack is a **linked list**: many little boxes (nodes), each pointing to the next via the `next` pointer." },
      { code: String.raw`typedef struct s_node {
    int             val;    // the real value from argv (e.g. 42)
    int             idx;    // rank after normalize (0..n-1)
    struct s_node   *next;  // address of the next node (NULL = last)
}   t_node;`, cap: "next is a pointer to the same struct type — that's the heart of a linked list", lang: "c" },
      { code: String.raw`a -> [42|next] -> [17|next] -> [99|NULL]
      ^ top                      ^ bottom`, cap: "Stack A: the variable a holds the address of the top node; the last node's next = NULL", lang: "txt" },
      { h: "2) Building a node with malloc (stack.c)" },
      { code: String.raw`t_node *new_node(int val) {
    t_node *node = malloc(sizeof(t_node));  // ask for memory for 1 box
    if (!node)                              // malloc returns NULL if it fails -> check it!
        return (NULL);
    node->val = val;                        // node->x  ==  (*node).x
    node->idx = 0;
    node->next = NULL;
    return (node);                          // return the ADDRESS of the new box
}`, cap: "malloc reserves heap memory → you must free it yourself later; always check for NULL", lang: "c" },
      { note: "`node->val` is shorthand for `(*node).val` = follow the pointer to the struct and touch field val. Use -> when the variable is a pointer to a struct." },
      { h: "3) Why a double pointer (t_node **top)?" },
      { p: "When we push/pop/rotate we sometimes have to **change the 'head' (top) itself**. Passing just a `t_node *` would only change a copy — the caller's variable wouldn't move. So we pass **the address of the top variable** = `t_node **`." },
      { code: String.raw`void stack_push(t_node **top, t_node *node) {
    node->next = *top;   // new node points at the old head
    *top = node;         // *top = change the caller's actual top variable
}`, cap: "*top = ... edits the caller's real `top` (a single-level pointer couldn't)", lang: "c" },
      { h: "4) Pointer surgery: how rotate works, step by step (ops_rotate.c)" },
      { code: String.raw`first = *stack;            // 1. remember the old head
*stack = first->next;      // 2. new head = the 2nd node
first->next = NULL;        // 3. detach first from the chain
last = *stack;
while (last->next)         // 4. walk to the end
    last = last->next;
last->next = first;        // 5. attach first at the tail`, cap: "Moves the head to the tail with NO malloc — just pointer moves (that's why linked lists are fast here)", lang: "c" },
      { h: "5) Memory management: who allocates, who frees" },
      { ul: [
        "**Allocate:** every node is born from `malloc` in new_node (1 box per number) + 1 box for the t_ps struct",
        "**Free:** `ps_free` walks the whole list calling `free` on each node, then frees the struct",
        "**Iron rule:** everything malloc'd has exactly one owner and is freed exactly once (a double free = crash)",
      ]},
      { code: String.raw`void stack_free(t_node **top) {
    t_node *tmp;
    while (*top) {
        tmp = (*top)->next;   // remember the next one FIRST
        free(*top);           // free the current box
        *top = tmp;           // advance
    }
}`, cap: "Key trick: always save ->next before free — reading ->next after free is use-after-free", lang: "c" },
      { note: "Every error path (bad input / malloc fail) calls error_exit → ps_free before writing \"Error\" and exiting → no leaks even on errors." },
    ],
    architecture: [
      { h: "File map" },
      { code: String.raw`main.c        parse -> normalize -> sort_small/large -> free
parse.c       read argv, reject duplicates, build the linked list (argv[1] = top)
validate.c    valid_int(): check integer + overflow using long
normalize.c   turn val -> idx (rank 0..n-1)
stack.c       new_node / push / pop / size / free
ops_*.c       sa sb ss / pa pb / ra rb rr / rra rrb rrr
sort_small.c  n = 2..5 (hardcoded)
sort_large.c  n > 5 (Turkish sort)
cost.c        find_target / cost_of / best_b_pos (the brain)
move.c        do_move(): turn cost into real ops + merge rr/rrr
utils.c       is_sorted / find_min_pos / ft_abs / free
checker_bonus.c   read ops from stdin -> OK/KO`, cap: "file map" },
      { h: "Data structure (push_swap.h)" },
      { code: String.raw`typedef struct s_node {
    int             val;   // raw value from argv
    int             idx;   // rank after normalize (0 = smallest)
    struct s_node   *next;
}   t_node;

typedef struct s_ps {
    t_node  *a;       // top of stack A
    t_node  *b;       // top of stack B
    int     silent;   // 1 = don't print op names (used in checker mode)
}   t_ps;`, cap: "Linked list, because push/pop are O(1)", lang: "c" },
    ],
    dataflow: [
      { p: "This section walks through **every function** — why it exists, what it takes and from whom, and what it passes on — so you can see data flow through the whole program." },
      { h: "Call flow overview" },
      { code: String.raw`main(argc, argv)
 |
 +- parse_args --------> build_stack --> valid_int -> count_digits
 |   (returns t_ps*)        (loop argv)  +-> has_dup
 |                                       +-> new_node -> append_node
 |
 +- normalize(ps) -----> count_smaller   (fills node->idx for every node)
 |
 +- is_sorted(ps->a)? -- yes -> skip to free
 |
 +- sort_small(ps)  [n<=5] > sort_2 / sort_3 / bring_to_top -> find_idx_pos
 |  sort_large(ps)  [n>5]  > push_all_to_b
 |                         > insert_from_b -> best_b_pos -> pick_cost -> find_target / cost_of
 |                         |              +-> get_at
 |                         |              +-> do_move -> do_same_dir / rotate_a_by / rotate_b_by
 |                         +-> rotate_sorted_top -> find_min_pos
 |
 +- ps_free(ps) -------> stack_free

Every operation (sa..rrr, pa/pb) calls the stack ops then write("xx\n").
If ps->silent==1 (checker mode) it does not write.`, cap: "Arrows = 'calls / passes data to'", lang: "txt" },
      { note: "The core of the flow: a single struct `t_ps *ps` travels through the whole program → every function takes this pointer, so they all read/edit the same stacks A,B (no copying of stacks)." },
      { h: "Tracing the life of one number (argv → output)" },
      { code: String.raw`"42" (argv[i])
  +-> valid_int("42")          check it's an int -> passes
  +-> ft_atoi("42") = 42       it's a real number
  +-> new_node(42)             malloc a node, node->val = 42
  +-> append_node             link at the tail  ->  lives in ps->a
  +-> normalize               count_smaller counts how many are < 42
                              -> stored in node->idx (say idx = 7)
  +-> sort_large uses node->idx (never val again) to compute target/cost
  +-> when pa/pb/ra move this node -> write the op name to stdout`, cap: "The raw value (val) is only used during normalize → after that the algorithm runs on idx alone", lang: "txt" },
      { h: "parse.c / validate.c — bring input into the system" },
      { table: { head: ["Function", "Why it exists (role)", "Takes · from whom", "Returns/passes · to whom"], rows: [
        ["valid_int(s)", "First gate: is the arg a valid 32-bit int?", "string argv[i] · from build_stack", "1/0 → build_stack decides error"],
        ["count_digits (static)", "Count digits + check overflow via long", "s,i,neg · from valid_int", "1/0 → valid_int"],
        ["has_dup(stack,val)", "Reject duplicate numbers", "list head + value · from build_stack", "1/0 → build_stack"],
        ["build_stack (static)", "Core of parse: loop argv, build list A", "argc,argv,ps · from parse_args", "list head (t_node*) → parse_args"],
        ["parse_args", "Prepare t_ps, then build the stack", "argc,argv · from main", "t_ps* → main"],
      ]}},
      { h: "stack.c — the stack primitives (reused everywhere)" },
      { table: { head: ["Function", "Why it exists", "Takes · from whom", "Returns/effect · to whom"], rows: [
        ["new_node(val)", "Make a new node (malloc + init)", "int · from build_stack", "t_node* → append_node"],
        ["stack_push(**top,n)", "Push a node on top (can change top → double ptr)", "**top,node · from pa/pb", "edits *top in place"],
        ["stack_pop(**top)", "Pop the top node", "**top · from pa/pb", "t_node* + edits *top"],
        ["stack_size(top)", "Count (used to decide things everywhere)", "top · from sort/cost/move", "int"],
        ["stack_free(**top)", "Free the whole list", "**top · from ps_free", "*top = NULL"],
      ]}},
      { h: "ops_*.c — the 11 commands (the only code that writes output)" },
      { table: { head: ["Function", "Why it exists", "Takes · from whom", "Effect"], rows: [
        ["sa / sb / ss", "Swap the top 2", "t_ps* · from sort_*", "edit stack + write op name"],
        ["pa / pb", "Move across stacks (= pop+push)", "t_ps* · from sort_*/do_move", "move a node + write"],
        ["rotate_one (static)", "Rotate mechanic top→bottom (pointer surgery)", "**stack · from ra/rb/rr", "edits list in place"],
        ["ra / rb / rr", "Rotate forward (rr = both, 1 op)", "t_ps* · from rotate_*_by/sort", "call rotate_one + write"],
        ["rev_rotate_one (static)", "Rotate mechanic bottom→top", "**stack · from rra/rrb/rrr", "edits list in place"],
        ["rra / rrb / rrr", "Rotate backward (rrr = both, 1 op)", "t_ps* · from rotate_*_by/sort", "call rev_rotate_one + write"],
      ]}},
      { h: "sort_small.c / sort_large.c — the sorting strategy" },
      { table: { head: ["Function", "Why it exists", "Takes · from whom", "Passes · to whom"], rows: [
        ["sort_2 / sort_3", "Sort tiny cases optimally (≤2 ops)", "t_ps* · from sort_small/large", "calls sa/ra/rra"],
        ["find_idx_pos (static)", "Find the position of a target idx", "stack,target · from bring_to_top", "int pos"],
        ["bring_to_top (static)", "Rotate target idx to the top (shorter way)", "ps,target · from sort_small", "calls ra/rra"],
        ["sort_small", "Drive the n=2..5 cases", "t_ps* · from main", "calls sort_2/3, pb, pa"],
        ["get_at (static)", "Fetch the node at pos in B", "stack,pos · from insert_from_b", "t_node*"],
        ["push_all_to_b (static)", "Push A→B until 3 remain", "ps · from sort_large", "calls pb"],
        ["insert_from_b (static)", "Loop: insert the cheapest one back", "ps · from sort_large", "best_b_pos→get_at→find_target→do_move"],
        ["rotate_sorted_top (static)", "Rotate idx=0 to the top (finish)", "ps · from sort_large", "find_min_pos + ra/rra"],
        ["sort_large", "Drive the Turkish-sort flow", "t_ps* · from main", "calls the 4 above"],
      ]}},
      { h: "cost.c / move.c — the brain + the hands of Turkish sort" },
      { table: { head: ["Function", "Why it exists", "Takes · from whom", "Returns/passes"], rows: [
        ["find_min_in_a (static)", "Find pos of the smallest idx in A", "ps · from find_target", "int → find_target"],
        ["find_target(ps,b_idx)", "Where in A this B element should go", "ps + idx · from insert_from_b/pick_cost", "int pos"],
        ["cost_of(pos,size)", "Turn pos → rotations + direction (sign)", "pos,size · from pick_cost/do_move", "int (signed)"],
        ["pick_cost (static)", "Combined A+B cost (merging rr/rrr)", "ps,node,pos · from best_b_pos", "int → best_b_pos"],
        ["best_b_pos(ps)", "Pick the cheapest element in B", "ps · from insert_from_b", "int pos"],
        ["rotate_a_by / rotate_b_by (static)", "Rotate by the leftover ca/cb", "ps,c · from do_move", "calls ra/rra or rb/rrb"],
        ["do_same_dir (static)", "Merge same-direction rotations into rr/rrr", "ps,*ca,*cb · from do_move", "reduces ca,cb via pointer"],
        ["do_move(ps,pa,pb)", "Execute one insertion", "ps + 2 pos · from insert_from_b", "do_same_dir/rotate/pa"],
      ]}},
      { h: "utils.c / checker_bonus.c" },
      { table: { head: ["Function", "Why it exists", "Takes · from whom", "Returns/effect"], rows: [
        ["is_sorted(stack)", "Check if sorted (avoid extra work + checker)", "stack · from main/checker", "1/0"],
        ["find_min_pos(stack)", "Find pos of idx=0", "stack · from rotate_sorted_top", "int"],
        ["ft_abs(n)", "Absolute value (cost can be negative)", "int · from pick_cost", "int"],
        ["ps_free / error_exit", "Free memory / quit on error", "ps · from every error path", "free then exit"],
        ["apply_op (static)", "[bonus] turn a line → call the op", "line · from read_ops", "call op (silent)"],
        ["read_ops (static)", "[bonus] read every line from stdin", "ps · from main", "loop apply_op"],
      ]}},
    ],
    implementation: [
      { h: "1) Overflow check with long (validate.c)" },
      { code: String.raw`n = n * 10 + (s[i] - '0');
if (n > 2147483648L)        // long prevents overflow mid-addition
    return (0);
...
if (neg) return (n <= 2147483648L);  // negatives reach -2147483648
return (n <= 2147483647L);           // positives reach  2147483647`, cap: "Accumulate in long, then compare to int bounds — handle the + and − edges separately", lang: "c" },
      { h: "2) Normalize into ranks (normalize.c)" },
      { code: String.raw`ptr->idx = count_smaller(ps->a, ptr->val); // how many are smaller = rank`, cap: "O(n²) but fine for n ≤ 500", lang: "c" },
      { h: "3) Small sort (sort_small.c)" },
      { code: String.raw`bring_to_top(ps, 0); pb(ps);             // push rank 0 down to B
if (size == 5) { bring_to_top(ps, 1); pb(ps); }
sort_3(ps);
pa(ps); if (size == 5) pa(ps);`, cap: "n=4,5: push the smallest down to B → sort the 3 left → push back", lang: "c" },
      { h: "4) Large sort = Turkish sort (sort_large.c)" },
      { code: String.raw`void sort_large(t_ps *ps) {
    push_all_to_b(ps);     // push down until 3 remain in A
    sort_3(ps);            // sort the last 3
    insert_from_b(ps);     // pull the "cheapest" element back into A, one at a time
    rotate_sorted_top(ps); // rotate the smallest to the top
}`, lang: "c" },
      { h: "5) Cost = the brain of the algorithm (cost.c)" },
      { code: String.raw`int cost_of(int pos, int size) {
    if (pos <= size / 2) return (pos);   // rotate forward (ra) -> positive
    return (-(size - pos));              // rotate backward (rra) -> negative
}`, cap: "Sign = rotation direction, magnitude = number of rotations — two facts in one int", lang: "c" },
      { code: String.raw`if (same direction) return max(|ca|, |cb|);  // rotate together with rr/rrr
else                return |ca| + |cb|;      // opposite ways, rotate separately`, cap: "pick_cost(): combined cost of A and B", lang: "c" },
      { h: "6) Execute the move — where rr/rrr actually fire (move.c)" },
      { code: String.raw`do_same_dir(ps, &ca, &cb);   // both positive -> rr / both negative -> rrr
rotate_a_by(ps, ca);         // remaining A rotations -> ra/rra
rotate_b_by(ps, cb);         // remaining B rotations -> rb/rrb
pa(ps);                      // push into A`, lang: "c" },
    ],
    tricks: [
      { ul: [
        "**rr/rrr merge rotations** when A and B must turn the same way → halves the ops during that stretch (the thing that gets you under 700/5500)",
        "**cost carries a sign** = direction + count packed into one int (+ = ra, − = rra)",
        "**normalize into ranks** → no comparing raw values, no overflow worries during the sort",
        "**A becomes circularly sorted** after inserts → finish by rotating the smallest to the top just once",
        "**silent flag** lets the same code drive both push_swap (prints) and checker (doesn't)",
        "**bring_to_top picks the shorter direction** by comparing pos to size/2",
        "**overflow via long** + separate positive/negative bounds",
      ]},
    ],
    eval: [
      { qa: [
        { q: "Why a linked list instead of an array?", a: "push/pop are O(1) (just move a pointer) with no shifting like an array, and rotate is just pointer relinking." },
        { q: "What is normalize and why do it?", a: "It turns raw values into ranks 0..n-1, because the algorithm only cares about order — this makes computing insert positions easy and avoids overflow." },
        { q: "Explain the algorithm for large n.", a: "Turkish/greedy — push down to B until 3 remain, sort those 3, then pull the cheapest element from B back into A one at a time, and finally rotate the smallest to the top." },
        { q: "How is cost computed, and why can it be negative?", a: "cost_of returns +pos when rotating forward is cheaper, and -(size-pos) when rotating backward is cheaper. The sign says the direction, the magnitude says how many rotations." },
        { q: "How does rr help?", a: "When A and B must rotate the same way, rr replaces ra+rb → 1 op instead of 2." },
        { q: "What errors do you handle?", a: "Non-numbers, trailing junk, overflow, duplicates, and empty string \"\" → write(2,\"Error\\n\",6) then exit(1), freeing memory every time first." },
        { q: "What do ./push_swap (no args) or ./push_swap 1 do?", a: "Print nothing (argc<2 → return 0; a single/already-sorted input → is_sorted is true)." },
        { q: "How do you check for memory leaks?", a: "valgrind --leak-check=full ./push_swap 3 2 1 — every error path calls ps_free before exiting." },
        { q: "How does the checker (bonus) decide OK?", a: "It reads ops from stdin and applies them silently; at the end, if is_sorted(a) && b is empty → OK, otherwise KO; an unknown op → Error." },
      ]},
      { h: "Test commands to show the evaluator" },
      { code: String.raw`ARG=$(shuf -i 1-100 -n 100 | tr '\n' ' '); ./push_swap $ARG | wc -l        # < 700
ARG=$(shuf -i 1-500 -n 500 | tr '\n' ' '); ./push_swap $ARG | ./checker_linux $ARG # OK
./push_swap 2147483648   # Error (overflow)
./push_swap 1 2 2        # Error (duplicate)`, lang: "bash" },
    ],
  },
};
