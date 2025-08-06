import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Inbox, Calendar, Package, User } from "lucide-react";
import { formatDate } from "@/lib/i18n";
import type { Inquiry } from "@shared/schema";

export default function Inquiries() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: userLoading, isSeller } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  // Fetch sent inquiries
  const { data: sentInquiries = [], isLoading: sentLoading, error: sentError } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries/sent"],
    enabled: isAuthenticated,
  });

  // Fetch received inquiries (for sellers)
  const { data: receivedInquiries = [], isLoading: receivedLoading, error: receivedError } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries/received"],
    enabled: isAuthenticated && isSeller,
  });

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "responded":
        return "default";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const renderInquiryCard = (inquiry: Inquiry, type: "sent" | "received") => {
    const otherUser = type === "sent" ? inquiry.seller : inquiry.buyer;
    const userName = otherUser?.companyName || 
      `${otherUser?.firstName || ""} ${otherUser?.lastName || ""}`.trim() || 
      "Unknown User";

    return (
      <Card key={inquiry.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg line-clamp-1">
              {inquiry.product?.name || "Unknown Product"}
            </CardTitle>
            <Badge variant={getStatusBadgeVariant(inquiry.status)}>
              {t(`inquiry.${inquiry.status}`)}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{type === "sent" ? "To" : "From"}: {userName}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{inquiry.createdAt ? formatDate(inquiry.createdAt, language) : ""}</span>
            </div>
            {inquiry.quantity && inquiry.quantity > 1 && (
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-1" />
                <span>Qty: {inquiry.quantity}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{t("inquiry.message")}:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {inquiry.message}
            </p>
          </div>
          
          {inquiry.product && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              {inquiry.product.imageUrl && (
                <img
                  src={inquiry.product.imageUrl}
                  alt={inquiry.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h5 className="font-medium text-sm">{inquiry.product.name}</h5>
                <p className="text-blue-600 font-semibold">
                  ${parseFloat(inquiry.product.price || "0").toFixed(2)}
                  {inquiry.product.currency && inquiry.product.currency !== "USD" && ` ${inquiry.product.currency}`}
                </p>
              </div>
            </div>
          )}
          
          {otherUser?.email && (
            <div className="mt-4 flex items-center space-x-2">
              <Button size="sm" variant="outline">
                Contact {type === "sent" ? "Seller" : "Buyer"}
              </Button>
              {otherUser.phone && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`tel:${otherUser.phone}`)}
                >
                  Call
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.inquiries")}
          </h1>
          <p className="text-gray-600">
            Manage your product inquiries and communicate with {isSeller ? "buyers" : "sellers"}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sent" className="flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>{t("inquiry.sent")}</span>
            </TabsTrigger>
            {isSeller && (
              <TabsTrigger value="received" className="flex items-center space-x-2">
                <Inbox className="w-4 h-4" />
                <span>{t("inquiry.received")}</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Sent Inquiries */}
          <TabsContent value="sent" className="space-y-4">
            {sentLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sentError ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-red-600 mb-4">{t("error.serverError")}</div>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    {t("message.tryAgain")}
                  </Button>
                </CardContent>
              </Card>
            ) : sentInquiries.length > 0 ? (
              sentInquiries.map((inquiry) => renderInquiryCard(inquiry, "sent"))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No sent inquiries
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't sent any product inquiries yet. Browse the marketplace to find products and send inquiries to sellers.
                  </p>
                  <Button asChild>
                    <a href="/marketplace">Browse Products</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Received Inquiries (Sellers only) */}
          {isSeller && (
            <TabsContent value="received" className="space-y-4">
              {receivedLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : receivedError ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-red-600 mb-4">{t("error.serverError")}</div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      {t("message.tryAgain")}
                    </Button>
                  </CardContent>
                </Card>
              ) : receivedInquiries.length > 0 ? (
                receivedInquiries.map((inquiry) => renderInquiryCard(inquiry, "received"))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No received inquiries
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You haven't received any inquiries for your products yet. Make sure your products are visible and well-described to attract potential buyers.
                    </p>
                    <Button asChild>
                      <a href="/my-products">Manage Products</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
