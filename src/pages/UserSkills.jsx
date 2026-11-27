import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMatchedSkill, getSkills, userSkills } from '../config/redux/action/authAction';
import "./UserSkills.css";
import { useNavigate } from 'react-router-dom';
import { createServer } from '../config';
export default function UserSkills() {

const dispatch = useDispatch();
const navigate = useNavigate();
const authState = useSelector((state)=>state.auth);
// console.log(authState.status);

const [types, setTypes] = useState("");
const [level, setLevel] = useState("");
const [description, setDescription] = useState("");
const [skill, setSkill] = useState("");
const [message, setMessage] = useState("");
const [suggestion, setSuggestion] = useState([]);
const [showSuggestion, setShowSuggestion] = useState(false);
const handleDescriptiopn = (e)=>{
    setDescription(()=>e.target.value);
}


useEffect(() => {
  try {
    
  const searching = async () => {
   
  if(!skill.trim()){
    setSuggestion([]);
    return;
  }
  const searchedSkill = await createServer.get(`/showSuggestions?search=${encodeURIComponent(skill)}`);
    
  setSuggestion(searchedSkill.data);
  setShowSuggestion(true); 
  }
 
  searching();
} catch (error) {
   console.log(error); 
  }

  

}, [skill]);

// console.log(suggestion);


const handleSkill = (e)=>{
  

  setSkill(()=>e.target.value);
  setShowSuggestion(true);
}


  const handleSelect = (skill) => {
    setSkill(skill.name);
    setShowSuggestion(false);
    setSuggestion([]);
    onSelect(skill);
  };

const handleSubmmit = ()=>{


    if(!types || !level || !description || !skill){
      setMessage("required all the feilds")
      return
    }

    if(authState.skills.length>=5){
      setMessage("entry limit exceeds")
      return;
    }
    const userSkils=dispatch(userSkills({types,skill,level,description}));
    console.log(userSkils);
  setTimeout(()=>navigate("/dashboard"),2000);    
    
  }

  // console.log(authState.userSkill);
  
    return (

        
  <div className="contanerUserSkills">
    <div className="mainContainerUserSkills">
      <button style={{height:"2rem",width:"4rem",backgroundColor:"gray"}} onClick={()=>navigate("/dashboard")}>Home</button>
        <p style={{color:"red",textAlign:"center"}}>{message}</p>
      <select
      value={types}
      onChange={(e)=>setTypes(e.target.value)}
      >
        <option value="">Select Types</option>
        <option value="offer">offer</option>
        <option value="want">want</option>
      </select>
      
      <select
      value={level}
      onChange={(e)=>setLevel(e.target.value)}
      >

        <option value="">select level</option>
       <option value="beginner">Beginner</option>
       <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
        </select>
        {/* <input placeholder='enter skill' value={skill} onChange={handleSkill}/>

       {showSuggestion && suggestion.length > 0 && (
        <div className="suggestionList">

          {suggestion.map((skill) => (
            <div
              key={skill._id}
              className="suggestionItem"
              onClick={() => handleSelect(skill)}
            >
              <span>{skill.name}</span>
              <small>{skill.category}</small>
            </div>
          ))}

        </div>
      )}
 */}

        <div className="skillInputWrapper">

    <input
        placeholder="enter skill"
        value={skill}
        onChange={handleSkill}
    />

    {showSuggestion && suggestion.length > 0 && (
        <div className="suggestionList">

            {suggestion.map((item) => (
                <div
                    key={item._id}
                    className="suggestionItem"
                    onClick={() => handleSelect(item)}
                >
                    <span>{item.name}</span>
                    <small>{item.category}</small>
                </div>
            ))}

        </div>
    )}

</div>

        <textarea placeholder='description'
        value={description}
        onChange={handleDescriptiopn}
        ></textarea>
        <button onClick={handleSubmmit}>submmit</button>
    </div>
  </div>
)
}
