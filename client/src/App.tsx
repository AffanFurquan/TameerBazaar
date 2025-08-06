import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import Favorites from "@/pages/Favorites";
import Inquiries from "@/pages/Inquiries";
import Profile from "@/pages/Profile";
import AddProduct from "@/pages/AddProduct";
import MyProducts from "@/pages/MyProducts";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/marketplace" component={Marketplace} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/inquiries" component={Inquiries} />
          <Route path="/profile" component={Profile} />
          <Route path="/add-product" component={AddProduct} />
          <Route path="/my-products" component={MyProducts} />
        </>
      )}
      {/* Public routes accessible to all */}
      <Route path="/about" component={() => <div>About Page - Coming Soon</div>} />
      <Route path="/contact" component={() => <div>Contact Page - Coming Soon</div>} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
