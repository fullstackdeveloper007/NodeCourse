# Nest.js 

### 1. What is Nest.js?

* **A Node.js framework** for building efficient, scalable backend apps.
* Built on **TypeScript** (but supports JS).
* Follows **modular architecture** (inspired by Angular).
* Uses **decorators** for routes, DI (dependency injection), etc.
* The services are made available to the controller via **DI (Dependency Injection)  @Injectable()**

### 2. Core Concepts

* **Module** → logical grouping (like `AppModule`, `UserModule`). -->groups everything.
* **Controller** → handles incoming requests (routes). --> defines route handlers.
* **Service** → business logic(We add @Injectable() on top of service) → makes class available for DI.
* **Provider** → injectable classes (services, repos).
* **@Get(), @Post()** ... → route decorators.
* **NestFactory.create(AppModule)** → bootstrap entry.

### 3. File Flow Example

📁 Project structure:

```
src/
 ├── app.module.ts      # Root module
 ├── app.controller.ts  # Routes (GET /hello)
 ├── app.service.ts     # Business logic
 └── main.ts            # App entry point
```

### 4. Minimal Example

**main.ts** (entry point):

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

**app.module.ts**:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**app.controller.ts**:

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
```

**app.service.ts**:

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Backend Engineer!';
  }
}
```
👉 Run:

```bash
npm run start
```

### 5. Key Takeaways 

* `@Module()` → groups everything.
* `@Controller()` → defines route handlers.
* `@Get(), @Post(), ...` → route decorators.
* `@Injectable()` → makes class available for DI.
* `NestFactory.create(AppModule)` → bootstrap entry.

## Example of a new method  
👉 Route = GET /localhost:3000/hello
```ts
@Controller()
export class AppController {
  @Get('hello')
  getHello() {
    return 'Hello World';
  }
}
```

More Exaple of nest.js apis

```ts
@Controller('ninjas')
export class NinjasController {
  @Get()
  getAll() {
    return ['Ninja 1', 'Ninja 2'];
  }
 👉 Route =(http://localhost:3000/ninjas/id=200)or :id=200
  @Get(':id')
  getOne(@Param('id') id: string) {
    return `Ninja #${id}`;
  }

  @Post()
  create(@Body() ninja: any) {
    return { message: 'Ninja created', ninja };
  }
}


```
### Create new controller in node
 ```ts 
 nest g controller student
student.controller.ts will be created
```
### Below menthod i have added
```ts
import { Controller, Get } from '@nestjs/common';

@Controller('student')
export class StudentController {
  @Get()
  getStudent(): string {
      return 'This is student controller';
  }
  @Get("GetTeacherName")
  getTeacher(): string {
      return 'This is the Teacher Name';
  }

  @Post()
  createNewTecher(@Body() teacherData: any) {
    return { message: 'New teacher created!', data: teacherData };
  }
}
```
### Register in a Module
Now you must tell NestJS about this controller by adding it into a module (like AppModule):
```ts
import { Module } from '@nestjs/common';
import { StudentController } from './Student.controller';

@Module({
  controllers: [StudentController], // 👈 register controller here
})
export class AppModule {}

```
---

# 🔹 1. **Pipes** → validation & transformation

* **When used:** before the request hits your controller method.
* **Purpose:**

  * Validate inputs (e.g., check if email is valid, if age is a number).
  * Transform inputs (e.g., turn `"123"` into `123`).
* **Built-in examples:**

  * `ValidationPipe` (with `class-validator`)
  * `ParseIntPipe`
  * `ParseBoolPipe`

```ts
@Get(':id')
getOne(@Param('id', ParseIntPipe) id: number) {
  // "42" from URL becomes number 42
  return { id };
}
```

```ts
@Post()
create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  // request body validated against DTO rules
}
```

👉 Think: **Pipes = Clean/validate data before your logic runs.**

---

# 🔹 2. **Guards** → authorization

* **When used:** before a route handler executes.
* **Purpose:** decide if a request is **allowed or not**.
* **Return value:**

  * `true` → request continues
  * `false` → request blocked with `403 Forbidden`

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    return req.headers['authorization'] === 'secret';
  }
}
```

```ts
@UseGuards(AuthGuard)
@Get('protected')
getProtected() {
  return 'You are authorized!';
}
```

👉 Think: **Guards = "Do you have permission?"**

---

# 🔹 3. **Interceptors** → wrapping logic (before/after)

* **When used:** around your request/response cycle.
* **Purpose:**

  * Run extra logic **before** a request hits your handler
  * Run logic **after** handler returns a response
  * Can transform responses, log, cache, add timing, etc.

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before handler...');
    return next
      .handle()
      .pipe(tap(() => console.log('After handler...')));
  }
}
```

```ts
@UseInterceptors(LoggingInterceptor)
@Get()
findAll() {
  return ['one', 'two'];
}
```

👉 Think: **Interceptors = "middleware++" that can also modify responses.**

---

# 🔹 4. **Middleware** → request preprocessing

* **When used:** **before** Nest routes (like Express middleware).
* **Purpose:** modify request/response, logging, CORS, body-parsing.
* Runs at the raw **Express (or Fastify) level**, not tied to DI as tightly.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}
```

Register it in a module:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

👉 Think: **Middleware = Express-style pre-processing**.

---

# 📝 Summary Table

| Feature         | When it runs                      | Purpose                                          | Example Use                  |
| --------------- | --------------------------------- | ------------------------------------------------ | ---------------------------- |
| **Pipe**        | Before controller                 | Validate & transform input                       | ParseIntPipe, ValidationPipe |
| **Guard**       | Before controller                 | Allow/deny request                               | AuthGuard, RolesGuard        |
| **Interceptor** | Around controller                 | Add extra logic before/after, transform response | Logging, Response mapping    |
| **Middleware**  | Before controller (at HTTP level) | Preprocess requests globally (like Express)      | Logger, CORS, Body parser    |

---

👉 Easy way to remember:

* **Pipes = clean data**
* **Guards = protect routes**
* **Interceptors = wrap requests/responses**
* **Middleware = raw preprocessing**

Client Request
   ↓
Middleware   (runs first, before hitting controllers)
   ↓
Guards       (check if request is allowed → auth/roles)
   ↓
Interceptors (before controller, can transform/measure time)
   ↓
Pipes        (validate/transform method arguments)
   ↓
Controller   (your route handler executes)
   ↓
Service      (business logic)
   ↓
Interceptors (after controller, can modify response)
   ↓
Response sent back to Client

---

Do you want me to make a **diagram (request → middleware → guard → pipe → controller → interceptor → response)** so you can see the full request lifecycle visually?

