// import { set } from 'mongoose'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux";
import { addSkills, getSkills } from '../config/redux/action/authAction';
import { useNavigate } from 'react-router-dom';
import "./AddSkill.css";

export default function AddSkills() {
    
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [skillName, setSkillName] = useState("");
    const [category,setCategory] = useState("");
    const [message, setMessage] = useState("");


    useEffect(() => {
      dispatch(getSkills());
    
    }, [dispatch])
    

    let handleChange = (e)=>{

     setSkillName(()=>e.target.value);   
    }

    
    // console.log(skillName);
    // console.log(category);
    
    
    const handleSkills = (e)=>{
        
            if(!skillName || !category){
                setMessage("all feilds required")
                return;
            }
            
    if(authState.skills.length>=5){
      setMessage("entry limit exceeds")
      return;
    }
        // console.log(authState.skills.length);
         
    // e.preventDefault();
        dispatch(addSkills({skillName:skillName,category:category}));
        navigate("/completeSkills")
        // console.log(skills);

    }

    

    return (
    <div className='addSkillContainer'>
        
        
        <div className="mainHeading">Skills</div>
        
        <div className='addSkillMainContainer'>
          <button style={{height:"2rem",width:"4rem",backgroundColor:"gray"}} onClick={()=>navigate("/dashboard")}>Home</button>
            {/* <form onSubmit={handleSkills}> */}

            <p style={{color:"red",textAlign:"center"}}>{message}</p>
            <input type="text" 
            // name='name'
            value={skillName}
           onChange={handleChange}
            />
            
            <select type="text" 
            // name='category'
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
           >
            <option value="Select category">select category</option>
            <option value="programming">programming</option>
            <option value="design">design</option>
            <option value="music">music</option>
            <option value="language">language</option>
            <option value="business">business</option>
            <option value="academics">academics</option>
            <option value="fitness">fitness</option>
            <option value="art">art</option>
            <option value="other">other</option>
           </select>

            <button onClick={handleSkills}>Add Skills</button>
            {/* </form> */}
            {/* <input type="text" 
            />
            <input type="text" /> */}
        </div>
    </div>
  )
}
