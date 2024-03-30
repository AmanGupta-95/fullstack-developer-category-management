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

  const getAllCategories = () => {
    setIsLoading(true);
    axios.get(apiUrl).then((res) => {
      setCategories(res.data.data);
      setIsLoading(false);
    });
  };

  const addNewCategory = (name, parentId) => {
    setIsLoading(true);
    axios.post(apiUrl, { name, parentId }).then(() => {
      getAllCategories();
    });
  };

  const updateCategory = (id, name) => {
    setIsLoading(true);
    axios.patch(`${apiUrl}/${id}`, { name }).then(() => {
      getAllCategories();
    });
  };

  const deleteCategory = (id) => {
    setIsLoading(true);
    axios.delete(`${apiUrl}/${id}`).then(() => {
      getAllCategories();
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
          add={addNewCategory}
          update={updateCategory}
          remove={deleteCategory}
        />
      )}
    </div>
  );
}

export default App;
