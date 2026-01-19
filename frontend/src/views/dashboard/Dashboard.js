import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CListGroup,
  CListGroupItem,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;
  const [activeCases, setActiveCases] = useState(0);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-history/historic-case-instances`)
    .then(res => res.json())
    .then(data => {
      if(!data.data || data.data.length === 0){
        return;
      }
      let casesCount = 0;
      let activeCasesCount = 0;

      data.data.forEach(caseInstance => {
        casesCount++;
        if(caseInstance.state === "active"){
          activeCasesCount++;
        }
      });
      setActiveCases(activeCasesCount);
      setTotalCases(casesCount);
    })
  }, []);
  
  return (
    <>
      <h1 style={{fontWeight: 'bold'}}>Hauptmenü</h1>
      <hr></hr>
      <CRow>
        <CCol xs={12}>
          <CCard className="test">
            <CCardHeader>
              Akten
            </CCardHeader>
            <CCardBody>
               <CRow>
                 <CCol xs={4}>
                  <CWidgetStatsB
                    className="mb-3"
                    title="Aktive Akten"
                    value={activeCases}
                    progress={{ color: 'success', value: (activeCases/totalCases)*100}}
                  />
                </CCol>
                <CCol xs={4}>
                  <CWidgetStatsB
                    className="activeCases"
                    title="Gesamte Akten"
                    value={totalCases}
                    progress={{ color: 'primary', value: 100}}
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}

export default Dashboard
