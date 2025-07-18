const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigrations() {
  console.log('🚀 Applying manual migrations...');
  
  try {
    // Check if refresh_tokens table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'refresh_tokens'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('📄 Creating refresh_tokens table...');
      
      // Create refresh_tokens table
      await prisma.$executeRaw`
        CREATE TABLE "refresh_tokens" (
          "id" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "isRevoked" BOOLEAN NOT NULL DEFAULT false,
          "deviceId" TEXT,
          "userAgent" TEXT,
          "ipAddress" TEXT,
          CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
        );
      `;
      
      // Create indexes
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
      `;
      
      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      
      console.log('✅ refresh_tokens table created successfully');
    } else {
      console.log('ℹ️  refresh_tokens table already exists');
    }
    
    // Check if User table has reset password columns
    const columnExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name = 'resetPasswordToken'
      );
    `;
    
    if (!columnExists[0].exists) {
      console.log('📄 Adding password reset columns to User table...');
      
      // Add reset password columns
      await prisma.$executeRaw`
        ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
      `;
      
      await prisma.$executeRaw`
        ALTER TABLE "User" ADD COLUMN "resetPasswordExpires" TIMESTAMP(3);
      `;
      
      // Add unique constraint
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
      `;
      
      console.log('✅ Password reset columns added successfully');
    } else {
      console.log('ℹ️  Password reset columns already exist');
    }
    
    console.log('🎉 All migrations applied successfully!');
    
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migrations
applyMigrations()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });