import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import PageHero from '../components/PageHero'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:8080/api/contact-requests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerName: form.customerName,
            email: form.email,
            phone: form.phone,
            message: form.subject
              ? `${form.subject} - ${form.message}`
              : form.message,
            status: 'NEW'
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSent(true)

    } catch (error) {
      console.error('Contact request error:', error)
      alert('Unable to send message.')
    }
  }

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Our team is ready to help you find the right property."
      />

      <section className="py-12 md:py-16">
        <div className="container-page grid gap-6 lg:grid-cols-[.7fr_1.3fr]">

          <div className="card bg-wine-700 p-7 text-white">
            <h2 className="font-display text-3xl font-bold">Let's talk</h2>

            <p className="mt-2 text-sm text-white/80">
              Connect with NeoCube Realty for property discovery and expert guidance.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <p className="flex gap-3">
                <MapPin /> Amravati, Maharashtra
              </p>

              <p className="flex gap-3">
                <Phone /> +91 98765 43210
              </p>

              <p className="flex gap-3">
                <Mail /> hello@neocuberealty.com
              </p>
            </div>
          </div>

          <div className="card p-6 md:p-8">

            {sent ? (
              <div className="rounded-xl bg-green-50 p-8 text-center text-green-800">
                <h2 className="font-display text-2xl font-bold">
                  ✓ Message sent
                </h2>

                <p className="mt-2 text-sm">
                  Thank you. Our team will contact you shortly.
                </p>
              </div>
            ) : (

              <form
                onSubmit={submit}
                className="grid gap-4 md:grid-cols-2"
              >

                <div>
                  <label className="field-label">Full Name</label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    className="field-control"
                  />
                </div>

                <div>
                  <label className="field-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="field-control"
                  />
                </div>

                <div>
                  <label className="field-label">Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="field-control"
                  />
                </div>

                <div>
                  <label className="field-label">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="field-control"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="field-label">Message</label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="field-control resize-y"
                  />
                </div>

                <div className="md:col-span-2">
                  <button className="btn-primary">
                    Send Message
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>
    </>
  )
}