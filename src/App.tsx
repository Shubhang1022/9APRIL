import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Chat from "./pages/Chat.tsx";
import Voice from "./pages/Voice.tsx";
import Memories from "./pages/Memories.tsx";
import Letters from "./pages/Letters.tsx";
import Games from "./pages/Games.tsx";
import FakeCall from "./pages/FakeCall.tsx";
import Album from "./pages/Album.tsx";
import Ending from "./pages/Ending.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/letters" element={<Letters />} />
          <Route path="/games" element={<Games />} />
          <Route path="/call" element={<FakeCall />} />
          <Route path="/album" element={<Album />} />
          <Route path="/ending" element={<Ending />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
