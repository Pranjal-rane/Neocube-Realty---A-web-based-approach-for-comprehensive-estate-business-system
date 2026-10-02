import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const user = JSON.parse(localStorage.getItem('neoUser') || '{}')

  useEffect(() => {
    if (!user.id) return

    Promise.all([
      fetch(`http://localhost:8080/api/bookings/customer/${user.id}`)
        .then(res => res.json()),

      fetch('http://localhost:8080/api/properties')
        .then(res => res.json())
    ])
      .then(([bookingData, properties]) => {
        const result = bookingData.map(booking => {
          const property = properties.find(
            p => p.propertyId === booking.propertyId
          )

          return {
            ...booking,
            propertyName:
              property?.propertyName ||
              `Property #${booking.propertyId}`
          }
        })

        setBookings(result)
      })
      .catch(error => {
        console.error('Error fetching bookings:', error)
      })
  }, [user.id])

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-wine-700">
        Customer Dashboard
      </p>

      <h1 className="mt-2 font-display text-4xl font-bold">
        My Bookings / Deals
      </h1>

      <div className="card mt-7 overflow-x-auto p-4 md:p-6">

        {bookings.length ? (
          <table className="min-w-[850px] w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-wine-50">
                <th className="p-3">#</th>
                <th className="p-3">Property</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Booking Date</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={booking.bookingId}
                  className="border-b last:border-0"
                >
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3">
                    {booking.propertyName}
                  </td>

                  <td className="p-3">
                    ₹{Number(booking.amount).toLocaleString('en-IN')}
                  </td>

                  <td className="p-3">
                    {booking.bookingDate || '—'}
                  </td>

                  <td className="p-3">
                    {booking.paymentStatus || 'PENDING'}
                  </td>

                  <td className="p-3">
                    {booking.status || 'PENDING'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">
              No bookings or deals yet.
            </p>

            <Link
              className="btn-primary mt-5"
              to="/properties"
            >
              Explore Properties
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}