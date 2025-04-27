/********************************************************************************************************/

import { ProductId, ProductInfo, ProductList, RequiredProduct } from "@/database/product";

const findProductById = (id: ProductId): ProductInfo => {
  const product = ProductList[id];
  if (!product) throw new Error(`[ERROR]: function findProductById(${id}) is not find.`);
  return product;
};

const findProductIdByName = (name: string): ProductId => {
  const product = Object.entries(ProductList).find(([_, product]) => product.name == name);
  if (!product) throw new Error(`[ERROR]: function findProductIdByName(${name}) is not find.`);
  return product[0] as ProductId;
};

/**
 * @param product - 製品情報
 * @param needVolume - 必要な生産量
 * @param depth - 再帰の深さ
 * @param dependArray - 依存関係の配列
 * @returns - 必要な製品のリスト
 * @description - 製品の依存関係を再帰的に取得し、必要な製品のリストを生成する
 */
const generateRequiredProductList = (product: ProductInfo, needVolume: number, depth = 0, index = 0, parentProduct?: string[]): RequiredProduct => {
  const machineUnit = Math.ceil(needVolume / product.supply);
  const requiredProduct: RequiredProduct = {
    id: findProductIdByName(product.name),
    name: product.name,
    machine: product.machine,
    machineUnit: machineUnit,
    supply: product.supply * machineUnit,
    cost: needVolume,
    surplus: product.supply * machineUnit - needVolume,
    depth: depth,
    index: index,
    path: parentProduct ? parentProduct : ["root"],
    chidlen: [],
  };

  product.depend &&
    Object.entries(product.depend).forEach(([id, volume], index) => {
      const dependProduct = findProductById(id as ProductId);
      const dependVolume = Math.ceil((needVolume / product.supply) * volume);
      const dependRequiredProduct = generateRequiredProductList(dependProduct, dependVolume, depth + 1, index, [...requiredProduct.path, id]);
      requiredProduct.chidlen?.push(dependRequiredProduct);
    });

  return requiredProduct;
};

/**
 * @param products - 製品のリスト
 * @returns - 重複を排除した製品のリスト
 * @description - 製品のリストから重複を排除し、同じ製品の情報を統合する
 */
const mergeRequiredProducts = (products: RequiredProduct[]): RequiredProduct[] =>
  [...new Set(products.map((p) => p.id))].map((id) =>
    products
      .filter((p) => p.id == id)
      .reduce((acc, product) => ({
        id: product.id,
        name: product.name,
        machine: product.machine,
        machineUnit: acc.machineUnit + product.machineUnit,
        supply: acc.supply + product.supply,
        cost: acc.cost + product.cost,
        surplus: acc.surplus + product.surplus,
        chidlen: acc.chidlen.concat(product.chidlen),
        depth: product.depth,
        index: product.index,
        path: product.path,
      }))
  );

/**
 * @param requiredProducts - 製品のリスト
 * @returns - 再計算された製品のリスト
 * @description - 製品のリストから必要な設備数を計算し、供給量と余剰量を再計算する
 * @note - 製品の供給量は、基本供給量を基準に計算される
 * @note - 余剰量は、供給量から必要な生産量を引いた値
 */
const recalculateMachineRequirements = (requiredProducts: RequiredProduct[]) => {
  return requiredProducts.map((product) => {
    const basicSupply = findProductById(product.id).supply;
    const machineUnit = Math.ceil(product.cost / basicSupply);
    const supply = machineUnit * basicSupply;
    const surplus = supply - product.cost;
    return { ...product, machineUnit, supply, surplus };
  });
};

/**
 * @description - 製品の生産に必要な製品を計算する
 * @param needProductId - 必要な製品のID
 * @param needVolume - 必要な生産量
 * @returns - 必要な製品のリスト
 * @note - 製品のIDは、ProductListに定義されている製品のIDを使用する
 * @note - 必要な生産量は、製品の供給量を基準に計算される
 * @note - 製品の供給量は、基本供給量を基準に計算される
 * @note - 余剰量は、供給量から必要な生産量を引いた値
 */
export const calculateProductionRequirements = (needProductName: string, needVolume: number): RequiredProduct => {
  const needProduct = findProductById(findProductIdByName(needProductName));
  return generateRequiredProductList(needProduct, needVolume);
  // const requiredProducts = generateRequiredProductList(needProduct, needVolume);
  // const consolidatedProducts = mergeRequiredProducts(requiredProducts);
  // return recalculateMachineRequirements(consolidatedProducts);
};
