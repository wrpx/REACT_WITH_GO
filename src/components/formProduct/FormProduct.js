///FormProduct.js
import React, { useEffect, useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../service/apiService";
import "./FormProduct.css";
import { MessageAlert } from "../loginForm/LoginForm";

const FormProduct = () => {
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const loadData = useCallback(async () => {
    try {
      const products = await apiService.listProducts();
      setData(products);
    } catch (error) {
      console.error("Error fetching data:", error);
      setApiError("Error fetching data");
    }
  }, []);

  const handleInputChange = ({ target: { name, value } }) =>
    setValue(name, value);

  const onSubmit = async (formData) => {
    try {
      const action = editMode
        ? apiService.updateProduct(editItemId, formData)
        : apiService.createProduct(formData);
      await action;
      showMessageWithTimeout("Product saved successfully", true);
      setEditMode(false);
      setEditItemId(null);
      reset();
      loadData();
    } catch (error) {
      showMessageWithTimeout(
        error.message || "An unspecified error occurred.",
        false
      );
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await apiService.deleteProduct(itemId);
      loadData();
    } catch (error) {
      console.error("Error deleting data:", error);
      setApiError("Error deleting data");
    }
  };

  const handleEdit = (itemId) => {
    const editItem = data.find((item) => item.id === itemId);
    ["name", "detail", "price"].forEach((field) =>
      setValue(field, editItem[field])
    );
    setEditMode(true);
    setEditItemId(itemId);
  };

  const showMessageWithTimeout = (message, isSuccess) => {
    if (isSuccess) {
      setSuccessMessage(message);
      setApiError("");
    } else {
      setApiError(message);
      setSuccessMessage("");
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="form-product-container">
      <h2 className="form-title">React-JavaSpring CRUD</h2>
      <div className="container-table">
        <ProductTable
          data={data}
          deleteItem={deleteItem}
          handleEdit={handleEdit}
        />
      </div>
      <ProductForm
        editMode={editMode}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        resetForm={() => {
          setEditMode(false);
          setEditItemId(null);
          reset();
        }}
      />
      {showMessage && (
        <MessageAlert
          message={apiError || successMessage}
          isError={!successMessage}
          show={showMessage}
        />
      )}
    </div>
  );
};

const ProductTable = ({ data, deleteItem, handleEdit }) => (
  <table className="table">
    <thead>
      <tr>
        <th className="table-header">Name</th>
        <th className="table-header">Detail</th>
        <th className="table-header">Price</th>
        <th className="table-header">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td className="table-cell">{item.name}</td>
          <td className="table-cell">{item.detail}</td>
          <td className="table-cell">{item.price}</td>
          <td className="table-cell">
            <div className="button-container">
              <button className="delete" onClick={() => deleteItem(item.id)}>
                Delete
              </button>
              <button className="edit" onClick={() => handleEdit(item.id)}>
                Edit
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ProductForm = ({
  editMode,
  handleInputChange,
  handleSubmit,
  register,
  resetForm,
}) => (
  <div className="form-container w-[75%]">
    {editMode && (
      <button className="cancel-button rounded-[100px]" onClick={resetForm}>
        <FontAwesomeIcon
          icon={faBan}
          className="icon"
          aria-label="Cancel Edit"
        />
      </button>
    )}

    <h2 className="form-title">
      {editMode ? "Edit Product" : "Add New Product"}
    </h2>

    <form onSubmit={handleSubmit} className="form flex flex-col items-center">
      {["name", "detail", "price"].map((field) => (
        <div key={field} className="input-container">
          <label className="label font-bold">
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <input
              type="text"
              name={field}
              {...register(field, { required: "กรุณากรอกข้อมูลให้ครบทุกช่อง" })}
              className="input ml-5"
              onChange={handleInputChange}
            />
          </label>
        </div>
      ))}

      <button type="submit" className="submit-button w-[50%] ">
        {editMode ? "Submit" : "Add Product"}
      </button>
    </form>
  </div>
);

export default FormProduct;
