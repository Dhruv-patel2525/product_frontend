"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useProducts, useCreateProduct } from "@/lib/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ProductCard } from "../ProductCard";
import { CreateProductRequest } from "@/lib/types/auth";
import { useState } from "react";

interface OrgProductsProps {
  orgId: string;
}

export function OrgProducts({ orgId }: OrgProductsProps) {
  const { data: productsResponse, isLoading } = useProducts(orgId);
  const createProductMutation = useCreateProduct();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const products = productsResponse?.data || [];

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    try {
      await createProductMutation.mutateAsync({
        orgId,
        data: {
          name: productName,
          description: productDescription,
        } as CreateProductRequest,
      });

      setProductName("");
      setProductDescription("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your products and collect feedback</p>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Create Product Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Product</h2>
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your product"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setProductName("");
                  setProductDescription("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first product to start collecting feedback from your users.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Product
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              orgId={orgId}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                is_active: product.is_active,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}