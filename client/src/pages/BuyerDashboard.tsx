import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Heart, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";
import type { Product, Inquiry } from "@shared/schema";

export default function BuyerDashboard() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch favorites
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<Product[]>({
    queryKey: ["/api/favorites"],
  });

  // Fetch sent inquiries
  const { data: sentInquiries = [], isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries/sent"],
  });

  const userName = user?.firstName || user?.companyName || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600">Welcome back, {userName}!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.favorites")}
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {favoritesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  favorites.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Saved products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("dashboard.inquiries")}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inquiriesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  sentInquiries.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Sent inquiries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Access
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Link href="/marketplace">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Favorites */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Favorites</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/favorites">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
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
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-blue-600 font-bold text-lg">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {product.seller?.companyName || 
                             `${product.seller?.firstName || ""} ${product.seller?.lastName || ""}`.trim()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No favorites yet</p>
                    <Button asChild>
                      <Link href="/marketplace">Start Shopping</Link>
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
                <CardTitle>Recent Inquiries</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/inquiries">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : sentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {sentInquiries.slice(0, 5).map((inquiry) => (
                      <div key={inquiry.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <h4 className="font-medium text-sm mb-1">
                          {inquiry.product?.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {inquiry.message}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inquiry.status}
                          </span>
                          <span>
                            {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No inquiries sent</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
