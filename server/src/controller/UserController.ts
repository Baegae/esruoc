import {Body, JsonController, Post} from 'routing-controllers';
import LoginInput from '@shared/request/LoginInput';
import {UserService} from '@business/UserService';

@JsonController('/user')
export class UserController {

  private userService: UserService = new UserService()

  @Post('/login')
  login(@Body() loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

}
