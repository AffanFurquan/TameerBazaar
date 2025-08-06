import type { Language } from "./i18n";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.marketplace": "Marketplace",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.signin": "Sign In",
    "nav.joinnow": "Join Now",
    "nav.logout": "Logout",

    // Marketplace
    "marketplace.title": "Marketplace",
    "marketplace.subtitle": "Discover construction materials, furniture, and equipment from trusted sellers",
    
    // Search and Filters
    "search.placeholder": "Search products, materials, equipment...",
    "filter.category": "Category",
    "filter.allCategories": "All Categories",
    "filter.priceRange": "Price Range",
    "filter.location": "Location",
    "filter.allLocations": "All Locations",
    "filter.sortBy": "Sort By",
    "filter.newest": "Newest First",
    "filter.priceLowHigh": "Price: Low to High",
    "filter.priceHighLow": "Price: High to Low",
    "filter.popular": "Most Popular",
    "filter.clearFilters": "Clear Filters",
    "filter.applyFilters": "Apply Filters",
    "filter.showing": "Showing {{count}} of {{total}} products",

    // Products
    "product.viewDetails": "View Details",
    "product.requestQuote": "Request Quote",
    "product.addToFavorites": "Add to Favorites",
    "product.removeFromFavorites": "Remove from Favorites",
    "product.contactSeller": "Contact Seller",
    "product.sendMessage": "Send Message",
    "product.specifications": "Specifications",
    "product.availability": "Availability",
    "product.inStock": "In Stock",
    "product.outOfStock": "Out of Stock",
    "product.delivery": "Delivery",
    "product.minimumOrder": "Minimum Order",
    "product.sellerInfo": "Seller Information",
    "product.description": "Product Description",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.myProducts": "My Products",
    "dashboard.favorites": "Favorites",
    "dashboard.inquiries": "Inquiries",
    "dashboard.profile": "Profile",
    "dashboard.addProduct": "Add Product",
    "dashboard.totalProducts": "Total Products",
    "dashboard.activeProducts": "Active Products",
    "dashboard.totalInquiries": "Total Inquiries",
    "dashboard.recentInquiries": "Recent Inquiries",
    "dashboard.manageProducts": "Manage Products",

    // User Roles
    "role.buyer": "Buyer/Explorer",
    "role.seller": "Shop Owner/Company",
    "role.admin": "Administrator",
    "role.selectRole": "Select Your Role",
    "role.buyerDescription": "Browse and purchase products from verified sellers",
    "role.sellerDescription": "List your products and manage your business",

    // Profile
    "profile.personalInfo": "Personal Information",
    "profile.businessInfo": "Business Information",
    "profile.firstName": "First Name",
    "profile.lastName": "Last Name",
    "profile.email": "Email",
    "profile.phone": "Phone",
    "profile.location": "Location",
    "profile.companyName": "Company Name",
    "profile.language": "Preferred Language",
    "profile.save": "Save Changes",
    "profile.cancel": "Cancel",

    // Product Form
    "productForm.title": "Product Information",
    "productForm.name": "Product Name",
    "productForm.description": "Description",
    "productForm.category": "Category",
    "productForm.price": "Price",
    "productForm.currency": "Currency",
    "productForm.unit": "Unit",
    "productForm.image": "Product Image",
    "productForm.imageUrl": "Image URL",
    "productForm.tags": "Tags",
    "productForm.location": "Location",
    "productForm.minOrder": "Minimum Order",
    "productForm.stockQuantity": "Stock Quantity",
    "productForm.deliveryInfo": "Delivery Information",
    "productForm.specifications": "Specifications",
    "productForm.save": "Save Product",
    "productForm.cancel": "Cancel",
    "productForm.required": "This field is required",

    // Welcome
    "welcome.title": "Welcome to Luova Marketplace",
    "welcome.subtitle": "Connect with trusted suppliers and find quality construction materials, furniture, and equipment.",
    "welcome.getStarted": "Get Started",
    "welcome.selectRole": "How would you like to use Luova?",

    // Errors and Messages
    "error.unauthorized": "You are logged out. Logging in again...",
    "error.notFound": "Page not found",
    "error.serverError": "Something went wrong. Please try again.",
    "error.networkError": "Network error. Please check your connection.",
    "error.validationError": "Please check your input and try again.",
    "message.success": "Operation completed successfully",
    "message.loading": "Loading...",
    "message.noResults": "No results found",
    "message.tryAgain": "Try Again",

    // Actions
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.delete": "Delete",
    "action.edit": "Edit",
    "action.view": "View",
    "action.send": "Send",
    "action.submit": "Submit",
    "action.search": "Search",
    "action.filter": "Filter",
    "action.loadMore": "Load More",
    "action.back": "Back",
    "action.next": "Next",
    "action.previous": "Previous",

    // Misc
    "loadMore": "Load More Products",
    "units.perBag": "per bag",
    "units.perTon": "per ton",
    "units.perSqM": "per sq m",
    "units.perPiece": "per piece",
    "units.perSet": "per set",

    // Categories
    "categories.construction": "Construction Materials",
    "categories.furniture": "Furniture",
    "categories.lighting": "Lighting Equipment",
    "categories.tools": "Tools & Hardware",
    "categories.electrical": "Electrical Supplies",
    "categories.plumbing": "Plumbing Supplies",

    // Tags
    "tags.cement": "cement",
    "tags.construction": "construction",
    "tags.furniture": "furniture",
    "tags.office": "office",
    "tags.lighting": "lighting",
    "tags.led": "led",
    "tags.steel": "steel",
    "tags.dining": "dining",
    "tags.industrial": "industrial",
    "tags.tiles": "tiles",
    "tags.ceramic": "ceramic",
    "tags.livingRoom": "living room",
    "tags.bedroom": "bedroom",
    "tags.kitchen": "kitchen",
    "tags.bathroom": "bathroom",

    // Inquiry Status
    "inquiry.pending": "Pending",
    "inquiry.responded": "Responded",
    "inquiry.closed": "Closed",
    "inquiry.sent": "Sent Inquiries",
    "inquiry.received": "Received Inquiries",
    "inquiry.message": "Message",
    "inquiry.quantity": "Quantity",
    "inquiry.sendInquiry": "Send Inquiry",
    "inquiry.noInquiries": "No inquiries found",

    // Favorites
    "favorites.title": "Your Favorites",
    "favorites.noFavorites": "No favorites added yet",
    "favorites.addFirst": "Add your first favorite",
    "favorites.removed": "Removed from favorites",
    "favorites.added": "Added to favorites",
  },
  
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.marketplace": "Магазин",
    "nav.about": "О нас",
    "nav.contact": "Контакты",
    "nav.signin": "Войти",
    "nav.joinnow": "Присоединиться",
    "nav.logout": "Выйти",

    // Marketplace
    "marketplace.title": "Магазин",
    "marketplace.subtitle": "Откройте для себя строительные материалы, мебель и оборудование от надежных продавцов",
    
    // Search and Filters
    "search.placeholder": "Поиск товаров, материалов, оборудования...",
    "filter.category": "Категория",
    "filter.allCategories": "Все категории",
    "filter.priceRange": "Диапазон цен",
    "filter.location": "Местоположение",
    "filter.allLocations": "Все локации",
    "filter.sortBy": "Сортировать по",
    "filter.newest": "Сначала новые",
    "filter.priceLowHigh": "Цена: от низкой к высокой",
    "filter.priceHighLow": "Цена: от высокой к низкой",
    "filter.popular": "Самые популярные",
    "filter.clearFilters": "Очистить фильтры",
    "filter.applyFilters": "Применить фильтры",
    "filter.showing": "Показано {{count}} из {{total}} товаров",

    // Products
    "product.viewDetails": "Подробнее",
    "product.requestQuote": "Запросить цену",
    "product.addToFavorites": "В избранное",
    "product.removeFromFavorites": "Удалить из избранного",
    "product.contactSeller": "Связаться с продавцом",
    "product.sendMessage": "Отправить сообщение",
    "product.specifications": "Характеристики",
    "product.availability": "Наличие",
    "product.inStock": "В наличии",
    "product.outOfStock": "Нет в наличии",
    "product.delivery": "Доставка",
    "product.minimumOrder": "Минимальный заказ",
    "product.sellerInfo": "Информация о продавце",
    "product.description": "Описание товара",

    // Welcome
    "welcome.title": "Добро пожаловать в Luova Marketplace",
    "welcome.subtitle": "Свяжитесь с надежными поставщиками и найдите качественные строительные материалы, мебель и оборудование.",
    "welcome.getStarted": "Начать",

    // Errors
    "error.unauthorized": "Вы вышли из системы. Повторный вход...",
    "error.notFound": "Страница не найдена",
    "error.serverError": "Что-то пошло не так. Попробуйте снова.",

    "loadMore": "Загрузить больше товаров"
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.marketplace": "Marktplatz",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.signin": "Anmelden",
    "nav.joinnow": "Jetzt beitreten",
    "nav.logout": "Abmelden",

    // Marketplace
    "marketplace.title": "Marktplatz",
    "marketplace.subtitle": "Entdecken Sie Baumaterialien, Möbel und Geräte von vertrauenswürdigen Verkäufern",

    // Welcome
    "welcome.title": "Willkommen bei Luova Marketplace",
    "welcome.subtitle": "Verbinden Sie sich mit vertrauenswürdigen Lieferanten und finden Sie hochwertige Baumaterialien, Möbel und Geräte.",
    "welcome.getStarted": "Loslegen",

    // Errors
    "error.unauthorized": "Sie sind abgemeldet. Erneut anmelden...",
    "error.notFound": "Seite nicht gefunden",
    "error.serverError": "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",

    "loadMore": "Mehr Produkte laden"
  },

  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.marketplace": "السوق",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.signin": "تسجيل الدخول",
    "nav.joinnow": "انضم الآن",
    "nav.logout": "تسجيل الخروج",

    // Marketplace
    "marketplace.title": "السوق",
    "marketplace.subtitle": "اكتشف مواد البناء والأثاث والمعدات من البائعين الموثوقين",

    // Welcome
    "welcome.title": "مرحباً بك في Luova Marketplace",
    "welcome.subtitle": "تواصل مع الموردين الموثوقين وابحث عن مواد البناء والأثاث والمعدات عالية الجودة.",
    "welcome.getStarted": "البدء",

    // Errors
    "error.unauthorized": "لقد تم تسجيل خروجك. تسجيل الدخول مرة أخرى...",
    "error.notFound": "الصفحة غير موجودة",
    "error.serverError": "حدث خطأ ما. يرجى المحاولة مرة أخرى.",

    "loadMore": "تحميل المزيد من المنتجات"
  },

  ur: {
    // Navigation
    "nav.home": "گھر",
    "nav.marketplace": "بازار",
    "nav.about": "ہمارے بارے میں",
    "nav.contact": "رابطہ",
    "nav.signin": "سائن ان",
    "nav.joinnow": "شامل ہوں",
    "nav.logout": "لاگ آؤٹ",

    // Marketplace
    "marketplace.title": "بازار",
    "marketplace.subtitle": "قابل اعتماد فروشوں سے تعمیراتی مواد، فرنیچر، اور آلات دریافت کریں",

    // Welcome
    "welcome.title": "Luova Marketplace میں خوش آمدید",
    "welcome.subtitle": "قابل اعتماد سپلائرز سے جڑیں اور معیاری تعمیراتی مواد، فرنیچر، اور آلات تلاش کریں۔",
    "welcome.getStarted": "شروع کریں",

    // Errors
    "error.unauthorized": "آپ لاگ آؤٹ ہو گئے ہیں۔ دوبارہ لاگ ان کر رہے ہیں...",
    "error.notFound": "صفحہ نہیں ملا",
    "error.serverError": "کچھ غلط ہوا۔ برائے کرم دوبارہ کوشش کریں۔",

    "loadMore": "مزید پروڈکٹس لوڈ کریں"
  },

  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.marketplace": "बाजार",
    "nav.about": "हमारे बारे में",
    "nav.contact": "संपर्क",
    "nav.signin": "साइन इन",
    "nav.joinnow": "अभी शामिल हों",
    "nav.logout": "लॉगआउट",

    // Marketplace
    "marketplace.title": "बाजार",
    "marketplace.subtitle": "भरोसेमंद विक्रेताओं से निर्माण सामग्री, फर्नीचर और उपकरण खोजें",

    // Welcome
    "welcome.title": "Luova Marketplace में आपका स्वागत है",
    "welcome.subtitle": "भरोसेमंद आपूर्तिकर्ताओं से जुड़ें और गुणवत्तापूर्ण निर्माण सामग्री, फर्नीचर और उपकरण खोजें।",
    "welcome.getStarted": "शुरू करें",

    // Errors
    "error.unauthorized": "आप लॉग आउट हो गए हैं। फिर से लॉग इन कर रहे हैं...",
    "error.notFound": "पृष्ठ नहीं मिला",
    "error.serverError": "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",

    "loadMore": "अधिक उत्पाद लोड करें"
  }
};
