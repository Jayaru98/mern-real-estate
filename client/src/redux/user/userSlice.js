import { createSlice } from "@reduxjs/toolkit";


const initialState={
    currentUser:null,
    error:null,
    loading:false,
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signinStart:(state) =>{
            state.loading=true;            
        },
        signInSuccess:(state,action)=> {
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFail:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFail:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
    },
});

export const {signinStart,signInSuccess,signInFail, updateUserFail,updateUserSuccess,updateUserStart}=userSlice.actions;

export default userSlice.reducer;