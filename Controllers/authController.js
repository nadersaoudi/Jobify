import User from "../Models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already is use");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({
      user: {
        email: user.email,
        name: user.name,
        location: user.location,
        lastName: user.lastName,
      },
      token,
      location: user.location,
    });
};

const login = async (req, res) => {
  const { email, password} = req.body
  if(!email || !password){
    throw new BadRequestError('Please provide all values')
  }
  const user = await User.findOne({email}).select('+password')
  if (!user){
    throw new UnAuthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect){
    throw new UnAuthenticatedError('Invalid Credentials')
  }
  const token = user.createJWT()
  user.password = undefined
  res.status(StatusCodes.OK).json({
    user, token , location: user.location
  })
};

const updateUser = async (req, res) => {
  res.send("update user");
};

export { register, login, updateUser };
