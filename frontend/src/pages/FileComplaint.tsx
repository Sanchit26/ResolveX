import { Link } from "react-router-dom";
import { Bot, FileEdit, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FileComplaint = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Choose Your Mode
          </h2>
          <p className="text-lg text-muted-foreground">
            Select how you'd like to file your complaint
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-slide-up">
          {/* AI Mode */}
          <Link to="/ai-chat" className="group">
            <Card className="p-10 h-full hover:shadow-hover transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all group-hover:scale-110 duration-300">
                  <Bot className="w-14 h-14 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">AI Mode</h3>
                  <p className="text-muted-foreground">
                    Let our AI chatbot assist and troubleshoot your issue with intelligent guidance.
                  </p>
                </div>
                <Button className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Start AI Chat
                </Button>
              </div>
            </Card>
          </Link>

          {/* Manual Mode */}
          <Link to="/manual-complaint" className="group">
            <Card className="p-10 h-full hover:shadow-hover transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all group-hover:scale-110 duration-300">
                  <FileEdit className="w-14 h-14 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Manual Mode</h3>
                  <p className="text-muted-foreground">
                    Raise a ticket manually for direct staff review and assistance.
                  </p>
                </div>
                <Button variant="outline" className="mt-4 hover:bg-primary hover:text-primary-foreground">
                  Submit Manually
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
        <div className="fixed bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "2s" }} />
      </main>
    </div>
  );
};

export default FileComplaint;
