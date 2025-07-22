import { PrismaClient } from '@prisma/client'
import { app } from 'electron'
import path from 'path'

// Get the userData directory for the database
const databasePath = path.join(app.getPath('userData'), 'app.db')

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${databasePath}`
    }
  }
})
