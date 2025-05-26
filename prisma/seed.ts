/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brands = [
  {
    name: 'Chevrolet',
    models: ['Aveo', 'Spark', 'Sail', 'D-Max', 'Tracker', 'Captiva'],
  },
  {
    name: 'Kia',
    models: ['Rio', 'Sportage', 'Picanto', 'Sorento', 'Cerato'],
  },
  {
    name: 'Hyundai',
    models: ['Accent', 'Tucson', 'Elantra', 'Santa Fe', 'Grand i10', 'Kona'],
  },
  {
    name: 'Toyota',
    models: ['Hilux', 'Fortuner', 'Corolla', 'Prado', 'Yaris'],
  },
  {
    name: 'Mazda',
    models: ['BT-50', 'CX-5', 'Mazda 3', 'Mazda 2'],
  },
  {
    name: 'Renault',
    models: ['Duster', 'Logan', 'Sandero', 'Kwid'],
  },
  {
    name: 'Nissan',
    models: ['Frontier', 'Versa', 'Sentra', 'X-Trail', 'March'],
  },
  {
    name: 'Ford',
    models: ['Ranger', 'EcoSport', 'Explorer'],
  },
  {
    name: 'Volkswagen',
    models: ['Gol', 'Tiguan', 'Polo'],
  },
  {
    name: 'Suzuki',
    models: ['Vitara', 'Swift', 'Grand Vitara'],
  },
];

async function main() {
  for (const brand of brands) {
    const createdBrand = await prisma.brand.create({
      data: {
        name: brand.name,
      },
    });
    for (const model of brand.models) {
      await prisma.model.create({
        data: {
          name: model,
          brandId: createdBrand.id,
        },
      });
    }
  }
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect().then(() => {});
  });
