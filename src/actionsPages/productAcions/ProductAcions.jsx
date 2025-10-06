import styles from "./ProductAcions.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productStore } from "../../stores/productStore";
import { categoryStore } from "../../stores/categoryStore";
import Loading from "../../components/loadingPage/Loading";
import { CiTrash } from "react-icons/ci";

export default function ProductAcions() {
  const BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
  const navigate = useNavigate();
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");

  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [colors, setColors] = useState([]);

  const [category, setCategory] = useState(""); // ID فقط

  // Images
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImages, setSubImages] = useState([null, null]);
  const [subImagesPreviews, setSubImagesPreviews] = useState([null, null]);

  const { id } = useParams();
  const { getProductById, createProduct, updateProduct, loading } =
    productStore();
  const { getCategories, categories } = categoryStore();

  useEffect(() => {
    getCategories(0, 1000, "en", false);
  }, []);

  useEffect(() => {
    if (id !== "0") {
      (async () => {
        try {
          const data = await getProductById(id);
          if (data) {
            setNameEn(data.name?.en || data.name || "");
            setNameAr(data.name?.ar || data.nameAr || "");
            setDescEn(data.description?.en || data.description || "");
            setDescAr(data.description?.ar || data.descriptionAr || "");
            setPrice(data.price || 0);
            setSizes(data.sizes || []);
     
      
            setCategory(data.category?._id || "");
            setMainImagePreview(
              data.mainImage ? `${BASE_URL}${data.mainImage}` : null
            );
            setSubImagesPreviews(
              data.subImages?.map((img) =>
                img ? `${BASE_URL}${img}` : null
              ) || [null, null]
            );
            // Initialize subImages with null values for file inputs
            setSubImages(
              data.subImages
                ? Array(data.subImages.length).fill(null)
                : [null, null]
            );
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      })();
    }
  }, [id, getProductById]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...subImages];
      const updatedPreviews = [...subImagesPreviews];
      updated[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);
      setSubImages(updated);
      setSubImagesPreviews(updatedPreviews);

      // Check if we need to add a new empty slot
      if (updated.every((img) => img !== null)) {
        setSubImages([...updated, null]);
        setSubImagesPreviews([...updatedPreviews, null]);
      }
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() !== "") {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(index, 1);
    setSizes(updatedSizes);
  };





  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", nameEn);
    formData.append("nameAr", nameAr);
    formData.append("description", descEn);
    formData.append("descriptionAr", descAr);
    formData.append("category", category);
    formData.append("price", Number(price));
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("colors", JSON.stringify(colors));


    if (mainImage) formData.append("mainImage", mainImage);

    // Append sub images that have been selected
    subImages.forEach((img) => {
      if (img) {
        formData.append("subImages", img);
      }
    });

    try {
      if (id === "0") {
        const result = await createProduct(formData);
        if (result) {
          navigate("/products");
        }
      } else {
        await updateProduct(id, formData);
        navigate("/products");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className={styles.productAcions}>
      <h3 className="titleText">
        {id === "0" ? "Add Product" : "Edit Product"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className={`${styles.fieldsContainer}`}>
          {/* Name */}
          <div className={`${styles.inputContainer}`}>
            <label>Product Name (EN)</label>
            <input
              type="text"
              className="input"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
            />
          </div>
          <div className={`${styles.inputContainer}`}>
            <label>Product Name (AR)</label>
            <input
              type="text"
              className="input"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className={`${styles.inputContainer}`}>
            <label>Description (EN)</label>
            <textarea
              className="input"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
            />
          </div>
          <div className={`${styles.inputContainer}`}>
            <label>Description (AR)</label>
            <textarea
              className="input"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className={`${styles.inputContainer}`}>
            <label>Price</label>
            <input
              type="number"
              className="input"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              required
            />
          </div>

    

    

          {/* Category */}
          <div className={`${styles.inputContainer}`}>
            <label>Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name?.en || cat.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sizes */}
          <div className={`${styles.inputContainer}`}>
            <label>Sizes</label>
           
              {sizes.map((size, index) => (
                <div key={index} className={styles.tag}>
                  <span>{size}</span>
                  <button
                    type="button"
                    className={styles.removeTag}
                    onClick={() => handleRemoveSize(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                className="input"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add a size"
              />
              <button
                type="button"
                className="secBtn"
                onClick={handleAddSize}
                style={{ marginLeft: "10px" }}
              >
                Add
              </button>
            </div>
          </div>

        </div>

        {/* Images */}
        <div className={`${styles.ImagesContainer} center`}>
          <div className={`center ${styles.mainImageContainer}`}>
            <label htmlFor="mainImage" className="center">
              {mainImagePreview ? (
                <img
                  src={mainImagePreview}
                  alt="Main"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <h5>Upload Main Image</h5>
                  <span className="secBtn">Upload Image</span>
                </>
              )}
            </label>
            <input
              type="file"
              id="mainImage"
              onChange={handleMainImageChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>

          <div className={`center ${styles.subImagesContainer}`}>
            {subImagesPreviews.map((preview, index) => (
              <div key={index} className={`${styles.subImageContainer} center`}>
                {preview && (
                  <CiTrash
                    className={`center deleteBtn ${styles.deleteBtn}`}
                    onClick={() => {
                      // Clear the preview and the file input
                      const updatedPreviews = [...subImagesPreviews];
                      const updatedFiles = [...subImages];
                      updatedPreviews[index] = null;
                      updatedFiles[index] = null;
                      setSubImagesPreviews(updatedPreviews);
                      setSubImages(updatedFiles);
                    }}
                  />
                )}
                <label htmlFor={`subImage-${index}`} className="center">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Sub ${index + 1}`}
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  ) : (
                    <>
                      <h5>Upload Sub Image {index + 1}</h5>
                      <span className="secBtn">Upload Image</span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id={`subImage-${index}`}
                  onChange={(e) => handleSubImageChange(e, index)}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            ))}
          </div>
        </div>

        <button className={`center btn ${styles.btn}`} type="submit">
          {id === "0" ? "Add Product" : "Edit Product"}
        </button>
      </form>
    </section>
  );
}
