import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Phone, Mail, MapPin, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product } from "@shared/schema";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { t } = useLanguage();
  const { isAuthenticated, isBuyer } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryQuantity, setInquiryQuantity] = useState(1);

  const favoritesMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      if (product.isFavorited) {
        await apiRequest("DELETE", `/api/favorites/${product.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { productId: product.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
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

  const inquiryMutation = useMutation({
    mutationFn: async (data: { productId: string; sellerId: string; message: string; quantity: number }) => {
      await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent",
        description: "Your inquiry has been sent to the seller",
      });
      setShowInquiryForm(false);
      setInquiryMessage("");
      setInquiryQuantity(1);
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
        description: "Failed to send inquiry",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = () => {
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

  const handleInquirySubmit = () => {
    if (!product || !isAuthenticated) return;
    
    inquiryMutation.mutate({
      productId: product.id,
      sellerId: product.sellerId,
      message: inquiryMessage,
      quantity: inquiryQuantity,
    });
  };

  if (!product) return null;

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
  const specifications = product.specifications as Record<string, any> || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t("product.viewDetails")}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-sm"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
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
                  className={`w-6 h-6 ${product.isFavorited ? "fill-current" : ""}`}
                />
              </button>
            </div>
            
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {formatPrice(product.price, product.currency, product.unit)}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
              <p className="text-gray-700 mb-1">{sellerName}</p>
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location}
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (product.seller?.phone) {
                      window.open(`tel:${product.seller.phone}`);
                    }
                  }}
                  disabled={!product.seller?.phone}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t("product.contactSeller")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowInquiryForm(true)}
                  disabled={!isAuthenticated || !isBuyer}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t("product.sendMessage")}
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {t(`tags.${tag}`, tag)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t("product.specifications")}</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                  {Object.keys(specifications).length === 0 && (
                    <p className="text-gray-500">No specifications available</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">{t("product.availability")}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Status:</span> 
                    <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                      {product.inStock ? t("product.inStock") : "Out of Stock"}
                    </span>
                  </p>
                  <p><span className="font-medium">{t("product.delivery")}:</span> {product.deliveryInfo || "2-3 business days"}</p>
                  <p><span className="font-medium">{t("product.minimumOrder")}:</span> {product.minOrder || 1} unit</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            {showInquiryForm && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-3">Send Inquiry</h4>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min="1"
                    value={inquiryQuantity}
                    onChange={(e) => setInquiryQuantity(Number(e.target.value))}
                    placeholder="Quantity"
                  />
                  <Textarea
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Enter your message or inquiry..."
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleInquirySubmit}
                      disabled={inquiryMutation.isPending || !inquiryMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Send Inquiry
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowInquiryForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Sign in required",
                      description: "Please sign in to request quotes",
                      variant: "destructive",
                    });
                    return;
                  }
                  setShowInquiryForm(true);
                }}
              >
                {t("product.requestQuote")}
              </Button>
              <Button
                variant="outline"
                className="px-6 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
                onClick={handleFavoriteClick}
                disabled={favoritesMutation.isPending}
              >
                {product.isFavorited ? t("product.removeFromFavorites") : t("product.addToFavorites")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
