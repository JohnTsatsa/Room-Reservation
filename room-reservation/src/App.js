import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import { useState } from 'react';


import reservationsData from './ReservationsData';
import BookingsPage from './BookingsPage'
import AddReservationPage from './AddReservationPage'

import './App.css'

function App() {

  const [reservations, setReservations] = useState(reservationsData);


  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<BookingsPage reservations={reservations} setReservations={setReservations} />} />
        <Route exact path='/addreservation' element={<AddReservationPage reservations={reservations} setReservations={setReservations} />} />
      </Routes>
    </Router >
  )
}
export default App