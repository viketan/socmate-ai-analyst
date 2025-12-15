import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const promptExamples = [
  "Explain T1059 in plain English",
  "What are the top 5 detection rules for phishing?",
  "Summarize the last 3 alerts",
  "How should I respond to a brute force attack?",
];

interface ChatDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatDrawer({ isOpen, onToggle }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your SOC AI Assistant. I can help you understand alerts, MITRE techniques, suggest remediation steps, and answer security questions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "T1059": "**T1059 - Command and Scripting Interpreter**\n\nThis technique describes adversaries abusing command-line interfaces and scripting languages to execute commands. Common interpreters include:\n\n- PowerShell (T1059.001)\n- Windows Command Shell (T1059.003)\n- Unix Shell (T1059.004)\n- Python (T1059.006)\n\n**Detection:** Monitor process creation events, especially child processes spawned from unusual parents.",
        "phishing": "**Top 5 Detection Rules for Phishing:**\n\n1. **Email Header Analysis** - Check for SPF/DKIM/DMARC failures\n2. **URL Reputation** - Flag emails with links to recently registered domains\n3. **Attachment Analysis** - Scan for macro-enabled documents\n4. **Sender Impersonation** - Detect display name spoofing\n5. **Content Analysis** - Identify urgency language and credential harvesting patterns",
        "brute force": "**Responding to Brute Force Attacks:**\n\n1. **Immediate Actions:**\n   - Block the source IP\n   - Reset affected user passwords\n   - Enable MFA if not already active\n\n2. **Investigation:**\n   - Check for successful logins from the attacker\n   - Review subsequent activity\n   - Correlate with other alerts\n\n3. **Long-term:**\n   - Implement account lockout policies\n   - Add IP-based rate limiting\n   - Enable conditional access policies",
      };

      let response = "I understand you're asking about security topics. Could you provide more context or be more specific about what you'd like to know? I can help with:\n\n- MITRE ATT&CK techniques\n- Alert analysis\n- Remediation guidance\n- Security best practices";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("t1059")) {
        response = responses["T1059"];
      } else if (lowerInput.includes("phishing")) {
        response = responses["phishing"];
      } else if (lowerInput.includes("brute force")) {
        response = responses["brute force"];
      } else if (lowerInput.includes("summarize") && lowerInput.includes("alert")) {
        response = "**Recent Alert Summary:**\n\n1. **Critical:** Brute Force Success - Account john.doe@contoso.com compromised from Russia\n2. **Critical:** Data Exfiltration - 2.5GB transferred to external IP\n3. **High:** Suspicious PowerShell execution on WORKSTATION-PC01\n\n**Recommendation:** These alerts appear related. Prioritize the data exfiltration and account compromise first.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary hover:bg-primary/90 cyber-glow",
          isOpen && "hidden"
        )}
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-50",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">SOC Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === "assistant"
                      ? "bg-primary/20"
                      : "bg-secondary"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "assistant"
                      ? "bg-secondary"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.role === "assistant" ? (
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  <p className="text-[10px] opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-1">
              {promptExamples.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-2 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
