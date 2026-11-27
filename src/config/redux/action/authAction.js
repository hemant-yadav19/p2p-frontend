import { createAsyncThunk } from "@reduxjs/toolkit";
import { createServer } from "../..";
import socket from "../../socket";

export const registerUser = createAsyncThunk("user/register" , async (user,thunkAPI) =>{
  try {
     
    const response = await createServer.post("/register",{
     
      
      name:user.name,
      email:user.email,
      password:user.password
    })
      return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})


export const loginUser = createAsyncThunk("user/login" , async (user,thunkAPI) => {
    try {
      // console.log(user.email,user.password);
      
      const response = await createServer.post("/login",{
        email:user.email,
        password:user.password
      })

          // console.log(response.data.token);
          
            if(response.data.token){
                
                localStorage.setItem("token",response.data.token) 
                socket.auth = {
    token: response.data.token
};

socket.connect();
              } else{
                return thunkAPI.rejectWithValue({
                    message:"token not provide"
                })
            }

      return thunkAPI.fulfillWithValue(response.data.token);  
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
})


export const addSkills = createAsyncThunk("user/addSkills", async (skills,thunkAPI) => {
  
  try {
  
    // console.log(skills.skillName,skills.category);
      const response = await createServer.post("/skill",{
    // to ken: "1cbb7ac693ef92f0bf8f4be67d28ef73216f47bfde5b949e0ae027c264074499",
    token:localStorage.getItem("token"),  
    name:skills.skillName,
        category:skills.category
        
    })
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);

  }
})


export const getSkills=createAsyncThunk("user/getSkills",async (_,thunkAPI) => {
  try {
    const response = await createServer.get(`/skills?token=${localStorage.getItem("token")}`,{
      // token:localStorage.getItem("token")
    });
    // console.log(response.data); 
    
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})

// export const completeSkills = createAsyncThunk("user/skills" , async (data,thunkAPI) => {

//   try {
      // const skillId = await createServer.get("/skills");
      //  console.log(skillId.data.skills[0]._id);
//       console.log("Form data:", data);

// console.log("Day:", data.day);
// console.log("Start time:", data.startTime);
// console.log("End time:", data.endTime);
// console.log("Proficiency:", data.proficiency);
// console.log("Wanted skill:", data.wantedSkills);
// let x=localStorage.getItem('token');
// console.log(data.token);s
//       const response = await createServer.post("/complete_profile",{
//     token:data.token,
//     bio:data.bio,
//     offerSkills:[{
//       skill:skillId.data.skills[0]._id,
//       proficiency:data.proficiency,
//       yearsOfExperience:data.experience,
//     }],
//    wantedSkills:[{
//       skill:skillId.data.skills[0]._id,
//       skillWant:data.wantedSkills,
//       desiredLevel:data.desiredLevel
//     }],
//     availability:[{
//       day:data.day,
//       startTime:data.startTime,
//       endTime:data.endTime
//     }],

//   });
//   return thunkAPI.fulfillWithValue(response.data);
//   } catch (error) {
//    return thunkAPI.rejectWithValue(error.response.data); 
//   }

// })


export const userSkills = createAsyncThunk("user/userSkills" , async (data,thunkAPI) => {
    try {
      // console.log(data);
      const response = createServer.post("/userSkills",{
        token:localStorage.getItem("token"),
        types:data.types,
        skillName:data.skill,
        level:data.level,
        description:data.description
      })
      
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(response.data);
    }
})

// export const getUser = createAsyncThunk("user/getUser",async (token,thunkAPI) => {
//     try {
//       //  console.log(localStorage.getItem(token));
//      const response = await createServer.get(`/getUser/token?token=${{token}}`,{
//       // token:localStorage.getItem("token")
//      });
//      console.log(response.data);
//     return thunkAPI.fulfillWithValue(response.data);    
      
//     } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data);   
//     }
// })



export const getUser = createAsyncThunk(
    "user/getUser",
    async ({ token }, thunkAPI) => {
      // console.log(token);
      
        try {
            const response = await createServer.get(
                `/getUser/token?token=${token}`
            );

            // console.log("User response:", response.data);

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const getMatchedSkill = createAsyncThunk("user/getMatchSkills", async (_,thunkAPI) => {
      try {
        const response = await createServer.get(`/match/token?token=${localStorage.getItem("token")}`,{})
        // console.log(response.data);
        

        return thunkAPI.fulfillWithValue(response.data);
      } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);  
      }      
    })

export const uploadProfilePicture = createAsyncThunk("user/uploadPicture",async (data,thunkAPI) => {
    const {file} = data;
  try {

    const formData = new FormData();
    formData.append('token', localStorage.getItem("token"));
    formData.append('file',file);
    const response = await createServer.post("/uploadProfile",formData,{
      headers:{
        'Content-Type':'multipart/form-data'
      }

    })
        
      console.log(response.data);
      
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
  }
})


export const sendConnectionRequest = createAsyncThunk("user/senRequest",async (data,thunkAPI) => {
  try {
    const response = await createServer.post("/sendingRequest",{
      token:data.token,
      connectionId:data.connectionId
    })

    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(response.error.data);
  }
})

export const getMyConnections = createAsyncThunk("user/getConnections",async (_,thunkAPI) => {
  try {
    const response = await createServer.get(`/getConnections/token?token=${localStorage.getItem("token")}`,{
      // token:localStorage.getItem("token")
    })
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})

export const myConnection = createAsyncThunk("user/myConnection",async (_,thunkAPI) => {
  try {
    const response = await createServer.get(`/myConnections/token?token=${localStorage.getItem("token")}`,{});
    // console.log(response.data);
    
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})

export const acceptConnection = createAsyncThunk("user/accpetConnection",async (data,thunkAPI)=>{
  try {
    const response = await createServer.post("/acceptConnectionRequest",{
      token:data.token,
      requestId:data.connectionId,
      action_type:data.requestId
    })

    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})

export const updateDetails = createAsyncThunk("user/updateDetails",async (formData,thunkAPI) => {
  try {
   
    // console.log();
     
    const response = await createServer.put("/registerDetails",{
      token:localStorage.getItem("token"),
      location:formData.location,
      bio:formData.bio,
      availability:formData.availability.filter((day)=>day.enabled===true)
    })

    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
})



// export const updateDetails = createAsyncThunk(
//   "user/updateDetails",
//   async (formData, thunkAPI) => {
//     try {
//       const response = await createServer.put("/registerDetails", {
//         token: localStorage.getItem("token"),
//         name: formData.name,
//         email: formData.email,
//         bio: formData.bio,
//         location: formData.location,
//         onlineOnly: formData.onlineOnly,
//         timezone: formData.timezone,
//         availability: formData.availability
//       });

//       return response.data;

//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || error.message
//       );
//     }
//   }
// );


// export const connectionStatus = createAsyncThunk("user/connectionStatues", async (_,thunkAPI) => {
//   try {
//     const response = await createServer.get(`/connectionStatus/token?token=${localStorage.getItem("token")}`,{})
 
//     return thunkAPI.fulfillWithValue(response.data);
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response.data);
//   }
// })