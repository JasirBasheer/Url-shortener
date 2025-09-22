import "reflect-metadata";
import { container } from "tsyringe";
import { UrlModel, UserModel } from "../models";

export const registerModels = () => {
  container.registerInstance("UserModel", UserModel);
  container.registerInstance("UrlModel", UrlModel);
};
