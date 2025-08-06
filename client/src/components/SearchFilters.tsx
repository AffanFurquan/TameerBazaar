import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    categoryId: string;
    location: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
  }) => void;
  totalProducts: number;
  showing: number;
}

export function SearchFilters({ onFiltersChange, totalProducts, showing }: SearchFiltersProps) {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      categoryId: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-12 h-12 text-base"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filter.category")}
          </label>
          <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange("categoryId", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter.allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("filter.allCategories")}</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filter.priceRange")}
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filter.location")}
          </label>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("filter.allLocations")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("filter.allLocations")}</SelectItem>
              <SelectItem value="Dubai, UAE">Dubai, UAE</SelectItem>
              <SelectItem value="Abu Dhabi, UAE">Abu Dhabi, UAE</SelectItem>
              <SelectItem value="Sharjah, UAE">Sharjah, UAE</SelectItem>
              <SelectItem value="Riyadh, Saudi Arabia">Riyadh, Saudi Arabia</SelectItem>
              <SelectItem value="Doha, Qatar">Doha, Qatar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("filter.sortBy")}
          </label>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("filter.newest")}</SelectItem>
              <SelectItem value="price_asc">{t("filter.priceLowHigh")}</SelectItem>
              <SelectItem value="price_desc">{t("filter.priceHighLow")}</SelectItem>
              <SelectItem value="popular">{t("filter.popular")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {t("filter.showing", { count: showing.toString(), total: totalProducts.toString() })}
        </span>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t("filter.clearFilters")}
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {t("filter.applyFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
}
