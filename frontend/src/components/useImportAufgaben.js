import { useState, useEffect } from 'react'
const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;

export async function mapAufgaben(planItemInstances){
    const nichtAngefangen = [];
    const bevorstehend = [];
    const heuteFaellig = [];
    const waAntwort = [];
    const erledigt = [];

    let casesCount = 0;
    let activeCases = 0;

    for(const planItemInstance of planItemInstances) {
        casesCount++;
        const creationDate = new Date(planItemInstance.createTime);
    //    const caseState = caseInstance.variables.find(v => v.name === "caseStatus")?.value;

        const getState = async () => {
            const aStateResp = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-query/variable-instances`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planItemInstanceId: planItemInstance.id
                })
            }) 
            const asjson = await aStateResp.json();

            const aufgabeStatus = asjson.data.find(item => item.variable.name === "aufgabeStatus")?.variable.value;
            const faelligkeit = asjson.data.find(item => item.variable.name === "faelligkeit")?.variable.value;
            return { aufgabeStatus, faelligkeit }
        }

        const getCaseName = async() => {
            const cResp = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances/${planItemInstance.id}`);
            const cjson = await cResp.json();

            const cNResp = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/case-instances/${cjson.caseInstanceId}`)
            const cNjson = await cNResp.json();

            const caseName = cNjson.name;
            const caseId = cNjson.id;
            return { caseId, caseName };
        }
        
        const { aufgabeStatus, faelligkeit } = await getState();
        const { caseId, caseName } = await getCaseName();
      // const aufgabeStatus = "bevorstehend"

        const card = {
          id: casesCount,
          internalId: planItemInstance.id,
          name: planItemInstance.name,
          createdOn: creationDate.toLocaleDateString('de-DE'),
          state: aufgabeStatus,
          case: caseName,
          caseId: caseId,
          faelligkeit: faelligkeit
        }

        if(aufgabeStatus === "bevorstehend") bevorstehend.push(card);
        else nichtAngefangen.push(card);
    }
    return [
        {key: "nichtAngefangen", cards: nichtAngefangen},
        {key: "bevorstehend", cards: bevorstehend},
        {key: "heuteFaellig", cards: heuteFaellig},
        {key: "waAntwort", cards: waAntwort},
        {key: "erledigt", cards: erledigt}
    ]
}

export function useImportAufgaben(){
    const [aufgaben, setAufgaben] = useState([])
    const [aufgabenLoading, setLoading] = useState(true)
    const loadData = async () => {
        setLoading(true)
        try{
            const url = `${SERVER_BACKEND}/api/cmmn-api/cmmn-runtime/plan-item-instances?state=active&planItemDefinitionType=stage`; 
            const response = await fetch(url);
            const json = await response.json();
            const items = await mapAufgaben(json.data);
            setAufgaben(items);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { aufgaben, refreshAufgaben: loadData, aufgabenLoading };
}