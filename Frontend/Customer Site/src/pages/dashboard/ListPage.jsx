import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ListPage({ type }) {
  const visit = type === 'visits'
  const title = visit ? 'My Site Visits' : 'My Inquiries'

  const [data, setData] = useState([])
  const user = JSON.parse(localStorage.getItem('neoUser') || '{}')

  useEffect(() => {
    if (!user.id) return

    // SITE VISITS
    if (visit) {
      Promise.all([
        fetch(`http://localhost:8080/api/site-visits/customer/${user.id}`)
          .then(res => res.json()),

        fetch('http://localhost:8080/api/properties')
          .then(res => res.json())
      ])
        .then(([visits, properties]) => {
          const myVisits = visits.map(item => {
            const property = properties.find(
              p => p.propertyId === item.propertyId
            )

            return {
              ...item,
              propertyName:
                property?.propertyName ||
                `Property #${item.propertyId}`
            }
          })

          setData(myVisits)
        })
        .catch(error => {
          console.error('Error fetching site visits:', error)
        })

      return
    }

    // INQUIRIES
    Promise.all([
      fetch('http://localhost:8080/api/inquiries')
        .then(res => res.json()),

      fetch('http://localhost:8080/api/properties')
        .then(res => res.json())
    ])
      .then(([inquiries, properties]) => {
        const myInquiries = inquiries
          .filter(inquiry => inquiry.customerId === user.id)
          .map(inquiry => {
            const property = properties.find(
              p => p.propertyId === inquiry.propertyId
            )

            return {
              ...inquiry,
              propertyName:
                property?.propertyName ||
                `Property #${inquiry.propertyId}`
            }
          })

        setData(myInquiries)
      })
      .catch(error => {
        console.error('Error fetching inquiries:', error)
      })

  }, [user.id, visit])

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-wine-700">
        Customer Dashboard
      </p>

      <h1 className="mt-2 font-display text-4xl font-bold">
        {title}
      </h1>

      <div className="card mt-7 overflow-x-auto p-4 md:p-6">

        {data.length ? (

          visit ? (

            /* SITE VISITS TABLE */
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-wine-50">
                  <th className="p-3">#</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Visit Date</th>
                  <th className="p-3">Visit Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    className="border-b last:border-0"
                    key={item.visitId || index}
                  >
                    <td className="p-3">
                      {index + 1}
                    </td>

                    <td className="p-3">
                      {item.propertyName}
                    </td>

                    <td className="p-3">
                      {item.preferredDate || '—'}
                    </td>

                    <td className="p-3">
                      {item.preferredTime || '—'}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-wine-50 px-3 py-1 text-xs font-semibold text-wine-700">
                        {item.status || 'REQUESTED'}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.message || '—'}
                    </td>

                    <td className="p-3">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          ) : (

            /* INQUIRIES TABLE */
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-wine-50">
                  <th className="p-3">#</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">BHK</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    className="border-b last:border-0"
                    key={item.inquiryId}
                  >
                    <td className="p-3">
                      {index + 1}
                    </td>

                    <td className="p-3">
                      {item.propertyName}
                    </td>

                    <td className="p-3">
                      {item.budget || '—'}
                    </td>

                    <td className="p-3">
                      {item.bhkPreference || '—'}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-wine-50 px-3 py-1 text-xs font-semibold text-wine-700">
                        {item.inquiryStatus || 'NEW'}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.message || '—'}
                    </td>

                    <td className="p-3">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          )

        ) : (

          <div className="py-12 text-center text-sm text-gray-500">
            No records yet.

            <div>
              <Link
                className="btn-primary mt-4"
                to={visit ? '/schedule-visit' : '/inquiry'}
              >
                {visit
                  ? 'Schedule a Site Visit'
                  : 'Send an Inquiry'}
              </Link>
            </div>
          </div>

        )}

      </div>
    </div>
  )
}