/* eslint-disable react/prop-types */
import {
  faArrowDown,
  faCheck,
  faPen,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

function Node({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [catName, setCatName] = useState(data.name);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const updateName = () => {
    setIsEditable(false);
  };

  const handleDelete = () => {};

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
              onChange={(e) => setCatName(e.target.value)}
              value={catName}
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
      {isOpen && <TreeView data={data.children} />}
    </div>
  );
}

function TreeView({ data }) {
  return (
    <div className="flex items-start flex-col">
      {data.map((category) => (
        <Node key={category.id} data={category} />
      ))}
    </div>
  );
}

export default TreeView;
