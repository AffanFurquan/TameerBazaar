import { db } from "./db";
import { categories, products, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data
    await db.delete(products);
    await db.delete(categories);
    
    // Seed categories
    const categoryData = [
      {
        name: "Construction Materials",
        nameTranslations: {
          en: "Construction Materials",
          ru: "Строительные материалы",
          de: "Baumaterialien",
          ar: "مواد البناء",
          ur: "تعمیراتی مواد",
          hi: "निर्माण सामग्री"
        },
        slug: "construction-materials",
        description: "Essential materials for construction projects including cement, steel, and aggregates",
        isActive: true
      },
      {
        name: "Furniture",
        nameTranslations: {
          en: "Furniture",
          ru: "Мебель",
          de: "Möbel",
          ar: "أثاث",
          ur: "فرنیچر",
          hi: "फर्नीचर"
        },
        slug: "furniture",
        description: "Office and home furniture including chairs, desks, and storage solutions",
        isActive: true
      },
      {
        name: "Lighting Equipment",
        nameTranslations: {
          en: "Lighting Equipment",
          ru: "Осветительное оборудование",
          de: "Beleuchtungsausrüstung",
          ar: "معدات الإضاءة",
          ur: "لائٹنگ آلات",
          hi: "प्रकाश उपकरण"
        },
        slug: "lighting-equipment",
        description: "LED lights, fixtures, and electrical lighting solutions",
        isActive: true
      },
      {
        name: "Tools & Hardware",
        nameTranslations: {
          en: "Tools & Hardware",
          ru: "Инструменты и оборудование",
          de: "Werkzeuge & Hardware",
          ar: "الأدوات والأجهزة",
          ur: "ٹولز اور ہارڈویئر",
          hi: "उपकरण और हार्डवेयर"
        },
        slug: "tools-hardware",
        description: "Professional tools and hardware for construction and maintenance",
        isActive: true
      },
      {
        name: "Electrical Supplies",
        nameTranslations: {
          en: "Electrical Supplies",
          ru: "Электротовары",
          de: "Elektrobedarf",
          ar: "الإمدادات الكهربائية",
          ur: "برقی سامان",
          hi: "विद्युत आपूर्ति"
        },
        slug: "electrical-supplies",
        description: "Cables, switches, panels, and electrical components",
        isActive: true
      }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Seeded ${insertedCategories.length} categories`);

    // Create a demo seller user if not exists
    const demoSeller = await db.select().from(users).where(eq(users.email, "demo@luova.com"));
    let sellerId = "demo-seller-id";
    
    if (demoSeller.length === 0) {
      const [newSeller] = await db.insert(users).values({
        id: sellerId,
        email: "demo@luova.com",
        firstName: "Demo",
        lastName: "Seller",
        role: "seller",
        companyName: "Luova Demo Company",
        phone: "+971-50-123-4567",
        location: "Dubai, UAE",
        preferredLanguage: "en",
        isActive: true
      }).returning();
      sellerId = newSeller.id;
      console.log("Created demo seller user");
    } else {
      sellerId = demoSeller[0].id;
    }

    // Seed products
    const productData = [
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "construction-materials")!.id,
        name: "Premium Portland Cement",
        nameTranslations: {
          en: "Premium Portland Cement",
          ru: "Портланд цемент премиум класса",
          de: "Premium Portland Zement",
          ar: "إسمنت بورتلاند ممتاز",
          ur: "پریمیم پورٹ لینڈ سیمنٹ",
          hi: "प्रीमियम पोर्टलैंड सीमेंट"
        },
        description: "High-quality Portland cement suitable for all construction projects. This premium cement offers excellent durability, strength, and consistency for both residential and commercial applications.",
        descriptionTranslations: {
          en: "High-quality Portland cement suitable for all construction projects. This premium cement offers excellent durability, strength, and consistency for both residential and commercial applications.",
          ru: "Высококачественный портландцемент, подходящий для всех строительных проектов. Этот премиальный цемент обеспечивает превосходную долговечность, прочность и стабильность для жилых и коммерческих применений.",
          de: "Hochwertiger Portlandzement geeignet für alle Bauprojekte. Dieser Premium-Zement bietet ausgezeichnete Haltbarkeit, Festigkeit und Konsistenz für Wohn- und Gewerbeanwendungen.",
          ar: "إسمنت بورتلاند عالي الجودة مناسب لجميع مشاريع البناء. يوفر هذا الإسمنت الممتاز متانة ممتازة وقوة واتساق للتطبيقات السكنية والتجارية.",
          ur: "تمام تعمیراتی منصوبوں کے لیے موزوں اعلیٰ معیار کا پورٹ لینڈ سیمنٹ۔ یہ پریمیم سیمنٹ رہائشی اور تجارتی استعمال کے لیے بہترین پائیداری، مضبوطی اور مستقل مزاجی فراہم کرتا ہے۔",
          hi: "सभी निर्माण परियोजनाओं के लिए उपयुक्त उच्च गुणवत्ता वाला पोर्टलैंड सीमेंट। यह प्रीमियम सीमेंट आवासीय और वाणिज्यिक अनुप्रयोगों के लिए उत्कृष्ट स्थायित्व, शक्ति और स्थिरता प्रदान करता है।"
        },
        price: "45.00",
        currency: "USD",
        unit: "perBag",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["cement", "construction", "building", "materials"],
        specifications: {
          "Grade": "OPC 53",
          "Strength": "53.5 MPa",
          "Setting Time": "30 mins initial, 600 mins final",
          "Packaging": "50kg bags",
          "Standards": "ASTM C150, BS EN 197-1"
        },
        location: "Dubai, UAE",
        minOrder: 10,
        inStock: true,
        stockQuantity: 500,
        deliveryInfo: "2-3 business days within UAE",
        isActive: true,
        featured: true
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "furniture")!.id,
        name: "Executive Office Chair",
        description: "Ergonomic executive office chair with premium leather upholstery and advanced lumbar support. Perfect for long working hours with maximum comfort and professional appearance.",
        price: "285.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["furniture", "office", "chair", "ergonomic"],
        specifications: {
          "Material": "Genuine leather",
          "Dimensions": "65x65x120cm",
          "Weight Capacity": "150kg",
          "Features": "Adjustable height, swivel, recline",
          "Warranty": "2 years"
        },
        location: "Abu Dhabi, UAE",
        minOrder: 1,
        inStock: true,
        stockQuantity: 25,
        deliveryInfo: "3-5 business days, free assembly",
        isActive: true,
        featured: true
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "lighting-equipment")!.id,
        name: "LED Track Lighting System",
        description: "Modern LED track lighting system with adjustable spotlights. Energy-efficient and perfect for accent lighting in retail spaces, galleries, or modern homes.",
        price: "125.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["lighting", "led", "track", "modern"],
        specifications: {
          "Power": "36W LED",
          "Length": "1.2m track",
          "Color Temperature": "3000K-6500K adjustable",
          "Beam Angle": "15°-60° adjustable",
          "Lifespan": "50,000 hours"
        },
        location: "Sharjah, UAE",
        minOrder: 1,
        inStock: true,
        stockQuantity: 15,
        deliveryInfo: "2-4 business days, installation available",
        isActive: true,
        featured: false
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "construction-materials")!.id,
        name: "Steel Reinforcement Bars",
        description: "High-grade steel reinforcement bars (rebar) for concrete construction. Manufactured to international standards with excellent tensile strength and corrosion resistance.",
        price: "125.00",
        currency: "USD",
        unit: "perTon",
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["steel", "construction", "rebar", "reinforcement"],
        specifications: {
          "Grade": "Grade 60",
          "Diameter": "12mm, 16mm, 20mm",
          "Length": "6m, 12m",
          "Standard": "ASTM A615",
          "Yield Strength": "420 MPa"
        },
        location: "Dubai, UAE",
        minOrder: 1,
        inStock: true,
        stockQuantity: 100,
        deliveryInfo: "Next day delivery for orders above 5 tons",
        isActive: true,
        featured: false
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "furniture")!.id,
        name: "Modern Dining Table Set",
        description: "Contemporary 6-seater dining table set with solid wood construction and elegant design. Includes table and matching chairs with comfortable cushioning.",
        price: "850.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["furniture", "dining", "table", "modern"],
        specifications: {
          "Material": "Solid oak wood",
          "Seating": "6 people",
          "Table Size": "180x90x75cm",
          "Chair Size": "45x45x85cm",
          "Finish": "Natural wood stain"
        },
        location: "Doha, Qatar",
        minOrder: 1,
        inStock: true,
        stockQuantity: 8,
        deliveryInfo: "5-7 business days, white glove delivery",
        isActive: true,
        featured: true
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "lighting-equipment")!.id,
        name: "Industrial Pendant Lights",
        description: "Vintage-style industrial pendant lights perfect for modern kitchens, restaurants, or commercial spaces. Features adjustable cord length and Edison-style LED bulbs.",
        price: "95.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["lighting", "industrial", "pendant", "vintage"],
        specifications: {
          "Style": "Industrial vintage",
          "Bulb Type": "E27 LED Edison",
          "Cord Length": "Adjustable up to 150cm",
          "Material": "Metal shade, fabric cord",
          "Voltage": "220-240V"
        },
        location: "Abu Dhabi, UAE",
        minOrder: 2,
        inStock: true,
        stockQuantity: 20,
        deliveryInfo: "3-4 business days",
        isActive: true,
        featured: false
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "construction-materials")!.id,
        name: "Premium Ceramic Tiles",
        description: "High-quality ceramic floor tiles with anti-slip surface and water resistance. Perfect for bathrooms, kitchens, and high-traffic areas.",
        price: "35.00",
        currency: "USD",
        unit: "perSqM",
        imageUrl: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["tiles", "ceramic", "flooring", "bathroom"],
        specifications: {
          "Size": "60x60cm",
          "Thickness": "10mm",
          "Finish": "Matt anti-slip",
          "Water Absorption": "<0.5%",
          "Grade": "Commercial grade"
        },
        location: "Riyadh, Saudi Arabia",
        minOrder: 10,
        inStock: true,
        stockQuantity: 200,
        deliveryInfo: "4-6 business days",
        isActive: true,
        featured: false
      },
      {
        sellerId,
        categoryId: insertedCategories.find(c => c.slug === "furniture")!.id,
        name: "Contemporary Sofa Set",
        description: "Luxury 3-piece sofa set with premium fabric upholstery and solid hardwood frame. Includes 3-seater sofa, 2-seater loveseat, and accent chair.",
        price: "1450.00",
        currency: "USD",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        imageUrls: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
        tags: ["furniture", "sofa", "livingroom", "luxury"],
        specifications: {
          "Set Includes": "3-seater, 2-seater, accent chair",
          "Frame Material": "Solid hardwood",
          "Upholstery": "Premium fabric",
          "Color Options": "Gray, Beige, Navy",
          "Warranty": "5 years frame, 2 years fabric"
        },
        location: "Dubai, UAE",
        minOrder: 1,
        inStock: true,
        stockQuantity: 5,
        deliveryInfo: "7-10 business days, professional assembly included",
        isActive: true,
        featured: true
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`Seeded ${insertedProducts.length} products`);

    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seeding finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seed };
