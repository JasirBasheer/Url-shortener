import type { IUserAuthController } from "./interface/IUserAuth.js";



export class UserAuthController implements IUserAuthController {
  constructor() {}
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const dto = new LoginDTO(email, password);
      const response = await this.loginUserUseCase.execute(dto);

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(process.env.MAX_AGE || '0', 10),
      });

      sendResponse(res, HttpResCode.OK, SuccessMsg.USER_LOGGED_IN, {
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      next(error);
    }
  }


}