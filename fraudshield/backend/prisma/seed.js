const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create default admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
    },
  });

  console.log(`✅ Admin user created/verified: ${admin.email}`);

  // Sample entities for testing
  const sampleEntities = [
    {
      type: 'PHONE',
      value: '+91 9876543210',
      normalizedValue: '9876543210',
      riskScore: 85,
      status: 'HIGH_RISK',
    },
    {
      type: 'UPI',
      value: 'scammer@ybl',
      normalizedValue: 'scammer@ybl',
      riskScore: 92,
      status: 'HIGH_RISK',
    },
    {
      type: 'URL',
      value: 'http://phishingsite.com',
      normalizedValue: 'phishingsite.com',
      riskScore: 78,
      status: 'SUSPICIOUS',
    },
  ];

  for (const entityData of sampleEntities) {
    const existing = await prisma.entity.findUnique({
      where: { normalizedValue: entityData.normalizedValue },
    });

    if (!existing) {
      await prisma.entity.create({
        data: entityData,
      });
      console.log(`✅ Sample entity created: ${entityData.value}`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

