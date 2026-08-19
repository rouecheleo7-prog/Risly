export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, pieces, localisation, surface, prix, atouts, ton } = await req.json()

    if (!type || !localisation) {
      return NextResponse.json({ error: 'Type de bien et localité requis' }, { status: 400 })
    }

    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 })

    const tonInstructions: Record<string, string> = {
      accrocheur: 'un ton accrocheur et vendeur, avec de l\'enthousiasme',
      factuel: 'un ton factuel et professionnel, direct et informatif',
      luxe: 'un ton haut de gamme et élégant, évoquant le prestige',
    }

    const prompt = `Tu es un agent immobilier suisse expérimenté. Rédige une description d'annonce immobilière en français avec ${tonInstructions[ton] || tonInstructions.accrocheur}.

Bien à décrire:
- Type: ${type}
- Pièces: ${pieces || 'non précisé'}
- Localité: ${localisation}
- Surface: ${surface ? surface + ' m²' : 'non précisée'}
- Prix: ${prix ? prix + ' CHF' : 'non précisé'}
- Points forts: ${atouts || 'aucun point particulier mentionné'}

Contraintes:
- Entre 60 et 100 mots
- Pas de titre, juste le texte de l'annonce
- Adapté au marché immobilier suisse romand
- Ne pas inventer de détails non fournis (pas de fausses caractéristiques)`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error('Gemini error:', data)
      return NextResponse.json({ error: data.error?.message ?? 'Erreur Gemini' }, { status: res.status })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) {
      return NextResponse.json({ error: 'Aucune description générée' }, { status: 500 })
    }

    return NextResponse.json({ description: text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
