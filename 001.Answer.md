# Basics 📌 **Node.js Interview Q\&A Cheatsheet**-

**1. What is Node.js?**

* Node.js is a **runtime environment** built on **V8 JavaScript engine** that allows running JS outside the browser.
* It uses an **event-driven, non-blocking I/O model** → great for scalable apps.

**2. Difference between Node.js and JavaScript in browser?**

* Browser JS → manipulates DOM, no access to filesystem.
* Node.js → backend tasks (files, DB, network). No DOM.

### **3. Core Modules**

* `fs` – File system operations
* `http` – Create web servers
* `path` – Handle file paths
* `os` – OS-related info
* `events` – Event emitter
  
**4. What is npm?**

* Node Package Manager, comes with Node.js.
* `dependencies` → required in production.
* `devDependencies` → needed only for development (tests, build tools).

### **5. Common Uses**

* RESTful APIs & GraphQL servers
* Real-time apps (chat, collaboration tools)
* Microservices
* CLI tools
* Streaming apps

### 6. **What is the difference between CommonJS (`require`) and ES Modules (`import`)?**
**CommonJS (CJS)**

CommonJS is the **older module system** used in Node.js.

* Uses `require()` and `module.exports`
* Loads modules **synchronously at runtime**
* Node.js default before ES modules

**Example:**
```js
const math = require('./math');
module.exports = { add, subtract };
```

✅ **ES Modules (ESM)**
ES Modules is the **modern JavaScript module system** used in browsers and now Node.js.
* Uses `import` and `export`
* Loaded **asynchronously and statically**
* Better for optimization and modern development

**Example:**
```js
import math from './math.js';
export const add = () => {};
```
## 🧩 **One-line difference**

**CommonJS** = old Node.js module system (require/export).
**ESM** = modern JavaScript module system (import/export).

### **7. Popular Frameworks**

* **Express.js** – Minimal and flexible web framework.
* **NestJS** – Enterprise-level Node.js framework (like Angular for backend).
* **Koa.js** – Lightweight, modern framework.
* **Fastify** – High-performance web framework.
  
**8. What are callbacks?**

* Functions passed as arguments, executed later (async).
* Can lead to **callback hell** → solved using Promises/async-await.
  
```node
function greet(name, callback) {
  console.log("Hello " + name);
  callback(); // Execute the callback function
}

greet("Mohan", function() {
  console.log("Welcome!");
});

O/S
Hello Mohan
Welcome!
```
---

**8.A) Callback Hell?**
Callback Hell happens when multiple async operations depend on each other and callbacks get nested inside other callbacks, making the code:

Deeply indented
Hard to read
Hard to debug
Hard to maintain
This is also known as:
“Pyramid of Doom”

Real-World Example of Callback Hell

- Imagine we want to:
- Read a user from DB
- Fetch their orders
- Get details of each order
- Write the result to a file

* In old-style Node.js callbacks, it may look like this:
```node
const fs = require("fs");

function getUser(id, callback) {
  setTimeout(() => {
    console.log("User fetched");
    callback(null, { id: id, name: "Mohan" });
  }, 1000);
}

function getOrders(user, callback) {
  setTimeout(() => {
    console.log("Orders fetched");
    callback(null, ["Order1", "Order2"]);
  }, 1000);
}

function getOrderDetails(order, callback) {
  setTimeout(() => {
    console.log("Order details fetched");
    callback(null, order + " Details");
  }, 1000);
}

getUser(1, function (err, user) {
  getOrders(user, function (err, orders) {
    getOrderDetails(orders[0], function (err, details) {
      fs.writeFile("result.txt", details, function (err) {
        console.log("File written!");
      });
    });
  });
});

```

**8.B ✅ Modern Fix: Use Promises or async/await**

The same logic using async/await becomes:
const fs = require("fs").promises;

```node
async function run() {
  const user = await getUser(1);
  const orders = await getOrders(user);
  const details = await getOrderDetails(orders[0]);
  await fs.writeFile("result.txt", details);
  console.log("File written!");
}

run();
```
**8.C await for task and Parallel execution with promise C**
```node
const task1Promise = task1(); //task1 is a async function
const task2Promise = task2(); //task2 is a async function

const result1 = await task1Promise;
const result2 = await task2Promise;

//or even 
const [result1, result2] = await Promise.all([task1(), task2()]);

```


**9. What is the Event Loop?**
Node.js is single-threaded for JavaScript execution, but it handles concurrency using an event-driven, non-blocking I/O model.
The event loop delegates I/O work to the OS kernel or libuv thread pool, and JS callbacks execute only when results are ready.
This allows Node.js to manage thousands of concurrent operations without creating additional JavaScript threads.
* Node.js runs in a **single thread** (unlike Java or C# web servers that spawn many threads).
* To handle thousands of concurrent requests, it uses the **event loop**.
* The event loop continuously checks: “Do I have something to execute? Are there callbacks waiting? Do I have timers expired?”

That’s how Node.js achieves **non-blocking I/O**.

---

### **9.B. Phases of the Event Loop**

The loop executes in this order:

1. **Timers** → executes `setTimeout`, `setInterval` callbacks.
2. **I/O callbacks** → handles I/O finished tasks (e.g., network, filesystem).
3. **Idle, prepare** → internal stuff.
4. **Poll** → waits for new I/O events (like incoming requests).
5. **Check** → executes **setImmediate** callbacks.
6. **Close callbacks** → executes `socket.on('close', ...)` etc.

---

### **9.C. Practical Example**

Let’s see code to watch it in action:

```js
const fs = require("fs");
const net = require("net");

console.log("1. Start");

// ---------------- PHASE 1: TIMERS ----------------
setTimeout(() => {
  console.log("4. setTimeout callback (Timers phase)");
}, 0);

// ---------------- PHASE 5: CHECK ----------------
setImmediate(() => {
  console.log("6. setImmediate callback (Check phase)");
});

// ---------------- PHASE 2: I/O CALLBACKS ----------------
// Async file read will trigger callback in I/O phase
fs.readFile(__filename, () => {
  console.log("5. fs.readFile callback (I/O callbacks phase)");
});

// ---------------- MICROTASK QUEUE ----------------
// Runs before event loop continues
Promise.resolve().then(() => {
  console.log("3. Promise.then callback (Microtask queue)");
});

process.nextTick(() => {
  console.log("2. process.nextTick callback (Microtask - highest priority)");
});

// ---------------- TIMERS (INTERVAL) ----------------
let count = 0;
let timer = setInterval(() => {
  count++;
  console.log("Interval run:", count);

  if (count === 3) {
    clearInterval(timer); // stop after 3 times
  }
}, 0); // runs in Timers phase repeatedly

// ---------------- PHASE 4: POLL ----------------
// Poll is usually where I/O waits; we simulate it
setTimeout(() => {
  console.log("Extra Poll simulation (via timeout 10ms)");
}, 10);

// ---------------- PHASE 6: CLOSE CALLBACKS ----------------
const server = net.createServer().listen(0);
server.on("connection", (socket) => socket.end());
server.close(() => {
  console.log("7. server close callback (Close callbacks phase)");
});

console.log("8. End");

```

---

### **9.D. Expected Output**

The output will look like this (order may vary slightly depending on system, but promises always run **before timers/immediate**):

```
1. Start
8. End
2. process.nextTick callback (Microtask - highest priority)
3. Promise.then callback (Microtask queue)
4. setTimeout callback (Timers phase)
Interval run: 1
5. fs.readFile callback (I/O callbacks phase)
6. setImmediate callback (Check phase)
Extra Poll simulation (via timeout 10ms)
7. server close callback (Close callbacks phase)
Interval run: 2
Interval run: 3

```
### ✅ Expected Execution Order (first tick of event loop)

1. `1. Start` (synchronous code)
2. `2. process.nextTick callback (Microtask - highest priority)`
3. `3. Promise.then callback (Microtask queue)`
4. `4. End` (sync finish)

---

**Event loop phases start:**

5. `Interval run: 1` (Timers phase, since interval=0)
6. `6. setTimeout callback (Timers phase)` (0ms timer)
7. `7. setImmediate callback (Check phase)`
8. `8. File read completed (Poll -> I/O callbacks phase)`
9. `Interval run: 2` (next Timers phase cycle)
10. `9. Poll phase (simulated by timeout inside poll)`
11. `Interval run: 3` (Timers phase again)
12. `10. server close callback (Close callbacks phase)`

    
⚠️ Key Notes  
* setInterval(..., 0) still waits until the next timers phase (it won’t block).  
* Execution order of setTimeout(…, 0) and setInterval(…, 0) can sometimes flip because they both sit in the same timers queue.
* In practice, you’ll almost always see setTimeout first, then setInterval.

---

✅ **Key Takeaways:**
* `process.nextTick` always wins inside the current tick.
* `Promise.then` runs after `nextTick`, before timers.
* `setInterval(..., 0)` will run **every timers phase** (not continuously).
* `setTimeout(..., 0)` fires once in the **first timers phase**.
* `setImmediate` executes in **check phase**, which usually comes after timers if no blocking I/O.
* `fs.readFile` callback executes in the **I/O callbacks phase (poll)**.
* `server.close` executes in the **close callbacks phase**, always last.

---


## What actually uses the thread pool?

Libuv’s thread pool is only used for **specific built-in asynchronous operations**:

| Category                                            | Does it use thread pool? |
| --------------------------------------------------- | ------------------------ |
| File system (`fs.*`)                                | ✅ Yes                    |
| Crypto (`pbkdf2`, `scrypt`, some hashing)           | ✅ Yes                    |
| DNS (`dns.lookup`)                                  | ✅ Yes                    |
| Compression (`zlib`)                                | ✅ Yes                    |
| User-defined JS logic                               | ❌ No                     |
| CPU-heavy loops (sorting, calculating primes, etc.) | ❌ No                     |
| JSON.parse/stringify for huge data                  | ❌ No                     |
| Large array or string processing                    | ❌ No                     |

---


**10. What are Streams?**

* Handle data **piece by piece** instead of loading all at once.
* Types: Readable, Writable, Duplex, Transform.

---

**11. What are Buffers?**

* Temporary storage for **binary data**.
* Useful for files, network packets, etc.

---

## 🔹 **Intermediate Node.js**

**12. How does Node.js handle concurrency if single-threaded?**

* Uses **event loop + libuv thread pool** for async I/O.
* Heavy CPU tasks → offloaded to worker threads.

---

**13. process.nextTick() vs setImmediate()?**

* `process.nextTick()` → runs **before** next event loop iteration.
* `setImmediate()` → runs **after** current event loop completes.

---

**14. What is middleware in Express?**

* Functions that run **between request and response**.
* Example: logging, authentication, error handling.

---

**15. Common built-in modules?**

* `fs`, `path`, `http`, `os`, `events`, `crypto`, `util`.

---

**13. Sync vs Async functions?**

* Sync → blocks execution until finished.
* Async → non-blocking, executed later via callbacks/promises.

---

**14. How does error handling work?**

* `try/catch` for sync & async/await.
* `.catch()` for Promises.
* Event emitter’s `error` event for streams.

---

**15. What is clustering in Node.js?**

* Running multiple Node.js processes to use **multi-core CPUs**.
* Each process has its own event loop.

---

**16. Difference from multi-threaded servers (Java/.NET)?**

* Node.js uses **single-thread + async I/O**.
* Java/.NET use multiple threads for concurrency.

---

**17. fork() vs spawn() vs exec()?**

* `spawn` → runs command, streams output.
* `exec` → runs command, buffers output in memory.
* `fork` → creates a new Node.js process for IPC.

---

**18. JWT authentication?**

* JSON Web Tokens → signed tokens used for stateless authentication.
* Stored in headers (Authorization: Bearer).

---

**19. What is CORS?**

* Restricts cross-origin requests.
* In Node.js, handle via `cors` middleware.

---

**20. REST vs GraphQL?**

* REST → fixed endpoints, multiple round trips.
* GraphQL → single endpoint, query exact data.

---

## 🔹 **Advanced Node.js**

**21. How does V8 work?**

* Compiles JS → machine code (JIT).
* Handles memory allocation + garbage collection.

---

**22. Node.js memory management?**

* Managed by V8: heap + stack.
* GC removes unused objects.

---

# 23 What is **libuv**?

**libuv** is a small C library that Node.js uses to provide:

* A **cross-platform event loop** (works the same on Linux/macOS/Windows).
* A unified abstraction over OS I/O mechanisms

  * Linux: `epoll`, BSD/macOS: `kqueue`, Windows: `IOCP`, etc.
* A **work queue + thread pool** for operations that can’t be made non-blocking at the OS level (e.g., many filesystem calls, `getaddrinfo()` DNS lookups, compression, crypto).

Think of libuv as Node’s “engine room”: it waits for events (sockets, timers), dispatches callbacks, and offloads blocking work to a small pool of worker threads so the **single JavaScript thread** stays responsive.

---

# 23.A. Where do **async/await** fits?

* `async/await` is **JavaScript syntax** over **Promises**. It doesn’t create threads.
* When you `await` something that ultimately touches the OS (e.g., `fs.promises.readFile`), Node’s **C++ bindings** call into **libuv**:

  1. The JS call returns a **Promise** immediately.
  2. libuv **submits a request** (often to its thread pool).
  3. The event loop keeps running.
  4. When the work finishes, libuv **posts a completion** back to the main loop.
  5. Node **settles the Promise** (resolve/reject) → V8 schedules a **microtask**.
  6. Your `async` function **resumes after `await`** on the same JS thread.

So: libuv handles the *I/O and threading*, V8 handles the *Promise/microtask resumption*, and `async/await` is just the *nice syntax* you write.

---

# 23.B.What goes to the **thread pool** (and why)?

Some operations cannot be watched with non-blocking OS events; they would block the loop if run directly. libuv offloads these to its **worker pool** (default size **4**, configurable with `UV_THREADPOOL_SIZE` before Node starts):

* Most **filesystem** ops: `readFile`, `writeFile`, `stat`, `readdir`, etc. (POSIX FS calls are blocking; offloaded to keep the loop free.)
* **DNS** `dns.lookup()` (uses the system resolver via `getaddrinfo()` → blocking → thread pool).
  *(Contrast: `dns.resolve()` uses c-ares and non-blocking sockets, not the pool.)*
* **Crypto** heavy hitters: `crypto.pbkdf2`, `scrypt`, `bcrypt` (via native addons), some `zlib` compression.
* Misc CPU-ish native work scheduled via `uv_queue_work()`.

**Networking (TCP/UDP/HTTP)** usually doesn’t use the thread pool: sockets are non-blocking and are watched by the event loop (epoll/kqueue/IOCP).

> Note: On Windows, libuv uses IOCP even for many filesystem operations; abstraction still ensures the JS thread doesn’t block.

---

# 23.C. Step-by-step: `await fs.promises.readFile()`

```js
async function load() {
  const text = await fs.promises.readFile("data.txt", "utf8");
  console.log(text);
}
load();
```

1. JS enters `load()`, creates a **Promise**.
2. Node’s FS binding calls `uv_fs_read` (libuv).
3. libuv **queues** the read onto the **thread pool**.
4. Event loop keeps spinning; your JS thread is free.
5. Worker thread does the blocking `read()` syscall.
6. When done, the worker posts a **completion** to the loop.
7. Node resolves the Promise → **microtask** runs → `await` resumes → `console.log(text)`.

---

# 23.D. Pool size, saturation & performance gotchas

Default pool size is **4**. If you run several **CPU-heavy** pool jobs, you can **starve** other pool users (like FS). Classic demo:

```js
const fs = require('fs/promises');
const crypto = require('crypto');

for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('p', 's', 1e6, 64, 'sha512', () => {
    console.log('pbkdf2 done', i);
  });
}

// This FS read may be delayed until a worker is free:
fs.readFile('big.txt').then(() => console.log('file read done'));
```

Because there are 4 pbkdf2 jobs and the pool size is 4, the file read can wait.
**Fixes/options:**

* Increase pool: `UV_THREADPOOL_SIZE=8 node app.js` (max 128 in modern Node; older docs mention up to 1024 for libuv but Node clamps lower—keep it reasonable).
* Avoid heavy CPU work in the pool; move CPU-bound work to **Worker Threads** (true parallel JS).
* Pipeline / rate-limit your heavy tasks.

---

# 23.E.  How timers & microtasks interleave with libuv work

* After each libuv phase (timers, I/O, check, etc.), Node/V8 drain **microtasks** (Promises) and **`process.nextTick`**.
* `process.nextTick` runs **before** Promise microtasks.
* Pool completions land in the **I/O callbacks** phase, which then resolve Promises → your `await` resumes as a microtask.

**Priority (within a tick) roughly:**

1. Current callback’s sync code
2. `process.nextTick` queue
3. Promise microtasks
4. Move to next libuv phase (timers → I/O → check → close…)

---

# Quick mental model

* **Event loop**: watches sockets/timers; dispatches callbacks.
* **Thread pool**: does blocking FS, DNS, crypto/zlib, custom native work.
* **async/await**: Promise syntax; resumes when libuv signals completion → Promise settled → microtask → continue.

---

# 23.F. Practical tips

* **Don’t** assume `async/await` = multithreading. JS still runs on one thread (unless you use **Worker Threads**).
* For **I/O-bound** work: `async/await` + libuv is perfect.
* For **CPU-bound** work: prefer **Worker Threads** or processes; don’t flood the libuv pool.
* If you mix heavy crypto/compression with lots of FS: **tune** `UV_THREADPOOL_SIZE` and/or **isolate** heavy work.

---

# Bonus: show concurrency with `Promise.all`

```js
// Runs 10 reads concurrently; each read uses a pool worker,
// but they complete as workers free up.
await Promise.all(
  Array.from({ length: 10 }, (_, i) =>
    fs.promises.readFile(`files/${i}.txt`, 'utf8')
  )
);
```

This doesn’t create 10 JS threads; it schedules 10 libuv requests, and the pool + OS handle them without blocking the JS thread.

---
# Node.js is amazing for certain workloads, but it’s not ideal for everything

## 🔹 Node.js Strengths

Node.js is best for:

1. **I/O-bound tasks** (network, database, filesystem)

   * Handling thousands of simultaneous connections with minimal threads.
   * Examples: HTTP APIs, WebSockets, streaming, chat servers.

2. **Real-time applications**

   * Chat apps, live dashboards, collaborative tools, notifications.

3. **Single-page application backends**

   * APIs serving JSON, microservices.

> The key: Node.js **shines when you have many concurrent operations but most of the time they are waiting on I/O**.

---

# 23.ZA🔹 Cases where Node.js is **not ideal**

### 1️⃣ CPU-bound / heavy computation

* Node.js runs JavaScript on a **single thread** (main thread).
* Even though it has a **libuv thread pool**, it’s limited (default 4 threads).
* Heavy computation can **block the event loop**, making all requests slow.

**Examples:**

* Image/video processing
* Complex math / machine learning tasks
* Large encryption / decryption tasks
* Any operation that takes seconds on the main thread

**Problem:** All other requests (HTTP, timers) will **stall until computation is done**.

**Solution:** Offload heavy CPU work to:

* Worker Threads (`worker_threads` module)
* External services / microservices in another language (e.g., Python, C++)

---

### 23.ZB 2️⃣ Long-running synchronous blocking code

```js
// BAD: blocks the event loop
const data = fs.readFileSync("bigfile.txt"); // blocks for seconds
```

* Any blocking synchronous API (e.g., `readFileSync`, `crypto.pbkdf2Sync`) will freeze Node for all clients.
* Async alternatives exist (`fs.promises.readFile`, `crypto.pbkdf2`) → Node remains responsive.

---

### 23.ZC3️⃣ Applications requiring **true multithreading for concurrency**

* Node.js is **single-threaded by default**.
* If you need multiple cores to compute in parallel **without splitting tasks manually**, Node.js is cumbersome.

**Alternatives:**

* Java, Go, Rust, C++ (true multithreaded concurrency built-in)

---

### 23.ZD4️⃣ Memory-intensive applications

* Node.js keeps **all objects in V8 heap**, which is limited (\~1.5GB for 64-bit default).
* Very large in-memory datasets can crash the process.

**Alternatives:** Languages/runtime with better memory control (Java, .NET, Rust).

---

### ✅ Quick summary table

| Use case                           | Node.js suitability |
| ---------------------------------- | ------------------- |
| High concurrency, I/O-bound        | ✅ Ideal             |
| CPU-bound / heavy computation      | ❌ Not ideal         |
| Long blocking sync operations      | ❌ Not ideal         |
| Large in-memory datasets           | ⚠ Limited           |
| Real-time apps / chat / websockets | ✅ Ideal             |

---

### ⚡ Rule of thumb

> **If your workload mostly waits on I/O**, Node.js is excellent.
> **If your workload mostly computes**, Node.js may **block** the event loop, so consider Worker Threads or another language/runtime.

---


**24. Load balancing in Node.js?**

* Use clustering, PM2, or Nginx to distribute requests.

---

**25. Worker threads?**

* Run CPU-heavy tasks in parallel threads.
* Useful for image processing, encryption, ML.

---

**26. How to scale Node.js apps?**

* Vertical scaling → more CPU/memory.
* Horizontal scaling → clusters, containers, load balancers.

---

**27. How to secure Node.js apps?**

* Use Helmet, sanitize inputs, HTTPS, JWT expiry, rate limiting.

---

**28. Performance optimization?**

* Caching (Redis), clustering, async I/O, streams, avoid sync code.

---

**29. What is async\_hooks?**

* API to track async resources like Promises, timers.

---

**30. Debugging Node.js apps?**

* Use `console.log`, `node --inspect`, Chrome DevTools, or Winston/PM2 logs.

---

## 🔹 **Code/Scenario**

**Q: Write a basic HTTP server (no Express).**

```js
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello Node.js');
}).listen(3000);
```

**Q: Read/write file in Node.js.**

```js
const fs = require('fs');
fs.readFile('input.txt', 'utf8', (err, data) => console.log(data));
fs.writeFile('output.txt', 'Hello World', () => console.log('Done'));
```

**Q: Convert callback → async/await.**

```js
const fs = require('fs/promises');
async function readFile() {
  const data = await fs.readFile('test.txt', 'utf8');
  console.log(data);
}
```

**Q: Stream large file.**

```js
const fs = require('fs');
fs.createReadStream('bigfile.txt').pipe(fs.createWriteStream('copy.txt'));
```

 
