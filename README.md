# openKanzlei
Eine Open-Source Kanzleisoftware

## Ausführen
#### Voraussetzungen
- JDK 17+
- Node.JS 24+

### Docker
``` bash
docker run -d -p 3000:3000 -p 3001:3001 openkanzlei/openkanzlei
```

### Manuelle Ausführung
``` bash
git clone https://github.com/evgeny-shevtsov/openKanzlei
```
``` bash
cd openKanzlei
```
*installiere alle Dependencies*
``` bash
npm run setup
```
*openKanzlei starten*
``` bash
npm run start
```
Nach der Startsequenz ist openKanzlei auf `http://localhost:3000` verfügbar.

### Verwaltung

#### Flowable: `http://localhost:8080/flowable`

Nutzername: `admin`

Passwort: `test`

## Dokumentation
openKanzlei besteht aus drei Hauptkomponenten: Frontend `/frontend`, Backend `/backend` und Flowable `/flowable/tomcat`.

Die Frontend macht Anfragen auf die Backend, welche die nötigen Daten von Flowable abruft und das verarbeitete Ergebnis wird als Antwort an die Frontend geschickt. 

Alternativ gibt es eine Proxy, welche direkte Anfragen auf Flowable erlaubt, ohne dass die Antwort von Flowable vom Backend verändert oder verarbeitet wird. Dies wird aktuell bei der Entwicklung benutzt und die Anfragen werden von der Frontend verarbeitet, soll aber geändert werden.


<img width="641" height="401" alt="Unbenanntes Diagramm-openKanzlei drawio" src="https://github.com/user-attachments/assets/164fab1d-bd23-4dc5-ab61-9fb0b85c5c2c"/>

*Die Funktionsweise dieser Komponente in openKanzlei*

Die Start-App `start.js` startet alle Komponente. Die Startsequenz erfolgt wiefolgt:
1. Flowable
2. Backend
3. Frontend

### Frontend
Die Frontend ist eine React-basierte graphische Oberfläche. Aktuell gibt es funktionen zur erstellung von Akten und Aufgaben und die Änderung dessen Status.
Aktuell werden API-Antworten von der Frontend und nicht von der Backend verarbeitet. Dies wird in späteren Entwicklungsphasen geändert. 

### Backend
Die Backend ist Node.js Express REST Server, welcher die Daten zwischen Frontend und Flowable verarbeitet. Der Nutzer/Die Frontend soll wegen Sicherheitsgründen keinen direkten Zugriff
auf Flowable haben.

<img width="541" height="531" alt="Unbenanntes Diagramm-Backend drawio(1)" src="https://github.com/user-attachments/assets/f44fd6e8-d47d-410d-8527-9d4d1f3fc24a" />

*Die Funktionsweise der Backend. Alle Anfragen auf den `/api`-Endpoint werden zu der Proxy weitergeleitet.* 

*z.B. `localhost:3001/api/cmmn-api/cmmn-runtime/case-instances` -> `localhost:8080/flowable/cmmn-api/cmmn-runtime/case-instances`*

Eine Liste mit `cmmn-api` Anfragen befindet sich <a href="https://documentation.flowable.com/latest/assets/core-swagger/cmmn.html">hier</a>

### Flowable
Flowable ist eine Business Process Management (BPM) Plattform. In unserem Fall nutzen wir ein Case Management Model and Notation (CMMN) Modell um die Aufgaben einer Anwaltskanzlei zu visualisieren. Dieses Modell ist bei der installation von openKanzlei vorgeladen.

Flowable erhält Anfragen von der Backend, z.B. Erstellung einer neuen Akte. Daten werden in der integrierten H2-Datenbank `flowable/tomcat/flowable-db/engine-db.mv.db` gespeichert. Dies soll geändert werden, denn eine H2-Datenbank ist für die Produktion nicht geeingnet
und soll zukünftig durch ein zuverlässigeres Datenbanksystem geändert werden, wird aber momentan benutzt um die Entwicklung zu vereinfachen.

Flowable läuft auf Apache Tomcat, einen Webserver, als Webapp. Deshalb ist Flowable unter `localhost:8080/flowable` erreichbar.

<img width="571" height="451" alt="Unbenanntes Diagramm-Flowable drawio" src="https://github.com/user-attachments/assets/0f49b81e-7bf7-4289-95b2-383bbbdcb88b" />

*Die Funktionsweise von Flowable. Alle in der Frontend sichtbaren Nutzerdaten werden in Flowable gespeichert.*

<img width="542" height="843" alt="Screenshot_20260120_115416" src="https://github.com/user-attachments/assets/e2a7206c-6e8f-449d-bb57-fc36dfba5e31" />

*Das vorgeladene CMMN-Modell*

"Stages" (Schriftsatz, Postbearbeitung) sind Aufgabentypen, die jeweiligen "Tasks" (Aktenstudium, Schreiben, ...,) sind Unteraufgaben. Diese werden von der Frontend dynamisch geladen.





