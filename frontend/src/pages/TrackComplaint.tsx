import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const TrackComplaint = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gradient tracking-tight">
            ResolveX
          </h1>
          <Link to="/">
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground transition-all">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="p-8 shadow-elegant">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
              Track Your Complaint
            </h2>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your complaint ID..."
                className="flex-1 border-border/50 focus:border-primary"
              />
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TrackComplaint;
