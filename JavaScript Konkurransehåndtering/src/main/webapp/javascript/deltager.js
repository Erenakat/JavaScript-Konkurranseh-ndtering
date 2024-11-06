class DeltagerManager {

    #regElm;
    #statElm;
    #finndeltagerElm;
    #deltagere = [];
    #besteTid = null;

    constructor(root) {

        // De tre linjene her hører til oppgave 1. Koden sier hvilken metoder som blir trigget når vi trykker på knappen
        this.#regElm = root.getElementsByClassName("registrering")[0];
        const regButton = document.getElementById("regButton");
        regButton.addEventListener("click", () => { this.#registrerdeltager() });

        // Oppgave 2 samme som oppgave 1 bare for knapp finn deltager
        this.#finndeltagerElm = root.getElementsByClassName("deltager")[0];
        const deltagerButton = document.getElementById("finnDeltagerButton");
        deltagerButton.addEventListener("click", () => { this.#finndeltager() });

        // Oppgave 3 samme som oppgave 1 bare for knapp statistikk
        this.#statElm = root.getElementsByClassName("statistikk")[0];
        const statButton = document.getElementById("finnAntallButton");
        statButton.addEventListener("click", () => { this.#beregnstatistikk() });

    }

    // Oppgave 2 
    #finndeltager() {


        const searchNumberInput = document.getElementById("finnDeltagerInput");
        const searchNumberelement = parseInt(searchNumberInput.value);


        this.#clearResults();

        if (!searchNumberInput.validity.valid || !searchNumberelement) {
            document.getElementById("errorDisplay").innerText = "Ugyldig startnummer!";
            return;
        }

        const foundDeltager = this.#deltagere.find(d => d.startnummer === searchNumberelement);

        if (foundDeltager) {
            document.getElementById("startnummerDisplay").classList.remove("hidden");
            document.getElementById("navnDisplay").classList.remove("hidden");
            document.getElementById("tidDisplay").classList.remove("hidden");

            document.getElementById("startnummerDisplay").querySelector("span").innerText = foundDeltager.startnummer;
            document.getElementById("navnDisplay").querySelector("span").innerText = foundDeltager.navn;
            document.getElementById("tidDisplay").querySelector("span").innerText = foundDeltager.tid;
        } else {
            document.getElementById("errorDisplay").innerText = "Deltager ikke funnet!";
        }
    }

    #clearResults() {
        // This function will clear the displayed results and any error messages
        document.getElementById("startnummerDisplay").querySelector("span").innerText = "";
        document.getElementById("navnDisplay").querySelector("span").innerText = "";
        document.getElementById("tidDisplay").querySelector("span").innerText = "";
        document.getElementById("errorDisplay").innerText = "";

        // Hide these elements
        document.getElementById("startnummerDisplay").classList.add("hidden");
        document.getElementById("navnDisplay").classList.add("hidden");
        document.getElementById("tidDisplay").classList.add("hidden");
    }



    #beregnstatistikk() {
        const fraInput = document.getElementById("fraTidInput");
        const tilInput = document.getElementById("tilTidInput");
        const antallResultat = document.getElementById("antallResultat");

        let fraTid = fraInput.value || "00:00:00";
        let tilTid = tilInput.value || "23:59:59";

        if (!fraInput.validity.valid || !tilInput.validity.valid) {
            antallResultat.innerText = "Ugyldig tidsformat!";
            return;
        }
        if (this.#parseTidISekunder(fraTid) >= this.#parseTidISekunder(tilTid)) {
            fraInput.setCustomValidity("'Fra' tiden må være mindre enn 'Til' tiden.");
            fraInput.reportValidity();
            return;
        }

        let antallDeltagere = this.#deltagere.filter(d =>
            this.#parseTidISekunder(d.tid) >= this.#parseTidISekunder(fraTid) &&
            this.#parseTidISekunder(d.tid) <= this.#parseTidISekunder(tilTid)).length;

        antallResultat.innerText = `Antall deltagere med sluttid fra ${fraTid} til ${tilTid}: ${antallDeltagere}`;


    }





    // Oppgave 1 
    #registrerdeltager() {

        // Lagrer input fra bruker i to variabler
        const inputValue = document.getElementById("regInput").value.trim();
        const inputElement = document.getElementById("regInput");

        // Hvis knappen klikkes og det er ingen så kommer denne feilmeldingen opp 
        if (inputValue.length === 0) {
            inputElement.setCustomValidity("Vennligst fyll ut alle feltene (Navn, Startnummer og Tid).");
            inputElement.reportValidity();
            return;
        }


        // Dette er REgex koder som er jævlig å forstå. Det er det du kan bruke for å søke etter veldid sepesifikke
        // tekstrenger. I vårt tilfelle skal du kunne søke på navn, tid og startnummer uansett rekkefølge. 
        // Hvis du skriver "01 Kristian 10:05:35 Bell" så gjør regex koden at i den tekstrengen kun henter ut Kristian Bell 
        // eller kun t10:05:35 eller kun 01. 

        const tidReg = /(?:\d{0,2}:){2}\d{0,2}/g;
        const startnummerReg = /\d{1,3}/g;
        const navnReg = /\p{L}{2,}(?:-\p{L}{2,})?/gu;
        const forsteBokstavNavnReg = /(^|-)(\p{L})/gu;

        // Match er det somme som når du kunne søke etter et land i SQL med %. fra% så fikk du opp alle land 
        // som statet med fra. Her bruker vi match med regexkoden og lagrer det den finner i en variabel. 
        // "01 Kristian 10:05:35 Bell" Kristian Bell blir lagret i navnMatches osv

        let tidMatches = inputValue.match(tidReg);
        let startnummerMatches = inputValue.replace(tidReg, "").match(startnummerReg);
        let navnMatches = inputValue.match(navnReg);

        // dette er alle feilmeldingen som skrives ut når det er feil input eller lignende. 

        if (!navnMatches) {
            inputElement.setCustomValidity("Vennligst fyll ut navn.");
            inputElement.reportValidity();
            return;
        } else if (navnMatches && navnMatches.length < 2) {
            inputElement.setCustomValidity("Deltager må ha både fornavn og etternavn ");
            inputElement.reportValidity();
            return;
        } else if (!startnummerMatches) {
            inputElement.setCustomValidity("Vennligst fyll ut startnummer.");
            inputElement.reportValidity();
            return;
        } else if (startnummerMatches && startnummerMatches.length > 1) {
            inputElement.setCustomValidity("Kun 1 startnummer");
            inputElement.reportValidity();
            return;
        } else if (!tidMatches) {
            inputElement.setCustomValidity("Vennligst fyll ut tid.");
            inputElement.reportValidity();
            return;
        } else if (tidMatches && tidMatches.length > 1) {
            inputElement.setCustomValidity("Kun 1 tid");
            inputElement.reportValidity();
            return;
        }

        // Dette klarer ikke eg å forklare! hahaha 

        let startnummer = parseInt(startnummerMatches[0]);
        let navn = navnMatches.join(" ");
        navn = navn.replace(forsteBokstavNavnReg, match => match.toUpperCase());
        let tid = tidMatches ? tidMatches[0] : null;
        tid = this.#formatererTid(tid);

        if (tid <= 0) {
            inputElement.setCustomValidity("Tid må være mer enn 0 sek. ");
            inputElement.reportValidity();
            return;
        } else if (tidMatches && tidMatches.length > 1) {
            inputElement.setCustomValidity("Kun 1 tid");
            inputElement.reportValidity();
        }

        for (let deltager of this.#deltagere) {
            if (deltager.startnummer === startnummer) {
                inputElement.setCustomValidity("Startnummer allerede i bruk.");
                inputElement.reportValidity();
                return;
            }
        }

        // Her lagrere vi med push i en liste. Listen heter deltager og den e opprettet helt øverst i koden. 
        this.#deltagere.push({ startnummer, navn, tid });
        console.log(this.#deltagere);

        // Dette er logikken for å finne den beste tiden og displayet det på siden. 
        if (!this.#besteTid || this.#parseTidISekunder(tid) < this.#parseTidISekunder(this.#besteTid)) {
            this.#besteTid = tid;
            document.getElementById("bestTid").innerText = this.#besteTid;
        }

        inputElement.value = "";
        inputElement.setCustomValidity("");
    }



    // Hjelpemetode for å gjøre om tid til sekunder
    #parseTidISekunder(tid) {
        const [hours, minutes, seconds] = tid.split(":").map(t => parseInt(t));
        return hours * 3600 + minutes * 60 + seconds;
    }


    #formatererTid(tid) {
        const tidDelerOpp = tid.split(":");
        if (tidDelerOpp.length !== 3 || this.#parseTidISekunder(tid) <= 0) return null;
        return tidDelerOpp.map(part => part.padStart(2, '0')).join(":");
    }

}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
