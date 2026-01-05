(function registerPreviews() {
  const isRegistered = () => window.__CMS_PREVIEWS_REGISTERED__ === true;

  const getValue = (entry, path, fallback = '') => {
    if (!entry) return fallback;
    const value = entry.getIn(['data', ...path.split('.')]);
    return value === undefined || value === null ? fallback : value;
  };
  const getList = (entry, path) => {
    if (!entry) return [];
    const value = entry.getIn(['data', ...path.split('.')]);
    return value ? value.toJS() : [];
  };

  const register = () => {
    if (isRegistered() || !window.CMS || !window.h || !window.createClass) {
      return false;
    }

    const h = window.h;
    const createClass = window.createClass;

    window.CMS.registerPreviewStyle('/admin/preview.css');

    const HomePreview = createClass({
      render() {
        const entry = this.props.entry;
        const heroTitle = getValue(entry, 'hero_title');
        const heroSubtitle = getValue(entry, 'hero_subtitle');
        const aboutPreview = getValue(entry, 'about_preview');
        const featuredCount = getValue(entry, 'featured_count');
        const ctaPrimary = getValue(entry, 'hero_cta_primary.text');
        const ctaSecondary = getValue(entry, 'hero_cta_secondary.text');

        return h(
          'div',
          { className: 'cms-preview' },
          h('h1', null, heroTitle || 'Заголовок главной'),
          h('p', { className: 'muted' }, heroSubtitle),
          h('h2', null, 'О проекте'),
          h('p', null, aboutPreview),
          h('div', { className: 'cta' },
            h('strong', null, 'CTA:'),
            h('p', null, ctaPrimary || 'Основная кнопка'),
            h('p', null, ctaSecondary || 'Вторичная кнопка')
          ),
          h('p', { className: 'muted' }, `Показывать героев: ${featuredCount}`)
        );
      }
    });

    const AboutPreview = createClass({
      render() {
        const entry = this.props.entry;
        const heroTitle = getValue(entry, 'heroTitle');
        const heroSubtitle = getValue(entry, 'heroSubtitle');
        const sections = getList(entry, 'sections');
        const finalCtaTitle = getValue(entry, 'finalCtaTitle');
        const finalCtaText = getValue(entry, 'finalCtaText');

        return h(
          'div',
          { className: 'cms-preview' },
          h('h1', null, heroTitle || 'О проекте'),
          h('p', { className: 'muted' }, heroSubtitle),
          h('div', null, this.props.widgetFor('heroLead')),
          sections.map((section, index) =>
            h(
              'div',
              { className: 'section', key: `${section.id || 'section'}-${index}` },
              h('h2', null, section.title || `Раздел ${index + 1}`),
              section.body ? h('p', null, section.body) : null
            )
          ),
          h('div', { className: 'cta' },
            h('h3', null, finalCtaTitle || 'Присоединяйтесь'),
            h('p', null, finalCtaText)
          )
        );
      }
    });

    const JoinPreview = createClass({
      render() {
        const entry = this.props.entry;
        const title = getValue(entry, 'title');
        const subtitle = getValue(entry, 'subtitle');
        const steps = getList(entry, 'steps');
        const faq = getList(entry, 'faqSection.items');

        return h(
          'div',
          { className: 'cms-preview' },
          h('h1', null, title || 'Как стать участником'),
          h('p', { className: 'muted' }, subtitle),
          h('h2', null, 'Шаги'),
          h(
            'ul',
            null,
            steps.map((step, index) =>
              h('li', { key: `${step}-${index}` }, step)
            )
          ),
          h('h2', null, 'FAQ'),
          faq.map((item, index) =>
            h(
              'div',
              { className: 'section', key: `${item.question || 'faq'}-${index}` },
              h('h3', null, item.question || `Вопрос ${index + 1}`),
              h('p', null, item.answer)
            )
          )
        );
      }
    });

    const HeroesPreview = createClass({
      render() {
        const entry = this.props.entry;
        const name = getValue(entry, 'name');
        const company = getValue(entry, 'company');
        const phrase = getValue(entry, 'short_phrase');
        const tags = getList(entry, 'tags');

        return h(
          'div',
          { className: 'cms-preview' },
          h('h1', null, name || 'Имя героя'),
          company ? h('p', { className: 'muted' }, company) : null,
          h('p', null, phrase),
          h(
            'div',
            null,
            tags.map((tag, index) =>
              h('span', { className: 'pill', key: `${tag}-${index}` }, tag)
            )
          ),
          h('div', { className: 'section' }, this.props.widgetFor('body'))
        );
      }
    });

    window.CMS.registerPreviewTemplate('home', HomePreview);
    window.CMS.registerPreviewTemplate('about', AboutPreview);
    window.CMS.registerPreviewTemplate('join', JoinPreview);
    window.CMS.registerPreviewTemplate('heroes', HeroesPreview);

    window.__CMS_PREVIEWS_REGISTERED__ = true;
    return true;
  };

  const waitForCMS = (attempt = 0) => {
    if (register()) {
      return;
    }

    if (attempt < 50) {
      setTimeout(() => waitForCMS(attempt + 1), 100);
    }
  };

  waitForCMS();
})();
