import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'SIGMA - Sistema Electoral',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Sistema integral de gestión y análisis electoral desarrollado con Laravel 12,
        con módulos de gestión de votantes, campañas políticas, call center y análisis en tiempo real.
      </>
    ),
  },
  {
    title: 'Sistema PQRSD',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Plataforma de gestión de Peticiones, Quejas, Reclamos, Sugerencias y Denuncias
        con Laravel 12, incluyendo workflow de tickets, asignación automática y reportes.
      </>
    ),
  },
  {
    title: 'ArchiveMaster',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Sistema de gestión documental empresarial con Laravel, permite organizar,
        clasificar y gestionar archivos digitales con control de versiones y permisos.
      </>
    ),
  },
  {
    title: 'VolleyPass',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Plataforma de gestión de torneos y equipos de voleibol con Laravel,
        incluye registro de jugadores, calendario de partidos y estadísticas en vivo.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
