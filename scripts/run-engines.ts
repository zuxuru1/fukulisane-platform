import { PrismaClient } from '../src/generated/prisma/client'
import { runAllEngines } from '../src/lib/engines'

const prisma = new PrismaClient({ datasourceUrl: 'file:./prisma/dev.db' })

async function main() {
  console.log('Running all invisible engines...')
  const businesses = await prisma.business.findMany()
  for (const biz of businesses) {
    console.log(`\nEngine run for: ${biz.name} (${biz.id})`)
    const result = await runAllEngines(biz.id)
    console.log(`  ${result.status}: ${result.message}`)
  }
  console.log('\nAll engines complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
