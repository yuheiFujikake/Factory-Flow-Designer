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
type Machine = "採鉱機" | "製錬炉" | "鋳造炉" | "製作機" | "組立機" | "揚水ポンプ" | "原油抽出機" | "製造機";

export type ProductId = Material | Mineral | Ingot | BasicComponents | ElectronicEquipment | IndustrialComponents;
export type DependProduct = Partial<Record<ProductId, number>>;
export type ProductInfo = {
  name: string;
  machine: Machine;
  supply: number;
  depend: DependProduct | null;
};

type ProductList = Record<ProductId, ProductInfo>;
export type RequiredProduct = {
  id: ProductId;
  name: string;
  machine: Machine;
  machineUnit: number;
  supply: number;
  cost: number;
  surplus: number;
  path: string[];
  chidlen: RequiredProduct[];
  depth: number;
  index: number;
};

export const ProductList: ProductList = {
  IronOre: {
    name: "鉄鉱石",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  CopperOre: {
    name: "銅鉱石",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  Limestone: {
    name: "石灰岩",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  Coal: {
    name: "石炭",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  CateriumOre: {
    name: "カテリウム鉱石",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  Quartz: {
    name: "未加工石英",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  Sulfur: {
    name: "硫黄",
    machine: "採鉱機",
    supply: 120,
    depend: null,
  },
  CrudeOil: {
    name: "原油",
    machine: "原油抽出機",
    supply: 120,
    depend: null,
  },
  Water: {
    name: "水",
    machine: "揚水ポンプ",
    supply: 120,
    depend: null,
  },
  Concrete: {
    name: "コンクリート",
    machine: "製作機",
    supply: 15,
    depend: { Limestone: 45 },
  },
  QuartzCrystal: {
    name: "石英結晶",
    machine: "製作機",
    supply: 18,
    depend: { Quartz: 30 },
  },
  Silica: {
    name: "シリカ",
    machine: "採鉱機",
    supply: 50,
    depend: { Quartz: 30 },
  },
  IronIngot: {
    name: "鉄のインゴット",
    machine: "製錬炉",
    supply: 30,
    depend: { IronOre: 30 },
  },
  CopperIngot: {
    name: "銅のインゴット",
    machine: "製錬炉",
    supply: 30,
    depend: { CopperOre: 30 },
  },
  SteelIngot: {
    name: "鋼鉄のインゴット",
    machine: "鋳造炉",
    supply: 45,
    depend: { IronOre: 45, Coal: 45 },
  },
  CateriumIngot: {
    name: "カテリウムのインゴット",
    machine: "製錬炉",
    supply: 15,
    depend: { CateriumOre: 45 },
  },
  IronPlate: {
    name: "鉄板",
    machine: "製作機",
    supply: 20,
    depend: { IronIngot: 30 },
  },
  IronRod: {
    name: "鉄のロッド",
    machine: "製作機",
    supply: 15,
    depend: { IronIngot: 15 },
  },
  Screw: {
    name: "ネジ",
    machine: "製作機",
    supply: 40,
    depend: { IronRod: 10 },
  },
  ReinforcedIronPlate: {
    name: "強化鉄板",
    machine: "組立機",
    supply: 5,
    depend: { IronPlate: 30, Screw: 60 },
  },
  ModularFrame: {
    name: "モジュラー・フレーム",
    machine: "組立機",
    supply: 2,
    depend: { ReinforcedIronPlate: 3, IronRod: 12 },
  },
  CopperSheet: {
    name: "銅板",
    machine: "製作機",
    supply: 10,
    depend: { CopperIngot: 20 },
  },
  SteelBeam: {
    name: "鋼梁",
    machine: "製作機",
    supply: 15,
    depend: { SteelIngot: 60 },
  },
  SteelPipe: {
    name: "鋼管",
    machine: "製作機",
    supply: 20,
    depend: { SteelIngot: 30 },
  },
  EncasedIndustrialBeam: {
    name: "コンクリート被覆型鋼梁",
    machine: "組立機",
    supply: 6,
    depend: { SteelBeam: 18, Concrete: 36 },
  },
  HeavyModularFrame: {
    name: "ヘビー・モジュラー・フレーム",
    machine: "製造機",
    supply: 2,
    depend: { ModularFrame: 10, SteelPipe: 40, EncasedIndustrialBeam: 10, Screw: 240 },
  },
  Wire: {
    name: "ワイヤー",
    machine: "製作機",
    supply: 30,
    depend: { CopperIngot: 15 },
  },
  Cable: {
    name: "ケーブル",
    machine: "製作機",
    supply: 30,
    depend: { Wire: 60 },
  },
  Quickwire: {
    name: "クイックワイヤー",
    machine: "製作機",
    supply: 60,
    depend: { CateriumIngot: 12 },
  },
  AI_Limiter: {
    name: "AIリミッター",
    machine: "組立機",
    supply: 5,
    depend: { CopperSheet: 25, Quickwire: 100 },
  },
  Rotor: {
    name: "ローター",
    machine: "組立機",
    supply: 4,
    depend: { IronRod: 20, Screw: 100 },
  },
  Stator: {
    name: "固定子",
    machine: "組立機",
    supply: 5,
    depend: { SteelPipe: 15, Wire: 40 },
  },
  Motor: {
    name: "モーター",
    machine: "組立機",
    supply: 5,
    depend: { Rotor: 10, Stator: 10 },
  },
};
