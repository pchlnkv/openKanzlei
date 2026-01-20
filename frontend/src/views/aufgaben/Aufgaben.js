import React, { useEffect, useMemo, useState } from 'react'
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
  CTab,
  CTabs,
  CTabList,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
  CTabContent,
  CTabPanel,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCardLink,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormInput,
  CFormCheck,
  CToast,
  CToaster,
  CToastBody,
  CToastClose,
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

import { IMaskMixin } from 'react-imask';
import { DatePicker, registerLocale, setDefaultLocale } from 'react-datepicker';
import { de } from 'date-fns/locale/de';
registerLocale('de',de);
import "react-datepicker/dist/react-datepicker.css";

import { useImportCases } from '../../components/useImportCases'
import { useImportAufgaben } from '../../components/useImportAufgaben'




const Aufgaben = () => {
  const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;

  const { cases, refreshCases } = useImportCases();
  const { aufgaben, refreshAufgaben, aufgabenLoading } = useImportAufgaben();

  const [loading, setLoading] = useState(false);

  const [aufgabeCreationModal, setAufgabeCreationModal] = useState(false);
  const [aCForm, setaCForm] = useState({
    faelligkeitCheck: { value: '', checked: false }
  });

  const [startDate, setStartDate] = useState(new Date());

  const [faelligkeitsDatum, setFaelligekeitsDatum] = useState(false);

  const [toast, setToast] = useState(null);

  const [aufgabeModal, setAufgabeModal] = useState(false);

  const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
    <CFormInput {...props} ref={inputRef} />
  ))

  const onChange = (e) => {
      const { name, value, checked } = e.target;
      setaCForm((prev) => ({...prev, [name]: { value, checked }}))
      console.log(name);
      console.log(value);
      console.log(checked);
  }

  const toaster = useMemo(
    () => (
        <CToaster placement="top-end" push={toast}/>
    ),
    [toast]
  );

  const showToast = ({message, color = "secondary"}) => {
      setToast(
      <CToast color={color} autohide={true} delay={3000} className="text-white align-items-center" style={{margin:20}}>
              <div className="d-flex">
                  <CToastBody>{message}</CToastBody>
                  <CToastClose className="me-2 m-auto"/>
              </div>
      </CToast>
      );
  };

  const cAFormSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true);
    try{
      const selectedInternalId = aufgabenTypes.find(i => i.key === Number(aCForm.aufgabe.value))?.internalId;
      const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances/${selectedInternalId}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "start"
          }),
        });   

        const dateValue = aCForm.faelligkeitCheck.checked ? startDate.toLocaleDateString('de-DE') : null;
        
      const varResponse = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances/${selectedInternalId}/variables`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            [
              {
                name: "aufgabeStatus",
                type: "string",
                value: "bevorstehend"
              },
              {
                name: "faelligkeit",
                type: "string",
                value: dateValue
              }
            ]
          ),
        }); 

       if(!response.ok || !varResponse.ok){
        throw new Error(
            response.status
        );
      }
      showToast({
        message: "Aufgabe wurde erfolgreich erstellt.",
        color: "success"
      })
    } catch(error) {
      console.error(error);
      showToast({
        message: "Aufgabe konnte nicht erstellt werden.",
        color: "danger"
      })
    } finally {
      setLoading(false);
      setAufgabeCreationModal(false);
    }
  }

  const [aufgabenTypes, setAufgabenTypes] = useState([]);
  const [aTDisabled, setaTDisabled] = useState(true);
  const updateAufgabenTypes = async (e) => {
    try{
      let key = 0;
      const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances?planItemDefinitionType=stage&state=enabled&caseInstanceId=${e.target.value}`);
      const json = await response.json();
      const items = [];
      json.data.forEach(stageInstance => {
        key++;
        items.push({key: key, internalId: stageInstance.id, value: stageInstance.name});
      })
      setAufgabenTypes(items);
      if(items.length === 0) setaTDisabled(true);
      else setaTDisabled(false);
    } catch(error) {
      setaTDisabled(true);
      console.error(error);
    } 
  }

  const [selectedAufgabeState, setSelectedAufgabeState] = useState("");
  const updateAufgabeStatus = async({planItemId, state}) => {
    setLoading(true);
    try{
      const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances/${planItemId}/variables`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            [
              {
                name: "aufgabeStatus",
                type: "string",
                value: state
              }
            ]
          ),
        }); 

        if(!response.ok){
          throw new Error(
            response.status
          );
        }
        showToast({
          message: "Aufgabe wurde erfolgreich aktualisiert.",
          color: "secondary"
        })
        setAufgabeModal(false);
    } catch(error) {
      showToast({
        message: "Ein Fehler ist aufgetreten.",
        color: "danger"
      })
    } finally {
      setLoading(false);
    }
  }

  const [unteraufgaben, setUnteraufgaben] = useState([]);
  const [selectedAufgabe, setSelectedAufgabe] = useState([]);
  const getUnteraufgaben = async ({planItemId}) => {
    try {
      let key = 0;
      const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances?planItemDefinitionType=task&stageInstanceId=${planItemId}`)
      const json = await response.json();
      const items = [];
      json.data.forEach(aufgabe => {
        key++;
        items.push({key: key, internalId: aufgabe.id, name: aufgabe.name})
      })
      setUnteraufgaben(items);
      setAufgabeModal(true);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(aufgabenLoading) return;
    refreshCases();
    refreshAufgaben();
  }, [loading]);
  
return (
    <>
    {toaster}
      <h1 style={{fontWeight: 'bold'}}>Aufgaben</h1>
      <hr/>
      <CRow>
        <CCol xs={12}>
          <CButton color="primary" onClick={() => setAufgabeCreationModal(true)}>neue Aufgabe</CButton>
        </CCol>
      </CRow>
      <CRow style={{marginTop: 10}}>
        <CCol>
          <CTabs defaultActiveItemKey="bevorstehend">
            <CTabList variant="tabs">
              <CTab itemKey="nichtAngefangen">nicht angefangen</CTab>
              <CTab itemKey="bevorstehend">bevorstehend</CTab>
              <CTab itemKey="heuteFaellig">heute fällig</CTab>
              <CTab itemKey="waAntwort">warte auf Antwort</CTab>
              <CTab itemKey="erledigt">erledigt</CTab>
            </CTabList>
            <CTabContent className="bg-body border border-top-0 p-3 rounded-bottom">
              {aufgaben.map(tab => (
                <CTabPanel className="p-3" itemKey={tab.key} key={tab.key}>
                <CRow>
                  {tab.cards.map(a => (
                    <CCol xs={12} md={6} lg={4} xxl={3} style={{marginBottom: 10}} key={a.id}>
                    <CCard textColor="#000" className="mb-3 border-secondary">
                        <CCardBody>
                          <CCardTitle><CCardLink className="text-body" href="//#"                         
                            onClick={(e) => {e.preventDefault();  
                            getUnteraufgaben({planItemId: a.internalId}); 
                            setSelectedAufgabe({id: a.internalId, name: a.name, caseName: a.case, state: a.state, createdOn: a.createdOn}); setSelectedAufgabeState(a.state);}}
                            >{a.name}</CCardLink></CCardTitle>                             
                          <CCardSubtitle className="mb-2 text-body-secondary"><CCardLink className="text-secondary" href="//#" onClick={(e) => e.preventDefault()}>Akte {a.case}</CCardLink></CCardSubtitle>  
                          <CCardText>zugewiesen zu Name Nachname</CCardText>
                          <CCardText><CCardText className="text-body-secondary">letzte Notiz: </CCardText>Mandant sammelt Dokumente etc.</CCardText>
                            { a.faelligkeit != undefined && <CCardFooter><CCardText>fällig am: {a.faelligkeit}</CCardText></CCardFooter>}
                        </CCardBody>
                    </CCard>
                  </CCol>
                  ))}
                  
                </CRow>
              </CTabPanel>
              ))}
              
            </CTabContent>
          </CTabs>
        </CCol>
      </CRow>

      <CModal size="lg" visible={aufgabeCreationModal} onClose={() => setAufgabeCreationModal(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Aufgabe erstellen</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={cAFormSubmit}>
            <CFormSelect label="Akte auswählen" name="akte" className="mb-3" onChange={(e) => {onChange(e); updateAufgabenTypes(e);}}>
              <option value="">Akte auswählen</option>
              {cases.find(item => item.key === "aktiv")?.cards.map(card => (
                <option key={card.id} value={card.internalId}>{card.name}</option>
              ))}
            </CFormSelect>
            <CFormSelect label="Aufgabentyp auswählen" name="aufgabe" className="mb-3" onChange={onChange} disabled={aTDisabled}>
              <option value="">Aufgabentyp auswählen</option>
              {aufgabenTypes.map(a => (
                <option key={a.key} value={a.key}>
                  {a.value}
                </option>
              ))}
            </CFormSelect>
            <CCol>
              <div className="d-flex">
                <CFormCheck 
                  value="" 
                  name="faelligkeitCheck" 
                  onChange={(e) => {setFaelligekeitsDatum(e.target.checked); onChange(e);}}
                  checked={faelligkeitsDatum} 
                  style={{marginRight: 10}}/>
                <DatePicker 
                  name="faelligkeitDate"
                  selected={startDate} 
                  startDate={startDate} 
                  onChange={(date) => {setStartDate(date)}} 
                  locale="de" dateFormat="dd.MM.YYYY" 
                  customInput={<CFormInput label="Fälligkeitsdatum"/>}
                  className="mb-3"
                  disabled={!faelligkeitsDatum}/> 
              </div>
            </CCol>

            <CModalFooter className="p-0 pt-5">
              <CButton color="primary" disabled={loading} type="submit">Aufgabe erstellen</CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>

      <CModal size="lg" alignment="center" visible={aufgabeModal} onClose={() => setAufgabeModal(false)}>
        <CModalHeader>
          <CModalTitle>Aufgabe verwalten</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h3>{selectedAufgabe.name}</h3>
          <CCardSubtitle className="text-body-secondary" style={{marginTop: -10}}>erstellt am {selectedAufgabe.createdOn}</CCardSubtitle>
          <br/>
          <h6>Status: {selectedAufgabe.state}</h6>
          <br/>
          <CRow className="mb-3">
            <CCol xs={10}>
              {unteraufgaben.map(ua => (
                <CButton color="primary" className="m-1">{ua.name}</CButton>               
              ))}

            </CCol>
          </CRow>
          <CFormSelect label="Status ändern" name="status" className="mb-3" onChange={(e) => setSelectedAufgabeState(e.target.value)} value={selectedAufgabeState}>
            <option value="nichtAngefangen">nicht Angefangen</option>
            <option>bevorstehend</option>
            <option value="heuteFaellig">heute fällig</option>
            <option value="waAntwort">warte auf Antwort</option>
            <option>erledigt</option>
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" disabled={loading}>Aufgabe löschen</CButton>
          <div className="ms-auto">
              <CButton color="primary" onClick={() => updateAufgabeStatus({planItemId: selectedAufgabe.id, state: selectedAufgabeState})} disabled={loading}>Speichern</CButton>                            
          </div>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Aufgaben