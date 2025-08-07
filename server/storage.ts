import {
  users,
  categories,
  products,
  favorites,
  inquiries,
  sellerDetails,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type InsertFavorite,
  type InsertInquiry,
  type Inquiry,
  type InsertSellerDetails,
  type SellerDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: {
    search?: string;
    categoryId?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    sortBy?: "newest" | "price_asc" | "price_desc" | "popular";
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Favorites operations
  getUserFavorites(userId: string): Promise<Product[]>;
  addToFavorites(favorite: InsertFavorite): Promise<void>;
  removeFromFavorites(userId: string, productId: string): Promise<void>;
  isProductFavorited(userId: string, productId: string): Promise<boolean>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getUserInquiries(userId: string, type: "sent" | "received"): Promise<Inquiry[]>;
  
  // Seller details operations
  getSellerDetails(userId: string): Promise<SellerDetails | undefined>;
  createSellerDetails(details: InsertSellerDetails): Promise<SellerDetails>;
  updateSellerDetails(userId: string, details: Partial<InsertSellerDetails>): Promise<SellerDetails | undefined>;
  
  // Dashboard data
  getSellerStats(sellerId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    recentInquiries: Inquiry[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  // Product operations
  async getProducts(filters?: {
    search?: string;
    categoryId?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: string;
    sortBy?: "newest" | "price_asc" | "price_desc" | "popular";
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let query = db
      .select({
        id: products.id,
        sellerId: products.sellerId,
        categoryId: products.categoryId,
        name: products.name,
        nameTranslations: products.nameTranslations,
        description: products.description,
        descriptionTranslations: products.descriptionTranslations,
        price: products.price,
        currency: products.currency,
        unit: products.unit,
        imageUrl: products.imageUrl,
        imageUrls: products.imageUrls,
        tags: products.tags,
        specifications: products.specifications,
        location: products.location,
        minOrder: products.minOrder,
        inStock: products.inStock,
        stockQuantity: products.stockQuantity,
        deliveryInfo: products.deliveryInfo,
        isActive: products.isActive,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        seller: {
          id: users.id,
          companyName: users.companyName,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          location: users.location,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const conditions = [eq(products.isActive, true), eq(products.inStock, true)];

    if (filters?.search) {
      conditions.push(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.location) {
      conditions.push(ilike(products.location, `%${filters.location}%`));
    }

    if (filters?.minPrice) {
      conditions.push(sql`${products.price}::numeric >= ${filters.minPrice}`);
    }

    if (filters?.maxPrice) {
      conditions.push(sql`${products.price}::numeric <= ${filters.maxPrice}`);
    }

    if (filters?.sellerId) {
      conditions.push(eq(products.sellerId, filters.sellerId));
    }

    query = query.where(and(...conditions));

    // Apply sorting
    switch (filters?.sortBy) {
      case "price_asc":
        query = query.orderBy(asc(products.price));
        break;
      case "price_desc":
        query = query.orderBy(desc(products.price));
        break;
      case "popular":
        query = query.orderBy(desc(products.featured), desc(products.createdAt));
        break;
      case "newest":
      default:
        query = query.orderBy(desc(products.createdAt));
        break;
    }

    // Get total count
    const totalQuery = db
      .select({ count: sql`count(*)` })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions));

    const [{ count }] = await totalQuery;
    const total = Number(count);

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query;

    const productList: Product[] = results.map((row) => ({
      ...row,
      seller: row.seller,
      category: row.category,
    }));

    return { products: productList, total };
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [result] = await db
      .select({
        id: products.id,
        sellerId: products.sellerId,
        categoryId: products.categoryId,
        name: products.name,
        nameTranslations: products.nameTranslations,
        description: products.description,
        descriptionTranslations: products.descriptionTranslations,
        price: products.price,
        currency: products.currency,
        unit: products.unit,
        imageUrl: products.imageUrl,
        imageUrls: products.imageUrls,
        tags: products.tags,
        specifications: products.specifications,
        location: products.location,
        minOrder: products.minOrder,
        inStock: products.inStock,
        stockQuantity: products.stockQuantity,
        deliveryInfo: products.deliveryInfo,
        isActive: products.isActive,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        seller: {
          id: users.id,
          companyName: users.companyName,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          location: users.location,
          phone: users.phone,
          email: users.email,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!result) return undefined;

    return {
      ...result,
      seller: result.seller,
      category: result.category,
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    const fullProduct = await this.getProduct(newProduct.id);
    return fullProduct!;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) return undefined;

    return await this.getProduct(updatedProduct.id);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));

    return result.rowCount > 0;
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<Product[]> {
    const results = await db
      .select({
        id: products.id,
        sellerId: products.sellerId,
        categoryId: products.categoryId,
        name: products.name,
        nameTranslations: products.nameTranslations,
        description: products.description,
        descriptionTranslations: products.descriptionTranslations,
        price: products.price,
        currency: products.currency,
        unit: products.unit,
        imageUrl: products.imageUrl,
        imageUrls: products.imageUrls,
        tags: products.tags,
        specifications: products.specifications,
        location: products.location,
        minOrder: products.minOrder,
        inStock: products.inStock,
        stockQuantity: products.stockQuantity,
        deliveryInfo: products.deliveryInfo,
        isActive: products.isActive,
        featured: products.featured,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        seller: {
          id: users.id,
          companyName: users.companyName,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          location: users.location,
        },
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return results.map((row) => ({
      ...row,
      seller: row.seller,
      category: row.category,
      isFavorited: true,
    }));
  }

  async addToFavorites(favorite: InsertFavorite): Promise<void> {
    await db.insert(favorites).values(favorite).onConflictDoNothing();
  }

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));
  }

  async isProductFavorited(userId: string, productId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));

    return !!result;
  }

  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    
    // Get full inquiry with relations
    const [fullInquiry] = await db
      .select({
        id: inquiries.id,
        buyerId: inquiries.buyerId,
        sellerId: inquiries.sellerId,
        productId: inquiries.productId,
        message: inquiries.message,
        quantity: inquiries.quantity,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
        updatedAt: inquiries.updatedAt,
        buyer: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          phone: users.phone,
        },
        product: {
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
        },
      })
      .from(inquiries)
      .leftJoin(users, eq(inquiries.buyerId, users.id))
      .leftJoin(products, eq(inquiries.productId, products.id))
      .where(eq(inquiries.id, newInquiry.id));

    return {
      ...fullInquiry!,
      buyer: fullInquiry!.buyer,
      product: fullInquiry!.product,
    };
  }

  async getUserInquiries(userId: string, type: "sent" | "received"): Promise<Inquiry[]> {
    const userField = type === "sent" ? inquiries.buyerId : inquiries.sellerId;
    const otherUserField = type === "sent" ? inquiries.sellerId : inquiries.buyerId;

    const results = await db
      .select({
        id: inquiries.id,
        buyerId: inquiries.buyerId,
        sellerId: inquiries.sellerId,
        productId: inquiries.productId,
        message: inquiries.message,
        quantity: inquiries.quantity,
        status: inquiries.status,
        createdAt: inquiries.createdAt,
        updatedAt: inquiries.updatedAt,
        otherUser: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          companyName: users.companyName,
          email: users.email,
          phone: users.phone,
        },
        product: {
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
          price: products.price,
          currency: products.currency,
        },
      })
      .from(inquiries)
      .leftJoin(users, eq(otherUserField, users.id))
      .leftJoin(products, eq(inquiries.productId, products.id))
      .where(eq(userField, userId))
      .orderBy(desc(inquiries.createdAt));

    return results.map((row) => ({
      ...row,
      [type === "sent" ? "seller" : "buyer"]: row.otherUser,
      product: row.product,
    }));
  }

  // Dashboard data
  async getSellerStats(sellerId: string): Promise<{
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    recentInquiries: Inquiry[];
  }> {
    // Get product counts
    const [productStats] = await db
      .select({
        total: sql`count(*)`,
        active: sql`count(*) filter (where ${products.isActive} = true and ${products.inStock} = true)`,
      })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    // Get inquiry count
    const [inquiryStats] = await db
      .select({
        total: sql`count(*)`,
      })
      .from(inquiries)
      .where(eq(inquiries.sellerId, sellerId));

    // Get recent inquiries
    const recentInquiries = await this.getUserInquiries(sellerId, "received");

    return {
      totalProducts: Number(productStats.total),
      activeProducts: Number(productStats.active),
      totalInquiries: Number(inquiryStats.total),
      recentInquiries: recentInquiries.slice(0, 5),
    };
  }

  // Seller details operations
  async getSellerDetails(userId: string): Promise<SellerDetails | undefined> {
    const [details] = await db.select().from(sellerDetails).where(eq(sellerDetails.userId, userId));
    return details;
  }

  async createSellerDetails(details: InsertSellerDetails): Promise<SellerDetails> {
    const [newDetails] = await db.insert(sellerDetails).values(details).returning();
    return newDetails;
  }

  async updateSellerDetails(userId: string, details: Partial<InsertSellerDetails>): Promise<SellerDetails | undefined> {
    const [updatedDetails] = await db
      .update(sellerDetails)
      .set({ ...details, updatedAt: new Date() })
      .where(eq(sellerDetails.userId, userId))
      .returning();
    
    return updatedDetails;
  }
}

export const storage = new DatabaseStorage();
