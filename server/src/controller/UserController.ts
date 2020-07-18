import {Controller, Post, Req} from 'routing-controllers';
import LoginInput from '../../../shared/src/request/LoginInput';

@Controller()
export class UserController {

  @Post('login')
  login(@Req() loginInput: LoginInput) {
    return loginInput.googleAccessToken;
  }

}
