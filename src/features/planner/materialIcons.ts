import type { MaterialId } from './plannerTypes'

import beautysPlumeIcon from '../../assets/icons/materials/beautys-plume.png'
import viciousFruitIcon from '../../assets/icons/materials/vicious-fruit.png'
import buddhasTearRootIcon from '../../assets/icons/materials/buddhas-tear-root.png'
import jadeTowerPearlIcon from '../../assets/icons/materials/jade-tower-pearl.png'
import jasmineStamenIcon from '../../assets/icons/materials/jasmine-stamen.png'
import frostMushroomMyceliumIcon from '../../assets/icons/materials/frost-mushroom-mycelium.png'
import stormboneBloomIcon from '../../assets/icons/materials/stormbone-bloom.png'

export const materialIcons: Record<MaterialId, string> = {
  beautys_plume: beautysPlumeIcon,
  vicious_fruit: viciousFruitIcon,
  buddhas_tear_root: buddhasTearRootIcon,
  jade_tower_pearl: jadeTowerPearlIcon,
  jasmine_stamen: jasmineStamenIcon,
  frost_mushroom_mycelium: frostMushroomMyceliumIcon,
  stormbone_bloom: stormboneBloomIcon,
}