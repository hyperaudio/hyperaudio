export function teamReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "addMember":
      console.log("add team member");
      return state;
    case "changeMemberRole":
      console.log("change member role", { payload });
      return state;
    case "deleteMembers":
      console.log("delete team member", { payload });
      return state;
    default:
      throw new Error(`unhandled action ${type}`, action);
  }
}
