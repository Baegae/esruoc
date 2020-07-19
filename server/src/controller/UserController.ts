import {Body, JsonController, Post} from 'routing-controllers';
import LoginInput from '@shared/request/LoginInput';
import {UserService} from '@business/UserService';

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저와 관련 있는 API 들
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       uid:
 *         type: string
 *         description: 유저 Google ID
 *       name:
 *         type: string
 *         description: 유저 이름
 *       email:
 *         type: string
 *         description: 유저 email
 *       profileImageUrl:
 *         type: string
 *         description: 유저 프로필 사진 Url
 *       createdAt:
 *         type: Date
 *         description: 유저가 생성된 시각
 */
@JsonController('/user')
export class UserController {

  private userService: UserService = new UserService()

  /**
   * @swagger
   * /user/login:
   *   post:
   *     summary: 유저 로그인
   *     consumes:
   *       - application/json
   *     parameters:
   *      - in: body
   *        name: googleAccessToken
   *        description: Firebase AccessToken
   *        type: string
   *
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Authorization token
   *         schema:
   *           type: string
   */

  @Post('/login')
  login(@Body() loginInput: LoginInput) {
    return this.userService.login(loginInput);
  }

}
