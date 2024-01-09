export interface CurrentUserInterface {
  userInfo: {
      userId: number, // ID пользователя
      userName: string, // Имя пользователя
      userAvatar: string, // Ссылка на аватерку
      userRole: number // Роль пользоваетля
  },
  tokens: {
    token: string,
    refreshToken: string
  }
}
