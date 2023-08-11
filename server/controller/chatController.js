import Chat from "../model/chat.js";
import User from "../model/user.js";

const chatController = {
  accessChat: async (req, res) => {
    const { userId, oppUserId } = req.body;
    if (!userId) {
      console.log("opposite user id not got from param");
      return res.sendStatus(400);
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: oppUserId } } },
      ],
    })
      .populate("users", "-Password")
      .populate("latestMessage")

      isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:'UserName ProfilePic Email'
      })

      if(isChat.length > 0){
        res.status(201).send(isChat[0])
      }else{
        var chatData={
            chatName:'sender',
            isGroupChat:false,
            users:[userId,oppUserId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const FullChat = await Chat.findOne({_id:createdChat._id})
            .populate("users","-Password")
            res.status(201).send(FullChat)
        } catch (error) {
            console.log(error,"AccessChat error catch")
            res.status(400).json({error})
        }
      }
  },
  fetchChat: async (req, res)=>{
    try {
        const {userId}= req.body
        Chat.find({users:{$elemMatch:{$eq:userId}}})
        .populate("users","-Password")
        .populate("groupAdmin","-Password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(result)=>{
            result=await User.populate(result,{
                path:"latestMessage.sender",
                select:"UserName ProfilePic Email"
            })
            res.status(200).send(result)
        })
    } catch (error) {
        console.log(error,"fetchChat error catch")
            res.status(400).json({error})
    }
  },
  createGroupChat: async (req,res)=>{
    if(!req.body.users || !req.body.name){
        return req.status(400).send({message: "Please fill all the fields"})
    }
    var users=JSON.parse(req.body.users)
    if(users.length <2){
        return res.status(400).send("More than 2 users are required to form a group chat")
    }

    const userId=req.body.userId
    const user=await User.findById(userId)
    delete user.Password
    users.push(user)
    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:user
        })
        const fullGroupChat=await Chat.findOne({_id:groupChat._id})
        .populate("users","-Password")
        .populate("groupAdmin","-Password")

        res.status(200).json(fullGroupChat)
    }catch(error){
        console.log(error,"createGroupChat error catch")
            res.status(400).json({error})
    }
  },
  renameGroup: async(req,res)=>{
    const {chatId,chatName}=req.body
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true
        }
    ).populate("users","-Password")
    .populate("groupAdmin","-Password")

    if(!updatedChat){
        res.status(404).send({message:"Chat not found"})
        console.log("Chat not found 404 error")
    }else{
        res.status(201).json(updatedChat)
    }
  },
  addToGroup: async(req,res)=>{
    const {chatId,addUserId}=req.body
    const added=await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:addUserId},
        },
        {new:true}
    )
    .populate("users","-Password")
    .populate("groupAdmin","-Password")

    if(!added){
        res.status(404).send({message:"Group chat user add not found"})
        console.log("Group chat user add not found 404 error")
    }else{
        res.status(201).send(added)
    }
  },
  removeFromGroup: async(req,res)=>{
    const {chatId,removeUserId}=req.body
    const remove=await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:removeUserId},
        },
        {new:true}
    )
    .populate("users","-Password")
    .populate("groupAdmin","-Password")

    if(!remove){
        res.status(404).send({message:"Group chat user remove not found"})
        console.log("Group chat user remove not found 404 error")
    }else{
        res.status(201).send(remove)
    }
  }
};

export default chatController;
