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
  const [activeCases, setActiveCases] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [caseItems, setCaseItems] = useState([]);

  useEffect(() => {
    fetch("http://87.106.4.236:3001/api/cmmn-api/cmmn-history/historic-case-instances")
    .then(res => res.json())
    .then(data => {
      if(!data.data || data.data.length === 0){
        return;
      }

      let casesCount = 0;
      let activeCasesCount = 0;
      const items = [];

      data.data.forEach(caseInstance => {
        casesCount++;
        if(caseInstance.state === "active"){
          activeCasesCount++;
        }
        const creationDate = new Date(caseInstance.startTime);
        
        items.push({
          id: casesCount,
          internalId: caseInstance.id,
          name: caseInstance.name,
          createdBy: caseInstance.startUserId,
          createdOn: creationDate.toLocaleDateString('de-DE'),
          state: caseInstance.state,
        });
      });
      setActiveCases(activeCasesCount);
      setTotalCases(casesCount);
      setCaseItems(items);
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
              <CRow>
                <CCol xs={12}>
                  <CAccordion>
                    {caseItems.map(c => (
                    <CAccordionItem key={c.id} itemKey={c.id} style={c.state === "terminated" ? { color: "#b8b8b8"} : {}}>
                      <CAccordionHeader>{c.name}</CAccordionHeader>
                      <CAccordionBody>
                        <p>Akte erstellt am: {c.createdOn}<br></br>von: {c.createdBy}</p>              
                        {c.state !== "terminated" && (
                          <>
                          <CButton color="primary" style={{marginRight: 5}}>Akte verwalten</CButton>
                          <CButton color="danger">Akte beenden</CButton>
                          </>
                        )}
                      </CAccordionBody>
                    </CAccordionItem>
                    ))}
                  </CAccordion>
                </CCol>
              </CRow>
              <CRow style={{marginTop: 15}}>
                <CCol xs={2}>
                  <CButton color="primary">Akte erstellen</CButton>
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
