// Contact details shown across the site. Address landmark comes from public
// directory data for the given coordinates — confirm wording with the team.
export const contact = {
  telegram: 'uitcadmin',
  telegramUrl: 'https://t.me/uitcadmin',
  city: 'Namangan shahri',
  landmark: 'Mo‘ljal: Xo‘ji Xolmirza bobo',
  lat: 40.994472,
  lng: 71.604663,
}

export const mapLinks = {
  google: `https://maps.google.com/maps?q=${contact.lat},${contact.lng}&ll=${contact.lat},${contact.lng}&z=16`,
  yandex: `https://yandex.uz/maps/?pt=${contact.lng},${contact.lat}&z=16&l=map`,
  embed: `https://maps.google.com/maps?q=${contact.lat},${contact.lng}&z=16&output=embed`,
}
