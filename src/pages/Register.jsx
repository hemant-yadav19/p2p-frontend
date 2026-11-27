import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../config/redux/action/authAction';
import { useState } from 'react';
import "./Register.css";
// import NavLayout from '../components/Layout/NavLayout';
import { useNavigate } from 'react-router-dom';
export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state)=>state.auth); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isUserLoggedin, setIsUserLoggedin] = useState(false);



    // useEffect(() => {

    //     if(authState.isLoggedin){
    //         navigate("/dashboard");
    //     }
    
    // }, [authState.isLoggedin])
     
   

  useEffect(()=>{
    if(localStorage.getItem("token")){
      navigate("/dashboard");
    }
  })

    
    
    // console.log(authState.message);
    const handleRegister = ()=>{
        // console.log(name,email);
        
        dispatch(registerUser({name,email,password}));
        setEmail("");
        setName("");
        setPassword("");
        setIsUserLoggedin(!isUserLoggedin);
    }

    const handleLogin = ()=>{
        dispatch(loginUser({email,password}));
        setEmail("");
        setName("");
        setPassword("");
    }

    useEffect(() => {
       if(authState.isLoggedin){
        navigate("/skills");
        }
    
     
    }, [authState.isLoggedin])

    // useEffect(() => {
    //   if(localStorage.getItem("token")){
    //     navigate("/dashboard");
    //   }
    
    // })
    

    return (
        // <NavLayout>
    <div className='Container'>
        <div className="mainContainer"> 
               
            {authState.isError?<p>{authState.message}</p>:authState.message}
            {!isUserLoggedin&&<input type="text" placeholder='enter name' value={name}  onChange={(e)=>setName(e.target.value)}/>}
            <input type="text" placeholder='enter email'  value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" placeholder='enter password' value={password} onChange={(e)=>setPassword(e.target.value)}/>

            <div onClick={()=>{
                if(isUserLoggedin){
                    handleLogin();
       
                }else{
                    handleRegister();
                     
                }}
            }> <button>{isUserLoggedin?"Login":"Register"}</button>

            </div>
            <div style={{cursor:"pointer"}}onClick={()=>setIsUserLoggedin(!isUserLoggedin)}>{isUserLoggedin?<p>Don't have an account</p>:<p>Already have an account ?</p>}</div>
            
        </div>
    </div>
            // </NavLayout>
  )
}
