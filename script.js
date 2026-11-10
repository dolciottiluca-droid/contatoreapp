let datiApp = {
    cliente1: 0,
    cliente2: 0,
    cliente3: 0,
    personale: 0
};

function cambiaQuantita(chi, valore) {
    if (datiApp[chi] + valore < 0) {
        return; 
    }

    let qtaTotaleIniziale = parseFloat(document.getElementById('quantita-totale').value) || 0;
    let prezzoUnitario = parseFloat(document.getElementById('prezzo-unitario').value) || 0;

    let qtaAssegnataEsclusoQuesto = 0;
    for (let chiave in datiApp) {
        if (chiave !== chi) {
            qtaAssegnataEsclusoQuesto += datiApp[chiave];
        }
    }

    if (valore > 0 && (qtaAssegnataEsclusoQuesto + datiApp[chi] + valore) > qtaTotaleIniziale) {
        alert("Attenzione! Non hai abbastanza scorte rimaste.");
        return;
    }

    datiApp[chi] += valore;
    document.getElementById(`qta-${chi}`).innerText = datiApp[chi];

    if (chi !== 'personale') {
        let spesaTotale = datiApp[chi] * prezzoUnitario;
        document.getElementById(`prezzo-${chi}`).innerText = spesaTotale.toFixed(2);
    }

    let tutteLeQtaAssegnate = 0;
    for (let chiave in datiApp) {
        tutteLeQtaAssegnate += datiApp[chiave];
    }
    let rimanenza = qtaTotaleIniziale - tutteLeQtaAssegnate;
    document.getElementById('quantita-rimasta').innerText = rimanenza;
}

// Cambiato il valore predefinito a 'g'
function aggiornaUnitaMisura() {
    let nuovaUnita = document.getElementById('unita-misura').value || 'g';
    
    let elementiUnita = document.querySelectorAll('.label-unita');
    elementiUnita.forEach(elemento => {
        elemento.innerText = nuovaUnita;
    });

    document.getElementById('label-prezzo-unitario').innerText = `Prezzo al ${nuovaUnita} (€):`;
}

document.getElementById('quantita-totale').addEventListener('input', () => cambiaQuantita('cliente1', 0));
document.getElementById('prezzo-unitario').addEventListener('input', () => cambiaQuantita('cliente1', 0));
document.getElementById('unita-misura').addEventListener('input', aggiornaUnitaMisura);
