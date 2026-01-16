import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Akten = React.lazy(() => import('./views/akten/Akten'))
const Aufgaben = React.lazy(() => import('./views/aufgaben/Aufgaben'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Hauptmenü', element: Dashboard },
  
  { path: '/akten', name: 'Akten', element: Akten},
  { path: '/aufgaben', name: 'Aufgaben', element: Aufgaben},
  { path: '/login', name: 'Login', element: Login},
  { path: '/register', name: 'Register', element: Register},

]

export default routes
