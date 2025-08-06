import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import BuyerDashboard from "./BuyerDashboard";
import SellerDashboard from "./SellerDashboard";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, isBuyer, isSeller } = useUser();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: t("error.unauthorized"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="pt-16 pb-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t("error.unauthorized")}
              </h1>
              <p className="text-gray-600 mb-8">
                Please sign in to access your dashboard.
              </p>
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t("nav.signin")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  if (isSeller) {
    return <SellerDashboard />;
  } else {
    return <BuyerDashboard />;
  }
}
