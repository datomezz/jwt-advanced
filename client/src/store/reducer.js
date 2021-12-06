const initialState = {
  user: {},
  isAuth : false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {...state, isAuth : action.payload};
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export default reducer;