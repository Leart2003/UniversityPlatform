const base = {
  auth: import.meta.env.VITE_AUTH_API || 'http://localhost:5009',
  students: import.meta.env.VITE_STUDENT_API || 'http://localhost:5073',
  courses: import.meta.env.VITE_COURSE_API || 'http://localhost:5174',
  exams: import.meta.env.VITE_EXAM_API || 'http://localhost:5171',
  notifications: import.meta.env.VITE_NOTIFICATION_API || 'http://localhost:5203',
}

export async function request(service, path, options = {}) {
  let response
  try {
    response = await fetch(`${base[service]}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(12000),
      headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error(`${service} service timed out. Check that its database is reachable.`)
    }
    throw new Error(`${service} service is unavailable. Check that it is running and its URL is configured.`)
  }
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try { const data = await response.json(); message = data.message || data.title || message } catch { /* use status */ }
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  login: (body) => request('auth', '/api/auth/login', { method: 'POST', body }),
  register: (body) => request('auth', '/api/auth/register', { method: 'POST', body }),
  users: () => request('auth', '/api/auth/users'),
  students: () => request('students', '/api/students'),
  createStudent: (body) => request('students', '/api/students', { method: 'POST', body }),
  courses: () => request('courses', '/api/courses'),
  createCourse: (body) => request('courses', '/api/courses', { method: 'POST', body }),
  updateCourse: (id, body) => request('courses', `/api/courses/${id}`, { method: 'PUT', body }),
  deleteCourse: (id) => request('courses', `/api/courses/${id}`, { method: 'DELETE' }),
  enroll: (id, studentId) => request('courses', `/api/courses/${id}/enrollments`, { method: 'POST', body: { studentId: Number(studentId) } }),
  enrollments: (id) => request('courses', `/api/courses/${id}/enrollments`),
  exams: () => request('exams', '/api/exams'),
  createExam: (body) => request('exams', '/api/exams', { method: 'POST', body }),
  notifications: () => request('notifications', '/api/notifications'),
  createNotification: (body) => request('notifications', '/api/notifications', { method: 'POST', body }),
}
