import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";

import Home from "@/pages/home";
import About from "@/pages/about";
import Membership from "@/pages/membership";
import Coordinators from "@/pages/coordinators";
import Sectors from "@/pages/sectors";
import Events from "@/pages/events";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/membership" component={Membership} />
        <Route path="/coordinators" component={Coordinators} />
        <Route path="/sectors" component={Sectors} />
        <Route path="/events" component={Events} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
