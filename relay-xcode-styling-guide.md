# Relay — SwiftUI Styling Guide
**Xcode · iOS/macOS · Theme System · Version 1.1 · Feb 2026**

---

## Inhaltsverzeichnis

1. [Architektur-Übersicht](#1-architektur-übersicht)
2. [RelayTheme Struct](#2-relaytheme-struct)
3. [ThemeManager](#3-thememanager)
4. [Font-Mapping CSS → SwiftUI](#4-font-mapping-css--swiftui)
5. [Komponenten](#5-komponenten)
6. [Divider-Stile](#6-divider-stile)
7. [Pane-Layout-System](#7-pane-layout-system)
8. [ThemeLibrary — Beispiele](#8-themelibrary--beispiele)
9. [Theme-Wechsel & Animation](#9-theme-wechsel--animation)
10. [Implementierungs-Checkliste](#10-implementierungs-checkliste)

---

## 1. Architektur-Übersicht

Relay verwendet ein dreistufiges Theme-System. Jede Ebene ist unabhängig wählbar und wird über ein zentrales `RelayTheme`-Objekt zusammengeführt, das als `EnvironmentObject` durch die gesamte App fließt.

| Ebene | Optionen | Steuert |
|---|---|---|
| **App-Theme** | 6 Glass + 10 Retro | Farben, Fonts, Radius, Glass-Effekte |
| **Shell-Variation** | je 2–4 pro Theme | ANSI-Farben im Terminal |
| **Prompt-Stil** | 12 Stile (Robbyrussell … Typewritten) | Layout der zsh-Prompt-Zeile |

### Projektstruktur

```
Relay/
├── Theme/
│   ├── RelayTheme.swift           // Haupt-Struct mit allen Tokens
│   ├── RelayThemeTokens.swift     // Typen: TypographyTokens, RadiusTokens …
│   ├── ThemeLibrary.swift         // Alle 16 Theme-Definitionen
│   ├── ThemeManager.swift         // ObservableObject, Persistenz
│   └── ThemeEnvironmentKey.swift  // EnvironmentKey + View-Modifier
├── Components/
│   ├── GlassCard.swift
│   ├── RelayToggle.swift
│   ├── RelayButton.swift
│   ├── SectionLabel.swift
│   ├── AuroraView.swift
│   ├── ScanlinesView.swift
│   ├── RelayDivider.swift
│   └── PaneContainerView.swift
└── Views/
    ├── SettingsView.swift
    ├── ThemePickerView.swift
    └── TerminalView.swift
```

---

## 2. RelayTheme Struct

### RelayThemeTokens.swift

```swift
import SwiftUI

// MARK: - Typography
struct TypographyTokens {
    // Fonts (9 Kontexte)
    var fontUI:       String
    var fontLabel:    String
    var fontTitle:    String
    var fontDesc:     String
    var fontCardHead: String
    var fontRow:      String
    var fontBtn:      String
    var fontNI:       String   // Nav Item
    var fontSL:       String   // Section Label

    // Title
    var titleSize:    CGFloat
    var titleWeight:  Font.Weight
    var titleItalic:  Bool
    var titleCase:    Text.Case?
    var titleSpacing: CGFloat

    // Description
    var descSize:     CGFloat
    var descItalic:   Bool
    var descWeight:   Font.Weight

    // Nav Item
    var niSize:       CGFloat
    var niWeight:     Font.Weight
    var niItalic:     Bool
    var niSpacing:    CGFloat

    // Section Label
    var slSize:       CGFloat
    var slSpacing:    CGFloat
    var slCase:       Text.Case?
    var slItalic:     Bool

    // Card Header
    var chSize:       CGFloat
    var chSpacing:    CGFloat
    var chCase:       Text.Case?
    var chItalic:     Bool

    // Row
    var rowSize:       CGFloat
    var rowWeight:     Font.Weight
    var rowItalic:     Bool
    var rowDescSize:   CGFloat
    var rowDescItalic: Bool

    // Button
    var btnSize:      CGFloat
    var btnWeight:    Font.Weight
    var btnSpacing:   CGFloat
    var btnCase:      Text.Case?
    var btnItalic:    Bool

    // Footer Label
    var flSize:   CGFloat
    var flItalic: Bool
}

// MARK: - Radius
struct RadiusTokens {
    var window:       CGFloat
    var card:         CGFloat
    var navItem:      CGFloat
    var toggle:       CGFloat
    var button:       CGFloat
    var terminalCard: CGFloat
    var varCard:      CGFloat
    var preview:      CGFloat
    var toggleThumb:  ToggleThumbShape  // ⚠️ kein CGFloat — siehe Enums
}

// MARK: - Active State
struct ActiveStateTokens {
    var background:  Color
    var border:      Color
    var foreground:  Color
    var shadow:      RelayTheme.Shadow?  // nil bei Midnight, Obsidian, Arctic + allen Retro
    var paddingLeft: CGFloat
}

// MARK: - Surface
struct SurfaceTokens {
    var windowBg:       Color
    var windowBlur:     CGFloat          // 0 bei allen Retro-Themes
    var windowBorder:   Color
    var windowShadow:   RelayTheme.Shadow?
    var sideBg:         Color
    var sideBorder:     Color
    var titlebarBg:     Color
    var titlebarBorder: Color
}

// MARK: - Card
struct CardTokens {
    var background:   Color
    var isOutlined:   Bool    // ⚠️ true nur bei Midnight (--card-bg: transparent)
    var blur:         CGFloat
    var border:       Color
    var hover:        Color
    var headerBg:     Color
    var headerFg:     Color
    var headerBorder: Color
}

// MARK: - Accent
struct AccentTokens {
    var primary: Color
    var dim:     Color
    var border:  Color
    var aurora:  AuroraStyle
}
```

### Enums

```swift
// MARK: ToggleThumbShape
// Direkte Übersetzung von --radius-toggle-thumb:
// "50%"  → .round    (Relay Dark, Aurora, Sunset)
// "2px"  → .rounded  (Midnight)
// "1px"  → .square   (Obsidian, Arctic, alle Retro)
enum ToggleThumbShape {
    case round               // Circle()
    case rounded(CGFloat)    // RoundedRectangle
    case square(CGFloat)     // RoundedRectangle + Checkmark-Overlay wenn aktiv
}

// MARK: AuroraStyle
enum AuroraStyle {
    case none                                       // alle Retro-Themes
    case gradient(center: Color, edge: Color)       // alle Glass-Themes
}

// MARK: ButtonBackground
enum ButtonBackground {
    case flat(Color)
    case gradient(Color, Color, angle: Angle = .degrees(135))  // Aurora, Sunset
}

// MARK: DividerStyle
enum DividerStyle {
    case solid
    case dashed                   // nur Midnight
    case gradient(Color)          // Aurora, Sunset
}

// MARK: ScanlinesStyle
// ⚠️ Nicht alle Retro-Themes haben Scanlines:
enum ScanlinesStyle {
    case none    // Amstrad CPC, IBM 3270, Xerox Alto, ZX Spectrum
    case medium  // BBC Micro, Apple II, VT100 Amber, Game Boy
    case heavy   // Retro DOS, C64
}

// MARK: Shadow
struct Shadow {
    var color:  Color
    var radius: CGFloat
    var x:      CGFloat = 0
    var y:      CGFloat = 0
}
```

### RelayTheme.swift

```swift
struct RelayTheme: Identifiable, Hashable {
    let id:      String
    let name:    String
    let isRetro: Bool

    var accent:     AccentTokens
    var typography: TypographyTokens
    var radius:     RadiusTokens
    var active:     ActiveStateTokens
    var surface:    SurfaceTokens
    var card:       CardTokens

    // Text-Hierarchie
    var textPrimary:   Color
    var textSecondary: Color
    var textDim:       Color
    var textMuted:     Color

    // Divider
    var dividerColor: Color
    var dividerStyle: DividerStyle

    // Buttons
    var btnSaveBg:       ButtonBackground
    var btnSaveFg:       Color
    var btnSaveShadow:   Shadow?           // nil bei allen Retro-Themes
    var btnCancelBg:     Color
    var btnCancelBorder: Color

    // Toggle
    var toggleOffBg: Color
    var toggleThumb: Color

    // Retro
    var scanlines: ScanlinesStyle
    var bodyBg:    Color
}
```

---

## 3. ThemeManager

```swift
@MainActor
final class ThemeManager: ObservableObject {
    @Published var current:        RelayTheme     = ThemeLibrary.relayDark
    @Published var shellVariation: ShellVariation = .default
    @Published var promptStyle:    PromptStyle    = .robbyrussell
    @Published var paneLayout:     PaneLayout     = .single

    private let store = UserDefaults.standard

    func apply(_ theme: RelayTheme) {
        withAnimation(.easeInOut(duration: 0.35)) {
            current = theme
        }
        store.set(theme.id, forKey: "relay.themeId")
    }

    func restore() {
        guard
            let id    = store.string(forKey: "relay.themeId"),
            let theme = ThemeLibrary.all.first(where: { $0.id == id })
        else { return }
        current = theme
    }
}
```

### ThemeEnvironmentKey.swift

```swift
private struct ThemeKey: EnvironmentKey {
    static let defaultValue: RelayTheme = ThemeLibrary.relayDark
}

extension EnvironmentValues {
    var relayTheme: RelayTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

extension View {
    func relayThemed(_ theme: RelayTheme) -> some View {
        environment(\.relayTheme, theme)
    }
}
```

### App-Klasse

```swift
@main
struct RelayApp: App {
    @StateObject private var themeManager = ThemeManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(themeManager)
                .relayThemed(themeManager.current)
                .onAppear { themeManager.restore() }
        }
        .windowStyle(.hiddenTitleBar)
    }
}
```

---

## 4. Font-Mapping CSS → SwiftUI

| CSS / Web | SwiftUI | Fallback | Themes |
|---|---|---|---|
| Geist | `Font.custom("Geist", size:)` | `.system(.body)` | Relay Dark |
| JetBrains Mono | `Font.custom("JetBrainsMono-Regular", size:)` | `.monospacedDigit()` | Relay Dark Labels |
| Syne | `Font.custom("Syne-Bold", size:)` | `.system(…, design: .rounded)` | Midnight |
| Space Mono | `Font.custom("SpaceMono-Regular", size:)` | `.monospacedDigit()` | Midnight, Arctic |
| Playfair Display | `Font.custom("PlayfairDisplay-Italic", size:)` | `.system(…, design: .serif)` | Aurora, Xerox Alto |
| Lora | `Font.custom("Lora-Regular", size:)` | `.system(…, design: .serif)` | Aurora, Sunset, Xerox Alto |
| IBM Plex Mono | `Font.custom("IBMPlexMono-Regular", size:)` | `.monospacedDigit()` | Obsidian, VT100, IBM 3270 |
| VT323 | `Font.custom("VT323-Regular", size:)` | `Menlo` | BBC, Apple II, Amstrad, ZX Spectrum, Retro DOS, C64 |
| Press Start 2P | `Font.custom("PressStart2P-Regular", size:)` | `Menlo` | Game Boy |

> **Info.plist:** `Fonts provided by application` → Array mit allen `.ttf`/`.otf`-Dateinamen.

### FontResolver.swift

```swift
struct FontResolver {
    private static let customFonts: Set<String> = [
        "Geist", "JetBrains Mono", "Syne", "Space Mono",
        "Playfair Display", "Lora", "IBM Plex Mono",
        "VT323", "Press Start 2P"
    ]

    static func resolve(
        _ name: String,
        size: CGFloat,
        weight: Font.Weight = .regular
    ) -> Font {
        let family = name.trimmingCharacters(in: .init(charactersIn: "'"))
        if customFonts.contains(family),
           UIFont.familyNames.contains(family) {
            return .custom(family, size: size)
        }
        return .system(size: size, weight: weight)
    }
}
```

---

## 5. Komponenten

### 5.1 GlassCard

Drei Modi: **Glas** (`blur > 0`), **Flat** (`blur = 0`, opake Farbe), **Outlined** (`isOutlined = true` — nur Midnight, transparenter Hintergrund mit sichtbarer Border).

```swift
struct GlassCard<Content: View>: View {
    @Environment(\.relayTheme) private var theme
    let content: () -> Content

    var body: some View {
        content()
            .background {
                RoundedRectangle(cornerRadius: theme.radius.card)
                    .fill(theme.card.isOutlined ? Color.clear : theme.card.background)
                    .background {
                        if theme.card.blur > 0 {
                            RoundedRectangle(cornerRadius: theme.radius.card)
                                .fill(.ultraThinMaterial)
                        }
                    }
                    .overlay {
                        RoundedRectangle(cornerRadius: theme.radius.card)
                            .strokeBorder(theme.card.border, lineWidth: 1)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: theme.radius.card))
            }
    }
}
```

---

### 5.2 RelayToggle

Shape ergibt sich aus `theme.radius.toggleThumb`:

| Shape | CSS-Wert | Themes |
|---|---|---|
| `.round` | `50%` | Relay Dark, Aurora, Sunset |
| `.rounded(2)` | `2px` | Midnight |
| `.square(1)` | `1px` → Checkbox | Obsidian, Arctic, alle Retro |

```swift
struct RelayToggle: View {
    @Environment(\.relayTheme) private var theme
    @Binding var isOn: Bool

    var body: some View {
        ZStack(alignment: isOn ? .trailing : .leading) {
            RoundedRectangle(cornerRadius: theme.radius.toggle)
                .fill(isOn ? theme.accent.primary : theme.toggleOffBg)
                .frame(width: 36, height: 20)
                .animation(.easeInOut(duration: 0.2), value: isOn)

            thumbView.padding(2)
        }
        .onTapGesture { withAnimation { isOn.toggle() } }
    }

    @ViewBuilder
    private var thumbView: some View {
        switch theme.radius.toggleThumb {
        case .round:
            Circle()
                .fill(theme.toggleThumb)
                .frame(width: 16, height: 16)

        case .rounded(let r):
            RoundedRectangle(cornerRadius: r)
                .fill(theme.toggleThumb)
                .frame(width: 16, height: 16)

        case .square(let r):
            RoundedRectangle(cornerRadius: r)
                .fill(theme.toggleThumb)
                .frame(width: 16, height: 16)
                .overlay {
                    if isOn {
                        Image(systemName: "checkmark")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(theme.toggleOffBg)
                    }
                }
        }
    }
}
```

---

### 5.3 RelayButton

```swift
struct RelayButton: View {
    @Environment(\.relayTheme) private var theme
    let title:  String
    let style:  ButtonKind
    let action: () -> Void

    enum ButtonKind { case save, cancel }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(FontResolver.resolve(
                    theme.typography.fontBtn,
                    size:   theme.typography.btnSize,
                    weight: theme.typography.btnWeight
                ))
                .italic(theme.typography.btnItalic)
                .tracking(theme.typography.btnSpacing)
                .textCase(theme.typography.btnCase)
                .foregroundColor(style == .save ? theme.btnSaveFg : theme.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background { buttonBackground }
                .clipShape(RoundedRectangle(cornerRadius: theme.radius.button))
                .shadow(
                    color:  style == .save ? (theme.btnSaveShadow?.color  ?? .clear) : .clear,
                    radius: style == .save ? (theme.btnSaveShadow?.radius ?? 0)      : 0
                )
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var buttonBackground: some View {
        if style == .save {
            switch theme.btnSaveBg {
            case .flat(let c):
                RoundedRectangle(cornerRadius: theme.radius.button).fill(c)
            case .gradient(let c1, let c2, _):
                RoundedRectangle(cornerRadius: theme.radius.button)
                    .fill(LinearGradient(
                        colors: [c1, c2],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
            }
        } else {
            RoundedRectangle(cornerRadius: theme.radius.button)
                .fill(theme.btnCancelBg)
                .overlay {
                    RoundedRectangle(cornerRadius: theme.radius.button)
                        .strokeBorder(theme.btnCancelBorder, lineWidth: 1)
                }
        }
    }
}
```

---

### 5.4 SectionLabel

```swift
struct SectionLabel: View {
    @Environment(\.relayTheme) private var theme
    let text: String

    var body: some View {
        Text(text)
            .font(FontResolver.resolve(
                theme.typography.fontSL,
                size: theme.typography.slSize
            ))
            .italic(theme.typography.slItalic)
            .textCase(theme.typography.slCase)
            .tracking(theme.typography.slSpacing)
            .foregroundColor(theme.card.headerFg)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 14)
            .padding(.vertical, 5)
            .background(theme.card.headerBg)
            .overlay(alignment: .bottom) {
                Rectangle().fill(theme.card.headerBorder).frame(height: 1)
            }
    }
}
```

---

### 5.5 AuroraView

```swift
struct AuroraView: View {
    @Environment(\.relayTheme) private var theme

    var body: some View {
        switch theme.accent.aurora {
        case .none:
            EmptyView()
        case .gradient(let center, let edge):
            GeometryReader { geo in
                RadialGradient(
                    colors: [center.opacity(0.55), edge.opacity(0.0)],
                    center: .top,
                    startRadius: 0,
                    endRadius: geo.size.height * 0.9
                )
                .blendMode(.plusLighter)
                .allowsHitTesting(false)
                .ignoresSafeArea()
            }
        }
    }
}
```

---

### 5.6 ScanlinesView

```swift
struct ScanlinesView: View {
    let style: ScanlinesStyle

    private var opacity: Double {
        switch style {
        case .none:   return 0
        case .medium: return 0.12
        case .heavy:  return 0.18
        }
    }

    var body: some View {
        if style == .none {
            EmptyView()
        } else {
            Canvas { context, size in
                var y: CGFloat = 0
                while y < size.height {
                    let rect = CGRect(x: 0, y: y, width: size.width, height: 1)
                    context.fill(Path(rect), with: .color(.black.opacity(opacity)))
                    y += 2
                }
            }
            .allowsHitTesting(false)
            .blendMode(.multiply)
        }
    }
}

// Verwendung:
// terminalView
//     .overlay { ScanlinesView(style: theme.scanlines) }
```

> **Accessibility:** Bei aktiviertem "Reduce Motion" deaktivieren:
> ```swift
> @Environment(\.accessibilityReduceMotion) var reduceMotion
> // ScanlinesView(style: reduceMotion ? .none : theme.scanlines)
> ```

---

## 6. Divider-Stile

```swift
struct RelayDivider: View {
    @Environment(\.relayTheme) private var theme

    var body: some View {
        switch theme.dividerStyle {
        case .solid:
            Rectangle()
                .fill(theme.dividerColor)
                .frame(height: 1)

        case .dashed:
            // Midnight
            Canvas { ctx, size in
                var x: CGFloat = 0
                while x < size.width {
                    ctx.fill(
                        Path(CGRect(x: x, y: 0, width: 6, height: 1)),
                        with: .color(theme.dividerColor)
                    )
                    x += 10
                }
            }
            .frame(height: 1)

        case .gradient(let color):
            // Aurora, Sunset
            Rectangle()
                .fill(LinearGradient(
                    colors: [color, color.opacity(0)],
                    startPoint: .leading,
                    endPoint: .trailing
                ))
                .frame(height: 1)
        }
    }
}
```

---

## 7. Pane-Layout-System

### PaneLayout.swift

```swift
enum PaneLayout: String, CaseIterable, Identifiable {
    case single
    case hStack2           // 2 nebeneinander
    case vStack2           // 2 übereinander
    case leftOneRightTwo   // 1 links · 2 rechts gestapelt
    case leftTwoRightOne   // 2 links gestapelt · 1 rechts
    case topOneBottomTwo   // 1 oben · 2 unten nebeneinander
    case hStack3           // 3 nebeneinander
    case grid2x2           // 2 × 2 Grid
    case focus             // 1 groß + Sekundär-Panes gedimmt rechts

    var id: String { rawValue }

    var minPanes: Int {
        switch self {
        case .single:                             return 1
        case .hStack2, .vStack2, .focus:          return 2
        case .leftOneRightTwo, .leftTwoRightOne,
             .topOneBottomTwo, .hStack3:           return 3
        case .grid2x2:                            return 4
        }
    }

    var label: String {
        switch self {
        case .single:          return "Einzeln"
        case .hStack2:         return "2 nebeneinander"
        case .vStack2:         return "2 übereinander"
        case .leftOneRightTwo: return "1 links · 2 rechts"
        case .leftTwoRightOne: return "2 links · 1 rechts"
        case .topOneBottomTwo: return "1 oben · 2 unten"
        case .hStack3:         return "3 nebeneinander"
        case .grid2x2:         return "2 × 2 Grid"
        case .focus:           return "Focus"
        }
    }
}
```

### PaneContainerView.swift

```swift
struct PaneContainerView: View {
    @Environment(\.relayTheme) private var theme
    let tabs:   [TerminalTab]
    let layout: PaneLayout

    var body: some View {
        switch layout {
        case .single:
            pane(tabs[0])

        case .hStack2:
            HStack(spacing: 1) { pane(tabs[0]); pane(tabs[1]) }

        case .vStack2:
            VStack(spacing: 1) { pane(tabs[0]); pane(tabs[1]) }

        case .leftOneRightTwo:
            HStack(spacing: 1) {
                pane(tabs[0])
                VStack(spacing: 1) { pane(tabs[1]); pane(tabs[2]) }
            }

        case .leftTwoRightOne:
            HStack(spacing: 1) {
                VStack(spacing: 1) { pane(tabs[0]); pane(tabs[1]) }
                pane(tabs[2])
            }

        case .topOneBottomTwo:
            VStack(spacing: 1) {
                pane(tabs[0])
                HStack(spacing: 1) { pane(tabs[1]); pane(tabs[2]) }
            }

        case .hStack3:
            HStack(spacing: 1) { pane(tabs[0]); pane(tabs[1]); pane(tabs[2]) }

        case .grid2x2:
            VStack(spacing: 1) {
                HStack(spacing: 1) { pane(tabs[0]); pane(tabs[1]) }
                HStack(spacing: 1) { pane(tabs[2]); pane(tabs[3]) }
            }

        case .focus:
            HStack(spacing: 1) {
                pane(tabs[0]).frame(maxWidth: .infinity)
                VStack(spacing: 1) {
                    ForEach(tabs.dropFirst(), id: \.id) { tab in
                        pane(tab).opacity(0.65)
                    }
                }
                .frame(maxWidth: 180)
            }
        }
    }

    private func pane(_ tab: TerminalTab) -> some View {
        VStack(spacing: 0) {
            paneBar(tab)
            TerminalPaneView(tab: tab)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .overlay { ScanlinesView(style: theme.scanlines) }
        }
    }

    private func paneBar(_ tab: TerminalTab) -> some View {
        HStack(spacing: 5) {
            Circle().fill(theme.accent.primary).frame(width: 5, height: 5)
            Text(tab.title)
                .font(.custom("JetBrains Mono", size: 9))
                .foregroundColor(theme.textDim)
            Spacer()
        }
        .padding(.horizontal, 8)
        .frame(height: 18)
        .background(theme.surface.titlebarBg)
        .overlay(alignment: .bottom) {
            Rectangle().fill(theme.surface.titlebarBorder).frame(height: 1)
        }
    }
}
```

---

## 8. ThemeLibrary — Beispiele

### Relay Dark

```swift
extension ThemeLibrary {
    static let relayDark = RelayTheme(
        id: "relay", name: "Relay Dark", isRetro: false,

        accent: .init(
            primary: Color(hex: "4af09a"),
            dim:     Color(hex: "4af09a").opacity(0.10),
            border:  Color(hex: "4af09a").opacity(0.22),
            aurora:  .gradient(center: Color(hex: "4af09a"), edge: .clear)
        ),

        typography: .init(
            fontUI: "Geist", fontLabel: "JetBrains Mono",
            fontTitle: "Geist", fontDesc: "Geist",
            fontCardHead: "JetBrains Mono", fontRow: "Geist",
            fontBtn: "Geist", fontNI: "Geist", fontSL: "JetBrains Mono",
            titleSize: 15, titleWeight: .semibold,
            titleItalic: false, titleCase: nil, titleSpacing: -0.2
            // …
        ),

        radius: .init(
            window: 14, card: 10, navItem: 8, toggle: 10,
            button: 7, terminalCard: 12, varCard: 10, preview: 10,
            toggleThumb: .round              // CSS: 50%
        ),

        active: .init(
            background: Color(hex: "4af09a").opacity(0.10),
            border:     Color(hex: "4af09a").opacity(0.22),
            foreground: Color(hex: "4af09a"),
            shadow:     .init(color: Color(hex: "4af09a").opacity(0.4), radius: 10),
            paddingLeft: 10
        ),

        card: .init(
            background: Color.white.opacity(0.04),
            isOutlined: false,
            blur: 12,
            border: Color.white.opacity(0.05)
            // …
        ),

        btnSaveBg:    .flat(Color(hex: "4af09a")),
        btnSaveShadow: .init(color: Color(hex: "4af09a").opacity(0.5), radius: 12),
        scanlines: .none,
        bodyBg: Color(hex: "04040a")
    )
}
```

### Midnight — Outlined-Sonderfall

```swift
static let midnight = RelayTheme(
    id: "midnight", name: "Midnight", isRetro: false,

    radius: .init(
        window: 6, card: 4, navItem: 4, toggle: 3,
        button: 4, terminalCard: 4, varCard: 4, preview: 6,
        toggleThumb: .rounded(2)         // CSS: 2px
    ),

    active: .init(
        background: .clear,              // CSS: transparent
        border:     Color(hex: "5d8bff"),
        foreground: Color(hex: "5d8bff"),
        shadow:     nil,                 // ⚠️ kein Shadow bei Midnight
        paddingLeft: 8
    ),

    card: .init(
        background: .clear,
        isOutlined: true,                // ⚠️ transparent + sichtbare Border
        blur: 0,
        border: Color(hex: "5d8bff").opacity(0.18)
        // …
    ),

    dividerStyle:  .dashed,
    btnSaveBg:     .flat(Color(hex: "5d8bff")),
    btnSaveShadow: .init(color: Color(hex: "5d8bff").opacity(0.5), radius: 12),
    scanlines: .none,
    bodyBg: Color(hex: "010110")
)
```

### Aurora — Gradient-Button + Gradient-Divider

```swift
static let aurora = RelayTheme(
    id: "aurora", name: "Aurora", isRetro: false,

    radius: .init(
        window: 20, card: 16, navItem: 20, toggle: 12,
        button: 20, terminalCard: 16, varCard: 12, preview: 16,
        toggleThumb: .round              // CSS: 50%
    ),

    active: .init(
        background: Color(hex: "a78bfa").opacity(0.12),
        border:     Color(hex: "a78bfa").opacity(0.28),
        foreground: Color(hex: "a78bfa"),
        shadow:     .init(color: Color(hex: "a78bfa").opacity(0.35), radius: 16),
        paddingLeft: 10
    ),

    btnSaveBg: .gradient(
        Color(hex: "a78bfa"),
        Color(hex: "7c3aed"),
        angle: .degrees(135)
    ),
    btnSaveShadow: .init(color: Color(hex: "a78bfa").opacity(0.45), radius: 20),
    dividerStyle:  .gradient(Color(hex: "a78bfa").opacity(0.3)),
    scanlines: .none,
    bodyBg: Color(hex: "050212")
)
```

### Game Boy — Retro

```swift
static let gameboy = RelayTheme(
    id: "gameboy", name: "Game Boy", isRetro: true,

    accent: .init(
        primary: Color(hex: "8bac0f"),
        dim:     Color(hex: "8bac0f").opacity(0.15),
        border:  Color(hex: "8bac0f").opacity(0.45),
        aurora:  .none                   // ⚠️ kein Aurora bei Retro
    ),

    radius: .init(
        window: 0, card: 0, navItem: 0, toggle: 0,
        button: 0, terminalCard: 0, varCard: 0, preview: 0,
        toggleThumb: .square(1)          // CSS: 1px
    ),

    active: .init(
        background: Color(hex: "8bac0f"),
        border:     Color(hex: "9bbc0f"),
        foreground: Color(hex: "0f380f"),
        shadow:     nil,                 // ⚠️ kein Shadow bei Retro
        paddingLeft: 10
    ),

    card: .init(
        background: Color(hex: "164016"),
        isOutlined: false,
        blur: 0,                         // ⚠️ kein Blur bei Retro
        border: Color(hex: "8bac0f").opacity(0.45)
        // …
    ),

    btnSaveBg:    .flat(Color(hex: "8bac0f")),
    btnSaveShadow: nil,                  // ⚠️ kein Glow bei Retro
    scanlines: .medium,
    bodyBg: Color(hex: "0f380f")
)
```

### Scanlines-Übersicht alle Retro-Themes

| Theme | ScanlinesStyle |
|---|---|
| BBC Micro | `.medium` |
| Apple II | `.medium` |
| Amstrad CPC | `.none` |
| VT100 Amber | `.medium` |
| IBM 3270 | `.none` |
| Xerox Alto | `.none` |
| Game Boy | `.medium` |
| ZX Spectrum | `.none` |
| Retro DOS | `.heavy` |
| C64 | `.heavy` |

---

## 9. Theme-Wechsel & Animation

```swift
// Standard — Farben und Radius animieren smooth
func apply(_ theme: RelayTheme) {
    withAnimation(.easeInOut(duration: 0.35)) {
        current = theme
    }
}
```

> **⚠️ Font-Wechsel** ist in SwiftUI nicht animierbar. Bei Themes mit stark unterschiedlichen Schriften (z.B. Relay Dark → Game Boy) kurzen Fade verwenden:

```swift
@Published private(set) var opacity: Double = 1.0

func applyWithFade(_ theme: RelayTheme) {
    withAnimation(.easeOut(duration: 0.15)) { opacity = 0 }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
        self.current = theme
        withAnimation(.easeIn(duration: 0.20)) { self.opacity = 1 }
    }
}

// In der View:
// ContentView().opacity(themeManager.opacity)
```

### Retro-Themes: macOS Titlebar anpassen

```swift
.onChange(of: themeManager.current.isRetro) { isRetro in
    let win = NSApp.mainWindow
    win?.standardWindowButton(.closeButton)?.isHidden       = isRetro
    win?.standardWindowButton(.miniaturizeButton)?.isHidden = isRetro
    win?.standardWindowButton(.zoomButton)?.isHidden        = isRetro
    // Retro-Titlebar-Label einblenden: z.B. "[ COMMODORE 64 READY. ]"
}
```

---

## 10. Implementierungs-Checkliste

### Setup
- [ ] Custom Fonts in Xcode-Target einbinden (Build Phases → Copy Bundle Resources)
- [ ] `Info.plist`: `Fonts provided by application` mit allen `.ttf`/`.otf`-Dateinamen
- [ ] `ThemeManager` als `@StateObject` in der `App`-Klasse
- [ ] `.environmentObject` + `.relayThemed` am Root-View
- [ ] `themeManager.restore()` in `.onAppear`

### Enums & Token-Modell
- [ ] `ToggleThumbShape` mit `.round`, `.rounded(CGFloat)`, `.square(CGFloat)` — kein magic-number 999
- [ ] `CardTokens.isOutlined: Bool` für Midnight (`transparent` bg)
- [ ] `ActiveStateTokens.shadow: Shadow?` — nur Relay Dark, Aurora, Sunset befüllt
- [ ] `ScanlinesStyle` korrekt pro Theme — **nicht** pauschal alle Retro auf `.medium`
- [ ] `btnSaveShadow: Shadow?` — bei allen Retro-Themes `nil`

### Komponenten
- [ ] `GlassCard` mit `isOutlined`-Branch für Midnight
- [ ] `RelayToggle` mit `ToggleThumbShape`-Switch statt CGFloat-Vergleich
- [ ] `RelayButton` mit `ButtonBackground` (flat vs gradient)
- [ ] `SectionLabel` mit vollem Typography-Token-Support
- [ ] `AuroraView` (`.none` → `EmptyView`)
- [ ] `ScanlinesView` mit korrektem opacity je `ScanlinesStyle`
- [ ] `RelayDivider` (solid, dashed, gradient)
- [ ] `PaneContainerView` mit allen 9 Layout-Fällen

### ThemeLibrary
- [ ] 6 Glass-Themes: Relay Dark, Midnight, Aurora, Obsidian, Sunset, Arctic
- [ ] 10 Retro-Themes: Retro DOS, C64, BBC Micro, Apple II, Amstrad, VT100, IBM 3270, Xerox Alto, Game Boy, ZX Spectrum
- [ ] `ThemeLibrary.all: [RelayTheme]` für den Picker
- [ ] Persistenz: `UserDefaults` für `themeId`, `shellVariation`, `promptStyle`, `paneLayout`

### Retro-spezifisch
- [ ] `surface.windowBlur = 0` bei allen Retro-Themes
- [ ] Trafficlight-Buttons bei `isRetro` ausblenden
- [ ] Retro-Titlebar-Label einblenden
- [ ] `bodyBg` als `NSWindow`-Background setzen

### Accessibility
- [ ] Xerox Alto: Kontrast aller Textelemente prüfen (WCAG AA ≥ 4.5:1)
- [ ] `ScanlinesView` bei `accessibilityReduceMotion` deaktivieren
- [ ] Press Start 2P: Touch-Targets mindestens 44pt
- [ ] VoiceOver: alle Custom-Komponenten mit `.accessibilityLabel`
- [ ] Dynamic Type: Schriftgrößen-Tokens mit `@ScaledMetric` skalierbar machen

---

*Relay SwiftUI Styling Guide · v1.1 · Feb 2026*
*Vollständige Token-Tabelle: `relay-theme-tokens.md`*
