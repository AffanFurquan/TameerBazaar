import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { RoleSelector } from "@/components/RoleSelector";
import { SellerOnboardingForm } from "@/components/SellerOnboardingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Building, Phone, MapPin, Globe } from "lucide-react";
import { supportedLanguages } from "@/lib/i18n";
import type { SellerDetails } from "@shared/schema";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  companyName: string;
  preferredLanguage: string;
  role: "buyer" | "seller";
}

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showSellerOnboarding, setShowSellerOnboarding] = useState(false);

  // Query seller details if user is a seller or trying to become one
  const { data: sellerDetails, isLoading: sellerDetailsLoading } = useQuery<SellerDetails | null>({
    queryKey: ["/api/seller-details", user?.id],
    enabled: !!user?.id && (user?.role === "seller" || formData.role === "seller"),
    retry: false,
  });
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    companyName: "",
    preferredLanguage: language,
    role: "buyer",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        companyName: user.companyName || "",
        preferredLanguage: user.preferredLanguage || language,
        role: user.role || "buyer",
      });
      
      // Show role selector for new users without a role
      if (!user.role) {
        setShowRoleSelector(true);
      }
    }
  }, [user, language]);

  // Redirect if not authenticated
  if (!userLoading && !isAuthenticated) {
    toast({
      title: t("error.unauthorized"),
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileFormData>) => {
      await apiRequest("PATCH", "/api/auth/user", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: t("message.success"),
        description: "Profile updated successfully",
      });
      
      // Update language if it changed
      if (formData.preferredLanguage !== language) {
        setLanguage(formData.preferredLanguage as any);
      }
      
      setShowRoleSelector(false);
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
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleRoleSelect = (role: "buyer" | "seller") => {
    setFormData(prev => ({ ...prev, role }));
    
    // If switching to seller, check if seller details exist
    if (role === "seller") {
      // The seller details query will be enabled and checked in the render logic
      return;
    }
    
    // For buyer role, update immediately
    updateProfileMutation.mutate({ ...formData, role });
  };

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
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we need to show seller onboarding
  useEffect(() => {
    if (formData.role === "seller" && user?.role !== "seller" && !sellerDetailsLoading) {
      if (!sellerDetails) {
        setShowSellerOnboarding(true);
      } else {
        // Seller details exist, complete the role change
        updateProfileMutation.mutate({ ...formData, role: "seller" });
      }
    }
  }, [formData.role, user?.role, sellerDetails, sellerDetailsLoading]);

  // Show seller onboarding form when switching to seller without details
  if (showSellerOnboarding && user?.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <SellerOnboardingForm
          userId={user.id}
          onComplete={() => {
            setShowSellerOnboarding(false);
            // Complete the role change after seller details are created
            updateProfileMutation.mutate({ ...formData, role: "seller" });
          }}
        />
      </div>
    );
  }

  // Show role selector for new users
  if (showRoleSelector) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <RoleSelector
            onRoleSelect={handleRoleSelect}
            isLoading={updateProfileMutation.isPending}
          />
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
            {t("dashboard.profile")}
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{t("profile.personalInfo")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t("profile.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t("profile.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">{t("profile.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{t("profile.phone")}</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+971-50-123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{t("profile.location")}</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Dubai, UAE"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information (for sellers) */}
          {formData.role === "seller" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>{t("profile.businessInfo")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="companyName">{t("profile.companyName")}</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">{t("profile.language")}</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Current Role</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                  <span className="font-medium">
                    {t(formData.role === "buyer" ? "role.buyer" : "role.seller")}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRoleSelector(true)}
                  >
                    Change Role
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateProfileMutation.isPending ? t("message.loading") : t("profile.save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              {t("action.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
