export const accountReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'updateName':
      return { ...state, name: payload };
    case 'updateBio':
      return { ...state, bio: payload };
    case 'save':
      return state;
    default:
      throw new Error(`unhandled action ${type}`, action);
  }
};
