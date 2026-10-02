import { CalendarDays, FileText, Heart, Handshake, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('neoUser') || '{}')

  const [inquiryCount, setInquiryCount] = useState(0)
  const [visitCount, setVisitCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
  if (!user.id) return

  fetch(`http://localhost:8080/api/bookings/customer/${user.id}`)
  .then(response => response.json())
  .then(data => {
    setBookingCount(data.length)
  })
  .catch(error => {
    console.error('Error fetching bookings:', error)
  })

  fetch('http://localhost:8080/api/inquiries')
    .then(response => response.json())
    .then(data => {
      const myInquiries = data.filter(
        inquiry => inquiry.customerId === user.id
      )

      setInquiryCount(myInquiries.length)
    })
    .catch(error => {
      console.error('Error fetching inquiries:', error)
    })

  fetch(`http://localhost:8080/api/site-visits/customer/${user.id}`)
    .then(response => response.json())
    .then(data => {
      setVisitCount(data.length)
    })
    .catch(error => {
      console.error('Error fetching site visits:', error)
    })

    fetch(`http://localhost:8080/api/favorites/customer/${user.id}`)
  .then(response => response.json())
  .then(data => {
    setFavoriteCount(data.length)
  })
  .catch(error => {
    console.error('Error fetching favorites:', error)
  })

}, [user.id])

  const stats = [
    ['My Inquiries', inquiryCount, FileText, '/dashboard/inquiries'],
    ['My Site Visits', visitCount, CalendarDays, '/dashboard/site-visits'],
    ['My Bookings / Deals', bookingCount, Handshake, '/dashboard/bookings'],
    ['Favorites', favoriteCount, Heart, '/favorites']
  ]

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-wine-700">
        Customer Dashboard
      </p>

      <h1 className="mt-2 font-display text-4xl font-bold">
        Welcome{user.name ? `, ${user.name}` : ''}!
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Manage your property journey from one place.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([title, value, Icon, to]) => (
          <Link
            to={to}
            key={title}
            className="card p-5 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-wine-50 text-wine-700">
                <Icon size={20} />
              </div>
              <ArrowRight size={17} className="text-gray-400" />
            </div>

            <p className="mt-5 text-sm text-gray-500">{title}</p>
            <p className="mt-1 text-3xl font-extrabold text-wine-700">
              {value}
            </p>
          </Link>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-2xl font-bold">Quick Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-primary" to="/properties">
            Explore Properties
          </Link>

          <Link className="btn-outline" to="/inquiry">
            Send Inquiry
          </Link>

          <Link className="btn-outline" to="/schedule-visit">
            Schedule Site Visit
          </Link>
        </div>
      </div>
    </div>
  )
}