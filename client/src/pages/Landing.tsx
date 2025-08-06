import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardContent className="pt-16 pb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("welcome.title")}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("welcome.subtitle")}
            </p>
            
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => (window.location.href = "/api/login")}
            >
              {t("welcome.getStarted")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
