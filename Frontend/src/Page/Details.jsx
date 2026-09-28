import { useEffect, useState } from "react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useApi from "../config/api";

export default function ProductDetail() {
  const api = useApi();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);

  const productFetch = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/api/products/${id}`);

      console.log(res);

      setProduct(res.data.product);
    } catch (error) {
      console.log("Product detail error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productFetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
        <p className="mb-5 text-zinc-400">Product not found</p>

        <button
          onClick={() => navigate("/shop")}
          className="rounded-xl bg-lime-400 px-5 py-3 font-semibold text-black"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 dark:bg-zinc-950 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/shop")}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-lime-500 dark:text-zinc-400"
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>

        {/* Product */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* LEFT - Images */}
          <div>
            {/* Main Image */}
            <div className="flex h-[500px] items-center justify-center overflow-hidden rounded-3xl bg-gray-100 dark:bg-white">
              <img
                src={product.images?.[selectedImage]}
                alt={product.title}
                className="h-full w-full object-contain p-10"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images?.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 overflow-hidden rounded-xl border-2 bg-gray-100 dark:bg-white ${
                    selectedImage === index ? "border-lime-400" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - Details */}
          <div className="flex flex-col justify-center">
            {/* Title */}
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              {product.title}
            </h1>

            {/* Description */}
            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-400">{product.description}</p>

            {/* Price */}
            <div className="mt-7">
              <p className="text-sm text-zinc-500">Price</p>

              <h2 className="mt-1 text-4xl font-bold text-lime-500">
                {product.price?.currency} {product.price?.amount}
              </h2>
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-white">Select Size</h3>

                {selectedSize && (
                  <span className="text-sm text-zinc-500">Selected: {selectedSize.size}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((item) => {
                  const isSelected = selectedSize?._id === item._id;

                  const outOfStock = item.stock <= 0;

                  return (
                    <button
                      key={item._id}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(item)}
                      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                        isSelected
                          ? "border-lime-400 bg-lime-400 text-black"
                          : "border-zinc-300 text-zinc-800 hover:border-lime-400 dark:border-zinc-700 dark:text-white"
                      } ${outOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock */}
            {selectedSize && (
              <p className="mt-4 text-sm text-zinc-500">{selectedSize.stock} items available</p>
            )}

            {/* Add to Cart */}
            <button
              disabled={!selectedSize}
              className="
                mt-8 flex w-full
                items-center justify-center
                gap-3 rounded-2xl
                bg-lime-400
                px-6 py-4
                font-bold text-black
                transition
                hover:bg-lime-300
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ShoppingCart size={20} />
              {selectedSize ? "Add to Cart" : "Select a Size"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
