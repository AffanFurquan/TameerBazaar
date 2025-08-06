import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Package,
  Eye,
  DollarSign
} from "lucide-react";
import type { Product, Inquiry } from "@shared/schema";

interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalInquiries: number;
  recentInquiries: Inquiry[];
}

export default function SellerDashboard() {
  const { t } = useLanguage();
  const { user } = useUser();

  // Fetch seller stats
  const { data: stats, isLoading: statsLoading } = useQuery<SellerStats>({
    queryKey: ["/api/dashboard/seller-stats"],
  });

  // Fetch my products
  const { data: productsData, isLoading: productsLoading } = useQuery<{products: Product[], total: number}>({
    queryKey: ["/api/my-products"],
    queryFn: async () => {
      const response = await fetch("/api/my-products?limit=6", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const userName = user?.companyName || user?.firstName || "Seller";
  const products = productsData?.products || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="text-gray-600">Welcome back, {userName}!</p>
          </div>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Link href="/add-product">
              <Plus className="w-5 h-5 mr-2" />
              {t("dashboard.addProduct")}
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.totalProducts")}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.totalProducts || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                All time products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.activeProducts")}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.activeProducts || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently listed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.totalInquiries")}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.totalInquiries || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer inquiries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                size="sm"
                className="w-full"
                variant="outline"
              >
                <Link href="/my-products">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Products */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Products</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/my-products">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="border rounded-lg overflow-hidden">
                        <Skeleton className="w-full h-32" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            <Badge
                              variant={product.inStock ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {product.inStock ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-blue-600 font-bold text-lg">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {product.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No products listed yet</p>
                    <Button asChild>
                      <Link href="/add-product">Add Your First Product</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Inquiries */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("dashboard.recentInquiries")}</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/inquiries">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {inquiry.product?.name}
                          </h4>
                          <Badge
                            variant={
                              inquiry.status === 'pending' ? "destructive" :
                              inquiry.status === 'responded' ? "default" :
                              "secondary"
                            }
                            className="text-xs"
                          >
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          From: {inquiry.buyer?.firstName || inquiry.buyer?.lastName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {inquiry.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            Qty: {inquiry.quantity || 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No inquiries yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
