
import Header from './Header'
import { BsTrash3Fill } from 'react-icons/bs';


export default function BookingsPage({ reservations, setReservations }) {

//+ checks each reservation object of reservations array and keep those are not equal to the reservation that clicked
    const deleteReservation = (reservation) => {
        const remainingReservations = reservations.filter(index => index !== reservation);
        setReservations(remainingReservations);
    };

    return (
        <div>
            <Header />
            <ul className='list-of-bookings'>
                {reservations.map((reservation) => (
                    <li key={reservation.checkIn}>
                        <div>
                            <p>Name: {reservation.name}</p>
                            <p>Email: {reservation.email}</p>
                            <p>Check In: {reservation.checkIn}</p>
                            <p>Check Out: {reservation.checkOut}</p>
                        </div>
                        <button onClick={() => deleteReservation(reservation)}><BsTrash3Fill /></button>
                    </li>
                ))}
            </ul>


        </div>
    )
}
