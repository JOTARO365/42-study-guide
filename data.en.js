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

  "minishell": {
    principle: [
      { h: "What's the problem" },
      { p: "Write **your own shell** that behaves like a trimmed-down bash: read a command from the user → parse it → run the program, handling pipes, redirects, environment variables, quotes, and signals just like real bash." },
      { code: String.raw`minishell$ cat file.txt | grep hello | wc -l > out.txt
minishell$ echo "Home is $HOME"
minishell$ export NAME=42 && env | grep NAME`, cap: "must support pipes (|), redirects (< > >>), variables ($), quotes, builtins", lang: "bash" },
      { h: "The 5 main stages (a shell pipeline)" },
      { table: { head: ["Stage", "Does what", "File"], rows: [
        ["1. Lexer", "split the line into tokens (words/operators)", "lexer.c"],
        ["2. Syntax", "check grammar (back-to-back |, dangling redirect)", "syntax.c"],
        ["3. Parser", "arrange tokens into commands + redirects", "parser.c"],
        ["4. Expand", "substitute $VAR, $?, handle quotes", "expand.c"],
        ["5. Execute", "fork/pipe/dup2/execve for real", "executor.c"],
      ]}},
      { note: "This is a miniature compiler pipeline: raw text → tokens → structure → action — the same idea a programming language uses to process code." },
      { h: "Required features (mandatory)" },
      { ul: [
        "Run commands from PATH (e.g. `ls`, `cat`) via execve",
        "**Pipe** `|` feeds one command's output into another's input",
        "**Redirect** `<` (input), `>` (output), `>>` (append), `<<` (heredoc)",
        "**Quotes**: `'...'` (fully literal), `\"...\"` (expands $)",
        "**Expand**: `$VAR` (env value), `$?` (previous command's exit status)",
        "**7 builtins**: echo, cd, pwd, export, unset, env, exit",
        "**Signals**: Ctrl+C, Ctrl+D, Ctrl+\\ behave like bash",
      ]},
      { h: "Why this project is big and hard" },
      { p: "minishell pulls together everything from the whole year: parsing, linked lists, memory management, processes (fork/exec), file descriptors (pipe/dup2), signals — all working together without leaking, hanging, or diverging from bash's exact behavior. It's the largest group project of Common Core." },
    ],
    theory: [
      { p: "This section gathers the **parsing + process + file descriptor** theory minishell needs." },
      { h: "1) How a shell works (the REPL loop)" },
      { p: "A shell is a **Read-Eval-Print Loop**: read a line → process → display → repeat, never ending until exit/Ctrl+D." },
      { code: String.raw`while (1) {
    line = readline("minishell$ ");   // read
    if (!line) break;                  // Ctrl+D = EOF -> exit
    run_line(line);                    // process + run
    free(line);
}`, lang: "c" },
      { h: "2) Lexing & Parsing (from compiler theory)" },
      { table: { head: ["Stage", "input → output", "Example"], rows: [
        ["Lexer", "string → token list", "`ls -l | wc` → [WORD ls][WORD -l][PIPE][WORD wc]"],
        ["Parser", "token list → command structure", "→ cmd(ls -l) → cmd(wc)"],
      ]}},
      { p: "A **token** is the smallest meaningful unit (a word or an operator). The parser arranges tokens into individual 'commands', each with its arguments and redirects." },
      { h: "3) Processes: fork / execve / wait" },
      { table: { head: ["syscall", "does what"], rows: [
        ["`fork()`", "clone the process into 2 (parent + child)"],
        ["`execve()`", "replace yourself with a new program (child)"],
        ["`waitpid()`", "parent waits for the child + collects its exit status"],
      ]}},
      { code: String.raw`pid = fork();
if (pid == 0) {            // child
    execve(path, argv, envp);   // becomes ls/cat/...
} else {                   // parent
    waitpid(pid, &status, 0);   // wait for the child
}`, cap: "fork makes the child -> the child execve's into the real program -> the parent waits", lang: "c" },
      { h: "4) File descriptor & dup2 (the heart of pipe/redirect)" },
      { p: "Every process has standard fds: **0=stdin, 1=stdout, 2=stderr**. `dup2(a, b)` makes fd `b` point to the same thing as `a` — the mechanism for redirecting input/output." },
      { code: String.raw`int fd = open("out.txt", O_WRONLY|O_CREAT|O_TRUNC, 0644);
dup2(fd, STDOUT_FILENO);   // everything written to stdout (fd 1)
close(fd);                  // now goes to the file instead
/* ... execve ... */`, cap: "redirect > = dup2(file_fd, STDOUT) -> what's written to stdout lands in the file", lang: "c" },
      { h: "5) Pipe — a tube between 2 processes" },
      { p: "`pipe(fds)` makes a tube: `fds[0]` = read end, `fds[1]` = write end. What's written into fds[1] can be read from fds[0] → used to feed the left command's stdout into the right command's stdin." },
      { code: String.raw`cmd1 | cmd2:
  pipe(fds)
  cmd1: dup2(fds[1], STDOUT)  -> writes into the tube
  cmd2: dup2(fds[0], STDIN)   -> reads input from the tube`, cap: "close every unused fd or cmd2 waits for an EOF that never comes = hang", lang: "txt" },
      { h: "6) Environment variables" },
      { p: "Environment variables (like `PATH`, `HOME`) pass from parent to child via `envp`. minishell stores them as a linked list (key=value) so it can export/unset, then converts back to an array at execve time." },

      { h: "🔬 Deep Dive A: the lexer is a state machine — how quotes change the splitting rules" },
      { p: "**Picture it:** splitting a line into words looks like 'just cut on spaces', but a quote changes the rule instantly — `'a b'` is **one word** (the inner space doesn't split). The right mental model is a **finite state machine**: the machine is in some state, and each character changes the state / decides whether to split." },
      { code: String.raw`the lexer's 3 states:
  NORMAL  : space = split ; | < > = operator ; ' " = enter quote mode
  S_QUOTE : (after ') everything literal until the next ' — $ not expanded
  D_QUOTE : (after ") literal except $ (still expands) until the next "

transitions:
  NORMAL --'--> S_QUOTE --'--> NORMAL
  NORMAL --"--> D_QUOTE --"--> NORMAL
  inside a quote: a space "does not split"`, cap: "a quote = a temporary state change, so inner spaces aren't used to split words", lang: "txt" },
      { p: "**Trace it char by char** — tokenize `echo \"a b\"'cd'`:" },
      { code: String.raw`input:  e c h o ␣ " a ␣ b " ' c d '
state:  N N N N N D D D D N S S S N
                  │         │ │     │
                enter D    exit D  enter/exit S

  'echo'                 → WORD "echo"   (split at ␣)
  "a b" next to 'cd'     → WORD "a bcd"  (no ␣ between = one word!)
→ argv = ["echo", "a bcd"]  (not 3 words)`, cap: "the part people miss: adjacent tokens (no space between) = one word, even with different quote types", lang: "txt" },
      { p: "**Crucial order: expand $ first, then remove quotes (quote removal):** `$?` inside a double-quote must expand, but inside a single-quote must not — so you must remember which quote type each character was in 'during' the lex/expand step, and only strip the quotes as the last step. If you remove quotes first you can't tell which `$` should expand." },
      { note: "Prove it yourself: `echo '$HOME'` must print `$HOME` literally, but `echo \"$HOME\"` must print the real path — because the first is in state S_QUOTE where `$` doesn't expand, while the second is in D_QUOTE where `$` does." },
      { qa: [
        { q: "Why remove quotes 'after' expanding $, not before?", a: "Because the `$`-expansion rule depends on which quote type you're in at the time. If you strip quotes first, you lose the info about whether `$x` was in single (no expand) or double (expand) → wrong expansion." },
        { q: "How many tokens is `a'b'c`?", a: "1 token = `abc`, because there's no space anywhere; the quote just changes state temporarily, it doesn't split words." },
        { q: "What to do with an unclosed quote (`echo \"hi`)?", a: "bash prompts for the quote to be closed (continuation line); most minishells treat it as a syntax error returning exit 2, which passes (per the subject/peer agreement)." },
      ]},

      { h: "🔬 Deep Dive B: fd-table inheritance after fork + dup2/close ordering across a multi-stage pipeline" },
      { p: "**Picture it:** on fork the child gets a whole 'copy of the parent's fd table' — the same fd numbers point to the same things. Building `a | b | c` is 'wiring' a's stdout → into b, b's stdout → into c with dup2, then closing every unused end cleanly." },
      { p: "**The rolling-pipe mechanism:** loop forking one command at a time, keeping 'the previous tube's read fd' as the next command's stdin:" },
      { code: String.raw`exec_pipeline(cmds):
  in = STDIN                 // the first command reads from real stdin
  while (a cmd remains):
     if there's a next cmd: pipe(fds)   // fds[0]=read, fds[1]=write
     fork:
       child: dup2(in, STDIN)            // read from the previous tube/stdin
              if next exists: dup2(fds[1], STDOUT)  // write into the new tube
              close(in, fds[0], fds[1]) all -> execve
     parent: close(in); close(fds[1])    // * close immediately!
             in = fds[0]                 // this read end = next round's stdin`, cap: "the parent closes the write end immediately after fork — the only end left open is in the child that actually uses it", lang: "c" },
      { p: "**Trace the fd table step by step** — `a | b | c` (fd numbers are illustrative):" },
      { code: String.raw`pipe1=(3,4)   pipe2=(5,6)

fork a: child  stdout→4 (pipe1 write) ; close extra 3,5,6 → exec a
        parent close 4 ; in=3
fork b: child  stdin→3 (pipe1 read), stdout→6 (pipe2 write) ; close → exec b
        parent close 3,6 ; in=5
c:      child  stdin→5 (pipe2 read), stdout→real stdout ; close → exec c
        parent close 5

→ every write end (4,6) is closed in the parent at once → only the using child keeps it
→ a ends → pipe1 write all closed → b sees EOF ; b ends → c sees EOF`, cap: "closing in the parent immediately each round stops the next fork from inheriting a stale write end", lang: "txt" },
      { note: "Prove it yourself: if the parent 'defers' closing until the end (instead of right after each fork) → when forking b the parent still holds write end 4 → b inherits a copy of fd 4 too → pipe1's write end can never reach 0 → b waits for an EOF that never comes = hang. That's why you must close in the parent 'immediately' every round." },
      { qa: [
        { q: "Why must you always dup2 'before' close?", a: "dup2(old,new) copies old to new — if you close(old) first there's nothing to copy. Correct order: dup2(fds[1],STDOUT) then close(fds[1])." },
        { q: "Why must the parent close the write end right after fork?", a: "Because every fork hands the child a copy of the write end; the more you fork the more copies linger. The parent closing its own immediately + the child closing what it doesn't use → the write-end refcount can reach 0 → EOF happens." },
        { q: "Why does `cat | ls` print ls's output immediately without waiting for cat?", a: "ls doesn't read stdin so it doesn't wait for EOF — it runs and exits; cat keeps reading stdin from the terminal (until Ctrl-D), which is also correct bash behavior." },
      ]},

      { h: "🔬 Deep Dive C: why a pipe hangs — pipe write-end reference counting" },
      { p: "**Picture it:** a pipe's read end gets the 'end' signal (EOF, read returns 0) **only when every copy of the write end is closed** — not just the main write end. The kernel counts how many fds still have the write end open (a reference count)." },
      { p: "**Mechanism:** each fork copies the fd table → the write end gains a copy. EOF happens only when the refcount = 0:" },
      { code: String.raw`write-end refcount (single pipe in cmd1 | cmd2):

  pipe(fds)                       write-end refcount = 1 (parent)
  fork cmd1                       -> 2 (parent + cmd1)
  fork cmd2                       -> 3 (parent + cmd1 + cmd2)
  ────────────────────────────────────────────
  cmd1 dup2(fds[1],STDOUT)+exec   (cmd1 holds it via STDOUT)
  cmd2 close(fds[1])              -> 2
  parent close(fds[1])            -> 1   * forget this = hang right here
  cmd1 ends -> closes stdout      -> 0   -> EOF reaches cmd2 ✓

if the parent "forgets" close(fds[1]): refcount stays at 1 forever
  -> cmd2 reads stdin waiting for an EOF that never comes -> hang`, cap: "EOF is a function of the refcount: it must be 0 — forget one close, the refcount never hits 0 = hang", lang: "txt" },
      { p: "**heredoc uses the same principle:** `<< EOF` is a pipe where the parent writes the heredoc lines to the write end then **closes the write end** to send EOF so the reading command finishes — if you don't close it, the command waits for more input forever." },
      { note: "Prove it yourself: write `cat | cat | cat` and deliberately comment out one of the parent's close(fds[1]) lines → it hangs. Run `ls -l /proc/<pid>/fd` and you'll see the write end still open, exactly as the refcount theory predicts." },
      { qa: [
        { q: "Why isn't closing the main write end enough — why close every copy?", a: "Because EOF depends on the refcount = the number of write-end copies still open. Leave even one open (e.g. the parent forgot) and the refcount ≠ 0 → the read end never gets EOF → hang." },
        { q: "What do you get reading the read end while the write end is open with no data?", a: "read 'blocks' and waits (not EOF). EOF (read returns 0) only happens once all write ends are closed." },
        { q: "What happens writing to a pipe whose read ends are all closed?", a: "You get SIGPIPE (usually kills the process) or write returns -1 with errno=EPIPE — this is why `yes | head` makes yes die on its own after head closes." },
      ]},

      { h: "🔬 Deep Dive D: signals (interactive + heredoc) & $? (exit status) propagation" },
      { p: "**Picture it:** pressing Ctrl-C at an empty prompt must 'show a fresh prompt on the next line' (not exit the shell), but pressing Ctrl-C while a command runs (e.g. `cat` waiting) must 'kill that command' and return to the prompt. The behavior differs by context." },
      { code: String.raw`SIGINT (Ctrl-C) scenarios:
  empty prompt   -> handler: print \n, rl_replace_line(""),
                    rl_on_new_line(), rl_redisplay() -> new prompt ; $?=130
  command running -> child sets signal to DEFAULT -> Ctrl-C kills the child
                    (not the shell) ; shell records $? = 128 + SIGINT(2) = 130
  in a heredoc   -> Ctrl-C cancels the heredoc, returns to prompt ; $? = 130`, cap: "the shell at the prompt 'catches' SIGINT but the child 'lets it default' -> Ctrl-C hits the command, not the shell", lang: "txt" },
      { p: "**Why a single global (`g_signal`):** a signal handler must not do heavy work / touch big structs (async-signal-safety). The safe pattern is for the handler to just 'record the signal number' into a `volatile sig_atomic_t g_signal`, and let the main loop read it later to set `$?` — this is the one global the subject allows." },
      { p: "**$? propagation — the standard values:**" },
      { code: String.raw`standard exit codes (stored in sh->exit_status = $?):
  0          success
  1          general error (e.g. a builtin failed)
  2          misuse / syntax error
  126        found the file but can't run it (no exec permission)
  127        command not found
  128 + n    killed by signal number n

worked example:
  ls /nope          → $? = 2    (ls error)
  ./no_such         → $? = 127  (not found)
  cat then Ctrl-C   → $? = 130  (128 + SIGINT 2)
  a segfaulting cmd → $? = 139  (128 + SIGSEGV 11)`, cap: "reading exit status: WIFEXITED→WEXITSTATUS ; WIFSIGNALED→128+WTERMSIG", lang: "txt" },
      { note: "Prove it yourself: in real bash type `sleep 5` then press Ctrl-C, then `echo $?` → 130. Then `ls /nope; echo $?` → 2 — minishell must match these exactly." },
      { qa: [
        { q: "Why must the child reset signals to default before execve?", a: "At the prompt the shell catches SIGINT/SIGQUIT (so it doesn't die itself). If the child inherits that handler, Ctrl-C won't kill the command — you must reset to SIG_DFL in the child so Ctrl-C kills the command normally." },
        { q: "Why does the handler only store the signal number and nothing else?", a: "async-signal-safety: a handler can interrupt at any moment; touching malloc/structs/print could break randomly. Storing the number in a sig_atomic_t and handling it later in the main loop is safe." },
        { q: "After `cat | ls`, which command's value does `$?` take?", a: "Always the rightmost command (ls) — bash stores the last pipeline command's exit as $?." },
      ]},
      { h: "📖 Further reading" },
      { links: [
        { label: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", note: "pipe / fork / dup2 in full, a fun read" },
        { label: "man7 — pipe(2)", url: "https://man7.org/linux/man-pages/man2/pipe.2.html", note: "pipe mechanics + EOF / closing fds" },
        { label: "man7 — execve(2)", url: "https://man7.org/linux/man-pages/man2/execve.2.html", note: "replacing a process image" },
        { label: "Bash Reference Manual — GNU", url: "https://www.gnu.org/software/bash/manual/bash.html", note: "reference for the bash behavior to mimic" },
      ]},
    ],
    foundations: [
      { p: "This section digs into the **structs and data structures** minishell uses — mostly linked lists." },
      { h: "The 5 main structs" },
      { code: String.raw`typedef struct s_token {        /* result of the lexer */
    char            *value;
    t_toktype       type;       /* WORD / PIPE / REDIR_IN / ... */
    struct s_token  *next;
} t_token;

typedef struct s_redir {        /* one redirect */
    t_toktype       type;       /* < > >> << */
    char            *target;    /* filename or delimiter */
    int             quoted;     /* was the heredoc delimiter quoted */
    int             hdoc_fd;
    struct s_redir  *next;
} t_redir;

typedef struct s_cmd {          /* one command in the pipeline */
    char            **argv;     /* ["ls","-l",NULL] */
    t_redir         *redirs;    /* this command's redirects */
    struct s_cmd    *next;      /* next command after | */
} t_cmd;

typedef struct s_env {          /* one env variable */
    char            *key, *value;
    int             exported;
    struct s_env    *next;
} t_env;

typedef struct s_shell {        /* the shell's central state */
    t_env   *env;
    int     exit_status;        /* = $? */
    t_token *tokens;
    t_cmd   *cmds;
    char    *line;
} t_shell;`, cap: "everything is a linked list because the counts are unknown ahead of time (any number of tokens/cmds/env)", lang: "c" },
      { h: "Why token type is an enum" },
      { code: String.raw`typedef enum e_toktype {
    T_WORD, T_PIPE, T_REDIR_IN, T_REDIR_OUT, T_APPEND, T_HEREDOC
} t_toktype;`, cap: "an enum makes the code readable (T_PIPE is clearer than the number 1) and the compiler helps check it", lang: "c" },
      { h: "Structure flow: string → cmd list" },
      { code: String.raw`"ls -l | wc -l > out"
   │ lexer
   ▼
[WORD:ls][WORD:-l][PIPE][WORD:wc][WORD:-l][REDIR_OUT][WORD:out]
   │ parser
   ▼
cmd1: argv=[ls,-l]    redirs=NULL
   └─next─►
cmd2: argv=[wc,-l]    redirs=[> out]`, cap: "PIPE splits into a separate cmd; REDIR attaches to the current cmd's redirs", lang: "txt" },
      { h: "exit_status = $? is wired through the whole system" },
      { p: "`sh->exit_status` is the `$?` value — it holds the last command's exit code, used both in expansion (`echo $?`) and as main's return. Convention: 0=success, 1-2=error, 126=no permission to run, 127=command not found, 128+n=killed by signal n." },
      { h: "Why env is a linked list, not an array" },
      { p: "You must add (export), remove (unset), and modify variables anytime → a linked list handles this more easily than an array that needs realloc. At execve time you convert it to a `char **` with `env_to_array`." },
    ],
    architecture: [
      { h: "File groups (33 files split by responsibility)" },
      { table: { head: ["Group", "Files", "Role"], rows: [
        ["loop", "main.c, init.c", "REPL loop, initial setup"],
        ["lexer", "lexer.c, lexer_utils.c", "tokenize + quotes"],
        ["syntax", "syntax.c", "grammar check"],
        ["parser", "parser.c, parser_redir.c, parser_utils.c", "tokens → cmd list"],
        ["expand", "expand*.c", "expand $VAR/$?, quote removal"],
        ["executor", "executor.c, exec_pipe.c, exec_utils.c", "fork/exec/pipe/wait"],
        ["redirect", "redirect.c, heredoc*.c", "< > >> <<"],
        ["builtin", "builtin_*.c", "echo/cd/pwd/export/unset/env/exit"],
        ["env", "env*.c, path.c", "manage env + find PATH"],
        ["signal", "signals.c", "Ctrl+C / Ctrl+\\"],
        ["free", "free.c, utils.c", "free memory"],
      ]}},
      { h: "Order of work per line (run_line)" },
      { code: String.raw`run_line(sh, line)
  └─ parse_line(sh):
       ├─ lexer()         string → tokens
       ├─ check_syntax()  grammar wrong? → exit 2
       ├─ parser()        tokens → cmds
       └─ expand_cmds()   expand $ + quotes
  └─ execute(sh, cmds):
       ├─ preprocess_heredocs()
       ├─ a single builtin → exec_in_parent (no fork!)
       ├─ a single command → exec_single (fork)
       └─ many commands    → exec_pipeline (fork all + pipe)
  └─ reset_shell()  clear this line's tokens/cmds`, lang: "txt" },
      { note: "Key point: a single builtin (e.g. `cd`, `export`) must run in the **parent**, not a fork — because if you fork and cd in the child, the directory change is lost when the child dies (the parent didn't move)." },
      { h: "The one allowed global: g_signal" },
      { code: String.raw`extern volatile sig_atomic_t g_signal;`, cap: "the subject allows just 1 global, only to store the signal number — nothing else", lang: "c" },
    ],
    dataflow: [
      { p: "Walk through the core functions one by one." },
      { h: "shell_loop() — the REPL heart" },
      { code: String.raw`void shell_loop(t_shell *sh)
{
    tty = isatty(STDIN_FILENO);          // interactive?
    while (1) {
        setup_signals();                  // set the Ctrl+C handler
        line = read_input(tty);           // readline or gnl
        if (g_signal == SIGINT) {
            sh->exit_status = 130;        // Ctrl+C -> $?=130
            g_signal = 0;
        }
        if (!line) break;                 // Ctrl+D -> exit
        if (tty && *line) add_history(line);
        run_line(sh, line);
        free(line);
    }
}`, cap: "uses readline (interactive) or get_next_line (input from a pipe/file)", lang: "c" },
      { h: "lexer() — split the line into tokens" },
      { code: String.raw`t_token *lexer(char *line, int *err)
{
    while (line[i]) {
        i = skip_spaces(line, i);
        if (is_metachar(line[i]))         // | < >
            i = read_op(line, i, &lst);
        else
            i = read_word(line, i, &lst); // a word (incl. quotes)
        if (i < 0) { *err = 1; ... }      // unclosed quote
    }
    return (lst);
}`, cap: "loop the whole line: a meta char reads as an operator, otherwise read a word; an unclosed quote = error", lang: "c" },
      { h: "execute() — choose how to run" },
      { code: String.raw`int execute(t_shell *sh, t_cmd *cmds)
{
    if (preprocess_heredocs(sh, cmds))   // read heredocs first
        return (130);
    n = cmd_count(cmds);
    if (n == 1 && (!argv[0] || is_builtin(argv[0])))
        return (exec_in_parent(sh, cmds));  // single builtin
    if (n == 1)
        return (exec_single(sh, cmds));     // single command
    return (exec_pipeline(sh, cmds, n));    // pipeline
}`, cap: "3 paths: builtin in the parent, single command forked, many commands piped", lang: "c" },
      { h: "child_process() — what the child does after fork" },
      { code: String.raw`void child_process(t_shell *sh, t_cmd *cmd, int in, int out)
{
    signals_default();                    // child takes default signals
    if (in != STDIN_FILENO)  { dup2(in, STDIN);  close(in); }
    if (out != STDOUT_FILENO){ dup2(out, STDOUT); close(out); }
    if (apply_redirs(sh, cmd->redirs)) clean_exit(sh, 1);
    if (is_builtin(cmd->argv[0]))
        clean_exit(sh, run_builtin(sh, cmd));
    exec_external(sh, cmd);               // execve
}`, cap: "wire in/out from the pipe -> apply redirects (which can override the pipe) -> run builtin or execve", lang: "c" },
      { h: "exec_pipeline() — chain commands with pipes" },
      { code: String.raw`int exec_pipeline(t_shell *sh, t_cmd *cmds, int n)
{
    in = STDIN_FILENO;
    signals_ignore();                     // parent ignores Ctrl+C
    while (cmds) {
        if (cmds->next) pipe(fds);        // a next cmd exists -> make a tube
        pid = fork();
        if (pid == 0) pipe_child(sh, cmds, in, fds);
        if (in != STDIN_FILENO) close(in);
        if (cmds->next) { close(fds[1]); in = fds[0]; }
        cmds = cmds->next;
    }
    return (wait_all(pid, n));            // wait for all, keep the last status
}`, cap: "fork every command, connect output->input with pipes; close unused fds immediately to avoid hanging", lang: "c" },
      { h: "exec_external() — find PATH then execve" },
      { code: String.raw`static void exec_external(t_shell *sh, t_cmd *cmd)
{
    path = find_path(sh, cmd->argv[0]);   // search $PATH
    if (!path) clean_exit(sh, 127);       // command not found
    envp = env_to_array(sh->env);         // list -> array
    execve(path, cmd->argv, envp);
    /* reaching here = execve failed */
    if (errno == EACCES || errno == EISDIR) clean_exit(sh, 126);
    clean_exit(sh, 127);
}`, cap: "127 = command not found, 126 = found but not runnable (permission/is a directory)", lang: "c" },
      { h: "handle_sigint() — Ctrl+C like bash" },
      { code: String.raw`static void handle_sigint(int sig)
{
    g_signal = sig;
    write(STDOUT_FILENO, "\n", 1);
    rl_on_new_line();                     // readline moves to a new line
    rl_replace_line("", 0);               // clear the line typed so far
    rl_redisplay();                       // show a fresh prompt
}`, cap: "Ctrl+C: new line + fresh prompt without killing the shell (unlike the default)", lang: "c" },
      { h: "wait_all() — keep the last command's exit status" },
      { code: String.raw`/* status_code turns the raw status into a bash-like exit code */
if (WIFSIGNALED(status)) return (128 + WTERMSIG(status));
return (WEXITSTATUS(status));`, cap: "the pipeline's $? = the rightmost command's exit; if killed by a signal -> 128 + signal number", lang: "c" },
    ],
    implementation: [
      { h: "Suggested build order" },
      { ul: [
        "1. REPL loop + readline + history (do nothing with the input yet)",
        "2. lexer — tokenize, including ' and \" quote handling",
        "3. parser — tokens → cmd list (no pipe/redirect yet)",
        "4. single-command executor: fork + find_path + execve + wait",
        "5. the 7 builtins (cd/export/unset/exit must run in the parent)",
        "6. expand $VAR / $? + quote removal",
        "7. redirects < > >> + pipes (many commands)",
        "8. heredoc <<",
        "9. signals: Ctrl+C / Ctrl+\\ / Ctrl+D matching bash",
        "10. chase leaks with valgrind + diff behavior against real bash",
      ]},
      { h: "Common bugs and how to avoid them" },
      { table: { head: ["Symptom", "Cause", "Fix"], rows: [
        ["Pipe hangs (wc never ends)", "didn't close the write-end fd", "close every unused fd after fork"],
        ["cd doesn't change the real dir", "ran cd in a child (fork)", "run a single builtin in the parent"],
        ["$? wrong", "didn't update exit_status / used the raw status", "convert via WEXITSTATUS/WIFSIGNALED"],
        ["Quotes leak through", "didn't remove quotes during expand", "quote removal after variable expansion"],
        ["heredoc expands $ though the delimiter was quoted", "didn't check the quoted flag", "if the delimiter is quoted → don't expand"],
        ["Ctrl+C kills the shell", "used the default signal", "set a handler that just refreshes the prompt"],
      ]}},
      { h: "build / run" },
      { code: String.raw`make
./minishell
minishell$ echo "hi $USER" | cat -e
minishell$ ls -l | grep .c | wc -l
minishell$ cat << EOF
make bonus && ./minishell   # && || () wildcard *`, lang: "bash" },
      { note: "You must link readline: -lreadline (some machines also need -L path to readline)." },
    ],
    tricks: [
      { h: "Trick 1: a single builtin runs in the parent, no fork" },
      { p: "cd/export/unset/exit must change the shell's own state (directory, env, exiting) — if you fork and run them in a child the change is lost when the child dies. The code checks `n==1 && is_builtin` → `exec_in_parent` (save/restore fds with dup)." },
      { h: "Trick 2: close every fd immediately after fork" },
      { p: "In the pipeline, after each fork the parent closes the old `in` and `fds[1]` right away — leaving only the ends actually used → EOF reaches the next command on time, no hang. This rule is the key to a non-deadlocking pipe." },
      { h: "Trick 3: 3 signal modes by context" },
      { table: { head: ["Mode", "When"], rows: [
        ["setup_signals", "waiting at the prompt (Ctrl+C refreshes, Ctrl+\\ ignored)"],
        ["signals_ignore", "the parent while waiting for a child (ignores Ctrl+C)"],
        ["signals_default", "in the child before exec (takes default signals)"],
      ]}},
      { h: "Trick 4: g_signal stores only the signal number" },
      { p: "The subject allows one global — store only 'which signal just happened' (`volatile sig_atomic_t`), not structs/other data. The handler does the minimum (set the value + refresh readline) for safety in async context." },
      { h: "Trick 5: env is a list, converted to an array at execve" },
      { p: "Keep env as a linked list (easy export/unset) but execve needs a `char **` — convert with `env_to_array` only when about to exec, then free it. Clear separation of concerns." },
      { h: "Trick 6: preprocess heredocs before fork" },
      { p: "Read all heredocs (`<<`) before running commands — store the content into a temp fd/file, so a Ctrl+C while typing a heredoc cancels cleanly (return 130) without affecting the pipeline." },
      { h: "Trick 7: exit codes follow bash convention" },
      { p: "127=command not found, 126=not runnable, 128+n=killed by signal n, 130=Ctrl+C, 2=syntax error — making `$?` match bash in every case (evaluators love testing this)." },
    ],
    eval: [
      { qa: [
        { q: "How does the shell process one command line?", a: "lexer (string→token) → check syntax → parser (token→cmd list) → expand ($VAR/$?/quote) → execute (fork/pipe/dup2/execve); like a miniature compiler pipeline." },
        { q: "How do fork and execve differ?", a: "fork clones the process into 2 (identical parent+child); execve replaces the process image with a new program; normally you fork then have the child execve while the parent waitpids." },
        { q: "How does a pipe work, why must you close fds?", a: "pipe() makes a tube with a read/write end; dup2 connects the left's stdout→tube→right's stdin; you must close every write end or the reading command never sees EOF → hangs forever." },
        { q: "Why must cd/export run in the parent?", a: "They must change the shell's own state (directory/env); if forked and run in a child the change is lost when the child dies, the parent unaffected." },
        { q: "What is dup2 for?", a: "It makes one fd point to the same place as another — redirect > uses dup2(file, STDOUT) to send output to a file; a pipe uses dup2 to connect stdin/stdout to the tube." },
        { q: "What is $?, how is it stored?", a: "The last command's exit status, kept in sh->exit_status; converted from wait via WEXITSTATUS (normal exit) or 128+WTERMSIG (killed by signal); used in expanding $?." },
        { q: "How does single quote differ from double quote?", a: "'...' = fully literal, expands nothing; \"...\" = expands $VAR/$? but still prevents word splitting; both are removed (quote removal) after expansion." },
        { q: "How do you handle Ctrl+C / Ctrl+D / Ctrl+\\?", a: "Ctrl+C (SIGINT) shows a new line+prompt ($?=130) without killing the shell; Ctrl+D (EOF) exits the shell; Ctrl+\\ (SIGQUIT) ignored at the prompt; via g_signal + the 3 signal modes." },
        { q: "Why is only one global allowed?", a: "The subject mandates it — store only the signal number (volatile sig_atomic_t g_signal) because the handler must not do complex work/touch structs in async context; other data goes through t_shell." },
        { q: "How do you find a command's path?", a: "If it has a /, use it directly; otherwise loop $PATH folders, join with the command name, check access(X_OK); not found → exit 127." },
        { q: "What do exit codes 126/127/130 mean?", a: "127=command not found, 126=found but not runnable (permission/a dir), 130=killed by Ctrl+C (128+SIGINT), 128+n=killed by signal n; per bash convention." },
        { q: "How does a heredoc (<<) work?", a: "Read input until the delimiter, store the content and feed it as stdin; expand $ if the delimiter isn't quoted, don't if it is; preprocess before running so Ctrl+C can cancel cleanly." },
        { q: "How do you decide builtin vs external?", a: "is_builtin checks the name against the 7 (echo/cd/pwd/export/unset/env/exit); if yes run run_builtin, otherwise find_path + execve." },
      ]},
      { h: "Tests" },
      { code: String.raw`./minishell
minishell$ echo hello | cat -e
minishell$ ls -l | grep .c | wc -l > count.txt
minishell$ export X=42; echo "$X and $?"
minishell$ cat << END
# diff behavior against real bash + valgrind for leaks
valgrind --leak-check=full ./minishell`, lang: "bash" },
    ],
  },

  "fdf": {
    principle: [
      { h: "What's the problem" },
      { p: "**FdF = Fil de Fer** (French for 'wireframe', literally 'iron wire'). Read a `.fdf` file that is a **grid of altitude numbers (z)** and draw it as a **3D wireframe** in a window using MiniLibX." },
      { code: String.raw`.fdf file:           drawn as:
0  0  0  0              ◇──◇──◇──◇
0  5  5  0      →      ╱ ╲╱ ╲╱ ╲ ╲
0  5  5  0            ◇  ◇──◇  ◇    (the middle bulges up)
0  0  0  0`, cap: "each cell's number = that point's height z — bigger = bulges up", lang: "txt" },
      { h: "The 3 core stages" },
      { table: { head: ["Stage", "Does what"], rows: [
        ["1. Parse", "read the file → store as a 2D grid of z values (and colors if any)"],
        ["2. Project", "map each point's 3D coords (x, y, z) → 2D (screen) coords via isometric projection"],
        ["3. Draw", "connect neighbouring points (right + down) with Bresenham's line algorithm"],
      ]}},
      { note: "Key idea: we have 3D data but the screen is 2D — you must 'project' the 3D onto a 2D plane so the eye sees depth." },
      { h: "What is isometric projection" },
      { p: "**Isometric** = a 3D projection seen from an angled view that makes all three axes look equal (like old SimCity-style games). The upside is no perspective (distant things don't shrink), computed with a fixed formula:" },
      { code: String.raw`x_iso = (x - y) · cos(30°)
y_iso = (x + y) · sin(30°) - z · scale`, cap: "rotate the grid 45° then squash vertically → the classic angled view; z lifts the point by its height", lang: "txt" },
      { h: "Why use Bresenham to draw lines" },
      { p: "The screen is pixels in discrete cells (integers) but a mathematical line is continuous (floats). **Bresenham's algorithm** finds which pixel is 'closest to the true line' using only integer add/subtract (no division/floats) → very fast and gap-free." },
      { h: "MiniLibX's role" },
      { p: "**MiniLibX (mlx)** is the minimal graphics library 42 provides: open a window, draw pixels, receive events (keypress/window close). We never touch X11/OpenGL directly — mlx wraps it all." },
    ],
    theory: [
      { p: "This section gathers the **geometry + graphics** theory you need before reading the FdF code." },
      { h: "1) Screen coordinate system" },
      { p: "The screen uses coords where the **top-left is (0,0)**, x points right, and **y points down** (opposite to maths where y points up). This is why many graphics formulas flip y." },
      { h: "2) 3D → 2D (projection)" },
      { table: { head: ["Type", "Looks like", "Used in FdF"], rows: [
        ["Isometric", "fixed angle, distant things don't shrink", "✓ main"],
        ["Perspective", "distant things shrink (like a real eye)", "no (more complex)"],
        ["Top-down / Side", "straight from above/side", "bonus (switch views)"],
      ]}},
      { h: "3) Basic trigonometry: sin/cos" },
      { p: "Rotating a point in the plane uses sin/cos. For isometric we use a fixed 30° angle, so we precompute them as constants (no need to call `cos()` per point):" },
      { code: String.raw`# define COS30 0.866025403784   /* cos(30°) */
# define SIN30 0.5              /* sin(30°) */`, cap: "embed the constants → faster than calling a math function every time", lang: "c" },
      { h: "4) Linear interpolation (lerp)" },
      { p: "**lerp** = finding a value between two values linearly with a parameter t (0..1): `result = a + (b - a)·t`. FdF uses lerp to fade **colors** along a line (one end one color, gradually to another)." },
      { code: String.raw`t = 0.0  →  point a's color (line start)
t = 0.5  →  the half-blend
t = 1.0  →  point b's color (line end)`, lang: "txt" },
      { h: "5) RGB color in hex" },
      { p: "A pixel color = 24 bits split into 3 channels (red/green/blue) of 8 bits each (0..255), packed into one number `0xRRGGBB`:" },
      { table: { head: ["Part", "bits", "extract with"], rows: [
        ["R (red)", "16–23", "`(c >> 16) & 0xFF`"],
        ["G (green)", "8–15", "`(c >> 8) & 0xFF`"],
        ["B (blue)", "0–7", "`c & 0xFF`"],
      ]}},
      { h: "6) Bresenham's line algorithm (theory)" },
      { p: "Problem: draw a line from (x0,y0) to (x1,y1) on a pixel grid smoothly. Bresenham keeps an 'accumulated error' and decides each step whether to move x, y, or both — using only integers and additions, no division or floats." },
      { code: String.raw`dx =  |x1 - x0|        sx = x direction (+1/-1)
dy = -|y1 - y0|        sy = y direction (+1/-1)
err = dx + dy

each step:
  e2 = 2·err
  if e2 >= dy:  err += dy;  x += sx   (move horizontally)
  if e2 <= dx:  err += dx;  y += sy   (move vertically)
  until the endpoint`, cap: "the error tells you which way the true line currently 'leans' → move the axis that keeps you nearest the true line", lang: "txt" },

      { h: "🔬 Deep Dive A: where the isometric formula comes from — built from rotating the axes" },
      { p: "**Picture it:** isometric draws the world's 3 axes tilted 30° equally on screen. Instead of memorizing `(x−y)cos30`, let's see how it 'falls out' of where each axis points." },
      { code: String.raw`place each world axis onto the screen (screen y points down):
  step +1 along world x → screen moves (+cos30, +sin30)   (down-right 30°)
  step +1 along world y → screen moves (−cos30, +sin30)   (down-left 30°)
  step +1 along world z (height) → screen moves (0, −1)·scale  (straight up)

sum the contributions of point (x, y, z):
  screen_x = x·cos30 − y·cos30        = (x − y)·cos30
  screen_y = x·sin30 + y·sin30 − z·s  = (x + y)·sin30 − z·scale`, cap: "the formula isn't magic — it's the sum of 'which way each axis moves the point on screen'", lang: "txt" },
      { p: "**Plug in real numbers** (cos30 ≈ 0.866, sin30 = 0.5):" },
      { code: String.raw`point (x=2, y=0, z=0):
  screen_x = (2−0)·0.866 = 1.732
  screen_y = (2+0)·0.5 − 0 = 1.0      → moves down-right ✓ (x axis tilts down-right)

high point (x=0, y=0, z=3):
  screen_x = 0
  screen_y = 0 − 3·scale              → moves "up" (negative y = higher on screen) ✓`, cap: "z is subtracted from screen_y because screen y points down — higher points must go upward (smaller y)", lang: "txt" },
      { note: "Prove it yourself: plug in (x=0,y=2,z=0); you should get screen_x = −1.732 (down-left) — confirming the x and y axes tilt to opposite sides, creating the angled view." },
      { qa: [
        { q: "Why does screen_x use (x−y) but screen_y use (x+y)?", a: "Because the x axis tilts down-'right' (screen_x positive) while the y axis tilts down-'left' (screen_x negative) → screen_x = x·cos30 − y·cos30. Vertically both axes tilt 'down' the same way → screen_y = (x+y)·sin30." },
        { q: "Why subtract z·scale, not add?", a: "The screen has y pointing down (top-left = 0,0). A point that's high in the world must be drawn 'higher on screen' = a smaller y → so z is subtracted from screen_y." },
        { q: "What if you used cos45/sin45 instead of 30?", a: "You'd get a flat '45°-rotated' view (dimetric/military projection) — true isometric actually uses ~35.26°, but games/FdF prefer 30° because it computes cleanly and looks good." },
      ]},

      { h: "🔬 Deep Dive B: Bresenham — proof of why integer-only draws a smooth line" },
      { p: "**Picture it:** a mathematical line is continuous (y = mx + c) but the screen has integer pixel cells. Bresenham picks the pixel 'nearest the true line' one step at a time using only integer add/subtract — fast and gap-free." },
      { p: "**The error-term mechanism:** keep an 'accumulated error' of how far the current pixel is from the true line, and when it builds past half a cell, step the other axis. The all-octant version (works in every direction) keeps err = dx + dy:" },
      { code: String.raw`dx =  abs(x1-x0)      sx = (x0<x1) ? +1 : -1
dy = -abs(y1-y0)      sy = (y0<y1) ? +1 : -1
err = dx + dy
loop:
  plot(x0, y0)
  if (x0==x1 && y0==y1) break
  e2 = 2*err
  if (e2 >= dy) { err += dy; x0 += sx }    // move horizontally
  if (e2 <= dx) { err += dx; y0 += sy }    // move vertically`, cap: "every value is an int, no division/floats — err decides which axis (or both) to step this round", lang: "c" },
      { p: "**Step through it** — draw (0,0) to (5,2): dx=5, dy=−2, err=3" },
      { code: String.raw`step │ plot   │ e2=2err │ e2>=dy(-2)? → x  │ e2<=dx(5)? → y │ err
  ───┼────────┼─────────┼──────────────────┼───────────────┼────
   1 │ (0,0)  │   6     │ yes x→1          │ no             │  1
   2 │ (1,0)  │   2     │ yes x→2          │ yes y→1        │  4
   3 │ (2,1)  │   8     │ yes x→3          │ no             │  2
   4 │ (3,1)  │   4     │ yes x→4          │ yes y→2        │  5
   5 │ (4,2)  │  10     │ yes x→5          │ no             │  3
   6 │ (5,2)  │ — endpoint reached, break —                │
  → pixels: (0,0)(1,0)(2,1)(3,1)(4,2)(5,2) = a neat slanted staircase`, cap: "slope 2/5: step x every round, step y only when the error has built up enough → the staircase nearest the true line", lang: "txt" },
      { note: "Prove it yourself: draw (0,0)→(2,5) (steeper) with the table — this time it 'steps y every round, x only sometimes', the reverse, because |dy|>|dx|. Bresenham adjusts automatically via the e2 conditions." },
      { qa: [
        { q: "Why not just use float (y = mx+c)?", a: "Floats are slower and accumulate rounding error; line drawing happens millions of times per frame. Bresenham uses only int add/subtract → much faster and no rounding drift." },
        { q: "Why does err start at dx+dy?", a: "It centers the axis-step decision symmetrically around the 'middle of the pixel cell' — so the line leans correctly from the very first step without bias toward either axis." },
        { q: "Why have sx/sy (+1 or −1)?", a: "So it draws in every direction (all 8 octants) — whether the endpoint is left/right/up/down. abs() + the sx/sy direction lets one loop cover every case instead of writing 8 variants." },
      ]},

      { h: "🔬 Deep Dive C: fading color along a line (lerp) — why split R/G/B before mixing" },
      { p: "**Picture it:** one end of a line is red, the other blue, and you want the shades to fade in between. Do it with **linear interpolation**: at fraction t (0→1) along the line, the color = a mix of red and blue by t." },
      { p: "**Key pitfall:** never lerp the whole `0xRRGGBB` number directly — because R/G/B sit in different bit channels, mixing the whole thing overflows across channels. You must **unpack the 3 channels, interpolate each, then repack:**" },
      { code: String.raw`int lerp_color(int a, int b, double t)
{
    int ar=(a>>16)&0xFF, ag=(a>>8)&0xFF, ab=a&0xFF;   // unpack a
    int br=(b>>16)&0xFF, bg=(b>>8)&0xFF, bb=b&0xFF;   // unpack b
    int r = ar + (br - ar) * t;     // interpolate per channel
    int g = ag + (bg - ag) * t;     // lerp: a + (b-a)·t
    int bl= ab + (bb - ab) * t;
    return ((r<<16) | (g<<8) | bl); // repack 0xRRGGBB
}`, cap: "t is the fraction along the line (i/steps from Bresenham). lerp formula = a + (b−a)·t per channel", lang: "c" },
      { p: "**Plug in numbers** — from red `0xFF0000` to blue `0x0000FF` at t=0.5:" },
      { code: String.raw`R: 255 + (0−255)·0.5 = 127
G: 0   + (0−0)·0.5   = 0
B: 0   + (255−0)·0.5 = 127
→ (127<<16)|(0<<8)|127 = 0x7F007F  (purple, halfway ✓)`, cap: "lerping the whole 0xFF0000↔0x0000FF would be wrong due to carries across channels — split channels only", lang: "txt" },
      { note: "Prove it yourself: t=0 must give color a exactly, t=1 must give b exactly. Plug t=0 into a+(b−a)·0 = a ✓ ; t=1 gives a+(b−a) = b ✓ — that's how you check the lerp formula is right." },
      { qa: [
        { q: "Why can't you lerp the whole color number directly?", a: "Because R is bits 16-23, G bits 8-15, B bits 0-7. Adding/multiplying the whole number lets a lower channel's carry overflow into a higher channel → wrong color. You must mask & 0xFF each channel first." },
        { q: "Where does t come from while drawing a line?", a: "From progress along the line = i/steps (i = which step, steps = total steps). Line start t≈0, line end t≈1." },
        { q: "Why is `int r = ar + (br-ar)*t` safe even though t is a double?", a: "The product is a double but assigned to an int → truncated. The value always stays 0-255 because it interpolates between two values already in that range, so it can't overflow." },
      ]},

      { h: "🔬 Deep Dive D: auto-fit (centering + zoom + z_scale) — why any map size fits the screen" },
      { p: "**Picture it:** a 3×3 map and a 100×100 map should both fill the screen about equally. The trick is 3 steps: **(1) move the center to the origin** (centering) **(2) pick a fitting zoom** **(3) add an offset to the screen center**." },
      { code: String.raw`step 1 centering — subtract the grid's center before projecting:
  xx = x − width/2 ;  yy = y − height/2 ;  zz = z − (z_min+z_max)/2
  → the map's center moves to (0,0,0) of the projection system

step 2 zoom — pick the "smaller" of the width/height fits:
  zoom_w = WIN_W·0.8 / projected_width
  zoom_h = WIN_H·0.8 / projected_height
  zoom   = min(zoom_w, zoom_h)        ← guarantees no overflow on either axis

step 3 offset — push the image to the screen center:
  off_x = WIN_W/2 ;  off_y = WIN_H/2`, cap: "centering first makes zoom/rotate pivot around the center, not flee to a corner", lang: "txt" },
      { p: "**Why centering must precede zoom:** multiplying by zoom scales out from the origin (0,0). Without moving the center to the origin first, the image scales out from the top-left corner → the more you zoom the more it leaves the screen. Center first → zoom scales neatly around the image's middle." },
      { note: "Prove it yourself: comment out the `− width/2` line and run — the image piles into the top-left corner and flies off-screen as soon as you zoom. That's the empirical proof of why centering is needed." },
      { qa: [
        { q: "Why does auto-fit pick min(zoom_w, zoom_h), not max?", a: "The smaller one is the more 'constraining' → it guarantees neither width nor height overflows the screen. Picking max would let the longer side blow past the edges." },
        { q: "How does z_scale differ from zoom?", a: "zoom scales the whole image (x,y); z_scale adjusts only the height z so mountains don't poke off-screen even once zoom fits — a separate control for the height dimension." },
        { q: "Why also center z (subtract (z_min+z_max)/2)?", a: "So rotation/height balance around the middle — the lowest and highest points spread evenly around 0, so the image doesn't tilt or pile to the top/bottom." },
      ]},
      { h: "📖 Further reading" },
      { links: [
        { label: "Isometric projection — Wikipedia", url: "https://en.wikipedia.org/wiki/Isometric_projection", note: "where the 30° angle + isometric projection come from" },
        { label: "Bresenham's line algorithm — Wikipedia", url: "https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm", note: "the full integer-only line algorithm" },
        { label: "3D projection — Wikipedia", url: "https://en.wikipedia.org/wiki/3D_projection", note: "overview of every 3D → 2D projection" },
        { label: "Linear interpolation — Wikipedia", url: "https://en.wikipedia.org/wiki/Linear_interpolation", note: "the lerp basics used to fade color along a line" },
      ]},
    ],
    foundations: [
      { p: "This section digs into the **struct, pointers, and memory** FdF uses to store the map and state." },
      { h: "The 4 main structs" },
      { code: String.raw`typedef struct s_map {        /* map data */
    int  width;
    int  height;
    int  **z;                 /* 2D grid of heights */
    int  **color;             /* 2D grid of colors */
    int  z_min;
    int  z_max;
} t_map;

typedef struct s_cam {        /* camera/view */
    double zoom;
    double z_scale;
    int    off_x;             /* shift the image to screen center */
    int    off_y;
} t_cam;

typedef struct s_fdf {        /* everything together */
    void  *mlx; void *win; void *img;
    char  *addr;              /* pointer to the image buffer */
    int   bpp; int line_len; int endian;
    t_map map;
    t_cam cam;
} t_fdf;`, cap: "t_fdf is the 'central state blob' — pass one pointer to every function, no globals needed", lang: "c" },
      { h: "Why z is int ** (pointer to pointer)" },
      { p: "Because the map size isn't known ahead of time (it depends on the file), so you allocate dynamically: `int **z` is an 'array of pointers' each pointing to one row. Access with `z[y][x]` — row y, column x." },
      { code: String.raw`z ──► [ row0 ] ──► [z, z, z, z]   (row 0)
      [ row1 ] ──► [z, z, z, z]   (row 1)
      [ row2 ] ──► [z, z, z, z]   (row 2)`, cap: "allocate row by row to support any map size", lang: "txt" },
      { h: "Why store z_min / z_max" },
      { p: "For 'auto-fit' — knowing the full height range lets you adjust `z_scale` so the mountains don't overflow the screen. Computed during parsing (update min/max each time you read a value)." },
      { h: "image buffer: addr / bpp / line_len" },
      { p: "Instead of drawing pixel by pixel through mlx (slow), we ask for a 'pointer straight to the image's memory' (`addr`) and write colors ourselves:" },
      { table: { head: ["Variable", "Meaning"], rows: [
        ["`addr`", "the start address of the image buffer"],
        ["`bpp`", "bits per pixel (usually 32 = 4 bytes per pixel)"],
        ["`line_len`", "bytes per one image row"],
      ]}},
      { code: String.raw`dst = addr + (y * line_len + x * (bpp / 8));
*(unsigned int *)dst = color;   /* write 1 pixel's color */`, cap: "compute pixel (x,y)'s offset in the buffer then write directly — many times faster than mlx_pixel_put", lang: "c" },
      { note: "Why faster: write the whole image into memory first, then mlx_put_image_to_window once — no talking to the X server per pixel." },
    ],
    architecture: [
      { h: "Project files (mandatory)" },
      { table: { head: ["File", "Role"], rows: [
        ["`main.c`", "init mlx, hook events, start the loop"],
        ["`parse.c`", "count lines, read the file into a string array"],
        ["`token.c`", "split z value and color (incl. parsing hex)"],
        ["`grid.c`", "fill the z/color grid + update bounds"],
        ["`project.c`", "set up the camera + project 3D → 2D"],
        ["`draw.c`", "Bresenham line algorithm"],
        ["`pixel.c`", "write pixels, lerp colors, render the whole image"],
        ["`hooks.c`", "handle the ESC key + window close"],
        ["`free.c`", "free memory + report errors"],
      ]}},
      { h: "Order of work in main()" },
      { code: String.raw`main(argc, argv)
  ├─ check argc == 2                    (needs a map file)
  ├─ ft_bzero(&fdf)                    clear the struct to 0
  ├─ parse_map(&fdf, argv[1])          read file → z/color grid
  ├─ init_mlx(&fdf)                    open window + create image
  ├─ setup_camera(&fdf)                auto-compute zoom/offset
  ├─ render(&fdf)                      draw the first frame
  ├─ mlx_hook(... key_hook ...)        bind keys
  ├─ mlx_hook(... close_hook ...)      bind the window close [X]
  └─ mlx_loop(fdf.mlx)                 loop receiving events forever`, lang: "txt" },
      { h: "Data flow (map → image)" },
      { code: String.raw`.fdf file
   │  parse_map / read_lines
   ▼
char **rows  (each line a string)
   │  fill_grid → fill_row → parse_token
   ▼
map.z[y][x], map.color[y][x]  (2D grid)
   │  render: loop every point → project()
   ▼
t_pt (2D screen coords + color)
   │  draw_line (Bresenham) → put_pixel
   ▼
image buffer → mlx_put_image_to_window → screen`, cap: "text file → number grid → screen points → lines → image", lang: "txt" },
      { note: "render() draws just 2 lines per point: to the right (x+1) and down (y+1) — once every point is done you get the full mesh without drawing any line twice." },
    ],
    dataflow: [
      { p: "Walk through the key functions in run order." },
      { h: "parse_map() — read the file into the grid" },
      { code: String.raw`int parse_map(t_fdf *f, char *path)
{
    f->map.z_min = INT_MAX;
    f->map.z_max = INT_MIN;
    f->map.height = count_lines(path);     // count rows
    rows = read_lines(path, f->map.height); // read every line
    w = get_width(rows[0]);                  // count columns from row 0
    f->map.width = w;
    fill_grid(f, rows);                      // fill the grid
    free_rows(rows);
    return (1);
}`, cap: "read the file twice: first pass counts rows (to allocate exactly), second reads for real", lang: "c" },
      { h: "parse_token() — split z value and color" },
      { code: String.raw`void parse_token(char *tok, int *z, int *color)
{
    *z = ft_atoi(tok);              // the height number
    *color = DEF_COLOR;            // default color = white
    i = 0;
    while (tok[i] && tok[i] != ',') i++;
    if (tok[i] == ',')
        *color = parse_hex(tok + i + 1);  // a color is given, e.g. "5,0xFF0000"
}`, cap: "token format: \"z\" or \"z,0xRRGGBB\" — a comma means a color is attached", lang: "c" },
      { h: "project() — the heart of 3D → 2D" },
      { code: String.raw`t_pt project(t_fdf *f, int x, int y)
{
    xx = x - f->map.width / 2.0;            // move the center to origin
    yy = y - f->map.height / 2.0;
    zz = f->map.z[y][x] - (z_min + z_max)/2.0;
    zz = zz * f->cam.z_scale;               // scale height to fit the screen
    p.x = (int)((xx - yy) * COS30 * zoom) + off_x;
    p.y = (int)((xx + yy) * SIN30 * zoom - zz) + off_y;
    p.color = f->map.color[y][x];
    return (p);
}`, cap: "isometric formula: (x-y) for horizontal, (x+y) for vertical, subtract zz to lift high points (screen y points down)", lang: "c" },
      { h: "setup_camera() — automatic auto-fit" },
      { p: "Compute zoom from the map size so the image fills ~80% of the screen, comparing both width and height and taking the smaller (to avoid overflow), then set the offset to the screen center. `set_zscale()` keeps mountains from poking off-screen." },
      { h: "draw_line() — draw a line with a color fade" },
      { code: String.raw`void draw_line(t_fdf *f, t_pt a, t_pt b)
{
    init_bres(&d, a, b);
    while (1)
    {
        t = (steps != 0) ? i/steps : 0;     // (concept) fraction along the line
        put_pixel(f, a.x, a.y, lerp_color(a.color, b.color, t));
        if (a.x == b.x && a.y == b.y) break;
        bres_step(&d, &a);                   // step to the next pixel
    }
}`, cap: "every pixel along the way gets a color blended between the two ends (gradient)", lang: "c" },
      { h: "render() — assemble the whole image" },
      { code: String.raw`void render(t_fdf *f)
{
    ft_bzero(f->addr, f->line_len * WIN_H);  // clear the screen to black
    while (y < height) {
        while (x < width) {
            if (x+1 < width)  draw_line(project(x,y), project(x+1,y));
            if (y+1 < height) draw_line(project(x,y), project(x,y+1));
            x++;
        }
        y++;
    }
    mlx_put_image_to_window(f->mlx, f->win, f->img, 0, 0);
}`, cap: "draw the whole buffer first, then push it to the screen once", lang: "c" },
      { h: "key_hook / close_hook" },
      { code: String.raw`int key_hook(int key, t_fdf *f) {
    if (key == ESC_KEY) close_hook(f);   // ESC = quit
    return (0);
}
int close_hook(t_fdf *f) {
    free_all(f);                          // free everything
    exit(0);
}`, cap: "the window close [X] (event 17) and ESC both call close_hook → no leak", lang: "c" },
    ],
    implementation: [
      { h: "Suggested build order" },
      { ul: [
        "1. parser first — read the file into a z grid and print it to check (no mlx yet)",
        "2. open an empty mlx window first + close it with ESC/[X]",
        "3. put_pixel + draw one test dot in the screen center",
        "4. Bresenham — get a single line drawn first",
        "5. project() isometric + render the whole grid",
        "6. auto-fit camera (zoom/offset/z_scale)",
        "7. color fade (lerp) + support colors in the file",
        "8. bonus: zoom/pan/rotate/switch projection",
      ]},
      { h: "Common bugs and how to avoid them" },
      { table: { head: ["Symptom", "Cause", "Fix"], rows: [
        ["Image piles in a corner", "no centering before projecting / no offset added", "subtract width/2, height/2 then add off_x/off_y"],
        ["Image is a single dot / tiny", "zoom not computed from the map size", "auto-fit in setup_camera"],
        ["Mountains poke off-screen", "z_scale too large", "clamp z_scale by the z_max-z_min range"],
        ["Line breaks into dots", "Bresenham wrong / used a plain loop", "use Bresenham's error term correctly"],
        ["segfault while parsing", "uneven row lengths / empty file", "check width on every row, check height>0"],
      ]}},
      { h: "build / run" },
      { code: String.raw`make                       # mandatory
make bonus                 # zoom/rotate/pan/switch view
./fdf maps/42.fdf
./fdf maps/mars.fdf`, lang: "bash" },
      { note: "On Windows run through WSL + WSLg (has DISPLAY) or the mlx window won't open — see the build-42-projects-on-windows skill." },
    ],
    tricks: [
      { h: "Trick 1: precompute cos30/sin30 as macros" },
      { p: "Isometric uses a fixed 30° angle, so embed cos/sin as `#define` — no calling a math function millions of times per frame, clearly faster." },
      { h: "Trick 2: write straight to the image buffer" },
      { p: "Instead of `mlx_pixel_put` (talks to the X server per pixel = very slow) we get the buffer addr, compute the offset, write the color ourselves, then put the image once — dozens of times faster." },
      { h: "Trick 3: center before projecting" },
      { p: "Subtract the grid's center (`x - width/2`) before projecting so the image always sits center-screen and zoom/rotate pivot nicely around the middle instead of drifting away." },
      { h: "Trick 4: auto-fit picks the smaller zoom" },
      { p: "Compute the zoom that fits the width and the zoom that fits the height, then **pick the smaller** — guaranteeing the image never overflows whatever the map's shape." },
      { h: "Trick 5: lerp color along the line" },
      { p: "Split R/G/B into 3 channels, interpolate each with t (0..1), then repack — giving a smooth gradient between two points' colors." },
      { h: "Trick 6: draw only 2 lines per point" },
      { p: "No need to draw all 4 directions — just 'right' and 'down' of every point gives the full mesh without duplicate lines (left/up are the right/down lines of the neighbours) → half the work." },
      { h: "Trick 7 (bonus): switch projection with a rotation matrix" },
      { p: "The bonus adds 3-axis rotation angles (ax, ay, az) for free rotation, and pressing `p` cycles isometric / top-down / side via preset angles." },
    ],
    eval: [
      { qa: [
        { q: "How is isometric projection computed?", a: "x_screen = (x-y)·cos30·zoom, y_screen = (x+y)·sin30·zoom - z·scale, then add the offset to center the screen; equivalent to rotating the grid 45° then squashing vertically." },
        { q: "Why subtract z from y (not add)?", a: "Because the screen's y axis points down — a high point (large z) must be higher on screen = a smaller y, so z is subtracted." },
        { q: "How does Bresenham work, why use it?", a: "It keeps an accumulated error and decides each step whether to move x, y, or both, using only integers + add/subtract, no float/division — fast and gap-free on a pixel grid." },
        { q: "Why is the map int ** not a fixed array?", a: "The map size isn't known ahead of time, you allocate dynamically per file — int ** is an array of pointers each to one row, accessed via z[y][x]." },
        { q: "How does the auto-fit camera work?", a: "Compute zoom from the map size against both width and height, take the smaller to avoid overflow, set the offset to the screen center, clamp z_scale by the height range." },
        { q: "Why write pixels to a buffer instead of mlx_pixel_put?", a: "mlx_pixel_put talks to the X server per pixel, very slow; writing to the image buffer in memory then mlx_put_image_to_window once is dozens of times faster." },
        { q: "What does lerp_color do?", a: "Fades color between a line's two ends by splitting R/G/B and interpolating each with t (0..1) then repacking, giving a gradient." },
        { q: "How many times is the file read, why?", a: "Twice — first pass counts lines (to allocate the grid exactly, no realloc), second reads the real values into the grid." },
        { q: "How do you handle memory / window close?", a: "close_hook (bound to event 17 and ESC) calls free_all() to release everything (z, color, image, window) then exit(0); check leaks with valgrind." },
        { q: "What's the file's token format?", a: "Each cell is \"z\" or \"z,0xRRGGBB\" separated by spaces; a comma means a color is attached, otherwise default white." },
        { q: "Do ESC and the close [X] button differ?", a: "They bind different events (ESC via key_hook event 2, [X] via close_hook event 17) but both end up calling close_hook → free memory and exit." },
      ]},
      { h: "Tests" },
      { code: String.raw`./fdf maps/42.fdf
./fdf maps/mars.fdf
./fdf                       # usage (no argument)
./fdf doesnotexist.fdf      # Error (can't open file)
make bonus && ./fdf_bonus maps/mars.fdf   # rotate/zoom/pan`, lang: "bash" },
    ],
  },

  "cpp_module_00": {
    principle: [
      { h: "What Module 00 teaches" },
      { p: "CPP Module 00 is the **first step from C to C++** — moving from 'functions + struct' thinking to **OOP (Object-Oriented Programming)**: wrapping data + behaviour in a single **class**. Main topics: namespaces, std::cout/std::cin, classes, member functions, encapsulation, and **static members**." },
      { h: "The 3 exercises (easy to hard)" },
      { table: { head: ["ex", "Name", "Mainly teaches"], rows: [
        ["ex00", "Megaphone", "basic I/O, argv, std::cout, uppercase conversion"],
        ["ex01", "PhoneBook", "2 classes, array of objects, table formatting, std::cin/getline"],
        ["ex02", "Account", "static members, constructor/destructor, encapsulation (reverse from a log)"],
      ]}},
      { note: "Code reference note: ex02 (Account) is explained from **our real code** (`Account.cpp`) in the project folder. ex00/ex01 source isn't kept here, so those are **reference code written strictly to the subject** to show the approach." },
      { h: "ex00 — Megaphone (shout through a megaphone)" },
      { p: "The module's smallest program: take text from argv and **print it all uppercase**. With no arguments, print a default message. The goal is getting comfortable with `std::cout`, looping argv, and character conversion." },
      { code: String.raw`$ ./megaphone "shhhhh... I think the students are asleep..."
SHHHHH... I THINK THE STUDENTS ARE ASLEEP...
$ ./megaphone Damn   "good"      idea
DAMN GOOD IDEA
$ ./megaphone
* LOUD AND UNBEARABLE FEEDBACK NOISE *`, cap: "subject behaviour: join all argv -> uppercase; no arg -> default message", lang: "txt" },
      { h: "ex01 — PhoneBook" },
      { p: "An interactive program: takes `ADD` / `SEARCH` / `EXIT` commands. Stores up to **8 contacts** (overwrites the oldest beyond that). `SEARCH` prints a compact table then asks for an index to see full details. Practices **2 classes** (PhoneBook holds an array of Contact) + column formatting." },
      { code: String.raw`Enter command (ADD / SEARCH / EXIT): ADD
First name: John
...
Enter command (ADD / SEARCH / EXIT): SEARCH
|     index|first name| last name|  nickname|
|         0|      John|       Doe|    johnny|
Enter index: 0
First name : John
...`, cap: "a 4-column table, each column 10 wide, truncated with '.' if too long", lang: "txt" },
      { h: "ex02 — Account (GlobalBanksters United)" },
      { p: "The classic puzzle: you're given `Account.hpp` (fixed header, don't edit), `tests.cpp` (fixed test program), and an **expected output log** — but **not the `Account.cpp` code**. The job is to **write Account.cpp yourself so the output matches the log exactly** (only the timestamp may differ)." },
      { code: String.raw`[19920104_091532] index:0;amount:42;created
[19920104_091532] index:1;amount:54;created
...
[19920104_091532] accounts:8;total:20049;deposits:0;withdrawals:0
[19920104_091532] index:0;p_amount:42;deposit:5;amount:47;nb_deposits:1`, cap: "part of the log you must match — you 'decode' what each method must print", lang: "txt" },
      { note: "This is reverse engineering: read the log + header + tests and infer each method's behaviour to reproduce the output — practising code reading and behaviour inference." },
      { h: "Why this teaches OOP well" },
      { ul: [
        "**Each Account = 1 object** with its own money (`_amount`)",
        "**Bank-wide counters** (number of accounts, total money) = **static members** shared by every object",
        "All data is `private` — touchable only through methods = **encapsulation**",
      ]},
      { h: "Learning goals" },
      { table: { head: ["Concept", "Seen via"], rows: [
        ["Class & object", "one Account = one bank account"],
        ["Constructor / Destructor", "prints ;created on birth, ;closed on death"],
        ["Static member", "shared counters _nbAccounts, _totalAmount"],
        ["Encapsulation", "private data + public methods"],
        ["const member function", "checkAmount() const, displayStatus() const"],
      ]}},
    ],
    theory: [
      { p: "This section gathers the **C++ and OOP** theory you need before reading Account." },
      { h: "1) How C++ differs from C" },
      { table: { head: ["", "C", "C++"], rows: [
        ["data + functions", "struct + separate functions", "class (combined)"],
        ["print to screen", "printf", "std::cout <<"],
        ["memory", "malloc/free", "new/delete"],
        ["namespace", "none", "std::, ::"],
        ["compiler", "cc / gcc", "c++ / g++"],
      ]}},
      { note: "This module forces -std=c++98 — the old C++ standard (no auto, nullptr, range-for) to drill the fundamentals hard." },
      { h: "2) Class & Object" },
      { p: "A **class** is a blueprint declaring what data (member variables) and behaviour (member functions) objects of that type have. An **object** is a real instance built from a class. One class makes many objects, each with its own data." },
      { code: String.raw`class Account { ... };          // blueprint
Account a(42);                   // object #1 (money 42)
Account b(54);                   // object #2 (money 54)
// a and b have separate _amount`, lang: "cpp" },
      { h: "3) Encapsulation" },
      { p: "Hide internal data so it can't be changed directly from outside — accessible only through methods you control. Prevents invalid edits and lets you change the internals without affecting users." },
      { table: { head: ["access", "who can reach it"], rows: [
        ["`public`", "anyone (external interface)"],
        ["`private`", "only this class's methods"],
        ["`protected`", "this class + derived classes (inheritance)"],
      ]}},
      { p: "In Account: `_amount`, `_nbAccounts` are all `private` — the outside world sees them only through `public` `checkAmount()`, `getNbAccounts()`." },
      { h: "4) Constructor & Destructor" },
      { p: "A **constructor** is a special function that runs automatically when an object is **born** (sets initial state). A **destructor** (`~`) runs automatically when an object **dies** (cleanup). The name must match the class." },
      { code: String.raw`Account( int initial_deposit );  // constructor (takes initial money)
~Account( void );                 // destructor (no parameters)`, cap: "in Account both print a timestamp + status (;created / ;closed)", lang: "cpp" },
      { h: "5) Static member — shared by the whole class" },
      { p: "A normal member: each object has its own copy. A **static member**: a single shared copy **for the whole class**, like a class-wide global. Perfect for 'total counters' — how many accounts exist, the bank's total money." },
      { code: String.raw`static int _nbAccounts;    // total number of accounts (one copy)
// in the .cpp you must define it outside the class:
int Account::_nbAccounts = 0;`, cap: "a static member must be 'defined' separately in the .cpp once, or you get a linker error", lang: "cpp" },
      { h: "6) static member function" },
      { p: "A method that works with static members **without an object** — called via the class name, e.g. `Account::getNbAccounts()`. It has no `this` because it isn't tied to a particular object." },
      { h: "7) const member function" },
      { p: "A method suffixed with `const` promises **not to modify the object's data**. It can be called on const objects and helps the compiler catch bugs if you accidentally write." },
      { code: String.raw`int  checkAmount( void ) const;      // only reads _amount -> const
void displayStatus( void ) const;    // only displays -> const`, lang: "cpp" },
      { h: "8) C++ I/O (all 3 exercises use it)" },
      { p: "C++ does I/O through **streams**: `std::cout` prints to screen, `std::cin` reads from the keyboard, chained with `<<` (out) and `>>` (in). `std::endl` is a newline + flush." },
      { table: { head: ["For", "Tool", "Seen in"], rows: [
        ["print to screen", "`std::cout <<`", "every exercise"],
        ["read a whole line (with spaces)", "`std::getline(std::cin, s)`", "ex01 (contact fields)"],
        ["read one word", "`std::cin >> x`", "ex01 (choose index)"],
        ["check EOF / read failure", "`std::cin.eof()`, `if (!std::cin)`", "ex01"],
      ]}},
      { h: "9) std::string & changing case (ex00/ex01)" },
      { p: "`std::string` is C++'s string that manages its own length/memory (no malloc like C). Loop char by char and call `std::toupper()` (from `<cctype>`) to uppercase — the heart of ex00." },
      { code: String.raw`#include <cctype>
std::string s = argv[i];
for (size_t j = 0; j < s.length(); ++j)
    std::cout << (char)std::toupper(s[j]);`, cap: "ex00: loop every argv, convert every char to uppercase", lang: "cpp" },

      { h: "🔬 Deep Dive A: Static members — one shared copy for the whole class + lifecycle" },
      { p: "**Picture it:** `_amount` is each account's own money (everyone has their own), but `_nbAccounts` is 'the bank's total account count' — one shared copy every object sees. static = a class-wide variable, not tied to any one object." },
      { code: String.raw`where they live:
  normal member -> "inside" each object (a._amount, b._amount separate)
  static member -> in static storage, one copy (born before main, dies after)
                   every object refers to the same one

every Account constructor does:
  _accountIndex = _nbAccounts;   // record own index "before" incrementing
  _nbAccounts++;                 // bump the total counter
  _totalAmount += deposit;       // add to the bank's total money`, cap: "static = one copy per class; instance member = one copy per object", lang: "cpp" },
      { p: "**Trace it** — create 3 accounts with money {42, 54, 957}:" },
      { code: String.raw`start: _nbAccounts=0, _totalAmount=0

Account a(42):  _accountIndex=0 (=_nbAccounts before ++), _nbAccounts->1, _totalAmount->42
Account b(54):  _accountIndex=1,                          _nbAccounts->2, _totalAmount->96
Account c(957): _accountIndex=2,                          _nbAccounts->3, _totalAmount->1053

-> index runs 0,1,2 automatically because it reads _nbAccounts "before" ++
-> getNbAccounts() returns 3, getTotalAmount() returns 1053 (no object needed)`, cap: "the heart of ex02: _accountIndex comes from the static counter read-before-increment, so indices are unique and self-ordering", lang: "txt" },
      { note: "Prove it yourself: a static member must be 'defined' outside the class once in the .cpp (`int Account::_nbAccounts = 0;`). Delete that line -> linker error 'undefined reference to Account::_nbAccounts', because the in-class declaration only 'declares', it doesn't 'allocate'." },
      { qa: [
        { q: "Why does a static member function have no `this`?", a: "Because it isn't tied to a particular object — you can call it via the class name (`Account::getNbAccounts()`) with no object at all. No object -> no this -> it can only touch static members." },
        { q: "Why must a static be defined outside the class?", a: "The in-class declaration only tells the compiler 'this exists' (no memory). You need one real definition (one-definition rule) in a .cpp to allocate it, or the linker can't find it." },
        { q: "How does the first account's _accountIndex become 0?", a: "The constructor reads `_nbAccounts` (starting at 0) into _accountIndex first, then ++ -> first account gets 0, the next 1, 2,..." },
      ]},

      { h: "🔬 Deep Dive B: Constructor/Destructor order — why Account's log reads that way" },
      { p: "**Picture it:** an object is **born** -> the constructor runs (prints `;created`); an object **dies** -> the destructor runs (prints `;closed`). ex02's challenge is making the log order match exactly — which depends on the 'birth/death order'." },
      { code: String.raw`ordering rules:
  • the constructor runs when an object is created (in declaration order)
  • the destructor runs when an object expires:
      - local (stack) variables -> die at end of scope, in "reverse" order (LIFO)
      - members of a vector/array -> die when the container is destroyed
  • an object's members are constructed in "declaration order in the class",
    NOT the order in the init list`, cap: "constructed front-to-back, destroyed back-to-front (like a stack of plates)", lang: "cpp" },
      { p: "**Trace the real order** — a block creating 3 accounts on the stack:" },
      { code: String.raw`{
    Account a(42);    // [ts] index:0;amount:42;created
    Account b(54);    // [ts] index:1;amount:54;created
    Account c(957);   // [ts] index:2;amount:957;created
}   // end of scope -> destroyed in reverse:
    // [ts] index:2;amount:957;closed   <- c dies first (born last)
    // [ts] index:1;amount:54;closed
    // [ts] index:0;amount:42;closed    <- a dies last`, cap: "LIFO: the last-born dies first — which is why the closed order is the reverse of created", lang: "txt" },
      { note: "Prove it yourself: why store p_amount (money before deposit) 'before' changing _amount in makeDeposit? Because the log must print both the old (p_amount) and new (_amount) values — if you change first, the old value is gone. The 'read old -> change -> print both' order matters." },
      { qa: [
        { q: "Why is the `;closed` log the reverse of `;created`?", a: "Stack objects are destroyed LIFO (last-in-first-out) — the last-born expires first at end of scope, so closed comes out in reverse order." },
        { q: "In what order are an object's members constructed — init list or declaration?", a: "Always in 'declaration order in the class', not the order in the initializer list — a classic trap if one member depends on another declared later." },
        { q: "What does Account's destructor do?", a: "Prints `[ts] index:..;amount:..;closed` — a static helper _displayTimestamp() + the account's final status when it's destroyed." },
      ]},

      { h: "🔬 Deep Dive C: const-correctness — what `const` after a method really means" },
      { p: "**Picture it:** putting `const` after a method = a promise to the compiler that 'this method only reads, it doesn't modify the object'. It's not just decoration — it lets you call that method on a **const object** and lets the compiler catch accidental writes." },
      { code: String.raw`mechanism: const after a method changes the type of this
  normal method: this is  Account*        -> can modify members
  const method:  this is  const Account*  -> can't modify members (compile error)

void displayStatus( void ) const {
    // this->_amount += 1;   // x ERROR: assignment of member in const method
    std::cout << _amount;    // / reading is fine
}`, cap: "const makes this a pointer-to-const -> the compiler forbids any member write", lang: "cpp" },
      { p: "**Why it matters — a const object can only call const methods:**" },
      { code: String.raw`const Account ref(42);   // a const object
  ref.displayStatus();   // / ok (it's a const method)
  ref.makeDeposit(5);    // x ERROR: makeDeposit isn't const but ref is const

-> if you forget const on displayStatus -> you can't call it on a const object at all
-> const "propagates": to use const objects, mark every read-only method const`, cap: "const-correctness = designing so 'everything read-only' is marked const, so const objects are usable", lang: "txt" },
      { note: "Prove it yourself: add `const Account a(42); a.makeWithdrawal(5);` and compile — it errors because makeWithdrawal modifies _amount (not const). Change to `a.checkAmount()` (const) and it compiles — confirming a const object can only call const methods." },
      { qa: [
        { q: "What does the const in `int checkAmount() const` do?", a: "Says this method doesn't modify the object's members (this is const Account*). Result: you can call it on a const object, and if you accidentally write a member the compiler errors." },
        { q: "Why can't a const object call a non-const method?", a: "A non-const method might modify the object — but the object is const (can't be modified) -> the compiler refuses, to keep the const promise. So you must mark read-only methods const." },
        { q: "What if you must modify a member inside a const method?", a: "Mark that member `mutable` (e.g. an internal cache/counter) — but use it sparingly, since it's an 'exception' to the const promise." },
      ]},

      { h: "🔬 Deep Dive D: the this pointer — the hidden pointer that tells a method 'which object called it'" },
      { p: "**Picture it:** one method (`makeDeposit`) works on every account — how does it know whether it's working on a or b right now? The answer is **`this`**, a hidden pointer to the object that called the method." },
      { code: String.raw`what really happens (desugared): the compiler adds this as a hidden first param
  a.makeDeposit(5);
  -> Account::makeDeposit(&a, 5);     // &a is passed as this

inside the method:
  _amount += deposit;          // really this->_amount += deposit
  -> this points to a -> modifies a._amount ; calling b.makeDeposit -> this points to b`, cap: "this = the address of the calling object — lets one body of code work on any object", lang: "cpp" },
      { p: "**When to use this directly:** (1) when a parameter name clashes with a member (`this->x = x`), (2) returning `*this` to chain methods, (3) in a const method `this` is `const Account*` (read-only)." },
      { note: "Prove it yourself: in makeWithdrawal, writing `this->_amount` and `_amount` give the same result — because a bare `_amount` is implicitly `this->_amount`. Writing this-> explicitly makes it clear you're touching the object's member." },
      { qa: [
        { q: "What exactly is this?", a: "A pointer the compiler secretly passes as the first argument of every non-static method, pointing to the object that called it — a bare `_amount` is `this->_amount`." },
        { q: "Why does a static method have no this?", a: "A static method isn't tied to any object (callable via the class name) -> there's no object for this to point to -> it can't touch instance members, only static ones." },
        { q: "Why return `*this` (not this)?", a: "this is a pointer; `*this` is the object itself — returning a reference to the object lets you chain calls like `obj.set(1).set(2)` (common in later modules)." },
      ]},
      { h: "📖 Further reading" },
      { links: [
        { label: "cppreference — Classes", url: "https://en.cppreference.com/w/cpp/language/classes", note: "official reference on classes / members" },
        { label: "cppreference — Static members", url: "https://en.cppreference.com/w/cpp/language/static", note: "static data members + out-of-class definition" },
        { label: "learncpp — Intro to classes", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-classes/", note: "hands-on C++ OOP, step by step" },
        { label: "cppreference — The this pointer", url: "https://en.cppreference.com/w/cpp/language/this", note: "definition and use of this" },
        { label: "cppreference — std::getline", url: "https://en.cppreference.com/w/cpp/string/basic_string/getline", note: "read a whole line (used in ex01)" },
        { label: "cppreference — std::toupper", url: "https://en.cppreference.com/w/cpp/string/byte/toupper", note: "uppercase a character (used in ex00)" },
      ]},
    ],
    foundations: [
      { p: "This section digs into the **data structures of each exercise** — starting with the short ex00/ex01 then going deep on Account (ex02)." },
      { h: "ex00 — Megaphone: no class at all" },
      { p: "ex00 is just a single `main()`, no class — the data is the `argc`/`argv` the system passes in. The shape: if `argc == 1` print the default; else loop argv[1..argc-1], uppercase every char, print them joined, end with a newline." },
      { code: String.raw`int main(int argc, char **argv) {
    if (argc == 1) {
        std::cout << "* LOUD AND UNBEARABLE FEEDBACK NOISE *" << std::endl;
        return 0;
    }
    for (int i = 1; i < argc; ++i)
        for (int j = 0; argv[i][j]; ++j)
            std::cout << (char)std::toupper(argv[i][j]);
    std::cout << std::endl;
    return 0;
}`, cap: "ex00, the whole program in a few lines (reference code per the subject)", lang: "cpp" },
      { h: "ex01 — PhoneBook: 2 nested classes" },
      { p: "Designed as 2 classes: **Contact** holds one entry, **PhoneBook** holds `Contact[8]` + a counter. A fixed 8-slot array (no new/delete), wrapping like a ring when full." },
      { code: String.raw`class Contact {
    std::string _first, _last, _nick, _phone, _secret;
    /* getters/setters per field */
};
class PhoneBook {
    Contact _contacts[8];   // up to 8 entries
    int     _count;         // how many real entries (0..8)
    int     _next;          // next slot to write (ring index)
};`, cap: "PhoneBook uses a fixed 8-element array — when full, overwrite the oldest (_next wraps to 0)", lang: "cpp" },
      { p: "When adding beyond 8: `_next = (_next + 1) % 8` wraps the index back over the first — always keeping 'the latest 8'." },
      { h: "ex02 — Account: 2 levels of member (static vs normal)" },
      { code: String.raw`class Account {
private:
    /* static = bank-wide (shared by all objects) */
    static int _nbAccounts;          // how many accounts
    static int _totalAmount;         // total money
    static int _totalNbDeposits;     // total deposits
    static int _totalNbWithdrawals;  // total withdrawals

    /* normal = this account only (each object has its own) */
    int _accountIndex;               // account number
    int _amount;                     // this account's money
    int _nbDeposits;                 // this account's deposits
    int _nbWithdrawals;              // this account's withdrawals
};`, cap: "the key line: static = class level (totals), normal = object level (per account)", lang: "cpp" },
      { h: "Why static must be defined separately in the .cpp" },
      { p: "In the header you only **declare** 'this static member exists' but don't allocate it yet. You must **define** (allocate + initialise) it once in the .cpp, or the linker can't find the real thing:" },
      { code: String.raw`/* top of Account.cpp */
int Account::_nbAccounts        = 0;
int Account::_totalAmount       = 0;
int Account::_totalNbDeposits   = 0;
int Account::_totalNbWithdrawals = 0;`, cap: "forget these lines -> undefined reference at link time", lang: "cpp" },
      { h: "Static counter lifecycle" },
      { code: String.raw`creating Account(42):
  _accountIndex = _nbAccounts;   // claim index from the current counter (0)
  _amount = 42;
  _nbAccounts++;                 // bump the total -> 1
  _totalAmount += 42;            // add to the total money

creating Account(54):
  _accountIndex = _nbAccounts;   // gets index 1
  _nbAccounts++;                 // -> 2
  ...`, cap: "a new account's index = the count of accounts that existed before it — 0,1,2,... automatically", lang: "txt" },
      { h: "typedef Account t — a header trick" },
      { p: "`typedef Account t;` makes an alias `Account::t` for `Account` — `tests.cpp` uses it to make `std::vector<Account::t>`. It's just an alias with no logic impact, but it must exist in the header (which is given)." },
      { h: "Why everything is int (not float)" },
      { p: "The account system uses pure integers — no cents. That keeps the output as round numbers matching the log easily, with no floating-point precision worries." },
    ],
    architecture: [
      { h: "ex00 — Megaphone: a single file" },
      { table: { head: ["File", "Role"], rows: [
        ["`megaphone.cpp`", "just `main()` — take argv, uppercase, print"],
        ["`Makefile`", "build a binary named `megaphone` (-std=c++98)"],
      ]}},
      { h: "ex01 — PhoneBook: classes split into files" },
      { table: { head: ["File", "Role"], rows: [
        ["`Contact.hpp/.cpp`", "class holding one entry + getters/setters"],
        ["`PhoneBook.hpp/.cpp`", "class holding Contact[8] + add/search"],
        ["`main.cpp`", "loop reading ADD/SEARCH/EXIT commands"],
        ["`Makefile`", "build `phonebook`"],
      ]}},
      { note: "C++ file-splitting principle: each class has a `.hpp` (interface declaration) paired with a `.cpp` (implementation) — like Account in ex02." },
      { h: "Project files (ex02)" },
      { table: { head: ["File", "Editable?", "Role"], rows: [
        ["`Account.hpp`", "❌ don't edit", "declares the class (fixed interface)"],
        ["`tests.cpp`", "❌ don't edit", "the test program (creates accounts, deposits, withdraws)"],
        ["`*.log`", "reference", "the correct output, used to compare"],
        ["`Account.cpp`", "✅ ours to write", "implement every method to match the log"],
        ["`Makefile`", "✅", "build with -std=c++98"],
      ]}},
      { h: "The interface to implement (from the header)" },
      { code: String.raw`/* static — called via the class name, no object needed */
static int  getNbAccounts();
static int  getTotalAmount();
static int  getNbDeposits();
static int  getNbWithdrawals();
static void displayAccountsInfos();

/* normal — work on an object */
Account( int initial_deposit );      // constructor
~Account();                           // destructor
void makeDeposit( int deposit );
bool makeWithdrawal( int withdrawal );
int  checkAmount() const;
void displayStatus() const;

/* private helper */
static void _displayTimestamp();`, cap: "the header fixes every signature — the job is filling the 'bodies' to match the log", lang: "cpp" },
      { h: "What tests.cpp does (call order)" },
      { code: String.raw`1. create 8 accounts, initial money {42,54,957,...}  -> 8 ;created lines
2. displayAccountsInfos()                            -> 1 summary line
3. displayStatus() for every account                 -> 8 lines
4. makeDeposit() on every account                    -> 8 deposit lines
5. displayAccountsInfos() + displayStatus() x8
6. makeWithdrawal() on every account (some refused)
7. displayAccountsInfos() + displayStatus() x8
8. end of main -> destructor prints ;closed x8`, cap: "this order fixes the order of lines in the log you must reproduce", lang: "txt" },
      { note: "At end of main the vector's objects are destroyed in index order -> the destructor prints ;closed for 8 lines as the very end of the log." },
    ],
    dataflow: [
      { h: "ex00 — Megaphone: data path" },
      { code: String.raw`argv --> argc==1 ? --yes--> print "* LOUD AND ... *" --> done
              | no
              v
       loop i = 1..argc-1
              |
              v  loop j over each argv[i]
       std::toupper(argv[i][j]) --> std::cout
              v
       std::cout << std::endl --> done`, cap: "input is argv -> output is the joined uppercase string", lang: "txt" },
      { h: "ex01 — PhoneBook: command loop" },
      { code: String.raw`main loop --> read a command (getline)
   |- "ADD"    > ask 5 fields > PhoneBook.add(Contact)
   |                              \> _contacts[_next] = c; ring index
   |- "SEARCH" > print compact table > read index > print full contact
   \- "EXIT"   > break the loop`, cap: "input is commands+fields from stdin -> store in the array / display", lang: "txt" },
      { h: "ex02 — Account: every method, one by one" },
      { p: "Walk through each method — against the log line it produces." },
      { h: "Constructor — Account(int initial_deposit)" },
      { code: String.raw`Account::Account( int initial_deposit )
{
    this->_accountIndex = _nbAccounts;   // account number = current counter
    this->_amount = initial_deposit;
    this->_nbDeposits = 0;
    this->_nbWithdrawals = 0;
    _nbAccounts++;                        // bump the total counter
    _totalAmount += initial_deposit;      // add to the total money
    _displayTimestamp();
    std::cout << "index:" << _accountIndex
              << ";amount:" << _amount << ";created" << std::endl;
}`, cap: "output: [ts] index:0;amount:42;created", lang: "cpp" },
      { h: "Destructor — ~Account()" },
      { code: String.raw`Account::~Account( void )
{
    _displayTimestamp();
    std::cout << "index:" << _accountIndex
              << ";amount:" << _amount << ";closed" << std::endl;
}`, cap: "output: [ts] index:0;amount:42;closed", lang: "cpp" },
      { h: "makeDeposit(int deposit)" },
      { code: String.raw`void Account::makeDeposit( int deposit )
{
    int p_amount = this->_amount;        // remember money before (previous)
    this->_amount += deposit;
    this->_nbDeposits++;
    _totalAmount += deposit;             // update the static total
    _totalNbDeposits++;
    _displayTimestamp();
    std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
              << ";deposit:" << deposit << ";amount:" << _amount
              << ";nb_deposits:" << _nbDeposits << std::endl;
}`, cap: "output: [ts] index:0;p_amount:42;deposit:5;amount:47;nb_deposits:1", lang: "cpp" },
      { h: "makeWithdrawal(int withdrawal) — with a refusal condition" },
      { code: String.raw`bool Account::makeWithdrawal( int withdrawal )
{
    int p_amount = this->_amount;
    _displayTimestamp();
    if ( withdrawal > this->_amount )            // not enough money
    {
        std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
                  << ";withdrawal:refused" << std::endl;
        return (false);
    }
    this->_amount -= withdrawal;
    this->_nbWithdrawals++;
    _totalAmount -= withdrawal;
    _totalNbWithdrawals++;
    std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
              << ";withdrawal:" << withdrawal << ";amount:" << _amount
              << ";nb_withdrawals:" << _nbWithdrawals << std::endl;
    return (true);
}`, cap: "if withdrawal exceeds money -> ;withdrawal:refused and return false (a clue from the log)", lang: "cpp" },
      { h: "static getters + displayAccountsInfos" },
      { code: String.raw`int  Account::getNbAccounts()  { return (_nbAccounts); }
int  Account::getTotalAmount() { return (_totalAmount); }
/* ... */
void Account::displayAccountsInfos()
{
    _displayTimestamp();
    std::cout << "accounts:" << _nbAccounts << ";total:" << _totalAmount
              << ";deposits:" << _totalNbDeposits
              << ";withdrawals:" << _totalNbWithdrawals << std::endl;
}`, cap: "output: [ts] accounts:8;total:20049;deposits:0;withdrawals:0", lang: "cpp" },
      { h: "_displayTimestamp() — the heart of every line" },
      { code: String.raw`void Account::_displayTimestamp( void )
{
    std::time_t now = std::time(NULL);
    std::tm    *lt  = std::localtime(&now);
    char        buf[32];
    std::strftime(buf, sizeof(buf), "[%Y%m%d_%H%M%S] ", lt);
    std::cout << buf;
}`, cap: "uses <ctime> to format [YYYYMMDD_HHMMSS] before every line — the timestamp may differ from the log (the only thing allowed to)", lang: "cpp" },
    ],
    implementation: [
      { h: "ex00 — Megaphone: common mistakes" },
      { ul: [
        "Don't forget the `argc == 1` case (no arg) -> print the exact default message including the `*`",
        "Don't add spaces between argv (see `DAMN GOOD IDEA` — from 3 argv printed joined, since the shell already split the spaces)",
        "`std::toupper` returns `int` -> cast to `(char)` before printing, or you may get the ASCII number",
        "End with one `std::endl` at the very end",
      ]},
      { h: "ex01 — PhoneBook: common mistakes" },
      { ul: [
        "Table columns are **10** chars wide, right-aligned — use `std::setw(10)` (from `<iomanip>`) separated by `|`",
        "A field longer than 10 -> truncate to 9 chars + a `.` (e.g. `Christophe` -> `Christoph.`)",
        "Reading names with spaces needs `std::getline`, not `std::cin >>`",
        "Guard empty input: no ADD with empty fields / no nonexistent index on SEARCH",
        "Check `std::cin.eof()` to exit cleanly on Ctrl-D",
      ]},
      { code: String.raw`#include <iomanip>
std::string trunc(std::string s) {
    if (s.length() > 10)
        return s.substr(0, 9) + ".";
    return s;
}
std::cout << "|" << std::setw(10) << trunc(c.getFirst());`, cap: "ex01: fit to 10 columns + right-align with setw (reference code per the subject)", lang: "cpp" },
      { h: "ex02 — Account: how to reverse-engineer from the log" },
      { ul: [
        "1. read `tests.cpp` -> know which method is called when",
        "2. pair each 'call' with a 'log line' -> know what that method must print",
        "3. look at the fields in the line (`index`, `p_amount`, `amount`, `nb_deposits`) -> infer what to store/compute",
        "4. note the special case: `withdrawal:refused` -> an if for insufficient funds",
        "5. write Account.cpp -> build -> diff against the log (minus timestamp)",
      ]},
      { h: "Key clues you can read from the log" },
      { table: { head: ["The log line says", "You can infer"], rows: [
        ["index starts 0,1,2...", "index = _nbAccounts at creation"],
        ["total:20049 = sum of initials", "the constructor adds to _totalAmount"],
        ["p_amount shown before amount", "must remember the old value before changing"],
        ["withdrawal:refused", "if (withdrawal > _amount) -> refuse"],
        [";closed at the very end", "the destructor runs when objects die"],
      ]}},
      { h: "Building (important: must be c++98)" },
      { code: String.raw`# Makefile
CC     = c++
CFLAGS = -Wall -Wextra -Werror -std=c++98
# SRCS = Account.cpp tests.cpp
make && ./account > my.log
diff <(sed 's/\[[0-9_]*\]//' my.log) \
     <(sed 's/\[[0-9_]*\]//' 19920104_091532.log)
# empty diff = exact match (compared with timestamps stripped)`, lang: "bash" },
      { note: "If you hit 'mem_fun_ref is not a member of std' -> you forgot -std=c++98 (mem_fun_ref was removed in newer C++); the flag fixes it." },
    ],
    tricks: [
      { h: "ex00 — trick: join argv without building a string" },
      { p: "No need to concatenate argv into one big string first — loop and print char by char through `std::cout`, saving memory and being shorter." },
      { h: "ex01 — trick: ring buffer with modulo" },
      { p: "Hold 8 entries then overwrite the oldest -> `_next = (_next + 1) % 8`. The `_count` stops at 8 (to know how many real rows on SEARCH) while `_next` keeps wrapping." },
      { h: "ex01 — trick: setw + truncate 9+'.'" },
      { p: "Format the table with `std::setw(10)` (auto right-align) and if a field exceeds 10, `substr(0,9) + \".\"` — exactly 10 wide and signalling truncation." },
      { h: "ex02 — Account: key tricks" },
      { h: "Trick 1: index = _nbAccounts before ++" },
      { p: "Set `_accountIndex = _nbAccounts` **before** `_nbAccounts++` -> the first account gets index 0, then 1, 2... automatically, with no separate index counter." },
      { h: "Trick 2: save p_amount before changing the value" },
      { p: "The log shows both old money (p_amount) and new (amount) -> `int p_amount = this->_amount;` **before** changing `_amount`, or the old value is already gone." },
      { h: "Trick 3: update both static counters together" },
      { p: "Every deposit/withdrawal updates both the account's own member (`_nbDeposits`) and the bank's static total (`_totalNbDeposits`) -> so the summary in displayAccountsInfos matches." },
      { h: "Trick 4: diff with timestamps stripped" },
      { p: "Our output's timestamp will differ from the log (different run time) — use `sed` to remove the `[...]` part before diff -> compare only the content that must match." },
      { h: "Trick 5: -std=c++98 always" },
      { p: "tests.cpp uses `std::mem_fun_ref`, removed in newer C++ standards — always compile with `-std=c++98` (and the whole module mandates c++98 anyway)." },
      { h: "Trick 6: _displayTimestamp is static private" },
      { p: "It isn't tied to a particular account (just prints the time), so it's `static`, and `private` because it's an internal helper — every method calls it before printing its own line." },
    ],
    eval: [
      { qa: [
        { q: "ex00: what to do with no arguments?", a: "Check argc == 1 and print the default '* LOUD AND UNBEARABLE FEEDBACK NOISE *' (exactly, including *) — otherwise loop argv uppercasing everything." },
        { q: "ex00: why cast std::toupper to (char)?", a: "std::toupper returns an int (ASCII code); without casting to char before printing, std::cout may print the number, not the letter." },
        { q: "ex01: why getline instead of cin >> for names?", a: "cin >> stops at whitespace, reading only the first word; getline reads a whole line including spaces, right for first+last names that may contain spaces." },
        { q: "ex01: only 8 entries — what beyond that?", a: "Overwrite the oldest via a ring index (_next = (_next+1) % 8) — always keeping the latest 8, no new/delete." },
        { q: "ex01: how is the table formatted?", a: "Columns 10 wide, right-aligned with std::setw(10), separated by |; a field longer than 10 is substr(0,9) + '.'." },
        { q: "How do class and object differ?", a: "A class is the blueprint (what data/behaviour it has); an object is a real instance built from it; one class makes many objects, each with its own data." },
        { q: "What is a static member, why used here?", a: "A member with one copy shared by all objects (class level) — used for bank-wide totals like _nbAccounts, _totalAmount that every account must see the same value of." },
        { q: "Why must a static member be defined in the .cpp?", a: "The header only declares it (no allocation); you must define it (int Account::_nbAccounts = 0;) once in the .cpp so the linker has the real thing, or undefined reference." },
        { q: "What is encapsulation, how seen in Account?", a: "Hiding internal data — _amount/_nbAccounts are private, untouchable directly, only via public methods (checkAmount/getNbAccounts); prevents invalid edits and hides the implementation." },
        { q: "When do constructor/destructor run?", a: "The constructor runs automatically on object creation (prints ;created), the destructor on destruction/end of scope (prints ;closed); names match the class, the destructor prefixed with ~." },
        { q: "What is a const member function?", a: "A method suffixed const promises not to modify the object, e.g. checkAmount() const, displayStatus() const; callable on const objects, and the compiler catches accidental writes." },
        { q: "What is the this pointer?", a: "A hidden pointer in non-static methods to the calling object; this->_amount = the working object's money, letting one method work on any object." },
        { q: "Where does p_amount in the log come from?", a: "The money before the operation (previous amount) — you must store _amount before changing it, then print both old (p_amount) and new (amount)." },
        { q: "Why does makeWithdrawal return bool?", a: "To say whether the withdrawal succeeded — if insufficient (withdrawal > _amount), print withdrawal:refused and return false without deducting; success returns true." },
        { q: "Why -std=c++98?", a: "tests.cpp uses std::mem_fun_ref removed in newer C++, and the module mandates c++98; without it you get a compile error." },
        { q: "How does a static member function differ from a normal method?", a: "A static method has no this, callable without an object (Account::getNbAccounts()), works only on static members; a normal method is tied to an object and has this." },
        { q: "How do you explain the ;closed order in the log?", a: "At end of main the vector's objects are destroyed -> each destructor prints ;closed in index order, as a block at the very end of the output." },
      ]},
      { h: "Tests" },
      { code: String.raw`make
./account > my.log
# compare with timestamps ([...]) stripped — should show no difference
diff <(sed 's/\[[0-9_]*\]//' my.log) \
     <(sed 's/\[[0-9_]*\]//' 19920104_091532.log)`, lang: "bash" },
    ],
  },

  "pipex": {
    principle: [
      { h: "What's the problem" },
      { p: "Make `./pipex infile cmd1 cmd2 outfile` equivalent to the shell: `< infile cmd1 | cmd2 > outfile`" },
      { h: "The core system calls" },
      { table: { head: ["call", "role"], rows: [
        ["fork()", "make a child process (returns 0 in the child, the pid in the parent)"],
        ["pipe(fd)", "make a tube: fd[0]=read, fd[1]=write"],
        ["dup2(a,b)", "make fd b point to the same place as a (redirect stdin/stdout)"],
        ["execve(p,av,env)", "replace the current process with a new program (doesn't return on success)"],
        ["waitpid", "the parent waits for the child + collects its exit status"],
      ]}},
      { note: "Overview: cmd1 reads infile and writes into the pipe -> cmd2 reads the pipe and writes outfile; each cmd is its own process" },
      { h: "Background: what of the shell does pipex emulate" },
      { p: "When you type `< infile cmd1 | cmd2 > outfile` in a shell, it does several invisible things behind the scenes: open the files, make a separate process for each command, connect one's output to the other's input, then wait for them to finish. **pipex is doing all of this yourself with system calls** to understand what '|' really is." },
      { h: "Why these 4 system calls (the reason for each)" },
      { ul: [
        "**fork** — each command must be its own program running concurrently, so you need multiple processes; fork is the only way to make a new process in Unix",
        "**execve** — a forked process is still 'pipex'; you must turn it into a real `ls`/`wc`; execve 'overlays' another program onto the current process",
        "**pipe** — two commands in different processes can't share variables, so they pass data through a kernel 'tube'; pipe gives a buffer written at one end, read at the other",
        "**dup2** — a cmd doesn't know our pipe, only stdin(0)/stdout(1); dup2 'points' the cmd's stdin/stdout to the file/tube we want, with the cmd changing nothing",
      ]},
      { h: "Why two children run the cmds (not the parent itself)" },
      { p: "We want the **parent to stay the controller**: close unused fds and `waitpid` for both children to collect their exit status. If the parent execve'd itself, it would 'overlay' and vanish, leaving no one to wait/clean up -> zombies or broken ordering." },
      { h: "Why 'close every fd' is the heart (not just leak prevention)" },
      { p: "A command reading stdin (like `wc`, `cat`) **waits until it gets EOF**. A pipe's EOF only happens when **every process has closed the write end**. If anyone (the parent or another child) still holds the write end open -> no EOF ever -> cmd2 hangs forever. So closing fds isn't just about cleanliness — it's the condition that lets the pipeline 'finish'." },
      { h: "Why find PATH yourself" },
      { p: "execve needs the **full path** (like `/bin/ls`), not just `ls`. Normally the shell finds it by scanning every folder in `$PATH`; emulating the shell, you must do this step yourself — split PATH by ':' and try `dir/cmd` until you find an executable file." },
    ],
    theory: [
      { p: "pipex is a lesson in **practical operating systems** — the theory behind it is about Unix processes, memory and I/O." },
      { h: "1) Process vs Program" },
      { p: "A **program** is a static file on disk. A **process** is a program that's 'running' — with its own memory, fds, state, and **PID (Process ID)**. One program can run as many processes at once." },
      { h: "2) fork() & Copy-on-Write" },
      { p: "`fork()` makes a child process that's **almost a complete copy of the parent** (memory, fds). It returns twice: in the parent it returns the child's PID, in the child it returns 0 — we use this to tell which process we're in." },
      { note: "Copy-on-Write: the kernel doesn't actually copy memory immediately, it lets parent/child share pages first, copying 'for real' only when one writes — making fork fast and cheap." },
      { h: "3) Virtual memory & Address space" },
      { p: "Each process sees its own 'private memory' (virtual address space) as if it had the whole machine; the kernel + MMU translate it to real addresses. This is why 2 processes can't share variables directly -> they need a pipe to communicate." },
      { h: "4) Everything is a file & the File Descriptor table" },
      { p: "Unix philosophy: real files, pipes, sockets, terminals — everything is seen as a 'file', read/written with read()/write() alike. Each process has an **fd table**, an array where the index (the fd number) points to 'something open'." },
      { table: { head: ["fd", "name", "usually points to"], rows: [
        ["0", "stdin", "keyboard"], ["1", "stdout", "screen"], ["2", "stderr", "screen (error)"],
      ]}},
      { h: "5) Pipe & IPC (communicating between processes)" },
      { p: "**IPC = Inter-Process Communication.** A pipe is a buffer in kernel memory with 2 ends: write one, read the other (one-way). Data flows FIFO." },
      { ul: [
        "**Buffering:** if the buffer is full the writer waits; if empty the reader waits -> natural synchronisation",
        "**EOF:** the reader gets the 'end' signal (read returns 0) only when **every copy of the write end is closed** — this is the theory behind the 'pipeline hang' bug",
      ]},
      { h: "6) exec family — replace the program image" },
      { p: "`execve()` doesn't make a new process — it **wipes the current process's memory and loads a new program over it** (new code/data/stack) keeping the same PID. On success it 'doesn't return', so the next line of code is always an error path. The standard pattern is fork first, then have the child exec." },
      { h: "7) Process synchronization: wait / exit status / zombie" },
      { ul: [
        "**exit status:** a finished process sends a status number (0 = success) to the parent",
        "**wait/waitpid:** the parent 'reaps' the child and reads its status — if you don't wait, a dead child lingers as a **zombie** (taking a slot in the process table)",
        "**orphan:** if the parent dies first, the child is adopted by init (PID 1)",
      ]},
      { h: "8) Environment variables & PATH" },
      { p: "`envp` is the set of environment variables (KEY=VALUE) a process inherits from its parent. `PATH` holds a ':'-separated list of folders the system searches for commands — the theory behind why typing `ls` finds `/bin/ls`." },

      { h: "🔬 Deep Dive A: fork returns twice + the process tree" },
      { p: "`fork()` is called **once** but 'returns twice' — once in the parent, once in the child (because by the time it returns there are 2 processes). The returned value differs so you can tell them apart." },
      { code: String.raw`pid_t pid = fork();
// -- from this line down, 2 processes run the same code --
if (pid == 0) {
    // this runs in the "child"  (fork returns 0 to the child)
} else if (pid > 0) {
    // this runs in the "parent"  (fork returns the child's PID = positive)
} else {
    // pid < 0 -> fork failed (e.g. the system is out of processes)
}`, cap: "the child gets 0 (it has no child of its own), the parent keeps the child's PID to wait on later", lang: "c" },
      { code: String.raw`pipex builds this tree:

         pipex (parent)
          /          \
   child1(cmd1)   child2(cmd2)
   exec ls         exec wc

parent doesn't exec -> stays the "controller", waits for both children`, cap: "if the parent exec'd itself it would vanish, leaving no one to wait -> can't clean up", lang: "txt" },

      { h: "🔬 Deep Dive B: how the fd table changes during dup2 (a real trace)" },
      { p: "dup2(old, new) = 'make slot new in the fd table point to the same place as old' (closing new first if it's open). Trace it in child1 where infile=fd3, pipe write=fd5:" },
      { code: String.raw`child1 start:
  fd0 -> terminal(stdin)
  fd1 -> terminal(stdout)
  fd2 -> terminal(stderr)
  fd3 -> infile
  fd4 -> pipe[read]
  fd5 -> pipe[write]

dup2(3, 0):  fd0 -> infile        (stdin now comes from the file)
dup2(5, 1):  fd1 -> pipe[write]   (stdout now goes into the pipe)
close(3); close(4); close(5):    close the unused copies

after this, exec(ls): ls writes stdout(fd1) = into the pipe, unknowingly`, cap: "exec keeps the fd table (doesn't reset it) -> the cmd inherits this redirection", lang: "txt" },

      { h: "🔬 Deep Dive C: why a pipeline hangs — pipe reference counting" },
      { p: "The kernel counts how many fds still have the pipe's 'write end' open (a write-end reference count). The reader gets EOF **only when that count = 0**." },
      { code: String.raw`the hang scenario (parent forgets to close the write end):

  after fork: the write end is open in  parent, child1, child2 = 3 copies
  child1 close + exec ls (ls finishes -> closes)   -> 2 left
  child2 closes its own write end                  -> 1 left
  * parent "forgets" close(pfd[1])                 -> still 1 left!

  -> write-end count != 0 -> the pipe never produces EOF
  -> wc (in child2) reads stdin forever waiting for EOF -> hang`, cap: "the fix: the parent must close both pipe ends right after all forks", lang: "txt" },
      { note: "This is the theory behind the rule 'close every fd' — not just to prevent leaks, but as the condition for the pipeline to actually finish." },

      { h: "🔬 Deep Dive D: exec replaces the process's memory" },
      { p: "A process has memory divided into segments. `execve` discards all of it and loads a new program:" },
      { code: String.raw`a process's memory (high -> low addresses):
  +---------------+ high
  |   stack       | <- local vars, call frames (grows down)
  |      v        |
  |      ^        |
  |   heap        | <- malloc (grows up)
  +---------------+
  |   bss/data    | <- global/static
  |   text (code) | <- program code
  +---------------+ low

execve(ls): everything above is "wiped" and replaced by ls's
  -> anything malloc'd before exec is gone with the old image (not a leak)
  -> same PID but a brand-new "identity"`, cap: "if execve succeeds it doesn't return; the next line is always an error path", lang: "txt" },
      { h: "📖 Further reading" },
      { links: [
        { label: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", note: "the legendary guide to pipe/fork/IPC, fun and clear" },
        { label: "man7 — fork(2)", url: "https://man7.org/linux/man-pages/man2/fork.2.html", note: "official fork docs (return value, COW)" },
        { label: "man7 — pipe(2)", url: "https://man7.org/linux/man-pages/man2/pipe.2.html", note: "pipe + the EOF/block conditions" },
        { label: "man7 — dup2(2)", url: "https://man7.org/linux/man-pages/man2/dup.2.html", note: "fd redirection in detail" },
        { label: "man7 — execve(2)", url: "https://man7.org/linux/man-pages/man2/execve.2.html", note: "replacing the program image" },
        { label: "Everything is a file — Wikipedia", url: "https://en.wikipedia.org/wiki/Everything_is_a_file", note: "the Unix fd philosophy" },
      ]},
    ],
    foundations: [
      { h: "0) Groundwork: what is char ** (argv, envp, the result of ft_split)" },
      { p: "`char *` = a pointer to a string (really the address of the first char). **`char **` = a pointer to an array of strings** = 'a list of several strings' — argv, envp, and ft_split's result are all `char **`." },
      { code: String.raw`argv -> [ "./pipex" ][ "infile" ][ "ls -l" ][ "wc -l" ][ "outfile" ][ NULL ]
          argv[0]     argv[1]    argv[2]   argv[3]    argv[4]
each box = char*  (the address of a string) ; terminated by NULL`, cap: "argv is an array of char* ; the last is NULL to mark the end" },
      { p: "`envp` is the same, but each string looks like `\"PATH=/usr/bin:/bin\"`, `\"HOME=/root\"`, so we scan for the one starting with `\"PATH=\"`." },
      { h: "1) pipex has no big struct — it uses int arrays" },
      { p: "pipex manages resources with two small arrays, no struct needed:" },
      { code: String.raw`int pfd[2];   // pipe: pfd[0] = read end, pfd[1] = write end
int fio[2];   // files: fio[0] = infile fd, fio[1] = outfile fd`, cap: "pipe(pfd) fills these 2 slots itself — pass pfd (the address of the first slot)", lang: "c" },
      { h: "2) Groundwork: a file descriptor (fd) is a 'ticket number'" },
      { p: "Every file/pipe you open, the OS returns an **integer (fd)** as a 'ticket' to refer to it. There are 3 special ones open from the start:" },
      { table: { head: ["fd", "name", "usually points to"], rows: [
        ["0", "STDIN", "keyboard"],
        ["1", "STDOUT", "screen"],
        ["2", "STDERR", "screen (error)"],
      ]}},
      { p: "`open()` returns a new fd (e.g. 3,4,...). **An fd is a resource like memory** — open it and you must `close()` it, or it 'leaks' (fd leak); open too many and you can't open more." },
      { h: "3) dup2 = 'change a ticket's destination'" },
      { code: String.raw`dup2(infile, STDIN_FILENO);   // make fd 0 (stdin) point to the same as infile
dup2(pfd[1], STDOUT_FILENO);  // make fd 1 (stdout) point to the pipe's write end`, cap: "after this, when the cmd reads stdin = reads infile, writes stdout = writes into the pipe, unknowingly", lang: "c" },
      { note: "after dup2 you must close the original fd (infile, pfd[...]) because fd 0/1 now point to the same place; leftover fds = a leak and keep the pipe open -> the cmd hangs waiting for EOF" },
      { h: "4) Memory: ft_split allocates char ** -> needs free_tab" },
      { p: "`ft_split` mallocs both the array and every string inside -> you must free them all" },
      { code: String.raw`void free_tab(char **tab) {
    int i = 0;
    if (!tab) return ;
    while (tab[i])          // free every string first
        free(tab[i++]);
    free(tab);              // then free the array itself
}`, cap: "order matters: free the inner strings first, then the array (swap them = leak / lost pointer)", lang: "c" },
      { code: String.raw`tmp  = ft_strjoin(dir, "/");   // temporary allocation
full = ft_strjoin(tmp, cmd);
free(tmp);                     // free tmp the moment it's unused`, cap: "try_path: temporary strings must be freed right after use, or you leak a bit each loop", lang: "c" },
      { h: "5) The child process's memory" },
      { p: "After `fork` the child gets a copy of the parent's memory. Once `execve` succeeds the old memory is **entirely replaced** (anything malloc'd before execve is gone with the old image, so not a leak). But if execve fails, you free + exit yourself in the child." },
    ],
    architecture: [
      { code: String.raw`main.c        check argc==5 -> pipex(argv, envp)
pipex.c       open_files -> pipe -> fork_children (child1, child2)
path.c        get_path(): find cmd in PATH ; exec_cmd(): split+execve
utils.c       free_tab / error_exit
main_bonus.c  support here_doc + multiple pipes (flexible argc)
pipex_bonus.c here_doc() + run_cmds() rolling-pipe`, cap: "file map" },
      { h: "data flow" },
      { code: String.raw`infile --(dup2 stdin)--> [child1: cmd1] --(stdout->pipe[1])
                                                    |
                              pipe[0]->stdin         v
outfile <--(dup2 stdout)-- [child2: cmd2] <--------- pipe`, cap: "the tube connects 2 processes" },
    ],
    dataflow: [
      { p: "Trace **every function** of pipex — what fd/string it gets from whom, and passes to whom — focusing on the flow of file descriptors" },
      { h: "Call flow overview" },
      { code: String.raw`main(argc, argv, envp)
 |- argc != 5 ? -> usage -> exit(1)
 \- pipex(argv, envp)
      |- open_files(argv[1], argv[4], fio) -> open() x2 -> fio[0]=infile, fio[1]=outfile
      |- pipe(pfd) -> pfd[0]=read, pfd[1]=write
      \- fork_children(pfd, fio, argv, envp)
            |- fork -> child1(pfd, fio[0], argv[2], envp)
            |            \> dup2(stdin<-infile, stdout<-pfd[1]) > close > exec_cmd(argv[2])
            |- fork -> child2(pfd, fio[1], argv[3], envp)
            |            \> dup2(stdin<-pfd[0], stdout<-outfile) > close > exec_cmd(argv[3])
            \- parent: close(pfd,fio) -> waitpid x2

exec_cmd(cmd, envp) -> ft_split(cmd,' ') -> get_path(args[0],envp)
                                              \> get_env_path / ft_split(':') / search_dirs -> try_path
                                         -> execve(path, args, envp)`, cap: "arrows = call/pass; fds flow from open/pipe -> fork_children -> child -> dup2", lang: "txt" },
      { note: "the main flow is the **fd (an integer)**: open/pipe make fds -> passed via the fio[]/pfd[] arrays into fork_children -> handed to a child -> the child dup2's them as stdin/stdout before exec" },

      { h: "🔗 Trace the life of 'cmd1' (argv[2] -> the program that runs)" },
      { code: String.raw`argv[2] = "ls -l"
  \> child1 receives it as cmd
  \> exec_cmd("ls -l")
       \> ft_split -> args = ["ls", "-l", NULL]
       \> get_path("ls", envp)
            \> get_env_path -> "/usr/bin:/bin"
            \> ft_split(':') -> ["/usr/bin","/bin"]
            \> search_dirs -> try_path("/bin","ls") -> access("/bin/ls",X_OK)=OK
            \> returns "/bin/ls"
       \> execve("/bin/ls", ["ls","-l",NULL], envp)
            -> the process becomes ls, reads stdin(=infile) writes stdout(=pipe)`, cap: "a string travels argv -> split -> path resolution -> execve", lang: "txt" },

      { h: "main.c / pipex.c — the main structure" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns/passes · to whom"], rows: [
        ["usage (static)", "print usage when argc is wrong", "— · from main", "write stderr"],
        ["main", "check argc=5 then start", "argc,argv,envp · from OS", "calls pipex"],
        ["open_files (static)", "open infile/outfile into the array", "filenames,fio[] · from pipex", "fills fio[0],fio[1]"],
        ["child1 (static)", "the process running cmd1 (stdin=infile)", "pfd,infile,cmd,envp · from fork_children", "dup2+close -> exec_cmd"],
        ["child2 (static)", "the process running cmd2 (stdout=outfile)", "pfd,outfile,cmd,envp · from fork_children", "dup2+close -> exec_cmd"],
        ["fork_children (static)", "fork 2 children + parent closes fds + waits", "pfd,fio,argv,envp · from pipex", "fork->child1/child2; waitpid"],
        ["pipex", "the main sequence: open files->pipe->fork", "argv,envp · from main", "calls the 3 above"],
      ]}},
      { h: "path.c — find/run the command" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns · to whom"], rows: [
        ["get_env_path (static)", "extract PATH from envp", "envp · from get_path", "points past \"PATH=\" -> get_path"],
        ["try_path (static)", "join dir+'/'+cmd and check executable", "dir,cmd · from search_dirs", "full path or NULL"],
        ["search_dirs (static)", "loop every dir calling try_path", "dirs[],cmd · from get_path", "full path or NULL"],
        ["get_path(cmd,envp)", "find cmd's full path (or use it directly if it has '/')", "cmd,envp · from exec_cmd", "full path -> exec_cmd"],
        ["exec_cmd(cmd,envp)", "split cmd -> find path -> execve", "cmd,envp · from child1/2/run_child", "execve (no return) / exit"],
      ]}},
      { h: "utils.c / bonus" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Result"], rows: [
        ["free_tab(tab)", "fully free a char** from ft_split", "char** · from exec_cmd/path", "free every string + the array"],
        ["error_exit(msg)", "print error + exit on fatal", "message · from any error path", "perror/exit(1)"],
        ["here_doc (static)", "[bonus] read stdin until LIMITER into a pipe", "limiter · from pipex_bonus", "pipe read fd -> used as infile"],
        ["open_out_bonus (static)", "[bonus] open outfile (append/trunc)", "file,append · from pipex_bonus", "fd -> fds[1]"],
        ["run_child (static)", "[bonus] fork+dup2+exec one cmd", "in,out,cmd,envp · from run_cmds", "returns pid"],
        ["run_cmds (static)", "[bonus] rolling pipe across N cmds", "cmds,n,envp,fds · from pipex_bonus", "run_child loop + waitpid"],
        ["pipex_bonus", "[bonus] drive here_doc + multiple pipes", "argc,argv,envp · from main_bonus", "calls run_cmds"],
      ]}},
    ],
    implementation: [
      { h: "1) Open the files (pipex.c)" },
      { code: String.raw`fd_io[0] = open(file_in, O_RDONLY);
if (fd_io[0] < 0)
    perror(file_in);          // infile missing -> don't exit (cmd2 still runs, creates outfile)
fd_io[1] = open(file_out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
if (fd_io[1] < 0)
    error_exit(file_out);     // outfile can't open = fatal`, cap: "mimic the shell: a missing infile isn't fatal, but outfile matters", lang: "c" },
      { h: "2) The child redirects stdin/stdout (pipex.c)" },
      { code: String.raw`// child1 (cmd1): read infile -> write into the pipe
dup2(infile, STDIN_FILENO);
dup2(pfd[1], STDOUT_FILENO);
close(pfd[0]); close(pfd[1]); close(infile);
exec_cmd(cmd, envp);
// child2 (cmd2): read from the pipe -> write outfile
dup2(pfd[0], STDIN_FILENO);
dup2(outfile, STDOUT_FILENO);`, cap: "after dup2 close all the original fds, or the pipe stays open -> cmd2 hangs on EOF", lang: "c" },
      { h: "3) Parent closes fds then waits (pipex.c)" },
      { code: String.raw`close(pfd[0]); close(pfd[1]);   // the parent never uses the pipe, must close it!
if (fio[0] >= 0) close(fio[0]);
close(fio[1]);
waitpid(pid1, NULL, 0);
waitpid(pid2, NULL, 0);`, cap: "if the parent doesn't close the pipe's write end -> cmd2 never gets EOF and hangs", lang: "c" },
      { h: "4) Find the command's path (path.c)" },
      { code: String.raw`if (ft_strchr(cmd, '/'))                 // has / -> absolute/relative
    return (access(cmd, X_OK) == 0 ? ft_strdup(cmd) : NULL);
path_env = get_env_path(envp);           // find "PATH=" in envp
dirs = ft_split(path_env, ':');          // split each dir
return (search_dirs(dirs, cmd));          // try dir/cmd + access(X_OK)`, cap: "if not found -> \"command not found\" -> exit(127)", lang: "c" },
      { h: "5) Bonus: here_doc + multiple pipes (pipex_bonus.c)" },
      { code: String.raw`// rolling pipe: prev_fd becomes the next cmd's stdin
prev = fds[0];                       // start from infile (or here_doc)
while (i < n - 1) {
    pipe(pfd);
    run_child(prev, pfd[1], cmds[i], envp);
    close(pfd[1]);
    if (prev != fds[0]) close(prev);
    prev = pfd[0];                   // this pipe becomes the next cmd's input
    i++;
}
run_child(prev, fds[1], cmds[n-1], envp);  // last cmd -> outfile`, cap: "extends from 2 to N commands by rolling the pipe forward", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**Close every fd** after dup2 — a forgotten fd is the #1 cause of a hanging pipeline (a cmd waiting for an EOF that never comes)",
        "**Missing infile != fatal** — use perror, don't exit, like the shell (outfile is still created)",
        "**execve doesn't return on success** — code after execve is always an error path (exit 1)",
        "**command not found -> exit(127)** per the shell standard",
        "**rolling pipe** for the bonus: keep prev_fd and pass it forward -> handle N commands in one loop",
        "**here_doc** writes stdin into a pipe until LIMITER -> use the read end as the first cmd's stdin, open outfile with O_APPEND",
        "**free_tab every ft_split** — split returns an array of strings, free every one + the array",
      ]},
    ],
    eval: [
      { qa: [
        { q: "How does fork work?", a: "It makes a copy of the process; in the child fork returns 0, in the parent it returns the child's pid; we use this to tell which part runs in the child/parent." },
        { q: "What does dup2 do, why use it?", a: "It makes a destination fd (like STDIN/STDOUT) point to the file/pipe we want, so the exec'd cmd reads/writes from the right place unknowingly." },
        { q: "Why does a pipeline hang?", a: "Because a process still holds the pipe's write end open (e.g. the parent or another child didn't close it), so the reading cmd never gets EOF; you must close every unused fd." },
        { q: "How do you find a cmd's path without PATH?", a: "Split PATH by ':' and try dir/cmd + access(X_OK); if cmd has '/', use it directly; if PATH or cmd isn't found -> command not found, exit 127." },
        { q: "Why pass envp to execve?", a: "So the child program has the same environment (including PATH); some commands need env." },
        { q: "What should happen if infile doesn't exist?", a: "Like the shell: cmd1 doesn't run / prints an error, but cmd2 still runs and outfile is created (the perror code doesn't exit, child1 exit(1) if fd<0)." },
        { q: "How does here_doc work? (bonus)", a: "Read stdin line by line, write into a pipe until a line matches LIMITER, then use the pipe's read end as the first cmd's stdin; outfile opened in append mode." },
        { q: "What is a zombie process, how to prevent it?", a: "A child that finished but the parent hasn't waited on; we call waitpid on every child (bonus uses while waitpid(-1)) so there are no zombies." },
      ]},
      { h: "Test against the shell" },
      { code: String.raw`./pipex infile "grep a" "wc -l" outfile
< infile grep a | wc -l > expected      # results must match
diff outfile expected
valgrind --leak-check=full ./pipex infile "ls" "cat" outfile`, lang: "bash" },
    ],
  },

  "so_long": {
    principle: [
      { h: "What's the problem" },
      { p: "A 2D game: the player walks around collecting all collectibles then reaches the exit. Read the map from a `.ber` file (`0`=floor, `1`=wall, `C`=collectible, `E`=exit, `P`=player)." },
      { h: "What must be validated before playing" },
      { ul: [
        "the file must end in .ber and be readable",
        "the map is rectangular (every row the same width)",
        "surrounded by walls 1 on every side",
        "exactly 1 P, exactly 1 E, at least 1 C",
        "there's a path from P to every C and the E (checked with flood fill)",
      ]},
      { note: "MiniLibX = a simple library to draw a window/images/handle events (mlx_init, mlx_new_window, mlx_put_image_to_window, mlx_hook, mlx_loop)" },
      { h: "Background: why so_long stresses 'map checking' more than the game" },
      { p: "The game itself (walk/collect/exit) isn't hard to write. What the subject stresses, and evaluators love to try, is **robustness against broken input** — wrong file extension, non-rectangular map, unclosed walls, no exit, dead ends. The program must not crash and must print a clean Error. So the heart is **strict parsing + validation**." },
      { h: "Why flood fill to check the path (vs alternatives)" },
      { table: { head: ["Way to check reachability", "pros/cons"], rows: [
        ["Flood fill (4-direction recursion)", "very short ~5 lines, easy to grasp; fine for school-sized maps (recursion depth stays bounded)"],
        ["BFS/DFS with your own queue/stack", "memory-controllable but longer code, you manage the queue yourself"],
        ["A formula check", "impossible — 'reachability' must explore the real graph"],
      ]}},
      { p: "**Why flood fill:** it's DFS written as the shortest recursion, matching the project's map scale (not so big it stack-overflows). The idea is to 'flood' the area reachable from the player, and if any C/E is left un-flooded = unreachable = invalid map." },
      { note: "Why on a 'copy': flood fill overwrites cells with 'V' to avoid revisiting — doing it on the real map would wreck it for playing, so copy it to check, then discard." },
      { h: "Why store the map as char ** (an array of strings)" },
      { p: "A `.ber` file is already multi-line text — split with `ft_split('\\n')` gives a `char**` where `grid[y][x]` is exactly cell (x,y), a 1:1 mapping from file to structure so checking/drawing/walking all use the same coordinates." },
      { h: "Why a camera (not draw the whole map)" },
      { p: "If the map is bigger than the window, drawing every cell overflows the screen and wastes work. The camera idea is to 'draw only the visible part', shifting the frame with the player — the same principle as any 2D game (viewport/scrolling)." },
    ],
    theory: [
      { p: "so_long combines **graph + graphics + game** theory." },
      { h: "1) Graph theory & connectivity" },
      { p: "A graph = a set of **nodes** connected by **edges**. A game map is a kind of graph: each walkable cell = a node, adjacent cells (up/down/left/right) = edges. The question 'can you walk from P to C/E' = a **connectivity** problem in a graph." },
      { h: "2) Graph traversal: DFS / BFS / Flood fill" },
      { ul: [
        "**DFS (Depth-First):** go as deep as possible then backtrack — easiest written with recursion",
        "**BFS (Breadth-First):** spread out layer by layer — uses a queue, good for shortest paths",
        "**Flood fill** = DFS/BFS that 'paints' every connected cell (like the paint bucket in Paint) — so_long uses it to check that flooding from P reaches all C/E",
      ]},
      { h: "3) Recursion & the call stack" },
      { p: "Recursion = a function calling itself, with a **base case** to stop. Each call pushes a 'frame' (local vars + return point) onto the **call stack**. flood_fill calls itself in 4 directions — it must have a base case (hit a wall / already visited), or it never ends -> **stack overflow**." },
      { note: "This is why flood fill suits school-sized maps, but a very large map needs BFS with a queue so the call stack doesn't overflow." },
      { h: "4) 2D array / matrix" },
      { p: "The map is stored as a 2D table accessed with `grid[y][x]` (y = row, x = column). In memory it's an array of pointers each pointing to an array of chars (one row)." },
      { h: "5) Coordinate systems" },
      { p: "Separate 2 systems: **grid coords** (x,y as cells) and **screen coords** (pixels). The conversion: `pixel = (cell - camera) * tile size`. Note the screen's y axis points **down** (not up like in maths) — a fundamental of computer graphics." },
      { h: "6) Game loop & Event-driven programming" },
      { p: "Normal programs run top to bottom then end, but games/GUIs are **event-driven**: enter an endless loop (`mlx_loop`) and 'wait for events' (keypress/window close) to fire callbacks you bound (hooks). This is the basic architecture of every interactive program." },
      { h: "7) Finite State Machine (FSM)" },
      { p: "A game has clear 'states' (playing / won / closed) and changes state on events. The FSM idea = a system that's in one state at a time with rules for transitions — useful for keeping game logic clear (and the same idea as LangGraph/pipelines in bigger systems)." },
      { h: "8) Raster graphics: framebuffer, tile, sprite, double buffering" },
      { ul: [
        "**Raster/bitmap:** an image is a grid of pixels, each with a color",
        "**Tile:** small repeated images (wall/floor) tiled into a scene — cheap and a 2D-game standard",
        "**Sprite:** a movable object's image (player/coin) drawn over the scene",
        "**Double buffering:** draw into an in-memory image fully first, then push it to screen once -> reduces flicker (the reason to draw into an image then put it once)",
      ]},

      { h: "🔬 Deep Dive A: DFS/BFS complexity + step-by-step flood fill" },
      { p: "A graph traversal visits every node once and every edge a bounded number of times -> complexity **O(V + E)**. For a w×h grid map: V = w·h cells, each cell has ≤ 4 neighbours -> E ≈ 4V -> still O(V) = O(w·h) (linear in the number of cells)." },
      { code: String.raw`flood_fill from P on a small grid (1=wall):
  1 1 1 1            1 1 1 1
  1 P 0 1     ->     1 V V 1     (V = flooded)
  1 0 C 1            1 V V 1
  1 1 1 1            1 1 1 1

call order (DFS): fill(1,1)=P
  -> mark V -> try right(2,1)=0 -> mark V
      -> try right(3,1)=1 stop ; down(2,2)=C? ...keep going
  -> ... until every connected cell is marked V

check: any C/E left that isn't V? none -> all reachable /`, cap: "flood fill = DFS leaving a 'V' trail to avoid revisiting (the base case that makes the recursion stop)", lang: "txt" },

      { h: "🔬 Deep Dive B: recursion, the call stack, and stack overflow" },
      { p: "Every nested flood_fill call pushes a frame onto the call stack. The maximum depth = the length of the longest path through open space." },
      { code: String.raw`the call stack when filling deep:
  fill(1,1)
   \ fill(2,1)
      \ fill(3,1)
         \ fill(4,1) ...     <- each level uses stack memory

if the open area is huge (e.g. 5000x5000 straight line)
the recursion depth may exceed the stack size (usually ~8 MB)
-> stack overflow -> segfault

-> for very large maps, switch to BFS with a queue (a loop, no recursion)
  but the project's map size is small enough -> recursion is safe and shorter`, cap: "trade-off: recursion is short/readable but bounded by stack size", lang: "txt" },

      { h: "🔬 Deep Dive C: deriving the camera formula (screen ↔ map coords)" },
      { p: "We want the player always centred, so we move the camera with the player, then clamp so we don't show outside the map:" },
      { code: String.raw`want the player centred:
  cam = player - (number of tiles in half a screen)
  cam_x = px - (WIN_W / TILE) / 2

clamp so the camera doesn't pass the edge:
  if cam < 0            -> cam = 0           (flush left/top)
  if cam > map - screen -> cam = map - screen  (flush right/bottom)

convert a cell (x,y) to a screen pixel:
  screen_x = (x - cam_x) * TILE
  screen_y = (y - cam_y) * TILE   (screen y points down!)`, cap: "it's a 'shift of frame of reference' — the same principle as a camera in any game", lang: "txt" },

      { h: "🔬 Deep Dive D: a formal Finite State Machine" },
      { p: "An FSM is defined by 5 parts (Q, Σ, δ, q₀, F). For so_long:" },
      { code: String.raw`Q  (states)    = { playing, won, closed }
S  (input)     = { press a direction, reach E with all coins, ESC/close window }
q0 (start)     = playing
F  (end states)= { won, closed }
d  (transition):
   playing --reach E with all coins--> won --> exit
   playing --ESC/close-------------> closed --> exit
   playing --press a direction (no wall)--> playing (update position)`, cap: "thinking in FSM makes the logic clear and complete — the same idea as state machines in big systems (e.g. LangGraph)", lang: "txt" },
      { h: "📖 Further reading" },
      { links: [
        { label: "Graph theory — Wikipedia", url: "https://en.wikipedia.org/wiki/Graph_theory", note: "graph basics + connectivity" },
        { label: "Flood fill — Wikipedia", url: "https://en.wikipedia.org/wiki/Flood_fill", note: "the area-fill algorithm + recursive/queue versions" },
        { label: "VisuAlgo — DFS/BFS (animated)", url: "https://visualgo.net/en/dfsbfs", note: "watch graph traversal step by step" },
        { label: "MiniLibX docs (Harm Smits 42docs)", url: "https://harm-smits.github.io/42docs/libs/minilibx", note: "the most detailed mlx guide for 42 students" },
        { label: "Game Programming Patterns — Game Loop", url: "https://gameprogrammingpatterns.com/game-loop.html", note: "the theory of a game/GUI event loop" },
        { label: "Game Programming Patterns — State (FSM)", url: "https://gameprogrammingpatterns.com/state.html", note: "Finite State Machines explained for game devs" },
      ]},
    ],
    foundations: [
      { h: "0) Groundwork: why keep everything in one struct" },
      { p: "A game has a lot of 'state' (window, images, map, player position, move count...). Keeping them as separate variables makes passing them around painful, so we put them in **one struct `t_game`** and pass 'its address' (`&game`) to every function." },
      { h: "1) The struct is built in layers (nested structs)" },
      { code: String.raw`typedef struct s_map {
    char  **grid;        // map = array of strings (each string = 1 row)
    int   width, height; // size (in tiles)
    int   collectibles, exits, players;  // counted at parse time
}   t_map;

typedef struct s_game {
    void  *mlx;          // the mlx handle (opaque pointer)
    void  *win;          // window
    void  *img[5];       // 5 images (wall/floor/player/coin/exit)
    t_map map;           // a struct nested in a struct
    int   px, py;        // player position
    int   collected, moves;
    int   cam_x, cam_y;  // camera corner
}   t_game;`, cap: "t_map sits 'inside' t_game (not a pointer) -> access via game.map.width", lang: "c" },
      { note: "`void *` = an untyped pointer. mlx returns void* for us to store and hand back to mlx without knowing its internals (an opaque pointer)." },
      { h: "2) char **grid = the 2D map" },
      { code: String.raw`grid -> [ "111111" ]   <- grid[0]  (top row)
        [ "10C0E1" ]   <- grid[1]
        [ "111111" ]   <- grid[2]
        [  NULL    ]
grid[y][x] = the char at cell (x,y)   e.g. grid[1][2] = 'C'`, cap: "an array of strings; grid[y] = a row, grid[y][x] = one char" },
      { h: "3) Make the struct clean with ft_bzero" },
      { code: String.raw`t_game game;
ft_bzero(&game, sizeof(t_game));   // zero every byte before use`, cap: "trick: zero the whole struct first -> every pointer is NULL, counters 0 -> safe to free even if an error happens early", lang: "c" },
      { p: "Without it, the struct's values are garbage — accidentally freeing a garbage pointer = crash." },
      { h: "4) Why pass &game (a pointer), not game" },
      { p: "Passing `game` plainly makes C **copy the whole struct** (slow + changes don't stick to the real one). Passing `&game` (the address) -> every function edits the same real one, e.g. `try_move` bumps `game->moves` and the whole game sees the new value." },
      { code: String.raw`void try_move(t_game *game, int dx, int dy) {
    game->px = nx;        // game-> because game is a pointer
    game->moves++;        // edits the real one, seen everywhere
}`, lang: "c" },
      { h: "5) Memory: what's allocated, how it's freed" },
      { ul: [
        "**grid** comes from ft_split -> free every row + the array (in free_game)",
        "**the grid copy** in validate (for flood fill) -> free right after checking, in the same function",
        "**textures (img[])** come from mlx -> free with `mlx_destroy_image`, not plain free",
        "**window/display** -> `mlx_destroy_window` / `mlx_destroy_display`",
      ]},
      { code: String.raw`copy = copy_grid(game);          // allocate a copy
flood_fill(copy, game->px, game->py);
ok = check_reachable(game, copy);
i = 0;                            // then free the copy immediately
while (i < game->map.height)
    free(copy[i++]);
free(copy);`, cap: "validate.c: the copy is allocated and freed within one function — it never escapes to leak elsewhere", lang: "c" },
      { note: "every error_exit calls free_game before exit -> even a mid-parse bad map doesn't leak (check with valgrind)" },
    ],
    architecture: [
      { code: String.raw`src/main.c      argc check -> parse -> validate -> mlx -> hooks -> loop
src/parse.c     read the .ber file -> ft_split into a grid -> count C/E/P
src/validate.c  check walls + flood fill for the path (on a copy of the grid)
src/render.c    load textures (.xpm) + draw tile by tile + camera
src/player.c    handle_key (WASD/arrows) + try_move + win condition
src/error.c     error_exit
src/free.c      free all memory
*_bonus.c       add: gravity/jump, enemies, multiple levels, animation`, cap: "file map" },
      { h: "Main struct (so_long.h)" },
      { code: String.raw`typedef struct s_game {
    void  *mlx; void *win; void *img[5];
    t_map map;
    int   px, py;          // player position (in tiles)
    int   collected, moves;
    int   cam_x, cam_y;    // camera corner (for big maps)
}   t_game;`, lang: "c" },
    ],
    dataflow: [
      { p: "Trace **every function** of so_long — what it gets from whom and passes to whom — focusing on the flow of `&game` and `grid`" },
      { h: "Call flow overview" },
      { code: String.raw`main(ac, av)
 |- ac != 2 ? -> Error
 |- ft_bzero(&game)                       <- clear the struct so pointers = NULL
 |- parse_map(&game, av[1])
 |     |- read_file -> check .ber + read > ft_strdup(buf)
 |     |- build_grid -> ft_split('\n') > game.map.grid (char**)
 |     \- count_chars -> scan_tile (every cell) > count C/E/P, store px,py
 |- validate_map(&game)
 |     |- check_walls
 |     \- copy_grid -> flood_fill(copy, px, py) -> check_reachable
 |- init_mlx(&game) -> mlx_init / mlx_new_window
 |- load_textures(&game) -> mlx_xpm_file_to_image x5
 |- render_map(&game) -> update_camera -> render_tile (every visible cell)
 |- mlx_key_hook(handle_key) ; mlx_hook(17, handle_close)
 \- mlx_loop ----------> wait for events...

[event] handle_key(key) -> try_move(dx,dy) -> handle_tile (collect/win) -> render_map`, cap: "every function takes one &game (pointer) -> they share the same game state", lang: "txt" },
      { note: "the main flow: the **grid (char**)** is born in build_grid -> scanned by count_chars -> copied for flood_fill in validate -> read by render -> edited (coin pickup) by try_move" },

      { h: "🔗 Trace the life of the map (av[1] -> the image on screen)" },
      { code: String.raw`av[1] = "map.ber"
  \> read_file: check .ber ending -> open -> read -> ft_strdup -> content
  \> build_grid: ft_split(content,'\n') -> grid = ["111","1P0",...] (char**)
  \> count_chars -> scan_tile: see 'P' -> game.px,py = coords, then set the cell to '0'
  \> validate_map: copy_grid -> flood_fill from (px,py) -> check all C/E reached
  \> render_map: read grid[y][x] -> draw a tile at (x-cam)*TILE
  \> handle_key: move px,py + if stepping on 'C' -> grid[y][x]='0', collected++`, cap: "P's coords move from the grid into px,py at parse time -> everything else uses px,py", lang: "txt" },

      { h: "main.c / parse.c — bring the map into the system" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns/passes · to whom"], rows: [
        ["main", "start: parse->validate->draw->loop", "ac,av · from OS", "calls every main function"],
        ["init_mlx (static)", "open mlx + window (clamp size)", "&game · from main", "set game.mlx, game.win"],
        ["read_file (static)", "check .ber + read the file into a string", "&game,path · from parse_map", "char* (file content) -> build_grid"],
        ["build_grid (static)", "split into a grid + check rectangular", "&game,content · from parse_map", "set game.map.grid/width/height"],
        ["scan_tile (static)", "look at one cell: count C/E/P, capture P's coords", "&game,x,y · from count_chars", "update counters + px,py"],
        ["count_chars (static)", "loop every cell + check P=1,E=1,C>=1", "&game · from parse_map", "calls scan_tile; error if wrong"],
        ["parse_map", "drive the whole parse stage", "&game,file · from main", "read_file->build_grid->count_chars"],
      ]}},
      { h: "validate.c — check it's actually playable" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns · to whom"], rows: [
        ["check_walls (static)", "check the border is all wall '1'", "&game · from validate_map", "error if not closed"],
        ["copy_grid (static)", "copy the grid (to not destroy the real one)", "&game · from validate_map", "char** copy -> flood_fill"],
        ["flood_fill (static)", "flood the reachable area from (px,py)", "copy,x,y · from validate_map", "mark 'V' (recursive, 4 directions)"],
        ["check_reachable (static)", "any C/E left un-flooded?", "&game,copy · from validate_map", "1/0"],
        ["validate_map", "drive the check + free the copy", "&game · from main", "calls the 4 above"],
      ]}},
      { h: "render.c / player.c — draw + play" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Result/passes"], rows: [
        ["load_textures", "load .xpm images into img[]", "&game · from main", "set game.img[0..4]"],
        ["update_camera (static)", "compute the camera corner per player + clamp", "&game · from render_map", "set cam_x,cam_y"],
        ["render_tile (static)", "draw one cell (floor + object over it)", "&game,x,y · from render_map", "mlx_put_image"],
        ["render_map", "draw the whole visible scene + player", "&game · from main/try_move", "update_camera + loop render_tile"],
        ["handle_key", "take a key -> choose direction/exit", "key,&game · from mlx", "calls try_move / exit"],
        ["try_move (static)", "check collision/conditions then move", "&game,dx,dy · from handle_key", "edit px,py + handle_tile + render"],
        ["handle_tile (static)", "step on C=collect, E=win", "&game,nx,ny · from try_move", "collected++ / win->exit"],
        ["handle_close", "close the window (X button)", "&game · from mlx event 17", "free_game + exit"],
      ]}},
      { h: "error.c / free.c" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Result"], rows: [
        ["error_exit", "print Error + free memory + exit", "&game,msg · from any error path", "free_game -> exit(1)"],
        ["free_game", "free grid + textures + window", "&game · from error/close", "free everything"],
      ]}},
    ],
    implementation: [
      { h: "1) Read and check the file (parse.c)" },
      { code: String.raw`if (len < 5 || ft_strncmp(file + len - 4, ".ber", 4))
    error_exit(game, "Invalid file extension (expected .ber).");
...
game->map.grid = ft_split(content, '\n');     // split into rows
game->map.width = ft_strlen(grid[0]);
// every row must be the same width -> else "not rectangular"`, lang: "c" },
      { h: "2) Scan each cell + capture P's position (parse.c)" },
      { code: String.raw`if (c == 'P') {
    game->px = x; game->py = y;
    game->map.players++;
    game->map.grid[y][x] = '0';   // turn P into floor (store position in px/py instead)
}
else if (c != '0' && c != '1' && c != 'C' && c != 'E')
    error_exit(game, "Invalid characters in map.");`, cap: "trick: turn P into 0 immediately, keeping the coords in the struct", lang: "c" },
      { h: "3) Flood fill to check the path (validate.c)" },
      { code: String.raw`static void flood_fill(char **grid, int x, int y) {
    if (grid[y][x] == '1' || grid[y][x] == 'V')
        return ;
    grid[y][x] = 'V';                  // mark as visited
    flood_fill(grid, x + 1, y);
    flood_fill(grid, x - 1, y);
    flood_fill(grid, x, y + 1);
    flood_fill(grid, x, y - 1);
}`, cap: "flood from P; if any C/E is left unmarked after -> unreachable = invalid map", lang: "c" },
      { note: "important: flood fill runs on a 'copy' of the grid (copy_grid) so it doesn't destroy the real map used for playing." },
      { h: "4) Draw with a camera (render.c)" },
      { code: String.raw`game->cam_x = game->px - WIN_W / (2 * TILE);  // camera follows the player
// clamp so the camera doesn't pass the map edge ...
sx = (x - game->cam_x) * TILE;                // screen coord = map coord - camera
mlx_put_image_to_window(mlx, win, img[IMG_FLOOR], sx, sy);
if (c == '1') ... img[IMG_WALL] ...`, cap: "draw the floor first on every cell then draw the object over it — supports maps bigger than the screen", lang: "c" },
      { h: "5) Move the player + win condition (player.c)" },
      { code: String.raw`if (tile == '1') return ;                                   // hit a wall
if (tile == 'E' && game->collected < game->map.collectibles)
    return ;                                                // not all collected, can't enter the exit
game->px = nx; game->py = ny; game->moves++;
ft_printf("Moves: %d\n", game->moves);                      // print the move count to stdout`, cap: "step on C -> collected++, reach E with all coins -> \"You win!\" + exit", lang: "c" },
      { code: String.raw`mlx_key_hook(game.win, handle_key, &game);
mlx_hook(game.win, 17, 0, handle_close, &game);  // event 17 = close window (X button)
mlx_loop(game.mlx);`, cap: "main.c: bind events then enter the loop", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**flood fill on a copy** — don't touch the real grid; check the path without destroying the map",
        "**replace P with 0 immediately** and keep the coords in px/py -> fewer special cases in render/move",
        "**camera = player coord - half a screen** then clamp to the edges -> supports maps bigger than the window",
        "**draw the floor first** always, then draw wall/coin/exit over it -> transparent .xpm works right",
        "**event 17** (DestroyNotify) for the window's X button — hook it separately from the ESC key",
        "**free everything before exit** — textures (mlx_destroy_image), window, grid",
        "**check .ber + rectangular + surrounding walls + count P/E/C** all before opening the window",
      ]},
    ],
    eval: [
      { qa: [
        { q: "How do you validate the map?", a: ".ber extension, opens/non-empty, rectangular, surrounded by walls, P=1 E=1 C>=1, and flood fill confirms P can reach every C and the E." },
        { q: "What is flood fill, why on a copy?", a: "An algorithm that fills from a start point (4-direction recursion) to find reachable area; on a copy because it marks cells as 'V', which would destroy the real map used for playing." },
        { q: "Why turn P into 0?", a: "The player's position is kept in px/py, so the cell they stand on is normal floor, simplifying the walk/draw logic." },
        { q: "What if the map is bigger than the window?", a: "Use a camera: compute cam_x/cam_y per the player then clamp to the edges, drawing only the tiles within the screen frame." },
        { q: "How do you count moves, where shown?", a: "moves++ on each successful move, then ft_printf to stdout (the subject requires displaying the move count)." },
        { q: "How do you prevent memory leaks?", a: "free_game() frees grid, textures (mlx_destroy_image), window/display on every error path and at game close; check with valgrind." },
        { q: "How do you handle the window close (X) button?", a: "mlx_hook on event 17 (DestroyNotify) calls handle_close -> free + exit(0)." },
        { q: "What if you reach the exit before collecting all?", a: "try_move checks collected < collectibles and returns — you can't enter E until everything is collected." },
      ]},
      { h: "Tests" },
      { code: String.raw`./so_long maps/valid.ber          # playable
./so_long maps/not_closed.ber     # Error (walls not closed)
./so_long maps/no_path.ber        # Error (unreachable)
valgrind --leak-check=full ./so_long maps/valid.ber`, lang: "bash" },
    ],
  },

  "fractol": {
    principle: [
      { h: "What's the problem" },
      { p: "Draw fractals (Mandelbrot, Julia, +1 more) with MiniLibX. Zoom toward the cursor with the mouse wheel, pan with the arrow keys, adjust the iteration depth with +/-." },
      { h: "The core maths: the escape-time algorithm" },
      { p: "Every pixel represents a point c in the complex plane. Iterate `z = z² + c`; if |z| grows past 2 (|z|² > 4) before reaching max_iter -> the point 'escapes' (outside the set) -> map the iteration count to a color. If it finishes without escaping -> inside the set -> black." },
      { table: { head: ["fractal", "z start", "c"], rows: [
        ["Mandelbrot", "z = 0", "c = the pixel's coordinate"],
        ["Julia", "z = the pixel's coordinate", "c = a constant (from argv)"],
      ]}},
      { note: "Mandelbrot and Julia use the same formula, differing only in 'what is the starting z and what is c'." },
      { h: "Background: why z = z² + c draws a picture" },
      { p: "The Mandelbrot set is defined as 'which points c, when you iterate `z = z² + c` (from z=0), keep z from **escaping to infinity**'. Every pixel = one point c, so for each pixel we ask 'does it escape, and how fast', and turn the answer into a color -> a fractal image." },
      { h: "Why checking |z| > 2 is enough (where the 2 comes from)" },
      { p: "There's a theorem that once |z| grows past 2, it keeps growing to infinity for sure (escape and never return). So 2 is a 'deadline' you can decide on immediately without iterating to the end — this is where the name **escape-time** comes from (count how many iterations to cross this line)." },
      { h: "Why use |z|² > 4 instead of |z| > 2 (a speed reason)" },
      { p: "`|z| = sqrt(re² + im²)` and taking a square root is **slow**. But `|z| > 2` is exactly equivalent to `|z|² > 4` (square both sides), so we compare `re² + im² > 4` instead — dropping the sqrt. This code runs **millions of times per frame** (800×800 px × dozens of iterations), so saving the sqrt matters a lot for smoothness." },
      { h: "Why write pixels into a buffer yourself (not mlx_pixel_put)" },
      { p: "`mlx_pixel_put` sends a draw command to the X server **one dot at a time** — huge overhead with millions of dots. Writing colors into your own **in-memory image buffer** then pushing the whole image once (`mlx_put_image_to_window`) is hundreds of times faster — which is why every fractal renderer does this." },
      { h: "Why Mandelbrot and Julia share the same code" },
      { p: "Both iterate the exact same `z = z² + c`, differing only in 'what's constant': Mandelbrot fixes z start=0 and varies c per pixel; Julia fixes c (one value for the whole image) and varies z start per pixel. Grasp this one point and you write both fractals with almost no extra code — so we design them to share one loop." },
    ],
    theory: [
      { p: "fract-ol is a lesson in **maths + numerical computing + graphics** — get the theory and the code reads easily." },
      { h: "1) Complex numbers" },
      { p: "A complex number is written `z = a + bi` where `i² = −1`. `a` = the real part, `b` = the imaginary part. Multiplication:" },
      { code: String.raw`z² = (a + bi)² = a² + 2abi + b²i²
   = (a² − b²) + (2ab)i
-> real part = a² − b² ,  imaginary part = 2ab`, cap: "this is the origin of z_re = z_re² − z_im² and z_im = 2·z_re·z_im in the code", lang: "txt" },
      { h: "2) The complex plane (Argand diagram)" },
      { p: "Plot a complex number as a point in a 2D plane: horizontal axis = real, vertical axis = imaginary. So **every pixel on screen = one complex number** — a fractal is a 'map' of each point's complex behaviour." },
      { p: "**Magnitude (modulus):** `|z| = √(a² + b²)` = the distance from the origin (Pythagoras)." },
      { h: "3) Dynamical systems & iterated maps" },
      { p: "A dynamical system 'feeds the result back into the formula repeatedly': z₀ → z₁ → z₂ → ... with zₙ₊₁ = zₙ² + c. We care whether the sequence **diverges to infinity** or stays **bounded**." },
      { h: "4) The Mandelbrot/Julia sets & the escape radius theorem" },
      { p: "The **Mandelbrot set** = the set of c for which the sequence (starting z=0) doesn't diverge. **Theorem:** if `|z| > 2` ever, the sequence diverges for sure (provable from |z²+c| ≥ |z|²−|c| growing out of hand once |z|>2). So 2 is the 'escape radius' you can decide on instantly." },
      { note: "escape-time = count the iterations until |z|>2; if it completes max_iter without escaping, it's 'in the set' (black). The escape count = the data you turn into a color." },
      { h: "5) Fractals & self-similarity" },
      { p: "A fractal = a shape that 'looks similar however far you zoom in', with endless detail. The Mandelbrot set's boundary has a fractal dimension — why zooming deep keeps revealing new patterns (and why you must raise max_iter as you zoom)." },
      { h: "6) Floating point (IEEE 754)" },
      { p: "A `double` stores a real number as 64-bit per IEEE 754 (sign + exponent + mantissa) with ~15–16 digits of precision. Zoom very deep and coordinates differ by less than this resolution -> the image starts 'blocking up' (the precision limit). This is why you use double not float, and why zoom has a limit." },
      { h: "7) Linear interpolation (mapping ranges)" },
      { p: "Converting a pixel (0..WIDTH) to a complex range (min_re..max_re) is **linear interpolation**:" },
      { code: String.raw`re = min_re + (x / WIDTH) * (max_re − min_re)`, cap: "the range-mapping formula — used both in render and zoom", lang: "txt" },
      { h: "8) Color theory: RGB & bit packing" },
      { p: "A screen color mixes 3 channels R, G, B (each 0–255 = 8 bits) into a 24-bit number via **bit shifting**:" },
      { code: String.raw`color = (R << 16) | (G << 8) | B`, cap: "R shifted 16 bits, G 8 bits, B last — packed into 0xRRGGBB", lang: "txt" },
      { p: "A smooth gradient comes from mapping 'the escape count' to a color with a continuous function (a polynomial in color.c) rather than stepping abruptly." },

      { h: "🔬 Deep Dive A: multiplying complex numbers — step by step + a worked example" },
      { code: String.raw`z² + c  with z = a + bi , c = e + fi :

z² = (a + bi)(a + bi)
   = a² + abi + abi + b²i²
   = a² + 2abi + b²(−1)        [since i² = −1]
   = (a² − b²) + (2ab)i

z² + c = (a² − b² + e) + (2ab + f)i
         |__ real part __|   |_ imaginary _|`, cap: "matches the code: tmp = zr*zr − zi*zi + c_re ; zi = 2*zr*zi + c_im", lang: "txt" },
      { code: String.raw`a real example: z = 0.3 + 0.5i , c = −0.7 + 0.27i
  new real = 0.3² − 0.5² + (−0.7) = 0.09 − 0.25 − 0.7 = −0.86
  new imag = 2(0.3)(0.5) + 0.27   = 0.30 + 0.27      =  0.57
  -> z₁ = −0.86 + 0.57i
  |z₁|² = 0.86² + 0.57² = 0.74 + 0.32 = 1.06  (< 4 -> not escaped, keep going)`, cap: "iterate z₁→z₂→... until |z|²>4 or max_iter is reached", lang: "txt" },

      { h: "🔬 Deep Dive B: proving the escape radius theorem (why the number 2)" },
      { p: "Claim: if |z| > 2 (and |z| ≥ |c|, true for the points we care about) the sequence diverges to infinity for sure. Proof via the triangle inequality:" },
      { code: String.raw`triangle inequality:  |z² + c| ≥ |z²| − |c| = |z|² − |c|

assume |z| > 2  and  |z| ≥ |c| :
  |z² + c| ≥ |z|² − |c| ≥ |z|² − |z|
          = |z|(|z| − 1)

since |z| > 2  ->  (|z| − 1) > 1  ->  there's a k = |z|−1 > 1
  |z_next| ≥ k·|z|   with k > 1 constant

-> every iteration multiplies |z| by something > 1 -> grows exponentially -> ∞
  so "cross 2 = escape for sure"`, cap: "the number 2 isn't arbitrary — it's the provable threshold past which there's no return", lang: "txt" },
      { code: String.raw`why compare |z|² > 4 instead of |z| > 2 :
  |z| > 2   <=>   |z|² > 2²   <=>   re² + im² > 4
  (squaring both sides is valid since both are ≥ 0)
-> drop the sqrt = much faster (runs millions of times/frame)`, lang: "txt" },

      { h: "🔬 Deep Dive C: IEEE 754 double & why deep zoom blocks up" },
      { code: String.raw`double = 64 bits:
  [ 1 sign | 11 exponent | 52 mantissa ]
  giving relative precision ~2⁻⁵² ≈ 2.2 × 10⁻¹⁶  (~15–16 decimal digits)

when you zoom: the frame width (max_re − min_re) keeps shrinking
  complex distance per pixel = width / WIDTH
  if this distance is smaller than ~2⁻⁵² × |coordinate|
  -> 2 adjacent pixels compute the "same value" (round to one)
  -> the image blocks into squares (the precision limit)

-> the reason to use double not float (float blocks up far sooner ~2⁻²³)
  and the reason zoom has a natural "ceiling"`, cap: "this numerical limit is real in every fractal renderer", lang: "txt" },

      { h: "🔬 Deep Dive D: deriving the pixel ↔ complex-plane mapping" },
      { code: String.raw`we want a linear function where:
   x = 0      -> re = min_re
   x = WIDTH  -> re = max_re

general form re = m·x + b :
   from x=0 : b = min_re
   from x=WIDTH : max_re = m·WIDTH + min_re
             -> m = (max_re − min_re) / WIDTH

-> re = min_re + (x / WIDTH) · (max_re − min_re)   * (linear interpolation)

example: frame [−2, 1], WIDTH=800, pixel x=400 (centre)
   re = −2 + (400/800)(1 −(−2)) = −2 + 0.5·3 = −0.5  / (exactly the centre)

the im axis is flipped:  im = max_im − (y/HEIGHT)(max_im − min_im)
   because screen y increases downward but the imaginary axis increases upward`, cap: "linear interpolation = map a value from one range to another proportionally, used in both render and zoom", lang: "txt" },
      { note: "connection: the zoom formula is this interpolation reversed — find the complex point under the mouse, then shrink the [min,max] range toward it by a factor." },
      { h: "📖 Further reading" },
      { links: [
        { label: "Mandelbrot set — Wikipedia", url: "https://en.wikipedia.org/wiki/Mandelbrot_set", note: "definition + properties of the set" },
        { label: "Julia set — Wikipedia", url: "https://en.wikipedia.org/wiki/Julia_set", note: "its relationship to Mandelbrot" },
        { label: "Plotting algorithms (escape time)", url: "https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set", note: "escape-time + smooth coloring in full" },
        { label: "Complex number — Wikipedia", url: "https://en.wikipedia.org/wiki/Complex_number", note: "complex numbers + multiplication/magnitude" },
        { label: "Floating-Point (Goldberg, Oracle)", url: "https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html", note: "\"What Every CS Should Know About Floating-Point\" — the classic IEEE 754 piece" },
        { label: "3Blue1Brown — Fractals (video)", url: "https://www.youtube.com/watch?v=-RdOwhmqP5s", note: "fractal dimension/self-similarity explained visually" },
      ]},
    ],
    foundations: [
      { p: "This section digs into the **struct, image buffer, and complex-plane state** fract-ol uses." },
      { h: "The main struct" },
      { code: String.raw`typedef struct s_fractol {
    void   *mlx; void *win; void *img;
    char   *addr;                 /* pointer to the image buffer */
    int    bpp, line_len, endian; /* to compute a pixel's offset */
    int    type;                  /* MANDELBROT / JULIA */
    double c_re, c_im;            /* Julia's constant c */
    double min_re, max_re, min_im, max_im;  /* the visible complex frame */
    int    max_iter;
    int    shift;                 /* color-shift (bonus) */
}   t_fractol;`, cap: "one t_fractol holds all state -> pass one pointer everywhere, no globals", lang: "c" },
      { h: "The visible frame: min/max re,im" },
      { p: "The 4 values `min_re, max_re, min_im, max_im` define which rectangle of the complex plane is on screen. Zoom/pan just change these 4 — render reads them to compute each pixel." },
      { h: "The image buffer: addr / bpp / line_len" },
      { p: "Instead of drawing pixel by pixel through mlx (slow), we get a 'pointer straight to the image's memory' (`addr`) and write colors ourselves:" },
      { code: String.raw`dst = addr + (y * line_len + x * (bpp / 8));
*(unsigned int *)dst = color;   /* write 1 pixel's color */`, cap: "compute the pixel's byte offset in the buffer then write directly — far faster than mlx_pixel_put", lang: "c" },
      { note: "Why faster: write the whole image into memory first, then mlx_put_image_to_window once — no talking to the X server per pixel." },
      { h: "Why double, not float" },
      { p: "Coordinates need high precision so deep zoom stays sharp. `double` (64-bit, ~15–16 digits) blocks up far later than `float` (~7 digits) — see Deep Dive C." },
    ],
    architecture: [
      { code: String.raw`main.c          parse_args -> init_view -> init_mlx -> render -> hooks -> loop
parse.c         pick mandelbrot/julia + read c from argv (julia)
fractal_math.c  mandelbrot_iter / julia_iter (iterate z=z²+c)
render.c        loop every pixel -> map to a complex coord -> put_pixel
color.c         get_color(): map iteration count -> color (smooth palette)
events.c        key_hook (pan/iter/ESC) + mouse_hook (zoom)
init.c, utils.c setup + helpers`, cap: "file map" },
    ],
    dataflow: [
      { p: "Trace **every function** of fract-ol — what it gets from whom and passes to whom — focusing on the flow of `&f` and the image buffer (`f->addr`)" },
      { h: "Call flow overview" },
      { code: String.raw`main(argc, argv)
 |- parse_args(argc, argv, &f)
 |     |- "mandelbrot" -> f.type = MANDELBROT
 |     |- "julia" -> parse_julia -> f.type=JULIA, f.c_re/c_im (from argv or default)
 |     \- invalid -> usage -> return 1
 |- init_view(&f)  -> set min/max re,im + max_iter + shift (starting frame)
 |- init_mlx(&f)   -> mlx_init/new_window/new_image -> f.addr, f.bpp, f.line_len
 |- render(&f)
 |     \- every pixel (x,y): map -> (re,im) -> compute_iter -> mandelbrot_iter / julia_iter
 |                                       -> get_color(iter) -> make_rgb
 |                                       -> put_pixel(f,x,y,color) write into f.addr
 |     \- mlx_put_image_to_window (push the whole image to screen)
 |- mlx_hook(2, key_hook) ; mlx_hook(17, close_hook) ; mlx_mouse_hook(mouse_hook)
 \- mlx_loop ------> wait for events...

[key]   key_hook -> move_view / adjust max_iter -> render(&f)
[mouse] mouse_hook -> zoom(x,y,factor) -> render(&f)`, cap: "every hook takes &f -> edits the view frame/depth then calls render again", lang: "txt" },
      { note: "the main flow: `&f` is all the state; every time an event edits f (frame/iter) it calls render -> render reads f.min/max to compute -> writes colors into f.addr -> pushes to screen" },

      { h: "🔗 Trace the life of one pixel (x,y -> color on screen)" },
      { code: String.raw`pixel (x, y)
  \> render: re = f.min_re + x/WIDTH*(f.max_re-f.min_re)
             im = f.max_im - y/HEIGHT*(f.max_im-f.min_im)
  \> compute_iter(f, re, im)
       \> f.type==MANDELBROT ? mandelbrot_iter(f,re,im) : julia_iter(f,re,im)
       \> iterate z=z²+c until |z|²>4 -> return the count i (e.g. 37)
  \> get_color(f, 37) -> (t=37/max_iter -> RGB polynomial) -> make_rgb -> 0xRRGGBB
  \> put_pixel(f, x, y, color)
       \> dst = f.addr + (y*f.line_len + x*(f.bpp/8))
       \> *(unsigned int*)dst = color   <- write straight into the buffer`, cap: "re/im depend on the current frame f.min/max -> zoom changes the frame -> the image changes", lang: "txt" },

      { h: "main.c / parse.c / init.c — start the system" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns/passes · to whom"], rows: [
        ["main", "the sequence: parse->init->render->hook->loop", "argc,argv · from OS", "calls everything + binds hooks"],
        ["parse_args", "pick the fractal type from argv", "argc,argv,&f · from main", "set f.type; 1/0"],
        ["parse_julia (static)", "read Julia's c (or use the default)", "argc,argv,&f · from parse_args", "set f.c_re,f.c_im"],
        ["usage", "print usage + the controls", "— · from main/parse", "ft_putstr stdout"],
        ["init_view", "set the starting complex frame + max_iter", "&f · from main", "set f.min/max_re/im, max_iter, shift"],
        ["init_mlx", "open mlx/window/image + get addr", "&f · from main", "set f.mlx,win,img,addr,bpp,line_len"],
      ]}},
      { h: "fractal_math.c / render.c — compute + draw" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns/passes"], rows: [
        ["mandelbrot_iter", "iterate z=z²+c (z start 0, c=pixel)", "f,c_re,c_im · from compute_iter", "the escape count (int)"],
        ["julia_iter", "iterate z=z²+c (z=pixel, c constant)", "f,z_re,z_im · from compute_iter", "the escape count (int)"],
        ["compute_iter (static)", "pick the formula by f.type", "f,re,im · from render", "int -> get_color"],
        ["put_pixel", "write one pixel's color into the image buffer", "f,x,y,color · from render", "write f.addr (pointer arithmetic)"],
        ["render", "loop every pixel -> map -> compute -> color it", "&f · from main/hooks", "compute_iter+get_color+put_pixel; put image"],
      ]}},
      { h: "color.c / events.c — color + interaction" },
      { table: { head: ["Function", "Why it exists", "Gets · from whom", "Returns/result"], rows: [
        ["make_rgb (static)", "combine R,G,B into one color number (bit shift)", "r,g,b · from get_color", "int 0xRRGGBB"],
        ["get_color", "map the iteration count -> a color (smooth palette)", "f,iter · from render", "int color -> put_pixel"],
        ["move_view (static)", "pan the view frame (arrows)", "f,dx,dy · from key_hook", "edit f.min/max"],
        ["key_hook", "take a key: pan/adjust iter/ESC", "keycode,f · from mlx", "move_view/edit max_iter -> render"],
        ["zoom (static)", "shrink/grow the frame around the mouse", "f,x,y,factor · from mouse_hook", "edit f.min/max"],
        ["mouse_hook", "take a scroll: zoom in/out", "button,x,y,f · from mlx", "zoom -> render"],
        ["close_hook", "close: free mlx resources + exit", "f · from mlx/ESC", "destroy image/win/display+free"],
      ]}},
    ],
    implementation: [
      { h: "1) The z = z² + c formula (fractal_math.c)" },
      { code: String.raw`while (i < f->max_iter) {
    tmp  = z_re * z_re - z_im * z_im + c_re;  // real part of z²+c
    z_im = 2.0 * z_re * z_im + c_im;          // imaginary part
    z_re = tmp;
    if (z_re * z_re + z_im * z_im > 4.0)      // |z|² > 4 -> escaped
        return (i);
    i++;
}
return (f->max_iter);                          // didn't escape = in the set`, cap: "Mandelbrot starts z=0; Julia starts z=pixel with c constant", lang: "c" },
      { note: "trick: use |z|² > 4 instead of sqrt(|z|) > 2 -> no sqrt call (much faster, since it runs per pixel per iteration)" },
      { h: "2) map a pixel -> the complex plane (render.c)" },
      { code: String.raw`im = f->max_im - (double)y / HEIGHT * (f->max_im - f->min_im);
re = f->min_re + (double)x / WIDTH  * (f->max_re - f->min_re);
put_pixel(f, x, y, get_color(f, compute_iter(f, re, im)));`, cap: "screen (x,y) -> point (re,im); the im axis is flipped because screen y increases downward", lang: "c" },
      { h: "3) write pixels straight into the image buffer (render.c)" },
      { code: String.raw`dst = f->addr + (y * f->line_len + x * (f->bpp / 8));
*(unsigned int *)dst = color;`, cap: "write into the in-memory image then put the whole image once — far faster than mlx_pixel_put", lang: "c" },
      { h: "4) Zoom toward the cursor (events.c)" },
      { code: String.raw`mouse_re = f->min_re + (double)x / WIDTH  * (f->max_re - f->min_re);
mouse_im = f->max_im - (double)y / HEIGHT * (f->max_im - f->min_im);
f->min_re = mouse_re + (f->min_re - mouse_re) * factor;   // shrink/grow around the cursor
f->max_re = mouse_re + (f->max_re - mouse_re) * factor;
// ... same for im ; wheel up factor=0.8 (zoom in), down 1.25 (out)`, cap: "shift the frame to scale around the mouse point so zoom doesn't drift from the cursor", lang: "c" },
      { h: "5) Smooth-palette color (color.c)" },
      { code: String.raw`if (iter >= f->max_iter) return (0x000000);     // in the set = black
t = (double)((iter + f->shift) % f->max_iter) / f->max_iter;
r = 9.0  * (1-t) * t*t*t        * 255;
g = 15.0 * (1-t)*(1-t) * t*t    * 255;
b = 8.5  * (1-t)*(1-t)*(1-t)*t  * 255;
return ((r << 16) | (g << 8) | b);`, cap: "a polynomial palette gives a smooth gradient; shift = cycle the hue (bonus)", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**|z|² > 4 instead of sqrt** — avoid the slow sqrt() (runs millions of times per frame)",
        "**write straight into the image buffer** (addr + offset) then put the whole image — hundreds of times faster than mlx_pixel_put",
        "**Mandelbrot/Julia share one code path**, differing only in the z start and c",
        "**zoom around the cursor**: convert the mouse to a complex coordinate first, then scale the frame around that point",
        "**flip the imaginary axis** (max_im - ...) because the screen's y axis increases downward",
        "**clamp max_iter** (20..1000) to avoid hanging / over-detail",
        "**free all mlx resources** in close_hook: destroy_image/window/display + free",
      ]},
    ],
    eval: [
      { qa: [
        { q: "How do Mandelbrot and Julia differ?", a: "Same formula z=z²+c; Mandelbrot: z starts 0, c = the pixel's coordinate. Julia: z starts = the pixel's coordinate, c = a constant (from argv)." },
        { q: "How does the escape-time algorithm work?", a: "Iterate z=z²+c; if |z| grows past 2 before max_iter it 'escaped' (outside the set), use the count for color; if it finishes without escaping = in the set = black." },
        { q: "Why use |z|² > 4 not sqrt?", a: "|z|²>4 equals |z|>2 but without calling sqrt, which is slow — this runs millions of times per frame, so it matters for speed." },
        { q: "How do you map a pixel to a complex point?", a: "re = min_re + x/WIDTH*(max_re-min_re); im = max_im - y/HEIGHT*(max_im-min_im) (im flipped because screen y points down)." },
        { q: "How do you zoom toward the mouse?", a: "Convert the mouse position to a complex coordinate, then shrink/grow the frame (min/max re,im) around that point by a factor — so the point under the mouse stays put." },
        { q: "Why is render fast despite looping every pixel?", a: "Write colors straight into the in-memory image buffer (pointer + offset) then mlx_put_image_to_window once, not mlx_pixel_put per dot." },
        { q: "What do + / - do?", a: "Adjust max_iter (clamped 20..1000) to add detail/depth to the set's boundary, then re-render." },
        { q: "How do you handle memory/the window on close?", a: "close_hook calls mlx_destroy_image/window/display + free(mlx) then exit(0); valgrind checks for leaks." },
      ]},
      { h: "Tests" },
      { code: String.raw`./fractol mandelbrot
./fractol julia -0.7 0.27015
./fractol            # usage (no args)
./fractol invalid    # usage (wrong fractal name)`, lang: "bash" },
    ],
  },
};
