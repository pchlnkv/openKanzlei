import { useState, useEffect } from 'react';
const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;

export function mapCases(caseInstances){
    const aktiv = [];
    const archiv = [];
    let casesCount = 0;
    let activeCases = 0;

    caseInstances.forEach(caseInstance => {
        casesCount++;
        const creationDate = new Date(caseInstance.startTime);
        const caseState = caseInstance.variables.find(v => v.name === "caseStatus")?.value;
        const caseCreator = caseInstance.variables.find(v => v.name === "initiator")?.value;
        const card = {
          id: casesCount,
          internalId: caseInstance.id,
          name: caseInstance.name,
          createdBy: caseCreator,
          createdOn: creationDate.toLocaleDateString('de-DE'),
          state: caseState,
        }
        if(caseState === "aktiv") aktiv.push(card);
        else archiv.push(card);
    })
    return [
        {key: "aktiv", cards: aktiv},
        {key: "archiv", cards: archiv}
    ]
}

export function useImportCases(){
    const [cases, setCases] = useState([])

    const loadData = async () => {
        try{
            const url = `${SERVER_BACKEND}/api/cmmn-api/cmmn-history/historic-case-instances?includeCaseVariables=true`;
            const response = await fetch(url);
            const json = await response.json();
            const items = mapCases(json.data);
            setCases(items);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { cases, refreshCases: loadData };
}