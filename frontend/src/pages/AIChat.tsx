import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Phone, Paperclip, Send, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AIChat = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showWatermark, setShowWatermark] = useState(true);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage("");
      setShowWatermark(false);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "I understand your concern. Let me help you with that.", isUser: false },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gradient">ResolveX AI Assistant</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Select defaultValue="en">
              <SelectTrigger className="w-[140px] border-border/50">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground">
              <Phone className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Window */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col max-w-4xl">
        <div className="flex-1 bg-card rounded-2xl shadow-elegant border border-border/50 p-6 mb-4 overflow-y-auto relative">
          {/* Watermark - only shows when no messages */}
          {showWatermark && messages.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <h1 className="text-9xl font-bold text-primary">ResolveX</h1>
            </div>
          )}

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Start a conversation</h3>
                <p className="text-muted-foreground">Describe your issue and I'll help you resolve it</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-slide-up`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant"
                        : "bg-secondary/80 text-foreground border border-border/50"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-card rounded-2xl shadow-elegant border border-border/50 p-4">
          <div className="flex gap-3 items-center">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border-border/50 focus:border-primary"
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="hover:bg-primary/10">
                  <Paperclip className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    📷 Attach Image
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    🎥 Attach Video
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    📄 Attach Document
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" />
      <div className="fixed bottom-20 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "1.5s" }} />
    </div>
  );
};

export default AIChat;
