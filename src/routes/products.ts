import { Router, Request, Response, NextFunction } from "express";
import db from "../config/db.js";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      imageUrl1,
      imageUrl2,
      imageAlt,
      categoryId,
      variants,
    } = req.body;

    if (!name || !description || !imageUrl1 || !imageAlt || !categoryId) {
      return res.status(400).json({
        error:
          "name, description, imageUrl1, imageAlt, and categoryId are required",
      });
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        imageUrl1,
        imageUrl2,
        imageAlt,
        categoryId,
        variants: {
          create: variants?.map((v: any) => ({
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

export { router };
