const remixReducer = (state, action) => {
  switch (action.type) {
    case 'sourceOpen':
      return { ...state, sources: [...state.sources, action.source] };
    default:
      throw new Error('unhandled action', action);
  }
};

export default remixReducer;
