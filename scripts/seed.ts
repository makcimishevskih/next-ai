// @ts-ignore-next-line
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
const a = await db.category.createMany({
        data: [
          {name: "Famous People"},
          {name: "Movies & TV"},
          {name: "Musicians"},
          {name: "Games"},
          {name: "Philosophy"},
          {name: "Scientists"}
        ]
      });
      console.log(a, 'count:' ,a.count)
  } catch(err) {
    console.error('Error seeding default categories', err);
  } finally {
    await db.$disconnect();
  }
}

main();