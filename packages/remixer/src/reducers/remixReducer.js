const remixReducer = (state, action) => {
  switch (action.type) {
    case 'sourceOpen':
      return { ...state, sources: [...state.sources, action.source] };
    case 'sourceClose':
      return { ...state, sources: state.sources.filter(source => source.id !== action.id) };
    default:
      throw new Error('unhandled action', action);
  }
};

export default remixReducer;
