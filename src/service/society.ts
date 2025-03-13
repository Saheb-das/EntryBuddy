// internal import
import societyRepository from "../repository/society";

// types import
import { HydratedDocument } from "mongoose";
import { SocietyType } from "../model/society";
import createHttpError from "http-errors";

async function getAllSociety(): Promise<
  HydratedDocument<SocietyType>[] | null
> {
  const societies = await societyRepository.findAll();
  if (!societies) {
    throw createHttpError(404, "societies not found");
  }

  return societies;
}

// export
export default {
  getAllSociety,
};
