import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { FieldsProvider } from "./contexts/FieldsContext";
import { OrderProvider } from "./contexts/OrderContext";
import Home from "./pages/Home";
import AdminMode from "./pages/AdminMode";


function Router() {
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/admin"} component={AdminMode} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <FieldsProvider>
          <OrderProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </CartProvider>
          </OrderProvider>
        </FieldsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
