# EduManager — application installable (PWA)

Gestion scolaire pour enseignants : élèves, présences, devoirs, notes, calendrier, exports Excel/PDF/CSV Moodle, sauvegarde GitHub.
Fonctionne dans le navigateur et s'installe comme une vraie application sur iPhone, Android et PC, même sans connexion.

## 1. Mettre l'application sur GitHub Pages

1. Sur github.com, créez un dépôt **public** (ex. `edumanager`). GitHub Pages gratuit exige un dépôt public.
2. Dans le dépôt : **Add file → Upload files**, puis glissez **le contenu** de ce dossier (pas le dossier lui-même) :
   `index.html`, `manifest.webmanifest`, `sw.js` et le dossier `icons`. Cliquez **Commit changes**.
3. **Settings → Pages → Build and deployment** : Source = *Deploy from a branch*, Branch = `main` et dossier `/ (root)`, puis **Save**.
4. Après 1 à 2 minutes, l'adresse est : `https://VOTRE-NOM.github.io/edumanager/`

Ne mettez jamais d'élèves, de notes ni de token dans ce dépôt public : l'application ne contient aucune donnée.

## 2. Installer l'application

| Appareil | Comment |
|---|---|
| **iPhone / iPad** (Safari obligatoire) | Ouvrez l'adresse, touchez **Partager**, puis **Sur l'écran d'accueil**. |
| **Android** (Chrome) | Ouvrez l'adresse, menu **⋮**, puis **Installer l'application**. |
| **PC** (Chrome ou Edge) | Cliquez sur l'icône d'installation dans la barre d'adresse (ou menu **⋮**, **Installer EduManager**). |

L'onglet **Export / Import** de l'application affiche aussi ces instructions et un bouton « Installer » quand l'appareil le permet.
Ouvrez l'application une première fois avec Internet : les bibliothèques Excel, PDF et ZIP sont alors mémorisées pour le mode hors connexion.

## Android : « Impossible d'ouvrir l'application »

1. Désinstallez l'ancienne icône (appui long, Désinstaller).
2. Chrome : ⋮ → Paramètres → Paramètres des sites → Stockage → supprimez les données de `github.io`.
3. Rouvrez l'adresse dans **Chrome** (pas dans WhatsApp, Facebook ou Telegram), puis ⋮ → **Installer l'application**.
4. Solution de secours : ⋮ → **Ajouter à l'écran d'accueil** → *Ajouter* (raccourci qui s'ouvre dans Chrome).

Pour vérifier l'installabilité depuis un PC : ouvrez l'adresse dans Chrome, F12 → onglet **Application** → **Manifest** : la section *Installability* liste les erreurs éventuelles.

## 3. Mettre à jour

Remplacez `index.html` dans le dépôt (**Add file → Upload files**, même nom). À la prochaine ouverture avec Internet, la nouvelle version est chargée.

## 4. Vos données et la sauvegarde GitHub

Les données restent **sur chaque appareil** (stockage du navigateur) : le téléphone, le PC et l'iPad ont chacun les leurs.
Pour les synchroniser, utilisez **Export / Import → Sauvegarde cloud GitHub** avec un **second dépôt PRIVÉ** (ex. `edumanager-data`) :

1. Créez le dépôt privé, puis un token (Settings → Developer settings → Fine-grained tokens) limité à ce dépôt, permission *Contents : Read and write*.
2. Dans l'application : renseignez le token, le dépôt (`votre-nom/edumanager-data`), le dossier et la branche, puis **Sauvegarder maintenant**.
3. Sur l'autre appareil : même configuration, puis **Restaurer la dernière** (ou **Historique** pour choisir un jour).

Une seule sauvegarde par jour est conservée (celle du jour est remplacée, les jours précédents restent).
Le token est stocké dans l'appareil : n'utilisez la sauvegarde cloud que sur vos appareils personnels.

## Contenu du dossier

- `index.html` : l'application
- `manifest.webmanifest` : nom, couleurs et icônes de l'application installée
- `sw.js` : mode hors connexion
- `icons/` : icônes (192, 512, maskable, iPhone, favicon)
