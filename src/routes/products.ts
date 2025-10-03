import { Router, Request, Response, NextFunction } from "express";
import db from "../config/db.js";
import { flattenError, z } from "zod";

const router = Router();

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be under 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(500, { message: "Description must be under 500 characters" }),
  imageAlt: z.string().min(1, { message: "Image alt is required" }).max(150, {
    message: "Image alternative text must be under 150 characters",
  }),
  imageUrl1: z.url(),
  imageUrl2: z.union([z.url(), z.literal("")]).optional(),
  categoryId: z.number().int().positive(),
  variants: z.array(
    z.object({
      size: z
        .string()
        .min(1, { message: "Size is required" })
        .max(100, { message: "Size must be under 100 characters" }),
      sku: z
        .string()
        .min(1, { message: "SKU is required" })
        .max(100, { message: "SKU must be under 100 characters" }),
      price: z.number().positive(),
      stockQuantity: z.number().int().nonnegative(),
      sortOrder: z.number().int().nonnegative(),
    })
  ),
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: flattenError(result.error).fieldErrors,
    });
  }

  const validated = result.data;

  try {
    const product = await db.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        imageUrl1: validated.imageUrl1,
        imageUrl2: validated.imageUrl2,
        imageAlt: validated.imageAlt,
        categoryId: validated.categoryId,
        variants: {
          create: validated.variants.map((v) => ({
            size: v.size,
            sku: v.sku,
            price: v.price,
            stockQuantity: v.stockQuantity,
            sortOrder: v.sortOrder,
          })),
        },
      },
      include: {
        variants: true,
        category: true,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;

    const products = await db.product.findMany({
      where: categoryId ? { categoryId: Number(categoryId) } : undefined,
      select: {
        id: true,
        name: true,
        imageUrl1: true,
        imageUrl2: true,
        imageAlt: true,
        variants: {
          select: {
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = products.map((p) => {
      const prices = p.variants.map((v) => Number(v.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      return {
        id: p.id,
        name: p.name,
        imageUrl1: p.imageUrl1,
        imageUrl2: p.imageUrl2 || "",
        imageAlt: p.imageAlt || "",
        priceRange: {
          min: minPrice,
          max: maxPrice,
        },
      };
    });

    return res.status(200).json(items);
  } catch (err) {
    console.error("GET /products error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
