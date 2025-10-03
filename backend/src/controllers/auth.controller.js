const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    fullName: { firstName , lastName },
    email,
    password,
    mobile,
    userName
  } = req.body;

  const isuserAlreadyExist = await userModel.findOne({
    email,
  });

  if (isuserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10); // we are using 10 rounds

  const user = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashPassword,
    mobile,
    userName
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );
res.cookie("token", token, {
  httpOnly: true,
  secure: true,          // HTTPS required
  sameSite: "None",      // cross-site
  maxAge: 24*60*60*1000
});

  res.status(201).json({
    message: "User Registered Successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
      mobile:user.mobile,
      userName:user.userName
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // optional, better security
  });

  //set cookie
  res.cookie("token", token);

  res.status(200).json({
    message: "User Logged In Successfully",
    user: {
      email: user.email,
      _id: user._id,
      fullName: user.fullName,
    },
  });
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

async function getUserProfile(req, res) {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    // send user info without password
    const { _id, email, mobile, userName, fullName } = req.user;

    res.status(200).json({
      user: {
        _id,
        email,
        mobile,
        userName,
        fullName: fullName || { firstName: "", lastName: "" },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


async function updateUser(req, res) {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, mobile, userName } = req.body;

    req.user.fullName.firstName = firstName || req.user.fullName.firstName;
    req.user.fullName.lastName = lastName || req.user.fullName.lastName;
    req.user.mobile = mobile || req.user.mobile;
    req.user.userName = userName || req.user.userName;

    await req.user.save();

    res.status(200).json({ message: "Profile updated successfully", user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



async function registerFoodPartner(req, res) {
  // Destructure new fields coverImage and cuisine along with old ones
  const {
    businessName,
    email,
    password,
    contactName,
    phone,
    address,
    coverImage,
    cuisine
  } = req.body;

  // Check if account already exists (old logic)
  const isAccountAlreadyExist = await foodPartnerModel.findOne({ email });
  if (isAccountAlreadyExist) {
    return res.status(400).json({
      message: "Food partner account already exist",
    });
  }

  // Mandatory fields validation
  if (!coverImage || !cuisine || !Array.isArray(cuisine) || cuisine.length === 0) {
    return res.status(400).json({
      message: "Cover image and cuisine type are required",
    });
  }

  // Hash password (old logic)
  const hashPassword = await bcrypt.hash(password, 10);

  // Create food partner (old logic + new fields)
  const foodPartner = await foodPartnerModel.create({
    businessName,
    email,
    password: hashPassword,
    contactName,
    phone,
    address,
    coverImage,
    cuisine,
    averageRating: 0, // default
    dishes: [],       // initially empty
    foodVideos: []    // initially empty
  });

  // JWT token (old logic)
  const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  // Response (old logic unchanged)
  res.status(201).json({
    message: "Food partner Registered Successfully",
    foodPartner: {
      email: foodPartner.email,
      _id: foodPartner._id,
      fullName: foodPartner.fullName,
    },
  });
}

async function loginFoodPartner(req,res){


  const { email, password } = req.body;

  const foodPartner = await foodPartnerModel.findOne({
    email,
  });

  if (!foodPartner) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid Email or Password",
    });
  }

  const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // optional, better security
  });

  //set cookie
  res.cookie("token", token);

res.status(200).json({
  message: "Food Partner Logged In Successfully",
  foodPartner: {
    email: foodPartner.email,
    _id: foodPartner._id,
    businessName: foodPartner.businessName,
    contactName: foodPartner.contactName,
    phone: foodPartner.phone,
    address: foodPartner.address,
    coverImage: foodPartner.coverImage,  // optional, added for home page
    cuisine: foodPartner.cuisine         // optional, added for filtering / display
  },
});


}


async function logoutFoodPartner(req,res){
  res.clearCookie("token");
  res.status(200).json({
    message:"Food partner logged out successfully"
  })
}

async function getFoodPartnerProfile(req, res) {
  try {
    if (!req.foodPartner) 
      return res.status(404).json({ message: "Partner not found" });

    res.status(200).json({ foodPartner: req.foodPartner });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getUserProfile,
  updateUser,
  getFoodPartnerProfile
};
