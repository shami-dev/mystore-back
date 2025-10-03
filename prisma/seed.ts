import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning DB...");

  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Creating categories...");

  const clothingCategory = await prisma.category.create({
    data: { id: 1, name: "Apparel" },
  });

  const accessoriesCategory = await prisma.category.create({
    data: { id: 2, name: "Accessories" },
  });

  console.log("Seeding finished!");
  console.log("Categories created:", [
    clothingCategory.id,
    clothingCategory.name,
    accessoriesCategory.name,
    accessoriesCategory.id,
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
