import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'teste@finapi.com.br', '${password}', 'now()', 'now()')`
    );
   });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("deve ser possível autenticar", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@finapi.com.br",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("não deve ser possível autenticar com a senha errada", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "teste@finapi.com.br",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });

  it("não deve ser possível autenticar com o email errado", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "wrong@email.com.br",
      password: "admin",
    });

    expect(response.status).toBe(401);
  });
});
