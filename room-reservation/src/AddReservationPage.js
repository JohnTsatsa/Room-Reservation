import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TfiArrowCircleRight, TfiArrowCircleLeft } from 'react-icons/tfi';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Calendar from 'react-calendar';
import Header from './Header'

export default function AddReservationPage({ reservations, setReservations }) {

    // date is completed when the user puts two dates.Two dates because calendar has 'select Range'
    // name is the user name in calendar page
    // isReadyToSave is used in order to disable 'save' button in some scenarios
    const [date, setDate] = useState(null);
    const [name, setName] = useState('')
    const [isReadyToSave, setIsReadyToSave] = useState(false)
    const navigate = useNavigate()

    //! ============  PREVENT BUG WHEN A RANGE OF DATES IS SELECTED AND USER CHOOSE A NEW DATE ============ //
    // when a range is selected and user choose another date,if he clicks 'add' is not saving the correct dates because the second date is the old one.
    // so when there is already a date(user selected two dates) if clicks on another date,remove the second old date and disable the 'add' button to guide user to select a sevond date
    function checkForTwoDates() {
        date &&
            setDate([date[0], null]);
        setIsReadyToSave(false)
    }
    // everytime 'date' is updated,enables the 'add' button when there is a value in the second index of date
    useEffect(() => {
        setIsReadyToSave(date && date[1]);
    }, [date]);
    //! ===== END =====  PREVENT BUG WHEN A RANGE OF DATES IS SELECTED AND USER CHOOSE A NEW DATE  ========= //

    /// =============================  WHEN 'ADD' BUTTON IS PRESSED  ==========================//
    function handleSaving() {

        // show an error if the user didnt put a name and go out of the function
        if (!name) {
            toast.info('Please enter a name', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        // ========================================= //

        //? ======  BLOCK THE USER TO RESERVE IN ALREADY BOOKED DATES  ===== //
        // store the dates that user chose to variables
        const checkInDate = date[0];
        const checkOutDate = date[1];
        // checks each reserved date from reserved dates array
        // if there is a reserved date between the dates taht user chose,return true
        // and store it to isOverlap
        const isOverlap = reservedDates.some(reservedDate => {
            return reservedDate > checkInDate && reservedDate < checkOutDate;
        })
        // show erroe message if isOverlap is true and go out of the function
        if (isOverlap) {
            toast.error('You have included reserved days', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                transition: Zoom,  // first needed import
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored"
            });
            return;
        }
        //? ==== END ====  BLOCK THE USER TO RESERVE IN ALREADY BOOKED DATES  ===== //

        //+  ======= bring a random email ======== //
        fetch("https://randomuser.me/api/?results")
            .then((res) => res.json())
            .then((data) => {
                const email = data.results[0].email;
                //+ ============================= //

                // adds 1 day to the last date that user chose in order to display the checkOut day
                checkOutDate.setDate(checkOutDate.getDate() + 1);
                // take care of formating that is going to display
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                const checkIn = checkInDate.toLocaleDateString('en-GB', options);
                const checkOut = checkOutDate.toLocaleDateString('en-GB', options);
                // make a new object with the values that stored
                const reservation = {
                    name: name,
                    email: email,
                    checkIn: checkIn,
                    checkOut: checkOut,
                };
                // make an array where is all the reservations objects plus the new object that fixed
                // put that array in reservations
                // navigate to home page (bookings-page)
                const updatedReservations = [...reservations, reservation];
                setReservations(updatedReservations);
                navigate('/')
            });
    }
    /// ===================== END ========  WHEN 'ADD' BUTTON IS PRESSED  ==========================//

    //+ =======   make an array of all the reserved dates  ===============  //
    // for each reservation we destructure checkIn and checkOut
    // checkIn and checkOut are in '13 May 1990" format
    // starting from checkIn day,add a day,until one day before checkOut
    // each day put it as object in dates array
    // dates now is an array of some (depending of the number of reservations) arrays where each one has some objects
    // which are the days of each reservation
    // we want an array of all the objects
    // thats why we flatten it
    const reservedDates = reservations.flatMap(({ checkIn, checkOut }) => {
        const dates = [];
        for (let date = new Date(checkIn); date < new Date(checkOut); date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }

        return dates;
    });
    //+ =================================================================== //



    return (
        <div className='calendar-page'>
            <ToastContainer />
            <Header />
            <div className='input-area'>
                <label> Name: </label>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* tileClassName ==> date is refering to all the dates that are visible the specific moment.While you navigate to calendar,date is different.We take each day (ignoring the time) and compare it to each booked day(ignoring the time) */}
            <div className='calendar'>
                <Calendar
                    onChange={setDate}
                    onClickDay={checkForTwoDates}
                    selectRange={true}
                    minDetail={"month"}
                    prevLabel={<TfiArrowCircleLeft />}
                    nextLabel={<TfiArrowCircleRight />}
                    next2Label={null}
                    prev2Label={null}
                    minDate={new Date()}
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 7, 0)}
                    locale='en-US'
                    tileClassName={({ date }) =>
                        reservedDates.some(reservedDate =>
                            reservedDate.toDateString() === date.toDateString()) ? "booked" : ""}
                />
            </div>

            {(date && date[1]) ?
                (
                    <p className=' message booking-nights'>
                        <span>Nights:</span>
                        {/* defaultvalue and readonly for not getting warning */}
                        <input defaultValue={Math.ceil((date[1] - date[0]) / (1000 * 60 * 60 * 24))} readOnly />
                    </p>
                ) :
                <p className='message'> Choose your arrival date and your last overnight </p>
            }
            <button onClick={handleSaving}
                className={isReadyToSave ? "btn add-btn" : "btn add-btn disabled"}> Add </button>
            <button onClick={() => navigate('/')} className='btn'> Cancel </button>
        </div >
    )
}

