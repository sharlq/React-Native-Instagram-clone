import { USERS_POSTS_STATE_CHANGE, USERS_DATA_STATE_CHANGE } from "../constants"

const initialState = {
    users:[],
    usersFollowingLoaded:0
}
export const users = (state=initialState,action: { type:string,user: any,posts:any,following:any,uid:string })=>{
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
        return {
            ...state,
            users:[...state.users,action.user]
        }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                users:state.users.map(
                    (user:any)=>
                    user.uid===action.uid?
                    {user,posts:action.posts}:
                    user
                    )
            }

        default:
            return state;
    }

}