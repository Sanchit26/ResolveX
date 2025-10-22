import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ManualComplaint = () => {
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
              Submit Your Complaint
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Issue category" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  className="mt-1 min-h-[150px]"
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Submit Complaint
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManualComplaint;
