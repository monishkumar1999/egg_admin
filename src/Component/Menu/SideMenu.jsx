import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { HiArrowLongDown } from "react-icons/hi2";

import { MdClose, MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import server from "../../Constant";
import { IoIosAddCircleOutline } from "react-icons/io";

const SideMenu = () => {
  const [isopen, setOpen] = useState(true);
  const [submenuOpen, setsubmenuOpen] = useState(true);
  const [Menus, setmenu] = useState([]);
  const menuRef = useRef(null);
  const [pagereload, setPageLoad] = useState(true);
  const [addMainMenu, setMainMenu] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const calluseEffect = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("api/showMenu");
          setmenu(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }, [pagereload]); // Empty array ensures this runs only once, on component mount
  };
  calluseEffect();

  const toggleSubmenu = (index) => {
    setsubmenuOpen((prevState) => ({
      [index]: !prevState[index],
    }));
  };

  const editClicked = (index, oldvalue) => {
    setInputValue(oldvalue);
    setIsEditClicked((preState) => ({
      [index]: !preState[index],
    }));
  };

  const cancleEdit = () => {
    setIsEditClicked(false);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const addMainMenuFun = async (e) => {
    e.preventDefault();
    console.log();

    const menuName = menuRef.current.value;
    if (menuName.trim() === "") {
      return;
    }
    await axios.post("/api/insertMainMenu", {
      title: menuName,
    });

    setPageLoad(!pagereload);
    menuRef.current.value = "";
  };

  const updateMainMenu = async (index, oldMainMenuName) => {
    if (oldMainMenuName === inputValue || inputValue=='') {
      alert("same cannot update");
      return
    }

    const data = await axios.post("/api/update/MainMenu", {
      mainMenuName: oldMainMenuName,
      updateName: inputValue,
    });

    if (data.data.status) {
      setIsEditClicked(true);
      setPageLoad(!pagereload);
    }
    else{
      alert(data.data)
    }
  };
  if (!Menus) {
    return <div>Error loading menu data</div>; // Display error state if menus is null
  }

  return (
    <div
      className={` p-4 w-60 h-screen relative ${
        isopen ? "w-72" : "w-32"
      } ease-in-out duration-500 bg-transparent `}
    >
      <div
        className={`absolute right-0 cursor-pointer hover:bg-gray-400 rounded-lg `}
        onClick={() => setOpen((prev) => !prev)}
      >
        {isopen ? <FaAngleLeft /> : <FaAngleRight />}
      </div>

      <div className="pt-2">
        <ul>
          {Menus.map((value, index) => {
            return (
              <>
                <li className="bg-transparent rounded relative hover:bg-slate-50 font-bold text-gray-500 h-11 pl-8 pt-2">
                  {isEditClicked[index] ? (
                    <>
                      <div className="flex">
                        <input
                          value={inputValue}
                          type="text"
                          onChange={handleChange}
                        />
                        <button
                          className="bg-green-400 text-white font-bold shadow-lg rounded-lg p-1"
                          onClick={() => {
                            updateMainMenu(index, value.title);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-400 text-white font-bold shadow-lg rounded-lg p-1"
                          onClick={() => {
                            cancleEdit();
                          }}
                        >
                          Cancle
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>
                        <span className="absolute right-20">
                          <FaEdit
                            className="cursor-pointer"
                            onClick={() => {
                              editClicked(index, value.title);
                            }}
                          />
                        </span>
                        <span className="absolute right-5">
                          <MdDelete
                            className="cursor-pointer"
                            onClick={async () => {
                              try {
                                const { data } = await axios.post(
                                  `api/delete/MainMenu`,
                                  {
                                    Title: value.title,
                                  }
                                );

                                setPageLoad(!pagereload);
                              } catch (error) {
                                console.error("Error:", error); // Handle errors here
                              }
                            }}
                          />
                        </span>
                      </span>
                      {value.title}
                    </>
                  )}

                  {value.submenu && (
                    <HiArrowLongDown
                      className="absolute right-0 -translate-y-5"
                      onClick={() => {
                        toggleSubmenu(index);
                      }}
                    />
                  )}
                </li>

                {value.submenu && submenuOpen[index] && (
                  <ul>
                    {value.submenuItems.map((subMenus, index) => {
                      return (
                        <li
                          key={index}
                          className="cursor-pointer hover:bg-gray-100 pl-10 py-3 rounded-lg font-bold text-gray-500"
                        >
                          {subMenus.title}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            );
          })}
        </ul>
      </div>
      {addMainMenu && (
        <div className="pl-7">
          <form action="" onSubmit={addMainMenuFun}>
            <input
              type="text"
              placeholder="Enter text"
              ref={menuRef}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-8"
            />
            <div className="flex justify-around ease-in-out duration-1000">
              <button
                className="bg-blue-500 rounded-md p-2 m-2 shadow-lg text-white font-bold hover:bg-blue-600 transition-colors"
                type="submit"
              >
                Submit
              </button>
              <button
                className="bg-red-500 rounded-md p-2 m-2 shadow-lg text-white font-bold hover:bg-red-600 transition-colors"
                type="reset"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pl-32 pt-3">
        {!addMainMenu && (
          <IoIosAddCircleOutline
            className="text-center cursor-pointer"
            onClick={() => {
              setMainMenu(!addMainMenu);
            }}
          />
        )}

        {addMainMenu && (
          <MdClose
            className="text-center cursor-pointer"
            onClick={() => {
              setMainMenu(!addMainMenu);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SideMenu;
