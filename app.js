/* ============================================================
   app.js — React UI (plain JS, ไม่ใช้ JSX/Babel → เปิด file:// ได้เลย)
   - window.PROJECT_ID ถูกตั้ง → แสดงหน้าโปรเจกต์นั้น (แยกหน้า)
   - ไม่ตั้ง                   → แสดงหน้าแรก (รวมลิงก์)
   ข้อมูลจาก window.TEACHING_DATA (data.js)
   ============================================================ */
(function () {
  var h = React.createElement;
  var useState = React.useState;

  /* ---- i18n: เลือกภาษา TH / EN ----
     ค่า text ในเนื้อหาเป็นได้ทั้ง string (ใช้ร่วมกัน) หรือ {th, en}
     t() จะเลือกตามภาษาปัจจุบัน ถ้าไม่มี en จะ fallback เป็น th    */
  var LANG = (function () {
    try { return localStorage.getItem("lang") || "th"; } catch (e) { return "th"; }
  })();
  function t(v) {
    if (v && typeof v === "object" && !Array.isArray(v) &&
        (("th" in v) || ("en" in v)))
      return v[LANG] != null ? v[LANG] : (v.th != null ? v.th : v.en);
    return v;
  }

  /* ---- inline formatter: **bold** และ `code` ---- */
  function inline(text) {
    text = t(text);
    var parts = [];
    var re = /\*\*([^*]+)\*\*|`([^`]+)`/g;
    var last = 0, m, k = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      if (m[1] !== undefined) parts.push(h("strong", { key: k++ }, m[1]));
      else parts.push(h("code", { className: "inline", key: k++ }, m[2]));
      last = re.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  /* ---- code block + copy ---- */
  function CodeBlock(props) {
    var st = useState(false), copied = st[0], setCopied = st[1];
    function copy() {
      try {
        navigator.clipboard.writeText(props.code).then(function () {
          setCopied(true);
          setTimeout(function () { setCopied(false); }, 1200);
        });
      } catch (e) { /* ignore */ }
    }
    return h("div", { className: "codeblock" },
      h("div", { className: "bar" },
        h("span", { className: "lang" }, props.lang || "code"),
        h("button", { className: "copy", onClick: copy },
          copied ? t({ th: "คัดลอกแล้ว ✓", en: "Copied ✓" }) : t({ th: "คัดลอก", en: "Copy" }))
      ),
      h("pre", null, h("code", null, props.code)),
      props.cap ? h("div", { className: "cap" }, inline(props.cap)) : null
    );
  }

  /* ---- QA accordion ---- */
  function QA(props) {
    var st = useState(-1), open = st[0], setOpen = st[1];
    return props.items.map(function (it, i) {
      return h("div", { className: "qa", key: i },
        h("button", { className: "q", onClick: function () { setOpen(open === i ? -1 : i); } },
          h("span", { className: "mark" }, open === i ? "▾" : "▸"),
          h("span", null, t(it.q))
        ),
        open === i ? h("div", { className: "a" }, inline(it.a)) : null
      );
    });
  }

  /* ---- render หนึ่ง block ---- */
  function Block(props) {
    var b = props.b;
    if (b.h) return h("h2", null, t(b.h));
    if (b.p) return h("p", null, inline(b.p));
    if (b.ul) return h("ul", null, b.ul.map(function (x, i) { return h("li", { key: i }, inline(x)); }));
    if (b.note) return h("div", { className: "note" }, inline(b.note));
    if (b.code) return h(CodeBlock, { code: b.code, cap: b.cap, lang: b.lang });
    if (b.table) {
      return h("table", { className: "tbl" },
        h("thead", null, h("tr", null, b.table.head.map(function (x, i) { return h("th", { key: i }, t(x)); }))),
        h("tbody", null, b.table.rows.map(function (r, i) {
          return h("tr", { key: i }, r.map(function (c, j) { return h("td", { key: j }, inline(c)); }));
        }))
      );
    }
    if (b.qa) return h(QA, { items: b.qa });
    if (b.links) return h("div", { className: "reflist" },
      b.links.map(function (l, i) {
        return h("a", {
          key: i, className: "reflink", href: l.url,
          target: "_blank", rel: "noopener noreferrer"
        },
          h("span", { className: "reftitle" }, t(l.label), h("span", { className: "refarrow" }, " ↗")),
          l.note ? h("span", { className: "refnote" }, inline(l.note)) : null
        );
      })
    );
    return null;
  }

  /* ============================================================
     INTERACTIVE DEMOS
     ============================================================ */
  var useRef = React.useRef;
  var useEffect = React.useEffect;

  /* ---- push_swap: Turkish sort ตัวจริง (พอร์ตจากโค้ด C) ----
     normalize → sort_small/large → cost-based greedy + รวม rr/rrr
     คืน {ops, ok, frames} ; frames เก็บ {a,b,op} ไว้เล่นอนิเมชัน      */
  function pushSwapSolve(values, record) {
    var a = values.map(function (v) { return { val: v, idx: 0 }; });
    var b = [];
    var srt = values.slice().sort(function (x, y) { return x - y; });
    a.forEach(function (n) { n.idx = srt.indexOf(n.val); });   // normalize → rank
    var ops = 0, frames = record ? [] : null;
    function emit(name) {
      ops++;
      if (record) frames.push({
        a: a.map(function (n) { return n.val; }),
        b: b.map(function (n) { return n.val; }), op: name
      });
    }
    function sa() { if (a.length > 1) { var t = a[0]; a[0] = a[1]; a[1] = t; } emit("sa"); }
    function pa() { if (b.length) a.unshift(b.shift()); emit("pa"); }
    function pb() { if (a.length) b.unshift(a.shift()); emit("pb"); }
    function ra() { if (a.length > 1) a.push(a.shift()); emit("ra"); }
    function rb() { if (b.length > 1) b.push(b.shift()); emit("rb"); }
    function rra() { if (a.length > 1) a.unshift(a.pop()); emit("rra"); }
    function rrb() { if (b.length > 1) b.unshift(b.pop()); emit("rrb"); }
    function rr() { if (a.length > 1) a.push(a.shift()); if (b.length > 1) b.push(b.shift()); emit("rr"); }
    function rrr() { if (a.length > 1) a.unshift(a.pop()); if (b.length > 1) b.unshift(b.pop()); emit("rrr"); }
    function costOf(pos, size) { return pos <= size / 2 ? pos : -(size - pos); }
    function findMinA() { var p = 0, m = Infinity; for (var i = 0; i < a.length; i++) if (a[i].idx < m) { m = a[i].idx; p = i; } return p; }
    function findTarget(bi) { var bp = findMinA(), bx = Infinity; for (var i = 0; i < a.length; i++) if (a[i].idx > bi && a[i].idx < bx) { bx = a[i].idx; bp = i; } return bp; }
    function findMinPos() { for (var i = 0; i < a.length; i++) if (a[i].idx === 0) return i; return 0; }
    function findIdxPos(t) { for (var i = 0; i < a.length; i++) if (a[i].idx === t) return i; return 0; }
    function rotA(c) { while (c > 0) { ra(); c--; } while (c < 0) { rra(); c++; } }
    function rotB(c) { while (c > 0) { rb(); c--; } while (c < 0) { rrb(); c++; } }
    function sameDir(ca, cb) { while (ca > 0 && cb > 0) { rr(); ca--; cb--; } while (ca < 0 && cb < 0) { rrr(); ca++; cb++; } return [ca, cb]; }
    function doMove(pA, pB) { var r = sameDir(costOf(pA, a.length), costOf(pB, b.length)); rotA(r[0]); rotB(r[1]); pa(); }
    function pickCost(node, pos) {
      var t = findTarget(node.idx), ca = costOf(t, a.length), cb = costOf(pos, b.length);
      if ((ca >= 0 && cb >= 0) || (ca <= 0 && cb <= 0)) return Math.max(Math.abs(ca), Math.abs(cb));
      return Math.abs(ca) + Math.abs(cb);
    }
    function bestB() { var bp = 0, bc = Infinity; for (var i = 0; i < b.length; i++) { var c = pickCost(b[i], i); if (c < bc) { bc = c; bp = i; } } return bp; }
    function sort3() { var x = a[0].idx, y = a[1].idx, z = a[2].idx; if (x > y && x > z) ra(); else if (y > x && y > z) rra(); else if (x > y) sa(); if (a[0].idx > a[1].idx) sa(); }
    function sort2() { if (a[0].idx > a[1].idx) sa(); }
    function bringTop(t) { var pos = findIdxPos(t), size = a.length; if (pos <= size / 2) { while (a[0].idx !== t) ra(); } else { while (a[0].idx !== t) rra(); } }
    function sortSmall() { var size = a.length; if (size === 2) return sort2(); if (size === 3) return sort3(); bringTop(0); pb(); if (size === 5) { bringTop(1); pb(); } sort3(); pa(); if (size === 5) pa(); }
    function sortLarge() {
      while (a.length > 3) pb();
      sort3();
      while (b.length) { var pB = bestB(); var pA = findTarget(b[pB].idx); doMove(pA, pB); }
      var pos = findMinPos(), size = a.length;
      if (pos <= size / 2) { while (a[0].idx !== 0) ra(); } else { while (a[0].idx !== 0) rra(); }
    }
    function isSorted() { for (var i = 0; i < a.length - 1; i++) if (a[i].idx > a[i + 1].idx) return false; return true; }
    if (a.length > 1 && !isSorted()) { if (a.length <= 5) sortSmall(); else sortLarge(); }
    return { ops: ops, ok: isSorted() && b.length === 0, frames: frames };
  }
  function psShuffle(n) {
    var arr = []; for (var i = 1; i <= n; i++) arr.push(i);
    for (var i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  /* ---- push_swap: op playground ---- */
  function PushSwapDemo() {
    var sA = useState([3, 1, 5, 2, 8, 4, 7, 6]); var a = sA[0], setA = sA[1];
    var sB = useState([]); var b = sB[0], setB = sB[1];
    var sO = useState(0); var ops = sO[0], setOps = sO[1];
    var sL = useState([]); var log = sL[0], setLog = sL[1];
    var sP = useState(false); var playing = sP[0], setPlaying = sP[1];
    var sBn = useState(null); var bench = sBn[0], setBench = sBn[1];

    function run(name) {
      if (playing) return;
      var na = a.slice(), nb = b.slice();
      var doOp = function (op) {
        if (op === "sa" && na.length > 1) { var t = na[0]; na[0] = na[1]; na[1] = t; }
        if (op === "sb" && nb.length > 1) { var t2 = nb[0]; nb[0] = nb[1]; nb[1] = t2; }
        if (op === "pa" && nb.length) na.unshift(nb.shift());
        if (op === "pb" && na.length) nb.unshift(na.shift());
        if (op === "ra" && na.length) na.push(na.shift());
        if (op === "rb" && nb.length) nb.push(nb.shift());
        if (op === "rra" && na.length) na.unshift(na.pop());
        if (op === "rrb" && nb.length) nb.unshift(nb.pop());
      };
      if (name === "ss") { doOp("sa"); doOp("sb"); }
      else if (name === "rr") { doOp("ra"); doOp("rb"); }
      else if (name === "rrr") { doOp("rra"); doOp("rrb"); }
      else doOp(name);
      setA(na); setB(nb); setOps(ops + 1);
      setLog(log.concat(name).slice(-30));
    }
    function reset() {
      setA([3, 1, 5, 2, 8, 4, 7, 6]); setB([]); setOps(0); setLog([]);
    }
    function shuffle() {
      var arr = [1, 2, 3, 4, 5, 6, 7, 8];
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      setA(arr); setB([]); setOps(0); setLog([]);
    }
    function autoSort() {
      if (playing) return;
      var values = a.concat(b);                  // รวมทุกค่า (ปกติ b ว่าง)
      var res = pushSwapSolve(values, true);     // ★ Turkish sort ตัวจริง
      setA(values); setB([]); setLog([]);        // แสดงจุดเริ่ม
      setOps(0);
      if (!res.frames.length) return;
      setPlaying(true);
      var names = res.frames.map(function (f) { return f.op; });
      var i = 0;
      var step = function () {
        var f = res.frames[i];
        setA(f.a); setB(f.b); setOps(i + 1);
        setLog(names.slice(0, i + 1).slice(-30));
        i++;
        if (i < res.frames.length) setTimeout(step, 150);
        else setPlaying(false);
      };
      setTimeout(step, 150);
    }
    function runBench(n) {
      if (playing) return;
      var runs = 5, tot = 0, mx = 0, ok = true;
      for (var r = 0; r < runs; r++) {
        var x = pushSwapSolve(psShuffle(n), false);
        tot += x.ops; if (x.ops > mx) mx = x.ops; if (!x.ok) ok = false;
      }
      var avg = Math.round(tot / runs);
      var pass = n === 100 ? (mx < 700) : (mx <= 5500);
      setBench({ n: n, runs: runs, avg: avg, mx: mx, ok: ok, pass: pass });
    }
    var sorted = b.length === 0 && a.every(function (v, i) { return i === 0 || a[i - 1] <= v; });
    var col = function (stack, label) {
      return h("div", { className: "ps-col" },
        h("div", { className: "ps-label" }, label),
        h("div", { className: "ps-stack" },
          stack.length === 0 ? h("div", { className: "ps-empty" }, "ว่าง")
            : stack.map(function (v, i) {
              return h("div", {
                key: i,
                className: "ps-chip" + (i === 0 ? " top" : ""),
                style: { width: (24 + v * 16) + "px" }
              }, v);
            })
        )
      );
    };
    var OPS = ["sa", "sb", "ss", "pa", "pb", "ra", "rb", "rr", "rra", "rrb", "rrr"];
    return h("div", { className: "demo" },
      h("p", { className: "demo-hint" }, t({ th: "กดปุ่ม operation เพื่อดู stack ขยับจริง (บนสุด = index 0). ลองเรียง A ให้น้อย→มากโดยใช้ ops น้อยที่สุด", en: "Press an operation to watch the stacks move (top = index 0). Try to sort A ascending using as few ops as possible." })),
      h("div", { className: "demo-bar" },
        h("span", { className: "demo-stat" }, "ops: ", h("b", null, ops)),
        h("span", { className: "demo-stat" + (sorted ? " ok" : "") }, sorted ? t({ th: "✅ เรียงแล้ว!", en: "✅ Sorted!" }) : t({ th: "ยังไม่เรียง", en: "Not sorted" })),
        h("button", { className: "demo-btn active", onClick: autoSort, disabled: playing || sorted },
          playing ? t({ th: "กำลังเรียง…", en: "sorting…" }) : "▶ auto-sort"),
        h("button", { className: "demo-btn alt", onClick: shuffle, disabled: playing }, t({ th: "สุ่มใหม่", en: "shuffle" })),
        h("button", { className: "demo-btn alt", onClick: reset, disabled: playing }, t({ th: "รีเซ็ต", en: "reset" }))
      ),
      h("div", { className: "ps-stacks" }, col(a, "A"), col(b, "B")),
      h("div", { className: "ps-ops" },
        OPS.map(function (op) {
          return h("button", {
            key: op, className: "demo-btn", disabled: playing,
            onClick: function () { run(op); }
          }, op);
        })
      ),
      h("div", { className: "ps-log" }, "log: " + (log.join(" ") || "—")),
      h("div", { className: "ps-bench" },
        h("div", { className: "ps-bench-title" }, t({ th: "⏱ Benchmark (Turkish sort ตัวจริง — เกณฑ์เต็ม: 100 < 700, 500 ≤ 5500)", en: "⏱ Benchmark (real Turkish sort — full score: 100 < 700, 500 ≤ 5500)" })),
        h("div", { className: "demo-bar" },
          h("button", { className: "demo-btn", onClick: function () { runBench(100); }, disabled: playing }, t({ th: "ทดสอบ 100 ตัว", en: "test 100 numbers" })),
          h("button", { className: "demo-btn", onClick: function () { runBench(500); }, disabled: playing }, t({ th: "ทดสอบ 500 ตัว", en: "test 500 numbers" }))
        ),
        bench ? h("div", { className: "ps-bench-res" + (bench.pass ? " pass" : "") },
          bench.n + t({ th: " ตัว · ", en: " numbers · " }) + bench.runs + t({ th: " รอบ → เฉลี่ย ", en: " runs → avg " }), h("b", null, bench.avg),
          t({ th: " ops, สูงสุด ", en: " ops, max " }), h("b", null, bench.mx), " ops  ",
          h("span", { className: "verdict" }, bench.pass ? t({ th: "✅ คะแนนเต็ม", en: "✅ full score" }) : t({ th: "⚠️ เกินเกณฑ์เต็ม", en: "⚠️ over budget" })),
          bench.ok ? "" : t({ th: "  (❌ มีเคสที่เรียงไม่สำเร็จ!)", en: "  (❌ a case failed to sort!)" })
        ) : h("div", { className: "ps-bench-hint" }, t({ th: "กดเพื่อรันจริง 5 รอบแล้วดูจำนวน operation เฉลี่ย/สูงสุด", en: "Press to run 5 real rounds and see the avg/max operation count" }))
      )
    );
  }

  /* ---- fract-ol: live canvas renderer ---- */
  function FractalDemo() {
    var W = 360, H = 360;
    var ref = useRef(null);
    var sType = useState(1); var type = sType[0], setType = sType[1];      // 1=mandel 2=julia
    var sIter = useState(80); var iter = sIter[0], setIter = sIter[1];
    var sView = useState({ cx: -0.5, cy: 0, scale: 1.5 });
    var view = sView[0], setView = sView[1];

    function colorOf(it, maxit) {
      if (it >= maxit) return [0, 0, 0];
      var t = it / maxit;
      var r = 9.0 * (1 - t) * t * t * t * 255;
      var g = 15.0 * (1 - t) * (1 - t) * t * t * 255;
      var bb = 8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255;
      return [r, g, bb];
    }
    useEffect(function () {
      var cv = ref.current; if (!cv) return;
      var ctx = cv.getContext("2d");
      var img = ctx.createImageData(W, H);
      var cRe = -0.7, cIm = 0.27015;
      var y = 0;
      while (y < H) {
        var x = 0;
        while (x < W) {
          var re = view.cx + (x - W / 2) / (W / 2) * view.scale;
          var im = view.cy - (y - H / 2) / (H / 2) * view.scale;
          var zr, zi;
          if (type === 1) { zr = 0; zi = 0; } else { zr = re; zi = im; }
          var i = 0;
          while (i < iter) {
            var tmp = zr * zr - zi * zi + (type === 1 ? re : cRe);
            zi = 2 * zr * zi + (type === 1 ? im : cIm);
            zr = tmp;
            if (zr * zr + zi * zi > 4.0) break;
            i++;
          }
          var c = colorOf(i, iter);
          var p = (y * W + x) * 4;
          img.data[p] = c[0]; img.data[p + 1] = c[1]; img.data[p + 2] = c[2]; img.data[p + 3] = 255;
          x++;
        }
        y++;
      }
      ctx.putImageData(img, 0, 0);
    }, [type, iter, view]);

    function click(e) {
      var rect = e.target.getBoundingClientRect();
      var px = e.clientX - rect.left, py = e.clientY - rect.top;
      var re = view.cx + (px - W / 2) / (W / 2) * view.scale;
      var im = view.cy - (py - H / 2) / (H / 2) * view.scale;
      setView({ cx: re, cy: im, scale: view.scale * 0.6 });
    }
    return h("div", { className: "demo" },
      h("p", { className: "demo-hint" }, "คลิกบนภาพเพื่อ zoom เข้าหาจุดนั้น (สูตร escape-time z = z² + c เดียวกับโค้ด C)"),
      h("div", { className: "demo-bar" },
        h("button", { className: "demo-btn" + (type === 1 ? " active" : ""), onClick: function () { setType(1); setView({ cx: -0.5, cy: 0, scale: 1.5 }); } }, "Mandelbrot"),
        h("button", { className: "demo-btn" + (type === 2 ? " active" : ""), onClick: function () { setType(2); setView({ cx: 0, cy: 0, scale: 1.5 }); } }, "Julia"),
        h("button", { className: "demo-btn alt", onClick: function () { setView({ cx: view.cx, cy: view.cy, scale: view.scale * 1.8 }); } }, "zoom out"),
        h("button", { className: "demo-btn alt", onClick: function () { setView(type === 1 ? { cx: -0.5, cy: 0, scale: 1.5 } : { cx: 0, cy: 0, scale: 1.5 }); } }, "รีเซ็ต")
      ),
      h("div", { className: "demo-bar" },
        h("span", { className: "demo-stat" }, "iteration: ", h("b", null, iter)),
        h("input", {
          type: "range", min: 20, max: 300, value: iter,
          onChange: function (e) { setIter(parseInt(e.target.value, 10)); },
          style: { flex: "1", maxWidth: "260px" }
        })
      ),
      h("canvas", { ref: ref, width: W, height: H, className: "fr-canvas", onClick: click })
    );
  }

  /* ---- so_long: playable mini map ---- */
  function SoLongDemo() {
    var MAP0 = ["1111111", "1P000C1", "1010101", "1C000E1", "1111111"];
    function findP(m) { for (var y = 0; y < m.length; y++) { var x = m[y].indexOf("P"); if (x >= 0) return { x: x, y: y }; } return { x: 1, y: 1 }; }
    function countC(m) { var n = 0; m.forEach(function (r) { for (var i = 0; i < r.length; i++) if (r[i] === "C") n++; }); return n; }
    var sGrid = useState(MAP0.map(function (r) { return r.split(""); }));
    var grid = sGrid[0], setGrid = sGrid[1];
    var sP = useState(findP(MAP0)); var p = sP[0], setP = sP[1];
    var sMoves = useState(0); var moves = sMoves[0], setMoves = sMoves[1];
    var sLeft = useState(countC(MAP0)); var left = sLeft[0], setLeft = sLeft[1];
    var sWin = useState(false); var win = sWin[0], setWin = sWin[1];
    var boxRef = useRef(null);

    function reset() {
      setGrid(MAP0.map(function (r) { return r.split(""); }));
      setP(findP(MAP0)); setMoves(0); setLeft(countC(MAP0)); setWin(false);
      if (boxRef.current) boxRef.current.focus();
    }
    function move(dx, dy) {
      if (win) return;
      var nx = p.x + dx, ny = p.y + dy;
      var cell = grid[ny][nx];
      if (cell === "1") return;
      if (cell === "E" && left > 0) return;
      var ng = grid.map(function (r) { return r.slice(); });
      var nleft = left;
      if (cell === "C") { ng[ny][nx] = "0"; nleft--; }
      if (cell === "E") setWin(true);
      setGrid(ng); setP({ x: nx, y: ny }); setLeft(nleft); setMoves(moves + 1);
    }
    function onKey(e) {
      var k = e.key;
      if (k === "ArrowUp" || k === "w") move(0, -1);
      else if (k === "ArrowDown" || k === "s") move(0, 1);
      else if (k === "ArrowLeft" || k === "a") move(-1, 0);
      else if (k === "ArrowRight" || k === "d") move(1, 0);
      else return;
      e.preventDefault();
    }
    var glyph = { "1": "🟫", "0": "·", "C": "🪙", "E": "🚪" };
    return h("div", { className: "demo" },
      h("p", { className: "demo-hint" }, "คลิกที่กระดานก่อน แล้วใช้ปุ่มลูกศร / WASD เดิน — เก็บเหรียญ 🪙 ให้ครบแล้วไปประตู 🚪"),
      h("div", { className: "demo-bar" },
        h("span", { className: "demo-stat" }, "moves: ", h("b", null, moves)),
        h("span", { className: "demo-stat" }, "เหรียญเหลือ: ", h("b", null, left)),
        h("span", { className: "demo-stat" + (win ? " ok" : "") }, win ? "🎉 ชนะแล้ว!" : ""),
        h("button", { className: "demo-btn alt", onClick: reset }, "รีเซ็ต")
      ),
      h("div", { className: "sl-grid", tabIndex: 0, ref: boxRef, onKeyDown: onKey },
        grid.map(function (row, y) {
          return h("div", { className: "sl-row", key: y },
            row.map(function (c, x) {
              var ch = (x === p.x && y === p.y) ? "🙂" : (glyph[c] || c);
              return h("div", { className: "sl-cell", key: x }, ch);
            })
          );
        })
      )
    );
  }

  /* ---- pipex: step-through pipeline diagram ---- */
  function PipexDemo() {
    var STEPS = [
      { t: "open files", d: "เปิด infile (อ่าน) และ outfile (เขียน) ได้ fd มาเก็บใน fio[2]", hi: [0, 4] },
      { t: "pipe()", d: "สร้างท่อ pfd[0]=อ่าน, pfd[1]=เขียน เชื่อม 2 process", hi: [2] },
      { t: "fork child1", d: "ลูกที่ 1: dup2(infile→stdin), dup2(pfd[1]→stdout) แล้ว execve cmd1", hi: [0, 1, 2] },
      { t: "fork child2", d: "ลูกที่ 2: dup2(pfd[0]→stdin), dup2(outfile→stdout) แล้ว execve cmd2", hi: [2, 3, 4] },
      { t: "parent close + wait", d: "แม่ปิด fd ทุกตัว (สำคัญ! ไม่งั้น cmd2 ค้างรอ EOF) แล้ว waitpid ทั้งสองลูก", hi: [] }
    ];
    var sS = useState(0); var s = sS[0], setS = sS[1];
    var nodes = [
      { id: 0, label: "infile", k: "file" },
      { id: 1, label: "cmd1", k: "proc" },
      { id: 2, label: "pipe", k: "pipe" },
      { id: 3, label: "cmd2", k: "proc" },
      { id: 4, label: "outfile", k: "file" }
    ];
    var hi = STEPS[s].hi;
    return h("div", { className: "demo" },
      h("p", { className: "demo-hint" }, "กด 'ถัดไป' เพื่อดูลำดับการทำงานของ pipex ทีละสเตป"),
      h("div", { className: "px-flow" },
        nodes.map(function (n, i) {
          return h(React.Fragment, { key: n.id },
            h("div", { className: "px-node " + n.k + (hi.indexOf(n.id) >= 0 ? " hot" : "") }, n.label),
            i < nodes.length - 1 ? h("div", { className: "px-arrow" }, "→") : null
          );
        })
      ),
      h("div", { className: "px-stepbox" },
        h("div", { className: "px-stepnum" }, "STEP " + (s + 1) + "/" + STEPS.length + " · " + STEPS[s].t),
        h("p", null, STEPS[s].d)
      ),
      h("div", { className: "demo-bar" },
        h("button", { className: "demo-btn alt", onClick: function () { setS(Math.max(0, s - 1)); } }, "← ก่อนหน้า"),
        h("button", { className: "demo-btn", onClick: function () { setS(Math.min(STEPS.length - 1, s + 1)); } }, "ถัดไป →"),
        h("button", { className: "demo-btn alt", onClick: function () { setS(0); } }, "เริ่มใหม่")
      )
    );
  }

  var DEMOS = {
    push_swap: PushSwapDemo,
    pipex: PipexDemo,
    so_long: SoLongDemo,
    fractol: FractalDemo
  };

  var TABS = [
    ["principle", { th: "หลักการ", en: "Overview" }],
    ["theory", { th: "ทฤษฎีที่ต้องรู้", en: "Theory" }],
    ["foundations", { th: "Struct · Pointer · Memory", en: "Struct · Pointer · Memory" }],
    ["architecture", { th: "โครงสร้างโค้ด", en: "Code Structure" }],
    ["dataflow", { th: "ทุกฟังก์ชัน · การไหล", en: "Functions · Data Flow" }],
    ["implementation", { th: "การ implement", en: "Implementation" }],
    ["tricks", { th: "ทริคเด็ด", en: "Key Tricks" }],
    ["demo", { th: "เดโมโต้ตอบ", en: "Interactive Demo" }],
    ["eval", { th: "คำถาม Evaluation", en: "Evaluation Q&A" }]
  ];

  /* ---- หน้าโปรเจกต์ ---- */
  function ProjectPage(props) {
    var proj = props.proj;
    var st = useState("principle"), tab = st[0], setTab = st[1];
    document.documentElement.style.setProperty("--accent", proj.accent);
    var enSec = (LANG === "en" && window.TEACHING_EN && window.TEACHING_EN[proj.id])
      ? window.TEACHING_EN[proj.id][tab] : null;
    var blocks = enSec || proj.sections[tab] || [];
    var Demo = DEMOS[proj.id];
    var body;
    if (tab === "demo") {
      body = Demo ? h(Demo, null) : h("p", null, t({ th: "ยังไม่มีเดโมสำหรับโปรเจกต์นี้", en: "No demo for this project yet" }));
    } else {
      body = blocks.map(function (b, i) { return h(Block, { key: i, b: b }); });
    }
    return h("div", { className: "wrap" },
      h("div", { className: "hero" },
        h("div", { className: "accent-bar" }),
        h("h1", null, proj.name),
        h("p", { className: "tag" }, t(proj.tag)),
        null
      ),
      h("div", { className: "tabs" },
        TABS.map(function (tb) {
          var k = tb[0], label = tb[1];
          return h("button", {
            key: k,
            className: "tab" + (tab === k ? " active" : ""),
            onClick: function () { setTab(k); window.scrollTo(0, 0); }
          }, t(label));
        })
      ),
      h("div", { className: "section", key: tab }, body),
      h("footer", null,
        t({ th: "สื่อการสอน 42 · ", en: "42 Study Guide · " }) + proj.name +
        t({ th: " · อิงจากโค้ดจริงของ wiaon-in", en: " · based on real code by wiaon-in" }))
    );
  }

  /* ---- หน้าแรก ---- */
  function Home(props) {
    return h("div", { className: "wrap" },
      h("div", { className: "hero" },
        h("div", { className: "accent-bar" }),
        h("h1", null, t({ th: "สื่อการสอน 42", en: "42 Study Guide" })),
        h("p", { className: "tag" }, t({
          th: "คู่มือ 42 ฉบับจับมือทำ — เล่าตั้งแต่ทฤษฎี ไล่โค้ดทีละฟังก์ชัน ยันคำถามตอน eval แบบที่อ่านแล้วเก็ตจริง",
          en: "A hands-on 42 guide — from the theory, through every function, to the evaluation Q&A, all in plain language"
        })),
        h("a", {
          className: "gh-btn", href: "https://github.com/JOTARO365",
          target: "_blank", rel: "noopener noreferrer"
        }, "GitHub: JOTARO365 ↗")
      ),
      h("div", { className: "grid" },
        props.projects.map(function (p) {
          return h("a", {
            className: "card", key: p.id, href: p.id + ".html",
            style: { borderLeftColor: p.accent }
          },
            h("h3", null, p.name),
            h("p", null, t(p.tag)),
            h("span", { className: "done" }, t({ th: "✅ ทำเสร็จแล้ว", en: "✅ Done" }))
          );
        })
      ),
      h("div", { className: "home-note" }, inline(t({
        th: "แต่ละโปรเจกต์แยกเป็นคนละหน้า — เมื่อทำโปรเจกต์ใหม่เสร็จ เพิ่มข้อมูลใน `data.js` แล้วสร้างไฟล์ `<id>.html` การ์ดจะโผล่หน้านี้อัตโนมัติ",
        en: "Each project is its own page — when a new project is done, add it to `data.js` and create `<id>.html`, and a card appears here automatically."
      }))),
      h("footer", null, t({
        th: "สื่อการสอน 42 · อิงจากโค้ดจริงของ wiaon-in",
        en: "42 Study Guide · based on real code by wiaon-in"
      }))
    );
  }

  /* ---- Root: ถือ state ภาษา + ปุ่มสลับ TH/EN ---- */
  function Root() {
    var s = useState(LANG);
    LANG = s[0];                       // sync ก่อน children render → t() อ่านค่าถูก
    function setLang(l) {
      LANG = l;
      try { localStorage.setItem("lang", l); } catch (e) { /* ignore */ }
      s[1](l);
    }
    var data = window.TEACHING_DATA || [];
    var page;
    if (window.PROJECT_ID) {
      var proj = data.find(function (p) { return p.id === window.PROJECT_ID; });
      page = proj ? h(ProjectPage, { proj: proj })
        : h("div", { className: "wrap" }, h("p", null, "Not found: " + window.PROJECT_ID));
    } else {
      page = h(Home, { projects: data });
    }
    return h(React.Fragment, null,
      h("div", { className: "lang-switch" },
        h("button", { className: "lang-btn" + (s[0] === "th" ? " on" : ""), onClick: function () { setLang("th"); } }, "TH"),
        h("button", { className: "lang-btn" + (s[0] === "en" ? " on" : ""), onClick: function () { setLang("en"); } }, "EN")
      ),
      page
    );
  }
  ReactDOM.createRoot(document.getElementById("root")).render(h(Root));
})();
