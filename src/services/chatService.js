// services/chatService.js
import {
  dummyConversations,
  dummyMessages,
  dummyEmployees,
  simulateDelay,
} from "@/data/dummyChatData";

const API_URL = "https://hrms-backend-0r5r.onrender.com";

/**
 * Get all conversations for a user
 */
export const getConversations = async (userId, token) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Return dummy data
    return dummyConversations;
  } catch (err) {
    console.error("Error in getConversations:", err);
    throw err;
  }
};

/**
 * Get messages for a specific conversation
 */
export const getMessages = async (conversationId, token) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Return a cloned array to avoid shared-reference mutations in UI state.
    return [...(dummyMessages[conversationId] || [])];
  } catch (err) {
    console.error("Error in getMessages:", err);
    throw err;
  }
};

/**
 * Send a new message
 */
export const sendMessage = async (messageData, token) => {
  try {
    // Simulate API delay
    await simulateDelay(200);

    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `msg-${crypto.randomUUID()}`
        : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Create a new message object
    const newMessage = {
      id: uniqueId,
      ...messageData,
      timestamp: new Date().toISOString(),
    };

    // Store in dummy data
    if (!dummyMessages[messageData.conversationId]) {
      dummyMessages[messageData.conversationId] = [];
    }
    dummyMessages[messageData.conversationId].push(newMessage);

    return newMessage;
  } catch (err) {
    console.error("Error in sendMessage:", err);
    throw err;
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (conversationData, token) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Create a new conversation object
    const newConversation = {
      id: `conv${Date.now()}`,
      ...conversationData,
      lastMessage: "Conversation started",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    // Store in dummy data
    dummyConversations.push(newConversation);

    return newConversation;
  } catch (err) {
    console.error("Error in createConversation:", err);
    throw err;
  }
};

/**
 * Upload attachment/image for chat
 */
export const uploadChatAttachment = async (file, token) => {
  try {
    // Simulate API delay
    await simulateDelay(500);

    // Create a dummy URL for the uploaded file
    const dummyUrl = URL.createObjectURL(file);

    return {
      success: true,
      url: dummyUrl,
      path: dummyUrl,
      filename: file.name,
    };
  } catch (err) {
    console.error("Error in uploadChatAttachment:", err);
    throw err;
  }
};

/**
 * Get all employees for chat selection
 */
export const getEmployeesForChat = async (token) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Return dummy employees
    return dummyEmployees;
  } catch (err) {
    console.error("Error in getEmployeesForChat:", err);
    throw err;
  }
};

/**
 * Search conversations
 */
export const searchConversations = async (userId, keyword, token) => {
  try {
    // Simulate API delay
    await simulateDelay(300);

    // Filter conversations by keyword
    const filtered = dummyConversations.filter(
      (conv) =>
        conv.participantName.toLowerCase().includes(keyword.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    return filtered;
  } catch (err) {
    console.error("Error in searchConversations:", err);
    throw err;
  }
};
