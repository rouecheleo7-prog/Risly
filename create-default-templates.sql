-- Insert 6 default templates for the current user
INSERT INTO templates (user_id, titre, description, contenu) VALUES
(auth.uid(), 'Lettre de présentation', 'Présenter un bien au prospect', 'Madame, Monsieur,

Je suis heureux de vous présenter le bien suivant:

DESCRIPTION DU BIEN
- Type: [Type de bien]
- Localité: [Localité]
- Surface: [Surface] m²
- Pièces: [Nombre de pièces]
- État: [État du bien]
- Prix: [Prix] CHF

POINTS FORTS
- [Point fort 1]
- [Point fort 2]
- [Point fort 3]

Je reste à votre disposition pour organiser une visite.

Cordialement,
[Votre nom]'),

(auth.uid(), 'Offre d''achat', 'Formaliser une offre', 'Madame, Monsieur,

Suite à votre intérêt pour le bien à [Localité], nous vous proposons de formaliser votre offre.

DÉTAILS DE L''OFFRE
- Prix proposé: [Prix] CHF
- Délai de réponse: [Délai]
- Conditions: [Conditions]
- Date de signature: [Date]

Nous restons à votre disposition.

Cordialement,
[Votre nom]'),

(auth.uid(), 'Relance prospect', 'Relancer sans nouvelles', 'Madame, Monsieur,

Nous n''avons pas eu de nouvelles depuis notre dernière communication concernant le bien à [Localité].

Nous avons d''autres prospects intéressés. Si ce bien vous intéresse, contactez-nous rapidement.

Cordialement,
[Votre nom]'),

(auth.uid(), 'Email estimation', 'Présenter une estimation de prix', 'Madame, Monsieur,

Suite à votre demande, voici notre estimation du bien à [Localité]:

ESTIMATION
- Surface: [Surface] m²
- Type: [Type]
- Prix au m²: [Prix/m²]
- Estimation totale: [Prix] CHF

Nous restons à votre disposition pour en discuter.

Cordialement,
[Votre nom]'),

(auth.uid(), 'Rapport de visite', 'Résumé après visite', 'Madame, Monsieur,

Suite à votre visite du bien à [Localité], voici notre résumé:

POINTS OBSERVÉS
- État général: [État]
- Points positifs: [Points]
- Remarques: [Remarques]

Nous restons disponibles pour vos questions.

Cordialement,
[Votre nom]'),

(auth.uid(), 'Annonce bien', 'Description pour annonce immobilière', '[Type] à [Localité]

DESCRIPTION
Surface: [Surface] m²
Pièces: [Pièces]
État: [État]

CARACTÉRISTIQUES
- [Caractéristique 1]
- [Caractéristique 2]
- [Caractéristique 3]

Prix: [Prix] CHF

Contactez-nous pour une visite sans engagement!')
ON CONFLICT DO NOTHING;
