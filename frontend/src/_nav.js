import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilFolder,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Hauptmenü',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Komponente',
  },
  {
    component: CNavItem,
    name: 'Akten',
    to: '/akten',
    icon: <CIcon icon={cilFolder} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Aufgaben',
    to: '/aufgaben',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
]

export default _nav
