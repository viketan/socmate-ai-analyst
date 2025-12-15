import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Loader2,
  Target,
  Shield,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
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

const promptCategories = [
  {
    icon: Target,
    title: "MITRE ATT&CK",
    prompts: [
      "Explain T1059 in plain English",
      "What is the difference between T1110 and T1078?",
      "List all execution techniques",
    ],
  },
  {
    icon: Shield,
    title: "Detection Rules",
    prompts: [
      "Top 5 detection rules for phishing",
      "How to detect PowerShell abuse",
      "Best rules for lateral movement",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Alert Analysis",
    prompts: [
      "Summarize the last 3 alerts",
      "What alerts should I prioritize?",
      "Explain this brute force pattern",
    ],
  },
  {
    icon: BookOpen,
    title: "Best Practices",
    prompts: [
      "How should I respond to ransomware?",
      "Incident response checklist",
      "SOC analyst daily workflow",
    ],
  },
];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your SOC AI Assistant powered by advanced language models. I can help you understand:\n\n• **MITRE ATT&CK techniques** - Get plain-English explanations\n• **Detection rules** - Learn best practices for threat detection\n• **Alert analysis** - Get insights on your security alerts\n• **Incident response** - Follow proper procedures\n\nHow can I help you today?",
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

  const simulateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("t1059")) {
      return `## T1059 - Command and Scripting Interpreter

**Plain English:** Attackers use built-in command-line tools and scripting languages to run malicious code on victim systems.

### Sub-techniques:
- **T1059.001 - PowerShell:** Using PowerShell to execute commands
- **T1059.003 - Windows Command Shell:** Using cmd.exe
- **T1059.004 - Unix Shell:** Using bash, sh, etc.

### Why it's dangerous:
These tools are already present on systems and are used legitimately by administrators, making malicious use harder to detect.

### Detection Tips:
1. Monitor process creation for unusual parent-child relationships
2. Look for encoded commands (Base64)
3. Track PowerShell script block logging
4. Alert on unusual script execution from temp directories`;
    }

    if (lowerQuery.includes("phishing") && lowerQuery.includes("detection")) {
      return `## Top 5 Detection Rules for Phishing

### 1. **Email Header Analysis**
\`\`\`
Rule: SPF/DKIM/DMARC validation failures
Priority: High
False Positive Rate: Low
\`\`\`

### 2. **URL Reputation Checks**
- Flag emails with links to domains registered < 30 days
- Check against known phishing databases

### 3. **Attachment Analysis**
- Detect macro-enabled Office documents
- Scan for embedded executables
- Look for double extensions (.pdf.exe)

### 4. **Sender Impersonation Detection**
- Display name spoofing (CEO name with external email)
- Look-alike domain detection (contoso vs c0ntoso)

### 5. **Content Analysis**
- Urgency language patterns
- Credential harvesting indicators
- Unusual request patterns`;
    }

    if (lowerQuery.includes("summarize") && lowerQuery.includes("alert")) {
      return `## Recent Alert Summary

### Critical Alerts (Immediate Action Required)

**1. Brute Force Success - Account Compromised**
- **Target:** john.doe@contoso.com
- **Source:** 203.0.113.45 (Russia)
- **MITRE:** T1110 (Brute Force)
- **Action:** Reset password, block IP

**2. Data Exfiltration Detected**
- **Volume:** 2.5GB transferred
- **Destination:** 45.33.32.156 (DigitalOcean)
- **MITRE:** T1048 (Exfiltration)
- **Action:** Block destination, revoke access

### High Priority

**3. Suspicious PowerShell Execution**
- **Host:** WORKSTATION-PC01
- **MITRE:** T1059.001 (PowerShell)
- **Action:** Isolate and investigate

### Recommendation
These alerts appear to be part of a coordinated attack chain. Prioritize the data exfiltration and account compromise. Consider triggering your incident response plan.`;
    }

    if (lowerQuery.includes("ransomware")) {
      return `## Ransomware Response Guide

### Immediate Actions (First 15 Minutes)

1. **ISOLATE** - Disconnect affected systems from network
2. **PRESERVE** - Don't shut down systems (forensic evidence)
3. **ESCALATE** - Notify incident response team and management

### Investigation Phase

- Identify patient zero (first infected system)
- Determine ransomware variant
- Check for data exfiltration indicators
- Review backup integrity

### Recovery Steps

1. Restore from clean backups (verify no encryption)
2. Rebuild affected systems from known-good images
3. Apply missing patches before reconnecting
4. Monitor for persistence mechanisms

### DO NOT:
❌ Pay the ransom (no guarantee of decryption)
❌ Negotiate directly with attackers
❌ Restore without full investigation`;
    }

    return `I understand you're asking about "${query}". Let me help you with that.

As your SOC AI Assistant, I can provide detailed guidance on:
- MITRE ATT&CK techniques and tactics
- Detection rule recommendations
- Alert triage and prioritization
- Incident response procedures

Could you provide more context about what specific aspect you'd like me to explain? For example:
- Are you investigating a specific alert?
- Do you need help understanding a technique?
- Are you looking for detection recommendations?`;
  };

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

    setTimeout(() => {
      const response = simulateResponse(input);
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
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col cyber-card">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center cyber-glow">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold">SOC AI Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Powered by Azure OpenAI • Available 24/7
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-3xl mx-auto">
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
                    "max-w-[85%] rounded-lg px-4 py-3",
                    message.role === "assistant"
                      ? "bg-secondary"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <div className="prose prose-sm prose-invert max-w-none">
                    {message.role === "assistant" ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] opacity-50 mt-2">
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
                <div className="bg-secondary rounded-lg px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about security..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Sidebar - Prompt Suggestions */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="cyber-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Quick Prompts</h2>
          </div>

          <div className="space-y-4">
            {promptCategories.map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {category.title}
                  </span>
                </div>
                <div className="space-y-1">
                  {category.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
