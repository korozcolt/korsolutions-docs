import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Sidebar generado automáticamente
 * No editar manualmente - se regenera con npm run sync:all
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
    "type": "category",
    "label": "SIGMA - Sistema Electoral",
    "link": {
        "type": "doc",
        "id": "sigma/intro"
    },
    "items": [
        "sigma/readme",
        "sigma/changelog",
        "sigma/manual"
    ]
},
    {
    "type": "category",
    "label": "Sistema PQRSD",
    "link": {
        "type": "doc",
        "id": "pqr/intro"
    },
    "items": [
        "pqr/readme",
        "pqr/changelog",
        "pqr/manual"
    ]
},
    {
    "type": "category",
    "label": "ArchiveMaster",
    "link": {
        "type": "doc",
        "id": "archivemaster/intro"
    },
    "items": [
        "archivemaster/readme",
        "archivemaster/manual"
    ]
},
    {
    "type": "category",
    "label": "VolleyPass",
    "link": {
        "type": "doc",
        "id": "volleypass/intro"
    },
    "items": [
        "volleypass/readme",
        "volleypass/manual"
    ]
}
  ]
};

export default sidebars;
