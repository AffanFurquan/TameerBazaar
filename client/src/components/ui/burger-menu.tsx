import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, ShoppingBag, Heart, MessageSquare, Settings, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isBuyer, isSeller } = useUser();
  const { t } = useLanguage();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[300px]">
        <div className="flex flex-col space-y-4 pt-6">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/marketplace"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.marketplace")}
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.contact")}
            </Link>
          </div>

          {isAuthenticated && user ? (
            <>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 px-3 pb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user.firstName || user.companyName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t(user.role === "buyer" ? "role.buyer" : "role.seller")}
                    </p>
                  </div>
                </div>
              </div>

              {/* User-specific menu items */}
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>{t("dashboard.title")}</span>
                </Link>

                {isBuyer && (
                  <Link
                    href="/favorites"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{t("dashboard.favorites")}</span>
                  </Link>
                )}

                {isSeller && (
                  <Link
                    href="/my-products"
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t("dashboard.myProducts")}</span>
                  </Link>
                )}

                <Link
                  href="/inquiries"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t("dashboard.inquiries")}</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>{t("dashboard.profile")}</span>
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <Button
                onClick={() => (window.location.href = "/api/login")}
                variant="outline"
                className="w-full"
              >
                {t("nav.signin")}
              </Button>
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t("nav.joinnow")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
