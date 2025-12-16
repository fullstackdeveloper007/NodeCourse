# RabbitMQ

Advantage of Queue 
* decoupling: 
* Scalable : Multiple comnsuming Service
* Performeant : Queue Can sit on its own machine
* Cloud Friendly
* Cross language communication(Python,Java,C#)
* Message Acknowledgemnet
* Broser based management
* Plug -INS

  Advance AMQP Message model ,Specially Version (0-9-1)


Check out service is connected to Exchange and exchange is connected to queue by binding keys.. Consumers are subscribed to the queue

Fanout exchange: All the meesage to exchange will be duplicated and passed to all the queues.
Direct Exchage : In this exchange the producer will produce the message and that message will also produce the routing key, The routing key is then compared to the binding key of queue, If exact match then it is moved the queue accordingly.
Topic excahnge : Partial match between routing key and binding key, If routing key is"ship.shoes" and binding key is "ship.any", and exchnage is topic excahneg then it will routed to the queue
Header Exchange: Roting key is ignored, the message is moved to the ssytem accroding to the header 
Default Exchange: Routing key is tied to the name of queue itself


# 1️⃣ RabbitMQ Basics

* **RabbitMQ**: Message broker for asynchronous communication.
* **Producer → Exchange → Queue → Consumer**
* Implements **AMQP** protocol.
* Decouples services, improves reliability, fault tolerance, and scalability.

---

# 2️⃣ Core Components

| Component | Role                                             |
| --------- | ------------------------------------------------ |
| Producer  | Sends messages                                   |
| Exchange  | Routes messages (direct, fanout, topic, headers) |
| Queue     | Stores messages                                  |
| Consumer  | Receives messages                                |
| Binding   | Connects Exchange → Queue with rules             |

---

# 3️⃣ Exchange Types

* **Direct** → exact routing key match
* **Fanout** → broadcasts to all queues (routing key ignored)
* **Topic** → pattern-based routing with `*` and `#` wildcards
* **Headers** → routing based on message headers

---

# 4️⃣ Message Acknowledgements (ACK / NACK)

* **ACK** → consumer confirms successful processing → message deleted
* **NACK / Reject** → consumer failed → can requeue or move to DLQ
* **No ACK / crash** → message requeued automatically
* Use **manual ACK (`noAck: false`)** for reliability

---

# 5️⃣ Dead Letter Queue (DLQ) & Dead Letter Exchange (DLX)

* **DLQ**: queue for failed/unprocessed messages
* **DLX**: exchange that routes failed messages to DLQ
* Messages go to DLQ if:

  * NACK with `requeue=false`
  * TTL expires
  * Queue length exceeded
* RabbitMQ **does NOT auto-send unacked messages to DLQ**
* Retry count is **infinite by default**; use `x-death` header + retry queues for limited retries

---

# 6️⃣ Message TTL (Timeout)

* **Message TTL** → expires if not consumed within given time
* Configurable at **queue-level** (`x-message-ttl`) or **per-message** (`expiration`)
* Expired messages can go to **DLQ** via DLX
* RabbitMQ has **no native ACK timeout**; must implement with retry queues or consumer logic

---

# 7️⃣ Fanout Exchange Behavior

* Ignores routing key
* Broadcasts every message to **all queues bound** to it
* Each queue receives **a copy of the message**
* Common for logs, notifications, audit events

---

# 8️⃣ Node.js `Buffer.from()` in RabbitMQ

* RabbitMQ messages are **binary** → Node.js requires `Buffer`
* `Buffer.from(string)` converts string → bytes
* Consumer reads with `msg.content.toString()`
* Works for JSON, strings, or raw bytes

---

# 9️⃣ Retry Patterns

* **Default retry** → infinite (message requeued if unacked)
* **Controlled retry** → use:

  * Retry queue with TTL
  * `x-death` header to track retry count
  * NACK with `requeue=false` → DLQ after max retries

---

# 🔟 Key Takeaways

1. **DLX is always an exchange** — can be direct, fanout, topic, headers.
2. Messages only go to DLQ via **NACK/TTL/queue limits**, not just missing ACK.
3. Fanout = broadcast; Topic = pattern-based; Direct = exact match.
4. Manual ACK is essential for reliability.
5. TTL + DLQ + retry queues = production-grade setup.

---

If you want, I can also make a **single visual diagram showing the entire flow**: producer → exchanges → queues → retries → DLQ — covering **fanout, topic, TTL, ACK/NACK** all in one shot.

Do you want me to do that?



