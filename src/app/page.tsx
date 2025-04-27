"use client";
import { ProductList, RequiredProduct } from "@/database/product";
import { calculateProductionRequirements } from "@/libs/calc";
import * as Record from "@/database/record";
import { useState } from "react";
import { SelectProduct } from "@/components/SelectProduct";

export default function Home() {
  const [requiredProducts, setRequiredProducts] = useState<RequiredProduct>();

  const calc = () => {
    const product = document.getElementById("product") as HTMLSelectElement;
    const quantity = document.getElementById("quantity") as HTMLInputElement;

    if (product.value === "") {
      alert("製品を選択してください");
      return;
    }
    if (product.value === "製品を選択") {
      alert("製品を選択してください");
      return;
    }

    if (quantity.value === "") {
      alert("数量を入力してください");
      return;
    }
    if (isNaN(Number(quantity.value))) {
      alert("数量は数字で入力してください");
      return;
    }
    if (Number(quantity.value) <= 0) {
      alert("数量は1以上の数字で入力してください");
      return;
    }
    if (Number(quantity.value) > 10000) {
      alert("数量は10000以下の数字で入力してください");
      return;
    }
    if (Number(quantity.value) % 1 !== 0) {
      alert("数量は整数で入力してください");
      return;
    }
    console.log(`Selected Product: ${product.value}, Quantity: ${quantity.value}`);
    const requiredProducts = calculateProductionRequirements(product.value, Number(quantity.value));
    setRequiredProducts(requiredProducts);
  };

  const flatRequiredProducts = (requiredProduct: RequiredProduct, requiredProducts: RequiredProduct[] = []): RequiredProduct[] => {
    requiredProducts.push(requiredProduct);
    if (requiredProduct.chidlen.length == 0) {
      return requiredProducts;
    }
    requiredProduct.chidlen.flatMap((child) => flatRequiredProducts(child, requiredProducts));

    return requiredProducts;
  };

  const reset = () => {
    const product = document.getElementById("product") as HTMLSelectElement;
    const quantity = document.getElementById("quantity") as HTMLInputElement;

    product.value = "";
    quantity.value = "";
  };

  // 階層構造を持つ製品のリストを表示するコンポーネント
  const TreeView = ({ productRoot, first = true }: { productRoot: RequiredProduct; first?: boolean }) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id); // ノードが展開されている場合は閉じる
        } else {
          newSet.add(id); // ノードが閉じている場合は展開する
        }
        return newSet;
      });
    };
    let treeVerticalClassName = "pl-8 relative w-fit";
    // treeVerticalClassName += " before:content-[''] before:absolute before:top-0 before:left-4 before:w-[3px] before:h-[calc(100%-44px)] before:bg-red-300";

    let treeHorizonClassName = "relative cursor-pointer flex items-center border shadow-md bg-gray-50 w-fit";
    let rootClassName = "";
    if (first) {
      rootClassName += " construction";
    }
    if (!first) {
      // treeHorizonClassName += "before:content-[''] before:absolute before:top-[44px] before:left-[-16px] before:w-[16px] before:h-[3px] before:bg-blue-300";
      // treeHorizonClassName += " after:content-[''] after:absolute after:top-0 after:left-[-16px] after:w-[3px] after:h-1/2 after:bg-blue-300";
    }

    return (
      <ul className={rootClassName}>
        <li className="">
          <div className="ttttt">
            <div className={treeHorizonClassName} onClick={() => toggleExpand(productRoot.id)}>
              <div className="p-4 h-[88px]">
                <h4 className="font-bold text-gray-800 mb-2">{productRoot.name}</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">設備</span>
                    <p className="text-sm text-gray-600">{productRoot.machine}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-green-500 mr-2">台数</span>
                    <p className="text-sm text-gray-600">{productRoot.machineUnit}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-yellow-500 mr-2">生産量/min</span>
                    <p className="text-sm text-gray-600">{productRoot.supply}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-red-500 mr-2">余剰量/min</span>
                    <p className="text-sm text-gray-600">{productRoot.surplus}</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedNodes.has(productRoot.id) && productRoot.chidlen.length > 0 && (
              <ul className={treeVerticalClassName}>
                {productRoot.chidlen.map((child) => (
                  <li key={child.id}>
                    <TreeView productRoot={child} first={false} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      </ul>
    );
  };

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg">Satisfactoryで生産したい製品に関連する必須材料の計算を行うサイトです。</p>
        <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl w-full">
          <h2 className="text-2xl font-bold mb-4">製品計算機</h2>
          {/* 入力部分 TODO:component化? */}
          <div className="space-y-4 w-full ">
            <div className="flex flex-row items-center w-full mb-2">
              {/*  */}
              <div className="mb-4 max-w-96 w-full mr-8">
                <label htmlFor="product" className="block text-gray-700 font-bold mb-2">
                  製品名
                </label>
                <select
                  id="product"
                  name="wantProduct"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">製品を選択</option>
                  {Object.entries(ProductList)
                    .filter(([_id, info]) => info.depend !== null && info.machine !== "製錬炉")
                    .map(([id, info]) => (
                      <option key={id} value={info.name}>
                        {info.name}{" "}
                      </option>
                    ))}
                </select>
              </div>
              {/*  */}
              <div className="mb-4 max-w-32 w-full">
                <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">
                  数量
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="数量を入力"
                />
              </div>
            </div>

            <div className="flex items-center align-middle space-x-2">
              <button onClick={calc} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                計算
              </button>
              <button type="reset" onClick={reset} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                リセット
              </button>
            </div>
          </div>
          <div>
            <SelectProduct productList={Record.ProductList} ></SelectProduct>
          </div>

          {/* 結果部分 - 必要材料一覧 */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">計算結果</h3>
            <h4 className="text-lg font-bold mb-2">必要材料一覧</h4>
            ※採鉱機の生産量は120/minで計算しています。
            {requiredProducts && <TreeView productRoot={requiredProducts}></TreeView>}
          </div>
        </div>
      </div>
    </main>
  );
}
