import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost/api/menu";

const MenuAdmin = () => {
  const [menus, setMenus] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    preference: "veg",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_URL}/read.php`);
      setMenus(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setMenus([]);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("preference", formData.preference);
    if (formData.image) data.append("image", formData.image);

    try {
      if (isEditing) {
        data.append("id", formData.id);
        await axios.post(`${API_URL}/update.php`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu updated successfully");
      } else {
        await axios.post(`${API_URL}/create.php`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu added successfully");
      }

      setFormData({
        id: "",
        name: "",
        description: "",
        price: "",
        preference: "veg",
        image: null,
      });
      setPreview(null);
      setIsEditing(false);
      fetchMenus();
    } catch (error) {
      console.error("Error submitting menu:", error);
    }
  };

  const handleEdit = (menu) => {
    setFormData({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      preference: menu.preference,
      image: null,
    });
    setPreview(menu.image ? `http://localhost/api/uploads/${menu.image}` : null);
    setIsEditing(true);

    // Scroll to form and show full form
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      await axios.get(`${API_URL}/delete.php?id=${id}`);
      alert("Menu deleted successfully");
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Manage Menu
      </h1>

      {/* Form */}
      <div
        ref={formRef}
        className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto mb-8 max-h-screen overflow-y-auto"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Food Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            rows={3}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <select
            name="preference"
            value={formData.preference}
            onChange={handleChange}
            className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="veg">Veg</option>
            <option value="nonveg">Non-Veg</option>
          </select>

          <div className="w-40 h-40 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-600 relative">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            {!preview && <span className="text-gray-500 text-center">Click to upload</span>}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover rounded-md"
              />
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold transition ${
              isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isEditing ? "Update Menu" : "Add Menu"}
          </button>
        </form>
      </div>

      {/* Menu Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Preference</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No menu items found.
                </td>
              </tr>
            ) : (
              menus.map((menu, index) => (
                <tr
                  key={menu.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{menu.name}</td>
                  <td className="py-2 px-4">Rs {menu.price}</td>
                  <td className="py-2 px-4 capitalize">{menu.preference}</td>
                  <td className="py-2 px-4">
                    {menu.image && (
                      <img
                        src={`http://localhost/api/uploads/${menu.image}`}
                        alt={menu.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(menu)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuAdmin;
