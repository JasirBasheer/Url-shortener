import { IAuthService } from "../../services";
import { SignInRequest, SignUpRequest } from "@/types";
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { IAuthController } from "../interface/IAuthController";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("IAuthService") private readonly authService: IAuthService
  ) {}

  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: SignUpRequest = req.body;
      console.log("dataa",data)
      const result = await this.authService.signUp(data);
      this.setTokenCookies(res, result.tokens);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: SignInRequest = req.body;
      const result = await this.authService.signIn(data);
      this.setTokenCookies(res, result.tokens);

      res.status(200).json({
        success: true,
        message: "Sign in successful",
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  signOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.clearTokenCookies(res);

      res.status(200).json({
        success: true,
        message: "Sign out successful",
      });
    } catch (error) {
      next(error);
    }
  };

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string }
  ): void {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
}
