export interface CurrentUserInterface {
  hasError: boolean,
  errors: string[],
  total: number,
  data: {
    userInfo: {
      userId: number, // ID пользователя
      userName: string, // Имя пользователя
      userAvatar: string, // ссылка на аватерку
      userRole: number // Роль пользоваетля
    },
    tokens: {
      token: string,
      refreshToken: string
    }
  }
}
