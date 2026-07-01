# Kaysers'Bier

Site vitrine du **Kaysers'Bier**, restaurant alsacien au coeur de Kaysersberg.

Cuisine alsacienne, tartes flambées et bières maison. Le site présente la maison,
les incontournables, la carte complète, une galerie et les infos pratiques.

## Structure

```
index.html      Page unique (accueil, maison, incontournables, carte, galerie, infos)
styles.css      Styles (palette papier chaud + rouge alsacien)
script.js       Navigation, onglets de la carte, animations au défilement
images/         Photos (placeholders à remplacer, voir images/README.md)
```

Site statique, sans dépendance ni étape de build. Il fonctionne en ouvrant
simplement `index.html` dans un navigateur.

## Aperçu en local

```bash
# option simple
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne

Le site peut être hébergé gratuitement sur GitHub Pages, Netlify ou Vercel
(dépôt statique, aucune configuration particulière).

## À compléter

- Photos réelles (voir `images/README.md`).
- Horaires d'ouverture.
- Téléphone / lien de réservation (section « Infos » et bouton « Réserver »).
