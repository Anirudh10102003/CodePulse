import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot } from "lucide-react";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hi! I'm your AI assistant for this problem. Ask me for hints, explanations, or help understanding the approach. I won't give away the full solution! 🤖",
        },
      ],
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const onSubmit = async (data) => {
    const userMessage = {
      role: "user",
      parts: [{ text: data.message }],
    };

    // Create updated conversation
    const updatedMessages = [...messages, userMessage];

    // Update UI immediately
    setMessages(updatedMessages);

    reset();
    setIsThinking(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: response.data.message,
            },
          ],
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [
            {
              text: "Sorry, I encountered an error. Please try again.",
            },
          ],
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "500px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(0,255,135,0.1)",
            border: "1px solid rgba(0,255,135,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={16} color="var(--accent-green)" />
        </div>

        <div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            AI Assistant
          </div>

          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              color: "var(--accent-green)",
            }}
          >
            ● Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "model" && (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: "rgba(0,255,135,0.1)",
                  border: "1px solid rgba(0,255,135,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                <Bot size={12} color="var(--accent-green)" />
              </div>
            )}

            <div
              className={
                msg.role === "user" ? "lc-chat-user" : "lc-chat-ai"
              }
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(0,255,135,0.1)",
                border: "1px solid rgba(0,255,135,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={12} color="var(--accent-green)" />
            </div>

            <div
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px 16px 16px 4px",
                padding: "10px 16px",
                display: "flex",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {[0, 0.15, 0.3].map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent-green)",
                    animation: "pulse 1s ease-in-out infinite",
                    animationDelay: `${d}s`,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Ask for a hint..."
          className="lc-input"
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: "13px",
          }}
          {...register("message", {
            required: true,
            minLength: 2,
          })}
        />

        <button
          type="submit"
          disabled={!!errors.message || isThinking}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background:
              errors.message || isThinking
                ? "var(--bg-elevated)"
                : "var(--accent-green)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:
              errors.message || isThinking
                ? "not-allowed"
                : "pointer",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <Send
            size={15}
            color={
              errors.message || isThinking
                ? "var(--text-muted)"
                : "#000"
            }
          />
        </button>
      </form>

      <style>{`
        @keyframes pulse {
          0%,100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ChatAi;