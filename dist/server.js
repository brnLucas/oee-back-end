"use strict";

// src/server.ts
var import_fastify = require("fastify");
var import_client = require("@prisma/client");
var import_zod = require("zod");
var import_luxon = require("luxon");
var app = (0, import_fastify.fastify)();
var timeZone = "America/Manaus";
var prisma = new import_client.PrismaClient();
app.get("/tests", async (request) => {
  const query_params = request.query;
  const tests = await prisma.test.findMany(
    // {
    //     where: {
    //         created_at: {gte: query_params.start_date, lte: query_params.end_date},
    //
    //     },
    // }
  );
  return tests.map((dado) => {
    const queryDateTime = dado.created_at.toISOString();
    const convertedDateTime = import_luxon.DateTime.fromISO(queryDateTime, { zone: "utc" }).setZone(timeZone);
    const formattedDateTime = convertedDateTime.toFormat("yyyy-MM-dd HH:mm:ss");
    return {
      ...dado,
      created_at: formattedDateTime
    };
  });
});
app.post("/tests", async (request, reply) => {
  const createTest = import_zod.z.object({
    card_id: import_zod.z.string(),
    result: import_zod.z.string().toUpperCase()
  });
  const { card_id, result } = createTest.parse(request.body);
  await prisma.test.create({
    data: {
      card_id,
      result
    }
  });
  return reply.status(201).send();
});
app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 8e3
}).then(() => {
  console.log(`Server running`);
});
