import Head from 'next/head';
import Layout from '../../components/Layout';
import HeroesSection from '../../components/HeroesSection';
import { getAllHeroes } from '../../lib/content';

export async function getStaticProps() {
  const heroes = getAllHeroes();
  return {
    props: {
      heroes
    }
  };
}

export default function HeroesPage({ heroes }) {
  return (
    <Layout>
      <Head>
        <title>Все герои — Debug выгорания</title>
        <meta name="description" content="Каталог историй IT-фениксов с поиском и фильтрами." />
      </Head>
      <HeroesSection heroes={heroes} />
    </Layout>
  );
}
