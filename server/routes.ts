import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProductSchema, insertInquirySchema, insertCategorySchema, insertSellerDetailsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile and role
  app.patch('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updateData = req.body;
      
      const user = await storage.upsertUser({
        id: userId,
        ...updateData,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Seller details routes
  app.get('/api/seller-details/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      const requestingUserId = req.user.claims.sub;
      
      // Users can only view their own seller details (for now)
      if (userId !== requestingUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sellerDetails = await storage.getSellerDetails(userId);
      res.json(sellerDetails || null);
    } catch (error) {
      console.error("Error fetching seller details:", error);
      res.status(500).json({ message: "Failed to fetch seller details" });
    }
  });

  app.post('/api/seller-details', isAuthenticated, async (req: any, res) => {
    try {
      const requestingUserId = req.user.claims.sub;
      const detailsData = insertSellerDetailsSchema.parse({
        ...req.body,
        userId: requestingUserId, // Ensure userId matches the authenticated user
      });

      const sellerDetails = await storage.createSellerDetails(detailsData);
      res.status(201).json(sellerDetails);
    } catch (error) {
      console.error("Error creating seller details:", error);
      res.status(500).json({ message: "Failed to create seller details" });
    }
  });

  app.patch('/api/seller-details', isAuthenticated, async (req: any, res) => {
    try {
      const requestingUserId = req.user.claims.sub;
      const updateData = req.body;

      const updatedDetails = await storage.updateSellerDetails(requestingUserId, updateData);
      if (!updatedDetails) {
        return res.status(404).json({ message: "Seller details not found" });
      }
      
      res.json(updatedDetails);
    } catch (error) {
      console.error("Error updating seller details:", error);
      res.status(500).json({ message: "Failed to update seller details" });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        location: req.query.location as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sortBy: req.query.sortBy as "newest" | "price_asc" | "price_desc" | "popular",
        limit: req.query.limit ? Number(req.query.limit) : 12,
        offset: req.query.offset ? Number(req.query.offset) : 0,
      };

      const result = await storage.getProducts(filters);
      
      // If user is logged in, check favorites
      const authHeader = req.headers.authorization;
      if (authHeader && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        for (const product of result.products) {
          product.isFavorited = await storage.isProductFavorited(userId, product.id);
        }
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if favorited by current user
      if (req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        product.isFavorited = await storage.isProductFavorited(userId, productId);
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'seller' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Seller access required" });
      }

      const productData = insertProductSchema.parse({
        ...req.body,
        sellerId: userId,
      });

      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = req.params.id;
      
      const product = await storage.getProduct(productId);
      if (!product || product.sellerId !== userId) {
        return res.status(404).json({ message: "Product not found or unauthorized" });
      }

      const updatedProduct = await storage.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = req.params.id;
      
      const product = await storage.getProduct(productId);
      if (!product || product.sellerId !== userId) {
        return res.status(404).json({ message: "Product not found or unauthorized" });
      }

      const deleted = await storage.deleteProduct(productId);
      res.json({ success: deleted });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // My products (seller)
  app.get('/api/my-products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const filters = {
        sellerId: userId,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };

      const result = await storage.getProducts(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching my products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Favorites
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.body;

      await storage.addToFavorites({ userId, productId });
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:productId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = req.params.productId;

      await storage.removeFromFavorites(userId, productId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  // Inquiries
  app.post('/api/inquiries', isAuthenticated, async (req: any, res) => {
    try {
      const buyerId = req.user.claims.sub;
      const inquiryData = insertInquirySchema.parse({
        ...req.body,
        buyerId,
      });

      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inquiry" });
    }
  });

  app.get('/api/inquiries/:type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const type = req.params.type as "sent" | "received";
      
      if (type !== "sent" && type !== "received") {
        return res.status(400).json({ message: "Invalid inquiry type" });
      }

      const inquiries = await storage.getUserInquiries(userId, type);
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/seller-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'seller' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Seller access required" });
      }

      const stats = await storage.getSellerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      res.status(500).json({ message: "Failed to fetch seller stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
