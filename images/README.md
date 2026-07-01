# Photos du site

Pour l'instant, le site utilise des images de remplacement (placeholders) afin de
tenir la mise en page. Il suffit de les remplacer par tes vraies photos.

## Photos à fournir (par ordre de priorité)

1. **Hero (accueil)** : une belle photo horizontale (salle, plat signature ou façade).
   Format paysage, idéalement 1800 x 1200 px minimum.
2. **La maison** : une photo verticale (portrait) d'un plat ou de la salle.
3. **Les incontournables** : 5 photos (tarte flambée, choucroute, bière maison,
   baeckeoffe, tarte aux myrtilles).
4. **Galerie** : 6 photos (salle, plats, terrasse, façade, ambiance...).

## Comment remplacer une image

Chaque image de remplacement est repérée dans `index.html` par un commentaire
`<!-- TODO PHOTO: ... -->`. Il suffit de :

1. Déposer la photo dans ce dossier `images/` (ex. `hero.jpg`).
2. Dans `index.html`, remplacer l'URL `https://picsum.photos/...` par
   `images/hero.jpg`.

Astuce : garde des noms de fichiers simples et en minuscules, sans accents ni
espaces (ex. `choucroute.jpg`, `salle-1.jpg`).
