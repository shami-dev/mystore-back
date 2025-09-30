import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning DB...");

  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Creating categories...");

  const shoesCategory = await prisma.category.create({
    data: { name: "Shoes" },
  });

  const clothingCategory = await prisma.category.create({
    data: { name: "Clothing" },
  });

  const accessoriesCategory = await prisma.category.create({
    data: { name: "Accessories" },
  });

  console.log("Seeding finished!");
  console.log("Categories created:", [
    shoesCategory.name,
    clothingCategory.name,
    accessoriesCategory.name,
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
