
// 機械関連のテーブル定義
export type MachineId = "mining" | "smelting" | "casting" | "production" | "assembly" | "manufacturing";
export type MachineInfo = {
    id: MachineId;
    name: string;
    image: string;
    sortNo: number;
}

// 製品関連のテーブル定義
type Material = "IronOre" | "CopperOre" | "Limestone" | "Coal" | "CateriumOre" | "Quartz" | "Sulfur" | "CrudeOil" | "Water";
type Mineral = "Concrete" | "QuartzCrystal" | "Silica";
type Ingot = "IronIngot" | "CopperIngot" | "SteelIngot" | "CateriumIngot";
type BasicComponents =
  | "IronPlate"
  | "IronRod"
  | "Screw"
  | "ReinforcedIronPlate"
  | "ModularFrame"
  | "CopperSheet"
  | "SteelBeam"
  | "SteelPipe"
  | "EncasedIndustrialBeam"
  | "HeavyModularFrame";
type ElectronicEquipment = "Wire" | "Cable" | "Quickwire" | "AI_Limiter";
type IndustrialComponents = "Rotor" | "Stator" | "Motor";

export type ProductCategory = "Material" | "Mineral" | "Ingot" | "BasicComponents" | "ElectronicEquipment" | "IndustrialComponents"

export type ProductId = Material | Mineral | Ingot | BasicComponents | ElectronicEquipment | IndustrialComponents;
type DependencyProduct = {
  id: ProductId;
  cost: number;
}

export type ProductInfo = {
  id: ProductId;
  machineId: MachineId;
  category: ProductCategory;
  name: string;
  image: string;
  supply: number;
  sortNo:number;
  dependency: DependencyProduct[];
};


// 依存関係のType
export type RequiredProduct = {
  id: ProductId;
  name: string;
  image: string;
  machineName: string;
  machineCount: number;
  machineImage: string;
  totalSupply: number;
  totalCost: number;
  totalSurplus: number;
  chidlen: RequiredProduct[];
};