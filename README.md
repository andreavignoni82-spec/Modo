# MODO Prototype 0.1

Prototipo UX installabile come web app/PWA.

## Cosa dimostra
- profili Gabriele, Giorgio e Giulia;
- budget personale che segue la persona;
- simulazione di sessioni su dispositivo condiviso;
- categorie con peso differente;
- modalità famiglia;
- dashboard genitore;
- salvataggio locale sul dispositivo.

## Importante
Questo prototipo NON blocca ancora app iOS reali. È il prototipo funzionale del flusso MODO.
Per il blocco reale su iPhone la versione nativa dovrà usare le API Apple Screen Time:
FamilyControls + ManagedSettings + DeviceActivity, con gli entitlement Apple necessari.

## Pubblicazione gratuita su GitHub Pages
1. Crea un repository, per esempio `modo-prototype`.
2. Carica index.html, style.css, app.js e manifest.json nella root.
3. GitHub > Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main / root.
6. Apri l'URL GitHub Pages da iPhone.
7. Safari > Condividi > Aggiungi alla schermata Home.

## Test suggerito
Apri il prototipo sia sull'iPhone del papà sia sull'iPhone della mamma.
La versione 0.1 salva ancora i dati localmente, quindi NON sincronizza tra i due telefoni.
Il passaggio successivo è MODO Cloud, così il budget di Giorgio/Giulia viene sincronizzato tra dispositivi.
