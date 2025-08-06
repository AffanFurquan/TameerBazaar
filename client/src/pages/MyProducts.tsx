import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, Package, MoreHorizontal } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@shared/schema";

export default function MyProducts() {
  const { t } = useLanguage();
  const { isAuthenticated, isSeller, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: productsData, isLoading, error } = useQuery<{products: Product[], total: number}>({
    queryKey: ["/api/my-products", (currentPage - 1) * itemsPerPage, itemsPerPage],
    queryFn: async ({ queryKey }) => {
      const [endpoint, offset, limit] = queryKey;
      const params = new URLSearchParams();
      params.append("offset", offset.toString());
      params.append("limit", limit.toString());

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: isAuthenticated && isSeller,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/seller-stats"] });
      toast({
        title: "Product deleted",
        description: "Product has been removed from your inventory",
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
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated or not a seller
  if (!userLoading && (!isAuthenticated || !isSeller)) {
    if (!isAuthenticated) {
      toast({
        title: t("error.unauthorized"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    } else {
      toast({
        title: "Access Denied",
        description: "Only sellers can manage products",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
    return null;
  }

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("dashboard.myProducts")}
            </h1>
            <p className="text-gray-600">
              {totalProducts > 0 
                ? `${totalProducts} ${totalProducts === 1 ? 'product' : 'products'} in your inventory`
                : "Manage your product inventory"
              }
            </p>
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

        {/* Error State */}
        {error && (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <div className="text-red-600 mb-4">{t("error.serverError")}</div>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t("message.tryAgain")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant={product.inStock ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {product.inStock ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    ${parseFloat(product.price).toFixed(2)}
                    {product.unit && (
                      <span className="text-sm text-gray-500 font-normal ml-1">
                        {t(`units.${product.unit}`, product.unit)}
                      </span>
                    )}
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {product.location}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Stock: {product.stockQuantity || 0}</span>
                    <span>Min Order: {product.minOrder || 1}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your inventory by adding your first product. Make it visible to thousands of potential buyers on our marketplace.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/add-product">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
