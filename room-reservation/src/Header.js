import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillPlusCircle } from 'react-icons/ai';


export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()

//+ depending on the url,the heading content is going to be different  
    let headerContent;
    if (location.pathname === '/') {
        headerContent =
            <div className='header-container'>
                <h1>Reservations</h1>
                <button onClick={() => navigate('/addreservation')}><AiFillPlusCircle /></button>
            </div>
    } else if (location.pathname === '/addreservation') {
        headerContent =
            <div className='header-container'>
                <h1>Add reservation</h1>
            </div>
    }


    return (
        <h1>{headerContent}</h1>
    )
}