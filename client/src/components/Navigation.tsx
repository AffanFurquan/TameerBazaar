import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { BurgerMenu } from "@/components/ui/burger-menu";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useUser();
  const { t } = useLanguage();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Luova</h1>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`transition-colors pb-4 ${
                  isActive("/")
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/marketplace"
                className={`transition-colors pb-4 ${
                  isActive("/marketplace")
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("nav.marketplace")}
              </Link>
              <Link
                href="/about"
                className={`transition-colors pb-4 ${
                  isActive("/about")
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/contact"
                className={`transition-colors pb-4 ${
                  isActive("/contact")
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>

          {/* Language & Auth */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => (window.location.href = "/api/logout")}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  {t("nav.logout")}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => (window.location.href = "/api/login")}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    {t("nav.signin")}
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/api/login")}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {t("nav.joinnow")}
                  </Button>
                </>
              )}
            </div>

            <BurgerMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
