# Basics
Perfect 👍 let’s make this a **Node.js Interview Q\&A Cheatsheet** with **brief but solid answers** you can quickly review.

---

# 📌 **Node.js Interview Q\&A Cheatsheet**

---

## 🔹 **Basic Node.js**

**1. What is Node.js?**

* Node.js is a **runtime environment** built on **V8 JavaScript engine** that allows running JS outside the browser.
* It uses an **event-driven, non-blocking I/O model** → great for scalable apps.

---

**2. Difference between Node.js and JavaScript in browser?**

* Browser JS → manipulates DOM, no access to filesystem.
* Node.js → backend tasks (files, DB, network). No DOM.

---

**3. What is npm?**

* Node Package Manager, comes with Node.js.
* `dependencies` → required in production.
* `devDependencies` → needed only for development (tests, build tools).

---

**4. CommonJS vs ES Modules?**

* CommonJS → `require()`, synchronous.
* ES Modules → `import/export`, asynchronous, modern standard.

---

**5. What are callbacks?**

* Functions passed as arguments, executed later (async).
* Can lead to **callback hell** → solved using Promises/async-await.

---

**6. What is the Event Loop?**

* Mechanism that allows Node.js to handle **non-blocking I/O** in a single thread.
* Phases: timers → I/O callbacks → idle → poll → check → close.

---
Great question 🚀. The **Event Loop** is one of the most important concepts in Node.js, and understanding it will make a lot of things about async behavior (like `setTimeout`, promises, file I/O, etc.) crystal clear.

---

### **6.A. What is the Event Loop?**

* Node.js runs in a **single thread** (unlike Java or C# web servers that spawn many threads).
* To handle thousands of concurrent requests, it uses the **event loop**.
* The event loop continuously checks: “Do I have something to execute? Are there callbacks waiting? Do I have timers expired?”

That’s how Node.js achieves **non-blocking I/O**.

---

### **6.B. Phases of the Event Loop**

The loop executes in this order:

1. **Timers** → executes `setTimeout`, `setInterval` callbacks.
2. **I/O callbacks** → handles I/O finished tasks (e.g., network, filesystem).
3. **Idle, prepare** → internal stuff.
4. **Poll** → waits for new I/O events (like incoming requests).
5. **Check** → executes **setImmediate** callbacks.
6. **Close callbacks** → executes `socket.on('close', ...)` etc.

---

### **6.C. Practical Example**

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

### **6.D. Expected Output**

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

**7. What are Streams?**

* Handle data **piece by piece** instead of loading all at once.
* Types: Readable, Writable, Duplex, Transform.

---

**8. What are Buffers?**

* Temporary storage for **binary data**.
* Useful for files, network packets, etc.

---

## 🔹 **Intermediate Node.js**

**9. How does Node.js handle concurrency if single-threaded?**

* Uses **event loop + libuv thread pool** for async I/O.
* Heavy CPU tasks → offloaded to worker threads.

---

**10. process.nextTick() vs setImmediate()?**

* `process.nextTick()` → runs **before** next event loop iteration.
* `setImmediate()` → runs **after** current event loop completes.

---

**11. What is middleware in Express?**

* Functions that run **between request and response**.
* Example: logging, authentication, error handling.

---

**12. Common built-in modules?**

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

**23. What is libuv?**

* C library that powers event loop & async I/O.

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

 
