{% assign  pageAuthor =
       page.author | default: site.author | default: "Albrecht Weinert" %}
{% assign  pageLang = page.lang | default: "en" %}
{% assign defaultPaths = site.pages | map: "path" %}
{% assign pagePaths = site.header_pages | default: defaultPaths %}
{%- if pageLang == "de"  -%}
   {% assign pageDateString = page.date | date: "%d.%m.%Y"
    | default: "unbekannt" %}
   {% assign  pageRevision =  page.revision | default: "neu" %} 
{%- else -%}
   {% assign pageDateString = page.date | date: "%m/%d/%Y"
    | default: "unknown" %}
   {% assign  pageRevision =  page.revision | default: "new" %}  
{%- endif  -%} 
{% assign urlParts = page.url | split: "/" %}
{% assign  pageName = page.name | default: urlParts.last %}