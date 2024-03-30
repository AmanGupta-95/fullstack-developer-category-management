/* eslint-disable react/prop-types */
import {
  faArrowDown,
  faCheck,
  faPen,
  faPlus,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

function Node({ data, add, update, remove }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [updatedName, setUpdatedName] = useState(data.name);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const addNewCategory = () => {
    add(newCat, data.parent ? data.id : undefined);
    setAddNew(false);
  };

  const updateName = () => {
    update(data.id, updatedName);
    setIsEditable(false);
  };

  const handleDelete = () => {
    remove(data.id);
  };

  return (
    <div className="pl-3 mt-2">
      <div className="flex">
        {data.children.length ? (
          <button className="mr-2" onClick={toggleOpen}>
            <FontAwesomeIcon
              icon={faArrowDown}
              className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
              size="sm"
            />
          </button>
        ) : null}
        <div className="flex">
          {isEditable ? (
            <input
              className="pl-1"
              type="text"
              onChange={(e) => setUpdatedName(e.target.value)}
              value={updatedName}
            />
          ) : (
            <p className={`text-xl ${data.children.length ? '' : 'pl-4'}`}>
              {data.name}
            </p>
          )}
          {!isEditable ? (
            <FontAwesomeIcon
              icon={faPen}
              className="cursor-pointer scale-75 mx-1"
              onClick={() => setIsEditable(true)}
            />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faCheck}
                className="cursor-pointer scale-90 mx-1"
                onClick={updateName}
              />
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer scale-90 mr-1"
                onClick={() => setIsEditable(false)}
              />
            </>
          )}
          <FontAwesomeIcon
            icon={faTrash}
            className="scale-75 cursor-pointer"
            onClick={handleDelete}
          />
        </div>
      </div>
      {addNew ? (
        <>
          <input
            className="pl-1"
            type="text"
            onChange={(e) => setNewCat(e.target.value)}
            value={newCat}
          />
          <FontAwesomeIcon
            icon={faCheck}
            className="cursor-pointer scale-90 mx-1"
            onClick={addNewCategory}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer scale-90 mr-1"
            onClick={() => setAddNew(false)}
          />
        </>
      ) : (
        <div className="flex justify-center mt-2">
          <FontAwesomeIcon
            icon={faPlus}
            className="cursor-pointer"
            onClick={() => setAddNew(true)}
          />
        </div>
      )}
      {isOpen && <TreeView data={data.children} />}
    </div>
  );
}

function TreeView({ data, add, update, remove }) {
  return (
    <div className="flex items-start flex-col">
      {data.map((category) => (
        <Node
          key={category.id}
          data={category}
          add={add}
          update={update}
          remove={remove}
        />
      ))}
    </div>
  );
}

export default TreeView;
