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
  CNav,
  CNavLink,
  CListGroup,
  CListGroupItem,
  CNavItem,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
  CTabContent,
  CTabPane,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CTabs,
  CTab,
  CTabList,
  CTabPanel,
  CCardLink,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CModalFooter,
  CForm,
  CFormSelect,
  CToast,
  CToastHeader,
  CToastBody,
  CToastClose,
  CToaster,
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
  cilDelete,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import { right } from '@popperjs/core'
import { Button } from '@coreui/coreui'

import { useImportCases } from '../../components/useImportCases'

const Akten = () => {

    const[modalVisible, setModalVisible] = useState(false);
    const[selectedCase, setSelectedCase] = useState(null);

    const[creationModalVisible, setCreationModalVisible] = useState(false);

    const { cases, refreshCases } = useImportCases();

    const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;

    const[cCform, setcCForm] = useState({
        name: "",
        state: "aktiv"
    });
    const[toast, setToast] = useState(null);

    const[loading, setLoading] = useState(false);
    
    const toaster =  useMemo(
        () => (
            <CToaster placement="top-end" push={toast}/>
        ),
        [toast]
    );

    const onChange = (e) => {
        const { name, value } = e.target;
        setcCForm((prev) => ({...prev, [name]: value}))
    }

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

    const cCFormSubmit = async (e) => {
        e.preventDefault();

        if(loading) return;
        setLoading(true);
        try{
            const body = 
            {
                caseDefinitionKey: "akte",
                name: cCform.name.trim(),
                variables: [
                    {
                        name: "caseStatus",
                        type: "string",
                        value: cCform.state
                    },
                    {
                        name: "initiator",
                        type: "string",
                        value: "Rechtsanwalt Fischer"
                    }
                ]
            };
            const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/case-instances`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if(response.status !== 201){
                throw new Error(
                    response.status
                ); 
            }
            showToast({
                message: "Akte wurde erfolgreich erstellt.",
                color: "success"
            })
        } catch(error) {
            console.error(error);
            showToast({
                message: "Akte konnte nicht erstellt werden.",
                color: "danger"
            });
        } finally {
            setLoading(false);
            setCreationModalVisible(false);
        }
    };

    const updateCaseStatus = async (caseState) => {
        if(loading) return;
        setLoading(true);
        try{
        const response = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/case-instances/${selectedCase.internalId}/variables/caseStatus`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify ({
                name: "caseStatus",
                type: "string",
                value: caseState
            }),
        });

        if(response.status !== 200){
            throw new Error(
                response.status
            );
        }

        setSelectedCase(prev => ({
            ...prev,
            state: caseState,
        }));

        showToast({
            message: caseState === "aktiv" ? "Akte wurde erfolgreich aktiviert." : "Akte wurde erfolgreich archiviert.",
            color: caseState === "aktiv" ? "success" : "secondary"
        })
        } catch(error) {
            console.error(error);
            showToast({
                message: "Akte konnte nicht archiviert werden.",
                color: "danger"
            })
        } finally {
            setLoading(false);
        }
    
    }  
    
    useEffect(() => {
        refreshCases();

    }, [loading])

    return (
        <>
        {toaster}
            <h1 style={{fontWeight: 'bold'}}>Akten</h1>
            <hr></hr>
            <CRow>
                <CCol xs={12}>
                    <CButton color="primary" onClick={() => setCreationModalVisible(true)}>Akte erstellen</CButton>
                </CCol>
            </CRow>
            <CRow style={{marginTop: 10}}>
                <CCol>
                    <CTabs defaultActiveItemKey="aktiv">
                        <CTabList variant="tabs">
                            <CTab itemKey="aktiv">aktive Akten</CTab>
                            <CTab itemKey="archiv">Archiv</CTab>
                        </CTabList>
                        <CTabContent className="bg-body border border-top-0 p-3 rounded-bottom">
                        {cases.map(tab => (
                            <CTabPanel className="p-3" itemKey={tab.key} key={tab.key}>
                                <CRow>
                                    {tab.cards.map(c => (
                                    <CCol xs={12} md={6} lg={4} xxl={3} key={c.id} style={{marginBottom: 10}}>
                                        <CCard>
                                            <CCardBody>
                                                <CCardTitle className="text-body">{c.name}</CCardTitle>                             
                                                <CCardSubtitle className="mb-2 text-body-secondary">erstellt am {c.createdOn}</CCardSubtitle>   
                                                <CCardLink href="//#" onClick={(e) => {setModalVisible(true); setSelectedCase(c); e.preventDefault();}}>Akte verwalten</CCardLink>
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

            <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)} alignment="center">
                <CModalHeader>
                    <CModalTitle>Akte verwalten</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedCase && (
                    <>
                        <h3>{selectedCase.name}</h3>
                        <CCardSubtitle className="text-body-secondary" style={{marginTop: -10}}>erstellt am {selectedCase.createdOn} von {selectedCase.createdBy}</CCardSubtitle>
                        <br/>
                        <h6>Status: {selectedCase.state}</h6>
                        <br/>
                        <CRow>
                            <CCol xs={10}>
                                <CButton color="primary">E-Mail schreiben</CButton>
                            </CCol>
                        </CRow>
                        <br/>
                        <h6>Dokumente</h6>
                        <CCard href="//#">
                            <CCardBody>
                            <CRow>
                                <CCol>
                                    <CCardTitle>Datei.pdf</CCardTitle>
                                    <CCardSubtitle className="text-body-secondary">700kB</CCardSubtitle>
                                </CCol>
                                <CCol></CCol>
                                <CCol>
                                    <CButton color="danger"><CIcon icon={cilDelete}></CIcon></CButton>
                                </CCol>
                            </CRow>
                            </CCardBody>
                        </CCard>
                        <CModalFooter className="p-0 pt-5">
                            <CButton color="danger" onClick={() => setModalVisible(false)}>Akte löschen</CButton>
                            {selectedCase.state === "aktiv" ? (
                                <CButton color="secondary" onClick={() => updateCaseStatus("archiv")} disabled={loading}>Akte archivieren</CButton>
                            ) : (
                                <CButton color="success" onClick={() => updateCaseStatus("aktiv")} disabled={loading}>Akte aktivieren</CButton>
                            )}
                            <div className="ms-auto">
                                <CButton color="primary" onClick={() => setModalVisible(false)}>Speichern</CButton>                            
                            </div>
                        </CModalFooter> 
                    </>
                    )}
                    
                </CModalBody>
            </CModal>

            <CModal size="lg" visible={creationModalVisible} onClose={() => setCreationModalVisible(false)} alignment="center">
                <CModalHeader>
                    <CModalTitle>Akte erstellen</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={cCFormSubmit}>
                        <CFormInput type="text" label="Name der Akte" name="name" onChange={onChange}/>
                        <br/>
                        <CFormInput type="file" label="Dokumente hochladen" multiple onChange={onChange}/>
                        <br/>
                        <CFormSelect onChange={onChange} options={[ 
                            { label: "aktive Akte", value: "aktiv"},
                            { label: "archivierte Akte", value: "archiv"},
                        ]} label="Status auswählen" name="state"/>
                    <CModalFooter className="p-0 pt-5">
                        <CButton color="primary" disabled={loading} type="submit">Akte erstellen</CButton>
                    </CModalFooter>
                    </CForm>
                </CModalBody>
            </CModal>
        </>
    )
}

export default Akten