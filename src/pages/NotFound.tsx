
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200 h-14 flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-jira-gray-dark">Page Not Found</h1>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-jira-blue mb-4">404</h1>
              <p className="text-xl text-jira-gray-dark mb-8">
                Oops! The page you're looking for doesn't exist.
              </p>
              <Button asChild className="bg-jira-blue hover:bg-jira-blue-darker">
                <a href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </a>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NotFound;
