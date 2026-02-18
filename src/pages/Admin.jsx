import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../context/siteContentStore'
import { indianMedicalColleges } from '../data/indianMedicalColleges'
import {
  adminLogin,
  adminLogout,
  createDoctor,
  deleteDoctor,
  getApiHealth,
  getAdminSession,
  getDoctors,
  updateDoctor,
} from '../services/apiClient'

const pretty = (value) => JSON.stringify(value, null, 2)

const validateList = (value, requiredKeys) => {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => requiredKeys.every((key) => typeof item?.[key] === 'string'))
}

const validateInfoCards = (value) => {
  if (!Array.isArray(value)) {
    return false
  }

  return value.every((item) => typeof item?.icon === 'string' && typeof item?.title === 'string' && Number.isFinite(Number(item?.number)))
}

const validateDataCards = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.values(value).every(
    (list) => Array.isArray(list) && list.every((item) => typeof item?.title === 'string' && typeof item?.path === 'string'),
  )
}

const isValidUpiId = (value) => /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/i.test(String(value || '').trim())
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isValidRegistrationId = (value) => /^[A-Za-z0-9/-]{6,20}$/.test(value)

const emptyDoctorForm = {
  photo: '',
  registrationId: '',
  email: '',
  name: '',
  fatherName: '',
  nationality: '',
  dob: '',
  validUpto: '',
  ugUniversity: '',
  pgUniversity: '',
  degree: '',
  specialization: '',
  phone: '',
  practiceAddress: '',
}

const Admin = () => {
  const { siteContent, updateContent, resetContent } = useSiteContent()

  const [noticeBoardJson, setNoticeBoardJson] = useState('')
  const [leftButtonsJson, setLeftButtonsJson] = useState('')
  const [rightButtonsJson, setRightButtonsJson] = useState('')
  const [infoCardsJson, setInfoCardsJson] = useState('')
  const [dataCardsJson, setDataCardsJson] = useState('')
  const [infoCardsForm, setInfoCardsForm] = useState([])
  const [paymentUpiId, setPaymentUpiId] = useState('')
  const [paymentPayeeName, setPaymentPayeeName] = useState('')

  const [authLoading, setAuthLoading] = useState(true)
  const [apiReady, setApiReady] = useState(false)
  const [apiError, setApiError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [signupKey, setSignupKey] = useState('')
  const [password, setPassword] = useState('')

  const [doctors, setDoctors] = useState([])
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm)
  const [editDoctorRegistrationId, setEditDoctorRegistrationId] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })

  const textareas = useMemo(
    () => [
      {
        label: 'Notice Board Items',
        value: noticeBoardJson,
        setter: setNoticeBoardJson,
        help: 'Array of objects with: title, path',
      },
      {
        label: 'Left Quick Buttons',
        value: leftButtonsJson,
        setter: setLeftButtonsJson,
        help: 'Array of objects with: name, path',
      },
      {
        label: 'Right Quick Buttons',
        value: rightButtonsJson,
        setter: setRightButtonsJson,
        help: 'Array of objects with: name, path',
      },
      {
        label: 'Info Cards',
        value: infoCardsJson,
        setter: setInfoCardsJson,
        help: 'Array of objects with: icon, number, title',
      },
      {
        label: 'Data Cards',
        value: dataCardsJson,
        setter: setDataCardsJson,
        help: 'Object with section names as keys. Each key has an array of { title, path }',
      },
    ],
    [noticeBoardJson, leftButtonsJson, rightButtonsJson, infoCardsJson, dataCardsJson],
  )

  useEffect(() => {
    setNoticeBoardJson(pretty(siteContent.noticeBoard.board))
    setLeftButtonsJson(pretty(siteContent.noticeBoard.leftButtons))
    setRightButtonsJson(pretty(siteContent.noticeBoard.rightButtons))
    setInfoCardsJson(pretty(siteContent.infoCards))
    setInfoCardsForm(siteContent.infoCards || [])
    setDataCardsJson(pretty(siteContent.dataCards))
    setPaymentUpiId(siteContent.paymentSettings?.upiId || '')
    setPaymentPayeeName(siteContent.paymentSettings?.payeeName || '')
  }, [siteContent])

  const updateInfoCardsForm = (nextCards) => {
    setInfoCardsForm(nextCards)
    setInfoCardsJson(pretty(nextCards))
  }

  const handleInfoCardChange = (index, key, value) => {
    const nextCards = infoCardsForm.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item
      }
      if (key === 'number') {
        return { ...item, [key]: Number(value || 0) }
      }
      return { ...item, [key]: value }
    })
    updateInfoCardsForm(nextCards)
  }

  const handleAddInfoCard = () => {
    updateInfoCardsForm([
      ...infoCardsForm,
      { icon: 'UserCheck', number: 0, title: 'New info card' },
    ])
  }

  const handleRemoveInfoCard = (index) => {
    updateInfoCardsForm(infoCardsForm.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleLoadInfoCardsFromJson = () => {
    try {
      const parsed = JSON.parse(infoCardsJson)
      if (!validateInfoCards(parsed)) {
        throw new Error('Info Cards JSON is invalid.')
      }
      setInfoCardsForm(parsed)
      setStatus({ type: 'success', message: 'Info cards loaded from JSON editor.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Invalid Info Cards JSON.' })
    }
  }

  const loadDoctors = async () => {
    const response = await getDoctors()
    setDoctors((response.doctors || []).map((doctor) => ({ ...emptyDoctorForm, ...doctor })))
  }

  const checkApiAndSession = useCallback(async () => {
    try {
      await getApiHealth()
      setApiReady(true)
      setApiError('')

      const session = await getAdminSession()
      setIsAuthenticated(!!session.authenticated)
      if (session.authenticated) {
        await loadDoctors()
      }
    } catch (error) {
      setApiReady(false)
      setApiError(error.message || 'API check failed.')
      setIsAuthenticated(false)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  useEffect(() => {
    checkApiAndSession()
  }, [checkApiAndSession])

  const handleAdminLogin = async () => {
    if (!apiReady) {
      setStatus({ type: 'error', message: 'API is not ready. Fix API status first, then try login.' })
      return
    }

    const cleanSignupKey = signupKey.trim()
    const cleanPassword = password.trim()

    if (!cleanSignupKey || !cleanPassword) {
      setStatus({ type: 'error', message: 'Signup key and password are required.' })
      return
    }

    try {
      await adminLogin({ signupKey: cleanSignupKey, password: cleanPassword })
      setIsAuthenticated(true)
      setSignupKey('')
      setPassword('')
      await loadDoctors()
      setStatus({ type: 'success', message: 'Admin authenticated successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleAdminLogout = async () => {
    await adminLogout()
    setIsAuthenticated(false)
    setDoctors([])
    setDoctorForm(emptyDoctorForm)
    setEditDoctorRegistrationId(null)
    setStatus({ type: 'success', message: 'Logged out from admin session.' })
  }

  const handleSaveContent = () => {
    try {
      const board = JSON.parse(noticeBoardJson)
      const leftButtons = JSON.parse(leftButtonsJson)
      const rightButtons = JSON.parse(rightButtonsJson)
      const infoCards = JSON.parse(infoCardsJson)
      const dataCards = JSON.parse(dataCardsJson)

      if (!validateList(board, ['title', 'path'])) {
        throw new Error('Notice Board Items JSON is invalid. Use: [{ "title": "...", "path": "..." }]')
      }

      if (!validateList(leftButtons, ['name', 'path'])) {
        throw new Error('Left Quick Buttons JSON is invalid. Use: [{ "name": "...", "path": "..." }]')
      }

      if (!validateList(rightButtons, ['name', 'path'])) {
        throw new Error('Right Quick Buttons JSON is invalid. Use: [{ "name": "...", "path": "..." }]')
      }

      if (!validateInfoCards(infoCards)) {
        throw new Error('Info Cards JSON is invalid. Use: [{ "icon": "UserCheck", "number": 123, "title": "..." }]')
      }

      if (!validateDataCards(dataCards)) {
        throw new Error('Data Cards JSON is invalid. It must be an object of arrays with title/path pairs.')
      }

      const cleanUpiId = paymentUpiId.trim()
      const cleanPayeeName = paymentPayeeName.trim()

      if (!isValidUpiId(cleanUpiId)) {
        throw new Error('Payment UPI ID is invalid. Use a valid UPI format like name@bank.')
      }

      if (!cleanPayeeName) {
        throw new Error('Payment payee name is required.')
      }

      updateContent({
        ...siteContent,
        noticeBoard: {
          board,
          leftButtons,
          rightButtons,
        },
        infoCards,
        dataCards,
        paymentSettings: {
          upiId: cleanUpiId,
          payeeName: cleanPayeeName,
        },
      })

      setStatus({ type: 'success', message: 'Website content saved successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to parse JSON.' })
    }
  }

  const handleDoctorPhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please upload a valid image file for doctor photo.' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setDoctorForm((prev) => ({ ...prev, photo: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  const handleDoctorSubmit = async () => {
    const payload = {
      ...doctorForm,
      registrationId: doctorForm.registrationId.trim(),
      email: doctorForm.email.trim().toLowerCase(),
      name: doctorForm.name.trim(),
      fatherName: doctorForm.fatherName.trim(),
      nationality: doctorForm.nationality.trim(),
      dob: doctorForm.dob.trim(),
      validUpto: doctorForm.validUpto.trim(),
      ugUniversity: doctorForm.ugUniversity.trim(),
      pgUniversity: doctorForm.pgUniversity.trim(),
      degree: doctorForm.degree.trim(),
      specialization: doctorForm.specialization.trim(),
      phone: doctorForm.phone.trim(),
      practiceAddress: doctorForm.practiceAddress.trim(),
    }

    if (!payload.name || !payload.degree || !payload.registrationId || !payload.email) {
      setStatus({ type: 'error', message: 'Doctor Name, Degree, Registration ID, and Email are required.' })
      return
    }

    if (!isValidRegistrationId(payload.registrationId)) {
      setStatus({ type: 'error', message: 'Registration ID must be 6-20 characters and can include letters, numbers, / and -.' })
      return
    }

    if (!isValidEmail(payload.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid doctor email address.' })
      return
    }

    try {
      if (editDoctorRegistrationId) {
        const response = await updateDoctor(editDoctorRegistrationId, payload)
        if (Array.isArray(response?.doctors)) {
          setDoctors(response.doctors.map((doctor) => ({ ...emptyDoctorForm, ...doctor })))
        }
        setStatus({ type: 'success', message: 'Doctor updated successfully.' })
      } else {
        const response = await createDoctor(payload)
        if (Array.isArray(response?.doctors)) {
          setDoctors(response.doctors.map((doctor) => ({ ...emptyDoctorForm, ...doctor })))
        }
        setStatus({ type: 'success', message: 'Doctor added successfully.' })
      }

      setDoctorForm(emptyDoctorForm)
      setEditDoctorRegistrationId(null)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleDoctorEdit = (registrationId) => {
    const doctor = doctors.find((item) => item.registrationId === registrationId)
    if (!doctor) {
      return
    }

    setDoctorForm({ ...emptyDoctorForm, ...doctor })
    setEditDoctorRegistrationId(registrationId)
    setStatus({ type: '', message: '' })
  }

  const handleDoctorDelete = async (registrationId) => {
    try {
      const response = await deleteDoctor(registrationId)
      if (Array.isArray(response?.doctors)) {
        setDoctors(response.doctors.map((doctor) => ({ ...emptyDoctorForm, ...doctor })))
      }
      if (editDoctorRegistrationId === registrationId) {
        setDoctorForm(emptyDoctorForm)
        setEditDoctorRegistrationId(null)
      }
      setStatus({ type: 'success', message: 'Doctor removed successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleReset = () => {
    resetContent()
    setStatus({ type: 'success', message: 'Website content reset to default values.' })
  }

  if (authLoading) {
    return (
      <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
        <div className="mx-auto max-w-[600px] rounded-lg bg-white p-6 text-center text-[#2E2A21]">Checking admin session...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
        <div className="mx-auto max-w-[600px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
          <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Admin Secure Login</h1>
          <p className="pb-4 text-sm text-[#5C5543] sm:text-base">Use your private signup key and password to access the dashboard.</p>
          <p className="pb-2 text-xs text-[#6D6450] sm:text-sm">Credentials are case-sensitive. Do not include extra spaces before or after.</p>

          {!apiReady && apiError && (
            <div className="mb-4 rounded-md border border-[#A94D4D] bg-[#FFF3F3] px-4 py-3 text-sm font-medium text-[#7A2C2C] sm:text-base">
              API status: {apiError}
            </div>
          )}

          {status.message && (
            <div
              className={`mb-4 rounded-md border px-4 py-3 text-sm font-medium sm:text-base ${
                status.type === 'success'
                  ? 'border-[#3D7A4B] bg-[#ECF8EF] text-[#2D5C38]'
                  : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="grid gap-3">
            <input
              type="password"
              value={signupKey}
              onChange={(event) => setSignupKey(event.target.value)}
              placeholder="Signup key"
              className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
            />
            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={!apiReady}
              className="rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6F5312] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {apiReady ? 'Login to Admin' : 'API Not Ready'}
            </button>
            <button
              type="button"
              onClick={checkApiAndSession}
              className="rounded-md border border-[#886718] bg-white px-5 py-2.5 text-sm font-semibold text-[#886718] transition-colors duration-300 hover:bg-[#F3ECD8]"
            >
              Recheck API
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1300px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Admin Dashboard</h1>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="rounded-md border border-[#886718] bg-white px-4 py-2 text-sm font-semibold text-[#886718] transition-colors duration-300 hover:bg-[#F3ECD8]"
            >
              Logout
            </button>
          </div>

          <p className="text-sm text-[#5C5543] sm:text-base">
            Doctor records are secured through backend API. Website content below remains browser-stored unless you add server persistence for content too.
          </p>

          {status.message && (
            <div
              className={`rounded-md border px-4 py-3 text-sm font-medium sm:text-base ${
                status.type === 'success'
                  ? 'border-[#3D7A4B] bg-[#ECF8EF] text-[#2D5C38]'
                  : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'
              }`}
            >
              {status.message}
            </div>
          )}

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-[#2E2A21]">Doctor Records (Backend)</h2>
            <p className="pb-4 text-xs text-[#6D6450] sm:text-sm">
              These records are used by RMP login API to validate Registration ID + Email before OTP is sent.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="text" value={doctorForm.name} onChange={(event) => setDoctorForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Doctor name *" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="text" value={doctorForm.fatherName} onChange={(event) => setDoctorForm((prev) => ({ ...prev, fatherName: event.target.value }))} placeholder="Father's name" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="text" value={doctorForm.nationality} onChange={(event) => setDoctorForm((prev) => ({ ...prev, nationality: event.target.value }))} placeholder="Nationality" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="date" value={doctorForm.dob} onChange={(event) => setDoctorForm((prev) => ({ ...prev, dob: event.target.value }))} placeholder="Date of birth" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="date" value={doctorForm.validUpto} onChange={(event) => setDoctorForm((prev) => ({ ...prev, validUpto: event.target.value }))} placeholder="Valid upto" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input
                type="text"
                list="ug-universities"
                value={doctorForm.ugUniversity}
                onChange={(event) => setDoctorForm((prev) => ({ ...prev, ugUniversity: event.target.value }))}
                placeholder="UG University / College (India)"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
              />
              <input
                type="text"
                list="pg-universities"
                value={doctorForm.pgUniversity}
                onChange={(event) => setDoctorForm((prev) => ({ ...prev, pgUniversity: event.target.value }))}
                placeholder="PG University / College (India)"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
              />
              <input type="text" value={doctorForm.degree} onChange={(event) => setDoctorForm((prev) => ({ ...prev, degree: event.target.value }))} placeholder="Degree *" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="text" value={doctorForm.registrationId} onChange={(event) => setDoctorForm((prev) => ({ ...prev, registrationId: event.target.value }))} placeholder="Registration ID *" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="email" value={doctorForm.email} onChange={(event) => setDoctorForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Registered email *" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <datalist id="ug-universities">
                {indianMedicalColleges.map((college) => (
                  <option key={`ug-${college}`} value={college} />
                ))}
              </datalist>
              <datalist id="pg-universities">
                {indianMedicalColleges.map((college) => (
                  <option key={`pg-${college}`} value={college} />
                ))}
              </datalist>
              <input type="text" value={doctorForm.specialization} onChange={(event) => setDoctorForm((prev) => ({ ...prev, specialization: event.target.value }))} placeholder="Specialization" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="text" value={doctorForm.phone} onChange={(event) => setDoctorForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="text" value={doctorForm.practiceAddress} onChange={(event) => setDoctorForm((prev) => ({ ...prev, practiceAddress: event.target.value }))} placeholder="Practice address" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:col-span-2" />
              <input type="text" value={doctorForm.photo} onChange={(event) => setDoctorForm((prev) => ({ ...prev, photo: event.target.value }))} placeholder="Photo URL (optional)" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]" />
              <input type="file" accept="image/*" onChange={handleDoctorPhotoUpload} className="rounded-md border border-[#D8D0BF] px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-[#F3ECD8] file:px-3 file:py-1.5" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={handleDoctorSubmit} className="rounded-md bg-[#886718] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312]">
                {editDoctorRegistrationId ? 'Update Doctor' : 'Add Doctor'}
              </button>
              {editDoctorRegistrationId && (
                <button
                  type="button"
                  onClick={() => {
                    setDoctorForm(emptyDoctorForm)
                    setEditDoctorRegistrationId(null)
                  }}
                  className="rounded-md border border-[#886718] bg-white px-4 py-2 text-sm font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {doctors.map((doctor) => (
                <article key={`${doctor.registrationId}-${doctor.email}`} className="rounded-md border border-[#E6E2D8] bg-white p-3">
                  <div className="flex items-start gap-3">
                    <img src={doctor.photo || 'https://via.placeholder.com/90x90.png?text=Doctor'} alt={doctor.name} className="h-20 w-20 rounded-md border border-[#E6E2D8] object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#2E2A21] sm:text-base">{doctor.name}</h3>
                      <p className="text-xs text-[#6D6450] sm:text-sm">{doctor.degree}</p>
                      <p className="text-xs text-[#6D6450] sm:text-sm">ID: {doctor.registrationId}</p>
                      {doctor.fatherName && <p className="text-xs text-[#6D6450] sm:text-sm">Father: {doctor.fatherName}</p>}
                      {doctor.nationality && <p className="text-xs text-[#6D6450] sm:text-sm">Nationality: {doctor.nationality}</p>}
                      {doctor.dob && <p className="text-xs text-[#6D6450] sm:text-sm">DOB: {doctor.dob}</p>}
                      {doctor.validUpto && <p className="text-xs text-[#6D6450] sm:text-sm">Valid Upto: {doctor.validUpto}</p>}
                      {doctor.ugUniversity && <p className="text-xs text-[#6D6450] sm:text-sm">UG: {doctor.ugUniversity}</p>}
                      {doctor.pgUniversity && <p className="text-xs text-[#6D6450] sm:text-sm">PG: {doctor.pgUniversity}</p>}
                      <p className="break-all text-xs text-[#6D6450] sm:text-sm">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => handleDoctorEdit(doctor.registrationId)} className="rounded bg-[#F3ECD8] px-3 py-1.5 text-xs font-semibold text-[#6F5312]">Edit</button>
                    <button type="button" onClick={() => handleDoctorDelete(doctor.registrationId)} className="rounded bg-[#FFF0F0] px-3 py-1.5 text-xs font-semibold text-[#9A3434]">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-[#2E2A21]">Payment Settings</h2>
            <p className="pb-4 text-xs text-[#6D6450] sm:text-sm">
              Only admin can change these values. Online payment page uses this UPI configuration.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={paymentUpiId}
                onChange={(event) => setPaymentUpiId(event.target.value)}
                placeholder="UPI ID * (example: yourname@okhdfcbank)"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
              />
              <input
                type="text"
                value={paymentPayeeName}
                onChange={(event) => setPaymentPayeeName(event.target.value)}
                placeholder="Payee name *"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
              />
            </div>
          </section>

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-[#2E2A21]">Info Cards Quick Editor</h2>
              <button
                type="button"
                onClick={handleLoadInfoCardsFromJson}
                className="rounded-md border border-[#886718] bg-white px-3 py-1.5 text-xs font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8] sm:text-sm"
              >
                Load From JSON
              </button>
            </div>
            <p className="pb-4 text-xs text-[#6D6450] sm:text-sm">
              Edit homepage number cards here. Changes will also update Info Cards JSON.
            </p>

            <div className="grid gap-3">
              {infoCardsForm.map((card, index) => (
                <div key={`${card.title}-${index}`} className="grid grid-cols-1 gap-2 rounded-md border border-[#E6E2D8] bg-white p-3 md:grid-cols-[180px_160px_minmax(0,1fr)_100px]">
                  <input
                    type="text"
                    value={card.icon}
                    onChange={(event) => handleInfoCardChange(index, 'icon', event.target.value)}
                    placeholder="Icon"
                    className="rounded-md border border-[#D8D0BF] px-3 py-2 text-sm outline-none focus:border-[#886718]"
                  />
                  <input
                    type="number"
                    value={card.number}
                    onChange={(event) => handleInfoCardChange(index, 'number', event.target.value)}
                    placeholder="Number"
                    className="rounded-md border border-[#D8D0BF] px-3 py-2 text-sm outline-none focus:border-[#886718]"
                  />
                  <input
                    type="text"
                    value={card.title}
                    onChange={(event) => handleInfoCardChange(index, 'title', event.target.value)}
                    placeholder="Title"
                    className="rounded-md border border-[#D8D0BF] px-3 py-2 text-sm outline-none focus:border-[#886718]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInfoCard(index)}
                    className="rounded-md bg-[#FFF0F0] px-3 py-2 text-sm font-semibold text-[#9A3434]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={handleAddInfoCard}
                className="rounded-md bg-[#886718] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312]"
              >
                Add Info Card
              </button>
            </div>
          </section>

          <div className="grid gap-5">
            {textareas.map((item) => (
              <section key={item.label} className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
                <h2 className="text-base font-semibold text-[#2E2A21] sm:text-lg">{item.label}</h2>
                <p className="pb-3 text-xs text-[#6D6450] sm:text-sm">{item.help}</p>
                <textarea value={item.value} onChange={(event) => item.setter(event.target.value)} className="min-h-[180px] w-full rounded-md border border-[#D8D0BF] bg-white p-3 font-mono text-xs text-[#2E2A21] outline-none focus:border-[#886718] sm:text-sm" />
              </section>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSaveContent} className="rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6F5312] sm:text-base">
              Save Website Content
            </button>
            <button type="button" onClick={handleReset} className="rounded-md border border-[#886718] bg-white px-5 py-2.5 text-sm font-semibold text-[#886718] transition-colors duration-300 hover:bg-[#F3ECD8] sm:text-base">
              Reset Website Content
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Admin
