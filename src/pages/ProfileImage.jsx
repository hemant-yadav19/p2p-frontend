import React, { useEffect } from 'react'
import { useState } from 'react'
// import defaulImage from "../assets/IMAGE.jpg";
import {useDispatch} from "react-redux";
import { uploadProfilePicture } from '../config/redux/action/authAction';
export default function ProfileImage() {
    const dispatch = useDispatch();  
    const [file, setFile] = useState(null);
    console.log(file);
    

  const handleDispatch = async () => {
    
    dispatch(uploadProfilePicture({file:file}));    
  }


    // const handleFile = async (e) => {
    //     // setFile(()=>e.target.value)
    // }

    return (
    <div>
        <input type='file'  onChange={(e)=>setFile(e.target.files[0])}/>
      <button onClick={handleDispatch}> click</button>
    </div>
  )
}
