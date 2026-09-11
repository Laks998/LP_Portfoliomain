// Mounts the Originkit "Character Waves" component (components/originkit/character-waves.tsx)
// as the site background. The component source is used untouched — this file only
// compiles it in the browser (Babel standalone, TSX -> JS) and renders it into #bgMosaic,
// since the site has no React/JSX build step of its own.

async function mountCharacterWaves() {
    const container = document.getElementById("bgMosaic")
    if (!container) return

    const [babelMod, React, { createRoot }] = await Promise.all([
        import("https://esm.sh/@babel/standalone@7.25.6?bundle"),
        import("https://esm.sh/react@18.3.1"),
        import("https://esm.sh/react-dom@18.3.1/client"),
    ])
    const Babel = babelMod.default || babelMod

    const source = await fetch("components/originkit/character-waves.tsx").then((r) =>
        r.text()
    )

    const { code } = Babel.transform(source, {
        filename: "character-waves.tsx",
        presets: [
            ["react", { runtime: "automatic" }],
            ["typescript", { isTSX: true, allExtensions: true }],
        ],
    })

    const blobUrl = URL.createObjectURL(new Blob([code], { type: "text/javascript" }))
    const { default: ASCIIWaves } = await import(blobUrl)
    URL.revokeObjectURL(blobUrl)

    createRoot(container).render(
        React.createElement(ASCIIWaves, {
            background: "#f9f7f4",
            color: "#1B1A16",
            direction: "left",
        })
    )
}

mountCharacterWaves()
