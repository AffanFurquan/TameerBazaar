import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Store, Users, Package } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: "buyer" | "seller") => void;
  isLoading?: boolean;
}

export function RoleSelector({ onRoleSelect, isLoading }: RoleSelectorProps) {
  const { t } = useLanguage();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold mb-2">
          {t("welcome.selectRole")}
        </CardTitle>
        <p className="text-gray-600">
          {t("role.selectRole")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buyer Role */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("role.buyer")}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {t("role.buyerDescription")}
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Browse products from verified sellers
                </li>
                <li className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Save favorites and manage wishlists
                </li>
                <li className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Send inquiries and request quotes
                </li>
              </ul>
              <Button
                onClick={() => onRoleSelect("buyer")}
                disabled={isLoading}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                {isLoading ? "Setting up..." : "Continue as Buyer"}
              </Button>
            </CardContent>
          </Card>

          {/* Seller Role */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("role.seller")}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {t("role.sellerDescription")}
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-6">
                <li className="flex items-center">
                  <Store className="w-4 h-4 mr-2" />
                  List and manage your products
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Connect with potential buyers
                </li>
                <li className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Track sales and analytics
                </li>
              </ul>
              <Button
                onClick={() => onRoleSelect("seller")}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Setting up..." : "Continue as Seller"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            You can change your role later in your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
