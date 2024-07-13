import { Dropdown, Button } from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";

const onLogout = () => {
  localStorage.removeItem("userCreadentials");
};
const items = [
  {
    key: "1",
    label: (
      <a href="/login" onClick={onLogout}>
        Log out
      </a>
    )
  }
];
function Header() {
  const currentUser = JSON.parse(localStorage.getItem("userCreadentials")).user
    .userData;
  return (
    <div className="header">
      <div className="header--container">
        <h1>LOGO</h1>
        <div className="btns">
          <BellOutlined />
          <Dropdown
            menu={{
              items
            }}
            placement="bottom"
          >
            <Button>
              <UserOutlined />
              <h3> {currentUser.name} </h3>
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Header;
