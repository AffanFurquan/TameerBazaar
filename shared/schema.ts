import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  boolean,
  integer,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth with role support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["buyer", "seller", "admin"] }).default("buyer").notNull(),
  companyName: varchar("company_name"),
  phone: varchar("phone"),
  location: varchar("location"),
  preferredLanguage: varchar("preferred_language", { 
    enum: ["en", "ru", "de", "ar", "ur", "hi"] 
  }).default("en").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  nameTranslations: jsonb("name_translations"),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  name: varchar("name", { length: 200 }).notNull(),
  nameTranslations: jsonb("name_translations"),
  description: text("description").notNull(),
  descriptionTranslations: jsonb("description_translations"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  unit: varchar("unit", { length: 50 }),
  imageUrl: varchar("image_url").notNull(),
  imageUrls: jsonb("image_urls"),
  tags: jsonb("tags"),
  specifications: jsonb("specifications"),
  location: varchar("location").notNull(),
  minOrder: integer("min_order").default(1),
  inStock: boolean("in_stock").default(true).notNull(),
  stockQuantity: integer("stock_quantity"),
  deliveryInfo: text("delivery_info"),
  isActive: boolean("is_active").default(true).notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites
export const favorites = pgTable("favorites", {
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.productId] }),
}));

// Product inquiries/quotes
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id),
  message: text("message").notNull(),
  quantity: integer("quantity").default(1),
  status: varchar("status", { enum: ["pending", "responded", "closed"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  products: many(products),
  favorites: many(favorites),
  inquiriesSent: many(inquiries, { relationName: "buyer" }),
  inquiriesReceived: many(inquiries, { relationName: "seller" }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  favorites: many(favorites),
  inquiries: many(inquiries),
}));

export const favoriteRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

export const inquiryRelations = relations(inquiries, ({ one }) => ({
  buyer: one(users, {
    fields: [inquiries.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [inquiries.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  createdAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect & {
  seller?: User;
  category?: Category;
  isFavorited?: boolean;
};
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect & {
  buyer?: User;
  seller?: User;
  product?: Product;
};
