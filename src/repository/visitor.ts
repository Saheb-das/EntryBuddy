// internal import
import Visitor from "../model/visitor";

// types import
import { HydratedDocument, Types } from "mongoose";
import { TVisitor, VisitorType } from "../model/visitor";

async function findById(
  id: Types.ObjectId
): Promise<HydratedDocument<VisitorType> | null> {
  try {
    const visitor = await Visitor.findById(id).exec();
    return visitor;
  } catch (error) {
    console.log("Error finding visitor", error);
    return null;
  }
}

async function create(data: TVisitor): Promise<HydratedDocument<VisitorType>> {
  const newVisitor = new Visitor(data);
  return await newVisitor.save();
}

// export
export default {
  findById,
  create,
};
