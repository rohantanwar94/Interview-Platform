import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and Difficulty are required" });
    }

    // generate a unique call id for stream vedio
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // create session in db
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    //create tream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    //chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    res.status(201).json({ session });
  } catch (error) {
    console.error("Error in create session: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function getActiveSessions(_, res) {
  try {
    const sessions = Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error to get active sessions: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;
    // get sessions where user is either host or participant
    const sessions = Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error to get my recent sessions: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = Session.findById(id)
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId");

    if (!session) return res.status(404).json({ message: "session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error to get session by id: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = Session.findById(id);
    if (!session) return res.status(404).json({ message: "session not found" });

    //check if session is already full - has a participant;
    if (session.participant)
      return res.status(404).json({ message: "session is full" });

    session.participant = user;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error to join session: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = Session.findById(id);
    if (!session) return res.status(404).json({ message: "session not found" });

    //check if user is the host
    if (session.host.toString() !== userId.toString())
      return res
        .status(403)
        .json({ message: "Only host can end this session" });

    //check is session is completed
    if (session.status === "completed")
      return res.status(400).json({ message: "session is completed" });

    session.status = "completed";
    await session.save();

    //delete video call session
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    //delete chat session
    const chat = chatClient.channel("messaging", session.callId);
    await chat.delete();

    res.status(200).json({ message: "Session ended Successfully" });
  } catch (error) {
    console.error("Error to end session: ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
