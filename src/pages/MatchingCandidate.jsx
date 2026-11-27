import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchedSkill, getUser} from '../config/redux/action/authAction';
import "./MatchingCandidate.css";
export default function MatchingCandidate() {
 
    const authState = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getMatchedSkill());
      dispatch(getUser({token:localStorage.getItem("token")}));
    },[dispatch])
    // console.log(authState.skillMatchedUsers);
    // console.log(authState.profilePicture);
    
    return (
    <div className='matchingCandidate'>
       

        {
        authState.skillMatchedUsers.map((match)=>
            // console.log()
            
            (<div className="candidateCard" key={match._id}>
                 <img src={`http://localhost:7000${match.user.profilePicture}`} alt='prifilePicture'/>
                                <h5>{match.user.name}</h5>
                <p>offering {match.skillName}</p>
                <p>level {match.level}</p>
            </div>)
        )
        }
        
    </div>
  )
}
