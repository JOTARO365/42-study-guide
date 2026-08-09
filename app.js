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

  /* ============================================================
     NetPractice simulator — กระดานฝึก subnetting + routing
     ตรรกะตัดสินเลียนแบบ sim.js ของเกมจริง: interface ที่เป็น network/
     broadcast ถือว่าไม่มี IP, mask ต้องบิตติดกัน, ขาของ router ห้ามครอบ
     ปลายทางพร้อมกัน, routing table เจอบรรทัดแรกที่ตรงแล้วหยุด, และ
     ทุก goal ต้องผ่านทั้งขาไปและขากลับ
     ============================================================ */
  function npIpToInt(s) {
    if (typeof s !== "string") return null;
    var p = s.trim().split(".");
    if (p.length !== 4) return null;
    var n = 0, i, v;
    for (i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(p[i])) return null;
      v = parseInt(p[i], 10);
      if (v > 255) return null;
      n = n * 256 + v;
    }
    if (parseInt(p[0], 10) > 223) return null;       /* class D/E */
    if (parseInt(p[0], 10) === 127) return null;     /* loopback */
    return n;
  }
  function npIntToIp(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }
  function npMaskToInt(s) {
    var n = npIpToIntLoose(s);
    if (n === null) return null;
    /* บิต 1 ต้องติดกันจากซ้าย: ~n + 1 ต้องเป็นกำลังของสอง */
    var inv = (~n) >>> 0;
    if (((inv + 1) & inv) !== 0) return null;
    return n >>> 0;
  }
  function npIpToIntLoose(s) {                       /* mask ไม่ติดกฎ 223/127 */
    if (typeof s !== "string") return null;
    var p = s.trim().split(".");
    if (p.length !== 4) return null;
    var n = 0, i, v;
    for (i = 0; i < 4; i++) {
      if (!/^\d{1,3}$/.test(p[i])) return null;
      v = parseInt(p[i], 10);
      if (v > 255) return null;
      n = n * 256 + v;
    }
    return n >>> 0;
  }
  function npNet(ip, mask) { return (ip & mask) >>> 0; }
  function npBcast(ip, mask) { return ((ip & mask) | (~mask)) >>> 0; }
  function npPrivate(ip) {
    return (ip >>> 24) === 10
      || ((ip >>> 20) === ((172 * 16) + 1))          /* 172.16.0.0/12 */
      || ((ip >>> 16) === ((192 * 256) + 168));
  }
  /* คืนค่า IP ที่ใช้ได้จริงของ interface — null ถ้าเป็น network/broadcast หรือค่าผิด */
  function npIfIp(f, vals) {
    var ip = npIpToInt(npVal(vals, f.id, "ip"));
    var mk = npMaskToInt(npVal(vals, f.id, "mask"));
    if (ip === null || mk === null) return null;
    if (ip === npNet(ip, mk) || ip === npBcast(ip, mk)) return null;
    return ip;
  }
  function npVal(vals, id, kind) {
    var k = id + "." + kind;
    return Object.prototype.hasOwnProperty.call(vals, k) ? vals[k] : "";
  }
  function npCovers(f, vals, target) {
    var ip = npIfIp(f, vals);
    if (ip === null) return false;
    var mk = npMaskToInt(npVal(vals, f.id, "mask"));
    return npNet(ip, mk) === npNet(target, mk);
  }
  /* route เขียนได้ทั้ง default, 0.0.0.0/0 และ a.b.c.d/nn */
  function npRouteCovers(routeStr, dst) {
    var s = (routeStr || "").trim().toLowerCase();
    if (s === "default" || s === "0.0.0.0/0") return { ok: true, isDefault: true };
    var m = /^(\d+\.\d+\.\d+\.\d+)\/(\d{1,2})$/.exec(s);
    if (!m) return { ok: false, bad: true };
    var base = npIpToIntLoose(m[1]);
    var bits = parseInt(m[2], 10);
    if (base === null || bits > 32) return { ok: false, bad: true };
    var mk = bits === 0 ? 0 : ((0xFFFFFFFF << (32 - bits)) >>> 0);
    return { ok: npNet(base, mk) === npNet(dst, mk), isDefault: bits === 0 };
  }

  function npBuild(level, vals) {
    var byIf = {}, segOf = {}, hostOf = {};
    level.hosts.forEach(function (hst) {
      hst.ifs.forEach(function (f) { byIf[f.id] = f; hostOf[f.id] = hst.id; });
    });
    level.segments.forEach(function (seg, i) {
      seg.forEach(function (id) { segOf[id] = i; });
    });
    return { byIf: byIf, segOf: segOf, hostOf: hostOf, vals: vals };
  }
  function npHost(level, id) {
    var r = null;
    level.hosts.forEach(function (hst) { if (hst.id === id) r = hst; });
    return r;
  }
  /* เดินหนึ่ง hop — คืน {ok, log[]} ; target คือปลายทางของ hop นี้ (dst หรือ gateway) */
  function npStep(level, ctx, hostId, target, dst, srcIp, isGate, depth, log) {
    if (depth > 12) { log.push("✗ loop detected"); return false; }
    var hst = npHost(level, hostId);
    var i, matches = [];
    for (i = 0; i < hst.ifs.length; i++)
      if (npCovers(hst.ifs[i], ctx.vals, target)) matches.push(hst.ifs[i]);

    if (matches.length > 1) {
      log.push("✗ " + hostId + ": error on " + (isGate ? "gate" : "destination") +
        " ip — multiple interface match");
      return false;
    }
    if (matches.length === 1) {
      var seg = ctx.segOf[matches[0].id];
      var peerHost = null;
      level.hosts.forEach(function (o) {
        o.ifs.forEach(function (f) {
          if (f.id === matches[0].id) return;
          if (ctx.segOf[f.id] !== seg) return;
          if (npIfIp(f, ctx.vals) === target) peerHost = o.id;
        });
      });
      if (peerHost === null) {
        log.push("✗ " + hostId + t({ th: ": ไม่มีเครื่องที่ใช้ IP ", en: ": no host uses the address " }) +
          npIntToIp(target) + t({ th: " บน segment นี้", en: " on that segment" }));
        return false;
      }
      if (target === dst) {
        log.push("✓ " + hostId + " → " + peerHost + " (" + npIntToIp(target) + ") : destination IP reached");
        return true;
      }
      log.push("· " + hostId + " → " + peerHost + t({ th: " ผ่าน gateway ", en: " via gateway " }) + npIntToIp(target));
      return npStep(level, ctx, peerHost, dst, dst, srcIp, false, depth + 1, log);
    }
    if (isGate) {
      log.push("✗ " + hostId + ": route match but no interface for gateway " + npIntToIp(target));
      return false;
    }
    if (hst.type === "internet" && (npPrivate(dst) || npPrivate(srcIp))) {
      log.push("✗ " + hostId + ": private subnets not routed over internet");
      return false;
    }
    var routes = hst.routes || [];
    for (i = 0; i < routes.length; i++) {
      var rs = npVal(ctx.vals, routes[i].id, "route");
      var gs = npVal(ctx.vals, routes[i].id, "gate");
      if (!rs.trim()) continue;
      var mres = npRouteCovers(rs, dst);
      if (mres.bad) { log.push("✗ " + hostId + ": route " + rs + t({ th: " ผิดรูปแบบ", en: " is malformed" })); return false; }
      if (!mres.ok) continue;
      if (hst.type === "internet" && mres.isDefault) {
        log.push("✗ " + hostId + ": invalid default route on internet");
        return false;
      }
      var g = npIpToInt(gs);
      if (g === null) { log.push("✗ " + hostId + ": gateway " + gs + t({ th: " ไม่ถูกต้อง", en: " is not a valid address" })); return false; }
      log.push("· " + hostId + ": route match " + rs + " → gateway " + gs);
      return npStep(level, ctx, hostId, g, dst, srcIp, true, depth + 1, log);
    }
    log.push("✗ " + hostId + ": destination does not match any route");
    return false;
  }
  function npCheckGoal(level, vals, srcId, dstId) {
    var ctx = npBuild(level, vals);
    var src = npHost(level, srcId), dst = npHost(level, dstId);
    var sIp = npIfIp(src.ifs[0], vals), dIp = npIfIp(dst.ifs[0], vals);
    var badIf = t({ th: ": IP หรือ mask ยังไม่ถูกต้อง (อาจเป็น network หรือ broadcast ของตัวเอง)",
                    en: ": its address or mask is not usable yet (it may be its own network or broadcast)" });
    if (sIp === null) return { fwd: false, rev: false, log: ["✗ " + srcId + badIf] };
    if (dIp === null) return { fwd: false, rev: false, log: ["✗ " + dstId + badIf] };
    var lf = [], lr = [];
    var fwd = npStep(level, ctx, srcId, dIp, dIp, sIp, false, 0, lf);
    var rev = npStep(level, ctx, dstId, sIp, sIp, dIp, false, 0, lr);
    return {
      fwd: fwd, rev: rev,
      log: ["Forward way:"].concat(lf).concat(["Reverse way:"]).concat(lr)
    };
  }

  function npIf(id, ip, mask, eip, emask) {
    return { id: id, ip: ip, mask: mask, eip: !!eip, emask: !!emask };
  }
  var NP_LEVELS = [
    {
      name: { th: "ด่าน 1 · segment เดียว", en: "Level 1 · one segment" },
      brief: {
        th: "A1 กับ B1 ต่ออยู่กับ switch ตัวเดียวกัน = subnet เดียวกัน เติม IP และ mask ให้ B1 คุยกับ A1 ได้",
        en: "A1 and B1 hang off the same switch, so they share one subnet. Give B1 an address and mask that can talk to A1."
      },
      hosts: [
        { id: "A1", type: "host", ifs: [npIf("A1", "192.168.1.10", "255.255.255.0")], routes: [] },
        { id: "B1", type: "host", ifs: [npIf("B1", "", "", 1, 1)], routes: [] }
      ],
      segments: [["A1", "B1"]],
      goals: [["A1", "B1"]],
      solution: { "B1.ip": "192.168.1.20", "B1.mask": "255.255.255.0" },
      hint: {
        th: "ต้องอยู่ในช่วง 192.168.1.1 – 192.168.1.254 และห้ามชนกับ .0 (network), .255 (broadcast) หรือ .10 ของ A1",
        en: "Anything in 192.168.1.1–254 works, except .0 (network), .255 (broadcast) and A1's own .10"
      }
    },
    {
      name: { th: "ด่าน 2 · router + default route", en: "Level 2 · router and a default route" },
      brief: {
        th: "คนละ segment แล้ว — B1 ต้องได้ IP ที่อยู่ subnet เดียวกับขา R1b และต้องมี default route ชี้ไปหา router",
        en: "Two segments now — B1 needs an address in R1b's subnet and a default route pointing at the router."
      },
      hosts: [
        { id: "A1", type: "host", ifs: [npIf("A1", "192.168.1.10", "255.255.255.0")],
          routes: [{ id: "rA1", route: "default", gate: "192.168.1.1" }] },
        { id: "R1", type: "router", ifs: [npIf("R1a", "192.168.1.1", "255.255.255.0"),
                                          npIf("R1b", "10.12.0.1", "255.255.255.0")], routes: [] },
        { id: "B1", type: "host", ifs: [npIf("B1", "", "", 1, 1)],
          routes: [{ id: "rB1", route: "default", gate: "", egate: 1 }] }
      ],
      segments: [["A1", "R1a"], ["R1b", "B1"]],
      goals: [["A1", "B1"]],
      solution: { "B1.ip": "10.12.0.2", "B1.mask": "255.255.255.0", "rB1.gate": "10.12.0.1" },
      hint: {
        th: "R1 ไม่ต้องมี route เลย เพราะทั้งสอง segment ต่ออยู่กับขาของมันโดยตรง — ที่ขาดคือทางกลับของ B1",
        en: "R1 needs no routes at all: both segments are directly attached. What is missing is B1's way back."
      }
    },
    {
      name: { th: "ด่าน 3 · สอง router ต้องรู้จักกันทั้งสองทาง", en: "Level 3 · two routers, both directions" },
      brief: {
        th: "R1 กับ R2 เชื่อมกันด้วยลิงก์ /30 ต่างฝ่ายต้องมี route ไปหา subnet ของอีกฝั่ง ไม่งั้นจะได้ No reverse way",
        en: "R1 and R2 share a /30 link. Each needs a route to the other side's subnet, or you get No reverse way."
      },
      hosts: [
        { id: "A1", type: "host", ifs: [npIf("A1", "192.168.1.10", "255.255.255.0")],
          routes: [{ id: "rA1", route: "default", gate: "192.168.1.1" }] },
        { id: "R1", type: "router", ifs: [npIf("R1a", "192.168.1.1", "255.255.255.0"),
                                          npIf("R1b", "10.0.0.1", "255.255.255.252")],
          routes: [{ id: "rR1", route: "192.168.2.0/24", gate: "", egate: 1 }] },
        { id: "R2", type: "router", ifs: [npIf("R2a", "10.0.0.2", "255.255.255.252"),
                                          npIf("R2b", "192.168.2.1", "255.255.255.0")],
          routes: [{ id: "rR2", route: "", gate: "", eroute: 1, egate: 1 }] },
        { id: "B1", type: "host", ifs: [npIf("B1", "192.168.2.20", "255.255.255.0")],
          routes: [{ id: "rB1", route: "default", gate: "192.168.2.1" }] }
      ],
      segments: [["A1", "R1a"], ["R1b", "R2a"], ["R2b", "B1"]],
      goals: [["A1", "B1"]],
      solution: { "rR1.gate": "10.0.0.2", "rR2.route": "192.168.1.0/24", "rR2.gate": "10.0.0.1" },
      hint: {
        th: "ลิงก์ /30 มี IP ใช้ได้แค่ .1 กับ .2 — gateway ของแต่ละฝั่งคือขาของอีกฝั่งบนลิงก์นั้น",
        en: "A /30 link has exactly two usable addresses, .1 and .2 — each side's gateway is the other side's leg."
      }
    },
    {
      name: { th: "ด่าน 4 · ขาของ router ห้ามซ้อนกัน", en: "Level 4 · a router's legs must not overlap" },
      brief: {
        th: "IP ทุกตัวถูกล็อก เหลือแค่ mask ของสองขา R1 — ลองใส่ 255.255.255.0 ทั้งคู่ดูก่อน แล้วอ่าน log ว่าทำไมถึงตาย",
        en: "Every address is pinned; only R1's two masks are yours. Try 255.255.255.0 on both first and read the log to see why it dies."
      },
      hosts: [
        { id: "A1", type: "host", ifs: [npIf("A1", "172.16.5.10", "255.255.255.128")],
          routes: [{ id: "rA1", route: "default", gate: "172.16.5.1" }] },
        { id: "R1", type: "router", ifs: [npIf("R1a", "172.16.5.1", "", 0, 1),
                                          npIf("R1b", "172.16.5.129", "", 0, 1)], routes: [] },
        { id: "B1", type: "host", ifs: [npIf("B1", "172.16.5.140", "255.255.255.128")],
          routes: [{ id: "rB1", route: "default", gate: "172.16.5.129" }] }
      ],
      segments: [["A1", "R1a"], ["R1b", "B1"]],
      goals: [["A1", "B1"]],
      solution: { "R1a.mask": "255.255.255.128", "R1b.mask": "255.255.255.128" },
      hint: {
        th: "/24 ทำให้ทั้งสองขาครอบ .140 พร้อมกัน → multiple interface match. /25 แบ่งที่ .0 กับ .128 พอดี: .1 กับ .10 อยู่ก้อนล่าง ส่วน .129 กับ .140 อยู่ก้อนบน",
        en: "With /24 both legs cover .140 at once → multiple interface match. A /25 splits at .0 and .128: .1 and .10 in the lower block, .129 and .140 in the upper."
      }
    },
    {
      name: { th: "ด่าน 5 · Internet, IP สาธารณะ, ห้าม default route", en: "Level 5 · Internet, public addresses, no default route" },
      brief: {
        th: "A1 ต้องคุยกับ Internet ได้: ต้องใช้ IP สาธารณะ, R1 ต้องมีทางออก และ Internet ต้องมี route เจาะจงกลับมา (ห้าม default)",
        en: "A1 must reach the Internet: a public address, a way out on R1, and an explicit route back on the Internet node — never a default."
      },
      hosts: [
        { id: "A1", type: "host", ifs: [npIf("A1", "", "", 1, 1)],
          routes: [{ id: "rA1", route: "default", gate: "104.198.7.1" }] },
        { id: "R1", type: "router", ifs: [npIf("R1a", "104.198.7.1", "255.255.255.0"),
                                          npIf("R1b", "41.66.1.2", "255.255.255.252")],
          routes: [{ id: "rR1", route: "default", gate: "", egate: 1 }] },
        { id: "NET", type: "internet", ifs: [npIf("NET", "41.66.1.1", "255.255.255.252")],
          routes: [{ id: "rNET", route: "", gate: "", eroute: 1, egate: 1 }] }
      ],
      segments: [["A1", "R1a"], ["R1b", "NET"]],
      goals: [["A1", "NET"]],
      solution: {
        "A1.ip": "104.198.7.10", "A1.mask": "255.255.255.0",
        "rR1.gate": "41.66.1.1", "rNET.route": "104.198.7.0/24", "rNET.gate": "41.66.1.2"
      },
      hint: {
        th: "default route ของ A1 ถูกล็อกไว้ที่ 104.198.7.1 ซึ่งบอกว่า segment นี้ต้องเป็น 104.198.7.0/24 — และ 192.168.x จะโดน Internet ทิ้ง",
        en: "A1's locked default gateway of 104.198.7.1 dictates the 104.198.7.0/24 segment — and any 192.168.x would be dropped by the Internet node."
      }
    }
  ];

  function npInitVals(level) {
    var v = {};
    level.hosts.forEach(function (hst) {
      hst.ifs.forEach(function (f) { v[f.id + ".ip"] = f.ip; v[f.id + ".mask"] = f.mask; });
      (hst.routes || []).forEach(function (r) {
        v[r.id + ".route"] = r.route; v[r.id + ".gate"] = r.gate;
      });
    });
    return v;
  }

  function NetPracticeDemo() {
    var sL = useState(0); var li = sL[0], setLi = sL[1];
    var level = NP_LEVELS[li];
    var sV = useState(npInitVals(level)); var vals = sV[0], setVals = sV[1];
    var sR = useState(null); var res = sR[0], setRes = sR[1];
    var sH = useState(false); var showHint = sH[0], setShowHint = sH[1];

    function loadLevel(i) {
      setLi(i); setVals(npInitVals(NP_LEVELS[i])); setRes(null); setShowHint(false);
    }
    function set(key, v) {
      var nv = {}; for (var k in vals) if (vals.hasOwnProperty(k)) nv[k] = vals[k];
      nv[key] = v; setVals(nv); setRes(null);
    }
    function check() {
      setRes(level.goals.map(function (g) {
        var r = npCheckGoal(level, vals, g[0], g[1]);
        r.src = g[0]; r.dst = g[1];
        return r;
      }));
    }
    function reveal() {
      var nv = {}; for (var k in vals) if (vals.hasOwnProperty(k)) nv[k] = vals[k];
      for (var s in level.solution) if (level.solution.hasOwnProperty(s)) nv[s] = level.solution[s];
      setVals(nv); setRes(null);
    }

    function field(key, ph, editable) {
      if (!editable) return h("span", { className: "np-locked" }, npVal(vals, key.split(".")[0], key.split(".")[1]) || "—");
      return h("input", {
        className: "np-in", value: vals[key] || "", placeholder: ph, spellCheck: false,
        onChange: function (e) { set(key, e.target.value); }
      });
    }

    var kindLabel = {
      host: { th: "เครื่อง", en: "host" },
      router: { th: "เราเตอร์", en: "router" },
      internet: { th: "Internet", en: "internet" }
    };
    var segNames = level.segments.map(function (seg, i) {
      return "S" + (i + 1) + " = { " + seg.join(", ") + " }";
    }).join("   ");

    return h("div", { className: "demo" },
      h("p", { className: "demo-hint" }, t({
        th: "กระดานฝึกแบบเดียวกับ NetPractice — เติมช่องสีขาว แล้วกด 'ตรวจ' ระบบจะเดินเส้นทางทั้งขาไปและขากลับให้ดูทีละ hop",
        en: "A NetPractice-style board. Fill the white fields and press Check; the engine walks both the forward and the reverse path hop by hop."
      })),
      h("div", { className: "np-levels" },
        NP_LEVELS.map(function (lv, i) {
          return h("button", {
            key: i, className: "np-lvl" + (i === li ? " active" : ""),
            onClick: function () { loadLevel(i); }
          }, t(lv.name));
        })
      ),
      h("p", { className: "np-brief" }, t(level.brief)),
      h("div", { className: "np-seg" }, t({ th: "segment (สิ่งที่ต่อสายเดียวกัน): ", en: "segments (one wire each): " }) + segNames),
      h("div", { className: "np-board" },
        level.hosts.map(function (hst) {
          return h("div", { className: "np-card " + hst.type, key: hst.id },
            h("div", { className: "np-card-head" },
              h("b", null, hst.id),
              h("span", { className: "np-kind" }, t(kindLabel[hst.type]))
            ),
            hst.ifs.map(function (f) {
              return h("div", { className: "np-row", key: f.id },
                h("span", { className: "np-lbl" }, f.id),
                h("span", { className: "np-cell" }, "IP ", field(f.id + ".ip", "0.0.0.0", f.eip)),
                h("span", { className: "np-cell" }, "mask ", field(f.id + ".mask", "255.255.255.0", f.emask))
              );
            }),
            (hst.routes || []).map(function (r) {
              return h("div", { className: "np-row route", key: r.id },
                h("span", { className: "np-lbl" }, t({ th: "route", en: "route" })),
                h("span", { className: "np-cell" }, field(r.id + ".route", "0.0.0.0/0", r.eroute)),
                h("span", { className: "np-cell" }, "→ ", field(r.id + ".gate", "0.0.0.0", r.egate))
              );
            })
          );
        })
      ),
      h("div", { className: "demo-bar" },
        h("button", { className: "demo-btn", onClick: check }, t({ th: "ตรวจ", en: "Check" })),
        h("button", { className: "demo-btn alt", onClick: function () { setShowHint(!showHint); } },
          t({ th: "คำใบ้", en: "Hint" })),
        h("button", { className: "demo-btn alt", onClick: reveal }, t({ th: "เฉลย", en: "Solution" })),
        h("button", { className: "demo-btn alt", onClick: function () { loadLevel(li); } },
          t({ th: "รีเซ็ต", en: "Reset" }))
      ),
      showHint ? h("div", { className: "note" }, t(level.hint)) : null,
      res ? h("div", { className: "np-res" },
        res.map(function (r, i) {
          var ok = r.fwd && r.rev;
          return h("div", { className: "np-goal" + (ok ? " ok" : ""), key: i },
            h("div", { className: "np-goal-head" },
              r.src + " ⇄ " + r.dst + " : ",
              h("b", null, ok ? "OK — Congratulations!!"
                : (r.fwd ? "KO — No reverse way" : "KO — No forward way"))
            ),
            h("pre", { className: "np-log" }, r.log.join("\n"))
          );
        })
      ) : null
    );
  }

  var DEMOS = {
    push_swap: PushSwapDemo,
    pipex: PipexDemo,
    so_long: SoLongDemo,
    fractol: FractalDemo,
    netpractice: NetPracticeDemo
  };

  /* ============================================================
     FLOW VISUALIZER — ไล่ดูว่า input วิ่งผ่านฟังก์ชันไหนบ้าง
     ข้อมูลต่อโปรเจกต์: { input, steps:[{fn,file,depth,note,data}] }
     ============================================================ */
  var FLOWS = {
    push_swap: { input: "./push_swap 3 2 5 1 4", steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "จุดเริ่ม: รับ argv → สั่ง parse → normalize → sort → free", data: "argv = [3, 2, 5, 1, 4]", vars: [
        { n: "argv", v: "[\"3\",\"2\",\"5\",\"1\",\"4\"]", d: "อาร์กิวเมนต์ดิบจาก OS" },
        { n: "ps", d: "struct t_ps ตัวเดียววิ่งทั่วโปรแกรม (ถือ stack A,B)", w: true } ] },
      { fn: "parse_args()", file: "parse.c", depth: 1, note: "เตรียม struct t_ps แล้วสร้าง stack A จาก argv", data: "ต้องการ: A = 3 2 5 1 4 (บนสุด = 3)", vars: [
        { n: "ps->a", d: "หัว linked list ของ stack A", w: true },
        { n: "ps->b", v: "NULL", d: "stack B ยังว่าง" } ] },
      { fn: "valid_int() + ft_atoi()", file: "validate.c", depth: 2, note: "ตรวจแต่ละ arg เป็น int 32-bit ที่ถูกต้อง + ไม่ซ้ำ แล้วแปลงเป็นเลข", data: "\"3\" → 3 ✓   \"2\" → 2 ✓ ...", vars: [
        { n: "argv[i]", v: "\"3\"", d: "string ที่กำลังตรวจ" },
        { n: "n", v: "3", d: "ค่า int ที่แปลงได้", w: true } ] },
      { fn: "new_node() + append_node()", file: "stack.c", depth: 2, note: "สร้าง node ใหม่ต่อท้าย linked list A", data: "A: 3 → 2 → 5 → 1 → 4", vars: [
        { n: "node->val", v: "3", d: "เก็บค่าจริงของเลข", w: true },
        { n: "ps->a", d: "ถูกต่อ node ใหม่เข้าท้าย list", w: true } ] },
      { fn: "normalize()", file: "normalize.c", depth: 1, note: "แปลงค่าจริงเป็น 'อันดับ' (rank) เก็บใน node->idx — algorithm ใช้ idx ไม่ใช้ค่าจริง", data: "idx: 3→2, 2→1, 5→4, 1→0, 4→3", vars: [
        { n: "node->idx", v: "0..n-1", d: "อันดับของค่านี้ (algorithm ใช้ตัวนี้)", w: true },
        { n: "count_smaller", d: "นับว่ามีกี่ตัวเล็กกว่า node->val" } ] },
      { fn: "is_sorted()", file: "utils.c", depth: 1, note: "เช็คว่าเรียงแล้วหรือยัง — ยัง → ไปเรียงต่อ", data: "false → ต้องเรียง", vars: [
        { n: "ps->a", d: "อ่าน idx ทุก node เทียบว่าเรียงขึ้นไหม" } ] },
      { fn: "sort_small()", file: "sort_small.c", depth: 1, note: "n = 5 ≤ 5 → ใช้เคสเล็ก: ดัน 2 ตัวลง B ด้วย pb แล้วเรียง 3 ที่เหลือ", data: "n = 5  → เส้นทางเคสเล็ก", vars: [
        { n: "n", v: "5", d: "= stack_size(ps->a) ตัดสินกลยุทธ์" } ] },
      { fn: "sort_3() + bring_to_top()", file: "sort_small.c", depth: 2, note: "เรียง 3 ตัวบน A ด้วย sa/ra/rra, ดึง idx เป้าขึ้นยอดด้วยทางที่สั้นที่สุด", data: "เลือก ra หรือ rra ตามระยะ", vars: [
        { n: "target", d: "idx เป้าที่อยากดึงขึ้นยอด" },
        { n: "pos", d: "ตำแหน่งของ target ใน stack" } ] },
      { fn: "pa / pb / ra / ...", file: "ops_*.c", depth: 2, note: "ทุกคำสั่งแก้ stack จริง + write ชื่อ op ออก stdout (ตัวเดียวที่พิมพ์)", data: "stdout: pb\\npb\\nra\\npa\\npa\\n", vars: [
        { n: "ps->a / ps->b", d: "node ถูกย้าย/หมุนระหว่าง 2 stack", w: true },
        { n: "stdout", v: "\"pb\\n\"", d: "เขียนชื่อ op (ถ้าไม่ใช่โหมด silent)", w: true } ] },
      { fn: "ps_free()", file: "utils.c", depth: 1, note: "คืน memory ทั้ง list A และ B ก่อนจบโปรแกรม", data: "A, B = NULL (ไม่มี leak)", vars: [
        { n: "ps->a / ps->b", v: "NULL", d: "free ทุก node แล้วเซ็ตเป็น NULL", w: true } ] },
    ]},
    pipex: { input: './pipex infile "ls -l" "wc -l" outfile', steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "ตรวจ argc == 5 แล้วเรียก pipex", data: "argv ครบ 5 ✓", vars: [
        { n: "argc", v: "5", d: "ต้องมี: prog infile cmd1 cmd2 outfile" },
        { n: "envp", d: "ตาราง environment (ใช้หา PATH ภายหลัง)" } ] },
      { fn: "pipex()", file: "pipex.c", depth: 1, note: "ลำดับงานหลัก: เปิดไฟล์ → สร้าง pipe → fork", data: "—", vars: [
        { n: "fio[2]", d: "เก็บ fd ของ infile/outfile", w: true },
        { n: "pfd[2]", d: "เก็บ fd ปลายท่อ pipe", w: true } ] },
      { fn: "open_files()", file: "pipex.c", depth: 2, note: "เปิด infile (อ่าน) + outfile (เขียน) เก็บ fd ลง array", data: "fio[0]=3 (infile), fio[1]=4 (outfile)", vars: [
        { n: "fio[0]", v: "3", d: "fd ของ infile (อ่าน)", w: true },
        { n: "fio[1]", v: "4", d: "fd ของ outfile (เขียน/สร้าง)", w: true } ] },
      { fn: "pipe(pfd)", file: "pipex.c", depth: 2, note: "สร้างท่อเชื่อม 2 process", data: "pfd[0]=5 (read), pfd[1]=6 (write)", vars: [
        { n: "pfd[0]", v: "5", d: "ปลายอ่านของท่อ", w: true },
        { n: "pfd[1]", v: "6", d: "ปลายเขียนของท่อ", w: true } ] },
      { fn: "fork_children()", file: "pipex.c", depth: 2, note: "fork ลูก 2 ตัว", data: "child1, child2", vars: [
        { n: "pid", v: "0 / >0", d: "fork คืน 0 ในลูก, PID ลูกในแม่", w: true } ] },
      { fn: "child1()", file: "pipex.c", depth: 3, note: "ลูก 1: dup2(stdin←infile, stdout←pipe) แล้ว exec_cmd(\"ls -l\")", data: "stdin=infile, stdout=pipe", vars: [
        { n: "STDIN_FILENO", v: "← fio[0]", d: "dup2 ให้ stdin มาจาก infile", w: true },
        { n: "STDOUT_FILENO", v: "← pfd[1]", d: "dup2 ให้ stdout เขียนเข้าท่อ", w: true } ] },
      { fn: "exec_cmd() → get_path() → execve()", file: "path.c", depth: 4, note: "ft_split + ค้น $PATH หา /bin/ls แล้ว execve แทนที่ process", data: "execve(\"/bin/ls\", ...)", vars: [
        { n: "args", v: "[\"ls\",\"-l\",NULL]", d: "ft_split(cmd, ' ')", w: true },
        { n: "path", v: "\"/bin/ls\"", d: "full path ที่ค้นเจอใน $PATH", w: true } ] },
      { fn: "child2()", file: "pipex.c", depth: 3, note: "ลูก 2: dup2(stdin←pipe, stdout←outfile) แล้ว exec_cmd(\"wc -l\")", data: "stdin=pipe, stdout=outfile", vars: [
        { n: "STDIN_FILENO", v: "← pfd[0]", d: "อ่าน input จากท่อ (= output ของ ls)", w: true },
        { n: "STDOUT_FILENO", v: "← fio[1]", d: "เขียนผลลง outfile", w: true } ] },
      { fn: "parent: close() + waitpid()", file: "pipex.c", depth: 2, note: "แม่ปิด fd ทุกตัว (สำคัญ! กัน wc ค้างรอ EOF) แล้วรอลูกจบ", data: "outfile ได้ผลลัพธ์", vars: [
        { n: "pfd, fio", d: "แม่ปิด fd ทุกตัวที่ไม่ใช้ → EOF ส่งถึง wc", w: true },
        { n: "status", d: "waitpid เก็บสถานะการจบของลูก", w: true } ] },
    ]},
    so_long: { input: "./so_long map.ber", steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "ตรวจ ac == 2, ft_bzero(&game) แล้ว parse → validate → mlx → render → loop", data: "&game (struct เดียววิ่งทั่วโปรแกรม)", vars: [
        { n: "game", d: "struct t_game ถือ map/mlx/ผู้เล่นทั้งหมด", w: true } ] },
      { fn: "parse_map()", file: "parse.c", depth: 1, note: "อ่านไฟล์ → สร้าง grid → นับตัวอักษร", data: "—", vars: [
        { n: "game.map.grid", d: "ตาราง 2 มิติของแผนที่ (กำลังจะถูกสร้าง)", w: true } ] },
      { fn: "read_file()", file: "parse.c", depth: 2, note: "เช็คนามสกุล .ber + open + read + ft_strdup", data: "content (string ทั้งไฟล์)", vars: [
        { n: "content", d: "เนื้อไฟล์ทั้งก้อนเป็น string เดียว", w: true } ] },
      { fn: "build_grid()", file: "parse.c", depth: 2, note: "ft_split(content, '\\n') เป็นตาราง 2 มิติ", data: "grid = [\"111\",\"1P0\",...] (char**)", vars: [
        { n: "grid", v: "char**", d: "แต่ละสมาชิก = 1 แถวของแผนที่", w: true } ] },
      { fn: "count_chars() → scan_tile()", file: "parse.c", depth: 2, note: "นับ C/E/P ทุกช่อง, เจอ 'P' → เก็บ px,py แล้วเปลี่ยนช่องเป็น '0'", data: "P=1, C=2, E=1, px=1 py=1", vars: [
        { n: "game.px / game.py", v: "1, 1", d: "พิกัดผู้เล่นที่ดึงออกจาก grid", w: true },
        { n: "collectibles", v: "2", d: "จำนวนเหรียญที่ต้องเก็บ", w: true } ] },
      { fn: "validate_map() → flood_fill()", file: "validate.c", depth: 1, note: "copy grid แล้ว flood fill จาก P เช็คว่าเก็บเหรียญครบ + ถึงทางออกได้", data: "reachable ✓", vars: [
        { n: "copy", d: "สำเนา grid (flood fill ทำลายของจริงไม่ได้)", w: true },
        { n: "reachable", v: "true", d: "ผลว่าถึง C/E ครบไหม" } ] },
      { fn: "init_mlx() + load_textures()", file: "init.c", depth: 1, note: "เปิดหน้าต่าง + โหลด xpm 5 รูป (กำแพง/พื้น/ผู้เล่น/เหรียญ/ประตู)", data: "win, img × 5", vars: [
        { n: "game.mlx / game.win", d: "ตัวเชื่อม MiniLibX + หน้าต่าง", w: true },
        { n: "game.img[]", d: "texture 5 รูปที่โหลดจาก xpm", w: true } ] },
      { fn: "render_map()", file: "render.c", depth: 1, note: "วาดทุก tile ตาม grid ลงหน้าต่าง", data: "ภาพเฟรมแรก", vars: [
        { n: "grid[y][x]", d: "อ่านตัวอักษรแต่ละช่อง → เลือก texture วาด" } ] },
      { fn: "mlx_loop + handle_key()", file: "hooks.c", depth: 1, note: "รอ event: กดลูกศร → try_move → handle_tile → render ใหม่", data: "—", vars: [
        { n: "key", d: "keycode ที่ผู้ใช้กด (W/A/S/D/ลูกศร/ESC)" } ] },
      { fn: "try_move()", file: "move.c", depth: 2, note: "ขยับ px,py ถ้าไม่ชนกำแพง, เหยียบ 'C' → เก็บเหรียญ, ถึง 'E' ครบ → ชนะ", data: "moves++ ; collected++", vars: [
        { n: "game.px / game.py", d: "ตำแหน่งใหม่ของผู้เล่น (ถ้าไม่ชน '1')", w: true },
        { n: "game.collected", d: "เพิ่มเมื่อเหยียบ 'C'", w: true },
        { n: "game.moves", d: "นับก้าวเดิน พิมพ์ทุกครั้ง", w: true } ] },
    ]},
    fractol: { input: "./fractol julia -0.7 0.27015", steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "parse → init_view → init_mlx → render → loop", data: "—", vars: [
        { n: "f", d: "struct t_fractol ถือสถานะทั้งหมด (กรอบ/ชนิด/mlx)", w: true } ] },
      { fn: "parse_args() → parse_julia()", file: "parse.c", depth: 1, note: "เลือกชนิด fractal + รับค่า c จาก argv (Julia)", data: "type=JULIA, c = -0.7 + 0.27i", vars: [
        { n: "f.type", v: "JULIA", d: "ชนิด fractal ที่จะวาด", w: true },
        { n: "f.c_re / f.c_im", v: "-0.7, 0.27", d: "ค่าคงที่ c ของ Julia (จาก argv)", w: true } ] },
      { fn: "init_view()", file: "init.c", depth: 1, note: "ตั้งกรอบ min/max re,im + max_iter (มุมมองเริ่มต้น)", data: "re:[-2,2] im:[-1.5,1.5] iter=100", vars: [
        { n: "f.min_re..max_im", d: "กรอบของระนาบเชิงซ้อนที่มองอยู่", w: true },
        { n: "f.max_iter", v: "100", d: "จำนวนรอบสูงสุด (ความลึก)", w: true } ] },
      { fn: "init_mlx()", file: "init.c", depth: 1, note: "เปิดหน้าต่าง + image buffer", data: "addr, bpp, line_len", vars: [
        { n: "f.addr", d: "pointer ไปยัง buffer ภาพ (เขียน pixel ตรงนี้)", w: true },
        { n: "f.bpp / f.line_len", d: "ใช้คำนวณ offset ของ pixel", w: true } ] },
      { fn: "render()", file: "render.c", depth: 1, note: "วนทุก pixel ของจอ", data: "WIDTH × HEIGHT pixels", vars: [
        { n: "x, y", d: "พิกัด pixel ที่กำลังวน (loop ซ้อน)", w: true } ] },
      { fn: "map pixel → complex", file: "render.c", depth: 2, note: "แปลง (x,y) บนจอ → จุด (re,im) บนระนาบเชิงซ้อน", data: "(400,300) → (re, im)", vars: [
        { n: "re", d: "= min_re + x/WIDTH*(max_re-min_re)", w: true },
        { n: "im", d: "= max_im - y/HEIGHT*(max_im-min_im) (กลับด้าน)", w: true } ] },
      { fn: "compute_iter() → julia_iter()", file: "fractal.c", depth: 2, note: "วน z = z² + c จนกว่า |z|² > 4 → คืนจำนวนรอบ", data: "i = 37 รอบ", vars: [
        { n: "z_re, z_im", d: "ค่า z ที่อัปเดตทุกรอบ (z = z² + c)", w: true },
        { n: "i", v: "37", d: "จำนวนรอบก่อน 'หนี' → เอาไปทำสี", w: true } ] },
      { fn: "get_color() → put_pixel()", file: "color.c", depth: 2, note: "แปลงจำนวนรอบเป็นสี เขียนลง image buffer ตรง ๆ", data: "0xRRGGBB → f.addr[offset]", vars: [
        { n: "color", v: "0xRRGGBB", d: "สีที่ map จากจำนวนรอบ i", w: true },
        { n: "f.addr[offset]", d: "เขียนสีลง buffer ที่ตำแหน่ง (x,y)", w: true } ] },
      { fn: "mlx_put_image_to_window", file: "render.c", depth: 1, note: "โยนทั้งภาพขึ้นจอครั้งเดียว (เร็ว)", data: "—", vars: [
        { n: "f.img", d: "ภาพทั้งเฟรมถูกส่งขึ้นหน้าต่าง" } ] },
      { fn: "mlx_loop + hooks", file: "hooks.c", depth: 1, note: "รอ event: เมาส์ zoom / ปุ่ม move/iter → render ใหม่", data: "—", vars: [
        { n: "f.min/max, f.max_iter", d: "event แก้ค่าเหล่านี้แล้วเรียก render ใหม่", w: true } ] },
    ]},
    minitalk: { input: './client 12345 "Hi"', steps: [
      { fn: "main()  [client]", file: "client.c", depth: 0, note: "parse argv: pid + ข้อความ, ตรวจ pid > 0", data: "pid = 12345, msg = \"Hi\"", vars: [
        { n: "pid", v: "12345", d: "PID ของ server (จาก ft_atoi(argv[1]))", w: true },
        { n: "argv[2]", v: "\"Hi\"", d: "ข้อความที่จะส่งทีละตัวอักษร" } ] },
      { fn: "send_byte('H')", file: "client.c", depth: 1, note: "หั่น 'H' (0x48 = 0100 1000) เป็น 8 bit ส่ง MSB-first", data: "bits: 0 1 0 0 1 0 0 0", vars: [
        { n: "c", v: "'H' = 72", d: "ตัวอักษรที่กำลังส่ง (unsigned char)" },
        { n: "bit", v: "8 → 1", d: "ตัวนับ bit วนจาก MSB ลงมา", w: true } ] },
      { fn: "kill(pid, SIGUSR1/2)", file: "client.c", depth: 2, note: "ยิงทีละ bit: 1 → SIGUSR2, 0 → SIGUSR1 แล้ว usleep(400)", data: "→ ส่งสัญญาณไปยัง server", vars: [
        { n: "(c >> bit) & 1", d: "ค่า bit ที่ตำแหน่งนั้น (0 หรือ 1)" },
        { n: "usleep(400)", d: "หน่วงกัน signal หล่น (mandatory)" } ] },
      { fn: "handle_signal()  [server]", file: "server.c", depth: 3, note: "server รับแต่ละ signal: c = c << 1, ถ้า USR2 ก็ | 1, bits++", data: "c กำลังก่อตัวทีละ bit", vars: [
        { n: "static c", d: "byte ที่กำลังประกอบ (คงค่าข้ามการเรียก handler)", w: true },
        { n: "static bits", v: "0 → 8", d: "นับว่าประกอบครบ 8 bit หรือยัง", w: true } ] },
      { fn: "ft_printf('H')", file: "server.c", depth: 4, note: "ครบ 8 bit → c = 72 = 'H' → พิมพ์ออกจอ", data: "stdout: H", vars: [
        { n: "c", v: "72 = 'H'", d: "ครบ byte แล้ว → พิมพ์" },
        { n: "c, bits", v: "0, 0", d: "รีเซ็ตเพื่อเริ่ม byte ถัดไป", w: true } ] },
      { fn: "send_byte('i')", file: "client.c", depth: 1, note: "ทำซ้ำกับตัวอักษร 'i' (8 signal อีกชุด)", data: "→ server พิมพ์ i", vars: [
        { n: "c", v: "'i' = 105", d: "ตัวอักษรถัดไป" } ] },
      { fn: "send_byte('\\0')", file: "client.c", depth: 1, note: "ส่งตัว null ปิดท้ายข้อความ", data: "→ บอก server ว่า 'จบแล้ว'", vars: [
        { n: "c", v: "'\\0' = 0", d: "null terminator = สัญญาณจบ" } ] },
      { fn: "handle_signal() → newline", file: "server.c", depth: 3, note: "server เห็น c == 0 ('\\0') → ขึ้นบรรทัดใหม่ = จบ message", data: "stdout: Hi\\n", vars: [
        { n: "c", v: "0", d: "ตรวจเจอ '\\0' → ft_printf(\"\\n\")" } ] },
    ]},
    fdf: { input: "./fdf maps/42.fdf", steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "argc == 2 → ft_bzero → parse → init_mlx → camera → render → loop", data: "&fdf (struct กลาง)", vars: [
        { n: "fdf", d: "struct t_fdf ถือ map + cam + mlx ทั้งหมด", w: true } ] },
      { fn: "parse_map()", file: "parse.c", depth: 1, note: "อ่านไฟล์เป็นตาราง z และ color", data: "—", vars: [
        { n: "map.z / map.color", d: "ตาราง 2 มิติ (int **) กำลังจะถูกจอง+เติม", w: true } ] },
      { fn: "count_lines()", file: "parse.c", depth: 2, note: "เปิดไฟล์นับจำนวนแถว (รอบแรก — เพื่อจองพอดี)", data: "height = N", vars: [
        { n: "map.height", v: "N", d: "จำนวนแถว = จำนวนบรรทัดในไฟล์", w: true } ] },
      { fn: "read_lines()", file: "parse.c", depth: 2, note: "อ่านทุกบรรทัดเป็น char** (รอบสอง)", data: "rows[]", vars: [
        { n: "rows", v: "char**", d: "เก็บทุกบรรทัดของไฟล์", w: true } ] },
      { fn: "fill_grid() → parse_token()", file: "token.c", depth: 2, note: "แยกค่า z และสี (\"z\" หรือ \"z,0xRRGGBB\") ลงตาราง", data: "map.z[y][x], map.color[y][x]", vars: [
        { n: "map.z[y][x]", d: "ความสูงของจุด (จาก ft_atoi)", w: true },
        { n: "map.z_min / z_max", d: "อัปเดตช่วงความสูง (ใช้ auto-fit)", w: true } ] },
      { fn: "init_mlx()", file: "main.c", depth: 1, note: "เปิดหน้าต่าง + สร้าง image buffer", data: "addr, bpp, line_len", vars: [
        { n: "f.addr", d: "pointer ไป buffer ภาพ (เขียน pixel ตรงนี้)", w: true },
        { n: "f.bpp / f.line_len", d: "ใช้คำนวณ offset ของ pixel", w: true } ] },
      { fn: "setup_camera()", file: "project.c", depth: 1, note: "auto-fit: คำนวณ zoom / offset / z_scale ให้ภาพพอดีจอ", data: "zoom, off_x, off_y, z_scale", vars: [
        { n: "cam.zoom", d: "เลือกค่าเล็กกว่าระหว่างแนวกว้าง/สูง", w: true },
        { n: "cam.off_x / off_y", v: "WIN/2", d: "เลื่อนภาพไปกลางจอ", w: true },
        { n: "cam.z_scale", d: "ปรับความสูงไม่ให้ทะลุจอ", w: true } ] },
      { fn: "render()", file: "pixel.c", depth: 1, note: "วนทุกจุด วาดเส้นไปขวา (x+1) และลง (y+1)", data: "—", vars: [
        { n: "x, y", d: "จุดบนตารางที่กำลังวน", w: true } ] },
      { fn: "project()", file: "project.c", depth: 2, note: "แปลงพิกัด 3D (x,y,z) → 2D จอ ด้วยสูตร isometric", data: "(x,y,z) → (screen_x, screen_y)", vars: [
        { n: "p.x", d: "= (xx-yy)·cos30·zoom + off_x", w: true },
        { n: "p.y", d: "= (xx+yy)·sin30·zoom - zz + off_y", w: true } ] },
      { fn: "draw_line() → lerp_color() → put_pixel()", file: "draw.c", depth: 2, note: "Bresenham วาดเส้น ไล่สีตามแนว เขียน pixel ลง buffer", data: "pixels ลง f.addr", vars: [
        { n: "err", d: "error term ของ Bresenham (ตัดสินขยับแกนไหน)", w: true },
        { n: "f.addr[offset]", d: "เขียนสี (lerp) ลง buffer", w: true } ] },
      { fn: "mlx_put_image_to_window", file: "pixel.c", depth: 1, note: "โยนทั้งภาพขึ้นจอครั้งเดียว", data: "—", vars: [
        { n: "f.img", d: "ภาพทั้งเฟรมถูกส่งขึ้นหน้าต่าง" } ] },
      { fn: "mlx_loop + key_hook()", file: "hooks.c", depth: 1, note: "รอ event: ESC / ปุ่มปิด → close_hook คืน memory แล้ว exit", data: "—", vars: [
        { n: "key", d: "keycode (ESC = 65307 → close_hook)" } ] },
    ]},
    philosophers: { input: "./philo 5 800 200 200", steps: [
      { fn: "main()", file: "main.c", depth: 0, note: "parse → init → start_threads → monitor → join → cleanup", data: "5 คน, t_die=800, t_eat=200, t_sleep=200", vars: [
        { n: "data", d: "struct t_data สถานะกลางที่ทุก thread แชร์", w: true } ] },
      { fn: "parse_args()", file: "parse.c", depth: 1, note: "อ่าน + ตรวจ argument (ตัวเลขบวก)", data: "num_philo=5 ...", vars: [
        { n: "num_philo", v: "5", d: "จำนวนนักปรัชญา = จำนวน thread/ส้อม", w: true },
        { n: "time_to_die", v: "800", d: "ms ที่ไม่กินแล้วตาย", w: true } ] },
      { fn: "init_data()", file: "init.c", depth: 1, note: "จอง forks/philos + init mutex ทุกตัว (forks, meal_lock, print, stop)", data: "5 forks (mutex), 5 philos", vars: [
        { n: "forks[]", d: "อาเรย์ของ mutex (1 อัน = 1 ส้อม)", w: true },
        { n: "philos[i].left/right_fork", d: "ชี้ไป forks[i] และ forks[(i+1)%n]", w: true } ] },
      { fn: "start_threads()", file: "main.c", depth: 1, note: "pthread_create × 5, ตั้ง last_meal = start_time", data: "5 threads เริ่มวิ่ง", vars: [
        { n: "philos[i].thread", d: "pthread_t ของแต่ละคน", w: true },
        { n: "philos[i].last_meal", v: "start_time", d: "ตั้งนาฬิกาตายตอนเริ่ม (สำคัญ!)", w: true } ] },
      { fn: "routine()", file: "routine.c", depth: 2, note: "[แต่ละ thread] วน: กิน → นอน → คิด จนกว่าจะ stop", data: "คนคู่หน่วงครึ่ง t_eat ก่อนเริ่ม", vars: [
        { n: "philo", d: "ข้อมูลเฉพาะตัวของ thread นี้ (arg)" },
        { n: "philo->id % 2", d: "คู่/คี่ → ตัดสินลำดับหยิบส้อม" } ] },
      { fn: "take_forks()", file: "routine.c", depth: 3, note: "lock ส้อม 2 อัน — คนคู่ซ้ายก่อน / คนคี่ขวาก่อน (กัน deadlock)", data: "lock(left), lock(right)", vars: [
        { n: "left_fork / right_fork", d: "mutex 2 อันที่ต้อง lock ทั้งคู่ก่อนกิน", w: true } ] },
      { fn: "do_eat()", file: "routine.c", depth: 3, note: "last_meal = now (ใต้ meal_lock), กิน t_eat ms, meals_eaten++, วางส้อม", data: "last_meal อัปเดต → ไม่ตาย", vars: [
        { n: "philo->last_meal", v: "now", d: "รีเซ็ตนาฬิกาตาย (ใต้ meal_lock)", w: true },
        { n: "philo->meals_eaten", d: "+1 ทุกมื้อ (ใช้เช็ค must_eat)", w: true } ] },
      { fn: "monitor()", file: "monitor.c", depth: 1, note: "[main thread] วนเช็คทุกคนทุก ~500µs", data: "—", vars: [
        { n: "data->stop", d: "อ่านผ่าน is_stopped() — หยุดเมื่อเป็น 1" } ] },
      { fn: "someone_died()", file: "monitor.c", depth: 2, note: "now − last_meal > t_die ? → set_stop + พิมพ์ \"died\" (ใต้ print_lock)", data: "ปกติ: ทุกคนยังกินทัน → ไม่ตาย", vars: [
        { n: "since", d: "= now − last_meal (อ่านใต้ meal_lock)" },
        { n: "data->stop", v: "1", d: "ตั้งก่อนพิมพ์ died (กันบรรทัดอื่นแทรก)", w: true } ] },
      { fn: "join_threads() + cleanup()", file: "main.c", depth: 1, note: "รอ thread จบ → destroy mutex ทุกตัว → free", data: "ไม่มี leak / ไม่มี zombie", vars: [
        { n: "forks[] / meal_lock", d: "pthread_mutex_destroy ทุกตัว แล้ว free", w: true } ] },
    ]},
    cpp_module_00: { input: "./account", steps: [
      { fn: "main()", file: "tests.cpp", depth: 0, note: "สร้าง vector<Account> 8 ตัว จากเงินตั้งต้น (ไฟล์ทดสอบตายตัว)", data: "amounts = {42, 54, 957, ...}", vars: [
        { n: "amounts[]", v: "{42,54,...}", d: "เงินตั้งต้นของแต่ละบัญชี" },
        { n: "accounts", d: "std::vector<Account> 8 ตัว", w: true } ] },
      { fn: "Account::Account(42)", file: "Account.cpp", depth: 1, note: "constructor: _accountIndex = _nbAccounts(0), _nbAccounts++, _totalAmount += 42, พิมพ์ ;created", data: "index:0;amount:42;created", vars: [
        { n: "_accountIndex", v: "0", d: "= _nbAccounts ก่อน ++ (นับ 0,1,2..)", w: true },
        { n: "_nbAccounts", v: "0 → 1", d: "static: จำนวนบัญชีรวม (ทุก object แชร์)", w: true },
        { n: "_totalAmount", v: "+= 42", d: "static: เงินรวมทั้งธนาคาร", w: true } ] },
      { fn: "_displayTimestamp()", file: "Account.cpp", depth: 2, note: "พิมพ์ [YYYYMMDD_HHMMSS] นำหน้าทุกบรรทัด (static private helper)", data: "[19920104_091532] ", vars: [
        { n: "buf", d: "strftime จัดรูปเวลาเป็น string", w: true } ] },
      { fn: "displayAccountsInfos()", file: "Account.cpp", depth: 1, note: "พิมพ์สรุปรวมจาก static counters (ของทั้งธนาคาร)", data: "accounts:8;total:20049;deposits:0;...", vars: [
        { n: "_nbAccounts / _totalAmount", v: "8 / 20049", d: "อ่าน static counters (ไม่มี object)" } ] },
      { fn: "displayStatus()  const", file: "Account.cpp", depth: 1, note: "พิมพ์สถานะของแต่ละบัญชี (const method — แค่อ่าน ไม่แก้)", data: "index:0;amount:42;deposits:0;...", vars: [
        { n: "this->_amount", d: "อ่านอย่างเดียว (method เป็น const)" } ] },
      { fn: "makeDeposit(5)", file: "Account.cpp", depth: 1, note: "p_amount = 42 (จำค่าเก่า), _amount += 5, _totalAmount += 5, _totalNbDeposits++", data: "p_amount:42;deposit:5;amount:47;nb_deposits:1", vars: [
        { n: "p_amount", v: "42", d: "จำเงินก่อนฝาก (ต้องเก็บก่อนแก้)", w: true },
        { n: "_amount", v: "42 → 47", d: "เงินของบัญชีนี้ +deposit", w: true },
        { n: "_nbDeposits", v: "0 → 1", d: "นับครั้งฝากของบัญชีนี้", w: true } ] },
      { fn: "makeWithdrawal(321)", file: "Account.cpp", depth: 1, note: "321 > 47 (เงินไม่พอ) → พิมพ์ withdrawal:refused, return false", data: "index:0;p_amount:47;withdrawal:refused", vars: [
        { n: "withdrawal > _amount", v: "true", d: "เงื่อนไขปฏิเสธ (321 > 47)" },
        { n: "return", v: "false", d: "ถอนไม่สำเร็จ ไม่หักเงิน" } ] },
      { fn: "~Account()", file: "Account.cpp", depth: 1, note: "ตอนจบ main object ใน vector ถูกทำลาย → destructor พิมพ์ ;closed", data: "index:0;amount:47;closed", vars: [
        { n: "_accountIndex / _amount", d: "อ่านค่าสุดท้ายมาพิมพ์ ;closed" } ] },
    ]},
    minishell: { input: "ls -l | wc", steps: [
      { fn: "shell_loop()", file: "main.c", depth: 0, note: "REPL: readline อ่านบรรทัดจากผู้ใช้", data: "line = \"ls -l | wc\"", vars: [
        { n: "line", v: "\"ls -l | wc\"", d: "บรรทัดดิบจาก readline", w: true },
        { n: "g_signal", d: "global เดียว — เก็บหมายเลข signal ล่าสุด" } ] },
      { fn: "run_line() → parse_line()", file: "main.c", depth: 1, note: "ขับ pipeline การประมวลผล 1 บรรทัด", data: "—", vars: [
        { n: "sh", d: "struct t_shell ถือ env, tokens, cmds, exit_status" } ] },
      { fn: "lexer()", file: "lexer.c", depth: 2, note: "หั่น string เป็น token list (คำ / ตัวดำเนินการ)", data: "[WORD ls][WORD -l][PIPE][WORD wc]", vars: [
        { n: "sh->tokens", d: "linked list ของ t_token", w: true } ] },
      { fn: "check_syntax()", file: "syntax.c", depth: 2, note: "ตรวจไวยากรณ์ (| ลอย, redirect ไม่มีเป้า)", data: "ok → ผ่าน", vars: [
        { n: "sh->tokens", d: "อ่านลำดับ token เช็คความถูกต้อง" } ] },
      { fn: "parser()", file: "parser.c", depth: 2, note: "จัด token เป็น cmd list — PIPE แยกเป็นคนละคำสั่ง", data: "cmd1(ls -l) → cmd2(wc)", vars: [
        { n: "sh->cmds", d: "linked list ของ t_cmd (แต่ละตัวมี argv+redirs)", w: true } ] },
      { fn: "expand_cmds()", file: "expand.c", depth: 2, note: "ขยาย $VAR / $? + ลบ quote", data: "ไม่มี $ → คงเดิม", vars: [
        { n: "cmd->argv", d: "ถูกแทนค่า $ และลบ quote ในที่", w: true } ] },
      { fn: "execute()", file: "executor.c", depth: 1, note: "นับคำสั่ง n=2 → หลายคำสั่ง → exec_pipeline", data: "n = 2", vars: [
        { n: "n", v: "2", d: "= cmd_count → เลือกวิธีรัน (>1 = pipeline)" } ] },
      { fn: "exec_pipeline()", file: "exec_pipe.c", depth: 2, note: "pipe(fds), fork ทุกคำสั่ง, ต่อ stdout→stdin, ปิด fd ที่ไม่ใช้", data: "ls.stdout → pipe → wc.stdin", vars: [
        { n: "fds[2]", d: "ปลายท่อระหว่างคำสั่ง", w: true },
        { n: "in", d: "fd ที่จะเป็น stdin ของคำสั่งถัดไป", w: true },
        { n: "pid", d: "PID ลูกแต่ละตัวจาก fork", w: true } ] },
      { fn: "child_process()", file: "executor.c", depth: 3, note: "[ในลูก] dup2 in/out ตาม pipe, apply_redirs", data: "—", vars: [
        { n: "STDIN / STDOUT", d: "dup2 ต่อจาก pipe + redirect ทับได้", w: true } ] },
      { fn: "exec_external() → find_path() → execve()", file: "executor.c", depth: 4, note: "ค้น $PATH หา /bin/ls แล้ว execve แทนที่ process", data: "execve(\"/bin/ls\", ...)", vars: [
        { n: "path", v: "\"/bin/ls\"", d: "full path ที่ค้นเจอ", w: true },
        { n: "envp", d: "env list → array (env_to_array) ส่งให้ execve" } ] },
      { fn: "wait_all()", file: "exec_pipe.c", depth: 2, note: "รอทุก child จบ, เก็บ exit ของคำสั่งขวาสุด (wc) เป็น $?", data: "$? = 0", vars: [
        { n: "status", d: "raw status จาก wait (แปลงด้วย WEXITSTATUS)" },
        { n: "sh->exit_status", v: "0", d: "= $? ของไปป์ไลน์ (exit ของ wc)", w: true } ] },
      { fn: "reset_shell()", file: "main.c", depth: 1, note: "เคลียร์ token/cmd ของบรรทัดนี้ แล้ววนรอ prompt ใหม่", data: "พร้อมรับคำสั่งถัดไป", vars: [
        { n: "sh->tokens / sh->cmds", v: "NULL", d: "free + เคลียร์เพื่อรับบรรทัดใหม่", w: true } ] },
    ]},
  };

  function FlowViz(props) {
    var flow = props.flow;
    var steps = flow.steps;
    var sS = useState(0); var s = sS[0], setS = sS[1];
    var pS = useState(false); var playing = pS[0], setPlaying = pS[1];
    React.useEffect(function () {
      if (!playing) return undefined;
      if (s >= steps.length - 1) { setPlaying(false); return undefined; }
      var id = setTimeout(function () { setS(s + 1); }, 1200);
      return function () { clearTimeout(id); };
    }, [playing, s]);
    function go(i) { setPlaying(false); setS(i); }
    var cur = steps[s];
    return h("div", { className: "demo flowviz" },
      h("p", { className: "demo-hint" }, t({
        th: "ไล่ดูว่า input วิ่งผ่านฟังก์ชันไหนบ้างทีละสเตป — คลิกสเตปทางซ้ายเพื่อกระโดด หรือกด ▶ เล่นอัตโนมัติ (ย่อหน้า = ระดับการเรียกซ้อน)",
        en: "Step through which functions the input flows through — click a step to jump, or press ▶ to autoplay (indent = call depth)"
      })),
      h("div", { className: "flow-input" },
        h("span", { className: "flow-input-label" }, "INPUT"),
        h("code", null, flow.input)
      ),
      h("div", { className: "flow-wrap" },
        h("div", { className: "flow-list" },
          steps.map(function (st, i) {
            var cls = "flow-step";
            if (i === s) cls += " cur";
            else if (i < s) cls += " done";
            return h("button", {
              key: i, className: cls,
              style: { paddingLeft: (10 + (st.depth || 0) * 16) + "px" },
              onClick: function () { go(i); }
            },
              h("span", { className: "flow-idx" }, i + 1),
              h("span", { className: "flow-fn" }, st.fn),
              st.file ? h("span", { className: "flow-file" }, st.file) : null
            );
          })
        ),
        h("div", { className: "flow-detail" },
          h("div", { className: "flow-detail-head" },
            h("span", { className: "flow-detail-fn" }, cur.fn),
            cur.file ? h("span", { className: "flow-detail-file" }, cur.file) : null
          ),
          h("p", { className: "flow-detail-note" }, inline(cur.note)),
          (cur.vars && cur.vars.length) ? h("div", { className: "flow-vars" },
            h("span", { className: "flow-vars-label" }, t({ th: "ตัวแปรที่ทำงานด้วย", en: "Variables touched" })),
            h("div", { className: "flow-vars-list" },
              cur.vars.map(function (v, i) {
                return h("div", { className: "flow-var" + (v.w ? " write" : "") , key: i },
                  h("span", { className: "flow-var-name" }, v.n),
                  v.v != null ? h("span", { className: "flow-var-val" }, v.v) : null,
                  v.d ? h("span", { className: "flow-var-desc" }, inline(v.d)) : null
                );
              })
            )
          ) : null,
          cur.data ? h("div", { className: "flow-data" },
            h("span", { className: "flow-data-label" }, t({ th: "สถานะข้อมูล ณ จุดนี้", en: "Data state here" })),
            h("pre", null, cur.data)
          ) : null
        )
      ),
      h("div", { className: "demo-bar" },
        h("span", { className: "demo-stat" }, "STEP ", h("b", null, s + 1), " / " + steps.length),
        h("button", { className: "demo-btn alt", onClick: function () { go(Math.max(0, s - 1)); }, disabled: s === 0 }, "← " + t({ th: "ก่อนหน้า", en: "prev" })),
        h("button", { className: "demo-btn", onClick: function () { go(Math.min(steps.length - 1, s + 1)); }, disabled: s === steps.length - 1 }, t({ th: "ถัดไป", en: "next" }) + " →"),
        h("button", { className: "demo-btn active", onClick: function () { if (s >= steps.length - 1) setS(0); setPlaying(!playing); } }, playing ? "⏸ " + t({ th: "หยุด", en: "pause" }) : "▶ " + t({ th: "เล่น", en: "play" })),
        h("button", { className: "demo-btn alt", onClick: function () { go(0); } }, t({ th: "รีเซ็ต", en: "reset" }))
      )
    );
  }

  var TABS = [
    ["principle", { th: "หลักการ", en: "Overview" }],
    ["theory", { th: "ทฤษฎีที่ต้องรู้", en: "Theory" }],
    ["foundations", { th: "Struct · Pointer · Memory", en: "Struct · Pointer · Memory" }],
    ["architecture", { th: "โครงสร้างโค้ด", en: "Code Structure" }],
    ["dataflow", { th: "ทุกฟังก์ชัน · การไหล", en: "Functions · Data Flow" }],
    ["flowviz", { th: "Visualizer ▶", en: "Flow Visualizer ▶" }],
    ["implementation", { th: "การ implement", en: "Implementation" }],
    ["tricks", { th: "ทริคเด็ด", en: "Key Tricks" }],
    ["demo", { th: "เดโมโต้ตอบ", en: "Interactive Demo" }],
    ["eval", { th: "คำถาม Evaluation", en: "Evaluation Q&A" }]
  ];

  /* ชื่อแท็บสำหรับสาย AI Engineer — ใช้แทน label ของ 42 เมื่อ id ขึ้นต้นด้วย ai_ */
  var AI_TAB_LABELS = {
    principle:      { th: "ภาพรวม", en: "Overview" },
    theory:         { th: "แนวคิด & ทฤษฎี", en: "Concepts & Theory" },
    foundations:    { th: "พื้นฐาน & องค์ประกอบ", en: "Foundations" },
    architecture:   { th: "สถาปัตยกรรมระบบ", en: "System Architecture" },
    dataflow:       { th: "การไหลของข้อมูล", en: "Data Flow" },
    flowviz:        { th: "Visualizer ▶", en: "Flow Visualizer ▶" },
    implementation: { th: "ลงมือทำ & ตัวอย่าง", en: "Hands-on & Examples" },
    tricks:         { th: "ทริค & Best Practice", en: "Tips & Best Practices" },
    eval:           { th: "คำถามทบทวน", en: "Review Q&A" }
  };

  /* ชื่อแท็บสำหรับสื่อติวสอบ Exam Rank — ใช้เมื่อ id ขึ้นต้นด้วย exam_ */
  var EXAM_TAB_LABELS = {
    principle:      { th: "ภาพรวม & กติกา", en: "Overview & Rules" },
    theory:         { th: "Pool โจทย์ทั้งหมด", en: "Exercise Pool" },
    foundations:    { th: "Pattern ที่ใช้ซ้ำ", en: "Reusable Patterns" },
    architecture:   { th: "เริ่มเร็ว & workflow", en: "Setup & Workflow" },
    dataflow:       { th: "เจาะลึกข้อสำคัญ", en: "Key Exercises" },
    implementation: { th: "กลยุทธ์ & เวลา", en: "Strategy & Timing" },
    tricks:         { th: "กับดักที่ทำให้ตก", en: "Traps That Fail You" },
    eval:           { th: "เช็กความพร้อม", en: "Readiness Q&A" }
  };

  /* ชื่อโปรเจกต์: สาย 42 เป็นอังกฤษอยู่แล้ว มีแค่สาย AI ที่ตั้งชื่อไทย */
  function projName(p) { return t({ th: p.name, en: p.nameEn || p.name }); }

  /* ---- ชื่อแท็บของโปรเจกต์หนึ่ง (สาย exam/AI ใช้ชื่อของตัวเอง) ---- */
  function tabLabel(pid, key) {
    var map = pid.indexOf("exam_") === 0 ? EXAM_TAB_LABELS
      : pid.indexOf("ai_") === 0 ? AI_TAB_LABELS : null;
    if (map && map[key]) return t(map[key]);
    for (var i = 0; i < TABS.length; i++) if (TABS[i][0] === key) return t(TABS[i][1]);
    return key;
  }

  /* ============================================================
     ค้นหา — ดัชนีข้อความจากทุกหน้า สร้างครั้งเดียวต่อภาษา
     ============================================================ */
  var searchIndex = null, searchIndexLang = null;

  /* ดึงข้อความที่ค้นได้ออกจาก block หนึ่ง + น้ำหนักตามชนิด */
  function blockText(b) {
    if (b.h) return { kind: "h", w: 6, text: t(b.h) };
    if (b.p) return { kind: "p", w: 3, text: t(b.p) };
    if (b.note) return { kind: "note", w: 3, text: t(b.note) };
    if (b.ul) return { kind: "ul", w: 2, text: b.ul.map(t).join(" · ") };
    if (b.qa) return {
      kind: "qa", w: 3,
      text: b.qa.map(function (x) { return t(x.q) + " — " + t(x.a); }).join(" · ")
    };
    if (b.table) return {
      kind: "table", w: 2,
      text: b.table.head.map(t).join(" ") + " " +
        b.table.rows.map(function (r) { return r.map(t).join(" "); }).join(" · ")
    };
    if (b.links) return {
      kind: "links", w: 2,
      text: b.links.map(function (l) { return t(l.label) + " " + (l.note ? t(l.note) : ""); }).join(" · ")
    };
    if (b.code) return { kind: "code", w: 1, text: (b.cap ? t(b.cap) + " — " : "") + b.code };
    return null;
  }

  function buildSearchIndex() {
    if (searchIndex && searchIndexLang === LANG) return searchIndex;
    var out = [];
    (window.TEACHING_DATA || []).forEach(function (p) {
      var en = (LANG === "en" && window.TEACHING_EN) ? window.TEACHING_EN[p.id] : null;
      Object.keys(p.sections).forEach(function (key) {
        var blocks = (en && en[key]) || p.sections[key] || [];
        var heading = "";
        blocks.forEach(function (b) {
          var got = blockText(b);
          if (!got || !got.text) return;
          if (got.kind === "h") heading = got.text;
          out.push({
            pid: p.id, pname: projName(p), sec: key,
            heading: got.kind === "h" ? "" : heading,
            kind: got.kind, w: got.w,
            text: got.text, hay: got.text.toLowerCase()
          });
        });
      });
    });
    searchIndex = out; searchIndexLang = LANG;
    return out;
  }

  /* ตัดข้อความรอบคำที่เจอ + ล้างเครื่องหมาย markdown ออกก่อน */
  function snippet(text, terms, width) {
    var clean = text.replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
    var low = clean.toLowerCase(), at = -1;
    for (var i = 0; i < terms.length && at < 0; i++) at = low.indexOf(terms[i]);
    if (at < 0) at = 0;
    var from = Math.max(0, at - Math.floor(width / 3));
    var piece = clean.slice(from, from + width);
    return (from > 0 ? "…" : "") + piece + (from + width < clean.length ? "…" : "");
  }

  /* ไฮไลต์คำค้นในข้อความที่ตัดมาแล้ว */
  function highlight(text, terms) {
    var esc = terms.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    var re = new RegExp("(" + esc.join("|") + ")", "ig");
    var parts = [], last = 0, m, k = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(h("mark", { key: k++ }, m[0]));
      last = re.lastIndex;
      if (m[0] === "") re.lastIndex++;          // กัน regex วนไม่จบกับคำว่าง
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  /* ค้น: ทุกคำต้องเจอในบล็อกเดียวกัน แล้วรวมคะแนนเป็นรายหน้า */
  function runSearch(query) {
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var byPage = {};
    buildSearchIndex().forEach(function (e) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        if (e.hay.indexOf(terms[i]) < 0) return;               // ขาดคำใดคำหนึ่ง = ไม่นับ
        score += e.w;
      }
      if (terms.length > 1 && e.hay.indexOf(query.toLowerCase()) >= 0) score += e.w * 3;  // เจอเป็นวลีเต็ม
      if (e.pname.toLowerCase().indexOf(terms[0]) >= 0) score += 4;
      var page = byPage[e.pid] || (byPage[e.pid] = { pid: e.pid, pname: e.pname, score: 0, hits: [] });
      page.score += score;
      page.hits.push({ sec: e.sec, heading: e.heading, kind: e.kind, text: e.text, score: score });
    });
    return Object.keys(byPage).map(function (k) { return byPage[k]; })
      .map(function (p) {
        p.hits.sort(function (a, b) { return b.score - a.score; });
        p.hits = p.hits.slice(0, 3);
        return p;
      })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8);
  }

  function Search(props) {
    var s = useState(""), q = s[0], setQ = s[1];
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var results = terms.length >= 1 ? runSearch(q) : null;
    var box = React.useRef(null);

    React.useEffect(function () {
      function onKey(ev) {
        if (ev.key === "/" && document.activeElement !== box.current) {
          ev.preventDefault(); if (box.current) box.current.focus();
        } else if (ev.key === "Escape" && document.activeElement === box.current) {
          setQ(""); box.current.blur();
        }
      }
      document.addEventListener("keydown", onKey);
      return function () { document.removeEventListener("keydown", onKey); };
    }, []);

    return h("div", { className: "search" },
      h("div", { className: "search-box" },
        h("span", { className: "search-icon" }, "⌕"),
        h("input", {
          ref: box, type: "search", value: q, className: "search-input",
          placeholder: t({
            th: "ค้นหาหัวข้อหรือเนื้อหา — กด / เพื่อเริ่มพิมพ์",
            en: "Search titles and content — press / to start typing"
          }),
          onChange: function (ev) { setQ(ev.target.value); }
        }),
        q ? h("button", {
          className: "search-clear", onClick: function () { setQ(""); },
          title: t({ th: "ล้าง", en: "Clear" })
        }, "×") : null
      ),
      results === null ? null :
        !results.length
          ? h("p", { className: "search-empty" },
            t({ th: "ไม่พบ ", en: "No matches for " }) + "“" + q + "”")
          : h("div", { className: "search-results" },
            results.map(function (p) {
              return h("div", { className: "search-page", key: p.pid },
                h("a", { className: "search-title", href: p.pid + ".html" }, p.pname),
                p.hits.map(function (hit, i) {
                  return h("a", {
                    key: i, className: "search-hit",
                    href: p.pid + ".html#" + hit.sec
                  },
                    h("span", { className: "search-where" },
                      tabLabel(p.pid, hit.sec) + (hit.heading ? " · " + hit.heading.replace(/^🔬\s*/, "") : "")),
                    h("span", { className: "search-snip" },
                      highlight(snippet(hit.text, terms, 170), terms))
                  );
                })
              );
            })
          )
    );
  }

  /* ---- หน้าโปรเจกต์ ---- */
  function ProjectPage(props) {
    var proj = props.proj;
    var isAI = proj.id.indexOf("ai_") === 0;
    var isExam = proj.id.indexOf("exam_") === 0;
    /* แท็บ demo / flowviz โผล่เฉพาะโปรเจกต์ที่มีของจริงลงทะเบียนไว้
       — ไม่ต้องไล่ระบุ id ทีละตัวเวลามีหน้าใหม่ */
    var tabs = TABS.filter(function (tb) {
      if (tb[0] === "demo") return !!DEMOS[proj.id];
      if (tb[0] === "flowviz")
        return !!(FLOWS[proj.id] || (window.EXTRA_FLOWS || {})[proj.id]);
      return Object.prototype.hasOwnProperty.call(proj.sections, tb[0]);
    });
    /* เปิดตรงแท็บได้ผ่าน #<tab> — ผลค้นหาจากหน้าแรกลิงก์มาแบบนี้
       เทียบกับรายการแท็บจริง จึงกัน hash แปลกปลอมและชื่อบน prototype ไปด้วย */
    var fromHash = (location.hash || "").slice(1);
    var known = tabs.some(function (tb) { return tb[0] === fromHash; });
    var st = useState(known ? fromHash : "principle");
    var tab = st[0], setTab = st[1];
    function goTab(k) {
      setTab(k);
      try { location.hash = k; } catch (e) { /* file:// บางเบราว์เซอร์ไม่ยอม */ }
      window.scrollTo(0, 0);
    }
    document.documentElement.style.setProperty("--accent", proj.accent);
    var enSec = (LANG === "en" && window.TEACHING_EN && window.TEACHING_EN[proj.id])
      ? window.TEACHING_EN[proj.id][tab] : null;
    var blocks = enSec || proj.sections[tab] || [];
    var Demo = DEMOS[proj.id];
    var body;
    if (tab === "demo") {
      body = Demo ? h(Demo, null) : h("p", null, t({ th: "ยังไม่มีเดโมสำหรับโปรเจกต์นี้", en: "No demo for this project yet" }));
    } else if (tab === "flowviz") {
      var flow = FLOWS[proj.id] || (window.EXTRA_FLOWS || {})[proj.id];
      body = flow ? h(FlowViz, { flow: flow })
        : h("p", null, t({ th: "ยังไม่มี visualizer สำหรับโปรเจกต์นี้", en: "No flow visualizer for this project yet" }));
    } else {
      body = blocks.map(function (b, i) { return h(Block, { key: i, b: b }); });
    }
    return h("div", { className: "wrap" },
      h("div", { className: "hero" },
        h("div", { className: "accent-bar" }),
        h("h1", null, projName(proj)),
        h("p", { className: "tag" }, t(proj.tag)),
        null
      ),
      h("div", { className: "tabs" },
        tabs.map(function (tb) {
            var k = tb[0];
            var label = (isExam && EXAM_TAB_LABELS[k]) ? EXAM_TAB_LABELS[k]
              : (isAI && AI_TAB_LABELS[k]) ? AI_TAB_LABELS[k] : tb[1];
            return h("button", {
              key: k,
              className: "tab" + (tab === k ? " active" : ""),
              onClick: function () { goTab(k); }
            }, t(label));
          })
      ),
      h("div", { className: "section", key: tab }, body),
      h("footer", null,
        t({ th: "สื่อการสอน 42 · ", en: "42 Study Guide · " }) + projName(proj))
    );
  }

  /* ---- หน้าแรก: แยกหมวดเพราะหน้ารวมยาวขึ้นเรื่อย ๆ ---- */
  var HOME_GROUPS = [
    {
      key: "core", match: function (id) { return !/^(cpp_module_|ai_|exam_)/.test(id); },
      title: { th: "42 Common Core", en: "42 Common Core" },
      sub: { th: "ไล่ตั้งแต่ libft ถึง Inception — C, เครือข่าย และ system admin", en: "From libft through Inception — C, networking and system administration" }
    },
    {
      key: "cpp", match: function (id) { return id.indexOf("cpp_module_") === 0; },
      title: { th: "CPP Modules", en: "CPP Modules" },
      sub: { th: "C++ ตั้งแต่ module 00 ถึง 09", en: "C++ from module 00 to 09" }
    },
    {
      key: "ai", match: function (id) { return id.indexOf("ai_") === 0; },
      title: { th: "AI Engineer", en: "AI Engineer" },
      sub: { th: "สายงาน AI — LLM, RAG, agent, harness", en: "The AI track — LLMs, RAG, agents, harnesses" }
    },
    {
      key: "exam", match: function (id) { return id.indexOf("exam_") === 0; },
      title: { th: "สื่อติวสอบ Exam Rank", en: "Exam Rank Prep" },
      sub: { th: "ข้อสอบ on-site rank 02–06", en: "The on-site exams, ranks 02–06" }
    }
  ];

  function Home(props) {
    return h("div", { className: "wrap" },
      h("div", { className: "hero" },
        h("div", { className: "accent-bar" }),
        h("h1", null, t({ th: "สื่อการสอน 42", en: "42 Study Guide" })),
        h("p", { className: "tag" }, t({
          th: "คู่มือ 42 ฉบับจับมือทำ — เล่าตั้งแต่ทฤษฎี ไล่โค้ดทีละฟังก์ชัน ยันคำถามตอน eval แบบที่อ่านแล้วเก็ตจริง",
          en: "A hands-on 42 guide — from the theory, through every function, to the evaluation Q&A, all in plain language"
        }))
      ),
      h(Search, null),
      HOME_GROUPS.map(function (g) {
        var items = props.projects.filter(function (p) { return g.match(p.id); });
        if (!items.length) return null;
        return h("section", { className: "home-group", key: g.key },
          h("div", { className: "group-head" },
            h("h2", null, t(g.title), h("span", { className: "group-count" }, items.length)),
            h("p", null, t(g.sub))
          ),
          h("div", { className: "grid" },
            items.map(function (p) {
              return h("a", {
                className: "card", key: p.id, href: p.id + ".html",
                style: { borderLeftColor: p.accent }
              },
                h("h3", null, projName(p)),
                h("p", null, t(p.tag))
              );
            })
          )
        );
      }),
      h("footer", null, t({
        th: "สื่อการสอน 42",
        en: "42 Study Guide"
      }))
    );
  }

  /* ---- title ของแท็บ: <title> ใน .html เป็นไทยตายตัว ต้องเซ็ตซ้ำเมื่อสลับภาษา ---- */
  var SITE_NAMES = {
    ai_:   { th: "สื่อการสอน AI Engineer", en: "AI Engineer Study Guide" },
    exam_: { th: "สื่อติวสอบ 42", en: "42 Exam Prep" }
  };

  function pageTitle(proj) {
    var id = proj ? proj.id : "";
    var site = { th: "สื่อการสอน 42", en: "42 Study Guide" };
    Object.keys(SITE_NAMES).forEach(function (prefix) {
      if (id.indexOf(prefix) === 0) site = SITE_NAMES[prefix];
    });
    if (!proj) return t(site);
    // ชื่อ AI ยาว ตัดคำอธิบายท้ายออก เว้นแต่หน้านั้นตั้ง titleShort ไว้เอง
    var short = proj.titleShort ? t(proj.titleShort) : projName(proj).split(" — ")[0];
    return short + " — " + t(site);
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
    document.title = pageTitle(proj);
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
