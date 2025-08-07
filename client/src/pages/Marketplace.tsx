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
import { ChevronLeft, ChevronRight, Filter, X, Star, Zap } from "lucide-react";
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const itemsPerPage = 12;

  // Sample categories data - replace with your actual categories
  const categories = [
    { id: "1", name: "Construction Materials" },
    { id: "2", name: "Furniture" },
    { id: "3", name: "Tools & Equipment" },
    { id: "4", name: "Electrical" },
    { id: "5", name: "Plumbing" },
    { id: "6", name: "Safety Gear" },
  ];

  const priceRanges = [
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 - $500", min: 100, max: 500 },
    { label: "$500 - $1000", min: 500, max: 1000 },
    { label: "$1000 - $5000", min: 1000, max: 5000 },
    { label: "Over $5000", min: 5000, max: Infinity },
  ];

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

  const handlePriceRangeSelect = (min: number, max: number) => {
    setFilters({
      ...filters,
      minPrice: min.toString(),
      maxPrice: max === Infinity ? "" : max.toString(),
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("marketplace.title")}
          </h1>
          <p className="text-gray-600">{t("marketplace.subtitle")}</p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {totalProducts} products available
              </span>
            </div>
            <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg">
              <Star className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Premium quality guaranteed
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setMobileFiltersOpen(true)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-blue-300 text-blue-600"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Clear all
                </Button>
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Button
                        variant={
                          filters.categoryId === category.id ? "default" : "ghost"
                        }
                        size="sm"
                        className={`w-full justify-start ${
                          filters.categoryId === category.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            categoryId: filters.categoryId === category.id ? "" : category.id,
                          })
                        }
                      >
                        {category.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <div key={index} className="flex items-center">
                      <Button
                        variant={
                          filters.minPrice === range.min.toString() &&
                          (range.max === Infinity || filters.maxPrice === range.max.toString())
                            ? "default"
                            : "ghost"
                        }
                        size="sm"
                        className={`w-full justify-start ${
                          filters.minPrice === range.min.toString() &&
                          (range.max === Infinity || filters.maxPrice === range.max.toString())
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-blue-50"
                        }`}
                        onClick={() => handlePriceRangeSelect(range.min, range.max)}
                      >
                        {range.label}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Price Input */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Custom Price</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="minPrice" className="block text-sm text-gray-600 mb-1">
                      Min ($)
                    </label>
                    <input
                      type="number"
                      id="minPrice"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="block text-sm text-gray-600 mb-1">
                      Max ($)
                    </label>
                    <input
                      type="number"
                      id="maxPrice"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Any"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setCurrentPage(1)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <SearchFilters
              onFiltersChange={handleFiltersChange}
              totalProducts={totalProducts}
              showing={products.length}
            />

            {/* Active Filters */}
            {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.location) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.categoryId && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm">
                    {categories.find(c => c.id === filters.categoryId)?.name}
                    <button
                      onClick={() => setFilters({ ...filters, categoryId: "" })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="inline-flex items-center bg-green-50 text-green-700 rounded-full px-3 py-1 text-sm">
                    ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
                    <button
                      onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })}
                      className="ml-2 text-green-500 hover:text-green-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {filters.location && (
                  <div className="inline-flex items-center bg-teal-50 text-teal-700 rounded-full px-3 py-1 text-sm">
                    {filters.location}
                    <button
                      onClick={() => setFilters({ ...filters, location: "" })}
                      className="ml-2 text-teal-500 hover:text-teal-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <p className="text-red-600 mb-4">{t("error.serverError")}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                    <Skeleton className="w-full h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-gray-200" />
                      <Skeleton className="h-8 w-1/2 bg-gray-200" />
                      <Skeleton className="h-4 w-2/3 bg-gray-200" />
                      <Skeleton className="h-4 w-1/2 bg-gray-200" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 bg-gray-200" />
                        <Skeleton className="h-6 w-20 bg-gray-200" />
                      </div>
                      <Skeleton className="h-10 w-full bg-gray-200" />
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
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
                  alt="No products found"
                  className="h-32 w-32 mx-auto mb-4 opacity-70"
                />
                <p className="text-gray-500 mb-4 text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
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
                  {t("loadMore")} ({totalProducts - products.length} more)
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && products.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex min-h-full">
            <div className="relative w-full max-w-xs bg-white shadow-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="p-4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    Clear all
                  </Button>
                </div>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Button
                          variant={
                            filters.categoryId === category.id ? "default" : "ghost"
                          }
                          size="sm"
                          className={`w-full justify-start ${
                            filters.categoryId === category.id
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              categoryId: filters.categoryId === category.id ? "" : category.id,
                            })
                          }
                        >
                          {category.name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <div key={index} className="flex items-center">
                        <Button
                          variant={
                            filters.minPrice === range.min.toString() &&
                            (range.max === Infinity || filters.maxPrice === range.max.toString())
                              ? "default"
                              : "ghost"
                          }
                          size="sm"
                          className={`w-full justify-start ${
                            filters.minPrice === range.min.toString() &&
                            (range.max === Infinity || filters.maxPrice === range.max.toString())
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                          onClick={() => handlePriceRangeSelect(range.min, range.max)}
                        >
                          {range.label}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Price Input */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Custom Price</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="minPriceMobile" className="block text-sm text-gray-600 mb-1">
                        Min ($)
                      </label>
                      <input
                        type="number"
                        id="minPriceMobile"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxPriceMobile" className="block text-sm text-gray-600 mb-1">
                        Max ($)
                      </label>
                      <input
                        type="number"
                        id="maxPriceMobile"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Any"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setCurrentPage(1);
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}