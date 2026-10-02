import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/neocube-logo.png'

export default function Auth({ register = false }) {
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [otp, setOtp] = useState('')

  const submit = async e => {
    e.preventDefault()
    setError('')

    const data = new FormData(e.currentTarget)

    // REGISTER
    if (register) {

      if (data.get('password') !== data.get('confirmPassword')) {
        setError('Passwords do not match.')
        return
      }

      // Phone must contain exactly 10 digits
      const phone = data.get('phone')

      if (!/^\d{10}$/.test(phone)) {
        setError('Phone number must contain exactly 10 digits.')
        return
      }

      try {
        const response = await fetch(
          'http://localhost:8080/api/auth/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fullName: data.get('name'),
              email: data.get('email'),
              phone: phone,
              passwordHash: data.get('password')
            })
          }
        )

        if (!response.ok) {
          throw new Error('Registration failed')
        }

        // Remember email for OTP verification
        setRegisteredEmail(data.get('email'))

        // Show OTP screen
        setOtpStep(true)

      } catch (err) {
        setError(
          'Registration failed. This email may already be registered.'
        )
      }

      return
    }

    // LOGIN
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password')
          })
        }
      )

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const customer = await response.json()

      localStorage.setItem('neoLoggedIn', 'true')

      localStorage.setItem(
        'neoUser',
        JSON.stringify({
          id: customer.customerId,
          name: customer.fullName,
          email: customer.email
        })
      )

      navigate('/dashboard')

    } catch (err) {
      setError(
        'Invalid email or password, or your email is not verified.'
      )
    }
  }

  // VERIFY OTP
  const verifyOtp = async e => {
    e.preventDefault()
    setError('')

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/verify-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: registeredEmail,
            otp: otp
          })
        }
      )

      if (!response.ok) {
        throw new Error('OTP verification failed')
      }

      // Verification successful
      navigate('/login')

    } catch (err) {
      setError('Invalid or expired OTP. Please try again.')
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-76px)] place-items-center bg-gradient-to-br from-cream to-wine-50 px-4 py-12">

      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-soft md:p-9">

        <img
          src={logo}
          alt="NeoCube Realty"
          className="mx-auto h-14 w-auto"
        />

        {/* OTP SCREEN */}

        {register && otpStep ? (
          <>
            <h1 className="mt-5 text-center font-display text-3xl font-bold">
              Verify your email
            </h1>

            <p className="mt-2 text-center text-sm text-gray-500">
              We sent a 6-digit OTP to
              <span className="block font-semibold text-gray-700">
                {registeredEmail}
              </span>
            </p>

            <form
              onSubmit={verifyOtp}
              className="mt-7 space-y-4"
            >
              <div>
                <label className="field-label">
                  Verification OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={e =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                    )
                  }
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  required
                  className="field-control text-center text-lg tracking-widest"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </p>
              )}

              <button className="btn-primary w-full">
                Verify Email
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-gray-500">
              The OTP will expire in 10 minutes.
            </p>
          </>
        ) : (
          <>
            {/* LOGIN / REGISTER SCREEN */}

            <h1 className="mt-5 text-center font-display text-3xl font-bold">
              {register
                ? 'Create your account'
                : 'Welcome back'}
            </h1>

            <p className="mt-2 text-center text-sm text-gray-500">
              {register
                ? 'Join NeoCube Realty and manage your property journey.'
                : 'Login to manage your inquiries, visits and favorites.'}
            </p>

            <form
              onSubmit={submit}
              className="mt-7 space-y-4"
            >

              {register && (
                <div>
                  <label className="field-label">
                    Full Name
                  </label>

                  <input
                    name="name"
                    required
                    className="field-control"
                  />
                </div>
              )}

              <div>
                <label className="field-label">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  required
                  className="field-control"
                />
              </div>

              {register && (
                <div>
                  <label className="field-label">
                    Phone
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    required
                    className="field-control"
                  />
                </div>
              )}

              <div>
                <label className="field-label">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  required
                  className="field-control"
                />
              </div>

              {register && (
                <div>
                  <label className="field-label">
                    Confirm Password
                  </label>

                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="field-control"
                  />
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </p>
              )}

              <button className="btn-primary w-full">
                {register ? 'Register' : 'Login'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              {register
                ? 'Already have an account?'
                : 'Don’t have an account?'}

              {' '}

              <Link
                className="font-bold text-wine-700"
                to={register ? '/login' : '/register'}
              >
                {register ? 'Login' : 'Register'}
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  )
}