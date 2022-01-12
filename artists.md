---
title: "Artists"
---
### We are CHALL
We are an international collective of artists and creatives working and experimenting across media, spaces and timezones. The physical and virtual world is our studio.

<style>
.circle-frame {
  border-radius: 9999px;
}
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 150px;
  grid-gap: 1rem;
  text-align: center;
}
</style>
<div class="container">
{% for member in site.data.members %}
  <div>
    <img class="circle-frame" width="148" height="148" src="../images/{{ member.image }}">
    <p><strong>{{ member.name }}</strong><br>{{ member.title }}</p>
  </div>
{% endfor %}
</div>
