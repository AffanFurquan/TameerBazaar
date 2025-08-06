import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchFilters } from "@/components/SearchFilters";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Marketplace() {
  const { t } = useLanguage();
  const { isAuthenticated } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: [
      "/api/products",
      filters.search,
      filters.categoryId,
      filters.location,
      filters.minPrice,
      filters.maxPrice,
      filters.sortBy,
      (currentPage - 1) * itemsPerPage,
      itemsPerPage,
    ],
    queryFn: async ({ queryKey }) => {
      const [
        endpoint,
        search,
        categoryId,
        location,
        minPrice,
        maxPrice,
        sortBy,
        offset,
        limit,
      ] = queryKey;

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (categoryId) params.append("categoryId", categoryId);
      if (location) params.append("location", location);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortBy) params.append("sortBy", sortBy);
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
  });

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("marketplace.title")}
          </h1>
          <p className="text-gray-600">{t("marketplace.subtitle")}</p>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          onFiltersChange={handleFiltersChange}
          totalProducts={totalProducts}
          showing={products.length}
        />

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{t("error.serverError")}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  search: "",
                  categoryId: "",
                  location: "",
                  minPrice: "",
                  maxPrice: "",
                  sortBy: "newest",
                });
                setCurrentPage(1);
              }}
            >
              {t("filter.clearFilters")}
            </Button>
          </div>
        )}

        {/* Load More Section */}
        {!isLoading && products.length > 0 && currentPage < totalPages && (
          <div className="text-center mb-8">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
            >
              {t("loadMore")}
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Page Numbers */}
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
                  onClick={() => handlePageChange(pageNumber)}
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

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
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
