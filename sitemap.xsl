<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes"
              doctype-system="about:legacy-compat"/>
  <xsl:template match="/">
    <html lang="nl">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <title>XML sitemap – Partijgedrag</title>
        <style>
          :root {
            --color-surface: #ffffff;
            --color-on-surface: #000000;
            --color-surface-container: #e0e0e0;
            --color-primary: #1d70b8;
            --color-on-primary: #ffffff;
            --color-secondary: #d1eaff;
            --color-on-secondary: #084062;
            --color-tertiary: #d1eaff;
            --color-on-tertiary: #000000;
            --color-muted: #e0e0e0;
            --color-on-muted: #797979;
            --color-summarized: #f6efff;
            --color-on-summarized: #c783ff;
            --color-translated: #4db6ff;
            --color-positive: #e1f7d5;
            --color-on-positive: #28a745;
            --color-warning: #ffedca;
            --color-on-warning: orange;
            --color-negative: #ffe9e8;
            --color-on-negative: #dc3545;
            --color-informational: #d5e1f7;
            --color-on-informational: #1d70b8;
            --color-neutral: #afafaf;
            --color-on-neutral: #afafaf;
          }

          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html {
            font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            font-size: 1rem;
          }

          body {
            background: var(--color-surface);
            color: var(--color-on-surface);
            line-height: 1.6;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
          }

          a { color: var(--color-primary); text-decoration: none; }
          a:hover { text-decoration: underline; }

          .center-grid { width: 100%; }
          .center-grid-content {
            max-width: 64rem;
            margin-inline: auto;
            padding-inline: clamp(1rem, 4vw, 1.5rem);
          }

          #site-header {
            border-bottom: 1px solid var(--color-surface-container);
            background: var(--color-surface);
          }
          #site-header nav { padding-block: 0.875rem; }
          #site-header .flex-row { display: flex; align-items: center; justify-content: space-between; }

          #logo a {
            font-weight: 600;
            font-size: 1rem;
            color: var(--color-on-surface);
            text-decoration: none;
          }

          .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: var(--color-on-muted);
          }
          .breadcrumb .sep { color: var(--color-surface-container); }

          main { flex: 1; padding-block: 2.5rem 5rem; }

          h1 {
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
          }

          .lede {
            color: var(--color-on-muted);
            font-size: 0.9375rem;
            margin-bottom: 1.75rem;
          }
          .lede code {
            font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
            font-size: 0.82em;
            background: var(--color-muted);
            padding: 0.1em 0.35em;
            border-radius: 0.25rem;
          }

          /* summary badge — uses .informational tokens */
          .summary {
            display: inline-flex;
            align-items: center;
            background: var(--color-informational);
            color: var(--color-on-informational);
            border-left: 3px solid var(--color-primary);
            padding: 0.35rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.8125rem;
            font-weight: 500;
            margin-bottom: 1.25rem;
          }

          .nav { margin-bottom: 1.25rem; font-size: 0.875rem; }

          .table-wrap {
            border: 1px solid var(--color-surface-container);
            border-radius: 0.375rem;
            overflow: hidden;
          }

          table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

          thead th {
            text-align: left;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-on-muted);
            background: var(--color-muted);
            border-bottom: 1px solid var(--color-surface-container);
            padding: 0.6rem 1rem;
          }

          tbody td {
            padding: 0.6rem 1rem;
            border-top: 1px solid var(--color-surface-container);
            vertical-align: top;
          }
          tbody tr:first-child td { border-top: 0; }
          tbody tr:hover { background: var(--color-secondary); color: var(--color-on-secondary); }
          tbody tr:hover a { color: var(--color-on-secondary); }

          td.num {
            color: var(--color-on-muted);
            font-variant-numeric: tabular-nums;
            text-align: right;
            width: 2.75rem;
            padding-right: 0.5rem;
            white-space: nowrap;
          }

          td.date {
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
          }
          td.date .time {
            display: block;
            font-size: 0.75rem;
            color: var(--color-on-muted);
            margin-top: 0.1rem;
          }

          td.loc { word-break: break-all; }
        </style>
      </head>
      <body>

        <section id="site-header">
          <nav class="center-grid primary">
            <div class="center-grid-content">
              <div class="flex-row" style="justify-content:space-between;width:100%">
                <h3 style="font-weight:600;font-size:1rem;margin:0" id="logo">
                  <a href="/" style="text-decoration:none;border-bottom:0">Partijgedrag</a>
                </h3>
                <div class="breadcrumb">
                  <span class="sep">/</span>
                  <span>XML sitemap</span>
                </div>
              </div>
            </div>
          </nav>
        </section>

        <main class="center-grid">
          <div class="center-grid-content">
            <xsl:apply-templates select="s:sitemapindex | s:urlset"/>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>

  <!-- ─── Sitemap index ─── -->
  <xsl:template match="s:sitemapindex">
    <h1>Sitemap-index</h1>
    <p class="lede">
      Deze index bevat alle child-sitemaps van <code>partijgedrag.be</code>.
      Gedefinieerd door <a href="https://www.sitemaps.org/protocol.html#index">sitemaps.org</a>.
    </p>
    <div class="summary">
      <xsl:value-of select="count(s:sitemap)"/> child-sitemaps
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="num">#</th>
            <th>Sitemap-URL</th>
            <th>Laatst gewijzigd</th>
          </tr>
        </thead>
        <tbody>
          <xsl:for-each select="s:sitemap">
            <tr>
              <td class="num"><xsl:value-of select="position()"/></td>
              <td class="loc">
                <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
              </td>
              <td class="date">
                <xsl:call-template name="lastmod">
                  <xsl:with-param name="value" select="s:lastmod"/>
                </xsl:call-template>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </xsl:template>

  <!-- ─── URL set ─── -->
  <xsl:template match="s:urlset">
    <h1>URL-sitemap</h1>
    <p class="lede">
      Een overzicht van canonieke URL's, met de datum waarop elke URL voor het
      laatst werd gewijzigd. Gedefinieerd door
      <a href="https://www.sitemaps.org/protocol.html">sitemaps.org</a>.
    </p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="num">#</th>
            <th>URL</th>
            <th>Laatst gewijzigd</th>
          </tr>
        </thead>
        <tbody>
          <xsl:for-each select="s:url">
            <tr>
              <td class="num"><xsl:value-of select="position()"/></td>
              <td class="loc">
                <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
              </td>
              <td class="date">
                <xsl:call-template name="lastmod">
                  <xsl:with-param name="value" select="s:lastmod"/>
                </xsl:call-template>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </xsl:template>

  <!--
    Render a <lastmod> value as "YYYY-MM-DD" with the time of day, when known,
    as a smaller secondary line ("HH:MM UTC"). XSLT 1.0 has no date arithmetic,
    so we just slice the ISO 8601 string.
  -->
  <xsl:template name="lastmod">
    <xsl:param name="value"/>
    <xsl:value-of select="substring($value, 1, 10)"/>
    <xsl:if test="string-length($value) &gt; 10">
      <span class="time">
        <xsl:value-of select="substring($value, 12, 5)"/>
        <xsl:text> UTC</xsl:text>
      </span>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
