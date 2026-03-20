export type MysticMaterial =
  | 'buddhas_tear_root'
  | 'beautys_plume'
  | 'vicious_fruit'
  | 'jade_tower_pearl'
  | 'jasmine_stamen'
  | 'frost_mushroom_mycelium'
  | 'stormbone_bloom'

export interface MysticSkill {
  id: string
  name: string
  material: MysticMaterial
  category: string
  tags: string[]
}

export const mysticSkills: MysticSkill[] = [
  {
    id: 'blinding_mist',
    name: 'Blinding Mist',
    material: 'vicious_fruit',
    category: 'Support',
    tags: ['Assassination'],
  },
  {
    id: 'celestial_seize',
    name: 'Celestial Seize',
    material: 'vicious_fruit',
    category: 'Puzzle',
    tags: ['Take Item', 'Disarm'],
  },
  {
    id: 'cloud_steps',
    name: 'Cloud Steps',
    material: 'beautys_plume',
    category: 'Puzzle',
    tags: ['Lightness Skill', 'Undercut'],
  },
  {
    id: 'dragon_head',
    name: 'Dragon Head',
    material: 'jade_tower_pearl',
    category: 'Single Target Burst',
    tags: ['Damage'],
  },
  {
    id: 'dragons_breath',
    name: "Dragon's Breath",
    material: 'jade_tower_pearl',
    category: 'Single Target Burst',
    tags: ['Burn'],
  },
  {
    id: 'drunken_poet',
    name: 'Drunken Poet',
    material: 'vicious_fruit',
    category: 'Single Target Burst',
    tags: ['Damage'],
  },
  {
    id: 'flaming_meteor',
    name: 'Flaming Meteor',
    material: 'buddhas_tear_root',
    category: 'Area Damage',
    tags: ['Damage'],
  },
  {
    id: 'flute_of_the_tides',
    name: 'Flute of the Tides',
    material: 'stormbone_bloom',
    category: 'Area Damage',
    tags: ['Damage'],
  },
  {
    id: 'free_morph',
    name: 'Free Morph',
    material: 'buddhas_tear_root',
    category: 'Single Target Control',
    tags: ['Combo Technique'],
  },
  {
    id: 'ghost_bind',
    name: 'Ghost Bind',
    material: 'jade_tower_pearl',
    category: 'Area Damage',
    tags: ['Control', 'Qi Breaking'],
  },
  {
    id: 'ghostly_steps',
    name: 'Ghostly Steps',
    material: 'frost_mushroom_mycelium',
    category: 'Support',
    tags: ['Dodge'],
  },
  {
    id: 'golden_body',
    name: 'Golden Body',
    material: 'jade_tower_pearl',
    category: 'Support',
    tags: ['Shield'],
  },
  {
    id: 'guardian_palm',
    name: 'Guardian Palm',
    material: 'buddhas_tear_root',
    category: 'Area Damage',
    tags: ['Damage'],
  },
  {
    id: 'honking_havoc',
    name: 'Honking Havoc',
    material: 'vicious_fruit',
    category: 'Support',
    tags: ['Breath-hold'],
  },
  {
    id: 'leaping_toad',
    name: 'Leaping Toad',
    material: 'beautys_plume',
    category: 'Area Debuff',
    tags: ['Damage', 'Arena'],
  },
  {
    id: 'lions_roar',
    name: "Lion's Roar",
    material: 'buddhas_tear_root',
    category: 'Area Debuff',
    tags: ['Knockback', 'Arena'],
  },
  {
    id: 'meridian_touch',
    name: 'Meridian Touch',
    material: 'beautys_plume',
    category: 'Puzzle',
    tags: ['Acupoint Strike', 'Qi Breaking'],
  },
  {
    id: 'serene_breeze',
    name: 'Serene Breeze',
    material: 'beautys_plume',
    category: 'Support',
    tags: ['Break Control'],
  },
  {
    id: 'soaring_spin',
    name: 'Soaring Spin',
    material: 'jasmine_stamen',
    category: 'Single Target Control',
    tags: ['Shift'],
  },
  {
    id: 'tai_chi',
    name: 'Tai Chi',
    material: 'vicious_fruit',
    category: 'Puzzle',
    tags: ['Shield Breaker'],
  },
  {
    id: 'talon_strike',
    name: 'Talon Strike',
    material: 'vicious_fruit',
    category: 'Single Target Control',
    tags: ['Break Defense', 'Arena'],
  },
  {
    id: 'touch_of_death',
    name: 'Touch of Death',
    material: 'beautys_plume',
    category: 'General',
    tags: ['Assassination'],
  },
  {
    id: 'wolflike_frenzy',
    name: 'Wolflike Frenzy',
    material: 'jade_tower_pearl',
    category: 'Single Target Control',
    tags: ['Combo Technique', 'Undercut'],
  },
  {
    id: 'yaksha_rush',
    name: 'Yaksha Rush',
    material: 'buddhas_tear_root',
    category: 'Single Target Control',
    tags: ['Break Defense', 'Arena'],
  },
]