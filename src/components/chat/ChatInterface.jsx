"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Plus, X, FileText, Image, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "@/components/common/Loader";
import {
  getConversations,
  getMessages,
  sendMessage,
  getEmployeesForChat,
} from "@/services/chatService";
import ChatWindow from "./ChatWindow";
import "./ChatInterface.css";

export default function ChatInterface({ currentUserId, userRole = "employee" }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    fetchEmployees();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations(currentUserId, token);
      setConversations(Array.isArray(data) ? data : data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await getMessages(conversationId, token);
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployeesForChat(token);
      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const newMessage = await sendMessage(
        {
          conversationId: selectedConversation.id,
          senderId: currentUserId,
          content: messageText,
          type: "text",
        },
        token
      );

      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!selectedConversation || !file) return;

    try {
      setSending(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = new URL("/api/chat/upload", window.location.origin);
      const res = await fetch(uploadUrl.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadedFile = await res.json();

      const newMessage = await sendMessage(
        {
          conversationId: selectedConversation.id,
          senderId: currentUserId,
          content: uploadedFile.url || uploadedFile.path,
          type: file.type.startsWith("image/") ? "image" : "file",
          fileName: file.name,
        },
        token
      );

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-interface">
      {/* Sidebar - Conversations List */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNewChat(!showNewChat)}
            className="rounded-full p-2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="chat-search-wrapper">
          <Search className="chat-search-icon" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-search-input bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="new-chat-modal">
            <div className="modal-header">
              <h3>Start New Chat</h3>
              <button onClick={() => setShowNewChat(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="employees-list">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="employee-item"
                  onClick={async () => {
                    // Create new conversation logic here
                    setShowNewChat(false);
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={emp.avatar} />
                    <AvatarFallback className="bg-blue-500">
                      {emp.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-sm text-white/60">{emp.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversations List */}
        <ScrollArea className="conversations-list flex-1">
          {loading ? (
            <Loader />
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <Button
                size="sm"
                onClick={() => setShowNewChat(true)}
                className="mt-4"
              >
                Start a new chat
              </Button>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${
                    selectedConversation?.id === conv.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conv.participantAvatar} />
                    <AvatarFallback className="bg-blue-500">
                      {conv.participantName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="conversation-info">
                    <p className="font-semibold text-white">
                      {conv.participantName}
                    </p>
                    <p className="text-sm text-white/60">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedConversation ? (
        <div className="chat-content">
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            messageText={messageText}
            setMessageText={setMessageText}
            sending={sending}
            messagesEndRef={messagesEndRef}
          />
        </div>
      ) : (
        <div className="chat-empty">
          <div className="empty-illustration">
            <div className="text-6xl">💬</div>
            <h3 className="text-2xl font-bold mt-4">No chat selected</h3>
            <p className="text-white/60 mt-2">
              Select a conversation or start a new chat
            </p>
            <Button onClick={() => setShowNewChat(true)} className="mt-6">
              Start New Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
