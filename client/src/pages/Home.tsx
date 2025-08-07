import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { ShoppingBag, Heart, MessageSquare, TrendingUp, PlusCircle, User, MapPin } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { user, isBuyer, isSeller } = useUser();

  const userName = user?.firstName || user?.companyName || "User";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Stats */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome back, <span className="text-blue-600">{userName}</span>!
              </h1>
              <p className="text-gray-600">
                {isSeller 
                  ? "Manage your products and grow your business"
                  : "Discover quality products from trusted sellers"
                }
              </p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-600">Messages</p>
              </div>
              {isSeller && (
                <div className="text-center p-3 bg-teal-50 rounded-lg">
                  <p className="text-2xl font-bold text-teal-600">0</p>
                  <p className="text-xs text-gray-600">Products</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Improved Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Link href="/marketplace">
            <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {t("nav.marketplace")}
                </CardTitle>
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  Browse thousands of products
                </p>
                <div className="mt-2 text-blue-600 text-xs font-medium">
                  Explore now →
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-green-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                  {t("dashboard.title")}
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  {isSeller ? "Business analytics" : "Your activity"}
                </p>
                <div className="mt-2 text-green-600 text-xs font-medium">
                  View dashboard →
                </div>
              </CardContent>
            </Card>
          </Link>

          {isBuyer && (
            <Link href="/favorites">
              <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-red-300 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                    {t("dashboard.favorites")}
                  </CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">
                    Your saved items
                  </p>
                  <div className="mt-2 text-red-600 text-xs font-medium">
                    View favorites →
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/inquiries">
            <Card className="hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-teal-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-teal-600">
                  {t("dashboard.inquiries")}
                </CardTitle>
                <MessageSquare className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">
                  {isSeller ? "Customer messages" : "Your inquiries"}
                </p>
                <div className="mt-2 text-teal-600 text-xs font-medium">
                  Check messages →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Action - More Prominent */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-2/3 mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold mb-4">
                      {isSeller ? "Grow Your Business" : "Find What You Need"}
                    </h2>
                    <p className="mb-6 opacity-90">
                      {isSeller 
                        ? "Join thousands of sellers reaching customers across the marketplace"
                        : "Millions of products for construction, furniture, and equipment"
                      }
                    </p>
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                      asChild
                    >
                      <Link href={isSeller ? "/add-product" : "/marketplace"}>
                        {isSeller ? (
                          <span className="flex items-center">
                            <PlusCircle className="mr-2 h-4 w-4" /> 
                            {t("dashboard.addProduct")}
                          </span>
                        ) : "Browse Marketplace"}
                      </Link>
                    </Button>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    {isSeller ? (
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/3058/3058972.png" 
                        alt="Seller" 
                        className="h-40 w-40 object-contain"
                      />
                    ) : (
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" 
                        alt="Buyer" 
                        className="h-40 w-40 object-contain"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Section - Recent Activity or Featured Products */}
            <Card className="mt-6 border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {isSeller ? "Your Recent Activity" : "Recommended For You"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>{isSeller ? "No recent activity yet" : "No recommendations yet"}</p>
                  <Button variant="link" className="text-blue-600 mt-2" asChild>
                    <Link href={isSeller ? "/dashboard" : "/marketplace"}>
                      {isSeller ? "View Dashboard" : "Browse Products"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Info - More Detailed */}
          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Account Type</p>
                    <p className="text-sm text-gray-600 font-medium capitalize">
                      {t(user?.role === "buyer" ? "role.buyer" : "role.seller")}
                    </p>
                  </div>
                </div>

                {user?.location && (
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600 font-medium">{user.location}</p>
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full mt-4 border-blue-300 text-blue-600" asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Manage Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links Section */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/help">
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Help Center</p>
                      <p className="text-xs text-gray-500">Get answers to your questions</p>
                    </div>
                  </div>
                </Link>

                <Link href="/settings">
                  <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Account Settings</p>
                      <p className="text-xs text-gray-500">Update your preferences</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}