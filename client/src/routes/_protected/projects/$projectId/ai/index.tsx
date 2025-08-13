import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendAIMessage, fetchAIConversation } from "@/lib/client";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/_protected/projects/$projectId/ai/")({
  component: RouteComponent,
});

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

function RouteComponent() {
  const { projectId } = Route.useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await fetchAIConversation(projectId);
        if (data.conversations && data.conversations.length > 0) {
          const formattedMessages: Message[] = data.conversations.map(
            (msg: { role: string; content: string }, index: number) => ({
              id: `history-${index}`,
              role: msg.role,
              content: msg.content,
            }),
          );
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to load conversation history:", error);
      }
    };

    loadConversation();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);

    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, id: userMessageId },
    ]);

    try {
      let assistantContent = "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", id: assistantMessageId },
      ]);

      console.log("Sending AI message:", userMessage);
      const stream = sendAIMessage(projectId, userMessage);

      for await (const chunk of stream) {
        assistantContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantContent }
              : msg,
          ),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (!e.metaKey || !e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Assistant
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about your database design
        </p>
      </div>

      <ScrollArea className="flex-1 overflow-hidden" ref={scrollAreaRef}>
        <div className="p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation about your database design</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted",
                  )}
                >
                  {message.role === "assistant" &&
                  message.content === "" &&
                  isLoading ? (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  ) : (
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </Markdown>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {error && (
        <div className="p-4 bg-destructive/10 border-t border-destructive/20 flex-shrink-0">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your database design..."
            className="min-h-[44px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
