import React, { useEffect, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, FieldErrors, UseFormRegister } from 'react-hook-form';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../service/apiService';
import './FormProduct.css';
import { MessageAlert } from '../loginForm/LoginForm';
import { Product } from '../../service/types';

interface FormData {
  name: string;
  detail: string;
  price: string;
}

interface ApiProductData {
  name: string;
  detail: string;
  price: number;
}

interface ProductTableProps {
  data: Product[];
  deleteItem: (id: number) => Promise<void>;
  handleEdit: (id: number) => void;
}

interface ProductFormProps {
  editMode: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  resetForm: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ data, deleteItem, handleEdit }) => (
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

const ProductForm: React.FC<ProductFormProps> = ({
  editMode,
  handleInputChange,
  handleSubmit,
  register,
  errors,
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
              {...register(field as keyof FormData, { required: "กรุณากรอกข้อมูลให้ครบทุกช่อง" })}
              className="input ml-5"
              onChange={handleInputChange}
            />
          </label>
          {errors[field as keyof FormData] && <span>{errors[field as keyof FormData]?.message}</span>}
        </div>
      ))}

      <button type="submit" className="submit-button w-[50%] ">
        {editMode ? "Submit" : "Add Product"}
      </button>
    </form>
  </div>
);

const FormProduct: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const loadData = useCallback(async () => {
    try {
      const response = await apiService.listProducts();
      if (response.success && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setApiError('Error fetching data: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiError('Error fetching data');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name as keyof FormData, value);
  };

  const onSubmit = async (formData: FormData) => {
    try {
      const apiData: ApiProductData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const action = editMode
        ? apiService.updateProduct(editItemId!, apiData)
        : apiService.createProduct(apiData);
      const response = await action;
      if (response.success) {
        showMessageWithTimeout('Product saved successfully', true);
        setEditMode(false);
        setEditItemId(null);
        reset();
        loadData();
      } else {
        showMessageWithTimeout(response.message || 'An error occurred', false);
      }
    } catch (error) {
      showMessageWithTimeout(
        error instanceof Error ? error.message : 'An unspecified error occurred.',
        false
      );
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      const response = await apiService.deleteProduct(itemId);
      if (response.success) {
        loadData();
      } else {
        setApiError('Error deleting data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setApiError('Error deleting data');
    }
  };

  const handleEdit = (itemId: number) => {
    const editItem = data.find((item) => item.id === itemId);
    if (editItem) {
      ['name', 'detail', 'price'].forEach((field) =>
        setValue(field as keyof FormData, String(editItem[field as keyof Product]))
      );
      setEditMode(true);
      setEditItemId(itemId);
    }
  };

  const showMessageWithTimeout = (message: string, isSuccess: boolean) => {
    if (isSuccess) {
      setSuccessMessage(message);
      setApiError(null);
    } else {
      setApiError(message);
      setSuccessMessage('');
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 5000);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="form-product-container">
      <h2 className="form-title">React-Go CRUD</h2>
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
          isError={!!apiError}
          show={showMessage}
        />
      )}
    </div>
  );
};

export default FormProduct;