import { Navigation } from "@/components/Navigation";
import { ProductForm } from "@/components/ProductForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

export default function AddProduct() {
  const { t } = useLanguage();
  const { isAuthenticated, isSeller, isLoading: userLoading } = useUser();
  const { toast } = useToast();

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
        description: "Only sellers can add products",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
    return null;
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.addProduct")}
          </h1>
          <p className="text-gray-600">
            Add a new product to your inventory and make it available to buyers
          </p>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
