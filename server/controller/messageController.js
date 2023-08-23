import Notification from "../model/Notification.js";
import Chat from "../model/chat.js";
import Message from "../model/message.js";
import User from "../model/user.js";

const messageController = {
  sendMessage: async (req, res) => {
    const { content, chatId, userId } = req.body;
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
    var newMessage = {
      sender: userId,
      content: content,
      chat: chatId,
    };
    try {
      var message = await Message.create(newMessage);
      message = await message.populate("sender", "UserName ProfilePic Email");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "UserName ProfilePic Email",
      });
      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      //   console.log(message);

      // Create a notification for the receiver user
      const currChat = await Chat.findOne({ _id: chatId });
      const receiverUserId = currChat.users.filter((id) => id != userId);

      const existingNotification = await Notification.findOne({
        userId: receiverUserId,
        type: "message",
        senderId: userId,
      });

      if (existingNotification) {
        existingNotification.msgCount += 1;
        await existingNotification.save();
      } else {
        const newNotification = new Notification({
          userId: receiverUserId.toString(),
          type: "message",
          senderId: userId.toString(),
          msgCount: 1, 
        });
        await newNotification.save();
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.log(error, "sendMsg error catch");
      res.status(400).json({ error });
    }
  },
  allMessages: async (req, res) => {
    try {
      const message = await Message.find({ chat: req.params.chatId })
        .populate("sender", "UserName ProfilePic Email")
        .populate("chat");
      res.status(201).json(message);
    } catch (error) {
      console.log(error, "fetchAllmsg error catch");
      res.status(400).json({ error });
    }
  },
};

export default messageController;
