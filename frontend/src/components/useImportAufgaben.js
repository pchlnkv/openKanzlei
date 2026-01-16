import { useState, useEffect } from 'react'
const SERVER_BACKEND = import.meta.env.VITE_BACKEND_SERVER_URL;

export async function mapAufgaben(caseInstances){
    const nichtAngefangen = [];
    const bevorstehend = [];
    const heuteFaellig = [];
    const waAntwort = [];
    const erledigt = [];

    let casesCount = 0;
    let activeCases = 0;

    for(const caseInstance of caseInstances) {
        casesCount++;
        const creationDate = new Date(caseInstance.createTime);
    //    const caseState = caseInstance.variables.find(v => v.name === "caseStatus")?.value;

        const getState = async () => {
            const aStateResp = await fetch(`${SERVER_BACKEND}/api/cmmn-api/cmmn-query/variable-instances`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planItemInstanceId: caseInstance.id
                })
            }) 
            const asjson = await aStateResp.json();
            console.log(caseInstance.id);
            console.log(asjson.data.find(item => item.variable.name === "aufgabeStatus")?.variable.value);
            const aufgabeStatus = asjson.data.find(item => item.variable.name === "aufgabeStatus")?.variable.value;
            const faelligkeit = asjson.data.find(item => item.variable.name === "faelligkeit")?.variable.value;
            return { aufgabeStatus, faelligkeit }
        }
        
        const { aufgabeStatus, faelligkeit } = await getState();
        console.log(aufgabeStatus);
      // const aufgabeStatus = "bevorstehend"

        const card = {
          id: casesCount,
          internalId: caseInstance.id,
          name: caseInstance.name,
          createdOn: creationDate.toLocaleDateString('de-DE'),
          state: aufgabeStatus,
          case: "TestAkte",
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