import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useApi from "../config/api";
import { useShopContext } from "../Context/ShopContextValue";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product) {
    return null;
  }

  const handleProductClick = () => {
    navigate(`/shop/products/${product._id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="
        bg-white dark:bg-[#111]
        border border-gray-700
        rounded-3xl
        overflow-hidden
        transition duration-300
        hover:-translate-y-2
        hover:border-lime-400
      "
    >
      {/* Product Image */}
      <div className="relative h-60 bg-gray-100 dark:bg-white">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-contain p-8"
        />
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Product Title */}
        <h2 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white">
          {product.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>

        {/* Available Sizes */}
        <div className="flex flex-wrap gap-2 mt-4">
          {product.sizes?.map((item) => (
            <span
              key={item._id}
              className="
                px-3 py-1
                text-xs
                rounded-full
                bg-gray-100
                text-gray-700
                dark:bg-gray-800
                dark:text-gray-200
              "
            >
              {item.size}
            </span>
          ))}
        </div>

        {/* Price + Button */}
        <div className="mt-5 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Price</p>

            <h2 className="text-2xl font-bold text-lime-500 dark:text-lime-400">
              {product.price?.currency} {product.price?.amount}
            </h2>
          </div>

          <button
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-xl
              font-semibold
              bg-lime-400
              text-black
              hover:scale-105
              transition
            "
          >
            <ShoppingCart size={18} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export function ProductList() {
  const api = useApi();
  const { product, setProduct } = useShopContext();
  const Productfetch = async () => {
    try {
      const res = await api.get("/api/products");

      setProduct(res.data.data.products);
    } catch (error) {
      console.log("Product fetch error:", error);
    }
  };

  useEffect(() => {
    Productfetch();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-zinc-950 sm:px-6 lg:px-10">
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        {product?.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>

      {product?.length === 0 && (
        <p className="py-16 text-center text-zinc-500">No products are available right now.</p>
      )}
    </main>
  );
}

export default ProductList;
