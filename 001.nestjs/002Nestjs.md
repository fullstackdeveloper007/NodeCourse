# ORM in Nest

---

## 🚀 Steps: Prisma + MS SQL Server (Existing DB)

### 1. **Install dependencies**

```bash
npm install @prisma/client
npm install -D prisma
```

---

### 2. **Initialize Prisma**

```bash
npx prisma init
```

This creates:

* `.env` → add SQL Server connection string
* `prisma/schema.prisma` → schema file

---

### 3. **Configure SQL Server connection**

In `.env`:

```env
DATABASE_URL="sqlserver://localhost:1433;database=MyDb;user=sa;password=YourPassword;encrypt=false"
```

⚠️ Notes:

* Use `encrypt=true` if SSL is enabled on your SQL Server.
* Change user/password accordingly.

---

### 4. **Introspect existing DB**

This is the **first approach** → generate schema from existing DB.

```bash
npx prisma db pull
```

This will read your SQL Server schema and update `prisma/schema.prisma`.
Example result (if you had a `Users` table):

```prisma
model Users {
  id    Int     @id @default(autoincrement())
  name  String?
  email String? @unique
}
```

---

### 5. **Generate Prisma Client**

```bash
npx prisma generate
```

This creates a **typed client** you can inject into Nest.

---

### 6. **Create PrismaService**

`prisma.service.ts`:

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

### 7. **Wire Prisma into AppModule**

`app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
```

---

### 8. **Create Users Service**

`users.service.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.users.findMany();  // Prisma maps your SQL table to model
  }

  create(data: { name: string; email: string }) {
    return this.prisma.users.create({ data });
  }
}
```

---

### 9. **Create Users Controller**

`users.controller.ts`:

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() data: { name: string; email: string }) {
    return this.usersService.create(data);
  }
}
```

---

### 10. **Test it**

* `GET http://localhost:3000/users` → fetch from SQL Server
* `POST http://localhost:3000/users` with JSON → insert into SQL Server

---

✅ That’s **Prisma + MS SQL Server with DB-first approach**.

* You introspected existing DB with `prisma db pull`.
* Now you have typed models in `@prisma/client`.
* All queries are strongly typed.

---

👉 Do you want me to extend this into a **User + Auth module** (JWT + Guard + DTOs + Validation) so you can see **full real-world Prisma + MS SQL integration** in Nest?
