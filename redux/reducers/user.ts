const initialState = {
    currnetUser:null
}
export const user = (state=initialState,action: { currnetUser: any })=>{
    console.log("fk you",action)
    return {
        ...state,
        currentUser:action.currnetUser
    }
}