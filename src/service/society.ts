// internal import
import societyRepository from "../repository/society";
import usersRepository from "../repository/user";

// types import
import { HydratedDocument, Types } from "mongoose";
import { SocietyType } from "../model/society";
import createHttpError from "http-errors";
import { convertToObjectId } from "../lib/convertIdType";
import { UserType } from "../model/user";

async function getAllSociety(): Promise<
  HydratedDocument<SocietyType>[] | null
> {
  const societies = await societyRepository.findAll();
  if (!societies) {
    throw createHttpError(404, "societies not found");
  }

  return societies;
}

async function getSocietyById(
  id: Types.ObjectId | string
): Promise<HydratedDocument<SocietyType> | null> {
  const societyId = convertToObjectId(id);

  const society = await societyRepository.findById(societyId);
  if (!society) {
    throw createHttpError(404, "society not found");
  }

  return society;
}

type TRole = "admin" | "resident" | "guard";
async function getAllUserByRole(
  societyId: string | Types.ObjectId,
  role: TRole
): Promise<HydratedDocument<UserType>[] | null> {
  const conSocId = convertToObjectId(societyId);

  const users = await usersRepository.findByRole(role, conSocId);
  if (!users) {
    throw createHttpError(404, "users not found");
  }

  return users;
}

// export
export default {
  getAllSociety,
  getSocietyById,
  getAllUserByRole,
};
