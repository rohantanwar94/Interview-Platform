import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk"; 
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used for chat
export const streamClient = new StreamClient(apiKey, apiSecret); // wiil be used for vedio calls

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("user added successfully", userData);
  } catch (error) {
    console.error("upsert stream error", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("user deleted successfully", userId);
  } catch (error) {
    console.error("upsert stream error", error);
  }
};
