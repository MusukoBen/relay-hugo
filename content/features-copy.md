---
title: "Relay – Feature-Texte"
draft: true
---

# Relay — Feature-Texte

Strukturierte Feature-Beschreibungen auf Basis des Prototypen relay-mock-v2.
Jedes Feature hat: Titel · Kurzzeile · Beschreibung · mögliche Subpunkte.

---

## Project Memory

**Relay merkt sich, wo du warst.**

Jedes Mal wenn du ein Projekt öffnest, stellt Relay den letzten Zustand automatisch wieder her — aktiver Branch, laufende Prozesse, offene Ports. Kein manuelles Navigieren, kein erneutes Setup.

- Zeigt Branch, Commit-Status und verwendete Technologien auf einen Blick
- Stellt den Kontext beim Öffnen still im Hintergrund wieder her
- Bestätigt die Wiederherstellung mit einer kurzen Benachrichtigung im Terminal

---

## Broadcast

**Ein Befehl. Alle Tabs.**

Mit Broadcast tippst du einmal — und der Befehl läuft sofort in allen ausgewählten Tabs gleichzeitig. Ideal für `git pull`, Restarts oder Deployments, die synchron über mehrere Shells laufen müssen.

- Per Klick aktivieren und deaktivieren, direkt aus der Titelleiste oder der Seitenleiste
- Frei wählbar: welche Tabs mitsenden, welche nicht
- Aktive Broadcast-Tabs sind visuell hervorgehoben — du siehst immer sofort, was synchronisiert wird
- Broadcast-Aktionen erscheinen inline im Terminal als Hinweis

---

## Workspaces

**Mehrere Projekte. Kein Chaos.**

Workspaces halten deine Projekte sauber getrennt. Jeder Workspace hat seine eigenen Tabs, seinen eigenen Zustand — und seinen eigenen Namen.

- Bis zu n Workspaces parallel, schnell per Klick wechselbar
- Doppelklick zum Umbenennen direkt in der Seitenleiste
- Tabs-Anzahl pro Workspace auf einen Blick
- Farbdot pro Workspace für schnelle visuelle Orientierung

---

## Offene Ports

**Sieh, was läuft — öffne es sofort.**

Relay erkennt automatisch, welche Ports aktiv sind, und zeigt sie im Seitenbereich an. Ein Klick öffnet die Adresse direkt im Browser.

- Echtzeit-Übersicht aller laufenden Prozesse und ihrer Ports
- Klick auf einen Port öffnet `localhost:PORT` im Browser
- Rechtsklick für weitere Optionen: URL oder Port kopieren, Prozess direkt beenden
- Grüner Statusindikator zeigt: Prozess läuft

---

## SSH Status

**Remote im Blick.**

Wenn du per SSH verbunden bist, zeigt Relay den Verbindungsstatus direkt im Seitenbereich — ohne extra Tool, ohne separates Fenster.

- Hostname, Uptime, CPU- und RAM-Auslastung auf einen Blick
- Farbkodierung: Grün = alles ok, Gelb = Achtung
- Immer sichtbar, solange die Verbindung aktiv ist

---

## Command Palette

**Alles erreichbar. Sofort.**

Mit `⌘P` öffnet sich die Command Palette — eine schnelle Suche über Befehle, History und Aktionen aus allen Sessions gleichzeitig.

- Durchsucht die Befehlshistory sitzungsübergreifend: alle Workspaces, alle Tabs
- Zeigt Kontext zum Befehl: Pfad und Branch, in dem er ausgeführt wurde
- Schnell-Aktionen direkt auslösbar, z.B. Broadcast deaktivieren
- Schließt per ESC, öffnet per `⌘P`

---

## Befehlshistory

**Kein Befehl vergessen.**

Relay speichert die zuletzt ausgeführten Befehle mit Zeitstempel — sitzungsübergreifend und sofort abrufbar.

- Letzte Befehle mit relativem Timestamp (gerade eben / 4m / 1h)
- Klickbar zum erneuten Ausführen
- Verfügbar sowohl im Seitenbereich als auch in der Command Palette

---

## Favoriten & Verzeichnisse

**Schnell dorthin, wo du arbeiten willst.**

Häufig genutzte Pfade und Projektverzeichnisse lassen sich als Favoriten anlegen und sind immer einen Klick entfernt.

- Favoriten mit Stern markieren — erscheinen dauerhaft im Seitenbereich
- Verzeichnisübersicht des aktuellen Projekts direkt im Panel
- Ordner und Dateien auf einen Blick, ohne Terminal-Kommando

---

## Tabs

**Mehrere Shells. Übersichtlich.**

Jeder Workspace kann mehrere Tabs haben — jeder Tab ist eine eigenständige Shell-Session.

- Tabs mit Namen, frei benennbar
- Aktiver Tab visuell hervorgehoben
- Broadcast-Tabs sind orange markiert — Sync-Zustand immer sichtbar
- Tab schließen per × direkt im Tab

---

## Design & Glassmorphism

**Eine Oberfläche, die nicht im Weg ist.**

Relay setzt auf ein konsequentes Glass-Design: Transparente Panels mit Tiefenunschärfe, ein animierter Aurora-Hintergrund und ein durchgängiges Farbsystem aus Mint, Blau und Dunkel.

- Alle Chrome-Bereiche (Rail, Tabs, Panels) mit `backdrop-filter: blur` — das Terminal bleibt bewusst opak für maximale Lesbarkeit
- Animierter Aurora-Hintergrund gibt der Oberfläche Lebendigkeit ohne abzulenken
- Kontext-Menüs und Command Palette als tiefe Glass-Overlays

---

## Benachrichtigungen

**Immer informiert. Nie gestört.**

Relay gibt kurzes, präzises Feedback — direkt da wo es relevant ist.

- Toast-Benachrichtigung bei Project Memory Wiederherstellung
- Inline-Hinweise im Terminal bei Broadcast-Aktionen
- Kurze Bestätigungs-Toasts beim Kopieren von Ports oder URLs
- Alle Benachrichtigungen verschwinden automatisch

---

## Hell/Dunkel-Modus

**Passt sich deinem System an.**

Relay unterstützt ein helles und ein dunkles Theme — mit automatischem Wechsel basierend auf der macOS-Systemeinstellung. Das Fenster, die Titlebar und alle Glass-Effekte passen sich sofort an.

- Drei Modi: Dunkel, Hell, System (automatisch)
- Relay Light: Helle Chrome-Farben mit grünem Akzent, weißer Terminal-Hintergrund
- Bei "System": Beobachtet macOS-Appearance und wechselt das Theme sofort
- Titlebar, Scrollbars und Glass-Effekte passen sich dem Modus an

---

## Project Memory

**Relay merkt sich deine Projekte.**

Commands und Verzeichnisse werden pro Projekt auf Disk gespeichert und überleben App-Neustarts. Die häufigsten Commands erscheinen in der Sidebar — sortiert nach Nutzungshäufigkeit.

- Pro Projekt eine JSON-Datei unter ~/.config/relay/memory/
- Commands werden dedupliziert: Nutzungszähler statt Duplikate
- Aufbewahrung konfigurierbar: 7 Tage, 30 Tage oder unbegrenzt
- Max. 500 Commands und 200 Verzeichnisse pro Projekt
- Automatische Bereinigung beim App-Start

---

## Per-Pane Shell-Toggle

**Relay oder dein zshrc — pro Pane wählbar.**

Jeder Pane zeigt im Header ein kleines Badge das den aktiven Shell-Modus anzeigt. Ein Klick wechselt sofort zwischen Relay-Prompt und deinem eigenen ~/.zshrc.

- Badge im Pane-Header: "relay" (Terminal-Icon) oder "zshrc" (Person-Icon)
- Klick terminiert die Shell und startet sie sofort mit dem anderen Modus neu
- Jeder Pane behält seinen eigenen Modus — unabhängig von anderen Panes

---

## Explain Error

**Fehler verstehen. Sofort.**

Wenn ein Befehl fehlschlägt, erscheint beim Hovern in der Sidebar ein roter "Explain?"-Button. Ein Klick startet den AI-Agenten, der den Fehler erklärt.

- Fehlgeschlagene Commands werden mit rotem Punkt markiert
- "Explain?" erscheint beim Hovern — ein Klick sendet `relay explain`
- Der AI-Agent analysiert den letzten Befehl, Exit-Code und Shell-Kontext
- Erfordert konfigurierten AI-Provider (Anthropic oder OpenAI)

---

## Semantic Colorizer

**Terminal-Output. Automatisch eingefärbt.**

Relay erkennt Fehler, Pfade, URLs und Zahlen in ungefärbtem Terminal-Output und hebt sie automatisch farbig hervor. Bereits eingefärbter Output wird nicht verändert.

- Fehler/Fatal: Rot (fett), Warnungen: Gelb, Erfolg: Grün
- URLs: Blau (unterstrichen), Pfade: Cyan, Zahlen mit Einheiten: Magenta
- Prompt-Zeilen werden übersprungen (OSC 133 tracking)
- Ein/Aus in Settings → Erscheinungsbild → Semantic Highlighting

---
