import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { t } = useLanguage();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoritesMutation = useMutation({
    mutationFn: async () => {
      if (product.isFavorited) {
        await apiRequest("DELETE", `/api/favorites/${product.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { productId: product.id });
      }
    },
    onSuccess: () => {
      // Update the product in cache
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      
      toast({
        title: product.isFavorited ? "Removed from favorites" : "Added to favorites",
        description: product.isFavorited 
          ? "Product removed from your favorites list" 
          : "Product added to your favorites list",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t("error.unauthorized"),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add products to favorites",
        variant: "destructive",
      });
      return;
    }
    favoritesMutation.mutate();
  };

  const formatPrice = (price: string, currency: string, unit?: string) => {
    const numPrice = parseFloat(price);
    const formattedPrice = `$${numPrice.toFixed(2)}`;
    
    if (unit) {
      return `${formattedPrice} ${t(`units.${unit}`, unit)}`;
    }
    
    return formattedPrice;
  };

  const sellerName = product.seller?.companyName || 
    `${product.seller?.firstName || ""} ${product.seller?.lastName || ""}`.trim() || 
    "Unknown Seller";

  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <button
            onClick={handleFavoriteClick}
            disabled={favoritesMutation.isPending}
            className={`transition-colors ${
              product.isFavorited
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${product.isFavorited ? "fill-current" : ""}`}
            />
          </button>
        </div>
        
        <p className="text-2xl font-bold text-blue-600 mb-2">
          {formatPrice(product.price, product.currency, product.unit)}
        </p>
        
        <p className="text-gray-600 mb-3 line-clamp-1">{sellerName}</p>
        
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {product.location}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {t(`tags.${tag}`, tag)}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        
        <Button
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {t("product.viewDetails")}
        </Button>
      </div>
    </div>
  );
}
