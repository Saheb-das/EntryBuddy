// internal imports
import userService from "../service/user";
import emailService from "../service/email";

// types imports
import { HydratedDocument, Types } from "mongoose";
import { UserType } from "../model/user";
import { TVisitorInput } from "../types/userTypes";
import Visitor, { TVisitor, VisitorType } from "../model/visitor";

async function getResidentUserById(
  residentUserId: string
): Promise<HydratedDocument<UserType> | null> {
  const residentUser = await userService.getUserById(residentUserId);
  return residentUser;
}

async function createVisitor(
  visitorData: TVisitorInput
): Promise<HydratedDocument<TVisitor>> {
  const newVisitor = new Visitor(visitorData);
  return await newVisitor.save();
}

async function sendMailToResident(
  residentMail: string,
  visitorName: string,
  visitorPhone: string
): Promise<void> {
  await emailService.notifyResident(residentMail, visitorName, visitorPhone);
}

async function getVisitorById(
  visitorId: Types.ObjectId
): Promise<HydratedDocument<VisitorType> | null> {
  const visitor = await Visitor.findById(visitorId);
  return visitor;
}

async function deleteById(id: Types.ObjectId) {
  const deletedVisitor = await Visitor.findByIdAndDelete(id).exec();
}

// export
export default {
  getResidentUserById,
  createVisitor,
  sendMailToResident,
  getVisitorById,
  deleteById,
};
