import styled from "styled-components";
import { GlobalContext } from "../globalContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/animationForDrawer.css";

const DrawerMenu = () => {
  const {
    currentUser,
    setCurrentUser,
    visibleDrawerMenu,
    setVisibleDrawerMenu,
  } = useContext(GlobalContext);
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();

  const closeDrawer = () => {
    if (visibleDrawerMenu === "visible" || "initial") {
      return setVisibleDrawerMenu("notVisible");
    }
  };

  console.log("visibleDrawerMenu", visibleDrawerMenu);
  return (
    <div
      className={
        visibleDrawerMenu === "initial"
          ? "initialState"
          : visibleDrawerMenu === "visible"
          ? "visibleDrawer"
          : visibleDrawerMenu === "notVisible"
          ? "hiddenDrawer"
          : "visible"
      }
    >
      <div className="drawerMenu">
        <NavLink to={"/events/allEvents"}>
          <h5
            onClick={() => {
              closeDrawer();
            }}
          >
            Explore All Events
          </h5>
        </NavLink>
        <NavLink to={"/eventsNearYou"}>
          <h5
            onClick={() => {
              closeDrawer();
            }}
          >
            Events near you
          </h5>
        </NavLink>
        {currentUser ? (
          <NavLink to={`/user/${currentUser._id}`}>
            <h5
              onClick={() => {
                closeDrawer();
              }}
            >
              Your Account Dashboard
            </h5>
          </NavLink>
        ) : (
          <h5 onClick={() => loginWithRedirect()}>Sign In</h5>
        )}
      </div>
      {currentUser ? (
        <NavLink to={"/createYourOwnEvent"}>
          <button
            onClick={() => {
              closeDrawer();
            }}
          >
            Create Your Own Event!
          </button>
        </NavLink>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Create Your Own Event!
        </button>
      )}
    </div>
  );
};
export default DrawerMenu;

// const StyledDrawerDiv = styled.div`
//   a {
//     text-decoration: none;
//     color: inherit;
//   }
//   animation-name: view;
//   animation-duration: 2s;

//   ${(props) =>
//     props.visible
//       ? `

//       @keyframes view{
//         0%{ background-color: #e8e8e8;}
//         100%{background-color: blue;}
//       }
//     `
//       : `

//       `};

//   flex-direction: column;
//   position: absolute;
//   z-index: 3;
//   background-color: #e8e8e8;

//   height: 100vh;
// `;
