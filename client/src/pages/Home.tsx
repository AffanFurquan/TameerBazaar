import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ShoppingBag, Heart, MessageSquare, TrendingUp } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { user, isBuyer, isSeller } = useUser();

  const userName = user?.firstName || user?.companyName || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            {isSeller 
              ? "Manage your products and connect with buyers"
              : "Discover quality products from trusted sellers"
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/marketplace">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("nav.marketplace")}
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Browse products and materials
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.title")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {isSeller ? "Manage your business" : "View your activity"}
                </p>
              </CardContent>
            </Card>
          </Link>

          {isBuyer && (
            <Link href="/favorites">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("dashboard.favorites")}
                  </CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Your saved products
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/inquiries">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("dashboard.inquiries")}
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {isSeller ? "Customer inquiries" : "Your messages"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Action */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {isSeller ? "Start Selling" : "Start Exploring"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {isSeller 
                    ? "List your products and reach potential customers across the marketplace"
                    : "Find the perfect construction materials, furniture, and equipment for your needs"
                  }
                </p>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={isSeller ? "/add-product" : "/marketplace"}>
                    {isSeller ? t("dashboard.addProduct") : "Browse Products"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Role</p>
                  <p className="text-sm text-gray-600">
                    {t(user?.role === "buyer" ? "role.buyer" : "role.seller")}
                  </p>
                </div>
                {user?.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{user.location}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
