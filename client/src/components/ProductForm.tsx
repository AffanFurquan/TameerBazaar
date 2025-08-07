import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Package, DollarSign, MapPin, Image as ImageIcon } from "lucide-react";
import { useLocation } from "wouter";
import type { Category } from "@shared/schema";

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  currency: string;
  unit: string;
  imageUrl: string;
  tags: string;
  location: string;
  minOrder: number;
  stockQuantity: number;
  deliveryInfo: string;
  specifications: Record<string, string>;
}

interface ProductFormProps {
  productId?: string;
  initialData?: Partial<ProductFormData>;
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    currency: "USD",
    unit: "unit",
    imageUrl: "",
    tags: "",
    location: user?.location || "",
    minOrder: 1,
    stockQuantity: 0,
    deliveryInfo: "",
    specifications: {},
    ...initialData,
  });

  const [specFields, setSpecFields] = useState<Array<{ key: string; value: string }>>([
    { key: "", value: "" },
  ]);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        tags: data.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        specifications: Object.fromEntries(
          specFields
            .filter(field => field.key && field.value)
            .map(field => [field.key, field.value])
        ),
      };

      if (productId) {
        await apiRequest("PATCH", `/api/products/${productId}`, productData);
      } else {
        await apiRequest("POST", "/api/products", productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/seller-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      toast({
        title: productId ? "Product updated" : "Product created",
        description: productId 
          ? "Your product has been updated successfully" 
          : "Your product has been added to the marketplace",
      });
      
      setLocation("/my-products");
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
        description: `Failed to ${productId ? "update" : "create"} product`,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecFieldChange = (index: number, field: "key" | "value", value: string) => {
    const newSpecFields = [...specFields];
    newSpecFields[index][field] = value;
    setSpecFields(newSpecFields);

    // Add new empty field if all fields are filled
    if (field === "value" && value && index === specFields.length - 1) {
      setSpecFields([...newSpecFields, { key: "", value: "" }]);
    }
  };

  const removeSpecField = (index: number) => {
    if (specFields.length > 1) {
      setSpecFields(specFields.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.categoryId || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    createProductMutation.mutate(formData);
  };

  const currencyOptions = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "AED", label: "AED (د.إ)" },
    { value: "SAR", label: "SAR (ر.س)" },
  ];

  const unitOptions = [
    { value: "unit", label: "Per unit" },
    { value: "perBag", label: "Per bag" },
    { value: "perTon", label: "Per ton" },
    { value: "perSqM", label: "Per sq m" },
    { value: "perPiece", label: "Per piece" },
    { value: "perSet", label: "Per set" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>{t("productForm.title")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">
              {t("productForm.name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">
              {t("productForm.description")} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your product in detail"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">
              {t("productForm.category")} <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">
                {t("productForm.price")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">{t("productForm.currency")}</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unit">{t("productForm.unit")}</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Product Media</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="imageUrl">{t("productForm.imageUrl")}</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a direct link to your product image
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Product Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tags">{t("productForm.tags")}</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="cement, construction, materials (comma separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add relevant tags separated by commas
            </p>
          </div>

          <div>
            <Label htmlFor="location">{t("productForm.location")}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Dubai, UAE"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minOrder">{t("productForm.minOrder")}</Label>
              <Input
                id="minOrder"
                type="number"
                min="1"
                value={formData.minOrder}
                onChange={(e) => handleInputChange("minOrder", parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="stockQuantity">{t("productForm.stockQuantity")}</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryInfo">{t("productForm.deliveryInfo")}</Label>
            <Textarea
              id="deliveryInfo"
              value={formData.deliveryInfo}
              onChange={(e) => handleInputChange("deliveryInfo", e.target.value)}
              placeholder="2-3 business days, free shipping on orders above $100"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>{t("productForm.specifications")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {specFields.map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={field.key}
                onChange={(e) => handleSpecFieldChange(index, "key", e.target.value)}
                placeholder="Specification name (e.g. Material)"
              />
              <div className="flex space-x-2">
                <Input
                  value={field.value}
                  onChange={(e) => handleSpecFieldChange(index, "value", e.target.value)}
                  placeholder="Specification value (e.g. Steel)"
                />
                {specFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSpecField(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          type="submit"
          disabled={createProductMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {createProductMutation.isPending 
            ? t("message.loading") 
            : productId 
              ? "Update Product"
              : t("productForm.save")
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setLocation("/my-products")}
        >
          {t("action.cancel")}
        </Button>
      </div>
    </form>
  );
}
