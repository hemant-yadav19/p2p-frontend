import { createSlice } from "@reduxjs/toolkit"
import { addSkills, userSkills, getSkills, getUser, loginUser, registerUser,getMatchedSkill,myConnection } from "../../action/authAction";
// import { connections } from "mongoose";
// import { act } from "react";

const initialState = {
    skills:[],
    user:"",
    isError:false,
    isSuccess:false,
    isLoading:false,
    isLoggedin:false,
    isTokenThere:false,
    skillMatchedUsers:[],
    message:"",
    userSkill:"",
    // profilePicture:"",
    connections:[]
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,

    },

    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state,action)=>{

            state.isLoading=true;
            state.message= "registering you...:)";
            // console.log(action.payload.message);
            
        }).addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.isLoggedin=false;
            state.user=action.payload;
            state.message=action.payload.message || "registered succefully Please login to procced";
        }).addCase(registerUser.rejected,(state,action)=>{
            state.isError=true;
            state.isLoading=false;
            state.message=action.payload.message || "something went wrong";
            state.isLoggedin=false;
        }).addCase(loginUser.pending,(state)=>{
            state.isLoading=true;
            state.message="loading";
        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.isLoggedin=true;
            state.user=action.payload;
            state.message=action.payload || "welcome back to your page";
        }).addCase(loginUser.rejected,(state,action)=>{
            state.isError=false;
            state.isSuccess=false;  
            state.isLoading=false;
            state.message=action.payload.message || "something went wrong";
            state.isLoggedin=false;
        }).addCase(addSkills.pending,(state)=>{
            state.isError=false;
            state.isSuccess=false;
            state.isLoading=true;
        }).addCase(addSkills.fulfilled,(state,action)=>{
            state.isError=false;
            state.isSuccess=true;
            state.isLoading=false;
            state.message=action.payload.message;

        }).addCase(addSkills.rejected,(state,action)=>{
            state.isError=true;
            state.message=action.payload.message;
        }).addCase(getSkills.pending,(state)=>{
            state.isLoading=true;
            state.isSuccess=false;
            state.message="loading skills";
        }).addCase(getSkills.fulfilled,(state,action)=>{
            state.isError=false;
            state.isSuccess=true;
            state.skills=action.payload.skills;
            // console.log(state.skills);
        }).addCase(getSkills.rejected,(state,action)=>{
            state.isError=true;
            state.isSuccess=false;
            state.message=action.payload.message;
        }).addCase(userSkills.pending,(state)=>{
            state.isLoading=true;
            state.message="loading";
            state.isSuccess=false;
            state.isError=false;
        }).addCase(userSkills.fulfilled,(state,action)=>{
            state.isError=false;
            state.message=action.payload.message;
            // console.log(action.payload.statuss);
            state.userSkill=action.payload;
            state.isSuccess=true;
        }).addCase(userSkills.rejected,(state,action)=>{
            state.isError=true;
            state.isSuccess=false;
            state.isLoading=false;
            state.message=action.payload.message;
        }).addCase(getUser.pending,(state)=>{
            state.isLoading=true;

        }).addCase(getUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.user;
            // console.log(state.user);
            
            state.isError=false;
            // state.profilePicture=action.payload.user[0].profilePicture;
            state.message=action.payload.message;
        }).addCase(getUser.rejected,(state,action)=>{
            state.isError=true;
            state.message=action.payload.message;
             
        }).addCase(getMatchedSkill.pending,(state)=>{
            state.isLoading=true;
        }).addCase(getMatchedSkill.fulfilled,(state,action)=>{
            state.isError=false;
            state.message=action.payload.message;
            state.isLoading=false;
            state.skillMatchedUsers=action.payload.matches;
            console.log(state.skillMatchedUsers);
            
        }).addCase(getMatchedSkill.rejected,(state,action)=>{
            state.isError=false;
            state.message=action.payload.message;
            state.isLoading=false;
        }).addCase(myConnection.pending,(state)=>{
            state.isError=false;
            state.message="loading";
            
        }).addCase(myConnection.fulfilled,(state,action)=>{
            state.isError=false;
            state.connections=action.payload.connections;
            
        }).addCase(myConnection.rejected,(action,state)=>{
            state.isError=true;
            state.message=action.payload.message;
        })
    //     .addCase(uploadProfilePicture.pending,(state)=>{
    //         state.isLoading=true;
    //         state.message="loading";
    //     }).addCase(uploadProfilePicture.fulfilled,(state,action)=>{
    //         state.message=action.payload.message;
    //           console.log("Payload:", action.payload);
    // console.log("Profile:", action.payload.profilePicture);
    //         state.profilePicture=action.payload.profilePicture;
    //         console.log(state.profilePicture);
            
    //         state.isError=false;
    //         state.isSuccess=true;

    //     }).addCase(uploadProfilePicture.rejected,(state,action)=>{
    //         // state.message=action.payload.message;
    //         state.isError=true;
    //     })
    }
})

export default authSlice.reducer;

