const datiPredefiniti = {
    clienti: [
        { id: 1, nome: '', qta: 0 },
        { id: 2, nome: '', qta: 0 },
        { id: 3, nome: '', qta: 0 }
    ],
    personale: 0,
    quantitaTotale: 20,
    unitaMisura: 'g',
    prezzoUnitario: 7.00,
    acqQuantita: 0,
    acqPrezzo: 0
};

function caricaDati() {
    try {
        let datiSalvati = localStorage.getItem('GDU_NuoviDati_V8');
        if (datiSalvati) {
            let parsed = JSON.parse(datiSalvati);
            if (parsed && Array.isArray(parsed.clienti) && parsed.clienti.length > 0) {
                return Object.assign({}, datiPredefiniti, parsed);
            }
        }
    } catch (e) {
        console.error(e);
    }
    return JSON.parse(JSON.stringify(datiPredefiniti));
}

let datiApp = caricaDati();

function salvaNelTelefono() {
    try {
        localStorage.setItem('GDU_NuoviDati_V8', JSON.stringify(datiApp));
    } catch (e) {
        console.error(e);
    }
}

let schedaAttuale = 'vendite';

function mostraScheda(nomeScheda) {
    schedaAttuale = nomeScheda;
    
    document.getElementById('scheda-vendite').classList.remove('active');
    document.getElementById('scheda-acquisti').classList.remove('active');
    document.getElementById('btn-tab-vendite').classList.remove('active');
    document.getElementById('btn-tab-acquisti').classList.remove('active');

    document.getElementById('scheda-' + nomeScheda).classList.add('active');
    document.getElementById('btn-tab-' + nomeScheda).classList.add('active');
}

let touchStartX = 0;
let touchEndX = 0;
const appContainer = document.getElementById('app-container');

if (appContainer) {
    appContainer.addEventListener('touchstart', function(e) {
        if (e.changedTouches && e.changedTouches.length > 0) {
            touchStartX = e.changedTouches[0].screenX;
        }
    }, { passive: true });

    appContainer.addEventListener('touchend', function(e) {
        if (e.changedTouches && e.changedTouches.length > 0) {
            touchEndX = e.changedTouches[0].screenX;
            gestisciSwipe();
        }
    }, { passive: true });
}

function gestisciSwipe() {
    const sogliaMinima = 60;
    if (touchStartX - touchEndX > sogliaMinima) {
        if (schedaAttuale === 'vendite') mostraScheda('acquisti');
    }
    if (touchEndX - touchStartX > sogliaMinima) {
        if (schedaAttuale === 'acquisti') mostraScheda('vendite');
    }
}

function aggiungiCliente() {
    const nuovoId = Date.now();
    datiApp.clienti.push({
        id: nuovoId,
        nome: '',
        qta: 0
    });
    salvaNelTelefono();
    aggiornaInterfaccia();

    const listaScroll = document.getElementById('lista-clienti-scroll');
    if (listaScroll) {
        listaScroll.scrollTop = listaScroll.scrollHeight;
    }
}

function rimuoviCliente(id) {
    if (datiApp.clienti.length <= 1) {
        alert("Deve esserci almeno un cliente nella lista.");
        return;
    }
    if (confirm("Vuoi rimuovere questo cliente dalla lista?")) {
        datiApp.clienti = datiApp.clienti.filter(function(c) { return c.id !== id; });
        salvaNelTelefono();
        aggiornaInterfaccia();
    }
}

function cambiaNomeCliente(id, nuovoNome) {
    const cliente = datiApp.clienti.find(function(c) { return c.id === id; });
    if (cliente) {
        cliente.nome = nuovoNome;
        salvaNelTelefono();
    }
}

function calcolaTotaleAssegnato() {
    let totaleClienti = datiApp.clienti.reduce(function(somma, c) { return somma + c.qta; }, 0);
    return totaleClienti + datiApp.personale;
}

function cambiaQuantitaCliente(id, valore) {
    const cliente = datiApp.clienti.find(function(c) { return c.id === id; });
    if (!cliente) return;

    if (cliente.qta + valore < 0) return;

    if (valore > 0 && (calcolaTotaleAssegnato() + valore) > datiApp.quantitaTotale) {
        alert("Attenzione! Non hai abbastanza scorte rimaste.");
        return;
    }

    cliente.qta += valore;
    salvaNelTelefono();
    aggiornaInterfaccia();
}

function cambiaPersonale(valore) {
    if (datiApp.personale + valore < 0) return;

    if (valore > 0 && (calcolaTotaleAssegnato() + valore) > datiApp.quantitaTotale) {
        alert("Attenzione! Non hai abbastanza scorte rimaste.");
        return;
    }

    datiApp.personale += valore;
    salvaNelTelefono();
    aggiornaInterfaccia();
}

function aggiornaInterfaccia() {
    document.getElementById('quantita-totale').value = datiApp.quantitaTotale;
    document.getElementById('unita-misura').value = datiApp.unitaMisura;
    document.getElementById('prezzo-unitario').value = datiApp.prezzoUnitario;

    const contenitoreClienti = document.getElementById('lista-clienti-scroll');
    if (contenitoreClienti) {
        contenitoreClienti.innerHTML = '';

        datiApp.clienti.forEach(function(cliente) {
            const spesa = (cliente.qta * datiApp.prezzoUnitario).toFixed(2);
            const card = document.createElement('div');
            card.className = 'cliente-card';
            card.innerHTML = 
                '<div class="nome-wrapper">' +
                    '<button class="btn-elimina-cliente" onclick="rimuoviCliente(' + cliente.id + ')" title="Rimuovi">✕</button>' +
                    '<input type="text" class="input-nome-cliente" value="' + cliente.nome + '" oninput="cambiaNomeCliente(' + cliente.id + ', this.value)" placeholder="👤 Nome...">' +
                '</div>' +
                '<div class="controlli">' +
                    '<button onclick="cambiaQuantitaCliente(' + cliente.id + ', -1)">-</button>' +
                    '<span class="qta-box">' + cliente.qta + ' ' + datiApp.unitaMisura + '</span>' +
                    '<button onclick="cambiaQuantitaCliente(' + cliente.id + ', 1)">+</button>' +
                '</div>' +
                '<div class="tot-badge">Tot: ' + spesa + '€</div>';
            contenitoreClienti.appendChild(card);
        });
    }

    document.getElementById('qta-personale').innerText = datiApp.personale;

    let rimanenza = datiApp.quantitaTotale - calcolaTotaleAssegnato();
    document.getElementById('quantita-rimasta').innerText = rimanenza;

    let elementiUnita = document.querySelectorAll('.label-unita');
    elementiUnita.forEach(function(elemento) {
        elemento.innerText = datiApp.unitaMisura;
    });
    document.getElementById('label-prezzo-unitario').innerText = 'Prezzo al ' + datiApp.unitaMisura + ' (€):';

    document.getElementById('acq-quantita').value = datiApp.acqQuantita;
    document.getElementById('acq-prezzo').value = datiApp.acqPrezzo;
    let totaleFornitore = (datiApp.acqQuantita || 0) * (datiApp.acqPrezzo || 0);
    document.getElementById('acq-totale').innerText = totaleFornitore.toFixed(2);
}

function azzeraTutto() {
    if (confirm("Vuoi azzerare i conteggi delle vendite (i nomi dei clienti resteranno salvati)?")) {
        datiApp.clienti.forEach(function(c) { c.qta = 0; });
        datiApp.personale = 0;
        salvaNelTelefono();
        aggiornaInterfaccia();
    }
}

function azzeraAcquisti() {
    if (confirm("Vuoi azzerare i dati di acquisto dal fornitore?")) {
        datiApp.acqQuantita = 0;
        datiApp.acqPrezzo = 0;
        salvaNelTelefono();
        aggiornaInterfaccia();
    }
}

document.getElementById('quantita-totale').addEventListener('input', function(e) {
    datiApp.quantitaTotale = parseFloat(e.target.value) || 0;
    salvaNelTelefono();
    aggiornaInterfaccia();
});
document.getElementById('prezzo-unitario').addEventListener('input', function(e) {
    datiApp.prezzoUnitario = parseFloat(e.target.value) || 0;
    salvaNelTelefono();
    aggiornaInterfaccia();
});
document.getElementById('unita-misura').addEventListener('input', function(e) {
    datiApp.unitaMisura = e.target.value || 'g';
    salvaNelTelefono();
    aggiornaInterfaccia();
});

document.getElementById('acq-quantita').addEventListener('input', function(e) {
    let nuovaQta = parseFloat(e.target.value) || 0;
    datiApp.acqQuantita = nuovaQta;
    datiApp.quantitaTotale = nuovaQta;
    salvaNelTelefono();
    aggiornaInterfaccia();
});
document.getElementById('acq-prezzo').addEventListener('input', function(e) {
    datiApp.acqPrezzo = parseFloat(e.target.value) || 0;
    salvaNelTelefono();
    aggiornaInterfaccia();
});

aggiornaInterfaccia();
