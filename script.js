 Struttura iniziale predefinita dei dati
const datiPredefiniti = {
    cliente1: 0,
    cliente2: 0,
    cliente3: 0,
    personale: 0,
    quantitaTotale: 20,
    unitaMisura: 'g',
    prezzoUnitario: 7.00,
    nomeCliente1: 'Cliente 1',
    nomeCliente2: 'Cliente 2',
    nomeCliente3: 'Cliente 3'
};

// Carica i dati dal nuovo spazio di memoria pulito
function caricaDati() {
    let datiSalvati = localStorage.getItem('GDU_NuoviDati_V2');
    if (datiSalvati) {
        return JSON.parse(datiSalvati);
    }
    return JSON.parse(JSON.stringify(datiPredefiniti));
}

let datiApp = caricaDati();

// Salva i dati nel nuovo spazio di memoria pulito
function salvaNelTelefono() {
    localStorage.setItem('GDU_NuoviDati_V2', JSON.stringify(datiApp));
}

function cambiaQuantita(chi, valore) {
    if (datiApp[chi] + valore < 0) {
        return; 
    }

    let qtaTotaleIniziale = datiApp.quantitaTotale;
    let prezzoUnitario = datiApp.prezzoUnitario;

    let qtaAssegnataEsclusoQuesto = 0;
    const chiaviPersone = ['cliente1', 'cliente2', 'cliente3', 'personale'];
    chiaviPersone.forEach(chiave => {
        if (chiave !== chi) {
            qtaAssegnataEsclusoQuesto += datiApp[chiave];
        }
    });

    if (valore > 0 && (qtaAssegnataEsclusoQuesto + datiApp[chi] + valore) > qtaTotaleIniziale) {
        alert("Attenzione! Non hai abbastanza scorte rimaste.");
        return;
    }

    datiApp[chi] += valore;
    salvaNelTelefono();
    aggiornaInterfaccia();
}

function aggiornaInterfaccia() {
    document.getElementById('quantita-totale').value = datiApp.quantitaTotale;
    document.getElementById('unita-misura').value = datiApp.unitaMisura;
    document.getElementById('prezzo-unitario').value = datiApp.prezzoUnitario;

    document.getElementById('nome-c1').value = datiApp.nomeCliente1;
    document.getElementById('nome-c2').value = datiApp.nomeCliente2;
    document.getElementById('nome-c3').value = datiApp.nomeCliente3;

    document.getElementById('qta-cliente1').innerText = datiApp.cliente1;
    document.getElementById('qta-cliente2').innerText = datiApp.cliente2;
    document.getElementById('qta-cliente3').innerText = datiApp.cliente3;
    document.getElementById('qta-personale').innerText = datiApp.personale;

    document.getElementById('prezzo-cliente1').innerText = (datiApp.cliente1 * datiApp.prezzoUnitario).toFixed(2);
    document.getElementById('prezzo-cliente2').innerText = (datiApp.cliente2 * datiApp.prezzoUnitario).toFixed(2);
    document.getElementById('prezzo-cliente3').innerText = (datiApp.cliente3 * datiApp.prezzoUnitario).toFixed(2);

    let tutteLeQtaAssegnate = datiApp.cliente1 + datiApp.cliente2 + datiApp.cliente3 + datiApp.personale;
    let rimanenza = datiApp.quantitaTotale - tutteLeQtaAssegnate;
    document.getElementById('quantita-rimasta').innerText = rimanenza;

    let elementiUnita = document.querySelectorAll('.label-unita');
    elementiUnita.forEach(elemento => {
        elemento.innerText = datiApp.unitaMisura;
    });
    document.getElementById('label-prezzo-unitario').innerText = `Prezzo al ${datiApp.unitaMisura} (€):`;
}

function azzeraTutto() {
    if (confirm("Sei sicuro di voler azzerare tutti i conteggi e i dati inseriti?")) {
        datiApp = JSON.parse(JSON.stringify(datiPredefiniti));
        salvaNelTelefono();
        aggiornaInterfaccia();
    }
}

document.getElementById('quantita-totale').addEventListener('input', (e) => {
    datiApp.quantitaTotale = parseFloat(e.target.value) || 0;
    salvaNelTelefono();
    aggiornaInterfaccia();
});
document.getElementById('prezzo-unitario').addEventListener('input', (e) => {
    datiApp.prezzoUnitario = parseFloat(e.target.value) || 0;
    salvaNelTelefono();
    aggiornaInterfaccia();
});
document.getElementById('unita-misura').addEventListener('input', (e) => {
    datiApp.unitaMisura = e.target.value || 'g';
    salvaNelTelefono();
    aggiornaInterfaccia();
});

document.getElementById('nome-c1').addEventListener('input', (e) => { datiApp.nomeCliente1 = e.target.value; salvaNelTelefono(); });
document.getElementById('nome-c2').addEventListener('input', (e) => { datiApp.nomeCliente2 = e.target.value; salvaNelTelefono(); });
document.getElementById('nome-c3').addEventListener('input', (e) => { datiApp.nomeCliente3 = e.target.value; salvaNelTelefono(); });

aggiornaInterfaccia();
