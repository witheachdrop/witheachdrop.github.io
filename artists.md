---
title: "Artists"
---
### We are CHALL
We are an international collective of artists and creatives working and experimenting across media, spaces and timezones. The physical and virtual world is our studio.

<ul>
{% for member in site.data.members %}
  <li>{{ member.name }} — {{ member.title }}</li>
{% endfor %}
</ul>