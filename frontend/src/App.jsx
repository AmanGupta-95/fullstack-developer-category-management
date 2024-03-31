/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import TreeView from './components/TreeView';
import Loader from './components/Loader';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const apiUrl = `${baseUrl}/api/v1/category`;

  useEffect(() => {
    getAllCategories();
  }, []);

  // fetching all the categories in tree structure
  const getAllCategories = () => {
    setIsLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        setCategories(res.data.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // adding new category
  const addNewCategory = (name, parentId) => {
    setIsLoading(true);
    axios
      .post(apiUrl, { name, parentId })
      .then(() => {
        getAllCategories();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // updating the name of the category
  const updateCategory = (id, name) => {
    setIsLoading(true);
    axios
      .patch(`${apiUrl}/${id}`, { name })
      .then(() => {
        getAllCategories();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // deleting category
  const deleteCategory = (id) => {
    setIsLoading(true);
    axios
      .delete(`${apiUrl}/${id}`)
      .then(() => {
        getAllCategories();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className={`flex justify-center items-center ${
        isLoading ? 'h-[100vh]' : 'mt-4'
      }`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <TreeView
          data={categories}
          isMain={true}
          add={addNewCategory}
          update={updateCategory}
          remove={deleteCategory}
        />
      )}
    </div>
  );
}

export default App;
