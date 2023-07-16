import {fastify} from "fastify";
import {PrismaClient} from "@prisma/client";
import {z} from 'zod'
import {DateTime} from 'luxon'

const app = fastify()
const timeZone = "America/Manaus"


const prisma = new PrismaClient()
app.get('/tests', async (request) => {
    const query_params: any = request.query
    const tests = await prisma.test.findMany(
        // {
        //     where: {
        //         created_at: {gte: query_params.start_date, lte: query_params.end_date},
        //
        //     },
        // }
    )

    return tests.map((dado) => {
        const queryDateTime = dado.created_at.toISOString();
        const convertedDateTime = DateTime.fromISO(queryDateTime, {zone: 'utc'}).setZone(timeZone);
        const formattedDateTime = convertedDateTime.toFormat("yyyy-MM-dd HH:mm:ss");

        return {
            ...dado, created_at: formattedDateTime
        }
    })
})

app.post('/tests', async (request, reply) => {
    const createTest = z.object({
        card_id: z.string(),
        result: z.string().toUpperCase(),
    })
    const {card_id, result} = createTest.parse(request.body)

    await prisma.test.create({
        data: {
            card_id,
            result,
        }
    })

    return reply.status(201).send()
})


app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 8000
}).then(() => {
    console.log(`Server running`)
})