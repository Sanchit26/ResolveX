import { Link } from "react-router-dom";
import { FileText, Search, Bot, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gradient tracking-tight">
            ResolveX
          </h1>
          <Link to="/admin">
            <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all">
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 text-foreground">
            Welcome to <span className="text-gradient">ResolveX</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered complaint management system. Report issues instantly and track them in real-time.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 animate-slide-up">
          <Link to="/file-complaint" className="group">
            <Card className="p-8 h-full hover:shadow-hover transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">File Complaint</h3>
                <p className="text-muted-foreground">
                  Report your issue instantly and get guided AI support.
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/track-complaint" className="group">
            <Card className="p-8 h-full hover:shadow-hover transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                  <Search className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Track Complaint</h3>
                <p className="text-muted-foreground">
                  Check the real-time status of your raised complaints.
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* About Us Section */}
        <div className="max-w-3xl mx-auto animate-scale-in">
          <Card className="p-8 bg-gradient-to-br from-card to-secondary/30 border-primary/20 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">About Us</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              ResolveX is revolutionizing complaint management with AI-powered solutions. 
              Our mission is to simplify the process of reporting and tracking issues, 
              ensuring quick resolutions and transparent communication. With intelligent 
              troubleshooting and real-time updates, we're making customer service faster, 
              smarter, and more efficient.
            </p>
          </Card>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "1.5s" }} />
      </main>
    </div>
  );
};

export default Home;
