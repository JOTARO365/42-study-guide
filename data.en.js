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

  "philosophers": {
    theory: [
      { p: "This section gathers the **multithreading + synchronization** theory you need before reading the philosophers code." },
      { h: "1) Process vs Thread" },
      { table: { head: ["", "Process", "Thread"], rows: [
        ["Memory", "separate blocks", "shared, one block"],
        ["Communication", "hard (needs IPC)", "easy (read the same variable)"],
        ["mandatory uses", "—", "✓ pthread (1 thread/philosopher)"],
        ["bonus uses", "✓ fork (1 process/philosopher)", "—"],
      ]}},
      { p: "mandatory uses **threads**: each philosopher = 1 thread, all threads share the same memory (the data struct), which makes sharing state easy — but you must watch out for race conditions." },
      { h: "2) What is a race condition" },
      { p: "A **race condition** happens when 2 threads read/write a shared variable at the same time, and the result depends on 'who wins the race' — unpredictable → a bug that sometimes happens, sometimes not (a heisenbug)." },
      { code: String.raw`thread A: meals_eaten++   (read 5 -> +1 -> write 6)
thread B: meals_eaten++   (read 5 -> +1 -> write 6)
overlap: should be 7 but ends up 6 -> data lost!`, cap: "++ is not atomic — it's read-add-write, three steps that can be interleaved", lang: "txt" },
      { h: "3) Mutex (Mutual Exclusion)" },
      { p: "A **mutex** is a lock guaranteeing 'only 1 thread at a time' touches a resource. A thread must `lock` before entering and `unlock` when leaving — if someone holds the key, others wait." },
      { p: "In philosophers: **each fork = 1 mutex**. Picking up a fork = lock; putting it down = unlock. There are also mutexes for print, the stop flag, and meal data." },
      { h: "4) Deadlock — the 4 Coffman conditions" },
      { p: "Deadlock happens only when all 4 of these hold at once — break any single one and you prevent it:" },
      { table: { head: ["Condition", "Meaning", "We break it by"], rows: [
        ["Mutual exclusion", "a resource is used by one at a time", "(necessary, kept)"],
        ["Hold and wait", "hold one resource while waiting for another", "—"],
        ["No preemption", "can't snatch a resource from someone else", "—"],
        ["Circular wait", "everyone waits in a cycle", "✓ even/odd pick order → cut the cycle"],
      ]}},
      { h: "5) Measuring time in ms: gettimeofday" },
      { p: "You must detect death accurately to the millisecond. Use `gettimeofday` converted to ms:" },
      { code: String.raw`long get_time(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return (tv.tv_sec * 1000L + tv.tv_usec / 1000);
}`, cap: "seconds x1000 + microseconds/1000 = time in ms", lang: "c" },

      { h: "🔬 Deep Dive A: Deadlock & the Coffman conditions — proof of why 'staggered pick order' avoids deadlock" },
      { p: "**Picture it first:** 5 people around a round table, a fork between each pair (5 forks). If **everyone grabs their left fork at the same time** → everyone holds a left fork, then reaches right for a fork 'the neighbour is already holding' → everyone waits in a circle forever, nobody lets go = the whole table hangs. That's deadlock." },
      { p: "**Mechanism:** deadlock can only occur when all **4 Coffman conditions hold simultaneously** — the key theorem is that removing any one of them prevents deadlock entirely:" },
      { code: String.raw`Coffman conditions (all 4 needed for deadlock):
  1. Mutual exclusion : a fork is held by one at a time   (necessary - keep)
  2. Hold and wait    : hold the left fork, wait for the right
  3. No preemption    : can't grab a fork from someone's hand
  4. Circular wait    : P0->P1->P2->P3->P4->P0 wait in a cycle  <- we cut this

The wait cycle (when everyone grabs left first at once):
  P0 holds fork0 waits fork1 (P1 holds)
  P1 holds fork1 waits fork2 (P2 holds)
  P2 holds fork2 waits fork3 (P3 holds)
  P3 holds fork3 waits fork4 (P4 holds)
  P4 holds fork4 waits fork0 (P0 holds)  -> cycle closed = hang`, cap: "Everyone 'grabs in the same direction', forming a closed loop — the heart of deadlock is this symmetry", lang: "txt" },
      { p: "**Step 1 — formalize with a Resource Allocation Graph (RAG):** draw a directed graph — an arrow 'person → fork' = 'waiting for' that fork, an arrow 'fork → person' = that fork is 'held by' that person. **Theorem (single-instance resources):** when each resource has exactly one instance (one fork = one mutex), the system is in deadlock **if and only if** the RAG contains a cycle. So 'preventing deadlock' = 'making a cycle impossible'." },
      { code: String.raw`RAG once everyone has grabbed their left fork at once (n=5):

  P0 ──wait──▶ fork1 ──held by──▶ P1 ──wait──▶ fork2 ──held──▶ P2
  ▲                                                              │
  held                                                          wait
  │                                                              ▼
  fork0 ◀─held─ P4 ◀─wait─ fork4 ◀─held─ P3 ◀─wait─ fork3 ◀─held─┘

  follow the arrows back to P0 = a "closed loop" (cycle) -> deadlock`, cap: "single-instance forks → a cycle in the RAG is the necessary AND sufficient condition for deadlock — so the problem reduces to 'never allow a cycle'", lang: "txt" },
      { p: "**Step 2 — proof that 'resource ordering' (Dijkstra) provably cuts the cycle:** number every fork 0..n−1 and enforce one rule — **everyone must lock the lower-numbered fork first**. Proof by contradiction: suppose a cycle does form. In a closed loop there must be at least one person who 'holds a **higher**-numbered fork while waiting for a **lower**-numbered one' (because if everyone held-low/waited-high climbing upward, the loop could never close back — there must be at least one point where the number drops). But the rule says lock the lower number before the higher → that person must have **already** acquired the lower fork before holding the higher one, so it's impossible for them to be 'holding higher, waiting for lower' → contradiction → **no cycle can ever form** ▮" },
      { p: "**even/odd cuts circular wait by the same principle (a lighter variant):** it isn't strict resource-ordering (it doesn't compare min/max fork numbers each time), but it achieves the same end: **never letting everyone lock 'in the same rotational direction'**. With even people grabbing left (fork i) first and odd grabbing right (fork (i+1)%n) first → the rotational symmetry breaks → at least one adjacent pair collides on a shared fork, one grabs both first → the loop never closes (and it's norm-friendly since you don't store/compare fork numbers)." },
      { code: String.raw`worked example, tick by tick: n=3 (fork number = index)
  P0(even): lock fork0(left) -> fork1(right)
  P1(odd):  lock fork2(right) -> fork1(left)    <- asks fork2 first
  P2(even): lock fork2(left) -> fork0(right)    <- asks fork2 first

  t0: P0 grabs fork0,fork1 -> eats
      P1 grabs fork2, waits fork1 (P0 holds)
      P2 waits fork2 (P1 holds)               <- P1,P2 collide on fork2: P1 wins
  t1: P0 releases fork0,fork1
      P1 grabs fork1 too -> eats
      P2 still waits fork2
  t2: P1 releases fork2,fork1
      P2 grabs fork2 -> fork0(free) -> eats
  -> everyone eats, the RAG never closes into a cycle at any tick ✓`, cap: "every tick has a 'winner' that gets both forks → the 'everyone holds one and hangs' state never arises → the cycle never closes", lang: "txt" },
      { note: "Prove it yourself: draw the RAG of 3 people when everyone grabs left first — you'll clearly see the cycle P0→P1→P2→P0. Then apply the even/odd rule and redraw the RAG at every tick: you won't find a cycle at any moment — that's the visual evidence for the proof above." },
      { qa: [
        { q: "Could you prevent deadlock by cutting 'Hold and wait' instead of Circular wait?", a: "Yes — e.g. force 'grab both forks all-or-nothing' (if you can't get both, put them back immediately). Cutting any one Coffman condition is enough; even/odd just happens to cut Circular wait because it's the easiest to implement." },
        { q: "Does n=1 (a single philosopher) deadlock?", a: "It's not deadlock but **starvation by design**: there's only one fork, you can grab one side → you can't eat → you must die at time_to_die. You must handle this case separately (lone_philo), otherwise you'd lock the same fork twice and hang." },
        { q: "Why is everyone grabbing the left fork together more dangerous than grabbing randomly?", a: "Because it's 'symmetric' — everyone does exactly the same thing, so a closed loop forms most easily. Breaking the symmetry (even/odd grab opposite sides) is the key to preventing deadlock." },
      ]},

      { h: "🔬 Deep Dive B: Data race & atomicity — why last_meal must live under a mutex" },
      { p: "**Picture it:** 2 threads touch the same variable 'at the same time' with nobody guarding it = like 2 people writing over each other on one whiteboard — the result depends on unpredictable CPU timing." },
      { p: "**Mechanism:** the problem is that an operation that looks like 'one line' is actually not atomic. `meals_eaten++` is 3 steps:" },
      { code: String.raw`philo->meals_eaten++  breaks into 3 steps (read-modify-write):
  1. load old value from memory -> register   (e.g. 4)
  2. +1 in the register                        (= 5)
  3. write back to memory                       (= 5)

If the monitor reads last_meal in the middle:
  the owner thread: mid-write of last_meal = now (not finished)
  the monitor:      reads last_meal right now -> a half-written value
  -> decides 'dead or not' from garbage -> wrong verdict`, cap: "This kind of bug is intermittent (a heisenbug) — passes 100 runs, breaks on run 101", lang: "txt" },
      { p: "**Trace it tick by tick to see the data 'vanish' (lost update):** suppose 2 threads increment meals_eaten (currently 4) at once with no lock — the CPU can switch threads at any step:" },
      { code: String.raw`start meals_eaten = 4 (in memory)

  time │ thread A           │ thread B           │ memory
  ─────┼────────────────────┼────────────────────┼────────
   t0  │ R_A = load (4)     │                    │  4
   t1  │                    │ R_B = load (4)     │  4   <- B reads before A writes
   t2  │ R_A = R_A + 1 (5)  │                    │  4
   t3  │                    │ R_B = R_B + 1 (5)  │  4
   t4  │ store R_A -> 5     │                    │  5
   t5  │                    │ store R_B -> 5     │  5   <- overwrites!

  -> 2 meals eaten but meals_eaten = 5 (should be 6) -> must_eat breaks`, cap: "the load/compute/store of 2 threads 'interleave' — a mutex forces those 3 steps to finish before another thread starts", lang: "txt" },
      { p: "**Why the monitor can mis-judge death (torn read):** a 64-bit `long last_meal` is written as 2 halves (hi/lo word) on some architectures. If the monitor reads right across a write:" },
      { code: String.raw`owner: old last_meal = 1000, writing new value = 5000
  store lo-word first ... (value is a transient mix, e.g. 4096)
       ^ monitor reads exactly here -> gets 4096 (half old, half new)

  now = 5200, time_to_die = 1000
  since = now - last_meal = 5200 - 4096 = 1104  > 1000
  -> monitor declares "died" though it just finished eating! (false positive)`, cap: "reading a 64-bit value across a write = garbage -> wrong death verdict; this is why BOTH the read and write side must sit under the same meal_lock", lang: "txt" },
      { p: "**Fix:** wrap every read/write of shared data with the **same** mutex, forcing those 3 steps to be indivisible (atomic) from another thread's view:" },
      { code: String.raw`// write (the owner, when starting to eat)
pthread_mutex_lock(&philo->meal_lock);
philo->last_meal = get_time();
philo->meals_eaten++;
pthread_mutex_unlock(&philo->meal_lock);

// read (the monitor)
pthread_mutex_lock(&philo->meal_lock);
long since = get_time() - philo->last_meal;
pthread_mutex_unlock(&philo->meal_lock);
// then decide 'outside' the lock, from the copied value`, cap: "Iron rule: reading and writing the same shared value must use the same mutex, or they still collide", lang: "c" },
      { note: "Run it yourself: compile with `-fsanitize=thread`, or run `valgrind --tool=helgrind ./philo 4 410 200 200` — if there's a data race it points to the exact colliding read/write lines." },
      { qa: [
        { q: "Why lock even when only 'reading' (the monitor doesn't write)?", a: "Because 'reading while another thread is writing' is also a data race — you may get a half-written value (especially a 64-bit variable on some machines). You must lock both the read and the write side." },
        { q: "Does using different mutexes for the read and write side prevent the race?", a: "No — a mutex only excludes those fighting over the 'same key'. If the reader uses key A and the writer uses key B, both can enter at once = still a race. It must be the same key." },
        { q: "Why does printing ('philo x is eating') need print_lock?", a: "If several threads call write at once, characters can interleave mid-line. print_lock forces one complete line at a time (and you must check stop under the same lock, so nothing prints after 'died' is announced)." },
      ]},

      { h: "🔬 Deep Dive C: Mutex vs Semaphore — why mandatory uses thread+mutex but bonus uses process+semaphore" },
      { p: "**Picture it:** a mutex = a single bathroom key (one at a time, and the one who locked it must unlock it). A semaphore = a seat counter in a shop (k seats; each entry decrements it, when it hits 0 you wait — and anyone may release)." },
      { table: { head: ["", "Mutex", "Semaphore"], rows: [
        ["Value held", "binary (locked/unlocked)", "a counter (0..k)"],
        ["Ownership", "yes — the locker must unlock", "none — anyone can post/wait"],
        ["Scope", "within one process (shared memory)", "across processes (named: sem_open)"],
        ["philosophers uses it for", "mandatory (1 thread/philo, 1 mutex/fork)", "bonus (1 process/philo, a semaphore counting forks)"],
      ]}},
      { p: "**Why bonus must switch to a semaphore:** bonus uses `fork()` to split into separate processes → **memory is not shared** → a mutex (which lives in shared memory) can't work across processes. A named semaphore (`sem_open`) lives in the OS; every process opens it by the same name and they share it." },
      { code: String.raw`bonus: forks = one semaphore, counter = number of free forks
  sem_t *forks = sem_open("/forks", O_CREAT, 0644, num_philo);

  take fork:  sem_wait(forks)   // counter -1 (if 0 -> wait)
              sem_wait(forks)   // take 2 forks = wait twice
  put fork:   sem_post(forks)   // counter +1
              sem_post(forks)`, cap: "The semaphore counts 'total free forks' — it doesn't care who holds which, unlike a mutex tied to each fork", lang: "c" },
      { p: "**Proof that 'limiting to n−1 active diners' prevents deadlock:** deadlock (a full circular wait) can only happen when **all n philosophers hold one fork at the same time** (the full cycle from Deep Dive A). Use a second semaphore as 'seats' = n−1 to cap simultaneous fork-takers at n−1 → it becomes impossible for all n to hold a fork at once → the cycle can never close → no deadlock ▮" },
      { code: String.raw`bonus prevents deadlock with n-1 'seats':
  sem_t *seats = sem_open("/seats", O_CREAT, 0644, num_philo - 1);

  before taking forks:  sem_wait(seats)     // claim a seat (wait if full)
    sem_wait(forks); sem_wait(forks)          // take 2 forks
    ...eat...
    sem_post(forks); sem_post(forks)          // put forks down
  sem_post(seats)                           // leave the seat

  -> at most n-1 act at once -> all n can never hold a fork together`, cap: "capping 'contestants' below the headcount removes the full-cycle condition entirely", lang: "c" },
      { p: "**The pitfall of a semaphore having no 'ownership':** a mutex is tied to its owner (whoever locks must unlock), but anyone can post a semaphore — if you accidentally `sem_post` more than you `sem_wait`, the counter 'inflates' beyond reality → 2 processes can grab the same fork at once = silent corruption with no error. Always pair wait/post exactly." },
      { note: "bonus pitfall: the semaphore counts a total without knowing fork 'positions' → prevent deadlock by limiting to num_philo-1 eaters at a time. And you must sem_close + sem_unlink at the end, or the semaphore lingers in /dev/shm." },
      { qa: [
        { q: "Why can't a mutex work across processes (bonus)?", a: "A normal mutex keeps its state in the process's memory. After fork splits the processes, each has its own memory block → each sees its own mutex, not the same one. You need a named semaphore owned centrally by the OS." },
        { q: "What does initializing the semaphore to num_philo mean?", a: "It means there are num_philo free forks to grab. Each sem_wait decrements the counter; at 0 the next taker waits until someone sem_posts (puts a fork back)." },
        { q: "How does a mutex differ from a binary semaphore (k=1)?", a: "They look similar but differ in 'ownership': a mutex requires the locking thread to unlock it (ownership), while a binary semaphore can be posted by anyone → useful to signal across threads/processes, but easy to misuse if you post too many times." },
      ]},

      { h: "🔬 Deep Dive D: why plain usleep isn't precise enough" },
      { p: "`usleep(n)` only guarantees 'at least n' — the OS may wake you later. If you sleep one long block, you might overshoot the death time before waking. So the code does a **precise_sleep**: sleep in short 200µs slices in a loop, checking the real clock and the stop flag each time → wakes on time and stops immediately when someone dies." },
      { code: String.raw`void precise_sleep(long ms, t_data *data) {
    long start = get_time();
    while (get_time() - start < ms) {
        if (is_stopped(data)) break;   // someone died, stop now
        usleep(200);                    // sleep briefly, recheck
    }
}`, cap: "smart busy-wait: more precise than one big usleep, and reacts to stop quickly", lang: "c" },
      { p: "**Why one big usleep overshoots:** the OS scheduler wakes a thread on a system 'tick' (typically ~1–10 ms) plus current load — `usleep(200000)` (200 ms) may actually wake at ~207 ms. If only 203 ms of time_to_die remained, you'd die when you shouldn't. Slicing the sleep into 200µs pieces keeps the accumulated error within ~1 slice (~0.2 ms) instead of drifting by several ms." },
      { p: "**Death-detection latency:** the monitor loops every ~500µs, so in the worst case it learns of a death up to ~500µs after the real deadline. The slice must be **small relative to time_to_die** so `died` prints within the tolerated error (42 usually allows ~10 ms)." },
      { code: String.raw`slice-size balance (both precise_sleep and the monitor):
  big slice (e.g. 5 ms)  -> light CPU but slow death detection (may exceed limit)
  tiny slice (e.g. 50 us) -> fast detection but high CPU (near busy-loop)
  ~200us-500us           -> the sweet spot: catches deaths in time without burning CPU

rule of thumb: the slice should be << the smallest time in the problem (often time_to_die)`, cap: "slice size = trade-off between timing accuracy (smaller = sharper) and CPU use (smaller = costlier)", lang: "txt" },
      { note: "Measure it yourself: wrap `gettimeofday` around precise_sleep(200) and print the real elapsed time — compare one usleep(200000) vs slicing 200µs: the single block jitters more and overshoots more easily under load." },
      { h: "📖 Further reading" },
      { links: [
        { label: "Dining philosophers problem — Wikipedia", url: "https://en.wikipedia.org/wiki/Dining_philosophers_problem", note: "the original problem + several solutions" },
        { label: "Deadlock — Wikipedia", url: "https://en.wikipedia.org/wiki/Deadlock", note: "the 4 Coffman conditions + deadlock prevention" },
        { label: "man7 — pthreads(7)", url: "https://man7.org/linux/man-pages/man7/pthreads.7.html", note: "POSIX threads overview" },
        { label: "man7 — pthread_mutex_lock(3p)", url: "https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html", note: "official mutex lock/unlock docs" },
      ]},
    ],
    principle: [
      { h: "What's the problem (Dining Philosophers)" },
      { p: "N philosophers sit around a round table doing 3 things in a loop: **eat → sleep → think**. Between each pair of people sits **one fork** (N forks total). To eat you must hold **two forks** (left + right) at once — but each fork is shared with the neighbour." },
      { code: String.raw`        P1
      🍴  🍴
   P5          P2
    🍴          🍴
      P4 🍴 P3
each person needs left+right forks to eat
-> both neighbours want the same fork = contention`, cap: "Forks are scarce, people outnumber them -> you must schedule so everyone eats and nobody starves", lang: "txt" },
      { h: "Win/lose conditions" },
      { ul: [
        "If any philosopher **doesn't eat within `time_to_die` ms** since their last meal → they **die** → the program must print `died` and stop immediately",
        "No philosopher may die — you must time things so everyone eats in time",
        "If a 5th argument (`must_eat`) is given: once everyone has eaten that many meals → end the simulation cleanly",
      ]},
      { h: "Arguments" },
      { code: String.raw`./philo  n_philo  t_die  t_eat  t_sleep  [n_meals]
             │      │      │      │        └ (optional) stop after this many meals
             │      │      │      └ time to sleep (ms)
             │      │      └ time to eat (ms)
             │      └ die if no meal within this many ms
             └ number of philosophers`, lang: "txt" },
      { h: "Why this problem is brutal" },
      { p: "This is the classic **concurrency** problem — many threads run at once and contend for shared resources. The challenge is three things at once: (1) **no deadlock** (everyone holds one fork and waits in a cycle), (2) **no data race** (writing/reading shared variables simultaneously), (3) **exact timing** (detecting death accurate to the ms)." },
      { h: "What is deadlock — the heart of the problem" },
      { p: "If everyone grabs their **left fork at the same time**, each holds one fork and waits forever for the right (which the neighbour holds) → the whole ring hangs = **deadlock**. Designing a good fork-pickup order is the key to passing this project." },
      { note: "How this code prevents deadlock: **even-numbered philosophers grab left first, odd-numbered grab right first** — breaking the symmetry so it's impossible for everyone to hold one fork and wait in a cycle." },
    ],
    foundations: [
      { p: "This section digs into the **struct, shared memory, and mutexes** philosophers uses." },
      { h: "The 2 main structs" },
      { code: String.raw`typedef struct s_philo {
    int             id;
    pthread_t       thread;        /* this person's thread */
    long            meals_eaten;
    long            last_meal;     /* time of last meal (ms) */
    pthread_mutex_t *left_fork;    /* points to the left fork */
    pthread_mutex_t *right_fork;   /* points to the right fork */
    pthread_mutex_t meal_lock;     /* guards last_meal/meals_eaten */
    t_data          *data;         /* points back to shared data */
} t_philo;

typedef struct s_data {
    int             num_philo;
    long            time_to_die, time_to_eat, time_to_sleep, must_eat;
    int             stop;          /* flag: is the sim over yet */
    long            start_time;
    pthread_mutex_t *forks;        /* array of mutexes (forks) */
    pthread_mutex_t print_lock;    /* keeps prints from overlapping */
    pthread_mutex_t stop_lock;     /* guards reads/writes of stop */
    t_philo         *philos;
} t_data;`, cap: "data = shared central state every thread sees; philo = each person's own state", lang: "c" },
      { h: "Forks = an array of mutexes shared between neighbours" },
      { code: String.raw`philos[i].left_fork  = &forks[i];
philos[i].right_fork = &forks[(i + 1) % num_philo];`, cap: "person i's left fork = forks[i]; right fork = forks[i+1] wrapped with %num -> round table", lang: "c" },
      { p: "Note: person i's right fork **is the same fork** as person i+1's left fork — this 'sharing' is exactly why you need a mutex to avoid contention." },
      { h: "The 4 kinds of mutex in this code" },
      { table: { head: ["mutex", "protects what"], rows: [
        ["`forks[i]`", "each fork — held by one person at a time"],
        ["`meal_lock` (per person)", "that person's last_meal & meals_eaten"],
        ["`print_lock`", "log lines don't print over each other"],
        ["`stop_lock`", "the stop flag read/written by many threads"],
      ]}},
      { note: "Why a separate meal_lock per person: the monitor (another thread) reads last_meal while the owner is writing it → you must lock against each other, or it's a race." },
      { h: "Why stop is an int + mutex, not a plain variable" },
      { p: "The `stop` flag is read by every thread (in its loop) and written by the monitor — shared data that can race, so it must always be read/written through `stop_lock` (the `is_stopped` and `set_stop` functions)." },
    ],
    architecture: [
      { h: "Project files (mandatory)" },
      { table: { head: ["File", "Role"], rows: [
        ["`main.c`", "parse → init → spawn threads → monitor → join → cleanup"],
        ["`parse.c`", "read arguments + validate them"],
        ["`init.c`", "allocate + init all mutexes, set up philos"],
        ["`routine.c`", "what each thread does (eat/sleep/think)"],
        ["`monitor.c`", "the main thread watches who dies / who's full"],
        ["`utils.c`", "get_time, precise_sleep, thread-safe print"],
      ]}},
      { h: "Two sides of the design" },
      { code: String.raw`main thread
  ├─ spawn N threads (each runs routine)
  ├─ monitor(data)  <- loops forever checking:
  │     • anyone past time_to_die? -> print died, set_stop
  │     • has everyone eaten must_eat? -> set_stop
  └─ join all threads -> cleanup mutexes

each philosopher thread (routine):
  while (!stopped) {
     take forks -> eat -> update last_meal
     sleep -> think
  }`, cap: "the monitor is the referee, philosophers are the players — they talk through the stop flag", lang: "txt" },
      { h: "Order inside main()" },
      { code: String.raw`if (argc != 5 && argc != 6) -> usage
parse_args()                  // validate input
if (must_eat == 0) return 0   // eat 0 meals = nothing to do
init_data()                   // allocate + init mutexes
start_threads()               // spawn threads + set last_meal=start
monitor()                     // the main thread does the watching
join_threads()                // wait for everyone to finish
cleanup()                     // destroy mutexes + free`, lang: "txt" },
      { note: "Special case: a single philosopher (num_philo==1) has only one fork, can grab one side → can't eat → must die. The code handles this separately in lone_philo() (grab one fork and wait until death)." },
    ],
    dataflow: [
      { p: "Walk through the key functions one by one." },
      { h: "routine() — one philosopher's life" },
      { code: String.raw`void *routine(void *arg)
{
    t_philo *philo = (t_philo *)arg;
    if (philo->data->num_philo == 1)
        return (lone_philo(philo));          // single-person case
    if (philo->id % 2 == 0)
        precise_sleep(time_to_eat / 2, ...);  // even ones delay start
    while (!is_stopped(philo->data))
    {
        do_eat(philo);                        // take forks + eat
        if (is_stopped(philo->data)) break;
        print_status(philo, "is sleeping");
        precise_sleep(time_to_sleep, ...);
        print_status(philo, "is thinking");
    }
    return (NULL);
}`, cap: "loop eat-sleep-think until someone dies / everyone's full (stop)", lang: "c" },
      { p: "**Why even philosophers delay at the start:** if everyone lunges for forks at once it's a scramble. Make even-numbered people wait half a time_to_eat first → odd ones eat first, then even ones → a smooth 'interleaved' rhythm that reduces contention." },
      { h: "take_forks() — picking up forks without deadlock" },
      { code: String.raw`static void take_forks(t_philo *philo)
{
    if (philo->id % 2 == 0) {              // even: left first
        lock(left_fork);  print "has taken a fork";
        lock(right_fork); print "has taken a fork";
    } else {                                // odd: right first
        lock(right_fork); print "has taken a fork";
        lock(left_fork);  print "has taken a fork";
    }
}`, cap: "different pickup order by even/odd -> breaks circular wait -> no deadlock", lang: "c" },
      { h: "do_eat() — eat while updating time safely" },
      { code: String.raw`static void do_eat(t_philo *philo)
{
    take_forks(philo);
    lock(meal_lock);
      philo->last_meal = get_time();   // reset the death clock
    unlock(meal_lock);
    print_status(philo, "is eating");
    precise_sleep(time_to_eat, data);
    lock(meal_lock);
      philo->meals_eaten++;
    unlock(meal_lock);
    unlock(left_fork);
    unlock(right_fork);                  // put down both forks
}`, cap: "always update last_meal/meals_eaten under meal_lock, because the monitor reads them concurrently", lang: "c" },
      { h: "monitor() — the referee checking for death" },
      { code: String.raw`void monitor(t_data *data)
{
    while (!is_stopped(data)) {
        for each person:
            if (someone_died(&philos[i])) return;  // past t_die -> died
        if (all_ate(data)) return;                 // everyone full
        usleep(500);                                // check frequently
    }
}`, lang: "c" },
      { code: String.raw`static int someone_died(t_philo *philo)
{
    lock(meal_lock);
      since = get_time() - philo->last_meal;
    unlock(meal_lock);
    if (since > time_to_die) {
        lock(print_lock);
          set_stop(data);                  // stop first
          put_msg(data, id, "died");        // then print
        unlock(print_lock);
        return (1);
    }
    return (0);
}`, cap: "set_stop before printing died, under print_lock -> no other thread can print after a death", lang: "c" },
      { h: "print_status() — thread-safe logging" },
      { code: String.raw`void print_status(t_philo *philo, char *msg)
{
    lock(print_lock);
      if (!is_stopped(philo->data))     // never print after the sim ends
          put_msg(data, id, msg);
    unlock(print_lock);
}`, cap: "check stop under print_lock to avoid printing a status after someone has already died", lang: "c" },
      { h: "is_stopped / set_stop — safe flag access" },
      { code: String.raw`int is_stopped(t_data *data) {
    lock(stop_lock); int s = data->stop; unlock(stop_lock);
    return (s);
}
void set_stop(t_data *data) {
    lock(stop_lock); data->stop = 1; unlock(stop_lock);
}`, cap: "every touch of stop goes through a mutex -> no data race on this flag", lang: "c" },
    ],
    implementation: [
      { h: "Suggested build order" },
      { ul: [
        "1. parse + validate arguments (positive numbers, right arg count)",
        "2. get_time + precise_sleep accurate first — it's the foundation of everything",
        "3. init all mutexes + set up philos (left/right forks)",
        "4. routine without deadlock prevention yet + thread-safe print_status",
        "5. monitor that checks for death",
        "6. prevent deadlock (even/odd + start delay) + the single-person case",
        "7. must_eat (end when everyone's full) + cleanup with no leaks",
        "8. check with valgrind --tool=helgrind (find data races)",
      ]},
      { h: "Common bugs and how to avoid them" },
      { table: { head: ["Symptom", "Cause", "Fix"], rows: [
        ["Hangs / never moves", "deadlock — everyone holds one fork waiting in a cycle", "even/odd staggered pickup order"],
        ["Dies when it shouldn't", "clock started wrong / last_meal not set at start", "set last_meal = start_time before spawning threads"],
        ["died prints late / overlaps other lines", "no set_stop before printing / no print_lock", "set_stop first, then print under print_lock"],
        ["helgrind reports a race", "reading/writing shared data without a lock", "every last_meal/meals_eaten/stop must be under a mutex"],
        ["Single person doesn't die / hangs", "didn't separate the num==1 case", "lone_philo grabs one fork then waits until death"],
      ]}},
      { h: "build / run" },
      { code: String.raw`make
./philo 5 800 200 200       # 5 people, nobody should die
./philo 4 410 200 200       # borderline — tests timing
./philo 1 800 200 200       # single person -> dies (not enough forks)
./philo 5 800 200 200 7     # everyone eats 7 meals then ends`, lang: "bash" },
    ],
    tricks: [
      { h: "Trick 1: even/odd staggered fork pickup — prevents deadlock" },
      { p: "The heart of the project. If everyone grabs left first the same way = guaranteed deadlock. Make even-numbered people grab left first, odd ones grab right first → break the symmetry = cut circular wait, one of the deadlock conditions." },
      { h: "Trick 2: delay even-numbered philosophers at the start" },
      { p: "Have even ones `precise_sleep(time_to_eat/2)` before starting → spread fork contention into an interleaved rhythm, giving good throughput so nobody starves for long." },
      { h: "Trick 3: precise_sleep instead of one big usleep" },
      { p: "Sleep in 200µs slices and re-check the real clock — more precise than a long usleep (which the OS may wake late) and you can check the stop flag each round → stop immediately when someone dies instead of sleeping on." },
      { h: "Trick 4: a per-person mutex for meal data" },
      { p: "Use a separate `meal_lock` per person (not one shared lock) → the monitor checking one person doesn't block another's eating = less lock contention and more on-time logs." },
      { h: "Trick 5: set_stop before printing died, under print_lock" },
      { p: "Set the stop flag first, then print `died` while holding print_lock the whole time → guarantees `died` is the last line, with no other thread sneaking in an 'is eating' after someone has died." },
      { h: "Trick 6: write the log with a single write" },
      { p: "Assemble the whole line (time + id + msg + \\n) into a buffer then `write` once — reduces the chance of output breaking mid-line (faster and more atomic than several printfs)." },
    ],
    eval: [
      { qa: [
        { q: "Why threads, not processes (mandatory)?", a: "Philosophers share forks (a common resource) — threads share the same memory, making shared state easy; mandatory requires pthread, bonus uses process+semaphore." },
        { q: "What is a mutex, what's it for here?", a: "A lock that gives access to a resource one thread at a time; each fork = 1 mutex, pickup=lock put-down=unlock, also used to guard races on print/stop/meal data." },
        { q: "How does deadlock happen, how do you prevent it?", a: "If everyone grabs the left fork at once they hold one and wait for the right the neighbour holds, stuck in a cycle; prevent it by even ones grabbing left first, odd ones right first = cut circular wait." },
        { q: "What is a race condition, where in the code?", a: "Several threads reading/writing a shared variable at once give unpredictable results; found at last_meal, meals_eaten, stop — fixed by locking a mutex every time you touch them." },
        { q: "How do you detect death accurately?", a: "The monitor (a separate thread) loops checking get_time()-last_meal > time_to_die every ~500µs; reads last_meal under meal_lock to avoid a race." },
        { q: "Why precise_sleep instead of plain usleep?", a: "A big usleep may be woken late by the OS, overshooting the death time; precise_sleep sleeps in 200µs slices, re-checking the real clock + stop flag → precise and can stop immediately." },
        { q: "How do you handle the single-person case?", a: "Only one fork, can grab one side, can't eat → lone_philo grabs the fork and waits until time_to_die → dies (correct per the subject)." },
        { q: "Why print with a single write + print_lock?", a: "print_lock stops 2 threads printing over each other; assembling the whole line then writing once stops the output breaking mid-line." },
        { q: "How does must_eat work?", a: "If a 5th arg is given the monitor checks whether everyone's meals_eaten >= must_eat; once all are, it set_stops and ends the sim cleanly (nobody dies)." },
        { q: "Why delay even-numbered philosophers at the start?", a: "Spreads fork contention into an alternating rhythm (odd eat first, even follow), reducing fork clashes so everyone eats in time and throughput improves." },
        { q: "How do you handle memory/mutexes at the end?", a: "cleanup() calls pthread_mutex_destroy on every mutex (forks, meal_lock, print_lock, stop_lock) then free(forks/philos); check leaks with valgrind." },
        { q: "Why does stop need its own mutex?", a: "stop is read by every thread and written by the monitor = shared data; always accessed through stop_lock (is_stopped/set_stop) to avoid a data race." },
      ]},
      { h: "Tests" },
      { code: String.raw`./philo 5 800 200 200       # nobody should die (let it run a while)
./philo 4 410 200 200       # borderline timing
./philo 1 800 200 200       # must die at ~800ms
./philo 5 800 200 200 7     # ends when everyone has eaten 7 meals
valgrind --tool=helgrind ./philo 4 410 200 200   # find data races`, lang: "bash" },
    ],
  },
};
