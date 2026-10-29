import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookOpen, Bell, CalendarDays, ChevronDown, CircleHelp, GraduationCap, LayoutDashboard, LogOut, Menu, Plus, Search, Settings2, Users, X, ArrowUpRight, Sparkles, Clock3, BookMarked, CircleCheck, LoaderCircle, Pencil, Trash2, Send, ArrowRight } from 'lucide-react'
import { api } from './api.js'

const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'exams', label: 'Exams', icon: CalendarDays },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]
const initials = (user) => user?.email?.slice(0, 1).toUpperCase() || 'A'
const date = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) => value ? new Date(value).toLocaleDateString(undefined, options) : '—'
const time = (value) => value ? new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''

function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('campus-user')) } catch { return null } })
  const [section, setSection] = useState('overview')
  const [data, setData] = useState({ courses: [], students: [], exams: [], notifications: [], users: [] })
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const refresh = useCallback(async () => {
    setLoading(true)
    const keys = ['courses', 'students', 'exams', 'notifications', 'users']
    const calls = [api.courses, api.students, api.exams, api.notifications, api.users]
    const results = await Promise.allSettled(calls.map((call) => call()))
    const next = {}
    const problems = []
    results.forEach((result, i) => {
      next[keys[i]] = result.status === 'fulfilled' ? result.value : []
      if (result.status === 'rejected') problems.push(`${keys[i]}: ${result.reason.message}`)
    })
    setData((previous) => ({ ...previous, ...next }))
    setError(problems.length === calls.length ? 'Services are not responding. Start the .NET APIs and refresh to load campus data.' : problems.length ? `Some services could not be reached — ${problems.join(' · ')}` : '')
    setLoading(false)
  }, [])
  useEffect(() => { if (user) refresh() }, [refresh, user])
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 3200); return () => clearTimeout(timer) } }, [notice])

  const saveUser = (value) => { setUser(value); localStorage.setItem('campus-user', JSON.stringify(value)); setModal(null); setNotice('You’re signed in. Welcome to Campus.') }
  const signOut = () => { setUser(null); localStorage.removeItem('campus-user'); setNotice('You’ve been signed out.') }
  const run = async (action, success) => { setBusy(true); setError(''); try { await action(); await refresh(); setNotice(success); setModal(null) } catch (e) { setError(e.message) } finally { setBusy(false) } }

  const title = sections.find((item) => item.id === section)?.label || 'Overview'
  const upcoming = useMemo(() => [...data.exams].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).slice(0, 4), [data.exams])
  const visibleCourses = data.courses.filter((course) => `${course.code} ${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase()))

  if (!user) return <AuthScreen mode={authMode} setMode={setAuthMode} busy={busy} error={error} onSubmit={(form) => run(async () => saveUser(authMode === 'login' ? await api.login(form) : await api.register(form)), '')} />

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); setSection('overview') }}><span className="brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span><span>campus<span className="brand-period">.</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="navigation">{sections.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${section === id ? 'active' : ''}`} onClick={() => { setSection(id); setMenuOpen(false) }}><Icon size={18} strokeWidth={1.9} /><span>{label}</span>{id === 'notifications' && data.notifications.filter((item) => !item.isRead).length > 0 && <span className="nav-count">{data.notifications.filter((item) => !item.isRead).length}</span>}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-note"><span className="note-icon"><Sparkles size={16} /></span><strong>A good day to learn</strong><p>Small steps, big possibilities.</p></div>
      <div className="sidebar-bottom"><button className="nav-item muted" onClick={() => setNotice('Your account settings are managed by your administrator.')}><Settings2 size={18} /><span>Settings</span></button><button className="nav-item muted" onClick={() => setNotice('Reach out to your university administrator for help.')}><CircleHelp size={18} /><span>Help & support</span></button><div className="profile-card"><div className="avatar">{initials(user)}</div><div className="profile-text"><strong>{user.email}</strong><span>{user.role || 'University member'}</span></div><button aria-label="Sign out" title="Sign out" className="icon-button sign-out" onClick={signOut}><LogOut size={16} /></button></div></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div></div><div className="topbar-actions"><span className="today-label"><CalendarDays size={15} />{date(new Date(), { weekday: 'short', month: 'short', day: 'numeric' })}</span><button className="top-avatar" onClick={signOut} title="Sign out">{initials(user)}</button></div></header>
      <div className="page-content">
        <div className="page-heading"><div><div className="eyebrow">YOUR UNIVERSITY, IN ONE PLACE</div><h1>{section === 'overview' ? <>A brighter kind of <span>campus.</span></> : title}</h1><p>{section === 'overview' ? 'A little progress each day adds up to big results.' : sectionCopy(section)}</p></div><div className="heading-actions">{section !== 'overview' && section !== 'students' && <button className="button button-primary" onClick={() => setModal(section === 'courses' ? 'course' : section === 'exams' ? 'exam' : 'notification')}><Plus size={17} />{section === 'courses' ? 'Add course' : section === 'exams' ? 'Schedule exam' : 'New notification'}</button>}{section === 'students' && <button className="button button-primary" onClick={() => setModal('student')}><Plus size={17} />Add student</button>}</div></div>
        {error && <div className="alert alert-error"><span>{error}</span><button onClick={refresh} className="alert-action">Try again</button><button onClick={() => setError('')} className="icon-button alert-close" aria-label="Dismiss"><X size={16} /></button></div>}
        {loading && <div className="loading-line"><LoaderCircle size={16} className="spin" /> Connecting to your university services…</div>}
        {!loading && section === 'overview' && <Overview data={data} upcoming={upcoming} setSection={setSection} setModal={setModal} />}
        {!loading && section === 'courses' && <Courses courses={visibleCourses} allCourses={data.courses} students={data.students} query={query} setQuery={setQuery} setModal={setModal} run={run} />}
        {!loading && section === 'students' && <Students students={data.students} query={query} setQuery={setQuery} setModal={setModal} />}
        {!loading && section === 'exams' && <Exams exams={data.exams} courses={data.courses} />}
        {!loading && section === 'notifications' && <Notifications notifications={data.notifications} users={data.users} setModal={setModal} />}
        <footer className="page-footer"><span>Made for the moments that move you forward.</span><span>Campus <span className="brand-period">●</span></span></footer>
      </div>
    </main>
    {modal && <Modal kind={modal} close={() => { setModal(null); setError('') }} data={data} busy={busy} onSubmit={(form) => run(async () => {
      if (modal === 'course') return form.id ? api.updateCourse(form.id, form.body) : api.createCourse(form.body)
      if (modal === 'student') return api.createStudent(form)
      if (modal === 'exam') return api.createExam(form)
      if (modal === 'notification') return api.createNotification(form)
      if (modal === 'enroll') return api.enroll(form.courseId, form.studentId)
    }, ({ course: 'Course saved successfully.', student: 'Student added successfully.', exam: 'Exam scheduled successfully.', notification: 'Notification sent successfully.', enroll: 'Student enrolled successfully.' })[modal])} />}
    {notice && <div className="toast"><CircleCheck size={17} />{notice}<button aria-label="Dismiss" className="toast-close" onClick={() => setNotice('')}><X size={15} /></button></div>}
  </div>
}

function sectionCopy(section) { return ({ courses: 'Explore the classes that make your campus.', students: 'Get to know the people who make up your community.', exams: 'Keep every important date in view.', notifications: 'A little clarity goes a long way.' })[section] }

function Overview({ data, upcoming, setSection, setModal }) {
  const statItems = [{ title: 'Active courses', value: data.courses.length, helper: 'Across your university', icon: BookOpen, color: 'lavender' }, { title: 'Students', value: data.students.length, helper: 'Growing together', icon: Users, color: 'mint' }, { title: 'Upcoming exams', value: upcoming.length, helper: 'On the calendar', icon: CalendarDays, color: 'peach' }, { title: 'Notifications', value: data.notifications.filter((x) => !x.isRead).length, helper: 'Waiting for you', icon: Bell, color: 'blue' }]
  return <div className="overview-layout"><div className="stats-grid">{statItems.map(({ title, value, helper, icon: Icon, color }) => <button className="stat-card" key={title} onClick={() => setSection(({ 'Active courses': 'courses', Students: 'students', 'Upcoming exams': 'exams', Notifications: 'notifications' })[title])}><div className={`stat-icon ${color}`}><Icon size={19} /></div><span className="stat-title">{title}</span><div className="stat-value">{value}<ArrowUpRight className="stat-arrow" size={16} /></div><span className="stat-helper">{helper}</span></button>)}</div>
    <div className="content-grid"><section className="panel courses-panel"><div className="panel-header"><div><div className="eyebrow">FIND YOUR NEXT FAVORITE</div><h2>Course spotlight</h2></div><button className="text-link" onClick={() => setSection('courses')}>All courses <ArrowRight size={15} /></button></div>{data.courses.length ? <div className="spotlight-list">{data.courses.slice(0, 3).map((course, i) => <div className="spotlight-row" key={course.id}><div className={`course-symbol symbol-${i % 4}`}><BookMarked size={19} /></div><div className="spotlight-info"><span className="course-code">{course.code}</span><strong>{course.title}</strong><span className="course-description">{course.description || `${course.credits} credit course`}</span></div><span className="credit-pill">{course.credits} credits</span></div>)}</div> : <Empty title="Your next chapter starts here." message="Add a course and watch your campus come to life." action="Add a course" onClick={() => setModal('course')} />}</section>
    <section className="panel exams-panel"><div className="panel-header"><div><div className="eyebrow">SAVE THE DATE</div><h2>Coming up</h2></div><button className="icon-button" aria-label="View all exams" onClick={() => setSection('exams')}><ArrowUpRight size={18} /></button></div>{upcoming.length ? <div className="upcoming-list">{upcoming.map((exam, i) => <div className="upcoming-row" key={exam.id}><div className={`date-tile tile-${i % 4}`}><span>{date(exam.scheduledAt, { month: 'short' }).toUpperCase()}</span><strong>{new Date(exam.scheduledAt).getDate()}</strong></div><div className="upcoming-info"><strong>{exam.title}</strong><span>{data.courses.find((course) => course.id === exam.courseId)?.title || `Course #${exam.courseId}`}</span><span className="exam-time"><Clock3 size={13} />{time(exam.scheduledAt)}</span></div></div>)}</div> : <Empty title="Room for something exciting." message="Your upcoming exams will appear here." action="Schedule an exam" onClick={() => setModal('exam')} />}</section></div>
    <div className="welcome-ribbon"><div className="ribbon-sparkle"><Sparkles size={22} /></div><div><strong>Great things happen, one class at a time.</strong><span>Your university journey is looking good.</span></div><button className="ribbon-action" onClick={() => setSection('courses')}>Explore courses <ArrowRight size={15} /></button><div className="ribbon-doodle">✳</div></div></div>
}

function Empty({ title, message, action, onClick }) { return <div className="empty-state"><span className="empty-icon"><BookOpen size={20} /></span><strong>{title}</strong><p>{message}</p>{onClick && <button className="button button-soft" onClick={onClick}><Plus size={15} />{action}</button>}</div> }
function SearchField({ value, onChange, placeholder }) { return <label className="search-field"><Search size={17} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /><kbd>⌘ K</kbd></label> }

function Courses({ courses, allCourses, students, query, setQuery, setModal, run }) {
  const [editing, setEditing] = useState(null)
  const [enrolling, setEnrolling] = useState(null)
  const [counts, setCounts] = useState({})
  useEffect(() => { let active = true; Promise.allSettled(allCourses.map((course) => api.enrollments(course.id))).then((results) => { if (active) setCounts(Object.fromEntries(results.map((r, i) => [allCourses[i].id, r.status === 'fulfilled' ? r.value.length : 0]))) }); return () => { active = false } }, [allCourses])
  return <><div className="list-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Search courses…" /><span className="result-count">{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span></div>{courses.length ? <div className="course-grid">{courses.map((course, i) => <article className="course-card" key={course.id}><div className="course-card-top"><div className={`course-symbol symbol-${i % 4}`}><BookOpen size={20} /></div><span className="code-tag">{course.code}</span><div className="card-menu"><button aria-label="Edit course" title="Edit course" className="icon-button" onClick={() => setEditing(course)}><Pencil size={15} /></button><button aria-label="Delete course" title="Delete course" className="icon-button danger-icon" onClick={() => { if (window.confirm(`Delete ${course.title}?`)) run(() => api.deleteCourse(course.id), 'Course deleted.') }}><Trash2 size={15} /></button></div></div><div className="course-card-body"><h3>{course.title}</h3><p>{course.description || 'A new opportunity to learn something wonderful.'}</p></div><div className="course-card-footer"><span className="course-meta"><BookMarked size={14} />{course.credits} credits</span><span className="course-meta"><Users size={14} />{counts[course.id] ?? '—'} enrolled</span><button className="enroll-link" onClick={() => setEnrolling(course)}>Enroll a student <ArrowRight size={14} /></button></div></article>)}</div> : <Empty title="No courses found just yet." message={query ? 'Try a different search, or start fresh with a new course.' : 'Your next great class is only a click away.'} action="Add a course" onClick={() => setModal('course')} />}
    {editing && <Modal kind="course" data={{ courses: [editing], students }} close={() => setEditing(null)} onSubmit={(form) => { run(() => api.updateCourse(editing.id, form.body), 'Course updated successfully.'); setEditing(null) }} busy={false} />}
    {enrolling && <Modal kind="enroll" data={{ courses: allCourses, students, selectedCourse: enrolling }} close={() => setEnrolling(null)} onSubmit={(form) => { run(() => api.enroll(form.courseId, form.studentId), 'Student enrolled successfully.'); setEnrolling(null) }} busy={false} />}</>
}

function Students({ students, query, setQuery, setModal }) {
  const [sort, setSort] = useState('name')
  const visible = [...students].filter((student) => `${student.firstName} ${student.lastName} ${student.email} ${student.studentNumber}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'number' ? a.studentNumber.localeCompare(b.studentNumber) : `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
  return <><div className="list-toolbar"><SearchField value={query} onChange={setQuery} placeholder="Find a student…" /><label className="sort-select"><span>Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="name">Name</option><option value="number">Student number</option></select><ChevronDown size={14} /></label><span className="result-count">{visible.length} {visible.length === 1 ? 'student' : 'students'}</span></div>{visible.length ? <div className="panel table-panel"><table><thead><tr><th>STUDENT</th><th>STUDENT NUMBER</th><th>EMAIL</th><th>PROFILE</th></tr></thead><tbody>{visible.map((student, i) => <tr key={student.id}><td><div className="table-person"><span className={`person-avatar person-${i % 5}`}>{student.firstName?.[0]}{student.lastName?.[0]}</span><strong>{student.firstName} {student.lastName}</strong></div></td><td><span className="code-tag">{student.studentNumber}</span></td><td className="muted-cell">{student.email}</td><td><span className="status-pill"><span />Enrolled</span></td></tr>)}</tbody></table></div> : <div className="panel"><Empty title="Every community starts somewhere." message={query ? 'No students match that search.' : 'Add your first student to start building yours.'} action="Add student" onClick={() => setModal('student')} /></div>}</>
}

function Exams({ exams, courses }) {
  const sorted = [...exams].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
  return sorted.length ? <div className="exam-list">{sorted.map((exam, i) => <article className="exam-card" key={exam.id}><div className={`date-tile tile-${i % 4}`}><span>{date(exam.scheduledAt, { month: 'short' }).toUpperCase()}</span><strong>{new Date(exam.scheduledAt).getDate()}</strong><small>{date(exam.scheduledAt, { weekday: 'short' })}</small></div><div className="exam-card-info"><span className="eyebrow">{courses.find((c) => c.id === exam.courseId)?.code || `COURSE #${exam.courseId}`}</span><h3>{exam.title}</h3><p>{courses.find((c) => c.id === exam.courseId)?.title || 'Course assessment'}</p></div><div className="exam-card-meta"><span><Clock3 size={15} />{time(exam.scheduledAt)}</span><span><CircleCheck size={15} />Maximum score: {exam.maxScore}</span></div></article>)}</div> : <div className="panel"><Empty title="A clear calendar feels good." message="When an exam is scheduled, you’ll find every detail here." /></div>
}

function Notifications({ notifications, users, setModal }) {
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return <><div className="notification-intro"><div className="notification-art"><Bell size={22} /></div><div><strong>Good communication makes a difference.</strong><p>Updates from your university, gathered in one place.</p></div><button className="button button-primary" onClick={() => setModal('notification')}><Send size={15} />New notification</button></div>{sorted.length ? <div className="panel notification-list">{sorted.map((item, i) => <article className="notification-row" key={item.id}><div className={`notification-dot dot-${i % 4}`}><Bell size={17} /></div><div className="notification-content"><div className="notification-title-row"><h3>{item.title}</h3>{!item.isRead && <span className="new-badge">NEW</span>}</div><p>{item.message}</p><span className="notification-meta">{users.find((u) => u.id === item.userId)?.email || `User #${item.userId}`} <span>·</span> {date(item.createdAt)} at {time(item.createdAt)}</span></div></article>)}</div> : <div className="panel"><Empty title="A quiet inbox, for now." message="University updates and announcements will show up here." action="Create a notification" onClick={() => setModal('notification')} /></div>}</>
}

function Modal({ kind, close, data, onSubmit, busy }) {
  const existing = kind === 'course' && data.courses?.length === 1 ? data.courses[0] : null
  const [form, setForm] = useState(existing ? { code: existing.code, title: existing.title, description: existing.description, credits: existing.credits, professorId: existing.professorId || '' } : kind === 'enroll' && data.selectedCourse ? { courseId: data.selectedCourse.id, studentId: '' } : { courseId: '', firstName: '', lastName: '', email: '', studentNumber: '', code: '', title: '', description: '', credits: 3, professorId: '', scheduledAt: '', maxScore: 100, userId: '', message: '' })
  const fields = {
    course: [['code', 'Course code', 'text', true], ['title', 'Course title', 'text', true], ['description', 'A short description', 'textarea'], ['credits', 'Credits', 'number', true], ['professorId', 'Professor ID', 'number']],
    student: [['firstName', 'First name', 'text', true], ['lastName', 'Last name', 'text', true], ['email', 'Email address', 'email', true], ['studentNumber', 'Student number', 'text', true]],
    exam: [['courseId', 'Course', 'select', true], ['title', 'Exam title', 'text', true], ['scheduledAt', 'Date and time', 'datetime-local', true], ['maxScore', 'Maximum score', 'number', true]],
    notification: [['userId', 'Send to', 'select-user', true], ['title', 'Notification title', 'text', true], ['message', 'Message', 'textarea', true]],
    enroll: [['courseId', 'Course', 'select', true], ['studentId', 'Student', 'select-student', true]],
  }[kind]
  const title = { course: existing ? 'A little course update' : 'Make room for a new course', student: 'Welcome someone new', exam: 'Save a date for success', notification: 'Share a campus update', enroll: 'Find the right class' }[kind]
  const helper = { course: 'Good things start with a great class.', student: 'Every great community starts with its people.', exam: 'The important dates deserve a little space.', notification: 'The right message can brighten someone’s day.', enroll: 'Let’s get a student into the right class.' }[kind]
  const change = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  const submit = (e) => { e.preventDefault(); if (kind === 'course') onSubmit({ id: existing?.id, body: { ...form, credits: Number(form.credits), professorId: form.professorId ? Number(form.professorId) : null } }); else if (kind === 'exam') onSubmit({ courseId: Number(form.courseId), title: form.title, scheduledAt: new Date(form.scheduledAt).toISOString(), maxScore: Number(form.maxScore) }); else if (kind === 'notification') onSubmit({ ...form, userId: Number(form.userId) }); else if (kind === 'enroll') onSubmit({ courseId: Number(form.courseId), studentId: Number(form.studentId) }); else onSubmit(form) }
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) close() }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="icon-button modal-close" onClick={close} aria-label="Close"><X size={19} /></button><div className="modal-icon"><Sparkles size={20} /></div><div className="eyebrow">A FEW LITTLE DETAILS</div><h2 id="modal-title">{title}</h2><p className="modal-subtitle">{helper}</p><form className="modal-form" onSubmit={submit}>{fields.map(([key, label, type, required]) => <label className="field" key={key}><span>{label}{required && <i> *</i>}</span>{type === 'textarea' ? <textarea required={required} maxLength={key === 'message' ? 2000 : 500} rows={key === 'message' ? 4 : 3} value={form[key]} onChange={(e) => change(key, e.target.value)} placeholder={key === 'description' ? 'What makes this class special?' : 'Write something thoughtful…'} /> : type === 'select' ? <select required value={form[key]} onChange={(e) => change(key, e.target.value)}><option value="">Choose a course…</option>{data.courses.map((course) => <option value={course.id} key={course.id}>{course.code} · {course.title}</option>)}</select> : type === 'select-student' ? <select required value={form[key]} onChange={(e) => change(key, e.target.value)}><option value="">Choose a student…</option>{data.students.map((student) => <option value={student.id} key={student.id}>{student.firstName} {student.lastName} · {student.studentNumber}</option>)}</select> : type === 'select-user' ? <select required value={form[key]} onChange={(e) => change(key, e.target.value)}><option value="">Choose a recipient…</option>{data.users.map((user) => <option value={user.id} key={user.id}>{user.email}</option>)}</select> : <input type={type} required={required} min={type === 'number' ? (key === 'credits' ? 1 : 1) : undefined} max={key === 'credits' ? 30 : undefined} value={form[key]} onChange={(e) => change(key, e.target.value)} placeholder={key === 'code' ? 'e.g. BIO 204' : key === 'title' ? 'Give it a memorable name' : ''} />}</label>)}<div className="modal-actions"><button type="button" className="button button-quiet" onClick={close}>Maybe later</button><button disabled={busy} className="button button-primary" type="submit">{busy ? <LoaderCircle size={16} className="spin" /> : kind === 'student' ? <Plus size={16} /> : kind === 'notification' ? <Send size={15} /> : <ArrowRight size={16} />}{kind === 'course' ? existing ? 'Save course' : 'Create course' : kind === 'student' ? 'Add student' : kind === 'exam' ? 'Schedule exam' : kind === 'notification' ? 'Send notification' : 'Enroll student'}</button></div></form></section></div>
}

function AuthScreen({ mode, setMode, onSubmit, busy, error }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const register = mode === 'register'
  return <main className="auth-screen"><div className="auth-decoration decoration-one" /><div className="auth-decoration decoration-two" /><a className="brand auth-brand"><span className="brand-mark"><GraduationCap size={21} /></span><span>campus<span className="brand-period">.</span></span></a><div className="auth-layout"><div className="auth-story"><div className="eyebrow">A PLACE TO BELONG AND BECOME</div><h1>Make space for<br />what’s <span>next.</span></h1><p>A university experience with a little more heart, and a lot more possibility.</p><div className="auth-illustration"><div className="illustration-book book-a" /><div className="illustration-book book-b" /><div className="illustration-book book-c" /><div className="illustration-sun">✳</div><span className="illustration-caption">your next chapter starts here</span></div><div className="auth-footnote"><span>✳</span> Made for curious minds and kind hearts.</div></div><section className="auth-card"><div className="auth-card-mark"><GraduationCap size={19} /></div><div className="eyebrow">WELCOME TO YOUR CAMPUS</div><h2>{register ? 'Begin your story.' : 'Lovely to see you.'}</h2><p>{register ? 'Create an account and find your place here.' : 'Sign in and pick up where you left off.'}</p>{error && <div className="alert alert-error auth-error">{error}</div>}<form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}><label className="field"><span>Email address</span><input autoComplete="email" required type="email" placeholder="you@university.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="field"><span>Password</span><input autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 6 : undefined} type="password" placeholder={register ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="button button-primary auth-submit" disabled={busy}>{busy ? <LoaderCircle size={17} className="spin" /> : null}{register ? 'Create your account' : 'Sign in to Campus'}<ArrowRight size={17} /></button></form><div className="auth-switch">{register ? 'Already part of Campus?' : 'New around here?'} <button onClick={() => setMode(register ? 'login' : 'register')}>{register ? 'Sign in' : 'Create an account'}</button></div><div className="auth-policy">A little space to grow, learn and belong.</div></section></div></main>
}

export default App
