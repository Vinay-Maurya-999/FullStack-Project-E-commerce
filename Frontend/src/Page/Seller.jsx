import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
import useApi from "../config/api";
import { useShopContext } from "../Context/ShopContextValue";
import { useAppContext } from "../Context/AuthContextValue";
import { useEffect, useState } from "react";

export default function CreateProduct() {
  const api = useApi();
  const { product, setProduct } = useShopContext();
  const { user, authLoading } = useAppContext();
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    sizes: [{ size: "", stock: "" }],
  });

  const Productfetch = async () => {
    try {
      const res = await api.get("/products");
      setProduct(res.data?.data?.products || []);
    } catch (error) {
      console.log("Product fetch error:", error);
      setProduct([]);
    }
  };

  const handleUpdate = async (id) => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      alert("Please complete title and description before updating.");
      return;
    }

    const cleanedSizes = editForm.sizes
      .filter((size) => size.size && size.size.trim())
      .map((size) => ({
        size: size.size.trim().toUpperCase(),
        stock: Number(size.stock || 0),
      }));

    if (!cleanedSizes.length) {
      alert("Add at least one size before updating the product.");
      return;
    }

    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      price: {
        amount: Number(editForm.priceAmount),
        currency: editForm.priceCurrency,
      },
      sizes: cleanedSizes,
    };

    try {
      await api.put(`/products/${id}`, payload);
      setProduct((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                title: payload.title,
                description: payload.description,
                price: payload.price,
                sizes: payload.sizes,
              }
            : item,
        ),
      );
      setEditingProductId(null);
      setEditForm({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
        sizes: [{ size: "", stock: "" }],
      });
    } catch (error) {
      console.log("Update product error:", error.response?.data || error);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setProduct((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Delete product error:", error.response?.data || error);
    }
  };

  const openEditForm = (item) => {
    setEditingProductId(item._id);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      priceAmount: item.price?.amount ?? "",
      priceCurrency: item.price?.currency || "INR",
      sizes: (item.sizes?.length ? item.sizes : [{ size: "", stock: "" }]).map((size) => ({
        size: size.size || "",
        stock: size.stock ?? "",
      })),
    });
  };

  useEffect(() => {
    Productfetch();
  }, []);

  const userProducts =
    Array.isArray(product) && user
      ? product.filter((val) => String(val.seller) === String(user.id))
      : [];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading seller account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Please sign in to access the seller page.</p>
      </div>
    );
  }

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: {
        amount: "",
        currency: "INR",
      },
      sizes: [
        {
          size: "",
          stock: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price[amount]", data.price.amount);
      formData.append("price[currency]", data.price.currency);

      data.sizes.forEach((item, index) => {
        formData.append(`sizes[${index}][size]`, item.size);
        formData.append(`sizes[${index}][stock]`, item.stock);
      });

      const response = await api.post("/products", formData);
      reset();
      await Productfetch();
      console.log("Product created:", response.data);
    } catch (error) {
      console.log("Create product error:", error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Product</h1>
          <p className="mt-2 text-zinc-400">Add product details, images, price and sizes.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Product Images</label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 p-8 transition hover:border-lime-400">
              <Upload size={30} className="mb-3 text-lime-400" />
              <span className="text-sm text-zinc-300">Select product images</span>
              <span className="mt-1 text-xs text-zinc-500">You can select multiple images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                {...register("images")}
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Product Title</label>
            <input
              type="text"
              placeholder="Something"
              {...register("title")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              rows="5"
              placeholder="Product description..."
              {...register("description")}
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Price</label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="number"
                placeholder="5000"
                {...register("price.amount")}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
              />

              <select
                {...register("price.currency")}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium">Product Sizes</label>
              <button
                type="button"
                onClick={() => append({ size: "", stock: "" })}
                className="flex items-center gap-2 rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-black hover:bg-lime-300"
              >
                <Plus size={16} />
                Add Size
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="XL"
                    {...register(`sizes.${index}.size`)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
                  />

                  <input
                    type="number"
                    placeholder="55"
                    {...register(`sizes.${index}.stock`)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-lime-400"
                  />

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-xl border border-red-500/30 px-3 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-lime-400 px-5 py-3 font-bold text-black transition hover:bg-lime-300"
          >
            Create Product
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-7xl py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Your Products</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userProducts.map((item) => {
            const totalStock =
              item.sizes?.reduce((total, size) => total + Number(size.stock || 0), 0) || 0;

            return (
              <div
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                      No Image
                    </div>
                  )}

                  {item.images?.length > 1 && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {item.images.length} Images
                    </span>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      totalStock > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    }`}
                  >
                    {totalStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="truncate text-lg font-bold text-zinc-900 dark:text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-zinc-400">Price</p>
                      <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">
                        {item.price?.currency === "INR" ? "₹" : "$"}
                        {item.price?.amount}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Total Stock</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        {totalStock} units
                      </p>
                    </div>
                  </div>

                  {item.sizes?.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-medium text-zinc-400">Available Sizes</p>
                      <div className="flex flex-wrap gap-2">
                        {item.sizes.map((size) => (
                          <span
                            key={size._id || `${item._id}-${size.size}`}
                            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {size.size}
                            <span className="ml-1 text-zinc-400">({size.stock})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingProductId === item._id ? (
                    <div className="mt-6 space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                        placeholder="Title"
                      />

                      <textarea
                        rows="3"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                        placeholder="Description"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={editForm.priceAmount}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, priceAmount: e.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                          placeholder="Price"
                        />

                        <select
                          value={editForm.priceCurrency}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, priceCurrency: e.target.value }))
                          }
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        {editForm.sizes.map((size, index) => (
                          <div key={`${item._id}-size-${index}`} className="flex gap-2">
                            <input
                              type="text"
                              value={size.size}
                              onChange={(e) => {
                                const nextSizes = [...editForm.sizes];
                                nextSizes[index].size = e.target.value;
                                setEditForm((prev) => ({ ...prev, sizes: nextSizes }));
                              }}
                              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                              placeholder="Size"
                            />

                            <input
                              type="number"
                              value={size.stock}
                              onChange={(e) => {
                                const nextSizes = [...editForm.sizes];
                                nextSizes[index].stock = e.target.value;
                                setEditForm((prev) => ({ ...prev, sizes: nextSizes }));
                              }}
                              className="w-24 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-lime-400"
                              placeholder="Stock"
                            />

                            {editForm.sizes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextSizes = editForm.sizes.filter((_, i) => i !== index);
                                  setEditForm((prev) => ({ ...prev, sizes: nextSizes }));
                                }}
                                className="rounded-xl border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditForm((prev) => ({
                            ...prev,
                            sizes: [...prev.sizes, { size: "", stock: "" }],
                          }));
                        }}
                        className="flex items-center gap-2 rounded-lg bg-lime-400 px-3 py-2 text-sm font-semibold text-black hover:bg-lime-300"
                      >
                        <Plus size={16} />
                        Add Size
                      </button>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(item._id)}
                          className="rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProductId(null)}
                          className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openEditForm(item)}
                        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-lime-400 hover:bg-lime-50 hover:text-lime-700 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-lime-950/30 dark:hover:text-lime-400"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
