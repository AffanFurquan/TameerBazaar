import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function Favorites() {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: favorites = [], isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  if (!userLoading && !isAuthenticated) {
    toast({
      title: t("error.unauthorized"),
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("favorites.title")}
          </h1>
          <p className="text-gray-600">
            {favorites.length > 0 
              ? `${favorites.length} ${favorites.length === 1 ? 'product' : 'products'} in your favorites`
              : "Your favorite products will appear here"
            }
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <div className="text-red-600 mb-4">{t("error.serverError")}</div>
              <Button onClick={() => refetch()} variant="outline">
                {t("message.tryAgain")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && favorites.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("favorites.noFavorites")}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring our marketplace to discover amazing products and add them to your favorites.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/marketplace">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
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
