import { createSlice } from "@reduxjs/toolkit";


const UserSlice=createSlice({
    name:"User",
    initialState:{
        User:null
    },
    reducers:{
        setUserDetails:(state,action)=>{
            state.User=action.payload
        }

    }
})

export const {setUserDetails}=UserSlice.actions
export default UserSlice.reducer

