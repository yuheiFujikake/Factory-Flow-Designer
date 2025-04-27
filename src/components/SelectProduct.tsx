"use client";

import { ProductCategoryList } from "@/database/record";
import { ProductId, ProductInfo } from "@/database/structure";

export const SelectProduct = ({ productList }: { productList: Record<ProductId, ProductInfo> }) => {

  // カテゴリーごとに製品を表示する
  const SelectCategory = ({ productList }: { productList: Record<ProductId, ProductInfo> }) => {
    const products = Object.entries(productList)
    return (
      <div>
        {Object.entries(ProductCategoryList).map(([_, name]) => (
          <div>
            <h2>{name}</h2>
            {products.length != 0
              && products.map(([_, info]) => <SelectOptions product={info} />)
            }
          </div>
        ))}
      </div>
    )
  }

  const SelectOptions = ({ product }: { product: ProductInfo }) => {
    return <div><p>name: {product.name}</p></div>
  }

  return (
    <section>
      <SelectCategory productList={productList}></SelectCategory>
    </section>
  )
}