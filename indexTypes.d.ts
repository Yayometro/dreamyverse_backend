export type actionSocketMessage = "newMessage" | "removeFor" | "removeForAll" | "editContent" | "markedAsRead" | "visibleAgain"

export interface MessageSocketObject {
  iMessage: IMessage,
  action: actionSocketMessage,
  message: string
}
export type removeForHandleType = "RemoveForTheOtherOnly" | "RestoredForTheOther" | "RemovedForMyselfOnly" | "RestoredForMyself"