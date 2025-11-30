export default function ProductCard({ name, price, img }) {
  return (
    <div className="product-card w-64 bg-white shadow-md rounded overflow-hidden">
      <img src={img} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-600">${price}</p>
        <button className="mt-2 bg-black text-white px-4 py-2 rounded w-full">Add to Cart</button>
      </div>
    </div>
  );
}