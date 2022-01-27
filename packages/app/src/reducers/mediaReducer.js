export function mediaReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "editMedia":
      console.log("edit media", { payload });
      return state;
    case "translateMedia":
      console.log("translate media", { payload });
      return state;
    case "deleteMedia":
      console.log("delete media", { payload });
      return state;
    default:
      throw new Error(`unhandled action ${type}`, action);
  }
}
