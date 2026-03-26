"use client";

import React, { useState } from "react";
import { Send, Plus, File, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./ChatWindow.css";

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onFileUpload,
  messageText,
  setMessageText,
  sending,
  messagesEndRef,
}) {
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = React.useRef(null);
  const imageInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileUpload(file);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-window-header">
        <div className="header-content">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation?.participantAvatar} />
            <AvatarFallback className="bg-blue-500">
              {conversation?.participantName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">
              {conversation?.participantName}
            </h3>
            <p className="text-sm text-white/60">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="messages-container flex-1">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <p className="text-white/60">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="p-6">
            {messages.map((message, index) => {
              const showDate =
                index === 0 ||
                formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);

              const isCurrentUser = message.senderId === currentUserId;

              return (
                <React.Fragment
                  key={`${message.id || "msg"}-${message.timestamp || "no-time"}-${index}`}
                >
                  {showDate && (
                    <div className="message-date">
                      <span>{formatDate(message.timestamp)}</span>
                    </div>
                  )}
                  <div
                    className={`message-group ${
                      isCurrentUser ? "current-user" : "other-user"
                    }`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback className="bg-blue-500 text-xs">
                          {message.senderName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="message-bubble-container">
                      <div className="message-bubble">
                        {message.type === "image" ? (
                          <img
                            src={message.content}
                            alt="Shared image"
                            className="message-image"
                          />
                        ) : message.type === "file" ? (
                          <a
                            href={message.content}
                            className="file-link"
                            download={message.fileName}
                          >
                            <File className="h-4 w-4" />
                            <span>{message.fileName || "Download file"}</span>
                          </a>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                      <span className="message-time">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="chat-input-area">
        <form onSubmit={onSendMessage} className="input-form">
          <div className="input-wrapper">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="attachment-btn"
            >
              <Plus className="h-5 w-5" />
            </Button>

            {showAttachmentMenu && (
              <div className="attachment-menu">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="attachment-option"
                >
                  <ImageIcon className="h-4 w-4" />
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="attachment-option"
                >
                  <File className="h-4 w-4" />
                  File
                </button>
              </div>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={sending}
              className="message-input"
            />

            <Button
              type="submit"
              size="sm"
              disabled={!messageText.trim() || sending}
              className="send-btn"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
