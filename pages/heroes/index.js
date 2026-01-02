import Head from 'next/head';
import Layout from '../../components/Layout';
import HeroesSection from '../../components/HeroesSection';

export default function HeroesPage() {
  return (
    <Layout>
      <Head>
        <title>Все герои — Debug выгорания</title>
        <meta name="description" content="Каталог историй IT-фениксов с поиском и фильтрами." />
      </Head>
      <HeroesSection />
    </Layout>
  );
}
