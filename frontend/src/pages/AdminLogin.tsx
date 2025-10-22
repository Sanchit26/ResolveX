import { Link } from "react-router-dom";
import { Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-elegant animate-scale-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gradient">Admin Login</h2>
          <Link to="/">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <Lock className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter username" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password" className="mt-1" />
          </div>
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            Sign In
          </Button>
        </div>
      </Card>

      <div className="fixed top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "1.5s" }} />
    </div>
  );
};

export default AdminLogin;
